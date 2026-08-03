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
  const { id, next, ...params } = p;
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
  const { id, next, ...params } = p;
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
