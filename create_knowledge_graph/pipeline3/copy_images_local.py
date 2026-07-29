#!/usr/bin/env python3
"""
Copy local image assets referenced in book_raw.md into <out-dir>/images/.

Replaces download_images.py for QMD/local-file books.

Writes images.jsonl with the same schema as download_images.py so that
image_alt_text.py and enrich_markdown.py work without modification:
  asset_id, url (null), local_path, status, bytes, content_type,
  line_numbers, fig_id (extra — the original {#fig-id} attr if present).

asset_id:
  - {#fig-id} attr on the same image line → use fig-id directly (stable)
  - No attr → sha256(relative_path)[:16]

Usage:
    python copy_images_local.py \
        --src       data_vision/book_raw.md \
        --book-dir  /path/to/quarto/repo \
        --out-dir   data_vision/images \
        --out-manifest data_vision/images.jsonl
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path

# Matches ![alt](path) optionally followed by {attrs}
# Group 1 = alt, Group 2 = path, Group 3 = attrs (may be None)
_IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)(?:\s*\{([^}]*)\})?")

# Extracts the first #fig-id or #id from an attrs string
_FIG_ID_RE = re.compile(r"#([\w][\w-]*)")

_MIME = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".gif": "image/gif",
    ".svg": "image/svg+xml", ".webp": "image/webp",
}


def _fig_id(attrs: str | None) -> str | None:
    if not attrs:
        return None
    m = _FIG_ID_RE.search(attrs)
    return m.group(1) if m else None


def _asset_id(fig_id: str | None, rel_path: str) -> str:
    if fig_id:
        return fig_id
    return hashlib.sha256(rel_path.encode("utf-8")).hexdigest()[:16]


def scan_images(src: Path, book_dir: Path) -> dict[str, dict]:
    """
    Scan book_raw.md for image references.
    Returns {asset_id: {fig_id, rel_path, abs_path, line_numbers, alt}}.
    """
    assets: dict[str, dict] = {}

    for lineno, raw_line in enumerate(
        src.read_text(encoding="utf-8").splitlines(), start=1
    ):
        for m in _IMG_RE.finditer(raw_line):
            alt, rel_path, attrs = m.group(1), m.group(2).strip(), m.group(3)

            # Skip HTTP URLs — those belong to download_images.py
            if rel_path.startswith("http://") or rel_path.startswith("https://"):
                continue

            fid = _fig_id(attrs)
            aid = _asset_id(fid, rel_path)
            # Strip leading "/" so "/figures/..." is relative to book_dir
            clean_path = rel_path.lstrip("/")
            abs_path = (book_dir / clean_path).resolve()

            if aid not in assets:
                assets[aid] = {
                    "asset_id":    aid,
                    "fig_id":      fid,
                    "rel_path":    rel_path,
                    "abs_path":    abs_path,
                    "alt":         alt.strip(),
                    "line_numbers": [],
                }
            assets[aid]["line_numbers"].append(lineno)

    return assets


def copy_one(info: dict, out_dir: Path) -> dict:
    """
    Copy one image to out_dir/<asset_id><ext>.
    Returns the manifest record.
    """
    abs_src  = info["abs_path"]
    asset_id = info["asset_id"]
    ext      = abs_src.suffix.lower() or ".bin"
    dest     = out_dir / f"{asset_id}{ext}"

    record: dict = {
        "asset_id":    asset_id,
        "fig_id":      info["fig_id"],
        "url":         None,
        "rel_path":    info["rel_path"],
        "local_path":  str(dest),
        "alt_text_md": info["alt"] or None,
        "content_type": _MIME.get(ext, "application/octet-stream"),
        "line_numbers": sorted(set(info["line_numbers"])),
    }

    if not abs_src.exists():
        record["status"] = "not_found"
        record["bytes"]  = None
        record["error"]  = f"source not found: {abs_src}"
        return record

    if dest.exists() and dest.stat().st_size > 0:
        record["status"] = "cached"
        record["bytes"]  = dest.stat().st_size
        record["error"]  = None
        return record

    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(abs_src), str(dest))
        record["status"] = "ok"
        record["bytes"]  = dest.stat().st_size
        record["error"]  = None
    except Exception as e:
        record["status"] = "error"
        record["bytes"]  = None
        record["error"]  = f"{type(e).__name__}: {e}"

    return record


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--src",          type=Path, required=True,
                    help="book_raw.md produced by ingest.py")
    ap.add_argument("--book-dir",     type=Path, required=True,
                    help="Root of the Quarto repo (image paths are relative to this)")
    ap.add_argument("--out-dir",      type=Path, required=True,
                    help="Directory to copy images into (e.g. data_vision/images)")
    ap.add_argument("--out-manifest", type=Path, required=True,
                    help="Output images.jsonl path")
    args = ap.parse_args()

    book_dir = args.book_dir.resolve()

    print(f"scanning {args.src} …", file=sys.stderr)
    assets = scan_images(args.src, book_dir)
    print(f"unique images: {len(assets)}", file=sys.stderr)

    args.out_dir.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    n_ok = n_cached = n_miss = n_err = 0

    for i, (aid, info) in enumerate(assets.items(), 1):
        rec = copy_one(info, args.out_dir)
        manifest.append(rec)
        s = rec["status"]
        if s == "ok":
            n_ok += 1
        elif s == "cached":
            n_cached += 1
        elif s == "not_found":
            n_miss += 1
            print(f"  [{i}] MISS  {aid}  {info['rel_path']}", file=sys.stderr)
        else:
            n_err += 1
            print(f"  [{i}] ERR   {aid}  {rec['error']}", file=sys.stderr)

    manifest.sort(key=lambda r: r["asset_id"])
    args.out_manifest.parent.mkdir(parents=True, exist_ok=True)
    with args.out_manifest.open("w", encoding="utf-8") as f:
        for r in manifest:
            f.write(json.dumps(r) + "\n")

    print(
        f"\ndone: {n_ok} copied, {n_cached} cached, "
        f"{n_miss} not found, {n_err} errors",
        file=sys.stderr,
    )
    print(f"manifest: {args.out_manifest}", file=sys.stderr)


if __name__ == "__main__":
    main()
