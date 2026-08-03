import { toPlain } from "@lessonstudio/intents";
import type { SceneNode, SceneSnapshot } from "@lessonstudio/timeline";
import { PALETTE_BY_HEX, type Theme } from "@lessonstudio/theme";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Resolve one authored colour against the theme.
 *
 * A `SceneNode`'s fill is baked in at authoring time — `palette.yellow` is already `#ffff00` by the
 * time a snapshot reaches here — so a light theme cannot recolour a figure by supplying tokens. It
 * recognises the colour instead: if the hex is one of the NAMED palette roles and the theme overrides
 * that role, the override wins.
 *
 * The escape hatch is the absence of a name. An off-palette literal is returned untouched, so an
 * author who means exactly `#ff0055` gets exactly that in every theme.
 */
function themed(color: string, theme: Theme): string {
  const role = PALETTE_BY_HEX.get(color.trim().toLowerCase());
  return (role && theme.figure.palette[role]) || color;
}

/** `themed` + XML-escape, which is what every attribute site actually needs. */
function paint(color: string, theme: Theme): string {
  return esc(themed(color, theme));
}

export type SvgFigure = (props: Record<string, unknown>, t: number, theme: Theme) => string;
const figures = new Map<string, SvgFigure>();

/** Register a custom SVG figure (browser + export). */
export function registerFigure(name: string, fn: SvgFigure): void {
  figures.set(name, fn);
}
export function getFigure(name: string): SvgFigure | undefined {
  return figures.get(name);
}

export interface SceneFigureOpts {
  viewBox: { x: number; y: number; w: number; h: number };
  maxWidth?: number;
  background?: boolean;
}
/**
 * `theme` is passed so a builder can reach the semantic figure roles (`theme.figure.highlight`,
 * `onMark`, …) for decisions the named palette cannot express — chiefly "which cell is active".
 * Builders that only name palette colours can ignore it; those are re-mapped downstream anyway.
 */
type NodeBuilder = (props: Record<string, unknown>, t: number, theme: Theme) => SceneNode[];

export function sceneFigure(build: NodeBuilder, opts: SceneFigureOpts): SvgFigure {
  const { x, y, w, h } = opts.viewBox;
  const maxW = opts.maxWidth ?? w;
  return (props, t, theme) => {
    const snap: SceneSnapshot = { nodes: build(props, t, theme), viewBox: { x, y, w, h } };
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

interface DefCtx {
  defs: string[];
  n: number;
}

function attrs(n: SceneNode, theme: Theme, ctx: DefCtx): string {
  const t = transform(n);
  const op = n.opacity ?? 1;
  let filter = "";
  if (n.glow && n.glow > 0) {
    const id = `glow${ctx.n++}`;
    // A glow is the node's own colour bloomed outward; with no fill, the theme's accent.
    const flood = paint(n.fill ?? theme.color.accent, theme);
    ctx.defs.push(
      `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${n.glow}" flood-color="${flood}" flood-opacity="0.9"/></filter>`,
    );
    filter = ` filter="url(#${id})"`;
  }
  return `${op !== 1 ? ` opacity="${op}"` : ""}${t ? ` transform="${t}"` : ""}${filter}`;
}

function fillOf(n: SceneNode, theme: Theme, ctx: DefCtx): string {
  if (n.gradient) {
    const id = `grad${ctx.n++}`;
    const { from, to, radial } = n.gradient;
    const a = paint(from, theme);
    const b = paint(to, theme);
    ctx.defs.push(
      radial
        ? `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></radialGradient>`
        : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient>`,
    );
    return `url(#${id})`;
  }
  return paint(n.fill ?? theme.color.accent, theme);
}

function drawNode(n: SceneNode, theme: Theme, ctx: DefCtx): string {
  const fill = fillOf(n, theme, ctx);
  const a = attrs(n, theme, ctx);
  switch (n.kind) {
    case "rect":
      return `<rect${a} width="${n.w}" height="${n.h}" rx="6" fill="${fill}"/>`;
    case "circle": {
      const noFill = n.fill === "none";
      const strokeAttr = n.stroke ? ` stroke="${paint(n.stroke, theme)}" stroke-width="${n.strokeWidth ?? 2}"` : "";
      return `<circle${a} r="${n.r}" fill="${noFill ? "none" : fill}"${strokeAttr}/>`;
    }
    case "line":
      return `<line${a} x1="0" y1="0" x2="${n.x2 - (n.x ?? 0)}" y2="${n.y2 - (n.y ?? 0)}" stroke="${paint(n.stroke ?? n.fill ?? theme.color.accent, theme)}" stroke-width="4"/>`;
    case "arrow": {
      const col = paint(n.stroke ?? n.fill ?? theme.color.accent, theme);
      const mid = `arw${ctx.n++}`;
      ctx.defs.push(
        `<marker id="${mid}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${col}"/></marker>`,
      );
      return `<line${a} x1="0" y1="0" x2="${n.x2 - (n.x ?? 0)}" y2="${n.y2 - (n.y ?? 0)}" stroke="${col}" stroke-width="4" marker-end="url(#${mid})"/>`;
    }
    case "path": {
      const pathFill = n.gradient ? fill : n.fill && n.fill !== "none" ? paint(n.fill, theme) : "none";
      const strokeAttr = n.stroke ? ` stroke="${paint(n.stroke, theme)}" stroke-width="${n.strokeWidth ?? 3}"` : "";
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
      const dy = n.innerDy ?? 0;
      const ro = n.rOuter;
      const ri = n.rInner;
      const circle = (cy: number, r: number): string =>
        `M ${-r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
      const d = `${circle(0, ro)} ${circle(dy, ri)}`;
      const strokeAttr = n.stroke ? ` stroke="${paint(n.stroke, theme)}" stroke-width="2"` : "";
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
