// The `scene` and `caption` render intents. Defined here (not in render_contract)
// so the dependency arrow stays one-way: timeline → render_contract. They ride
// render_contract's open `{ kind: string; ... }` member.

import type { RenderIntent, RichText, SlotName } from "@lessonkit/render-contract";
import type { SceneSnapshot } from "./scene.js";

export interface SceneIntent {
  kind: "scene";
  slot: SlotName;
  snapshot: SceneSnapshot;
}

export function sceneIntent(slot: SlotName, snapshot: SceneSnapshot): RenderIntent {
  return { kind: "scene", slot, snapshot } as unknown as RenderIntent;
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
}

export function vizIntent(slot: SlotName, name: string, props?: Record<string, unknown>, t?: number): RenderIntent {
  return { kind: "viz", slot, name, props, t } as unknown as RenderIntent;
}

/** Narrow an open RenderIntent to a VizIntent. */
export function asVizIntent(intent: RenderIntent): VizIntent | null {
  return intent.kind === "viz" ? (intent as unknown as VizIntent) : null;
}
