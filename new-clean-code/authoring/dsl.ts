// TIER 1 — DETERMINISTIC HUMAN AUTHORING. The Manim-style surface: a human writes a
// lesson as data, ahead of time, and the same input always produces the same lesson.
// No model, no network, no runtime state — this module is pure and its output is the
// frozen artifact the engine plays.
//
// Each function returns a plain BeatSpec, so this is sugar over the JSON IR rather than
// a second language: a director (human or AI) editing the lesson AT PLAY TIME emits the
// very same specs through `lesson/direction` — which is why one engine can serve all
// three tiers. defineLesson compiles the spec to a runnable CompiledLesson against the
// built-in beats.

import type { Guard, Json } from "@lessonstudio/state-machine";
import type { Storyboard } from "@lessonstudio/timeline";
import {
  compileLesson,
  defaultBeatRegistry,
  type BeatSpec,
  type CompiledLesson,
  type ExplainParams,
  type ExplorableParams,
  type FreeResponseParams,
  type LessonContext,
  type LessonSpec,
  type McqParams,
} from "@lessonstudio/lesson";

export function defineLesson(spec: LessonSpec): CompiledLesson {
  return compileLesson(spec, defaultBeatRegistry());
}

export function explain(p: { id: string; next?: string | null } & ExplainParams): BeatSpec {
  const { id, next, ...params } = p;
  const spec: BeatSpec = { id, type: "explain", params: params as unknown as Json };
  if (next !== undefined) spec.next = next;
  return spec;
}

export interface McqAuthoring extends McqParams {
  id: string;
  next?: string | null;
}
export function mcq(p: McqAuthoring): BeatSpec {
  const { id, next, ...params } = p; // onWrong/onTimeout ride along in params
  const spec: BeatSpec = { id, type: "mcq", params: params as unknown as Json };
  if (next !== undefined) spec.next = next;
  return spec;
}

export function animate(p: {
  id: string;
  storyboard: Storyboard;
  slot?: string;
  narration?: string;
  next?: string | null;
}): BeatSpec {
  const { id, next, ...params } = p;
  const spec: BeatSpec = { id, type: "scene", params: params as unknown as Json };
  if (next !== undefined) spec.next = next;
  return spec;
}

export interface FreeResponseAuthoring extends FreeResponseParams {
  id: string;
  next?: string | null;
}
export function freeResponse(p: FreeResponseAuthoring): BeatSpec {
  const { id, next, ...params } = p; // onWrong rides along in params
  const spec: BeatSpec = { id, type: "freeResponse", params: params as unknown as Json };
  if (next !== undefined) spec.next = next;
  return spec;
}

export interface ExplorableAuthoring extends ExplorableParams {
  id: string;
  next?: string | null;
}
export function explorable(p: ExplorableAuthoring): BeatSpec {
  const { id, next, ...params } = p;
  const spec: BeatSpec = { id, type: "explorable", params: params as unknown as Json };
  if (next !== undefined) spec.next = next;
  return spec;
}

export function branch(p: {
  id: string;
  when: Guard<LessonContext>;
  then: string;
  else: string;
}): BeatSpec {
  const whenRef = `branch.when:${p.id}`;
  return {
    id: p.id,
    type: "branch",
    params: { whenRef, then: p.then, else: p.else } as unknown as Json,
    __guards: { [whenRef]: p.when },
  };
}
