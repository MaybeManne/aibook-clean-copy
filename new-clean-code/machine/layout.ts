import type { ChartGraph, GraphEdge, GraphNode } from "@lessonstudio/lesson";

/**
 * Which column a node is drawn in. Three lanes, because a lesson has three KINDS of beat and
 * mixing them into one column is what makes a statechart picture unreadable:
 *   • `main`    — the chain the learner walks when every answer is right: follow the unguarded
 *                 advance edge from the entry. This is the lesson as it is meant to go.
 *   • `detour`  — authored but only reachable through a guard or a non-advance edge: a
 *                 wrong-answer reteach, a branch arm. Off to the side, level with its source.
 *   • `runtime` — spliced in while the lesson was running: a `say`, a `revisit` clone, an answer
 *                 leaf, a director's `addBeat`. Its own lane so that "what the tutor did" is
 *                 legible at a glance as separate from "what the author wrote".
 */
export type Lane = "main" | "detour" | "runtime";

export interface LaidNode extends GraphNode {
  lane: Lane;
  /** Grid row. Distinct per (lane, row) — which is what keeps boxes from overlapping. */
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LaidEdge extends GraphEdge {
  /** SVG path data. */
  d: string;
  /** What to print next to it: the event key, plus a guard name when it has one. */
  label: string;
  labelAt: [number, number];
  /** A guarded edge — it may or may not be taken, and the picture must not pretend otherwise. */
  dashed: boolean;
  /** Stable key for React and for a traversal lookup. */
  key: string;
}

export interface MachineLayout {
  nodes: LaidNode[];
  edges: LaidEdge[];
  /** The single "lesson over" marker every terminal edge points at, or null when nothing ends. */
  end: { x: number; y: number; w: number; h: number } | null;
  width: number;
  height: number;
  /** The main column, in order — the spine as the INTERPRETER would walk it, which is not
   *  necessarily the authored source order (`ChartGraph.spine`). */
  main: string[];
}

export interface LayoutOptions {
  nodeW?: number;
  nodeH?: number;
  /** Horizontal gap between lanes. */
  laneGap?: number;
  /** Vertical gap between rows. */
  rowGap?: number;
  pad?: number;
}

const DEFAULTS = { nodeW: 176, nodeH: 46, laneGap: 78, rowGap: 30, pad: 20 };

const LANES: Lane[] = ["main", "detour", "runtime"];

/**
 * Lay a graph out deterministically. Same graph in ⇒ same coordinates out, with no measurement, no
 * randomness and no force simulation — so a check can assert the geometry and a re-render on every
 * frame does not make the picture jump around.
 *
 * Deliberately NOT a general graph-drawing algorithm. A lesson is a spine with excursions, and a
 * layered layout that knows that is both simpler and more informative than a good generic one.
 */
export function layoutGraph(g: ChartGraph, opts: LayoutOptions = {}): MachineLayout {
  const { nodeW, nodeH, laneGap, rowGap, pad } = { ...DEFAULTS, ...opts };
  const laneX = (lane: Lane): number => pad + LANES.indexOf(lane) * (nodeW + laneGap);
  const rowY = (row: number): number => pad + row * (nodeH + rowGap);

  const byId = new Map(g.nodes.map((n) => [n.id, n]));
  const main = mainChain(g);
  const mainRow = new Map(main.map((id, i) => [id, i]));

  // Rows are claimed per lane, so two nodes never share a cell even when they want the same row.
  const taken: Record<Lane, Set<number>> = { main: new Set(), detour: new Set(), runtime: new Set() };
  const claim = (lane: Lane, prefer: number): number => {
    let row = Math.max(0, prefer);
    while (taken[lane].has(row)) row++;
    taken[lane].add(row);
    return row;
  };

  const laid: LaidNode[] = [];
  const place = (n: GraphNode, lane: Lane, prefer: number): void => {
    const row = claim(lane, prefer);
    laid.push({ ...n, lane, row, x: laneX(lane), y: rowY(row), w: nodeW, h: nodeH });
  };

  for (const id of main) place(byId.get(id)!, "main", mainRow.get(id)!);

  // Everything else, in graph order (spine first, then the order the chart acquired it — which for
  // a live session is the order the tutor added things).
  for (const n of g.nodes) {
    if (mainRow.has(n.id)) continue;
    place(n, n.runtime ? "runtime" : "detour", anchorRow(g, n.id, mainRow));
  }

  const pos = new Map(laid.map((n) => [n.id, n]));
  const rows = laid.length ? Math.max(...laid.map((n) => n.row)) : -1;
  const terminating = g.edges.some((e) => e.to === null);
  const end = terminating ? { x: laneX("main"), y: rowY(rows + 1), w: nodeW, h: nodeH / 2 } : null;

  const edges = g.edges.map((e, i) => route(e, i, pos, end, nodeW));

  const right = Math.max(...laid.map((n) => n.x + n.w), pad + nodeW);
  const bottom = Math.max(...laid.map((n) => n.y + n.h), end ? end.y + end.h : 0);
  return { nodes: laid, edges, end, width: right + pad, height: bottom + pad, main };
}

/**
 * The chain the learner walks when nothing goes wrong: from the entry, follow the DEFAULT advance
 * edge — the unguarded candidate on `next`, which is the one `resolve()` falls through to.
 *
 * Following the guarded candidate instead would put the reteach beat in the main column and the
 * beat it reteaches for off to the side, i.e. exactly backwards. Stops on a repeat, so a lesson
 * that loops back on itself lays out rather than hanging.
 */
function mainChain(g: ChartGraph): string[] {
  const known = new Set(g.nodes.map((n) => n.id));
  if (!known.has(g.entry)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  let at: string | null = g.entry;
  while (at && known.has(at) && !seen.has(at)) {
    seen.add(at);
    out.push(at);
    at = defaultAdvance(g, at);
  }
  return out;
}

/** The unguarded `next` candidate of a beat, or the last one if every candidate is guarded. */
function defaultAdvance(g: ChartGraph, from: string): string | null {
  const candidates = g.edges.filter((e) => e.from === from && e.on === "next" && !e.self);
  if (!candidates.length) return null;
  const plain = candidates.filter((e) => !e.guard);
  const pick = (plain.length ? plain : candidates)[0]!;
  return pick.to;
}

/** The main-column row to sit level with: the first main node that points at this one, else the
 *  first it points at. A `say` beat therefore appears beside the beat it interrupted. */
function anchorRow(g: ChartGraph, id: string, mainRow: Map<string, number>): number {
  const rows: number[] = [];
  for (const e of g.edges) {
    if (e.to === id && mainRow.has(e.from)) rows.push(mainRow.get(e.from)!);
    if (e.from === id && e.to !== null && mainRow.has(e.to)) rows.push(mainRow.get(e.to)!);
  }
  return rows.length ? Math.min(...rows) : 0;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function route(
  e: GraphEdge,
  i: number,
  pos: Map<string, LaidNode>,
  end: Box | null,
  nodeW: number,
): LaidEdge {
  const key = `${e.from}|${e.on}|${e.order}|${e.when ?? ""}|${e.to ?? "END"}`;
  const label = `${e.on}${e.guard ? ` [${e.guard}]` : ""}${e.when ? ` =${e.when}` : ""}`;
  const dashed = !!e.guard;
  const from = pos.get(e.from);
  if (!from) return { ...e, key, label, dashed, d: "", labelAt: [0, 0] };

  // A self-transition is a small arc off the right edge — a learner dragging a slider does not
  // move, and the picture should say so without pretending the beat points somewhere.
  if (e.self || e.to === e.from) {
    const x = from.x + from.w;
    const y = from.y + from.h / 2;
    const r = 13 + (i % 3) * 5;
    return {
      ...e,
      key,
      label,
      dashed,
      d: `M ${x} ${y - 8} C ${x + r * 2} ${y - r}, ${x + r * 2} ${y + r}, ${x} ${y + 8}`,
      labelAt: [x + r * 2 + 6, y + 4],
    };
  }

  const to: Box | undefined = e.to === null ? end ?? undefined : pos.get(e.to);
  if (!to) {
    // A dangling target (or a terminal edge in a chart with no ending): a stub, drawn rather than
    // dropped, because a missing edge in this picture reads as a machine that cannot do something.
    const x = from.x + from.w;
    const y = from.y + from.h / 2;
    return { ...e, key, label, dashed, d: `M ${x} ${y} L ${x + 26} ${y}`, labelAt: [x + 30, y + 4] };
  }

  const sameLane = Math.abs(to.x - from.x) < 1;
  if (sameLane && to.y > from.y) {
    const x = from.x + from.w / 2;
    return {
      ...e,
      key,
      label,
      dashed,
      d: `M ${x} ${from.y + from.h} L ${x} ${to.y}`,
      labelAt: [x + 7, (from.y + from.h + to.y) / 2 + 4],
    };
  }

  if (sameLane) {
    // Backwards in the same column — a resume edge. Bow out to the LEFT so it never lies on top of
    // the forward chain it undoes.
    const bx = from.x - 34;
    const y1 = from.y + from.h / 2;
    const y2 = to.y + to.h / 2;
    return {
      ...e,
      key,
      label,
      dashed,
      d: `M ${from.x} ${y1} C ${bx} ${y1}, ${bx} ${y2}, ${to.x} ${y2}`,
      labelAt: [bx - 4, (y1 + y2) / 2 + 4],
    };
  }

  const rightward = to.x > from.x;
  const x1 = rightward ? from.x + from.w : from.x;
  const x2 = rightward ? to.x : to.x + to.w;
  const y1 = from.y + from.h / 2;
  const y2 = to.y + to.h / 2;
  const bend = (x2 - x1) / 2;
  return {
    ...e,
    key,
    label,
    dashed,
    d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
    labelAt: [x1 + bend * (rightward ? 0.2 : -0.2) + (rightward ? 4 : -nodeW * 0.1), (y1 + y2) / 2 - 6],
  };
}

/** Do any two boxes overlap? The one geometric property worth asserting: a layout that stacks two
 *  beats on the same spot is not a layout. */
export function overlaps(layout: MachineLayout): Array<[string, string]> {
  const bad: Array<[string, string]> = [];
  const ns = layout.nodes;
  for (let i = 0; i < ns.length; i++) {
    for (let j = i + 1; j < ns.length; j++) {
      const a = ns[i]!;
      const b = ns[j]!;
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) bad.push([a.id, b.id]);
    }
  }
  return bad;
}
