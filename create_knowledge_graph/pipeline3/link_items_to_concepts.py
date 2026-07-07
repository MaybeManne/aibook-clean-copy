#!/usr/bin/env python3
"""
Item -> concept linking v2. LLM-only, full corpus, single pass.

For every item (exercise, example, theorem, figure, table, exercise_group) the
LLM picks 1-3 concept ids from the full concept catalog that this item tests
or illustrates. No spatial heuristic.

Figures/tables with `embedded_in` inherit their parent's concepts (not asked
of the LLM; saved one call each). Exercise_group records inherit the union of
their sub_item concepts after sub-items are linked.

Also populates `item_ids.*` buckets on concepts.

Usage:
    python link_items_to_concepts.py \
        --concepts data2/concepts.jsonl \
        --items    data2/items.jsonl \
        [--batch-size 12] [--workers 16]
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
import threading
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT


SYSTEM_PROMPT = """You map calculus textbook items to the concepts they test or illustrate.

You receive:
  - CANDIDATES: full concept catalog. Each has id, kind, title, section, one_liner.
  - ITEMS: a batch of items (exercises, examples, theorems, figures, tables).
    Each has id, kind, title, and a text (prompt_md / caption_md / proof body).

For each item pick 1 to 3 concept ids from CANDIDATES that this item MOST DIRECTLY tests (exercises, examples) or illustrates (figures, tables) or states (theorems). Concepts listed should be load-bearing, not tangential.

Rules:
  1. `concepts` is ordered: most-central first.
  2. Use ids that appear in CANDIDATES. Do not invent.
  3. For an exercise that references a named theorem ("Use the Mean-Value Theorem..."), that theorem concept must appear.
  4. For a figure/table, pick the concept(s) it primarily illustrates.
  5. Minimum 1, maximum 3.
  6. If the item is purely mechanical algebra in a calculus chapter, pick the calculus concept the item sets up rather than an algebra one.

Return JSON: `assignments` array, one entry per input item, same ids.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["assignments"],
    "properties": {
        "assignments": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "concepts"],
                "properties": {
                    "id":       {"type": "string"},
                    "concepts": {"type": "array", "items": {"type": "string"},
                                 "minItems": 1, "maxItems": 3},
                    "rationale": {"type": "string"},
                },
            },
        },
    },
}


KIND_BUCKET = {
    "example":         "examples",
    "exercise":        "exercises",
    "exercise_group":  "exercise_groups",
    "theorem":         "theorems",
    "figure":          "figures",
    "table":           "tables",
}


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl_atomic(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = tempfile.NamedTemporaryFile(
        mode="w", dir=path.parent, delete=False, suffix=".tmp"
    )
    try:
        for r in records:
            tmp.write(json.dumps(r) + "\n")
        tmp.close()
        Path(tmp.name).replace(path)
    except Exception:
        Path(tmp.name).unlink(missing_ok=True)
        raise


def render_candidate(c: dict) -> str:
    sec = c.get("position", {}).get("section") or c.get("source", {}).get("section") or "-"
    one = (c.get("one_liner") or "").strip()
    return f"- {c['id']}  [{c['kind']}, §{sec}]  {c['title']}\n    {one}"


def render_item(e: dict) -> str:
    # Pick the best field as the "prompt" the model will judge against.
    text = (
        e.get("prompt_md")
        or e.get("caption_md")
        or e.get("proof_md")
        or e.get("raw_body", "")
    )
    text = (text or "").strip().replace("\n", " ")
    if len(text) > 500:
        text = text[:497] + "..."
    return f"- id: {e['id']}\n  kind: {e['kind']}\n  title: {e.get('title','')}\n  text: {text}"


def build_user_message(candidates_md: str, batch: list[dict]) -> str:
    items_md = "\n\n".join(render_item(e) for e in batch)
    return (
        f"## CANDIDATES (full concept catalog)\n\n{candidates_md}\n\n"
        f"## ITEMS ({len(batch)})\n\n{items_md}\n\n"
        f"For each item, pick 1-3 concept ids from CANDIDATES."
    )


def process_batch(
    batch: list[dict],
    candidates_md: str,
    known_ids: set[str],
    model: str,
    merge_map: dict[str, str],
) -> tuple[dict[str, list[str]], list[str]]:
    user_msg = build_user_message(candidates_md, batch)
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model)
    out: dict[str, list[str]] = {}
    warns: list[str] = []
    for a in result.get("assignments", []):
        eid = a.get("id")
        raw_concepts = a.get("concepts", [])
        # Translate pre-merge ids to their canonical form
        translated = [merge_map.get(c, c) for c in raw_concepts]
        cids = [c for c in translated if c in known_ids][:3]
        invalid = [c for c in translated if c not in known_ids]
        if invalid:
            warns.append(f"{eid}: dropped invalid ids {invalid}")
        if eid and cids:
            out[eid] = cids
    return out, warns


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--concepts", type=Path, required=True)
    ap.add_argument("--items",    type=Path, required=True)
    ap.add_argument("--merge-map", type=Path, default=None,
                    help="Optional concept_merge_map.json for translating stale ids.")
    ap.add_argument("--batch-size", type=int, default=12)
    ap.add_argument("--workers",    type=int, default=16)
    ap.add_argument("--model",      default=GEMINI_DEFAULT)
    ap.add_argument("--report",     type=Path, default=Path("data3/link_report.txt"))
    args = ap.parse_args()

    merge_map: dict[str, str] = {}
    if args.merge_map and args.merge_map.exists():
        merge_map = json.loads(args.merge_map.read_text())
        print(f"merge map loaded: {len(merge_map)} stale ids will be translated",
              file=sys.stderr)

    concepts = load_jsonl(args.concepts)
    items = load_jsonl(args.items)
    concepts_by_id = {c["id"]: c for c in concepts}
    known_ids = set(concepts_by_id)

    # Split items: LLM-queried vs inherits-from-parent
    inherit_items = [it for it in items
                     if it.get("embedded_in") and it["embedded_in"] in {i["id"] for i in items}]
    inherit_ids = {it["id"] for it in inherit_items}
    query_items = [it for it in items if it["id"] not in inherit_ids]

    print(f"items total: {len(items)}; to query: {len(query_items)}; "
          f"inheriting from parent: {len(inherit_items)}", file=sys.stderr)

    # Render the full candidate list once
    candidates_md = "\n".join(render_candidate(c) for c in concepts)
    print(f"candidates payload: ~{len(candidates_md) // 4} tokens", file=sys.stderr)

    # Batch
    batches = [query_items[i:i + args.batch_size]
               for i in range(0, len(query_items), args.batch_size)]
    n_batches = len(batches)

    write_lock = threading.Lock()
    assignments: dict[str, list[str]] = {}
    done = n_warn = 0

    def run(idx_batch):
        idx, batch = idx_batch
        try:
            return idx, batch, process_batch(batch, candidates_md, known_ids, args.model, merge_map), None
        except Exception as e:
            return idx, batch, (None, []), e

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(run, (i, b)) for i, b in enumerate(batches)]
        for fut in as_completed(futures):
            idx, batch, (result, warns), err = fut.result()
            with write_lock:
                done += 1
                if err is not None:
                    print(f"[batch {done}/{n_batches}] FAILED: {err}", file=sys.stderr)
                    continue
                assignments.update(result)
                for w in warns:
                    print(f"  warn: {w}", file=sys.stderr)
                    n_warn += 1
                print(f"[batch {done}/{n_batches}] {len(result)}/{len(batch)} mapped",
                      file=sys.stderr)

    # Second pass: resolve inheritance. Embedded figures/tables get their
    # parent's concepts. Also propagate exercise_group concepts from the
    # union of their sub-items (if any sub-item concepts came back from LLM).
    items_by_id = {it["id"]: it for it in items}
    # inheritors from parent
    for it in inherit_items:
        parent_id = it["embedded_in"]
        parent = items_by_id.get(parent_id)
        if parent is None:
            continue
        parent_concepts = assignments.get(parent_id, parent.get("concepts") or [])
        if parent_concepts:
            assignments[it["id"]] = list(parent_concepts)

    # exercise_group: union of sub-items' concepts, if group itself wasn't
    # specifically linked well by the LLM. Keep LLM's choice if present.
    for it in items:
        if it.get("kind") != "exercise_group":
            continue
        gid = it["id"]
        if gid in assignments and assignments[gid]:
            continue
        subs = it.get("sub_item_ids") or []
        sub_concepts = []
        for sid in subs:
            sub_concepts.extend(assignments.get(sid, []))
        if sub_concepts:
            # Most-common first
            c = Counter(sub_concepts)
            assignments[gid] = [cid for cid, _ in c.most_common(3)]

    # Apply to items
    changed = 0
    for it in items:
        new = assignments.get(it["id"])
        if new is not None:
            old = sorted(it.get("concepts") or [])
            if sorted(new) != old:
                changed += 1
            it["concepts"] = new

    # Rebuild concept.item_ids buckets
    for c in concepts:
        c["item_ids"] = {
            "theorems": [], "examples": [], "exercises": [],
            "exercise_groups": [], "figures": [], "tables": [],
        }
    for it in items:
        bucket = KIND_BUCKET.get(it.get("kind"))
        if not bucket:
            continue
        for cid in it.get("concepts", []):
            c = concepts_by_id.get(cid)
            if c is not None:
                c["item_ids"][bucket].append(it["id"])

    write_jsonl_atomic(args.items, items)
    write_jsonl_atomic(args.concepts, concepts)

    # Report
    new_counts = Counter()
    for it in items:
        if it.get("kind") not in ("exercise", "example"): continue
        for cid in it.get("concepts") or []:
            new_counts[cid] += 1

    lines = [
        f"Link report",
        f"items queried (LLM): {len(query_items)}",
        f"items inherited:     {len(inherit_items)}",
        f"changed assignments: {changed}",
        f"warnings:            {n_warn}",
        "",
        "=== top-10 most-linked concepts (exercises+examples only) ===",
    ]
    for cid, n in new_counts.most_common(10):
        lines.append(f"  {n:4d}  {cid}")
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
