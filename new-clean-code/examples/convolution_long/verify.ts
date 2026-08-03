// M4 headless check — proves the convolution reproduction is correct WITHOUT a browser,
// through the SAME pure paths the browser uses (sampleAt + snapshotToSvg + the registered
// figure). Run:
//   PATH=<conda-node>/bin:$PATH ./node_modules/.bin/tsx examples/convolution/verify.ts
//
// What it proves:
//   • convolve((1,2,3),(4,5,6)) = [4,13,28,27,18]                       (the math)
//   • FLIP storyboard: b's ends arc-swap — b0 ends where b2 began, b1 stays  (the flip)
//   • SLIDE storyboard: the strip lands at shift 4 and every output box is revealed
//   • the interactive "conv-boxes" figure shows the right products + sum at each shift n
//   • hook: convolve((1,2,3,4),(5,6,7,8)) = [5,16,34,60,61,52,32]; buildCombine reveals the a∗b row
//   • dice-grid: the anti-diagonal length = P(sum=n)·36 (highlight count + readout) for several n
//   • prod-grid: each anti-diagonal's product-sum equals (a∗b)[d] (highlight count + readout)
//   • polynomial identity: an INDEPENDENT polyMul of (1,2,3),(4,5,6) equals the convolution
//   • the live editable-kernel path (image-filters editor): a custom identity reproduces the input,
//     a custom box blur leaves a constant field flat, and the seeded Sobel-X is a SIGNED directional
//     gradient (dark→bright clamps to 255, bright→dark clamps to 0, kernelGain 0) — NOT the |∇| path

import { writeFileSync } from "node:fs";
import { sampleAt, type SceneNode, type Storyboard } from "@lessonstudio/timeline";
import { getFigure, snapshotToSvg } from "@lessonstudio/svg";
import { defaultTheme } from "@lessonstudio/theme";
import { palette } from "@lessonstudio/figures";
import { A, B, convolve, diceWays } from "./figures.js";
import { buildCombine, buildFlip, buildSlide } from "./storyboards.js";
import { EDITOR_PRESETS, KERNELS, SOBEL_X, SOBEL_Y, convolve2d, kernelGain, matchPreset, pixelArtSprite, type Kernel } from "./kernels.js";

/** Independent polynomial multiply — used to CONFIRM (not assume) that a∗b = coeffs of a(x)·b(x). */
function polyMul(p: number[], q: number[]): number[] {
  const out = new Array(p.length + q.length - 1).fill(0) as number[];
  for (let i = 0; i < p.length; i++) for (let j = 0; j < q.length; j++) out[i + j]! += p[i]! * q[j]!;
  return out;
}
const HL = new RegExp(`stroke="${palette.yellow}"`, "g"); // a highlighted grid cell's outline
const countHighlights = (svg: string): number => (svg.match(HL) ?? []).length;

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
const xOf = (n: SceneNode | undefined) => (n as { x?: number })?.x;
const opOf = (n: SceneNode | undefined) => (n as { opacity?: number })?.opacity;
const approx = (a: number | undefined, b: number, eps = 1e-3) => a !== undefined && Math.abs(a - b) <= eps;

const conv = convolve(A, B);
const checks: Array<[string, boolean, string]> = [];

// ── the math ──
checks.push(["convolve((1,2,3),(4,5,6)) = [4,13,28,27,18]", JSON.stringify(conv) === JSON.stringify([4, 13, 28, 27, 18]), JSON.stringify(conv)]);

// ── FLIP ──
const flip: Storyboard = buildFlip();
const f0 = sampleAt(flip, 0);
const fEnd = sampleAt(flip, flip.duration);
writeFileSync("/tmp/ls-conv-flip-0.svg", snapshotToSvg(f0, defaultTheme));
writeFileSync("/tmp/ls-conv-flip-end.svg", snapshotToSvg(fEnd, defaultTheme));
const b0Start = xOf(find(f0.nodes, "b0"));
const b2Start = xOf(find(f0.nodes, "b2"));
const b0End = xOf(find(fEnd.nodes, "b0"));
const b1End = xOf(find(fEnd.nodes, "b1"));
const b2End = xOf(find(fEnd.nodes, "b2"));
checks.push(["flip: boxes start hidden (b0 opacity 0 at t=0)", approx(opOf(find(f0.nodes, "b0")), 0), `op=${opOf(find(f0.nodes, "b0"))}`]);
checks.push(["flip: b0 ends where b2 began (arc-swap)", approx(b0End, b2Start!), `b0End=${b0End} b2Start=${b2Start}`]);
checks.push(["flip: b2 ends where b0 began (arc-swap)", approx(b2End, b0Start!), `b2End=${b2End} b0Start=${b0Start}`]);
checks.push(["flip: b1 (middle) stays put", approx(b1End, 640), `b1End=${b1End}`]);
checks.push(["flip: strip is fully visible at end (b0 opacity 1)", approx(opOf(find(fEnd.nodes, "b0")), 1), `op=${opOf(find(fEnd.nodes, "b0"))}`]);

// ── SLIDE ──
const slide: Storyboard = buildSlide();
const s0 = sampleAt(slide, 0);
const sEnd = sampleAt(slide, slide.duration);
writeFileSync("/tmp/ls-conv-slide-0.svg", snapshotToSvg(s0, defaultTheme));
writeFileSync("/tmp/ls-conv-slide-end.svg", snapshotToSvg(sEnd, defaultTheme));
checks.push(["slide: strip starts at shift 0 (x=130)", approx(xOf(find(s0.nodes, "strip")), 130), `x=${xOf(find(s0.nodes, "strip"))}`]);
checks.push(["slide: strip lands at shift 4 (x=810)", approx(xOf(find(sEnd.nodes, "strip")), 810), `x=${xOf(find(sEnd.nodes, "strip"))}`]);
checks.push(["slide: output boxes hidden at t=0 (res4 opacity 0)", approx(opOf(find(s0.nodes, "res4")), 0), `op=${opOf(find(s0.nodes, "res4"))}`]);
for (let m = 0; m < conv.length; m++) {
  checks.push([`slide: output box res${m} revealed at end`, approx(opOf(find(sEnd.nodes, `res${m}`)), 1), `op=${opOf(find(sEnd.nodes, `res${m}`))}`]);
}

// ── interactive figure: products + sum per shift ──
const fig = getFigure("conv-boxes");
const expectProducts: Record<number, string[]> = {
  0: ["1·4"],
  1: ["1·5", "2·4"],
  2: ["1·6", "2·5", "3·4"],
  3: ["2·6", "3·5"],
  4: ["3·6"],
};
for (let n = 0; n <= 4; n++) {
  const svg = fig ? fig({ shift: n }, 0, defaultTheme) : "";
  writeFileSync(`/tmp/ls-conv-boxes-${n}.svg`, svg);
  const hasSum = svg.includes(`= ${conv[n]}`);
  const hasProducts = expectProducts[n]!.every((p) => svg.includes(p));
  checks.push([`conv-boxes n=${n}: shows sum = ${conv[n]}`, hasSum, hasSum ? "ok" : "missing sum"]);
  checks.push([`conv-boxes n=${n}: shows products ${expectProducts[n]!.join(",")}`, hasProducts, hasProducts ? "ok" : "missing product"]);
}
// setup figure renders at all
const setup = getFigure("conv-setup");
writeFileSync("/tmp/ls-conv-setup.svg", setup ? setup({}, 0, defaultTheme) : "");
checks.push(["conv-setup figure registered + renders", !!setup && setup({}, 0, defaultTheme).startsWith("<svg"), setup ? "ok" : "missing"]);

// ── section A hook: the (1,2,3,4)∗(5,6,7,8) math + the buildCombine storyboard ──
const hookConv = convolve([1, 2, 3, 4], [5, 6, 7, 8]);
checks.push(["hook: convolve((1,2,3,4),(5,6,7,8)) = [5,16,34,60,61,52,32]", JSON.stringify(hookConv) === JSON.stringify([5, 16, 34, 60, 61, 52, 32]), JSON.stringify(hookConv)]);
const combine: Storyboard = buildCombine();
const c0 = sampleAt(combine, 0);
const cEnd = sampleAt(combine, combine.duration);
writeFileSync("/tmp/ls-conv-combine-0.svg", snapshotToSvg(c0, defaultTheme));
writeFileSync("/tmp/ls-conv-combine-end.svg", snapshotToSvg(cEnd, defaultTheme));
checks.push(["combine: a∗b row hidden at t=0 (cnv6 opacity 0)", approx(opOf(find(c0.nodes, "cnv6")), 0), `op=${opOf(find(c0.nodes, "cnv6"))}`]);
for (let m = 0; m < hookConv.length; m++) {
  checks.push([`combine: a∗b box cnv${m} revealed at end`, approx(opOf(find(cEnd.nodes, `cnv${m}`)), 1), `op=${opOf(find(cEnd.nodes, `cnv${m}`))}`]);
}
checks.push(["combine: add & mul rows exist (add0, mul0 present)", !!find(cEnd.nodes, "add0") && !!find(cEnd.nodes, "mul0"), find(cEnd.nodes, "add0") ? "ok" : "missing"]);

// ── dice-grid: the anti-diagonal count = P(sum=n)·36 ──
const dice = getFigure("dice-grid");
for (const n of [2, 5, 7, 10, 12]) {
  const svg = dice ? dice({ sum: n }, 0, defaultTheme) : "";
  if (n === 7) writeFileSync("/tmp/ls-dice-grid-7.svg", svg);
  const ways = diceWays(n);
  const hasReadout = svg.includes(`P(sum = ${n}) = ${ways}/36`);
  const hlCount = countHighlights(svg);
  checks.push([`dice-grid n=${n}: readout P=${ways}/36`, hasReadout, hasReadout ? "ok" : "missing readout"]);
  checks.push([`dice-grid n=${n}: ${ways} cells highlighted`, hlCount === ways, `highlights=${hlCount}`]);
}

// ── prod-grid: each diagonal sums to the convolution output ──
const prod = getFigure("prod-grid");
const diagLen = [1, 2, 3, 2, 1]; // anti-diagonal length for d=0..4 in a 3×3 grid
for (let d = 0; d <= 4; d++) {
  const svg = prod ? prod({ diag: d }, 0, defaultTheme) : "";
  if (d === 2) writeFileSync("/tmp/ls-prod-grid-2.svg", svg);
  // reconstruct the highlighted diagonal's sum and compare to conv[d]
  let sum = 0;
  for (let r = 0; r < A.length; r++) {
    const c = d - r;
    if (c >= 0 && c < B.length) sum += A[r]! * B[c]!;
  }
  const hasReadout = svg.includes(`= ${sum}`) && svg.includes(`(a ∗ b)[${d}]`);
  checks.push([`prod-grid d=${d}: diagonal sum ${sum} = (a∗b)[${d}]=${conv[d]}`, sum === conv[d] && hasReadout, `sum=${sum} conv=${conv[d]}`]);
  checks.push([`prod-grid d=${d}: ${diagLen[d]} cells highlighted`, countHighlights(svg) === diagLen[d], `highlights=${countHighlights(svg)}`]);
}

// ── polynomial identity: coeffs of a(x)·b(x) ARE a∗b (independent polyMul) ──
const poly = polyMul(A, B);
checks.push(["polynomial: polyMul((1,2,3),(4,5,6)) = convolve = [4,13,28,27,18]", JSON.stringify(poly) === JSON.stringify(conv) && JSON.stringify(poly) === JSON.stringify([4, 13, 28, 27, 18]), JSON.stringify(poly)]);

// ── 2-D image kernels (the same pure math the browser viz runs; DOM-free, so testable here) ──
// A kernel's GAIN (Σweights ÷ div) is 1 for an averaging/identity/sharpen kernel (brightness
// preserved) and 0 for a gradient (Sobel) kernel — the property that makes edges go to black.
for (const k of KERNELS) {
  const want = k.name === "edges" ? 0 : 1;
  checks.push([`kernel ${k.name}: gain = ${want}`, Math.abs(kernelGain(k) - want) < 1e-9, `gain=${kernelGain(k)}`]);
  checks.push([`kernel ${k.name}: 3×3 (9 weights)`, k.weights.length === 9 && k.size === 3, `n=${k.weights.length}`]);
}
checks.push(["Sobel-X sums to 0", SOBEL_X.reduce((a, b) => a + b, 0) === 0, `Σ=${SOBEL_X.reduce((a, b) => a + b, 0)}`]);
checks.push(["Sobel-Y sums to 0", SOBEL_Y.reduce((a, b) => a + b, 0) === 0, `Σ=${SOBEL_Y.reduce((a, b) => a + b, 0)}`]);

// helper: build a solid RGBA field
const field = (w: number, h: number, rgb: [number, number, number]): Uint8ClampedArray => {
  const px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    px[i * 4] = rgb[0]; px[i * 4 + 1] = rgb[1]; px[i * 4 + 2] = rgb[2]; px[i * 4 + 3] = 255;
  }
  return px;
};
const identity = KERNELS[0]!, boxBlur = KERNELS[1]!, edges = KERNELS[4]!;

// identity kernel is a no-op: output === input, byte for byte
const idIn = field(4, 4, [30, 90, 200]);
idIn[0] = 200; idIn[1] = 10; idIn[2] = 40; // perturb one pixel so "unchanged" is a real claim
const idOut = convolve2d(idIn, 4, 4, identity);
checks.push(["convolve2d: output length == input length", idOut.length === idIn.length, `${idOut.length}`]);
let idSame = true;
for (let i = 0; i < idIn.length; i++) if (idIn[i] !== idOut[i]) idSame = false;
checks.push(["convolve2d: identity kernel is a no-op (out === in)", idSame, idSame ? "ok" : "differs"]);

// box blur of a CONSTANT field is that same constant (edge-clamped average of a constant)
const constIn = field(5, 5, [100, 150, 200]);
const constOut = convolve2d(constIn, 5, 5, boxBlur);
let constFlat = true;
for (let i = 0; i < 25; i++) {
  if (constOut[i * 4] !== 100 || constOut[i * 4 + 1] !== 150 || constOut[i * 4 + 2] !== 200) constFlat = false;
}
checks.push(["convolve2d: box blur of a constant field is unchanged", constFlat, constFlat ? "ok" : "not flat"]);

// Sobel edges: zero on flat regions, large at a vertical step edge (cols 0-1 black, 2-4 white)
const w = 5, h = 3;
const step = new Uint8ClampedArray(w * h * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const v = x < 2 ? 0 : 255;
  const i = (y * w + x) * 4;
  step[i] = v; step[i + 1] = v; step[i + 2] = v; step[i + 3] = 255;
}
const edgeOut = convolve2d(step, w, h, edges);
const magAt = (x: number, y: number): number => edgeOut[(y * w + x) * 4]!;
checks.push(["Sobel: flat dark region has zero edge response", magAt(0, 1) === 0, `mag=${magAt(0, 1)}`]);
checks.push(["Sobel: flat bright region has zero edge response", magAt(4, 1) === 0, `mag=${magAt(4, 1)}`]);
checks.push(["Sobel: the step edge lights up (mag ≫ flat)", magAt(2, 1) > 200, `mag=${magAt(2, 1)}`]);
checks.push(["Sobel: output is gray (R==G==B)", edgeOut[(1 * w + 2) * 4] === edgeOut[(1 * w + 2) * 4 + 1] && edgeOut[(1 * w + 2) * 4 + 1] === edgeOut[(1 * w + 2) * 4 + 2], "ok"]);

// the hand-built pixel-art sprite: right dimensions, opaque, and not a solid block
const sprite = pixelArtSprite();
checks.push(["pixelArtSprite: 16×16 RGBA", sprite.w === 16 && sprite.h === 16 && sprite.pixels.length === 16 * 16 * 4, `${sprite.w}x${sprite.h}`]);
const distinct = new Set<string>();
for (let i = 0; i < sprite.w * sprite.h; i++) distinct.add(`${sprite.pixels[i * 4]},${sprite.pixels[i * 4 + 1]},${sprite.pixels[i * 4 + 2]}`);
checks.push(["pixelArtSprite: has structure (≥3 distinct colours)", distinct.size >= 3, `${distinct.size} colours`]);

// ── the live editable-kernel path (image-filters editor) ──
// Build the Kernel EXACTLY as the viz's buildCustom() does — same object shape, same pure
// convolve2d, no DOM — so this headless check exercises the real editor math.
const custom = (weights: number[], div: number): Kernel => ({ name: "custom", label: "Custom", size: 3, weights, div });

// custom identity (the editor's opening preset) reproduces the input byte for byte
const cidOut = convolve2d(idIn, 4, 4, custom([0, 0, 0, 0, 1, 0, 0, 0, 0], 1));
let cidSame = true;
for (let i = 0; i < idIn.length; i++) if (idIn[i] !== cidOut[i]) cidSame = false;
checks.push(["custom kernel: identity weights reproduce input", cidSame, cidSame ? "ok" : "differs"]);

// custom box blur (nine 1s ÷ 9) leaves a constant field unchanged
const cboxOut = convolve2d(constIn, 5, 5, custom([1, 1, 1, 1, 1, 1, 1, 1, 1], 9));
let cboxFlat = true;
for (let i = 0; i < 25; i++) if (cboxOut[i * 4] !== 100 || cboxOut[i * 4 + 1] !== 150 || cboxOut[i * 4 + 2] !== 200) cboxFlat = false;
checks.push(["custom kernel: box-blur weights leave a constant field unchanged", cboxFlat, cboxFlat ? "ok" : "not flat"]);

// custom Sobel-X is the DIRECTIONAL linear gradient (div 1) the editor seeds — signed, not |∇|
const sobelX = custom(SOBEL_X, 1);
checks.push(["custom Sobel-X: kernelGain == 0 (a gradient preserves no brightness)", kernelGain(sobelX) === 0, `gain=${kernelGain(sobelX)}`]);
const sxOut = convolve2d(step, w, h, sobelX); // reuse the dark→bright vertical step
const sxAt = (x: number, y: number): number => sxOut[(y * w + x) * 4]!;
checks.push(["custom Sobel-X: flat dark region → 0", sxAt(0, 1) === 0, `v=${sxAt(0, 1)}`]);
checks.push(["custom Sobel-X: flat bright region → 0", sxAt(4, 1) === 0, `v=${sxAt(4, 1)}`]);
checks.push(["custom Sobel-X: dark→bright edge clamps HIGH (positive gradient)", sxAt(2, 1) === 255, `v=${sxAt(2, 1)}`]);
// the reverse (bright→dark) step gives the opposite sign → clamps to 0: proves it is signed/directional
const rstep = new Uint8ClampedArray(w * h * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const v = x < 2 ? 255 : 0;
  const i = (y * w + x) * 4;
  rstep[i] = v; rstep[i + 1] = v; rstep[i + 2] = v; rstep[i + 3] = 255;
}
const sxRev = convolve2d(rstep, w, h, sobelX);
checks.push(["custom Sobel-X: bright→dark edge clamps to 0 (opposite sign — directional, not |∇|)", sxRev[(1 * w + 2) * 4] === 0, `v=${sxRev[(1 * w + 2) * 4]}`]);

// matchPreset — the ONE label derivation shared by the viz's on-canvas label and the matrix
// control's status label, so loading a preset never reads "Custom" on the picture.
const gaussian = EDITOR_PRESETS.find((p) => p.label === "Gaussian")!;
checks.push(["matchPreset: Gaussian weights ÷16 → \"Gaussian\"", matchPreset(gaussian.values, gaussian.div) === "Gaussian", matchPreset(gaussian.values, gaussian.div)]);
checks.push(["matchPreset: a hand-edited cell → \"Custom\"", matchPreset([3, 0, 0, 0, 1, 0, 0, 0, 0], 1) === "Custom", matchPreset([3, 0, 0, 0, 1, 0, 0, 0, 0], 1)]);
checks.push(["matchPreset: right weights but wrong divisor → \"Custom\"", matchPreset(gaussian.values, 1) === "Custom", matchPreset(gaussian.values, 1)]);
// the editor's Sobel-X is the DIRECTIONAL preset (div 1), NOT KERNELS[edges]'s magnitude label
checks.push(["matchPreset: Sobel-X weights ÷1 → \"Sobel-X\" (directional, not \"Edges (Sobel)\")", matchPreset(SOBEL_X, 1) === "Sobel-X", matchPreset(SOBEL_X, 1)]);

let ok = true;
for (const [name, pass, detail] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${name}  (${detail})`);
  if (!pass) ok = false;
}
console.log(`\nWrote /tmp/ls-conv-{flip,slide,combine}-*.svg, /tmp/ls-conv-boxes-{0..4}.svg, /tmp/ls-conv-setup.svg, /tmp/ls-dice-grid-7.svg, /tmp/ls-prod-grid-2.svg`);
console.log(ok ? "\nCONVOLUTION VERIFY PASS" : "\nCONVOLUTION VERIFY FAIL");
if (!ok) process.exit(1);
