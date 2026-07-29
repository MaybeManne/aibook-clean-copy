// Explain beat: show text (+ optional visual); advances on the default "next".
//
// Its only wiring is the SHARED workspace channel (beats/workspace.ts): the learner's
// control writes and the director's viz patch, as self-transitions. An explain declares no
// controls of its own, so nothing here is learner-facing — but half of a lesson's visual
// steps are explains driving a persistent apparatus, and a live teacher (or an AI one)
// wants to point at, re-pose or zoom the figure the learner is looking at NOW. Wiring the
// channel here is what makes `setControl` / `workspace` work on the current beat whatever
// its type, instead of only on explorables.

import type { StateId, Json, StateNode, Transition } from "@lessonstudio/state-machine";
import type { RenderIntent, RichText, VisualRef } from "@lessonstudio/render-contract";
import { article } from "@lessonstudio/render-contract";
import { vizIntent } from "@lessonstudio/timeline";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";
import { readWorkspace, workspaceWiring } from "./workspace.js";

export interface ExplainParams {
  text: string | RichText;
  visual?: VisualRef & { slot?: string };
  textSlot?: string; // default "prose"
  /** Arbitrary HTML/CSS/SVG card (the escape hatch); emitted as an `html` intent. */
  html?: string;
  htmlSlot?: string; // default "stage"
  /**
   * A registered visualization this narration step drives. The beat carries only the
   * DESIRED STATE as props — never a command — so the viz eases from whatever it is
   * currently showing toward what this beat asks for. That is the same discipline as
   * the ValueTracker decision (a changing scalar is a param, not an executable node),
   * and it is what lets one persistent apparatus be walked through a whole lesson.
   *
   * Mark `persistent` for a stateful/WebGL viz so it lives once in the workspace panel
   * instead of being copied into every past turn (see VizIntent.persistent).
   */
  viz?: { name: string; props?: Record<string, unknown>; slot?: string; persistent?: boolean };
  /**
   * Optional spoken narration. An offline `prepareNarration` pass synthesizes it
   * to audio+captions; being untimed, the clip plays once when the learner reaches
   * this beat (it does not auto-advance). Ignored at runtime by the renderer.
   */
  narration?: string;
}

export const ExplainBeat: RenderableBeat<ExplainParams> = {
  type: "explain",
  outcomes: ["next"],

  build(params, id): StateNode {
    return { id, meta: beatMeta("explain", params as unknown as Json) };
  },

  wire(_params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const dn = defaultNext();
    // Declaring `wire` means the compiler no longer supplies `on.next` for us, so the
    // spine edge is restated here verbatim — same edge, same shape as before.
    return { on: { ...workspaceWiring(id, registry), next: dn ? [{ target: dn }] : [] } as Record<string, Transition[]> };
  },

  render(params, _state, ctx): RenderIntent[] {
    // A string body is authored markup: parse it as an article (headings/lists/callouts +
    // inline `$math$`), the same as if the author had written `article(...)` themselves.
    // Pass a RichText to bypass parsing.
    const content = typeof params.text === "string" ? article(params.text) : params.text;
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
    if (params.html) {
      intents.push({ kind: "html", slot: params.htmlSlot ?? "stage", html: params.html } as unknown as RenderIntent);
    }
    if (params.viz) {
      // Authored props first, then whatever has been written onto this beat's blackboard:
      // `values` (a director's `setControl`, on the same channel a learner's slider uses)
      // and `ws` (a director's `workspace` patch — highlight, camera, overlay). With an
      // untouched beat both are empty and this is byte-identical to the authored props.
      const { values, ws } = readWorkspace(ctx, (ctx.vars.__activeBeat as string) ?? "");
      intents.push(
        vizIntent(params.viz.slot ?? "stage", params.viz.name, { ...(params.viz.props ?? {}), ...values, ...ws }, 0, {
          persistent: params.viz.persistent,
        }),
      );
    }
    return intents;
  },
};
