#!/usr/bin/env python3
"""
Splicer v3 — pure program, no LLM.

Responsibilities:
  1. Copy verbatim text from each record's source.spans into `raw_body`.
     Multi-range spans are concatenated with a paragraph break between them.
     Line-number prefixes (Lxxxxx:) are stripped.
  2. For exercises that have `parent_group_id`, prepend the group's directive
     text to their `raw_body` so the problem is self-contained. This fixes
     the "exercise 29: y=(x^2-1)/(x+2)" header-orphan issue.
  3. Fill in `position` for every record using sections.jsonl (chapter,
     section, section_order, book_order, first_line, concept/item ordering
     within section).
  4. Fallback `embedded_in` inference via strict multi-range containment, for
     figures/tables that Pass A didn't already link to a parent item.
  5. Promote records to the target schema shape (adds empty concepts[],
     extraction.verified=true, etc.).

Output:
  - data3/concepts.spliced.jsonl
  - data3/items.spliced.jsonl
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from spans import (
    ranges_of,
    first_line as spans_first_line,
    last_line as spans_last_line,
    splice_body as splice_ranges,
    normalize_spans,
    contains as spans_contains,
)

LINE_RE = re.compile(r"^L(\d{5}): ?(.*)$")

# Figure/table token + caption parsing
FIGURE_TOKEN_RE = re.compile(r"\[FIGURE:([0-9a-f]{16})(?:\s*\|[^\]]*)?\]")
# Book caption on the line right after a [FIGURE:...] line. The book uses
# various leading markers before "Figure" / "Table": `△`, `A`, `<`, `▲`, `▼`,
# `►`, `-`, bullet, etc. Mathpix sometimes emits a single stray character (often
# a letter like "A") as the marker. We allow up to 3 leading non-space chars.
# Captures the label and its number-ish token: "1.1.12", "Ex-62", "1.1.16a".
FIGURE_CAPTION_RE = re.compile(
    r"^\s*(?:\S{1,3}\s+)?(Figure|Table)\s+([\w\-.]+)"
)


def load_numbered(path: Path) -> dict[int, str]:
    out: dict[int, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if not m:
            raise ValueError(f"{path}: line missing Lxxxxx: prefix: {raw!r}")
        out[int(m.group(1))] = m.group(2)
    return out


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def splice_body(numbered: dict[int, str], start: str, end: str) -> str:
    """Single-range splice, kept for callers that still want it."""
    s, e = int(start[1:]), int(end[1:])
    return "\n".join(numbered.get(i, "") for i in range(s, e + 1))


def splice_record_body(numbered: dict[int, str], rec: dict) -> str:
    """Multi-range-aware splice: joins disjoint ranges with a paragraph break."""
    return splice_ranges(numbered, ranges_of(rec))


def span_ints(rec: dict) -> tuple[int, int]:
    """First-start, last-end of the record's spans (for bounding-box containment)."""
    return spans_first_line(rec), spans_last_line(rec)


def section_for_line(line: int, sections: list[dict]) -> dict | None:
    """Return the section record whose line range contains `line`."""
    for s in sections:
        if s["start_line"] <= line <= s["end_line"]:
            return s
    return None


def chapter_for_line(line: int, chapters: list[dict]) -> dict | None:
    for c in chapters:
        if c["start_line"] <= line <= c["end_line"]:
            return c
    return None


def build_position(
    first_line: int,
    sections: list[dict],
    chapters: list[dict],
    section_order_in: dict[str, int],
    book_order_in: int,
) -> dict:
    pos: dict = {"first_line": first_line}
    chap = chapter_for_line(first_line, chapters)
    if chap is not None:
        pos["chapter"] = chap["chapter"]
        pos["chapter_title"] = chap["chapter_title"]
    sec = section_for_line(first_line, sections)
    if sec is not None:
        pos["section"] = sec["section"]
        pos["section_title"] = sec["section_title"]
        pos["section_order"] = sec["section_order"]
    pos["book_order"] = book_order_in
    # caller will add concept_order_in_section / item_order_in_section
    return pos


# ─────────────────────────────────────────────────────────────────────
# embedded_in inference
# ─────────────────────────────────────────────────────────────────────

CONTAINER_KINDS = {"example", "exercise", "exercise_group", "theorem"}


def infer_embedded_in(
    fig_item: dict,
    items: list[dict],
    numbered: dict[int, str],
) -> str | None:
    """Fallback when Pass A didn't set `embedded_in` — containment only.

    Pass A's prompt now handles the harder cases (figure caption references an
    exercise by number, figure sits just after an exercise that mentions an
    accompanying figure, etc.). If Pass A didn't catch it, we prefer leaving
    `embedded_in: null` over guessing.

    Containment is multi-range aware: every range of the figure must lie
    inside SOME range of the candidate item."""
    candidates = []
    for other in items:
        if other is fig_item or other.get("kind") not in CONTAINER_KINDS:
            continue
        if not spans_contains(other, fig_item):
            continue
        # tighter bounding box wins
        os_, oe = span_ints(other)
        candidates.append((oe - os_, other["id"]))
    if candidates:
        candidates.sort()
        return candidates[0][1]
    return None


# ─────────────────────────────────────────────────────────────────────
# Figure metadata post-processing (pure, no LLM)
# ─────────────────────────────────────────────────────────────────────


def extract_figure_numbers(
    numbered: dict[int, str], images_path: Path
) -> int:
    """Scan book.numbered.md: for each [FIGURE:asset_id] line, the next
    non-blank line often reads like 'Figure 1.1.12' / '△ Figure 1.1.16' /
    'Table 1.1.3'. Extract as asset.figure_number.

    Rewrites images.jsonl in place with the new field (None if no caption
    was found). Returns the count of assets with populated figure_number.
    """
    if not images_path.exists():
        print(f"  [extract_figure_numbers] {images_path} missing; skipped")
        return 0

    # Build asset_id -> figure_number from book.numbered.md
    ordered_line_nums = sorted(numbered)
    idx_of = {n: i for i, n in enumerate(ordered_line_nums)}

    def _scan_caption(start_idx: int, direction: int) -> str | None:
        """Look in `direction` (+1 or -1) for a Figure/Table caption line.
        Skips blank lines, other [FIGURE:...] lines, and table rows (the book
        sometimes puts a data table between a figure and its caption). Stops
        at the first non-skippable line: matches it against FIGURE_CAPTION_RE
        and returns the caption, or None if that line isn't a caption.

        Also stops at a heading line (## / ### ...) — a caption never crosses
        a heading, so we don't misattribute a caption to a neighboring
        section's figure.
        """
        i = start_idx + direction
        looked = 0
        while 0 <= i < len(ordered_line_nums) and looked < 12:
            text = numbered.get(ordered_line_nums[i], "").strip()
            if not text:
                i += direction; looked += 1; continue
            # Skip adjacent figures — they're part of the same caption group.
            if FIGURE_TOKEN_RE.search(text):
                i += direction; looked += 1; continue
            # Skip table rows (Mathpix emits these as lines starting with `|`).
            if text.startswith("|"):
                i += direction; looked += 1; continue
            # A heading ends the search — never cross it.
            if text.startswith("#"):
                return None
            cm = FIGURE_CAPTION_RE.match(text)
            if cm:
                return f"{cm.group(1)} {cm.group(2)}"
            return None
        return None

    asset_numbers: dict[str, str] = {}
    for n in ordered_line_nums:
        line = numbered.get(n, "")
        for m in FIGURE_TOKEN_RE.finditer(line):
            aid = m.group(1)
            if aid in asset_numbers:
                continue  # first occurrence wins
            idx = idx_of[n]
            # prefer caption AFTER the figure (book's more common layout);
            # fall back to caption BEFORE.
            cap = _scan_caption(idx, +1) or _scan_caption(idx, -1)
            if cap:
                asset_numbers[aid] = cap

    # Rewrite images.jsonl
    assets = load_jsonl(images_path)
    n_populated = 0
    for asset in assets:
        aid = asset.get("asset_id")
        fn = asset_numbers.get(aid)
        asset["figure_number"] = fn  # None if missing
        if fn:
            n_populated += 1
    write_jsonl(images_path, assets)
    return n_populated


def populate_referenced_by(
    concepts_out: list[dict],
    items_out: list[dict],
    images_path: Path,
) -> int:
    """After all records are spliced, scan every record's raw_body for
    [FIGURE:asset_id] tokens. Build reverse index {asset_id: [record_id,...]}.
    Merge into images.jsonl. Returns count of assets with >=1 referrer.
    """
    if not images_path.exists():
        print(f"  [populate_referenced_by] {images_path} missing; skipped")
        return 0

    reverse: dict[str, set[str]] = {}
    for rec in concepts_out + items_out:
        body = rec.get("raw_body") or ""
        for aid in set(FIGURE_TOKEN_RE.findall(body)):
            reverse.setdefault(aid, set()).add(rec["id"])

    assets = load_jsonl(images_path)
    n_with_refs = 0
    for asset in assets:
        aid = asset.get("asset_id")
        refs = sorted(reverse.get(aid, set()))
        asset["referenced_by"] = refs
        if refs:
            n_with_refs += 1
    write_jsonl(images_path, assets)
    return n_with_refs


# ─────────────────────────────────────────────────────────────────────
# Promotion
# ─────────────────────────────────────────────────────────────────────

def _spans_list(rec: dict) -> list[dict]:
    """Return the canonical list of {start, end} dicts for this record."""
    src = rec.get("source") or {}
    spans = src.get("spans")
    if spans:
        return list(spans)
    span = src.get("span")
    if span:
        return [span]
    return []


def promote_concept(rec: dict, numbered: dict[int, str], model_name: str,
                    numbered_name: str) -> dict:
    normalize_spans(rec)
    body = splice_record_body(numbered, rec)
    out = {
        "id": rec["id"],
        "kind": rec["kind"],
        "title": rec["title"],
        "aliases": [],
        "tags": [],
        "item_ids": {"theorems": [], "examples": [], "exercises": [],
                     "exercise_groups": [], "figures": [], "tables": []},
        "source": {
            "file": numbered_name,
            "spans": _spans_list(rec),
        },
        "raw_body": body,
        "extraction": {"pass_a_model": model_name, "verified": True},
    }
    if rec.get("quality_flags"):
        out["quality_flags"] = rec["quality_flags"]
    return out


def promote_item(rec: dict, numbered: dict[int, str], groups_by_id: dict[str, dict],
                 model_name: str, numbered_name: str) -> dict:
    normalize_spans(rec)
    body = splice_record_body(numbered, rec)

    # Prepend group directive for sub-exercises
    parent_group_id = rec.get("parent_group_id")
    if parent_group_id and parent_group_id in groups_by_id:
        grp = groups_by_id[parent_group_id]
        normalize_spans(grp)
        grp_first = spans_first_line(grp)
        sub_first = spans_first_line(rec)
        if sub_first > grp_first:
            # Directive = lines in the group BEFORE this sub-part's first line,
            # but only those that actually fall inside the group's ranges.
            directive_lines: list[str] = []
            for rs, re_ in ranges_of(grp):
                if rs >= sub_first:
                    break
                for i in range(rs, min(re_, sub_first - 1) + 1):
                    directive_lines.append(numbered.get(i, ""))
            directive_text = "\n".join(directive_lines).strip()
            if directive_text:
                body = directive_text + "\n\n" + body

    out = {
        "id": rec["id"],
        "kind": rec["kind"],
        "title": rec["title"],
        "concepts": [],
        "skills": [],
        "tags": [],
        "source": {
            "file": numbered_name,
            "spans": _spans_list(rec),
        },
        "raw_body": body,
        "extraction": {"pass_a_model": model_name, "verified": True},
    }
    if parent_group_id:
        out["parent_group_id"] = parent_group_id
    if rec.get("sub_item_ids"):
        out["sub_item_ids"] = list(rec["sub_item_ids"])
    if rec.get("embedded_in") is not None:
        out["embedded_in"] = rec["embedded_in"]
    if rec.get("quality_flags"):
        out["quality_flags"] = rec["quality_flags"]

    # Try to extract the book's label
    first_line = next((l for l in body.splitlines() if l.strip()), "")
    m = re.match(r"^(?:#{1,4}\s+)?(Example|Exercise|Theorem|Figure|Table)\s+([0-9.]+)",
                 first_line)
    if m:
        out["source"]["label"] = f"{m.group(1)} {m.group(2)}"
    return out


# ─────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered",      type=Path, required=True)
    ap.add_argument("--sections",      type=Path, required=True)
    ap.add_argument("--chapters",      type=Path, required=True)
    ap.add_argument("--concepts",      type=Path, required=True)
    ap.add_argument("--items",         type=Path, required=True)
    ap.add_argument("--out-concepts",  type=Path, required=True)
    ap.add_argument("--out-items",     type=Path, required=True)
    ap.add_argument("--images",        type=Path, default=None,
                    help="Path to images.jsonl. If provided, splice populates "
                         "figure_number + referenced_by fields on each asset.")
    ap.add_argument("--model-name",    default="gemini-2.5-flash")
    args = ap.parse_args()

    numbered = load_numbered(args.numbered)
    sections = load_jsonl(args.sections)
    chapters = load_jsonl(args.chapters)
    concepts_in = load_jsonl(args.concepts)
    items_in    = load_jsonl(args.items)

    # Index exercise_groups for directive splicing
    groups_by_id = {r["id"]: r for r in items_in if r.get("kind") == "exercise_group"}

    # Promote records
    concepts_out = [promote_concept(r, numbered, args.model_name, args.numbered.name)
                    for r in concepts_in]
    items_out = [promote_item(r, numbered, groups_by_id, args.model_name, args.numbered.name)
                 for r in items_in]

    # Infer embedded_in for figures/tables where not already set
    items_for_lookup = items_out  # use post-promotion list (has full records)
    for it in items_out:
        if it["kind"] not in ("figure", "table"):
            continue
        if it.get("embedded_in") is not None:
            continue
        parent = infer_embedded_in(it, items_for_lookup, numbered)
        if parent is not None:
            it["embedded_in"] = parent
        else:
            it["embedded_in"] = None

    # Position data (sort by first_line, assign book_order / concept_order_in_section /
    # item_order_in_section)
    def first_line(r: dict) -> int:
        return spans_first_line(r)

    concepts_out.sort(key=first_line)
    for i, c in enumerate(concepts_out, start=1):
        pos = build_position(first_line(c), sections, chapters, {}, i)
        c["position"] = pos

    # Rebuild concept_order_in_section
    section_counter: dict[str, int] = {}
    for c in concepts_out:
        sec = c["position"].get("section")
        if sec is None:
            continue
        section_counter[sec] = section_counter.get(sec, 0) + 1
        c["position"]["concept_order_in_section"] = section_counter[sec]

    items_out.sort(key=first_line)
    for i, it in enumerate(items_out, start=1):
        pos = build_position(first_line(it), sections, chapters, {}, i)
        it["position"] = pos

    section_item_counter: dict[str, int] = {}
    for it in items_out:
        sec = it["position"].get("section")
        if sec is None:
            continue
        section_item_counter[sec] = section_item_counter.get(sec, 0) + 1
        it["position"]["item_order_in_section"] = section_item_counter[sec]

    # Fill source.section from position where missing
    for rec in concepts_out + items_out:
        sec = rec["position"].get("section")
        if sec and "section" not in rec["source"]:
            rec["source"]["section"] = sec

    write_jsonl(args.out_concepts, concepts_out)
    write_jsonl(args.out_items, items_out)

    print(f"spliced: {len(concepts_out)} concepts -> {args.out_concepts}")
    print(f"spliced: {len(items_out)} items    -> {args.out_items}")
    # Quick stats
    n_groups = sum(1 for it in items_out if it["kind"] == "exercise_group")
    n_with_parent = sum(1 for it in items_out if it.get("parent_group_id"))
    n_embedded = sum(1 for it in items_out if it.get("embedded_in"))
    print(f"  exercise_groups: {n_groups}")
    print(f"  sub-exercises (parent_group_id set): {n_with_parent}")
    print(f"  embedded figures/tables: {n_embedded}")

    # Figure asset post-processing (pure, no LLM)
    if args.images is not None:
        n_nums = extract_figure_numbers(numbered, args.images)
        n_refs = populate_referenced_by(concepts_out, items_out, args.images)
        print(f"  images.jsonl: figure_number populated on {n_nums} assets")
        print(f"  images.jsonl: referenced_by populated on {n_refs} assets")


if __name__ == "__main__":
    main()
