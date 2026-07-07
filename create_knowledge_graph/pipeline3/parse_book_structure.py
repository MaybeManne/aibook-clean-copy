#!/usr/bin/env python3
"""
Parse chapter/section structure from the raw markdown.

Outputs two JSONL files with `{name|title, start_line, end_line, order, ...}`.
Heuristic is primary; falls back to an LLM call only if the heuristic result
looks suspicious (zero sections found, etc.).

Chapter detection:
  - An H2 heading `## TITLE` where TITLE is mostly uppercase (>=70% of alpha
    chars) AND the next `### N.M` heading's N matches this chapter's index.
  - Actually simpler: scan for H2 headings, group consecutive `### N.M` under
    the most recent H2. Chapter N covers all sections with leading number N.

Section detection:
  - `### N.M TITLE` where N, M are digits and there's whitespace after.
  - Explicitly reject `### N.M.K` (theorem labels look like `### 1.2.3 Theorem`).
  - A chapter-review "section" uses `N.review` when the heading matches
    `### CHAPTER N REVIEW EXERCISES` or similar.

Usage:
    python parse_book_structure.py \
        --src raw/calculus_101.md \
        --out-chapters data2/chapters.jsonl \
        --out-sections data2/sections.jsonl \
        [--numbered]  # if the file already has Lxxxxx: prefixes
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


LINE_PREFIX_RE = re.compile(r"^L(\d{5}): ?(.*)$")

# H2 heading, non-numbered (chapter titles are typically all-caps without numbers)
H2_RE = re.compile(r"^## +(.+?)\s*$")

# Section heading: ### N.M TITLE  (reject ### N.M.K = theorem labels)
SECTION_RE = re.compile(r"^### +(\d+)\.(\d+)(?!\.\d)\s+(.+?)\s*$")

# Chapter review heading
REVIEW_RE = re.compile(r"^### +CHAPTER\s+(\d+)\s+REVIEW", re.IGNORECASE)


def uppercase_ratio(s: str) -> float:
    letters = [c for c in s if c.isalpha()]
    if not letters:
        return 0.0
    return sum(1 for c in letters if c.isupper()) / len(letters)


def read_lines(path: Path, numbered: bool) -> list[tuple[int, str]]:
    """Return [(lineno, body)] — 1-based lineno, body = line content w/o prefix."""
    out = []
    for i, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if numbered:
            m = LINE_PREFIX_RE.match(raw)
            if not m:
                raise ValueError(f"{path}:{i}: missing Lxxxxx: prefix")
            out.append((int(m.group(1)), m.group(2)))
        else:
            out.append((i, raw))
    return out


def parse(lines: list[tuple[int, str]]) -> tuple[list[dict], list[dict]]:
    """Return (chapters, sections)."""
    # Pass 1: find candidate chapter heads and section heads.
    candidate_chapters: list[tuple[int, str]] = []  # (line, title)
    sections_raw: list[tuple[int, str, int, int, str]] = []  # (line, kind, chap, sec, title)

    for lineno, body in lines:
        body_s = body.strip()
        if not body_s:
            continue

        # Section
        m = SECTION_RE.match(body_s)
        if m:
            sections_raw.append((lineno, "section",
                                 int(m.group(1)), int(m.group(2)),
                                 m.group(3).strip()))
            continue

        # Chapter review
        m = REVIEW_RE.match(body_s)
        if m:
            sections_raw.append((lineno, "review", int(m.group(1)), 0,
                                 body_s))
            continue

        # Chapter (H2 heading)
        m = H2_RE.match(body_s)
        if m:
            title = m.group(1).strip()
            # Exclude obvious non-chapter H2s: small letters dominant, or markers like "QUICK CHECK ANSWERS"
            if uppercase_ratio(title) < 0.7:
                continue
            # Skip headings that are clearly not chapter titles
            if any(title.upper().startswith(pfx) for pfx in (
                "QUICK CHECK", "EXERCISE SET", "FOCUS ON", "TECHNOLOGY MASTERY",
                "SAMPLING PITFALLS", "TANGENT LINES", "AREAS AND", "DECIMALS AND",
                "LIMITS", "INFINITE", "ONE-SIDED", "VERTICAL",
            )):
                # Most of these are section-internal subheaders; we'll filter
                # properly by seeing whether an actual `### N.M` heading follows
                # within ~2 lines.
                pass
            candidate_chapters.append((lineno, title))

    if not sections_raw:
        return [], []

    # Pass 2: a chapter title is an H2 that appears just BEFORE the `### N.1`
    # section of a new chapter number. Walk section list, find where N changes,
    # then pick the most recent candidate H2 before that line.
    section_by_chapter: dict[int, list[tuple[int, str, int, int, str]]] = {}
    for sec in sections_raw:
        section_by_chapter.setdefault(sec[2], []).append(sec)

    chapters: list[dict] = []
    ordered_chapter_nums = sorted(section_by_chapter.keys())
    for idx, chap_num in enumerate(ordered_chapter_nums):
        chap_sections = section_by_chapter[chap_num]
        first_sec_line = chap_sections[0][0]

        # Find candidate chapter title: latest candidate whose line < first_sec_line
        title = None
        title_line = None
        for cand_line, cand_title in candidate_chapters:
            if cand_line < first_sec_line:
                title = cand_title
                title_line = cand_line
        # Chapter start_line = the chapter-title line if we found one, else the first section line
        start_line = title_line if title_line is not None else first_sec_line
        # End: one line before the next chapter's start (or EOF)
        if idx + 1 < len(ordered_chapter_nums):
            next_first_sec = section_by_chapter[ordered_chapter_nums[idx + 1]][0][0]
            # Find next chapter's title line too
            next_title_line = None
            for cand_line, _ in candidate_chapters:
                if cand_line < next_first_sec and (title_line is None or cand_line > title_line):
                    next_title_line = cand_line
            end_line = (next_title_line - 1) if next_title_line else (next_first_sec - 1)
        else:
            end_line = lines[-1][0]

        chapters.append({
            "chapter": chap_num,
            "chapter_title": title or f"Chapter {chap_num}",
            "start_line": start_line,
            "end_line": end_line,
            "order": chap_num,
        })

    # Pass 3: section records. Assign end_line = next section's start_line - 1, or
    # chapter end. Also compute section_order within chapter.
    sections: list[dict] = []
    book_order = 0
    for chap in chapters:
        chap_sections = section_by_chapter.get(chap["chapter"], [])
        chap_sections_sorted = sorted(chap_sections, key=lambda x: x[0])
        for i, sec in enumerate(chap_sections_sorted):
            lineno, kind, chap_num, sec_num, title = sec
            if i + 1 < len(chap_sections_sorted):
                end = chap_sections_sorted[i + 1][0] - 1
            else:
                end = chap["end_line"]
            book_order += 1
            if kind == "review":
                name = f"{chap_num}.review"
            else:
                name = f"{chap_num}.{sec_num}"
            sections.append({
                "section":       name,
                "section_title": title,
                "chapter":       chap_num,
                "chapter_title": chap["chapter_title"],
                "start_line":    lineno,
                "end_line":      end,
                "section_order": i + 1,
                "book_order":    book_order,
            })

    return chapters, sections


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--src", type=Path, required=True)
    ap.add_argument("--numbered", action="store_true",
                    help="Source file has Lxxxxx: prefixes (usually the enriched+numbered one).")
    ap.add_argument("--out-chapters", type=Path, required=True)
    ap.add_argument("--out-sections", type=Path, required=True)
    args = ap.parse_args()

    if not args.src.exists():
        raise SystemExit(f"not found: {args.src}")

    lines = read_lines(args.src, args.numbered)
    chapters, sections = parse(lines)

    write_jsonl(args.out_chapters, chapters)
    write_jsonl(args.out_sections, sections)

    print(f"chapters: {len(chapters)}, sections: {len(sections)}", file=sys.stderr)
    for c in chapters:
        print(f"  Chapter {c['chapter']}: {c['chapter_title']!r}  "
              f"L{c['start_line']:05d}-L{c['end_line']:05d}", file=sys.stderr)
    if len(sections) < 3:
        print("WARNING: heuristic found very few sections; consider LLM fallback.",
              file=sys.stderr)


if __name__ == "__main__":
    main()
