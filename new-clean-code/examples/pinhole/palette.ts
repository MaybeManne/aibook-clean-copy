// The lesson's symbol palette — ONE place where "u is amber, v is sky-blue" is decided.
//
// The reference explainer colour-coded every variable, in the figure AND in the prose: the `u`
// floating in the 3-D scene is the same amber as the `u` in `h' = h·v/u` two lines below it, so
// the eye can carry a symbol from the equation to the thing it measures without a legend. That
// only works if the two never drift, which is why the hexes live here and not inline: the viz
// imports them for its label sprites, and the lesson imports `tex()` for its KaTeX.
//
// Colour is authored content, not theming: it identifies a specific symbol in a specific lesson,
// so it belongs to the lesson bundle rather than to `Theme` (which owns the reusable roles —
// accent, surface, muted). A different lesson picks its own map.

export const SYMBOL_COLOR = {
  h: "#4ade80", // object height          (green)
  hp: "#f87171", // image height h′        (red)
  u: "#fbbf24", // object distance        (amber)
  v: "#38bdf8", // screen distance        (sky)
  m: "#c4b5fd", // magnification          (violet)
  Li: "#4ade80", // incoming radiance
  Lr: "#f87171", // reflected radiance
  rho: "#f9a8d4", // albedo
  Omega: "#38bdf8", // hemisphere of directions
  omega: "#fbbf24", // an incoming direction ω_i
  normal: "#c4b5fd", // surface normal n
} as const;

export type SymbolName = keyof typeof SYMBOL_COLOR;

/** How each symbol is written in TeX (the default body of `tex()`). */
const SYMBOL_TEX: Record<SymbolName, string> = {
  h: "h",
  hp: "h'",
  u: "u",
  v: "v",
  m: "m",
  Li: "L_i",
  Lr: "L_r",
  rho: "\\rho",
  Omega: "\\Omega",
  omega: "\\omega_i",
  normal: "\\mathbf{n}",
};

/**
 * A symbol as coloured TeX: `tex("u")` → `\textcolor{#fbbf24}{u}`. Pass `body` to colour a
 * larger expression with a symbol's hue (e.g. `tex("m", "-\\frac{v}{u}")`). KaTeX handles
 * `\textcolor` natively, so this needs no renderer support and stays inside the authored string.
 */
export function tex(sym: SymbolName, body: string = SYMBOL_TEX[sym]): string {
  return `\\textcolor{${SYMBOL_COLOR[sym]}}{${body}}`;
}
