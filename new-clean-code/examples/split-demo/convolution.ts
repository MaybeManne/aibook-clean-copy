import { registerFigure } from "@lessonstudio/svg";
import type { Theme } from "@lessonstudio/theme";

export const F = [0.35, 0.9, 0.6, 0.25];
export const G = [0.5, 1.0, 0.4];

export function convolve(f: number[], g: number[]): number[] {
  const out = new Array(f.length + g.length - 1).fill(0) as number[];
  for (let n = 0; n < out.length; n++)
    for (let k = 0; k < f.length; k++) {
      const j = n - k;
      if (j >= 0 && j < g.length) out[n]! += f[k]! * g[j]!;
    }
  return out;
}

/**
 * The figure's colours, read off the theme instead of named as hexes.
 *
 * `registerFigure` hands every figure the active theme, so the same drawing code works on a dark
 * stage and on paper. `series` supplies the categorical hues in order — f, g, then the output — and
 * `ink`/`muted`/`axis`/`highlight` are the semantic roles. Nothing here knows whether it is being
 * drawn light or dark.
 */
function colors(theme: Theme): { f: string; g: string; out: string; axis: string; txt: string; mut: string; hi: string } {
  const s = theme.figure.series;
  return {
    f: s[0] ?? theme.color.accent,
    g: s[1] ?? theme.color.accentLight,
    out: s[2] ?? theme.color.correct,
    axis: theme.figure.axis,
    txt: theme.figure.ink,
    mut: theme.figure.muted,
    hi: theme.figure.highlight,
  };
}

type Palette = ReturnType<typeof colors>;

function rect(x: number, baseY: number, w: number, h: number, fill: string, o: { stroke?: string; op?: number } = {}): string {
  const op = o.op != null ? ` opacity="${o.op}"` : "";
  const st = o.stroke ? ` stroke="${o.stroke}" stroke-width="2.5"` : "";
  return `<rect x="${x - w / 2}" y="${baseY - h}" width="${w}" height="${Math.max(0, h)}" rx="3" fill="${fill}"${op}${st}/>`;
}
function txt(C: Palette, x: number, y: number, s: string, o: { size?: number; fill?: string; anchor?: string; weight?: number; mono?: boolean } = {}): string {
  const fam = o.mono ? "ui-monospace,monospace" : "ui-sans-serif,system-ui";
  return `<text x="${x}" y="${y}" font-family="${fam}" font-size="${o.size ?? 15}" fill="${o.fill ?? C.txt}" text-anchor="${o.anchor ?? "middle"}" font-weight="${o.weight ?? 500}">${s}</text>`;
}
function axis(C: Palette, x1: number, y: number, x2: number): string {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.axis}" stroke-width="2"/>`;
}

const FX = (k: number): number => 120 + k * 88;
const OX = (m: number): number => 95 + m * 114;

/** The two distributions side by side — the static intro (built from the same F/G). */
export function introSvg(theme: Theme): string {
  const C = colors(theme);
  const parts: string[] = [];
  const yb = 250;
  const scale = 150;
  parts.push(axis(C, 70, yb, 70 + F.length * 70));
  F.forEach((v, k) => parts.push(rect(105 + k * 70, yb, 42, v * scale, C.f)));
  parts.push(txt(C, 105 + (F.length - 1) * 35, yb + 34, "f", { size: 22, weight: 700, fill: C.f }));
  parts.push(txt(C, 430, yb - 55, "∗", { size: 44, weight: 700, fill: C.txt }));
  parts.push(axis(C, 500, yb, 500 + G.length * 70));
  G.forEach((v, k) => parts.push(rect(535 + k * 70, yb, 42, v * scale, C.g)));
  parts.push(txt(C, 535 + (G.length - 1) * 35, yb + 34, "g", { size: 22, weight: 700, fill: C.g }));
  return `<svg viewBox="0 0 760 340" width="100%" style="max-width:620px">${parts.join("")}</svg>`;
}

registerFigure("conv-intro", (_props, _t, theme) => introSvg(theme));

registerFigure("convolution", (props, _t, theme): string => {
  const C = colors(theme);
  const conv = convolve(F, G);
  const nMax = conv.length - 1;
  const n = Math.max(0, Math.min(nMax, Math.round(Number(props.shift ?? 0))));
  const Lg = G.length;
  const maxC = Math.max(...conv);

  const yF = 150;
  const yG = 300;
  const yC = 470;
  const hF = 120;
  const hG = 95;
  const hC = 110;
  const parts: string[] = [];

  parts.push(txt(C, 46, yF - 44, "f", { size: 20, weight: 700, fill: C.f, anchor: "start" }));
  parts.push(axis(C, FX(0) - 44, yF, FX(F.length - 1) + 44));
  F.forEach((v, k) => {
    const contributes = n - k >= 0 && n - k < Lg;
    parts.push(rect(FX(k), yF, 48, v * hF, C.f, contributes ? { stroke: C.hi } : { op: 0.55 }));
  });

  parts.push(txt(C, 46, yG - 44, "g", { size: 20, weight: 700, fill: C.g, anchor: "start" }));
  parts.push(txt(C, 46, yG - 24, "(flipped,", { size: 11, fill: C.mut, anchor: "start" }));
  parts.push(txt(C, 46, yG - 10, `shift ${n} →`, { size: 11, fill: C.mut, anchor: "start" }));
  parts.push(axis(C, FX(0) - 44, yG, FX(F.length - 1) + 44));
  F.forEach((_v, k) => {
    const j = n - k;
    if (j < 0 || j >= Lg) return;
    parts.push(rect(FX(k), yG, 48, G[j]! * hG, C.g, { op: 0.9 }));
    const prod = (F[k]! * G[j]!).toFixed(2);
    parts.push(txt(C, FX(k), yG - G[j]! * hG - 8, prod, { size: 12, fill: C.hi, mono: true }));
  });

  parts.push(txt(C, 46, yC - 44, "f∗g", { size: 18, weight: 700, fill: C.out, anchor: "start" }));
  parts.push(axis(C, OX(0) - 40, yC, OX(nMax) + 40));
  const pts = conv.map((v, m) => `${OX(m)},${yC - (v / maxC) * hC}`).slice(0, n + 1).join(" ");
  if (n >= 1) parts.push(`<polyline points="${pts}" fill="none" stroke="${C.out}" stroke-width="2" opacity="0.5"/>`);
  conv.forEach((v, m) => {
    const h = (v / maxC) * hC;
    if (m < n) parts.push(rect(OX(m), yC, 40, h, C.out, { op: 0.85 }));
    else if (m === n) parts.push(rect(OX(m), yC, 44, h, C.out, { stroke: C.hi }));
    else parts.push(rect(OX(m), yC, 40, h, C.out, { op: 0.15 }));
    parts.push(txt(C, OX(m), yC + 20, String(m), { size: 12, fill: m === n ? C.hi : C.mut }));
  });

  parts.push(txt(C, 660, yF - 30, `(f∗g)[${n}]`, { size: 16, fill: C.out, anchor: "end", mono: true }));
  parts.push(txt(C, 660, yF - 6, `= ${conv[n]!.toFixed(2)}`, { size: 20, fill: C.hi, anchor: "end", weight: 700, mono: true }));

  return `<svg viewBox="0 0 760 500" width="100%" style="max-width:680px">${parts.join("")}</svg>`;
});
