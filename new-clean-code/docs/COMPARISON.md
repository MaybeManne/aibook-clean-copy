# Prior-Art Comparison & Salvage Map

*Written 2026-07-27. Basis for the `lessonStudio` rebuild. Grounded in a verified read of
all three prior codebases (not just their docs).*

## The three prior attempts

| Project | Size | Shape | One-line |
|---|---|---|---|
| **lessonkit** | 18M, 153 files, ~13.8K LOC, git | many small files, clean layers | Declarative replayable IR + AI-authoring seam. **Over-surfaced, not over-coupled.** |
| **SocraticAI** | 55M, 76 files, ~40K LOC, git | few huge files | Actually shipped the breadth: Manim library, TTS, 6-stage agentic pipeline, single-file HTML. |
| **activeReader_clean** | 41M, 12 files, ~10.8K LOC, no git | 2 monolith files | Adaptive textbook reader; carries the learner-model / grounding ideas. |

## Diagnosis of lessonkit (the base we build on)

The architecture is **genuinely good and should not be re-derived**: a one-directional
dependency DAG with a pure core (`state_machine` + `render_contract` import nothing), a real
`BeatSpec` IR, and a working **generate → freeze → replay** invariant (an LLM-authored beat is
recorded as a `beat.generated` event so replay never re-calls the model).

What makes it *feel* "overwhelmingly large" is **concept/track proliferation**, not tangle or
LOC (examples are 39% of source). For a one-week-old engine that has shipped ~1.5 real lessons
it already has:

- **3 authoring surfaces** (`defineLesson` literal; `lesson/authoring/builder.ts`; a second,
  name-colliding `LessonBuilder` in `author/build.ts`).
- **2 viz escape hatches** (`registerFigure` = SVG/exportable; `registerViz` = raw JS/browser-only).
- **2 runtime hosts** (`video/` clocked player, 561-LOC `VideoProgram`; `live/` clockless co-play, 129 LOC).
- **3 view components** (`TemplateView`, `VideoView`, `StudioView`), two of which hardcode the
  same 50/50 split and duplicate ~80% of layout.
- A **swappable `Template<R>` abstraction the flagship path ignores** (only `photosynthesis`
  uses `TemplateView`; the real split-screen is hardcoded in the React views).

**Verdict:** prune to one path per job; the spine is worth keeping. ~45% of the non-example
code is prunable/mergeable without touching the architectural spine.

## The salvage map (what to lift, from where)

### From lessonkit — LIFT the spine (≈4.5–5K LOC)
- `state_machine/` + `render_contract/` **verbatim** (2 pure contracts, ~586 LOC, exemplary).
- `lesson/lesson_sm/compile.ts` (the `BeatSpec` IR + spine lowering — the heart),
  `lesson/beats/`, `lesson/authoring/session.ts` (the Session host).
- `timeline/` (the `Storyboard` animation primitive) + `audio/` (TTS/subtitles/cache).
- **The AI seam**: `lesson/authoring/generate.ts` + `claude_author.ts` + the
  `addBeat`/`rerouteBeat` structural editing with `reachesTerminal` soft-lock guards.
- **One** runtime: the clockless `live/program.ts` (where the point-5 vision lives).
- `lesson/policy/*` (the Perceive→Decide→Act SPI — small; keep as the seam the learner model plugs into).

### From SocraticAI — GRAFT the two things lessonkit lacks
- **The mobject + animation library** (`mobject/mobject.js` ~1004 LOC + `mobject/anim.js` ~744
  LOC): ~18 primitives + ~25 animation verbs (`write`, `drawBorder`, `morphTo`, `orbit`,
  `moveAlongPath`, `stagger`…), framework-agnostic. Re-home it onto lessonkit's **declarative,
  replayable, exportable** scene graph instead of SocraticAI's imperative GSAP timeline.
  *This is what makes point 1 and the 3b1b reproduction test achievable.*
- **The agentic-pipeline PATTERN** for the second repo: agents emit **schema-validated JSON**,
  a **non-LLM deterministic assembler** turns it into the DSL, with **guard/retry loops** and a
  **screenshot reviewer** (`orchestrator.py` stages → `assembler.py` → `reviewer`). The best
  idea in that codebase is this LLM↔deterministic boundary.

### From activeReader_clean — LIFT one sharp module
- The **event-sourced two-axis learner model** (`frontend/src/learnerModel.js`, ~270 LOC):
  a KNOWLEDGE ladder × DISPOSITION axis, EWMA folding of evidence bundles, lucky-guess/hint
  discounting, serializable. A *better* "Perceive" than anything in lessonkit — slots into the
  policy SPI.
- Its explicit **grounding** pattern (inject the current concept + a "do not drift" instruction;
  RAG over embedded pages), `server.js:3113-3127`, `:45-70`.

## What NOT to carry (unanimous across explorers)

- **SocraticAI** `engine/core.js` — 886-LOC god module of patch-on-patch seek/branch/audio-sync
  that bypasses its own state machine (`state.phase = "playing"` direct writes at `:741/:757/:843`);
  triplicated 2.5-wps timing math (`dsl.js:335`, `core.js:299`, `subtitles.js:53`);
  audio-as-inline-base64-JS (one file 8.9 MB); committed `dist/*.html` build artifacts (6.5–14K
  lines each); monolithic `orchestrator.py` (1768 LOC) with inconsistent stage numbering.
- **activeReader** 5.4K-LOC `App.js` monolith (imperative `bus.on` fan-out to 4-6 sinks per
  event); a logged-but-never-replayed backend event stream disconnected from the real frontend
  model; the "agenticPipeline" that is self-admittedly a deterministic compiler with zero agency;
  **static routing that ignores its own rich learner model** (the closed loop was never wired).
- **lessonkit** the heavy `video/` transport (561 LOC scrub/rate/seek) unless mp4 export is a
  launch requirement (move behind a plugin); the duplicate `lesson/authoring/builder.ts`
  `LessonBuilder`; the orphaned `Template<R>`-vs-hardcoded-view split (pick ONE).

## The three gaps activeReader left open — that lessonStudio must close
1. Make routing a **function of the learner model**, not a static branch queue.
2. Make the **event log the single source of truth and actually replay it** (true event-sourcing —
   lessonkit already does this; keep it).
3. Replace imperative fan-out with **one reducer/policy** consuming engine events → next action
   (the genuine Perceive→Decide→Act loop). lessonkit's `Session` + policy SPI already is this.
