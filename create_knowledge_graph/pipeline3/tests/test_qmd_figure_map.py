from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_DIR))

from generate_qmd_figure_map import (  # noqa: E402
    canonical,
    concept_mapping,
    parse_qmd,
    stable_json,
)
from format_concepts import VALID_TOKEN_RE as CONCEPT_TOKEN_RE  # noqa: E402
from format_items import VALID_TOKEN_RE as ITEM_TOKEN_RE  # noqa: E402


class QmdParserTests(unittest.TestCase):
    def parse(self, source: str):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        path = Path(temp.name) / "chapter.qmd"
        path.write_text(source, encoding="utf-8")
        return parse_qmd(path, 1)

    def test_multiline_image_and_leading_slash(self) -> None:
        figures, _ = self.parse(
            "## Camera\n\n"
            "![A multiline\ncaption](/figures/camera.png){#fig-camera\nwidth=\"80%\"}\n"
        )
        image = next(figure for figure in figures if figure.kind == "image")
        self.assertEqual(image.label, "fig-camera")
        self.assertEqual(image.sources, ["/figures/camera.png"])
        self.assertEqual(image.start_line, 3)
        self.assertEqual(image.end_line, 5)

    def test_group_and_specific_child_panels_are_preserved(self) -> None:
        figures, _ = self.parse(
            ":::{layout-ncol=\"2\" #fig-shading}\n"
            "![Diffuse](diffuse.png){#fig-shading-a}\n\n"
            "![Phong](phong.png){#fig-shading-b}\n"
            ":::\n"
        )
        labels = {figure.label: figure for figure in figures}
        self.assertEqual(labels["fig-shading"].kind, "group")
        self.assertEqual(labels["fig-shading"].sources, ["diffuse.png", "phong.png"])
        self.assertEqual(labels["fig-shading-b"].parent_label, "fig-shading")

    def test_duplicate_labels_get_distinct_occurrences(self) -> None:
        figures, _ = self.parse(
            "![First](one.png){#fig-repeat}\n\n"
            "![Second](two.png){#fig-repeat}\n"
        )
        repeats = [figure for figure in figures if figure.label == "fig-repeat"]
        self.assertEqual(len(repeats), 2)
        self.assertEqual(len({figure.occurrence_id for figure in repeats}), 2)

    def test_raw_html_and_non_image_figure(self) -> None:
        figures, _ = self.parse(
            "<img src=\"raw.png\" id=\"fig-raw\">\n\n"
            "$$x = y$$ {#fig-equation}\n"
        )
        self.assertTrue(any(figure.kind == "html_image" for figure in figures))
        self.assertTrue(any(
            figure.kind == "non_image" and figure.label == "fig-equation"
            for figure in figures
        ))

    def test_malformed_unlabeled_image_does_not_invent_label(self) -> None:
        figures, _ = self.parse("![Image](image.png){# broken\n")
        image = next(figure for figure in figures if figure.kind == "image")
        self.assertIsNone(image.label)


class MappingTests(unittest.TestCase):
    def parse(self, source: str):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        path = Path(temp.name) / "chapter.qmd"
        path.write_text(source, encoding="utf-8")
        return parse_qmd(path, 1)

    def test_adjacent_reference_selects_matching_child_panel(self) -> None:
        figures, paragraphs = self.parse(
            "## Shading\n\n"
            "The Phong model adds a specular reflection component.\n\n"
            "@fig-shading compares diffuse and Phong rendering.\n\n"
            ":::{#fig-shading}\n"
            "![Diffuse](diffuse.png){#fig-shading-a}\n"
            "![Phong](phong.png){#fig-shading-b}\n"
            ":::\n"
        )
        concept = {
            "id": "phong",
            "title": "Phong reflection model",
            "position": {"chapter": 1, "first_line": 1},
            "source": {"spans": [{"start": "L00001", "end": "L00001"}]},
        }
        mapping = concept_mapping(
            concept, "chapter.qmd", figures, paragraphs,
            {1: "The Phong model adds a specular reflection component."},
        )
        self.assertEqual(mapping["status"], "mapped")
        self.assertEqual(mapping["figures"][0]["label"], "fig-shading-b")
        self.assertEqual(
            mapping["figures"][0]["evidence"]["kind"],
            "bounded_adjacent_explicit_reference",
        )

    def test_duplicate_reference_abstains_without_alignment(self) -> None:
        figures, paragraphs = self.parse(
            "![One](one.png){#fig-repeat}\n\n"
            "![Two](two.png){#fig-repeat}\n"
        )
        concept = {
            "id": "ambiguous",
            "title": "Absent source",
            "summary_md": "See @fig-repeat.",
            "position": {"chapter": 1},
            "source": {"spans": []},
        }
        mapping = concept_mapping(concept, "chapter.qmd", figures, paragraphs, {})
        self.assertEqual(mapping["status"], "unaligned")
        self.assertEqual(mapping["figures"], [])

    def test_mapping_never_resolves_cross_chapter_figure(self) -> None:
        figures, paragraphs = self.parse("No figure in this chapter.\n")
        concept = {
            "id": "cross",
            "title": "Cross chapter",
            "summary_md": "See @fig-other.",
            "position": {"chapter": 1},
            "source": {"spans": []},
        }
        mapping = concept_mapping(concept, "chapter.qmd", figures, paragraphs, {})
        self.assertEqual(mapping["figures"], [])

    def test_stable_serialization_is_byte_identical(self) -> None:
        payload = {"z": [2, 1], "a": {"é": True}}
        self.assertEqual(stable_json(payload).encode(), stable_json(payload).encode())
        self.assertEqual(json.loads(stable_json(payload)), payload)


class FigureTokenContractTests(unittest.TestCase):
    def test_hash_and_qmd_ids_are_valid(self) -> None:
        valid = [
            "[FIGURE:0123456789abcdef]",
            "[FIGURE:fig-pinholeGeometry | Camera geometry]",
            "[FIGURE:fig_rendering-b]",
            "[FIGURE:tbl-results.2]",
        ]
        for token in valid:
            self.assertIsNotNone(CONCEPT_TOKEN_RE.fullmatch(token), token)
            self.assertIsNotNone(ITEM_TOKEN_RE.fullmatch(token), token)

    def test_arbitrary_ids_remain_invalid(self) -> None:
        for token in ("[FIGURE:camera]", "[FIGURE:../../secret]", "[FIGURE:FIG-X]"):
            self.assertIsNone(CONCEPT_TOKEN_RE.fullmatch(token), token)
            self.assertIsNone(ITEM_TOKEN_RE.fullmatch(token), token)

    def test_canonical_normalizes_qmd_variants(self) -> None:
        self.assertEqual(canonical("fig_pinhole:Geometry"), "fig-pinhole-geometry")


if __name__ == "__main__":
    unittest.main()
