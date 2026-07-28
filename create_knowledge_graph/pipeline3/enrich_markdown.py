#!/usr/bin/env python3
"""
Replace raw image markdown with [FIGURE:<asset_id>] tokens + inlined alt text.

Handles two image reference styles:

  URL-based (calculus / PDF books):
    ![alt](https://example.com/img.png)
    → [FIGURE:<sha256(url)[:16]> | alt]

  Local-file / QMD books:
    ![alt](figures/ch/img.png){#fig-id width="90%"}
    → [FIGURE:<fig-id> | alt]   (uses {#fig-id} attr if present)
    → [FIGURE:<sha256(path)[:16]> | alt]  (fallback when no attr)

The manifest produced by download_images.py or copy_images_local.py is
indexed by url (URL books) and by fig_id + rel_path (local books).

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

# Matches ![alt](path) with optional trailing {attrs}
IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)(?:\s*\{([^}]*)\})?")

# Extracts first #id from attr string
_ID_RE = re.compile(r"#([\w][\w-]*)")


def url_to_asset_id(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def _fig_id_from_attrs(attrs: str | None) -> str | None:
    if not attrs:
        return None
    m = _ID_RE.search(attrs)
    return m.group(1) if m else None


def load_indexes(manifest_path: Path) -> tuple[dict, dict, dict]:
    """
    Returns three lookup dicts built from images.jsonl:
      by_url      {url       → record}  — URL-based books
      by_fig_id   {fig_id    → record}  — QMD books with {#fig-id} attrs
      by_rel_path {rel_path  → record}  — QMD books without attrs (fallback)
    """
    by_url: dict[str, dict]      = {}
    by_fig_id: dict[str, dict]   = {}
    by_rel_path: dict[str, dict] = {}

    with manifest_path.open() as f:
        for line in f:
            r = json.loads(line)
            if r.get("url"):
                by_url[r["url"]] = r
            if r.get("fig_id"):
                by_fig_id[r["fig_id"]] = r
            if r.get("rel_path"):
                # normalise: strip leading /
                by_rel_path[r["rel_path"].lstrip("/")] = r

    return by_url, by_fig_id, by_rel_path


# Keep old name for callers that imported it
def load_assets_by_url(manifest_path: Path) -> dict[str, dict]:
    by_url, _, _ = load_indexes(manifest_path)
    return by_url


def shorten(text: str, limit: int) -> str:
    s = re.sub(r"\s+", " ", text).strip()
    if len(s) <= limit:
        return s
    cut = s[:limit]
    sp = cut.rfind(" ")
    if sp > limit * 0.7:
        cut = cut[:sp]
    return cut.rstrip(",.;:") + "..."


def enrich_line(
    line: str,
    by_url: dict[str, dict],
    by_fig_id: dict[str, dict],
    by_rel_path: dict[str, dict],
    alt_limit: int,
) -> tuple[str, int]:
    n = 0

    def sub(m: re.Match) -> str:
        nonlocal n
        raw_alt   = m.group(1) or ""
        path      = m.group(2).strip()
        attrs     = m.group(3)

        # ── Resolve asset record ──────────────────────────────────────────────
        asset = None

        # 1. QMD: {#fig-id} attr takes priority
        fid = _fig_id_from_attrs(attrs)
        if fid:
            asset = by_fig_id.get(fid)

        # 2. URL-based lookup
        if asset is None and (path.startswith("http://") or path.startswith("https://")):
            asset = by_url.get(path)

        # 3. Local path lookup (strip leading /)
        if asset is None:
            asset = by_rel_path.get(path.lstrip("/"))

        # ── Determine asset_id ────────────────────────────────────────────────
        if asset is not None:
            asset_id = asset.get("asset_id") or url_to_asset_id(path)
            alt = (asset.get("alt_text_md") or raw_alt).strip()
        else:
            asset_id = fid or url_to_asset_id(path)
            alt = raw_alt.strip()

        n += 1
        if alt:
            short = shorten(alt, alt_limit).replace("]", ")")
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

    by_url, by_fig_id, by_rel_path = load_indexes(args.manifest)
    total_assets = len(by_url) + len(by_fig_id)
    with_alt = sum(
        1 for d in (*by_url.values(), *by_fig_id.values())
        if d.get("alt_text_md")
    )
    print(f"assets indexed: url={len(by_url)} fig_id={len(by_fig_id)} "
          f"rel_path={len(by_rel_path)}  ({with_alt} with alt_text)",
          file=sys.stderr)

    total_rep = 0
    total_lines = 0
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.src.open(encoding="utf-8") as fi, args.out.open("w", encoding="utf-8") as fo:
        for line in fi:
            total_lines += 1
            line = line.rstrip("\n")
            new, n = enrich_line(line, by_url, by_fig_id, by_rel_path,
                                 args.alt_char_limit)
            fo.write(new + "\n")
            total_rep += n

    print(f"enriched: {total_rep} image markers replaced across {total_lines} lines",
          file=sys.stderr)


if __name__ == "__main__":
    main()
