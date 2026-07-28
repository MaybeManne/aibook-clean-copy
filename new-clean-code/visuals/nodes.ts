// Manim-style node factories. Each returns a declarative SceneNode (or group) built ONLY
// from the engine's existing primitives (path / line / arrow / label / circle / group), so
// the renderer stays tiny and everything is pure, replayable, and export-safe. Composite
// geometric mobjects (axes, plot, area, brace, polygon…) are just computed `path`/`group`
// nodes — the smart graft: SocraticAI's vocabulary, none of its imperative GSAP.

import { text as richText, type RichText } from "@lessonstudio/render-contract";
import type { SceneNode } from "@lessonstudio/timeline";
import type { Frame } from "./coords.js";
import { palette } from "./palette.js";

type Pt = { x: number; y: number };

/** Build an SVG polyline `d` from points and its total arc length (for export-safe draw-on `len`). */
export function polyline(points: Pt[]): { d: string; len: number } {
  if (points.length === 0) return { d: "", len: 0 };
  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`;
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    d += ` L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    len += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return { d, len };
}

const RAD = Math.PI / 180;

// ── basic shapes ─────────────────────────────────────────────────────────────

export function dot(id: string, x: number, y: number, o?: { r?: number; fill?: string; glow?: number }): SceneNode {
  return { id, kind: "circle", x, y, r: o?.r ?? 6, fill: o?.fill ?? palette.white, ...(o?.glow ? { glow: o.glow } : {}) };
}

export function line(
  id: string,
  from: Pt,
  to: Pt,
  o?: { stroke?: string; arrow?: boolean },
): SceneNode {
  return { id, kind: o?.arrow ? "arrow" : "line", x: from.x, y: from.y, x2: to.x, y2: to.y, stroke: o?.stroke ?? palette.lightGray };
}

export function label(
  id: string,
  x: number,
  y: number,
  s: string | RichText,
  o?: { size?: number; fill?: string; anchor?: "start" | "middle" | "end"; baseline?: "hanging" | "middle" | "auto"; weight?: number },
): SceneNode {
  return {
    id,
    kind: "label",
    x,
    y,
    text: typeof s === "string" ? richText(s) : s,
    size: o?.size ?? 20,
    fill: o?.fill ?? palette.lightGray,
    anchor: o?.anchor ?? "start",
    baseline: o?.baseline ?? "hanging",
    ...(o?.weight ? { weight: o.weight } : {}),
  };
}

export function group(id: string, children: SceneNode[], o?: { x?: number; y?: number; opacity?: number }): SceneNode {
  return { id, kind: "group", children, ...(o?.x ? { x: o.x } : {}), ...(o?.y ? { y: o.y } : {}), ...(o?.opacity != null ? { opacity: o.opacity } : {}) };
}

/** A labeled box — a rounded `rect` with a centered value, the staple of discrete/array scenes
 *  (Manim's Integer-in-a-Square). The rect is a child at local (-s/2,-s/2) so the group's x/y
 *  place its CENTER and scale/rotation happen about the center (like the other shape factories).
 *  Tween the group id to slide (`x`/`y`), reveal (`opacity`), or pop (`scale`); tween `${id}-box`
 *  for a fill change (highlight). */
export function numberBox(
  id: string,
  x: number,
  y: number,
  value: string | number,
  o?: { size?: number; w?: number; h?: number; fill?: string; textFill?: string; textSize?: number; opacity?: number },
): SceneNode {
  const w = o?.w ?? o?.size ?? 84;
  const h = o?.h ?? o?.size ?? 84;
  const kids: SceneNode[] = [
    { id: `${id}-box`, kind: "rect", x: -w / 2, y: -h / 2, w, h, fill: o?.fill ?? palette.indigo },
    label(`${id}-t`, 0, 0, String(value), {
      size: o?.textSize ?? Math.round(Math.min(w, h) * 0.46),
      fill: o?.textFill ?? palette.white,
      anchor: "middle",
      baseline: "middle",
      weight: 700,
    }),
  ];
  return group(id, kids, { x, y, ...(o?.opacity != null ? { opacity: o.opacity } : {}) });
}

/** A rounded-rectangle outline path centered at the local origin (half-width hw, half-height hh,
 *  corner radius r). Used for a cell HIGHLIGHT: the `rect` primitive draws no stroke (fill only),
 *  so an emphasis outline has to be an overlaid stroked `path`. Radius matches `rect`'s baked rx=6. */
function roundedRectPath(hw: number, hh: number, r: number): string {
  const rr = Math.min(r, hw, hh);
  return (
    `M ${-hw + rr} ${-hh} H ${hw - rr} Q ${hw} ${-hh} ${hw} ${-hh + rr} ` +
    `V ${hh - rr} Q ${hw} ${hh} ${hw - rr} ${hh} H ${-hw + rr} Q ${-hw} ${hh} ${-hw} ${hh - rr} ` +
    `V ${-hh + rr} Q ${-hw} ${-hh} ${-hw + rr} ${-hh} Z`
  );
}

/** One cell's appearance. `null` from a `cell(r,c)` callback ⇒ the cell is omitted entirely
 *  (empty slot). A `stroke` turns on the highlight outline (see `roundedRectPath`). */
export interface GridCell {
  value?: string | number;
  fill?: string;
  textFill?: string;
  textSize?: number;
  opacity?: number;
  stroke?: string; // highlight outline color (omit ⇒ no outline)
  strokeWidth?: number; // highlight outline width (default 4)
}

/** A row×col grid of labeled cells — the staple of discrete-math scenes (a dice table, a product
 *  grid, a matrix). Each cell is a `numberBox`-style subgroup (rounded `rect` + centered value)
 *  with an OPTIONAL stroked-path highlight, addressable as `${id}-${r}-${c}` (its box `-box`, text
 *  `-t`, highlight `-hi`) so a storyboard can tween any single cell. Cell center in the grid's local
 *  frame: cx=(c+0.5)·cellW + c·gap, cy=(r+0.5)·cellH + r·gap; the whole grid is a group at (x,y). */
export function grid(
  id: string,
  opts: {
    rows: number;
    cols: number;
    cellW: number;
    cellH: number;
    gap?: number;
    x?: number;
    y?: number;
    cell: (r: number, c: number) => GridCell | null;
  },
): SceneNode {
  const gap = opts.gap ?? 0;
  const hw = opts.cellW / 2;
  const hh = opts.cellH / 2;
  const cells: SceneNode[] = [];
  for (let r = 0; r < opts.rows; r++) {
    for (let c = 0; c < opts.cols; c++) {
      const spec = opts.cell(r, c);
      if (!spec) continue;
      const cx = (c + 0.5) * opts.cellW + c * gap;
      const cy = (r + 0.5) * opts.cellH + r * gap;
      const cid = `${id}-${r}-${c}`;
      const kids: SceneNode[] = [
        { id: `${cid}-box`, kind: "rect", x: -hw, y: -hh, w: opts.cellW, h: opts.cellH, fill: spec.fill ?? palette.darkGray },
      ];
      if (spec.value !== undefined && spec.value !== "") {
        kids.push(
          label(`${cid}-t`, 0, 0, String(spec.value), {
            size: spec.textSize ?? Math.round(Math.min(opts.cellW, opts.cellH) * 0.42),
            fill: spec.textFill ?? palette.white,
            anchor: "middle",
            baseline: "middle",
            weight: 700,
          }),
        );
      }
      if (spec.stroke) {
        kids.push({
          id: `${cid}-hi`,
          kind: "path",
          d: roundedRectPath(hw, hh, 6),
          fill: "none",
          stroke: spec.stroke,
          strokeWidth: spec.strokeWidth ?? 4,
        });
      }
      cells.push(group(cid, kids, { x: cx, y: cy, ...(spec.opacity != null ? { opacity: spec.opacity } : {}) }));
    }
  }
  return group(id, cells, { ...(opts.x ? { x: opts.x } : {}), ...(opts.y ? { y: opts.y } : {}) });
}

// ── path-based geometric primitives ──────────────────────────────────────────

export function polygon(id: string, points: Pt[], o?: { fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }): SceneNode {
  const d = points.length ? `M ${points.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ")} Z` : "";
  return { id, kind: "path", d, fill: o?.fill ?? "none", ...(o?.stroke ? { stroke: o.stroke, strokeWidth: o?.strokeWidth ?? 2 } : {}), ...(o?.opacity != null ? { opacity: o.opacity } : {}) };
}

// NOTE: these shape factories build their geometry around a LOCAL origin (0,0) and place the
// center via the node's x/y transform. That's what makes scale/rotation happen ABOUT THE CENTER
// (like Manim mobjects) — SVG applies transforms as translate→rotate→scale, so scaling a node
// with an x/y offset scales in the node's own frame, not about the global (0,0). Baking absolute
// coords into the points instead would make `indicate`/`spin` fling the shape across the canvas.
export function regularPolygon(id: string, n: number, r: number, o?: { x?: number; y?: number; fill?: string; stroke?: string }): SceneNode {
  const pts: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: r * Math.cos(a), y: r * Math.sin(a) };
  });
  return { ...polygon(id, pts, o), x: o?.x ?? 0, y: o?.y ?? 0 };
}

export function star(id: string, points: number, outer: number, inner?: number, o?: { x?: number; y?: number; fill?: string; stroke?: string }): SceneNode {
  const ri = inner ?? outer * 0.4;
  const pts: Pt[] = Array.from({ length: points * 2 }, (_, i) => {
    const a = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : ri;
    return { x: r * Math.cos(a), y: r * Math.sin(a) };
  });
  return { ...polygon(id, pts, o), x: o?.x ?? 0, y: o?.y ?? 0 };
}

/** A circular arc from startAngle→endAngle (degrees), radius r, centered at (x,y). Stroked path.
 *  Built around a local origin so it scales/rotates about its center (see note above). */
export function arc(id: string, r: number, startDeg: number, endDeg: number, o?: { x?: number; y?: number; stroke?: string; strokeWidth?: number; fill?: string }): SceneNode {
  const a0 = startDeg * RAD;
  const a1 = endDeg * RAD;
  const p0 = { x: r * Math.cos(a0), y: r * Math.sin(a0) };
  const p1 = { x: r * Math.cos(a1), y: r * Math.sin(a1) };
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  const d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  return { id, kind: "path", x: o?.x ?? 0, y: o?.y ?? 0, d, fill: o?.fill ?? "none", stroke: o?.stroke ?? palette.lavender, strokeWidth: o?.strokeWidth ?? 2 };
}

/** A curly brace spanning from→to (stage px), curl depth `bump` (the perpendicular offset of the
 *  central tip; negative flips the brace to the other side, like Manim's `direction`). The path is
 *  built horizontally with a central tip vertex, then rotated into place. Use `braceTip()` to get
 *  the tip point for placing a label (Manim's get_tip / put_at_tip). */
export function brace(id: string, from: Pt, to: Pt, o?: { bump?: number; stroke?: string; strokeWidth?: number }): SceneNode {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) / RAD;
  const bump = o?.bump ?? 14;
  const mid = len / 2;
  // horizontal brace, then rotated into place via the node transform. Two cubics meet at the
  // central tip (mid, bump*1.8) — the pointed vertex that distinguishes a curly brace from a bump.
  const d =
    `M 0 0 C ${(mid * 0.15).toFixed(1)} ${bump} ${(mid * 0.4).toFixed(1)} ${bump} ${mid.toFixed(1)} ${bump * 1.8} ` +
    `C ${(mid + mid * 0.6).toFixed(1)} ${bump} ${(mid + mid * 0.85).toFixed(1)} ${bump} ${len.toFixed(1)} 0`;
  return { id, kind: "path", x: from.x, y: from.y, rotation: angle, d, fill: "none", stroke: o?.stroke ?? palette.lavender, strokeWidth: o?.strokeWidth ?? 1.5 };
}

/** The world-space tip point of the brace `brace(from,to,{bump})` draws — put a label here. */
export function braceTip(from: Pt, to: Pt, bump = 14): Pt {
  const a = Math.atan2(to.y - from.y, to.x - from.x);
  const tx = Math.hypot(to.x - from.x, to.y - from.y) / 2;
  const ty = bump * 1.8;
  return { x: from.x + tx * Math.cos(a) - ty * Math.sin(a), y: from.y + tx * Math.sin(a) + ty * Math.cos(a) };
}

// ── frame-based (data-space) primitives ──────────────────────────────────────

/** Axes: x/y arrows through the frame's data origin (or its edges), with tick labels. A group. */
export function axes(
  id: string,
  frame: Frame,
  o?: { xStep?: number; yStep?: number; color?: string; labels?: boolean; xLabel?: string; yLabel?: string },
): SceneNode {
  const [xMin, xMax] = frame.xRange;
  const [yMin, yMax] = frame.yRange;
  const col = o?.color ?? palette.gray;
  const kids: SceneNode[] = [];
  // axis lines at the data origin if in range, else clamped to the frame edge
  const originY = yMin <= 0 && yMax >= 0 ? 0 : yMin;
  const originX = xMin <= 0 && xMax >= 0 ? 0 : xMin;
  const xa0 = frame.c2p(xMin, originY);
  const xa1 = frame.c2p(xMax, originY);
  const ya0 = frame.c2p(originX, yMin);
  const ya1 = frame.c2p(originX, yMax);
  kids.push(line(`${id}-x`, xa0, xa1, { stroke: col, arrow: true }));
  kids.push(line(`${id}-y`, ya0, ya1, { stroke: col, arrow: true }));
  if (o?.labels !== false) {
    const xStep = o?.xStep ?? 1;
    for (let v = Math.ceil(xMin); v <= xMax; v += xStep) {
      if (v === originX) continue;
      const p = frame.c2p(v, originY);
      kids.push(label(`${id}-xl${v}`, p.x, p.y + 8, String(v), { size: 13, fill: palette.gray, anchor: "middle" }));
    }
    const yStep = o?.yStep ?? 1;
    for (let v = Math.ceil(yMin); v <= yMax; v += yStep) {
      if (v === originY) continue;
      const p = frame.c2p(originX, v);
      kids.push(label(`${id}-yl${v}`, p.x - 8, p.y, String(v), { size: 13, fill: palette.gray, anchor: "end", baseline: "middle" }));
    }
  }
  if (o?.xLabel) kids.push(label(`${id}-xlab`, xa1.x + 4, xa1.y - 6, o.xLabel, { size: 16, fill: col, anchor: "start", baseline: "middle" }));
  if (o?.yLabel) kids.push(label(`${id}-ylab`, ya1.x + 8, ya1.y, o.yLabel, { size: 16, fill: col, anchor: "start", baseline: "hanging" }));
  return group(id, kids);
}

/** A horizontal number line at pixel (x,y) spanning [min,max] over `length` px, with ticks+labels. */
export function numberLine(
  id: string,
  o: { x: number; y: number; length: number; min: number; max: number; step?: number; color?: string; labels?: boolean },
): SceneNode {
  const step = o.step ?? 1;
  const col = o.color ?? palette.lightGray;
  const scale = o.length / (o.max - o.min);
  const kids: SceneNode[] = [line(`${id}-axis`, { x: o.x, y: o.y }, { x: o.x + o.length, y: o.y }, { stroke: col })];
  for (let v = o.min; v <= o.max + 1e-9; v += step) {
    const px = o.x + (v - o.min) * scale;
    kids.push(line(`${id}-t${v}`, { x: px, y: o.y - 6 }, { x: px, y: o.y + 6 }, { stroke: col }));
    if (o.labels !== false) kids.push(label(`${id}-l${v}`, px, o.y + 12, String(+v.toFixed(2)), { size: 12, fill: palette.gray, anchor: "middle" }));
  }
  return group(id, kids);
}

/** Sample fn over the frame's x-range into a stroked path (Manim's plot → ParametricFunction).
 *  Non-finite samples (asymptotes/discontinuities) BREAK the curve into separate subpaths via a
 *  fresh `M` — matching Manim, which splits at discontinuities rather than drawing a line across
 *  the gap. `draw` (0..1) reveals it progressively; `len` (sum of drawn segments, excluding the
 *  invisible jumps) is baked so the reveal is export-safe. */
export function plot(
  id: string,
  frame: Frame,
  fn: (x: number) => number,
  o?: { xRange?: [number, number]; samples?: number; stroke?: string; strokeWidth?: number; draw?: number },
): SceneNode {
  const [xMin, xMax] = o?.xRange ?? frame.xRange;
  const n = o?.samples ?? 200;
  let d = "";
  let len = 0;
  let prev: Pt | null = null;
  for (let i = 0; i <= n; i++) {
    const dx = xMin + ((xMax - xMin) * i) / n;
    const dy = fn(dx);
    if (!Number.isFinite(dy)) {
      prev = null; // discontinuity: lift the pen, next finite point starts a new subpath
      continue;
    }
    const p = frame.c2p(dx, dy);
    if (prev === null) {
      d += `${d ? " " : ""}M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    } else {
      d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      len += Math.hypot(p.x - prev.x, p.y - prev.y);
    }
    prev = p;
  }
  return { id, kind: "path", d, len, fill: "none", stroke: o?.stroke ?? palette.indigo, strokeWidth: o?.strokeWidth ?? 3, ...(o?.draw != null ? { draw: o.draw } : {}) };
}

/** Riemann rectangles for fn over [x0,x1] with step dx (Manim's get_riemann_rectangles). The
 *  discrete-sum → integral bridge — the same "sum of sampled products" that IS a convolution.
 *  `sampleType` picks the rectangle height's sample point: "left" (default), "right", "center".
 *  Built from `polygon` paths (not `rect`) so heights below the y=0 baseline render correctly and
 *  it stays export-safe. Returns a group. */
export function riemannRectangles(
  id: string,
  frame: Frame,
  fn: (x: number) => number,
  o: { x0: number; x1: number; dx?: number; sampleType?: "left" | "right" | "center"; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number },
): SceneNode {
  const dx = o.dx ?? 0.1;
  const sampleType = o.sampleType ?? "left";
  const [yMin, yMax] = frame.yRange;
  const base = yMin <= 0 && yMax >= 0 ? 0 : yMin;
  const kids: SceneNode[] = [];
  let i = 0;
  for (let x = o.x0; x < o.x1 - 1e-9; x += dx, i++) {
    const xr = Math.min(x + dx, o.x1);
    const sx = sampleType === "left" ? x : sampleType === "right" ? xr : (x + xr) / 2;
    const h = fn(sx);
    const yTop = Number.isFinite(h) ? h : base;
    const corners: Pt[] = [frame.c2p(x, base), frame.c2p(x, yTop), frame.c2p(xr, yTop), frame.c2p(xr, base)];
    kids.push(
      polygon(`${id}-r${i}`, corners, {
        fill: o.fill ?? palette.blue,
        stroke: o.stroke ?? palette.white,
        strokeWidth: o.strokeWidth ?? 1,
        opacity: o.opacity ?? 0.6,
      }),
    );
  }
  return group(id, kids);
}

/** Shaded area under fn between [a,b], down to the y=0 baseline (or yMin). A filled path. */
export function area(
  id: string,
  frame: Frame,
  fn: (x: number) => number,
  o: { a: number; b: number; samples?: number; fill?: string; opacity?: number },
): SceneNode {
  const n = o.samples ?? 120;
  const [yMin, yMax] = frame.yRange;
  const base = yMin <= 0 && yMax >= 0 ? 0 : yMin;
  const top: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const dx = o.a + ((o.b - o.a) * i) / n;
    const dy = fn(dx);
    top.push(frame.c2p(dx, Number.isFinite(dy) ? dy : base));
  }
  const p0 = frame.c2p(o.a, base);
  const p1 = frame.c2p(o.b, base);
  const d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} L ${top.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ")} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Z`;
  return { id, kind: "path", d, fill: o.fill ?? palette.blue, opacity: o.opacity ?? 0.3 }; // Manim get_area default: blue, opacity 0.3
}

/** Shaded region between two curves f (top) and g (bottom) over [a,b]. A filled path. */
export function areaBetween(
  id: string,
  frame: Frame,
  f: (x: number) => number,
  g: (x: number) => number,
  o: { a: number; b: number; samples?: number; fill?: string; opacity?: number },
): SceneNode {
  const n = o.samples ?? 120;
  const topPts: Pt[] = [];
  const botPts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const dx = o.a + ((o.b - o.a) * i) / n;
    topPts.push(frame.c2p(dx, f(dx)));
    botPts.push(frame.c2p(dx, g(dx)));
  }
  botPts.reverse();
  const all = [...topPts, ...botPts];
  const d = `M ${all.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ")} Z`;
  return { id, kind: "path", d, fill: o.fill ?? palette.gold, opacity: o.opacity ?? 0.3 }; // Manim get_area(bounded_graph=…) between two curves
}
