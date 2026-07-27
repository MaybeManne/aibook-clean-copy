// Inline visualizations plugged in as VALUES (not registered string names). Each
// factory returns an opaque DESCRIPTOR; the LessonBuilder stamps a deterministic
// name onto it and the browser renderer (render.ts) registers it under that name via
// the existing registerFigure/registerViz. So the author writes the drawing inline,
// yet only `{ name, props }` ever flows through the lesson IR/history — replay and
// mp4 export stay pure (see docs invariants). This file is pure: it constructs
// descriptors and SVG strings; it performs no registration and imports no React.

import type { Theme } from "@lessonkit/template";

// Author-facing SVG figure fn. `t` is the beat clock in ms — 0 for untimed beats
// (`.explain`/`.demo`), and the live playhead when the figure is the viz of a
// `.animate` scene, so a figure can animate purely by reading it. It is optional
// and last so existing time-independent draws `(props, theme) => …` still fit.
export type FigureDraw = (props: Record<string, unknown>, theme: Theme, t?: number) => string;

export interface FigureDescriptor {
  readonly __viz: "figure";
  draw: FigureDraw;
  /** Stamped by the builder as `${lessonId}:${beatId}` — deterministic ⇒ replay/HMR safe. */
  name?: string;
}

export interface JsVizDescriptor {
  readonly __viz: "js";
  factory: (
    el: HTMLElement,
    props: Record<string, unknown>,
    api: { send: (event: unknown) => void },
  ) => { update?(props: Record<string, unknown>): void; destroy?(): void };
  name?: string;
}

export type VizValue = FigureDescriptor | JsVizDescriptor;

export function isFigure(v: VizValue): v is FigureDescriptor {
  return v.__viz === "figure";
}

/** A guided success condition over a control value (mirrors the explorable beat's goal). */
export interface DemoGoal {
  key: string;
  equals?: number;
  min?: number;
  max?: number;
  tolerance?: number;
}

/** Plug an inline SVG figure — exportable to mp4. `svgFigure((props, theme) => "<svg…>")`. */
export function svgFigure(draw: FigureDraw): FigureDescriptor {
  return { __viz: "figure", draw };
}

/** Plug an inline browser-only JS/canvas/WebGL viz (NOT exportable to mp4). */
export function jsViz(factory: JsVizDescriptor["factory"]): JsVizDescriptor {
  return { __viz: "js", factory };
}

// ── plot(): a small exportable chart helper (LessonKit has no chart primitive) ──────

export interface PlotOptions {
  /** The function to draw. */
  f: (x: number) => number;
  /** x-domain `[a, b]`. */
  x: [number, number];
  /** y-range; auto-fit from samples (padded, includes 0) when omitted. */
  y?: [number, number];
  /** Curve resolution (default 160). */
  samples?: number;
  /** Draw a Riemann sum: a control key (read live from props) or a fixed rectangle count. */
  riemann?: string | number;
  /** Sample point per rectangle (default "mid"). */
  method?: "left" | "right" | "mid";
  /** Shade the exact area under the curve. */
  shade?: boolean;
  /** Axis label for x / y (optional). */
  labels?: { x?: string; y?: string };
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Build an exportable SVG chart: axes + curve + optional Riemann rectangles + shading.
 * Returns a `FigureDescriptor` you plug straight into `.demo({ viz })`. The rectangle
 * count is read live from `props[riemann]` when `riemann` is a control key, so a slider
 * animates the sum converging to the true integral (shown numerically for comparison).
 */
export function plot(o: PlotOptions): FigureDescriptor {
  const [a, b] = o.x;
  const N = Math.max(2, o.samples ?? 160);

  // Sample the curve once (stable, deterministic) for auto y-range + the path.
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N;
    xs.push(x);
    ys.push(o.f(x));
  }
  let ymin: number;
  let ymax: number;
  if (o.y) {
    [ymin, ymax] = o.y;
  } else {
    ymin = Math.min(0, ...ys.filter(Number.isFinite));
    ymax = Math.max(0, ...ys.filter(Number.isFinite));
    const pad = (ymax - ymin || 1) * 0.08;
    ymin -= pad;
    ymax += pad;
  }
  if (ymax === ymin) ymax = ymin + 1;

  // True integral (fine trapezoid) — the target the sum converges to.
  const FINE = 2000;
  let trueArea = 0;
  for (let i = 0; i < FINE; i++) {
    const x0 = a + ((b - a) * i) / FINE;
    const x1 = a + ((b - a) * (i + 1)) / FINE;
    trueArea += ((o.f(x0) + o.f(x1)) / 2) * (x1 - x0);
  }

  const W = 360;
  const H = 300;
  const M = { l: 42, r: 16, t: 18, b: 34 };
  const pw = W - M.l - M.r;
  const ph = H - M.t - M.b;
  const sx = (x: number): number => M.l + ((x - a) / (b - a)) * pw;
  const sy = (y: number): number => M.t + ((ymax - y) / (ymax - ymin)) * ph;

  return svgFigure((props, theme) => {
    const c = theme.color;
    const y0 = sy(0); // baseline (x-axis) if 0 is in range, else clamped
    const baseY = Math.max(M.t, Math.min(M.t + ph, y0));

    // Curve path.
    let d = "";
    for (let i = 0; i <= N; i++) {
      const px = sx(xs[i]!).toFixed(2);
      const py = sy(Math.max(ymin, Math.min(ymax, ys[i]!))).toFixed(2);
      d += (i === 0 ? "M" : "L") + px + " " + py + " ";
    }

    // Shaded exact area under the curve (down to the baseline).
    let shadeEl = "";
    if (o.shade) {
      shadeEl =
        `<path d="${d}L${sx(b).toFixed(2)} ${baseY.toFixed(2)} L${sx(a).toFixed(2)} ${baseY.toFixed(2)} Z" ` +
        `fill="${c.accentSoft}"/>`;
    }

    // Riemann rectangles.
    let rects = "";
    let estimate = trueArea;
    let n = 0;
    if (o.riemann != null) {
      n = typeof o.riemann === "number" ? o.riemann : Math.max(1, Math.round(Number(props[o.riemann] ?? 1)));
      const dx = (b - a) / n;
      const method = o.method ?? "mid";
      estimate = 0;
      for (let i = 0; i < n; i++) {
        const xL = a + i * dx;
        const xp = method === "left" ? xL : method === "right" ? xL + dx : xL + dx / 2;
        const h = o.f(xp);
        estimate += h * dx;
        const rx = sx(xL);
        const rw = sx(xL + dx) - rx;
        const ry = sy(Math.max(0, h));
        const rh = Math.abs(baseY - sy(h));
        rects +=
          `<rect x="${rx.toFixed(2)}" y="${ry.toFixed(2)}" width="${Math.max(0, rw - 0.6).toFixed(2)}" ` +
          `height="${rh.toFixed(2)}" fill="${c.accentSoft}" stroke="${c.accent}" stroke-width="1"/>`;
      }
    }

    // Axes.
    const axes =
      `<line x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${(M.t + ph).toFixed(2)}" stroke="${c.stageBorder}" stroke-width="1"/>` +
      `<line x1="${M.l}" y1="${baseY.toFixed(2)}" x2="${(M.l + pw).toFixed(2)}" y2="${baseY.toFixed(2)}" stroke="${c.stageBorder}" stroke-width="1"/>`;

    // Readouts.
    const mono = esc(theme.font.mono);
    const readout =
      o.riemann != null
        ? `<text x="${M.l + 6}" y="${M.t + 16}" fill="${c.fg}" font-family="${mono}" font-size="13">n = ${n}</text>` +
          `<text x="${M.l + 6}" y="${M.t + 34}" fill="${c.accent}" font-family="${mono}" font-size="13">Σ ≈ ${estimate.toFixed(4)}</text>` +
          `<text x="${M.l + 6}" y="${M.t + 52}" fill="${c.muted}" font-family="${mono}" font-size="13">∫ = ${trueArea.toFixed(4)}</text>`
        : "";

    return (
      `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" ` +
      `style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">` +
      shadeEl +
      rects +
      `<path d="${d}" fill="none" stroke="${c.accentLight}" stroke-width="2.5"/>` +
      axes +
      readout +
      `</svg>`
    );
  });
}
