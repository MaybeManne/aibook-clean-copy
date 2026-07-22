// Explorable demo beat. The learner toggles parameters (sliders/toggles) and a
// registered visualization recomputes live. UNTIMED (no storyboard): like an mcq
// gate, the video waits here until the learner presses Continue (a "__next" button
// control) — then it advances on the default spine.
//
// Control values live on the blackboard under beats[id], so play is part of session
// state: replayable, snapshot-able, and (for figure-based viz) exportable. The
// visualization is a registered figure/viz referenced by name — declarative controls
// + a registered visual, per the chosen "declarative + JS escape hatch" model.

import type { Action, Json, StateId, StateNode, Transition } from "@lessonkit/state-machine";
import type { ControlSpec, ControlValue, RenderIntent, RichText } from "@lessonkit/render-contract";
import { vizIntent } from "@lessonkit/timeline";
import type { LessonContext } from "../lesson_sm/context.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";

/** A declarative success condition over a control value — turns a demo into a task. */
export interface DemoGoal {
  key: string;
  equals?: number; // met when |value - equals| <= tolerance
  min?: number; // met when value >= min
  max?: number; // met when value <= max
  tolerance?: number; // default 0 (for `equals`)
}

export interface ExplorableParams {
  /** Interactive controls; include a `{kind:"button", key:"__next"}` to let the learner advance. */
  controls: ControlSpec[];
  /** Registered visualization: a figure (SVG, exportable) or viz (JS/canvas, browser-only) by name. */
  viz: { name: string; props?: Record<string, unknown> };
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
  task?: RichText; // instruction shown while the goal is unmet
  success?: RichText; // shown once the goal is met
}

type DemoLocal = Record<string, ControlValue>;

/** Is the guided goal satisfied by the current values? No goal ⇒ always true. */
function goalMet(goal: DemoGoal | undefined, values: DemoLocal): boolean {
  if (!goal) return true;
  const v = Number(values[goal.key]);
  if (Number.isNaN(v)) return false;
  if (goal.equals != null) return Math.abs(v - goal.equals) <= (goal.tolerance ?? 0);
  if (goal.min != null && v < goal.min) return false;
  if (goal.max != null && v > goal.max) return false;
  return true;
}

/** Current control values: stored blackboard state, else seeded from defaults/mins. */
function readValues(ctx: LessonContext, id: string, params: ExplorableParams): DemoLocal {
  const stored = ctx.beats[id] as DemoLocal | undefined;
  const seed: DemoLocal = { ...(params.defaults ?? {}) };
  for (const c of params.controls) {
    if (seed[c.key] === undefined) seed[c.key] = c.kind === "toggle" ? false : c.min ?? 0;
  }
  return { ...seed, ...(stored ?? {}) };
}

/** Action factory: write one control value into beats[id] (shallow-merge safe). */
function setValue(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { key, value } = (event.payload ?? {}) as { key?: string; value?: ControlValue };
    if (key === undefined || value === undefined) return {};
    const prev = (ctx.beats[id] as DemoLocal | undefined) ?? {};
    const nextLocal: DemoLocal = { ...prev, [key]: value };
    return { context: { beats: { ...ctx.beats, [id]: nextLocal } } };
  };
}

export const ExplorableBeat: RenderableBeat<ExplorableParams> = {
  type: "explorable",
  outcomes: ["next"],

  build(_params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("explorable", _params as unknown as Json) };
  },

  wire(_params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const ref = `demo.set:${id}`;
    registry.action(ref, setValue(id));
    const dn = defaultNext();
    const on: Record<string, Transition[]> = {
      "demo.set": [{ target: id, actions: [ref] }], // self: record value + re-render viz
      next: dn ? [{ target: dn }] : [],
    };
    return { on };
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const values = readValues(ctx, id, params);
    const slot = params.slot ?? "stage";
    const met = goalMet(params.goal, values);
    const intents: RenderIntent[] = [vizIntent(slot, params.viz.name, { ...(params.viz.props ?? {}), ...values }, 0)];

    // Guided task / success prompt (prose slot), if this is a guided demo.
    const msg = met ? params.success : params.task;
    if (msg) intents.push({ kind: "text", slot: "prose", content: msg, emphasis: met ? "normal" : "muted" } as unknown as RenderIntent);

    // Hide the Continue button until the goal is met (agency: do the task to advance).
    const showContinue = !params.goal || met;
    const controls = showContinue ? params.controls : params.controls.filter((c) => c.key !== "__next");
    intents.push({ kind: "controls", slot: "prompt", controls, values } as unknown as RenderIntent);
    return intents;
  },
};
