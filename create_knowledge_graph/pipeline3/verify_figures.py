#!/usr/bin/env python3
"""
Figure-coverage diff for two data dirs (read-only).

Measures, for each dir:
  1. Concept figure coverage     — concepts whose `content` has >=1 valid [FIGURE:...] token
  2. Item figure coverage        — items whose prompt/solution/proof/caption has >=1 token
  3. Book-token landing rate     — assets from book.numbered.md that appear in SOME record
  4. embedded_in coverage        — kind:figure items with non-null embedded_in
  5. Loose figures               — figure items with null embedded_in
  6. figure_number populated     — assets in images.jsonl with figure_number set
  7. referenced_by populated     — assets with non-empty referenced_by

Usage:
    python verify_figures.py data3                # single dir (baseline)
    python verify_figures.py data3 data3_v4       # side-by-side diff
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


FIGURE_ID_PATTERN = r"(?:[0-9a-f]{16}|(?:fig|tbl)[-_:][A-Za-z0-9][A-Za-z0-9_.:-]*)"
VALID_TOKEN_RE = re.compile(rf"\[FIGURE:({FIGURE_ID_PATTERN})(?:\s*\|[^\]]*)?\]")
LINE_RE = re.compile(r"^L(\d{5}):\s?(.*)$")


def _read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def _read_jsonl_maybe_raw(path: Path) -> dict[str, str]:
    """concepts.raw.jsonl / items.raw.jsonl map id -> raw_body."""
    out: dict[str, str] = {}
    for r in _read_jsonl(path):
        rid = r.get("id") or r.get("concept_id")
        if rid and isinstance(r.get("raw_body"), str):
            out[rid] = r["raw_body"]
    return out


def _tokens_in(text: str | None) -> set[str]:
    if not text:
        return set()
    return set(VALID_TOKEN_RE.findall(text))


def _book_tokens(numbered_md: Path) -> dict[str, list[int]]:
    """Return {asset_id: [line_numbers,...]} for every [FIGURE:...] in the book."""
    out: dict[str, list[int]] = {}
    if not numbered_md.exists():
        return out
    for raw in numbered_md.open():
        m = LINE_RE.match(raw)
        if not m:
            continue
        n = int(m.group(1))
        for aid in VALID_TOKEN_RE.findall(m.group(2)):
            out.setdefault(aid, []).append(n)
    return out


def measure(data_dir: Path) -> dict:
    concepts = _read_jsonl(data_dir / "concepts.jsonl")
    items    = _read_jsonl(data_dir / "items.jsonl")
    images   = _read_jsonl(data_dir / "images.jsonl")
    concepts_raw = _read_jsonl_maybe_raw(data_dir / "concepts.raw.jsonl")
    items_raw    = _read_jsonl_maybe_raw(data_dir / "items.raw.jsonl")
    book_tokens  = _book_tokens(data_dir / "book.numbered.md")

    # 1. concepts whose content or raw_body has a figure token.
    # (raw_body is in concepts.jsonl before split_raw runs, and in
    # concepts.raw.jsonl after.)
    n_concepts_with_fig = 0
    for c in concepts:
        content_ids = _tokens_in(c.get("content"))
        inline_raw  = _tokens_in(c.get("raw_body"))
        side_raw    = _tokens_in(concepts_raw.get(c.get("id")))
        if content_ids or inline_raw or side_raw:
            n_concepts_with_fig += 1
    concepts_pct = (100.0 * n_concepts_with_fig / max(1, len(concepts)))

    # 2. items whose prose fields or raw_body contain a figure token
    prose_fields = ("prompt_md", "solution_md", "proof_md", "caption_md")
    n_items_with_fig = 0
    for it in items:
        any_field_ids: set[str] = set()
        for f in prose_fields:
            any_field_ids |= _tokens_in(it.get(f))
        if not any_field_ids:
            any_field_ids |= _tokens_in(it.get("raw_body"))
        if not any_field_ids:
            any_field_ids |= _tokens_in(items_raw.get(it.get("id")))
        if any_field_ids:
            n_items_with_fig += 1
    items_pct = (100.0 * n_items_with_fig / max(1, len(items)))

    # 3. book-token landing rate: union of every asset_id found in ANY record's
    #    prose, content, or raw_body (inline or side file).
    landed: set[str] = set()
    for c in concepts:
        landed |= _tokens_in(c.get("content"))
        landed |= _tokens_in(c.get("raw_body"))
    for it in items:
        for f in prose_fields:
            landed |= _tokens_in(it.get(f))
        landed |= _tokens_in(it.get("raw_body"))
    for rid, rb in concepts_raw.items():
        landed |= _tokens_in(rb)
    for rid, rb in items_raw.items():
        landed |= _tokens_in(rb)
    total_tokens = len(book_tokens)
    n_landed = len(landed & set(book_tokens))
    landed_pct = (100.0 * n_landed / max(1, total_tokens))

    # 4. embedded_in coverage
    fig_items = [it for it in items if it.get("kind") in ("figure", "table")]
    n_embedded = sum(1 for it in fig_items if it.get("embedded_in"))
    n_loose    = len(fig_items) - n_embedded
    emb_pct    = (100.0 * n_embedded / max(1, len(fig_items)))

    # 5. images.jsonl: figure_number + referenced_by populated
    n_fignum = sum(1 for im in images if im.get("figure_number"))
    n_refby  = sum(1 for im in images if im.get("referenced_by"))

    # 6. orphan assets: in images.jsonl but nobody references them
    referenced: set[str] = set()
    for im in images:
        if im.get("referenced_by"):
            referenced.add(im["asset_id"])
    # also anything that appeared anywhere in any raw_body / prose
    referenced |= landed
    orphans = sorted({im["asset_id"] for im in images} - referenced)

    return {
        "data_dir":           str(data_dir),
        "n_concepts":         len(concepts),
        "n_concepts_with_fig": n_concepts_with_fig,
        "concepts_pct":       concepts_pct,
        "n_items":            len(items),
        "n_items_with_fig":   n_items_with_fig,
        "items_pct":          items_pct,
        "total_book_tokens":  total_tokens,
        "landed":             n_landed,
        "landed_pct":         landed_pct,
        "n_fig_items":        len(fig_items),
        "n_embedded":         n_embedded,
        "n_loose":            n_loose,
        "embedded_pct":       emb_pct,
        "n_images":           len(images),
        "n_figure_number":    n_fignum,
        "n_referenced_by":    n_refby,
        "n_orphans":          len(orphans),
        "orphan_sample":      orphans[:10],
    }


def _row(label: str, a: float | int | str, b: float | int | str | None) -> str:
    if b is None:
        return f"  {label:<36s} {a!s:>16s}"
    return f"  {label:<36s} {a!s:>16s}   {b!s:>16s}"


def print_report(a: dict, b: dict | None) -> None:
    if b is None:
        print(f"Figure coverage — {a['data_dir']}")
        print()
        _p = lambda lbl, k: print(_row(lbl, a[k], None))
        _p("concepts",                 "n_concepts")
        _p("  with [FIGURE:...] token", "n_concepts_with_fig")
        print(_row("  coverage (%)",     f"{a['concepts_pct']:.1f}%", None))
        _p("items",                    "n_items")
        _p("  with [FIGURE:...] token", "n_items_with_fig")
        print(_row("  coverage (%)",     f"{a['items_pct']:.1f}%", None))
        _p("total book tokens",        "total_book_tokens")
        _p("  landed in some record",  "landed")
        print(_row("  landing (%)",      f"{a['landed_pct']:.1f}%", None))
        _p("figure/table items",       "n_fig_items")
        _p("  with embedded_in",       "n_embedded")
        _p("  loose (embedded_in=null)", "n_loose")
        print(_row("  embedded_in (%)",  f"{a['embedded_pct']:.1f}%", None))
        _p("images.jsonl assets",      "n_images")
        _p("  with figure_number",     "n_figure_number")
        _p("  with referenced_by",     "n_referenced_by")
        _p("orphan assets (no refs)",  "n_orphans")
        if a["orphan_sample"]:
            print(f"    sample: {a['orphan_sample']}")
        return

    print(f"Figure coverage — {a['data_dir']}  vs  {b['data_dir']}")
    print(_row("metric", a['data_dir'], b['data_dir']))
    print("  " + "-" * 72)
    def R(label: str, ka, kb=None):
        print(_row(label, a[ka], b[kb or ka]))
    def Rp(label: str, k_num, k_denom):
        aval = f"{a[k_num]}/{a[k_denom]} ({100*a[k_num]/max(1,a[k_denom]):.1f}%)"
        bval = f"{b[k_num]}/{b[k_denom]} ({100*b[k_num]/max(1,b[k_denom]):.1f}%)"
        print(_row(label, aval, bval))

    Rp("concepts with figure token",          "n_concepts_with_fig", "n_concepts")
    Rp("items with figure token",             "n_items_with_fig",    "n_items")
    Rp("book tokens landed in a record",      "landed",              "total_book_tokens")
    Rp("figure items with embedded_in",       "n_embedded",          "n_fig_items")
    Rp("images with figure_number",           "n_figure_number",     "n_images")
    Rp("images with referenced_by",           "n_referenced_by",     "n_images")
    print(_row("orphan assets (no refs)",     a["n_orphans"], b["n_orphans"]))
    if b["orphan_sample"]:
        print(f"    orphan sample ({b['data_dir']}): {b['orphan_sample']}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("a", type=Path, help="First data dir (e.g. data3)")
    ap.add_argument("b", type=Path, nargs="?", help="Second data dir to compare (e.g. data3_v4)")
    args = ap.parse_args()

    a = measure(args.a)
    b = measure(args.b) if args.b else None
    print_report(a, b)


if __name__ == "__main__":
    main()
