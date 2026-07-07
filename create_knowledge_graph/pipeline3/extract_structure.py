#!/usr/bin/env python3
"""
Pass A v2 — structure-only extraction.

For each chunk, ask Gemini to identify every concept AND every item, emitting
ONLY line-number references (no content). New in v2:

  - `exercise_group`: when the book has a directive like "Find the horizontal
    asymptote(s) for each function." followed by numbered sub-parts, the
    directive is its own exercise_group item, and each sub-part is a regular
    exercise with `parent_group_id` pointing back.
  - `embedded_in`: figures and tables that live inside an example/exercise/
    proof carry `embedded_in: <parent_id>`; standalone figures have null.

Output fields per concept:
  {id, kind, title, source.spans}

Output fields per item:
  {id, kind, title, source.spans,
   parent_group_id?   (for exercises inside a group),
   sub_item_ids?      (for exercise_group, the IDs of its numbered sub-parts),
   embedded_in?       (for figure/table inside another item)}

Usage:
    python extract_structure.py \
        --numbered data2/book_enriched.numbered.md \
        --manifest data2/chunks/manifest.jsonl \
        --chunks-dir data2/chunks \
        --out-concepts data2/pass_a_concepts.jsonl \
        --out-items    data2/pass_a_items.jsonl \
        [--workers 16] [--limit 0]
"""
from __future__ import annotations

import argparse
import json
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT


SYSTEM_PROMPT = """You extract structural metadata from a calculus textbook chunk.

Input format: every line begins with a line-number marker `Lxxxxx: ` (five digits, zero-padded). Example:

    L00125: ## LIMITS
    L00126:
    L00127: Now that we have seen how limits arise in various ways...

Images embedded in the text look like `[FIGURE:<asset_id> | <short alt text>]` — a compact token where asset_id is a stable 16-hex handle into the images asset table and the short alt text describes the figure. Use the alt text as context for classification, but do not copy the token verbatim into any output.

## Your job

Identify every CONCEPT and every ITEM in the chunk.

## Concepts

Atomic teachable ideas. Four kinds:
- "definition": a named mathematical object or notion (e.g. "two-sided limit", "vertical asymptote").
- "theorem": a named result stated as a theorem (e.g. "Limit of a polynomial", "Squeeze theorem"). Emit BOTH a concept (kind=theorem) AND an item (kind=theorem) for the same span, with different ids like `thm_1_2_3_limit_of_polynomial` (concept) and `item_thm_1_2_3` (item).
- "technique": a named computational procedure (e.g. "computing limits by factoring").
- "idea": a motivational/conceptual discussion that is a distinct teachable unit.

Do NOT create concepts for: individual examples/exercises, running commentary, figure captions, technology-mastery sidebars.

## Items

Reusable content pieces. Kinds and their schemas:

### example, exercise, theorem
  { id, kind, title, source: { spans: [{start, end}, ...] } }

### exercise_group  (NEW)
When the book introduces a single directive followed by numbered sub-parts:

    ## Find the horizontal asymptote(s) for each function.
    29. $y = (x^2-1)/(x+2)$
    30. $y = (x^2+1)/(x-1)$
    31. ...

Emit:
  1. ONE exercise_group item covering the directive heading span + all its children. Give it:
      { id: "<stable slug, e.g. 'grp_1_3_horiz_asymptotes'>",
        kind: "exercise_group",
        title: "<short, e.g. 'Find horizontal asymptotes'>",
        source.spans: <directive start> to <last sub-part end>,
        sub_item_ids: [id_of_ex_29, id_of_ex_30, id_of_ex_31, ...] }
  2. Each numbered sub-part as its OWN exercise item with:
      { id, kind: "exercise", title: "Exercise 29", source.spans: <just the numbered line's span>,
        parent_group_id: "grp_1_3_horiz_asymptotes" }

This is how we preserve the directive — without it, exercise 29 reads "y = (x^2-1)/(x+2)" and is meaningless.

If exercises are numbered but WITHOUT a shared preceding directive (each has its own full question), treat each as an independent exercise (no group).

### figure, table
  { id, kind, title, source.spans, embedded_in: <parent item id> OR null }

Set `embedded_in` when the figure/table is pedagogically part of another item. Cases to recognize:

  A. The figure's span falls INSIDE the other item's span (strict containment).
     Example: an example that runs L00048-L00086 contains a figure at L00068-L00069 with caption "Figure 1.1.5". embedded_in=<the example's id>.

  B. The figure sits immediately AFTER the item (within ~15 lines) AND the
     figure's label or caption references the item by its number — or the
     item's text says "accompanying figure" / "see the figure".
     Example:
         L14684: "62. As shown in the accompanying figure on the next page, suppose..."
         ...exercise body through L14692...
         L14694: ![...](...) "< Figure Ex-62"
     The figure at L14694 has caption "Figure Ex-62" referencing exercise 62,
     so embedded_in=<exercise 62's id>.

  C. The figure appears just BEFORE an example/exercise/proof (within ~15
     lines) AND that item's prose mentions the figure's core subject. "Core
     subject" means a function name, equation, or keyword that appears in BOTH
     the figure's alt text and the item's prose. This is the common "figure
     is set up first, then Example N asks about it" pattern.
     Example:
         L00279: [FIGURE:4f18e6a54b824dfc | A graph showing y = |x|/x with a jump discontinuity at x=0]
         L00280: △ Figure 1.1.12
         ...
         L00363: Example 4 Explain why $\lim_{x\to 0} |x|/x$ does not exist.
     The alt text contains "y = |x|/x" and Example 4's prompt contains
     "|x|/x" — shared keyword. Set fig_1_1_12.embedded_in = <example_4's id>.

  D. Prose "figure above" / "figure below" references. If the item's first
     sentence says "the figure above shows...", the figure is the one just
     before this item; if it says "see the figure below", the figure is the
     one just after. embedded_in=<that item's id>.

Set embedded_in=null only when the figure is truly a STANDALONE section-level figure — i.e., it has its own independent caption like "Figure 1.1.8" and no nearby item claims it. Section-opener figures, chapter-opener photos, decorative images all count as standalone.

Prefer embedded_in=<item_id> when in doubt: the downstream renderer handles both cases, and a mis-attached figure is less harmful than an orphaned one.

## Include figure lines INSIDE a concept's span when the concept refers to them

Concepts (definition / theorem / technique / idea) are prose passages. When a concept's prose references a figure — either verbally ("see Figure 1.1.5", "the graph at the right shows...", "as illustrated below") OR because a visible `[FIGURE:<asset_id> | ...]` token sits 1–3 lines before or after the concept's prose — the concept's `source.spans` MUST include the figure's line(s). Use a multi-range span if the figure line is not contiguous with the rest of the concept.

Why: downstream, the concept's raw_body is spliced verbatim from its spans. If the figure line is outside the span, the concept's text loses the `[FIGURE:...]` token and consumers (tutor UI, lesson generator) lose the figure.

Examples:
  1. Concept "Definition of limit" runs L00140–L00148. Figure token at L00143 is already inside the span → include it (it is).
  2. Concept "Horizontal asymptote" runs L00200–L00207. Book layout puts the illustrating figure at L00209. Prose at L00206 says "the graph in Figure 1.3.2 illustrates...". Emit concept with multi-range spans: [{L00200, L00207}, {L00209, L00210}].
  3. Concept "Continuity of trig functions" runs L03300–L03320. A section-opener figure sits at L03282, but this concept's prose never references it. Do NOT extend the span — the figure is truly standalone.

The same rule applies to example/exercise/theorem items when their prose references a figure and the figure line is not already inside their span.

Caveat (important): do NOT extend a concept/item span to a figure the text does not reference. "Nearby" alone is not enough — the prose must point at that specific figure (a phrase, a figure number, or a `[FIGURE:...]` token literally embedded in the paragraph).

## Multi-range spans

Each record's `source.spans` is an ARRAY of line ranges. Most records have exactly ONE range — emit a one-element array in that case.

Emit MULTIPLE ranges when a record genuinely covers disjoint parts of the book that belong together. The most common use case: an exercise whose figure appears a few lines later.

Example:
    L14684: 62. As shown in the accompanying figure on the next page, suppose that a boat enters the river...
    L14685-L14692: ...rest of exercise body...
    L14693:                       (blank)
    L14694: [FIGURE:abc123 | A 2D Cartesian coordinate system showing the boat's path...]
    L14695: < Figure Ex-62

Exercise 62 should be emitted with:
    { id: "ex_4_review_62",
      kind: "exercise",
      title: "Exercise 62",
      source: { spans: [
        { start: "L14684", end: "L14692" },
        { start: "L14694", end: "L14695" }
      ] } }

Rules for multi-range:
  A. Each range must be a contiguous block. Do not skip individual lines — use one range per contiguous segment.
  B. Ranges must not overlap each other within the same record.
  C. The combined range length should still be reasonable for a single record. If you find yourself using >3 ranges or skipping huge gaps, reconsider: the record is probably two separate things.
  D. For a figure that belongs to an exercise, you have two choices — BOTH acceptable:
       (i)  emit the figure as its own `figure` item with `embedded_in` set to the exercise's id (the figure gets its own record), or
       (ii) omit the figure as a separate item and include its lines in the exercise's `spans` (the exercise's `raw_body` will then contain the figure reference inline).
     Prefer (i) when the figure could stand on its own; prefer (ii) when the figure is purely decorative or short.
     For CONCEPTS whose prose references a figure, strongly prefer including the
     figure's lines in the concept's span (option (ii)) so the [FIGURE:...]
     token lands inside the concept's raw_body.
  E. Single-range is the default; only use multi-range when it materially improves the record's completeness.

## Output format

Two arrays: `concepts` and `items`. Each record has:
  - id (snake_case, unique within chapter, stable)
  - kind (from the sets above)
  - title (<=120 chars)
  - source.spans: array of {start, end} line-marker pairs (one or more)
  - plus optional fields per kind above

Rules:
  1. No body text, quotes, prose, or math in output. Only ids, kinds, titles, spans, and the optional parent/sub links.
  2. Line markers must be copied verbatim from the input. Do not invent.
  3. Use descriptive slugs: `two_sided_limit_informal`, `ex_1_1_3`, `thm_1_2_3_limit_of_polynomial`, `fig_1_1_8`, `grp_1_3_horiz_asymptotes`.
  4. For sub-exercises inside a group, their `source.spans` should cover only their own line(s), not the directive.
  5. If a chunk contains no directive-style exercise groups, just emit flat exercise items as before.
  6. `source.spans` is always an array — use a single-element array for the typical case.
"""


_RANGE_SCHEMA = {
    "type": "object",
    "required": ["start", "end"],
    "properties": {
        "start": {"type": "string", "description": "Line marker Lxxxxx copied from input."},
        "end":   {"type": "string", "description": "Line marker Lxxxxx copied from input."},
    },
}

_SOURCE_SCHEMA = {
    "type": "object",
    "required": ["spans"],
    "properties": {
        "spans": {
            "type": "array",
            "minItems": 1,
            "maxItems": 4,
            "description": "One or more line ranges covered by this record. Single-range is typical; multi-range when out-of-sequence material belongs (e.g., an exercise plus a figure caption a few lines later).",
            "items": _RANGE_SCHEMA,
        },
    },
}


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["concepts", "items"],
    "properties": {
        "concepts": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "kind", "title", "source"],
                "properties": {
                    "id":    {"type": "string"},
                    "kind":  {"type": "string", "enum": ["definition", "theorem", "technique", "idea"]},
                    "title": {"type": "string"},
                    "source": _SOURCE_SCHEMA,
                },
            },
        },
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "kind", "title", "source"],
                "properties": {
                    "id":    {"type": "string"},
                    "kind":  {"type": "string", "enum": ["example", "exercise", "exercise_group", "theorem", "figure", "table"]},
                    "title": {"type": "string"},
                    "parent_group_id": {"type": ["string", "null"]},
                    "sub_item_ids":    {"type": "array", "items": {"type": "string"}},
                    "embedded_in":     {"type": ["string", "null"]},
                    "source": _SOURCE_SCHEMA,
                },
            },
        },
    },
}


def build_user_message(chunk_text: str, chunk_meta: dict) -> str:
    headings = " > ".join(chunk_meta.get("headings", [])) or "(no heading)"
    span = chunk_meta["span"]
    overlap = chunk_meta.get("overlap")
    overlap_note = ""
    if overlap:
        overlap_note = (
            f"\nNote: the first lines {overlap['start']}-{overlap['end']} are "
            f"overlap duplicated from the previous chunk. Do NOT emit records "
            f"whose primary span lies entirely in that overlap range.\n"
        )
    return (
        f"Chunk id: {chunk_meta['chunk_id']}\n"
        f"Heading context: {headings}\n"
        f"Primary span: {span['start']}-{span['end']}"
        f"{overlap_note}\n"
        f"--- begin chunk ---\n{chunk_text}\n--- end chunk ---\n"
    )


def process_chunk(chunk_meta: dict, chunks_dir: Path, model: str) -> dict:
    chunk_path = chunks_dir / f"{chunk_meta['chunk_id']}.md"
    chunk_text = chunk_path.read_text(encoding="utf-8")
    user_msg = build_user_message(chunk_text, chunk_meta)
    return call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered",     type=Path, required=True)
    ap.add_argument("--manifest",     type=Path, required=True)
    ap.add_argument("--chunks-dir",   type=Path, default=None)
    ap.add_argument("--out-concepts", type=Path, required=True)
    ap.add_argument("--out-items",    type=Path, required=True)
    ap.add_argument("--model",   default=GEMINI_DEFAULT)
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--limit",   type=int, default=0)
    ap.add_argument("--start",   type=int, default=0)
    args = ap.parse_args()

    chunks_dir = args.chunks_dir or args.manifest.parent
    with args.manifest.open() as f:
        manifest = [json.loads(line) for line in f]
    if args.start:
        manifest = manifest[args.start:]
    if args.limit:
        manifest = manifest[:args.limit]

    args.out_concepts.parent.mkdir(parents=True, exist_ok=True)
    write_lock = threading.Lock()
    n_done = n_concepts = n_items = n_failed = 0
    n_total = len(manifest)

    def worker(meta: dict):
        try:
            return meta, process_chunk(meta, chunks_dir, args.model), None
        except Exception as e:
            return meta, None, e

    with args.out_concepts.open("w") as cf, args.out_items.open("w") as itf:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(worker, m) for m in manifest]
            for fut in as_completed(futures):
                meta, out, err = fut.result()
                with write_lock:
                    n_done += 1
                    tag = f"[{n_done}/{n_total}] {meta['chunk_id']} " \
                          f"({meta['span']['start']}-{meta['span']['end']})"
                    if err is not None:
                        n_failed += 1
                        print(f"{tag}  FAILED: {type(err).__name__}: {err}",
                              file=sys.stderr)
                        continue
                    n_c = len(out.get("concepts", []))
                    n_i = len(out.get("items", []))
                    n_concepts += n_c
                    n_items += n_i
                    print(f"{tag}  -> {n_c} concepts, {n_i} items", file=sys.stderr)
                    for c in out.get("concepts", []):
                        c.setdefault("source", {}).setdefault("file", args.numbered.name)
                        c["chunk_id"] = meta["chunk_id"]
                        cf.write(json.dumps(c) + "\n")
                    for it in out.get("items", []):
                        it.setdefault("source", {}).setdefault("file", args.numbered.name)
                        it["chunk_id"] = meta["chunk_id"]
                        itf.write(json.dumps(it) + "\n")
                    cf.flush(); itf.flush()

    print(f"\ndone: {n_done} chunks, {n_concepts} concepts, "
          f"{n_items} items, {n_failed} failed", file=sys.stderr)


if __name__ == "__main__":
    main()
