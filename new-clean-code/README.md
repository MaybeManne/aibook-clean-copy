# lessonStudio

A **high-level language for interactive lessons** — Manim, but rendered in the browser so
lessons are interactive. The **engine** half (`lesson/`, `authoring/`, `live/`) is deterministic,
replayable and browser-rendered; the **AI** half is quarantined in `forge/` — the future
`lessonForge` repo, already separated by an import boundary rather than by a checkout, so the engine
plays a lesson identically with it deleted.

**New here?** Start with [`docs/OVERVIEW.md`](docs/OVERVIEW.md) — the vision, objective, features and
applications, written for a senior engineer or a PM, with no implementation detail. Then
[`docs/ROADMAP.md`](docs/ROADMAP.md) for the architecture and milestones, and
[`docs/COMPARISON.md`](docs/COMPARISON.md) for how this was distilled from three prior attempts
(lessonkit, SocraticAI, activeReader).

## Status

- **M0 — scaffold + plan.** ✅ Done.
- **M1 — headless engine lifted.** ✅ Done & verified. `state_machine + render_contract + timeline +
  audio + lesson + live` transferred from lessonkit's spine (namespace `@lessonstudio/*`), pruned to
  one authoring surface. `tsc --noEmit` clean; `examples/smoke/headless.ts` passes (compile → route
  on answers → remediation branch → replay).
- **M2 — data-driven split-screen template.** ✅ Done & verified in-browser. Lifted the render
  layer (`template + scene_svg + render_web`, minus the video-clock views), made the split-screen
  geometry a swappable `StudioLayout` in the template DATA (no more hardcoded flex — the point-4
  fix), and drove it via the clockless `live` runtime. `examples/split-demo` is now an **interactive
  "But what is a convolution?" explorable**: two distributions + guiding text → a student-driven
  **slider** that flips-and-slides `g` across `f`, highlights the overlap products, and builds up the
  `(f∗g)` output bar-by-bar (a live `registerFigure` figure) → an MCQ check. Puppeteer confirms the
  split, live layout swap (left 50% / right 60% / single column) with zero lesson changes, KaTeX,
  the slider updating the figure live (math verified: `(f∗g)[2]=1.34`), and the event-sourced
  transcript. Run: `LS_ROOT=examples/split-demo vite`. Screenshots: `examples/shot-conv.mjs`.
  - *Scenes self-animate:* a `scene` intent carries its `Storyboard`, and `SceneView` runs a
    **local rAF clock** that plays it 0→duration on entry (past steps hold the final frame). So the
    clockless runtime shows real Manim-style motion without the heavy video transport. Verified: the
    demo's kernel dot slides left→right with easing (`examples/shot-anim.mjs`).
  - *Known live-path gap — CLOSED in M4.5:* a plain `explain` beat had no "Continue" affordance in the
    clockless model (the video model relied on the clock), so the demos used a debug Next button.
    `StudioView` now derives one for any beat that renders nothing into the `prompt` slot.
- **M3 — the visual vocabulary, reconciled against ManimCE.** ✅ Done & verified. `visuals/` maps
  math space onto the declarative scene graph as pure, export-safe `SceneNode`s: `coords`
  (Axes.coords_to_point, y-flipped for SVG), `nodes` (axes/numberLine/plot/area/areaBetween/
  **riemannRectangles**/polygon/star/arc/brace+braceTip), `anim` verbs (fadeIn/drawOn/slideTo/spin/
  indicate/stagger/moveAlongPoints), and a Manim-canonical rate-function set (`smooth` default +
  `smootherstep`/`rushInto`/`rushFrom`/`slowInto`/`thereAndBack`). Cross-checked against the real
  ManimCE docs (not the second-hand SocraticAI port). **Two correctness fixes fell out of it:**
  (1) `plot` now breaks at discontinuities into subpaths (Manim ParametricFunction) instead of
  drawing a line across an asymptote; (2) the sampler's `progress()` now applies easing at/after a
  tween's end, so non-monotonic rate functions like `thereAndBack` resolve (a one-tween `indicate`
  pulse returns to base instead of sticking at its peak). Shape factories build around a local
  origin so `scale`/`rotation` happen about the center, like Manim mobjects. `examples/showcase`
  asserts 9 geometry invariants through the same pure SVG path the exporter uses; verified visually
  (`examples/rasterize.mjs`). **ValueTracker/always_redraw → no new node kind** (a changing scalar
  is a control/param; per-frame recompute IS `sampleAt` + `registerFigure`; keeps export-safety).
  Run: `./node_modules/.bin/tsx examples/showcase/showcase.ts`.
- **M4 — the 3b1b reproduction slice** (fluency proof). ✅ Done & verified in-browser — reproduces the
  **narrative spine** of 3Blue1Brown's **"But what is a convolution?"**, not just the mechanical recipe.
  A **12-beat flow** walks the video's arc: **combine** (hook — three ways to combine `a=(1,2,3,4)`,
  `b=(5,6,7,8)`: add and multiply stay the same length, `∗` is the odd one out that mixes every pair and
  runs longer) → **dice** (goal-gated 6×6 sum grid — drag to the likeliest total; the highlighted
  diagonal is a convolution of the uniform die with itself, `P(sum=7)=6/36`) → **dice-formula** (that
  diagonal sum → the definition `(a∗b)[n]=Σₖ a[k]b[n−k]`) → **intro** (small worked example) → **flip**
  scene (b's ends arc-swap so it reads 6,5,4) → **slide** scene (the flipped strip slides under a; each
  output box pops in) → **explore gate** (a slider flips-and-slides b, floats `a[i]·b[j]`, fills the
  output row; goal-gated on shift 4) → **product-grid** (goal-gated 3×3 grid of `a_r·b_c` — its
  anti-diagonals ARE `a∗b=[4,13,28,27,18]`) → **polynomial** (the hidden identity: `∗` = multiplying
  `1+2x+3x²` by `4+5x+6x²`) → **MCQ** (wrong → step-by-step reteach) → **the 2-D image payoff** (three
  more beats, below) → **summary** (one operation, *many* faces). Colors match the video (a=blue, b=red,
  products=green, result=yellow).
  - *Refactor that made the two new grids cheap (done first):* a **`sceneFigure()`/`registerSceneFigure()`
    bridge** (`scene_svg`) lets a slider-driven figure be authored as declarative `SceneNode`s and drawn
    by the same pure snapshot renderer as the scripted scenes (no renderer changes), plus a **`grid()`
    primitive** (`visuals/`) with per-cell fill/value/highlight. `dice-grid` and `prod-grid` are built on
    this; `conv-setup`/`conv-boxes` stay raw `registerFigure`. `examples/convolution/verify.ts` asserts
    the math (incl. an independent `polyMul` identity), the flip/slide geometry, and both grids'
    highlight-counts + readouts through the same pure paths the browser uses (plus the 2-D kernel math
    below); Puppeteer walks all **16** beats end-to-end — figures, KaTeX, goal-gates, the image
    playgrounds (canvas drag+wheel→zoom round-trip, the kernel matrix editor + presets + "Custom"
    flip), and 14/14 narration clips (`examples/shot-m4.mjs`, **48/48**). Run:
    `LS_ROOT=examples/convolution vite`.
  - *Sampler contract surfaced by this slice:* `sampleAt` applies **every** tween and each overwrites
    its property, so the **last tween on a given (node, property) wins at all times** — even before
    its start (it writes its `from`). Sequential per-segment tweens (`moveAlongPoints`, or N stepwise
    slides on one node) therefore collapse to the last segment. The fix is **one tween per property
    per node**: the flip arc = x (smooth) + y (`thereAndBack` bump); the slide = one continuous
    x-tween with reveal times derived from the strip's linear position.
  - *The 2-D image payoff — the video's "hard visuals" (latest round):* a real 3×3 kernel sliding over a
    raster image, a **plug-and-try filter bank** (identity / box blur / Gaussian / sharpen / **Sobel
    edges**), and zoom — first on a code-built pixel-art sprite (the "an image is a grid of numbers"
    close-up, with the `1/9` weights and the one output pixel drawn), then on three real photos the learner
    switches between. Built as a Canvas2D **`registerViz("conv2d")`** (browser-only, `poster()` for export;
    pure edge-clamped kernel math in a DOM-free `kernels.ts` that `verify.ts` tests headless). Three beats —
    `image-2d` (closeup) → `image-blur` (a sweep wipe develops the blur) → `image-filters` (real photos).
    Added a reusable **`choice`** control (labelled picker buttons; value flows through the same `demo.set`
    channel as sliders, so 2 touch-points), and **fixed the sometimes-empty viz panel** — the four `explain`
    beats now drive a figure via `ExplainParams.viz` so the stage is never a black void while narration plays.
  - *Making the two image beats real PLAYGROUNDS (latest round):* the viz went from *showing* to
    *hands-on*, still fully declarative — every gesture leaves as a replayable `demo.set`. **`image-2d`**
    captures pointer + wheel on the canvas: **drag to place** the 3×3 window (`demo.set{kx,ky}`), **scroll
    to zoom** (coexisting with a zoom slider), with an eased follow-camera that tracks the placed window
    (frozen mid-drag, recentred on release). **`image-filters`** became a live kernel **EDITOR** via a new
    reusable **`matrix` control kind** (a grid of number-input cells + divisor + preset load buttons):
    per-cell edits are single-key `demo.set`, a preset load is one atomic **`demo.setMany`**, and the viz
    runs a **live custom linear convolution** from the nine weights ÷ divisor. One shared
    `EDITOR_PRESETS`/`matchPreset` in `kernels.ts` labels both the control and the canvas, so loading
    Gaussian never reads "Custom" on the picture; the editor seeds the **directional Sobel-X** (linear,
    div 1) while `summary` keeps the `|∇|` magnitude Sobel. The free editor/placement beats have no
    single-key goal, so they advance via a `__next` button.
- **M4.5 — the pinhole slice: audible narration + a live 3-D apparatus.** ✅ Done & verified
  in-browser (**41/41** checks then; the same walk now runs **62/62** with M5a's authoring loop
  folded in, `examples/shot-pinhole.mjs`). Rebuilds a 7.7K-line / 1.5 MB
  single-file reference explainer as `examples/pinhole/`: 13 beats across 5 parts, two gates with
  remediation detours that rejoin the main line, **real ElevenLabs narration** (13 clips, 143 s), and
  one persistent WebGL apparatus — object → barrier with a pinhole → screen, rays crossing at the
  hole to paint an inverted image of height `h' = h·v/u`. The learner can drag the tree or the screen
  along the optical axis, and that drag flows back into the session as `demo.set {u|v}`, so a
  manipulation is recorded, replayable state a policy can observe.
  - *Four engine gaps this slice closed:* **narration is now audible** (`StudioView` had always POSTed
    `/api/tts`, but nothing served it — `audio/dev_tts.ts` + a vite plugin answer it, key server-side,
    every line content-hash cached to `.audio-cache/`); a **first-class Continue affordance**, derived
    rather than authored, which retires the M2 gap below and both debug harnesses; **`VizIntent.persistent`**
    so one apparatus is shared instead of copied per turn (N turns of WebGL would exhaust the browser's
    ~16-context limit) and survives the gates, which contribute no stage content; and
    **`VizHandle.poster()`** so a canvas beat is not a hole in export.
  - *3-D decision (mirrors M3's ValueTracker one):* **no 3-D scene-graph node kind.** 3-D lives behind
    `registerViz`, and beats drive it with DECLARED STATE (`u`, `v`, camera, what's visible), never
    imperative verbs — the reference fired 11 GSAP verbs at a global timeline, which has no meaning in
    a clockless host where a beat may be entered by advancing, by a detour, or by replay. The viz eases
    between states using `easings` from `@lessonstudio/timeline`, so 3-D motion speaks the same Manim
    rate functions as every 2-D storyboard. Run: `LS_ROOT=examples/pinhole vite`.
- **M4.6 — colour-keyed symbols + a learner-facing narration control.** ✅ Done & verified in the same
  walk. The reference colour-codes every variable and keeps figure and prose in one hue;
  `examples/pinhole/palette.ts` is now the single source of that mapping — the WebGL sprite labels and
  the KaTeX `\textcolor{…}` read the same table, so a figure/prose divergence is no longer expressible.
  Colour lives with the lesson because it is authored CONTENT (*which symbol is this*), not `Theme`,
  which owns reusable roles.
  - **Pause the narration** — a control left of the Composer (or `P`). `AudioSink` grew
    `status()`/`subscribe()`, and the label is derived from the audio element itself, so it can never
    advertise "Pause" over silence an autoplay policy blocked. A pause is a STANDING preference, not a
    one-clip pause: later beats stay quiet (their clips still preload, so resuming is instant) until the
    learner resumes — one control, one meaning: narration on / off.
  - *Four markup leaks this exposed, all one bug:* authored strings reaching the DOM unparsed.
    `projectTranscript` wrapped a past turn's prose in `text()`, `explain` did the same for a string
    body, `explorable`'s ask-prompt too, and the gates printed feedback/hints literally — so an
    authored `$h' = h\,v/u$` showed its dollar signs. Each now uses the parser its own live renderer
    uses (`article` / `md`); learner-typed and engine-derived strings deliberately still do not parse.
    Separately, `parseRich` extracted math first and ran emphasis on each fragment, so a `**bold**`
    *wrapping* a `$math$` span never paired — it now masks math spans, runs emphasis over the whole
    line, and re-expands. The walk asserts both invariants: no literal `$…$` and no literal `**…**`
    anywhere in the accumulated transcript.
- **M5a — the live authoring loop: the learner asks, the agent AUTHORS a beat.** ✅ Done & verified
  headlessly (**58/58**, `examples/pinhole/authoring.ts`) and in the browser (the pinhole walk is now
  **62/62**). The always-on Composer used to be a dead end — it raised a `generate` effect nothing
  served. Now `message.submit` parks the learner on an **ephemeral "thinking" leaf** that clones the
  interrupted beat's viz (the workspace never blanks), `generatingRunner(author, defaultRunner())`
  hands the effect to a `LessonAuthor`, and the assembled beat rides back as a **`beat.generated`
  event** — so it is spliced in, entered, *and* recorded. **generate → freeze → replay:** a replayed
  session rebuilds the same answer from the log with the model never called again (a counting stub
  asserts the call count, so that claim is a test rather than a comment).
  - *The division of labour is the design* (`examples/pinhole/author.ts`): the **engine owns facts and
    structure** — the physics, the beat's id and type, where Continue returns to, and the learner's
    CURRENT apparatus state; the **model owns only voice**, one short paragraph. It cannot emit an
    invalid beat, reroute the lesson, or contradict a number, because it never produces any of those.
    So a bad generation degrades to flat prose, not a broken lesson. The numbers are appended by the
    engine as a colour-keyed footer through the same `palette.ts` the figure labels use — which is
    what makes a generated turn look native to the lesson instead of like a chat reply pasted in.
  - *Grounding is the whole point.* The walk asks its question one slider-drag into the explorable, so
    the answer must be about `v = 13` and `m = 13/7 = 1.86` — numbers that appear nowhere in the lesson
    source (the authored default is `v = 7`, `m = 1`). That state is exactly what a chat window beside
    the lesson structurally cannot see, and the engine structurally can.
  - *Interrupt for free.* Entering a new leaf makes in-flight generation stale, so a second question
    **drops** the first answer instead of yanking the learner back — while both questions stay in the
    log, because an interrupt is a discourse move, not an erasure. The two entry points differ on
    purpose: the Composer is an interruption (thinking leaf, then resume); an explorable's own ask box
    is a self-transition, so the learner keeps fiddling with the controls while the answer is authored.
  - *Keys stay server-side.* `/api/author` mirrors `/api/tts` — structurally-typed vite plugin, key in
    the dev process only, content-hash disk cache (`.author-cache/`). The browser talks only to the
    proxy, and the walk asserts that **no request to a provider host ever leaves the page**. With no
    `ANTHROPIC_API_KEY` the endpoint answers `{error}` and `claudeAuthor` assembles the plan's
    deterministic `fallbackText`, so the entire loop plays keyless — which is how it is verified here,
    and why every browser assertion is about what the engine owns rather than about the prose.
- **M5b — the module split, and a LIVE HUMAN TEACHER on a second screen (tier 2).** ✅ Done & verified
  headlessly (**126/126**, `examples/pinhole/direction.ts`) and in the browser (**71/71**,
  `examples/shot-teach.mjs`). `lesson/authoring/` had been four unrelated things wearing one name —
  the engine's stateful host, the human DSL, the live mutation protocol, and the LLM half — and
  `@lessonstudio/lesson` was handing out an Anthropic client. That is now the module cut in *Layout*
  below, landed as a behaviour-neutral move and re-verified before any feature work.
  - *The teacher is a programmer, so the interface is logs out, commands in* — not a GUI. One pure
    formatter renders the situation (active beat, live control values, the pending question, the
    verdict on the last batch) and the teacher answers with `DirectorCommand[]`:
    `direct say "look at the screen distance"`, `direct revisit flip`, `direct focus --scale 3
    --at .4,.55`, `direct set v=13`. Four polling endpoints, no WebSocket, no new dependency; the
    student's page stays authoritative and the log on disk is literally `tail -f`-able.
  - *Maximum flexibility, no new engine concepts.* `say` and `revisit` are **sugar the adjudicator
    expands** into `addBeat` + `next: <where the learner was>` — so answering with a beat and
    re-showing an earlier figure before coming back are the same primitive, and `revisit`'s clone of an
    existing beat is the reuse-a-visual affordance. `focus`/`annotate` take normalized 0..1 stage
    coordinates, so one implementation zooms an SVG figure, a Canvas2D viz and the WebGL apparatus.
  - *Atomic by shadow-charting.* A batch is adjudicated against a copy and committed only if every op
    survives, so a bad turn never reaches history — and a teacher-taught session replays from its log
    with no bus and no transport at all.
- **M5c — an AI TEACHER standing exactly where the human stood (tier 3), unrestricted.** ✅ Done &
  verified headlessly (**110/110**, `examples/pinhole/ai_teach.ts`). The claim is a *negative* one:
  there is no AI-specific path into a lesson. `tsx forge/cli/ai_teach.ts` is the same program as
  `tsx teach/cli/direct.ts` with the human replaced — same four endpoints, same observation text,
  same verdicts. Tier 3 needed a loop, not an integration, which is what tier 2 being
  logs-in/commands-out bought.
  - *The tool surface IS the command union.* One `Record<DirectorOp, ToolEntry>` generates the model's
    tools, so the compiler refuses an op that has no tool: the vocabulary cannot drift, and adding an
    op stays one edit. Reactive by default (a question is a request for a teacher, one model call per
    question); autonomous — offer the director *every* learner action — is opt-in, because it spends a
    call per gesture and would make the browser walks nondeterministic.
  - *Unrestricted now, limitable later, and that is a config value.* `capabilities: FULL` sets no cap;
    `SUPERVISED`/`OBSERVE_ONLY` already work, refused at the engine's single gate. A withheld tool is
    an explanation to the model; the refusal is still the adjudicator's.
  - *Freeze still holds.* A director's turn rides in one recorded event carrying its actor, so
    `replay()` rebuilds an AI-taught session with the provider unreachable, attributed to the agent.
- **M5 — productionize the AI seam + export the IR JSON Schema** (the contract lessonForge targets).
  Also open: single-file/offline export, a `barChart` visuals factory, and rewind-by-transcript-prefix.

## Dev setup

No system Node on this machine — reuse the conda Node 22 from the sibling `lessonkit` checkout.
Dependencies are this repo's own (`node_modules` was originally symlinked to lessonkit's; the first
`npm install` here replaced it with a real tree, which is the correct end state):

```bash
export PATH="/proj/long-multi/shaden/lessonkit/.conda-node/bin:$PATH"
npm install                                          # react, katex, three, puppeteer, vite
./node_modules/.bin/tsc --noEmit                     # typecheck the engine
./node_modules/.bin/tsx examples/smoke/headless.ts   # headless smoke test
```

Audible narration needs `ELEVEN_LABS_API_KEY` in the environment; clips are cached under
`.audio-cache/`, so a line is synthesized once and later runs are offline. Without the key the
narration pipeline still runs, silently. Browser checks need swiftshader for WebGL:
`--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader`.

To teach a running lesson — one dev server, then a second terminal. Every key stays in the dev
process, and with no `ANTHROPIC_API_KEY` all three tiers still play (the model's judgement is the
only thing stubbed):

```bash
LS_ROOT=examples/pinhole ./node_modules/.bin/vite --port 5188   # the student's page

./node_modules/.bin/tsx teach/cli/tail.ts                      # tier 2: watch the session
./node_modules/.bin/tsx teach/cli/direct.ts say "look at the screen distance"
./node_modules/.bin/tsx forge/cli/ai_teach.ts                  # tier 3: a model does both
./node_modules/.bin/tsx forge/cli/ai_teach.ts --dry-run        #   …decide and print, send nothing
```

Two dev servers at once is fine: each `LS_ROOT` gets its own dep-optimizer cache under
`node_modules/.vite/<root>/`, since Vite's default is one cache per package and the roots do not
share a dependency set.

## Layout

```
state_machine/    pure hierarchical statechart (imports nothing)
render_contract/  RenderIntent / RichText / slots (imports nothing)
timeline/         scene graph + Storyboard + pure sampleAt
visuals/          mobject + animation library, on the declarative scene graph
scene_svg/        declarative SceneNode figures, drawn by the pure snapshot renderer
audio/            TTS + word-alignment + subtitles + cache
lesson/           THE ENGINE — deterministic, replayable, no LLM
  lesson_sm/        beat IR + compile→statechart
  beats/            beat definitions + shared workspace wiring
  runtime/          Session — the stateful host (event-sourced, replayable)
  direction/        the DirectorCommand union · adjudicate · capabilities · catalog ·
                      observe · format   (what a teacher may do, and what they see)
  policy/           Perceive/Decide contracts
authoring/        TIER 1 — defineLesson + beat sugar + narrate precompile. PURE, offline.
teach/            TIER 2 — the live human teacher: dev bus (log + command queue),
                    browser client, `tail`/`direct` CLIs
forge/            TIER 3 — the AI half: LLM seam, prompt plans, Claude author, the AI
                    TEACHER (tools generated from the command union) + dev proxies
live/             the one runtime — clockless co-play (learner + agent both emit events)
template/         data-driven Template<R> — the split-screen default
rendering/        render_web — one React view driven by the template
examples/         smoke test, the 3b1b convolution slice, the pinhole slice
```

Everything is a strict one-directional dependency DAG (the invariant carried over from lessonkit,
verified). One authoring surface: `defineLesson({ flow: [...] })` — the same JSON IR an LLM emits.

The load-bearing edge is that **`lesson/` may not import `forge/`**. The engine knows the
`DirectorCommand` union it can safely execute and the `Director`/`LessonAuthor` interfaces — never
who produces them. So a lesson plays identically with `forge/` deleted, and the three teaching
tiers are one seam with three clients:

| tier | who teaches | how it reaches the lesson |
|---|---|---|
| 1 | a human author, offline | `authoring/` → frozen IR, deterministic (Manim-style) |
| 2 | a live human teacher, watching | logs out, `DirectorCommand[]` in, over `teach/`'s four endpoints |
| 3 | a model | the same four endpoints — `forge/`'s tools ARE that command union |

Tier 3 is "run the other client", not a second integration: `tsx forge/cli/ai_teach.ts` stands
exactly where `tsx teach/cli/direct.ts` stood. And because a director's turn rides in one recorded
event, `replay()` rebuilds an AI-taught session with the model never called again.
