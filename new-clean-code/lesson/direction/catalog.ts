// THE CATALOG — what a director can point at, reuse, or rewire, derived entirely from the
// compiled lesson. It answers the question a teacher actually asks before intervening:
// "what have we got, and what has the learner already seen?"
//
// This is the half of the seam that makes `revisit`, `say {show:{like}}` and `goto` usable
// by someone (or something) that cannot see the screen: those commands take BEAT IDS, and
// a director with no catalog would be guessing them. So the catalog lists every beat with
// the things you'd choose it by — its type, its visual, its control keys, the first words
// of its prose — plus the flow, so a reroute can be reasoned about rather than attempted.
//
// Pure and headless: it reads the compiled chart, not a running session, so the same text
// serves a terminal, a prompt, and a test. Derived from the CHART rather than the source
// spec on purpose — a beat a director added five minutes ago is in the catalog too, which
// is what lets a long live session stay coherent instead of drifting off the author's map.

import type { Json, Statechart, Transition } from "@lessonstudio/state-machine";
import { toSource, type RichText } from "@lessonstudio/render-contract";
import type { CompiledLesson } from "../lesson_sm/compile.js";
import type { LessonContext } from "../lesson_sm/context.js";

/** One beat, as a director sees it. */
export interface BeatCard {
  id: string;
  type: string;
  /** Target of the default advance edge; `null` = advancing here ends the lesson. */
  next: string | null;
  /** The beat's OTHER edges (event key → target, `null` = terminal). A gate's wrong-answer
   *  detour and a branch's outcomes show up here — the things a reroute can address. */
  edges: Record<string, string | null>;
  /** The registered visual this beat drives, if any: the thing `revisit` and
   *  `say {show:{like}}` reuse, and the surface `focus`/`annotate` land on. */
  viz?: { name: string; persistent?: boolean; props: string[] };
  /** Control keys writable on this beat (by the learner's own UI or by `setControl`). */
  controls?: string[];
  /** The first words of the beat's prose — how a human recognizes it in a list. */
  head?: string;
  /** True for a beat that was AUTHORED AT RUNTIME (a `say`, a `revisit` clone, an answer
   *  leaf) rather than compiled from the source lesson. Lets a director tell the spine it
   *  should be careful with from the scaffolding it built itself. */
  runtime?: boolean;
  /** Transient (a "thinking" leaf): present in the chart, skipped by the transcript. */
  ephemeral?: boolean;
  /** A graded/checkpointed beat — the part of a lesson a director should think twice about. */
  checkpoint?: boolean;
}

export interface LessonCatalog {
  id: string;
  version: number;
  /** The beat the lesson starts on. */
  entry: string;
  /** The AUTHORED flow in source order — the spine, as distinct from everything since. */
  spine: string[];
  /** Every beat in the live chart, spine first, runtime additions after. */
  beats: BeatCard[];
  /** Distinct registered visual names in play — the reuse menu, deduped. */
  visuals: string[];
}

/** Runtime-authored beats are named by their creator with a reserved `__` prefix (`__say-…`,
 *  `__revisit-…`, `__ask-…`). One convention, so this stays a pure derivation. */
const RUNTIME_PREFIX = "__";

/**
 * Project a compiled lesson into a director-facing catalog. Cheap and allocation-light —
 * safe to call on every observation, which is what `observe()` does.
 */
export function catalog(lesson: CompiledLesson): LessonCatalog {
  const spine = lesson.spec.flow.map((b) => b.id);
  const authored = new Set(spine);
  const ids = [...spine.filter((id) => lesson.chart.states[id]), ...Object.keys(lesson.chart.states).filter((id) => !authored.has(id))];
  const beats = ids.map((id) => card(lesson, id, !authored.has(id)));
  const visuals = [...new Set(beats.map((b) => b.viz?.name).filter((n): n is string => !!n))];
  return { id: lesson.spec.id, version: lesson.spec.version, entry: lesson.chart.initial, spine, beats, visuals };
}

/** Look one beat up by id, or null. The lookup a director does before naming a target. */
export function beatCard(lesson: CompiledLesson, id: string): BeatCard | null {
  if (!lesson.chart.states[id]) return null;
  return card(lesson, id, !lesson.spec.flow.some((b) => b.id === id));
}

function card(lesson: CompiledLesson, id: string, isRuntime: boolean): BeatCard {
  const node = lesson.chart.states[id]!;
  const beat = (node.meta as { beat?: { type: string; params: Record<string, Json> } } | undefined)?.beat;
  const params = beat?.params ?? {};
  const out: BeatCard = { id, type: beat?.type ?? "?", next: targetOf(node.on?.next), edges: otherEdges(id, node.on) };

  const viz = params.viz as { name?: string; props?: Record<string, Json>; persistent?: boolean } | undefined;
  if (viz?.name) {
    out.viz = { name: viz.name, props: Object.keys(viz.props ?? {}), ...(viz.persistent ? { persistent: true } : {}) };
  }
  const keys = controlKeys(params);
  if (keys.length) out.controls = keys;
  const head = proseHead(params);
  if (head) out.head = head;
  if (isRuntime || id.startsWith(RUNTIME_PREFIX)) out.runtime = true;
  if (params.ephemeral === true) out.ephemeral = true;
  if (node.checkpoint) out.checkpoint = true;
  return out;
}

function targetOf(edge: Transition[] | undefined): string | null {
  if (!edge || edge.length === 0) return null;
  return edge[edge.length - 1]?.target ?? null;
}

/**
 * Every edge except `next` and the SELF-transitions (the workspace/control channels, which
 * are wiring rather than flow and would bury the interesting edges in noise).
 */
function otherEdges(id: string, on: Record<string, Transition[]> | undefined): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [key, edge] of Object.entries(on ?? {})) {
    if (key === "next") continue;
    if (edge.length > 0 && edge.every((t) => t.target === id)) continue; // wiring, not flow
    out[key] = targetOf(edge);
  }
  return out;
}

/**
 * The keys a `setControl` may write on this beat. Declared controls contribute their key
 * (a `matrix` contributes its CELL keys + divisor instead — the matrix's own key is a
 * widget name, not a value), and a beat with no controls but authored `defaults` still
 * exposes those, since an explain's viz props are settable through the same channel.
 */
function controlKeys(params: Record<string, Json>): string[] {
  const keys: string[] = [];
  const controls = params.controls as Array<Record<string, Json>> | undefined;
  for (const c of controls ?? []) {
    if (c.kind === "matrix") {
      for (const k of (c.cellKeys as string[] | undefined) ?? []) keys.push(k);
      if (typeof c.divisorKey === "string") keys.push(c.divisorKey);
      continue;
    }
    if (typeof c.key === "string") keys.push(c.key);
  }
  for (const k of Object.keys((params.defaults as Record<string, Json> | undefined) ?? {})) {
    if (!k.startsWith(RUNTIME_PREFIX) && !keys.includes(k)) keys.push(k);
  }
  return keys;
}

/** Where a beat keeps its displayed words, in the order a reader would meet them. */
const PROSE_KEYS = ["text", "prompt", "note", "task", "narration"];

/**
 * ALL the words this beat puts on screen, flattened but not shortened — math spans included,
 * because `$$L_r = \frac{\rho}{\pi}\int…$$` is often the very thing a learner is pointing at
 * when they ask "what's this?". Paragraph breaks survive as newlines; a `head` collapses them.
 *
 * This is the beat's CONTENT, which is a different question from the beat's state, and the one
 * a teacher — human or model — needs in order to answer a question about what is on screen.
 */
export function beatProse(params: Record<string, Json>): string {
  for (const key of PROSE_KEYS) {
    const raw = params[key];
    const s = typeof raw === "string" ? raw : Array.isArray(raw) ? toSource(raw as unknown as RichText) : "";
    const tidy = s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (tidy) return tidy;
  }
  return "";
}

/** `beatProse` for a beat named in a compiled lesson. Keeps the `meta.beat` shape in one file. */
export function beatProseOf(lesson: CompiledLesson, id: string): string {
  const node = lesson.chart.states[id];
  if (!node) return "";
  const beat = (node.meta as { beat?: { params: Record<string, Json> } } | undefined)?.beat;
  return beat ? beatProse(beat.params) : "";
}

/** The first line of whatever prose this beat shows — how a human recognizes it in a list. */
function proseHead(params: Record<string, Json>, n = 80): string | undefined {
  const one = beatProse(params).replace(/\s+/g, " ").trim();
  if (!one) return undefined;
  return one.length > n ? `${one.slice(0, n - 1)}…` : one;
}

/**
 * The flow as adjacency, for a director that wants to reason about reachability before
 * rerouting ("if I point A at B, does anything still reach C?"). Same source as the cards,
 * kept separate because most observations don't need it.
 */
export function flowGraph(chart: Statechart<LessonContext>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [id, node] of Object.entries(chart.states)) {
    const targets = new Set<string>();
    for (const edge of Object.values(node.on ?? {})) {
      for (const t of edge) if (t.target && t.target !== id) targets.add(t.target);
    }
    for (const r of node.routes ?? []) if (r.target && r.target !== id) targets.add(r.target);
    out[id] = [...targets];
  }
  return out;
}
