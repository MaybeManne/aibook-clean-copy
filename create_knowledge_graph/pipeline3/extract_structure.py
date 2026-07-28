#!/usr/bin/env python3
"""
Pass A v2 — structure-only extraction.

For each chunk, ask Gemini to identify every concept AND every item, emitting
ONLY line-number references (no content). New in v2:

  - `exercise_group`: when the book has a directive like "Find the horizontal
    asymptote(s) for each function." followed by numbered sub-parts, the
    directive is its own exercise_group item, and each sub-part is a regular
    exercise with `parent_group_id` pointing back.
  - `embedded_in`: figures and tables that live inside an example/exercise/
    proof carry `embedded_in: <parent_id>`; standalone figures have null.

Output fields per concept:
  {id, kind, title, source.spans}

Output fields per item:
  {id, kind, title, source.spans,
   parent_group_id?   (for exercises inside a group),
   sub_item_ids?      (for exercise_group, the IDs of its numbered sub-parts),
   embedded_in?       (for figure/table inside another item)}

Usage:
    python extract_structure.py \
        --numbered data2/book_enriched.numbered.md \
        --manifest data2/chunks/manifest.jsonl \
        --chunks-dir data2/chunks \
        --out-concepts data2/pass_a_concepts.jsonl \
        --out-items    data2/pass_a_items.jsonl \
        [--workers 16] [--limit 0]
"""
from __future__ import annotations

import argparse
import json
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from llm import call_llm_json, GEMINI_DEFAULT, OPENAI_DEFAULT


# ── Book-profile-driven prompt builder ───────────────────────────────────────

_DOMAIN_FILLS: dict[str, dict] = {
    "computer vision": {
        "book_description": "computer vision textbook",
        "concept_definition_examples": '"Lambertian surface", "Lambertian view independence", "surface albedo", "BRDF", "Phong reflection model", "ambient reflection term", "Phong specular highlight", "pinhole camera model", "virtual image plane", "principal point offset", "perspective projection", "orthographic projection", "telephoto approximation", "world coordinate system", "image coordinate system", "camera coordinate system", "perceptron", "convolutional neural network"',
        "concept_theorem_examples": '"Nyquist sampling theorem", "backpropagation gradient rule", "linearity of reflection"',
        "concept_technique_examples": '"gradient descent", "backpropagation", "Gaussian blur", "Sobel edge detection", "similar triangles derivation", "straw camera ray filtering", "directional selection for imaging", "perspective projection equations"',
        "concept_idea_examples": '"why convolutions model translation invariance", "accidental camera obscura", "aperture blur-brightness tradeoff", "one direction per pixel", "depth-dependent size scaling", "constant scale with depth"',
        "slug_examples": '`lambertian_surface`, `lambertian_view_independence`, `perspective_projection`, `orthographic_projection`, `ex_imaging_brdf`, `thm_nyquist`, `pinhole_camera_model`',
    },
    "calculus": {
        "book_description": "calculus textbook",
        "concept_definition_examples": '"two-sided limit", "vertical asymptote", "derivative"',
        "concept_theorem_examples": '"Limit of a polynomial", "Squeeze theorem"',
        "concept_technique_examples": '"computing limits by factoring", "implicit differentiation"',
        "concept_idea_examples": '"intuition behind the epsilon-delta definition of a limit"',
        "slug_examples": '`two_sided_limit_informal`, `ex_1_1_3`, `thm_1_2_3_limit_of_polynomial`, `fig_1_1_8`',
    },
}

_GENERIC_FILLS = {
    "book_description": "textbook",
    "concept_definition_examples": '"key term", "fundamental concept", "named model"',
    "concept_theorem_examples": '"core result", "named theorem"',
    "concept_technique_examples": '"named algorithm", "computational method"',
    "concept_idea_examples": '"motivational discussion", "conceptual bridge between topics"',
    "slug_examples": '`concept_name`, `ex_ch1_sec2`, `thm_core_result`, `fig_diagram`',
}


def _domain_fills(profile: dict) -> dict:
    title = (profile.get("book_title") or "").lower()
    for key, fills in _DOMAIN_FILLS.items():
        if key in title:
            return fills
    return _GENERIC_FILLS


def build_system_prompt(profile: dict, vocab_terms: list[str] | None = None) -> str:
    """Fill template variables in the system prompt using simple string replace.
    This avoids conflicts with the many literal {braces} in JSON examples."""
    fills = _domain_fills(profile)
    result = _SYSTEM_PROMPT_TEMPLATE
    for key, val in fills.items():
        result = result.replace(f"{{{key}}}", val)
    if vocab_terms:
        # Inject top-500 terms (sorted longest first to surface multi-word phrases)
        top = vocab_terms[:500]
        vocab_block = "\n".join(f"  - {t}" for t in top)
        result += (
            f"\n\n## Canonical vocabulary (use these exact terms when they match)\n\n"
            f"The following terms are taken directly from the book (bold/italic text and "
            f"section headings). When a concept you extract matches one of these terms, "
            f"use the EXACT spelling from this list as the concept title.\n\n"
            f"{vocab_block}\n"
        )
    return result


_SYSTEM_PROMPT_TEMPLATE = """You extract structural metadata from a {book_description} chunk.

Input format: every line begins with a line-number marker `Lxxxxx: ` (five digits, zero-padded). Example:

    L00125: # Imaging
    L00126:
    L00127: Light sources, like the sun or artificial lights, flood our world with light rays...

Images embedded in the text look like `[FIGURE:<asset_id> | <short alt text>]` — a compact token where asset_id is a stable identifier into the images asset table and the short alt text describes the figure. Use the alt text as context for classification, but do not copy the token verbatim into any output.

## Your job

Identify every CONCEPT and every ITEM in the chunk.

## Concepts

Atomic teachable ideas. Four kinds:
- "definition": a named object, model, or notion (e.g. {concept_definition_examples}).
- "theorem": a named result stated as a theorem or formal result (e.g. {concept_theorem_examples}). Emit BOTH a concept (kind=theorem) AND an item (kind=theorem) for the same span, with different ids like `thm_nyquist_sampling` (concept) and `item_thm_nyquist` (item).
- "technique": a named computational or algorithmic procedure (e.g. {concept_technique_examples}).
- "idea": a motivational/conceptual discussion that is a distinct teachable unit (e.g. {concept_idea_examples}).

**Granularity rule (critical):** If a passage introduces or defines multiple named ideas, give EACH its own concept record with its own span — do not merge them into one.

- A passage that defines BRDF, then defines the Lambertian model, then defines albedo → three separate concepts, not one "reflection" concept.
- A passage that introduces perspective projection equations and then orthographic projection → two concepts, not one.
- A passage that defines Tikhonov regularization and then discusses ill-conditioned inverse problems → two concepts.
- A passage in section "Cues for Support" that explains how a **drop shadow** suggests separation and a **slack string** suggests contact → two concepts (`drop_shadow_support_cue`, `slack_string_support_cue`), not one umbrella "cues for support" concept.
- A passage in section "Horizontal or Vertical" that bolds both **vanishing points** and **horizon line** → two definition concepts plus optionally one idea concept about orientation perception — NEVER a single concept titled "Horizontal or Vertical".

**Bolded/italicized terms are first-class concept candidates.** When the prose uses `**term**` or `*term*` to introduce a named notion, emit a `definition` concept whose `title` is that exact term. The book uses bold to mark first-mention definitions — never miss a bolded term.

The title MUST be copied verbatim from the text — use the exact phrase as it appears in the chunk (bold, italic, or heading). Do not paraphrase, shorten, or invent names.

`title_line` is REQUIRED: the exact line marker (e.g. `L02806`) where the concept's name first appears in the chunk. This must be a real line marker from the input — copy it exactly.

If a vocabulary list is provided in the system prompt, PREFER those exact terms when they match the concept being extracted. Only use a term not in the vocabulary if the concept is genuinely new and unlisted.

## Section headings are NOT concepts (anti-stub rule)

A section heading like `## Introduction`, `## The Eye of the Artist`, `## The More You Look, the More You See`, `## Concluding Remarks`, `## Accidents Happen` is a navigational label, not a teachable concept. Do NOT emit a concept whose title is just the section heading.

The only exception: when a section is named after a single technical term that is ALSO defined in bold inside the section (e.g., `## Light Field Cameras` paired with `**light field cameras**` in the prose, or `## Vanishing Points` paired with `**vanishing points**` in the prose). In that case, emit ONE definition concept with the bolded term as the title — never a separate "section-title" idea concept.

For every section, ask: "What named/bolded terms or distinct teachable ideas live INSIDE this section?" Emit one concept per such term/idea. If a section has zero extractable named terms and only motivational/narrative prose (rhetorical questions, autobiographical anecdotes, exhortations to "go look at the world"), skip it entirely — produce zero concepts for that section.

### Worked examples (positive vs negative)

Section `## Introduction` containing only motivational prose ("The goal of this chapter is...") → **0 concepts**. Never emit `idea_introduction` or `idea_the_introduction`.

Section `## The Eye of the Artist` containing the prose "Learning to paint is a great way of learning to see..." with no bolded terms and no named technique → **0 concepts**. Never emit `idea_the_eye_of_the_artist`.

Section `## The More You Look, the More You See` containing the bolded term `**visual cognitive load**` and a discussion that "Vision is a dynamical system" → emit `visual_cognitive_load` (definition, the bolded term) AND optionally `vision_as_dynamical_system` (idea, for the dynamical-system framing). Do NOT emit a top-level `idea_the_more_you_look_the_more_you_see` umbrella concept.

Section `## Accidents Happen` containing the bolded term `**principle of continuity**` and a discussion of accidental image alignments → emit `principle_of_continuity` (definition) AND `accidental_coincidences` (idea). Do NOT emit `idea_accidents_happen`.

Section `## Cues for Support` describing both a drop-shadow cue and a slack-string cue → emit `drop_shadow_support_cue` (idea) AND `slack_string_support_cue` (idea). Do NOT emit `cues_for_support` as a single umbrella concept — it is a section title.

### Hard "never extract" list

Never emit a concept whose title is exactly (or near-exactly) one of these section-title phrasings: "Introduction", "Concluding Remarks", "Overview", "Summary", "Background", "Motivation", "Setup", "Preliminaries", "Notation", "Remarks", "Further Reading", "Exercises".

Do NOT create concepts for: purely worked numerical calculations with no named result, figure captions without a named concept, decorative section introductions that introduce no specific idea, or motivational/narrative sections whose prose contains no bolded term, no named technique, and no formally introduced idea.

### DO still extract teachable phenomena even when NOT bolded (idea concepts)

The anti-stub rule above is about **section-title-as-concept**, not about being conservative. Within each section that has substantive prose, look HARDER for `idea` concepts — distinct teachable phenomena, visual cues, or cause-and-effect explanations — even when the phrase is not bolded. Use a descriptive snake_case id that names the phenomenon (not the section title).

Examples of `idea` concepts you should NOT miss:
- A passage explaining that motion blur depends on object distance from camera → emit `depth_dependent_motion_blur` (idea) even though "motion blur" is the section title (also emit a `motion_blur` definition concept for the phenomenon itself, sharing the section span).
- A passage in §"Horizontal or Vertical" that explains how the relative position of vanishing points and horizon line tells you whether you're looking at a floor vs. a wall → emit `orientation_perception_from_vanishing_points` (idea) in addition to the bolded `vanishing_points` and `horizon_line` definitions.
- A passage in §"Cues for Support" that describes a drop shadow as evidence of separation → emit `drop_shadow_support_cue` (idea). A separate sentence in the same section describes a slack string as evidence of contact → emit `slack_string_support_cue` (idea). These are two distinct cues, so two concepts.
- A passage in §"Accidents Happen" that describes generic alignments and "accidental" image coincidences (Migrant Mother example) → emit `accidental_coincidences` (idea) alongside the bolded `principle_of_continuity` (definition).
- A passage in §"Looking at Raindrops" that calls raindrops "a naturally occurring light field camera" → emit `raindrops_as_natural_light_field` (idea) alongside the bolded `light_field_cameras` (definition).
- A passage in §"Plato's Cave" that uses the allegory to argue that an image is a lossy 2D projection of 3D scene and vision must infer the hidden → emit `image_as_lossy_projection` (idea) or `vision_infers_hidden_scene` (idea). Do NOT emit a `platos_cave` or `allegory_of_the_cave` concept — Plato's allegory is the *frame*, not the *concept*.
- A passage in §"How Do You Know Something Is Wet?" asking why wet sand looks dark and how material perception works → emit `material_perception_wetness` (idea).
- A passage in §"The More You Look, the More You See" describing vision as a dynamical system (vs an input-output function) → emit `vision_as_dynamical_system` (idea). A separate paragraph in the same section noting that one big image contains many small images that can be treated as a dataset → emit `image_as_dataset_of_patches` (idea).

Aim for 2-4 concepts per substantive narrative section (a mix of bolded `definition`s and unbolded `idea`s), unless the section is truly purely motivational. Sparse extraction (1 concept per section) is a smell that you are pattern-matching on headings instead of reading the prose.

### Avoid duplicates

Never emit two concepts with identical or near-identical titles (e.g., "Plato's Cave" as both an `idea` and a `definition`). Pick one kind per concept and one id per concept. If a single span genuinely deserves two records, the two records must have distinctly different titles that name different things.

## Items

Reusable content pieces. Kinds and their schemas:

### example, exercise, theorem
  { id, kind, title, source: { spans: [{start, end}, ...] } }

### exercise_group  (NEW)
When the book introduces a single directive followed by numbered sub-parts:

    ## Find the horizontal asymptote(s) for each function.
    29. $y = (x^2-1)/(x+2)$
    30. $y = (x^2+1)/(x-1)$
    31. ...

Emit:
  1. ONE exercise_group item covering the directive heading span + all its children. Give it:
      { id: "<stable slug, e.g. 'grp_1_3_horiz_asymptotes'>",
        kind: "exercise_group",
        title: "<short, e.g. 'Find horizontal asymptotes'>",
        source.spans: <directive start> to <last sub-part end>,
        sub_item_ids: [id_of_ex_29, id_of_ex_30, id_of_ex_31, ...] }
  2. Each numbered sub-part as its OWN exercise item with:
      { id, kind: "exercise", title: "Exercise 29", source.spans: <just the numbered line's span>,
        parent_group_id: "grp_1_3_horiz_asymptotes" }

This is how we preserve the directive — without it, exercise 29 reads "y = (x^2-1)/(x+2)" and is meaningless.

If exercises are numbered but WITHOUT a shared preceding directive (each has its own full question), treat each as an independent exercise (no group).

### figure, table
  { id, kind, title, source.spans, embedded_in: <parent item id> OR null }

Set `embedded_in` when the figure/table is pedagogically part of another item. Cases to recognize:

  A. The figure's span falls INSIDE the other item's span (strict containment).
     Example: an example that runs L00048-L00086 contains a figure at L00068-L00069 with caption "Figure 1.1.5". embedded_in=<the example's id>.

  B. The figure sits immediately AFTER the item (within ~15 lines) AND the
     figure's label or caption references the item by its number — or the
     item's text says "accompanying figure" / "see the figure".
     Example:
         L14684: "62. As shown in the accompanying figure on the next page, suppose..."
         ...exercise body through L14692...
         L14694: ![...](...) "< Figure Ex-62"
     The figure at L14694 has caption "Figure Ex-62" referencing exercise 62,
     so embedded_in=<exercise 62's id>.

  C. The figure appears just BEFORE an example/exercise/proof (within ~15
     lines) AND that item's prose mentions the figure's core subject. "Core
     subject" means a function name, equation, or keyword that appears in BOTH
     the figure's alt text and the item's prose. This is the common "figure
     is set up first, then Example N asks about it" pattern.
     Example:
         L00279: [FIGURE:4f18e6a54b824dfc | A graph showing y = |x|/x with a jump discontinuity at x=0]
         L00280: △ Figure 1.1.12
         ...
         L00363: Example 4 Explain why lim(x→0) |x|/x does not exist.
     The alt text contains "y = |x|/x" and Example 4's prompt contains
     "|x|/x" — shared keyword. Set fig_1_1_12.embedded_in = <example_4's id>.

  D. Prose "figure above" / "figure below" references. If the item's first
     sentence says "the figure above shows...", the figure is the one just
     before this item; if it says "see the figure below", the figure is the
     one just after. embedded_in=<that item's id>.

Set embedded_in=null only when the figure is truly a STANDALONE section-level figure — i.e., it has its own independent caption like "Figure 1.1.8" and no nearby item claims it. Section-opener figures, chapter-opener photos, decorative images all count as standalone.

Prefer embedded_in=<item_id> when in doubt: the downstream renderer handles both cases, and a mis-attached figure is less harmful than an orphaned one.

## Include figure lines INSIDE a concept's span when the concept refers to them

Concepts (definition / theorem / technique / idea) are prose passages. When a concept's prose references a figure — either verbally ("see Figure 1.1.5", "the graph at the right shows...", "as illustrated below") OR because a visible `[FIGURE:<asset_id> | ...]` token sits 1–3 lines before or after the concept's prose — the concept's `source.spans` MUST include the figure's line(s). Use a multi-range span if the figure line is not contiguous with the rest of the concept.

Why: downstream, the concept's raw_body is spliced verbatim from its spans. If the figure line is outside the span, the concept's text loses the `[FIGURE:...]` token and consumers (tutor UI, lesson generator) lose the figure.

Examples:
  1. Concept "Definition of limit" runs L00140–L00148. Figure token at L00143 is already inside the span → include it (it is).
  2. Concept "Horizontal asymptote" runs L00200–L00207. Book layout puts the illustrating figure at L00209. Prose at L00206 says "the graph in Figure 1.3.2 illustrates...". Emit concept with multi-range spans: [{L00200, L00207}, {L00209, L00210}].
  3. Concept "Continuity of trig functions" runs L03300–L03320. A section-opener figure sits at L03282, but this concept's prose never references it. Do NOT extend the span — the figure is truly standalone.

The same rule applies to example/exercise/theorem items when their prose references a figure and the figure line is not already inside their span.

Caveat (important): do NOT extend a concept/item span to a figure the text does not reference. "Nearby" alone is not enough — the prose must point at that specific figure (a phrase, a figure number, or a `[FIGURE:...]` token literally embedded in the paragraph).

## Multi-range spans

Each record's `source.spans` is an ARRAY of line ranges. Most records have exactly ONE range — emit a one-element array in that case.

Emit MULTIPLE ranges when a record genuinely covers disjoint parts of the book that belong together. The most common use case: an exercise whose figure appears a few lines later.

Example:
    L14684: 62. As shown in the accompanying figure on the next page, suppose that a boat enters the river...
    L14685-L14692: ...rest of exercise body...
    L14693:                       (blank)
    L14694: [FIGURE:abc123 | A 2D Cartesian coordinate system showing the boat's path...]
    L14695: < Figure Ex-62

Exercise 62 should be emitted with:
    { id: "ex_4_review_62",
      kind: "exercise",
      title: "Exercise 62",
      source: { spans: [
        { start: "L14684", end: "L14692" },
        { start: "L14694", end: "L14695" }
      ] } }

Rules for multi-range:
  A. Each range must be a contiguous block. Do not skip individual lines — use one range per contiguous segment.
  B. Ranges must not overlap each other within the same record.
  C. The combined range length should still be reasonable for a single record. If you find yourself using >3 ranges or skipping huge gaps, reconsider: the record is probably two separate things.
  D. For a figure that belongs to an exercise, you have two choices — BOTH acceptable:
       (i)  emit the figure as its own `figure` item with `embedded_in` set to the exercise's id (the figure gets its own record), or
       (ii) omit the figure as a separate item and include its lines in the exercise's `spans` (the exercise's `raw_body` will then contain the figure reference inline).
     Prefer (i) when the figure could stand on its own; prefer (ii) when the figure is purely decorative or short.
     For CONCEPTS whose prose references a figure, strongly prefer including the
     figure's lines in the concept's span (option (ii)) so the [FIGURE:...]
     token lands inside the concept's raw_body.
  E. Single-range is the default; only use multi-range when it materially improves the record's completeness.

## Output format

Two arrays: `concepts` and `items`. Each record has:
  - id (snake_case, unique within chapter, stable)
  - kind (from the sets above)
  - title (<=120 chars)
  - source.spans: array of {start, end} line-marker pairs (one or more)
  - plus optional fields per kind above

Rules:
  1. No body text, quotes, prose, or math in output. Only ids, kinds, titles, spans, and the optional parent/sub links.
  2. Line markers must be copied verbatim from the input. Do not invent.
  3. Use descriptive slugs: `{slug_examples}`.
  4. For sub-exercises inside a group, their `source.spans` should cover only their own line(s), not the directive.
  5. If a chunk contains no directive-style exercise groups, just emit flat exercise items as before.
  6. `source.spans` is always an array — use a single-element array for the typical case.
"""


_RANGE_SCHEMA = {
    "type": "object",
    "required": ["start", "end"],
    "properties": {
        "start": {"type": "string", "description": "Line marker Lxxxxx copied from input."},
        "end":   {"type": "string", "description": "Line marker Lxxxxx copied from input."},
    },
}

_SOURCE_SCHEMA = {
    "type": "object",
    "required": ["spans"],
    "properties": {
        "spans": {
            "type": "array",
            "minItems": 1,
            "maxItems": 4,
            "description": "One or more line ranges covered by this record. Single-range is typical; multi-range when out-of-sequence material belongs (e.g., an exercise plus a figure caption a few lines later).",
            "items": _RANGE_SCHEMA,
        },
    },
}


OUTPUT_SCHEMA = {
    "type": "object",
    "required": ["concepts", "items"],
    "properties": {
        "concepts": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "kind", "title", "title_line", "source"],
                "properties": {
                    "id":         {"type": "string"},
                    "kind":       {"type": "string", "enum": ["definition", "theorem", "technique", "idea"]},
                    "title":      {"type": "string", "description": "Exact term as it appears in the text."},
                    "title_line": {"type": "string", "description": "Line marker Lxxxxx where this concept's name first appears."},
                    "source": _SOURCE_SCHEMA,
                },
            },
        },
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "kind", "title", "source"],
                "properties": {
                    "id":    {"type": "string"},
                    "kind":  {"type": "string", "enum": ["example", "exercise", "exercise_group", "theorem", "figure", "table"]},
                    "title": {"type": "string"},
                    "parent_group_id": {"type": ["string", "null"]},
                    "sub_item_ids":    {"type": "array", "items": {"type": "string"}},
                    "embedded_in":     {"type": ["string", "null"]},
                    "source": _SOURCE_SCHEMA,
                },
            },
        },
    },
}


def build_user_message(chunk_text: str, chunk_meta: dict) -> str:
    headings = " > ".join(chunk_meta.get("headings", [])) or "(no heading)"
    span = chunk_meta["span"]
    overlap = chunk_meta.get("overlap")
    overlap_note = ""
    if overlap:
        overlap_note = (
            f"\nNote: the first lines {overlap['start']}-{overlap['end']} are "
            f"overlap duplicated from the previous chunk. Do NOT emit records "
            f"whose primary span lies entirely in that overlap range.\n"
        )
    return (
        f"Chunk id: {chunk_meta['chunk_id']}\n"
        f"Heading context: {headings}\n"
        f"Primary span: {span['start']}-{span['end']}"
        f"{overlap_note}\n"
        f"--- begin chunk ---\n{chunk_text}\n--- end chunk ---\n"
    )


def process_chunk(chunk_meta: dict, chunks_dir: Path, model: str,
                  system_prompt: str) -> dict:
    chunk_path = chunks_dir / f"{chunk_meta['chunk_id']}.md"
    chunk_text = chunk_path.read_text(encoding="utf-8")
    user_msg = build_user_message(chunk_text, chunk_meta)
    result = call_llm_json(system_prompt, user_msg, OUTPUT_SCHEMA, model=model,
                           max_output_tokens=32768)
    # Ensure title_line is present on every concept (older models may omit it)
    for c in result.get("concepts", []):
        c.setdefault("title_line", "")
    return result


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--numbered",     type=Path, required=True)
    ap.add_argument("--manifest",     type=Path, required=True)
    ap.add_argument("--chunks-dir",   type=Path, default=None)
    ap.add_argument("--out-concepts", type=Path, required=True)
    ap.add_argument("--out-items",    type=Path, required=True)
    ap.add_argument("--profile",      type=Path, default=None,
                    help="book_profile.json from ingest.py — sets domain-appropriate prompt")
    ap.add_argument("--vocab",        type=Path, default=None,
                    help="vocab.json from build_vocab.py — grounds concept names in book terminology")
    ap.add_argument("--model",   default=OPENAI_DEFAULT)
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--limit",   type=int, default=0)
    ap.add_argument("--start",   type=int, default=0)
    args = ap.parse_args()

    # Load profile and vocab, build system prompt
    profile: dict = {}
    if args.profile and args.profile.exists():
        profile = json.loads(args.profile.read_text())
    vocab_terms: list[str] | None = None
    if args.vocab and args.vocab.exists():
        vocab_data  = json.loads(args.vocab.read_text())
        vocab_terms = vocab_data.get("terms", [])
        print(f"vocab: {len(vocab_terms)} terms loaded", file=sys.stderr)
    system_prompt = build_system_prompt(profile, vocab_terms)
    book_desc = _domain_fills(profile)["book_description"]
    print(f"book: {book_desc}  model: {args.model}", file=sys.stderr)

    chunks_dir = args.chunks_dir or args.manifest.parent
    with args.manifest.open() as f:
        manifest = [json.loads(line) for line in f]
    if args.start:
        manifest = manifest[args.start:]
    if args.limit:
        manifest = manifest[:args.limit]

    args.out_concepts.parent.mkdir(parents=True, exist_ok=True)
    write_lock = threading.Lock()
    n_done = n_concepts = n_items = n_failed = 0
    n_total = len(manifest)

    def worker(meta: dict):
        try:
            return meta, process_chunk(meta, chunks_dir, args.model, system_prompt), None
        except Exception as e:
            return meta, None, e

    with args.out_concepts.open("w") as cf, args.out_items.open("w") as itf:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(worker, m) for m in manifest]
            for fut in as_completed(futures):
                meta, out, err = fut.result()
                with write_lock:
                    n_done += 1
                    tag = f"[{n_done}/{n_total}] {meta['chunk_id']} " \
                          f"({meta['span']['start']}-{meta['span']['end']})"
                    if err is not None:
                        n_failed += 1
                        print(f"{tag}  FAILED: {type(err).__name__}: {err}",
                              file=sys.stderr)
                        continue
                    n_c = len(out.get("concepts", []))
                    n_i = len(out.get("items", []))
                    n_concepts += n_c
                    n_items += n_i
                    print(f"{tag}  -> {n_c} concepts, {n_i} items", file=sys.stderr)
                    for c in out.get("concepts", []):
                        c.setdefault("source", {}).setdefault("file", args.numbered.name)
                        c["chunk_id"] = meta["chunk_id"]
                        cf.write(json.dumps(c) + "\n")
                    for it in out.get("items", []):
                        it.setdefault("source", {}).setdefault("file", args.numbered.name)
                        it["chunk_id"] = meta["chunk_id"]
                        itf.write(json.dumps(it) + "\n")
                    cf.flush(); itf.flush()

    print(f"\ndone: {n_done} chunks, {n_concepts} concepts, "
          f"{n_items} items, {n_failed} failed", file=sys.stderr)


if __name__ == "__main__":
    main()
