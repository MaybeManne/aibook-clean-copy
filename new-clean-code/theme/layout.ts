/**
 * Split-screen geometry for the live studio shell — the "where" of the default lesson layout,
 * expressed as DATA. Changing the ratio, the side the visuals sit on, or collapsing to one
 * column re-lays-out a lesson with no changes to the lesson spec.
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
