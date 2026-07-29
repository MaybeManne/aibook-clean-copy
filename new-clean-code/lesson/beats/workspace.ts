// THE SHARED WORKSPACE CHANNEL — the wiring that lets a beat's visual be driven by two
// hands at once: the LEARNER's (a slider, a preset) and the DIRECTOR's (a tutor, a live
// human teacher, an AI teacher pointing at the same figure).
//
// It started inside `explorable`, which was the only beat with controls. But a director
// wants to act on whatever the learner is looking at, and half of a lesson's visual steps
// are plain `explain` beats driving a persistent apparatus — so the channel had to become
// a property of BEATS, not of one beat type. Lifting it here is what makes
// `setControl` / `workspace` work uniformly: the director never has to know which beat
// type is on screen, and no beat has to opt in beyond calling `workspaceWiring`.
//
// Two writers, two keys, one merge:
//   • learner control values live FLAT on `ctx.beats[id]` (`demo.set` / `demo.setMany`)
//   • the director's viz patch lives under the reserved `__ws` key (`workspace.set`)
// Both are spread into the viz's props; only the flat values drive the controls UI, so a
// director's annotation never shows up as a phantom control. Keeping them apart is also
// what lets the transcript attribute a gesture to the right author.

import type { Action, Json, MachineEvent, Registry, StateId, Transition } from "@lessonstudio/state-machine";
import type { ControlValue } from "@lessonstudio/render-contract";
import type { LessonContext } from "../lesson_sm/context.js";

/**
 * The director's viz-manipulation channel. Where `demo.set` is the LEARNER nudging a
 * control, `workspace.set` is the TUTOR/TEACHER acting on the same persistent viz —
 * pointing (highlight), writing on it (annotation), zooming (camera). Its payload is
 * a `{ props }` patch merged under the reserved `__ws` key of the beat's blackboard,
 * so it (a) flows into the viz as props alongside the learner's controls, and (b) is
 * a DISTINCT event in history, so the transcript can attribute it to the director, not
 * the learner. Self-transition: it re-renders the viz without leaving the beat.
 */
export const WORKSPACE_SET_EVENT = "workspace.set";

/** Reserved blackboard key holding the director's workspace patch (viz-only props). */
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

/**
 * Build a `workspace.set` event carrying a director viz patch (highlight/annotation/camera).
 * An optional `label` is the phrase the transcript shows for the gesture ("circled the
 * two coreferent tokens"); without it the document derives one from the patch itself.
 */
export function workspaceSet(props: Record<string, Json>, label?: string): MachineEvent {
  return { type: WORKSPACE_SET_EVENT, payload: label ? { props, label } : { props } };
}

/** Build a `demo.setMany` event carrying a batch of learner control values. */
export function demoSetMany(values: Record<string, ControlValue>): MachineEvent {
  return { type: DEMO_SET_MANY_EVENT, payload: { values } };
}

/** Build a `demo.set` event for one control value. */
export function demoSet(key: string, value: ControlValue): MachineEvent {
  return { type: DEMO_SET_EVENT, payload: { key, value } };
}

/** Action factory: write one LEARNER control value into beats[id] (shallow-merge safe). */
function setValue(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { key, value } = (event.payload ?? {}) as { key?: string; value?: ControlValue };
    if (key === undefined || value === undefined) return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    return { context: { beats: { ...ctx.beats, [id]: { ...prev, [key]: value as Json } } } };
  };
}

/** Action factory: write SEVERAL learner control values into beats[id] in one shot (preset load). */
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

/** Action factory: merge the DIRECTOR's `{ props }` viz patch under beats[id].__ws. */
function setWorkspace(id: string): Action<LessonContext> {
  return (ctx, event) => {
    const { props } = (event.payload ?? {}) as { props?: Record<string, Json> };
    if (!props || typeof props !== "object") return {};
    const prev = (ctx.beats[id] as Record<string, Json> | undefined) ?? {};
    const prevWs = (prev[WORKSPACE_KEY] as Record<string, Json> | undefined) ?? {};
    return { context: { beats: { ...ctx.beats, [id]: { ...prev, [WORKSPACE_KEY]: { ...prevWs, ...props } } } } };
  };
}

/**
 * The three self-transitions every visual beat gets: the learner's two control channels
 * and the director's workspace patch. Registers the per-instance actions and returns the
 * `on` map to splice onto the node — call it from a beat's `wire()` and spread the result.
 *
 * Self-transition (`target: id`) rather than an internal action: re-entering the same beat
 * is what re-renders the viz with the new props, and it keeps the edit in history as its
 * own record, which is what the transcript and replay both read.
 */
export function workspaceWiring(id: StateId, registry: Registry<LessonContext>): Record<string, Transition[]> {
  const setRef = `demo.set:${id}`;
  const setManyRef = `demo.setMany:${id}`;
  const wsRef = `workspace.set:${id}`;
  registry.action(setRef, setValue(id));
  registry.action(setManyRef, setValues(id));
  registry.action(wsRef, setWorkspace(id));
  return {
    [DEMO_SET_EVENT]: [{ target: id, actions: [setRef] }], // learner: record value + re-render viz
    [DEMO_SET_MANY_EVENT]: [{ target: id, actions: [setManyRef] }], // learner: load a preset atomically
    [WORKSPACE_SET_EVENT]: [{ target: id, actions: [wsRef] }], // director: annotate/zoom the same viz
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
