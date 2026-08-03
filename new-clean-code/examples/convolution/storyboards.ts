import { fadeIn, group, indicate, label, numberBox, palette } from "@lessonstudio/figures";
import type { SceneNode, Storyboard, Tween } from "@lessonstudio/timeline";
import { A, B, convolve } from "./figures.js";

const STAGE = { w: 1280, h: 720 };
const STEP = 170;
const CX = 640;
const AX = (i: number): number => CX + (i - 1) * STEP;
const conv = convolve(A, B);
/**
 * Text drawn inside a filled box. A storyboard is built once at module load, so it cannot read a
 * theme — naming the palette role instead of a hex is what lets `svg/` invert it per theme, so these
 * numbers stay legible when the boxes go from bright-on-dark to dark-on-paper.
 */
const INK = palette.onMark;

export function buildFlip(): Storyboard {
  const Y_A = 250;
  const Y_B = 450;
  const FLIP_START = 2600;
  const FLIP_DUR = 1300;
  const initial: SceneNode[] = [
    label("title", CX, 80, "Flip, slide, multiply, sum", { size: 34, weight: 800, anchor: "middle", fill: palette.white }),
    label("sub", CX, 128, "a = (1, 2, 3)   ∗   b = (4, 5, 6)", { size: 20, anchor: "middle", fill: palette.lightGray }),
    label("la", AX(0) - 140, Y_A, "a", { size: 26, weight: 800, anchor: "middle", fill: palette.blue }),
    label("lb", AX(0) - 140, Y_B, "b", { size: 26, weight: 800, anchor: "middle", fill: palette.red }),
    ...A.map((v, i) => numberBox(`a${i}`, AX(i), Y_A, v, { fill: palette.blue, opacity: 0 })),
    numberBox("b0", AX(0), Y_B, B[0]!, { fill: palette.red, opacity: 0 }),
    numberBox("b1", AX(1), Y_B, B[1]!, { fill: palette.red, opacity: 0 }),
    numberBox("b2", AX(2), Y_B, B[2]!, { fill: palette.red, opacity: 0 }),
    label("flipcap", CX, 600, "flip b — now it reads 6, 5, 4", { size: 22, weight: 700, anchor: "middle", fill: palette.yellow }),
  ];

  const arcX = (target: string, from: number, to: number): Tween => ({ target, property: "x", from, to, start: FLIP_START, duration: FLIP_DUR, easing: "smooth" });
  const arcY = (target: string, dy: number): Tween => ({ target, property: "y", from: Y_B, to: Y_B + dy, start: FLIP_START, duration: FLIP_DUR, easing: "thereAndBack" });

  const tweens: Tween[] = [
    ...fadeIn("title", { start: 0, duration: 400 }),
    ...fadeIn("sub", { start: 300, duration: 400 }),
    ...fadeIn("la", { start: 500 }),
    ...fadeIn("lb", { start: 1200 }),
    ...["a0", "a1", "a2"].flatMap((t, i) => fadeIn(t, { start: 600 + i * 180, duration: 350 })),
    ...["b0", "b1", "b2"].flatMap((t, i) => fadeIn(t, { start: 1300 + i * 180, duration: 350 })),
    arcX("b0", AX(0), AX(2)),
    arcY("b0", -190),
    arcX("b2", AX(2), AX(0)),
    arcY("b2", +190),
    ...indicate("b1", { start: FLIP_START + 300, duration: 700, scaleTo: 1.12 }),
    ...fadeIn("flipcap", { start: FLIP_START + 1500, duration: 500 }),
  ];

  return { duration: 4800, stage: STAGE, initial, tweens };
}

export function buildSlide(): Storyboard {
  const Y_A = 210;
  const Y_B = 390;
  const Y_C = 560;
  const A0 = AX(0);
  const Gx = (n: number): number => A0 + (n - 2) * STEP;
  const OX = (m: number): number => CX + (m - 2) * 150;
  const SLIDE_START = 700;
  const SLIDE_DUR = 6000;
  const nMax = conv.length - 1;
  const revealAt = (n: number): number => SLIDE_START + SLIDE_DUR * (n / nMax);

  const stripKids: SceneNode[] = B.map((v, j) => numberBox(`sb${j}`, (2 - j) * STEP, 0, v, { fill: palette.red }));

  const initial: SceneNode[] = [
    label("title", CX, 90, "Slide · multiply the overlap · sum", { size: 30, weight: 800, anchor: "middle", fill: palette.white }),
    label("la", A0 - 150, Y_A, "a", { size: 24, weight: 800, anchor: "middle", fill: palette.blue }),
    ...A.map((v, i) => numberBox(`a${i}`, AX(i), Y_A, v, { fill: palette.blue, opacity: 0 })),
    group("strip", stripKids, { x: Gx(0), y: Y_B, opacity: 0 }),
    label("lc", OX(0) - 170, Y_C, "a ∗ b", { size: 22, weight: 800, anchor: "middle", fill: palette.yellow }),
    ...conv.map((v, m) => numberBox(`res${m}`, OX(m), Y_C, v, { fill: palette.yellow, textFill: INK, opacity: 0 })),
  ];

  const tweens: Tween[] = [
    ...["a0", "a1", "a2"].flatMap((t, i) => fadeIn(t, { start: i * 120, duration: 350 })),
    ...fadeIn("strip", { start: 200, duration: 400 }),
    { target: "strip", property: "x", from: Gx(0), to: Gx(nMax), start: SLIDE_START, duration: SLIDE_DUR, easing: "linear" },
  ];
  for (let n = 0; n <= nMax; n++) {
    const r = revealAt(n);
    tweens.push(...fadeIn(`res${n}`, { start: r, duration: 300 }));
    tweens.push(...indicate(`res${n}`, { start: r, duration: 550, scaleTo: 1.3 }));
  }

  return { duration: SLIDE_START + SLIDE_DUR + 900, stage: STAGE, initial, tweens };
}

const HOOK_A = [1, 2, 3, 4];
const HOOK_B = [5, 6, 7, 8];
export function buildCombine(): Storyboard {
  const add = HOOK_A.map((v, i) => v + HOOK_B[i]!);
  const mul = HOOK_A.map((v, i) => v * HOOK_B[i]!);
  const cnv = convolve(HOOK_A, HOOK_B);

  const W4 = 78;
  const STEP4 = 150;
  const X4 = (i: number): number => CX + (i - 1.5) * STEP4;
  const LBL4 = X4(0) - W4 / 2 - 22;
  const W7 = 72;
  const STEP7 = 118;
  const X7 = (m: number): number => CX + (m - 3) * STEP7;
  const LBL7 = X7(0) - W7 / 2 - 22;

  const Y_A = 165;
  const Y_B = 262;
  const Y_ADD = 392;
  const Y_MUL = 496;
  const Y_CNV = 612;

  const row = (ids: string, xs: (i: number) => number, y: number, vals: number[], fill: string, o?: { w?: number; textFill?: string }): SceneNode[] =>
    vals.map((v, i) => numberBox(`${ids}${i}`, xs(i), y, v, { w: o?.w ?? W4, h: o?.w ?? W4, fill, ...(o?.textFill ? { textFill: o.textFill } : {}), opacity: 0 }));

  const initial: SceneNode[] = [
    label("title", CX, 66, "Three ways to combine two lists", { size: 32, weight: 800, anchor: "middle", fill: palette.white }),
    label("la", LBL4, Y_A, "a =", { size: 22, weight: 800, anchor: "end", baseline: "middle", fill: palette.blue }),
    ...row("ha", X4, Y_A, HOOK_A, palette.blue),
    label("lb", LBL4, Y_B, "b =", { size: 22, weight: 800, anchor: "end", baseline: "middle", fill: palette.red }),
    ...row("hb", X4, Y_B, HOOK_B, palette.red),
    label("ladd", LBL4, Y_ADD, "a + b =", { size: 20, weight: 800, anchor: "end", baseline: "middle", fill: palette.green }),
    ...row("add", X4, Y_ADD, add, palette.green, { textFill: INK }),
    label("lmul", LBL4, Y_MUL, "a · b =", { size: 20, weight: 800, anchor: "end", baseline: "middle", fill: palette.teal }),
    ...row("mul", X4, Y_MUL, mul, palette.teal, { textFill: INK }),
    label("lcnv", LBL7, Y_CNV, "a ∗ b =", { size: 20, weight: 800, anchor: "end", baseline: "middle", fill: palette.yellow }),
    ...row("cnv", X7, Y_CNV, cnv, palette.yellow, { w: W7, textFill: INK }),
    { ...label("note", CX, Y_CNV + 74, "length 7 — it mixes every pair. what IS this operation?", { size: 20, weight: 700, anchor: "middle", fill: palette.yellow }), opacity: 0 },
  ];

  const tweens: Tween[] = [
    ...fadeIn("title", { start: 0, duration: 400 }),
    ...fadeIn("la", { start: 300 }),
    ...HOOK_A.map((_, i) => fadeIn(`ha${i}`, { start: 350 + i * 130, duration: 300 })).flat(),
    ...fadeIn("lb", { start: 900 }),
    ...HOOK_B.map((_, i) => fadeIn(`hb${i}`, { start: 950 + i * 130, duration: 300 })).flat(),
    ...fadeIn("ladd", { start: 1700 }),
    ...add.map((_, i) => fadeIn(`add${i}`, { start: 1750 + i * 110, duration: 280 })).flat(),
    ...fadeIn("lmul", { start: 2500 }),
    ...mul.map((_, i) => fadeIn(`mul${i}`, { start: 2550 + i * 110, duration: 280 })).flat(),
    ...fadeIn("lcnv", { start: 3400 }),
    ...cnv.map((_, i) => fadeIn(`cnv${i}`, { start: 3450 + i * 130, duration: 280 })).flat(),
    ...indicate("lcnv", { start: 4500, duration: 800, scaleTo: 1.15 }),
    ...fadeIn("note", { start: 4700, duration: 500 }),
  ];

  return { duration: 5600, stage: STAGE, initial, tweens };
}
