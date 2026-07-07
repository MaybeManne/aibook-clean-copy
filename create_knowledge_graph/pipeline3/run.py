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
 17. extract_edges      extract_edges.py             -> edges_prereq.jsonl, edges_overlay.jsonl
 18. validate_edges     validate_edges.py            -> edges_*.validated.jsonl
 19. image_reproduce    image_reproduce.py           (optional; updates images.jsonl with repro code)
 20. split_raw          split_raw_body.py            move raw_body into concepts.raw.jsonl / items.raw.jsonl; strip from main files

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


def build_stages(src: Path, book_stem: str, data_dir: Path) -> list[Stage]:
    d = data_dir
    chunks_dir = d / "chunks"
    pa_dir = d / "pass_a_verified"

    return [
        Stage("parse_structure",
              "parse_book_structure.py",
              ["--src", str(src),
               "--out-chapters", str(d / "chapters.jsonl"),
               "--out-sections", str(d / "sections.jsonl")]),

        Stage("download_images",
              "download_images.py",
              ["--src", str(src),
               "--out-dir", str(d / "images"),
               "--out-manifest", str(d / "images.jsonl"),
               "--workers", "16"]),

        Stage("alt_text",
              "image_alt_text.py",
              ["--images-manifest", str(d / "images.jsonl"),
               "--src", str(src),
               "--workers", "16"],
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
               "--workers", "16"],
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
               "--map-out", str(d / "concept_merge_map.json")],
              llm=True),

        Stage("format_concepts",
              "format_concepts.py",
              ["--spliced", str(d / "concepts.deduped.jsonl"),
               "--out",     str(d / "concepts.jsonl"),
               "--workers", "32"],
              llm=True),

        Stage("format_items",
              "format_items.py",
              ["--spliced", str(d / "items.spliced.jsonl"),
               "--out",     str(d / "items.jsonl"),
               "--workers", "32"],
              llm=True),

        Stage("repair_items",
              "repair_items.py",
              ["--failures", str(d / "items.failures.jsonl"),
               "--items",    str(d / "items.jsonl"),
               "--workers", "6"],
              optional=True, llm=True),

        Stage("link_items",
              "link_items_to_concepts.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--items",    str(d / "items.jsonl"),
               "--merge-map", str(d / "concept_merge_map.json"),
               "--workers", "32"],
              llm=True),

        Stage("extract_edges",
              "extract_edges.py",
              ["--concepts",    str(d / "concepts.jsonl"),
               "--out-prereq",  str(d / "edges_prereq.jsonl"),
               "--out-overlay", str(d / "edges_overlay.jsonl"),
               "--merge-map",   str(d / "concept_merge_map.json"),
               "--workers", "16"],
              llm=True),

        Stage("validate_edges",
              "validate_edges.py",
              ["--concepts", str(d / "concepts.jsonl"),
               "--prereq",   str(d / "edges_prereq.jsonl"),
               "--overlay",  str(d / "edges_overlay.jsonl"),
               "--out-dir",  str(d)]),

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
    args = ap.parse_args()

    data_dir = (ROOT / args.data_dir).resolve()
    src = args.src if args.src is not None else data_dir / "book_raw.md"

    stages = build_stages(src, args.stem, data_dir)
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
        state["completed"] = [c for c in state["completed"] if stage_names.index(c) < idx]
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
