// M3.4 visuals showcase — exercises the ManimCE-reconciled `visuals/` vocabulary and asserts the
// geometry invariants, rendering through the SAME pure SVG path (scene_svg) the browser uses.
// Run: PATH=<conda-node>/bin:$PATH ./node_modules/.bin/tsx examples/showcase/showcase.ts
//
// What it proves:
//   • plot() breaks at discontinuities into subpaths (Manim ParametricFunction) — 1/x → 2 subpaths
//   • riemannRectangles() builds the right rect count (the discrete-sum → integral bridge)
//   • get_area defaults (blue, opacity 0.3) survive to the rendered node
//   • the new `thereAndBack` rate function makes indicate() peak mid-way then return to 1
//   • drawOn() reveals a stroked path 0 → 1 over the beat

import { writeFileSync } from "node:fs";
import {
  arc,
  area,
  axes,
  brace,
  braceTip,
  dot,
  drawOn,
  fadeIn,
  group,
  indicate,
  label,
  makeFrame,
  numberLine,
  palette,
  plot,
  regularPolygon,
  riemannRectangles,
  star,
} from "@lessonstudio/visuals";
import { sampleAt, type SceneNode, type Storyboard } from "@lessonstudio/timeline";
import { snapshotToSvg } from "@lessonstudio/scene-svg";
import { defaultTheme } from "@lessonstudio/template";

const STAGE = { w: 1280, h: 720 };

// ── graph frame (top-left): sin + 1/x + shaded area under sin ──
const gf = makeFrame({ x: 90, y: 60, width: 560, height: 300, xRange: [-3, 3], yRange: [-1.6, 1.6] });
const sinFn = (x: number) => Math.sin(x);
const invFn = (x: number) => 1 / x; // discontinuity at x=0 → must break the curve

// ── riemann frame (bottom-left): x² with Riemann rectangles under it ──
const rf = makeFrame({ x: 90, y: 420, width: 520, height: 240, xRange: [0, 3], yRange: [0, 9] });
const sq = (x: number) => x * x;
const RR_DX = 0.375; // (3-0)/0.375 = 8 rectangles exactly

const braceFrom = rf.c2p(0, 0);
const braceTo = rf.c2p(3, 0);
const tip = braceTip(braceFrom, braceTo, 22);

const initial: SceneNode[] = [
  // graph
  axes("ax", gf, { xLabel: "x", yLabel: "y" }),
  area("area", gf, sinFn, { a: 0, b: 2.5 }), // static → keeps the get_area default opacity 0.3
  plot("inv", gf, invFn, { stroke: palette.red, strokeWidth: 2 }),
  plot("sin", gf, sinFn, { stroke: palette.blue, draw: 0 }), // drawOn will reveal it
  label("cap", 90, 380, "sin x  •  1/x (breaks at 0)  •  ∫ sin", { size: 16, fill: palette.gray }), // fadeIn's from:0 drives its opacity
  // riemann
  riemannRectangles("rr", rf, sq, { x0: 0, x1: 3, dx: RR_DX, fill: palette.blue }),
  plot("para", rf, sq, { stroke: palette.gold, strokeWidth: 3 }),
  axes("ax2", rf, { xLabel: "t" }),
  brace("br", braceFrom, braceTo, { bump: 22, stroke: palette.lavender }),
  label("brl", tip.x, tip.y + 6, "Σ f(tᵢ)Δt  →  ∫", { size: 15, fill: palette.lavender, anchor: "middle" }),
  // shape vocabulary (right column)
  star("bigstar", 5, 46, 20, { x: 960, y: 150, fill: palette.gold }),
  regularPolygon("hex", 6, 46, { x: 1120, y: 150, stroke: palette.emerald }),
  arc("arc", 46, -30, 210, { x: 960, y: 330, stroke: palette.teal, strokeWidth: 3 }),
  dot("d1", 1120, 330, { r: 8, fill: palette.red, glow: 6 }),
  numberLine("nl", { x: 900, y: 470, length: 300, min: 0, max: 5 }),
  group("legend", [label("lg", 900, 540, "shapes: star / hexagon / arc / dot / number line", { size: 14, fill: palette.gray })]),
];

const DURATION = 1400;
const sb: Storyboard = {
  duration: DURATION,
  stage: STAGE,
  initial,
  tweens: [
    ...drawOn("sin", { duration: 1000 }),
    ...fadeIn("cap", { start: 400, duration: 400 }),
    ...indicate("bigstar", { start: 800, duration: 600, scaleTo: 1.3 }),
  ],
};

// ── sample the beat at three instants and render each through the pure SVG path ──
function find(nodes: SceneNode[], id: string): SceneNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.kind === "group") {
      const h = find(n.children, id);
      if (h) return h;
    }
  }
  return undefined;
}
const nM = (n: SceneNode | undefined) => ((n as { d?: string })?.d?.match(/M/g) ?? []).length;

const t0 = sampleAt(sb, 0);
const tPeak = sampleAt(sb, 1100); // mid of the indicate pulse (start 800 + 300)
const tEnd = sampleAt(sb, DURATION);

for (const [name, snap] of [["00", t0], ["peak", tPeak], ["end", tEnd]] as const) {
  writeFileSync(`/tmp/ls-showcase-${name}.svg`, snapshotToSvg(snap, defaultTheme));
}

// ── invariants ──
const sin0 = find(t0.nodes, "sin") as { draw?: number } | undefined;
const sinEnd = find(tEnd.nodes, "sin") as { draw?: number } | undefined;
const invNode = find(t0.nodes, "inv");
const sinNode = find(t0.nodes, "sin");
const rrGroup = find(t0.nodes, "rr") as Extract<SceneNode, { kind: "group" }> | undefined;
const areaNode = find(t0.nodes, "area") as { fill?: string; opacity?: number } | undefined;
const starPeak = find(tPeak.nodes, "bigstar") as { scale?: number } | undefined;
const starEnd = find(tEnd.nodes, "bigstar") as { scale?: number } | undefined;

const approx = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps;
const checks: Array<[string, boolean, string]> = [
  ["plot breaks 1/x at discontinuity (2 subpaths)", nM(invNode) === 2, `M-count=${nM(invNode)}`],
  ["plot sin is continuous (1 subpath)", nM(sinNode) === 1, `M-count=${nM(sinNode)}`],
  ["riemannRectangles builds 8 rects", rrGroup?.children.length === 8, `n=${rrGroup?.children.length}`],
  ["get_area default fill = blue", areaNode?.fill === palette.blue, `fill=${areaNode?.fill}`],
  ["get_area default opacity = 0.3", approx(areaNode?.opacity ?? -1, 0.3), `opacity=${areaNode?.opacity}`],
  ["drawOn: draw≈0 at t=0", approx(sin0?.draw ?? -1, 0), `draw=${sin0?.draw}`],
  ["drawOn: draw==1 at end", sinEnd?.draw === 1, `draw=${sinEnd?.draw}`],
  ["indicate peaks at scaleTo mid-way (thereAndBack)", approx(starPeak?.scale ?? -1, 1.3, 1e-3), `scale=${starPeak?.scale}`],
  ["indicate returns to 1 at end", approx(starEnd?.scale ?? -1, 1, 1e-3), `scale=${starEnd?.scale}`],
];

let ok = true;
for (const [name, pass, detail] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${name}  (${detail})`);
  if (!pass) ok = false;
}
console.log(`\nWrote /tmp/ls-showcase-{00,peak,end}.svg`);
console.log(ok ? "\nSHOWCASE PASS" : "\nSHOWCASE FAIL");
if (!ok) process.exit(1);
