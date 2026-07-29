#!/usr/bin/env python3
"""
Build a vocabulary file from the book's own terminology.

Scans book.numbered.md for:
  - **bold** terms  (primary: explicit definitions)
  - *italic* terms  (secondary: introduced terms)
  - Section headings (## / ###)

Output: vocab.json
  {
    "terms": ["Surface Albedo", "BRDF", "Pinhole Camera Model", ...],
    "by_line": {"L02806": ["Surface Albedo"], ...}
  }

Usage:
    python build_vocab.py \
        --numbered data_vision/book.numbered.md \
        --out      data_vision/vocab.json
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

LINE_RE   = re.compile(r"^L(\d{5}): (.*)$")
BOLD_RE   = re.compile(r"\*\*([^*\n]{2,80})\*\*")
ITALIC_RE = re.compile(r"(?<!\*)\*([^*\n]{2,60})\*(?!\*)")
HEADING_RE = re.compile(r"^#{2,4} (.+)$")


def clean_term(raw: str) -> str:
    """Strip markdown, QMD anchors, extra whitespace, trailing punctuation."""
    t = re.sub(r"\{#[^}]+\}", "", raw)   # strip {#sec-...} QMD anchors
    t = re.sub(r"[_`$\\]", "", t).strip()
    t = re.sub(r"[.,:;]+$", "", t).strip()
    return t


_SENTENCE_RE = re.compile(r"\b(is|are|was|were|has|have|can|will|would|should|does|becomes|says)\b", re.I)


def _looks_like_term(t: str) -> bool:
    """Return True if t looks like a concept name rather than a sentence."""
    words = t.split()
    if len(words) > 8 or len(t) > 70:
        return False
    if t.endswith("?") or t.endswith("."):
        return False
    if _SENTENCE_RE.search(t):
        return False
    return True


def extract_terms(line_marker: str, body: str) -> list[str]:
    terms = []
    # Bold terms are most reliable (explicit definitions in textbooks)
    for m in BOLD_RE.finditer(body):
        t = clean_term(m.group(1))
        if t and _looks_like_term(t):
            terms.append(t)
    # Italic terms: only if no bold on this line and looks like a proper noun phrase
    if not terms:
        for m in ITALIC_RE.finditer(body):
            t = clean_term(m.group(1))
            if t and len(t.split()) >= 2 and _looks_like_term(t):
                terms.append(t)
    # Section headings: only short ones
    hm = HEADING_RE.match(body)
    if hm:
        t = clean_term(hm.group(1))
        if t and _looks_like_term(t):
            terms.append(t)
    return terms


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered", type=Path, required=True)
    ap.add_argument("--out",      type=Path, required=True)
    args = ap.parse_args()

    by_line: dict[str, list[str]] = {}
    all_terms: set[str] = set()

    for raw in args.numbered.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if not m:
            continue
        marker = f"L{m.group(1)}"
        body   = m.group(2)
        terms  = extract_terms(marker, body)
        if terms:
            by_line[marker] = terms
            all_terms.update(terms)

    # Sort by length descending so longer phrases match before substrings
    sorted_terms = sorted(all_terms, key=lambda t: (-len(t), t))

    out = {
        "terms":   sorted_terms,
        "by_line": by_line,
        "counts":  {"terms": len(sorted_terms), "lines_with_terms": len(by_line)},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"vocab: {len(sorted_terms)} terms from {len(by_line)} lines → {args.out}")


if __name__ == "__main__":
    main()
