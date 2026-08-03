import type { Json, StateNode } from "@lessonstudio/state-machine";
import type { RenderIntent } from "@lessonstudio/intents";
import { sampleAt, sceneIntent, type Storyboard } from "../../timeline/index.js";
import { beatMeta, type RenderableBeat } from "./types.js";

export interface AnimateParams {
  storyboard: Storyboard;
  slot?: string;
  /**
   * Optional narration script — a plain string, synthesized on DEMAND (see
   * `ExplainParams.narration`).
   *
   * NOT synchronized with the storyboard: `duration` below governs the animation and the clip
   * plays alongside it, so a script much longer or shorter than the motion will drift.
   */
  narration?: string;
}

export const AnimateBeat: RenderableBeat<AnimateParams> = {
  type: "scene",
  outcomes: ["next"],

  paramsSchema: {
    doc:
      "A NEW declarative figure, drawn and animated from primitives. Pure JSON, so you can author " +
      "one for a question the lesson never anticipated — see the DRAWING vocabulary for node kinds, " +
      "animatable properties and easings.",
    params: {
      storyboard: "{duration, initial: SceneNode[], tweens: Tween[], stage?: {w,h}, camera?: CameraKey[]}",
      "?narration": "spoken script; plays alongside the motion, not synchronized to it",
    },
    example: {
      storyboard: {
        duration: 1200,
        stage: { w: 400, h: 200 },
        initial: [
          { id: "ray", kind: "line", x: 20, y: 40, x2: 380, y2: 160, stroke: "#f59e0b", opacity: 0 },
          { id: "cap", kind: "label", x: 20, y: 175, text: "one ray, one direction", size: 18 },
        ],
        tweens: [{ target: "ray", property: "opacity", to: 1, start: 0, duration: 600, easing: "smooth" }],
      },
    },
  },

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
