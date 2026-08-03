# lessonStudio

**Manim, in the browser, interactive.**

lessonStudio is a TypeScript engine for lessons a learner *does* rather than watches. A lesson is
written as data — a spine of beats, each one prose plus a figure plus, optionally, something the
learner can touch. The engine compiles that to a statechart, records every event, and can rebuild
any session by replaying the log.

What makes it more than a slide runner is that a lesson stays **open at play time**. A teacher — or
a language model standing in exactly the same place — can watch a learner work and then speak, point
at the figure, move the learner's own slider, or write a new beat and splice it into the graph. Every
one of those moves is the same adjudicated command, recorded as JSON, and replayed later without
calling anybody back.

```bash
git clone <this repo> && cd lessonStudio
npm install
npm run check      # 7 headless checks — no browser, no API key
npm run dev        # then open the URL Vite prints
```

---

## A lesson is data

```ts
import { defineLesson, explain, explorable, mcq } from "@lessonstudio/authoring";
import { article, md } from "@lessonstudio/intents";

export const lesson = defineLesson({
  id: "pinhole-camera",
  version: 1,
  title: "The Pinhole Camera",
  flow: [
    explain({
      id: "wall",
      text: article(
        "# The Pinhole Camera\n" +
          "How does one small hole turn light into a picture?\n\n" +
          "*Drag the figure to look around the apparatus.*",
      ),
      narration: "Look at a blank wall. Why don't you see a picture of the room on it?",
      viz: { name: "pinhole3d", props: { u: 7, v: 7 }, persistent: true },
      next: "move-screen",
    }),

    explorable({
      id: "move-screen",
      viz: { name: "pinhole3d", props: { u: 7, rays: true, image: true }, persistent: true },
      controls: [
        { key: "v", label: "screen distance  v", kind: "slider", min: 4, max: 14, step: 1 },
        { key: "__next", label: "I've got it — continue →", kind: "button" },
      ],
      defaults: { v: 7 },
      goal: { key: "v", min: 12 },
      task: md("**Push the screen out to $v \\ge 12$.** Watch $h'$ grow while the image stays sharp."),
      success: md("The image height grows in proportion: $h' = h\\,v/u$."),
      ask: true,
      next: "gate",
    }),

    mcq({
      id: "gate",
      prompt: md("Doubling the screen distance $v$ does what to the image?"),
      choices: [
        { text: "Halves its height", misconception: "inverse-magnification" },
        { text: "Doubles its height", correct: true },
        { text: "Leaves it unchanged", misconception: "no-magnification" },
      ],
      wrongFeedback: "Not quite — follow one ray from the top of the object and see where it lands.",
      onWrong: "move-screen",
      next: null,
    }),
  ],
});
```

Six beat kinds ship in the authoring DSL: `explain`, `animate`, `explorable`, `mcq`, `freeResponse`,
`branch`. A beat is a *type name plus JSON params* — which is why a model can write one, and why a
recorded lesson survives a reload. `goal` turns an explorable into a gate: while the goal is unmet
the `task` shows and Continue is hidden, so the learner advances by *doing* rather than by skipping.

## Three ways to drive it

All three go through one door — `Session.direct(commands, actor, capabilities)`. There is no
AI-specific path into the engine.

| | who drives | how |
| --- | --- | --- |
| **Authored** | you, ahead of time | `authoring/` — `defineLesson()`, deterministic, no network |
| **Taught live** | a human, mid-session | `teach/` — a second terminal over four HTTP endpoints |
| **Taught by a model** | a `Director`, mid-session | `forge/` — a tool-calling loop over the same commands |

A `Director` is a one-method interface:

```ts
interface Director {
  direct(req: DirectorRequest): Promise<DirectorCommand[]>;
}
```

`req` carries **one observation**: where the learner is, what is on their screen, what values they
set, what they asked, and the engine's verdict on the last turn. `formatObservation()` renders that
same observation for a human teacher's terminal and for a model's prompt, so the two cannot drift
apart. An empty command array is a legitimate answer — "they're fine, leave them alone".

### The command vocabulary

Fourteen ops, one union, one adjudicator:

```
say  revisit  goto                          — speak, re-show an earlier beat, jump
setControl  setControls  workspace          — move the learner's controls, pose the figure
focus  annotate  release  hold              — zoom the stage, draw on it, pace the learner
addBeat  patchBeat  rerouteBeat  setNext    — write and rewire the lesson graph
```

`say` and `revisit` are sugar the adjudicator expands into `addBeat` plus a return edge to wherever
the learner was — so answering a question with a beat and re-showing an old figure before coming
back are the same primitive. `focus` and `annotate` take normalized 0..1 stage coordinates, so one
implementation zooms an SVG figure, a Canvas2D viz and a WebGL apparatus alike.

`adjudicate()` plans a whole turn against a *shadow* chart and installs it in one assignment, so a
turn is atomic: one bad command means nothing applied and nothing recorded. A refused turn comes back
as a result the caller can act on, not as a crash. Structural edits are held to an invariant rather
than to trust — `reachesTerminal()` refuses any reroute that would leave the learner unable to
finish.

### Capabilities

```ts
session.direct(commands, "ai", SUPERVISED);
```

`FULL` (everything, uncapped), `SUPERVISED` (structural ops need a human), `OBSERVE_ONLY` (watch
only), or your own `{ name, allow, review, protect, maxPerTurn }`. Enforcement lives at the
adjudicator — one gate for all three tiers. `directorTools()` additionally withholds the
corresponding tools, so a model reads its regime off its own tool list instead of discovering it one
refusal at a time. A `review` refusal is distinguishable from a `denied` one, so a director can tell
"ask someone" from "never".

## Generate, freeze, replay

Every director turn is recorded as one `direction.command` event carrying the commands themselves.
`replay(lesson, history)` folds the log back through the pure interpreter and re-applies those edits
**as data** — added beats, rewired edges, moved controls and all. No model is called, no generator
runs, nothing is re-decided. A lesson a model improvised for one learner is a fixed artifact from the
moment it lands.

The headless checks pin this down: they replay AI-taught sessions against a stubbed completer that
counts its calls, and assert the count.

## Figures and animation

`figures/` is a declarative vocabulary in the shape of Manim's — `axes`, `numberLine`, `plot`,
`area`, `areaBetween`, `riemannRectangles`, `brace`, `grid`, `numberBox`, `polygon`, `star`, `arc`,
`dot`, `line`, `label` — with animation verbs `fadeIn`, `fadeOut`, `growFrom`, `drawOn`, `slideTo`,
`spin`, `indicate`, `colorTo`, `stagger`, `moveAlongPoints` over Manim's rate functions (`smooth`,
`smootherstep`, `rushInto`, `rushFrom`, `slowInto`, `thereAndBack`).

A storyboard is a pure function of beat time: `sampleAt(storyboard, t)` returns a `SceneSnapshot` —
a `SceneNode` list plus a viewBox — and `svg/` turns that into an SVG string. Because scenes are pure and sampled, the same figure
renders in the browser, in a headless check, and in a static snapshot
(`examples/rasterize.mjs` shells one out to a PNG).

Anything the declarative layer can't express drops to a registered `viz` — an arbitrary
Canvas2D/WebGL component (the pinhole example uses three.js) that reports the learner's *semantic*
gestures back on the same recorded channel as a slider. A drag becomes `demo.set { u, v }`, so it is
replayable state a director can observe, not a mouse event lost to the DOM.

## The template is data

Presentation is a separate object from the lesson. A **preset** pairs the geometry with a theme in
each mode, and swapping it re-lays-out and re-paints a *running* lesson with zero lesson edits:

```tsx
import { StudioView, TemplatePicker, ThemeToggle, useThemeMode } from "@lessonstudio/web";
import { resolvePreset } from "@lessonstudio/theme";

const { mode, setMode } = useThemeMode();          // OS default, then the learner's remembered choice
const [presetId, setPresetId] = React.useState("studio");
const { theme, layout } = resolvePreset(presetId, mode);

<StudioView
  program={program}
  theme={theme}
  layout={layout}
  actions={
    <>
      <TemplatePicker theme={theme} value={presetId} onChange={setPresetId} />
      <ThemeToggle theme={theme} mode={mode} onMode={setMode} />
    </>
  }
/>;
```

Two presets ship, each in dark and light — four presentations of the same beats:

| preset | geometry | reads like |
| --- | --- | --- |
| **`studio`** | split screen, figure always in view | an app: sans, glassy bars, chat bubbles, the log dimming behind you |
| **`paper`** | one column, figures inline in the flow | a textbook: serif, warm ground, numbered sections, flat prose, no bubbles |

`LS_ROOT=examples/split-demo npm run dev` is the demonstration — pick a preset, flip the mode, and
the lesson underneath never changes. `checks/theme.ts` asserts that mechanically: it walks the lesson
under all four themes and requires the render intents to come out **identical**.

### What a theme owns

`color` and `font` are the usual tokens. Three things are less usual:

- **`chrome`** — three switches that decide *kind* rather than shade: `turns` (`bubbles` | `flat`),
  `eyebrow` (`uppercase` | `numbered`), `stageFrame`. This is what makes `paper` an essay instead of
  the same chat log in beige. It is deliberately not a component-override system; a template that
  needs different *components* still goes through `defaultComponents`.
- **`figure`** — semantic roles a figure reads instead of naming a hex: `ink`, `muted`, `axis`,
  `highlight`, `onMark`, and a `series` array for categorical marks. `registerFigure` hands every
  figure the active theme, so one figure draws correctly on any ground.
- **`figure.palette`** — a per-theme re-map of the **named** palette. A `SceneNode`'s fill is baked in
  at authoring time (`palette.yellow` is already `#ffff00` before a theme exists), so `svg/` resolves
  each fill through this map on the way out: pure white titles become near-black ink on paper stock
  with no figure re-authored. The escape hatch is the absence of a name — an off-palette literal is
  never re-mapped, so an author who means exactly `#ff0055` gets it in every theme.

### Legibility is asserted, not eyeballed

`auditTheme(theme)` measures every token pair against WCAG, compositing translucent tokens over what
actually sits behind them, with thresholds **by role**: body ink at AAA, secondary ink at AA, data
marks at the 3:1 non-text bar, and two lower floors for structure — because a hairline axis is
*supposed* to recede, and holding it to 3:1 would make axes as loud as the data they frame. All four
shipped themes pass 66 rules each. A theme that puts white text on a light accent fails the check
rather than shipping.

### Colour that belongs to the lesson

A lesson may colour-key its symbols, so `v` is the same blue in the diagram and in the equation. That
is authored *meaning*, so the theme may not reassign it — but it still has to be legible in both
modes, and the TeX strings are built at module load, before any theme exists. So the lesson emits
`\htmlClass{ls-sym-v}{v}` and the host supplies the hues for the current mode via
`StudioView`'s `symbolColors` (KaTeX rejects `\textcolor{var(--x)}`, so a class is the only route).
`web/richtext.tsx` opens KaTeX's `trust` gate for exactly that one command and one class shape —
narrow on purpose, because `forge/` lets a *model* author beat text that reaches the same renderer.

## Using it in an app

```tsx
import { createSession, defaultRunner } from "@lessonstudio/lesson";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView } from "@lessonstudio/web";
import { directingRunner, httpToolCompleter, pickDirector } from "@lessonstudio/forge";
import { attachTeachClient } from "@lessonstudio/teach";
import { lesson } from "./lesson.js";

const director = pickDirector({ complete: httpToolCompleter("/api/direct") });

const program = createLiveProgram(
  createSession(lesson, { runner: directingRunner(lesson, director, { base: defaultRunner() }) }),
);

// Opt in to live teaching for this page (the pinhole example gates it behind `?teach`).
attachTeachClient(program.session);

<StudioView program={program} layout={{ split: true, stageBasis: "56%", stageSide: "left" }} />;
```

`createSession` is the whole engine; `createLiveProgram` is a clockless host that turns a session
into a frame; `StudioView` is one React view driven by that frame. Drop `forge` and `teach` from
those imports and the lesson still plays, deterministically — the engine knows the `Director`
interface, never who implements it.

## Teaching a live session

The teach CLIs default to `http://localhost:5188`, so start the dev server on that port (or set
`LS_TEACH_ORIGIN`), and open the page with `?teach`:

```bash
LS_ROOT=examples/pinhole npm run dev -- --port 5188     # then open http://localhost:5188/?teach
```

In a second terminal — logs out, commands in, no GUI:

```bash
tsx teach/cli/tail.ts                        # follow the session log; it is also `tail -f`-able on disk
tsx teach/cli/direct.ts obs                  # print the observation; sends nothing
tsx teach/cli/direct.ts say "Watch the ratio v/u as you drag."
tsx teach/cli/direct.ts set v=13             # re-pose the learner's own apparatus
tsx teach/cli/direct.ts focus --at .4,.55 --scale 3 --label "the two similar triangles"
tsx teach/cli/direct.ts mark arrow .3,.3 .5,.45 --label "this ray"
tsx teach/cli/direct.ts revisit flip --note "remember this"
```

Or hand the same interface to a model:

```bash
export ANTHROPIC_API_KEY=...
tsx forge/cli/ai_teach.ts                    # reactive: one turn per learner question
tsx forge/cli/ai_teach.ts --supervised --log
tsx forge/cli/ai_teach.ts --once --dry-run   # decide and print, send nothing
tsx forge/cli/ai_teach.ts --autonomous       # offer the director every learner action
```

`ai_teach.ts` is an ordinary client of the human teacher's four endpoints. That is the whole
third-tier claim, and it is a negative one: the model is a different client of the same interface,
not a second integration.

## Packages

Path aliases (see `tsconfig.json`), all in this repo, dependencies running one direction only.

One exception, and it is not stylistic: **a file the dev-server config can reach imports another
package by relative barrel path when it imports values** (`../../timeline/index.js`), because
`vite.config.ts` is loaded by plain Node — esbuild-bundled into `node_modules/.vite-temp/`, with
bare specifiers left external and Vite's own aliases not applied. `type` imports keep the alias;
they are erased before Node sees them. `checks/dev_config.ts` enforces this by loading the config
the way Vite loads it, because nothing else in the toolchain can: `tsc`, `tsx` and Vite itself all
resolve the alias, so the only symptom is `npm run dev` dying with `ERR_MODULE_NOT_FOUND` in a
generated file.

| package | lines | what it holds |
| --- | --- | --- |
| `@lessonstudio/state-machine` | 353 | the interpreter: pure hierarchical statechart, guards, actions, effects |
| `@lessonstudio/intents` | 297 | `RenderIntent`, `RichText`, the markdown + `$math$` parser |
| `@lessonstudio/timeline` | 822 | scene graph, storyboards, tweens, pure `sampleAt` |
| `@lessonstudio/figures` | 567 | the figure and animation vocabulary |
| `@lessonstudio/svg` | 254 | `SceneNode` → SVG string; the figure registry; the per-theme palette re-map |
| `@lessonstudio/audio` | 284 | TTS adapters, subtitles, content-hash cache |
| `@lessonstudio/lesson` | 3,982 | beats, compiler, `Session`, the direction protocol, replay |
| `@lessonstudio/authoring` | 87 | the authoring DSL |
| `@lessonstudio/teach` | 961 | the live-teacher bus, transports, `tail`/`direct` CLIs |
| `@lessonstudio/forge` | 1,452 | the AI director: generated tools, providers, drive loop |
| `@lessonstudio/live` | 152 | the clockless host: session → frame |
| `@lessonstudio/theme` | 750 | design tokens, template presets, the named palette, a contrast audit |
| `@lessonstudio/machine` | 898 | the statechart, drawn: layout, the live view, the cross-tab mirror |
| `@lessonstudio/web` | 1,900 | the React renderer (`StudioView`) |

The load-bearing edge is that **`lesson/` may not import `forge/`**. The engine knows the
`DirectorCommand` union it can safely execute and the `Director` interface — never who produces
them.

## Repository map

Every package is a directory with an `index.ts` barrel, and that barrel is the only thing another
package imports. Files below are listed in the order they build on each other.

### The pure core — no DOM, no clock, no network

**`state_machine/`** — a hierarchical statechart interpreter that knows nothing about lessons.

- `types.ts` — `Statechart`, `StateNode`, `Transition`, `StateValue`, `MachineEvent`, `Json`
- `registry.ts` — the named guards, actions and effect handlers a chart resolves against
- `interpreter.ts` — `start`, `transition`, `enter`, `snapshot`, `restore`; effects are returned, not run
- `effects.ts` — the `Effect` union: `persist`, `timer`, and whatever kinds the host adds
- `index.ts` — barrel

**`intents/`** — *what* to render, never how.

- `richtext.ts` — the `RichText` tree and the markdown + `$math$` parser (`text`, `md`, `article`, `math`)
- `intents.ts` — `RenderIntent`, `RenderModel`, `ControlSpec`, `Choice`, `VisualRef`: the slots a beat fills
- `index.ts` — barrel

**`timeline/`** — scenes as pure functions of time.

- `scene.ts` — `SceneNode`, `SceneSnapshot`, gradients, the animatable prop set
- `storyboard.ts` — `Storyboard`, `Tween`, `Easing`, camera keys
- `sample.ts` — `sampleAt(storyboard, t, values?)` and Manim's rate functions
- `bind.ts` — the closed expression AST (`$ref`, `$add`, … `$if`): a scene prop as arithmetic over control values, as JSON
- `vocabulary.ts` — `SCENE_VOCABULARY`: every node kind, animatable prop and easing, as data a director can be shown
- `intent.ts` — `sceneIntent` / `vizIntent` / `captionIntent` and their narrowing readers
- `index.ts` — barrel

**`figures/`** — the Manim-shaped drawing vocabulary, built on `timeline`.

- `coords.ts` — `makeFrame`: a box on the stage with its own units, so figures compose without pixel math
- `palette.ts` — re-exports the named colours from `theme/` (the theme owns colour, and may re-map it)
- `nodes.ts` — `axes`, `numberLine`, `plot`, `area`, `riemannRectangles`, `brace`, `grid`, `polygon`, `dot`, `label`, …
- `anim.ts` — the animation verbs (`fadeIn`, `growFrom`, `drawOn`, `slideTo`, `indicate`, `stagger`, …) as tween factories
- `index.ts` — barrel

**`svg/`**

- `svg.ts` — `snapshotToSvg`, plus the figure registry (`registerFigure`, `registerSceneFigure`, `getFigure`)
- `declarative.ts` — the one figure whose behaviour is entirely its props, so a *new interactive* demo is authorable as JSON
- `index.ts` — barrel

**`theme/`**

- `theme.ts` — design tokens (colour, type scale, spacing, `chrome`, `figure` roles) and the four shipped themes
- `palette.ts` — the named figure colours, their reverse index, and the role classes the audit uses
- `layout.ts` — `StudioLayout`: the split ratio and which side the stage sits on, as data
- `presets.ts` — `TemplatePreset`: a layout paired with a dark and a light theme; `PRESETS`, `resolvePreset`
- `contrast.ts` — pure WCAG contrast, alpha composited, plus `auditTheme` and its per-role thresholds
- `index.ts` — barrel

**`audio/`** — narration, adapter-shaped so the engine never names a vendor.

- `tts.ts` — `TtsAdapter`, `NarrationAudio`, `WordTiming`
- `align.ts` — character alignment → word timings
- `cache.ts` — content-hash keys (`narrationKey`) and a file cache
- `elevenlabs.ts` — the one real adapter
- `fake.ts` — a deterministic adapter for checks: silent bytes, plausible timings
- `sink.ts` — `AudioSink`, the play/pause surface a host implements
- `dev_tts.ts` — the Vite plugin behind `/api/tts`; the key lives here and never in the bundle
- `index.ts` — barrel

### The lesson layer

**`lesson/`** — beats, the compiler, the session, the direction protocol. It may not import `forge/`.

- `transcript.ts` — `projectTranscript`: the event log → the attributed turns the UI shows
- `graph.ts` — `chartGraph` / `lessonGraph`: every candidate on every edge, the projection a drawing can trust
- `lesson_sm/context.ts` — `LessonContext` (the blackboard) and `EventRecord`
- `lesson_sm/compile.ts` — `compileLesson`: beat specs → statechart + registry
- `beats/types.ts` — the `RenderableBeat` contract every beat kind implements
- `beats/explain.ts` — prose plus a figure; Continue advances
- `beats/animate.ts` — a storyboard played on the beat clock
- `beats/explorable.ts` — controls, a goal gate, `demo.set`, and the ask-anytime affordance
- `beats/mcq.ts` — choices, per-choice misconceptions, remediation edges
- `beats/freeresponse.ts` — a typed answer graded by a guard
- `beats/graded.ts` — the grading and wiring `mcq` and `freeResponse` share
- `beats/branch.ts` — a pure fork on the blackboard; renders nothing
- `beats/workspace.ts` — control state on the blackboard: `demoSet`, `readWorkspace`
- `beats/index.ts` — the beat-kind registry
- `runtime/session.ts` — `Session`, `createSession`, `defaultRunner`, `replay`
- `direction/protocol.ts` — the 14-op `DirectorCommand` union and the events it rides on
- `direction/capabilities.ts` — `Capabilities`, the three presets, `permits`, `needsReview`
- `direction/observe.ts` — `observe(session)`: the one observation all three tiers read
- `direction/catalog.ts` — the lesson's own map (`catalog`, `beatCard`), so a director can see what exists
- `direction/adjudicate.ts` — `adjudicate`: plan on a shadow chart, install in one assignment, or refuse
- `direction/schemas.ts` — `beatSchemas`: the params of every registered beat type, projected off the registry so the disclosure cannot drift
- `direction/format.ts` — `formatObservation` / `formatResult`: one renderer for terminal *and* prompt
- `policy/contracts.ts` — `LearnerModel`, `PolicyView`: pure folds over history, so replay rebuilds them free
- `policy/default_learner_model.ts` — the shipped heuristic: understanding / struggling
- `index.ts` (and one per subdirectory) — barrels

**`authoring/`** — tier 1.

- `dsl.ts` — `defineLesson`, `explain`, `animate`, `explorable`, `mcq`, `freeResponse`, `branch`
- `index.ts` — barrel

### Driving a live session

**`teach/`** — tier 2: a human teacher, over HTTP, with no GUI.

- `wire.ts` — the endpoint paths and the request/response shapes
- `bus.ts` — the in-process queue: commands in, verdicts and log lines out
- `transport.ts` — `DirectionTransport`, over the bus in-process or over HTTP
- `client.ts` — `attachTeachClient`: the page end of the wire
- `dev_bus.ts` — the Vite plugin that mounts `/api/session/*` and tees the log to disk
- `cli/tail.ts` — follow the session log in a terminal
- `cli/direct.ts` — `obs`, `say`, `set`, `focus`, `mark`, `revisit` from a terminal
- `index.ts` — barrel

**`forge/`** — tier 3: a model, through that same door.

- `tools.ts` — the 14 ops as provider-shaped tool specs, filtered by capability; `commandsFromCalls`
- `tool_call.ts` — the model transport: `ToolCompleter`, `anthropicToolCompleter`, `httpToolCompleter`
- `director.ts` — `pickDirector`, `claudeDirector`, `offlineDirector`, `directingRunner`, the system prompt
- `watch.ts` — the drive loop: wake on an observation, take one turn, report
- `dev_director.ts` — the Vite plugin behind `/api/direct`; resolves `auto` across Anthropic, Gemini and a local `claude` CLI
- `cli/ai_teach.ts` — the model as an ordinary client of tier 2's endpoints
- `index.ts` — barrel

**`live/`** — the clockless host.

- `frame.ts` — `LiveFrame`: everything a view needs for one paint
- `program.ts` — `createLiveProgram`: session events → frames, subscriptions out
- `index.ts` — barrel

**`web/`** — the React renderer: one view, driven by frames.

- `StudioView.tsx` — the studio shell: stage, prose, controls, transcript, narration
- `components/index.tsx` — the default beat components: prompt, choices, controls, answer box
- `components/SceneView.tsx` — samples a storyboard and paints it as inline SVG
- `components/VizView.tsx` — mounts a registered `viz` and keeps it alive across beats
- `components/CaptionView.tsx` — narration captions
- `conversation.tsx` — the attributed turn log (You / Tutor ✨ / Teacher)
- `Composer.tsx` — the always-on ask box
- `attention.tsx` — `focus` and `annotate`, painted over the stage in normalized coordinates
- `richtext.tsx` — `RichText` → React, with KaTeX for `$math$` and a one-command `trust` predicate
- `useThemeMode.ts` — dark/light as a learner preference: OS default, then a remembered choice
- `ThemeToggle.tsx` — `ThemeToggle` and `TemplatePicker`, for the `actions` slot
- `viz.ts` — the `viz` registry and the `VizApi` a custom visual implements
- `htmlAudioSink.ts` — `AudioSink` over an `<audio>` element
- `index.ts` — barrel

**`machine/`** — the statechart, drawn. Imports `lesson`, `timeline` and `theme`, never `web/`, so
the layout and the mirror are checkable headlessly.

- `layout.ts` — `layoutGraph`: three lanes (the spine, its detours, what the tutor added live), deterministic, no measurement
- `MachineView.tsx` — the SVG: the lit node, the travelled path, guards dashed and named, new beats badged
- `MachinePage.tsx` — the page around it: the event log, the last adjudication verdict, "waiting for a learner page"
- `mirror.ts` — `attachMachineMirror` / `subscribeMachine`: a `MachineSnapshot` over `BroadcastChannel`, one-way, with a `hello` for a tab that opens late
- `index.ts` — barrel

**`dev/`**

- `http.ts` — the request helpers the three Vite plugins share

### Checks, examples, and the rest

**`checks/`** — headless; no browser, no key.

- `run.ts` — the runner behind `npm run check`
- `smoke.ts` — compile, route on an answer, record history
- `convolution.ts` — storyboards sample to the figures they claim, and the 2-D kernels are correct
- `showcase.ts` — every animation verb actually animates
- `ask.ts` — ask → direct → adjudicate → resume, then replayed against a counting stub
- `direction.ts` — every op adjudicated, bad turns atomic, capabilities enforced at one gate
- `ai_teach.ts` — the AI path is the same path, with no credential near the page
- `theme.ts` — every theme complete and measurably legible; one lesson, identical intents under all four
- `graph.ts` — every candidate on every edge; a deterministic non-overlapping layout; a snapshot that is pure JSON and replay-stable
- `authoring_power.ts` — a director authors a new figure, and a new *interactive* figure, as pure JSON; malformed is refused atomically
- `dev_config.ts` — `vite.config.ts` loads under plain Node, and the two alias tables agree

**`examples/`** — each lesson directory is a Vite root: `index.html` + `App.tsx` + `lesson.ts`.

- `pinhole/lesson.ts` — 15 beats: a 3-D apparatus, narration, two gates, ask-anytime
- `pinhole/pinhole3d.ts` — the three.js `viz`; reports drags back as `demo.set`, not mouse events
- `pinhole/tutor.ts` — the tutor's brief, the offline answer, and `nativeVoice`: colour-keyed math and the apparatus posed at the learner's own numbers
- `pinhole/machine.tsx` — the `/machine.html` page: the statechart, live, in a second tab
- `pinhole/palette.ts` — one colour per symbol, shared by figure and prose
- `pinhole/App.tsx` — the embedding: session, director, and `?teach`
- `convolution/lesson.ts` — 15 beats: flip-and-slide, then real image filters
- `convolution/figures.ts`, `storyboards.ts` — the declarative figures and their animations
- `convolution/kernels.ts`, `convolve2d.ts` — the 2-D kernels and the interactive image `viz`
- `convolution/img/` — three sample photographs; see `CREDITS.md`, they are **not** MIT
- `split-demo/lesson.ts`, `convolution.ts` — the default example: the template as data, in three beats
- `split-demo/App.tsx` — the preset × mode showcase: two templates, dark and light, one lesson
- `shot-pinhole.mjs`, `shot-convolution.mjs`, `shot-teach.mjs`, `shot-split.mjs`, `shot-anim.mjs`, `shot-conv.mjs` — Puppeteer walks that drive a *running* dev server and assert on what rendered
- `_shot.mjs` — the shared screenshot harness
- `rasterize.mjs` — a standalone `.svg` → `.png`, for eyeballing a pure render

**Root**

- `package.json` — three scripts (`typecheck`, `check`, `dev`) and the dependency set
- `vite.config.ts` — the dev server: `LS_ROOT` picks the example, three plugins mount `/api/*`, aliases map `@lessonstudio/*` onto these directories
- `tsconfig.json` — strict, `noUncheckedIndexedAccess`, the same aliases
- [`docs/OVERVIEW.md`](docs/OVERVIEW.md) — the long-form design document: why the engine is shaped this way
- [`LICENSE`](LICENSE) — MIT

## Examples

```bash
LS_ROOT=examples/pinhole     npm run dev   # a 3-D apparatus, narration, an AI tutor, ask-anytime
LS_ROOT=examples/convolution npm run dev   # 15 beats: flip-and-slide, then real image filters
LS_ROOT=examples/split-demo  npm run dev   # the default: two templates × dark/light, one lesson
```

`examples/*.mjs` are Puppeteer walkthroughs that drive a *running* dev server and assert on what
actually rendered — figures, KaTeX, goal gates, narration requests, the teacher's wire. Each takes
the page URL as its first argument. WebGL under headless Chrome needs
`--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader`.

## Development

```bash
npm run typecheck    # tsc --noEmit, strict + noUncheckedIndexedAccess
npm run check        # all 7 checks
npm run check ask    # just one
```

The checks are headless, need no browser and no API key, and each prints what a pass proves:

| check | proves |
| --- | --- |
| `smoke` | the engine compiles, routes on answers and records history |
| `convolution` | storyboards sample to the figures they claim, and the 2-D kernels are correct |
| `showcase` | every animation verb in the vocabulary actually animates |
| `ask` | ask → direct → adjudicate → resume, replayed with the model called once per question |
| `direction` | every director op adjudicated, bad turns atomic, capabilities enforced at one gate |
| `ai_teach` | the AI path is the same path, with no credential near the page |
| `theme` | every shipped theme is complete and measurably legible, and one lesson renders identical intents under all four |

Requires Node 20+ (developed on 24).

### Environment

Everything runs with no keys at all: the deterministic director still answers questions and
narration falls back to silence, which is how the checks run. Keys only ever live in the dev server
process — the browser talks to `/api/direct` and `/api/tts` and never holds a credential.
`checks/ai_teach.ts` asserts exactly that.

| variable | effect |
| --- | --- |
| `LS_ROOT` | which example the dev server serves (default `examples/split-demo`) |
| `ANTHROPIC_API_KEY` | enables the live AI director |
| `GEMINI_API_KEY` | alternative provider for the same endpoint |
| `ELEVEN_LABS_API_KEY` | enables spoken narration (cached to `.audio-cache/` by content hash) |
| `LS_AI_PROVIDER` | pin `anthropic` \| `gemini` \| `claude-code` instead of `auto` |
| `GEMINI_MODEL`, `LS_CLAUDE_CODE_MODEL` | per-provider model override |
| `LS_TEACH_ORIGIN` | dev server origin for the teach CLIs (default `http://localhost:5188`) |

With no key the provider resolver picks in order: `anthropic`, `gemini`, then a local `claude` CLI if
one is on `PATH`.

## Status

Pre-1.0, and specific about it:

- A lesson compiles to a **flat** chart — one top-level state per beat. The interpreter supports
  nested compound states; the lesson compiler does not emit them.
- `rerouteBeat` rewrites an edge as a single *unguarded* transition. Rewiring a guarded or branching
  edge is not supported.
- `review` capabilities are a refusal carrying a reason, not an approval queue — nothing is held
  pending, because pending state that isn't in the history isn't replayable.
- There is no video export. Scenes are pure and rasterizable, but the timed export path was dropped
  in favour of a live, learner-paced runtime.
- The per-theme palette re-map keys on the **named** palette, so a figure that hardcodes an
  off-palette hex is not re-mapped. That is the documented escape hatch, not an oversight — but it
  does mean a figure author who wants theme-following colour has to name a role.
- `theme.chrome` is three switches, not a component-override system. A template that needs different
  *components* (a slide deck with no scrollback, say) still goes through `defaultComponents`.
- A registered `viz` gets `setTheme` and is asked to repaint in place rather than remount, so a viz
  that ignores it keeps its original colours through a mode switch. The engine cannot force the issue:
  a WebGL scene owns state (a camera pose) that a remount would destroy.
- Not published to npm. The `@lessonstudio/*` names are repo-local path aliases; clone the repo.

Contributions welcome. The bar for a change is the same as for the engine: if it makes a claim, add
the check that would fail without it.

## License

MIT — see [LICENSE](LICENSE).

The sample photographs in `examples/convolution/img/` are **not** covered by that license; see
[their credits file](examples/convolution/img/CREDITS.md).
