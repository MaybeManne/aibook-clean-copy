// Pure SceneSnapshot → SVG string. This is the SINGLE drawing implementation:
// SceneView (browser preview) and the frame exporter both go through it, so an
// interactive frame and an exported frame are byte-identical geometry. No React,
// no DOM — a string. Depends on timeline (SceneNode) + template (Theme).

import { toPlain } from "@lessonstudio/render-contract";
import type { SceneNode, SceneSnapshot } from "@lessonstudio/timeline";
import type { Theme } from "@lessonstudio/template";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Arbitrary figures ────────────────────────────────────────────────────────
// The escape hatch for ANY figure kind, unrelated to the built-in primitives: an
// author registers a name → a PURE function that returns a complete <svg> string
// for beat time `t`. Because it's SVG, it renders in the browser (SceneView/
// VizView) AND rasterizes into the mp4 export — full creative freedom, still
// exportable. (For canvas/WebGL/DOM, use render_web's registerViz — browser only.)
export type SvgFigure = (props: Record<string, unknown>, t: number, theme: Theme) => string;
const figures = new Map<string, SvgFigure>();

/** Register a custom SVG figure (browser + export). */
export function registerFigure(name: string, fn: SvgFigure): void {
  figures.set(name, fn);
}
export function getFigure(name: string): SvgFigure | undefined {
  return figures.get(name);
}

// ── Node-authored figures (the bridge) ─────────────────────────────────────────
// The two ways to author a figure used to be disjoint: scripted SCENES are declarative
// `SceneNode`s (visuals: numberBox/label/group/grid/…) drawn by `snapshotToSvgInner`, while
// interactive FIGURES had to return a raw <svg> string by hand. `sceneFigure` closes that gap:
// author an interactive figure as SceneNodes too, rendered through the SAME pure drawer. Still a
// pure string ⇒ still export-safe. `build(props, t)` maps the live control values / beat time to
// a node list; the result is wrapped in a RESPONSIVE <svg> (viewBox + width:100%) so it fills the
// split-screen stage like the hand-rolled figures did.
export interface SceneFigureOpts {
  viewBox: { x: number; y: number; w: number; h: number };
  maxWidth?: number; // cap the rendered width (px); defaults to viewBox width
  background?: boolean; // paint the theme stage color behind the nodes (default: transparent)
}
type NodeBuilder = (props: Record<string, unknown>, t: number) => SceneNode[];

export function sceneFigure(build: NodeBuilder, opts: SceneFigureOpts): SvgFigure {
  const { x, y, w, h } = opts.viewBox;
  const maxW = opts.maxWidth ?? w;
  return (props, t, theme) => {
    const snap: SceneSnapshot = { nodes: build(props, t), viewBox: { x, y, w, h } };
    const bg = opts.background ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${esc(theme.color.stage)}"/>` : "";
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="100%" style="max-width:${maxW}px" font-family="${esc(theme.font.body)}">` +
      bg +
      snapshotToSvgInner(snap, theme) +
      `</svg>`
    );
  };
}

/** Register a figure authored as declarative SceneNodes (see `sceneFigure`). */
export function registerSceneFigure(name: string, build: NodeBuilder, opts: SceneFigureOpts): void {
  registerFigure(name, sceneFigure(build, opts));
}

/** A complete exported frame for a registered figure: bg + figure + caption. */
export function frameFigureSvg(
  name: string,
  props: Record<string, unknown>,
  t: number,
  theme: Theme,
  w: number,
  h: number,
  caption?: { words: { word: string }[]; active: number } | null,
  size?: { width?: number; height?: number },
): string {
  const fn = figures.get(name);
  const inner = fn
    ? fn(props, t, theme)
    : `<text x="24" y="48" fill="${esc(theme.color.wrong)}" font-family="${esc(theme.font.mono)}" font-size="20">figure not registered: ${esc(name)}</text>`;
  const width = size?.width ?? w;
  const height = size?.height ?? h;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${esc(theme.color.stage)}"/>` +
    inner +
    (caption ? captionSvg(caption, theme, w, h) : "") +
    `</svg>`
  );
}

/** Serialize a camera-controlled viewBox `{x,y,w,h}` to the SVG viewBox attr. */
function viewBoxStr(vb: SceneSnapshot["viewBox"]): string {
  return `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;
}

function transform(n: { x?: number; y?: number; scale?: number; rotation?: number }): string {
  const parts: string[] = [];
  if (n.x || n.y) parts.push(`translate(${n.x ?? 0} ${n.y ?? 0})`);
  if (n.rotation) parts.push(`rotate(${n.rotation})`);
  if (n.scale != null && n.scale !== 1) parts.push(`scale(${n.scale})`);
  return parts.join(" ");
}

// Collected <defs> (gradients + glow filters) for the current render pass.
interface DefCtx {
  defs: string[];
  n: number;
}

function attrs(n: SceneNode, ctx: DefCtx): string {
  const t = transform(n);
  const op = n.opacity ?? 1;
  let filter = "";
  if (n.glow && n.glow > 0) {
    const id = `glow${ctx.n++}`;
    // outer glow: a blurred, offset-free drop shadow tinted by the node color
    ctx.defs.push(
      `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${n.glow}" flood-color="${esc(n.fill ?? theme_accent(n))}" flood-opacity="0.9"/></filter>`,
    );
    filter = ` filter="url(#${id})"`;
  }
  return `${op !== 1 ? ` opacity="${op}"` : ""}${t ? ` transform="${t}"` : ""}${filter}`;
}
function theme_accent(_n: SceneNode): string {
  return "#7aa2ff";
}

/** Resolve a node's fill, registering a gradient def if present. */
function fillOf(n: SceneNode, theme: Theme, ctx: DefCtx): string {
  if (n.gradient) {
    const id = `grad${ctx.n++}`;
    const { from, to, radial } = n.gradient;
    ctx.defs.push(
      radial
        ? `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${esc(from)}"/><stop offset="100%" stop-color="${esc(to)}"/></radialGradient>`
        : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${esc(from)}"/><stop offset="100%" stop-color="${esc(to)}"/></linearGradient>`,
    );
    return `url(#${id})`;
  }
  return esc(n.fill ?? theme.color.accent);
}

function drawNode(n: SceneNode, theme: Theme, ctx: DefCtx): string {
  const fill = fillOf(n, theme, ctx);
  const a = attrs(n, ctx);
  switch (n.kind) {
    case "rect":
      return `<rect${a} width="${n.w}" height="${n.h}" rx="6" fill="${fill}"/>`;
    case "circle": {
      const noFill = n.fill === "none";
      const strokeAttr = n.stroke ? ` stroke="${esc(n.stroke)}" stroke-width="${n.strokeWidth ?? 2}"` : "";
      return `<circle${a} r="${n.r}" fill="${noFill ? "none" : fill}"${strokeAttr}/>`;
    }
    case "line":
      return `<line${a} x1="0" y1="0" x2="${n.x2 - (n.x ?? 0)}" y2="${n.y2 - (n.y ?? 0)}" stroke="${esc(n.stroke ?? n.fill ?? theme.color.accent)}" stroke-width="4"/>`;
    case "arrow": {
      const col = esc(n.stroke ?? n.fill ?? theme.color.accent);
      const mid = `arw${ctx.n++}`;
      ctx.defs.push(
        `<marker id="${mid}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${col}"/></marker>`,
      );
      return `<line${a} x1="0" y1="0" x2="${n.x2 - (n.x ?? 0)}" y2="${n.y2 - (n.y ?? 0)}" stroke="${col}" stroke-width="4" marker-end="url(#${mid})"/>`;
    }
    case "path": {
      // Paths default to a stroked shape (fill "none") unless a fill/gradient is given.
      const pathFill = n.gradient ? fill : n.fill && n.fill !== "none" ? esc(n.fill) : "none";
      const strokeAttr = n.stroke ? ` stroke="${esc(n.stroke)}" stroke-width="${n.strokeWidth ?? 3}"` : "";
      // draw-on: reveal the stroke 0..1. With `len` (path length) use an ABSOLUTE
      // dash → export-safe (resvg honors this); else pathLength="1" (browser-only).
      const draw = n.draw;
      const d01 = draw == null ? 1 : Math.max(0, Math.min(1, draw));
      const dash =
        d01 < 1
          ? n.len != null
            ? ` stroke-dasharray="${n.len}" stroke-dashoffset="${n.len * (1 - d01)}"`
            : ` pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - d01}"`
          : "";
      return `<path${a} d="${esc(n.d)}" fill="${pathFill}"${strokeAttr}${dash} stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    case "ring": {
      // Two full circles (outer + inner offset by innerDy) in one even-odd path
      // → exact ring/crescent. Local coords: outer centered at origin.
      const dy = n.innerDy ?? 0;
      const ro = n.rOuter;
      const ri = n.rInner;
      const circle = (cy: number, r: number): string =>
        `M ${-r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
      const d = `${circle(0, ro)} ${circle(dy, ri)}`;
      const strokeAttr = n.stroke ? ` stroke="${esc(n.stroke)}" stroke-width="2"` : "";
      return `<path${a} d="${d}" fill="${fill}" fill-rule="evenodd"${strokeAttr}/>`;
    }
    case "label":
      return `<text${a} font-family="${esc(theme.font.body)}" font-size="${n.size ?? 32}" fill="${fill}" font-weight="${n.weight ?? 500}" text-anchor="${n.anchor ?? "start"}" dominant-baseline="${n.baseline ?? "hanging"}">${esc(toPlain(n.text))}</text>`;
    case "group":
      return `<g${a}>${n.children.map((c) => drawNode(c, theme, ctx)).join("")}</g>`;
    default:
      return "";
  }
}

/** Inner SVG markup for a snapshot (no <svg> wrapper), incl. gradient/glow defs. Pure. */
export function snapshotToSvgInner(snap: SceneSnapshot, theme: Theme): string {
  const ctx: DefCtx = { defs: [], n: 0 };
  const body = snap.nodes.map((n) => drawNode(n, theme, ctx)).join("");
  return (ctx.defs.length ? `<defs>${ctx.defs.join("")}</defs>` : "") + body;
}

/** Full standalone SVG document string for a snapshot. Pure. */
export function snapshotToSvg(snap: SceneSnapshot, theme: Theme, size?: { width?: number; height?: number }): string {
  const vb = snap.viewBox;
  const width = size?.width ?? vb.w;
  const height = size?.height ?? vb.h;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBoxStr(vb)}">` +
    `<rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="${esc(theme.color.stage)}"/>` +
    snapshotToSvgInner(snap, theme) +
    `</svg>`
  );
}

/** A burned-in caption line: active word in accent, others in fg. Pure. */
export function captionSvg(
  caption: { words: { word: string }[]; active: number },
  theme: Theme,
  w: number,
  h: number,
): string {
  const fs = Math.round(h * 0.036);
  const bandH = Math.round(fs * 2.4);
  const y = h - Math.round(bandH * 0.55);
  const spans = caption.words
    .map((word, i) => `<tspan fill="${esc(i === caption.active ? theme.color.accent : theme.color.fg)}" font-weight="${i === caption.active ? 700 : 400}">${esc(word.word)} </tspan>`)
    .join("");
  return (
    `<rect x="0" y="${h - bandH}" width="${w}" height="${bandH}" fill="${esc(theme.color.captionScrim)}"/>` +
    `<text x="${w / 2}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="${esc(theme.font.body)}" font-size="${fs}">${spans}</text>`
  );
}

/** A complete exported frame: background + scene + optional burned caption. Pure. */
export function frameSvg(
  snap: SceneSnapshot,
  theme: Theme,
  caption?: { words: { word: string }[]; active: number } | null,
  size?: { width?: number; height?: number },
): string {
  const vb = snap.viewBox;
  const width = size?.width ?? vb.w;
  const height = size?.height ?? vb.h;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBoxStr(vb)}">` +
    `<rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="${esc(theme.color.stage)}"/>` +
    snapshotToSvgInner(snap, theme) +
    (caption ? captionSvg(caption, theme, vb.w, vb.h) : "") +
    `</svg>`
  );
}
