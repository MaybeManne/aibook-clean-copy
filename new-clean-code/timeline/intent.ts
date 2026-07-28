// The `scene` and `caption` render intents. Defined here (not in render_contract)
// so the dependency arrow stays one-way: timeline → render_contract. They ride
// render_contract's open `{ kind: string; ... }` member.

import type { RenderIntent, RichText, SlotName } from "@lessonstudio/render-contract";
import type { SceneSnapshot } from "./scene.js";
import type { Storyboard } from "./storyboard.js";

export interface SceneIntent {
  kind: "scene";
  slot: SlotName;
  /** The frame to draw when NOT locally animating (a static fallback / initial frame). */
  snapshot: SceneSnapshot;
  /**
   * The beat's timeline. When present, a renderer with a local clock (e.g. SceneView's
   * own rAF) plays it from 0 → duration on entry — so a scene animates WITHOUT a global
   * transport. Absent → the snapshot is drawn statically. This is what lets the clockless
   * live runtime still show real Manim-style motion.
   */
  storyboard?: Storyboard;
  /** false → hold the final frame (a past/inactive step); true/absent → play on entry. */
  autoplay?: boolean;
}

export function sceneIntent(
  slot: SlotName,
  snapshot: SceneSnapshot,
  extra?: { storyboard?: Storyboard; autoplay?: boolean },
): RenderIntent {
  return { kind: "scene", slot, snapshot, ...extra } as unknown as RenderIntent;
}

/** Narrow an open RenderIntent to a SceneIntent. */
export function asSceneIntent(intent: RenderIntent): SceneIntent | null {
  return intent.kind === "scene" ? (intent as unknown as SceneIntent) : null;
}

/** One word of a caption, with its offset (ms) from the caption start. */
export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

/** A subtitle. `words`/`active` (if present) drive per-word highlight at `t`. */
export interface CaptionIntent {
  kind: "caption";
  slot: SlotName;
  text: RichText;
  words?: CaptionWord[];
  active?: number; // index of the word active at the current instant, or -1
}

export function captionIntent(
  slot: SlotName,
  text: RichText,
  extra?: { words?: CaptionWord[]; active?: number },
): RenderIntent {
  return { kind: "caption", slot, text, ...extra } as unknown as RenderIntent;
}

/** Narrow an open RenderIntent to a CaptionIntent. */
export function asCaptionIntent(intent: RenderIntent): CaptionIntent | null {
  return intent.kind === "caption" ? (intent as unknown as CaptionIntent) : null;
}

/** Points at a named external visualization; carries live props + beat clock `t`. */
export interface VizIntent {
  kind: "viz";
  slot: SlotName;
  name: string;
  props?: Record<string, unknown>;
  t?: number;
  /**
   * ONE shared instance for the whole lesson, not a copy per beat. A cheap SVG figure
   * can be re-rendered inline in every past turn (that scrolling filmstrip IS the
   * step-by-step video); a stateful mounted viz cannot — a WebGL scene would open one
   * context per turn and blow the browser's ~16-context ceiling. Persistent vizzes
   * therefore live only in the workspace panel and simply receive new props as beats
   * advance, which is also the right SEMANTICS: it is one apparatus being adjusted.
   */
  persistent?: boolean;
}

export function vizIntent(
  slot: SlotName,
  name: string,
  props?: Record<string, unknown>,
  t?: number,
  extra?: { persistent?: boolean },
): RenderIntent {
  return { kind: "viz", slot, name, props, t, ...extra } as unknown as RenderIntent;
}

/** Narrow an open RenderIntent to a VizIntent. */
export function asVizIntent(intent: RenderIntent): VizIntent | null {
  return intent.kind === "viz" ? (intent as unknown as VizIntent) : null;
}
