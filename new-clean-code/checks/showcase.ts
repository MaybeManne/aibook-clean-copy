import { writeFileSync } from "node:fs";
import {
  arc,
  area,
  areaBetween,
  axes,
  brace,
  braceTip,
  colorTo,
  dot,
  drawOn,
  fadeIn,
  fadeOut,
  group,
  growFrom,
  indicate,
  label,
  makeFrame,
  moveAlongPoints,
  numberLine,
  palette,
  type PaletteColor,
  plot,
  regularPolygon,
  riemannRectangles,
  slideTo,
  stagger,
  star,
} from "@lessonstudio/figures";
import { sampleAt, type SceneNode, type Storyboard } from "@lessonstudio/timeline";
import { snapshotToSvg } from "@lessonstudio/svg";
import { defaultTheme } from "@lessonstudio/theme";

const STAGE = { w: 1280, h: 720 };

const gf = makeFrame({ x: 90, y: 60, width: 560, height: 300, xRange: [-3, 3], yRange: [-1.6, 1.6] });
const sinFn = (x: number) => Math.sin(x);
const invFn = (x: number) => 1 / x;

const rf = makeFrame({ x: 90, y: 420, width: 520, height: 240, xRange: [0, 3], yRange: [0, 9] });
const sq = (x: number) => x * x;
const RR_DX = 0.375;

const braceFrom = rf.c2p(0, 0);
const braceTo = rf.c2p(3, 0);
const tip = braceTip(braceFrom, braceTo, 22);

const initial: SceneNode[] = [
  axes("ax", gf, { xLabel: "x", yLabel: "y" }),
  area("area", gf, sinFn, { a: 0, b: 2.5 }),
  plot("inv", gf, invFn, { stroke: palette.red, strokeWidth: 2 }),
  plot("sin", gf, sinFn, { stroke: palette.blue, draw: 0 }),
  label("cap", 90, 380, "sin x  •  1/x (breaks at 0)  •  ∫ sin", { size: 16, fill: palette.gray }),
  riemannRectangles("rr", rf, sq, { x0: 0, x1: 3, dx: RR_DX, fill: palette.blue }),
  plot("para", rf, sq, { stroke: palette.gold, strokeWidth: 3 }),
  axes("ax2", rf, { xLabel: "t" }),
  brace("br", braceFrom, braceTo, { bump: 22, stroke: palette.lavender }),
  label("brl", tip.x, tip.y + 6, "Σ f(tᵢ)Δt  →  ∫", { size: 15, fill: palette.lavender, anchor: "middle" }),
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
const tPeak = sampleAt(sb, 1100);
const tEnd = sampleAt(sb, DURATION);

for (const [name, snap] of [["00", t0], ["peak", tPeak], ["end", tEnd]] as const) {
  writeFileSync(`/tmp/ls-showcase-${name}.svg`, snapshotToSvg(snap, defaultTheme));
}

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

const PATH = [
  { x: 120, y: 640 },
  { x: 400, y: 520 },
  { x: 680, y: 640 },
  { x: 960, y: 500 },
];
const MOTION_END = 1400;
const SWATCH: PaletteColor[] = ["blue", "gold", "emerald"];
const FAN = SWATCH.map((_, i) => `fan${i}`);

const motion: Storyboard = {
  duration: MOTION_END,
  stage: STAGE,
  initial: [
    label("mcap", 90, 34, "moveAlongPoints · slideTo ×2 · stagger(growFrom) · fadeOut · colorTo · areaBetween", { size: 16, fill: palette.gray }),
    areaBetween("band", gf, Math.cos, sinFn, { a: -3, b: 3, samples: 24 }),
    dot("trav", PATH[0]!.x, PATH[0]!.y, { r: 14, fill: palette.red, glow: 8 }),
    dot("slider", 300, 250, { r: 12, fill: palette.white }),
    dot("chain", 100, 330, { r: 12, fill: palette.teal }),
    ...SWATCH.map((c, i) => regularPolygon(FAN[i]!, i + 3, 34, { x: 760 + i * 120, y: 150, fill: palette[c] })),
    star("ghost", 5, 40, 16, { x: 1150, y: 560, fill: palette.amber }),
    dot("hue", 1150, 420, { r: 26, fill: palette.white }),
  ],
  tweens: [
    ...moveAlongPoints("trav", PATH, { start: 200, duration: 1200 }),
    ...slideTo("slider", { x: 1100 }, { from: { x: 700 }, start: 900, duration: 400 }),
    ...slideTo("chain", { x: 900 }, { start: 200, duration: 200 }),
    ...slideTo("chain", { x: 500 }, { start: 0, duration: 200 }),
    ...stagger(FAN, (t) => growFrom(t), { gap: 200 }),
    ...fadeOut("ghost", { start: 600, duration: 400 }),
    ...colorTo("hue", palette.red, { from: palette.blue, start: 100, duration: 400 }),
  ],
};

const m0 = sampleAt(motion, 0);
const m300 = sampleAt(motion, 300);
const m800 = sampleAt(motion, 800);
const mEnd = sampleAt(motion, MOTION_END);

for (const [name, snap] of [["000", m0], ["300", m300], ["800", m800], ["end", mEnd]] as const) {
  writeFileSync(`/tmp/ls-motion-${name}.svg`, snapshotToSvg(snap, defaultTheme));
}

type Tweened = { x?: number; y?: number; scale?: number; opacity?: number; fill?: string };
const at = (snap: typeof m0, id: string): Tweened => (find(snap.nodes, id) ?? {}) as Tweened;
const xy = (n: Tweened) => `(${n.x}, ${n.y})`;
const mid = (a: number, b: number) => (a + b) / 2;
const onPoint = (n: Tweened, p: { x: number; y: number }) => approx(n.x ?? NaN, p.x) && approx(n.y ?? NaN, p.y);
const scaleOf = (snap: typeof m0, i: number) => at(snap, FAN[i]!).scale ?? NaN;

const leg2Mid = { x: mid(PATH[1]!.x, PATH[2]!.x), y: mid(PATH[1]!.y, PATH[2]!.y) };
const band = find(m0.nodes, "band") as { d?: string; fill?: string; opacity?: number } | undefined;
const bandL = (band?.d?.match(/L/g) ?? []).length;

checks.push(
  ["moveAlongPoints: on the FIRST point before it starts, not the last leg's origin", onPoint(at(m0, "trav"), PATH[0]!), `${xy(at(m0, "trav"))} want ${xy(PATH[0]!)}`],
  ["moveAlongPoints: mid-way along leg 2 at t=800", onPoint(at(m800, "trav"), leg2Mid), `${xy(at(m800, "trav"))} want ${xy(leg2Mid)}`],
  ["moveAlongPoints: lands on the LAST point", onPoint(at(mEnd, "trav"), PATH[3]!), `${xy(at(mEnd, "trav"))} want ${xy(PATH[3]!)}`],
  ["slideTo: an explicit `from` holds before the tween starts", approx(at(m0, "slider").x ?? NaN, 700), `x=${at(m0, "slider").x}`],
  ["slideTo: reaches its destination", approx(at(mEnd, "slider").x ?? NaN, 1100), `x=${at(mEnd, "slider").x}`],
  ["chained slideTo: holds the node's own x before leg 1", approx(at(m0, "chain").x ?? NaN, 100), `x=${at(m0, "chain").x}`],
  ["chained slideTo: leg 2 starts where leg 1 ENDED (smooth ½ of 500→900)", approx(at(m300, "chain").x ?? NaN, 700), `x=${at(m300, "chain").x}`],
  ["chained slideTo: ends at leg 2's destination", approx(at(mEnd, "chain").x ?? NaN, 900), `x=${at(mEnd, "chain").x}`],
  ["stagger(growFrom): all three start at scale 0", [0, 1, 2].every((i) => approx(scaleOf(m0, i), 0)), [0, 1, 2].map((i) => scaleOf(m0, i)).join(", ")],
  ["stagger(growFrom): at t=300 they are grown in order, and fan2 is still 0", scaleOf(m300, 0) > scaleOf(m300, 1) && scaleOf(m300, 1) > 0 && approx(scaleOf(m300, 2), 0), [0, 1, 2].map((i) => scaleOf(m300, i).toFixed(3)).join(", ")],
  ["stagger(growFrom): all at scale 1 by the end", [0, 1, 2].every((i) => approx(scaleOf(mEnd, i), 1)), [0, 1, 2].map((i) => scaleOf(mEnd, i)).join(", ")],
  ["PaletteColor keys survive to the rendered fills", SWATCH.every((c, i) => at(m0, FAN[i]!).fill === palette[c]), SWATCH.map((c, i) => `${c}=${at(m0, FAN[i]!).fill === palette[c]}`).join(" ")],
  ["fadeOut: visible before it starts, easeIn quarter-way at t=800, gone at the end", approx(at(m0, "ghost").opacity ?? NaN, 1) && approx(at(m800, "ghost").opacity ?? NaN, 0.75) && approx(at(mEnd, "ghost").opacity ?? NaN, 0), `1→${at(m800, "ghost").opacity}→${at(mEnd, "ghost").opacity}`],
  ["colorTo: an explicit `from` holds before the tween starts", at(m0, "hue").fill === palette.blue, `fill=${at(m0, "hue").fill}`],
  ["colorTo: lerps hex channel-wise half-way (blue→red)", at(m300, "hue").fill === "#aa9399", `fill=${at(m300, "hue").fill}`],
  ["colorTo: exactly `to` at the end", at(mEnd, "hue").fill === palette.red, `fill=${at(mEnd, "hue").fill}`],
  ["areaBetween: closes a band over both curves (1 M + 49 L + Z)", bandL === 49 && (band?.d ?? "").endsWith("Z"), `L-count=${bandL}`],
  ["areaBetween: two-curve defaults = gold, opacity 0.3", band?.fill === palette.gold && approx(band?.opacity ?? NaN, 0.3), `fill=${band?.fill} opacity=${band?.opacity}`],
);

let ok = true;
for (const [name, pass, detail] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${name}  (${detail})`);
  if (!pass) ok = false;
}
console.log(`\nWrote /tmp/ls-showcase-{00,peak,end}.svg and /tmp/ls-motion-{000,300,800,end}.svg`);
console.log(ok ? `\nSHOWCASE PASS (${checks.length} checks)` : "\nSHOWCASE FAIL");
if (!ok) process.exit(1);
