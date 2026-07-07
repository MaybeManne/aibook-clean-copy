// The pure sampler — the linchpin. sampleAt(storyboard, t) resolves the scene at
// time t with NO clock, NO randomness, NO Date. Interactive playback, seek, and
// frame export all call this, which is what keeps them frame-identical.

import type { NodeBase, SceneNode, SceneSnapshot } from "./scene.js";
import type { Cue, Easing, Storyboard, Tween } from "./storyboard.js";

export const easings: Record<Easing, (p: number) => number> = {
  linear: (p) => p,
  easeIn: (p) => p * p,
  easeOut: (p) => 1 - (1 - p) * (1 - p),
  easeInOut: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Progress of a tween at time t: 0 before start, 1 after end, eased in between. */
function progress(tw: Tween, t: number): number {
  if (t <= tw.start) return 0;
  if (t >= tw.start + tw.duration || tw.duration <= 0) return 1;
  const p = clamp01((t - tw.start) / tw.duration);
  return easings[tw.easing ?? "linear"](p);
}

function lerpNumber(a: number, b: number, p: number): number {
  return a + (b - a) * p;
}

/** Interpolate #rrggbb colors; falls back to `to` for non-hex inputs. */
function lerpColor(a: string, b: string, p: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return p < 1 ? a : b;
  const c = (i: number) => Math.round(lerpNumber(pa[i]!, pb[i]!, p));
  return `#${[c(0), c(1), c(2)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
function parseHex(s: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(s.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function baseValue(node: NodeBase, prop: Tween["property"]): number | string {
  if (prop === "fill") return node.fill ?? "#000000";
  const v = (node as unknown as Record<string, unknown>)[prop];
  return typeof v === "number" ? v : prop === "opacity" || prop === "scale" ? 1 : 0;
}

/** Apply one tween's resolved value at time t onto a (mutable) node copy. */
function applyTween(node: NodeBase, tw: Tween, t: number): void {
  const p = progress(tw, t);
  if (tw.property === "fill") {
    const from = (tw.from as string) ?? (node.fill ?? "#000000");
    node.fill = lerpColor(from, String(tw.to), p);
  } else {
    const from = typeof tw.from === "number" ? tw.from : (baseValue(node, tw.property) as number);
    (node as unknown as Record<string, number>)[tw.property] = lerpNumber(from, Number(tw.to), p);
  }
}

/** Deep clone a scene node (structuredClone-free for portability). */
function cloneNode(n: SceneNode): SceneNode {
  if (n.kind === "group") return { ...n, children: n.children.map(cloneNode) };
  return { ...n };
}

function findById(nodes: SceneNode[], id: string): NodeBase | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.kind === "group") {
      const hit = findById(n.children, id);
      if (hit) return hit;
    }
  }
  return undefined;
}

/** Resolve the scene at time `t` (ms). Pure. */
export function sampleAt(sb: Storyboard, t: number): SceneSnapshot {
  const nodes = sb.initial.map(cloneNode);
  for (const tw of sb.tweens) {
    const node = findById(nodes, tw.target);
    if (node) applyTween(node, tw, t);
  }
  const stage = sb.stage ?? { w: 1920, h: 1080 };
  return { nodes, viewBox: { w: stage.w, h: stage.h } };
}

/** Cues whose `at <= t`, in time order. Pure. */
export function cuesUpTo(sb: Storyboard, t: number): Cue[] {
  return (sb.cues ?? []).filter((c) => c.at <= t).sort((a, b) => a.at - b.at);
}

/** The latest gate cue at or before `t`, if the clock should pause there. Pure. */
export function activeGate(sb: Storyboard, t: number): Extract<Cue, { kind: "gate" }> | null {
  let found: Extract<Cue, { kind: "gate" }> | null = null;
  for (const c of sb.cues ?? []) {
    if (c.kind === "gate" && c.at <= t) found = c;
  }
  return found;
}
