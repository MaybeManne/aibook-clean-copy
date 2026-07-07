# Spec 03 — `lesson/`

Lesson semantics on top of the generic engine. Defines the concrete
`LessonContext`, the predefined `beats`, and an authoring API that compiles
**teacher-authored flow** into generic `Statechart<LessonContext>` transitions.
Owns history.

Depends on `state_machine` + `render_contract`. Sub-modules: `lesson_sm/`,
`beats/`, `authoring/`.

> **Design axiom (from the user): the teacher defines the lesson flow.** Flow and
> branching are authored data, not engine features and not fixed policy. The
> compiler's job is to translate the teacher's flow into explicit transitions;
> `mcq→remediate` is one convenience sugar, not a built-in.

---

## `lesson_sm/context.ts` — the concrete context

```ts
import type { Json, MachineEvent, StateValue } from "@lessonkit/state-machine";

/** One recorded transition, with a monotonic sequence number. */
export interface EventRecord {
  seq: number;
  event: MachineEvent;
  from: StateValue;
  to: StateValue;
}

/** The blackboard. This is the `C` the engine is instantiated with. */
export interface LessonContext {
  beats: Record<string, Json>;   // per-beat local state, keyed by beat id
  score: number;                 // cumulative mastery signal
  vars: Record<string, Json>;    // teacher-defined variables (escape hatch)
  history: EventRecord[];        // complete audit trail (owned by Session)
}

export function initialContext(vars?: Record<string, Json>): LessonContext;

/** Immutable helper: set one beat's local state. Pure. */
export function withBeatState(ctx: LessonContext, beatId: string, state: Json): LessonContext;

/**
 * The lesson layer's deep-merge action result helper: merges `beats`/`vars`
 * by key rather than replacing them (the engine's default merge is shallow).
 * Registered as a base action so beats can patch beat-local state safely.
 */
export function mergeLessonContext(
  ctx: LessonContext, patch: Partial<LessonContext>,
): LessonContext;
```

---

## `lesson_sm/compile.ts` — teacher flow → generic transitions

This is where authored flow becomes engine IR. It is the only place that knows
about both beats and the engine.

```ts
import type { Registry, Route, Statechart } from "@lessonkit/state-machine";
import type { LessonContext } from "./context.js";

/** A beat instance as authored (plain data; an agent could emit this directly). */
export interface BeatSpec {
  id: string;
  type: string;            // registered beat type, e.g. "explain" | "mcq"
  params: Json;
  /** Teacher-authored extra outcome routing for this beat. */
  routes?: Route[];
  /**
   * Default "next" target on the linear spine:
   *   undefined → the following spine beat;
   *   string    → explicit target (detour beats use this to rejoin);
   *   null      → terminal (ends the lesson).
   */
  next?: string | null;
}

export interface LessonSpec {
  id: string;
  /** IR schema version, propagated to the compiled Statechart for migration. */
  version: number;
  title: string;
  flow: BeatSpec[];        // the authored ordering ("spine") + detour beats
}

/** The compiled, runnable artifact. */
export interface CompiledLesson {
  spec: LessonSpec;
  chart: Statechart<LessonContext>;
  registry: Registry<LessonContext>;
}

/**
 * Compile authored flow into a generic chart. Pure. Responsibilities:
 *  - Build each beat's StateNode via its BeatDef.build(), storing the beat ref
 *    in StateNode.meta ({ beat: { type, params } }).
 *  - Compute the SPINE = flow minus detour targets, and turn each beat's default
 *    "next" into an explicit `on.next` transition (string target, or [] = terminal).
 *  - DETOUR TARGETS (any id referenced as a route target / branch then-else) are
 *    excluded from the spine so a beat's "next" skips over them.
 *  - Register per-instance guards/actions the beats need (see beats spec).
 *  - Produce `Registry<LessonContext>` seeded with base guards/actions.
 */
export function compileLesson(
  spec: LessonSpec,
  beatRegistry: BeatRegistry,   // see beats spec
): CompiledLesson;              // → throws CompileError on invalid flow
```

**Note:** `compileLesson` emits explicit transitions for everything — the engine
has no flow concept, so "spine" exists only here at compile time.

### Validation (fail loud — the safety net for AI-authored lessons)

`compileLesson` runs `validate` first and throws `CompileError` (with all
problems, not just the first) on any structural fault. This is the analogue of
SocraticAI's per-stage asserters and the thing that turns a bad agent-authored
lesson into a precise message instead of a runtime wedge.

```ts
export interface CompileProblem {
  code: "DANGLING_TARGET" | "UNKNOWN_BEAT" | "UNKNOWN_GUARD" | "UNKNOWN_ACTION"
      | "DUPLICATE_ID" | "UNREACHABLE_BEAT" | "NO_TERMINAL" | "BAD_VERSION";
  beatId?: string;
  detail: string;
}
export class CompileError extends Error { problems: CompileProblem[]; }

/** Pure structural check; returns [] when valid. Used by compileLesson + tooling. */
export function validate(spec: LessonSpec, beatRegistry: BeatRegistry): CompileProblem[];
```

Checks: unique beat ids; every `next`/route/branch target resolves to an existing
beat; every referenced beat type / guard / action is registered; every beat is
reachable from `flow[0]`; at least one terminal path exists (no all-cycles).

---

## `beats/` — the predefined building blocks

```ts
import type { Json, StateNode } from "@lessonkit/state-machine";
import type { RenderIntent } from "@lessonkit/render-contract";
import type { LessonContext } from "../lesson_sm/context.js";

/** The statechart half of a beat (lives at engine altitude). */
export interface BeatDef<P = Json> {
  type: string;
  /** Build the StateNode for an instance; store beat ref in node.meta. */
  build(params: P, id: string): StateNode;
  /** Advisory list of outcome event types this beat can emit (for tooling/agents). */
  outcomes?: string[];
  /**
   * Per-instance wiring hook: register guards/actions this beat needs and return
   * the routes/transitions to splice in. Called by compileLesson. Optional —
   * simple beats (Explain) need none.
   */
  wire?(params: P, id: string, ctx: BeatWireCtx): BeatWiring;
}

export interface BeatWireCtx {
  registry: Registry<LessonContext>;
  /** Resolve this beat's default-next target (string | null) from the compiler. */
  defaultNext(): string | null;
}
export interface BeatWiring {
  routes?: Route[];
  on?: Record<string, Transition[]>;
}

/** The render half: turn (params, current leaf state, context) → intents. */
export interface RenderableBeat<P = Json> extends BeatDef<P> {
  render(params: P, state: string, ctx: LessonContext): RenderIntent[];
  /**
   * Optional TIMED half (video subsystem, spec 06/08): the beat's animation as a
   * Storyboard. Beats without it are instant (today's behavior); a Player samples
   * this over beat time `t` and emits the advance event at the end. `render()`
   * may return the t=end snapshot as a fallback for non-player contexts.
   */
  storyboard?(params: P, state: string, ctx: LessonContext): Storyboard;
}

/** A name→RenderableBeat map, used by both the compiler and the renderer. */
export type BeatRegistry = Record<string, RenderableBeat>;

/** Extract the leaf state name for a beat id from a (nested) StateValue. Pure. */
export function leafState(state: StateValue, beatId: string): string;

/** Built-in beats and a helper to assemble the default registry. */
export const builtinBeats: BeatRegistry;            // { explain, mcq, ... }
export function defaultBeatRegistry(): BeatRegistry; // clone of builtinBeats
```

### Built-in beat params

```ts
// Explain — show text (+ optional visual); advances on "next".
export interface ExplainParams {
  text: string | RichText;
  visual?: VisualRef & { slot?: string };
  textSlot?: string;            // default "prose"
}
// outcomes: ["next"]; wire: none.

// MCQ — two-phase: answer (records, shows feedback) → next (advances/routes).
export interface ChoiceSpec { text: string; correct?: boolean }
export interface McqParams {
  prompt: string | RichText;
  choices: ChoiceSpec[];
  maxAttempts?: number;
  correctFeedback?: string;
  wrongFeedback?: string;
  promptSlot?: string;          // default "prompt"
}
// outcomes: ["correct", "wrong", "next"]
// wire: registers `mcq.record:<id>` action + `wasWrong:<id>` guard; emits the
//   two-phase routing (self-transition on mcq.answer → records; on "next" routes
//   by recorded correctness to onWrong target or default-next).
// render: reads beats[id] local state to switch unanswered/answered views.
```

> MCQ is intentionally a **flat** node in v1 (answered-ness tracked on the
> blackboard, not nested children) because the engine resolves events at the top
> level only. When nested event resolution lands (state_machine Open Items), MCQ
> can become a true sub-machine without changing its authored API.

---

## `authoring/` — defineLesson, DSL sugar, Session

### DSL (thin; returns plain `BeatSpec`s — an agent could skip it)

```ts
export function defineLesson(spec: LessonSpec): CompiledLesson;  // = compileLesson(spec, defaultBeatRegistry())

export function explain(p: { id: string; next?: string | null } & ExplainParams): BeatSpec;

export interface McqAuthoring extends McqParams {
  id: string;
  onWrong?: string;     // teacher-authored: route a wrong answer here (a detour)
  onTimeout?: string;
}
export function mcq(p: McqAuthoring): BeatSpec;

export function branch(p: {
  id: string;
  when: Guard<LessonContext>;   // escape-hatch predicate (registered during compile)
  then: string;
  else: string;
}): BeatSpec;
```

> The teacher composes flow with these. `onWrong`/`branch` are how a teacher
> *expresses* branching; the compiler lowers them to generic routes. No branching
> policy is hidden in the engine.

### Session — the one stateful object (the "shell")

```ts
import type { MachineEvent, Step, Effect, Snapshot } from "@lessonkit/state-machine";
import type { RenderModel } from "@lessonkit/render-contract";

export interface Session {
  /** Current render model from the active beat. Pure read. */
  render(): RenderModel;
  /** Apply an event: transition (pure) → record history → run effects → update. */
  send(event: MachineEvent): void;
  readonly done: boolean;
  readonly context: LessonContext;
  /** Id of the active top-level beat. */
  activeBeatId(): string;
}

export interface SessionOptions {
  vars?: Record<string, Json>;
  runner?: EffectRunner;     // default runner handles persist/timer; see below
  policies?: Policy[];       // adaptive observers; see below
}
export function createSession(lesson: CompiledLesson, opts?: SessionOptions): Session;
```

**Session responsibilities (the boundary between pure engine and effectful world):**
- Calls `start`/`transition` from the engine (pure).
- **Records history**: appends an `EventRecord` (with `seq`) built from
  `Step.lastRecord` — the engine no longer writes history.
- **Runs effects** via the `EffectRunner` (below), tracking in-flight effects so
  they can be cancelled when their originating state is exited.
- **Consults policies** after each step (below) and injects any returned events.
- Stashes the active beat id (e.g. `vars.__activeBeat`) so a beat's `render` can
  locate its own local state.

### EffectRunner — async effects with cancellation (#1)

Effects are async and may outlive the step that spawned them (LLM grading,
network, timers). The runner owns that lifecycle; the engine stays pure.

```ts
export interface EffectContext {
  /** aborted when the state that spawned this effect is exited, or on dispose. */
  signal: AbortSignal;
  /** feed a resulting event back into the session (e.g. ai-feedback verdict). */
  send: (event: MachineEvent) => void;
  ctx: LessonContext;
}
export interface EffectRunner {
  /** Run one effect. May be async. Must respect `signal`. */
  run(effect: Effect, ec: EffectContext): void | Promise<void>;
}
```

**Cancellation contract (the SocraticAI bleed-point, fixed by design):**
- Each in-flight effect is keyed by the `StateValue` active when it started.
- On any transition that **exits** that state, the Session aborts its signal.
- A late result from an aborted effect is dropped (its `send` is a no-op).
- This replaces SocraticAI's ad-hoc cancellation tokens / `isStuck()`/`recoverState()`
  with a single structural rule: effects don't outlive their state.

### Policy — the adaptive-signal seam (#2)

Policies observe each step and may inject events. This is the clean home for
gaze/affect/LLM signals: they enter as ordinary `signal.*` / `llm.*` events on
the open channel, so routing/guards handle them with no engine change.

```ts
export interface Policy {
  /** Observe a settled step; return events to inject (in order). Pure-ish:
   *  may read step/lesson, must not mutate them. Async signal sources push via
   *  an effect instead and surface here on the next step. */
  observe(step: Step<LessonContext>, lesson: CompiledLesson): MachineEvent[];
}
```

The Session calls each policy after applying an event + running effects, then
feeds returned events back through `send` (bounded to avoid loops). *Specified,
not implemented in the reorg* — but the seam (and the `policies` option) exists
so nothing downstream needs reshaping to add it.

### Snapshot / restore + replay (#4)

Two persistence paths, both spec'd:

```ts
/** O(1) resume: persist/restore the live position. Wraps engine snapshot/restore. */
export function snapshotSession(s: Session): Snapshot<LessonContext>;
export function restoreSession(lesson: CompiledLesson, snap: Snapshot<LessonContext>): Session;

/** O(n) audit/debug: fold the full event log through the pure interpreter. */
export function replay(lesson: CompiledLesson, history: EventRecord[]): Session;
```

- **Snapshot** = `{ state, context, version }`; cheap, for normal resume.
  `restoreSession` throws if the snapshot version mismatches the lesson.
- **Replay** reconstructs from the event log; relies on the determinism invariant
  (spec 01) and is the source of truth for analytics/debugging.
- Recommended: snapshot at `checkpoint` states; keep the event log for analytics.

---

## `index.ts` — public surface

Re-exports `lesson_sm` (context, compile types), `beats` (defs, params,
registry, leafState), `authoring` (defineLesson, dsl, Session, replay).

## Open items
- **Policy implementations**: the `Policy` seam is spec'd above; concrete
  policies (gaze/affect adapters, LLM-misconception judge) are deferred. Route
  rewriting (vs. event injection) is a possible v2 extension to `observe`.
- **More beats**: FreeResponse, Interactive (slider/`compute`, never-wrong),
  Checkpoint, Branch-as-beat. Each is a new `RenderableBeat`; no engine change.
- **Chart migration**: a `migrate(spec, fromVersion)` step when `version` bumps
  (pairs with the engine's `restore` version check).
