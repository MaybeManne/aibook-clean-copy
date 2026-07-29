#!/usr/bin/env python3
"""Extract semantically directed concept edges across independently processed books.

Candidate retrieval is deterministic and inexpensive. An LLM then audits only
the strongest lexical candidates. Unlike within-book extraction, no chapter or
book order is supplied or used: direction comes exclusively from edge meaning.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import threading
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path

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
]

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "can", "concept",
    "definition", "for", "from", "how", "in", "is", "it", "method", "model",
    "of", "on", "or", "that", "the", "their", "this", "to", "using", "with",
}

SYSTEM_PROMPT = """You audit candidate relationships between concepts from different textbooks.

The books have independent chapter orders. Never infer direction from chapter number,
source line, or presentation order. Direction must come only from semantic meaning:

- `requires`: FROM requires TO as a direct prerequisite.
- `special_case_of`: FROM is a narrower case of TO.
- `generalizes`: FROM is more general than TO.
- `formalizes`: FROM gives a more formal definition or treatment of TO.
- `illustrates`: FROM is an example/application that illustrates TO.
- `used_to_prove`: FROM is a tool or result used to prove TO.
- `see_also`: symmetric topical equivalence or a useful close cross-reference.
- `contrast_with`: symmetric comparison between meaningfully distinct concepts.

Return `no_edge` if shared vocabulary is superficial, the concepts occur at incompatible
levels, or the supplied excerpts do not support a useful learner-facing connection.
Exact duplicate concepts in two books should normally receive `see_also`. Be conservative.
Return one decision for every candidate_id."""

OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["decisions"],
    "properties": {
        "decisions": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "candidate_id", "decision", "from", "to", "rationale",
                    "strength", "evidence_primary", "evidence_other",
                ],
                "properties": {
                    "candidate_id": {"type": "string"},
                    "decision": {"type": "string", "enum": EDGE_KINDS + ["no_edge"]},
                    "from": {"type": "string"},
                    "to": {"type": "string"},
                    "rationale": {"type": "string"},
                    "strength": {"type": "number"},
                    "evidence_primary": {"type": "string"},
                    "evidence_other": {"type": "string"},
                },
            },
        },
    },
}


@dataclass(frozen=True)
class Book:
    book_id: str
    title: str
    path: Path
    viewer_url: str


def namespaced(book_id: str, concept_id: str) -> str:
    return f"{book_id}::{concept_id}"


def parse_book(value: str) -> Book:
    """Parse id|title|path|viewer-url."""
    parts = value.split("|")
    if len(parts) not in {3, 4}:
        raise argparse.ArgumentTypeError(
            "--book must be id|title|graph.json[|viewer-url]"
        )
    book_id, title, path = parts[:3]
    viewer_url = parts[3] if len(parts) == 4 else ""
    if not re.fullmatch(r"[a-z][a-z0-9_-]*", book_id):
        raise argparse.ArgumentTypeError(f"invalid book id: {book_id}")
    return Book(book_id, title, Path(path), viewer_url)


def stable_id(*parts: str) -> str:
    digest = hashlib.sha256("\0".join(parts).encode()).hexdigest()[:16]
    return f"cross_{digest}"


def canonical_text(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()


def stem(token: str) -> str:
    if len(token) > 5 and token.endswith("ies"):
        return token[:-3] + "y"
    for suffix in ("ing", "ed", "es", "s"):
        if len(token) > len(suffix) + 3 and token.endswith(suffix):
            return token[:-len(suffix)]
    return token


def tokens(value: str) -> list[str]:
    return [
        stem(token)
        for token in canonical_text(value).split()
        if len(token) > 1 and token not in STOP_WORDS
    ]


def concept_weights(concept: dict) -> Counter[str]:
    weights: Counter[str] = Counter()
    for token in tokens(str(concept.get("title") or "")):
        weights[token] += 5
    for alias in concept.get("aliases") or []:
        for token in tokens(str(alias)):
            weights[token] += 4
    for tag in concept.get("tags") or []:
        for token in tokens(str(tag)):
            weights[token] += 2
    for token in tokens(str(concept.get("one_liner") or "")):
        weights[token] += 1
    return weights


def weighted_cosine(left: Counter[str], right: Counter[str]) -> float:
    common = set(left) & set(right)
    numerator = sum(left[token] * right[token] for token in common)
    left_norm = math.sqrt(sum(value * value for value in left.values()))
    right_norm = math.sqrt(sum(value * value for value in right.values()))
    return numerator / max(1.0, left_norm * right_norm)


def title_token_overlap(left: dict, right: dict) -> float:
    a, b = set(tokens(str(left.get("title") or ""))), set(tokens(str(right.get("title") or "")))
    return len(a & b) / max(1, min(len(a), len(b)))


def concept_summary(concept: dict, book: Book) -> dict:
    position = concept.get("position") or {}
    return {
        "key": namespaced(book.book_id, concept["id"]),
        "id": concept["id"],
        "book_id": book.book_id,
        "book_title": book.title,
        "viewer_url": book.viewer_url,
        "title": concept.get("title") or concept["id"],
        "kind": concept.get("kind") or "idea",
        "chapter": int(position.get("chapter") or 0),
        "chapter_title": position.get("chapter_title") or "",
        "section": position.get("section") or (concept.get("source") or {}).get("section") or "",
        "section_title": position.get("section_title") or "",
        "one_liner": concept.get("one_liner") or "",
    }


def candidate_fingerprint(candidate: dict) -> str:
    payload = {
        "candidate_id": candidate["candidate_id"],
        "primary": candidate["primary"],
        "other": candidate["other"],
    }
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()
    ).hexdigest()[:16]


def generate_candidates(
    primary_book: Book,
    primary_concepts: list[dict],
    other_books: list[tuple[Book, list[dict]]],
    top_k: int = 2,
    min_score: float = 0.24,
) -> list[dict]:
    primary_weighted = [(concept, concept_weights(concept)) for concept in primary_concepts]
    candidates: list[dict] = []

    for book, concepts in other_books:
        weighted = [(concept, concept_weights(concept)) for concept in concepts]
        inverted: dict[str, set[int]] = defaultdict(set)
        for index, (_, weights) in enumerate(weighted):
            for token in weights:
                inverted[token].add(index)

        for primary, primary_weights in primary_weighted:
            candidate_indexes: set[int] = set()
            for token in primary_weights:
                candidate_indexes.update(inverted.get(token, set()))
            ranked: list[tuple[float, dict]] = []
            primary_title = canonical_text(str(primary.get("title") or ""))
            for index in candidate_indexes:
                other, other_weights = weighted[index]
                exact_title = primary_title == canonical_text(str(other.get("title") or ""))
                same_id = primary["id"] == other["id"]
                overlap = title_token_overlap(primary, other)
                cosine = weighted_cosine(primary_weights, other_weights)
                score = cosine + (0.75 if exact_title else 0) + (0.45 if same_id else 0) + 0.2 * overlap
                if exact_title or same_id or (overlap >= 0.34 and cosine >= min_score):
                    ranked.append((score, other))
            ranked.sort(key=lambda item: (-item[0], item[1]["id"]))
            for score, other in ranked[:top_k]:
                primary_key = namespaced(primary_book.book_id, primary["id"])
                other_key = namespaced(book.book_id, other["id"])
                candidate = {
                    "candidate_id": stable_id(primary_key, other_key),
                    "retrieval_score": round(score, 4),
                    "primary": concept_summary(primary, primary_book),
                    "other": concept_summary(other, book),
                }
                candidate["candidate_fingerprint"] = candidate_fingerprint(candidate)
                candidates.append(candidate)

    unique = {candidate["candidate_id"]: candidate for candidate in candidates}
    return sorted(
        unique.values(),
        key=lambda candidate: (
            candidate["primary"]["book_id"],
            candidate["primary"]["id"],
            candidate["other"]["book_id"],
            -candidate["retrieval_score"],
            candidate["other"]["id"],
        ),
    )


def render_concept(concept: dict) -> str:
    return (
        f"key: {concept['key']}\n"
        f"book: {concept['book_title']}\n"
        f"chapter: {concept['chapter']} — {concept['chapter_title']}\n"
        f"section: {concept['section']} — {concept['section_title']}\n"
        f"kind: {concept['kind']}\n"
        f"title: {concept['title']}\n"
        f"summary: {concept['one_liner'] or '(unavailable)'}"
    )


def process_batch(batch: list[dict], model: str) -> list[dict]:
    blocks = []
    for candidate in batch:
        blocks.append(
            f"## CANDIDATE {candidate['candidate_id']}\n"
            f"PRIMARY BOOK CONCEPT\n{render_concept(candidate['primary'])}\n\n"
            f"OTHER BOOK CONCEPT\n{render_concept(candidate['other'])}"
        )
    result = call_llm_json(
        SYSTEM_PROMPT,
        "Audit every candidate below.\n\n" + "\n\n".join(blocks),
        OUTPUT_SCHEMA,
        model=model,
        temperature=0.0,
        max_output_tokens=8192,
    )
    returned = {
        decision.get("candidate_id"): decision
        for decision in result.get("decisions", [])
    }
    records = []
    for candidate in batch:
        decision = dict(returned.get(candidate["candidate_id"]) or {
            "candidate_id": candidate["candidate_id"],
            "decision": "no_edge",
            "from": candidate["primary"]["key"],
            "to": candidate["other"]["key"],
            "rationale": "The auditor returned no decision.",
            "strength": 0.0,
            "evidence_primary": "",
            "evidence_other": "",
        })
        decision["candidate_fingerprint"] = candidate["candidate_fingerprint"]
        decision["retrieval_score"] = candidate["retrieval_score"]
        decision["audit_model"] = model
        records.append(decision)
    return records


def process_batch_resilient(batch: list[dict], model: str) -> list[dict]:
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


def load_decisions(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    records = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            record = json.loads(line)
            records[record["candidate_id"]] = record
    return records


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "".join(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n" for record in records),
        encoding="utf-8",
    )


def compile_output(
    primary_book: Book,
    other_books: list[Book],
    candidates: list[dict],
    decisions: dict[str, dict],
    model: str,
    threshold: float,
) -> dict:
    concepts: dict[str, dict] = {}
    edges: list[dict] = []
    for candidate in candidates:
        decision = decisions.get(candidate["candidate_id"])
        if not decision:
            continue
        kind = decision.get("decision")
        strength = float(decision.get("strength") or 0)
        allowed_keys = {candidate["primary"]["key"], candidate["other"]["key"]}
        if (
            kind not in EDGE_KINDS
            or strength < threshold
            or decision.get("from") not in allowed_keys
            or decision.get("to") not in allowed_keys
            or decision.get("from") == decision.get("to")
        ):
            continue
        concepts[candidate["primary"]["key"]] = candidate["primary"]
        concepts[candidate["other"]["key"]] = candidate["other"]
        edges.append({
            "edge_id": stable_id(
                str(decision["from"]), str(decision["to"]), str(kind)
            ),
            "from": decision["from"],
            "to": decision["to"],
            "kind": kind,
            "rationale": str(decision.get("rationale") or ""),
            "strength": round(strength, 4),
            "evidence": {
                candidate["primary"]["key"]: str(decision.get("evidence_primary") or ""),
                candidate["other"]["key"]: str(decision.get("evidence_other") or ""),
            },
            "retrieval_score": candidate["retrieval_score"],
            "verified": True,
            "verification_model": model,
        })
    edges.sort(key=lambda edge: (edge["from"], edge["to"], edge["kind"]))
    return {
        "meta": {
            "schema_version": 1,
            "generator": "create_knowledge_graph/pipeline3/extract_cross_book_edges.py",
            "primary_book_id": primary_book.book_id,
            "candidate_count": len(candidates),
            "accepted_edge_count": len(edges),
            "threshold": threshold,
            "model": model,
            "ordering_rule": "semantic_only_no_cross_book_temporal_order",
        },
        "books": [
            {
                "book_id": book.book_id,
                "title": book.title,
                "graph_path": str(book.path),
                "viewer_url": book.viewer_url,
            }
            for book in [primary_book, *other_books]
        ],
        "concepts": sorted(concepts.values(), key=lambda concept: concept["key"]),
        "edges": edges,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--primary", type=parse_book, required=True)
    parser.add_argument("--book", type=parse_book, action="append", default=[])
    parser.add_argument("--out", type=Path, default=Path("cross-book-connections.json"))
    parser.add_argument("--decisions", type=Path, default=Path("cross_book_decisions.jsonl"))
    parser.add_argument("--candidates-out", type=Path)
    parser.add_argument("--model", default=GEMINI_DEFAULT)
    parser.add_argument("--top-k", type=int, default=2)
    parser.add_argument("--min-score", type=float, default=0.35)
    parser.add_argument("--threshold", type=float, default=0.62)
    parser.add_argument("--batch-size", type=int, default=10)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--max-candidates", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if not args.book:
        parser.error("at least one --book is required")

    primary_graph = json.loads(args.primary.path.read_text(encoding="utf-8"))
    other_graphs = [
        (book, json.loads(book.path.read_text(encoding="utf-8")))
        for book in args.book
    ]
    candidates = generate_candidates(
        args.primary,
        primary_graph.get("concepts", []),
        [(book, graph.get("concepts", [])) for book, graph in other_graphs],
        top_k=max(1, args.top_k),
        min_score=args.min_score,
    )
    if args.max_candidates:
        candidates = candidates[:args.max_candidates]
    if args.candidates_out:
        args.candidates_out.parent.mkdir(parents=True, exist_ok=True)
        args.candidates_out.write_text(
            json.dumps(candidates, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
    print(f"candidates: {len(candidates)}")
    if args.dry_run:
        return

    existing = load_decisions(args.decisions)
    pending = [
        candidate for candidate in candidates
        if existing.get(candidate["candidate_id"], {}).get("candidate_fingerprint")
        != candidate["candidate_fingerprint"]
    ]
    print(f"reused: {len(candidates) - len(pending)}; pending: {len(pending)}")
    lock = threading.Lock()
    completed = 0
    batches = [
        pending[index:index + max(1, args.batch_size)]
        for index in range(0, len(pending), max(1, args.batch_size))
    ]
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = {
            executor.submit(process_batch_resilient, batch, args.model): batch
            for batch in batches
        }
        for future in as_completed(futures):
            records = future.result()
            with lock:
                for record in records:
                    existing[record["candidate_id"]] = record
                completed += len(records)
                ordered = [existing[c["candidate_id"]] for c in candidates if c["candidate_id"] in existing]
                write_jsonl(args.decisions, ordered)
                print(f"audited: {completed}/{len(pending)}")

    output = compile_output(
        args.primary,
        [book for book, _ in other_graphs],
        candidates,
        existing,
        args.model,
        args.threshold,
    )
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(
        json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(output["meta"], indent=2))


if __name__ == "__main__":
    main()
