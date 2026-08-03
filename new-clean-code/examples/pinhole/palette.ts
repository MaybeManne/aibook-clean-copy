import type { ThemeMode } from "@lessonstudio/theme";

/**
 * The lesson's symbol→colour key: `v` is the same blue in the diagram and in the equation, by
 * construction rather than by an author's discipline.
 *
 * This colour belongs to the LESSON, not to the theme — it encodes authored meaning ("which symbol
 * is this"), so a template cannot be allowed to reassign it. But it does have to survive a dark/light
 * switch, and the authored TeX strings in `lesson.ts` are built at module load, long before any theme
 * exists. So each symbol carries two hues and `tex()` emits a CLASS rather than a baked hex; the host
 * publishes the right set as CSS via `StudioView`'s `symbolColors`. See `web/richtext.tsx` for the
 * narrow KaTeX `trust` predicate that permits exactly this one command.
 *
 * Both sets are held to ≥4.5:1 against their own ground by `checks/theme.ts`.
 */
const DARK = {
  h: "#4ade80",
  hp: "#f87171",
  u: "#fbbf24",
  v: "#38bdf8",
  m: "#c4b5fd",
  Li: "#4ade80",
  Lr: "#f87171",
  rho: "#f9a8d4",
  Omega: "#38bdf8",
  omega: "#fbbf24",
  normal: "#c4b5fd",
} as const;

/** The same hues pulled down in luminance so they read as ink on paper rather than glow on black. */
const LIGHT: Record<keyof typeof DARK, string> = {
  h: "#15803d",
  hp: "#b91c1c",
  u: "#8a5a00",
  v: "#0369a1",
  m: "#6d28d9",
  Li: "#15803d",
  Lr: "#b91c1c",
  rho: "#a21caf",
  Omega: "#0369a1",
  omega: "#8a5a00",
  normal: "#6d28d9",
};

export type SymbolName = keyof typeof DARK;

/** The symbol key for a mode — hand this to `StudioView`'s `symbolColors`. */
export function symbolColors(mode: ThemeMode): Record<string, string> {
  return { ...(mode === "dark" ? DARK : LIGHT) };
}

/** The dark set, for consumers that need a concrete hex (the three.js apparatus). */
export const SYMBOL_COLOR = DARK;

/** Both sets, for the contrast check. */
export const SYMBOL_SETS: Record<ThemeMode, Record<string, string>> = { dark: { ...DARK }, light: LIGHT };

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
 * A symbol as class-tagged TeX: `tex("u")` → `\htmlClass{ls-sym-u}{u}`. Pass `body` to tag a larger
 * expression with a symbol's identity (e.g. `tex("m", "-\\frac{v}{u}")`).
 *
 * Emits a class, not `\textcolor{#hex}`, so the hue arrives from CSS and follows the mode. (KaTeX
 * rejects `\textcolor{var(--x)}` outright — verified — which is why this is a class.)
 */
export function tex(sym: SymbolName, body: string = SYMBOL_TEX[sym]): string {
  return `\\htmlClass{ls-sym-${sym}}{${body}}`;
}
