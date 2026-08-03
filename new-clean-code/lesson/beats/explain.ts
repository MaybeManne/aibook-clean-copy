import type { StateId, Json, StateNode, Transition } from "@lessonstudio/state-machine";
import type { RenderIntent, RichText, VisualRef } from "@lessonstudio/intents";
import { article } from "../../intents/index.js";
import { vizIntent } from "../../timeline/index.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";
import { readWorkspace, workspaceWiring } from "./workspace.js";

export interface ExplainParams {
  text: string | RichText;
  visual?: VisualRef & { slot?: string };
  textSlot?: string;
  /** Arbitrary HTML/CSS/SVG card (the escape hatch); emitted as an `html` intent. */
  html?: string;
  htmlSlot?: string;
  /**
   * A registered visualization this narration step drives. The beat carries only the DESIRED
   * STATE as props — never a command — so the viz eases from whatever it is currently showing
   * toward what this beat asks for, which is what lets one persistent apparatus be walked
   * through a whole lesson.
   *
   * Mark `persistent` for a stateful/WebGL viz so it lives once in the workspace panel instead
   * of being copied into every past turn (see `VizIntent.persistent`).
   */
  viz?: { name: string; props?: Record<string, unknown>; slot?: string; persistent?: boolean };
  /**
   * Optional spoken narration — a plain string, synthesized on DEMAND. The live host
   * lifts it off any beat's params (`live/program.ts:activeNarration`) and the renderer
   * POSTs it to `/api/tts` on entry, playing the clip once. Untimed: it never
   * auto-advances, and nothing is baked at authoring time.
   */
  narration?: string;
  /**
   * SEVERAL ways out instead of one Continue, in order, each its own edge and its own button.
   * `to: null` ends the lesson.
   *
   * This is what turns an answer into a fork. A detour with a single backward edge is a dead end:
   * the learner who interrupted to ask something has exactly one move afterwards, and it is
   * "rewind". Two exits — back to the beat they left, on to whatever came after it — let the
   * conversation continue in the direction they were already going.
   *
   * The default advance edge stays wired underneath, so nothing about the spine (or the
   * no-stranding invariant that walks it) changes when exits are present.
   */
  exits?: Array<{ label: string; to: string | null }>;
}

/** The event key exit `i` owns. One per exit, so each is separately reroutable and separately
 *  drawable — see `ControlSpec.event`. */
export function exitEvent(i: number): string {
  return `exit.${i}`;
}

/**
 * The well-formed exits of an `explain`, each paired with the event it owns.
 *
 * Malformed entries are dropped rather than wired, and dropped from the same list `render` draws
 * from, so a bad exit is invisible instead of being a button with no edge behind it. A director
 * authors these, and its dangling STRING targets are already refused by `validateBeatSpec` — this
 * covers only the shapes that are not targets at all.
 */
export function explainExits(params: ExplainParams): Array<{ label: string; to: string | null; event: string }> {
  const raw = Array.isArray(params.exits) ? params.exits : [];
  const out: Array<{ label: string; to: string | null; event: string }> = [];
  raw.forEach((entry, i) => {
    const { label, to } = (entry ?? {}) as { label?: unknown; to?: unknown };
    if (typeof label !== "string" || !label) return;
    if (to !== null && typeof to !== "string") return;
    out.push({ label, to, event: exitEvent(i) });
  });
  return out;
}

export const ExplainBeat: RenderableBeat<ExplainParams> = {
  type: "explain",
  outcomes: ["next"],

  paramsSchema: {
    doc: "Prose (markdown + $math$) with an optional visual. The plainest beat; `say` is sugar for one.",
    params: {
      text: "markdown + $math$; the words the learner reads",
      "?narration": "spoken variant, synthesized on demand",
      "?viz": "{name, props?, persistent?} — a registered visual to pose",
      "?exits": "[{label, to}] — offer SEVERAL ways out instead of one Continue; `to: null` ends the lesson",
    },
    example: { text: "The rays cross **at** the hole, so the image arrives inverted." },
  },

  build(params, id): StateNode {
    return { id, meta: beatMeta("explain", params as unknown as Json) };
  },

  wire(params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const dn = defaultNext();
    const on: Record<string, Transition[]> = { ...workspaceWiring(id, registry), next: dn ? [{ target: dn }] : [] };
    // An empty candidate list is how the interpreter spells "this event ends the lesson", which is
    // exactly what `to: null` means — see `resolve()` in the interpreter.
    for (const e of explainExits(params)) on[e.event] = e.to === null ? [] : [{ target: e.to }];
    return { on };
  },

  render(params, _state, ctx): RenderIntent[] {
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
      const { values, ws } = readWorkspace(ctx, (ctx.vars.__activeBeat as string) ?? "");
      intents.push(
        vizIntent(params.viz.slot ?? "stage", params.viz.name, { ...(params.viz.props ?? {}), ...values, ...ws }, 0, {
          persistent: params.viz.persistent,
        }),
      );
    }
    const exits = explainExits(params);
    if (exits.length) {
      // The `prompt` slot, because that is what the renderer reads to decide the beat has its own
      // affordance: exits REPLACE the automatic Continue rather than sitting beside it.
      intents.push({
        kind: "controls",
        slot: "prompt",
        values: {},
        controls: exits.map((e) => ({ key: e.event, label: e.label, kind: "button" as const, event: e.event })),
      } as unknown as RenderIntent);
    }
    return intents;
  },
};
