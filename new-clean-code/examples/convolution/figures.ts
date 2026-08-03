import { registerFigure, registerSceneFigure } from "@lessonstudio/svg";
import { grid, label, palette } from "@lessonstudio/figures";
import type { Theme } from "@lessonstudio/theme";
import type { SceneNode } from "@lessonstudio/timeline";

export const A = [1, 2, 3];
export const B = [4, 5, 6];

/** Discrete convolution a∗b: out[n] = Σ_k a[k]·b[n−k]. (1,2,3)∗(4,5,6) = [4,13,28,27,18]. */
export function convolve(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0) as number[];
  for (let n = 0; n < out.length; n++)
    for (let k = 0; k < a.length; k++) {
      const j = n - k;
      if (j >= 0 && j < b.length) out[n]! += a[k]! * b[j]!;
    }
  return out;
}

/**
 * The figure's colours as semantic roles read off the theme.
 *
 * These figures build raw SVG strings, so nothing downstream can re-map their colours the way it
 * re-maps a `SceneNode`'s named fill — they have to ask. `registerFigure` hands every figure the
 * active theme for exactly this, which is why the same code draws correctly on a dark stage and on
 * paper stock.
 */
function colors(theme: Theme): {
  a: string; b: string; prod: string; result: string; ink: string; txt: string; mut: string; hi: string;
} {
  const p = theme.figure.palette;
  return {
    a: p.blue ?? palette.blue,
    b: p.red ?? palette.red,
    prod: p.green ?? palette.green,
    result: p.yellow ?? palette.yellow,
    ink: theme.figure.onMark,
    txt: theme.figure.ink,
    mut: theme.figure.muted,
    hi: theme.figure.highlight,
  };
}

type Palette = ReturnType<typeof colors>;

function box(
  C: Palette,
  cx: number,
  cy: number,
  w: number,
  h: number,
  fill: string,
  o: { value?: string | number; textFill?: string; op?: number; ring?: boolean; textSize?: number } = {},
): string {
  const op = o.op != null ? ` opacity="${o.op}"` : "";
  const ring = o.ring ? ` stroke="${C.hi}" stroke-width="4"` : "";
  const rect = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="10" fill="${fill}"${op}${ring}/>`;
  const t =
    o.value !== undefined
      ? `<text x="${cx}" y="${cy}" font-family="ui-sans-serif,system-ui" font-size="${o.textSize ?? Math.round(Math.min(w, h) * 0.46)}" font-weight="700" fill="${o.textFill ?? C.ink}" text-anchor="middle" dominant-baseline="central"${op}>${o.value}</text>`
      : "";
  return rect + t;
}
function txt(C: Palette, x: number, y: number, s: string, o: { size?: number; fill?: string; anchor?: string; weight?: number; mono?: boolean } = {}): string {
  const fam = o.mono ? "ui-monospace,monospace" : "ui-sans-serif,system-ui";
  return `<text x="${x}" y="${y}" font-family="${fam}" font-size="${o.size ?? 16}" fill="${o.fill ?? C.txt}" text-anchor="${o.anchor ?? "middle"}" font-weight="${o.weight ?? 500}">${s}</text>`;
}

const STEP = 150;
const A0 = 350;
const AX = (i: number): number => A0 + i * STEP;
const BOX = 88;
const Y_A = 150;
const Y_B = 320;
const Y_OUT = 470;
const OX = (m: number): number => 250 + m * 125;
const BX = (j: number, n: number): number => A0 + (n - j) * STEP;

export function setupSvg(theme: Theme): string {
  const C = colors(theme);
  const parts: string[] = [];
  const y1 = 120;
  const y2 = 270;
  A.forEach((v, i) => parts.push(box(C, AX(i), y1, BOX, BOX, C.a, { value: v })));
  parts.push(txt(C, A0 - 120, y1, "a =", { size: 26, weight: 700, fill: C.a, anchor: "end" }));
  B.forEach((v, i) => parts.push(box(C, AX(i), y2, BOX, BOX, C.b, { value: v })));
  parts.push(txt(C, A0 - 120, y2, "b =", { size: 26, weight: 700, fill: C.b, anchor: "end" }));
  parts.push(txt(C, AX(2) + 150, (y1 + y2) / 2, "a ∗ b = ?", { size: 30, weight: 700, fill: C.txt, anchor: "middle" }));
  return `<svg viewBox="0 0 1000 400" width="100%" style="max-width:760px" font-family="ui-sans-serif,system-ui">${parts.join("")}</svg>`;
}

registerFigure("conv-setup", (_props, _t, theme) => setupSvg(theme));

registerFigure("conv-boxes", (props, _t, theme): string => {
  const C = colors(theme);
  const conv = convolve(A, B);
  const nMax = conv.length - 1;
  const n = Math.max(0, Math.min(nMax, Math.round(Number(props.shift ?? 0))));
  const parts: string[] = [];

  parts.push(txt(C, A0 - 190, Y_A, "a =", { size: 22, weight: 700, fill: C.a, anchor: "start" }));
  parts.push(txt(C, A0 - 190, Y_B, "b flipped,", { size: 15, fill: C.mut, anchor: "start" }));
  parts.push(txt(C, A0 - 190, Y_B + 20, `shift n = ${n}`, { size: 15, fill: C.mut, anchor: "start" }));

  A.forEach((v, i) => {
    const contributes = n - i >= 0 && n - i < B.length;
    parts.push(box(C, AX(i), Y_A, BOX, BOX, C.a, { value: v, ring: contributes, op: contributes ? 1 : 0.5 }));
  });

  B.forEach((v, j) => {
    const i = n - j;
    const aligned = i >= 0 && i < A.length;
    parts.push(box(C, BX(j, n), Y_B, BOX, BOX, C.b, { value: v, ring: aligned, op: aligned ? 1 : 0.35 }));
    if (aligned) {
      parts.push(txt(C, AX(i), (Y_A + Y_B) / 2, `${A[i]}·${v} = ${A[i]! * v}`, { size: 17, weight: 700, fill: C.prod, mono: true }));
    }
  });

  const terms = A.map((_, i) => n - i).map((j, i) => (j >= 0 && j < B.length ? `${A[i]}·${B[j]}` : null)).filter(Boolean);
  parts.push(txt(C, 970, Y_A - 40, `(a∗b)[${n}]`, { size: 18, fill: C.result, anchor: "end", mono: true }));
  parts.push(txt(C, 970, Y_A - 12, `= ${terms.join(" + ")}`, { size: 16, fill: C.prod, anchor: "end", mono: true }));
  parts.push(txt(C, 970, Y_A + 16, `= ${conv[n]}`, { size: 24, fill: C.hi, anchor: "end", weight: 700, mono: true }));

  parts.push(txt(C, OX(0) - 150, Y_OUT, "a∗b =", { size: 20, weight: 700, fill: C.result, anchor: "start" }));
  conv.forEach((v, m) => {
    if (m < n) parts.push(box(C, OX(m), Y_OUT, 80, 80, C.result, { value: v, textFill: C.ink, op: 0.85 }));
    else if (m === n) parts.push(box(C, OX(m), Y_OUT, 84, 84, C.result, { value: v, textFill: C.ink, ring: true }));
    else parts.push(box(C, OX(m), Y_OUT, 80, 80, palette.darkGray, { value: v, textFill: C.mut, op: 0.4 }));
    parts.push(txt(C, OX(m), Y_OUT + 62, String(m), { size: 13, fill: m === n ? C.hi : C.mut }));
  });

  return `<svg viewBox="0 0 1000 560" width="100%" style="max-width:820px" font-family="ui-sans-serif,system-ui">${parts.join("")}</svg>`;
});

const DG = { x: 150, y: 120, cw: 58, ch: 58, gap: 6 };
const dgColX = (c: number): number => DG.x + (c + 0.5) * DG.cw + c * DG.gap;
const dgRowY = (r: number): number => DG.y + (r + 0.5) * DG.ch + r * DG.gap;
/** Number of (i,j)∈1..6² with i+j==n (the anti-diagonal length). 0 outside 2..12. */
export function diceWays(n: number): number {
  return n >= 2 && n <= 12 ? 6 - Math.abs(n - 7) : 0;
}

registerSceneFigure(
  "dice-grid",
  (props, _t, theme): SceneNode[] => {
    const n = Math.max(2, Math.min(12, Math.round(Number(props.sum ?? 7))));
    const ways = diceWays(n);
    const nodes: SceneNode[] = [
      label("dg-title", DG.x, 58, "Roll two dice — each cell is the sum", { size: 22, fill: palette.lightGray, anchor: "start" }),
    ];
    for (let f = 1; f <= 6; f++) {
      nodes.push(label(`dg-ct${f}`, dgColX(f - 1), DG.y - 26, String(f), { size: 18, fill: palette.gray, anchor: "middle", baseline: "middle", weight: 700 }));
      nodes.push(label(`dg-rt${f}`, DG.x - 26, dgRowY(f - 1), String(f), { size: 18, fill: palette.gray, anchor: "middle", baseline: "middle", weight: 700 }));
    }
    nodes.push(
      grid("dg", {
        rows: 6,
        cols: 6,
        cellW: DG.cw,
        cellH: DG.ch,
        gap: DG.gap,
        x: DG.x,
        y: DG.y,
        cell: (r, c) => {
          const s = r + 1 + (c + 1);
          const on = s === n;
          return {
            value: s,
            // The active cell IS the highlight, so it names that role rather than a colour.
            fill: on ? theme.figure.highlight : palette.darkGray,
            textFill: on ? theme.figure.onMark : palette.lightGray,
            opacity: on ? 1 : 0.4,
            ...(on ? { stroke: theme.figure.ink, strokeWidth: 4 } : {}),
          };
        },
      }),
    );
    const cx = (DG.x + dgColX(5) + DG.cw / 2) / 2;
    nodes.push(label("dg-out", cx, dgRowY(5) + DG.ch / 2 + 34, `P(sum = ${n}) = ${ways}/36`, { size: 26, fill: theme.figure.highlight, anchor: "middle", baseline: "middle", weight: 700 }));
    return nodes;
  },
  { viewBox: { x: 0, y: 0, w: 620, h: 540 }, maxWidth: 620 },
);

const PG = { x: 200, y: 150, cw: 90, ch: 90, gap: 12 };
const pgColX = (c: number): number => PG.x + (c + 0.5) * PG.cw + c * PG.gap;
const pgRowY = (r: number): number => PG.y + (r + 0.5) * PG.ch + r * PG.gap;

registerSceneFigure(
  "prod-grid",
  (props, _t, theme): SceneNode[] => {
    const C = colors(theme);
    const out = convolve(A, B);
    const dMax = out.length - 1;
    const d = Math.max(0, Math.min(dMax, Math.round(Number(props.diag ?? 0))));
    const nodes: SceneNode[] = [
      label("pg-title", PG.x - 60, 70, "Grid of products  A[r] · B[c]", { size: 22, fill: palette.lightGray, anchor: "start" }),
    ];
    B.forEach((v, c) => nodes.push(label(`pg-ct${c}`, pgColX(c), PG.y - 30, String(v), { size: 24, fill: C.b, anchor: "middle", baseline: "middle", weight: 700 })));
    A.forEach((v, r) => nodes.push(label(`pg-rt${r}`, PG.x - 34, pgRowY(r), String(v), { size: 24, fill: C.a, anchor: "middle", baseline: "middle", weight: 700 })));
    nodes.push(
      grid("pg", {
        rows: 3,
        cols: 3,
        cellW: PG.cw,
        cellH: PG.ch,
        gap: PG.gap,
        x: PG.x,
        y: PG.y,
        cell: (r, c) => {
          const on = r + c === d;
          return {
            value: A[r]! * B[c]!,
            fill: on ? theme.figure.highlight : palette.darkGray,
            textFill: on ? theme.figure.onMark : palette.lightGray,
            opacity: on ? 1 : 0.4,
            ...(on ? { stroke: theme.figure.ink, strokeWidth: 4 } : {}),
          };
        },
      }),
    );
    const terms: string[] = [];
    for (let r = 0; r < A.length; r++) {
      const c = d - r;
      if (c >= 0 && c < B.length) terms.push(`${A[r]! * B[c]!}`);
    }
    const cx = (PG.x + pgColX(2) + PG.cw / 2) / 2;
    const yOut = pgRowY(2) + PG.ch / 2 + 34;
    nodes.push(label("pg-sum", cx, yOut, `diagonal ${d}:  ${terms.join(" + ")} = ${out[d]}`, { size: 22, fill: C.hi, anchor: "middle", baseline: "middle", weight: 700 }));
    nodes.push(label("pg-out", cx, yOut + 30, `= (a ∗ b)[${d}]`, { size: 18, fill: C.result, anchor: "middle", baseline: "middle" }));
    return nodes;
  },
  { viewBox: { x: 0, y: 0, w: 560, h: 520 }, maxWidth: 560 },
);
