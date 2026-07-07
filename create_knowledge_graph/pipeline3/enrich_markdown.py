#!/usr/bin/env python3
"""
Replace raw image markdown with [FIGURE:<asset_id>] tokens + inlined alt text.

For each `![<alt>](url)` in the source markdown, rewrite to:

    [FIGURE:<asset_id> | <short alt text up to ~200 chars>]

Where asset_id is sha256(url)[:16] — the same key used by the images.jsonl
manifest. URL is removed from the enriched markdown; downstream renderers
(tutor UI, lesson generator) look up full URL + reproduction code from
images.jsonl by asset_id.

For tables written as `| col | col |` markdown rows, we also attach a token
on the line that introduces them (if detected via a caption line like
`Table 1.1.1`). Not implemented in this pass — tables already render fine.

Pure program. Idempotent.

Usage:
    python enrich_markdown.py \
        --src data3/book_raw.md \
        --manifest data3/images.jsonl \
        --out data3/book.enriched.md
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def url_to_asset_id(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def load_assets_by_url(manifest_path: Path) -> dict[str, dict]:
    """Return {url: asset_record}."""
    out: dict[str, dict] = {}
    with manifest_path.open() as f:
        for line in f:
            r = json.loads(line)
            if r.get("url"):
                out[r["url"]] = r
    return out


def shorten(text: str, limit: int) -> str:
    s = re.sub(r"\s+", " ", text).strip()
    if len(s) <= limit:
        return s
    cut = s[:limit]
    sp = cut.rfind(" ")
    if sp > limit * 0.7:
        cut = cut[:sp]
    return cut.rstrip(",.;:") + "..."


def enrich_line(line: str, assets_by_url: dict[str, dict], alt_limit: int) -> tuple[str, int]:
    n = 0

    def sub(m: re.Match) -> str:
        nonlocal n
        url = m.group(2)
        asset = assets_by_url.get(url)
        # asset_id: prefer the manifest's recorded id; fall back to recomputing.
        if asset is not None:
            asset_id = asset.get("asset_id") or url_to_asset_id(url)
            alt = (asset.get("alt_text_md") or m.group(1) or "").strip()
        else:
            asset_id = url_to_asset_id(url)
            alt = (m.group(1) or "").strip()
        n += 1
        if alt:
            short = shorten(alt, alt_limit).replace("]", ")")  # keep brackets valid
            return f"[FIGURE:{asset_id} | {short}]"
        return f"[FIGURE:{asset_id}]"

    return IMG_RE.sub(sub, line), n


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--src",      type=Path, required=True)
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--out",      type=Path, required=True)
    ap.add_argument("--alt-char-limit", type=int, default=200)
    args = ap.parse_args()

    assets_by_url = load_assets_by_url(args.manifest)
    with_alt = sum(1 for a in assets_by_url.values() if a.get("alt_text_md"))
    print(f"assets indexed: {len(assets_by_url)} "
          f"({with_alt} with alt_text)", file=sys.stderr)

    total_rep = 0
    total_lines = 0
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.src.open(encoding="utf-8") as fi, args.out.open("w", encoding="utf-8") as fo:
        for line in fi:
            total_lines += 1
            line = line.rstrip("\n")
            new, n = enrich_line(line, assets_by_url, args.alt_char_limit)
            fo.write(new + "\n")
            total_rep += n

    print(f"enriched: {total_rep} image markers replaced across {total_lines} lines",
          file=sys.stderr)


if __name__ == "__main__":
    main()
