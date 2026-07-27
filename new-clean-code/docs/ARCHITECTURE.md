# LessonKit — Architecture

*"Advanced Manim for interactive educational content."* A declarative engine for
authoring interactive lessons that run as a hierarchical state machine, render
through swappable templates, and are editable by humans **and** AI agents.

Status: design doc (pre-implementation). Stack: TypeScript (web).

---

## 1. Guiding principles

1. **The lesson is data, not code.** A lesson is a serializable value (a
   statechart + content). Teacher-authored code is an *escape hatch*, never the
   primary surface. This is what makes lessons replayable, diffable, and
   AI-editable.
2. **Logic is separate from data is separate from presentation.** Three clean
   layers — the *statechart* (flow), the *context/blackboard* (mutable student
   state), the *renderer* (pixels). Borrowed directly from game AI, where the
   blackboard split is non-negotiable.
3. **Hierarchy lives in the engine, not in the teacher's face.** Teachers
   compose predefined **beats** (Explain, MCQ, Branch…). Each beat is internally
   a small statechart. Raw sub-statecharts are available but rarely needed.
4. **The lesson never names a pixel.** It emits typed *render intents* tagged
   with slot names and content types. The template decides regions, layout,
   colors, components. Swapping templates never touches the lesson.
5. **Pure core, effectful shell.** The statechart is a pure reducer
   `(state, event) → state`. All effects (timers, network, AI calls) live at the
   edges as declared *actions*, so the whole thing is testable and replayable.

---

## 2. Layered overview

```
┌─────────────────────────────────────────────────────────┐
│  Authoring layer  (teacher / AI agent)                   │
│  - declarative Lesson literal: beats + content + flow    │
│  - escape-hatch: custom guards/actions/sub-statecharts   │
└───────────────────────────┬─────────────────────────────┘
                            │ compiles to
┌───────────────────────────▼─────────────────────────────┐
│  Lesson IR  (serializable)                               │
│  - Statechart definition (states, transitions, beats)    │
│  - Content table (text, visuals, MCQs, …)                │
│  - Initial context                                       │
└───────────────────────────┬─────────────────────────────┘
                            │ interpreted by
┌───────────────────────────▼─────────────────────────────┐
│  Engine  (pure)                                          │
│  - Interpreter: (state, event) → (state', effects[])     │
│  - Context store (blackboard)                            │
│  - Beat library (predefined sub-machines)                │
└───────────────────────────┬─────────────────────────────┘
                            │ emits RenderModel + RenderIntents
┌───────────────────────────▼─────────────────────────────┐
│  Renderer  (template-bound)                              │
│  - Layout: named slots → regions                         │
│  - Component registry: content-type → component          │
│  - Theme/tokens: colors, spacing, motion                 │
└─────────────────────────────────────────────────────────┘
```

Data flows **down** (lesson → engine → render model → DOM). Events flow **up**
(student action → engine event → transition → new render model).

---

## 3. The core: a statechart

A Harel **statechart** = hierarchical FSM + context + guards + actions. This is
the formalism (XState implements it) that has *both* the hierarchy game devs use
to tame transition explosion *and* the blackboard split. We use it but keep the
exposed surface small.

### 3.1 Context (the blackboard)

```ts
/** All mutable student/session state. Pure data; JSON-serializable. */
export interface Context {
  /** Per-beat local state, keyed by beat id (e.g. mcq attempts). */
  beats: Record<string, unknown>;
  /** Cumulative score / mastery signals. */
  score: number;
  /** Arbitrary teacher-defined variables (escape hatch). */
  vars: Record<string, Json>;
  /** Audit trail — every event, for replay & analytics. */
  history: EventRecord[];
}
```

### 3.2 States, transitions, guards, actions

```ts
export interface StateNode {
  id: StateId;
  /** A leaf state usually *is* a beat instance. */
  beat?: BeatRef;
  /** Nested states → hierarchy. Empty for leaves. */
  children?: Record<string, StateNode>;
  initial?: StateId;            // for compound states
  on?: Record<EventType, Transition[]>;
  /** entry/exit side effects, declared not executed. */
  entry?: ActionRef[];
  exit?: ActionRef[];
}

export interface Transition {
  target?: StateId;             // omitted = self-transition (internal)
  guard?: GuardRef;             // predicate over (context, event)
  actions?: ActionRef[];        // context mutations + effects
}
```

Guards and actions are **referenced by name**, resolved against a registry. The
predefined set covers the 90% case (`scoreAtLeast`, `incrementAttempts`,
`recordAnswer`…); teachers register custom ones as the escape hatch. Because
they are references, the lesson IR stays pure JSON and an agent can author it
without writing executable code.

### 3.3 Interpreter (pure)

```ts
export interface Step {
  state: StateValue;            // hierarchical, e.g. {quiz: "showHint"}
  context: Context;
  effects: Effect[];            // to be run by the shell
  render: RenderModel;          // what to show now (see §6)
}

export function transition(
  chart: Statechart,
  step: Step,
  event: LessonEvent,
): Step;                        // pure — no I/O, fully replayable
```

The shell calls `transition`, runs the returned `effects` (timers, AI requests,
persistence), and feeds any resulting events back in. Replaying `history`
through `transition` reconstructs any session exactly — the property that makes
this AI- and analytics-friendly.

---

## 4. Beats — the predefined building blocks

A **beat** is a reusable, parameterized sub-statechart with a typed content
payload. Teachers compose beats; this is where "most types are predefined" lives.

```ts
export interface BeatDef<P = unknown> {
  type: string;                         // "explain" | "mcq" | "branch" | …
  /** Internal sub-statechart factory. */
  build(params: P, id: BeatId): StateNode;
  /** What this beat wants drawn, given its local state + context. */
  render(params: P, local: unknown, ctx: Context): RenderIntent[];
}
```

### Starter beat library

| Beat          | Internal states                                  | Emits |
|---------------|--------------------------------------------------|-------|
| `Explain`     | `shown → (next)`                                 | text + optional visual |
| `MCQ`         | `unanswered → answered(correct\|wrong) → [hint] → reveal` | prompt, choices, feedback |
| `FreeResponse`| `empty → submitted → graded`                     | prompt, input, rubric feedback |
| `Branch`      | `evaluate → routeA \| routeB …`                  | nothing (pure flow) |
| `Checkpoint`  | `gate` (guard on mastery)                        | optional summary |
| `Custom`      | teacher-supplied StateNode                       | teacher-supplied intents |

Each beat is independently testable: feed it events, assert on state + intents.
New beats are added by registering a `BeatDef` — the engine, IR, and renderer
need no changes as long as the beat's intents use known content types (or ship
their own component, see §6.2).

### 4.1 Beat outcomes & the routing table (sequencing model)

Sequencing is **"advance to next by default, but any beat exposes named outcome
events that can be routed elsewhere."** Crucially, the set of outcomes is an
**open event channel**, not a fixed enum — because the most valuable signals
(gaze tracking, an LLM's free-form judgment of a student's answer) cannot be
enumerated at authoring time.

```ts
/** A beat declares the outcomes it *knows* it can emit, for tooling/agents. */
export interface BeatDef<P> {
  // …build, render…
  outcomes?: string[];        // e.g. ["correct", "wrong", "timeout"] — advisory
}

/** Routing maps an outcome (or any event) to a target. Author- or policy-defined. */
export interface Route {
  on: EventPattern;           // "mcq.wrong" | "signal.confused" | "llm.misconception:*"
  guard?: GuardRef;           // optional predicate over context
  target: StateId;            // where to go
}
```

Resolution order for a beat that emits event `e`:

1. A matching `Route` in the beat's own routing table (most specific first).
2. Else the **default exit** → the next beat in `flow`.

This keeps the simple case trivial — `explain` just falls through to `next` —
while making adaptivity a **pure data change**:

```ts
mcq({
  id: "q1", prompt: "…", choices: [...],
  routes: [
    { on: "wrong",            target: "remediate-prereq" },  // go teach the pre-req
    { on: "timeout",          target: "hint-then-retry" },   // no answer → scaffold
    // correct → (unwired) → falls through to next beat
  ],
})
```

**Open signals as first-class events.** Gaze, dwell-time, and LLM judgments
enter the engine as ordinary `LessonEvent`s on namespaced channels
(`signal.confused`, `llm.misconception:photosynthesis-vs-respiration`). They are
recorded in `Context.history`, readable by guards, and routable by the same
table. An adaptive *policy* (or AI agent) is just a component that watches
context/history and injects events or rewrites routes — the engine doesn't
change. This is why outcomes are an open channel rather than an enum: the
authoring-time author wires what they can foresee; everything else is added as
data by a policy at runtime.

```ts
export type LessonEvent =
  | { type: "next" }
  | { type: `mcq.${string}`;    id: BeatId; choice?: number }
  | { type: `signal.${string}`; payload: Json }   // gaze, dwell, affect
  | { type: `llm.${string}`;    payload: Json }    // free-form judgment
  | { type: string; payload?: Json };              // open channel
```

---

## 5. Authoring API (declarative + escape hatch)

A lesson is a literal. The builder DSL is sugar that compiles to the same IR an
agent could emit directly.

```ts
const lesson = defineLesson({
  id: "photosynthesis-101",
  title: "How plants eat light",
  flow: [
    explain({
      id: "intro",
      text: "Plants turn sunlight into sugar. Let's see how.",
      visual: { kind: "image", src: "leaf.svg", slot: "stage" },
    }),
    mcq({
      id: "q1",
      prompt: "What gas do plants take in?",
      choices: [
        { text: "Oxygen" },
        { text: "Carbon dioxide", correct: true },
        { text: "Nitrogen" },
      ],
      onWrong: hint("Think about what we breathe *out*."),
      maxAttempts: 2,
    }),
    branch({
      id: "route",
      when: scoreAtLeast(1),
      then: "deep-dive",
      else: "recap",
    }),
    // … beats keyed by id; branch targets reference them
  ],
});
```

- **`flow`** is an ordered list of beats; sequential by default (each beat's
  "done" event advances to the next). `branch`/explicit `target`s override.
- **Escape hatch:** any beat accepts `guards`, `actions`, or a raw `statechart`
  field. `custom({ id, statechart, render })` drops fully to the engine.
- The DSL functions (`explain`, `mcq`, …) are thin: they return plain IR nodes.
  An AI agent can skip them and produce the JSON directly — same result.

---

## 6. Renderer — layered slot + component registry

Two independent axes, exactly as decided: **slots** for *where*, **registry**
for *how*. The lesson is ignorant of both.

### 6.1 Render intents (what the lesson emits)

```ts
export type RenderIntent =
  | { kind: "text";   slot: SlotName; content: RichText; emphasis?: Emphasis }
  | { kind: "visual"; slot: SlotName; ref: VisualRef }
  | { kind: "mcq";    slot: SlotName; prompt: RichText; choices: Choice[];
      state: McqViewState }
  | { kind: "input";  slot: SlotName; prompt: RichText; value: string }
  | { kind: string;   slot: SlotName; [k: string]: unknown }; // custom types

export interface RenderModel {
  intents: RenderIntent[];
  /** transient cues for animation between steps (Manim-like). */
  transitions?: ViewTransition[];
}
```

Intents are **data**. They name a `slot` and a content `kind` — never a color,
font, or pixel coordinate.

### 6.2 Template (how + where)

```ts
export interface Template {
  /** Layout: maps slot names to screen regions + responsive rules. */
  layout: Record<SlotName, Region>;
  /** Component registry: one renderer per content kind. */
  components: Record<string /*kind*/, ComponentFor<RenderIntent>>;
  /** Design tokens: colors, type scale, spacing, motion curves. */
  theme: Theme;
}
```

- **Layout (slots):** template author says `stage` is the big center region,
  `prompt` is top, `choices` is bottom rail, etc. Same lesson, different
  template → different arrangement, no lesson change.
- **Registry (components):** template provides a React component per `kind`.
  MCQ colors, button styling, correct/wrong animation all live here. A custom
  beat that emits a `kind: "graph"` intent just needs the template to register a
  `graph` component (or a fallback renders a typed placeholder).
- **Theme:** tokens consumed by components. Reskinning = swap theme only.

### 6.3 Why two layers, not one

A single registry couldn't relocate content; a single slot map couldn't restyle
content kinds. Layering both is what earns the "advanced Manim" framing — and
sets up the later video-export path: an offline renderer is just another
`Template` whose components emit frames instead of DOM.

---

## 7. Module / file layout

```
lessonkit/
├─ docs/ARCHITECTURE.md            ← this file
├─ packages/
│  ├─ core/                        ← pure engine, zero DOM deps
│  │  ├─ statechart/{types,interpreter,registry}.ts
│  │  ├─ context.ts
│  │  ├─ effects.ts
│  │  └─ index.ts
│  ├─ beats/                       ← predefined BeatDefs
│  │  ├─ explain.ts  mcq.ts  branch.ts  freeResponse.ts  checkpoint.ts
│  │  └─ index.ts  (beat registry)
│  ├─ authoring/                   ← defineLesson + DSL sugar
│  │  ├─ dsl.ts  schema.ts (JSON Schema for IR → agent validation)
│  │  └─ index.ts
│  ├─ render-core/                 ← RenderIntent/RenderModel types, slot resolver
│  │  └─ index.ts
│  └─ render-web/                  ← React template runtime + default template
│     ├─ Template.tsx  slots.tsx  components/{Text,Mcq,Visual,Input}.tsx
│     └─ themes/default.ts
└─ examples/photosynthesis/        ← vertical slice (one lesson, one template)
```

**Dependency rule:** `core` and `render-core` know nothing of React or the DOM.
`beats` depends on `core` + `render-core`. `render-web` depends on
`render-core` only — it never imports the engine, it just consumes `RenderModel`
and pushes `LessonEvent`s back through a thin port.

---

## 8. The runtime loop (putting it together)

```ts
const session = createSession(lesson, defaultTemplate);
// 1. session.render  → RenderModel → <Template/> draws it
// 2. student clicks choice → port.send({ type: "MCQ.answer", id: "q1", choice: 1 })
// 3. engine: transition(chart, step, event) → new Step (pure)
// 4. run step.effects (persist, AI feedback request, timers)
// 5. re-render from step.render ; goto 2
```

The `Session` is the only stateful object; it wraps the pure interpreter, holds
the current `Step`, runs effects, and exposes `render` + `send`. Everything
above it (React) and below it (interpreter) stays pure/declarative.

---

## 9. How this generalizes later (non-goals now, but designed-for)

- **Video export:** a `Template` whose components render to a frame timeline
  instead of DOM; `ViewTransition`s become tweens. The lesson IR is unchanged.
- **AI agents authoring/editing:** the IR is JSON with a published JSON Schema
  (§7 `authoring/schema.ts`). Agents produce/patch IR; the schema + a validator
  guarantee well-formedness; `transition` replay verifies behavior.
- **Analytics & adaptivity:** `Context.history` is a complete event log; mastery
  models and adaptive branching read it without engine changes.

---

## 10. Resolved decisions

1. **Sequencing** — ✅ *Default to next; beats expose named outcomes routed via a
   table (§4.1).* Outcomes are an **open event channel** so gaze/LLM signals are
   first-class and adaptivity is a data change, not an engine change.
2. **Rich text** — ✅ *Portable node tree now* (`{ type, children, marks }`,
   ProseMirror-style) with a markdown parser feeding it. Every text intent and
   the future video path need structured text (animate/highlight spans); plain
   strings would force a painful migration. See `render-core/richtext.ts`.
3. **Persistence** — ✅ *Append every step to `Context.history`; flag certain
   states `checkpoint: true`.* Full replay **and** cheap resume — no tradeoff.
4. **Interpreter** — ✅ *Own it* (~200 lines) for exact control over the JSON IR
   that AI editing + replay depend on. XState's devtools/viz can later be a
   *consumer* of our IR rather than a dependency.

### Remaining for next pass (not blocking the vertical slice)

- Adaptive **policy** interface (the thing that injects `signal.*`/`llm.*`
  events and may rewrite routes) — sketched in §4.1, needs a concrete API.
- Lesson **IR JSON Schema** for agent authoring/validation (`authoring/schema.ts`).
```

