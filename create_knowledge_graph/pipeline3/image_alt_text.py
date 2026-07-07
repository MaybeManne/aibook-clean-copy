#!/usr/bin/env python3
"""
Generate alt-text for each image before chunking / Pass A.

Context for each image = ±20 lines of surrounding raw markdown (the textbook
prose around the figure). This is much richer than what we'd get after the
fact from an item's raw_body.

Output: writes alt_text back into images.jsonl (the same file download_images.py
produces), adding alt_text_md, kind, text_transcription, has_axes_labels,
reproducible_hint, extraction.alt_text_model.

Resume-safe: skips assets that already have alt_text_md.

Usage:
    python image_alt_text.py \
        --images-manifest data2/images.jsonl \
        --src data2/book_raw.md \
        [--workers 16] [--context-lines 20]
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json_with_image, GEMINI_DEFAULT


SYSTEM_PROMPT = """You describe a single figure from a textbook.

You receive:
  - The image itself.
  - Some surrounding text (the passage of the book that appears immediately
    before and after the figure in the raw markdown).

Return a JSON object:
  alt_text_md    — 1 to 3 sentences describing what the figure shows, written
                   so a blind student would understand the pedagogical content.
                   Use LaTeX ($...$) for formulas. Say WHAT is drawn (axes,
                   curves, points, labels) and, when clear from context, WHY
                   it matters. Avoid fluff like "this figure shows".
  kind           — "graph" (curves in a coordinate system) / "diagram"
                   (geometric/schematic) / "photo" (real-world photograph) /
                   "table" (tabulated data rendered as image) /
                   "formula_image" (equation rendered as image) / "other".
  text_transcription — verbatim transcription of any labels/text in the image,
                       or null if none.
  has_axes_labels    — boolean or null.
  reproducible_hint  — short free-text: "matplotlib", "svg", "asymptote",
                       "photo_cannot_reproduce", "manual_diagram", etc. Empty
                       string if uncertain.

Rules:
  1. Be faithful to what is visible. Don't invent curves, labels, or values
     that aren't there.
  2. Use the surrounding text to disambiguate what the figure is FOR, but
     don't just paraphrase it — describe the picture.
  3. For calculus figures with two or more curves, name them with equations
     if labeled.
  4. If the image is effectively decorative (stock photo, chapter-opener),
     set kind="photo" or "other" and say so.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["alt_text_md", "kind"],
    "properties": {
        "alt_text_md":        {"type": "string"},
        "kind":               {"type": "string", "enum": [
            "graph", "diagram", "photo", "table", "formula_image", "other",
        ]},
        "text_transcription": {"type": ["string", "null"]},
        "has_axes_labels":    {"type": ["boolean", "null"]},
        "reproducible_hint":  {"type": ["string", "null"]},
    },
}


MIME_BY_EXT = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png", ".gif": "image/gif", ".svg": "image/svg+xml",
}


def read_jsonl(path: Path) -> list[dict]:
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl_atomic(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = tempfile.NamedTemporaryFile(
        mode="w", dir=path.parent, delete=False, suffix=".tmp"
    )
    try:
        for r in records:
            tmp.write(json.dumps(r) + "\n")
        tmp.close()
        Path(tmp.name).replace(path)
    except Exception:
        Path(tmp.name).unlink(missing_ok=True)
        raise


def load_src_lines(path: Path) -> list[str]:
    """Line-indexed source; returns list where index i-1 holds line i."""
    return path.read_text(encoding="utf-8").splitlines()


def context_around(lines: list[str], line_numbers: list[int], radius: int) -> str:
    """Return up to ~1500 chars of surrounding text for the first occurrence of the image."""
    if not line_numbers:
        return ""
    ln = line_numbers[0]  # 1-based
    lo = max(1, ln - radius)
    hi = min(len(lines), ln + radius)
    snippet = "\n".join(lines[lo - 1:hi])
    snippet = snippet.strip()
    if len(snippet) > 1500:
        # Prefer pre-context over post-context
        pre_end = min(len(snippet), 800)
        snippet = snippet[:pre_end] + "\n...\n" + snippet[-500:]
    return snippet


def process_image(asset: dict, src_lines: list[str], model: str, radius: int) -> dict:
    local_path = Path(asset["local_path"])
    mime = MIME_BY_EXT.get(local_path.suffix.lower(), "image/jpeg")
    image_bytes = local_path.read_bytes()
    ctx = context_around(src_lines, asset.get("line_numbers", []), radius)
    if not ctx:
        ctx = "(no surrounding text available)"
    user_msg = (
        f"Surrounding markdown text (around the image's first appearance):\n"
        f"---\n{ctx}\n---\n\n"
        f"Describe the image grounded in this context."
    )
    return call_llm_json_with_image(
        SYSTEM_PROMPT, user_msg, image_bytes, mime, OUTPUT_SCHEMA, model=model,
    )


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--images-manifest", type=Path, required=True)
    ap.add_argument("--src",             type=Path, required=True,
                    help="Raw markdown (not numbered).")
    ap.add_argument("--model", default=GEMINI_DEFAULT)
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--context-lines", type=int, default=20)
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    src_lines = load_src_lines(args.src)
    manifest = read_jsonl(args.images_manifest)
    todo = [a for a in manifest if a.get("local_path") and not a.get("alt_text_md")]
    if args.limit:
        todo = todo[:args.limit]

    print(f"images: {len(manifest)} total; {len(manifest) - len(todo)} done; "
          f"{len(todo)} to process", file=sys.stderr)

    by_id = {a["asset_id"]: a for a in manifest}
    write_lock = threading.Lock()
    n_ok = n_fail = done = 0

    def run(asset):
        try:
            return asset, process_image(asset, src_lines, args.model, args.context_lines), None
        except Exception as e:
            return asset, None, e

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(run, a) for a in todo]
        for fut in as_completed(futures):
            asset, alt, err = fut.result()
            with write_lock:
                done += 1
                if err is not None:
                    n_fail += 1
                    print(f"[{done}/{len(todo)}] FAIL {asset['asset_id']}: "
                          f"{type(err).__name__}: {err}", file=sys.stderr)
                    continue
                enriched = dict(by_id[asset["asset_id"]])
                enriched.update(alt)
                ext = dict(enriched.get("extraction", {}))
                ext["alt_text_model"] = args.model
                enriched["extraction"] = ext
                by_id[asset["asset_id"]] = enriched
                n_ok += 1
                print(f"[{done}/{len(todo)}] {asset['asset_id']}  kind={alt.get('kind')}",
                      file=sys.stderr)

    # Rewrite manifest atomically with updated records in original order.
    write_jsonl_atomic(args.images_manifest,
                       [by_id[a["asset_id"]] for a in manifest])
    print(f"\ndone: {n_ok} ok, {n_fail} failed", file=sys.stderr)


if __name__ == "__main__":
    main()
