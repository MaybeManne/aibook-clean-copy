# LessonKit

*Advanced Manim for interactive educational content.* A declarative, replayable
engine for **interactive, adaptive lessons** — read an explainer, play with live
demos, answer questions, and have the lesson adapt — that run on a generic state
machine, render through swappable templates, export to video, and are editable by
humans **and** AI agents.

North star: [`docs/VISION.md`](docs/VISION.md). Design notes:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ·
[`docs/VIDEO.md`](docs/VIDEO.md) · per-layer contracts in [`docs/specs/`](docs/specs/).

---

## 1. The big idea

Four principles hold the whole system together:

1. **The state machine sequences; it never computes or animates.** A lesson is a
   generic hierarchical state machine of *beats*. Beats are discrete; each beat may
   carry a continuous *timeline*.
2. **One authoritative clock.** During video playback a single beat-time `t` drives
   visuals, audio, and captions — all are pure functions of `t`. No triple-sync.
3. **Generate → freeze → replay.** Generation is non-deterministic (user input, a
   policy, later an LLM); the *frozen artifact* replays deterministically. This is
   why sessions snapshot, seek, and export frame-identically, and why no code is
   `eval`'d — animations and interactions are declarative data.
4. **The teacher owns the flow.** Branching/adaptivity is authored data. A policy
   (or gaze/LLM signal) is a *selector* over the teacher's graph, never an author of
   arbitrary jumps.

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
- `intents.ts` — the **open** `RenderIntent` union keyed by `slot` (`"stage"`/`"prose"`/`"prompt"`) and `kind`. Closed members: `text`, `visual`, `mcq`, `input`, `controls`; anything else rides `{ kind: string; slot; [k]: unknown }`. `ControlSpec` (slider/toggle/button) lives here.
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
- `beats/` — the beat catalog (see §5): `types.ts` (`BeatDef`/`RenderableBeat`/`beatMeta`/`leafState`), `explain`, `mcq`, `freeresponse`, `branch`, `animate` (timed `scene`), `explorable` (interactive demo), `index.ts` (`builtinBeats`/`defaultBeatRegistry`).
- `authoring/` — `dsl.ts` (`defineLesson` + `explain`/`mcq`/`freeResponse`/`animate`/`explorable`/`branch` builders → `BeatSpec` IR); `session.ts` (the one stateful object: drives the pure interpreter, owns history, runs effects with cancellation, consults `Policy`/`SignalSource`); `narrate.ts` (`prepareNarration`); `policy.ts` (`decisionPolicy`/`topMisconception` adaptivity helpers).

### `video/` — the video layer (no renderer)
- `program.ts` — **`VideoProgram`**: composes a `Session`, owns the single clock `t`, transport (`play`/`pause`/`setRate`/`seekInBeat`/**`seek`** across beats), a **persistent stage** (visuals never blank on gates), gate-cue pausing, and per-frame assembly. Precomputes the **spine** + **spine snapshots** (policy-free replay) so seeking forward to an unvisited beat is O(1); live-visited snapshots win over spine snapshots. Emits `VideoFrame` to subscribers.
- `transport.ts` (`TransportState`, `TimelineEntry`), `render_model.ts` (`VideoFrame {model, caption, transport}`), `audio.ts` (`AudioChannel` slaves an `AudioSink` to `t`), `authoring.ts` (`defineVideo`/`SceneBuilder`), `player_compat.ts` (`createPlayer` shim).

### `rendering/render_web/` — React player (lesson-free)
- `VideoView.tsx` — the chrome. Two layouts: **`theater`** (full-bleed cinematic) and **`notebook`** (the polished 3-row split: problem/eyebrow bar · 50/50 persistent-viz + reading panel · full-width control bar). The reading panel renders an authored **`article`** as a flowing document (or a caption-style `transcript` fallback). Subscribes to a `VideoProgram`.
- `components/index.tsx` — the component **registry** (`defaultComponents`, all `React.memo`'d): `TextComp`, `McqComp`, `InputComp`, `ControlsComp` (sliders/toggles/buttons → `demo.set`/`next`), `HtmlComp`, `FallbackComp`. `SceneView.tsx` (memoized SVG via shared `scene-svg`), `CaptionView.tsx` (word-highlight), `VizView.tsx` (registered figure/viz).
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
| `explorable` | interactive demo | `controls[]`, `viz{name}`, `defaults?` | no |
| `branch` | pure flow fork | `when` guard, `then`/`else` | no |

**Intents** (`kind` → component): `text`, `visual`, `mcq`, `input`, `controls`, `scene`,
`caption`, `viz`, `html`. Open union — custom beats may emit new kinds; unknown kinds
fall back to a visible placeholder (never crash).

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
| **`interactive`** | **`npm run dev:interactive`** / `npm run interactive` | **the video-game loop: article reader + live slider demo + adaptive remediation/challenge** |

---

## 7. Run & toolchain

Node is a **dev tool only** — the runtime is pure browser JS. A project-local Node
lives at `.conda-node/` (this box has no system Node):

```bash
export PATH="$PWD/.conda-node/bin:$PATH"
npm install

npm run dev:interactive   # the interactive lesson (article + demo + adaptivity)
npm run dev:amc            # the full AMC nested-circles lesson
npm test                  # headless: turnstile, photosynthesis, animated, narrated, export, interactive
npm run typecheck         # tsc --noEmit, whole repo
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
- **Preview == export.** The browser and the mp4 exporter share `sampleAt` + `scene-svg`.
- **Teacher owns flow.** Policies/signals *select* pre-authored edges; they never invent
  destinations.

Per-layer normative contracts: [`docs/specs/01`–`08`](docs/specs/).
