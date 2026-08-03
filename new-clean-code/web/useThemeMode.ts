import React from "react";
import type { ThemeMode } from "@lessonstudio/theme";

const KEY = "ls.theme.mode";

function prefersDark(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

function stored(): ThemeMode | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null; // private mode / disabled storage — a preference is a nicety, never a hard failure
  }
}

export interface ThemeModeControl {
  mode: ThemeMode;
  /** True while following the OS rather than an explicit choice. */
  system: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  /** Forget the explicit choice and follow the OS again. */
  clear: () => void;
}

/**
 * Dark/light as a learner preference.
 *
 * Follows `prefers-color-scheme` until the learner picks a side, then remembers that choice. The
 * distinction matters: while no choice has been made we keep *listening*, so a laptop that flips to
 * dark at sunset flips the lesson too; once they have chosen, the OS stops overriding them.
 *
 * Mode is deliberately separate from which template is in use, so the toggle works on every preset
 * instead of being one preset's feature.
 */
export function useThemeMode(): ThemeModeControl {
  const [explicit, setExplicit] = React.useState<ThemeMode | null>(() =>
    typeof window === "undefined" ? null : stored(),
  );
  const [osDark, setOsDark] = React.useState<boolean>(prefersDark);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent): void => setOsDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const mode: ThemeMode = explicit ?? (osDark ? "dark" : "light");

  const setMode = React.useCallback((next: ThemeMode) => {
    setExplicit(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* preference is best-effort */
    }
  }, []);

  const clear = React.useCallback(() => {
    setExplicit(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* preference is best-effort */
    }
  }, []);

  const toggle = React.useCallback(() => setMode(mode === "dark" ? "light" : "dark"), [mode, setMode]);

  return { mode, system: explicit === null, setMode, toggle, clear };
}
