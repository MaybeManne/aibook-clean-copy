# lessonStudio — Vision, Objective, Features, Applications

*An orientation document for someone joining the project — a senior engineer or a product manager.
Deliberately free of low-level implementation detail; see [ROADMAP.md](./ROADMAP.md) for the
architecture and milestones, and [COMPARISON.md](./COMPARISON.md) for how this was distilled from
three prior attempts.*

*Written 2026-07-28, reflecting the engine as of milestone M4.6.*

---

## 1. The one-paragraph version

**lessonStudio is a high-level language for interactive lessons.** Think of Manim — the library
3Blue1Brown uses to produce mathematical animations — but rendered in a browser, so the result is not
a video the viewer watches but an *environment the learner acts in*. An author writes a lesson as a
structured description: what is said, what is shown, what the learner is asked, and where the lesson
goes depending on the answer. The engine compiles that description and plays it. Because the lesson
is data rather than code-driven-by-a-clock, three things follow that a video cannot offer: the flow
can **bend on the learner's answers**, every session is **recorded and exactly replayable**, and an
**AI can author or adapt the lesson at play time** by emitting more of the same data.

---

## 2. Why this exists — the problem

There are two mature categories of explanatory media and a gap between them.

**Videos** (3Blue1Brown, Veritasium, any lecture recording) are excellent at *narrative*: a
carefully sequenced argument with visuals that carry the intuition. They are inert. The learner
cannot answer a question, cannot be re-taught the step they missed, and cannot manipulate the
apparatus. The medium has no idea whether anyone understood anything.

**Explorables** (Distill articles, the Transformer Explainer, "explorable explanations") are
excellent at *agency*: sliders, draggable objects, live recomputation. They are typically
hand-built one-offs — thousands of lines of bespoke JavaScript per artifact — with no reusable
notion of pedagogical structure. There is no flow, no assessment, no adaptation. Each one is a
custom app that happens to teach.

Neither is **responsive to the individual learner**, and neither is **authorable at scale**. A
tutor's core move — *notice the learner is lost, and change what happens next* — is not expressible
in either medium, because neither has a representation of "what happens next" that anything could
edit.

**lessonStudio's bet is that the missing piece is a representation, not a feature.** If a lesson is
a typed, inspectable, replayable data structure — a flow of *beats* — then narrative, interaction,
assessment, branching, and AI authoring all become operations over one object instead of five
unrelated systems. That is the difference between a player and a compiler target.

---

## 3. Vision

> A lesson is a **compiled, replayable, inspectable artifact** — not a video file and not a
> hand-written app. The representation is the product.

Five pillars define what "done" means. They are the project's north star and the yardstick every
milestone is measured against.

1. **Manim, but in the browser, and interactive.** A declarative visual and narrative language, with
   the animation vocabulary of a serious math-animation library, that renders live rather than to a
   video file.

2. **A deterministic flow that bends on learner answers.** Not a linear timeline: a pre-authored
   flow graph. A wrong answer routes to remediation or a recap, not to "next step." The author
   defines the possible paths; the learner's work selects the actual one.

3. **The author specifies text, audio, and visuals — with an escape hatch.** Narration is either
   recorded or synthesized. Visuals come from the built-in library *or* are raw browser code when the
   author needs something the library does not have. Author freedom is a first-class requirement, not
   an afterthought.

4. **The template is separate from the lesson.** Writing the lesson specification renders it
   immediately in a sensible default presentation (a split screen: visuals on one side, prose and
   math on the other). Restyling or re-laying-out is an independent change that touches no lesson.

5. **AI authors and adapts in real time.** A lesson starts from a human-authored plan; a model
   adjusts it live based on how the learner is doing. The feedback the system consumes is
   deliberately generic — typed answers, free-form text, manipulations of a demo, and in principle
   gaze or any other signal.

### The acceptance test for fluency

*Take one 3Blue1Brown video and reproduce it in the browser, interactively.* Success is not
pixel-identical frames; it is a viewer accepting it as **"that video, but now I can pause and
answer."** Visual and narrative fidelity.

This is a deliberately harsh test, and it is the reason the project's second milestone group is
example lessons rather than features. A language for lessons that cannot express the best existing
lessons is not a language worth having. Two such reproductions are done (§6).

---

## 4. Objective

The concrete objective is **an engine whose public contract is a lesson format**, plus enough
demonstrated fluency in that format to justify building generation on top of it.

Stated as three commitments:

- **Determinism and replay.** A session is an event log. Given the same lesson and the same log, the
  engine reconstructs the identical state — including anything an AI generated mid-session, because
  generated content is recorded as data the moment it is produced. Consequence: sessions are
  debuggable, auditable, and gradeable after the fact, and a model is never re-invoked during replay.

- **One path per job.** The engine has one authoring surface, one runtime, one presentation layer,
  one visual vocabulary with one escape hatch. This is a hard-won constraint: the predecessor project
  accumulated three authoring surfaces, two runtimes, and three view components, and became
  unpleasant to work in — not because it was tangled, but because every task had several plausible
  routes. Fewer, sharper surfaces are treated as a feature.

- **A machine-facing format that humans can also write.** The authoring surface is a literal
  structure — the same shape a language model emits. There is no separate "AI API." Human authoring
  and machine authoring produce the same artifact, which is what makes the two interchangeable and
  mixable inside a single lesson.

### The product boundary: two repositories

The system splits at the one seam that matters — the line between *deterministic* and *generative*.

| | **lessonStudio** (this repo) | **lessonForge** (planned) |
|---|---|---|
| What | The engine / the language | The authoring pipeline and the live tutor loop |
| Nature | Deterministic, replayable | Non-deterministic, model-driven |
| Job | Plays frozen lesson artifacts, in the browser | Produces and adapts lesson artifacts |
| Contract | Publishes the lesson format as a schema | Targets that schema |

The engine exists and is exercised by real lessons today. lessonForge follows once the engine is
fluent — and notably, **offline authoring and live tutoring are the same interface at different
speeds**: both hand the engine the same kind of edit through the same seam. Batch-generating a
lesson and adapting one mid-session are not two systems.

---

## 5. Features

Grouped by what they let someone *do*. Everything in this section is implemented and exercised by at
least one example lesson unless explicitly marked **[planned]**.

### 5.1 Authoring: the lesson as a flow of beats

A lesson is a list of **beats**. A beat is one pedagogical move — explain this, animate that, ask
this, let them play with this — and it is a reusable, parameterized building block, not a bespoke
component. The shipped beat types:

- **explain** — narrated prose, math, and an optional visual.
- **animate / scene** — a declarative animation that plays on entry.
- **mcq** — multiple choice, with per-answer feedback and its own routing for a wrong answer.
- **freeResponse** — typed free-text answer, likewise routable.
- **explorable** — an interactive demo with controls, optionally **goal-gated**: the lesson does not
  advance until the learner reaches a specified state (e.g. "slide this to a shift of 4"), which
  turns a toy into an assessment.
- **branch** — an explicit condition on the accumulated learner state.

Authoring is one literal structure describing the flow. The same structure is what a model emits;
the convenience helpers around it are sugar over data, never a separate API.

### 5.2 Flow that responds

Each beat declares where it goes next, and gates declare where a *wrong* answer goes instead. The
standard shape is a **remediation detour that rejoins the main line** — the learner who stumbles gets
the extra explanation and then continues, rather than being dropped into a parallel track. Both
example lessons use this; the pinhole lesson has two such gates.

Every learner action is an event: an answer, a slider drag, a typed message. Manipulating a demo is
therefore *recorded, replayable state that the system can reason about* — not a local UI callback
that nothing else can see. This is precisely the gap that sank an earlier prototype, which had a rich
model of the learner and a routing system that ignored it.

### 5.3 A learner model and a teaching policy, as a swappable seam

The adaptive loop is factored into three named interfaces, in the game-AI sense/think/act shape:

- **Perceive** — a learner model that folds the event stream into an assessment of the learner
  (understanding, struggling, misconceptions). It is a pure fold over history, so replaying a session
  reconstructs it for free.
- **Decide** — a policy that reads a read-only view of the session and states a coarse *intent*
  ("say something," "author a change," "do nothing"). Pure, and therefore replay-safe and safe to
  accept from a third party.
- **Act** — the only effectful layer: turning an intent into concrete edits, which the engine then
  adjudicates before committing.

The practical value for a PM: the pedagogy is a plug-in point with a small, documented contract.
Swapping in a better learner model — or a domain-specific one, or a research group's — does not
touch the engine.

### 5.4 Live AI authoring, with the engine as referee

An agent participating in a session can **edit the lesson while it is being played**: add a beat,
re-point an existing beat's next step, make a step terminal. This is how "AI adapts in real time"
is actually expressed — not as a chat sidebar bolted onto a fixed lesson, but as edits to the flow
graph in the same language the human author used.

Three properties make this safe enough to ship:

- **The engine adjudicates every edit.** Targets must exist; edits may not smuggle in executable
  code; and the result must still be completable — an agent cannot strand a learner in a dead end.
- **Generate → freeze → replay.** Anything a model produces is recorded as event data at the moment
  of production. Replay reads the record; it never re-invokes the model. Sessions are reproducible
  even though generation is not.
- **The model contributes voice, the engine contributes facts.** In the working pattern, structure
  and factual content (which beat, what type, which values are highlighted) are computed
  deterministically, and the model supplies only the teaching prose. A model cannot hallucinate the
  lesson's structure or its numbers, because it is never asked for them.

### 5.5 The visual vocabulary

A declarative 2-D scene graph, reconciled against authoritative ManimCE semantics rather than
second-hand ports, covering the primitives an explainer actually needs: axes and number lines,
function plots (which correctly break at discontinuities instead of drawing a line across an
asymptote), shaded areas and areas-between-curves, Riemann rectangles (the discrete-sum→integral
bridge), polygons, arcs, braces with tips, labelled grids, and value boxes. Animation verbs —
fade-in, draw-on, slide, spin, indicate, staggered reveals, motion along a path — with Manim's own
easing/rate-function set, so motion looks like the reference material.

The scene graph is **pure data**, which is what makes it renderable outside a browser (for export,
for automated visual checks, and for a generation pipeline that wants to look at what it produced).

Two escape hatches, and the discipline that keeps them honest:

- **Figures** — interactive, slider-driven visuals that still render through the same pure pipeline
  as scripted scenes, so they are export-safe.
- **Raw visuals** — arbitrary browser code, including WebGL, for anything the library does not cover.
  These are opaque to the engine by design, but they can hand back a still image so a
  canvas-based step is not a hole in an export or in an automated review.

**A standing architectural decision worth understanding as a PM, because it will recur:** the engine
does not grow a new node kind every time a new visual capability is needed. Live-recomputed values
and 3-D scenes were both resolved this way — 3-D lives behind the raw-visual hatch, and beats drive
it by *declaring the state they want* (where the object is, what is visible, where the camera looks)
rather than by firing imperative commands at a global timeline. Declared state survives the three
ways a beat can be entered: advancing, arriving via a wrong-answer detour, and replay. Imperative
verbs aimed at a clock survive none of them. Keeping the engine's core vocabulary small is what keeps
export, replay, and machine-authoring possible at all.

### 5.6 Narration

Text-to-speech with a real voice provider, plus a content-addressed cache: each line is synthesized
and billed **once**, and subsequent runs are offline. The API key stays server-side and never reaches
the browser bundle. With no key configured, the pipeline still runs, silently — it degrades honestly
rather than breaking. Word-level alignment and subtitle generation are part of the audio layer.

Recorded audio is equally admissible — narration is authored content, not a TTS feature.

Learner-facing control: **pause narration** is a standing preference (narration off until resumed),
not a per-clip pause, because a learner who wants silence should not be re-interrupted by the next
beat. Clips still preload, so resuming is instant. The control's label is derived from the actual
audio state, so it can never advertise "Pause" over silence a browser autoplay policy blocked.

### 5.7 Presentation: the template is data

Layout, component choice, and theme are a separate data object from the lesson. The default is the
split-screen studio: visuals on one side, prose with markdown and KaTeX on the other. Changing the
ratio, moving the visuals to the other side, or collapsing to a single reading column is a change to
that object — **zero lesson edits**. (This is the pillar the predecessor built an abstraction for and
then hardcoded around; it is now real and verified by swapping layouts live in a running lesson.)

Rich text supports markdown-style emphasis and inline/display math, and a lesson can carry a
**symbol→colour palette** shared by both its figures and its prose — so `v` is the same blue in the
diagram and in the equation, structurally, rather than by an author's discipline. Colour of this kind
belongs to the lesson (it is authored meaning: *which symbol is this*) while the theme owns reusable
roles like accent and muted.

### 5.8 Verification, because generated content demands it

Every example lesson ships two independent checks:

- **Headless assertions** through the same pure pipeline the browser uses — the mathematics, the
  animation geometry, the highlighted-cell counts, and in one case an *independently computed*
  identity to confirm the lesson's claim (polynomial multiplication equalling convolution).
- **A full browser walk** that plays the lesson end-to-end and asserts on the real DOM: every beat,
  every gate, math rendering, narration clips actually loading and playing.

The convolution lesson passes ~63 headless assertions and a 26-check walk; the pinhole lesson passes
a 41-check walk. This matters beyond hygiene: it is the **substrate a generation pipeline needs**. An
AI-authored lesson is only trustworthy if something can automatically confirm it renders, routes, and
computes correctly — so the verification story is a product feature, not test infrastructure.

### 5.9 Not yet built — the honest list

- **[planned] The lesson format published as a schema** — the formal public contract, and the thing
  the generation repo will target. The format exists and is stable in practice; publishing it as a
  versioned schema is the next milestone.
- **[planned] Offline / single-file export** — a lesson as one self-contained file to hand someone.
  The pure-data design makes this tractable; there is no build step yet.
- **[planned] Video-style transport (play / pause / seek).** Deliberately deferred rather than
  skipped. Both predecessor projects had a global clock you could scrub, and both were fragile: a
  scrubber forces a fixed duration onto every beat and fights answer-driven branching. The intended
  answer is *rewind by replaying a prefix of the session*, with a timeline derived from the beats that
  actually played — the same affordance without forcing every lesson to be secretly a video.
- **[planned] lessonForge** — the offline authoring pipeline and the live adaptation loop. The
  engine-side seam it plugs into is built and exercised; the pipeline is not.

---

## 6. What exists today — evidence, not intentions

The engine is built and playable. Two full lessons exist, chosen specifically as **fluency proofs**
rather than as demos:

**"But what is a convolution?"** — a 12-beat reproduction of the 3Blue1Brown video's *narrative
spine*, not just its arithmetic. The first attempt reproduced only the mechanical recipe for
convolving two vectors and was judged (correctly) too thin. The lesson now walks the video's actual
argument: three ways to combine two lists and why one is the odd one out → a dice-sum grid whose
diagonal *is* a convolution → the definition → flip → slide → a learner-driven slider gated on
reaching a specific shift → a product grid whose anti-diagonals are the answer → the hidden identity
that convolution is polynomial multiplication → a check with remediation on a wrong answer → a
summary. Colours match the video. Every beat is narrated.

The lesson-vs-demo distinction is the point: the acceptance bar is *narrative* fidelity, and it took a
rejection and a rewrite to hit it. That is the standard the format is being held to.

**A pinhole-camera explainer** — 13 beats across five parts, rebuilt from a 7,700-line, 1.5 MB
single-file reference artifact of the kind a generation pipeline produces today. Two gates with
remediation detours, ~2.5 minutes of real synthesized narration, and one live WebGL apparatus: an
object, a barrier with a pinhole, and a screen, with rays crossing to paint an inverted image. The
learner can drag the object or the screen along the optical axis, and **that drag flows back into the
session as recorded state** — where in the reference file the same drag went to a local callback
nothing could observe.

The comparison is the argument for the whole approach: the reference is 7,700 lines of
un-inspectable, un-adaptable, un-replayable single-file output. The lessonStudio version is a
declarative lesson of a few hundred lines against a shared engine, with routing, assessment, replay,
and an adaptation seam — and it is *shorter, not longer*.

Both lessons also produced genuine engine improvements rather than lesson-local hacks — a first-class
"Continue" affordance derived from the beat rather than authored, shared-apparatus handling so a
persistent WebGL scene is not re-created per step, correct handling of authored math and emphasis
everywhere it can appear. **Example lessons functioning as the engine's requirements process is
working as intended.**

---

## 7. Applications

Ordered roughly by nearness.

**1. Technical explainers that assess as they teach — the chosen wedge: ML/AI internals.**
The Transformer Explainer / "how does backprop work" / optimizer-and-attention-visualization genre is
today's best-in-class explorable content, and it is entirely hand-built one-offs. It is also a domain
where the audience is large, technical, and dissatisfied with videos. An interactive, *tutored*,
adaptive explainer of attention or backpropagation — one that notices you did not understand the
softmax step and re-teaches it — does not currently exist in any form.

**2. Course and textbook chapters where the exercises are the medium.**
Because assessment beats and explanation beats are the same kind of object, a chapter does not have a
"content section" and a "problem set." The gate *is* the pedagogy: a learner who cannot reach the
target state does not advance, and gets the remediation instead. Recorded, replayable sessions give
an instructor per-learner evidence of exactly where the misunderstanding was, in a form that can be
reviewed rather than inferred from a score.

**3. Lab and apparatus simulations.** The pinhole lesson is the template: a real interactive
apparatus the learner manipulates, wrapped in narrative and assessment, with the manipulations
visible to the tutoring loop. Optics, mechanics, circuits, signal processing.

**4. Internal training and technical documentation with teeth.** Onboarding material that verifies
comprehension instead of hoping for it — for a system's architecture, an API's semantics, a safety
procedure. The recorded-session property is the audit trail some of these need by regulation.

**5. AI-generated curricula at scale — the reason the format is the product.**
Once generation targets a schema with a deterministic engine and automated verification behind it,
the unit of quality becomes a *beat*: small enough for a model to author well, verifiable in
isolation, and recomposable deterministically. That enables per-beat parallel generation with
per-beat adversarial verification — connecting directly to work on how rigid a verifier must be
before reward-hacking sets in. "Generate a 40-beat lesson and verify each beat independently" is a
tractable pipeline; "generate a 7,700-line HTML file and eyeball it" is not.

**6. A research instrument for learning science and for tutoring agents.**
The engine emits complete, replayable interaction traces and accepts a swappable learner model and
teaching policy behind small pure interfaces. That is an experimental apparatus: hold the lesson
fixed, vary the policy, compare traces. Evaluating a tutoring agent needs exactly this — an
environment where the agent's actions are typed, recorded, adjudicated, and reproducible.

---

## 8. How to think about the risks

Stated plainly, since a PM will ask.

- **Authoring cost is the central open question.** A hand-authored lesson is currently days of expert
  work — cheaper and far more capable than the 7,700-line alternative, but not yet cheap. The whole
  thesis depends on the generation half closing that gap, and the generation half is not built. The
  mitigation is deliberate: the format, the verification harness, and the adjudicated authoring seam
  are all being built *first*, precisely because they are what makes generation tractable rather than
  a demo.
- **The fluency bar is subjective and high.** "A viewer accepts it as that video" is a judgement
  call, and the convolution lesson had to be rewritten once to clear it. This is a feature of the
  process — it is what keeps the format honest — but it means milestones can be reopened by review.
- **Scope discipline is load-bearing.** The predecessor project's failure mode was capability sprawl,
  not architectural error. Several requests that look like features (a 3-D node type, a live-value
  node type, a video scrubber) have been deliberately answered with "no — express it with what
  exists," and that will keep happening. Expect "we are not building that" as a recurring and
  intentional answer.
- **Non-determinism is quarantined, not eliminated.** Live model authoring is real and so is its
  failure mode; the defences are structural (the engine adjudicates every edit, cannot be handed
  executable code, and will not allow an uncompletable lesson) and the recorded-not-recomputed rule
  means a bad generation is at least reproducible and inspectable after the fact.
- **It is early.** One repository, one contributor, one commit, no published package, no offline
  export. What exists is an engine with two demanding lessons running on it — which is the right
  thing to have first, and is not the same thing as a product.
