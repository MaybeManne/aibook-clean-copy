// Design tokens consumed by components. Reskinning = swap this object only.
// Pure data — no CSS, no React. A video renderer reads the same tokens.

export interface Theme {
  color: {
    bg: string;
    fg: string;
    muted: string;
    alert: string;
    accent: string;
    correct: string;
    wrong: string;
    choiceBg: string;
    choiceBorder: string;
  };
  radius: string;
  space: (n: number) => string;
  font: { body: string; mono: string };
}

export const defaultTheme: Theme = {
  color: {
    bg: "#0f1221",
    fg: "#e8eaff",
    muted: "#9aa0bf",
    alert: "#ffb454",
    accent: "#6ea8fe",
    correct: "#3fb950",
    wrong: "#f85149",
    choiceBg: "#1a1f38",
    choiceBorder: "#2a3155",
  },
  radius: "10px",
  space: (n) => `${n * 4}px`,
  font: {
    body: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};
