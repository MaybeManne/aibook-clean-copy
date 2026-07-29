#!/usr/bin/env python3
"""
Targeted edge extraction for specific chapters already in graph.json.

Usage:
    python extract_edges_targeted.py \
        --graph    data_vision/graph.json \
        --chapters 5 46 \
        --out-prereq  data_vision/edges_prereq_patch.jsonl
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from llm import call_llm_json, GEMINI_DEFAULT


SYSTEM_PROMPT = """You extract pedagogical relationships between computer vision concepts.

You receive:
  - FOCUS: concepts from a specific chapter. Each has id, kind, title, source span.
  - VISIBLE: all concepts from EARLIER chapters (id + title + kind only).

Your job: propose edges for the FOCUS concepts.

Edge kinds:

  `requires` — A requires B: "understanding A requires understanding B first."
    - `from` must be in FOCUS; `to` must be in VISIBLE or in FOCUS (earlier in list).
    - Emit only when A USES or DEPENDS ON B directly.
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
  2. `from` in FOCUS. For `requires`, `to` should be in VISIBLE or an earlier FOCUS concept.
     For non-prerequisite edge kinds, `to` may be any known FOCUS or VISIBLE concept when
     the semantic relation is justified.
  3. Each edge: kind, rationale (1-2 sentences, <=400 chars), strength 0.0-1.0, evidence_spans, evidence_quote.
  4. `evidence_spans` is always an array — use the focus concept's source.spans.
  5. `evidence_quote` is REQUIRED: copy the shortest exact quote from the focus concept content/source text that supports the edge.
  6. No self-loops. No duplicate (from, to, kind).

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
                    "evidence_spans", "evidence_quote",
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
                    "evidence_quote": {
                        "type": "string",
                        "description": "Shortest exact quote from source text that supports this edge.",
                    },
                },
            },
        },
    },
}

PREREQ_KINDS = {"requires"}


def span_start_int(c: dict) -> int:
    spans = (c.get("source") or {}).get("spans", [])
    if spans:
        return int(spans[0]["start"][1:])
    fl = (c.get("position") or {}).get("first_line")
    if fl:
        return fl
    return 0


def spans_repr(c: dict) -> str:
    spans = (c.get("source") or {}).get("spans", [])
    return ", ".join(f"{s['start']}-{s['end']}" for s in spans) or "unknown"


def render_focus(c: dict) -> str:
    return (
        f"- id: {c['id']}\n"
        f"  kind: {c['kind']}\n"
        f"  title: {c['title']}\n"
        f"  source.spans: {spans_repr(c)}\n"
        f"  one_liner: {c.get('one_liner', '').strip()}\n"
        f"  content: {c.get('content', '').strip()[:600]}"
    )


def render_visible(c: dict) -> str:
    ch = (c.get("position") or {}).get("chapter", "?")
    return f"- {c['id']}  [{c['kind']}, ch{ch}]  {c['title']}"


def process_chapter(
    ch_num: int,
    focus: list[dict],
    visible: list[dict],
    all_ids: set[str],
    model: str,
) -> list[dict]:
    focus_sorted = sorted(focus, key=span_start_int)
    focus_md = "\n\n".join(render_focus(c) for c in focus_sorted)
    visible_md = "\n".join(render_visible(c) for c in visible) or "(none)"
    user_msg = (
        f"## FOCUS (Ch{ch_num}, {len(focus_sorted)} concepts)\n\n{focus_md}\n\n"
        f"## VISIBLE earlier concepts ({len(visible)})\n\n{visible_md}\n\n"
        f"Propose edges for FOCUS concepts per system rules."
    )
    print(f"  [ch{ch_num}] calling LLM (focus={len(focus_sorted)}, visible={len(visible)})...",
          file=sys.stderr)
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model,
                           max_output_tokens=32768)
    focus_ids = {c["id"] for c in focus_sorted}
    edges = []
    for e in result.get("edges", []):
        frm, to = e.get("from"), e.get("to")
        if frm not in focus_ids:
            print(f"    skip: {frm} not in focus", file=sys.stderr)
            continue
        if to not in all_ids:
            print(f"    skip: {to} unknown", file=sys.stderr)
            continue
        if frm == to:
            continue
        e["confidence"] = e.get("strength", 0.0)
        e["verified"] = False
        e["extraction"] = {"model": model}
        e["evidence_quote"] = (e.get("evidence_quote") or "").strip()
        file_default = focus_sorted[0].get("source", {}).get("file", "book.numbered.md")
        ev_list = e.get("evidence_spans", [])
        clean_ev = []
        for ev in ev_list:
            if isinstance(ev, dict):
                ev.setdefault("file", file_default)
                clean_ev.append(ev)
        e["evidence_spans"] = clean_ev or [{"start": "L00000", "end": "L00000", "file": file_default}]
        edges.append(e)
    print(f"  [ch{ch_num}] {len(edges)} edges extracted", file=sys.stderr)
    return edges


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--graph",       type=Path, required=True)
    ap.add_argument("--chapters",    type=int,  nargs="+", required=True)
    ap.add_argument("--out-prereq",  type=Path, required=True)
    ap.add_argument("--model",       default=GEMINI_DEFAULT)
    args = ap.parse_args()

    with args.graph.open() as f:
        g = json.load(f)
    concepts = g["concepts"]
    all_ids = {c["id"] for c in concepts}

    # Sort all concepts by book order
    concepts_sorted = sorted(concepts, key=span_start_int)

    target_chs = set(args.chapters)
    all_edges: list[dict] = []

    for ch_num in sorted(args.chapters):
        focus = [c for c in concepts_sorted
                 if (c.get("position") or {}).get("chapter") == ch_num]
        if not focus:
            print(f"  [ch{ch_num}] no concepts found, skipping", file=sys.stderr)
            continue
        ch_min_line = min(span_start_int(c) for c in focus)
        visible = [c for c in concepts_sorted
                   if span_start_int(c) < ch_min_line
                   and (c.get("position") or {}).get("chapter") not in target_chs]
        edges = process_chapter(ch_num, focus, visible, all_ids, args.model)
        all_edges.extend(edges)

    args.out_prereq.parent.mkdir(parents=True, exist_ok=True)
    with args.out_prereq.open("w") as f:
        for e in all_edges:
            if e["kind"] in PREREQ_KINDS:
                f.write(json.dumps(e) + "\n")

    prereq = sum(1 for e in all_edges if e["kind"] in PREREQ_KINDS)
    print(f"\ndone: {prereq} prereq edges written to {args.out_prereq}", file=sys.stderr)


if __name__ == "__main__":
    main()
