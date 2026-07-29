#!/usr/bin/env python3
"""
repatch_ch3.py — surgically rebuild Ch3 in concept-graph-vision-data.json
from a fresh Pass A output (pass_a_concepts.ch3.jsonl).

Steps for each new Ch3 concept:
  1. Splice raw_body from book.numbered.md using its source.spans.
  2. Build position (chapter, section, ordering) from sections.jsonl / chapters.jsonl.
  3. Call format_concepts LLM to fill one_liner / content / motivation_md / recap_md / tags / aliases.
  4. Call fill_slots LLM to fill key_passage / motivation / example / question.
  5. Replace all Ch3 concepts (and Ch3-internal edges that lose endpoints) in concept-graph-vision-data.json.
  6. Re-run split_chapters.py to refresh chapter_graphs/ch03.json.

Usage:
    python repatch_ch3.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Pipeline imports
PIPE_DIR = Path(__file__).parent / "pipeline3"
sys.path.insert(0, str(PIPE_DIR))

from splice import (  # noqa: E402
    load_numbered,
    load_jsonl,
    splice_record_body,
    section_for_line,
    chapter_for_line,
)
from spans import first_line as spans_first_line, normalize_spans  # noqa: E402
from llm import call_llm_json, OPENAI_DEFAULT  # noqa: E402
from format_concepts import (  # noqa: E402
    SYSTEM_PROMPT as FORMAT_SYS_PROMPT,
    OUTPUT_SCHEMA as FORMAT_SCHEMA,
    build_batch_message,
    _sanitize_figure_tokens,
)
from fill_slots import (  # noqa: E402
    SYSTEM_PROMPT as SLOT_SYS_PROMPT,
    OUTPUT_SCHEMA as SLOT_SCHEMA,
    _build_prompt as build_slot_prompt,
    _clean,
)

ROOT = Path(__file__).parent.parent
DATA = Path(__file__).parent / "data_vision_v2"
PASS_A_CH3 = DATA / "pass_a_concepts.ch3.jsonl"
NUMBERED = DATA / "book.numbered.md"
SECTIONS = DATA / "sections.jsonl"
CHAPTERS = DATA / "chapters.jsonl"
VIEWER_JSON = ROOT / "concept-graph-vision-data.json"
SPLIT_SCRIPT = PIPE_DIR / "split_chapters.py"
CHAPTER_GRAPHS = ROOT / "chapter_graphs"

MODEL = OPENAI_DEFAULT  # gpt-4.1-mini for downstream (matches existing book)
PASS_A_MODEL = "gpt-4.1"  # what we ran the new pass_a with


def promote(rec: dict, numbered: dict[int, str]) -> dict:
    """Slice raw_body, attach base metadata. Mirrors splice.promote_concept."""
    normalize_spans(rec)
    spans = rec.get("source", {}).get("spans") or [rec["source"]["span"]]
    body = splice_record_body(numbered, rec)
    return {
        "id": rec["id"],
        "kind": rec["kind"],
        "title": rec["title"],
        "aliases": [],
        "tags": [],
        "item_ids": {
            "theorems": [], "examples": [], "exercises": [],
            "exercise_groups": [], "figures": [], "tables": [],
        },
        "source": {
            "file": NUMBERED.name,
            "spans": list(spans),
        },
        "raw_body": body,
        "extraction": {"pass_a_model": PASS_A_MODEL, "verified": True},
    }


def attach_position(rec: dict, sections: list[dict], chapters: list[dict],
                    section_concept_order: dict[str, list[str]],
                    book_order: int) -> None:
    first = spans_first_line(rec)
    chap = chapter_for_line(first, chapters)
    sec = section_for_line(first, sections)
    pos: dict = {"first_line": first}
    if chap:
        pos["chapter"] = chap["chapter"]
        pos["chapter_title"] = chap["chapter_title"]
    if sec:
        pos["section"] = sec["section"]
        pos["section_title"] = sec["section_title"]
        pos["section_order"] = sec["section_order"]
        rec["source"]["section"] = sec["section"]
    pos["book_order"] = book_order
    # rank inside section
    section_key = sec["section"] if sec else "?"
    section_concept_order.setdefault(section_key, []).append(rec["id"])
    pos["concept_order_in_section"] = len(section_concept_order[section_key])
    rec["position"] = pos


def format_one(rec: dict, model: str) -> dict | None:
    """Run format_concepts on a single record. Returns the merged fmt dict, or None on failure."""
    user = build_batch_message([rec])
    try:
        result = call_llm_json(FORMAT_SYS_PROMPT, user, FORMAT_SCHEMA, model=model)
    except Exception as e:
        print(f"  [format] {rec['id']} FAILED: {e}", file=sys.stderr)
        return None
    items = {r.get("id"): r for r in result.get("concepts", [])}
    fmt = items.get(rec["id"]) or (next(iter(items.values())) if items else None)
    if not fmt:
        return None
    # Sanitize figure tokens
    raw_body = rec.get("raw_body", "")
    content, _ = _sanitize_figure_tokens(fmt.get("content", ""), raw_body)
    return {
        "one_liner":     fmt.get("one_liner", ""),
        "content":       content,
        "motivation_md": fmt.get("motivation_md", ""),
        "recap_md":      fmt.get("recap_md", ""),
        "aliases":       fmt.get("aliases", []) or [],
        "tags":          fmt.get("tags", []) or [],
        "_provenance":   fmt.get("_provenance", {}),
    }


def slot_one(rec: dict, model: str) -> dict | None:
    """Run fill_slots on a single record. Returns dict with key_passage/motivation/example/question, or None."""
    raw_body = rec.get("raw_body", "")
    prompt = build_slot_prompt(rec["id"], rec["title"], rec["kind"], raw_body)
    try:
        result = call_llm_json(SLOT_SYS_PROMPT, prompt, SLOT_SCHEMA, model=model)
    except Exception as e:
        print(f"  [slots] {rec['id']} FAILED: {e}", file=sys.stderr)
        return None
    section_for = rec.get("source", {}).get("section")
    out: dict = {}
    for key in ("key_passage", "motivation", "example", "question"):
        text = _clean(result.get(key))
        if text:
            out[key] = {"text": text}
            if section_for:
                out[key]["section"] = section_for
    return out


def main() -> None:
    numbered = load_numbered(NUMBERED)
    sections = load_jsonl(SECTIONS)
    chapters = load_jsonl(CHAPTERS)
    new_pass_a = load_jsonl(PASS_A_CH3)
    # Sort by first line for deterministic book_order
    new_pass_a.sort(key=lambda r: int(str(r["source"]["spans"][0]["start"]).lstrip("L")))
    print(f"[1/6] loaded {len(new_pass_a)} new Ch3 concepts from {PASS_A_CH3.name}")

    # Load existing viewer JSON to inherit book_order start for Ch3
    viz = json.loads(VIEWER_JSON.read_text())
    existing_ch3_ids = {c["id"] for c in viz["concepts"]
                        if c.get("position", {}).get("chapter") == 3}
    # Determine starting book_order: min book_order of existing Ch3 (so we slot back in place)
    ch3_book_orders = [c.get("position", {}).get("book_order", 0)
                       for c in viz["concepts"]
                       if c.get("position", {}).get("chapter") == 3]
    base_book_order = min(ch3_book_orders) if ch3_book_orders else 0

    # 1. Promote each pass_a record (slice raw_body, attach base metadata)
    section_concept_order: dict[str, list[str]] = {}
    promoted: list[dict] = []
    for i, rec in enumerate(new_pass_a):
        p = promote(rec, numbered)
        attach_position(p, sections, chapters, section_concept_order,
                        base_book_order + i)
        promoted.append(p)
    print(f"[2/6] promoted {len(promoted)} records with raw_body + position")

    # 2. Run format_concepts on each (LLM)
    print(f"[3/6] running format_concepts on {len(promoted)} records (model={MODEL})...")
    fmt_results: dict[str, dict] = {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(format_one, p, MODEL): p["id"] for p in promoted}
        for fut in as_completed(futs):
            cid = futs[fut]
            res = fut.result()
            if res is not None:
                fmt_results[cid] = res
                print(f"  [format] OK  {cid}")
            else:
                print(f"  [format] FAIL {cid}")

    # 3. Run fill_slots on each (LLM)
    print(f"[4/6] running fill_slots on {len(promoted)} records (model={MODEL})...")
    slot_results: dict[str, dict] = {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(slot_one, p, MODEL): p["id"] for p in promoted}
        for fut in as_completed(futs):
            cid = futs[fut]
            res = fut.result()
            if res is not None:
                slot_results[cid] = res
                print(f"  [slots]  OK  {cid}  ({len(res)} slots)")
            else:
                print(f"  [slots]  FAIL {cid}")

    # 4. Merge into final viewer concept records
    enriched: list[dict] = []
    for p in promoted:
        cid = p["id"]
        out = dict(p)
        out.pop("raw_body", None)  # viewer JSON doesn't carry raw_body
        fmt = fmt_results.get(cid, {})
        out["one_liner"]     = fmt.get("one_liner", "")
        out["content"]       = fmt.get("content", "")
        out["motivation_md"] = fmt.get("motivation_md", "")
        out["recap_md"]      = fmt.get("recap_md", "")
        out["aliases"]       = sorted(set(fmt.get("aliases", [])))
        out["tags"]          = sorted(set(fmt.get("tags", [])))
        out["_provenance"]   = fmt.get("_provenance", {})
        out["extraction"]["pass_b_model"] = MODEL
        for k, v in slot_results.get(cid, {}).items():
            out[k] = v
        enriched.append(out)
    print(f"[5/6] enriched {len(enriched)} records")

    # 5. Patch concept-graph-vision-data.json
    # 5a. Drop old Ch3 concepts
    new_concepts = [c for c in viz["concepts"]
                    if c.get("position", {}).get("chapter") != 3]
    new_concepts.extend(enriched)
    viz["concepts"] = new_concepts

    # 5b. Drop edges where either endpoint was an old Ch3 concept that no longer exists.
    # The intra-Ch3 edges (if any in the old graph) used old ids → drop those.
    # Cross-chapter edges pointing INTO old Ch3 ids → drop those too.
    all_ids = {c["id"] for c in new_concepts}
    for ek in ("prereq", "overlay"):
        before = len(viz["edges"].get(ek, []))
        viz["edges"][ek] = [e for e in viz["edges"].get(ek, [])
                            if e["from"] in all_ids and e["to"] in all_ids]
        after = len(viz["edges"][ek])
        if before != after:
            print(f"  [edges] dropped {before - after} {ek} edges with missing Ch3 endpoints")

    # 5c. Update meta
    viz.setdefault("meta", {}).setdefault("counts", {})
    viz["meta"]["counts"]["concepts"] = len(new_concepts)
    viz["meta"]["counts"]["edges_prereq"] = len(viz["edges"].get("prereq", []))
    viz["meta"]["counts"]["edges_overlay"] = len(viz["edges"].get("overlay", []))
    viz["meta"]["ch3_repatched_at"] = "2026-06-01"

    VIEWER_JSON.write_text(json.dumps(viz))
    print(f"  → wrote {VIEWER_JSON}  (Ch3: {len(existing_ch3_ids)} → {len(enriched)} concepts)")

    # 6. Regenerate chapter_graphs/ch03.json via split_chapters.py
    print(f"[6/6] running split_chapters.py to refresh {CHAPTER_GRAPHS}/ch03.json...")
    subprocess.check_call(
        [sys.executable, str(SPLIT_SCRIPT),
         "--data", str(VIEWER_JSON),
         "--out-dir", str(CHAPTER_GRAPHS)],
        cwd=str(ROOT),
    )
    print("\ndone.")


if __name__ == "__main__":
    main()
