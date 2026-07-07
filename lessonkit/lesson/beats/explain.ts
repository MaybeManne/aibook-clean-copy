// Explain beat: show text (+ optional visual); advances on the default "next".
// No wiring — the compiler supplies the default `on.next` transition.

import type { Json, StateNode } from "@lessonkit/state-machine";
import type { RenderIntent, RichText, VisualRef } from "@lessonkit/render-contract";
import { text } from "@lessonkit/render-contract";
import { beatMeta, type RenderableBeat } from "./types.js";

export interface ExplainParams {
  text: string | RichText;
  visual?: VisualRef & { slot?: string };
  textSlot?: string; // default "prose"
}

export const ExplainBeat: RenderableBeat<ExplainParams> = {
  type: "explain",
  outcomes: ["next"],

  build(params, id): StateNode {
    return { id, meta: beatMeta("explain", params as unknown as Json) };
  },

  render(params): RenderIntent[] {
    const content = typeof params.text === "string" ? text(params.text) : params.text;
    const intents: RenderIntent[] = [
      { kind: "text", slot: params.textSlot ?? "prose", content },
    ];
    if (params.visual) {
      intents.push({
        kind: "visual",
        slot: params.visual.slot ?? "stage",
        ref: { kind: params.visual.kind, src: params.visual.src, data: params.visual.data },
      });
    }
    return intents;
  },
};
