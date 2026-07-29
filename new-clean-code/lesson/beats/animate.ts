// Animate beat: a TIMED beat. Its params ARE a Storyboard (pure JSON), so it is
// serializable and AI-authorable. Advances on "next" (the Player emits it at the
// end of the storyboard; the compiler's default-next routing carries it on).

import type { Json, StateNode } from "@lessonstudio/state-machine";
import type { RenderIntent } from "@lessonstudio/render-contract";
import { sampleAt, sceneIntent, type Storyboard } from "@lessonstudio/timeline";
import { beatMeta, type RenderableBeat } from "./types.js";

export interface AnimateParams {
  storyboard: Storyboard;
  slot?: string; // default "stage"
  /**
   * Optional narration script. An offline `prepareNarration` pass synthesizes it,
   * sets the storyboard duration to the audio length, and merges caption cues.
   * Purely advisory to the beat itself — the baked storyboard is what plays.
   */
  narration?: string;
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

  /**
   * Emit the initial frame PLUS the storyboard, so a renderer with a local clock
   * (SceneView's rAF) plays the animation on entry. `autoplay:true` is the active-beat
   * default; Session.renderBeat flips it to false for past/inactive steps (final frame).
   * A renderer without a local clock still draws the initial snapshot as a fallback.
   */
  render(params): RenderIntent[] {
    const slot = params.slot ?? "stage";
    return [sceneIntent(slot, sampleAt(params.storyboard, 0), { storyboard: params.storyboard, autoplay: true })];
  },
};
