#!/usr/bin/env python3
"""
Repair hard-failed items from Pass B (v2).

In v2 the verifier only hard-fails on structural problems (missing prompt_md,
missing difficulty, no LLM output). Quality flags no longer gate. So this
repair loop is rare and small.

Usage:
    python repair_items.py \
        --failures data2/items.failures.jsonl \
        --items    data2/items.jsonl \
        [--batch-size 3] [--workers 6]
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT

from format_items import (
    SYSTEM_PROMPT as BASE_SYSTEM_PROMPT,
    OUTPUT_SCHEMA, build_batch_message, check_formatted, merge,
)


REPAIR_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT + """

## Repair mode

A previous attempt on these items was flagged for one of these problems:
  - missing prompt_md / difficulty on example/exercise/exercise_group
  - missing theorem statement / figure caption
  - batch-level parse failure on the previous attempt

Be extra careful:
  1. Every `$` paired.
  2. prompt_md / caption_md are ALWAYS populated for their kind.
  3. difficulty is ALWAYS set for exercise/example/exercise_group.
"""


def read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--failures",   type=Path, required=True)
    ap.add_argument("--items",      type=Path, required=True)
    ap.add_argument("--out-still-failing", type=Path, default=None)
    ap.add_argument("--batch-size", type=int, default=3)
    ap.add_argument("--workers",    type=int, default=6)
    ap.add_argument("--model",      default=GEMINI_DEFAULT)
    args = ap.parse_args()

    still_path = args.out_still_failing or args.failures.with_suffix(".still.jsonl")
    failures = read_jsonl(args.failures)
    print(f"failures to repair: {len(failures)}", file=sys.stderr)
    if not failures:
        return

    batch_input = [{k: v for k, v in r.items() if k != "_hard_issue"}
                   for r in failures if r.get("raw_body")]
    batches = [batch_input[i:i + args.batch_size]
               for i in range(0, len(batch_input), args.batch_size)]

    write_lock = threading.Lock()
    done = 0
    repaired: dict[str, dict] = {}
    still: list[dict] = []
    n_batches = len(batches)

    def run(idx_batch):
        idx, batch = idx_batch
        try:
            user_msg = build_batch_message(batch)
            result = call_llm_json(REPAIR_SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA,
                                   model=args.model)
            fmt_by_id = {r["id"]: r for r in result.get("items", []) if r.get("id")}
            return idx, batch, fmt_by_id, None
        except Exception as e:
            return idx, batch, None, e

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(run, (i, b)) for i, b in enumerate(batches)]
        for fut in as_completed(futures):
            idx, batch, fmt_by_id, err = fut.result()
            with write_lock:
                done += 1
                if err is not None:
                    print(f"[batch {done}/{n_batches}] FAIL: {err}", file=sys.stderr)
                    for rec in batch:
                        still.append({**rec, "_hard_issue": f"repair_failed: {err}"})
                    continue
                for rec in batch:
                    fmt = fmt_by_id.get(rec["id"])
                    if not fmt:
                        still.append({**rec, "_hard_issue": "no repair output"})
                        continue
                    flags = check_formatted(rec, fmt)
                    merged = merge(rec, fmt, args.model)
                    if flags:
                        merged["quality_flags"] = sorted(set(merged.get("quality_flags", []) + flags))
                    repaired[rec["id"]] = merged
                print(f"[batch {done}/{n_batches}] ok", file=sys.stderr)

    print(f"\nrepaired: {len(repaired)}, still failing: {len(still)}", file=sys.stderr)

    if repaired:
        items = read_jsonl(args.items)
        by_id = {r["id"]: r for r in items}
        for rid, rec in repaired.items():
            by_id[rid] = rec
        seen: set[str] = set()
        new_list: list[dict] = []
        for r in items:
            new_list.append(by_id[r["id"]]); seen.add(r["id"])
        for rid, rec in by_id.items():
            if rid not in seen:
                new_list.append(rec)
        tmp = tempfile.NamedTemporaryFile(mode="w", dir=args.items.parent,
                                          delete=False, suffix=".tmp")
        try:
            for r in new_list:
                tmp.write(json.dumps(r) + "\n")
            tmp.close()
            Path(tmp.name).replace(args.items)
        except Exception:
            Path(tmp.name).unlink(missing_ok=True)
            raise

    with still_path.open("w") as f:
        for r in still:
            f.write(json.dumps(r) + "\n")
    print(f"items updated: {args.items}", file=sys.stderr)
    print(f"still failing: {still_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
