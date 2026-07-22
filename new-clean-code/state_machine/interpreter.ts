// The pure interpreter: (chart, step, event, reg) → step'. No I/O. Generic over
// the context type `C`. Fully replayable by folding events through `transition`.
//
// v1 resolves events against the TOP-LEVEL active node only (the "flat subset"
// of the spec). Hierarchical bubbling is the first post-reorg feature; flat
// charts are a strict subset, so it lands without changing this API.

import type { Action, ActionResult, Guard, Registry } from "./registry.js";
import type { Effect } from "./effects.js";
import type {
  ActionRef,
  EventPattern,
  MachineEvent,
  Route,
  Snapshot,
  Statechart,
  StateId,
  StateNode,
  StateValue,
  TransitionRecord,
} from "./types.js";

export interface Step<C> {
  state: StateValue;
  context: C;
  effects: Effect[];          // produced by the transition just taken
  done: boolean;              // true once a terminal state is reached
  lastRecord?: TransitionRecord; // the edge just traversed (for higher-layer history)
}

/** Does an event type match a Route/`on` pattern? Exact, or trailing "*" prefix. */
export function matchPattern(pattern: EventPattern, type: string): boolean {
  if (pattern === type) return true;
  if (pattern.endsWith("*")) return type.startsWith(pattern.slice(0, -1));
  return false;
}

// ── internal helpers ─────────────────────────────────────────────────────────

function node<C>(chart: Statechart<C>, id: StateId): StateNode {
  const n = chart.states[id];
  if (!n) throw new Error(`Unknown state: "${id}"`);
  return n;
}

/** Current top-level state id from a (possibly nested) StateValue. */
function topId(state: StateValue): StateId {
  return typeof state === "string" ? state : Object.keys(state)[0]!;
}

/** Descend a compound state to its initial leaf, producing a concrete value. */
function resolveInitial(n: StateNode): StateValue {
  if (n.children && n.initial) {
    const child = n.children[n.initial];
    if (child) return { [n.id]: resolveInitial(child) };
  }
  return n.id;
}

/** Shallow-merge an action's context patch. Actions build full sub-objects themselves. */
function mergeContext<C>(ctx: C, patch: Partial<C> | undefined): C {
  return patch ? { ...ctx, ...patch } : ctx;
}

function applyActions<C>(
  ctx: C,
  event: MachineEvent,
  reg: Registry<C>,
  refs: ActionRef[] | undefined,
): { ctx: C; effects: Effect[] } {
  let cur = ctx;
  const effects: Effect[] = [];
  for (const ref of refs ?? []) {
    const res: ActionResult<C> = reg.getAction(ref)(cur, event);
    cur = mergeContext(cur, res.context);
    if (res.effects) effects.push(...res.effects);
  }
  return { ctx: cur, effects };
}

type Resolution =
  | { kind: "take"; target: StateId; actions?: ActionRef[] }
  | { kind: "terminal" } // matched an explicitly-empty handler (`on.x: []`)
  | { kind: "none" };    // unhandled, or all guards failed → no-op

function passes<C>(guard: string | undefined, ctx: C, event: MachineEvent, reg: Registry<C>): boolean {
  return guard ? reg.getGuard(guard)(ctx, event) : true;
}

/** Resolve `match` sugar to a pre-authored target, or undefined if no case hit. */
function matchTarget(route: Route, event: MachineEvent): StateId | undefined {
  if (!route.match) return route.target;
  const field = route.match.field;
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  const key = String(payload[field]);
  return route.match.cases[key] ?? route.match.default;
}

/** Resolve an event against ONE node: routes (pattern) first, then `on` (exact). */
function resolve<C>(cur: StateNode, event: MachineEvent, ctx: C, reg: Registry<C>): Resolution {
  for (const r of cur.routes ?? []) {
    if (!matchPattern(r.on, event.type)) continue;
    if (!passes(r.guard, ctx, event, reg)) continue;
    if (r.match) {
      const target = matchTarget(r, event);
      if (target === undefined) continue; // no case matched → fall through
      return { kind: "take", target, actions: r.actions };
    }
    return { kind: "take", target: r.target ?? cur.id, actions: r.actions };
  }

  const candidates = cur.on?.[event.type];
  if (candidates !== undefined) {
    if (candidates.length === 0) return { kind: "terminal" };
    for (const t of candidates) {
      if (passes(t.guard, ctx, event, reg)) {
        return { kind: "take", target: t.target ?? cur.id, actions: t.actions };
      }
    }
  }
  return { kind: "none" };
}

// ── public API ───────────────────────────────────────────────────────────────

/** Enter an arbitrary node by id, running its entry actions, descending to its
 *  initial leaf. Pure. Used to start a chart and to jump into a node spliced in at
 *  runtime (a generated beat) without a pre-authored edge. */
export function enter<C>(
  chart: Statechart<C>,
  id: StateId,
  context: C,
  reg: Registry<C>,
  event: MachineEvent = { type: "@enter" },
): Step<C> {
  const n = node(chart, id);
  const { ctx, effects } = applyActions(context, event, reg, n.entry);
  return { state: resolveInitial(n), context: ctx, effects, done: false };
}

/** Enter `chart.initial`, run its entry actions. Pure. */
export function start<C>(chart: Statechart<C>, context: C, reg: Registry<C>): Step<C> {
  return enter(chart, chart.initial, context, reg, { type: "@init" });
}

/** Advance one event. Pure. */
export function transition<C>(
  chart: Statechart<C>,
  step: Step<C>,
  event: MachineEvent,
  reg: Registry<C>,
): Step<C> {
  const fromId = topId(step.state);
  const cur = node(chart, fromId);
  const res = resolve(cur, event, step.context, reg);

  if (res.kind === "none") return step;                       // ignore event
  if (res.kind === "terminal") {
    return { state: step.state, context: step.context, effects: [], done: true };
  }

  const targetId = res.target;
  const leaving = targetId !== fromId;
  let ctx = step.context;
  let effects: Effect[] = [];

  if (leaving) {
    const ex = applyActions(ctx, event, reg, cur.exit);
    ctx = ex.ctx;
    effects = effects.concat(ex.effects);
  }
  const ta = applyActions(ctx, event, reg, res.actions);
  ctx = ta.ctx;
  effects = effects.concat(ta.effects);

  const target = node(chart, targetId);
  if (leaving) {
    const en = applyActions(ctx, event, reg, target.entry);
    ctx = en.ctx;
    effects = effects.concat(en.effects);
  }

  const nextState = resolveInitial(target);
  const record: TransitionRecord = { event, from: step.state, to: nextState };
  return { state: nextState, context: ctx, effects, done: false, lastRecord: record };
}

// ── snapshots: O(1) save/restore of a runtime position ───────────────────────

export function snapshot<C>(chart: Statechart<C>, step: Step<C>): Snapshot<C> {
  return { chartId: chart.id, version: chart.version, state: step.state, context: step.context };
}

/** Rebuild a Step from a snapshot WITHOUT replaying. Throws on version mismatch. */
export function restore<C>(chart: Statechart<C>, snap: Snapshot<C>): Step<C> {
  if (snap.version !== chart.version) {
    throw new Error(
      `Snapshot version ${snap.version} != chart "${chart.id}" version ${chart.version}; migrate first.`,
    );
  }
  return { state: snap.state, context: snap.context, effects: [], done: false };
}
