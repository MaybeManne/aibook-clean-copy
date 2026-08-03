import { sampleAt, validateBindings, type Storyboard } from "@lessonstudio/timeline";
import type { Theme } from "@lessonstudio/theme";
import { registerFigure, snapshotToSvgInner, type SvgFigure } from "./svg.js";

/**
 * The name a director asks for to get a brand-new figure without registering code.
 *
 * `explorable` resolves its `viz.name` in a registry, which is why an agent could never build an
 * INTERACTIVE demo: the registry holds functions, and a director may not author a function. This
 * one entry closes that gap by being the one figure whose behaviour is entirely in its props — the
 * storyboard is the program, the bindings are its inputs, and both are JSON that replays.
 */
export const DECLARATIVE_FIGURE = "declarative";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function note(message: string, theme: Theme): string {
  return (
    `<div style="color:${esc(theme.color.muted)};font-family:${esc(theme.font.mono)};font-size:13px;` +
    `padding:12px;border:1px dashed ${esc(theme.color.muted)};border-radius:8px">${esc(message)}</div>`
  );
}

/**
 * Render `props.storyboard` with every binding resolved against the REST of `props`.
 *
 * That split is the whole trick and it needs no cooperation from `explorable`: the beat already
 * merges its control values into the viz props, so `{$ref:"hole"}` inside the storyboard and the
 * `hole` slider's live value arrive in the same object. Drag the slider, the props change, the
 * figure re-renders — a reactive demo out of data alone.
 *
 * Bad input reports itself rather than drawing nothing: a director that mistypes an op or refers to
 * a control it did not declare sees the problem on the stage, in the same place the answer went.
 */
export const declarativeFigure: SvgFigure = (props, t, theme) => {
  const sb = props.storyboard as Storyboard | undefined;
  if (!sb || typeof sb !== "object" || Array.isArray(sb)) {
    return note(`[${DECLARATIVE_FIGURE}: no storyboard prop — pass viz.props.storyboard]`, theme);
  }
  const problems = validateBindings(sb);
  if (problems.length) {
    const worst = problems.slice(0, 3).map((p) => `${p.path || "(root)"}: ${p.detail}`);
    return note(`[${DECLARATIVE_FIGURE}: ${problems.length} binding problem(s)] ${worst.join(" · ")}`, theme);
  }

  const snap = sampleAt(sb, t, props);
  const { x, y, w, h } = snap.viewBox;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="100%" ` +
    `style="max-width:${w}px" font-family="${esc(theme.font.body)}">` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${esc(theme.color.stage)}"/>` +
    snapshotToSvgInner(snap, theme) +
    `</svg>`
  );
};

registerFigure(DECLARATIVE_FIGURE, declarativeFigure);
