#!/usr/bin/env python3
"""
Pass B for items v2 — split raw_body into per-kind fields with provenance.

raw_body arrives already self-contained (splice.py prepended the group
directive for sub-exercises), so exercises like "29. y = (x^2-1)/(x+2)" now
have the full "Find the horizontal asymptote(s)... 29. y = (x^2-1)/(x+2)"
text. Downstream prompt_md is therefore complete.

Pass B for items now:
  - Extracts prompt_md faithfully from raw_body (preferred: verbatim with
    cleanup; marked book_extracted in _provenance).
  - Extracts solution_md and answer from raw_body when present.
  - difficulty and skills are LLM-inferred.
  - For figures/tables, produces caption_md (LLM-inferred description grounded
    in raw_body + any inline alt-text there).

Usage: same as v1, default batch_size 6 (items are denser now), workers 16.
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

try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None


# A valid figure token has a 16-hex asset_id (sha256(url)[:16]).
# Mirrors format_concepts.py so both stages enforce the same shape.
VALID_TOKEN_RE = re.compile(r"\[FIGURE:([0-9a-f]{16})(?:\s*\|[^\]]*)?\]")
# Anything matching `[FIGURE:...]` — catches invalid/invented tokens too.
ANY_TOKEN_RE   = re.compile(r"\[FIGURE:[^\]]*\]")

# Prose fields that should preserve [FIGURE:...] tokens from raw_body.
PROSE_FIELDS = ("prompt_md", "solution_md", "proof_md", "caption_md")


SYSTEM_PROMPT = """You format items (example / exercise / exercise_group / theorem / figure / table) from a calculus textbook.

Each input has:
  - id
  - kind
  - title
  - raw_body (VERBATIM text from the book for this item; for sub-exercises, the
    shared directive has already been prepended, so it is self-contained).

Your job: extract structured fields from raw_body. STRONGLY PREFER EXTRACTION OVER PARAPHRASE.

Per-kind output rules (return only the fields relevant to this kind; null for
the rest):

  EXAMPLE or EXERCISE or EXERCISE_GROUP:
    - prompt_md:   The question/problem statement, extracted from raw_body
                   with minimal cleanup (strip labels like "Example 3", fix
                   broken LaTeX spacing, but DO NOT rephrase). For sub-parts
                   of a group, prompt_md should read as a self-contained
                   problem — the directive is already in raw_body.
    - solution_md: The full solution if present in raw_body, extracted
                   verbatim with light cleanup. null if the book gives no
                   solution.
    - answer:      The final numeric or short symbolic answer, extracted from
                   raw_body. null if the problem is open-ended or no answer
                   is given.
    - difficulty:  1-5 integer estimated from complexity.
    - skills:      1-4 snake_case skills.

    NARRATIVE EXAMPLE (important): some examples have no explicit "Solution."
    label — the book presents them as a single continuous demonstration (e.g.
    "Example 1 If f(x)=k is a constant function, then... For example, lim=3.")
    These are NOT prompt-only. Treat them as:
      - prompt_md:   a short task description derived from the opening (e.g.
                     "Find the limit of a constant function.") — marked
                     _provenance.prompt_md = "llm_inferred" since you are
                     summarizing.
      - solution_md: the FULL body of the example verbatim (the entire
                     demonstration/explanation), marked _provenance.solution_md
                     = "book_extracted".
    Do NOT leave solution_md null just because the book did not write the word
    "Solution". Leave solution_md null only for problems the book poses but
    does not work out (e.g., standalone exercises at the end of a section).

  THEOREM:
    - prompt_md:   The STATEMENT of the theorem, extracted verbatim.
    - proof_md:    Proof if given, verbatim.
    - answer:      null. difficulty: null. skills: null.

  FIGURE or TABLE:
    - caption_md:  One-sentence description of what the figure/table shows.
                   The raw_body may contain a `[FIGURE:<asset_id> | <alt>]`
                   token with meaningful alt text — use that as grounding.
    - Other split fields: null.

Provenance (`_provenance`):
  - "book_extracted": quoted or near-verbatim from raw_body.
  - "book_paraphrased": you restructured/rewrote raw_body content.
  - "llm_inferred": content not in raw_body (e.g. difficulty estimate, skills).

Rules:
  1. DO NOT invent content. Never solve a problem the book hasn't solved.
  2. DO NOT rephrase the mathematics. Preserve the book's wording.
  3. Figure tokens. If raw_body contains any `[FIGURE:<asset_id> | <alt>]`
     tokens, keep them VERBATIM inline at the same relative position inside
     whichever output field receives that part of the text: prompt_md,
     solution_md, proof_md, or caption_md. Do NOT rename the asset_id, do NOT
     rewrite the alt text, do NOT invent new [FIGURE:...] tokens, and do NOT
     materialize prose references like "Figure 1.1.6" into a [FIGURE:...]
     token — those are separate records. A valid token's asset_id is a
     16-character lowercase hex string; if raw_body has none, your output has
     none either. Every token in raw_body must appear somewhere in the split
     output.
  4. split_succeeded=false only if raw_body is so degraded that no meaningful
     split is possible.

Return JSON with top-level `items` array, one per input, same order and ids.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["items"],
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "split_succeeded", "tags", "_provenance"],
                "properties": {
                    "id":              {"type": "string"},
                    "split_succeeded": {"type": "boolean"},
                    "prompt_md":       {"type": ["string", "null"]},
                    "solution_md":     {"type": ["string", "null"]},
                    "answer":          {"type": ["string", "null"]},
                    "proof_md":        {"type": ["string", "null"]},
                    "caption_md":      {"type": ["string", "null"]},
                    "difficulty":      {"type": ["integer", "null"], "minimum": 1, "maximum": 5},
                    "skills":          {"type": "array", "items": {"type": "string"}},
                    "tags":            {"type": "array", "items": {"type": "string"}},
                    "_provenance": {
                        "type": "object",
                        "properties": {
                            "prompt_md":   {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "solution_md": {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "answer":      {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "proof_md":    {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "caption_md":  {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "difficulty":  {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                            "skills":      {"type": "string", "enum": ["book_extracted", "book_paraphrased", "llm_inferred"]},
                        },
                    },
                },
            },
        },
    },
}


FUZZY_THRESHOLD = 55  # relaxed from v1 since short exercises break strict match


def read_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def build_batch_message(batch: list[dict]) -> str:
    pieces = []
    for rec in batch:
        pieces.append(
            f"### Item id: {rec['id']}\n"
            f"kind: {rec['kind']}\n"
            f"title: {rec['title']}\n"
            f"raw_body:\n```\n{rec['raw_body']}\n```\n"
        )
    return (
        f"Format {len(batch)} items. Return {len(batch)} records in same "
        f"order with same ids.\n\n" + "\n---\n\n".join(pieces)
    )


def _sanitize_figure_tokens(text: str, raw_body: str) -> tuple[str, int]:
    """Remove invented/invalid [FIGURE:...] tokens from a prose field.

    Mirrors format_concepts.py::_sanitize_figure_tokens. Returns
    (cleaned_text, n_removed). An invalid token is one whose form doesn't
    match [FIGURE:<16-hex>[ | alt]], or whose asset_id isn't among raw_body's
    valid tokens. The replacement is the `| alt` fragment if present, so the
    surrounding prose still reads naturally.
    """
    if not text:
        return text, 0
    raw_asset_ids = set(VALID_TOKEN_RE.findall(raw_body or ""))
    n_removed = 0

    def replace(m: re.Match) -> str:
        nonlocal n_removed
        token = m.group(0)
        valid = VALID_TOKEN_RE.fullmatch(token)
        if valid and valid.group(1) in raw_asset_ids:
            return token
        n_removed += 1
        alt_match = re.search(r"\|\s*([^\]]+)\]$", token)
        if alt_match:
            return f"(see figure: {alt_match.group(1).strip()})"
        return ""
    cleaned = ANY_TOKEN_RE.sub(replace, text)
    return cleaned, n_removed


def check_formatted(rec_in: dict, fmt: dict) -> list[str]:
    flags: list[str] = []
    kind = rec_in["kind"]
    raw = rec_in.get("raw_body", "") or ""
    if not fmt.get("split_succeeded", False):
        flags.append("split_not_succeeded")
        return flags
    if kind in ("example", "exercise", "exercise_group"):
        if not fmt.get("prompt_md"):
            flags.append("missing_prompt_md")
        if fmt.get("difficulty") is None:
            flags.append("missing_difficulty")
    elif kind == "theorem":
        if not fmt.get("prompt_md"):
            flags.append("missing_theorem_statement")
    elif kind in ("figure", "table"):
        if not fmt.get("caption_md"):
            flags.append(f"missing_caption_md")
    # Fuzzy match prompt_md against raw_body
    prompt = fmt.get("prompt_md")
    if prompt and fuzz is not None:
        score = fuzz.partial_ratio(prompt, raw)
        if score < FUZZY_THRESHOLD:
            flags.append(f"prompt_fuzzy_low_{int(score)}")
    for field in ("prompt_md", "solution_md", "proof_md", "caption_md", "answer"):
        v = fmt.get(field)
        if isinstance(v, str) and v.count("$") % 2 != 0:
            flags.append(f"{field}_dollar_parity")

    # Figure-token preservation checks (record-level to avoid per-field noise).
    raw_asset_ids = set(VALID_TOKEN_RE.findall(raw))
    if raw_asset_ids:
        # union of asset_ids appearing in ANY prose field
        present_ids: set[str] = set()
        per_field_invalid: list[tuple[str, int]] = []
        per_field_hallucinated: list[tuple[str, int]] = []
        for field in PROSE_FIELDS:
            v = fmt.get(field)
            if not isinstance(v, str) or not v:
                continue
            field_ids = set(VALID_TOKEN_RE.findall(v))
            present_ids |= field_ids
            all_tokens = ANY_TOKEN_RE.findall(v)
            invalid = [t for t in all_tokens if not VALID_TOKEN_RE.fullmatch(t)]
            if invalid:
                per_field_invalid.append((field, len(invalid)))
            hallucinated = field_ids - raw_asset_ids
            if hallucinated:
                per_field_hallucinated.append((field, len(hallucinated)))

        missing = raw_asset_ids - present_ids
        if missing:
            flags.append(f"figure_tokens_missing_in_all_fields_{len(missing)}")
        for field, n in per_field_invalid:
            flags.append(f"{field}_invented_figure_tokens_{n}")
        for field, n in per_field_hallucinated:
            flags.append(f"{field}_hallucinated_asset_ids_{n}")
    return flags


def merge(spliced: dict, fmt: dict, model: str) -> dict:
    merged = dict(spliced)
    raw_body = spliced.get("raw_body", "") or ""
    fmt = dict(fmt)
    # Sanitize invented/invalid figure tokens in any prose field the LLM returned.
    for field in PROSE_FIELDS:
        v = fmt.get(field)
        if isinstance(v, str) and v:
            cleaned, _ = _sanitize_figure_tokens(v, raw_body)
            fmt[field] = cleaned
    for k in ("prompt_md", "solution_md", "answer", "proof_md", "caption_md", "difficulty"):
        if fmt.get(k) is not None:
            merged[k] = fmt[k]
    if fmt.get("skills"):
        merged["skills"] = fmt["skills"]
    tags = fmt.get("tags") or []
    merged["tags"] = sorted(set(merged.get("tags", []) + tags))
    merged["_provenance"] = fmt.get("_provenance", {})
    ext = dict(merged.get("extraction", {}))
    ext["pass_b_model"] = model
    ext["split_succeeded"] = bool(fmt.get("split_succeeded", False))
    merged["extraction"] = ext
    return merged


def format_batch(batch: list[dict], model: str) -> dict[str, dict]:
    user_msg = build_batch_message(batch)
    result = call_llm_json(SYSTEM_PROMPT, user_msg, OUTPUT_SCHEMA, model=model)
    return {r["id"]: r for r in result.get("items", []) if r.get("id")}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--spliced", type=Path, required=True)
    ap.add_argument("--out",     type=Path, required=True)
    ap.add_argument("--failures",   type=Path, default=None)
    ap.add_argument("--model",      default=GEMINI_DEFAULT)
    ap.add_argument("--batch-size", type=int, default=6)
    ap.add_argument("--workers",    type=int, default=16)
    ap.add_argument("--limit",      type=int, default=0)
    ap.add_argument("--start",      type=int, default=0)
    args = ap.parse_args()

    if fuzz is None:
        print("warning: rapidfuzz not installed; fuzzy check disabled", file=sys.stderr)

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
                        flags = check_formatted(rec, fmt)
                        merged = merge(rec, fmt, args.model)
                        if flags:
                            existing = merged.get("quality_flags", [])
                            merged["quality_flags"] = sorted(set(existing + flags))
                        fo.write(json.dumps(merged) + "\n")
                        n_ok += 1
                    print(f"{tag}  ok", file=sys.stderr)
                    fo.flush(); ff.flush()

    print(f"\ndone: {n_ok} written, {n_hard} hard failures -> {failures_path}",
          file=sys.stderr)


if __name__ == "__main__":
    main()
