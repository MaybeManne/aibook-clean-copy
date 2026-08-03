export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

export type StateId = string;

/** Hierarchical state value: "a" | { parent: "child" } | { p: { c: "leaf" } }. */
export type StateValue = string | { [parent: string]: StateValue };

/** The event a machine consumes. `type` is an open channel (see EventPattern). */
export interface MachineEvent {
  type: string;
  payload?: Json;
}

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

/** Routing-table entry: a pattern-matched edge, resolved before `on[]`. */
export interface Route {
  on: EventPattern;
  guard?: GuardRef;
  target?: StateId;
  actions?: ActionRef[];
  /**
   * Data-driven target selection: read `field` off the event payload and look it up in `cases`.
   * The targets are STATIC ids written by whoever compiled the chart, so a payload chooses among
   * pre-authored edges and cannot name a state that isn't there. (Introducing states and edges at
   * play time is `lesson/direction`'s job — `addBeat`, `rerouteBeat` — where every proposal is
   * validated against a shadow chart and installed all-or-nothing.)
   */
  match?: { field: string; cases: Record<string, StateId>; default?: StateId };
}

export interface StateNode {
  id: StateId;
  /** Compound state: nested children + required `initial`. */
  children?: Record<StateId, StateNode>;
  initial?: StateId;
  /** Exact event-type → ordered candidate transitions. `[]` = terminal on that event. */
  on?: Record<string, Transition[]>;
  /** Pattern-matched edges, evaluated most-specific-first, before `on`. */
  routes?: Route[];
  entry?: ActionRef[];
  exit?: ActionRef[];
  /** Resumable point (for snapshot/analytics by higher layers). */
  checkpoint?: boolean;
  /** Opaque payload for higher layers. The engine NEVER reads this. */
  meta?: Json;
}

/**
 * The machine definition. Pure data. `C` is a phantom type tying a chart to the
 * context its guards/actions expect. There is intentionally NO `flow` field:
 * ordering/branching is expressed as transitions by whoever authors the chart.
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
  version: number;
  state: StateValue;
  context: C;
}

/** Record of one transition. No `seq`/history here — that's a higher-layer concern. */
export interface TransitionRecord {
  event: MachineEvent;
  from: StateValue;
  to: StateValue;
}
