#!/usr/bin/env python3
"""
Split a numbered markdown file into chunks for Gemini extraction.

Design:
  - Never split mid-line (line prefixes must survive intact).
  - Prefer splits at `##` / `###` headings; otherwise at blank lines.
  - Target ~target_tokens per chunk, hard ceiling at max_tokens.
  - Overlap: the last `overlap_paragraphs` blocks of chunk N are repeated at
    the start of chunk N+1, so definitions that straddle a boundary appear in
    full on at least one side. Overlap line numbers are recorded so downstream
    dedup can tell the difference between a concept and its shadow.

Token count: we use a cheap char-based approximation (len/4). Swap in tiktoken
or Gemini's tokenizer if you need accuracy; it does not change chunk boundaries
for this file, only their count.

Output:
    chunks/<stem>_c001.md            (numbered markdown, the input to Gemini)
    chunks/<stem>_c002.md
    ...
    chunks/<stem>.manifest.jsonl     (one line per chunk)

Manifest record:
    {
      "chunk_id": "ch1_c003",
      "file": "calculus 101.numbered.md",
      "span":    { "start": "L00784", "end": "L01352" },
      "overlap": { "start": "L00770", "end": "L00783" },   // optional
      "headings": ["1.2 COMPUTING LIMITS", "SOME BASIC LIMITS"],
      "approx_tokens": 6421,
      "n_lines": 569
    }
"""
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path

LINE_RE = re.compile(r"^L(\d{5}): (.*)$")
HEADING_RE = re.compile(r"^#{1,6} ")
CHARS_PER_TOKEN = 4  # approximation


@dataclass
class Block:
    """A block = one or more consecutive non-blank lines from the numbered file."""
    lines: list[tuple[int, str]] = field(default_factory=list)  # (lineno, raw_with_prefix)

    @property
    def start(self) -> int:
        return self.lines[0][0]

    @property
    def end(self) -> int:
        return self.lines[-1][0]

    @property
    def text(self) -> str:
        return "\n".join(line for _, line in self.lines)

    @property
    def char_len(self) -> int:
        return sum(len(line) + 1 for _, line in self.lines)

    @property
    def is_heading(self) -> bool:
        if not self.lines:
            return False
        # strip "Lxxxxx: " prefix before checking
        m = LINE_RE.match(self.lines[0][1])
        body = m.group(2) if m else self.lines[0][1]
        return bool(HEADING_RE.match(body))

    @property
    def is_chapter_heading(self) -> bool:
        """True if this block is an H1 heading (chapter boundary)."""
        if not self.lines:
            return False
        m = LINE_RE.match(self.lines[0][1])
        body = m.group(2) if m else self.lines[0][1]
        return body.startswith("# ") and not body.startswith("## ")

    @property
    def heading_text(self) -> str | None:
        if not self.is_heading:
            return None
        m = LINE_RE.match(self.lines[0][1])
        body = m.group(2) if m else self.lines[0][1]
        return body.lstrip("#").strip()


def read_blocks(path: Path) -> list[Block]:
    """Parse a numbered markdown file into blocks separated by blank lines."""
    blocks: list[Block] = []
    current = Block()
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if not m:
            raise ValueError(f"{path}: line without Lxxxxx: prefix:\n  {raw!r}")
        lineno = int(m.group(1))
        body = m.group(2)
        if body.strip() == "":
            if current.lines:
                blocks.append(current)
                current = Block()
            continue
        current.lines.append((lineno, raw))
    if current.lines:
        blocks.append(current)
    return blocks


def lmark(n: int) -> str:
    return f"L{n:05d}"


def chunk_blocks(
    blocks: list[Block],
    target_tokens: int,
    max_tokens: int,
    overlap_paragraphs: int,
    section_starts: set[int] | None = None,
) -> list[list[Block]]:
    """Greedy pack blocks into chunks under the token budget, preferring heading boundaries.

    If `section_starts` is provided (set of line numbers where a new section
    begins, from parse_book_structure.py), a block beginning at one of those
    lines is a strong hint to flush even when below the token target.
    """
    if section_starts is None:
        section_starts = set()
    chunks: list[list[Block]] = []
    cur: list[Block] = []
    cur_chars = 0
    target_chars = target_tokens * CHARS_PER_TOKEN
    max_chars = max_tokens * CHARS_PER_TOKEN
    min_flush_chars = target_chars // 3  # don't flush tiny chunks on section boundary

    for blk in blocks:
        blk_chars = blk.char_len
        # Single oversized block (e.g. a massive table). Put it in its own chunk.
        if blk_chars > max_chars:
            if cur:
                chunks.append(cur)
                cur, cur_chars = [], 0
            chunks.append([blk])
            continue

        # Chapter boundary (H1): always flush, even if chunk is tiny.
        # This ensures the previous chapter's tail is in one chunk and the
        # new chapter starts a fresh chunk with the correct heading context.
        if blk.is_chapter_heading and cur:
            chunks.append(cur)
            cur, cur_chars = [], 0

        # Strong split: new section starts here and we have substance.
        elif blk.start in section_starts and cur_chars >= min_flush_chars and cur:
            chunks.append(cur)
            cur, cur_chars = [], 0

        # Heading-aware split: if this block is a heading and we are already
        # past target, flush — but only if the current chunk has substance.
        elif blk.is_heading and cur_chars >= target_chars and cur:
            chunks.append(cur)
            cur, cur_chars = [], 0

        # Hard ceiling: flush before adding would overflow.
        if cur_chars + blk_chars > max_chars and cur:
            chunks.append(cur)
            cur, cur_chars = [], 0

        cur.append(blk)
        cur_chars += blk_chars

    if cur:
        chunks.append(cur)

    # Apply overlap: prepend the last N blocks of chunk i to chunk i+1.
    if overlap_paragraphs > 0 and len(chunks) > 1:
        overlapped: list[list[Block]] = [chunks[0]]
        for i in range(1, len(chunks)):
            tail = chunks[i - 1][-overlap_paragraphs:]
            overlapped.append(tail + chunks[i])
        chunks = overlapped

    return chunks


def current_headings(blocks_so_far: list[Block]) -> list[str]:
    """Track the most recent H1/H2/H3 heading text leading up to this chunk."""
    h: dict[int, str] = {}
    for blk in blocks_so_far:
        if not blk.is_heading:
            continue
        first = blk.lines[0][1]
        m = LINE_RE.match(first)
        body = m.group(2) if m else first
        level = len(body) - len(body.lstrip("#"))
        h[level] = body.lstrip("#").strip()
        # clear deeper headings when a shallower one appears
        for lvl in list(h):
            if lvl > level:
                del h[lvl]
    return [h[k] for k in sorted(h)]


def write_chunks(
    chunks: list[list[Block]],
    out_dir: Path,
    stem: str,
    src_path: Path,
    overlap_paragraphs: int,
) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / f"{stem}.manifest.jsonl"

    # For heading tracking, we need the running list of all blocks seen so far
    # in the *original* order, not including overlap duplicates.
    all_blocks: list[Block] = []
    flat: list[Block] = []
    for ch in chunks:
        flat.extend(ch)
    # Rebuild from the first chunk; overlap blocks share lineno with prior ones.
    seen_starts: set[int] = set()

    with manifest_path.open("w", encoding="utf-8") as mf:
        for idx, chunk in enumerate(chunks, start=1):
            chunk_id = f"{stem}_c{idx:03d}"
            chunk_path = out_dir / f"{chunk_id}.md"

            # Determine overlap vs primary span.
            primary_start_idx = 0
            if idx > 1 and overlap_paragraphs > 0:
                primary_start_idx = min(overlap_paragraphs, len(chunk))
            primary = chunk[primary_start_idx:]
            overlap_blocks = chunk[:primary_start_idx]

            if not primary:
                # Edge case: entire chunk is overlap (shouldn't happen, but guard).
                primary = chunk
                overlap_blocks = []

            # Write chunk file (overlap first, then primary — reading order).
            chunk_path.write_text(
                "\n".join(blk.text for blk in chunk) + "\n",
                encoding="utf-8",
            )

            # Capture heading context at the START of this chunk (before adding
            # its blocks), then add the blocks. This ensures chunks that span a
            # chapter boundary are labelled with the heading at their beginning,
            # not the heading at their end.
            headings = current_headings(all_blocks)
            for blk in primary:
                if blk.start not in seen_starts:
                    all_blocks.append(blk)
                    seen_starts.add(blk.start)

            record = {
                "chunk_id": chunk_id,
                "file": src_path.name,
                "span": {
                    "start": lmark(primary[0].start),
                    "end": lmark(primary[-1].end),
                },
                "headings": headings,
                "approx_tokens": sum(b.char_len for b in chunk) // CHARS_PER_TOKEN,
                "n_lines": sum(len(b.lines) for b in chunk),
            }
            if overlap_blocks:
                record["overlap"] = {
                    "start": lmark(overlap_blocks[0].start),
                    "end": lmark(overlap_blocks[-1].end),
                }
            mf.write(json.dumps(record) + "\n")

    return manifest_path


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("src", type=Path, help="Numbered markdown file.")
    ap.add_argument("--out-dir", type=Path, default=Path("chunks"))
    ap.add_argument("--stem", type=str, default=None,
                    help="Chunk id stem (default: derived from src filename).")
    ap.add_argument("--target-tokens", type=int, default=6000)
    ap.add_argument("--max-tokens", type=int, default=9000)
    ap.add_argument("--overlap-paragraphs", type=int, default=2)
    ap.add_argument("--sections", type=Path, default=None,
                    help="Optional sections.jsonl from parse_book_structure.py; "
                         "splits at section boundaries are strongly preferred.")
    args = ap.parse_args()

    if not args.src.exists():
        raise SystemExit(f"not found: {args.src}")

    stem = args.stem or args.src.stem.replace(" ", "_").replace(".numbered", "")
    blocks = read_blocks(args.src)
    if not blocks:
        raise SystemExit(f"{args.src}: no non-blank blocks found")

    section_starts: set[int] = set()
    if args.sections and args.sections.exists():
        with args.sections.open() as f:
            for line in f:
                rec = json.loads(line)
                section_starts.add(int(rec["start_line"]))
        print(f"section-start hints: {len(section_starts)} lines")

    chunks = chunk_blocks(
        blocks,
        target_tokens=args.target_tokens,
        max_tokens=args.max_tokens,
        overlap_paragraphs=args.overlap_paragraphs,
        section_starts=section_starts,
    )

    manifest = write_chunks(chunks, args.out_dir, stem, args.src, args.overlap_paragraphs)
    print(
        f"{args.src}: {len(blocks)} blocks -> {len(chunks)} chunks; "
        f"manifest: {manifest}",
    )


if __name__ == "__main__":
    main()
