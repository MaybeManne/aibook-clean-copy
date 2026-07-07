#!/usr/bin/env python3
"""
Move `raw_body` from main record files into side files keyed by id.

Post-processing step that runs AFTER all Pass B / linking / edge extraction is
done. Produces:

    concepts.raw.jsonl    { id, raw_body }  — for debugging + re-cleaning
    items.raw.jsonl       { id, raw_body }

And rewrites the main files (concepts.jsonl, items.jsonl) without the
raw_body field so they're leaner for downstream consumers.

Idempotent: running twice is fine (the side file is regenerated from main
files — if they no longer have raw_body, the side file is empty or unchanged
depending on whether the previous side file is used as a fallback source).

Usage:
    python split_raw_body.py \
        --concepts data3/concepts.jsonl \
        --items    data3/items.jsonl \
        --out-concepts-raw data3/concepts.raw.jsonl \
        --out-items-raw    data3/items.raw.jsonl
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path


def process(
    main_path: Path,
    raw_out: Path,
) -> tuple[int, int]:
    """Read main file, write raw side file, rewrite main without raw_body.
    Returns (n_records, n_with_raw_body)."""
    records: list[dict] = []
    with main_path.open() as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))

    # Write side file (only records that actually have raw_body)
    raw_out.parent.mkdir(parents=True, exist_ok=True)
    n_with_raw = 0
    with raw_out.open("w") as f:
        for r in records:
            rb = r.get("raw_body")
            if rb is None:
                continue
            f.write(json.dumps({"id": r["id"], "raw_body": rb}) + "\n")
            n_with_raw += 1

    # Rewrite main file without raw_body
    tmp = tempfile.NamedTemporaryFile(
        mode="w", dir=main_path.parent, delete=False, suffix=".tmp"
    )
    try:
        for r in records:
            r_clean = {k: v for k, v in r.items() if k != "raw_body"}
            tmp.write(json.dumps(r_clean) + "\n")
        tmp.close()
        Path(tmp.name).replace(main_path)
    except Exception:
        Path(tmp.name).unlink(missing_ok=True)
        raise

    return len(records), n_with_raw


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--concepts",          type=Path, required=True)
    ap.add_argument("--items",             type=Path, required=True)
    ap.add_argument("--out-concepts-raw",  type=Path, required=True)
    ap.add_argument("--out-items-raw",     type=Path, required=True)
    args = ap.parse_args()

    n_c, n_cr = process(args.concepts, args.out_concepts_raw)
    n_i, n_ir = process(args.items,    args.out_items_raw)

    print(f"concepts: {n_c} records, {n_cr} with raw_body → "
          f"{args.out_concepts_raw}", file=sys.stderr)
    print(f"items:    {n_i} records, {n_ir} with raw_body → "
          f"{args.out_items_raw}", file=sys.stderr)
    print(f"main files rewritten without raw_body", file=sys.stderr)


if __name__ == "__main__":
    main()
