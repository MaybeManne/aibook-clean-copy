import type { Json, StateNode, Statechart, Transition } from "@lessonstudio/state-machine";
import type { CompiledLesson } from "./lesson_sm/compile.js";
import type { LessonContext } from "./lesson_sm/context.js";
import { beatProse } from "./direction/catalog.js";

/**
 * The chart as a GRAPH — every node, and every candidate on every edge.
 *
 * This is deliberately not `catalog()`. That projection answers "what may I name?", so it reports
 * one target per event key (`targetOf` keeps the LAST candidate) and drops self-transitions
 * entirely: a guarded wrong-answer detour and a `demo.set` that re-enters its own beat are both
 * invisible in it. Neither omission is a bug there and both are fatal here, because a picture of the
 * machine that silently merges two edges into one is a picture of a different machine.
 *
 * It is also the one place that has to be honest about what it cannot know: `guard` is a NAME, not a
 * verdict — the graph is a static over-approximation, exactly like compile-time `analyze()` and
 * runtime `reachesTerminal()`, which is why it is the natural thing to eventually unify them onto.
 */
export interface ChartGraph {
  /** Chart id and IR version, so a stale mirrored snapshot is recognizable as stale. */
  id: string;
  version: number;
  /** Where the lesson starts. */
  entry: string;
  /** The AUTHORED beats in source order, filtered to those still in the chart. Empty when the
   *  caller passed no spine (a bare chart does not know which of its nodes were written by hand). */
  spine: string[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  /** Beat type name, or `"?"` for a node with no beat meta (nothing in this repo builds one, but
   *  the graph is over a `Statechart`, and a chart is allowed to hold plain states). */
  type: string;
  /** First words of the beat's prose — how a human recognizes the node in a picture. */
  head?: string;
  /** Advancing here ENDS the lesson: `on.next` is present and empty. Same test `reachesTerminal`
   *  makes, so a node drawn as an ending is an ending by the interpreter's own definition. */
  terminal?: boolean;
  checkpoint?: boolean;
  /** Authored at RUNTIME rather than compiled from the source lesson — a `say`, a `revisit`
   *  clone, an answer leaf, or anything a director's `addBeat` spliced in. */
  runtime?: boolean;
  /** Transient (a "thinking" leaf): in the chart, skipped by the transcript. */
  ephemeral?: boolean;
  /** Index in `spine`, when this node is on it. Lets a layout lay the spine out in source order
   *  without re-deriving that order. */
  spineIndex?: number;
}

export interface GraphEdge {
  from: string;
  /**
   * Target beat, or `null` meaning this event ENDS the lesson. Null is not "missing": an empty
   * candidate list is precisely how the interpreter spells terminal, on `next` and on any other
   * key alike, so a `to: null` edge is a real, drawable edge to the end of the lesson.
   */
  to: string | null;
  /** The event key (an `on` entry) or event pattern (a `routes` entry) that fires this edge. */
  on: string;
  /** Guard NAME when the edge is conditional. Not evaluated — see the note on `ChartGraph`. */
  guard?: string;
  /** Action names the edge runs, for a reader trying to explain a score that moved. */
  actions?: string[];
  /** Leads back to `from` — including an internal transition with no target at all. */
  self: boolean;
  /** Position among the candidates on this key: 0 is tried first, and a guard on an earlier
   *  candidate is what decides whether a later one is ever reached. */
  order: number;
  /** A `routes` (pattern-matched) edge rather than an exact `on` key. Resolved FIRST at runtime. */
  route?: boolean;
  /** For a `match` route: the payload value that selects this edge (`"*"` for its default). */
  when?: string;
}

const RUNTIME_PREFIX = "__";

/**
 * Project a chart into a graph. Pure, allocation-light, and total — a node with no `meta.beat`,
 * an edge to a state that does not exist, a chart with no spine: each is reported as what it is
 * rather than skipped.
 *
 * `spine` is the authored source order (`lesson.spec.flow`), which a bare `Statechart` genuinely
 * does not contain: it is what separates "the lesson as written" from "everything that has
 * happened since", and without it every node is reported as runtime-authored only when its id
 * carries the `__` prefix. `lessonGraph()` passes it for you.
 */
export function chartGraph(chart: Statechart<LessonContext>, opts: { spine?: string[] } = {}): ChartGraph {
  const authored = new Set(opts.spine ?? []);
  const spine = (opts.spine ?? []).filter((id) => chart.states[id]);
  const spineAt = new Map(spine.map((id, i) => [id, i]));

  // Spine first in source order, then everything else in the order the chart acquired it — which,
  // for a live session, is the order a director added things, i.e. the order to draw them in.
  const ids = [...spine, ...Object.keys(chart.states).filter((id) => !authored.has(id))];

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  for (const id of ids) {
    const n = chart.states[id]!;
    nodes.push(nodeOf(id, n, spineAt.get(id), authored.size > 0 && !authored.has(id)));
    edges.push(...edgesOf(id, n));
  }

  return { id: chart.id, version: chart.version, entry: chart.initial, spine, nodes, edges };
}

/** `chartGraph` for a compiled lesson — the spine comes from the spec, so runtime-authored beats
 *  are identified by provenance rather than by a naming convention. */
export function lessonGraph(lesson: CompiledLesson): ChartGraph {
  return chartGraph(lesson.chart, { spine: lesson.spec.flow.map((b) => b.id) });
}

function nodeOf(id: string, n: StateNode, spineIndex: number | undefined, offSpine: boolean): GraphNode {
  const beat = (n.meta as { beat?: { type: string; params: Record<string, Json> } } | undefined)?.beat;
  const params = beat?.params ?? {};
  const out: GraphNode = { id, type: beat?.type ?? "?" };
  const head = beatProse(params).replace(/\s+/g, " ").trim();
  if (head) out.head = head.length > 72 ? `${head.slice(0, 71)}…` : head;
  const nextEdge = n.on?.next;
  if (nextEdge !== undefined && nextEdge.length === 0) out.terminal = true;
  if (n.checkpoint) out.checkpoint = true;
  if (offSpine || id.startsWith(RUNTIME_PREFIX)) out.runtime = true;
  if (params.ephemeral === true) out.ephemeral = true;
  if (spineIndex !== undefined) out.spineIndex = spineIndex;
  return out;
}

function edgesOf(from: string, n: StateNode): GraphEdge[] {
  const out: GraphEdge[] = [];

  // `routes` first, because that is the order `resolve()` tries them in: a pattern-matched edge
  // beats an exact `on` key, and a picture that implied the opposite would mislead about priority.
  (n.routes ?? []).forEach((r, order) => {
    const base = { from, on: r.on, order, route: true as const, ...guardAndActions(r) };
    if (r.match) {
      for (const [when, target] of Object.entries(r.match.cases)) {
        out.push({ ...base, to: target, self: target === from, when });
      }
      if (r.match.default) out.push({ ...base, to: r.match.default, self: r.match.default === from, when: "*" });
      return;
    }
    out.push({ ...base, to: r.target ?? from, self: r.target === undefined || r.target === from });
  });

  for (const [key, list] of Object.entries(n.on ?? {})) {
    // An empty candidate list is terminal on that key — one edge, to the end of the lesson.
    if (list.length === 0) {
      out.push({ from, to: null, on: key, order: 0, self: false });
      continue;
    }
    list.forEach((t, order) => {
      out.push({ from, to: t.target ?? from, on: key, order, self: t.target === undefined || t.target === from, ...guardAndActions(t) });
    });
  }
  return out;
}

function guardAndActions(t: Transition | { guard?: string; actions?: string[] }): { guard?: string; actions?: string[] } {
  return { ...(t.guard ? { guard: t.guard } : {}), ...(t.actions?.length ? { actions: [...t.actions] } : {}) };
}

/** Look one node up. The question a view asks while drawing an edge. */
export function graphNode(g: ChartGraph, id: string): GraphNode | null {
  return g.nodes.find((n) => n.id === id) ?? null;
}

/**
 * Edges whose `to` names no node in the graph. Never empty by accident: the adjudicator refuses a
 * dangling target, so anything here is either a chart assembled by hand or a real engine bug — and
 * a view should draw it as a stub rather than silently dropping the edge.
 */
export function danglingEdges(g: ChartGraph): GraphEdge[] {
  const known = new Set(g.nodes.map((n) => n.id));
  return g.edges.filter((e) => e.to !== null && !known.has(e.to));
}
