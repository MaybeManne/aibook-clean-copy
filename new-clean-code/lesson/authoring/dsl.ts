// Declarative authoring sugar. Each function returns a plain BeatSpec — an AI
// agent could skip these and emit the same IR directly. defineLesson compiles
// the spec to a runnable CompiledLesson against the built-in beats.

import type { Guard, Json } from "@lessonkit/state-machine";
import type { Storyboard } from "@lessonkit/timeline";
import { compileLesson, type BeatSpec, type CompiledLesson, type LessonSpec } from "../lesson_sm/compile.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { defaultBeatRegistry, type ExplainParams, type ExplorableParams, type FreeResponseParams, type McqParams } from "../beats/index.js";

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
