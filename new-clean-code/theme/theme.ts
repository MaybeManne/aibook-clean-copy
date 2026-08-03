import type { PaletteColor } from "./palette.js";

export type ThemeMode = "dark" | "light";

/**
 * How the studio shell renders, as DATA rather than as a per-theme fork in the components.
 *
 * These are the switches that make a template read as a different *kind* of thing rather than the
 * same app in different paint. `turns: "flat"` plus `eyebrow: "numbered"` turns the conversation log
 * from a chat transcript into a numbered essay; that is the whole difference between the `studio` and
 * `paper` presets in the reading column.
 *
 * Deliberately three switches, not a component-override system — a template that needs different
 * *components* still goes through `defaultComponents` in `web/`.
 */
export interface ThemeChrome {
  /** `bubbles`: learner turns right-aligned in a rounded card (chat). `flat`: every turn a plain block in one column (prose). */
  turns: "bubbles" | "flat";
  /** `uppercase`: letter-spaced role label. `numbered`: "1 · SETUP" section numbering. */
  eyebrow: "uppercase" | "numbered";
  /** Draw the stage's border/panel chrome. False → the figure floats on the page. */
  stageFrame: boolean;
}

/**
 * Semantic colour roles a FIGURE reads, so a figure names meaning instead of a hex.
 *
 * `registerFigure` callbacks already receive the theme as their third argument, so a figure that
 * reads these works on paper and at night with no branching. `palette` re-maps the named palette
 * (see `./palette.ts`) for fills that were baked in at authoring time.
 */
export interface ThemeFigure {
  /** Primary figure text: titles, values, labels that carry meaning. */
  ink: string;
  /** Secondary figure text: units, indices, annotations. */
  muted: string;
  /** Hairlines: axes, baselines, grid. Meant to recede. */
  axis: string;
  /** The "look here" colour: rings, active products, the value being built. */
  highlight: string;
  /**
   * Text drawn on top of a filled mark (the number inside a coloured box). Must contrast with
   * `series` and `highlight`, NOT with the stage. Mirrors `palette.onMark` for this theme.
   */
  onMark: string;
  /** Categorical series, in order. Figures index into this rather than naming colours. */
  series: string[];
  /** Per-theme override of the named palette, keyed by role name. Absent role → the canonical hex. */
  palette: Partial<Record<PaletteColor, string>>;
}

export interface Theme {
  /** Stable identity, e.g. "studio-dark" — surfaces as `data-ls-theme` and in check failures. */
  name: string;
  mode: ThemeMode;
  color: {
    bg: string;
    fg: string;
    muted: string;
    alert: string;
    accent: string;
    accentSoft: string;
    accentLight: string;
    /** Text/icon ON an accent fill. NOT `bg` — that only works when bg is near-black. */
    onAccent: string;
    correct: string;
    wrong: string;
    success: string;
    warning: string;
    error: string;
    choiceBg: string;
    choiceBorder: string;
    stage: string;
    stageBorder: string;
    captionScrim: string;
    surface: string;
    borderSubtle: string;
    cardBg: string;
    cardBgActive: string;
    scrollbar: string;
    subtitleBg: string;
    /** Halo behind text drawn over arbitrary figure content (annotations), so it stays readable. */
    textHalo: string;
    /** `:focus-visible` ring. */
    focusRing: string;
    calloutBg: string;
    callout: { note: string; warning: string; tip: string };
  };
  chrome: ThemeChrome;
  figure: ThemeFigure;
  radius: string;
  space: (n: number) => string;
  shadow: string;
  transition: { card: string; fast: string };
  font: {
    body: string;
    mono: string;
    size: { caption: number; body: number; heading: number; display: number; eyebrow: number; label: number; article: number };
    weight: { normal: number; medium: number; semibold: number; bold: number };
    letterSpacing: string;
    lineHeight: number;
    measure: string;
  };
}

const SANS = '"SF Pro Display", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
/** A book face with real italics, falling back through what ships on each platform. */
const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif';

const space = (n: number): string => `${n * 4}px`;

const SANS_FONT: Theme["font"] = {
  body: SANS,
  mono: MONO,
  size: { caption: 19, body: 16, heading: 24, display: 40, eyebrow: 12, label: 13, article: 17 },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  letterSpacing: "0.14em",
  lineHeight: 1.7,
  measure: "62ch",
};

/* ------------------------------------------------------------------ studio: the split-screen app */

export const studioDark: Theme = {
  name: "studio-dark",
  mode: "dark",
  color: {
    bg: "#0a0d18",
    fg: "#eef1ff",
    muted: "#a2a9c9",
    alert: "#fbbf24",
    accent: "#818cf8",
    accentSoft: "rgba(129,140,248,0.16)",
    accentLight: "#c4b5fd",
    onAccent: "#0a0d18",
    correct: "#34d399",
    wrong: "#f87171",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    choiceBg: "#161b30",
    choiceBorder: "#2f3760",
    stage: "#111524",
    stageBorder: "#242a44",
    captionScrim: "rgba(8,10,20,0.72)",
    surface: "rgba(15,17,30,0.82)",
    borderSubtle: "rgba(190,200,255,0.12)",
    cardBg: "rgba(190,200,255,0.04)",
    cardBgActive: "rgba(129,140,248,0.10)",
    scrollbar: "rgba(129,140,248,0.35)",
    subtitleBg: "rgba(6,8,16,0.78)",
    textHalo: "rgba(4,6,14,0.72)",
    focusRing: "#a5b4fc",
    calloutBg: "rgba(190,200,255,0.05)",
    callout: { note: "#818cf8", warning: "#fbbf24", tip: "#34d399" },
  },
  chrome: { turns: "bubbles", eyebrow: "uppercase", stageFrame: true },
  figure: {
    ink: "#e8ebff",
    muted: "#8f97b8",
    axis: "#3a4265",
    highlight: "#fbbf24",
    onMark: "#0b0e1a",
    series: ["#818cf8", "#f472b6", "#34d399", "#38bdf8", "#fbbf24"],
    // No overrides: the canonical palette was tuned for exactly this ground.
    palette: {},
  },
  radius: "12px",
  space,
  shadow: "0 10px 40px rgba(0,0,0,0.45)",
  transition: { card: "opacity .35s ease, border-color .35s ease, background .35s ease", fast: "all .2s ease" },
  font: SANS_FONT,
};

export const studioLight: Theme = {
  name: "studio-light",
  mode: "light",
  color: {
    bg: "#f7f8fc",
    fg: "#10131f",
    muted: "#565d78",
    alert: "#a16207",
    accent: "#4f46e5",
    accentSoft: "rgba(79,70,229,0.12)",
    accentLight: "#4338ca",
    onAccent: "#ffffff",
    correct: "#047857",
    wrong: "#b91c1c",
    success: "#047857",
    warning: "#a16207",
    error: "#b91c1c",
    choiceBg: "#ffffff",
    choiceBorder: "#c8cee0",
    stage: "#ffffff",
    stageBorder: "#dfe3ef",
    captionScrim: "rgba(255,255,255,0.82)",
    surface: "rgba(255,255,255,0.86)",
    borderSubtle: "rgba(16,19,31,0.12)",
    cardBg: "rgba(16,19,31,0.035)",
    cardBgActive: "rgba(79,70,229,0.08)",
    scrollbar: "rgba(79,70,229,0.32)",
    subtitleBg: "rgba(255,255,255,0.9)",
    textHalo: "rgba(255,255,255,0.85)",
    focusRing: "#4f46e5",
    calloutBg: "rgba(16,19,31,0.04)",
    callout: { note: "#4f46e5", warning: "#a16207", tip: "#047857" },
  },
  chrome: { turns: "bubbles", eyebrow: "uppercase", stageFrame: true },
  figure: {
    ink: "#10131f",
    muted: "#5b6178",
    axis: "#c3c9d9",
    highlight: "#b45309",
    onMark: "#ffffff",
    series: ["#4f46e5", "#be185d", "#047857", "#0369a1", "#b45309"],
    palette: {
      blue: "#0369a1",
      teal: "#0f766e",
      green: "#15803d",
      yellow: "#a16207",
      gold: "#b45309",
      red: "#b91c1c",
      purple: "#6d28d9",
      pink: "#a21caf",
      white: "#10131f",
      lightGray: "#4b5563",
      gray: "#6b7280",
      // The inert/empty-box fill: recessive, but it still has to read as a box on white.
      darkGray: "#ccd2e0",
      indigo: "#4f46e5",
      violet: "#4338ca",
      lavender: "#7c3aed",
      emerald: "#047857",
      amber: "#a16207",
      onMark: "#ffffff",
    },
  },
  radius: "12px",
  space,
  shadow: "0 8px 30px rgba(16,19,31,0.10)",
  transition: { card: "opacity .35s ease, border-color .35s ease, background .35s ease", fast: "all .2s ease" },
  font: SANS_FONT,
};

/* ----------------------------------------------- paper: one column, serif, reads like a textbook */

const SERIF_FONT: Theme["font"] = {
  body: SERIF,
  mono: MONO,
  // Larger article size and a longer measure: this template is for reading, not for scanning a UI.
  size: { caption: 20, body: 17, heading: 30, display: 44, eyebrow: 11, label: 13, article: 19 },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  letterSpacing: "0.18em",
  lineHeight: 1.75,
  measure: "68ch",
};

const PAPER_CHROME: ThemeChrome = { turns: "flat", eyebrow: "numbered", stageFrame: false };

export const paperLight: Theme = {
  name: "paper-light",
  mode: "light",
  color: {
    bg: "#faf7f2",
    fg: "#1f1b16",
    muted: "#6b6156",
    alert: "#92400e",
    accent: "#9a3412",
    accentSoft: "rgba(154,52,18,0.10)",
    accentLight: "#7c2d12",
    onAccent: "#fdfbf7",
    correct: "#15803d",
    wrong: "#b3261e",
    success: "#15803d",
    warning: "#92400e",
    error: "#b3261e",
    choiceBg: "#fffdf9",
    choiceBorder: "#ddd3c2",
    stage: "#fffdf9",
    stageBorder: "#e7ded0",
    captionScrim: "rgba(250,247,242,0.85)",
    surface: "rgba(250,247,242,0.92)",
    borderSubtle: "rgba(31,27,22,0.14)",
    cardBg: "rgba(31,27,22,0.03)",
    cardBgActive: "rgba(154,52,18,0.06)",
    scrollbar: "rgba(154,52,18,0.28)",
    subtitleBg: "rgba(250,247,242,0.92)",
    textHalo: "rgba(255,253,249,0.88)",
    focusRing: "#9a3412",
    calloutBg: "rgba(31,27,22,0.035)",
    callout: { note: "#9a3412", warning: "#92400e", tip: "#15803d" },
  },
  chrome: PAPER_CHROME,
  figure: {
    ink: "#1f1b16",
    muted: "#6b6156",
    axis: "#d6cfc2",
    highlight: "#92400e",
    onMark: "#fffdf9",
    series: ["#3730a3", "#9d174d", "#166534", "#155e75", "#92400e"],
    palette: {
      blue: "#155e75",
      teal: "#0f766e",
      green: "#166534",
      yellow: "#92400e",
      gold: "#a1521a",
      red: "#9d174d",
      purple: "#5b21b6",
      pink: "#86198f",
      white: "#1f1b16",
      lightGray: "#57534e",
      gray: "#78716c",
      darkGray: "#ddd6c9",
      indigo: "#3730a3",
      violet: "#3730a3",
      lavender: "#6d28d9",
      emerald: "#166534",
      amber: "#92400e",
      onMark: "#fffdf9",
    },
  },
  radius: "3px",
  space,
  shadow: "none",
  transition: { card: "opacity .35s ease, border-color .35s ease", fast: "all .2s ease" },
  font: SERIF_FONT,
};

export const paperDark: Theme = {
  name: "paper-dark",
  mode: "dark",
  color: {
    bg: "#181511",
    fg: "#ece5da",
    muted: "#a89b8c",
    alert: "#fcd34d",
    accent: "#e0a066",
    accentSoft: "rgba(224,160,102,0.14)",
    accentLight: "#f0c39a",
    onAccent: "#181511",
    correct: "#6ee7b7",
    wrong: "#fca5a5",
    success: "#6ee7b7",
    warning: "#fcd34d",
    error: "#fca5a5",
    choiceBg: "#211d18",
    choiceBorder: "#3d362d",
    stage: "#201c17",
    stageBorder: "#332c24",
    captionScrim: "rgba(16,14,11,0.75)",
    surface: "rgba(24,21,17,0.88)",
    borderSubtle: "rgba(236,229,218,0.14)",
    cardBg: "rgba(236,229,218,0.04)",
    cardBgActive: "rgba(224,160,102,0.09)",
    scrollbar: "rgba(224,160,102,0.32)",
    subtitleBg: "rgba(12,10,8,0.8)",
    textHalo: "rgba(12,10,8,0.72)",
    focusRing: "#e0a066",
    calloutBg: "rgba(236,229,218,0.05)",
    callout: { note: "#e0a066", warning: "#fcd34d", tip: "#6ee7b7" },
  },
  chrome: PAPER_CHROME,
  figure: {
    ink: "#ece5da",
    muted: "#a89b8c",
    axis: "#463d32",
    highlight: "#fcd34d",
    onMark: "#181511",
    series: ["#e0a066", "#f0abfc", "#6ee7b7", "#7dd3fc", "#fcd34d"],
    palette: {
      blue: "#7dd3fc",
      teal: "#5eead4",
      green: "#86efac",
      yellow: "#fcd34d",
      gold: "#e0a066",
      red: "#fca5a5",
      purple: "#c4b5fd",
      pink: "#f0abfc",
      white: "#ece5da",
      lightGray: "#c4b8a8",
      gray: "#a89b8c",
      darkGray: "#3d362d",
      indigo: "#e0a066",
      violet: "#c4b5fd",
      lavender: "#ddd0f5",
      emerald: "#6ee7b7",
      amber: "#fcd34d",
      onMark: "#181511",
    },
  },
  radius: "3px",
  space,
  shadow: "none",
  transition: { card: "opacity .35s ease, border-color .35s ease", fast: "all .2s ease" },
  font: SERIF_FONT,
};

/** The shipped default: the studio shell at night, which is what every example opened with before. */
export const defaultTheme: Theme = studioDark;

/** All four shipped themes, for anything that must iterate every theme (the contrast check). */
export const ALL_THEMES: Theme[] = [studioDark, studioLight, paperDark, paperLight];
