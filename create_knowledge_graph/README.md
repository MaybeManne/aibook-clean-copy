# create_knowledge_graph

Turn a textbook PDF/markdown into a knowledge graph of **concepts + items + prerequisite edges**, with per-field provenance, section-level position metadata, and a separate images asset table.

The graph is designed to power downstream tools:
- **Exam generator** — sample items by concept + difficulty + student mastery.
- **AI tutor** — walk prereq edges to diagnose gaps, serve concept explanations + examples.
- **Video / diagram explainer** — consume concept + linked figures + reproduction code.

---

## What's in this bundle

```
.
├── pipeline3/                 # all pipeline stages (run via run.py)
├── schema3/                   # JSON schemas for concepts, items, edges, images
├── data3/                     # sample outputs from a full run on the included textbook
│   ├── graph.json             #   single-file bundle (6.6 MB)
│   ├── graph.indexed.json     #   same, with id-keyed dicts for O(1) lookup
│   ├── concepts.jsonl         #   285 concepts
│   ├── items.jsonl            #   2,848 items (exercises, examples, figures, tables, theorems)
│   ├── edges_prereq.validated.jsonl   # 393 DAG edges
│   ├── edges_overlay.validated.jsonl  # 249 overlay edges
│   ├── images.jsonl           #   408 image assets (alt text + reproduction hints)
│   ├── images/                #   the actual image files
│   ├── concepts.raw.jsonl / items.raw.jsonl   # verbatim textbook spans (split out after Pass B)
│   └── pipeline.state.json    #   stage completion tracker
├── calculus 101.md            # source textbook (Mathpix-converted markdown)
├── calculus 101.pdf           # source textbook (original PDF)
└── README.md                  # this file
```

If you just want to **look at the output graph**, open `data3/graph.json` or `data3/graph.indexed.json`. Everything else supports the pipeline that built it.

---

## Requirements

- Python 3.9+
- `google-genai` SDK: `pip install google-genai`
- `rapidfuzz` (optional — used for one verifier check in `format_items.py`; missing it just disables that check): `pip install rapidfuzz`

---

## Environment variables

The pipeline supports Google Gemini, OpenAI, and Anthropic. The default graph
workflow uses Gemini for extraction/local auditing and OpenAI for independent
semantic verification. **You need your own API keys** — none are bundled.

```bash
export GEMINI_API_KEY=your_key_here      # or GOOGLE_API_KEY — both work
export OPENAI_API_KEY=your_key_here      # required by the default edge verifier
```

`pipeline3/llm.py` also aliases `GEMINI_API_KEY_SHADEN` into `GEMINI_API_KEY` for a legacy setup; you can ignore it.

---

## Running the pipeline

### Quick start

```bash
# Start from the included textbook (or drop your own markdown in as book_raw.md)
cp "calculus 101.md" data3/book_raw.md

python pipeline3/run.py
```

State is tracked in `data3/pipeline.state.json`; rerunning resumes from the next unfinished stage. Because the bundled `data3/` already contains a completed run, `run.py` will report that everything is done. To rerun from scratch:

```bash
rm -rf data3
mkdir data3
cp "calculus 101.md" data3/book_raw.md
python pipeline3/run.py
```

### Useful flags

```bash
python pipeline3/run.py --list          # show stages and completion status
python pipeline3/run.py --only pass_a   # run one stage
python pipeline3/run.py --force splice  # rerun from this stage onward
python pipeline3/run.py --skip-optional # skip audit_chunks, repair_items, image_reproduce
python pipeline3/run.py --force audit_local_edges  # augment existing edges without replacing them
python pipeline3/run.py --data-dir data_vision --force audit_local_edges \
  --skip-optional --graph-out ../concept-graph-vision-data.json
```

Each stage also has a standalone script under `pipeline3/` — the orchestrator just invokes them with the right flags. You can run them directly to iterate on one stage.

### Bundling into a single `graph.json`

The full pipeline now performs this automatically. To rebuild it manually, run
`python pipeline3/run.py --only merge_graph`.

Writes a single JSON document with all nodes + edges + metadata, plus `graph.indexed.json` with id-keyed dicts for O(1) lookup.

---

## The pipeline (26 stages)

| # | Stage | Type | What it does |
|---|---|---|---|
| 1 | `parse_structure` | pure | Regex-parse `## CHAPTER` and `### N.M SECTION` from raw markdown → `chapters.jsonl`, `sections.jsonl`. |
| 2 | `download_images` | pure | Scrape every `![](url)` from the raw markdown, download to `data3/images/`, write `images.jsonl` keyed by `asset_id = sha256(url)[:16]`. |
| 3 | `alt_text` | LLM vision | Per image: context-grounded Gemini vision call → `alt_text_md`, `kind`, `text_transcription`, `reproducible_hint`. Writes back into `images.jsonl`. |
| 4 | `enrich` | pure | Rewrite `![alt](url)` → `[FIGURE:<asset_id> \| <short alt>]` tokens. URLs disappear from text; the asset table is the single source of truth. |
| 5 | `number` | pure | Prefix every line with `Lxxxxx: ` for stable line-number citations. |
| 6 | `chunk` | pure | Split the numbered markdown into ~6k-token chunks at blank-line/heading boundaries, preferring section starts. |
| 7 | `audit_chunks` *(optional)* | LLM | One-shot audit — does any chunk boundary break a logical unit? |
| 8 | `pass_a` | LLM | **Structure-only** extraction. Per chunk, LLM returns records with `{id, kind, title, source.spans}` only — no body text. Recognizes `exercise_group` (shared directive + numbered sub-exercises) and `embedded_in` (figures/tables belonging to an item). Multi-range `spans` supported for out-of-sequence material. |
| 9 | `verify_pass_a` | pure | Structural checks: every span range valid, inside chunk, no overlap; slug valid; no duplicate ids. Splits into verified / quality-flagged / hard failures. |
| 10 | `salvage` | pure | Auto-rename duplicate-id collisions (`ex_1_2_3__chunk_id`), sanitize bad slugs, fix parent/sub references. |
| 11 | `splice` | pure | Copy verbatim lines from `source.spans` into `raw_body` (multi-range: joined by paragraph break). Prepend group directives to sub-exercise `raw_body` so every exercise is self-contained. Fill in `position`. |
| 12 | `dedup` | LLM | Single whole-book call: find near-duplicate concepts, produce a merge map, collapse them. Alias-preserving. |
| 13 | `format_concepts` | LLM | **Pass B for concepts.** `content` field: light paraphrase of `raw_body` preserving every claim + all inline `[FIGURE:...]` tokens. `one_liner`: single-sentence digest. `motivation_md` + `recap_md`: LLM-generated study aids. |
| 14 | `format_items` | LLM | Split item `raw_body` into per-kind fields: `prompt_md` / `solution_md` / `answer` / `difficulty` / `skills` for exercises/examples; `caption_md` for figures/tables; `proof_md` for theorems. `[FIGURE:...]` tokens preserved inline. |
| 15 | `repair_items` *(optional)* | LLM | Small repair loop on any hard-failed item formatting. |
| 16 | `link_items` | LLM | **LLM-only** item→concept linking with the full concept catalog as candidates. Embedded figures/tables inherit from their parent item. |
| 17 | `extract_edges` | LLM | Section-windowed broad semantic edge extraction. Base files remain separate from later audit additions. |
| 18 | `audit_local_edges` | LLM | Deterministically inspects uncovered same-section neighbors and section-boundary pairs. Every candidate is classified as a semantic relationship or `no_edge`; unchanged decisions are resumed from `edge_local_decisions.jsonl`. |
| 19 | `merge_edge_sets` | pure | Non-destructively unions base and local-audit edges, assigns stable edge IDs, records provenance, and writes combined artifacts. |
| 20 | `validate_augmented_edges` | pure | ID resolution and deterministic deduplication before semantic review. Cycles are reported. |
| 21 | `verify_edges_semantic` | LLM | Independently keeps, relabels, or drops every proposed edge using its textbook evidence. Default confidence threshold: 0.70. |
| 22 | `validate_verified_edges` | pure | Revalidates relabeled edges and writes the canonical `edges_*.final.jsonl` artifacts. |
| 23 | `image_reproduce` *(optional)* | LLM vision | Produces matplotlib/SVG reproduction code for graph/diagram images. Stores, doesn't execute. |
| 24 | `split_raw` | pure | Move `raw_body` into sidecar files and strip it from the main records. |
| 25 | `merge_graph` | pure | Automatically bundles final verified edges and all graph records into `graph.json`. |
| 26 | `fill_slots` | LLM | Fills learner-facing concept slots using the completed graph. |

Types:
- **pure** — no LLM, deterministic, seconds.
- **LLM** — provider-selected structured JSON call, batched + parallel.
- **LLM vision** — Gemini with image bytes attached.

### Cross-book semantic edges

`pipeline3/extract_cross_book_edges.py` compares independently processed graph bundles.
It first retrieves a small deterministic candidate set, then asks the LLM to accept,
reject, and semantically direct every pair. Cross-book chapter numbers are never used
for direction; `requires`, `formalizes`, `illustrates`, and related edge meanings
determine direction instead. Concept keys are namespaced as `book_id::concept_id`.

```bash
python pipeline3/extract_cross_book_edges.py \
  --primary 'vision|Foundations of Computer Vision|../concept-graph-vision-data.json|../concept-graph-journey.html' \
  --book 'deep_learning|Understanding Deep Learning|data_deep_learning/graph.json|../concept-graph-journey.html?data=create_knowledge_graph/data_deep_learning/graph.json' \
  --top-k 1 --min-score 0.5 \
  --out ../cross-book-connections.json
```

Decisions are resumable through `--decisions`; reruns bill only changed candidates.

---

## Output schemas (see `schema3/`)

**concept.schema.json** — `{id, kind, title, one_liner, content, motivation_md, recap_md, aliases, tags, item_ids, source, position, _provenance, quality_flags, extraction}`. Kinds: `definition`, `theorem`, `technique`, `idea`.

**item.schema.json** — `{id, kind, title, prompt_md, solution_md, answer, proof_md, caption_md, difficulty, skills, tags, concepts, parent_group_id, sub_item_ids, embedded_in, source, position, _provenance, quality_flags, extraction}`. Kinds: `example`, `exercise`, `exercise_group`, `theorem`, `figure`, `table`.

**edge.schema.json** — `{from, to, kind, strength, rationale, evidence_spans, confidence, verified, extraction}`. Kinds: `requires` (DAG) + overlay (`special_case_of`, `generalizes`, `formalizes`, `illustrates`, `used_to_prove`, `see_also`, `contrast_with`, `teaches_after`).

**image_asset.schema.json** — `{asset_id, url, local_path, status, alt_text_md, kind, text_transcription, reproduction_kind, reproduction_code, fidelity_estimate, referenced_by, extraction}`.

### Multi-range spans

Every record's `source.spans` is an **array** of line ranges, not a single range. Most records are single-range (`[{start, end}]`); multi-range lets a record include out-of-sequence material:

```json
"source": {
  "file": "book.numbered.md",
  "spans": [
    {"start": "L14684", "end": "L14692"},
    {"start": "L14694", "end": "L14695"}
  ]
}
```

Splice concatenates the ranges with a paragraph break. Edges use the analogous `evidence_spans` field.

### Provenance

Every Pass B record has a `_provenance` dict marking each semantic field as:
- `book_extracted` — verbatim or near-verbatim from `raw_body`
- `book_paraphrased` — LLM restructuring/cleanup of `raw_body`
- `llm_inferred` — LLM-generated content beyond `raw_body`

Downstream consumers can filter: "only show book-sourced content" vs "allow LLM enrichment."

### Position (time dimension)

Every concept and item carries:
```json
"position": {
  "chapter": 1, "chapter_title": "LIMITS AND CONTINUITY",
  "section": "1.1", "section_title": "LIMITS (AN INTUITIVE APPROACH)",
  "section_order": 1,
  "concept_order_in_section": 8,
  "book_order": 42,
  "first_line": 156
}
```

For course design: `book_order` gives a natural timeline; `section` + `chapter` give lesson groupings.

### raw_body in side files

After `split_raw`, the main files (`concepts.jsonl`, `items.jsonl`) no longer carry `raw_body`. The verbatim text lives in `concepts.raw.jsonl` / `items.raw.jsonl` keyed by id. Consumers needing raw text can join on id; consumers that want the finished form use `content` (for concepts) or `prompt_md` / `solution_md` / etc. (for items).

### Images

Never stored inline in concept/item text. Every `![](url)` from the source becomes a `[FIGURE:<asset_id> | <short alt>]` token in `raw_body` / `content` / `prompt_md` / `solution_md`. The full asset record (URL, local path, alt text, reproduction code) lives in `images.jsonl`, keyed by `asset_id`. Renderers substitute at display time.

### Exercises with diagrams

Three ways a diagram attaches to an exercise:

1. **Inline token** — the `[FIGURE:...]` token sits in the exercise's body text at the original position.
2. **Separate figure item with `embedded_in`** — the figure has its own record in `items.jsonl` with `embedded_in: <parent_item_id>`. Renderers query "children with `embedded_in: <this item's id>`".
3. **Multi-range exercise spans** — the exercise's own `source.spans` covers both the prose lines and the figure lines (disjoint).

All three converge on the same display contract: substitute `[FIGURE:...]` tokens with image/reproduction from `images.jsonl`, and look up `embedded_in` children for any record.

---

## Design principles

1. **Line-numbered source + content-free Pass A.** Every LLM claim is auditable to a specific line range. The model can't hallucinate textbook content it wasn't shown.
2. **Splice before Pass B.** A pure program (`splice.py`) attaches verbatim `raw_body` to every record. Pass B never invents; it only organizes and formats what's already in `raw_body`.
3. **LLM-only for semantic decisions.** Item→concept linking and edge extraction use the LLM, not heuristics. Heuristics only for deterministic things (line arithmetic, position computation, span containment).
4. **Images live in an asset table.** Text fields carry only `[FIGURE:asset_id]` tokens at original textual positions.
5. **Exercise headers preserved.** A numbered sub-exercise (`29. y = (x^2-1)/(x+2)`) gets its shared directive (`Find horizontal asymptotes`) prepended in `splice.py`.
6. **Provenance is honest.** `book_extracted` / `book_paraphrased` / `llm_inferred` per semantic field.
7. **Cycles are logged, not broken.** Rare and usually signal genuine conceptual co-dependence; downstream planners can filter.
8. **Idempotent, resumable.** `run.py` tracks state; rerunning only executes unfinished stages.

---

## Key shared modules

- `pipeline3/llm.py` — Gemini client: `call_llm_json`, `call_llm_json_with_image`. Exponential-backoff retry on 429/503. `clean_schema_for_gemini` strips Draft-2020 features Gemini rejects.
- `pipeline3/spans.py` — multi-range span helpers: `ranges_of`, `first_line`, `last_line`, `splice_body`, `contains`, `normalize_spans`.
- `pipeline3/number_lines.py` — bidirectional (`--strip` reverses).
- `pipeline3/split_raw_body.py` — moves `raw_body` into side files.
- `pipeline3/merge_graph.py` — bundles all jsonl into `graph.json` + indexed view.

---

## Numbers from the bundled run (calculus 101)

- 4 chapters, 26 sections
- **285 concepts** (after 19 dedup merges from 308 extracted), each with `content`, `motivation_md`, `recap_md`, aliases, tags, provenance
- **2,848 items** — 249 exercise_groups, 1,308 sub-exercises with `parent_group_id`, 324 figures/tables with `embedded_in`, 40 exercises with multi-range spans
- **393 DAG prereq edges**, **249 overlay edges**
- **408 image assets** with alt text + reproduction hints
- `data3/graph.json` — 6.6 MB bundled
- `data3/graph.indexed.json` — 7.1 MB with id-keyed indexes

---

## Known limitations

- **4-digit line markers**: Gemini occasionally emits `L1056` instead of `L01056`, losing those records at verify. A simple auto-pad salvage rule would recover them (~75 items lost in this run).
- **`teaches_after` is underused** as an edge kind; the LLM mostly picks `requires` even when pedagogical ordering is the real relationship.
- **Tables** still render as inline markdown rather than becoming kind=`table` records with reproduction code.
- **`book_order` is within-book.** Multi-book course construction would need an overlay ordering.
- **Cycle detection logs one cycle and stops**; a full cycle listing + concept-level "co-dependent group" report would be more useful for course design.
