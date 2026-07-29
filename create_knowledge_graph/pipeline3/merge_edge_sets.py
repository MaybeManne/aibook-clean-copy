#!/usr/bin/env python3
"""Deterministically merge base and supplemental edge files without overwriting either."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as handle:
        return [json.loads(line) for line in handle if line.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def edge_key(edge: dict) -> tuple[str, str, str]:
    return (
        str(edge.get("from") or ""),
        str(edge.get("to") or ""),
        str(edge.get("kind") or ""),
    )


def stable_edge_id(key: tuple[str, str, str]) -> str:
    digest = hashlib.sha256("\0".join(key).encode()).hexdigest()[:16]
    return f"edge_{digest}"


def merge_group(base: list[dict], supplemental: list[dict]) -> tuple[list[dict], int]:
    grouped: dict[tuple[str, str, str], list[tuple[str, dict]]] = {}
    for source, edges in (("base", base), ("local_audit", supplemental)):
        for edge in edges:
            key = edge_key(edge)
            if not all(key):
                continue
            grouped.setdefault(key, []).append((source, edge))

    merged: list[dict] = []
    duplicates = 0
    for key, candidates in grouped.items():
        duplicates += len(candidates) - 1
        candidates.sort(
            key=lambda item: (
                bool(item[1].get("semantic_verified")),
                float(item[1].get("semantic_confidence") or 0.0),
                float(item[1].get("strength") or item[1].get("confidence") or 0.0),
                item[0] == "base",
            ),
            reverse=True,
        )
        winner = dict(candidates[0][1])
        winner["edge_id"] = winner.get("edge_id") or stable_edge_id(key)
        winner["merge_sources"] = sorted({source for source, _ in candidates})
        merged.append(winner)
    merged.sort(key=lambda edge: edge_key(edge))
    return merged, duplicates


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-prereq", type=Path, required=True)
    parser.add_argument("--base-overlay", type=Path, required=True)
    parser.add_argument("--supplemental-prereq", type=Path, required=True)
    parser.add_argument("--supplemental-overlay", type=Path, required=True)
    parser.add_argument("--out-prereq", type=Path, required=True)
    parser.add_argument("--out-overlay", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    base_prereq = load_jsonl(args.base_prereq)
    base_overlay = load_jsonl(args.base_overlay)
    supplemental_prereq = load_jsonl(args.supplemental_prereq)
    supplemental_overlay = load_jsonl(args.supplemental_overlay)
    prereq, prereq_duplicates = merge_group(base_prereq, supplemental_prereq)
    overlay, overlay_duplicates = merge_group(base_overlay, supplemental_overlay)

    write_jsonl(args.out_prereq, prereq)
    write_jsonl(args.out_overlay, overlay)
    report = {
        "base": {
            "prereq": len(base_prereq),
            "overlay": len(base_overlay),
        },
        "supplemental": {
            "prereq": len(supplemental_prereq),
            "overlay": len(supplemental_overlay),
        },
        "merged": {
            "prereq": len(prereq),
            "overlay": len(overlay),
        },
        "duplicates_collapsed": prereq_duplicates + overlay_duplicates,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
