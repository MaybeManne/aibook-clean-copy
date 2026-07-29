from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

PIPELINE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_DIR))

from audit_local_edges import (  # noqa: E402
    decision_to_edge,
    generate_candidates,
    process_batch_resilient,
)
from merge_edge_sets import merge_group  # noqa: E402
from merge_graph import prefer_final  # noqa: E402


def concept(
    concept_id: str,
    order: int,
    section: str = "1.1",
    chapter: int = 1,
) -> dict:
    return {
        "id": concept_id,
        "title": concept_id,
        "kind": "definition",
        "one_liner": concept_id,
        "position": {
            "chapter": chapter,
            "section": section,
            "concept_order_in_section": order,
        },
        "source": {
            "spans": [{
                "start": f"L{order:05d}",
                "end": f"L{order:05d}",
                "file": "book.numbered.md",
            }],
        },
    }


class LocalCandidateTests(unittest.TestCase):
    def test_generates_nearby_and_section_boundary_candidates(self) -> None:
        concepts = [
            concept("a", 1),
            concept("b", 2),
            concept("c", 3, section="1.2"),
        ]
        candidates = generate_candidates(concepts, [], [], max_gap=2)
        keys = {candidate["pair_key"] for candidate in candidates}
        self.assertEqual(keys, {"a::b", "b::c"})

    def test_skips_pairs_already_covered_by_any_semantic_edge(self) -> None:
        concepts = [concept("a", 1), concept("b", 2)]
        candidates = generate_candidates(
            concepts,
            [],
            [{"from": "b", "to": "a", "kind": "see_also"}],
            max_gap=2,
        )
        self.assertEqual(candidates, [])

    def test_rejects_backwards_prerequisite_decision(self) -> None:
        concepts = {
            "a": concept("a", 1),
            "b": concept("b", 2),
        }
        edge = decision_to_edge({
            "pair_key": "a::b",
            "decision": "requires",
            "from": "a",
            "to": "b",
            "strength": 0.9,
            "audit_model": "test",
        }, concepts)
        self.assertIsNone(edge)

    def test_malformed_large_batch_is_split_and_retried(self) -> None:
        batch = [{"pair_key": str(index)} for index in range(4)]

        def fake_process(records: list[dict], model: str) -> list[dict]:
            if len(records) > 1:
                raise ValueError("malformed response")
            return records

        with patch("audit_local_edges.process_batch", side_effect=fake_process):
            self.assertEqual(
                process_batch_resilient(batch, "test-model"),
                batch,
            )


class MergeTests(unittest.TestCase):
    def test_merge_is_stable_and_preserves_sources(self) -> None:
        base = [{"from": "b", "to": "a", "kind": "requires", "strength": 0.7}]
        supplemental = [
            {"from": "b", "to": "a", "kind": "requires", "strength": 0.8}
        ]
        first, duplicates = merge_group(base, supplemental)
        second, _ = merge_group(base, supplemental)
        self.assertEqual(duplicates, 1)
        self.assertEqual(first, second)
        self.assertEqual(first[0]["merge_sources"], ["base", "local_audit"])
        self.assertTrue(first[0]["edge_id"].startswith("edge_"))

    def test_graph_prefers_final_edge_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            directory = Path(tmp)
            for tag in ("validated", "semantic", "final"):
                (directory / f"edges_prereq.{tag}.jsonl").write_text(
                    json.dumps({"tag": tag}) + "\n"
                )
            self.assertEqual(
                prefer_final(directory, "edges_prereq").name,
                "edges_prereq.final.jsonl",
            )


if __name__ == "__main__":
    unittest.main()
