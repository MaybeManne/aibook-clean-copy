#!/usr/bin/env python3
"""
LLM semantic verification for extracted concept-graph edges.

This is intentionally separate from validate_edges.py:
  - validate_edges.py is deterministic structural validation (IDs, self-loops, dedup).
  - this script asks an LLM whether an edge is semantically supported and correctly typed.

Usage against pipeline jsonl artifacts:
    python verify_edges_semantic.py \
        --concepts data_vision_v2/concepts.jsonl \
        --prereq data_vision_v2/edges_prereq.validated.jsonl \
        --overlay data_vision_v2/edges_overlay.validated.jsonl \
        --numbered data_vision_v2/book.numbered.md \
        --out-dir data_vision_v2/edge_semantic_verify \
        --limit 100

Usage against the viewer graph:
    python verify_edges_semantic.py \
        --graph ../../concept-graph-vision-data.json \
        --numbered data_vision_v2/book.numbered.md \
        --out-dir data_vision_v2/edge_semantic_verify
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, OPENAI_DEFAULT


EDGE_KINDS = [
    "requires",
    "special_case_of",
    "generalizes",
    "formalizes",
    "illustrates",
    "used_to_prove",
    "see_also",
    "contrast_with",
    "teaches_after",
]
PREREQ_KINDS = {"requires"}

SYSTEM_PROMPT = """You verify semantic correctness of concept-graph edges.

You receive a batch of proposed edges. For each edge, you see:
  - source concept A (`from`)
  - target concept B (`to`)
  - proposed edge kind
  - extractor rationale, strength, and evidence quote when available
  - source passages / evidence lines from the textbook

Decide whether the edge is supported by the evidence and whether the edge kind is correct.
Your `reason` will be shown in the visualization UI, so make it concise and user-facing:
explain why the mapping should be kept, relabeled, or dropped.

Edge kind meanings:
  `requires`        — A directly depends on B for understanding.
  `special_case_of` — A is a narrower/member case of broader B.
  `generalizes`     — A is broader than B.
  `formalizes`      — A rigorously defines or mathematically expresses B.
  `illustrates`     — A concretely demonstrates B.
  `used_to_prove`   — A is used as a proof/tool for B.
  `see_also`        — A and B are usefully related but no stronger relation fits.
  `contrast_with`   — A and B are adjacent alternatives whose comparison helps.
  `teaches_after`   — A is pedagogically better taught after B, but does not require B.

Verdicts:
  - `keep`: edge is supported and kind is right.
  - `relabel`: edge is supported but another allowed kind is better.
  - `drop`: edge is unsupported, too weak, backwards in a harmful way, or hallucinated.

Be conservative for `requires`: keep it only for direct dependencies, not loose relatedness.
For overlay edges, allow useful textbook-supported semantic relations, but drop vague topical noise.
Return one review for every input edge index.
"""

OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["reviews"],
    "properties": {
        "reviews": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "edge_index",
                    "verdict",
                    "supported",
                    "kind_correct",
                    "corrected_kind",
                    "confidence",
                    "reason",
                ],
                "properties": {
                    "edge_index": {"type": "integer"},
                    "verdict": {"type": "string", "enum": ["keep", "relabel", "drop"]},
                    "supported": {"type": "boolean"},
                    "kind_correct": {"type": "boolean"},
                    "corrected_kind": {"type": "string", "enum": EDGE_KINDS + [""]},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "reason": {"type": "string"},
                },
            },
        },
    },
}

_numbered_lines: dict[str, str] = {}


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def load_numbered(path: Path | None) -> None:
    if not path or not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        if len(raw) >= 8 and raw.startswith("L") and raw[1:6].isdigit() and raw[6:8] == ": ":
            _numbered_lines[raw[:6]] = raw[8:]


def spans_of(rec: dict) -> list[dict]:
    src = rec.get("source") or {}
    spans = src.get("spans")
    if spans:
        return spans
    if src.get("span"):
        return [src["span"]]
    return []


def passage_for_spans(spans: list[dict], max_lines: int = 18, max_chars: int = 1800) -> str:
    if not _numbered_lines:
        return ""
    parts: list[str] = []
    for sp in spans[:2]:
        try:
            start = int(str(sp.get("start", ""))[1:])
            end = int(str(sp.get("end", ""))[1:])
        except ValueError:
            continue
        for n in range(start, min(end + 1, start + max_lines)):
            key = f"L{n:05d}"
            if key in _numbered_lines:
                parts.append(f"{key}: {_numbered_lines[key]}")
    return "\n".join(parts)[:max_chars]


def concept_brief(c: dict) -> str:
    pos = c.get("position") or {}
    fields = [
        f"id: {c.get('id')}",
        f"title: {c.get('title')}",
        f"kind: {c.get('kind')}",
        f"chapter/section: ch{pos.get('chapter', '?')} §{pos.get('section', '?')} {pos.get('section_title', '')}",
        f"one_liner: {c.get('one_liner', '')}",
        f"content: {str(c.get('content', ''))[:500]}",
        f"source.spans: {spans_of(c)}",
    ]
    passage = passage_for_spans(spans_of(c))
    if passage:
        fields.append("source passage:\n" + passage)
    return "\n".join(fields)


def edge_evidence(edge: dict) -> str:
    spans = edge.get("evidence_spans") or []
    passage = passage_for_spans(spans, max_lines=14, max_chars=1200)
    return passage or "(no numbered evidence passage available)"


def load_inputs(args) -> tuple[dict[str, dict], list[dict]]:
    if args.graph:
        graph = json.loads(args.graph.read_text(encoding="utf-8"))
        concepts = {c["id"]: c for c in graph.get("concepts", []) if "id" in c}
        edges = []
        for e in graph.get("edges", {}).get("prereq", []):
            edges.append({**e, "_edge_group": "prereq"})
        for e in graph.get("edges", {}).get("overlay", []):
            edges.append({**e, "_edge_group": "overlay"})
        return concepts, edges

    concepts_list = load_jsonl(args.concepts)
    concepts = {c["id"]: c for c in concepts_list if "id" in c}
    edges = []
    for e in load_jsonl(args.prereq):
        edges.append({**e, "_edge_group": "prereq"})
    for e in load_jsonl(args.overlay):
        edges.append({**e, "_edge_group": "overlay"})
    return concepts, edges


def render_edge(idx: int, edge: dict, concepts: dict[str, dict]) -> str:
    frm = concepts.get(edge.get("from"), {})
    to = concepts.get(edge.get("to"), {})
    return (
        f"### EDGE {idx}\n"
        f"from: {edge.get('from')}\n"
        f"to: {edge.get('to')}\n"
        f"kind: {edge.get('kind')}\n"
        f"strength: {edge.get('strength', edge.get('confidence', ''))}\n"
        f"extractor_rationale: {edge.get('rationale', '')}\n"
        f"extractor_evidence_quote: {edge.get('evidence_quote', '')}\n"
        f"extractor_evidence_line: {edge.get('evidence_line', '')}\n\n"
        f"FROM concept:\n{concept_brief(frm)}\n\n"
        f"TO concept:\n{concept_brief(to)}\n\n"
        f"Edge evidence passage:\n{edge_evidence(edge)}\n"
    )


def verify_batch(batch: list[tuple[int, dict]], concepts: dict[str, dict], model: str) -> list[dict]:
    body = "\n\n".join(render_edge(i, e, concepts) for i, e in batch)
    result = call_llm_json(
        SYSTEM_PROMPT,
        "Verify these proposed edges:\n\n" + body,
        OUTPUT_SCHEMA,
        model=model,
        max_output_tokens=8192,
        temperature=0.0,
    )
    by_idx = {r.get("edge_index"): r for r in result.get("reviews", [])}
    reviews: list[dict] = []
    for idx, edge in batch:
        review = by_idx.get(idx)
        if not review:
            review = {
                "edge_index": idx,
                "verdict": "drop",
                "supported": False,
                "kind_correct": False,
                "corrected_kind": "",
                "confidence": 0.0,
                "reason": "verifier returned no review for this edge",
            }
        reviews.append({"edge": edge, "review": review})
    return reviews


def apply_reviews(records: list[dict], threshold: float) -> tuple[list[dict], list[dict], list[dict]]:
    kept_prereq: list[dict] = []
    kept_overlay: list[dict] = []
    dropped: list[dict] = []
    for rec in records:
        edge = dict(rec["edge"])
        edge.pop("_edge_group", None)
        review = rec["review"]
        verdict = review.get("verdict")
        conf = float(review.get("confidence") or 0.0)
        if verdict == "drop" or conf < threshold:
            dropped.append({**edge, "_semantic_review": review})
            continue
        if verdict == "relabel":
            corrected = review.get("corrected_kind") or ""
            if corrected not in EDGE_KINDS:
                dropped.append({**edge, "_semantic_review": {**review, "reason": "invalid corrected_kind"}})
                continue
            edge["kind"] = corrected
        edge["semantic_verified"] = True
        edge["semantic_verdict"] = verdict
        edge["semantic_supported"] = bool(review.get("supported"))
        edge["semantic_kind_correct"] = bool(review.get("kind_correct"))
        edge["semantic_corrected_kind"] = review.get("corrected_kind") or ""
        edge["semantic_confidence"] = conf
        edge["semantic_review"] = review.get("reason", "")
        edge["verification"] = {
            "verdict": verdict,
            "supported": bool(review.get("supported")),
            "kind_correct": bool(review.get("kind_correct")),
            "corrected_kind": review.get("corrected_kind") or "",
            "confidence": conf,
            "reason": review.get("reason", ""),
        }
        if edge.get("kind") in PREREQ_KINDS:
            kept_prereq.append(edge)
        else:
            kept_overlay.append(edge)
    return kept_prereq, kept_overlay, dropped


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--graph", type=Path, help="Single viewer graph JSON with concepts and edges.")
    src.add_argument("--concepts", type=Path, help="Concepts JSONL for pipeline artifacts.")
    ap.add_argument("--prereq", type=Path, help="Prereq edges JSONL (required with --concepts).")
    ap.add_argument("--overlay", type=Path, help="Overlay edges JSONL (required with --concepts).")
    ap.add_argument("--numbered", type=Path, default=None, help="book.numbered.md for evidence passages.")
    ap.add_argument("--out-dir", type=Path, required=True)
    ap.add_argument("--model", default=OPENAI_DEFAULT)
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--batch-size", type=int, default=6)
    ap.add_argument("--limit", type=int, default=0, help="Verify first N edges only; 0 = all.")
    ap.add_argument("--threshold", type=float, default=0.55, help="Minimum verifier confidence to keep edge.")
    args = ap.parse_args()

    if args.concepts and (not args.prereq or not args.overlay):
        raise SystemExit("--prereq and --overlay are required with --concepts")

    load_numbered(args.numbered)
    concepts, edges = load_inputs(args)
    known_edges = [e for e in edges if e.get("from") in concepts and e.get("to") in concepts and e.get("from") != e.get("to")]
    if args.limit:
        known_edges = known_edges[:args.limit]

    args.out_dir.mkdir(parents=True, exist_ok=True)
    indexed = list(enumerate(known_edges))
    batches = [indexed[i:i + args.batch_size] for i in range(0, len(indexed), args.batch_size)]

    all_reviews: list[dict] = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(verify_batch, b, concepts, args.model) for b in batches]
        for fut in as_completed(futures):
            batch_reviews = fut.result()
            all_reviews.extend(batch_reviews)
            print(f"verified {len(all_reviews)}/{len(indexed)}", file=sys.stderr)

    all_reviews.sort(key=lambda r: r["review"]["edge_index"])
    write_jsonl(args.out_dir / "edges_semantic_reviews.jsonl", all_reviews)
    kept_prereq, kept_overlay, dropped = apply_reviews(all_reviews, args.threshold)
    write_jsonl(args.out_dir / "edges_prereq.semantic.jsonl", kept_prereq)
    write_jsonl(args.out_dir / "edges_overlay.semantic.jsonl", kept_overlay)
    write_jsonl(args.out_dir / "edges_semantic_dropped.jsonl", dropped)

    verdicts = Counter(r["review"].get("verdict") for r in all_reviews)
    kinds = Counter(e.get("kind") for e in kept_prereq + kept_overlay)
    report = [
        "Semantic edge verification report",
        f"concepts: {len(concepts)}",
        f"edges reviewed: {len(all_reviews)}",
        f"threshold: {args.threshold}",
        "",
        "verdicts:",
        *[f"  {k}: {v}" for k, v in sorted(verdicts.items())],
        "",
        f"kept prereq: {len(kept_prereq)}",
        f"kept overlay: {len(kept_overlay)}",
        f"dropped: {len(dropped)}",
        "",
        "kept kinds:",
        *[f"  {k}: {v}" for k, v in sorted(kinds.items())],
    ]
    (args.out_dir / "edge_semantic_verification_report.txt").write_text("\n".join(report) + "\n")
    print("\n".join(report))


if __name__ == "__main__":
    main()
