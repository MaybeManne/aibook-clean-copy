// An interactive convolution figure, registered as an SVG figure (declarative, exportable).
// It reads one prop — `shift` (the slider value n) — and draws the whole 3b1b-style picture:
//   • f  (fixed discrete distribution)
//   • g  flipped and slid to shift n, sampled under f  (the sliding window)
//   • the overlapping products f[k]·g[n−k], highlighted
//   • the output (f∗g), built up bar-by-bar: bars ≤ n are computed, the bar at n is live.
// Same f/g arrays drive the static intro SVG, so both beats show the same distributions.

import { registerFigure } from "@lessonstudio/scene-svg";

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

const C = { f: "#818cf8", g: "#f472b6", out: "#34d399", axis: "#334155", txt: "#cbd5e1", mut: "#64748b", hi: "#fbbf24" };

function rect(x: number, baseY: number, w: number, h: number, fill: string, o: { stroke?: string; op?: number } = {}): string {
  const op = o.op != null ? ` opacity="${o.op}"` : "";
  const st = o.stroke ? ` stroke="${o.stroke}" stroke-width="2.5"` : "";
  return `<rect x="${x - w / 2}" y="${baseY - h}" width="${w}" height="${Math.max(0, h)}" rx="3" fill="${fill}"${op}${st}/>`;
}
function txt(x: number, y: number, s: string, o: { size?: number; fill?: string; anchor?: string; weight?: number; mono?: boolean } = {}): string {
  const fam = o.mono ? "ui-monospace,monospace" : "ui-sans-serif,system-ui";
  return `<text x="${x}" y="${y}" font-family="${fam}" font-size="${o.size ?? 15}" fill="${o.fill ?? C.txt}" text-anchor="${o.anchor ?? "middle"}" font-weight="${o.weight ?? 500}">${s}</text>`;
}
function axis(x1: number, y: number, x2: number): string {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.axis}" stroke-width="2"/>`;
}

const FX = (k: number): number => 120 + k * 88; // f / g column x
const OX = (m: number): number => 95 + m * 114; // output column x

/** The two distributions side by side — the static intro (built from the same F/G). */
export const introSvg = ((): string => {
  const parts: string[] = [];
  const yb = 250;
  const scale = 150;
  // f cluster
  parts.push(axis(70, yb, 70 + F.length * 70));
  F.forEach((v, k) => parts.push(rect(105 + k * 70, yb, 42, v * scale, C.f)));
  parts.push(txt(105 + (F.length - 1) * 35, yb + 34, "f", { size: 22, weight: 700, fill: C.f }));
  // operator
  parts.push(txt(430, yb - 55, "∗", { size: 44, weight: 700, fill: C.txt }));
  // g cluster
  parts.push(axis(500, yb, 500 + G.length * 70));
  G.forEach((v, k) => parts.push(rect(535 + k * 70, yb, 42, v * scale, C.g)));
  parts.push(txt(535 + (G.length - 1) * 35, yb + 34, "g", { size: 22, weight: 700, fill: C.g }));
  return `<svg viewBox="0 0 760 340" width="100%" style="max-width:620px">${parts.join("")}</svg>`;
})();

// Register the static intro as a figure too, so the intro beat can be an explorable with a
// real "Start →" button (a plain explain beat has no advance affordance in the clockless model).
registerFigure("conv-intro", () => introSvg);

registerFigure("convolution", (props): string => {
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

  // ── f row (contributing columns outlined, others dimmed) ─────────────────────
  parts.push(txt(46, yF - 44, "f", { size: 20, weight: 700, fill: C.f, anchor: "start" }));
  parts.push(axis(FX(0) - 44, yF, FX(F.length - 1) + 44));
  F.forEach((v, k) => {
    const contributes = n - k >= 0 && n - k < Lg;
    parts.push(rect(FX(k), yF, 48, v * hF, C.f, contributes ? { stroke: C.hi } : { op: 0.55 }));
  });

  // ── g row: flipped + slid; under f[k] sits g[n−k] ────────────────────────────
  parts.push(txt(46, yG - 44, "g", { size: 20, weight: 700, fill: C.g, anchor: "start" }));
  parts.push(txt(46, yG - 24, "(flipped,", { size: 11, fill: C.mut, anchor: "start" }));
  parts.push(txt(46, yG - 10, `shift ${n} →`, { size: 11, fill: C.mut, anchor: "start" }));
  parts.push(axis(FX(0) - 44, yG, FX(F.length - 1) + 44));
  F.forEach((_v, k) => {
    const j = n - k;
    if (j < 0 || j >= Lg) return;
    parts.push(rect(FX(k), yG, 48, G[j]! * hG, C.g, { op: 0.9 }));
    // product term above the overlap
    const prod = (F[k]! * G[j]!).toFixed(2);
    parts.push(txt(FX(k), yG - G[j]! * hG - 8, prod, { size: 12, fill: C.hi, mono: true }));
  });

  // ── output row: f∗g, built up bar-by-bar ─────────────────────────────────────
  parts.push(txt(46, yC - 44, "f∗g", { size: 18, weight: 700, fill: C.out, anchor: "start" }));
  parts.push(axis(OX(0) - 40, yC, OX(nMax) + 40));
  // curve through computed tops
  const pts = conv.map((v, m) => `${OX(m)},${yC - (v / maxC) * hC}`).slice(0, n + 1).join(" ");
  if (n >= 1) parts.push(`<polyline points="${pts}" fill="none" stroke="${C.out}" stroke-width="2" opacity="0.5"/>`);
  conv.forEach((v, m) => {
    const h = (v / maxC) * hC;
    if (m < n) parts.push(rect(OX(m), yC, 40, h, C.out, { op: 0.85 }));
    else if (m === n) parts.push(rect(OX(m), yC, 44, h, C.out, { stroke: C.hi }));
    else parts.push(rect(OX(m), yC, 40, h, C.out, { op: 0.15 }));
    parts.push(txt(OX(m), yC + 20, String(m), { size: 12, fill: m === n ? C.hi : C.mut }));
  });

  // sum readout — the whole point: overlap · multiply · sum
  parts.push(txt(660, yF - 30, `(f∗g)[${n}]`, { size: 16, fill: C.out, anchor: "end", mono: true }));
  parts.push(txt(660, yF - 6, `= ${conv[n]!.toFixed(2)}`, { size: 20, fill: C.hi, anchor: "end", weight: 700, mono: true }));

  return `<svg viewBox="0 0 760 500" width="100%" style="max-width:680px">${parts.join("")}</svg>`;
});
