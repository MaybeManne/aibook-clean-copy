#!/usr/bin/env python3
"""
One-shot LLM audit of chunk boundaries.

Feed Gemini the chunk manifest (id, first/last heading, token count, first 30
chars of first block) and ask whether any boundary splits a logical unit it
shouldn't. Returns optional merge or split suggestions, applied only if they
respect the token budget.

Very cheap: one call per book.

Usage:
    python audit_chunks.py \
        --manifest data2/chunks/manifest.jsonl \
        --chunks-dir data2/chunks \
        --out-report data2/chunks/audit_report.json \
        [--max-tokens 9000]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT


SYSTEM_PROMPT = """You audit chunk boundaries of a textbook that has been split for LLM processing.

You receive a list of chunks in book order, each with:
  - chunk_id
  - approximate tokens
  - headings (the heading context at the start/end of this chunk)
  - first_line_text (first non-blank line — hint for what's there)
  - last_line_text (last non-blank line — hint for what's there)

For each boundary between consecutive chunks, judge whether the split looks
reasonable or whether it breaks a logical unit (e.g., definition in chunk N,
examples applying it in chunk N+1 — a reasonable split; a theorem statement in
chunk N and its proof in chunk N+1 — better NOT to split; the introduction of a
section in chunk N and the body of the same section in chunk N+1 — could stay
together or be split, usually fine).

Return:
  issues: array of {boundary: "between chunk_A and chunk_B", severity: "high"|"low",
                    what_breaks: short description, recommended_action: "merge"|"accept"|"split_differently"}
  overall: "clean" | "minor_issues" | "major_issues"

Be conservative. Only flag severity "high" when a clearly atomic unit is cut.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["issues", "overall"],
    "properties": {
        "issues": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["boundary", "severity", "what_breaks", "recommended_action"],
                "properties": {
                    "boundary":            {"type": "string"},
                    "severity":            {"type": "string", "enum": ["low", "high"]},
                    "what_breaks":         {"type": "string"},
                    "recommended_action":  {"type": "string", "enum": ["merge", "accept", "split_differently"]},
                },
            },
        },
        "overall": {"type": "string", "enum": ["clean", "minor_issues", "major_issues"]},
    },
}


def load_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def first_and_last_nonblank(chunk_path: Path) -> tuple[str, str]:
    lines = [l for l in chunk_path.read_text(encoding="utf-8").splitlines() if l.strip()]
    first = lines[0] if lines else ""
    last = lines[-1] if lines else ""
    # trim to 120 chars each
    return first[:120], last[:120]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--manifest",   type=Path, required=True)
    ap.add_argument("--chunks-dir", type=Path, required=True)
    ap.add_argument("--out-report", type=Path, required=True)
    ap.add_argument("--model", default=GEMINI_DEFAULT)
    args = ap.parse_args()

    manifest = load_jsonl(args.manifest)
    rows = []
    for r in manifest:
        chunk_path = args.chunks_dir / f"{r['chunk_id']}.md"
        if chunk_path.exists():
            first, last = first_and_last_nonblank(chunk_path)
        else:
            first, last = "(missing)", "(missing)"
        rows.append({
            "chunk_id":        r["chunk_id"],
            "approx_tokens":   r.get("approx_tokens"),
            "headings":        r.get("headings", []),
            "span":            f"{r['span']['start']}-{r['span']['end']}",
            "first_line_text": first,
            "last_line_text":  last,
        })

    user_msg = (
        f"Chunks (in book order), {len(rows)} total:\n\n" +
        json.dumps(rows, indent=2)
    )
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=args.model)

    args.out_report.parent.mkdir(parents=True, exist_ok=True)
    args.out_report.write_text(json.dumps(result, indent=2) + "\n")

    print(f"overall: {result.get('overall')}", file=sys.stderr)
    for iss in result.get("issues", []):
        print(f"  [{iss['severity']}] {iss['boundary']}: {iss['what_breaks']} "
              f"-> {iss['recommended_action']}", file=sys.stderr)


if __name__ == "__main__":
    main()
