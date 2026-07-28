#!/usr/bin/env python3
"""Build deterministic, occurrence-level QMD figure and concept mappings.

The output intentionally preserves duplicate labels as separate occurrences.
Concepts are linked only by source evidence: an overlapping inline image,
an explicit @fig-* reference, or a uniquely bounded adjacent figure.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from pathlib import Path
from typing import Iterable


FIG_REF_RE = re.compile(r"@((?:fig|tbl)[-_:][A-Za-z0-9_.:-]+)")
FIG_TOKEN_RE = re.compile(r"\[FIGURE:([^|\]]+)(?:\s*\|[^\]]*)?\]")
ATTR_ID_RE = re.compile(r"#((?:fig|tbl)[-_:][\w.:-]+)", re.I)
MD_IMAGE_RE = re.compile(
    r"!\[(?P<alt>[\s\S]{0,1000}?)\]\(\s*(?P<src><[^>]+>|[^)\s]+)"
    r"(?:\s+[\"'][^\"']*[\"'])?\s*\)\s*(?P<attrs>\{[^}]*\})?",
    re.M,
)
HTML_IMAGE_RE = re.compile(r"<img\b(?P<attrs>[\s\S]*?)>", re.I)
HTML_SRC_RE = re.compile(r"\bsrc\s*=\s*([\"'])(.*?)\1", re.I | re.S)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
NUMBERED_RE = re.compile(r"^L(\d{5}):\s?(.*)$")


def canonical(value: str | None) -> str:
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", (value or "").lower()))


def normalized_text(value: str) -> str:
    value = re.sub(r"```[\s\S]*?```", " ", value)
    value = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", value)
    value = re.sub(r"\[FIGURE:[^\]]+\]", " ", value)
    value = re.sub(r"\{[^}]*\}", " ", value)
    value = re.sub(r"[@#$*_`\\|<>\[\]()]", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip().lower()


def offset_line(starts: list[int], offset: int) -> int:
    import bisect
    return bisect.bisect_right(starts, offset)


def line_starts(text: str) -> list[int]:
    starts = [0]
    starts.extend(match.end() for match in re.finditer("\n", text))
    return starts


def extract_chapter_files(quarto: Path) -> list[str]:
    """Return the 55 pedagogical chapters in canonical book order."""
    entries = re.findall(r"^\s*-\s+([A-Za-z0-9_.-]+\.qmd)\s*$", quarto.read_text(), re.M)
    try:
        first = entries.index("simplesystem.qmd")
        last = entries.index("simplesystem_final.qmd", first)
    except ValueError as exc:
        raise ValueError("Could not locate canonical chapter boundaries in _quarto.yml") from exc
    # index.qmd is the authored "Challenge of Vision" chapter. Copyright,
    # notation, taxonomy, references, and series are book matter, not chapters.
    chapters = ["index.qmd", *entries[first:last + 1]]
    if len(chapters) != 55:
        raise ValueError(f"Expected 55 chapter QMD files, found {len(chapters)}")
    return chapters


@dataclass
class Container:
    label: str
    start_line: int
    end_line: int
    kind: str = "group"


@dataclass
class Figure:
    occurrence_id: str
    chapter: int
    qmd: str
    label: str | None
    kind: str
    start_line: int
    end_line: int
    sources: list[str] = field(default_factory=list)
    caption: str = ""
    alt: str = ""
    parent_label: str | None = None

    def as_dict(self) -> dict:
        return {
            "occurrence_id": self.occurrence_id,
            "chapter": self.chapter,
            "qmd": self.qmd,
            "label": self.label,
            "canonical_label": canonical(self.label),
            "kind": self.kind,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "sources": self.sources,
            "caption": self.caption,
            "alt": self.alt,
            "parent_label": self.parent_label,
        }


def _caption_after(lines: list[str], end_line: int, limit: int = 5) -> str:
    caption: list[str] = []
    for raw in lines[end_line:min(len(lines), end_line + limit)]:
        stripped = raw.strip()
        if not stripped:
            if caption:
                break
            continue
        if stripped.startswith(("#", ":::", "```", "![", "<img", "$$")):
            break
        if re.fullmatch(r"\{[^}]*\}", stripped):
            continue
        caption.append(stripped)
    return " ".join(caption)


def _containers(lines: list[str]) -> list[Container]:
    containers: list[Container] = []
    stack: list[tuple[int, str, int]] = []
    for line_no, raw in enumerate(lines, 1):
        start = re.match(r"^\s*(:{3,})\s*\{([^}]*)\}", raw)
        if start:
            label_match = ATTR_ID_RE.search(start.group(2))
            stack.append((len(start.group(1)), label_match.group(1) if label_match else "", line_no))
            continue
        close = re.match(r"^\s*(:{3,})\s*$", raw)
        if close and stack:
            _, label, begin = stack.pop()
            if label:
                containers.append(Container(label, begin, line_no))
    for _, label, begin in stack:
        if label:
            containers.append(Container(label, begin, len(lines)))
    return containers


def parse_qmd(path: Path, chapter: int) -> tuple[list[Figure], list[dict]]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    starts = line_starts(text)
    containers = _containers(lines)
    figures: list[Figure] = []
    claimed_container_labels: set[tuple[str, int]] = set()

    def enclosing(line: int) -> Container | None:
        matches = [c for c in containers if c.start_line <= line <= c.end_line]
        return min(matches, key=lambda c: c.end_line - c.start_line) if matches else None

    image_matches: list[tuple[int, int, str, str, str | None, str]] = []
    for match in MD_IMAGE_RE.finditer(text):
        start = offset_line(starts, match.start())
        end = offset_line(starts, match.end())
        attrs = match.group("attrs") or ""
        own = ATTR_ID_RE.search(attrs)
        image_matches.append((
            start, end, match.group("src").strip("<>"), match.group("alt").strip(),
            own.group(1) if own else None, "image",
        ))
    for match in HTML_IMAGE_RE.finditer(text):
        src = HTML_SRC_RE.search(match.group("attrs"))
        if not src:
            continue
        own = ATTR_ID_RE.search(match.group("attrs"))
        line = offset_line(starts, match.start())
        image_matches.append((line, offset_line(starts, match.end()), src.group(2), "",
                              own.group(1) if own else None, "html_image"))
    image_matches.sort(key=lambda value: (value[0], value[1], value[2]))

    for ordinal, (start, end, src, alt, own_label, kind) in enumerate(image_matches, 1):
        parent = enclosing(start)
        label = own_label or (parent.label if parent else None)
        if parent and label == parent.label:
            claimed_container_labels.add((canonical(parent.label), parent.start_line))
        caption = alt or _caption_after(lines, end)
        occurrence_id = f"{path.name}:{start}:{ordinal}"
        figures.append(Figure(
            occurrence_id, chapter, path.name, label, kind, start, end,
            [src], caption, alt, parent.label if parent and own_label else None,
        ))

    # Preserve labeled groups separately when they contain several child panels.
    for container in containers:
        children = [f for f in figures if container.start_line <= f.start_line <= container.end_line]
        if len(children) > 1:
            caption = _caption_after(lines, container.end_line)
            figures.append(Figure(
                f"{path.name}:{container.start_line}:group", chapter, path.name,
                container.label, "group", container.start_line, container.end_line,
                [source for child in children for source in child.sources],
                caption, "", None,
            ))

    # Non-image figures: executable/code cells, equations, diagrams, and tables.
    for line_no, raw in enumerate(lines, 1):
        label_match = ATTR_ID_RE.search(raw)
        if not label_match:
            label_match = re.search(r"^\s*#\|\s*label:\s*((?:fig|tbl)[-_:][\w.:-]+)", raw, re.I)
        if not label_match:
            continue
        label = label_match.group(1)
        if any(canonical(f.label) == canonical(label) and f.start_line <= line_no <= f.end_line
               for f in figures):
            continue
        if (canonical(label), line_no) in claimed_container_labels:
            continue
        kind = "table" if canonical(label).startswith("tbl-") else "non_image"
        figures.append(Figure(
            f"{path.name}:{line_no}:non-image", chapter, path.name, label, kind,
            line_no, line_no, [], _caption_after(lines, line_no), "", None,
        ))

    # Paragraphs carry heading provenance for constrained concept alignment.
    paragraphs: list[dict] = []
    heading = ""
    buffer: list[str] = []
    begin = 1
    in_code = False

    def flush(end: int) -> None:
        nonlocal buffer, begin
        raw = "\n".join(buffer).strip()
        norm = normalized_text(raw)
        if norm:
            paragraphs.append({
                "start_line": begin, "end_line": end, "heading": heading,
                "text": raw, "normalized": norm,
            })
        buffer = []

    for line_no, raw in enumerate(lines, 1):
        if raw.strip().startswith("```"):
            in_code = not in_code
        match = HEADING_RE.match(raw)
        if match and not in_code:
            flush(line_no - 1)
            heading = re.sub(r"\s*\{[^}]*\}\s*$", "", match.group(2)).strip()
            begin = line_no + 1
        elif not raw.strip() and not in_code:
            flush(line_no - 1)
            begin = line_no + 1
        else:
            if not buffer:
                begin = line_no
            buffer.append(raw)
    flush(len(lines))
    return sorted(figures, key=lambda f: (f.start_line, f.end_line, f.occurrence_id)), paragraphs


def read_numbered(path: Path) -> dict[int, str]:
    result: dict[int, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        match = NUMBERED_RE.match(raw)
        if match:
            result[int(match.group(1))] = match.group(2)
    return result


def span_bounds(concept: dict) -> tuple[int, int]:
    values: list[int] = []
    for span in concept.get("source", {}).get("spans", []):
        for key in ("start", "end"):
            match = re.search(r"(\d+)", str(span.get(key, "")))
            if match:
                values.append(int(match.group(1)))
    first = concept.get("position", {}).get("first_line")
    if first:
        values.append(int(first))
    return (min(values), max(values)) if values else (0, 0)


def align_concept(concept: dict, numbered: dict[int, str], paragraphs: list[dict]) -> dict | None:
    start, end = span_bounds(concept)
    source = normalized_text("\n".join(numbered.get(line, "") for line in range(start, end + 1)))
    if len(source) < 20:
        source = normalized_text(" ".join(str(concept.get(key, "")) for key in
                                          ("title", "one_liner", "summary_md", "recap_md")))
    if len(source) < 10:
        return None
    source_tokens = set(source.split())
    scored: list[tuple[float, dict]] = []
    for paragraph in paragraphs:
        candidate = paragraph["normalized"]
        overlap = len(source_tokens & set(candidate.split())) / max(1, len(source_tokens))
        if overlap < 0.18:
            continue
        ratio = SequenceMatcher(None, source[:1800], candidate[:1800]).ratio()
        score = 0.65 * overlap + 0.35 * ratio
        if score >= 0.42:
            scored.append((score, paragraph))
    if not scored:
        return None
    scored.sort(key=lambda pair: (-pair[0], pair[1]["start_line"]))
    best_score, best = scored[0]
    if len(scored) > 1 and abs(best_score - scored[1][0]) < 0.015:
        return None
    return {
        "qmd_start_line": best["start_line"],
        "qmd_end_line": best["end_line"],
        "qmd_heading": best["heading"],
        "score": round(best_score, 4),
        "method": "normalized_paragraph_anchor",
    }


def resolve_occurrence(
    reference: str,
    figures: list[Figure],
    align: dict | None,
    hint: str = "",
) -> Figure | None:
    candidates = [f for f in figures if canonical(f.label) == canonical(reference)]
    if not candidates:
        return None
    groups = [candidate for candidate in candidates if candidate.kind == "group"]
    if len(groups) == 1:
        children = [
            figure for figure in figures
            if canonical(figure.parent_label) == canonical(reference)
        ]
        hint_tokens = set(normalized_text(hint).split())
        child_scores = [
            (len(hint_tokens & set(normalized_text(f"{child.alt} {child.caption}").split())), child)
            for child in children
        ]
        child_scores.sort(key=lambda pair: (-pair[0], pair[1].start_line))
        if child_scores and child_scores[0][0] > 0 and (
            len(child_scores) == 1 or child_scores[0][0] > child_scores[1][0]
        ):
            return child_scores[0][1]
    if len(candidates) == 1:
        return candidates[0]
    if not align:
        return None
    center = (align["qmd_start_line"] + align["qmd_end_line"]) / 2
    ranked = sorted(candidates, key=lambda f: (abs(f.start_line - center), f.start_line))
    if len(ranked) > 1 and abs(ranked[0].start_line - center) == abs(ranked[1].start_line - center):
        return None
    return ranked[0]


def concept_mapping(
    concept: dict,
    qmd: str,
    figures: list[Figure],
    paragraphs: list[dict],
    numbered: dict[int, str],
) -> dict:
    start, end = span_bounds(concept)
    source_text = "\n".join(numbered.get(line, "") for line in range(start, end + 1))
    fields = [source_text]
    for key in ("summary_md", "motivation_md", "recap_md", "one_liner"):
        if concept.get(key):
            fields.append(str(concept[key]))
    for key in ("key_passage", "example", "question"):
        value = concept.get(key)
        if isinstance(value, dict) and value.get("text"):
            fields.append(str(value["text"]))
    evidence_text = "\n".join(fields)
    alignment = align_concept(concept, numbered, paragraphs)
    selected: list[tuple[Figure, dict]] = []
    seen: set[str] = set()

    def add(figure: Figure | None, evidence: dict) -> None:
        if not figure or figure.occurrence_id in seen:
            return
        if figure.kind == "group":
            if any(
                canonical(existing.parent_label) == canonical(figure.label)
                for existing, _ in selected
            ):
                return
        elif figure.parent_label:
            for existing, _ in list(selected):
                if existing.kind == "group" and canonical(existing.label) == canonical(figure.parent_label):
                    selected.remove((existing, _))
                    seen.discard(existing.occurrence_id)
        seen.add(figure.occurrence_id)
        selected.append((figure, evidence))

    # Highest precedence: inline source/token overlap.
    for token in FIG_TOKEN_RE.findall(source_text):
        add(resolve_occurrence(token.strip(), figures, alignment, concept.get("title", "")), {
            "kind": "source_span_figure_token", "book_lines": [start, end],
            "reference": token.strip(),
        })
    for match in MD_IMAGE_RE.finditer(evidence_text):
        source = match.group("src").strip("<>")
        matches = [f for f in figures if source in f.sources]
        if len(matches) == 1:
            add(matches[0], {"kind": "inline_image_overlap", "source": source})

    # Explicit figure references are authoritative, but duplicate labels must resolve.
    for reference in FIG_REF_RE.findall(evidence_text):
        add(resolve_occurrence(reference, figures, alignment, concept.get("title", "")), {
            "kind": "explicit_qmd_reference", "reference": reference,
            "book_lines": [start, end],
        })

    # A source paragraph may introduce the figure in the immediately following
    # paragraph. Keep this bounded to the same heading and require an explicit
    # reference there; proximity alone is not evidence.
    if not selected and alignment:
        adjacent_blocks = [
            paragraph for paragraph in paragraphs
            if paragraph["heading"] == alignment["qmd_heading"]
            and alignment["qmd_end_line"] < paragraph["start_line"] <= alignment["qmd_end_line"] + 5
        ]
        adjacent_refs = [
            reference
            for paragraph in adjacent_blocks
            for reference in FIG_REF_RE.findall(paragraph["text"])
        ]
        if len(set(map(canonical, adjacent_refs))) == 1:
            reference = adjacent_refs[0]
            add(resolve_occurrence(
                reference, figures, alignment, concept.get("title", "")
            ), {
                "kind": "bounded_adjacent_explicit_reference",
                "reference": reference,
                "qmd_lines": [
                    adjacent_blocks[0]["start_line"],
                    adjacent_blocks[0]["end_line"],
                ],
            })

    # Bounded adjacency: only the same aligned block or the immediately following block.
    if not selected and alignment:
        nearby = [
            f for f in figures
            if f.start_line <= alignment["qmd_end_line"] + 3
            and f.end_line >= alignment["qmd_start_line"] - 1
        ]
        leaf_nearby = [f for f in nearby if f.kind != "group"] or nearby
        if len(leaf_nearby) == 1:
            add(leaf_nearby[0], {
                "kind": "bounded_same_block_adjacency",
                "qmd_lines": [alignment["qmd_start_line"], alignment["qmd_end_line"]],
            })

    return {
        "qmd": qmd,
        "chapter": concept.get("position", {}).get("chapter"),
        "alignment": alignment,
        "figures": [
            {
                "occurrence_id": figure.occurrence_id,
                "label": figure.label,
                "kind": figure.kind,
                "sources": figure.sources,
                "caption": figure.caption,
                "evidence": evidence,
            }
            for figure, evidence in selected
        ],
        "status": "mapped" if selected else ("aligned_unmapped" if alignment else "unaligned"),
    }


def _source_path(project_root: Path, qmd_root: Path, source: str) -> Path | None:
    clean = source.split("?", 1)[0].lstrip("/")
    if re.match(r"^(?:https?:|data:)", source, re.I):
        return None
    candidates = [qmd_root / clean, project_root / clean, qmd_root.parent / clean]
    return next((path.resolve() for path in candidates if path.exists()), candidates[0].resolve())


def web_asset_name(source: str) -> str:
    clean = source.split("?", 1)[0].replace("\\", "/").lstrip("./")
    slug = re.sub(r"[^A-Za-z0-9_-]+", "_", clean).strip("_")
    return f"markdown_{slug}.webp"


def generate_assets(
    mappings: dict[str, dict],
    project_root: Path,
    qmd_root: Path,
    output_dir: Path,
) -> list[dict]:
    required = sorted({
        source
        for mapping in mappings.values()
        for figure in mapping["figures"]
        for source in figure["sources"]
    })
    report: list[dict] = []
    output_dir.mkdir(parents=True, exist_ok=True)
    try:
        from PIL import Image, ImageOps
    except ImportError:
        Image = ImageOps = None
    for source in required:
        src = _source_path(project_root, qmd_root, source)
        dest = output_dir / web_asset_name(source)
        record = {"source": source, "output": dest.name}
        if src is None:
            record["status"] = "external"
        elif not src.exists():
            record["status"] = "missing"
            record["resolved_path"] = str(src)
        elif Image is None:
            record["status"] = "pillow_unavailable"
        else:
            try:
                with Image.open(src) as image:
                    image = ImageOps.exif_transpose(image)
                    image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                    if image.mode not in ("RGB", "RGBA"):
                        image = image.convert("RGB")
                    image.save(dest, "WEBP", quality=86, method=5)
                record["status"] = "ok"
            except Exception as exc:  # malformed assets are reported, never hidden
                record["status"] = "error"
                record["error"] = f"{type(exc).__name__}: {exc}"
        report.append(record)
    return report


def build(
    project_root: Path,
    qmd_root: Path,
    graph_path: Path,
    numbered_path: Path,
    quarto_path: Path,
    write_assets: bool = True,
) -> dict:
    graph = json.loads(graph_path.read_text(encoding="utf-8"))
    chapter_files = extract_chapter_files(quarto_path)
    numbered = read_numbered(numbered_path)
    all_figures: list[Figure] = []
    figures_by_chapter: dict[int, list[Figure]] = {}
    paragraphs_by_chapter: dict[int, list[dict]] = {}
    for chapter, filename in enumerate(chapter_files, 1):
        figures, paragraphs = parse_qmd(qmd_root / filename, chapter)
        figures_by_chapter[chapter] = figures
        paragraphs_by_chapter[chapter] = paragraphs
        all_figures.extend(figures)

    mappings: dict[str, dict] = {}
    graph_chapters = graph.get("chapters", [])
    for concept in graph.get("concepts", []):
        chapter = int(concept.get("position", {}).get("chapter") or 0)
        if chapter == 0:
            first_line, _ = span_bounds(concept)
            chapter_record = next((
                record for record in graph_chapters
                if int(record.get("start_line") or 0) <= first_line
                <= int(record.get("end_line") or record.get("start_line") or 0)
            ), None)
            if chapter_record:
                chapter = int(chapter_record["chapter"])
            else:
                section_match = re.match(
                    r"(\d+)\.", str(concept.get("source", {}).get("section") or "")
                )
                if section_match and 1 <= int(section_match.group(1)) <= len(chapter_files):
                    chapter = int(section_match.group(1))
                else:
                    preceding = [
                        record for record in graph_chapters
                        if 0 <= first_line - int(record.get("end_line") or 0) <= 10
                    ]
                    if preceding:
                        chapter = int(preceding[-1]["chapter"])
        if not 1 <= chapter <= len(chapter_files):
            mappings[concept["id"]] = {
                "qmd": None, "chapter": chapter, "alignment": None,
                "figures": [], "status": "invalid_chapter",
            }
            continue
        mapping = concept_mapping(
            concept, chapter_files[chapter - 1], figures_by_chapter[chapter],
            paragraphs_by_chapter[chapter], numbered,
        )
        mapping["chapter"] = chapter
        mappings[concept["id"]] = mapping

    labels: dict[str, list[str]] = {}
    for figure in all_figures:
        if figure.label:
            labels.setdefault(canonical(figure.label), []).append(figure.occurrence_id)
    duplicates = {label: ids for label, ids in labels.items() if len(ids) > 1}
    assets = generate_assets(
        mappings, project_root, qmd_root, project_root / "web_figures"
    ) if write_assets else []
    payload = {
        "_meta": {
            "schema_version": 2,
            "chapter_count": len(chapter_files),
            "concept_count": len(mappings),
            "occurrence_count": len(all_figures),
            "mapped_concept_count": sum(m["status"] == "mapped" for m in mappings.values()),
            "chapter_files": chapter_files,
            "generator": "create_knowledge_graph/pipeline3/generate_qmd_figure_map.py",
        },
        "_occurrences": [figure.as_dict() for figure in all_figures],
        "_labels": labels,
        "_duplicate_labels": duplicates,
        "_concepts": mappings,
        "_assets": assets,
    }
    # Legacy label keys remain occurrence-safe: duplicates expose an occurrences list.
    by_occurrence = {figure.occurrence_id: figure for figure in all_figures}
    for label, ids in sorted(labels.items()):
        figures = [by_occurrence[occurrence_id] for occurrence_id in ids]
        payload[label] = {
            "qmd": figures[0].qmd if len(figures) == 1 else None,
            "sources": figures[0].sources if len(figures) == 1 else [],
            "caption": figures[0].caption if len(figures) == 1 else "",
            "occurrences": ids,
            "ambiguous": len(figures) > 1,
        }
    return payload


def stable_json(payload: dict) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def main() -> None:
    here = Path(__file__).resolve()
    default_root = here.parents[2]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", type=Path, default=default_root)
    parser.add_argument("--qmd-root", type=Path)
    parser.add_argument("--graph", type=Path)
    parser.add_argument("--numbered", type=Path)
    parser.add_argument("--quarto", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--no-assets", action="store_true")
    args = parser.parse_args()
    root = args.project_root.resolve()
    qmd_root = (args.qmd_root or root / "aibook-clean/content/visionbook-qmd").resolve()
    payload = build(
        root, qmd_root,
        (args.graph or root / "concept-graph-vision-data.json").resolve(),
        (args.numbered or root / "create_knowledge_graph/data_vision/book.numbered.md").resolve(),
        (args.quarto or qmd_root / "_quarto.yml").resolve(),
        not args.no_assets,
    )
    output = (args.output or root / "qmd-figure-index.json").resolve()
    output.write_text(stable_json(payload), encoding="utf-8")
    print(json.dumps(payload["_meta"], indent=2))
    missing = [item for item in payload["_assets"] if item["status"] in {"missing", "error"}]
    if missing:
        print(f"warning: {len(missing)} mapped assets are missing or malformed")


if __name__ == "__main__":
    main()
