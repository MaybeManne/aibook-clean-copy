#!/usr/bin/env python3
"""
Pipeline3 orchestrator.

Stages (in order):
  1. parse_structure    parse_book_structure.py      raw.md -> chapters/sections
  2. download_images    download_images.py           raw.md -> images.jsonl (+ image files)
  3. alt_text           image_alt_text.py            fills alt_text_md into images.jsonl
  4. enrich             enrich_markdown.py           raw.md + images.jsonl -> enriched.md
  5. number             number_lines.py              enriched.md -> numbered.md
  6. chunk              chunker.py                   numbered.md -> chunks/*.md
  7. audit_chunks       audit_chunks.py              (optional; writes an audit report)
  8. pass_a             extract_structure.py         chunks -> pass_a_{concepts,items}.jsonl
  9. verify_pass_a      verify_structure.py          -> pass_a_verified/
 10. salvage            salvage.py                   -> pass_a_verified/
 11. splice             splice.py                    -> concepts.spliced.jsonl, items.spliced.jsonl
 12. dedup              dedup_concepts.py            -> concepts.deduped.jsonl (+ merge_map)
 13. format_concepts    format_concepts.py           -> concepts.jsonl
 14. format_items       format_items.py              -> items.jsonl
 15. repair_items       repair_items.py              (only if items.failures.jsonl non-empty)
 16. link_items         link_items_to_concepts.py    rewrites concepts.jsonl + items.jsonl
 17. extract_edges          extract_edges.py          -> base semantic edges
 18. audit_local_edges      audit_local_edges.py      -> explicit local-pair decisions + supplemental edges
 19. merge_edge_sets        merge_edge_sets.py        -> non-destructive combined edges
 20. validate_augmented     validate_edges.py         -> structurally validated combined edges
 21. verify_edges_semantic  verify_edges_semantic.py  -> independently reviewed edges
 22. validate_verified      validate_edges.py         -> final edge artifacts
 23. image_reproduce        image_reproduce.py        (optional; updates images.jsonl with repro code)
 24. split_raw              split_raw_body.py         move raw bodies to sidecar files
 25. merge_graph            merge_graph.py            -> graph.json
 26. fill_slots             fill_slots.py             -> concepts.slotted.jsonl

State is tracked in <data-dir>/pipeline.state.json. Run:
    python run.py                  # run from the next unfinished stage (default data-dir: data3)
    python run.py --force N        # rerun from stage N onward
    python run.py --only N         # run only stage N
    python run.py --list           # list stages and current status
    python run.py --data-dir data3_v4  # use an alternate data dir

Reusing image stages (skip expensive vision calls on a re-run):
    If you're running into a fresh data-dir (e.g. data3_v4) but want to reuse
    the images already downloaded + alt-texted in an existing data-dir, copy:
        cp -r data3/images          data3_v4/
        cp    data3/images.jsonl    data3_v4/
        cp    data3/book_raw.md     data3_v4/
    Then pre-mark the image stages as completed so the orchestrator skips them:
        jq '.completed += ["parse_structure","download_images","alt_text"]' \
           data3/pipeline.state.json > data3_v4/pipeline.state.json
    (Or hand-edit: create data3_v4/pipeline.state.json with completed list.)
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

PIPE_DIR = Path(__file__).parent
ROOT = PIPE_DIR.parent


@dataclass
class Stage:
    name: str
    script: str
    argv: list[str]
    optional: bool = False
    llm: bool = False


def state_file_for(data_dir: Path) -> Path:
    return data_dir / "pipeline.state.json"


def load_state(data_dir: Path) -> dict:
    sf = state_file_for(data_dir)
    if sf.exists():
        return json.loads(sf.read_text())
    return {"completed": [], "timings": {}}


def save_state(state: dict, data_dir: Path) -> None:
    sf = state_file_for(data_dir)
    sf.parent.mkdir(parents=True, exist_ok=True)
    sf.write_text(json.dumps(state, indent=2) + "\n")


def _load_profile(data_dir: Path) -> dict:
    """Load book_profile.json if present; return {} for legacy MD-only runs."""
    p = data_dir / "book_profile.json"
    return json.loads(p.read_text()) if p.exists() else {}


def build_stages(
    src: Path,
    book_stem: str,
    data_dir: Path,
    edge_model: str = "gemini-flash-latest",
    audit_model: str = "gemini-flash-latest",
    verify_model: str = "gpt-4.1-mini",
    verification_threshold: float = 0.7,
    graph_out: Path | None = None,
) -> list[Stage]:
    d = data_dir
    graph_path = graph_out or d / "graph.json"
    chunks_dir = d / "chunks"
    pa_dir = d / "pass_a_verified"
    profile = _load_profile(data_dir)
    fmt = profile.get("format", "md")   # "qmd" | "md" | "pdf"
    book_dir = profile.get("book_dir")  # only set for QMD

    # ── Stage 1: parse structure ──────────────────────────────────────────────
    # QMD: ingest.py already wrote chapters/sections; mark as pre-done by
    #      checking profile.structure_in_ingest. We still include the stage
    #      so --list shows it; the orchestrator skips it when already completed.
    if fmt == "qmd" and profile.get("structure_in_ingest"):
        parse_structure = Stage(
            "parse_structure",
            "ingest.py",   # placeholder — won't actually run; marked complete by ingest
            ["--format", "qmd", "--book-dir", book_dir or ".",
             "--out-dir", str(d), "--list"],
        )
    else:
        parse_structure = Stage(
            "parse_structure",
            "parse_book_structure.py",
            ["--src", str(src),
             "--out-chapters", str(d / "chapters.jsonl"),
             "--out-sections", str(d / "sections.jsonl")],
        )

    # ── Stage 2: images ───────────────────────────────────────────────────────
    if fmt == "qmd":
        download_images = Stage(
            "download_images",
            "copy_images_local.py",
            ["--src", str(src),
             "--book-dir", book_dir or ".",
             "--out-dir", str(d / "images"),
             "--out-manifest", str(d / "images.jsonl")],
        )
    else:
        download_images = Stage(
            "download_images",
            "download_images.py",
            ["--src", str(src),
             "--out-dir", str(d / "images"),
             "--out-manifest", str(d / "images.jsonl"),
             "--workers", "16"],
        )

    return [
        parse_structure,
        download_images,

        Stage("alt_text",
              "image_alt_text.py",
              ["--images-manifest", str(d / "images.jsonl"),
               "--src", str(src),
               "--workers", "8"],
              llm=True),

        Stage("enrich",
              "enrich_markdown.py",
              ["--src", str(src),
               "--manifest", str(d / "images.jsonl"),
               "--out", str(d / f"{book_stem}.enriched.md")]),

        Stage("number",
              "number_lines.py",
              [str(d / f"{book_stem}.enriched.md"),
               str(d / f"{book_stem}.numbered.md")]),

        Stage("chunk",
              "chunker.py",
              [str(d / f"{book_stem}.numbered.md"),
               "--out-dir", str(chunks_dir),
               "--stem", book_stem,
               "--sections", str(d / "sections.jsonl")]),

        Stage("audit_chunks",
              "audit_chunks.py",
              ["--manifest", str(chunks_dir / f"{book_stem}.manifest.jsonl"),
               "--chunks-dir", str(chunks_dir),
               "--out-report", str(chunks_dir / "audit_report.json")],
              optional=True, llm=True),

        Stage("pass_a",
              "extract_structure.py",
              ["--numbered", str(d / f"{book_stem}.numbered.md"),
               "--manifest", str(chunks_dir / f"{book_stem}.manifest.jsonl"),
               "--chunks-dir", str(chunks_dir),
               "--out-concepts", str(d / "pass_a_concepts.jsonl"),
               "--out-items",    str(d / "pass_a_items.jsonl"),
               "--profile",      str(d / "book_profile.json"),
               "--vocab",        str(d / "vocab.json"),
               "--workers", "8"],
              llm=True),

        Stage("verify_pass_a",
              "verify_structure.py",
              ["--numbered", str(d / f"{book_stem}.numbered.md"),
               "--manifest", str(chunks_dir / f"{book_stem}.manifest.jsonl"),
               "--concepts", str(d / "pass_a_concepts.jsonl"),
               "--items",    str(d / "pass_a_items.jsonl"),
               "--out-dir",  str(pa_dir)]),

        Stage("salvage",
              "salvage.py",
              ["--dir", str(pa_dir)]),

        Stage("splice",
              "splice.py",
              ["--numbered", str(d / f"{book_stem}.numbered.md"),
               "--sections", str(d / "sections.jsonl"),
               "--chapters", str(d / "chapters.jsonl"),
               "--concepts", str(pa_dir / "concepts.verified.jsonl"),
               "--items",    str(pa_dir / "items.verified.jsonl"),
               "--out-concepts", str(d / "concepts.spliced.jsonl"),
               "--out-items",    str(d / "items.spliced.jsonl"),
               "--images",       str(d / "images.jsonl")]),

        Stage("dedup",
              "dedup_concepts.py",
              ["--spliced", str(d / "concepts.spliced.jsonl"),
               "--out",     str(d / "concepts.deduped.jsonl"),
               "--map-out", str(d / "concept_merge_map.json"),
               "--model",   "gpt-4.1-mini"],
              llm=True),

        Stage("format_concepts",
              "format_concepts.py",
              ["--spliced", str(d / "concepts.deduped.jsonl"),
               "--out",     str(d / "concepts.jsonl"),
               "--workers", "16",
               "--model",   "gpt-4.1-mini"],
              llm=True),

        Stage("format_items",
              "format_items.py",
              ["--spliced", str(d / "items.spliced.jsonl"),
               "--out",     str(d / "items.jsonl"),
               "--workers", "16",
               "--model",   "gpt-4.1-mini"],
              llm=True),

        Stage("repair_items",
              "repair_items.py",
              ["--failures", str(d / "items.failures.jsonl"),
               "--items",    str(d / "items.jsonl"),
               "--workers", "6",
               "--model",   "gpt-4.1-mini"],
              optional=True, llm=True),

        Stage("link_items",
              "link_items_to_concepts.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--items",    str(d / "items.jsonl"),
               "--merge-map", str(d / "concept_merge_map.json"),
               "--workers", "16",
               "--model",   "gpt-4.1-mini"],
              llm=True),

        Stage("extract_edges",
              "extract_edges.py",
              ["--concepts",    str(d / "concepts.jsonl"),
               "--out-prereq",  str(d / "edges_prereq.jsonl"),
               "--out-overlay", str(d / "edges_overlay.jsonl"),
               "--merge-map",   str(d / "concept_merge_map.json"),
               "--numbered",    str(d / f"{book_stem}.numbered.md"),
               "--workers", "8",
               "--model", edge_model],
              llm=True),

        Stage("audit_local_edges",
              "audit_local_edges.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--prereq", str(d / "edges_prereq.jsonl"),
               "--overlay", str(d / "edges_overlay.jsonl"),
               "--numbered", str(d / f"{book_stem}.numbered.md"),
               "--out-prereq", str(d / "edges_prereq.local.jsonl"),
               "--out-overlay", str(d / "edges_overlay.local.jsonl"),
               "--out-decisions", str(d / "edge_local_decisions.jsonl"),
               "--workers", "8",
               "--batch-size", "8",
               "--max-gap", "2",
               "--model", audit_model],
              llm=True),

        Stage("merge_edge_sets",
              "merge_edge_sets.py",
              ["--base-prereq", str(d / "edges_prereq.jsonl"),
               "--base-overlay", str(d / "edges_overlay.jsonl"),
               "--supplemental-prereq", str(d / "edges_prereq.local.jsonl"),
               "--supplemental-overlay", str(d / "edges_overlay.local.jsonl"),
               "--out-prereq", str(d / "edges_prereq.combined.jsonl"),
               "--out-overlay", str(d / "edges_overlay.combined.jsonl"),
               "--report", str(d / "edge_merge_report.json")]),

        Stage("validate_augmented_edges",
              "validate_edges.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--prereq",   str(d / "edges_prereq.combined.jsonl"),
               "--overlay",  str(d / "edges_overlay.combined.jsonl"),
               "--out-dir",  str(d)]),

        Stage("verify_edges_semantic",
              "verify_edges_semantic.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--prereq", str(d / "edges_prereq.validated.jsonl"),
               "--overlay", str(d / "edges_overlay.validated.jsonl"),
               "--numbered", str(d / f"{book_stem}.numbered.md"),
               "--out-dir", str(d),
               "--workers", "6",
               "--batch-size", "6",
               "--threshold", str(verification_threshold),
               "--model", verify_model],
              llm=True),

        Stage("validate_verified_edges",
              "validate_edges.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--prereq", str(d / "edges_prereq.semantic.jsonl"),
               "--overlay", str(d / "edges_overlay.semantic.jsonl"),
               "--out-dir", str(d),
               "--output-tag", "final"]),

        Stage("image_reproduce",
              "image_reproduce.py",
              ["--alt",      str(d / "images.jsonl"),
               "--items",    str(d / "items.jsonl"),
               "--concepts", str(d / "concepts.jsonl"),
               "--out",      str(d / "images.repro.jsonl"),
               "--images-manifest", str(d / "images.jsonl"),
               "--workers", "16"],
              optional=True, llm=True),

        Stage("split_raw",
              "split_raw_body.py",
              ["--concepts",         str(d / "concepts.jsonl"),
               "--items",            str(d / "items.jsonl"),
               "--out-concepts-raw", str(d / "concepts.raw.jsonl"),
               "--out-items-raw",    str(d / "items.raw.jsonl")]),

        Stage("merge_graph",
              "merge_graph.py",
              ["--data-dir", str(d),
               "--prereq", str(d / "edges_prereq.final.jsonl"),
               "--overlay", str(d / "edges_overlay.final.jsonl"),
               "--out", str(graph_path)]),

        Stage("fill_slots",
              "fill_slots.py",
              ["--raw",      str(d / "concepts.raw.jsonl"),
               "--concepts", str(d / "concepts.jsonl"),
               "--out",      str(d / "concepts.slotted.jsonl"),
               "--graph",    str(graph_path),
               "--workers",  "8",
               "--model",    "gpt-4.1-mini"],
              llm=True),
    ]


def run_stage(stage: Stage) -> int:
    script_path = PIPE_DIR / stage.script
    cmd = [sys.executable, str(script_path)] + stage.argv
    print(f"\n>>> [{stage.name}] {' '.join(cmd)}", flush=True)
    t0 = time.time()
    rc = subprocess.call(cmd, cwd=str(ROOT))
    t1 = time.time()
    print(f"<<< [{stage.name}] rc={rc} in {t1 - t0:.1f}s", flush=True)
    return rc


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--data-dir", type=str, default="data3",
                    help="Output/state directory relative to repo root. "
                         "Default 'data3'. Use 'data3_v4' (or similar) to "
                         "run the pipeline into a fresh location without "
                         "overwriting existing outputs.")
    ap.add_argument("--src", type=Path, default=None,
                    help="Raw markdown source. Defaults to <data-dir>/book_raw.md.")
    ap.add_argument("--stem", type=str, default="book",
                    help="Output stem for intermediate files (enriched.md, numbered.md, etc.).")
    ap.add_argument("--list", action="store_true", help="List stages and current status.")
    ap.add_argument("--only", type=str, help="Run only this stage name.")
    ap.add_argument("--force", type=str, help="Rerun from this stage name onward.")
    ap.add_argument("--skip-optional", action="store_true",
                    help="Skip stages marked optional (audit_chunks, image_reproduce, repair_items).")
    ap.add_argument("--edge-model", default="gemini-flash-latest",
                    help="Model used for broad semantic edge extraction.")
    ap.add_argument("--audit-model", default="gemini-flash-latest",
                    help="Model used to classify missing local concept pairs.")
    ap.add_argument("--verify-model", default="gpt-4.1-mini",
                    help="Independent model used to verify proposed edges.")
    ap.add_argument("--edge-verification-threshold", type=float, default=0.7,
                    help="Minimum verifier confidence retained in the final graph.")
    ap.add_argument(
        "--graph-out",
        type=Path,
        default=None,
        help="Final graph JSON path. Defaults to <data-dir>/graph.json.",
    )
    args = ap.parse_args()

    data_dir = (ROOT / args.data_dir).resolve()
    src = args.src if args.src is not None else data_dir / "book_raw.md"
    graph_out = None
    if args.graph_out is not None:
        graph_out = (
            args.graph_out
            if args.graph_out.is_absolute()
            else (ROOT / args.graph_out).resolve()
        )

    stages = build_stages(
        src,
        args.stem,
        data_dir,
        edge_model=args.edge_model,
        audit_model=args.audit_model,
        verify_model=args.verify_model,
        verification_threshold=args.edge_verification_threshold,
        graph_out=graph_out,
    )
    stage_names = [s.name for s in stages]
    state = load_state(data_dir)

    if args.list:
        for s in stages:
            done = "✓" if s.name in state["completed"] else " "
            tags = []
            if s.llm: tags.append("LLM")
            if s.optional: tags.append("optional")
            tag_str = f"  [{', '.join(tags)}]" if tags else ""
            print(f"  [{done}] {s.name}{tag_str}")
        return

    if args.only:
        if args.only not in stage_names:
            raise SystemExit(f"unknown stage: {args.only}")
        todo = [next(s for s in stages if s.name == args.only)]
    elif args.force:
        if args.force not in stage_names:
            raise SystemExit(f"unknown stage: {args.force}")
        idx = stage_names.index(args.force)
        # Clear completion from this stage onward
        stage_index = {name: i for i, name in enumerate(stage_names)}
        state["completed"] = [
            completed for completed in state["completed"]
            if completed in stage_index and stage_index[completed] < idx
        ]
        save_state(state, data_dir)
        todo = stages[idx:]
    else:
        todo = [s for s in stages if s.name not in state["completed"]]

    for s in todo:
        if args.skip_optional and s.optional:
            print(f"-- skipping optional: {s.name}")
            continue
        rc = run_stage(s)
        if rc != 0:
            print(f"\nstage '{s.name}' failed (rc={rc}). state saved; "
                  f"fix and rerun to resume.", file=sys.stderr)
            save_state(state, data_dir)
            sys.exit(rc)
        if s.name not in state["completed"]:
            state["completed"].append(s.name)
        state.setdefault("timings", {})[s.name] = int(time.time())
        save_state(state, data_dir)

    print("\nall stages complete.")


if __name__ == "__main__":
    main()
