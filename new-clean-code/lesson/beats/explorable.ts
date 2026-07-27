// Explorable demo beat. The learner toggles parameters (sliders/toggles) and a
// registered visualization recomputes live. UNTIMED (no storyboard): like an mcq
// gate, the video waits here until the learner presses Continue (a "__next" button
// control) — then it advances on the default spine.
//
// Control values live on the blackboard under beats[id], so play is part of session
// state: replayable, snapshot-able, and (for figure-based viz) exportable. The
// visualization is a registered figure/viz referenced by name — declarative controls
// + a registered visual, per the chosen "declarative + JS escape hatch" model.

import type { Action, Json, MachineEvent, StateId, StateNode, Transition } from "@lessonkit/state-machine";
import type { ControlSpec, ControlValue, RenderIntent, RichText } from "@lessonkit/render-contract";
import { article, text } from "@lessonkit/render-contract";
import { vizIntent } from "@lessonkit/timeline";
import type { LessonContext } from "../lesson_sm/context.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";

/**
 * The agent's viz-manipulation channel. Where `demo.set` is the LEARNER nudging a
 * control, `workspace.set` is the AGENT/tutor acting on the same persistent viz —
 * pointing (highlight), writing on it (annotation), zooming (camera). Its payload is
 * a `{ props }` patch merged under the reserved `__ws` key of the beat's blackboard,
 * so it (a) flows into the viz as props alongside the learner's controls, and (b) is
 * a DISTINCT event in history, so the transcript can attribute it to the agent, not
 * the learner. Self-transition: it re-renders the viz without leaving the beat.
 */
export const WORKSPACE_SET_EVENT = "workspace.set";
/** Reserved blackboard key holding the agent's workspace patch (viz-only props). */
export const WORKSPACE_KEY = "__ws";

/**
 * Build a `workspace.set` event carrying an agent viz patch (highlight/annotation/camera).
 * An optional `label` is the phrase the transcript shows for the gesture ("circled the
 * two coreferent tokens"); without it the document derives one from the patch itself.
 */
export function workspaceSet(props: Record<string, Json>, label?: string): MachineEvent {
  return { type: WORKSPACE_SET_EVENT, payload: label ? { props, label } : { props } };
}

/**
 * The learner's conversational channel. `ask.submit {text}` is a non-graded free-text
 * question (contrast the graded `input.submit` of a freeResponse gate). The shared wire
 * handles it as a SELF-transition that fires a `generate` effect carrying the question
 * and `returnTo: id` — so the agent authors an answer beat that, on Continue, RESUMES
 * the beat the learner asked from. Staying on the beat means the in-flight generation is
 * only cancelled if the learner navigates away (the standard effect-abort contract).
 */
export const ASK_SUBMIT_EVENT = "ask.submit";

/** Build an `ask.submit` event carrying the learner's free-text question. */
export function askSubmit(textValue: string): MachineEvent {
  return { type: ASK_SUBMIT_EVENT, payload: { text: textValue } };
}

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
   * Optional spoken narration. An offline `prepareNarration` pass synthesizes it
   * to audio+captions; being untimed, the clip plays once when the learner reaches
   * this beat (exploration stays learner-paced — it never auto-advances). Ignored
   * at runtime by the renderer.
   */
  narration?: string;
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

/**
 * Read the beat's blackboard, splitting the two writers apart: the learner's flat
 * control `values` (seeded from defaults/mins) and the agent's `ws` viz patch (under
 * the reserved `__ws` key). Both are spread into the viz props; only `values` drives
 * the controls UI, so an agent annotation never shows up as a phantom control.
 */
function readMerged(
  ctx: LessonContext,
  id: string,
  params: ExplorableParams,
): { values: DemoLocal; ws: Record<string, unknown> } {
  const stored = (ctx.beats[id] as Record<string, unknown> | undefined) ?? {};
  const defaults = (params.defaults ?? {}) as Record<string, unknown>;
  const values: DemoLocal = {};
  for (const [k, v] of Object.entries(defaults)) if (k !== WORKSPACE_KEY) values[k] = v as ControlValue;
  for (const c of params.controls) {
    if (values[c.key] === undefined) values[c.key] = c.kind === "toggle" ? false : c.min ?? 0;
  }
  for (const [k, v] of Object.entries(stored)) if (k !== WORKSPACE_KEY) values[k] = v as ControlValue;
  const ws: Record<string, unknown> = {
    ...((defaults[WORKSPACE_KEY] as Record<string, unknown> | undefined) ?? {}),
    ...((stored[WORKSPACE_KEY] as Record<string, unknown> | undefined) ?? {}),
  };
  return { values, ws };
}

/** Action factory: write one LEARNER control value into beats[id] (shallow-merge safe). */
function setValue(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { key, value } = (event.payload ?? {}) as { key?: string; value?: ControlValue };
    if (key === undefined || value === undefined) return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    const nextLocal = { ...prev, [key]: value as Json };
    return { context: { beats: { ...ctx.beats, [id]: nextLocal } } };
  };
}

/** Action factory: merge the AGENT's `{ props }` viz patch under beats[id].__ws. */
function setWorkspace(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { props } = (event.payload ?? {}) as { props?: Record<string, Json> };
    if (!props || typeof props !== "object") return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    const prevWs = (prev[WORKSPACE_KEY] as Record<string, Json> | undefined) ?? {};
    const nextLocal = { ...prev, [WORKSPACE_KEY]: { ...prevWs, ...props } };
    return { context: { beats: { ...ctx.beats, [id]: nextLocal } } };
  };
}

/** Action factory: turn a learner question into a `generate` effect that answers it
 *  and RESUMES this beat (`returnTo`). Declared as data only — the Session's runner
 *  performs the I/O, so the engine stays pure and replay never re-invokes the author. */
function requestAsk(id: string): Action<LessonContext> {
  return (_ctx, event) => {
    const question = ((event.payload ?? {}) as { text?: string }).text ?? "";
    if (!question.trim()) return {};
    // `Effect` is an open union, so we build the generate request inline — no dependency
    // on the authoring layer (beats must not import upward into Session/authoring).
    return { effects: [{ kind: "generate", intent: "answer", question, returnTo: id }] };
  };
}

export const ExplorableBeat: RenderableBeat<ExplorableParams> = {
  type: "explorable",
  outcomes: ["next"],

  build(_params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("explorable", _params as unknown as Json) };
  },

  wire(_params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const setRef = `demo.set:${id}`;
    const wsRef = `workspace.set:${id}`;
    const askRef = `ask.submit:${id}`;
    registry.action(setRef, setValue(id));
    registry.action(wsRef, setWorkspace(id));
    registry.action(askRef, requestAsk(id));
    const dn = defaultNext();
    const on: Record<string, Transition[]> = {
      "demo.set": [{ target: id, actions: [setRef] }], // learner: record value + re-render viz
      [WORKSPACE_SET_EVENT]: [{ target: id, actions: [wsRef] }], // agent: annotate/zoom the same viz
      [ASK_SUBMIT_EVENT]: [{ target: id, actions: [askRef] }], // learner: ask → generate answer → resume here
      next: dn ? [{ target: dn }] : [],
    };
    return { on };
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const { values, ws } = readMerged(ctx, id, params);
    const slot = params.slot ?? "stage";
    const met = goalMet(params.goal, values);
    // Viz sees learner controls AND the agent's workspace patch; controls UI sees only `values`.
    const intents: RenderIntent[] = [vizIntent(slot, params.viz.name, { ...(params.viz.props ?? {}), ...values, ...ws }, 0)];

    // Tutor prose attached to this demo (e.g. a generated, viz-annotating explanation).
    // A string is parsed as prose (markdown + `$…$` KaTeX) via `article` — the SAME
    // renderer the reference explainer uses — so a live tutor's inline math renders
    // instead of showing raw `$q\cdot k$`. Pass a RichText to bypass parsing.
    if (params.note) {
      const content = typeof params.note === "string" ? article(params.note) : params.note;
      intents.push({ kind: "text", slot: "prose", content } as unknown as RenderIntent);
    }

    // Guided task / success prompt (prose slot), if this is a guided demo.
    const msg = met ? params.success : params.task;
    if (msg) intents.push({ kind: "text", slot: "prose", content: msg, emphasis: met ? "normal" : "muted" } as unknown as RenderIntent);

    // Hide the Continue button until the goal is met (agency: do the task to advance).
    const showContinue = !params.goal || met;
    const controls = showContinue ? params.controls : params.controls.filter((c) => c.key !== "__next");
    intents.push({ kind: "controls", slot: "prompt", controls, values } as unknown as RenderIntent);

    // Conversational channel: a free-text question box (opt-in). Emits ask.submit.
    if (params.ask) {
      const opt = params.ask === true ? {} : params.ask;
      const promptSrc = opt.prompt;
      const prompt = promptSrc === undefined ? undefined : typeof promptSrc === "string" ? text(promptSrc) : promptSrc;
      intents.push({ kind: "ask", slot: "prompt", prompt, placeholder: opt.placeholder } as unknown as RenderIntent);
    }
    return intents;
  },
};
