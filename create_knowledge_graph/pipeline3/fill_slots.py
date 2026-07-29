#!/usr/bin/env python3
"""
Stage 21 — fill_slots.py

For every concept, extract verbatim slots from its raw_body passage:
  - key_passage : 1-3 sentences that best define the concept (verbatim)
  - question    : a question explicitly stated in the text (verbatim, or null)
  - motivation  : 1-2 sentences explaining why the concept matters (verbatim, or null)

Rules (same as Pipeline A's slot-filler.js):
  - NEVER paraphrase or invent. Every value must be a direct excerpt from raw_body.
  - If a slot cannot be found verbatim, return null — never hallucinate.
  - Clean the text: strip markdown list markers, figure tokens, citation markers.

Output: concepts.slotted.jsonl  — id + three slot fields
Also rewrites graph.json in-place, merging the slots into each concept.

Usage:
    python fill_slots.py \\
        --raw      data3/concepts.raw.jsonl \\
        --concepts data3/concepts.jsonl \\
        --out      data3/concepts.slotted.jsonl \\
        --graph    data3/graph.json \\
        [--workers 16]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT

# ── Prompt ────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You extract verbatim quotes from textbook passages.
NEVER paraphrase, rewrite, or invent content.
Every value you return must be a direct, word-for-word excerpt from the passage.
If a slot cannot be found verbatim in the passage, return null for that slot.
Always output valid JSON matching the required schema."""

def _build_prompt(concept_id: str, title: str, kind: str, raw_body: str) -> str:
    return f"""Concept: "{title}" (kind: {kind}, id: {concept_id})

Textbook passage (verbatim source text):
---
{raw_body}
---

Extract these 4 slots. For each, copy exact sentence(s) verbatim from the passage above.
Rules:
- "text": direct word-for-word copy from the passage — no rewording, no additions
- Strip only: leading list markers (- / * / numbers), [FIGURE:...] tokens, {{#...}} anchors,
  @ref-... citation markers, and extra whitespace. Keep all other words unchanged.
- If you cannot find a suitable verbatim excerpt, set the value to null.

Slots:
1. key_passage — the single most important 1-3 sentences that define or explain this concept
2. motivation  — 1-2 sentences explaining why this concept matters or what problem it solves
3. example     — a concrete example, scenario, or application of this concept stated in the passage (or "" if none)
4. question    — a question explicitly stated in the passage (not implied; return "" if none found)

Return ONLY the JSON object below (no prose, no fences). Return "" for any slot not found:
{{
  "key_passage": "exact verbatim text or empty string",
  "motivation":  "exact verbatim text or empty string",
  "example":     "exact verbatim text or empty string",
  "question":    "exact verbatim text or empty string"
}}"""

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "key_passage": {"type": "string", "description": "Verbatim key passage, or empty string if not found"},
        "motivation":  {"type": "string", "description": "Verbatim motivation text, or empty string if not found"},
        "example":     {"type": "string", "description": "Verbatim example or application, or empty string if not found"},
        "question":    {"type": "string", "description": "Verbatim question from text, or empty string if not found"},
    },
    "required": ["key_passage", "motivation", "example", "question"],
}

# ── Text cleanup ──────────────────────────────────────────────────────────────

_STRIP_RE = re.compile(
    r"^\s*[-*]\s+|"          # leading list markers
    r"^\s*\d+\.\s+|"         # numbered list markers
    r"\[FIGURE:[^\]]*\]|"    # figure tokens
    r"\{#[^}]*\}|"           # anchor tags
    r"@\S+|"                 # @citation markers
    r"\s{2,}",               # extra whitespace (replaced by single space)
    re.MULTILINE,
)

def _clean(text: str | None) -> str | None:
    if not text:
        return None
    cleaned = _STRIP_RE.sub(lambda m: " " if m.group() and m.group()[0] not in "[-*0123456789[{@" else "", text)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    return cleaned if len(cleaned) > 8 else None

# ── Single concept ────────────────────────────────────────────────────────────

_lock = threading.Lock()
_done = 0
_total = 0

def _process(rec: dict, raw_body: str, model: str) -> dict:
    global _done
    prompt = _build_prompt(rec["id"], rec.get("title", rec["id"]), rec.get("kind", "concept"), raw_body)
    try:
        result = call_llm_json(
            SYSTEM_PROMPT, prompt, OUTPUT_SCHEMA,
            model=model,
            max_output_tokens=512,
            thinking_budget=0,
            temperature=0.1,
        )
    except Exception as e:
        print(f"  [fill_slots] ERROR {rec['id']}: {e}", flush=True)
        result = {}

    out = {
        "id": rec["id"],
        "key_passage": None,
        "motivation":  None,
        "example":     None,
        "question":    None,
    }
    for slot in ("key_passage", "motivation", "example", "question"):
        val = result.get(slot)
        if isinstance(val, str):
            v = val.strip()
            if v and v.lower() not in ("null", "none", "n/a", "not found", "not applicable"):
                out[slot] = _clean(v) or None
        # else stays None

    with _lock:
        _done += 1
        if _done % 50 == 0 or _done == _total:
            print(f"  [fill_slots] {_done}/{_total}", flush=True)
    return out

# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    global _total

    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--raw",      required=True, help="concepts.raw.jsonl")
    ap.add_argument("--concepts", required=True, help="concepts.jsonl")
    ap.add_argument("--out",      required=True, help="concepts.slotted.jsonl")
    ap.add_argument("--graph",    required=True, help="graph.json to update in-place")
    ap.add_argument(
        "--web-data",
        default=None,
        help="Optional second viewer graph to update; never inferred implicitly.",
    )
    ap.add_argument("--workers",  type=int, default=16)
    ap.add_argument("--model",    default=GEMINI_DEFAULT)
    args = ap.parse_args()

    # Load raw_body
    raw_by_id: dict[str, str] = {}
    with open(args.raw) as f:
        for line in f:
            r = json.loads(line)
            raw_by_id[r["id"]] = r["raw_body"]

    # Load concepts
    concepts: list[dict] = []
    with open(args.concepts) as f:
        for line in f:
            concepts.append(json.loads(line))

    _total = len(concepts)
    print(f"[fill_slots] Processing {_total} concepts with {args.workers} workers", flush=True)

    # Check for existing output (resume support)
    out_path = Path(args.out)
    already_done: set[str] = set()
    slotted: list[dict] = []
    if out_path.exists():
        with open(out_path) as f:
            for line in f:
                r = json.loads(line)
                already_done.add(r["id"])
                slotted.append(r)
        print(f"[fill_slots] Resuming — {len(already_done)} already done", flush=True)

    todo = [c for c in concepts if c["id"] not in already_done]

    with open(out_path, "a") as out_f:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {
                pool.submit(_process, c, raw_by_id.get(c["id"], ""), args.model): c
                for c in todo
            }
            for fut in as_completed(futures):
                try:
                    r = fut.result()
                    slotted.append(r)
                    out_f.write(json.dumps(r) + "\n")
                    out_f.flush()
                except Exception as e:
                    c = futures[fut]
                    print(f"  [fill_slots] FATAL {c['id']}: {e}", flush=True)

    print(f"[fill_slots] Done. {len(slotted)} records written to {out_path}", flush=True)

    # Merge into graph.json
    graph_path = Path(args.graph)
    if not graph_path.exists():
        print(f"[fill_slots] graph.json not found at {graph_path}, skipping merge", flush=True)
        return

    slots_by_id = {r["id"]: r for r in slotted}
    filled = 0
    graph = json.loads(graph_path.read_text())
    for c in graph.get("concepts", []):
        s = slots_by_id.get(c["id"])
        if not s:
            continue
        for slot in ("key_passage", "motivation", "example", "question"):
            val = s.get(slot)
            if val:
                c[slot] = {"text": val, "section": c.get("source", {}).get("section", "")}
                filled += 1
        # Update provenance: verbatim slots are book_extracted
        prov = c.setdefault("_provenance", {})
        for slot in ("key_passage", "motivation", "example", "question"):
            if s.get(slot):
                prov[slot] = "book_extracted"

    graph_path.write_text(json.dumps(graph, indent=2))
    print(f"[fill_slots] Merged {filled} slot values into {graph_path}", flush=True)

    # Update a second viewer artifact only when the caller explicitly requests it.
    if args.web_data:
        web_data = Path(args.web_data)
        if not web_data.exists():
            raise SystemExit(f"--web-data graph not found: {web_data}")
        web_graph = json.loads(web_data.read_text())
        for c in web_graph.get("concepts", []):
            s = slots_by_id.get(c["id"])
            if not s:
                continue
            for slot in ("key_passage", "motivation", "example", "question"):
                val = s.get(slot)
                if val:
                    c[slot] = {"text": val, "section": c.get("source", {}).get("section", "")}
        web_data.write_text(json.dumps(web_graph))
        print(f"[fill_slots] Also updated {web_data}", flush=True)


if __name__ == "__main__":
    main()
