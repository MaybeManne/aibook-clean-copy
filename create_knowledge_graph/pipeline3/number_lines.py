#!/usr/bin/env python3
"""
Number every line of a markdown file with a fixed-width `Lxxxxx: ` prefix.

The numbered file is what gets fed to Gemini. Line numbers are 1-based and
zero-padded to 5 digits. Round-trip: `strip_lines` reverses the transform.

Usage:
    python number_lines.py IN.md OUT.md
    python number_lines.py --strip IN.md OUT.md
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

PREFIX_RE = re.compile(r"^L\d{5}: ?")
PAD = 5


def number(src: Path, dst: Path) -> int:
    lines = src.read_text(encoding="utf-8").splitlines()
    if len(lines) >= 10 ** PAD:
        raise SystemExit(
            f"{src}: {len(lines)} lines exceeds {10**PAD - 1}; widen PAD in number_lines.py"
        )
    with dst.open("w", encoding="utf-8") as f:
        for i, line in enumerate(lines, start=1):
            f.write(f"L{i:0{PAD}d}: {line}\n")
    return len(lines)


def strip(src: Path, dst: Path) -> int:
    n = 0
    with src.open("r", encoding="utf-8") as fi, dst.open("w", encoding="utf-8") as fo:
        for raw in fi:
            raw = raw.rstrip("\n")
            stripped = PREFIX_RE.sub("", raw, count=1)
            fo.write(stripped + "\n")
            n += 1
    return n


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("src", type=Path)
    ap.add_argument("dst", type=Path)
    ap.add_argument("--strip", action="store_true", help="Reverse transform.")
    args = ap.parse_args()

    if not args.src.exists():
        raise SystemExit(f"not found: {args.src}")
    args.dst.parent.mkdir(parents=True, exist_ok=True)

    n = strip(args.src, args.dst) if args.strip else number(args.src, args.dst)
    verb = "stripped" if args.strip else "numbered"
    print(f"{verb} {n} lines: {args.src} -> {args.dst}", file=sys.stderr)


if __name__ == "__main__":
    main()
