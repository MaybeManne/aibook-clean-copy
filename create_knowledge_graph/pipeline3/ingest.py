#!/usr/bin/env python3
"""
Stage 0: Assemble book_raw.md + book_profile.json from any source format.

book_profile.json tells every downstream stage how to interpret the book:
  heading structure, image source type, cross-ref style, etc.

Formats:
  --format qmd   Quarto book: reads _quarto.yml + .qmd files
  --format md    Single markdown file (pre-converted, like the calculus book)
  --format pdf   PDF: extracts with PyMuPDF; pass --mathpix-key for math OCR

Outputs (always):
  <out-dir>/book_raw.md        assembled raw text
  <out-dir>/book_profile.json  structural metadata for downstream stages

Outputs (QMD only — bypasses parse_book_structure stage):
  <out-dir>/chapters.jsonl
  <out-dir>/sections.jsonl

Usage:
  # Quarto book (vision textbook)
  python ingest.py --format qmd --book-dir /path/to/repo --out-dir data_vision

  # Pre-converted markdown (calculus textbook)
  python ingest.py --format md --src "calculus 101.md" --out-dir data3

  # PDF
  python ingest.py --format pdf --src textbook.pdf --out-dir data_new
  python ingest.py --format pdf --src textbook.pdf --out-dir data_new --mathpix-key $MATHPIX_KEY
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from ingest.detect import load_chapter_list
from ingest.from_qmd import strip_qmd
from ingest.from_pdf import extract_pdf


# ── Heading regexes for QMD structure scan ────────────────────────────────────
# QMD uses H1 = chapter, H2 = section, H3 = subsection
# Attributes like {#sec-id} are stripped for display but ID is extracted.

_H1_RE    = re.compile(r"^# +(.+)$")
_H2_RE    = re.compile(r"^## +(.+)$")
_ATTR_RE  = re.compile(r"\{[^}]*\}")
_ID_RE    = re.compile(r"\{#([\w-]+)")   # first {#id ...} in attrs
_FENCE_RE = re.compile(r"^(`{3,}|~{3,})")  # code fence open/close


def _strip_attrs(s: str) -> str:
    return _ATTR_RE.sub("", s).strip()


def _extract_id(s: str) -> str | None:
    m = _ID_RE.search(s)
    return m.group(1) if m else None


# ── QMD ingestion ─────────────────────────────────────────────────────────────

def _ingest_qmd(book_dir: Path, out_dir: Path) -> tuple[str, list[dict], list[dict]]:
    """
    Read all content chapters from _quarto.yml, clean minimally, concatenate.
    Returns (combined_text, chapters_meta, sections_meta).
    chapters/sections metadata uses 1-based line numbers into combined_text.
    """
    chapters_list = load_chapter_list(book_dir)

    if not chapters_list:
        raise RuntimeError("No content chapters found in _quarto.yml")

    parts: list[str] = []
    line_offset = 0   # 1-based line of the start of the current chapter in combined text

    chapters_raw: list[dict] = []  # (start_line, end_line_placeholder, ch_num, title)
    section_events: list[dict] = []

    n_ok = n_miss = 0

    for ch in chapters_list:
        if not ch["qmd_path"].exists():
            print(f"  SKIP (not found): {ch['stem']}", file=sys.stderr)
            n_miss += 1
            continue

        text = strip_qmd(ch["qmd_path"])
        ch_lines = text.splitlines()

        ch_start = line_offset + 1
        ch_title = ch["stem"]
        ch_num   = ch["chapter_num"]
        sec_num  = 0
        in_code  = False

        for rel, line in enumerate(ch_lines):
            abs_line = line_offset + rel + 1
            s = line.strip()

            # Track code fences so # comments inside code blocks are not
            # mistaken for H1 chapter headings.
            if _FENCE_RE.match(s):
                in_code = not in_code
                continue
            if in_code:
                continue

            m = _H1_RE.match(s)
            if m:
                ch_title = _strip_attrs(m.group(1))
                continue

            m = _H2_RE.match(s)
            if m:
                sec_num += 1
                raw_title = m.group(1)
                section_events.append({
                    "abs_line": abs_line,
                    "ch_num":   ch_num,
                    "sec_num":  sec_num,
                    "title":    _strip_attrs(raw_title),
                    "sec_id":   _extract_id(raw_title),
                    "ch_title": ch_title,
                })

        ch_end = line_offset + len(ch_lines)
        chapters_raw.append({
            "ch_num":  ch_num,
            "title":   ch_title,
            "start":   ch_start,
            "end":     ch_end,
            "part":    ch["part"],
        })

        parts.append(text)
        line_offset += len(ch_lines) + 1  # +1 for the blank separator line
        n_ok += 1
        print(f"  ok  ch{ch_num:02d} {ch['stem']}", file=sys.stderr)

    combined = "\n\n".join(parts)

    # ── Build chapters.jsonl ──────────────────────────────────────────────────
    chapters_meta: list[dict] = []
    for k, c in enumerate(chapters_raw):
        end = chapters_raw[k + 1]["start"] - 2 if k + 1 < len(chapters_raw) else line_offset
        chapters_meta.append({
            "chapter":       c["ch_num"],
            "chapter_title": c["title"],
            "start_line":    c["start"],
            "end_line":      end,
            "order":         c["ch_num"],
            "part":          c["part"],
        })

    # ── Build sections.jsonl ──────────────────────────────────────────────────
    sections_meta: list[dict] = []
    book_order = 0
    for k, s in enumerate(section_events):
        end = section_events[k + 1]["abs_line"] - 1 if k + 1 < len(section_events) else line_offset
        book_order += 1
        sections_meta.append({
            "section":        f"{s['ch_num']}.{s['sec_num']}",
            "section_title":  s["title"],
            "section_id":     s["sec_id"],
            "chapter":        s["ch_num"],
            "chapter_title":  s["ch_title"],
            "start_line":     s["abs_line"],
            "end_line":       end,
            "section_order":  s["sec_num"],
            "book_order":     book_order,
        })

    print(f"\n  assembled: {n_ok} chapters, {len(sections_meta)} sections"
          + (f", {n_miss} skipped" if n_miss else ""),
          file=sys.stderr)
    return combined, chapters_meta, sections_meta


# ── MD ingestion ──────────────────────────────────────────────────────────────

def _ingest_md(src: Path) -> str:
    if not src.exists():
        raise FileNotFoundError(f"Not found: {src}")
    text = src.read_text(encoding="utf-8")
    print(f"  md: {len(text.splitlines())} lines from {src.name}", file=sys.stderr)
    return text


# ── Profile builders ──────────────────────────────────────────────────────────

def _qmd_book_title(book_dir: Path) -> str:
    """Extract book title from _quarto.yml, best-effort."""
    try:
        quarto_yml = (book_dir / "_quarto.yml").read_text(encoding="utf-8")
        try:
            import yaml  # type: ignore
            data = yaml.safe_load(quarto_yml)
            return data.get("book", {}).get("title", "")
        except ImportError:
            import re
            m = re.search(r"^\s{2}title:\s+(.+)$", quarto_yml, re.MULTILINE)
            return m.group(1).strip().strip('"\'') if m else ""
    except Exception:
        return ""


def _qmd_profile(book_dir: Path) -> dict:
    title = _qmd_book_title(book_dir)
    return {
        "format": "qmd",
        "created": str(date.today()),
        "source_type": "quarto_book",
        "book_dir": str(book_dir),
        "book_title": title,
        "heading": {
            "chapter_level": 1,
            "section_level": 2,
            "subsection_level": 3,
            "chapter_style": "any_case",
            "section_numbered": False,
        },
        "images": {
            "source": "local",
            "path_style": "relative_to_book_dir",
            "id_style": "quarto_attr",
        },
        "crossref_style": "quarto",
        "structure_in_ingest": True,
    }


def _md_profile(src: Path) -> dict:
    return {
        "format": "md",
        "created": str(date.today()),
        "source_type": "markdown_file",
        "src": str(src),
        "heading": {
            "chapter_level": 2,
            "chapter_style": "uppercase",    # ## CHAPTER TITLE
            "section_level": 3,
            "section_numbered": True,        # ### N.M Title
        },
        "images": {
            "source": "url",
            "id_style": "sha256_url",
        },
        "crossref_style": "none",
        "structure_in_ingest": False,
    }


def _pdf_profile(src: Path, used_mathpix: bool) -> dict:
    return {
        "format": "pdf",
        "created": str(date.today()),
        "source_type": "pdf",
        "src": str(src),
        "extraction": "mathpix" if used_mathpix else "pymupdf",
        "heading": {
            "detection": "llm",            # parse_book_structure uses LLM fallback
        },
        "images": {
            "source": "embedded",          # to be handled by a future stage
        },
        "crossref_style": "none",
        "structure_in_ingest": False,
    }


# ── Utilities ──────────────────────────────────────────────────────────────────

def _write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--format", choices=["qmd", "md", "pdf"], required=True,
                    help="Source format")

    # QMD
    ap.add_argument("--book-dir", type=Path, default=None,
                    help="[qmd] Root of Quarto repo (contains _quarto.yml)")

    # MD / PDF
    ap.add_argument("--src", type=Path, default=None,
                    help="[md/pdf] Path to the source file")

    # PDF-specific
    ap.add_argument("--mathpix-key", default=os.environ.get("MATHPIX_KEY"),
                    help="[pdf] Mathpix API key (or set MATHPIX_KEY env var)")

    ap.add_argument("--out-dir", type=Path, required=True,
                    help="Output directory")

    # QMD filter
    ap.add_argument("--chapter", default=None, metavar="STEM",
                    help="[qmd] Process only this chapter stem (for testing)")

    ap.add_argument("--list", action="store_true",
                    help="[qmd] List chapters without processing")

    args = ap.parse_args()
    out_dir = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    # ── QMD ──────────────────────────────────────────────────────────────────
    if args.format == "qmd":
        book_dir = (args.book_dir or Path(".")).resolve()

        if args.list:
            chapters = load_chapter_list(book_dir)
            for c in chapters:
                exists = "+" if c["qmd_path"].exists() else "!"
                print(f"  [{exists}] {c['chapter_num']:02d}  "
                      f"{c['stem']:<45}  part={c['part']}")
            print(f"\n{len(chapters)} content chapters")
            return

        if args.chapter:
            # Monkey-patch: filter chapter list
            from ingest import detect as _det
            _orig = _det.load_chapter_list
            def _filtered(bd):
                return [c for c in _orig(bd) if c["stem"] == args.chapter]
            _det.load_chapter_list = _filtered

        book_raw, chapters_meta, sections_meta = _ingest_qmd(book_dir, out_dir)
        profile = _qmd_profile(book_dir)

        _write_jsonl(out_dir / "chapters.jsonl", chapters_meta)
        _write_jsonl(out_dir / "sections.jsonl", sections_meta)
        print(f"  wrote chapters.jsonl ({len(chapters_meta)}), "
              f"sections.jsonl ({len(sections_meta)})", file=sys.stderr)

    # ── MD ───────────────────────────────────────────────────────────────────
    elif args.format == "md":
        if not args.src:
            sys.exit("ERROR: --src required for --format md")
        book_raw = _ingest_md(args.src.resolve())
        profile = _md_profile(args.src.resolve())

    # ── PDF ──────────────────────────────────────────────────────────────────
    elif args.format == "pdf":
        if not args.src:
            sys.exit("ERROR: --src required for --format pdf")
        src = args.src.resolve()
        if not src.exists():
            sys.exit(f"ERROR: not found: {src}")
        book_raw = extract_pdf(src, mathpix_key=args.mathpix_key)
        profile = _pdf_profile(src, used_mathpix=bool(args.mathpix_key))

    # ── Write outputs ─────────────────────────────────────────────────────────
    book_raw_path = out_dir / "book_raw.md"
    book_raw_path.write_text(book_raw, encoding="utf-8")
    size_kb = book_raw_path.stat().st_size // 1024
    print(f"  wrote book_raw.md  ({size_kb} KB)", file=sys.stderr)

    profile_path = out_dir / "book_profile.json"
    profile_path.write_text(json.dumps(profile, indent=2) + "\n", encoding="utf-8")
    print(f"  wrote book_profile.json  (format={profile['format']})", file=sys.stderr)

    # For QMD: mark parse_structure as already done in pipeline state so
    # run.py doesn't re-run it (ingest.py already produced chapters/sections).
    if args.format == "qmd" and not args.chapter:
        state_path = out_dir / "pipeline.state.json"
        state: dict = {"completed": [], "timings": {}}
        if state_path.exists():
            try:
                state = json.loads(state_path.read_text())
            except Exception:
                pass
        if "parse_structure" not in state.get("completed", []):
            state.setdefault("completed", []).append("parse_structure")
            state.setdefault("timings", {})["parse_structure"] = int(__import__("time").time())
            state_path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
            print("  marked parse_structure complete in pipeline.state.json",
                  file=sys.stderr)

    print("\ndone.", file=sys.stderr)


if __name__ == "__main__":
    main()
