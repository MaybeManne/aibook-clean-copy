#!/usr/bin/env python3
"""
Attempt to reproduce each (reproducible) image programmatically.

For each asset in images.alt.jsonl with kind in {graph, diagram, formula_image}:
  - Send the original image + alt_text + context to Gemini.
  - Ask for matplotlib (Python), SVG, or "cannot_reproduce".
  - Write reproduction_code + reproduction_kind into images.repro.jsonl.

Does NOT execute the code — just stores it. A separate renderer step can later
check which ones actually run. Rerun-safe via skip-if-already-processed.

Usage:
    python image_reproduce.py \
        --alt      data/images.alt.jsonl \
        --items    data/items.jsonl \
        --concepts data/concepts.jsonl \
        --out      data/images.repro.jsonl \
        [--workers 8] [--kinds graph,diagram,formula_image] [--limit 0]
"""
from __future__ import annotations

import argparse
import json
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json_with_image, GEMINI_DEFAULT


SYSTEM_PROMPT = """You attempt to reproduce a figure from a calculus textbook programmatically.

You receive:
  - The original figure image.
  - Its alt_text description.
  - Context from the textbook passage that references the figure.

Goal: output code that, when run, produces a figure substantially similar to the original. "Substantially similar" means: the same mathematical content — same curves, points, labels, and geometric relationships. Exact colors/fonts are unimportant.

Preferred output formats (pick one based on the figure kind):
  - "matplotlib" : a self-contained Python script that uses matplotlib and numpy.
      * Must start with the imports and end with plt.savefig('out.png', dpi=150) followed by plt.close().
      * No interactive elements, no plt.show().
      * Labels with LaTeX if the figure uses math notation (use raw strings r"$...$").
  - "svg" : an inline SVG string for static geometric diagrams with no function curves. Include axes/labels as SVG elements.
  - "cannot_reproduce" : set this if the figure is a photo, a screenshot, a decorative illustration, or its content cannot be reproduced from the information given.

Return JSON:
  reproduction_kind : "matplotlib" | "svg" | "cannot_reproduce"
  reproduction_code : the code string, or empty if cannot_reproduce
  fidelity_estimate : 0.0 to 1.0 — your honest estimate of how close the reproduction is to the original
  notes             : short free-text justification (what is faithful, what was guessed)

Rules:
  1. Stick to data values that are legibly present in the original image or its alt_text. For example, if a curve is y = x^2, reproduce that; do not assume arbitrary numerical values for unlabeled tick marks.
  2. If the figure is a schematic geometric construction (tangent line, secant, osculating circle), draw it using the geometric relationships, not fake data.
  3. If the figure contains labels, include them in the reproduction.
  4. If you set reproduction_kind to "cannot_reproduce", fidelity_estimate must be 0.
  5. Do NOT reproduce real-world photographs — return cannot_reproduce.
"""


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["reproduction_kind", "reproduction_code", "fidelity_estimate"],
    "properties": {
        "reproduction_kind": {"type": "string", "enum": [
            "matplotlib", "svg", "cannot_reproduce",
        ]},
        "reproduction_code": {"type": "string"},
        "fidelity_estimate": {"type": "number", "minimum": 0, "maximum": 1},
        "notes":             {"type": ["string", "null"]},
    },
}


MIME_BY_EXT = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png", ".gif": "image/gif", ".svg": "image/svg+xml",
}


def read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def build_context(record: dict) -> str:
    parts = []
    if record.get("title"):
        parts.append(f"TITLE: {record['title']}")
    if record.get("one_liner"):
        parts.append(f"ONE-LINER: {record['one_liner']}")
    for fld in ("prompt_md", "solution_md", "caption_md", "content", "raw_body"):
        v = record.get(fld)
        if v:
            s = str(v).strip().replace("\n", " ")
            if len(s) > 400:
                s = s[:397] + "..."
            parts.append(f"{fld.upper()}: {s}")
    return "\n".join(parts)[:1500]


def process_asset(
    asset_alt: dict,
    image_manifest: dict[str, dict],
    lookup: dict[str, dict],
    model: str,
) -> dict:
    asset_id = asset_alt["asset_id"]
    mani = image_manifest.get(asset_id) or asset_alt
    local_path = Path(asset_alt["local_path"])
    suffix = local_path.suffix.lower()
    mime = MIME_BY_EXT.get(suffix, "image/jpeg")
    image_bytes = local_path.read_bytes()

    # Gather context from referencing records
    ctx = ""
    for rid in mani.get("referenced_by", []):
        rec = lookup.get(rid)
        if rec is not None:
            ctx = build_context(rec)
            break

    alt_text = asset_alt.get("alt_text_md", "")
    transcription = asset_alt.get("text_transcription") or ""
    hint = asset_alt.get("reproducible_hint") or ""

    user_msg = (
        f"alt_text_md: {alt_text}\n"
        f"text_transcription: {transcription}\n"
        f"reproducible_hint: {hint}\n\n"
        f"textbook context:\n---\n{ctx}\n---\n\n"
        f"Reproduce this figure per the system rules."
    )
    return call_llm_json_with_image(
        SYSTEM_PROMPT, user_msg, image_bytes, mime, OUTPUT_SCHEMA, model=model,
        max_output_tokens=16384, thinking_budget=4096,
    )


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--alt",      type=Path, required=True)
    ap.add_argument("--images-manifest", type=Path, default=Path("data/images.jsonl"))
    ap.add_argument("--items",    type=Path, required=True)
    ap.add_argument("--concepts", type=Path, required=True)
    ap.add_argument("--out",      type=Path, required=True)
    ap.add_argument("--kinds", default="graph,diagram,formula_image",
                    help="Comma-separated image kinds to attempt reproducing.")
    ap.add_argument("--model", default=GEMINI_DEFAULT)
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--limit",   type=int, default=0)
    args = ap.parse_args()

    kinds = {k.strip() for k in args.kinds.split(",") if k.strip()}

    alts = read_jsonl(args.alt)
    image_manifest = {r["asset_id"]: r for r in read_jsonl(args.images_manifest)}
    items = read_jsonl(args.items)
    concepts = read_jsonl(args.concepts)
    lookup = {r["id"]: r for r in items + concepts}

    # Filter by kind
    todo_alls = [a for a in alts if a.get("kind") in kinds and a.get("local_path")]

    # Resume-safe: skip already-processed asset_ids
    already: set[str] = set()
    if args.out.exists():
        already = {r["asset_id"] for r in read_jsonl(args.out)}
    todo = [a for a in todo_alls if a["asset_id"] not in already]
    if args.limit:
        todo = todo[:args.limit]

    print(f"candidates (kind in {sorted(kinds)}): {len(todo_alls)}; "
          f"already: {len(already)}; to process: {len(todo)}", file=sys.stderr)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    write_lock = threading.Lock()
    n_ok = n_fail = done = 0
    kind_counts: dict[str, int] = {}

    def run(a):
        try:
            return a, process_asset(a, image_manifest, lookup, args.model), None
        except Exception as e:
            return a, None, e

    mode = "a" if args.out.exists() else "w"
    with args.out.open(mode) as fo:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(run, a) for a in todo]
            for fut in as_completed(futures):
                asset_alt, repro, err = fut.result()
                with write_lock:
                    done += 1
                    if err is not None:
                        n_fail += 1
                        print(f"[{done}/{len(todo)}] FAIL {asset_alt['asset_id']}: "
                              f"{type(err).__name__}: {err}", file=sys.stderr)
                        continue
                    out = {
                        "asset_id": asset_alt["asset_id"],
                        "url": asset_alt["url"],
                        "local_path": asset_alt["local_path"],
                        "source_kind": asset_alt["kind"],
                        **repro,
                        "extraction": {"model": args.model},
                    }
                    fo.write(json.dumps(out) + "\n")
                    fo.flush()
                    n_ok += 1
                    k = repro.get("reproduction_kind")
                    kind_counts[k] = kind_counts.get(k, 0) + 1
                    print(f"[{done}/{len(todo)}] {asset_alt['asset_id']}  "
                          f"-> {k}  fidelity={repro.get('fidelity_estimate')}",
                          file=sys.stderr)

    print(f"\ndone: {n_ok} ok, {n_fail} failed", file=sys.stderr)
    print(f"by reproduction_kind: {kind_counts}", file=sys.stderr)


if __name__ == "__main__":
    main()
