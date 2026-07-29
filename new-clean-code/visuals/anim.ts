// Animation VERBS as pure tween generators. Each returns Tween[] that an author spreads
// into a Storyboard's `tweens`. This re-expresses SocraticAI's imperative GSAP verbs in the
// declarative, replayable, export-safe model: an animation is just data the pure `sampleAt`
// resolves — no clock, no eval, frame-identical in preview and export.

import type { Easing, Tween } from "@lessonstudio/timeline";

export interface Timing {
  start?: number; // ms from beat start (default 0)
  duration?: number; // ms (per-verb default)
  easing?: Easing;
}

const T = (o?: Timing) => ({ start: o?.start ?? 0, duration: o?.duration ?? 500, easing: o?.easing });

/** Fade a node in (opacity 0 → 1). */
export function fadeIn(target: string, o?: Timing): Tween[] {
  const t = T({ duration: 400, easing: "easeOut", ...o });
  return [{ target, property: "opacity", from: 0, to: 1, ...t }];
}

/** Fade a node out (opacity 1 → 0). */
export function fadeOut(target: string, o?: Timing): Tween[] {
  const t = T({ duration: 400, easing: "easeIn", ...o });
  return [{ target, property: "opacity", from: 1, to: 0, ...t }];
}

/** Grow a node from nothing (scale 0 → 1), with a little overshoot by default. */
export function growFrom(target: string, o?: Timing): Tween[] {
  const t = T({ duration: 500, easing: "backOut", ...o });
  return [{ target, property: "scale", from: 0, to: 1, ...t }];
}

/** Draw a stroked `path` on progressively (draw 0 → 1). Pair with a `len` on the node for
 *  export-safe reveal. This is the declarative equivalent of Manim's Write/Create (which ease
 *  with `smooth`). */
export function drawOn(target: string, o?: Timing): Tween[] {
  const t = T({ duration: 800, easing: "smooth", ...o });
  return [{ target, property: "draw", from: 0, to: 1, ...t }];
}

/** Slide a node to a new position. Omit `from` to start from its base coords. */
export function slideTo(
  target: string,
  to: { x?: number; y?: number },
  o?: Timing & { from?: { x?: number; y?: number } },
): Tween[] {
  const t = T({ duration: 700, easing: "smooth", ...o });
  const out: Tween[] = [];
  if (to.x !== undefined) out.push({ target, property: "x", ...(o?.from?.x !== undefined ? { from: o.from.x } : {}), to: to.x, ...t });
  if (to.y !== undefined) out.push({ target, property: "y", ...(o?.from?.y !== undefined ? { from: o.from.y } : {}), to: to.y, ...t });
  return out;
}

/** Spin a node `turns` full rotations (default 1). */
export function spin(target: string, o?: Timing & { turns?: number; from?: number }): Tween[] {
  const t = T({ duration: 900, easing: "smooth", ...o });
  const from = o?.from ?? 0;
  return [{ target, property: "rotation", from, to: from + 360 * (o?.turns ?? 1), ...t }];
}

/** A quick attention pop: scale up then back to 1 (Manim's Indicate). One tween using the
 *  `thereAndBack` rate function — peaks at `scaleTo` mid-way and returns to 1. */
export function indicate(target: string, o?: Timing & { scaleTo?: number }): Tween[] {
  const start = o?.start ?? 0;
  const duration = o?.duration ?? 500;
  const to = o?.scaleTo ?? 1.2;
  return [{ target, property: "scale", from: 1, to, start, duration, easing: "thereAndBack" }];
}

/** Tween a node's fill color to a new hex. */
export function colorTo(target: string, to: string, o?: Timing & { from?: string }): Tween[] {
  const t = T({ duration: 500, easing: "linear", ...o });
  return [{ target, property: "fill", ...(o?.from !== undefined ? { from: o.from } : {}), to, ...t }];
}

/**
 * Apply a verb to many targets with a rolling start offset (Manim's stagger/LaggedStart).
 * `make(target, i)` returns the tweens for one item; each item's start is bumped by `i*gap`.
 */
export function stagger(
  targets: string[],
  make: (target: string, i: number) => Tween[],
  o?: { start?: number; gap?: number },
): Tween[] {
  const start0 = o?.start ?? 0;
  const gap = o?.gap ?? 120;
  return targets.flatMap((target, i) =>
    make(target, i).map((tw) => ({ ...tw, start: tw.start + start0 + i * gap })),
  );
}

/**
 * Move a node along a sampled polyline (list of points) by emitting sequential x/y tweens —
 * the declarative stand-in for Manim's MoveAlongPath. Straight between samples, so pass a
 * finely-sampled path for a smooth curve. Total time is split evenly across segments.
 */
export function moveAlongPoints(
  target: string,
  points: Array<{ x: number; y: number }>,
  o?: Timing,
): Tween[] {
  if (points.length < 2) return [];
  const start = o?.start ?? 0;
  const duration = o?.duration ?? 1000;
  const easing = o?.easing ?? "linear";
  const seg = duration / (points.length - 1);
  const out: Tween[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const s = start + (i - 1) * seg;
    out.push({ target, property: "x", from: a.x, to: b.x, start: s, duration: seg, easing });
    out.push({ target, property: "y", from: a.y, to: b.y, start: s, duration: seg, easing });
  }
  return out;
}
