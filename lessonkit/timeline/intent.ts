// The `scene` render intent. Defined here (not in render_contract) so the
// dependency arrow stays one-way: timeline → render_contract. It rides
// render_contract's open `{ kind: string; ... }` member.

import type { RenderIntent, SlotName } from "@lessonkit/render-contract";
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
