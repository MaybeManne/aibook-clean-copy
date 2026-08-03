/**
 * The NAMED figure palette — Manim's colours plus the studio's own accents.
 *
 * These hexes are the canonical values a figure author names (`palette.blue`), and they are baked
 * into `SceneNode.fill` at authoring time, long before a theme exists. A theme may therefore
 * *re-map* them: `Theme.figure.palette` holds per-theme overrides keyed by the SAME role names, and
 * `svg/` resolves every fill through `PALETTE_BY_HEX` on the way out. So `palette.white` is "the
 * brightest ink in this palette" rather than literally `#ffffff`, and a paper theme can turn it into
 * near-black without re-authoring a single figure.
 *
 * The escape hatch is the absence of a name: a fill that is not one of these hexes is never
 * re-mapped. Reach for a literal when you mean a literal.
 *
 * Lives here rather than in `figures/` because the theme owns colour; `figures/palette.ts`
 * re-exports it, so `import { palette } from "@lessonstudio/figures"` keeps working.
 */
export const palette = {
  blue: "#58c4dd",
  teal: "#5cd0b3",
  green: "#83c167",
  yellow: "#ffff00",
  gold: "#f0ac5f",
  red: "#fc6255",
  purple: "#9a72ac",
  pink: "#d147bd",
  white: "#ffffff",
  lightGray: "#bbbbbb",
  gray: "#888888",
  darkGray: "#444444",
  indigo: "#818cf8",
  violet: "#6366f1",
  lavender: "#c4b5fd",
  emerald: "#34d399",
  amber: "#f59e0b",
  /**
   * Text drawn ON TOP of a filled mark — the number inside a coloured box, not a mark itself.
   *
   * It exists as a NAMED role rather than a literal so that content authored at module scope (a
   * `Storyboard` built once at import, before any theme exists) still inverts correctly: dark themes
   * fill marks with bright colour and need dark glyphs, light themes do the reverse. `Theme.figure`
   * exposes the same value as `onMark` for figures that hold the theme directly.
   */
  onMark: "#0b0e1a",
} as const;

export type PaletteColor = keyof typeof palette;

/** Reverse index, hex → role name, so a baked fill can be recognised and re-mapped. */
export const PALETTE_BY_HEX: ReadonlyMap<string, PaletteColor> = new Map(
  (Object.entries(palette) as [PaletteColor, string][]).map(([name, hex]) => [hex.toLowerCase(), name]),
);

/**
 * Roles that are STRUCTURE rather than content — hairlines, inert/empty fills, the ground a mark
 * sits on. They are *meant* to recede, so the contrast audit holds them to "visible at all" rather
 * than to a legibility ratio. Everything else in the palette is a data mark or ink.
 */
export const STRUCTURAL_ROLES: readonly PaletteColor[] = ["darkGray", "gray"];

/**
 * Roles that are never painted against the stage, so measuring them there is meaningless. `onMark`
 * only ever sits on a filled mark; the audit checks it against those fills instead.
 */
export const ON_MARK_ROLES: readonly PaletteColor[] = ["onMark"];
