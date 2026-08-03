import type { Action, Json, MachineEvent, Registry, StateId, Transition } from "@lessonstudio/state-machine";
import type { ControlValue } from "@lessonstudio/intents";
import type { LessonContext } from "../lesson_sm/context.js";

/**
 * Reserved blackboard key holding the DIRECTOR's workspace patch (viz-only props): pointing
 * (highlight), writing on the figure (annotation), zooming (camera). Where `demo.set` is the
 * learner nudging a control, this is the teacher acting on the same persistent viz — it flows
 * into the viz as props alongside the learner's values while staying separable from them.
 *
 * Written by `session.ts` from `plan.workspace[beatId]` as part of the director's own
 * transition, so it needs no event: it lands in history inside the `direction.command` record.
 */
export const WORKSPACE_KEY = "__ws";

/**
 * The learner setting SEVERAL control values at once — e.g. loading a kernel preset into a
 * `matrix` control's nine cells + divisor. Emitted as ONE event so the transcript and replay
 * see a single atomic gesture ("loaded the Gaussian preset") instead of ten separate `demo.set`s.
 * Per-cell hand-edits stay on the single-key `demo.set` channel.
 */
export const DEMO_SET_MANY_EVENT = "demo.setMany";

/** The learner's single-control channel (a slider drag, a toggle, a button press). */
export const DEMO_SET_EVENT = "demo.set";

/** Build a `demo.set` event for one control value. */
export function demoSet(key: string, value: ControlValue): MachineEvent {
  return { type: DEMO_SET_EVENT, payload: { key, value } };
}

function setValue(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { key, value } = (event.payload ?? {}) as { key?: string; value?: ControlValue };
    if (key === undefined || value === undefined) return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    return { context: { beats: { ...ctx.beats, [id]: { ...prev, [key]: value as Json } } } };
  };
}

function setValues(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { values } = (event.payload ?? {}) as { values?: Record<string, ControlValue> };
    if (!values || typeof values !== "object") return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    const next: Record<string, Json> = { ...prev };
    for (const [k, v] of Object.entries(values)) if (v !== undefined) next[k] = v as Json;
    return { context: { beats: { ...ctx.beats, [id]: next } } };
  };
}

/**
 * The two self-transitions every visual beat gets — the LEARNER's control channels. Registers
 * the per-instance actions and returns the `on` map to splice onto the node: call it from a
 * beat's `wire()` and spread the result. (The director writes `__ws` through the adjudicated
 * plan instead; see `WORKSPACE_KEY`.)
 *
 * Self-transition (`target: id`) rather than an internal action, because re-entering the same
 * beat is what re-renders the viz with the new value and keeps the edit in history as its own
 * record.
 */
export function workspaceWiring(id: StateId, registry: Registry<LessonContext>): Record<string, Transition[]> {
  const setRef = `demo.set:${id}`;
  const setManyRef = `demo.setMany:${id}`;
  registry.action(setRef, setValue(id));
  registry.action(setManyRef, setValues(id));
  return {
    [DEMO_SET_EVENT]: [{ target: id, actions: [setRef] }],
    [DEMO_SET_MANY_EVENT]: [{ target: id, actions: [setManyRef] }],
  };
}

/**
 * Read a beat's blackboard, splitting the two writers apart: the learner's flat control
 * `values` and the director's `ws` viz patch. `seed` supplies the beat's authored defaults
 * (its `params.defaults`), which the stored values override.
 *
 * Both halves are meant to be spread into the viz props (`{...authored, ...values, ...ws}`);
 * only `values` should reach a controls UI.
 */
export function readWorkspace(
  ctx: LessonContext,
  id: string,
  seed: Record<string, unknown> = {},
): { values: Record<string, ControlValue>; ws: Record<string, unknown> } {
  const stored = (ctx.beats[id] as Record<string, unknown> | undefined) ?? {};
  const values: Record<string, ControlValue> = {};
  for (const [k, v] of Object.entries(seed)) if (k !== WORKSPACE_KEY) values[k] = v as ControlValue;
  for (const [k, v] of Object.entries(stored)) if (k !== WORKSPACE_KEY) values[k] = v as ControlValue;
  const ws: Record<string, unknown> = {
    ...((seed[WORKSPACE_KEY] as Record<string, unknown> | undefined) ?? {}),
    ...((stored[WORKSPACE_KEY] as Record<string, unknown> | undefined) ?? {}),
  };
  return { values, ws };
}
