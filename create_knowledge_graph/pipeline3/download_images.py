#!/usr/bin/env python3
"""
Download every image URL referenced in the raw markdown to data2/images/.
Writes an images.jsonl asset table keyed by SHA256(url)[:16].

Runs BEFORE chunking/Pass A. Does NOT touch the markdown itself — the URL
stays in place. image_alt_text.py will later fill in alt_text for each asset,
and enrich_markdown.py will inline those alt-texts.

Usage:
    python download_images.py \
        --src raw/calculus_101.md \
        --out-dir data2/images \
        --out-manifest data2/images.jsonl \
        [--workers 16]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import threading
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")


def url_to_asset_id(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def guess_ext(url: str) -> str:
    path = urlparse(url).path
    for ext in (".jpg", ".jpeg", ".png", ".gif", ".svg"):
        if path.lower().endswith(ext):
            return ext
    return ".bin"


def collect_urls(src: Path) -> dict[str, list[int]]:
    """Return {url: [line_numbers (1-based) where it appears]}."""
    out: dict[str, list[int]] = {}
    for i, raw in enumerate(src.read_text(encoding="utf-8").splitlines(), start=1):
        for u in IMG_RE.findall(raw):
            out.setdefault(u, []).append(i)
    return out


def download_one(url: str, dest: Path, timeout: float) -> dict:
    if dest.exists() and dest.stat().st_size > 0:
        return {"status": "cached", "bytes": dest.stat().st_size}
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "kg-pipeline2/0.1"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            ct = r.headers.get("Content-Type", "").split(";")[0].strip()
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(body)
            return {"status": "ok", "content_type": ct, "bytes": len(body)}
    except urllib.error.HTTPError as e:
        return {"status": "http_error", "error": f"HTTP {e.code}: {e.reason}"}
    except urllib.error.URLError as e:
        return {"status": "url_error", "error": str(e.reason)}
    except Exception as e:
        return {"status": "error", "error": f"{type(e).__name__}: {e}"}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--src",          type=Path, required=True)
    ap.add_argument("--out-dir",      type=Path, required=True)
    ap.add_argument("--out-manifest", type=Path, required=True)
    ap.add_argument("--workers", type=int,   default=16)
    ap.add_argument("--timeout", type=float, default=30.0)
    args = ap.parse_args()

    urls = collect_urls(args.src)
    print(f"unique URLs: {len(urls)}", file=sys.stderr)
    args.out_dir.mkdir(parents=True, exist_ok=True)

    tasks = []
    for url, line_nums in urls.items():
        asset_id = url_to_asset_id(url)
        dest = args.out_dir / f"{asset_id}{guess_ext(url)}"
        tasks.append((url, asset_id, dest, line_nums))

    write_lock = threading.Lock()
    manifest: list[dict] = []
    n_ok = n_cached = n_fail = 0
    done = 0

    def run(t):
        url, aid, dest, line_nums = t
        return url, aid, dest, line_nums, download_one(url, dest, args.timeout)

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(run, t) for t in tasks]
        for fut in as_completed(futures):
            url, aid, dest, line_nums, res = fut.result()
            with write_lock:
                done += 1
                s = res["status"]
                if s == "ok":
                    n_ok += 1
                elif s == "cached":
                    n_cached += 1
                else:
                    n_fail += 1
                    print(f"[{done}/{len(tasks)}] FAIL {aid}: {res.get('error', s)}",
                          file=sys.stderr)
                manifest.append({
                    "asset_id":     aid,
                    "url":          url,
                    "local_path":   str(dest) if s in ("ok", "cached") else None,
                    "status":       s,
                    "bytes":        res.get("bytes"),
                    "content_type": res.get("content_type"),
                    "error":        res.get("error"),
                    "line_numbers": sorted(set(line_nums)),
                })

    args.out_manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.sort(key=lambda r: r["asset_id"])
    with args.out_manifest.open("w") as f:
        for r in manifest:
            f.write(json.dumps(r) + "\n")

    print(f"\ndone: {n_ok} downloaded, {n_cached} cached, {n_fail} failed",
          file=sys.stderr)
    print(f"manifest: {args.out_manifest}", file=sys.stderr)


if __name__ == "__main__":
    main()
