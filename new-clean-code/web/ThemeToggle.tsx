import React from "react";
import { PRESETS, type Theme, type ThemeMode, type TemplatePreset } from "@lessonstudio/theme";

/**
 * The presentation controls, as ordinary components a host drops into `StudioView`'s `actions` slot.
 *
 * They live in `web/` rather than inside `StudioView` because the view stays prop-driven: it is
 * handed a theme and a layout and renders them. Which controls exist, and whether a learner gets
 * them at all, is the embedding app's call.
 */

function chipStyle(theme: Theme, on: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: theme.space(1),
    padding: `${theme.space(1)} ${theme.space(2)}`,
    fontFamily: theme.font.body,
    fontSize: theme.font.size.eyebrow,
    fontWeight: on ? theme.font.weight.semibold : theme.font.weight.medium,
    color: on ? theme.color.onAccent : theme.color.muted,
    background: on ? theme.color.accent : "transparent",
    border: `1px solid ${on ? theme.color.accent : theme.color.borderSubtle}`,
    borderRadius: theme.radius,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: theme.transition.fast,
  };
}

function SunIcon(): React.ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon(): React.ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M20.5 14.4A8.6 8.6 0 1 1 9.6 3.5a6.9 6.9 0 0 0 10.9 10.9Z" />
    </svg>
  );
}

export interface ThemeToggleProps {
  theme: Theme;
  mode: ThemeMode;
  onMode: (mode: ThemeMode) => void;
  /** Show the word next to the icon. Off → icon only, for tight bars. */
  label?: boolean;
}

/** One button that flips dark ⇄ light. The icon shows the mode you would GET, which is the convention. */
export function ThemeToggle({ theme, mode, onMode, label = true }: ThemeToggleProps): React.ReactElement {
  const next: ThemeMode = mode === "dark" ? "light" : "dark";
  const text = next === "dark" ? "Dark" : "Light";
  return (
    <button
      onClick={() => onMode(next)}
      title={`Switch to ${text.toLowerCase()} mode`}
      aria-label={`Switch to ${text.toLowerCase()} mode`}
      data-ls-theme-toggle={next}
      style={{ ...chipStyle(theme, false), padding: `${theme.space(1)} ${theme.space(2)}` }}
    >
      {next === "dark" ? <MoonIcon /> : <SunIcon />}
      {label ? text : null}
    </button>
  );
}

export interface TemplatePickerProps {
  theme: Theme;
  /** Currently selected preset id. */
  value: string;
  onChange: (id: string) => void;
  presets?: TemplatePreset[];
}

/**
 * Pick a template preset. This is the control that demonstrates the claim: the same running lesson
 * re-lays-out and re-paints, and nothing about the lesson changes.
 */
export function TemplatePicker({ theme, value, onChange, presets = PRESETS }: TemplatePickerProps): React.ReactElement {
  return (
    <div role="radiogroup" aria-label="Template" style={{ display: "flex", gap: theme.space(1) }}>
      {presets.map((p) => {
        const on = p.id === value;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.id)}
            title={p.blurb}
            data-ls-preset={p.id}
            style={chipStyle(theme, on)}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
