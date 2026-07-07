"""
Helpers for the `spans` field (list of {start, end} line ranges).

v3 introduces multi-range spans so a record can cover disjoint line ranges —
e.g., an exercise (L14684-L14692) plus a figure caption that appears just
after (L14694-L14695) without sweeping in the blank lines in between.

Uses throughout the pipeline:
  - first_line(rec)  → line number of the very first range's start
                       (used for book ordering, position, nearest-section lookup)
  - last_line(rec)   → line number of the very last range's end
  - total_length(rec)→ sum of (end-start+1) across all ranges
  - ranges_of(rec)   → yields (start_int, end_int) pairs, in order
  - splice_body(numbered, ranges, sep="\\n\\n") → concatenate verbatim text,
                       joining disjoint ranges with a paragraph break
  - contains(outer, inner) → every range of `inner` is inside some range of `outer`

Record shape expected:
  rec["source"]["spans"] = [{"start": "L00125", "end": "L00170"}, ...]

For backwards compatibility, records that still carry `source.span` (singular)
are transparently treated as one-range `spans`.
"""
from __future__ import annotations

from typing import Iterable


def _spans_raw(rec: dict) -> list[dict]:
    src = rec.get("source", {})
    spans = src.get("spans")
    if spans:
        return spans
    # Fallback: single `span` dict
    span = src.get("span")
    if span:
        return [span]
    return []


def ranges_of(rec: dict) -> list[tuple[int, int]]:
    """Return [(start_int, end_int), ...] sorted by start."""
    out: list[tuple[int, int]] = []
    for s in _spans_raw(rec):
        start = s.get("start")
        end = s.get("end")
        if isinstance(start, str) and start.startswith("L"):
            start = int(start[1:])
        if isinstance(end, str) and end.startswith("L"):
            end = int(end[1:])
        if isinstance(start, int) and isinstance(end, int):
            out.append((start, end))
    out.sort()
    return out


def first_line(rec: dict) -> int:
    r = ranges_of(rec)
    if not r:
        return 0
    return r[0][0]


def last_line(rec: dict) -> int:
    r = ranges_of(rec)
    if not r:
        return 0
    return r[-1][1]


def total_length(rec: dict) -> int:
    return sum(e - s + 1 for s, e in ranges_of(rec))


def splice_body(numbered: dict[int, str], ranges: Iterable[tuple[int, int]],
                sep: str = "\n\n") -> str:
    """Concatenate verbatim lines across ranges, separating disjoint ranges
    with `sep` so the splice reads as a single cohesive block."""
    chunks: list[str] = []
    for s, e in ranges:
        chunks.append("\n".join(numbered.get(i, "") for i in range(s, e + 1)))
    return sep.join(c for c in chunks if c is not None)


def contains(outer: dict, inner: dict) -> bool:
    """Return True iff every range of `inner` lies within some range of `outer`."""
    outer_ranges = ranges_of(outer)
    if not outer_ranges:
        return False
    for is_, ie in ranges_of(inner):
        inside = any(os_ <= is_ and ie <= oe for os_, oe in outer_ranges)
        if not inside:
            return False
    return True


def normalize_spans(rec: dict) -> None:
    """In-place: migrate `source.span` → `source.spans` if the old form is present.
    Safe to call on already-normalized records."""
    src = rec.setdefault("source", {})
    if "spans" in src and src["spans"]:
        return
    span = src.pop("span", None)
    if span:
        src["spans"] = [span]
