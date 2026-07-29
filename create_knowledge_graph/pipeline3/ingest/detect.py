"""
Parse _quarto.yml to get an ordered list of content chapters.

Returns [{stem, qmd_file, qmd_path, part, chapter_num}] in book order.
Front matter, back matter, and part-divider files are excluded.
"""
from __future__ import annotations

import re
from pathlib import Path

# Stems that are front/back matter — always skip
SKIP_STEMS = frozenset([
    "index", "copyright", "notations", "references", "series",
])


def load_chapter_list(book_dir: Path) -> list[dict]:
    """
    Return ordered list of content chapter dicts.
    Tries PyYAML first; falls back to a line-by-line regex parser.
    """
    quarto_yml = book_dir / "_quarto.yml"
    if not quarto_yml.exists():
        raise FileNotFoundError(f"Not found: {quarto_yml}")

    text = quarto_yml.read_text(encoding="utf-8")

    try:
        import yaml  # type: ignore
        data = yaml.safe_load(text)
        return _from_parsed(data, book_dir)
    except ImportError:
        pass

    return _from_regex(text, book_dir)


# ── PyYAML path ────────────────────────────────────────────────────────────────

def _from_parsed(data: dict, book_dir: Path) -> list[dict]:
    book = data.get("book", {})
    return _walk(book.get("chapters", []), book_dir)


def _walk(entries: list, book_dir: Path) -> list[dict]:
    results: list[dict] = []
    chapter_num = 0

    for entry in entries:
        if isinstance(entry, str):
            stem = Path(entry).stem
            if stem in SKIP_STEMS or stem.startswith("part_"):
                continue
            chapter_num += 1
            results.append(_rec(entry, None, chapter_num, book_dir))

        elif isinstance(entry, dict) and "part" in entry:
            part_stem = Path(entry["part"]).stem.removeprefix("part_")
            for sub in entry.get("chapters", []):
                if not isinstance(sub, str):
                    continue
                stem = Path(sub).stem
                if stem in SKIP_STEMS or stem.startswith("part_"):
                    continue
                chapter_num += 1
                results.append(_rec(sub, part_stem, chapter_num, book_dir))

    return results


def _rec(qmd_file: str, part: str | None, chapter_num: int, book_dir: Path) -> dict:
    return {
        "stem": Path(qmd_file).stem,
        "qmd_file": qmd_file,
        "qmd_path": book_dir / qmd_file,
        "part": part,
        "chapter_num": chapter_num,
    }


# ── Regex fallback (no PyYAML) ────────────────────────────────────────────────

def _from_regex(text: str, book_dir: Path) -> list[dict]:
    """
    Minimal state-machine parser for _quarto.yml's chapters block.
    Only needs to handle the format produced by Quarto's own YAML generator.
    """
    results: list[dict] = []
    chapter_num = 0
    current_part: str | None = None

    # States: BEFORE | TOP_CHAPTERS | BEFORE_SUB | SUB_CHAPTERS
    state = "BEFORE"

    for line in text.splitlines():
        # ── Detect entry into the top-level chapters block ────────────────────
        if state == "BEFORE":
            if re.match(r"^  chapters:\s*$", line):
                state = "TOP_CHAPTERS"
            continue

        # ── Stop if we're back at root-level YAML keys ────────────────────────
        if re.match(r"^\S", line) and line.strip():
            break

        if state == "TOP_CHAPTERS":
            # part divider
            m = re.match(r"^\s+- part:\s+(\S+)\s*$", line)
            if m:
                raw = Path(m.group(1)).stem
                current_part = raw.removeprefix("part_")
                state = "BEFORE_SUB"
                continue

            # simple top-level chapter
            m = re.match(r"^\s+- (\S+\.qmd)\s*$", line)
            if m:
                qmd_file = m.group(1)
                stem = Path(qmd_file).stem
                if stem not in SKIP_STEMS and not stem.startswith("part_"):
                    chapter_num += 1
                    results.append(_rec(qmd_file, None, chapter_num, book_dir))
                continue

        elif state == "BEFORE_SUB":
            # look for the `chapters:` key under the part entry
            if re.match(r"^\s+chapters:\s*$", line):
                state = "SUB_CHAPTERS"

        elif state == "SUB_CHAPTERS":
            # another part entry starts a new sub-block
            m = re.match(r"^\s+- part:\s+(\S+)\s*$", line)
            if m:
                raw = Path(m.group(1)).stem
                current_part = raw.removeprefix("part_")
                state = "BEFORE_SUB"
                continue

            # sub-chapter entry
            m = re.match(r"^\s+- (\S+\.qmd)\s*$", line)
            if m:
                qmd_file = m.group(1)
                stem = Path(qmd_file).stem
                if stem not in SKIP_STEMS and not stem.startswith("part_"):
                    chapter_num += 1
                    results.append(_rec(qmd_file, current_part, chapter_num, book_dir))
                continue

            # If we see a line at 4-space indent that isn't a chapter or part,
            # we might have exited the sub-chapters block — go back to top.
            if re.match(r"^    - \S", line):
                # Could be a new top-level chapter; re-process as TOP_CHAPTERS
                state = "TOP_CHAPTERS"
                m2 = re.match(r"^\s+- (\S+\.qmd)\s*$", line)
                if m2:
                    qmd_file = m2.group(1)
                    stem = Path(qmd_file).stem
                    if stem not in SKIP_STEMS and not stem.startswith("part_"):
                        chapter_num += 1
                        results.append(_rec(qmd_file, None, chapter_num, book_dir))

    return results
