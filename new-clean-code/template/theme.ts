// Design tokens consumed by components. Reskinning = swap this object only.
// Pure data — no CSS, no React. A video renderer reads the same tokens.

export interface Theme {
  color: {
    bg: string;
    fg: string;
    muted: string;
    alert: string;
    accent: string;
    accentSoft: string; // translucent accent (glows, active fills)
    accentLight: string; // lighter accent (gradients, hover)
    correct: string;
    wrong: string;
    success: string; // semantic aliases (== correct/wrong/alert by default)
    warning: string;
    error: string;
    choiceBg: string;
    choiceBorder: string;
    stage: string; // the visualization surface (distinct from bg and choiceBg)
    stageBorder: string;
    captionScrim: string; // backdrop behind subtitles
    surface: string; // translucent chrome bg (problem bar, control bar)
    borderSubtle: string; // hairline dividers
    cardBg: string; // transcript card background
    cardBgActive: string; // active/answer card tint
    scrollbar: string; // scrollbar thumb
    subtitleBg: string; // subtitle pill background
  };
  radius: string;
  space: (n: number) => string;
  shadow: string;
  transition: { card: string; fast: string };
  font: {
    body: string;
    mono: string;
    size: { caption: number; body: number; heading: number; display: number; eyebrow: number; label: number; article: number };
    weight: { normal: number; medium: number; semibold: number; bold: number };
    letterSpacing: string; // tracking for uppercase eyebrow/labels
    lineHeight: number; // relaxed body line-height
    measure: string; // max reading width for the explainer article column
  };
}

export const defaultTheme: Theme = {
  color: {
    bg: "#0b0e1a",
    fg: "#eef0ff",
    muted: "#9aa0bf",
    alert: "#f59e0b",
    accent: "#818cf8",
    accentSoft: "rgba(129,140,248,0.16)",
    accentLight: "#c4b5fd",
    correct: "#34d399",
    wrong: "#f87171",
    success: "#34d399",
    warning: "#f59e0b",
    error: "#f87171",
    choiceBg: "#161b30",
    choiceBorder: "#2a3155",
    stage: "#12162a",
    stageBorder: "#242a44",
    captionScrim: "rgba(8,10,20,0.72)",
    surface: "rgba(15,17,30,0.82)",
    borderSubtle: "rgba(255,255,255,0.07)",
    cardBg: "rgba(255,255,255,0.025)",
    cardBgActive: "rgba(129,140,248,0.07)",
    scrollbar: "rgba(129,140,248,0.35)",
    subtitleBg: "rgba(6,8,16,0.78)",
  },
  radius: "12px",
  space: (n) => `${n * 4}px`,
  shadow: "0 10px 40px rgba(0,0,0,0.45)",
  transition: { card: "opacity .35s ease, border-color .35s ease, background .35s ease", fast: "all .2s ease" },
  font: {
    body: '"SF Pro Display", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
    size: { caption: 19, body: 16, heading: 24, display: 40, eyebrow: 12, label: 13, article: 17 },
    weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    letterSpacing: "0.14em",
    lineHeight: 1.7,
    measure: "62ch",
  },
};
