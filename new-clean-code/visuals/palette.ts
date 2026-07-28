// The 3Blue1Brown-ish palette (ported from SocraticAI MX.C), plus the engine accents.
// Plain hex so the pure color-lerp in sampleAt works and figures read consistently.
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
  indigo: "#818cf8", // default stroke
  violet: "#6366f1",
  lavender: "#c4b5fd",
  emerald: "#34d399",
  amber: "#f59e0b", // default emphasis / indicate
} as const;

export type PaletteColor = keyof typeof palette;
