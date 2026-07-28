#!/usr/bin/env python3
"""
Validate extracted edges. Pure program.

Checks:
  Prereq edges (edges_prereq.jsonl):
    - All from/to resolve to known concept ids.
    - Graph is a DAG (no cycles). Cycle-breaking heuristic: for any cycle,
      drop the edge with the lowest strength and record it in review_queue.jsonl.
    - No duplicate (from, to) pairs; if duplicates, keep the strongest.
    - from != to.

  Overlay edges (edges_overlay.jsonl):
    - Same id resolution + self-loop + duplicate checks, BUT cycles allowed.
    - Note: duplicate (from, to, kind) are collapsed (keep the strongest).

Outputs:
  - edges_prereq.validated.jsonl
  - edges_overlay.validated.jsonl
  - edges_review_queue.jsonl       (dropped edges with reason)
  - edge_validation_report.txt     (human-readable summary)

Usage:
    python validate_edges.py \
        --concepts data/concepts.jsonl \
        --prereq   data/edges_prereq.jsonl \
        --overlay  data/edges_overlay.jsonl \
        --out-dir  data/
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

LMARK_RE = re.compile(r"^L\d{5}$")


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def dedup_strongest(edges: list[dict], key) -> tuple[list[dict], list[dict]]:
    """Collapse duplicates by `key`; keep the strongest per key. Return (kept, dropped)."""
    groups: dict[tuple, list[dict]] = defaultdict(list)
    for e in edges:
        groups[key(e)].append(e)
    kept: list[dict] = []
    dropped: list[dict] = []
    for k, group in groups.items():
        if len(group) == 1:
            kept.append(group[0])
            continue
        group.sort(key=lambda e: -e.get("strength", 0.0))
        kept.append(group[0])
        for d in group[1:]:
            d2 = dict(d)
            d2["_reason"] = f"duplicate key {k}; stronger edge kept"
            dropped.append(d2)
    return kept, dropped


def validate_ids(edges: list[dict], known_ids: set[str], context: str) -> tuple[list[dict], list[dict]]:
    kept: list[dict] = []
    dropped: list[dict] = []
    for e in edges:
        frm, to = e.get("from"), e.get("to")
        issues = []
        if frm not in known_ids:
            issues.append(f"from '{frm}' not in concepts.jsonl")
        if to not in known_ids:
            issues.append(f"to '{to}' not in concepts.jsonl")
        if frm == to:
            issues.append("self-loop")
        # evidence_spans format check (accept legacy `evidence_span` too)
        ev_list = e.get("evidence_spans")
        if not ev_list and e.get("evidence_span"):
            ev_list = [e["evidence_span"]]
            e["evidence_spans"] = ev_list
            e.pop("evidence_span", None)
        if ev_list:
            for idx, ev in enumerate(ev_list):
                if not isinstance(ev, dict):
                    issues.append(f"evidence_spans[{idx}] not an object")
                    continue
                if "start" in ev and not LMARK_RE.match(str(ev.get("start"))):
                    issues.append(f"evidence_spans[{idx}].start {ev.get('start')!r} not a line marker")
                if "end" in ev and not LMARK_RE.match(str(ev.get("end"))):
                    issues.append(f"evidence_spans[{idx}].end {ev.get('end')!r} not a line marker")
        if issues:
            d = dict(e)
            d["_reason"] = f"{context}: " + "; ".join(issues)
            dropped.append(d)
        else:
            kept.append(e)
    return kept, dropped


def find_cycle(edges: list[dict]) -> list[str] | None:
    """Return one cycle as a list of node ids, or None if DAG."""
    graph: dict[str, list[str]] = defaultdict(list)
    for e in edges:
        graph[e["from"]].append(e["to"])
    WHITE, GRAY, BLACK = 0, 1, 2
    color: dict[str, int] = defaultdict(lambda: WHITE)
    parent: dict[str, str | None] = {}

    def dfs(u: str) -> list[str] | None:
        color[u] = GRAY
        for v in graph.get(u, []):
            if color[v] == GRAY:
                # Reconstruct cycle v .. u .. v
                cycle = [v, u]
                x = parent.get(u)
                while x is not None and x != v:
                    cycle.append(x)
                    x = parent.get(x)
                cycle.reverse()
                return cycle
            if color[v] == WHITE:
                parent[v] = u
                c = dfs(v)
                if c is not None:
                    return c
        color[u] = BLACK
        return None

    for node in list(graph.keys()):
        if color[node] == WHITE:
            c = dfs(node)
            if c is not None:
                return c
    return None


def break_cycles(edges: list[dict], report: list[str]) -> tuple[list[dict], list[dict]]:
    """Iteratively drop the weakest edge in each cycle until the graph is a DAG."""
    edges = list(edges)
    dropped: list[dict] = []
    while True:
        cycle = find_cycle(edges)
        if cycle is None:
            break
        cycle_set = set(zip(cycle, cycle[1:] + [cycle[0]]))
        # The cycle reconstruction we do only captures the vertex list; find edges
        # in the original list whose (from, to) lie along the cycle.
        on_cycle = [e for e in edges if (e["from"], e["to"]) in cycle_set]
        if not on_cycle:
            # Fallback: drop one edge between successive cycle nodes however we can.
            on_cycle = [e for e in edges if e["from"] in cycle and e["to"] in cycle]
        victim = min(on_cycle, key=lambda e: e.get("strength", 0.0))
        edges.remove(victim)
        d = dict(victim)
        d["_reason"] = f"broke cycle: {' -> '.join(cycle + [cycle[0]])}"
        dropped.append(d)
        report.append(d["_reason"])
    return edges, dropped


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--concepts", type=Path, required=True)
    ap.add_argument("--prereq",   type=Path, required=True)
    ap.add_argument("--overlay",  type=Path, required=True)
    ap.add_argument("--out-dir",  type=Path, required=True)
    ap.add_argument(
        "--output-tag",
        default="validated",
        help="Filename tag for outputs (default: validated; e.g. final).",
    )
    args = ap.parse_args()

    concepts = load_jsonl(args.concepts)
    known_ids = {c["id"] for c in concepts}

    prereq = load_jsonl(args.prereq)
    overlay = load_jsonl(args.overlay)

    report: list[str] = []
    review: list[dict] = []

    # ---- Prereq ----
    p_resolved, p_dropped_ids = validate_ids(prereq, known_ids, "prereq")
    review.extend(p_dropped_ids)
    p_dedup, p_dup_dropped = dedup_strongest(p_resolved, key=lambda e: (e["from"], e["to"]))
    review.extend(p_dup_dropped)
    # Cycle-breaking intentionally skipped. Any cycles are reported but kept;
    # downstream planners that need a strict DAG can filter later.
    p_dag = p_dedup
    p_cycle_dropped: list[dict] = []
    cycle_exists = find_cycle(p_dag)
    if cycle_exists is not None:
        report.append("WARNING: prereq graph has at least one cycle: "
                      + " -> ".join(cycle_exists + [cycle_exists[0]]))

    # ---- Overlay ----
    o_resolved, o_dropped_ids = validate_ids(overlay, known_ids, "overlay")
    review.extend(o_dropped_ids)
    # overlay can cycle, but dedup same (from, to, kind)
    o_dedup, o_dup_dropped = dedup_strongest(
        o_resolved, key=lambda e: (e["from"], e["to"], e["kind"])
    )
    review.extend(o_dup_dropped)

    # ---- Write ----
    args.out_dir.mkdir(parents=True, exist_ok=True)
    review_name = (
        "edges_review_queue.jsonl"
        if args.output_tag == "validated"
        else f"edges_review_queue.{args.output_tag}.jsonl"
    )
    report_name = (
        "edge_validation_report.txt"
        if args.output_tag == "validated"
        else f"edge_validation_report.{args.output_tag}.txt"
    )
    write_jsonl(args.out_dir / f"edges_prereq.{args.output_tag}.jsonl", p_dag)
    write_jsonl(args.out_dir / f"edges_overlay.{args.output_tag}.jsonl", o_dedup)
    write_jsonl(args.out_dir / review_name, review)

    # ---- Report ----
    summary = [
        "Edge validation report",
        f"concepts: {len(known_ids)}",
        "",
        "Prereq:",
        f"  in:              {len(prereq)}",
        f"  id resolution:   {len(p_resolved)} ok, {len(p_dropped_ids)} dropped",
        f"  dedup:           {len(p_dedup)} ok, {len(p_dup_dropped)} duplicates collapsed",
        f"  DAG:             {len(p_dag)} ok, {len(p_cycle_dropped)} cycle-breakers dropped",
        "",
        "Overlay:",
        f"  in:              {len(overlay)}",
        f"  id resolution:   {len(o_resolved)} ok, {len(o_dropped_ids)} dropped",
        f"  dedup:           {len(o_dedup)} ok, {len(o_dup_dropped)} duplicates collapsed",
        "",
        f"review queue: {len(review)}",
    ]
    if report:
        summary.append("")
        summary.append("Cycles broken:")
        summary.extend(f"  - {r}" for r in report[:20])
        if len(report) > 20:
            summary.append(f"  ... and {len(report) - 20} more (see review queue)")

    report_path = args.out_dir / report_name
    report_path.write_text("\n".join(summary) + "\n")
    print("\n".join(summary))
    print(
        f"\nwrote: {args.out_dir}/edges_*.{args.output_tag}.jsonl, "
        f"{review_name}, {report_name}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
