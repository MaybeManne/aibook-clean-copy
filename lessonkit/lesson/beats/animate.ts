// Animate beat: a TIMED beat. Its params ARE a Storyboard (pure JSON), so it is
// serializable and AI-authorable. Advances on "next" (the Player emits it at the
// end of the storyboard; the compiler's default-next routing carries it on).

import type { Json, StateNode } from "@lessonkit/state-machine";
import type { RenderIntent } from "@lessonkit/render-contract";
import { sampleAt, sceneIntent, type Storyboard } from "@lessonkit/timeline";
import { beatMeta, type RenderableBeat } from "./types.js";

export interface AnimateParams {
  storyboard: Storyboard;
  slot?: string; // default "stage"
}

export const AnimateBeat: RenderableBeat<AnimateParams> = {
  type: "scene",
  outcomes: ["next"],

  build(params, id): StateNode {
    return { id, meta: beatMeta("scene", params as unknown as Json) };
  },

  storyboard(params): Storyboard {
    return params.storyboard;
  },

  /** Static fallback (non-player contexts): the final frame. */
  render(params): RenderIntent[] {
    const slot = params.slot ?? "stage";
    return [sceneIntent(slot, sampleAt(params.storyboard, params.storyboard.duration))];
  },
};
