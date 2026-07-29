// Compile teacher-authored flow into a generic Statechart<LessonContext>.
// This is the ONLY module that knows about both beats and the engine. The
// engine has no flow concept, so the "spine" (linear default ordering) exists
// only here, at compile time, and is lowered into explicit transitions.

import {
  createRegistry,
  type Action,
  type Guard,
  type Json,
  type Registry,
  type Route,
  type StateId,
  type StateNode,
  type Statechart,
} from "@lessonstudio/state-machine";
import type { BeatRegistry } from "../beats/index.js";
import type { LessonContext } from "./context.js";

/** A beat instance as authored. Plain data — an agent could emit this directly. */
export interface BeatSpec {
  id: string;
  type: string;
  params: Json;
  routes?: Route[];
  /** undefined → next spine beat; string → explicit target; null → terminal. */
  next?: string | null;
  /** Escape-hatch inline guards/actions to register (e.g. a branch predicate). */
  __guards?: Record<string, Guard<LessonContext>>;
  __actions?: Record<string, Action<LessonContext>>;
}

export interface LessonSpec {
  id: string;
  version: number;
  title: string;
  flow: BeatSpec[];
}

export interface CompiledLesson {
  spec: LessonSpec;
  chart: Statechart<LessonContext>;
  registry: Registry<LessonContext>;
  /** the beat registry used to compile — the renderer reads render() from here. */
  beats: BeatRegistry;
}

// ── validation ───────────────────────────────────────────────────────────────

export interface CompileProblem {
  code:
    | "BAD_VERSION"
    | "DUPLICATE_ID"
    | "UNKNOWN_BEAT"
    | "DANGLING_TARGET"
    | "UNREACHABLE_BEAT"
    | "NO_TERMINAL";
  beatId?: string;
  detail: string;
}

export class CompileError extends Error {
  constructor(public problems: CompileProblem[]) {
    super(`Lesson failed to compile:\n` + problems.map((p) => `  [${p.code}] ${p.detail}`).join("\n"));
    this.name = "CompileError";
  }
}

/** Out-of-band jump targets a beat declares (used for detours + validation). */
function beatTargets(b: BeatSpec): string[] {
  const out: string[] = [];
  const p = b.params as Record<string, unknown>;
  // onWrong/onTimeout detours are declared by gate beats (mcq, freeResponse, …).
  if (typeof p.onWrong === "string") out.push(p.onWrong);
  if (typeof p.onTimeout === "string") out.push(p.onTimeout);
  if (b.type === "branch") {
    if (typeof p.then === "string") out.push(p.then);
    if (typeof p.else === "string") out.push(p.else);
  }
  for (const r of b.routes ?? []) {
    if (r.target) out.push(r.target);
    if (r.match) {
      out.push(...Object.values(r.match.cases));
      if (r.match.default) out.push(r.match.default);
    }
  }
  return out;
}

/** Pure structural check; returns [] when valid. */
export function validate(spec: LessonSpec, beats: BeatRegistry): CompileProblem[] {
  const problems: CompileProblem[] = [];
  if (!Number.isInteger(spec.version) || spec.version < 1) {
    problems.push({ code: "BAD_VERSION", detail: `version must be a positive integer, got ${spec.version}` });
  }

  const ids = new Set<string>();
  for (const b of spec.flow) {
    if (ids.has(b.id)) problems.push({ code: "DUPLICATE_ID", beatId: b.id, detail: `duplicate beat id "${b.id}"` });
    ids.add(b.id);
    if (!beats[b.type]) problems.push({ code: "UNKNOWN_BEAT", beatId: b.id, detail: `unknown beat type "${b.type}"` });
  }

  const exists = (id: string | null | undefined): boolean => id == null || ids.has(id);
  for (const b of spec.flow) {
    if (typeof b.next === "string" && !exists(b.next)) {
      problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `next → "${b.next}" does not exist` });
    }
    for (const t of beatTargets(b)) {
      if (!exists(t)) problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `target → "${t}" does not exist` });
    }
  }

  // Reachability + terminal checks only meaningful if structure is otherwise sound.
  if (problems.length === 0 && spec.flow.length > 0) {
    const { reachable, hasTerminal } = analyze(spec);
    for (const b of spec.flow) {
      if (!reachable.has(b.id)) {
        problems.push({ code: "UNREACHABLE_BEAT", beatId: b.id, detail: `beat "${b.id}" is unreachable from "${spec.flow[0]!.id}"` });
      }
    }
    if (!hasTerminal) {
      problems.push({ code: "NO_TERMINAL", detail: "no reachable beat terminates the lesson (set next: null somewhere)" });
    }
  }
  return problems;
}

// ── spine / default-next ─────────────────────────────────────────────────────

function buildSpine(spec: LessonSpec) {
  const flow = spec.flow.map((b) => b.id);
  const detours = new Set<string>();
  for (const b of spec.flow) beatTargets(b).forEach((t) => detours.add(t));
  const spine = flow.filter((id) => !detours.has(id));
  const spineNext = (id: string): string | null => {
    const i = spine.indexOf(id);
    return i >= 0 && i + 1 < spine.length ? spine[i + 1]! : null;
  };
  const defaultNext = (b: BeatSpec): string | null => (b.next !== undefined ? b.next : spineNext(b.id));
  return { defaultNext };
}

/** Compute reachable set + whether any reachable beat terminates. */
function analyze(spec: LessonSpec) {
  const { defaultNext } = buildSpine(spec);
  const byId = new Map(spec.flow.map((b) => [b.id, b]));
  const neighbors = (b: BeatSpec): string[] => {
    const dn = defaultNext(b);
    return [...(dn ? [dn] : []), ...beatTargets(b)];
  };
  const reachable = new Set<string>();
  const queue = [spec.flow[0]!.id];
  let hasTerminal = false;
  while (queue.length) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const b = byId.get(id);
    if (!b) continue;
    if (defaultNext(b) === null) hasTerminal = true;
    for (const n of neighbors(b)) if (!reachable.has(n)) queue.push(n);
  }
  return { reachable, hasTerminal };
}

// ── base registry ─────────────────────────────────────────────────────────────

/** A registry seeded with always-available lesson guards/actions. */
export function baseLessonRegistry(): Registry<LessonContext> {
  return createRegistry<LessonContext>()
    .guard("always", () => true)
    .action("incScore", (ctx) => ({ context: { score: ctx.score + 1 } }));
}

// ── lowering ─────────────────────────────────────────────────────────────────

/**
 * Lower ONE beat into a StateNode: register its inline guards/actions and wire its
 * default-next edge. Shared by `compileLesson` (spine order, resolved per beat) and
 * `Session.spliceBeat` (runtime-generated beats, whose `defaultNext` is just their
 * own `next`). `defaultNext` is the already-resolved advance target (id, or null =
 * terminal on advance).
 */
export function lowerBeat(
  b: BeatSpec,
  beatDef: BeatRegistry[string],
  reg: Registry<LessonContext>,
  defaultNext: string | null,
): StateNode {
  // register escape-hatch inline guards/actions (e.g. a branch predicate)
  for (const [name, fn] of Object.entries(b.__guards ?? {})) reg.guard(name, fn);
  for (const [name, fn] of Object.entries(b.__actions ?? {})) reg.action(name, fn);

  const nodeBase = beatDef.build(b.params, b.id);
  const node: StateNode = { ...nodeBase, routes: [...(nodeBase.routes ?? []), ...(b.routes ?? [])] };

  if (beatDef.wire) {
    const wiring = beatDef.wire(b.params, b.id, { registry: reg, defaultNext: () => defaultNext });
    if (wiring.routes) node.routes = [...wiring.routes, ...(node.routes ?? [])];
    if (wiring.on) node.on = { ...(node.on ?? {}), ...wiring.on };
  } else {
    node.on = { ...(node.on ?? {}), next: defaultNext ? [{ target: defaultNext }] : [] };
  }
  return node;
}

/**
 * Validate a SINGLE runtime-authored (e.g. LLM-generated) beat before splicing it
 * into a live chart. Unlike `validate`, targets may point at any beat that already
 * exists in `chart` OR at the new beat itself. Returns [] when valid. Pure.
 */
export function validateBeatSpec(b: BeatSpec, beats: BeatRegistry, chart: Statechart<LessonContext>): CompileProblem[] {
  const problems: CompileProblem[] = [];
  if (!beats[b.type]) problems.push({ code: "UNKNOWN_BEAT", beatId: b.id, detail: `unknown beat type "${b.type}"` });
  const exists = (id: string | null | undefined): boolean => id == null || id === b.id || chart.states[id] !== undefined;
  if (typeof b.next === "string" && !exists(b.next)) {
    problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `next → "${b.next}" does not exist` });
  }
  for (const t of beatTargets(b)) {
    if (!exists(t)) problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `target → "${t}" does not exist` });
  }
  return problems;
}

/**
 * Validate a runtime reroute (rewriting an existing beat's edge) against a live chart:
 * the beat must exist and the new target must already exist (or be `null` = terminal). An
 * LLM/agent picks among PRE-AUTHORED beats — it can rewire an edge but never invent a
 * node — so this is the reroute analogue of `validateBeatSpec`'s dangling-target check.
 * Returns [] when valid. Pure.
 */
export function validateReroute(beatId: string, target: string | null, chart: Statechart<LessonContext>): CompileProblem[] {
  const problems: CompileProblem[] = [];
  if (chart.states[beatId] === undefined) {
    problems.push({ code: "DANGLING_TARGET", beatId, detail: `rerouteBeat: beat "${beatId}" does not exist in the chart` });
  }
  if (target !== null && chart.states[target] === undefined) {
    problems.push({ code: "DANGLING_TARGET", beatId, detail: `rerouteBeat: target "${target}" does not exist` });
  }
  return problems;
}

/** All beats a node can advance/detour to (union of `on` targets and route targets). */
function outgoing(n: StateNode): string[] {
  const out: string[] = [];
  for (const list of Object.values(n.on ?? {})) for (const t of list) if (t.target) out.push(t.target);
  for (const r of n.routes ?? []) {
    if (r.target) out.push(r.target);
    if (r.match) {
      out.push(...Object.values(r.match.cases));
      if (r.match.default) out.push(r.match.default);
    }
  }
  return out;
}

/**
 * The "level stays completable" invariant, over a LIVE chart: can the learner, standing
 * at `fromId`, still reach an ENDING? A forward walk following every edge; true iff some
 * reachable beat is terminal on advance (its `next` edge is present but empty → the engine
 * sets `done`). Guards are ignored (an over-approximation — if ANY structural path reaches
 * an ending we allow the reroute), mirroring compile-time `analyze()`. This is the reroute
 * guardrail: an agent-as-level-designer must never soft-lock the learner. Pure.
 */
export function reachesTerminal(chart: Statechart<LessonContext>, fromId: string): boolean {
  const seen = new Set<string>();
  const queue = [fromId];
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    const n = chart.states[id];
    if (!n) continue;
    const nextEdge = n.on?.next;
    if (nextEdge !== undefined && nextEdge.length === 0) return true; // terminal on advance
    for (const t of outgoing(n)) if (!seen.has(t)) queue.push(t);
  }
  return false;
}

// ── compile ────────────────────────────────────────────────────────────────────

export function compileLesson(spec: LessonSpec, beats: BeatRegistry): CompiledLesson {
  const problems = validate(spec, beats);
  if (problems.length) throw new CompileError(problems);

  const reg = baseLessonRegistry();
  const { defaultNext } = buildSpine(spec);
  const states: Record<StateId, StateNode> = {};

  for (const b of spec.flow) {
    states[b.id] = lowerBeat(b, beats[b.type]!, reg, defaultNext(b));
  }

  const chart: Statechart<LessonContext> = {
    id: spec.id,
    version: spec.version,
    initial: spec.flow[0]!.id,
    states,
  };
  return { spec, chart, registry: reg, beats };
}
