// The pure sampler — the linchpin. sampleAt(storyboard, t) resolves the scene at
// time t with NO clock, NO randomness, NO Date. Interactive playback, seek, and
// frame export all call this, which is what keeps them frame-identical.

import type { NodeBase, SceneNode, SceneSnapshot } from "./scene.js";
import type { CameraKey, Cue, Easing, Storyboard, Tween } from "./storyboard.js";

export const easings: Record<Easing, (p: number) => number> = {
  linear: (p) => p,
  easeIn: (p) => p * p,
  easeOut: (p) => 1 - (1 - p) * (1 - p),
  easeInOut: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
  cubicInOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  expoOut: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  backOut: (p) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  },
  elasticOut: (p) => {
    if (p === 0 || p === 1) return p;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
  },
  bounceOut: (p) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (p < 1 / d1) return n1 * p * p;
    if (p < 2 / d1) return n1 * (p -= 1.5 / d1) * p + 0.75;
    if (p < 2.5 / d1) return n1 * (p -= 2.25 / d1) * p + 0.9375;
    return n1 * (p -= 2.625 / d1) * p + 0.984375;
  },
};

function clamp01(x: number): number {
  // `!(x >= 0)` also catches NaN → 0, so malformed tween numbers never propagate.
  if (!(x >= 0)) return 0;
  return x > 1 ? 1 : x;
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
  // opacity/scale/draw default to 1 (fully visible/natural/drawn); others to 0.
  return typeof v === "number" ? v : prop === "opacity" || prop === "scale" || prop === "draw" ? 1 : 0;
}

/** Apply one tween's resolved value at time t onto a (mutable) node copy. */
function applyTween(node: NodeBase, tw: Tween, t: number): void {
  const p = progress(tw, t);
  if (tw.property === "fill") {
    // Coerce to string even if an author/LLM passed a number — parseHex().trim()
    // would otherwise throw, violating the "malformed data never crashes" invariant.
    const from = typeof tw.from === "string" ? tw.from : node.fill ?? "#000000";
    node.fill = lerpColor(from, String(tw.to), p);
  } else {
    const from = typeof tw.from === "number" ? tw.from : (baseValue(node, tw.property) as number);
    const to = Number(tw.to);
    const v = lerpNumber(from, Number.isFinite(to) ? to : from, p);
    // Never write NaN onto a node — a bad tween holds the base value instead.
    (node as unknown as Record<string, number>)[tw.property] = Number.isFinite(v) ? v : from;
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

/** Resolve the camera window (viewBox) at time `t`: interpolate keyframes, else full stage. Pure. */
function sampleCamera(keys: CameraKey[] | undefined, stage: { w: number; h: number }, t: number): SceneSnapshot["viewBox"] {
  if (!keys || keys.length === 0) return { x: 0, y: 0, w: stage.w, h: stage.h };
  const box = (k: CameraKey) => ({ x: k.x, y: k.y, w: k.w, h: k.h });
  if (t <= keys[0]!.at) return box(keys[0]!);
  const last = keys[keys.length - 1]!;
  if (t >= last.at) return box(last);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!;
    const b = keys[i + 1]!;
    if (t >= a.at && t <= b.at) {
      const span = b.at - a.at;
      const p = span <= 0 ? 1 : easings[b.easing ?? "easeInOut"](clamp01((t - a.at) / span));
      return { x: lerpNumber(a.x, b.x, p), y: lerpNumber(a.y, b.y, p), w: lerpNumber(a.w, b.w, p), h: lerpNumber(a.h, b.h, p) };
    }
  }
  return box(last);
}

/** Resolve the scene at time `t` (ms). Pure. */
export function sampleAt(sb: Storyboard, t: number): SceneSnapshot {
  // Guard the required arrays: an agent-authored storyboard may omit them, and an
  // opaque `Cannot read 'map' of undefined` is a poor author-facing failure.
  const nodes = (sb.initial ?? []).map(cloneNode);
  for (const tw of sb.tweens ?? []) {
    const node = findById(nodes, tw.target);
    if (node) applyTween(node, tw, t);
  }
  const stage = sb.stage ?? { w: 1920, h: 1080 };
  return { nodes, viewBox: sampleCamera(sb.camera, stage, t) };
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
