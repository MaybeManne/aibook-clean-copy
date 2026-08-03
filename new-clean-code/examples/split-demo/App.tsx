import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonstudio/lesson";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView, TemplatePicker, ThemeToggle, useThemeMode } from "@lessonstudio/web";
import { PRESETS, resolvePreset, type StudioLayout, type Theme } from "@lessonstudio/theme";
import { lesson } from "./lesson.js";

/**
 * The template demo.
 *
 * One lesson, four presentations. `lesson.ts` is never touched by anything on this page: the preset
 * picker swaps a `{ layout, theme }` pair and the mode toggle picks which of the preset's two themes
 * to use. Everything else — beats, goals, the convolution figures, the recorded history — is
 * identical across all four, which is the whole claim.
 *
 * The layout select exists because geometry is separately addressable from the preset: a preset
 * ships a default `StudioLayout`, and a host can still override the ratio or the side. It is a
 * select rather than a row of buttons so the demo's own controls stay out of the lesson's way —
 * three template affordances belong in the header bar, not floating over the reading column.
 */
const LAYOUT_OVERRIDES: { id: string; label: string; layout: StudioLayout | null }[] = [
  { id: "preset", label: "Preset default", layout: null },
  { id: "right60", label: "Visuals right · 60%", layout: { split: true, stageBasis: "60%", stageSide: "right" } },
  { id: "single", label: "Force single column", layout: { split: false, stageBasis: "0", stageSide: "left" } },
];

/**
 * The layout override, as one control. `color-scheme` is published to the document by StudioView,
 * so the native dropdown this opens follows the mode along with everything else.
 */
function LayoutPicker({ theme, value, onChange }: { theme: Theme; value: string; onChange: (id: string) => void }): React.ReactElement {
  return (
    <select
      aria-label="Stage layout"
      title="Stage layout — geometry is addressable separately from the preset"
      data-ls-layout-pick
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: `${theme.space(1)} ${theme.space(2)}`,
        fontFamily: theme.font.body,
        fontSize: theme.font.size.eyebrow,
        color: value === "preset" ? theme.color.muted : theme.color.fg,
        background: theme.color.surface,
        border: `1px solid ${value === "preset" ? theme.color.borderSubtle : theme.color.accent}`,
        borderRadius: theme.radius,
        cursor: "pointer",
      }}
    >
      {LAYOUT_OVERRIDES.map((l) => (
        <option key={l.id} value={l.id}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

function App(): React.ReactElement {
  const program = React.useMemo(() => createLiveProgram(createSession(lesson)), []);
  React.useEffect(() => () => program.dispose(), [program]);

  const { mode, setMode } = useThemeMode();
  const [presetId, setPresetId] = React.useState(PRESETS[0]!.id);
  const [layoutId, setLayoutId] = React.useState("preset");

  const { theme, layout: presetLayout, preset } = resolvePreset(presetId, mode);
  const override = LAYOUT_OVERRIDES.find((l) => l.id === layoutId)?.layout ?? null;
  const layout = override ?? presetLayout;

  return (
    <StudioView
      program={program}
      theme={theme}
      layout={layout}
      eyebrow={`lessonStudio · ${preset.label.toLowerCase()} · ${mode}`}
      placeholder="Ask a question…"
      actions={
        <>
          <TemplatePicker theme={theme} value={presetId} onChange={setPresetId} />
          <LayoutPicker theme={theme} value={layoutId} onChange={setLayoutId} />
          <ThemeToggle theme={theme} mode={mode} onMode={setMode} />
        </>
      }
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
