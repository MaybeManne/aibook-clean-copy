#!/usr/bin/env python3
"""
Programmatic verification of concept title grounding.

For each extracted concept with a `title_line` field:
  1. Look up that line in book.numbered.md
  2. Check if the concept title appears in the line text (case-insensitive)
  3. Report pass/fail per concept and summary per chapter

Output: title_verification.jsonl  (one record per concept)
        title_verification_summary.json  (per-chapter pass rates)

Usage:
    python verify_titles.py \
        --numbered   data_vision/book.numbered.md \
        --concepts   data_vision/pass_a_concepts.jsonl \
        --out        data_vision/title_verification.jsonl \
        --summary    data_vision/title_verification_summary.json
"""
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path


def load_numbered(path: Path) -> dict[str, str]:
    """Return {marker: body_text} for every line."""
    import re
    LINE_RE = re.compile(r"^L(\d{5}): (.*)$")
    lines = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if m:
            lines[f"L{m.group(1)}"] = m.group(2)
    return lines


def verify_concept(concept: dict, lines: dict[str, str]) -> dict:
    title      = concept.get("title", "")
    title_line = concept.get("title_line", "")
    cid        = concept.get("id", "?")
    chunk_id   = concept.get("chunk_id", "?")
    chapter    = concept.get("position", {}).get("chapter") or chunk_id

    result = {
        "id":         cid,
        "title":      title,
        "title_line": title_line,
        "chunk_id":   chunk_id,
        "chapter":    chapter,
    }

    if not title_line:
        result["status"] = "no_title_line"
        result["pass"]   = False
        return result

    body = lines.get(title_line)
    if body is None:
        result["status"] = "line_not_found"
        result["pass"]   = False
        return result

    # Check if any word of the title appears in the line (case-insensitive)
    # Use the full title first, then fall back to key words
    title_lower = title.lower()
    body_lower  = body.lower()

    if title_lower in body_lower:
        result["status"] = "exact_match"
        result["pass"]   = True
    else:
        # Partial: check if majority of title words are present
        words = [w for w in title_lower.split() if len(w) > 3]
        if words and sum(1 for w in words if w in body_lower) / len(words) >= 0.6:
            result["status"] = "partial_match"
            result["pass"]   = True
        else:
            result["status"] = "no_match"
            result["pass"]   = False
            result["line_text"] = body[:200]

    return result


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered",  type=Path, required=True)
    ap.add_argument("--concepts",  type=Path, required=True)
    ap.add_argument("--out",       type=Path, required=True)
    ap.add_argument("--summary",   type=Path, required=True)
    args = ap.parse_args()

    lines    = load_numbered(args.numbered)
    concepts = [json.loads(l) for l in args.concepts.read_text().splitlines() if l.strip()]

    results  = [verify_concept(c, lines) for c in concepts]

    # Write per-concept results
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("w") as f:
        for r in results:
            f.write(json.dumps(r) + "\n")

    # Per-chapter summary
    by_chapter: dict[str, list[dict]] = defaultdict(list)
    for r in results:
        by_chapter[str(r["chapter"])].append(r)

    summary = {}
    for ch, recs in sorted(by_chapter.items()):
        total     = len(recs)
        passed    = sum(1 for r in recs if r["pass"])
        no_line   = sum(1 for r in recs if r["status"] == "no_title_line")
        failed    = [r for r in recs if not r["pass"] and r["status"] != "no_title_line"]
        summary[ch] = {
            "total":   total,
            "passed":  passed,
            "no_title_line": no_line,
            "failed":  len(failed),
            "pass_rate": round(passed / total, 2) if total else 0,
            "failed_ids": [r["id"] for r in failed],
        }
        flag = "" if passed / total >= 0.8 else "  ⚠"
        print(f"  ch{ch:>3}: {passed}/{total} pass ({100*passed//total}%){flag}")

    args.summary.write_text(json.dumps(summary, indent=2) + "\n")
    total_all  = len(results)
    passed_all = sum(1 for r in results if r["pass"])
    print(f"\nOverall: {passed_all}/{total_all} concepts verified "
          f"({100*passed_all//total_all}%)")
    print(f"Results → {args.out}")
    print(f"Summary → {args.summary}")


if __name__ == "__main__":
    main()
