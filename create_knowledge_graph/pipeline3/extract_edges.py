#!/usr/bin/env python3
"""
Edge extraction v2 — section-windowed.

Each window = all concepts in one section. Visible context = all concepts in
earlier sections (id + title + kind + section). This is more pedagogically
grounded than v1's 30-concept windows — Gemini thinks "prerequisites for §1.3
concepts among what's been taught in §1.1 and §1.2."

Output: edges_prereq.jsonl + edges_overlay.jsonl.

Usage:
    python extract_edges.py \
        --concepts data2/concepts.jsonl \
        --out-prereq  data2/edges_prereq.jsonl \
        --out-overlay data2/edges_overlay.jsonl \
        [--workers 8]
"""
from __future__ import annotations

import argparse
import json
import sys
import threading
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT, OPENAI_DEFAULT


SYSTEM_PROMPT = """You extract pedagogical relationships between textbook concepts.

You receive:
  - FOCUS: concepts from a single section. Each has id, kind, title, one_liner, summary, section, source span.
  - VISIBLE: all concepts from EARLIER sections (id + title + kind + section only).

Your job: propose edges for the FOCUS concepts.

Edge kinds:

  `requires` — A requires B: "understanding A requires understanding B first."
    - `from` must be in FOCUS; `to` must be in VISIBLE or in FOCUS earlier in book order.
    - Emit only when A USES or DEPENDS ON B directly. Not for every ancestor.
    - A theorem's statement requires its defined terms. A technique requires the definitions + theorems it applies.
    - Prefer tight prerequisites over transitive closures.

  `special_case_of` — A is a narrower case of more general B.
  `generalizes`     — reverse of special_case_of.
  `formalizes`      — A rigorously defines what B informally describes.
  `illustrates`     — A concretely demonstrates B.
  `used_to_prove`   — A is a lemma/tool used to prove B.
  `see_also`        — A and B are topically related; cross-reference helpful.
  `contrast_with`   — A and B are adjacent but distinct; comparing aids understanding.
  `teaches_after`   — pedagogical ordering only (rare; use `requires` when there's a true dependency).

Coverage goals:
  - Do not treat the graph as prerequisites only. The viewer shows all edge kinds, so capture
    useful non-prerequisite structure too.
  - Try to give every FOCUS concept at least one justified edge when the passage supports it.
    If a concept has no strict prerequisite, look for a `see_also`, `special_case_of`,
    `generalizes`, `contrast_with`, `formalizes`, or `illustrates` edge.
  - When a passage lists members of a family/category (e.g. cues, losses, encodings, models),
    connect each member to the category concept when present (`special_case_of`) and connect
    sibling members with selective `see_also` edges when cross-reference would help.
  - When a definition is introduced using nearby terms in the same passage, link it to those
    terms. Examples: a loss using targets/probabilities, a model using encodings/tokens, a cue
    used for depth inference.
  - Use `contrast_with` for paired alternatives in the same discussion, not `see_also`.
  - Use `illustrates` when a figure/example/concrete cue demonstrates a broader concept.

Rules:
  1. For each focus concept, emit as many edges as genuinely exist. Quality over quantity — do not invent weak connections, but do not artificially limit the count or leave clearly related concepts isolated.
  2. `from` in FOCUS; `to` in FOCUS (earlier in book) or VISIBLE.
  3. Each edge: kind, rationale (1-2 sentences, <=400 chars), strength 0.0-1.0, evidence_spans, evidence_line, evidence_quote.
  4. `evidence_spans` is always an array — typically a single-element array with one {start, end} range.
  5. `evidence_line` is REQUIRED: the single line marker (e.g. L02806) in the focus concept's passage that most directly justifies this edge. Copy it exactly from the source text shown.
  6. `evidence_quote` is REQUIRED: copy the shortest exact quote from that line or nearby evidence lines that supports the edge.
  7. No self-loops. No duplicate (from, to, kind) within the same window.
  8. ORDERING RULE: for `requires` only, `from` must appear LATER in the book than `to`.
     Other edge kinds may point to later concepts when the semantic direction requires it
     (e.g. category/member, contrast pairs, formalization, sibling cross-reference).

Return JSON with top-level `edges`.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["edges"],
    "properties": {
        "edges": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "from", "to", "kind", "rationale", "strength",
                    "evidence_spans", "evidence_line", "evidence_quote",
                ],
                "properties": {
                    "from":     {"type": "string"},
                    "to":       {"type": "string"},
                    "kind":     {"type": "string", "enum": [
                        "requires", "special_case_of", "generalizes", "formalizes",
                        "illustrates", "used_to_prove", "see_also", "contrast_with",
                        "teaches_after",
                    ]},
                    "rationale": {"type": "string"},
                    "strength":  {"type": "number", "minimum": 0, "maximum": 1},
                    "evidence_spans": {
                        "type": "array",
                        "minItems": 1,
                        "maxItems": 3,
                        "items": {
                            "type": "object",
                            "required": ["start", "end"],
                            "properties": {
                                "start": {"type": "string"},
                                "end":   {"type": "string"},
                            },
                        },
                    },
                    "evidence_line": {
                        "type": "string",
                        "description": "Single line marker Lxxxxx from the focus concept's passage that most directly justifies this edge.",
                    },
                    "evidence_quote": {
                        "type": "string",
                        "description": "Shortest exact quote from the source text that supports this edge.",
                    },
                },
            },
        },
    },
}


PREREQ_KINDS = {"requires"}


def _spans_of(rec: dict) -> list[dict]:
    src = rec.get("source") or {}
    spans = src.get("spans")
    if spans:
        return spans
    if src.get("span"):
        return [src["span"]]
    return []


def span_start_int(c: dict) -> int:
    spans = _spans_of(c)
    if not spans:
        return 0
    return int(spans[0]["start"][1:])


def _spans_repr(c: dict) -> str:
    spans = _spans_of(c)
    return ", ".join(f"{s['start']}-{s['end']}" for s in spans)


_numbered_lines: dict[str, str] = {}  # populated in main()


def _load_numbered(path: "Path") -> None:
    import re
    LINE_RE = re.compile(r"^L(\d{5}): (.*)$")
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if m:
            _numbered_lines[f"L{m.group(1)}"] = m.group(2)


def _source_passage(c: dict, max_chars: int = 1200) -> str:
    """Return verbatim lines from book.numbered.md for this concept's source spans."""
    if not _numbered_lines:
        return ""
    spans = _spans_of(c)
    if not spans:
        return ""
    parts = []
    for sp in spans[:2]:
        try:
            start = int(sp["start"][1:])
            end   = int(sp["end"][1:])
        except (ValueError, KeyError):
            continue
        for n in range(start, min(end + 1, start + 30)):
            mk = f"L{n:05d}"
            if mk in _numbered_lines:
                parts.append(f"{mk}: {_numbered_lines[mk]}")
    text = "\n".join(parts)
    return text[:max_chars]


def _quote_for_line(line_marker: str | None) -> str:
    """Return the numbered-book text for an evidence line marker, if available."""
    if not line_marker:
        return ""
    return _numbered_lines.get(str(line_marker).strip(), "")


def render_focus(c: dict) -> str:
    section  = c.get("position", {}).get("section") or c.get("source", {}).get("section") or "-"
    passage  = _source_passage(c)
    passage_block = f"\n  passage:\n    {passage.replace(chr(10), chr(10)+'    ')}" if passage else ""
    return (
        f"- id: {c['id']}\n"
        f"  kind: {c['kind']}\n"
        f"  title: {c['title']}\n"
        f"  section: {section}\n"
        f"  source.spans: {_spans_repr(c)}"
        f"{passage_block}"
    )


def render_visible(c: dict) -> str:
    section = c.get("position", {}).get("section") or c.get("source", {}).get("section") or "-"
    return f"- {c['id']}  [{c['kind']}, §{section}]  {c['title']}"


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def build_section_windows(concepts: list[dict]) -> list[tuple[str, list[dict], list[dict]]]:
    """Group concepts by section, return [(section_name, focus, visible)] in book order."""
    concepts_sorted = sorted(concepts, key=span_start_int)
    by_section: dict[str, list[dict]] = defaultdict(list)
    for c in concepts_sorted:
        sec = (c.get("position", {}).get("section")
               or c.get("source", {}).get("section")
               or "_unknown_")
        by_section[sec].append(c)

    # Section order by earliest concept in each section
    sections_in_order = sorted(
        by_section.keys(),
        key=lambda s: span_start_int(by_section[s][0]),
    )
    out = []
    visible_so_far: list[dict] = []
    for sec in sections_in_order:
        focus = by_section[sec]
        out.append((sec, focus, list(visible_so_far)))
        visible_so_far.extend(focus)
    return out


def build_user_message(section: str, focus: list[dict], visible: list[dict]) -> str:
    focus_md = "\n\n".join(render_focus(c) for c in focus)
    visible_md = "\n".join(render_visible(c) for c in visible) or "(none)"
    return (
        f"## FOCUS (§{section}, {len(focus)} concepts)\n\n{focus_md}\n\n"
        f"## VISIBLE earlier concepts ({len(visible)})\n\n{visible_md}\n\n"
        f"Propose edges for FOCUS concepts per system rules."
    )


def process_window(
    section: str,
    focus: list[dict],
    visible: list[dict],
    model: str,
    all_ids: set[str],
    merge_map: dict[str, str],
    all_concepts_map: dict[str, dict] | None = None,
) -> tuple[list[dict], list[str]]:
    if all_concepts_map is None:
        all_concepts_map = {}
    """Translate stale (pre-merge) ids via merge_map before validating them."""
    user_msg = build_user_message(section, focus, visible)
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model)
    focus_ids = {c["id"] for c in focus}
    warns: list[str] = []
    edges: list[dict] = []
    for e in result.get("edges", []):
        frm, to = e.get("from"), e.get("to")
        # Translate via merge_map (pre-merge → canonical)
        if frm in merge_map:
            warns.append(f"translated from: {frm} -> {merge_map[frm]}")
            frm = merge_map[frm]
            e["from"] = frm
        if to in merge_map:
            warns.append(f"translated to: {to} -> {merge_map[to]}")
            to = merge_map[to]
            e["to"] = to
        if frm not in focus_ids:
            warns.append(f"{frm}->{to}: from not in focus; dropping")
            continue
        if to not in all_ids:
            warns.append(f"{frm}->{to}: to not a known concept; dropping")
            continue
        if frm == to:
            warns.append(f"self-loop {frm}"); continue
        # Ordering constraint applies only to prerequisites. Overlay edges can
        # legitimately point to later same-passage concepts (siblings, category
        # relations, contrast pairs, formalizations).
        if e.get("kind") in PREREQ_KINDS and span_start_int(all_concepts_map.get(frm, {})) <= span_start_int(all_concepts_map.get(to, {})):
            warns.append(f"{frm}->{to}: violates prereq ordering (from not later than to); dropping")
            continue
        e["confidence"] = e.get("strength", 0.0)
        e["verified"] = False
        e["extraction"] = {"model": model}
        e["evidence_quote"] = (e.get("evidence_quote") or _quote_for_line(e.get("evidence_line"))).strip()
        # Normalize evidence_spans: accept either the new field or a legacy
        # `evidence_span` dict. Ensure every entry has a `file` field.
        file_default = focus[0].get("source", {}).get("file", "book.md")
        ev_list = e.get("evidence_spans")
        if not ev_list:
            legacy = e.pop("evidence_span", None)
            ev_list = [legacy] if legacy else []
        clean_ev = []
        for ev in ev_list:
            if not isinstance(ev, dict):
                continue
            ev.setdefault("file", file_default)
            clean_ev.append(ev)
        e["evidence_spans"] = clean_ev
        edges.append(e)
    return edges, warns


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--concepts",    type=Path, required=True)
    ap.add_argument("--out-prereq",  type=Path, required=True)
    ap.add_argument("--out-overlay", type=Path, required=True)
    ap.add_argument("--merge-map",   type=Path, default=None,
                    help="Optional concept_merge_map.json from dedup_concepts.py. "
                         "Used to translate pre-merge ids the LLM may still emit.")
    ap.add_argument("--numbered",    type=Path, default=None,
                    help="book.numbered.md — used to include verbatim source passages in prompts.")
    ap.add_argument("--model",   default=OPENAI_DEFAULT)
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument(
        "--allow-partial",
        action="store_true",
        help="Exit successfully despite failed section calls (unsafe for final graphs).",
    )
    args = ap.parse_args()

    if args.numbered and args.numbered.exists():
        _load_numbered(args.numbered)
        print(f"loaded {len(_numbered_lines)} numbered lines", file=sys.stderr)

    concepts = load_jsonl(args.concepts)
    all_ids = {c["id"] for c in concepts}
    all_concepts_map = {c["id"]: c for c in concepts}

    merge_map: dict[str, str] = {}
    if args.merge_map and args.merge_map.exists():
        merge_map = json.loads(args.merge_map.read_text())
        print(f"merge map loaded: {len(merge_map)} stale ids will be translated",
              file=sys.stderr)

    windows = build_section_windows(concepts)
    print(f"section windows: {len(windows)}", file=sys.stderr)

    args.out_prereq.parent.mkdir(parents=True, exist_ok=True)
    n_prereq = n_overlay = n_warn = n_fail = 0
    write_lock = threading.Lock()

    def run(idx_section_focus_visible):
        idx, section, focus, visible = idx_section_focus_visible
        try:
            edges, warns = process_window(
                section, focus, visible, args.model, all_ids, merge_map, all_concepts_map
            )
            return idx, section, edges, warns, None
        except Exception as e:
            return idx, section, [], [], e

    tasks = [(i, s, f, v) for i, (s, f, v) in enumerate(windows)]

    with args.out_prereq.open("w") as pf, args.out_overlay.open("w") as of:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(run, t) for t in tasks]
            for fut in as_completed(futures):
                idx, section, edges, warns, err = fut.result()
                with write_lock:
                    if err is not None:
                        n_fail += 1
                        print(f"[§{section}] FAILED: {type(err).__name__}: {err}",
                              file=sys.stderr)
                        continue
                    for e in edges:
                        if e["kind"] in PREREQ_KINDS:
                            pf.write(json.dumps(e) + "\n")
                            n_prereq += 1
                        else:
                            of.write(json.dumps(e) + "\n")
                            n_overlay += 1
                    for w in warns:
                        print(f"[§{section}] warn: {w}", file=sys.stderr)
                        n_warn += 1
                    print(f"[§{section}] {len(edges)} edges ok", file=sys.stderr)
                    pf.flush(); of.flush()

    print(f"\ndone: {n_prereq} prereq, {n_overlay} overlay, {n_warn} warns, {n_fail} failed",
          file=sys.stderr)
    if n_fail and not args.allow_partial:
        raise SystemExit(
            f"edge extraction incomplete: {n_fail} section window(s) failed"
        )


if __name__ == "__main__":
    main()
