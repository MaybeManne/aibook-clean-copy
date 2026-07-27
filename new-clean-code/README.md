# LessonKit

*Advanced Manim for interactive educational content.* A declarative, replayable
engine for **interactive, adaptive, agentic lessons** — read an explainer, play with
live demos, answer questions, *ask* a tutor that explains back and annotates the shared
visualization, and have the lesson adapt — all recorded into one scrollable, replayable
document. Lessons run on a generic state machine, render through swappable templates,
export to video, and are authored by humans **and** LLM agents at the very same seam.

The flagship, [`examples/attention`](examples/attention/) ("Attention, felt"), is the
whole idea in one screen: a live softmax-attention visualization the learner and the
tutor share, a pinned reference article, an "ask the tutor" box, and an append-only
conversation log — one unified live interface (`npm run dev:attention`).

North star: [`docs/VISION.md`](docs/VISION.md). Design notes:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ·
[`docs/VIDEO.md`](docs/VIDEO.md) · per-layer contracts in [`docs/specs/`](docs/specs/).

---

## 1. The big idea

Five principles hold the whole system together:

1. **The state machine sequences; it never computes or animates.** A lesson is a
   generic hierarchical state machine of *beats*. Beats are discrete; each beat may
   carry a continuous *timeline*.
2. **One authoritative clock.** During video playback a single beat-time `t` drives
   visuals, audio, and captions — all are pure functions of `t`. No triple-sync.
3. **Generate → freeze → replay.** Generation is non-deterministic (user input, a
   policy, an LLM agent); the *frozen artifact* replays deterministically. A generated
   beat is emitted as a `beat.generated` event carrying its full spec, spliced into the
   live chart and recorded — so replay reconstructs it from data and **never re-invokes
   the generator**. This is why sessions snapshot, seek, and export frame-identically,
   and why no code is `eval`'d — animations and interactions are declarative data.
4. **The teacher owns the flow.** Branching/adaptivity is authored data. A policy
   (or gaze/LLM signal) is a *selector* over the teacher's graph, never an author of
   arbitrary jumps.
5. **One recorded conversation; the engine owns facts, the agent owns voice.** Tutor
   prose, learner answers/questions, and agent moves (a generated explanation, an
   annotation on the shared viz) are all events in one append-only history that a pure
   projection folds into a scrollable, role-attributed transcript — the "document" side
   of the live video, a mirror of state, never a second source of truth. When an LLM
   authors a beat it supplies only the *prose*; the engine computes the structure and
   the grounded facts (which token attends where, the viz props, the beat id/`next`), so
   the model can neither emit an invalid beat nor hallucinate the visualization.

---

## 2. Layers & dependency graph (strict one-way)

Each directory is a package aliased as `@lessonkit/<name>` (see `tsconfig.json`
`paths`, mirrored in `vite.config.ts`). Arrows mean **depends on**; there are no
cycles and no upward edges.

```
  state_machine ────────────────┐         render_contract ──────────────┐
  (imports nothing)             │         (imports nothing)             │
        ▲                       │               ▲   ▲   ▲               │
        │                       │               │   │   │               │
        │              template ┘               │   │   └── timeline ───┘
        │              (theme + slots)          │   │        (scene graph,
        │                                       │   │         Storyboard, sampleAt)
        │                                       │   │             ▲
        │                                       │   │             │
        │                                       │   └── audio ─────┤
        │                                       │       (TTS, subtitles)
        │                                       │             ▲
        └──────────── lesson ───────────────────┘             │
                      (context, compile, beats, authoring) ────┘
                          ▲
                          │
                        video  ──────────► (lesson, timeline, audio, render_contract,
                      (single clock,        state_machine) — imports NO renderer
                       transport, seek)
                          ▲
                          │
   rendering/render_web ──┘   →  render_contract, template, timeline, audio,
   (React player chrome)          video, scene-svg, state-machine(type-only)
   rendering/render_video     →  render_contract, template, timeline, lesson,
   (offline mp4 frames)           audio, state-machine  (+ @resvg/resvg-js, ffmpeg-static)
```

| Package (`@lessonkit/…`) | Directory | Depends on | Role |
|---|---|---|---|
| `state-machine` | `state_machine/` | — | Generic hierarchical FSM over a Context `<C>`. Pure. |
| `render-contract` | `render_contract/` | — | `RenderIntent`/`RenderModel` + `RichText`. The "what to show", never pixels. |
| `template` | `template/` | render-contract | Presentation tokens (`Theme`) + slot layout (`Template<Comp>`). Pure data. |
| `timeline` | `timeline/` | render-contract | Light scene graph + `Storyboard` + pure `sampleAt(sb,t)`. Video's temporal contract. |
| `audio` | `audio/` | timeline, render-contract | TTS adapters, word alignment, subtitles, caching. |
| `lesson` | `lesson/` | state-machine, render-contract, timeline, audio | Lesson semantics: context, compiler, beats, authoring DSL, Session, policies. |
| `video` | `video/` | lesson, timeline, audio, render-contract, state-machine | The video layer: single clock, transport, seek, gate-pausing, audio channel. **No renderer import.** |
| `render-web` | `rendering/render_web/` | render-contract, template, timeline, audio, video, scene-svg, state-machine(type-only) | React player chrome + component registry. **Lesson-free.** |
| `render-video` | `rendering/render_video/` | render-contract, template, timeline, lesson, audio, state-machine | Offline frame plan → SVG → PNG (resvg) → mp4 (ffmpeg). |
| `scene-svg` | `rendering/render_video/svg.ts` | render-contract, template | Pure `snapshotToSvgInner` + `registerFigure`, shared by preview **and** export (preview == export). |

---

## 3. Component-by-component

### `state_machine/` — the generic engine (pure)
- `types.ts` — `Statechart<C>`, `StateNode`, `Transition` (`guard?`/`target?`/`actions?`), `Route` (`on` pattern + `match` sugar), `MachineEvent`, `Snapshot<C>`.
- `interpreter.ts` — pure `start` / `transition(chart, step, event, registry)` / `snapshot` / `restore`. Resolves `routes` (pattern-matched, supports `signal.*` prefix) **before** exact `on[event]`. O(1) snapshot/restore.
- `registry.ts` — name → guard/action lookup. `effects.ts` — `Effect` type.
- Knows nothing about lessons, rendering, or video. Litmus: `examples/turnstile`.

### `render_contract/` — what to show (pure)
- `intents.ts` — the **open** `RenderIntent` union keyed by `slot` (`"stage"`/`"prose"`/`"prompt"`) and `kind`. Closed members: `text`, `visual`, `mcq`, `input`, `ask` (free-text question box), `controls`; anything else rides `{ kind: string; slot; [k]: unknown }`. `ControlSpec` (slider/toggle/button) lives here.
- `richtext.ts` — portable node tree: `text`(+marks), `math` (KaTeX), `paragraph`, and block nodes `heading`/`list`/`callout`. `text()`/`math()`/`md()` (inline) + `article()` (block-level book/blog parser) + `toPlain()`.

### `template/` — presentation tokens (pure data)
- `theme.ts` — `Theme`: colors, type scale (incl. `eyebrow`/`label`/`article`), weights, `measure` (reading width), `transition`, `space(n)`. **Reskin = swap this object.**
- `template.ts` — `Template<Comp>`: slot layout + component map, renderer-generic.

### `timeline/` — the temporal contract (pure)
- `scene.ts` — `SceneNode` primitives (`rect`,`circle`,`line`/`arrow`,`ring`,`label`,`group`) + gradients/glow; `SceneSnapshot`.
- `storyboard.ts` — `Storyboard { duration, initial, tweens, cues?, stage?, viz? }`; `Cue` kinds (`reveal`/`caption`/`gate`/`narrationMark`).
- `sample.ts` — the linchpin **`sampleAt(sb, t) → SceneSnapshot`** (pure, deterministic) + `cuesUpTo`/`activeGate`. Shared by playback, seek, and export → frame-identical.
- `intent.ts` — `sceneIntent`/`captionIntent`/`vizIntent` (+ `asSceneIntent` etc.), the open-kind extensions defined here (not render-contract, to keep the arrow one-way).

### `audio/` — narration & subtitles
- `tts.ts` (adapter interface), `elevenlabs.ts` (real `/with-timestamps`), `fake.ts` (deterministic, offline, drives tests), `align.ts` (char→word), `subtitles.ts` (`toCaptions`/`activeCaption` — one pure fn for word-highlight), `cache.ts` (content-hash), `sink.ts` (`AudioSink`), `narrate.ts` (generic precompile).

### `lesson/` — lesson semantics
- `lesson_sm/context.ts` — `LessonContext { beats, score, mastery, misconceptions, vars, history }` + `initialContext` + `withBeatState`.
- `lesson_sm/compile.ts` — `compileLesson(spec, registry)`: lowers a teacher `flow` of `BeatSpec`s into a `Statechart`; computes the default **spine** (flow order minus detour targets); `validate()` (DANGLING/UNREACHABLE/NO_TERMINAL…); `beatTargets()` harvests `onWrong`/`branch`/`routes` targets for reachability + spine exclusion.
- `beats/` — the beat catalog (see §5): `types.ts` (`BeatDef`/`RenderableBeat`/`beatMeta`/`leafState`), `explain`, `mcq`, `freeresponse`, `branch`, `animate` (timed `scene`), `explorable` (interactive demo), `index.ts` (`builtinBeats`/`defaultBeatRegistry`). `explorable` also carries the **live-interaction channels**: `demo.set` (learner nudges a control), `workspace.set`/`workspaceSet()` (the AGENT points/annotates/zooms the *same* viz — a distinct event, so the transcript attributes it to the agent), `ask.submit`/`askSubmit()` (learner free-text question → a `generate` effect that answers and *resumes* the beat), a `note` prose slot, and guided `goal`/`task`/`success` (hide Continue until the task is done).
- `authoring/` — `dsl.ts` (`defineLesson` + `explain`/`mcq`/`freeResponse`/`animate`/`explorable`/`branch` builders → `BeatSpec` IR); `session.ts` (the one stateful object: drives the pure interpreter, owns history, runs effects with cancellation, consults `Policy`/`SignalSource`; `subscribe(onStep)` for a passive per-step observer — how the video layer sees async, effect-driven transitions); `generate.ts` (the **LLM/agent authoring seam**: `GenerateEffect`/`generate()`, the `LessonAuthor` interface, and `generatingRunner(author, base)` — a `generate` effect → the author → a recorded `beat.generated` event); `claude_author.ts` (a real Claude author as an opt-in drop-in at that seam via `pickAuthor`/`claudeAuthor`, with `offlineAuthor` the deterministic default; `AuthorPlan` splits *facts+structure* (the engine's `assemble`) from *voice* (the model's prose); `@anthropic-ai/sdk` is loaded lazily so core keeps no hard dependency); `narrate.ts` (`prepareNarration`); `policy.ts` (`decisionPolicy`/`topMisconception` adaptivity helpers).

### `video/` — the video layer (no renderer)
- `program.ts` — **`VideoProgram`**: composes a `Session`, owns the single clock `t`, transport (`play`/`pause`/`setRate`/`seekInBeat`/**`seek`** across beats), a **persistent stage** (visuals never blank on gates), gate-cue pausing, and per-frame assembly. Precomputes the **spine** + **spine snapshots** (policy-free replay) so seeking forward to an unvisited beat is O(1); live-visited snapshots win over spine snapshots. `subscribe`s to the `Session` so effect-driven transitions (a resolved `generate`, a timer, a signal) drive a frame; exposes `transcript()` (memoized) → the conversation `Turn[]`. Emits `VideoFrame` to subscribers.
- `transcript.ts` — **`projectTranscript(lesson, history, activeBeatId) → Turn[]`**: a pure fold of the event log into an append-only, role-attributed (`tutor`/`learner`/`agent`) conversation, the opening beat pinned as reference; drops learner slider-fiddling (`demo.set`) and coalesces consecutive agent gestures. The "scroll-up document" side of the live video — a deterministic mirror of history.
- `transport.ts` (`TransportState`, `TimelineEntry`), `render_model.ts` (`VideoFrame {model, caption, transport}`), `audio.ts` (`AudioChannel` slaves an `AudioSink` to `t`), `authoring.ts` (`defineVideo`/`SceneBuilder`), `player_compat.ts` (`createPlayer` shim).

### `rendering/render_web/` — React player (lesson-free)
- `VideoView.tsx` — the chrome. Two layouts: **`theater`** (full-bleed cinematic) and **`notebook`** (the polished 3-row split: problem/eyebrow bar · 50/50 persistent-viz + reading panel · full-width control bar). The reading panel is the **append-only conversation log** — `program.transcript()` turns rendered as role-attributed bubbles (tutor left, learner right, agent inline), with the current beat's turn "live"; a host layers its authored **`article`** (book/blog prose) or a caption-style `transcript` on top per beat. Subscribes to a `VideoProgram`.
- `components/index.tsx` — the component **registry** (`defaultComponents`, all `React.memo`'d): `TextComp`, `McqComp`, `InputComp`, `ControlsComp` (sliders/toggles/buttons → `demo.set`/`next`), **`AskComp`** (the free-text "ask the tutor" box → `ask.submit`), `HtmlComp`, `FallbackComp`. `SceneView.tsx` (memoized SVG via shared `scene-svg`), `CaptionView.tsx` (word-highlight), `VizView.tsx` (registered figure/viz).
- `TransportBar.tsx` (play/scrub/chapter dots/speed/CC), `richtext.tsx` (`RichTextView`), `htmlAudioSink.ts`/`speechSink.ts`, `viz.ts` (`registerViz` — browser JS/canvas escape hatch), `Template.tsx`/`TemplateView` (static, non-video render path).

### `rendering/render_video/` — offline export
- `svg.ts` (= `@lessonkit/scene-svg`): pure `snapshotToSvgInner` + `registerFigure`/`getFigure` (SVG figures, browser **and** export). `frames.ts` (`planFrames` — pure, walks the beat path, samples per frame, burns captions), `rasterize.ts` (resvg), `encode.ts` (ffmpeg-static), `export.ts` (`exportLesson`).

---

## 4. How it all interacts (runtime flows)

**Authoring → compile → run.** `defineLesson({ id, version, flow: BeatSpec[] })`
(`authoring/dsl.ts`) → `compileLesson` lowers each beat's `build()`/`wire()` into a
`Statechart` and computes the spine → `createSession(lesson, { policies })` drives
the pure interpreter and owns history/effects. The IR is plain JSON — an agent could
emit it directly.

**Static render.** `Session.render()` asks the active beat's `render()` for
`RenderIntent[]`; `TemplateView`/`VideoView` dispatch each intent by `kind` to a
component and place it by `slot`. Events go back via `send`.

**Video playback (single clock).** `VideoProgram.tick(dt)` advances `t`; each frame it
`sampleAt(storyboard, t)` for the stage, computes the active caption, and the
`AudioChannel` seeks the audio to `t` — all from one clock. At `duration` it sends the
advance event; the SM moves to the next beat. `VideoView` re-renders only on real
change (memoized components; a no-op-frame guard). **Seek** resolves the target beat's
snapshot (live-visited ?? precomputed spine) → `restore` → `seekInBeat` — O(1) both
directions.

**Interactivity (demos).** `ControlsComp` emits `demo.set {key,value}`; the
`ExplorableBeat`'s self-transition writes it to `beats[id]`; `program.send` re-renders
and the registered figure/viz redraws from the new value. The beat is untimed, so the
video waits there (a gate) until the learner presses Continue (`__next` → `next`).

**Adaptivity (authored paths + policy).** A wrong/right answer records
`misconceptions`/`mastery` (from `skill`/`misconception` tags). On a decision-node beat,
a pure `Policy` reads the blackboard and emits a `signal.*` event; the beat's authored
`routes` map it to a pre-authored remediation/challenge beat. Policy events are recorded
in history and replayed with policies off → deterministic. No engine changes.

**Agentic generation & live conversation.** A beat requests generation by declaring a
`generate` effect (from an entry action, or from a learner's `ask.submit`). A
`generatingRunner(author)` hands the settled context to a `LessonAuthor`; the author
returns a `BeatSpec`, which the runner emits as a `beat.generated` event that `Session`
validates, splices into the live chart, jumps into, **and records**. Because the spec is
in history, replay reconstructs the beat without re-invoking the author. The default
author is offline and deterministic; `pickAuthor` swaps in a live Claude author when
`ANTHROPIC_API_KEY` is set — same seam, and the model contributes only prose (the engine
computes the grounded facts and structure). The learner's question, the agent's
explanation, and any `workspace.set` annotation all land in the same history the
transcript projects, so the conversation records and replays as one document. (In the
browser a key must sit behind a server proxy, never in the bundle — the shipped demo
stays on the offline author.)

**Audio/narration (offline).** `prepareNarration(spec)` synthesizes TTS for `scene`
beats carrying `narration`, sets each storyboard's `duration` to the audio length, and
bakes caption cues — returning a prepared spec + audio manifest + captions the browser
app imports.

**Export.** `exportLesson` runs the pure `planFrames` (same `sampleAt` + `scene-svg` as
the browser → identical geometry), rasterizes via resvg, and muxes per-beat audio via
ffmpeg. SVG figures export; `registerViz` (canvas/WebGL) is browser-only.

---

## 5. Beat & intent catalogs

**Beats** (`lesson/beats/`, authored via the matching DSL builder):

| Beat (`type`) | Purpose | Key params | Timed? |
|---|---|---|---|
| `explain` | prose/visual/HTML | `text`/`visual`/`html` | no |
| `scene` (`animate`) | animated storyboard | `storyboard`, `narration?` | **yes** |
| `mcq` | multiple choice gate | `choices` (`correct`/`misconception?`), `skill?`, `onWrong?` | no |
| `freeResponse` | fill-in gate | `accept[]`, `skill?`, `misconception?`, `onWrong?` | no |
| `explorable` | interactive demo (+ agent viz channel & ask box) | `controls[]`, `viz{name}`, `defaults?`, `note?`, `ask?`, `goal?`/`task?`/`success?` | no |
| `branch` | pure flow fork | `when` guard, `then`/`else` | no |

Beats generated live at the `LessonAuthor` seam (`gen-*` ids) are ordinary `BeatSpec`s —
usually an `explain` (an answer) or an `explorable` (an annotated viz that resumes the
prior beat). They are spliced and recorded, so they need no special beat type.

**Intents** (`kind` → component): `text`, `visual`, `mcq`, `input`, `ask`, `controls`,
`scene`, `caption`, `viz`, `html`. Open union — custom beats may emit new kinds; unknown
kinds fall back to a visible placeholder (never crash).

---

## 6. Examples

| Dir | Script | Shows |
|---|---|---|
| `turnstile` | `npm run litmus` | generic engine with a toy context (no lesson/render deps) |
| `photosynthesis` | `npm run demo` / `render-test` | headless lesson (both paths, snapshot/replay) + React render |
| `animated` | `npm run anim` | Phase-0 video slice: `sampleAt` + Player advances the SM |
| `narrated` | `npm run narrate` / `export` | offline TTS prep + mp4 export |
| `narrated-web` | `npm run dev:narrated` | narrated lesson in the split player |
| `amc-nested` | `npm run dev:amc` | full AMC lesson (figures, gates, narration) |
| `figures` | `npm run dev:figures` | `registerFigure`/`registerViz` escape hatches |
| `interactive` | `npm run dev:interactive` / `npm run interactive` | the video-game loop: article reader + live slider demo + adaptive remediation/challenge |
| `flagship` | `npm run dev:flagship` / `npm run flagship` | "Sine from a circle" — interactive-first: guided goals (do the task to advance), an inline question, and adaptive branching |
| `grad-descent` | `npm run dev:grad` / `grad` / `grad:gen` | the tutored-3D loop: a viz that emits outbound signals, real-time routing (`signal.viz.diverged` → remediate) + a settled-state policy; `grad:gen` exercises the `generate` path headlessly |
| **`attention`** | **`npm run dev:attention`** / `npm run attention` | **the unified live tutor (flagship): a shared softmax-attention viz + ask box + agent `generate`/`workspace.set` + append-only transcript — the whole idea in one screen** |

---

## 7. Run & toolchain

Node is a **dev tool only** — the runtime is pure browser JS. A project-local Node
lives at `.conda-node/` (this box has no system Node):

```bash
export PATH="$PWD/.conda-node/bin:$PATH"
npm install

npm run dev:attention     # the flagship unified live tutor (shared viz + ask box + transcript)
npm run dev:interactive   # the interactive lesson (article + demo + adaptivity)
npm run dev:amc            # the full AMC nested-circles lesson
npm test                  # headless suite: turnstile, photosynthesis (+render-test), animated,
                          #   narrated (+export), interactive, grad-descent (+generate),
                          #   attention, flagship
npm run typecheck         # tsc --noEmit, whole repo

# Opt in to the LIVE Claude tutor (else the deterministic offline author drives every
# generation — which is what the tests and the shipped browser demo use):
export ANTHROPIC_API_KEY=sk-…   # Node only; in the browser this must be proxied server-side
```

Build-time-only files (none ship at runtime; do not delete): `package.json`,
`package-lock.json`, `tsconfig.json` (compiler opts **and** the `@lessonkit/*` aliases),
`vite.config.ts` (mirrors the aliases), `.conda-node/`, `node_modules/`. `node_modules`
may be a symlink to scratch. Browser visual checks: `examples/_shot.mjs` (puppeteer)
against a `dev:*` server. mp4 export needs `@resvg/resvg-js` + `ffmpeg-static`.

---

## 8. Design invariants (don't break these)

- **One-way deps.** `state_machine`/`render_contract` import nothing; `video` imports no
  renderer; `render_web` is lesson-free; `theme.ts` is pure data; `sampleAt` is pure.
- **No `eval`.** Animations and interactions are declarative data (Storyboards, control
  specs, registered figures) — validatable, replayable, agent-authorable.
- **Determinism boundary.** Generation (user input, policy, LLM) is non-deterministic;
  the frozen artifact replays deterministically. Policies read only the settled step.
- **Agent authors voice, not structure.** A `LessonAuthor` returns prose; the engine
  computes the beat's facts, structure, ids, and viz props. Generated beats are recorded
  as `beat.generated` and replayed from that data — the author is never re-invoked on
  replay, and the default author is offline/deterministic.
- **Preview == export.** The browser and the mp4 exporter share `sampleAt` + `scene-svg`.
- **Teacher owns flow.** Policies/signals *select* pre-authored edges; they never invent
  destinations.

Per-layer normative contracts: [`docs/specs/01`–`08`](docs/specs/).
