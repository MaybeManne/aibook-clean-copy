// Presentation-agnostic template description. Binds the two axes:
//   layout      → WHERE each slot sits (slot map + arrangement)
//   components  → HOW each content `kind` renders (registry; value type R is
//                 renderer-specific, so this layer stays renderer-free)
//   theme       → tokens both consume
// Pure data. No React/DOM here.

import type { SlotName } from "@lessonstudio/render-contract";
import type { Theme } from "./theme.js";

export interface Region {
  gridArea: string;
  [k: string]: unknown; // renderer-specific placement extensions
}

/**
 * Split-screen geometry for the live studio shell — the "where" of the default
 * lesson layout, expressed as DATA so it is decoupled from the lesson. Changing this
 * (ratio, which side the visuals sit on, or collapsing to one column) re-lays-out a
 * lesson with ZERO changes to the lesson spec. This is the point-4 decoupling that the
 * prior codebase built an abstraction for but then hardcoded in the React view.
 */
export interface StudioLayout {
  /** show the two-panel split; false → a single reading column (visuals render inline per step). */
  split: boolean;
  /** flex-basis of the visuals panel when split, e.g. "50%" or "60%". */
  stageBasis: string;
  /** which side the visuals panel sits on. */
  stageSide: "left" | "right";
}

/** The default: an even split, visuals on the left, reading (md + KaTeX) on the right. */
export const defaultStudioLayout: StudioLayout = { split: true, stageBasis: "50%", stageSide: "left" };

export interface Template<R> {
  layout: {
    slots: Record<SlotName, Region>;
    /** renderer-interpreted arrangement directive (e.g. a CSS grid-template). */
    arrangement: string;
  };
  /** Live-studio split geometry (defaults to `defaultStudioLayout` if absent). */
  studio?: StudioLayout;
  components: Record<string /* intent kind */, R>;
  theme: Theme;
}
