#!/usr/bin/env python3
"""
Bundle the whole knowledge graph into a single graph.json for downstream consumers.

Reads all the pipeline's jsonl artifacts and emits one JSON document:

    {
      "meta": {
        "source_file": "book_raw.md",
        "generated_at": "<ISO timestamp>",
        "counts": { "concepts": 299, "items": 2961, "edges_prereq": 398, ... }
      },
      "chapters":   [ ... ],
      "sections":   [ ... ],
      "concepts":   [ ... ],
      "items":      [ ... ],
      "images":     [ ... ],
      "edges": {
        "prereq":   [ ... ],
        "overlay":  [ ... ]
      }
    }

Pure program. Missing inputs are skipped silently (the field is just absent in
the output). Also writes a parallel `graph.indexed.json` with maps keyed by id
if `--with-indexes` is set — useful for tools that want O(1) lookup without
building the index themselves.

Usage:
    python merge_graph.py \
        --data-dir data3 \
        --out data3/graph.json \
        [--with-indexes]
    # Or against a different run:
    python merge_graph.py --data-dir data2 --out data2/graph.json
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def prefer_validated(data_dir: Path, base: str) -> Path:
    """Return <base>.validated.jsonl if it exists, else <base>.jsonl."""
    v = data_dir / f"{base}.validated.jsonl"
    if v.exists():
        return v
    return data_dir / f"{base}.jsonl"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--data-dir", type=Path, required=True,
                    help="Directory with pipeline outputs (e.g. data3/).")
    ap.add_argument("--out",      type=Path, required=True,
                    help="Output JSON file.")
    ap.add_argument("--with-indexes", action="store_true",
                    help="Also emit <out>.indexed.json with {concepts, items, images}"
                         " dicts keyed by id.")
    ap.add_argument("--compact", action="store_true",
                    help="Emit minified JSON (default: indented, newline per record).")
    ap.add_argument("--source-file", type=str, default=None,
                    help="Override the source_file recorded in meta.")
    args = ap.parse_args()

    d = args.data_dir

    chapters = load_jsonl(d / "chapters.jsonl")
    sections = load_jsonl(d / "sections.jsonl")
    concepts = load_jsonl(d / "concepts.jsonl")
    items    = load_jsonl(d / "items.jsonl")
    images   = load_jsonl(d / "images.jsonl")
    edges_prereq  = load_jsonl(prefer_validated(d, "edges_prereq"))
    edges_overlay = load_jsonl(prefer_validated(d, "edges_overlay"))

    # Source file: guess from what's in the data dir
    source_file = args.source_file
    if source_file is None:
        for candidate in ("book_raw.md", "book.enriched.md"):
            if (d / candidate).exists():
                source_file = candidate
                break

    meta = {
        "source_file":  source_file,
        "data_dir":     str(d),
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "counts": {
            "chapters":      len(chapters),
            "sections":      len(sections),
            "concepts":      len(concepts),
            "items":         len(items),
            "images":        len(images),
            "edges_prereq":  len(edges_prereq),
            "edges_overlay": len(edges_overlay),
        },
        "edge_kinds_overlay": sorted({e.get("kind") for e in edges_overlay}),
    }

    graph = {
        "meta":     meta,
        "chapters": chapters,
        "sections": sections,
        "concepts": concepts,
        "items":    items,
        "images":   images,
        "edges": {
            "prereq":  edges_prereq,
            "overlay": edges_overlay,
        },
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    if args.compact:
        args.out.write_text(json.dumps(graph, ensure_ascii=False))
    else:
        args.out.write_text(json.dumps(graph, indent=2, ensure_ascii=False) + "\n")

    size_mb = args.out.stat().st_size / (1024 * 1024)
    print(f"wrote {args.out}  ({size_mb:.1f} MB)", file=sys.stderr)
    print(f"  counts: {meta['counts']}", file=sys.stderr)

    if args.with_indexes:
        indexed = {
            "meta":        meta,
            "concepts_by_id": {c["id"]: c for c in concepts if "id" in c},
            "items_by_id":    {i["id"]: i for i in items    if "id" in i},
            "images_by_id":   {a["asset_id"]: a for a in images if "asset_id" in a},
            "prereq_out":     _group_edges(edges_prereq,  "from"),
            "prereq_in":      _group_edges(edges_prereq,  "to"),
            "overlay_out":    _group_edges(edges_overlay, "from"),
            "overlay_in":     _group_edges(edges_overlay, "to"),
        }
        idx_path = args.out.with_suffix(".indexed.json")
        if args.compact:
            idx_path.write_text(json.dumps(indexed, ensure_ascii=False))
        else:
            idx_path.write_text(json.dumps(indexed, indent=2, ensure_ascii=False) + "\n")
        size_mb = idx_path.stat().st_size / (1024 * 1024)
        print(f"wrote {idx_path}  ({size_mb:.1f} MB)", file=sys.stderr)


def _group_edges(edges: list[dict], key: str) -> dict[str, list[dict]]:
    """Index edges by `from` or `to` so lookups are O(1)."""
    out: dict[str, list[dict]] = {}
    for e in edges:
        k = e.get(key)
        if k is None:
            continue
        out.setdefault(k, []).append(e)
    return out


if __name__ == "__main__":
    main()
