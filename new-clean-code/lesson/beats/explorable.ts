import type { Action, Json, MachineEvent, StateId, StateNode, Transition } from "@lessonstudio/state-machine";
import type { ControlSpec, ControlValue, RenderIntent, RichText } from "@lessonstudio/intents";
import { article, md } from "../../intents/index.js";
import { vizIntent } from "../../timeline/index.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";
import { readWorkspace, workspaceWiring } from "./workspace.js";

const ASK_SUBMIT_EVENT = "ask.submit";

/** Build an `ask.submit` event carrying the learner's free-text question. */
export function askSubmit(textValue: string): MachineEvent {
  return { type: ASK_SUBMIT_EVENT, payload: { text: textValue } };
}

/** A declarative success condition over a control value — turns a demo into a task. */
export interface DemoGoal {
  key: string;
  equals?: number;
  min?: number;
  max?: number;
  tolerance?: number;
}

export interface ExplorableParams {
  /** Interactive controls; include a `{kind:"button", key:"__next"}` to let the learner advance. */
  controls: ControlSpec[];
  /** Registered visualization: a figure (SVG, exportable) or viz (JS/canvas, browser-only) by name.
   *  `persistent` ⇒ one shared mounted instance, not a per-turn copy (see VizIntent.persistent). */
  viz: { name: string; props?: Record<string, unknown>; persistent?: boolean };
  /** Stage slot for the visualization (default "stage"). */
  slot?: string;
  /** Initial control values (else sliders start at min, toggles at false). */
  defaults?: Record<string, ControlValue>;
  /**
   * GUIDED MODE: a task the learner must accomplish to advance. While unmet, the
   * `task` prompt shows and the Continue button (`__next`) is hidden; when met,
   * `success` shows and Continue appears — learn-by-doing, not fiddle-then-skip.
   */
  goal?: DemoGoal;
  task?: RichText;
  success?: RichText;
  /**
   * Optional prose shown in the "prose" slot — the tutor's words attached to this
   * demo (e.g. a generated explanation that annotates the viz via `defaults.__ws`).
   * A plain string is wrapped as one paragraph.
   */
  note?: string | RichText;
  /**
   * CONVERSATIONAL MODE: show a free-text "ask a question" box. Submitting fires the
   * agent to author an answer that resumes THIS beat (see `ASK_SUBMIT_EVENT`). `true`
   * uses defaults; an object customizes the prompt/placeholder. Off by default so it
   * never appears on demos that don't opt in.
   */
  ask?: boolean | { prompt?: string | RichText; placeholder?: string };
  /**
   * Optional spoken narration — a plain string, synthesized on DEMAND (see
   * `ExplainParams.narration`). Untimed, so exploration stays learner-paced: the clip
   * plays once on entry and never auto-advances.
   */
  narration?: string;
}

type DemoLocal = Record<string, ControlValue>;

function goalMet(goal: DemoGoal | undefined, values: DemoLocal): boolean {
  if (!goal) return true;
  const v = Number(values[goal.key]);
  if (Number.isNaN(v)) return false;
  if (goal.equals != null) return Math.abs(v - goal.equals) <= (goal.tolerance ?? 0);
  if (goal.min != null && v < goal.min) return false;
  if (goal.max != null && v > goal.max) return false;
  return true;
}

function readMerged(
  ctx: LessonContext,
  id: string,
  params: ExplorableParams,
): { values: DemoLocal; ws: Record<string, unknown> } {
  const { values, ws } = readWorkspace(ctx, id, (params.defaults ?? {}) as Record<string, unknown>);
  for (const c of params.controls) {
    if (c.kind === "matrix") {
      const preset = c.presets?.[0];
      (c.cellKeys ?? []).forEach((k, i) => {
        if (values[k] === undefined) values[k] = preset?.values[i] ?? 0;
      });
      if (c.divisorKey && values[c.divisorKey] === undefined) values[c.divisorKey] = preset?.div ?? 1;
      continue;
    }
    if (values[c.key] === undefined) {
      values[c.key] = c.kind === "toggle" ? false : c.kind === "choice" ? c.options?.[0]?.value ?? 0 : c.min ?? 0;
    }
  }
  return { values, ws };
}

function requestAsk(id: string): Action<LessonContext> {
  return (_ctx, event) => {
    const question = ((event.payload ?? {}) as { text?: string }).text ?? "";
    if (!question.trim()) return {};
    return { effects: [{ kind: "generate", intent: "answer", question, returnTo: id }] };
  };
}

export const ExplorableBeat: RenderableBeat<ExplorableParams> = {
  type: "explorable",
  outcomes: ["next"],

  paramsSchema: {
    doc:
      "An INTERACTIVE demo: controls the learner drags, wired to a visual. Two ways to name the " +
      "visual — an existing registered one (see the VISUALS list for names and accepted props), or " +
      "`{name:\"declarative\"}` with a storyboard whose numbers are BINDINGS to the control keys, " +
      "which is how you build a brand-new interactive figure without registering code.",
    params: {
      controls: "[{key, label, kind: slider|toggle|button|choice, min?, max?, step?, unit?, options?}]",
      viz: "{name, props?, persistent?} — control values are merged over `props`, so a control named `u` sets prop `u`",
      "?defaults": "{key: number|boolean} — starting values (else sliders start at min, toggles false)",
      "?note": "prose shown beside the demo",
      "?goal": "{key, equals?|min?|max?, tolerance?} — hide Continue until the learner reaches it",
      "?task": "what to do, shown while the goal is unmet",
      "?success": "shown once the goal is met",
      "?ask": "true to show a free-text question box on this demo",
      "?narration": "spoken variant, synthesized on demand",
    },
    example: {
      controls: [
        { key: "hole", label: "Hole width", kind: "slider", min: 1, max: 40, step: 1, unit: "px" },
        { key: "__next", label: "Continue", kind: "button" },
      ],
      defaults: { hole: 6 },
      viz: {
        name: "declarative",
        props: {
          storyboard: {
            duration: 0,
            stage: { w: 400, h: 220 },
            initial: [
              { id: "gap", kind: "rect", x: 200, y: { $sub: [110, { $div: [{ $ref: "hole" }, 2] }] }, w: 4, h: { $ref: "hole" }, fill: "#fbbf24" },
              { id: "blur", kind: "circle", x: 330, y: 110, r: { $mul: [{ $ref: "hole" }, 0.9] }, fill: "#38bdf8", opacity: 0.5 },
            ],
            tweens: [],
          },
        },
      },
      task: "Widen the hole and watch the spot on the wall.",
    },
  },

  build(_params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("explorable", _params as unknown as Json) };
  },

  wire(_params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const askRef = `ask.submit:${id}`;
    registry.action(askRef, requestAsk(id));
    const dn = defaultNext();
    const on: Record<string, Transition[]> = {
      ...workspaceWiring(id, registry),
      [ASK_SUBMIT_EVENT]: [{ target: id, actions: [askRef] }],
      next: dn ? [{ target: dn }] : [],
    };
    return { on };
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const { values, ws } = readMerged(ctx, id, params);
    const slot = params.slot ?? "stage";
    const met = goalMet(params.goal, values);
    const intents: RenderIntent[] = [
      vizIntent(slot, params.viz.name, { ...(params.viz.props ?? {}), ...values, ...ws }, 0, {
        persistent: params.viz.persistent,
      }),
    ];

    if (params.note) {
      const content = typeof params.note === "string" ? article(params.note) : params.note;
      intents.push({ kind: "text", slot: "prose", content } as unknown as RenderIntent);
    }

    const msg = met ? params.success : params.task;
    if (msg) intents.push({ kind: "text", slot: "prose", content: msg, emphasis: met ? "normal" : "muted" } as unknown as RenderIntent);

    const showContinue = !params.goal || met;
    const controls = showContinue ? params.controls : params.controls.filter((c) => c.key !== "__next");
    intents.push({ kind: "controls", slot: "prompt", controls, values } as unknown as RenderIntent);

    if (params.ask) {
      const opt = params.ask === true ? {} : params.ask;
      const promptSrc = opt.prompt;
      const prompt = promptSrc === undefined ? undefined : typeof promptSrc === "string" ? md(promptSrc) : promptSrc;
      intents.push({ kind: "ask", slot: "prompt", prompt, placeholder: opt.placeholder } as unknown as RenderIntent);
    }
    return intents;
  },
};
