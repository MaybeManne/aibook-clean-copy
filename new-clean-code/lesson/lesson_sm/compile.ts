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
} from "../../state_machine/index.js";
import { validateBindings } from "../../timeline/index.js";
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

/**
 * A PER-SESSION view of a compiled lesson: its own `chart.states` map and its own registry,
 * sharing everything immutable (the spec, the beat definitions, and every existing StateNode by
 * reference).
 *
 * A live session AUTHORS into its chart — `spliceBeat` adds nodes, an adjudicated director plan
 * installs them, `patchBeat` and `setNext` REWRITE existing keys — so without a fork one
 * learner's reroute would rewire every other learner's lesson.
 *
 * Shallow is the right depth: a node is never mutated in place (an edit REPLACES its entry in
 * `states`), so a fork stays O(beats) in pointers rather than a deep clone per learner. The
 * registry is forked for the same reason one level down — `lowerBeat` registers a beat's
 * guards/actions under names derived from its id (`mcq.record:${id}`), and those closures
 * capture that beat's params.
 */
export function forkLesson(lesson: CompiledLesson): CompiledLesson {
  return {
    spec: lesson.spec,
    beats: lesson.beats,
    chart: { ...lesson.chart, states: { ...lesson.chart.states } },
    registry: lesson.registry.fork(),
  };
}

export interface CompileProblem {
  code:
    | "BAD_VERSION"
    | "DUPLICATE_ID"
    | "UNKNOWN_BEAT"
    | "DANGLING_TARGET"
    | "UNREACHABLE_BEAT"
    | "NO_TERMINAL"
    /** A `$ref`/`$mul`/… binding that is malformed, misspelled, or points at no control. */
    | "BAD_BINDING"
    /** A param the beat type's own `paramsSchema` marks as required is absent. */
    | "MISSING_PARAM";
  beatId?: string;
  detail: string;
}

export class CompileError extends Error {
  constructor(public problems: CompileProblem[]) {
    super(`Lesson failed to compile:\n` + problems.map((p) => `  [${p.code}] ${p.detail}`).join("\n"));
    this.name = "CompileError";
  }
}

function beatTargets(b: BeatSpec): string[] {
  const out: string[] = [];
  const p = b.params as Record<string, unknown>;
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

/**
 * Beats an `explain`'s `exits` point at.
 *
 * Deliberately NOT part of `beatTargets`: that list also decides what counts as a DETOUR when the
 * spine is computed, and an exit routinely points FORWARD along the spine ("move on to what's
 * next"), so counting it there would lift the very beat it advances to out of the spine and rewire
 * everything after it. An exit is an extra edge, not a different shape.
 */
function exitTargets(b: BeatSpec): string[] {
  const raw = (b.params as { exits?: unknown } | null)?.exits;
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const e of raw) {
    const to = (e ?? {}) as { to?: unknown };
    if (typeof to.to === "string") out.push(to.to);
  }
  return out;
}

/** Every beat this one can hand control to: its detours AND its exits. What "does the target
 *  exist" and "what is reachable" are asked about; the spine is asked about `beatTargets` alone. */
function allTargets(b: BeatSpec): string[] {
  return [...beatTargets(b), ...exitTargets(b)];
}

function validate(spec: LessonSpec, beats: BeatRegistry): CompileProblem[] {
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
    for (const t of allTargets(b)) {
      if (!exists(t)) problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `target → "${t}" does not exist` });
    }
  }

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

function analyze(spec: LessonSpec) {
  const { defaultNext } = buildSpine(spec);
  const byId = new Map(spec.flow.map((b) => [b.id, b]));
  const neighbors = (b: BeatSpec): string[] => {
    const dn = defaultNext(b);
    return [...(dn ? [dn] : []), ...allTargets(b)];
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

function baseLessonRegistry(): Registry<LessonContext> {
  return createRegistry<LessonContext>()
    .guard("always", () => true)
    .action("incScore", (ctx) => ({ context: { score: ctx.score + 1 } }));
}

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
  for (const t of allTargets(b)) {
    if (!exists(t)) problems.push({ code: "DANGLING_TARGET", beatId: b.id, detail: `target → "${t}" does not exist` });
  }
  for (const key of missingParams(b, beats)) {
    problems.push({ code: "MISSING_PARAM", beatId: b.id, detail: `params.${key} is required for a "${b.type}" beat` });
  }
  for (const p of validateBindings(b.params, { keys: controlKeysOf(b.params) })) {
    problems.push({ code: "BAD_BINDING", beatId: b.id, detail: `params.${p.path || "(root)"}: ${p.detail}` });
  }
  return problems;
}

/**
 * The params a type says it needs, read off the same `paramsSchema` a director is SHOWN — one list,
 * two uses: disclosure and refusal.
 *
 * Without this a `scene` authored with no `storyboard` passes adjudication and then throws inside
 * `render()`: a crash in the learner's tab, for a mistake the schema already describes in prose. It
 * covers runtime-authored beats only (`validateBeatSpec`), which is where there is no type checker —
 * an authored `LessonSpec` gets the same guarantee from TypeScript. A type that ships no schema is
 * unconstrained, exactly as before.
 */
function missingParams(b: BeatSpec, beats: BeatRegistry): string[] {
  const schema = beats[b.type]?.paramsSchema;
  if (!schema) return [];
  const params = (b.params ?? {}) as Record<string, unknown>;
  const present = typeof params === "object" && !Array.isArray(params) ? params : {};
  return Object.keys(schema.params).filter((k) => !k.startsWith("?") && present[k] === undefined);
}

/**
 * The control keys a binding in THIS beat may read — so `{"$ref":"hole"}` on a beat with no `hole`
 * slider is refused with the rest of the turn instead of quietly resolving to 0 and drawing a
 * figure the learner cannot make move.
 *
 * Read structurally off `params.controls` rather than through the `explorable` type, so it costs a
 * host-registered beat type nothing to inherit: name your controls the way every other beat does
 * and binding validation covers you. A beat with no controls (a `scene`) yields none, which is
 * exactly right — its numbers have nothing to vary with.
 */
function controlKeysOf(params: Json): string[] {
  const p = (params ?? {}) as { controls?: unknown; defaults?: unknown };
  const keys = new Set<string>();
  if (Array.isArray(p.controls)) {
    for (const raw of p.controls) {
      const c = (raw ?? {}) as { key?: unknown; cellKeys?: unknown; divisorKey?: unknown };
      if (typeof c.key === "string") keys.add(c.key);
      if (typeof c.divisorKey === "string") keys.add(c.divisorKey);
      if (Array.isArray(c.cellKeys)) for (const k of c.cellKeys) if (typeof k === "string") keys.add(k);
    }
  }
  if (p.defaults && typeof p.defaults === "object" && !Array.isArray(p.defaults)) {
    for (const k of Object.keys(p.defaults)) keys.add(k);
  }
  return [...keys];
}

/**
 * Validate a runtime reroute (rewriting an existing beat's edge) against a live chart: the beat
 * must exist and the new target must already exist (or be `null` = terminal), so a reroute can
 * rewire an edge but never invent a node. Returns [] when valid. Pure.
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
 * The "level stays completable" invariant, over a LIVE chart: can the learner, standing at
 * `fromId`, still reach an ENDING? A forward walk following every edge; true iff some reachable
 * beat is terminal on advance (its `next` edge is present but empty → the engine sets `done`).
 * Guards are ignored — an over-approximation, mirroring compile-time `analyze()`. Pure.
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
    if (nextEdge !== undefined && nextEdge.length === 0) return true;
    for (const t of outgoing(n)) if (!seen.has(t)) queue.push(t);
  }
  return false;
}

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
