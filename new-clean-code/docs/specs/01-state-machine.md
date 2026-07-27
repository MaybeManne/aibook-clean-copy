# Spec 01 — `state_machine/`

A generic, pure, serializable hierarchical state machine. Generic over a context
type `C`. **Imports nothing from this repo.** Contains no concept of beats,
scores, lessons, slots, or rendering.

Modules: `types.ts`, `registry.ts`, `interpreter.ts`, `effects.ts`, `index.ts`.

### Invariants (normative)

- **Purity / determinism.** `transition` and `start` are pure; guards and actions
  MUST be deterministic and side-effect-free — no `Date.now()`, no `Math.random()`,
  no I/O. All nondeterminism and I/O is expressed as **effects** (declared, run by
  the shell) and re-enters as events. This is what makes replay and snapshotting
  exact; violating it silently breaks both.
- **Serializability.** A `Statechart<C>` is pure JSON (guards/actions/beats are
  by-name references). A runtime position is fully captured by
  `{ state: StateValue, context: C }` — see Snapshots.
- **Versioned IR.** Every `Statechart` carries a `version` so stored charts can be
  migrated. Snapshots record the version they were taken against.

---

## `types.ts` — the IR (pure JSON)

```ts
/** JSON value — the IR must be serializable to this. */
export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

export type StateId = string;

/** Hierarchical state value: "a" or { parent: "child" } or { p: { c: "leaf" } }. */
export type StateValue = string | { [parent: string]: StateValue };

/** The event a machine consumes. `type` is an open channel (see Route patterns). */
export interface MachineEvent {
  type: string;
  payload?: Json;
}

// ── References resolved by the Registry (keep the IR pure JSON) ──────────────
export type GuardRef = string;
export type ActionRef = string;

/** Event-type pattern: exact ("a.b") or trailing-wildcard prefix ("a.*"). */
export type EventPattern = string;

/** A guarded, action-bearing edge. `target` omitted = internal self-transition. */
export interface Transition {
  target?: StateId;
  guard?: GuardRef;
  actions?: ActionRef[];
}

/** Routing-table entry: pattern-matched edge. Resolved before `on[]` (see interpreter). */
export interface Route {
  on: EventPattern;
  guard?: GuardRef;
  target?: StateId;
  actions?: ActionRef[];
}

export interface StateNode {
  id: StateId;
  /** Compound state: nested children + required `initial`. */
  children?: Record<StateId, StateNode>;
  initial?: StateId;
  /** Exact event-type → ordered candidate transitions. */
  on?: Record<string, Transition[]>;
  /** Pattern-matched edges, evaluated most-specific-first, before `on`. */
  routes?: Route[];
  entry?: ActionRef[];
  exit?: ActionRef[];
  /** Resumable point (for persistence/analytics by higher layers). */
  checkpoint?: boolean;
  /**
   * Opaque payload for higher layers. The engine NEVER reads this. The lesson
   * layer stores its beat reference here ({ beat: { type, params } }).
   */
  meta?: Json;
}

/**
 * The machine definition. Pure data. `C` is a phantom type parameter that ties
 * a chart to the context type its guards/actions expect — structurally this is
 * still plain JSON. There is intentionally NO `flow` field: ordering/branching
 * is expressed as transitions by whoever authors the chart.
 */
export interface Statechart<C = unknown> {
  id: string;
  /** IR schema version for migration of stored charts/snapshots. */
  version: number;
  initial: StateId;
  states: Record<StateId, StateNode>;
  /** phantom — never present at runtime; for type association only. */
  readonly __context?: C;
}

/** A fully-restorable runtime position. Pure JSON when `C` is. */
export interface Snapshot<C> {
  chartId: string;
  version: number;       // chart version this was taken against
  state: StateValue;
  context: C;
}

/** Record of one transition. No `seq`/history here — that's a higher-layer concern. */
export interface TransitionRecord {
  event: MachineEvent;
  from: StateValue;
  to: StateValue;
}
```

---

## `registry.ts` — resolve names → functions

```ts
/** Pure predicate over context + event. */
export type Guard<C> = (ctx: C, event: MachineEvent) => boolean;

/** Declares a context patch + effects. Does NOT perform I/O. */
export interface ActionResult<C> {
  context?: Partial<C>;       // merged into context by the interpreter
  effects?: Effect[];         // handed to the shell to run
}
export type Action<C> = (ctx: C, event: MachineEvent) => ActionResult<C>;

/**
 * Name → function resolver for one context type. Holds ONLY guards and actions.
 * It does not know about beats — that is a lesson concept.
 */
export interface Registry<C> {
  guard(name: string, fn: Guard<C>): this;
  action(name: string, fn: Action<C>): this;
  getGuard(name: string): Guard<C>;    // → throws on unknown name
  getAction(name: string): Action<C>;  // → throws on unknown name
  hasGuard(name: string): boolean;
  hasAction(name: string): boolean;
}

/** Construct an empty registry for context type C. */
export function createRegistry<C>(): Registry<C>;
```

**Context merge contract:** the interpreter merges `ActionResult.context` into
the current context **shallowly** by top-level key. Nested objects are replaced
unless the higher layer supplies its own merge action. (The lesson layer adds a
deep-merge for `beats`/`vars`.) The engine itself assumes nothing about `C`'s
shape beyond it being an object.

---

## `interpreter.ts` — the pure reducer

```ts
export interface Step<C> {
  state: StateValue;
  context: C;
  effects: Effect[];          // produced by the transition just taken
  done: boolean;              // true once a terminal state is reached
  lastRecord?: TransitionRecord; // the edge just traversed (for higher-layer history)
}

/** Does an event type match a Route/`on` pattern? Exact, or trailing "*" prefix. */
export function matchPattern(pattern: EventPattern, type: string): boolean;

/** Enter `chart.initial`, run its entry actions. Pure. */
export function start<C>(chart: Statechart<C>, context: C, reg: Registry<C>): Step<C>;

/**
 * Advance one event. Pure: (chart, step, event, reg) → step'. No I/O.
 * Replaying a sequence of events through `transition` reconstructs any session.
 */
export function transition<C>(
  chart: Statechart<C>,
  step: Step<C>,
  event: MachineEvent,
  reg: Registry<C>,
): Step<C>;

// ── Snapshots: O(1) save/restore of a runtime position ───────────────────────
/** Capture the current position. Pure. */
export function snapshot<C>(chart: Statechart<C>, step: Step<C>): Snapshot<C>;

/**
 * Rebuild a Step from a snapshot WITHOUT replaying history. Pure.
 * Throws if `snap.version !== chart.version` (caller must migrate first).
 * Note: does NOT re-run entry actions — it restores the recorded position as-is.
 */
export function restore<C>(chart: Statechart<C>, snap: Snapshot<C>): Step<C>;
```

### Event resolution order (normative — HSM with bubbling)

Resolution walks the **active state chain from the deepest active child up to the
root** (child-first, bubbling). At each node in the chain, resolve `event` to:

1. **take** — a `routes[]` entry whose pattern matches *and* whose guard passes
   (most-specific first); else an `on[event.type]` candidate whose guard passes.
   → traverse to `target` (or self if `target` omitted), running
   `exit → transition.actions → entry` along the path between source and target
   leaves (exit/entry skipped on internal self-transition). **Stop walking.**
2. **declared** — the event *is* handled by this node (a matching pattern/key
   exists) but no candidate passed its guard, **or** the matched edge list is
   empty (`on.next: []`). → no transition at this node; if terminal-by-design
   this yields `done: true`. **Stop walking; never bubble past a declared node.**
3. **unhandled** — the event type is not declared on this node. → **bubble up**
   to the parent and repeat. If the root is also `unhandled`, the `Step` is
   returned unchanged (event ignored).

Bubbling is what makes a parent able to handle an event once for all its
children (e.g. "any quiz sub-state → abort on `timeout`"). A child that *declares*
the event (even to no-op) shadows the parent — declared stops the walk.

> There is **no `flow` fallback**. Linear ordering is not an engine feature; the
> author (or the lesson compiler) emits explicit `on.next` transitions. This is
> the core change that keeps the engine generic.

### Hierarchy (descent)

`start`/`transition` resolve a compound `target` to its `initial` leaf
(`resolveInitial`), producing a nested `StateValue`. Entry/exit actions run for
every node entered/exited along the transition path, ordered outermost-exit →
innermost-entry.

### v1 implementation note (deferred subset)

The **spec above is normative**, but the **v1 interpreter implements the flat
subset**: resolution runs against the top-level node only (no bubbling). Charts
authored today use a single level, so behavior is identical. Bubbling +
multi-level entry/exit ordering is the first interpreter feature to land after
the reorg (see Open Items); when it does, no spec or authored-chart change is
needed — flat charts are a strict subset. MCQ stays blackboard-flat until then.

---

## `effects.ts` — declared, not executed

```ts
/**
 * An effect is DECLARED by an action and RUN by the shell (the higher-layer
 * Session), never by the interpreter. Open set.
 */
export type Effect =
  | { kind: "persist"; payload: Json }
  | { kind: "timer"; ms: number; emit: MachineEvent }
  | { kind: string; [k: string]: unknown };
```

---

## `index.ts` — public surface

Re-exports: all of `types`, `registry`, `interpreter`, `effects`. Nothing else.

## Open items (engine extension points)

- **Nested event resolution (bubbling)**: spec'd as normative above; **v1 ships
  the flat subset**. This is the first feature to implement post-reorg —
  required before beats with internal multi-step sub-machines.
- **Parallel/orthogonal regions**: out of scope; revisit if a beat needs
  concurrent sub-states.
- **History states** (resume a compound state at its last child): out of scope.
- **Chart migration**: when `version` bumps, a `migrate(oldChart|snapshot)` step
  is needed. Mechanism TBD (lesson-layer concern; engine just enforces the
  version check in `restore`).
