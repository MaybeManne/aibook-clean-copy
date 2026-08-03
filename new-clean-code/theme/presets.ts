/**
 * A TEMPLATE PRESET is the whole presentation layer as one data object: geometry (`StudioLayout`)
 * paired with a theme in each mode.
 *
 * This is the unit a host picks, because geometry and paint are not independent in practice — a
 * single-column serif theme wants `split: false`, and a glassy split-screen theme wants a stage
 * panel to be glassy *about*. Mode stays orthogonal, so a dark/light toggle works on every preset
 * rather than being one preset's feature.
 *
 * Nothing here can reach the lesson. Swapping presets re-lays-out and re-paints a running lesson
 * with zero lesson edits — `checks/theme.ts` asserts the render intents come out identical.
 */
import { defaultStudioLayout, type StudioLayout } from "./layout.js";
import { paperDark, paperLight, studioDark, studioLight, type Theme, type ThemeMode } from "./theme.js";

export interface TemplatePreset {
  id: string;
  label: string;
  /** One line for a picker UI — what this template is *for*. */
  blurb: string;
  layout: StudioLayout;
  dark: Theme;
  light: Theme;
}

/** The studio: a two-panel app. Figure on one side, prose and controls on the other. */
export const STUDIO_PRESET: TemplatePreset = {
  id: "studio",
  label: "Studio",
  blurb: "Split screen · sans · the figure always in view",
  layout: defaultStudioLayout,
  dark: studioDark,
  light: studioLight,
};

/**
 * Paper: one column, serif, figures inline in the flow.
 *
 * The same lesson as an essay. `split: false` makes `StudioView` drop the stage panel entirely and
 * `ConversationLog` render each beat's figure inline beneath its prose, so the reading order is
 * prose → figure → controls → next beat, top to bottom.
 */
export const PAPER_PRESET: TemplatePreset = {
  id: "paper",
  label: "Paper",
  blurb: "One column · serif · reads like a textbook",
  layout: { split: false, stageBasis: "0", stageSide: "left" },
  dark: paperDark,
  light: paperLight,
};

export const PRESETS: TemplatePreset[] = [STUDIO_PRESET, PAPER_PRESET];

export const defaultPreset: TemplatePreset = STUDIO_PRESET;

export function findPreset(id: string): TemplatePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

/** Resolve `(preset id, mode)` to the pair a host hands `StudioView`. Unknown id → the default. */
export function resolvePreset(id: string, mode: ThemeMode): { theme: Theme; layout: StudioLayout; preset: TemplatePreset } {
  const preset = findPreset(id) ?? defaultPreset;
  return { theme: mode === "dark" ? preset.dark : preset.light, layout: preset.layout, preset };
}
