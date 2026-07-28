from __future__ import annotations

import sys
import unittest
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_DIR))

from extract_cross_book_edges import (  # noqa: E402
    Book,
    compile_output,
    generate_candidates,
    namespaced,
)


def concept(concept_id: str, title: str, chapter: int, one_liner: str = "") -> dict:
    return {
        "id": concept_id,
        "title": title,
        "kind": "definition",
        "aliases": [],
        "tags": [],
        "one_liner": one_liner,
        "position": {
            "chapter": chapter,
            "chapter_title": f"Chapter {chapter}",
            "section": f"{chapter}.1",
            "section_title": "Section",
        },
    }


class CrossBookCandidateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.vision = Book("vision", "Vision", Path("vision.json"), "")
        self.deep = Book("deep_learning", "Deep Learning", Path("deep.json"), "")

    def test_exact_concept_is_retrieved_despite_unrelated_chapter_orders(self) -> None:
        candidates = generate_candidates(
            self.vision,
            [concept("vision_transformer", "Transformer", 50)],
            [(self.deep, [concept("transformer", "Transformer", 2)])],
            top_k=1,
        )
        self.assertEqual(len(candidates), 1)
        self.assertEqual(candidates[0]["primary"]["chapter"], 50)
        self.assertEqual(candidates[0]["other"]["chapter"], 2)

    def test_ids_are_namespaced_to_avoid_cross_book_collisions(self) -> None:
        candidates = generate_candidates(
            self.vision,
            [concept("backpropagation", "Backpropagation", 14)],
            [(self.deep, [concept("backpropagation", "Backpropagation", 7)])],
            top_k=1,
        )
        self.assertEqual(candidates[0]["primary"]["key"], "vision::backpropagation")
        self.assertEqual(candidates[0]["other"]["key"], "deep_learning::backpropagation")

    def test_unrelated_shared_generic_words_are_not_candidates(self) -> None:
        candidates = generate_candidates(
            self.vision,
            [concept("camera_model", "Camera model", 5)],
            [(self.deep, [concept("language_model", "Language model", 12)])],
            top_k=1,
        )
        self.assertEqual(candidates, [])


class CrossBookCompileTests(unittest.TestCase):
    def test_requires_direction_is_semantic_not_chapter_based(self) -> None:
        primary = Book("vision", "Vision", Path("vision.json"), "")
        other = Book("deep_learning", "Deep Learning", Path("deep.json"), "")
        candidates = generate_candidates(
            primary,
            [concept("cnn_detector", "Convolution", 5)],
            [(other, [concept("convolution", "Convolution", 20)])],
            top_k=1,
        )
        candidate = candidates[0]
        decisions = {
            candidate["candidate_id"]: {
                "candidate_id": candidate["candidate_id"],
                "decision": "requires",
                "from": namespaced("vision", "cnn_detector"),
                "to": namespaced("deep_learning", "convolution"),
                "rationale": "The detector uses convolution.",
                "strength": 0.9,
                "evidence_primary": "uses convolution",
                "evidence_other": "defines convolution",
            }
        }
        output = compile_output(primary, [other], candidates, decisions, "test", 0.62)
        self.assertEqual(len(output["edges"]), 1)
        self.assertEqual(output["edges"][0]["from"], "vision::cnn_detector")
        self.assertEqual(output["edges"][0]["to"], "deep_learning::convolution")
        self.assertEqual(
            output["meta"]["ordering_rule"],
            "semantic_only_no_cross_book_temporal_order",
        )

    def test_rejects_endpoint_outside_candidate_pair(self) -> None:
        primary = Book("vision", "Vision", Path("vision.json"), "")
        other = Book("deep_learning", "Deep Learning", Path("deep.json"), "")
        candidates = generate_candidates(
            primary,
            [concept("transformer", "Transformer", 1)],
            [(other, [concept("transformer", "Transformer", 1)])],
            top_k=1,
        )
        candidate = candidates[0]
        decisions = {
            candidate["candidate_id"]: {
                "candidate_id": candidate["candidate_id"],
                "decision": "see_also",
                "from": "vision::transformer",
                "to": "deep_learning::invented",
                "strength": 1.0,
            }
        }
        output = compile_output(primary, [other], candidates, decisions, "test", 0.62)
        self.assertEqual(output["edges"], [])


if __name__ == "__main__":
    unittest.main()
