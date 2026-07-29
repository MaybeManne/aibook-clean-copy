# lessonStudio — Architecture & Roadmap

*Written 2026-07-27. See [COMPARISON.md](./COMPARISON.md) for the prior-art salvage rationale.*

## The vision (restated)

A **high-level language for interactive lessons** — Manim, but rendered in the browser so lessons
are interactive. Five pillars (the user's framing):

1. **Manim-but-browser, interactive.** A declarative visual + narrative language; plays in the browser.
2. **Deterministic flow that bends on student answers.** Not a linear video — a pre-defined flow
   graph. Wrong answer → remediation/recap rather than "next step."
3. **Author specifies text + audio + visuals/interactive demos.** Visuals from our library
   (3b1b-style) OR raw HTML/JS (author freedom). Audio = recorded OR TTS (ElevenLabs).
4. **Template SEPARATE from lesson.** Writing the lesson spec renders it directly; changing the
   template/colors is independent. Default template = split-screen (visuals | markdown+KaTeX+math steps).
5. **AI authors/adapts in real time.** Start from a human-authored plan; an LLM adjusts it live
   based on student performance. Feedback is generic (typed text, free-form answers, gaze, …).

**Acceptance test for fluency:** take one 3Blue1Brown video's source and reproduce it in the
browser (interactive). "Perfect reproduction" = a viewer accepts it as "that video, but now I can
pause and answer" — visual + narrative fidelity, NOT pixel-identical frames.

## The two-repo cut

The boundary is the **JSON IR + the `LessonAuthor`/`Director` seams** — the generate/freeze/replay
line made physical.

```
  lessonStudio/   the ENGINE / language ("Manim+++")
                  deterministic · replayable · browser-rendered · plays frozen artifacts
                  PUBLIC CONTRACT: a JSON Schema for the lesson IR
        │
        │  IR (JSON) in  ◄────────────  authored/generated lessons
        │  LessonAuthor seam (live)
        ▼
  lessonForge/    the AGENT / PIPELINE repo   (name TBD)
                  non-deterministic GENERATION built on SocraticAI's pipeline pattern:
                  agents emit schema-validated IR → deterministic assembler → screenshot reviewer
                  → guard/retry. Both the OFFLINE authoring pipeline AND the runtime real-time
                  adaptation loop hit lessonStudio through the SAME LessonAuthor seam
                  (offline authoring and live tutoring = the same API at different speeds).
```

lessonStudio is built now. **The cut is already made — as an import boundary rather than as two
checkouts**: the AI half lives in `forge/`, `@lessonstudio/lesson` exports none of it, and nothing
in the engine is reachable from it, so `forge/` reaches the engine only through its public surface
the way a third party would. Splitting the repos is therefore a directory move plus a package.json,
deferred until there is a reason to pay for two release cycles. Two properties keep it honest, and
both are asserted headlessly: a lesson plays identically with `forge/` deleted, and an AI-taught
session replays with the provider unreachable.

## lessonStudio layer plan

Lifted from lessonkit's sound spine, pruned to one path per job, namespace `@lessonstudio/*`.
The dependency graph stays a strict one-directional DAG (verified invariant carried over).

```
  state_machine/     pure hierarchical statechart (imports nothing)
  render_contract/   RenderIntent / RichText / slots (imports nothing)
  timeline/          scene graph + Storyboard + pure sampleAt (deps: render_contract)
  visuals/           ◄ NEW: mobject + anim library grafted from SocraticAI, re-homed
                       onto the declarative scene graph (deps: timeline)
  audio/             TTS + word-alignment + subtitles + cache (deps: timeline, render_contract)
  lesson/            THE ENGINE: beats, compile→statechart, `runtime/` Session host,
                       `direction/` (the DirectorCommand union + adjudicate +
                       capabilities + observe/format), `policy/` (deps: below only)
                       — deterministic, replayable, and it may NOT import forge/
  authoring/         TIER 1: defineLesson + beat sugar + narrate precompile. PURE.
  teach/             TIER 2: the live human teacher — dev bus (log + command queue),
                       browser client, tail/direct CLIs (deps: lesson)
  forge/             TIER 3: the AI half — LLM seam, prompt plans, Claude author, the
                       AI teacher, dev proxies. The `lessonForge` repo, in place.
  live/              clockless co-play runtime — the ONE runtime (deps: lesson, ...)
  template/          data-driven Template<R> — the REAL split-screen default (deps: render_contract)
  render_web/        ONE React view driven by the template (deps: template, live, ...)
  examples/          the 3b1b slice + smoke tests
```

Decisions vs. lessonkit:
- **One authoring surface**: `defineLesson({flow:[...]})` (the literal = the AI/IR API). Drop
  `lesson/authoring/builder.ts`. A fluent human builder can come back later if wanted.
- **One runtime**: clockless `live/`. Defer the clocked `video/` transport + mp4 export behind a
  plugin (only needed if offline export becomes a launch requirement).
- **One view**: merge `VideoView`+`StudioView` into a single view driven by a real data-driven
  `Template<R>` split-screen. No hardcoded flex.
- **One viz registry**: unify `registerFigure`/`registerViz` under one API with an
  `exportable?` capability flag.
- **Close activeReader's gaps**: routing is a function of the learner model; event log is the one
  source of truth and is replayed (already true in lessonkit — keep); one reducer/policy loop.

## Milestones

- **M0 — scaffold + save plan.** Repo, config, docs, memory. *(in progress)*
- **M1 — lift the headless engine.** Copy `state_machine + render_contract + timeline + audio +
  lesson + live`, drop the duplicate builder, rename namespace, get `tsc --noEmit` clean with no
  renderer. Proves the spine transfers.
- **M2 — the real split-screen template.** One data-driven `Template<R>` (default: visuals |
  md+KaTeX), one merged React view. Delete the hardcoded-layout duplication.
- **M3 — graft the visual vocabulary.** Build `visuals/` onto the declarative scene graph, then
  **reconcile it against authoritative ManimCE** (the real reference, not the second-hand SocraticAI
  port): `coords` (Axes.coords_to_point, y-flipped for SVG), `nodes` (axes/numberLine/plot/area/
  areaBetween/**riemannRectangles**/polygon/star/arc/brace+braceTip), `anim` verbs, and the rate-
  function set (`smooth` default + `smootherstep`/`rushInto`/`rushFrom`/`slowInto`/`thereAndBack`).
  Fixes from the reconciliation: `plot` breaks at discontinuities into subpaths; `get_area` defaults
  (blue, opacity 0.3); Riemann rectangles added (the discrete-sum → integral bridge convolution needs).
  - **ValueTracker / always_redraw decision:** NO new scene-graph node kind. Manim's per-frame
    recompute maps onto what we already have — a changing scalar is a control/param value, and
    "recompute from it every frame" IS the pure `sampleAt` sampler (declarative scenes) or a
    `registerFigure` figure (whole-figure recompute). Adding an executable/computed node would break
    the pure-data, export-safe invariant. M4's continuous convolution reshaping uses `registerFigure`
    recomputing from the slider's shift value each frame (the working pattern from the M2 demo).
- **M4 — the 3b1b slice.** **TARGET LOCKED: "But what is a convolution?"** (2D, iconic, moderate).
  Sliding/flipping windows, a moving overlap region, a probability-distribution example. Drives M3's
  primitive priorities: `moveAlongPath` + `transform`/`morphTo` + draw-on + a discrete stem/bar plot
  + a shaded overlap region. Reproduce it end-to-end (visuals + narration + one interactive gate).
  ✅ **Done & verified — now the full NARRATIVE SPINE, not just the recipe.** The first pass reproduced
  only the mechanical `SimpleExample` (`(1,2,3)∗(4,5,6)=[4,13,28,27,18]`); on review that read as "how to
  convolve two vectors," not the video. Expanded to walk the video's arc as a **12-beat flow**
  (`examples/convolution/`): **combine** (hook: three ways to combine `a=(1,2,3,4)`,`b=(5,6,7,8)` — add
  and multiply give same-length lists, ∗ is the odd one out that mixes every pair) → **dice** (goal-gated
  6×6 sum grid: drag to the likeliest total; the diagonal count IS a convolution of the die with itself)
  → **dice-formula** (the diagonal sum → the definition) → **intro** → **flip** → **slide** → **explore**
  (goal-gated shift, `conv-boxes`) → **product-grid** (goal-gated 3×3 grid: its anti-diagonals ARE `a∗b`)
  → **polynomial** (convolution = polynomial multiplication) → MCQ (wrong → reteach) → summary. Reads as
  *what ∗ IS → why it matters (probability) → how to compute it → its hidden identity*.
  - **Refactor that made it cheap (did this first):** two figure vocabularies existed — scripted
    `SceneNode` scenes (drawn by the one pure `snapshotToSvgInner`) and interactive `registerFigure`
    figures that had to hand-roll raw SVG strings. Added a **`sceneFigure()`/`registerSceneFigure()`
    bridge** (`scene_svg/svg.ts`) so a slider-driven figure is authored as `SceneNode`s and rendered
    through the SAME drawer (zero renderer changes — `VizView` injects the string as-is), plus a
    **`grid()` primitive** (`visuals/nodes.ts`) with per-cell fill/label/highlight (highlight = an
    overlaid stroked rounded-rect `path`, since `rect` takes no stroke). `dice-grid` + `prod-grid` are
    ~40 lines each on this surface instead of ~150 of hand-rolled SVG. `conv-setup`/`conv-boxes` left as
    raw `registerFigure` (unchanged). Scenes = pure `Storyboard`s (`storyboards.ts`) on `SceneView`'s rAF
    clock. Headless check (`verify.ts`, ~63 assertions through the pure `sampleAt`+SVG paths: hook math,
    `buildCombine` reveal, dice/prod highlight-counts + readouts, an INDEPENDENT `polyMul` identity) +
    Puppeteer flow (`shot-m4.mjs`, **26/26**, all 12 beats, goal-gates, KaTeX, 11/11 narration clips).
  - **Sampler contract nailed down (feeds M5 authoring/schema):** `sampleAt` applies every tween and
    each OVERWRITES its property, so the LAST tween on a `(node, property)` wins at all times — even
    before its start (it writes its `from`). ⇒ sequential per-segment tweens (`moveAlongPoints`, or
    N stepwise slides on one node) collapse to the last segment. Rule: **one tween per property per
    node.** Flip arc = x (smooth) + y (`thereAndBack`). Slide = one continuous x-tween, reveals timed
    off the linear position. New staple primitive `visuals/numberBox` (centered value box that
    slides/scales/highlights about its center).
  - **The 2-D image payoff — the "hard visuals" (this round). ✅ Done & verified (16 beats, 39/39).**
    On review the abstract half was solid but the video's iconic *image-processing* half was missing —
    *"you haven't done any of the hard visuals 3b1b did: convolution with real images, plug-and-try
    filters (blur, Sobel…), zoom in/out"* — and the viz panel *"is sometimes empty."* Both fixed:
    - **A raster viz behind `registerViz("conv2d")`** (`examples/convolution/convolve2d.ts`) — the
      Canvas2D escape hatch (`getImageData`/`putImageData`), browser-only, DECLARATIVE like the pinhole
      apparatus: a beat states `image`/`filter`/`zoom`/`mode`/`sweep` and the viz eases toward it (reusing
      `easings` from `@lessonstudio/timeline`), so it survives advance / wrong-answer detour / replay. It
      never takes a verb. `poster()` → `canvas.toDataURL()` closes the export/screenshot hole. The pure
      kernel math lives in a **DOM-free `kernels.ts`** (`KERNELS` = identity / box blur / Gaussian /
      sharpen / Sobel edges; edge-clamped `convolve2d`; a code-built `pixelArtSprite`) so `verify.ts`
      tests it headless through the SAME path the browser runs.
    - **3 new beats:** `image-2d` (closeup — a 3×3 box-blur window panning over the zoomed pixel-art
      sprite with its `1/9` weights drawn + the single output-pixel swatch: the "an image is a grid of
      numbers" intuition), `image-blur` (a `sweep` wipe develops the blurred sprite left→right), and
      `image-filters` (the 3 real photos + the full 5-filter plug-and-try, a zoom slider, source|output
      side-by-side; goal-gated on picking **Edges** so the edge-detect "aha" always lands).
    - **A reusable `choice` control kind** (labelled picker buttons) — 2 real touch-points
      (`render_contract/intents.ts` union + `ControlsComp` renderer); its value flows through the exact
      `demo.set {key,value}` → `readMerged` → viz-props channel the slider/toggle already use, so no
      explorable/goal-check change. Selected option gets accent fill + `aria-pressed`.
    - **Empty-panel fix:** the four `explain` beats declared no `viz`, so the split layout reserved a
      black void while the explanation was spoken. Each now drives a figure via `ExplainParams.viz`
      (dice-formula→dice-grid, polynomial→prod-grid, reteach→conv-boxes, summary→the persistent conv2d),
      leaning on the M4.5 "remember the last persistent viz across stage-less beats" behaviour.
    - **Images:** 3 web photos the user supplied (`img/{einstein,city,coffee}.jpg`), downscaled to 480px
      and served by Vite at `/img/*` (`MAXDIM=200` downscale again in-viz per frame). *Upload-your-own*
      is a recorded future item (see Deferred), not built now.
  - **Making the two image beats real PLAYGROUNDS (this round). ✅ Done & verified (48/48).**
    The payoff *showed* but the learner couldn't *touch*: `image-2d` auto-panned the window via
    `Math.sin` with a fixed authored zoom, and `image-filters` only let you pick one of five presets.
    On the user's ask — *"toggle the kernel place, zoom … themselves … see the kernel size and
    values, manipulate them, or define their own"* — both became hands-on, still fully declarative
    (every gesture leaves as a replayable `demo.set`, the same channel a slider uses):
    - **`image-2d` → a gesture PLAYGROUND.** The `conv2d` viz now captures pointer + wheel on its own
      canvas (the pinhole precedent): **drag to place** the 3×3 window (emits `demo.set{kx,ky}`),
      **scroll to zoom** (`demo.set{zoom}`, clamped 1–8, coexisting with a discoverable zoom slider),
      and when zoomed an **eased follow-camera** glides to the placed window — frozen mid-drag so
      placement can't chase itself, recentred on `pointerup`. Guarded to `mode==="closeup"` so a
      compare-mode drag never emits `kx/ky`; `setPointerCapture` wrapped in try/catch (synthetic
      test events aren't capturable); listeners torn down in `destroy()`.
    - **`image-filters` → a live kernel EDITOR** via a new reusable **`matrix` control kind** (a CSS
      grid of `<input type=number>` cells + a divisor + preset **load** buttons; 3 touch-points:
      `ControlSpec` union in `render_contract/intents.ts`, a `ControlsComp` branch before the slider
      fallback, and `readMerged` seeding in `explorable.ts`). A per-cell edit is a single-key
      `demo.set`; a preset load is **one atomic `demo.setMany`** (`{values: Record}`) — the new
      matching self-transition/action added alongside `demo.set`. The displayed name is **derived**
      (pure fn of the current weights+div → a preset label, else "Custom"), so it's replay-safe with
      no extra state key. The viz drops the KERNELS-index lookup for a **live custom linear
      convolution** built from `k0..k8 ÷ kdiv`, memo-keyed on the weights so a single-cell edit
      reconvolves.
    - **One label source (no drift).** `kernels.ts` now exports `EDITOR_PRESETS` + `matchPreset()`;
      the lesson builds the control's `presets` from it and the viz labels its output with it, so
      loading Gaussian reads "Gaussian" on the picture *and* in the panel — never a contradictory
      "Custom".
    - **Directional vs magnitude Sobel:** the editor seeds **Sobel-X** (the signed linear gradient,
      div 1) so it stays uniformly a linear 3×3+divisor kernel; the `summary` recap keeps the full
      `|∇|` magnitude Sobel, reconciled by one prose line. The built-in `goal` is single-key only, so
      the free editor/placement beats use a `__next` Continue button (no goal) instead.
    - **Verified:** `tsc` clean; `verify.ts` adds custom-identity/box/Sobel-X + `matchPreset` asserts
      (Sobel-X→"Sobel-X" not "Edges (Sobel)"); `shot-m4.mjs` drives the drag+wheel→zoom round-trip and
      the matrix cells/presets/"Custom" flip — **48/48**, 14/14 narration clips, no page errors.
- **M4.5 — the pinhole slice: audible narration + a live 3-D apparatus.** ✅ **Done & verified.**
  Reproduced the reference single-file explainer (`../pinhole_3d.html`, 7.7K lines / 1.5 MB) as
  `examples/pinhole/` — 13 beats, 2 gates with remediation detours, one WebGL apparatus, real
  ElevenLabs narration. Puppeteer walk `examples/shot-pinhole.mjs`: **41/41** checks, 13 clips /
  143.5 s of audio. Four things landed, each of which was a genuine gap rather than lesson content:
  - **Narration is actually audible.** `StudioView.useNarration` had always POSTed `/api/tts`, but
    nothing served it — every clip silently 404'd. `audio/dev_tts.ts` (+ the vite plugin) answers it:
    the key stays server-side and every line is content-hash cached to `.audio-cache/`, so a line is
    billed once and later runs are offline. No key ⇒ the silent fake adapter, degrading honestly.
  - **A first-class Continue affordance** (was an M5 item; promoted because a 13-beat narrated lesson
    is unplayable without it). DERIVED, not authored: a beat that renders nothing into the `prompt`
    slot gets a Continue button + `Enter`/`→`/`Space`. Beats that own their advance (mcq/freeResponse
    Continue, explorable `__next`) render into `prompt` and so suppress it automatically. Never
    auto-advances on audio end — the learner sets the pace. The debug harnesses are deleted.
  - **`VizIntent.persistent`** — one shared apparatus instead of a copy per turn. The conversation log
    re-renders every past turn's stage (that filmstrip IS the step-by-step video), which is free for an
    SVG figure and fatal for WebGL: N turns ⇒ N contexts ⇒ the browser's ~16-context ceiling. A
    persistent viz lives only in the workspace panel, and StudioView **remembers** it so it survives
    beats that contribute no stage content — i.e. the gates. (The reference file needed a bespoke
    "keep the split view during gates" monkeypatch for the same problem.)
  - **`ExplainParams.viz`** so a narration beat can drive the apparatus, and **`VizHandle.poster()`**
    so a canvas/WebGL beat is not a hole in export or in lessonForge's screenshot review.
  - **3-D DECISION (mirrors the ValueTracker one): no 3-D scene-graph node kind, ever.** 3-D lives
    behind `registerViz` — browser-only, opaque to the engine, `poster()` for export. The apparatus is
    driven by DECLARED STATE, never verbs: the reference lesson fired 11 imperative GSAP verbs
    (`frame`/`showRays`/`moveScreen`/…) at a global timeline, which cannot survive a clockless host
    where a beat may be entered by advancing, by a wrong answer's detour, or by replay. Each beat
    instead states the target (`yaw/pitch/radius`, `u`, `v`, `rays/image/labels`, `highlight`, `grab`)
    and the viz eases there, reusing `easings` from `@lessonstudio/timeline` so 3-D motion speaks the
    same Manim rate functions as every 2-D storyboard. The learner's drag flows OUT as
    `demo.set {u|v}` — a manipulation becomes recorded, replayable state a policy can observe, where
    the reference wired the same drag to a local callback nothing could see. Camera angle stays in.
  - **Cards: five of the reference's six card types were not built,** on purpose. `title`/`recap`/
    `split`/`derivation`/`graph` are prose structure or existing `visuals/`, and `article()` already
    parses headings, lists, callouts and `$…$`/`$$…$$`. A dedicated `steps` RichNode for derivations
    stays optional; a `barChart` factory in `visuals/` is the one addition still worth making.
- **M4.6 — colour-keyed symbols + a narration control.** ✅ **Done & verified** (same walk, now 41
  checks — 6 of them narration pause/resume, 3 of them markup/colour invariants).
  - **One palette, two renderers.** `examples/pinhole/palette.ts` maps symbol → hex and hands the same
    value to the WebGL sprite labels and to KaTeX via `tex("hp")` ⇒ `\textcolor{#f87171}{h'}`. The
    reference kept figure and prose in one hue by hand; here it is structural — a divergence cannot be
    written. Deliberately NOT in `Theme`: a theme owns reusable roles (accent, muted), while "`v` is
    sky-blue in this lesson" is authored content that travels with the lesson. `ControlSpec.label` is
    a plain string, so slider labels stay uncoloured — as they are in the reference too.
  - **A learner-facing pause.** `AudioSink` grew optional `status()` + `subscribe()`; `htmlAudioSink`
    and `speechSink` implement them over the element's own `play`/`pause`/`ended` events, and the
    button's label is DERIVED from that status, so it cannot claim "Pause" over autoplay-blocked
    silence. Semantics chosen deliberately: pausing is a STANDING preference (later beats stay quiet,
    clips still preload so resume is instant), because a learner who wants silence should not be
    re-interrupted by the next beat. Sits left of the Composer — the one row that is never optional.
  - **The markup bug this exposed, four times over.** Authored strings were reaching the DOM unparsed:
    `projectTranscript` wrapped a past turn's prose in `text()`, `explain` did the same for a string
    body, `explorable`'s ask-prompt too, and mcq/freeResponse printed `feedback`/`hint` literally — so
    a coloured `$h' = h\,v/u$` rendered as raw dollar signs and `\textcolor{…}` in the log while the
    live block above it rendered correctly. Rule now: **authored** strings parse with the same parser
    their live renderer uses (`article` for prose, `md` for a one-line prompt); **learner-typed and
    engine-derived** strings stay `text()` (content, not markup — and never reinterpreted).
  - **`parseRich` couldn't emphasise across math.** It extracted `$…$` first and ran `**bold**`
    matching on each surrounding fragment independently, so `**Push the screen out to $v \ge 12$**`
    left both `**` unpaired and printed them. Now math spans are masked with a NUL placeholder,
    emphasis runs over the whole line, and the math is re-expanded inheriting the run's marks.
  - The walk asserts both as invariants over the accumulated transcript (no literal `$…$`, no literal
    `**…**`), which is what caught all of the above. Its `mark()`/`tailMatch()` helper also had to stop
    diffing by LENGTH: the page ends in chrome that mutates in place, so the old snapshot is not a
    prefix of the new one and the slice landed mid-phrase; it now diffs at the first divergence.
- **M5a — the live authoring loop (pillar 5), proved end to end.** ✅ Done & verified: **58/58**
  headless (`examples/pinhole/authoring.ts`) + the pinhole browser walk now **62/62**
  (`examples/shot-pinhole.mjs`). The Composer had been a dead end since M2: it raised
  `{kind:"generate"}` and `defaultRunner` ignored it.
  - **The loop.** `message.submit` → `Session.applyMessage` splices an *ephemeral* `__ask-N` leaf
    (cloning the interrupted beat's viz + the learner's control values, else a prose "Thinking…"
    card) and raises `{kind:"generate", intent:"answer", question, returnTo}` → `generatingRunner`
    → `LessonAuthor` → the assembled `BeatSpec` rides back in a **`beat.generated` event**, which
    `applyAuthoring` splices/enters/records atomically. `LiveProgram.frame().thinking` is derived
    (the active leaf starts with `__ask-`), so the wait is legible without a second state channel.
  - **generate → freeze → replay.** Because the spec is *in the event*, `replay(defineLesson(spec),
    history)` re-creates the beat and projects the same transcript with the model never invoked
    again. A counting stub makes that an assertion, not a comment.
  - **Where the line sits** (`examples/pinhole/author.ts`): engine owns FACTS + STRUCTURE (physics,
    beat id/type, `next: <the interrupted beat>`, and the learner's live `u`/`v` read through
    `ctx.beats[id]` → `defaults` → authored viz props), model owns VOICE only. `assemble()` is pure
    and emits plain JSON — which is precisely what makes the beat replayable. Generated math is
    colour-keyed by the engine after the fact (masking `\textcolor{…}` and `\text{…}` first, so the
    `m` of `5\,\text{m}` stays metres) rather than by asking the model for hexes.
  - **Interrupt is free.** A new leaf makes prior generation stale via `cancelStale()`, and
    `generatingRunner` re-checks `ec.signal.aborted` before sending, so an abandoned answer is
    dropped — the learner is never yanked back, and both questions remain in the log.
  - **Two entry points, deliberately different:** the Composer interrupts (leaf → answer → resume);
    an explorable's own `ask.submit` is a self-transition (no leaf, `thinking:false`) so the learner
    keeps manipulating while the answer is authored.
  - **Deliberately not done:** no `narration` on generated beats. The prose is full of TeX and reading
    TeX aloud is worse than silence; a spoken variant needs a second model output — a real feature,
    a different one.
- **M5b — the module split + the live human teacher (tier 2).** ✅ Done & verified: **126/126**
  headless (`examples/pinhole/direction.ts`) + **71/71** browser (`examples/shot-teach.mjs`).
  `lesson/authoring/` had meant four unrelated things at once, and `lesson/index.ts` handed out an
  Anthropic client. Now: the stateful host is `lesson/runtime/`, the human DSL is `authoring/`, the
  mutation protocol is `lesson/direction/`, and the LLM half is `forge/` — a split that a
  behaviour-neutral phase A landed and re-verified before any feature work, so a regression would be
  attributable to the move.
  - **The teacher is a programmer, so the interface is logs out / commands in.** `direction/observe.ts`
    renders the situation (active beat, live control values, learner signals, the pending question,
    focus/hold state, and the verdict on the last batch) and `direction/format.ts` is the ONE text
    rendering of it. The terminal and the model's prompt read the same bytes — which is the whole
    reason tier 3 was a loop rather than an integration.
  - **`say`/`revisit` are sugar the adjudicator expands** into `addBeat` (+ `next: <current beat>`), so
    "answer with a beat" and "show that figure again, then come back" cost no new engine concepts, and
    `revisit`'s clone of an existing beat IS the reuse-a-visual affordance. `focus`/`annotate` take
    normalized 0..1 stage coordinates, so one implementation zooms an SVG figure, a Canvas2D viz and
    the WebGL apparatus alike.
  - **Atomicity without rollback:** `adjudicate` runs the whole batch against a SHADOW chart and
    commits only if every op survives, so a bad turn never reaches history. Capabilities
    (`FULL`/`SUPERVISED`/`OBSERVE_ONLY`) are enforced at that one gate, which is what makes tightening
    the AI teacher later a config value rather than a refactor.
  - **Transport is deliberately dumb:** polling, four endpoints, no WebSocket, no new dependency. The
    student's page stays authoritative and the log on disk is literally `tail -f`-able. A
    teacher-taught session replays from its log with no bus and no transport at all.
- **M5c — the AI teacher (tier 3), unrestricted.** ✅ Done & verified: **110/110** headless
  (`examples/pinhole/ai_teach.ts`). The claim is a NEGATIVE one — there is no AI-specific path into
  the lesson. `forge/cli/ai_teach.ts` is the same program as `teach/cli/direct.ts` with the human
  replaced, over the same four endpoints, reading the same observation text and the same verdicts.
  - **The tool surface IS the command union.** `forge/tools.ts` derives one tool per `DirectorOp` from
    a `Record<DirectorOp, ToolEntry>`, so the compiler refuses an op with no tool: the model's
    vocabulary cannot drift from the engine's, and adding an op stays one edit. The discriminant moves
    into the tool NAME, so an invented tool is dropped rather than misparsed.
  - **Two drive modes**, reactive by default (a question is a request for a teacher, one model call
    per question). Autonomous is opt-in: it spends a call per learner action and would make the
    browser walks nondeterministic. Its trigger is the STEP COUNTER, not a new learner turn in the
    transcript — the transcript is a discourse document that deliberately drops a Continue and a
    slider drag, which are exactly the situations an autonomous teacher watches for. Loop avoidance is
    a rebase-after-acting: the poll following a turn adopts the situation as its baseline, so the loop
    is driven only by changes the director did not make.
  - **`capabilities: FULL`** — every op, no per-turn cap. The knob exists and is simply not set, which
    is "free now, limited gradually" made explicit rather than implicit. A withheld tool is an
    explanation; the refusal is still `adjudicate`'s.
  - **generate → freeze → replay, by construction:** a director's turn rides in one recorded
    `direction.command` event carrying its `actor`, so `replay()` rebuilds an AI-taught session with
    the provider unreachable, and the transcript attributes those turns to the agent rather than to
    the human teacher.
- **M5 — the AI seam, productionized.** Make `@anthropic-ai/sdk` a real optional dep (M5a still loads
  it through a lazy, `@vite-ignore`d dynamic import); harden the `LessonAuthor` boundary; export the
  IR **JSON Schema** (the public contract lessonForge targets).
  Still open from M4.5: single-file/offline export (`package.json` has no `build`), a `barChart`
  factory, and rewind-by-transcript-prefix (the principled alternative to a time scrubber — a
  scrubber would force a duration on every beat and fight answer-driven branching).
- **Deferred — a real playback transport (video-style play/pause/seek).** The narration pause control
  is per-clip and, in practice, finicky (autoplay gating, no timeline). Both SocraticAI and lessonkit
  had a genuine *video* transport — a global clock you could play/pause/scrub — but each was
  error-prone and rigid (a fixed duration forced onto every beat, overlays fighting the scrubber,
  imperative verbs fired at a global timeline that a clockless/branching host can't honour). Want a
  future capability that gives that same play/pause/seek affordance **with fewer failure modes and
  room for live sessions**: transcript-prefix rewind as the seek model (no forced per-beat duration),
  a derived timeline over the beats that DID play, and a clocked view layered behind a plugin over the
  clockless `live` runtime — never replacing it. Ties into the deferred `video/` transport pruned in
  M1 and the rewind-by-transcript-prefix item above.
- **Deferred — learner image upload for the convolution viz.** The `conv2d` viz already resolves an
  `image` prop (0 = the built-in sprite, 1..3 = the bundled photos); an upload would add a source the
  learner supplies (a `demo.set {image: <blob-url>}` from a file input, cached alongside the fetched
  photos). Left out this round on purpose — the value channel is `number|boolean`, so a blob-URL source
  wants either a widened `ControlValue` or a dedicated upload control, which is more than the plug-and-try
  filters needed. Recorded next to the video-transport item so the two UI additions can land together.
- **Later — lessonForge.** The offline agentic pipeline + the live adaptation loop, on the
  SocraticAI pattern, targeting the exported IR schema. Add activeReader's two-axis learner model
  as the "Perceive."

## Environment notes
- No system Node. Reuse conda Node 22 at `../lessonkit/.conda-node/bin` (or a local `.conda-node`).
  `export PATH="<conda-node>/bin:$PATH"` before npm/npx/tsx.
- `node_modules` is now a REAL directory driven by this repo's own `package.json` (it used to be a
  symlink to `../lessonkit/node_modules`; the first `npm install` here replaced it, which is the
  correct end state anyway). Adds `three` + `@types/three` (the 3-D apparatus) and `puppeteer` (the
  browser checks). lessonkit's tree is untouched.
- **Narration:** `ELEVEN_LABS_API_KEY` in the env ⇒ audible narration through `/api/tts`; clips are
  cached under `.audio-cache/` (gitignore it — 3.5 MB for the pinhole lesson) so re-runs cost nothing
  and work offline. Without the key the pipeline still runs, silently.
- **Live authoring:** `ANTHROPIC_API_KEY` in the env ⇒ a learner's question is answered by Claude
  through `/api/author`, cached by content hash under `.author-cache/` (gitignored, same reason).
  Without the key the endpoint answers `{error}` and `claudeAuthor` assembles the plan's
  `fallbackText`, so the whole ask → author → splice → resume loop still plays, deterministically —
  which is the mode the checks run in. The same key backs the **AI teacher** through `/api/direct`
  (uncached: a director's turn answers a situation, and the same observation twice may deserve a
  different move); with no key the AI teacher stays silent, or runs `offlineDirector` in a test.
  Every key lives only in the vite process: `audio/dev_tts.ts`, `forge/dev_author.ts` and
  `forge/dev_director.ts` are Node-only and are deliberately NOT on their package barrels, so they
  cannot be imported into a browser bundle. The walk asserts the negative (no request to
  `api.anthropic.com` / `elevenlabs.io` ever leaves the page), and the headless checks assert that
  the browser's proxy request carries no credential field at all.
- Browser checks need swiftshader under headless Chrome:
  `--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader`.
- Run: `LS_ROOT=examples/pinhole ./node_modules/.bin/vite --port 5188` then
  `node examples/shot-pinhole.mjs http://localhost:5188/ /tmp/ls-pinhole`.
  Two dev servers at once is fine — each `LS_ROOT` gets its own dep-optimizer cache under
  `node_modules/.vite/<root>/`, because the Vite default is shared per-package and the two roots
  were invalidating each other's optimized deps.
- Headless engine checks (no browser, no network): `tsx examples/pinhole/authoring.ts` (M5a, the
  authoring loop), `tsx examples/pinhole/direction.ts` (M5b, the live teacher's protocol),
  `tsx examples/pinhole/ai_teach.ts` (M5c, the AI teacher) and `tsx examples/convolution/verify.ts`
  (M4, the math). The teacher's browser walk is `node examples/shot-teach.mjs` against 5188.
- Commit as **shaden**, no `Co-Authored-By`; no push without explicit go-ahead.
