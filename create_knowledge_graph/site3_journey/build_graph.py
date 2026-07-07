#!/usr/bin/env python3
"""Emit graph.json for the journey (timeline) visualization.

Reads from data2/ which has position.book_order on every node.

Output shape:
  {
    "chapters":  [{num, title, book_order_start, book_order_end}, ...],
    "sections":  [{id, chapter, title, book_order, item_count, concept_ids}, ...],
    "concepts":  [{id, kind, title, one_liner, summary_md, ..., book_order, section}, ...],
    "items":     [{id, kind, title, parent_concept, section_id, book_order}, ...]
       (minimal payload; full item body fetched lazily if needed)
    "edges":     [{from, to, kind, rationale, span}, ...]
        span = |book_order_from - book_order_to|; precomputed so the frontend
        can render arcs without recomputing.
    "item_bins": [{section_id, count, concept_id_sample}]
        one entry per section for the density histogram.
  }
"""
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data2"
OUT = Path(__file__).resolve().parent / "graph.json"


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(line) for line in f if line.strip()]


def main() -> int:
    concepts = load_jsonl(DATA / "concepts.jsonl")
    items = load_jsonl(DATA / "items.jsonl")
    chapters = load_jsonl(DATA / "chapters.jsonl")
    sections = load_jsonl(DATA / "sections.jsonl")
    prereq = load_jsonl(DATA / "edges_prereq.validated.jsonl")
    overlay = load_jsonl(DATA / "edges_overlay.validated.jsonl")

    # Build URL -> asset_id map so the frontend can swap every Mathpix URL
    # for the locally cached file. asset_id is the basename of the local path.
    # Salvage edges that were dropped only because the LLM wrote a line-range
    # like "L11038-L11041" instead of a single marker "L11038". The edge is
    # pedagogically fine; only its evidence_span format is off. Without this,
    # whole sections (e.g. 4.8) end up with zero edges in the graph.
    review_queue = load_jsonl(DATA / "edges_review_queue.jsonl")
    salvaged_prereq: list[dict] = []
    salvaged_overlay: list[dict] = []
    for e in review_queue:
        reason = e.get("_reason", "") or ""
        # Keep if it was rejected purely for bad line-marker format.
        if "not a line marker" in reason and "cycle" not in reason.lower():
            clone = {k: v for k, v in e.items() if k != "_reason"}
            if reason.startswith("prereq"):
                salvaged_prereq.append(clone)
            elif reason.startswith("overlay"):
                salvaged_overlay.append(clone)
    print(f"salvaged from review_queue: {len(salvaged_prereq)} prereq + "
          f"{len(salvaged_overlay)} overlay")

    image_manifest = load_jsonl(DATA / "images.jsonl")
    url_to_asset: dict[str, str] = {}
    for img in image_manifest:
        if img.get("status") != "ok":
            continue
        url = img.get("url")
        asset = img.get("asset_id")
        if url and asset:
            url_to_asset[url] = asset

    concept_by_id = {c["id"]: c for c in concepts}

    # Concept payload trimmed for timeline rendering; full body is included since
    # we want the detail panel to render without a second fetch.
    concept_out = []
    for c in concepts:
        pos = c.get("position") or {}
        concept_out.append({
            "id": c["id"],
            "kind": c["kind"],
            "title": c.get("title", c["id"]),
            "one_liner": c.get("one_liner", ""),
            "summary_md": c.get("summary_md", ""),
            "motivation_md": c.get("motivation_md", ""),
            "recap_md": c.get("recap_md", ""),
            "raw_body": c.get("raw_body", ""),
            "tags": c.get("tags", []),
            "aliases": c.get("aliases", []),
            "book_order": pos.get("book_order"),
            "chapter": pos.get("chapter"),
            "section": pos.get("section"),
            "section_title": pos.get("section_title", ""),
            "concept_order_in_section": pos.get("concept_order_in_section"),
            "first_line": pos.get("first_line"),
        })
    concept_out.sort(key=lambda c: c["book_order"] or 1e9)

    # Items: keep just what the sidebar needs. The density-band visualization
    # only cares about counts per section; the sidebar wants bodies.
    item_out = []
    for it in items:
        pos = it.get("position") or {}
        linked = (it.get("concepts") or [])
        # parent_concept: first linked concept (matches site2 convention)
        parent = next((cid for cid in linked if cid in concept_by_id), None)
        item_out.append({
            "id": it["id"],
            "kind": it["kind"],
            "title": it.get("title", it["id"]),
            "prompt_md": it.get("prompt_md", ""),
            "solution_md": it.get("solution_md", ""),
            "answer": it.get("answer"),
            "caption_md": it.get("caption_md", ""),
            "proof_md": it.get("proof_md", ""),
            "difficulty": it.get("difficulty"),
            "raw_body": it.get("raw_body", ""),
            "concepts": linked,
            "parent_concept": parent,
            "embedded_in": it.get("embedded_in"),
            "parent_group_id": it.get("parent_group_id"),
            "section": pos.get("section"),
            "book_order": pos.get("book_order"),
            "item_order_in_section": pos.get("item_order_in_section"),
        })
    item_out.sort(key=lambda i: (i.get("book_order") or 1e9))

    # Per-section density bins.
    item_counts: Counter[str] = Counter()
    concepts_by_section: dict[str, list[str]] = defaultdict(list)
    for it in item_out:
        if it["section"]:
            # Count only leaf exercises/examples (not groups or embedded figures)
            # so the histogram reflects practice density, not inflated group rows.
            if it["kind"] not in ("exercise_group",) and not it.get("embedded_in"):
                item_counts[it["section"]] += 1
    for c in concept_out:
        if c["section"]:
            concepts_by_section[c["section"]].append(c["id"])

    section_out = []
    for s in sections:
        sid = s["section"]
        section_out.append({
            "id": sid,
            "chapter": s["chapter"],
            "chapter_title": s["chapter_title"],
            "title": s["section_title"],
            "book_order": s["book_order"],
            "start_line": s.get("start_line"),
            "end_line": s.get("end_line"),
            "item_count": item_counts.get(sid, 0),
            "concept_ids": concepts_by_section.get(sid, []),
        })
    section_out.sort(key=lambda s: s["book_order"])

    # Chapter bounds: first/last book_order of their sections.
    chapter_out = []
    for ch in chapters:
        sections_in = [s for s in section_out if s["chapter"] == ch["chapter"]]
        if not sections_in:
            continue
        chapter_out.append({
            "num": ch["chapter"],
            "title": ch["chapter_title"],
            "section_range": (sections_in[0]["id"], sections_in[-1]["id"]),
            "book_order_range": (sections_in[0]["book_order"], sections_in[-1]["book_order"]),
        })
    chapter_out.sort(key=lambda c: c["num"])

    # Edges: concept<->concept only (items don't sit on the timeline). Drop any
    # edge whose endpoint is missing from the concept set. Precompute the span
    # so the frontend can render arcs without a second lookup.
    order_by_id = {c["id"]: c["book_order"] for c in concept_out if c["book_order"] is not None}

    def edge_with_span(e: dict) -> dict | None:
        if e["from"] not in order_by_id or e["to"] not in order_by_id:
            return None
        return {
            "from": e["from"],
            "to": e["to"],
            "kind": e["kind"],
            "rationale": e.get("rationale", ""),
            "strength": e.get("strength"),
            "span": abs(order_by_id[e["from"]] - order_by_id[e["to"]]),
        }

    edges_out: list[dict] = []
    for e in prereq + overlay + salvaged_prereq + salvaged_overlay:
        eo = edge_with_span(e)
        if eo is not None:
            edges_out.append(eo)

    graph = {
        "chapters": chapter_out,
        "sections": section_out,
        "concepts": concept_out,
        "items": item_out,
        "edges": edges_out,
        "image_urls": url_to_asset,  # mathpix url -> local asset_id
    }
    OUT.write_text(json.dumps(graph, separators=(",", ":")))

    print(f"wrote {OUT}")
    print(f"chapters: {len(chapter_out)}")
    print(f"sections: {len(section_out)}")
    print(f"concepts: {len(concept_out)}")
    by_kind = Counter(c["kind"] for c in concept_out)
    for k, v in by_kind.most_common():
        print(f"  {k:<12} {v}")
    print(f"items: {len(item_out)}")
    by_ikind = Counter(i["kind"] for i in item_out)
    for k, v in by_ikind.most_common():
        print(f"  {k:<16} {v}")
    print(f"edges: {len(edges_out)}")
    by_ekind = Counter(e["kind"] for e in edges_out)
    for k, v in by_ekind.most_common():
        print(f"  {k:<18} {v}")

    # Longest-span requires edges are the "plot twists" of the journey.
    long_reqs = sorted([e for e in edges_out if e["kind"] == "requires"],
                       key=lambda e: -e["span"])[:5]
    print("top-5 longest requires spans:")
    for e in long_reqs:
        print(f"  {e['from']} <- {e['to']}  (span={e['span']})")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
