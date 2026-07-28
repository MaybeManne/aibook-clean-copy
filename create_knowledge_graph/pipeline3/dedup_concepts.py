#!/usr/bin/env python3
"""
Whole-book LLM dedup pass on concepts.

Gemini sees every concept's (id, kind, title, one-line raw_body snippet,
section) and returns a merge-map. We apply the map: canonical IDs stay, others
are aliased and their spans + raw_body merged into the canonical record.

Runs AFTER splice (so raw_body snippets exist) but BEFORE Pass B formatting
(so we don't waste Pass B cost on duplicates).

Usage:
    python dedup_concepts.py \
        --spliced data2/concepts.spliced.jsonl \
        --out data2/concepts.deduped.jsonl \
        --map-out data2/concept_merge_map.json \
        [--workers 1]   # single call typically
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT


SYSTEM_PROMPT = """You deduplicate concept nodes in a textbook knowledge graph.

You receive a list of concepts, each with:
  id, kind, title, section, one_line_snippet (first meaningful sentence of the concept's raw text).

Find near-duplicates: concepts that refer to the EXACT SAME idea even though their ids / titles differ. Common cases:
  - Same concept extracted twice from adjacent chunks with slightly different ids.
  - A concept re-stated in a later section with a nearly identical description.
  - An id collision from the chunk-suffix rename (e.g., "foo" and "foo__chunkid").

Rules:
  1. Only merge EXACT duplicates — identical or near-identical textual descriptions of the same idea.
     "Related" or "connected" is NOT enough. When in doubt, do NOT merge.
  2. Prefer canonical id: the one whose title is most descriptive and whose section is earliest.
  3. Do NOT merge an informal and a rigorous formulation of the same concept — those are distinct
     and will be linked by a `formalizes` edge.
  4. Do NOT merge across different `kind` values unless both clearly describe the identical thing.
  5. Do NOT merge VARIANTS or SPECIAL CASES of a concept family:
     - Different projection types (perspective, orthographic, telephoto) → keep separate.
     - Different reflection models (Lambertian, Phong, ambient) → keep separate.
     - A model and its named property or consequence → keep separate.
     - Different coordinate systems (world, camera, image) → keep separate.
     - Different steps in a derivation that have distinct names → keep separate.
  6. Do NOT merge concepts just because they appear in the same section or share a keyword.
     Require that the one_line_snippets describe the same core idea.

Return JSON: one top-level array `merges`. Each entry:
  { canonical_id: "...", merged_ids: ["...", "..."], rationale: "short why" }

Only include groups with >=2 ids to merge. Err heavily on the side of keeping concepts separate.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["merges"],
    "properties": {
        "merges": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["canonical_id", "merged_ids", "rationale"],
                "properties": {
                    "canonical_id": {"type": "string"},
                    "merged_ids":   {"type": "array", "items": {"type": "string"}},
                    "rationale":    {"type": "string"},
                },
            },
        },
    },
}


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def one_line_snippet(raw_body: str, max_chars: int = 200) -> str:
    for ln in raw_body.splitlines():
        s = ln.strip()
        if not s:
            continue
        s = re.sub(r"\s+", " ", s)
        if len(s) > max_chars:
            s = s[:max_chars - 3] + "..."
        return s
    return ""


def render_concept(c: dict) -> dict:
    sec = c.get("position", {}).get("section") or c.get("source", {}).get("section") or "-"
    return {
        "id":               c["id"],
        "kind":             c["kind"],
        "title":            c["title"],
        "section":          sec,
        "one_line_snippet": one_line_snippet(c.get("raw_body", "")),
    }


def apply_merges(concepts: list[dict], merges: list[dict]) -> tuple[list[dict], dict[str, str]]:
    """Apply merges: return (new_concepts_list, merge_map id->canonical)."""
    by_id = {c["id"]: c for c in concepts}
    id_to_canonical: dict[str, str] = {}
    canonical_aliases: dict[str, list[str]] = {}
    for m in merges:
        canonical = m["canonical_id"]
        if canonical not in by_id:
            continue
        for mid in m["merged_ids"]:
            if mid == canonical or mid not in by_id:
                continue
            id_to_canonical[mid] = canonical
            canonical_aliases.setdefault(canonical, []).append(mid)

    dropped: set[str] = set()
    out: list[dict] = []
    for c in concepts:
        cid = c["id"]
        if cid in id_to_canonical:
            dropped.add(cid)
            continue
        aliases = canonical_aliases.get(cid)
        if aliases:
            merged = dict(c)
            prev_aliases = set(merged.get("aliases", []))
            # add merged ids as aliases, and merged titles
            for mid in aliases:
                prev_aliases.add(mid)
                other = by_id.get(mid)
                if other and other.get("title"):
                    prev_aliases.add(other["title"])
            merged["aliases"] = sorted(prev_aliases)
            out.append(merged)
        else:
            out.append(c)
    return out, id_to_canonical


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--spliced", type=Path, required=True)
    ap.add_argument("--out",     type=Path, required=True)
    ap.add_argument("--map-out", type=Path, required=True)
    ap.add_argument("--model",   default=GEMINI_DEFAULT)
    args = ap.parse_args()

    concepts = load_jsonl(args.spliced)
    print(f"concepts: {len(concepts)}", file=sys.stderr)

    rendered = [render_concept(c) for c in concepts]
    user_msg = json.dumps({"concepts": rendered}, indent=2)
    # Guard: if concept list is huge (>500 items), could batch by chapter —
    # for calculus-sized books a single call is fine.

    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=args.model)
    merges = result.get("merges", [])
    print(f"merges proposed: {len(merges)}", file=sys.stderr)
    for m in merges:
        print(f"  canon={m['canonical_id']}  merged={m['merged_ids']}  // {m['rationale']}",
              file=sys.stderr)

    new_concepts, merge_map = apply_merges(concepts, merges)
    write_jsonl(args.out, new_concepts)
    args.map_out.parent.mkdir(parents=True, exist_ok=True)
    args.map_out.write_text(json.dumps(merge_map, indent=2) + "\n")

    print(f"\ndeduped: {len(concepts)} -> {len(new_concepts)}", file=sys.stderr)
    print(f"merge map saved: {args.map_out}", file=sys.stderr)
    print(f"output: {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
