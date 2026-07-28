#!/usr/bin/env python3
"""
Audit deterministic local concept pairs that the broad edge extractor missed.

Candidates are consecutive and near-consecutive concepts in the same section.
Every candidate receives an explicit relationship or `no_edge` decision. Results
are resumable: unchanged decisions are reused instead of billed again.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from extract_edges import (
    PREREQ_KINDS,
    _load_numbered,
    _quote_for_line,
    _source_passage,
    _spans_of,
    load_jsonl,
    span_start_int,
    write_jsonl,
)
from llm import GEMINI_DEFAULT, call_llm_json


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

SYSTEM_PROMPT = """You audit local textbook concept pairs for a knowledge graph.

For every candidate pair, return exactly one decision:
- an allowed semantic edge kind, when the source passages directly support it; or
- `no_edge`, when adjacency is only reading order or evidence is insufficient.

Be conservative. Sequential presentation alone is NOT a prerequisite.
`requires` means the later concept directly depends on the earlier concept.
`teaches_after` means the order is pedagogically useful but not a dependency.
Use stronger specific relationships instead of `see_also` when supported.

For `requires` and `teaches_after`, `from` must be the later concept and `to`
the earlier concept. Every accepted edge needs an exact evidence line and quote.
Return one decision for every supplied pair_key."""

OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["decisions"],
    "properties": {
        "decisions": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "pair_key", "decision", "from", "to", "rationale",
                    "strength", "evidence_line", "evidence_quote",
                ],
                "properties": {
                    "pair_key": {"type": "string"},
                    "decision": {"type": "string", "enum": EDGE_KINDS + ["no_edge"]},
                    "from": {"type": "string"},
                    "to": {"type": "string"},
                    "rationale": {"type": "string"},
                    "strength": {"type": "number"},
                    "evidence_line": {"type": "string"},
                    "evidence_quote": {"type": "string"},
                },
            },
        },
    },
}


def section_of(concept: dict) -> str:
    return (
        (concept.get("position") or {}).get("section")
        or (concept.get("source") or {}).get("section")
        or "_unknown_"
    )


def chapter_of(concept: dict) -> int:
    return int((concept.get("position") or {}).get("chapter") or 0)


def concept_order(concept: dict) -> tuple[int, int]:
    position = concept.get("position") or {}
    return (
        int(position.get("concept_order_in_section") or span_start_int(concept)),
        span_start_int(concept),
    )


def canonical_pair(a: str, b: str) -> tuple[str, str]:
    return tuple(sorted((a, b)))


def pair_key(a: dict, b: dict) -> str:
    left, right = canonical_pair(a["id"], b["id"])
    return f"{left}::{right}"


def candidate_fingerprint(a: dict, b: dict) -> str:
    payload = [
        a["id"], a.get("title"), a.get("one_liner"), _spans_of(a),
        b["id"], b.get("title"), b.get("one_liner"), _spans_of(b),
    ]
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()
    ).hexdigest()[:16]


def existing_pairs(prereq: list[dict], overlay: list[dict]) -> set[tuple[str, str]]:
    return {
        canonical_pair(edge.get("from", ""), edge.get("to", ""))
        for edge in prereq + overlay
        if edge.get("from") and edge.get("to")
    }


def generate_candidates(
    concepts: list[dict],
    prereq: list[dict],
    overlay: list[dict],
    max_gap: int,
) -> list[dict]:
    covered = existing_pairs(prereq, overlay)
    by_section: dict[str, list[dict]] = {}
    for concept in concepts:
        by_section.setdefault(section_of(concept), []).append(concept)

    candidates: list[dict] = []
    candidate_keys: set[str] = set()

    def add_candidate(earlier: dict, later: dict, section: str) -> None:
        key = pair_key(earlier, later)
        if (
            key in candidate_keys
            or canonical_pair(earlier["id"], later["id"]) in covered
        ):
            return
        candidate_keys.add(key)
        candidates.append({
            "pair_key": key,
            "candidate_fingerprint": candidate_fingerprint(earlier, later),
            "section": section,
            "earlier": earlier,
            "later": later,
        })

    for section, section_concepts in by_section.items():
        ordered = sorted(section_concepts, key=concept_order)
        for i, earlier in enumerate(ordered):
            for later in ordered[i + 1:i + 1 + max_gap]:
                add_candidate(earlier, later, section)

    # Also audit the immediate transition between neighboring sections in a
    # chapter; these are easy for section-window extraction to under-classify.
    globally_ordered = sorted(concepts, key=span_start_int)
    for earlier, later in zip(globally_ordered, globally_ordered[1:]):
        if (
            section_of(earlier) != section_of(later)
            and chapter_of(earlier) == chapter_of(later)
        ):
            add_candidate(
                earlier,
                later,
                f"{section_of(earlier)}→{section_of(later)}",
            )
    return candidates


def concept_text(concept: dict) -> str:
    passage = _source_passage(concept, max_chars=1800)
    return (
        f"id: {concept['id']}\n"
        f"title: {concept.get('title', '')}\n"
        f"kind: {concept.get('kind', '')}\n"
        f"one_liner: {concept.get('one_liner', '')}\n"
        f"source_passage:\n{passage or '(unavailable)'}"
    )


def render_candidate(candidate: dict) -> str:
    return (
        f"## PAIR {candidate['pair_key']} (same section §{candidate['section']})\n"
        f"EARLIER CONCEPT\n{concept_text(candidate['earlier'])}\n\n"
        f"LATER CONCEPT\n{concept_text(candidate['later'])}"
    )


def process_batch(batch: list[dict], model: str) -> list[dict]:
    prompt = "\n\n".join(render_candidate(candidate) for candidate in batch)
    result = call_llm_json(
        SYSTEM_PROMPT,
        "Audit every candidate pair below.\n\n" + prompt,
        OUTPUT_SCHEMA,
        model=model,
        temperature=0.0,
    )
    returned = {
        decision.get("pair_key"): decision
        for decision in result.get("decisions", [])
    }
    records: list[dict] = []
    for candidate in batch:
        key = candidate["pair_key"]
        decision = dict(returned.get(key) or {
            "pair_key": key,
            "decision": "no_edge",
            "from": candidate["later"]["id"],
            "to": candidate["earlier"]["id"],
            "rationale": "Auditor returned no decision for this candidate.",
            "strength": 0.0,
            "evidence_line": "",
            "evidence_quote": "",
        })
        decision["candidate_fingerprint"] = candidate["candidate_fingerprint"]
        decision["section"] = candidate["section"]
        decision["audit_model"] = model
        records.append(decision)
    return records


def process_batch_resilient(batch: list[dict], model: str) -> list[dict]:
    """Retry malformed large responses as smaller independent batches."""
    try:
        return process_batch(batch, model)
    except Exception:
        if len(batch) <= 1:
            raise
        midpoint = len(batch) // 2
        return (
            process_batch_resilient(batch[:midpoint], model)
            + process_batch_resilient(batch[midpoint:], model)
        )


def decision_to_edge(decision: dict, concepts: dict[str, dict]) -> dict | None:
    kind = decision.get("decision")
    if kind not in EDGE_KINDS:
        return None
    frm, to = decision.get("from"), decision.get("to")
    if frm not in concepts or to not in concepts or frm == to:
        return None
    if kind in {"requires", "teaches_after"}:
        if span_start_int(concepts[frm]) <= span_start_int(concepts[to]):
            return None

    evidence_line = str(decision.get("evidence_line") or "").strip()
    spans = _spans_of(concepts[frm]) or _spans_of(concepts[to])
    return {
        "from": frm,
        "to": to,
        "kind": kind,
        "rationale": decision.get("rationale", ""),
        "strength": float(decision.get("strength") or 0.0),
        "confidence": float(decision.get("strength") or 0.0),
        "evidence_spans": spans[:2],
        "evidence_line": evidence_line,
        "evidence_quote": (
            str(decision.get("evidence_quote") or "").strip()
            or _quote_for_line(evidence_line)
        ),
        "verified": False,
        "extraction": {
            "model": decision.get("audit_model"),
            "stage": "audit_local_edges",
            "pair_key": decision.get("pair_key"),
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--concepts", type=Path, required=True)
    parser.add_argument("--prereq", type=Path, required=True)
    parser.add_argument("--overlay", type=Path, required=True)
    parser.add_argument("--numbered", type=Path, default=None)
    parser.add_argument("--out-prereq", type=Path, required=True)
    parser.add_argument("--out-overlay", type=Path, required=True)
    parser.add_argument("--out-decisions", type=Path, required=True)
    parser.add_argument("--model", default=GEMINI_DEFAULT)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--max-gap", type=int, default=2)
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report candidate/API batch counts without calling a model or writing files.",
    )
    args = parser.parse_args()

    if args.numbered and args.numbered.exists():
        _load_numbered(args.numbered)
    concepts_list = load_jsonl(args.concepts)
    concepts = {concept["id"]: concept for concept in concepts_list}
    prereq = load_jsonl(args.prereq)
    overlay = load_jsonl(args.overlay)
    candidates = generate_candidates(concepts_list, prereq, overlay, args.max_gap)

    previous = [] if args.refresh or not args.out_decisions.exists() else load_jsonl(args.out_decisions)
    previous_by_key = {
        (record.get("pair_key"), record.get("candidate_fingerprint")): record
        for record in previous
    }
    reused: list[dict] = []
    pending: list[dict] = []
    for candidate in candidates:
        cached = previous_by_key.get(
            (candidate["pair_key"], candidate["candidate_fingerprint"])
        )
        (reused if cached else pending).append(cached or candidate)

    if args.dry_run:
        print(json.dumps({
            "candidates": len(candidates),
            "cached_decisions": len(reused),
            "pending_decisions": len(pending),
            "estimated_api_batches": (
                len(pending) + max(1, args.batch_size) - 1
            ) // max(1, args.batch_size),
        }, indent=2))
        return

    batches = [
        pending[i:i + args.batch_size]
        for i in range(0, len(pending), args.batch_size)
    ]
    records_by_key = {
        record["pair_key"]: record
        for record in reused
        if record and record.get("pair_key")
    }
    new_count = 0
    lock = threading.Lock()
    failures: list[str] = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(process_batch_resilient, batch, args.model): batch
            for batch in batches
        }
        for future in as_completed(futures):
            try:
                records = future.result()
            except Exception as exc:
                batch = futures[future]
                failures.append(
                    f"{batch[0]['pair_key']}..{batch[-1]['pair_key']}: "
                    f"{type(exc).__name__}: {exc}"
                )
                continue
            with lock:
                for record in records:
                    records_by_key[record["pair_key"]] = record
                new_count += len(records)
                checkpoint = sorted(
                    records_by_key.values(),
                    key=lambda record: (
                        record.get("section", ""),
                        record.get("pair_key", ""),
                    ),
                )
                write_jsonl(args.out_decisions, checkpoint)
                print(
                    f"audited {new_count}/{len(pending)} new candidates",
                    flush=True,
                )

    if failures:
        raise RuntimeError(
            f"{len(failures)} local audit batch(es) failed after splitting; "
            f"completed decisions were checkpointed. First failure: {failures[0]}"
        )

    decisions = list(records_by_key.values())
    decisions.sort(key=lambda record: (record.get("section", ""), record.get("pair_key", "")))
    edges = [
        edge for edge in (
            decision_to_edge(decision, concepts) for decision in decisions
        )
        if edge is not None
    ]
    write_jsonl(args.out_decisions, decisions)
    write_jsonl(
        args.out_prereq,
        [edge for edge in edges if edge["kind"] in PREREQ_KINDS],
    )
    write_jsonl(
        args.out_overlay,
        [edge for edge in edges if edge["kind"] not in PREREQ_KINDS],
    )
    print(
        f"candidates: {len(candidates)}; reused: {len(reused)}; "
        f"new: {new_count}; accepted edges: {len(edges)}"
    )


if __name__ == "__main__":
    main()
