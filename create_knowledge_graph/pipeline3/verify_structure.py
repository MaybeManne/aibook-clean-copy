#!/usr/bin/env python3
"""
Pass A verifier v2 — pure program, no LLM.

Splits records into THREE groups:
  - verified: no issues
  - warnings: non-blocking quality_flags applied, record still usable
  - failures: structurally broken (missing required field, span outside file,
              invalid marker, etc.)

Hard issues (block the record):
  - missing/invalid id, kind, title, span
  - span.start/.end not matching /^L\\d{5}$/
  - span.start/.end not present in numbered file
  - end < start
  - span entirely outside the chunk (not in primary OR overlap)

Soft issues (become quality_flags):
  - span length > max_span_lines
  - same (span, kind) as another record but different id (distinct sibling)
  - single-line span (span.start == span.end)
  - span-in-overlap region (the record belongs to the earlier chunk)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable

LINE_RE = re.compile(r"^L(\d{5}): ?(.*)$")
LMARK_RE = re.compile(r"^L\d{5}$")
SLUG_RE = re.compile(r"^[a-z][a-z0-9_]{1,63}$")

CONCEPT_KINDS = {"definition", "theorem", "technique", "idea"}
ITEM_KINDS = {"example", "exercise", "exercise_group", "theorem", "figure", "table"}


def load_numbered(path: Path) -> dict[int, str]:
    out: dict[int, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if not m:
            raise ValueError(f"{path}: line missing Lxxxxx: prefix: {raw!r}")
        out[int(m.group(1))] = m.group(2)
    return out


def load_manifest(path: Path) -> dict[str, dict]:
    with path.open() as f:
        return {r["chunk_id"]: r for r in (json.loads(l) for l in f)}


def lmark_to_int(mark: str) -> int:
    return int(mark[1:])


def verify_record(
    rec: dict,
    record_kind: str,
    allowed_kinds: set[str],
    numbered: dict[int, str],
    manifest: dict[str, dict],
    max_span_lines: int,
) -> tuple[list[str], list[str]]:
    """Returns (hard_issues, soft_flags). Empty both = clean."""
    hard: list[str] = []
    soft: list[str] = []

    rid = rec.get("id")
    if not isinstance(rid, str) or not SLUG_RE.match(rid):
        hard.append(f"invalid id {rid!r}")

    kind = rec.get("kind")
    if kind not in allowed_kinds:
        hard.append(f"invalid kind {kind!r} for {record_kind}")

    title = rec.get("title")
    if not isinstance(title, str) or not title.strip():
        hard.append("missing or empty title")

    # Normalize source.span → source.spans if an older Pass A wrote the old form
    src = rec.get("source") or {}
    spans = src.get("spans")
    if not spans and src.get("span"):
        spans = [src["span"]]
    if not spans:
        hard.append("missing source.spans")
        return hard, soft
    if not isinstance(spans, list) or not spans:
        hard.append("source.spans must be a non-empty array")
        return hard, soft

    parsed: list[tuple[int, int, str, str]] = []  # (start_int, end_int, start_str, end_str)
    for i, span in enumerate(spans):
        start = span.get("start")
        end = span.get("end")
        if not (isinstance(start, str) and LMARK_RE.match(start)):
            hard.append(f"invalid spans[{i}].start {start!r}")
        if not (isinstance(end, str) and LMARK_RE.match(end)):
            hard.append(f"invalid spans[{i}].end {end!r}")
        if hard:
            return hard, soft
        s = lmark_to_int(start)
        e = lmark_to_int(end)
        if e < s:
            hard.append(f"spans[{i}].end {end} < start {start}")
            return hard, soft
        if s not in numbered:
            hard.append(f"spans[{i}].start {start} not present in file")
        if e not in numbered:
            hard.append(f"spans[{i}].end {end} not present in file")
        parsed.append((s, e, start, end))
    if hard:
        return hard, soft

    # Overlap detection: ranges must not overlap (sort by start and check)
    parsed_sorted = sorted(parsed)
    for i in range(1, len(parsed_sorted)):
        prev_s, prev_e, _, _ = parsed_sorted[i - 1]
        cur_s, cur_e, cur_ss, _ = parsed_sorted[i]
        if cur_s <= prev_e:
            hard.append(f"spans overlap at {cur_ss}")
            return hard, soft

    # Body aggregate
    body_parts = []
    for s, e, _, _ in parsed_sorted:
        body_parts.append("\n".join(numbered.get(i, "") for i in range(s, e + 1)))
    body = "\n\n".join(body_parts)
    if not body.strip():
        hard.append("cited spans are entirely whitespace")

    # Aggregate length / per-range length sanity
    total_length = sum(e - s + 1 for s, e, _, _ in parsed_sorted)
    if total_length > max_span_lines:
        soft.append(f"long_spans_total_{total_length}")
    if len(parsed_sorted) == 1 and parsed_sorted[0][0] == parsed_sorted[0][1]:
        soft.append("single_line_span")
    if len(parsed_sorted) > 1:
        soft.append(f"multi_range_{len(parsed_sorted)}")

    # Chunk-range check: every range must fall inside primary, or (allowed but
    # soft-flagged) entirely inside the overlap region.
    chunk_id = rec.get("chunk_id")
    meta = manifest.get(chunk_id) if chunk_id else None
    if meta is None:
        hard.append(f"unknown chunk_id {chunk_id!r}")
    else:
        ps, pe = lmark_to_int(meta["span"]["start"]), lmark_to_int(meta["span"]["end"])
        ov = meta.get("overlap")
        ov_s = lmark_to_int(ov["start"]) if ov else None
        ov_e = lmark_to_int(ov["end"]) if ov else None
        all_in_primary = all(ps <= s and e <= pe for s, e, _, _ in parsed_sorted)
        if not all_in_primary:
            all_in_overlap = (ov_s is not None
                              and all(ov_s <= s and e <= ov_e for s, e, _, _ in parsed_sorted))
            if all_in_overlap:
                soft.append("spans_in_overlap_region")
            else:
                hard.append(f"one or more spans outside chunk primary "
                            f"({meta['span']['start']}-{meta['span']['end']})")

    return hard, soft


def read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(line) for line in f if line.strip()]


def write_jsonl(path: Path, records: Iterable[dict]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")
            n += 1
    return n


def _spans_key(rec: dict) -> tuple:
    """Canonical key of a record's spans, for duplicate detection."""
    src = rec.get("source") or {}
    spans = src.get("spans") or ([src["span"]] if src.get("span") else [])
    return tuple(sorted((s.get("start"), s.get("end")) for s in spans))


def check_duplicate_spans(records: list[dict]) -> dict[int, list[str]]:
    """Return {index: [soft_flags]} for records sharing (spans, kind)."""
    seen: dict[tuple, list[int]] = defaultdict(list)
    for i, r in enumerate(records):
        key = (_spans_key(r), r.get("kind"))
        seen[key].append(i)
    out: dict[int, list[str]] = defaultdict(list)
    for key, idxs in seen.items():
        if len(idxs) > 1:
            ids = {records[i].get("id") for i in idxs}
            if len(ids) > 1:
                for i in idxs[1:]:
                    out[i].append(f"shares_spans_kind_with_{records[idxs[0]].get('id')}")
    return dict(out)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered", type=Path, required=True)
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--concepts", type=Path, required=True)
    ap.add_argument("--items",    type=Path, required=True)
    ap.add_argument("--out-dir",  type=Path, required=True)
    ap.add_argument("--max-span-lines", type=int, default=250)
    args = ap.parse_args()

    numbered = load_numbered(args.numbered)
    manifest = load_manifest(args.manifest)
    concepts = read_jsonl(args.concepts)
    items    = read_jsonl(args.items)

    # Per-record checks
    c_hard: list[list[str]] = []
    c_soft: list[list[str]] = []
    for r in concepts:
        h, s = verify_record(r, "concept", CONCEPT_KINDS, numbered, manifest, args.max_span_lines)
        c_hard.append(h); c_soft.append(s)
    i_hard: list[list[str]] = []
    i_soft: list[list[str]] = []
    for r in items:
        h, s = verify_record(r, "item", ITEM_KINDS, numbered, manifest, args.max_span_lines)
        i_hard.append(h); i_soft.append(s)

    # Corpus-level checks (duplicate-span → soft)
    for i, flags in check_duplicate_spans(concepts).items():
        c_soft[i].extend(flags)
    for i, flags in check_duplicate_spans(items).items():
        i_soft[i].extend(flags)

    # Global id uniqueness — we treat duplicate IDs as soft; salvage will rename
    seen_ids: dict[str, int] = {}
    for lst, hard_list, soft_list in ((concepts, c_hard, c_soft), (items, i_hard, i_soft)):
        for idx, r in enumerate(lst):
            rid = r.get("id")
            if not rid:
                continue
            if rid in seen_ids:
                soft_list[idx].append(f"duplicate_id")
            else:
                seen_ids[rid] = idx

    # Split verified vs soft vs hard
    def split(records, hard, soft):
        ok, warn, bad = [], [], []
        for r, h, s in zip(records, hard, soft):
            if h:
                bad.append({**r, "_hard_issues": h, "_soft_flags": s})
            elif s:
                r2 = dict(r); r2["quality_flags"] = s
                warn.append(r2)
            else:
                ok.append(r)
        return ok, warn, bad

    c_ok, c_warn, c_bad = split(concepts, c_hard, c_soft)
    i_ok, i_warn, i_bad = split(items,    i_hard, i_soft)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    n_cv = write_jsonl(args.out_dir / "concepts.verified.jsonl", c_ok + c_warn)
    n_ci = write_jsonl(args.out_dir / "items.verified.jsonl",    i_ok + i_warn)
    n_cf = write_jsonl(args.out_dir / "concepts.failures.jsonl", c_bad)
    n_if = write_jsonl(args.out_dir / "items.failures.jsonl",    i_bad)

    # Report
    def soft_bucket(lst):
        c = Counter()
        for r in lst:
            for f in r.get("quality_flags", []):
                c[f.split(":")[0]] += 1
        return c
    report = [
        "Pass A verification report v2",
        f"numbered: {args.numbered}",
        f"manifest: {args.manifest}",
        "",
        f"concepts: {len(concepts)} in -> {n_cv} verified ({len(c_warn)} w/ flags), {n_cf} hard-failed",
        f"items:    {len(items)} in -> {n_ci} verified ({len(i_warn)} w/ flags), {n_if} hard-failed",
    ]
    if c_warn or i_warn:
        report.append("\nsoft flag breakdown:")
        total = Counter()
        for r in c_warn + i_warn:
            for f in r.get("quality_flags", []):
                total[f.split(":")[0]] += 1
        for k, n in total.most_common():
            report.append(f"  {n:4d}  {k}")
    if c_bad or i_bad:
        report.append("\nhard failure breakdown:")
        total = Counter()
        for r in c_bad + i_bad:
            for iss in r["_hard_issues"]:
                total[iss.split(" (")[0][:70]] += 1
        for k, n in total.most_common():
            report.append(f"  {n:4d}  {k}")

    report_path = args.out_dir / "report.txt"
    report_path.write_text("\n".join(report) + "\n")
    print("\n".join(report))
    print(f"\nwrote: {args.out_dir}/{{concepts,items}}.{{verified,failures}}.jsonl",
          file=sys.stderr)


if __name__ == "__main__":
    main()
