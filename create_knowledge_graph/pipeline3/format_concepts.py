#!/usr/bin/env python3
"""
Pass B for concepts — produce learner-facing fields grounded in raw_body.

Fields:
  - one_liner: a single-sentence gist (<=35 words), preferring a cleaned
    quote from raw_body; LLM-inferred only if no standalone sentence exists.
  - content: the book's own material for this concept, lightly paraphrased
    for readability. Preserves every claim in raw_body plus any inline
    [FIGURE:<asset_id>|...] tokens at their original positions. Usually
    provenance = book_paraphrased.
  - motivation_md: <=80 words on WHY this concept exists (LLM-inferred).
  - recap_md: 2-3 bullet cheat-sheet (LLM-generated from raw_body).
  - aliases, tags: extracted from the text.

Each record gets `_provenance` with one entry per semantic field:
  - "book_extracted": verbatim or very close to raw_body.
  - "book_paraphrased": LLM rephrasing of raw_body content.
  - "llm_inferred": LLM-generated content beyond raw_body.

A post-processor strips any `[FIGURE:...]` tokens the LLM invented (not
present in raw_body with a valid hashed or QMD asset ID); check_formatted flags
remaining anomalies as non-blocking quality_flags.

Usage:
    python format_concepts.py \
        --spliced data3/concepts.deduped.jsonl \
        --out     data3/concepts.jsonl \
        [--batch-size 8] [--workers 16]
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

# Valid IDs are either hashed remote assets or normalized QMD figure/table IDs.
FIGURE_ID_PATTERN = r"(?:[0-9a-f]{16}|(?:fig|tbl)[-_:][A-Za-z0-9][A-Za-z0-9_.:-]*)"
VALID_TOKEN_RE = re.compile(rf"\[FIGURE:({FIGURE_ID_PATTERN})(?:\s*\|[^\]]*)?\]")
# Anything matching `[FIGURE:...]` — catches invalid/invented tokens too.
ANY_TOKEN_RE   = re.compile(r"\[FIGURE:[^\]]*\]")


SYSTEM_PROMPT = """You format concept nodes for a calculus learning graph.

Input: concept records, each with id, kind, title, and raw_body (verbatim text copied from the textbook for this concept). raw_body may contain:
  - OCR/mathpix artifacts: stray line breaks mid-paragraph, split LaTeX math, garbled symbols, misplaced list numbering.
  - Inline image tokens of the form `[FIGURE:<asset_id> | <short alt>]`.
  - LaTeX math in $...$ or $$...$$.
  - Occasional headings or book labels ("1.1.1 LIMITS (AN INFORMAL VIEW)", "Example 3") that belong with the content or can be trimmed.

## Your job: produce the learner-facing fields below.

Produce each field strictly from what's in raw_body, except where a field is explicitly marked LLM-inferred.

  id            — pass through unchanged.

  one_liner     — ONE sentence, <=35 words, capturing the core idea. Prefer a
                  lightly cleaned quote from raw_body. Only rephrase if no
                  sentence in raw_body stands alone as a one-liner.

  content       — The BOOK'S OWN MATERIAL for this concept, LIGHTLY PARAPHRASED
                  for readability. This is the field a tutor or exam generator
                  shows when they want the full concept explained.

                  Rules for `content`:
                  * Preserve every claim in raw_body. Do not add claims, do not
                    add examples, do not inject motivation that isn't there.
                  * You MAY reorder sentences for clarity, merge duplicated or
                    run-on sentences, fix OCR/mathpix artifacts, break a long
                    paragraph into two, or add a short transition word between
                    sentences the book had awkwardly juxtaposed.
                  * You MAY strip book-internal labels like "1.1.1 LIMITS
                    (AN INFORMAL VIEW)" at the very start if they are not
                    load-bearing. Keep them if the concept is identified by
                    a numbered theorem label ("Theorem 1.2.3").
                  * LaTeX: keep $...$ and $$...$$ exactly as in raw_body.
                  * Images: keep every `[FIGURE:<asset_id> | ...]` token
                    VERBATIM at its original relative position in the text. Do
                    not remove, reorder, or renumber them.
                  * Typical length: whatever raw_body has, minus cleanup
                    savings. Don't artificially shorten.
                  * Do NOT start with "This concept describes..." or similar
                    filler framing. Open with the content itself.

  motivation_md — <=80 words. WHY the concept exists / what problem it solves.
                  Draw from raw_body if it motivates; otherwise write a
                  teaching-oriented short motivation. This may be LLM-inferred
                  (mark provenance accordingly).

  recap_md      — 2-3 bullet cheat-sheet. Each bullet starts with "- " and
                  contains at most one sentence. Can quote or paraphrase
                  raw_body; LaTeX allowed.

  aliases       — 0-3 alternate names for this concept used in the text
                  (e.g., "informal limit", "intuitive limit"). Empty if none.

  tags          — 1-4 snake_case topic tags.

  _provenance   — dict with one key per field above:
                  - "book_extracted": verbatim or near-verbatim from raw_body.
                  - "book_paraphrased": LLM rephrasing/cleanup of raw_body.
                  - "llm_inferred": LLM-generated content beyond raw_body.

## Rules

  1. NEVER put LaTeX that isn't in raw_body into one_liner or content.
  2. `content` preserves the `[FIGURE:<asset-id> | ...]` tokens that
     appear in raw_body, at their original relative positions.
     - DO NOT invent new [FIGURE:...] tokens.
     - DO NOT materialize prose references like "(Figure 1.1.6)" into
       [FIGURE:...] tokens. If the book's prose says "(Figure 1.1.6)",
       your `content` keeps the text "(Figure 1.1.6)" verbatim — those
       figures are separate records elsewhere in the graph.
     - A valid token ID is a 16-character lowercase hex asset ID or a
       normalized QMD `fig-*` / `tbl-*` identifier.
       If raw_body has no such token, your `content` has none either.
  3. `one_liner`, `motivation_md`, `recap_md` may drop figure tokens.
  4. If raw_body is very short (<30 words), `content` can be a lightly
     cleaned version of raw_body verbatim; provenance = book_extracted.
  5. Be honest in _provenance. If you kept raw_body's phrasing nearly intact,
     mark book_extracted. If you reorganized sentences or filled gaps,
     book_paraphrased.

Return JSON with top-level `concepts` array, one record per input concept, same order and ids.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["concepts"],
    "properties": {
        "concepts": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "one_liner", "content", "motivation_md",
                             "recap_md", "aliases",
                             "tags", "_provenance"],
                "properties": {
                    "id":                    {"type": "string"},
                    "one_liner":             {"type": "string"},
                    "content":               {"type": "string"},
                    "motivation_md":         {"type": "string"},
                    "recap_md":              {"type": "string"},
                    "aliases":               {"type": "array", "items": {"type": "string"}},
                    "tags":                  {"type": "array", "items": {"type": "string"}},
                    "_provenance": {
                        "type": "object",
                        "properties": {
                            "one_liner":     {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "content":       {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "motivation_md": {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "recap_md":      {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                        },
                    },
                },
            },
        },
    },
}


def read_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def build_batch_message(batch: list[dict]) -> str:
    pieces = []
    for rec in batch:
        pieces.append(
            f"### Concept id: {rec['id']}\n"
            f"kind: {rec['kind']}\n"
            f"title: {rec['title']}\n"
            f"raw_body:\n```\n{rec['raw_body']}\n```\n"
        )
    return (
        f"Format {len(batch)} concept(s). Return {len(batch)} records in same order "
        f"with same ids.\n\n" + "\n---\n\n".join(pieces)
    )


def check_formatted(rec: dict) -> list[str]:
    """Non-blocking quality flags."""
    flags: list[str] = []
    def _wc(s): return len(s.split())
    if _wc(rec.get("one_liner", "")) > 50:
        flags.append("one_liner_long")
    content = rec.get("content", "")
    if _wc(content) < 8:
        flags.append("content_too_short")
    # Figure-token checks against raw_body (when available at call time)
    raw_body = rec.get("_raw_body_hint", "")
    if raw_body is not None:
        # 1. Tokens in raw_body must all appear in content
        raw_asset_ids = set(VALID_TOKEN_RE.findall(raw_body))
        content_asset_ids = set(VALID_TOKEN_RE.findall(content))
        missing = raw_asset_ids - content_asset_ids
        if missing:
            flags.append(f"content_missing_figure_tokens_{len(missing)}")
        # 2. Content should not contain invented (invalid-form) tokens
        all_tokens = ANY_TOKEN_RE.findall(content)
        invalid_tokens = [t for t in all_tokens if not VALID_TOKEN_RE.fullmatch(t)]
        if invalid_tokens:
            flags.append(f"content_invented_figure_tokens_{len(invalid_tokens)}")
        # 3. Content asset_ids not present in raw_body = hallucinated
        hallucinated = content_asset_ids - raw_asset_ids
        if hallucinated:
            flags.append(f"content_hallucinated_asset_ids_{len(hallucinated)}")
    for field in ("one_liner", "content", "motivation_md", "recap_md"):
        v = rec.get(field, "")
        if v.count("$") % 2 != 0:
            flags.append(f"{field}_dollar_parity")
    if not rec.get("tags"):
        flags.append("no_tags")
    return flags


def _sanitize_figure_tokens(content: str, raw_body: str) -> tuple[str, int]:
    """Remove invented/invalid [FIGURE:...] tokens from content.

    Returns (cleaned_content, n_removed). An invalid token is one whose form
    doesn't match the valid hashed/QMD ID forms, or whose asset_id isn't among
    raw_body's valid tokens. The replacement is a fragment of the original
    `| alt` text if present, otherwise empty — we try to keep the reader's
    context intact rather than leaving a jagged edit.
    """
    raw_asset_ids = set(VALID_TOKEN_RE.findall(raw_body or ""))
    n_removed = 0

    def replace(m: re.Match) -> str:
        nonlocal n_removed
        token = m.group(0)
        valid = VALID_TOKEN_RE.fullmatch(token)
        if valid and valid.group(1) in raw_asset_ids:
            return token
        n_removed += 1
        # Try to extract the alt text so the sentence still reads
        alt_match = re.search(r"\|\s*([^\]]+)\]$", token)
        if alt_match:
            return f"(see figure: {alt_match.group(1).strip()})"
        return ""
    cleaned = ANY_TOKEN_RE.sub(replace, content)
    return cleaned, n_removed


def merge(spliced: dict, fmt: dict, model: str) -> dict:
    merged = dict(spliced)
    # Sanitize invented/invalid figure tokens from content
    raw_body = spliced.get("raw_body", "")
    content, removed = _sanitize_figure_tokens(fmt.get("content", ""), raw_body)
    fmt = dict(fmt)
    fmt["content"] = content
    merged["one_liner"]     = fmt["one_liner"]
    merged["content"]       = fmt["content"]
    merged["motivation_md"] = fmt["motivation_md"]
    merged["recap_md"]      = fmt["recap_md"]
    merged["aliases"]       = sorted(set(merged.get("aliases", []) + fmt.get("aliases", [])))
    tags_from_b = fmt.get("tags", [])
    merged["tags"] = sorted(set(merged.get("tags", []) + tags_from_b))
    merged["_provenance"] = fmt.get("_provenance", {})
    ext = dict(merged.get("extraction", {}))
    ext["pass_b_model"] = model
    merged["extraction"] = ext
    return merged


def format_batch(batch: list[dict], model: str) -> dict[str, dict]:
    user_msg = build_batch_message(batch)
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model)
    return {r["id"]: r for r in result.get("concepts", []) if r.get("id")}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--spliced", type=Path, required=True)
    ap.add_argument("--out",     type=Path, required=True)
    ap.add_argument("--failures",   type=Path, default=None)
    ap.add_argument("--model",      default=GEMINI_DEFAULT)
    ap.add_argument("--batch-size", type=int, default=8)
    ap.add_argument("--workers",    type=int, default=16)
    ap.add_argument("--limit",      type=int, default=0)
    ap.add_argument("--start",      type=int, default=0)
    args = ap.parse_args()

    failures_path = args.failures or args.out.with_suffix(".failures.jsonl")
    spliced = read_jsonl(args.spliced)
    if args.start: spliced = spliced[args.start:]
    if args.limit: spliced = spliced[:args.limit]

    batches = [spliced[i:i + args.batch_size] for i in range(0, len(spliced), args.batch_size)]
    n_batches = len(batches)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    write_lock = threading.Lock()
    done = n_ok = n_hard = 0

    def run(idx_batch):
        idx, batch = idx_batch
        try:
            return idx, batch, format_batch(batch, args.model), None
        except Exception as e:
            return idx, batch, None, e

    with args.out.open("w") as fo, failures_path.open("w") as ff:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(run, (i, b)) for i, b in enumerate(batches)]
            for fut in as_completed(futures):
                idx, batch, fmt_by_id, err = fut.result()
                ids = [r["id"] for r in batch]
                with write_lock:
                    done += 1
                    tag = f"[batch {done}/{n_batches}] {', '.join(ids[:3])}" \
                          f"{'...' if len(ids) > 3 else ''}"
                    if err is not None:
                        print(f"{tag}  FAILED: {type(err).__name__}: {err}",
                              file=sys.stderr)
                        for rec in batch:
                            ff.write(json.dumps({**rec, "_hard_issue": f"batch_failed: {err}"}) + "\n")
                            n_hard += 1
                        ff.flush()
                        continue
                    for rec in batch:
                        fmt = fmt_by_id.get(rec["id"])
                        if not fmt:
                            ff.write(json.dumps({**rec, "_hard_issue": "no output from llm"}) + "\n")
                            n_hard += 1
                            continue
                        # Pass raw_body through for image-token preservation check
                        fmt_with_hint = dict(fmt)
                        fmt_with_hint["_raw_body_hint"] = rec.get("raw_body", "")
                        flags = check_formatted(fmt_with_hint)
                        merged = merge(rec, fmt, args.model)
                        if flags:
                            existing = merged.get("quality_flags", [])
                            merged["quality_flags"] = sorted(set(existing + flags))
                        fo.write(json.dumps(merged) + "\n")
                        n_ok += 1
                    print(f"{tag}  ok", file=sys.stderr)
                    fo.flush(); ff.flush()

    print(f"\ndone: {n_ok} written (with quality_flags where applicable), "
          f"{n_hard} hard failures -> {failures_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
