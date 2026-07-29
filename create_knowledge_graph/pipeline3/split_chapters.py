#!/usr/bin/env python3
"""
Split the whole-book concept-graph-vision-data.json into per-chapter JSON files
that concept-graph.html can load directly via its adaptPipelineGraph() path.

Output: chapter_graphs/ch01.json … ch55.json  (at the repo root)

Usage:
    python split_chapters.py \
        --data /path/to/concept-graph-vision-data.json \
        --out-dir /path/to/chapter_graphs
"""
import argparse, json, os
from pathlib import Path
from collections import defaultdict


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="concept-graph-vision-data.json")
    ap.add_argument("--out-dir", default="chapter_graphs")
    args = ap.parse_args()

    data = json.loads(Path(args.data).read_text())
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Index chapters
    chapters_meta = {c["chapter"]: c for c in data.get("chapters", [])}

    # Group concepts by chapter
    by_chapter = defaultdict(list)
    for c in data.get("concepts", []):
        ch = c.get("position", {}).get("chapter") or 0
        by_chapter[ch].append(c)

    # Index concept ids per chapter for edge filtering
    all_concept_chapters = {
        c["id"]: (c.get("position", {}).get("chapter") or 0)
        for c in data.get("concepts", [])
    }

    # Group edges by chapter (intra-chapter only for clean Dagre layout)
    prereq_by_ch = defaultdict(list)
    for e in data.get("edges", {}).get("prereq", []):
        ch_from = all_concept_chapters.get(e["from"])
        ch_to   = all_concept_chapters.get(e["to"])
        if ch_from == ch_to and ch_from:
            prereq_by_ch[ch_from].append(e)

    overlay_by_ch = defaultdict(list)
    for e in data.get("edges", {}).get("overlay", []):
        ch_from = all_concept_chapters.get(e["from"])
        ch_to   = all_concept_chapters.get(e["to"])
        if ch_from == ch_to and ch_from:
            overlay_by_ch[ch_from].append(e)

    chapters_written = 0
    for ch_num, concepts in sorted(by_chapter.items()):
        if not ch_num:
            continue
        meta = chapters_meta.get(ch_num, {})
        ch_title = meta.get("chapter_title", f"Chapter {ch_num}")

        # Enrich slots: use verbatim fill_slots data when available
        def get_slot(c, slot):
            val = c.get(slot)
            if isinstance(val, dict):
                return val.get("text") or None
            return val or None

        enriched = []
        for c in concepts:
            enriched.append({
                **c,
                # Expose slots in a flat way adaptPipelineGraph can use,
                # and also keep the nested form for concept-graph-vision.html
                "slots": {
                    "motivation":  get_slot(c, "motivation") or c.get("motivation_md"),
                    "key_passage": get_slot(c, "key_passage") or c.get("recap_md"),
                    "question":    get_slot(c, "question"),
                    # prefer verbatim example from fill_slots; fall back to Pass B content
                    "example":     get_slot(c, "example") or c.get("content") or c.get("one_liner"),
                },
            })

        bundle = {
            "meta": {
                "source":  "pipeline3",
                "chapter": ch_num,
                "counts": {
                    "concepts":      len(concepts),
                    "edges_prereq":  len(prereq_by_ch[ch_num]),
                    "edges_overlay": len(overlay_by_ch[ch_num]),
                },
            },
            "chapterTitle": f"Ch {ch_num}. {ch_title}",
            "concepts": enriched,
            "edges": {
                "prereq":  prereq_by_ch[ch_num],
                "overlay": overlay_by_ch[ch_num],
            },
        }

        fname = out_dir / f"ch{ch_num:02d}.json"
        fname.write_text(json.dumps(bundle))
        chapters_written += 1
        print(f"  ch{ch_num:02d}  {len(concepts):3d} concepts  "
              f"{len(prereq_by_ch[ch_num]):3d} prereq  — {ch_title}")

    print(f"\n{chapters_written} chapter files written to {out_dir}/")


if __name__ == "__main__":
    main()
