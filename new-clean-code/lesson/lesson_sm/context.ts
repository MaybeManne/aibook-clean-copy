// The concrete context (blackboard) the engine is instantiated with for lessons.
// This is the `C` in Statechart<C> / Registry<C> at the lesson layer.

import type { Json, MachineEvent, StateValue } from "@lessonkit/state-machine";

/** One recorded transition, with a monotonic sequence number. Owned by the Session. */
export interface EventRecord {
  seq: number;
  event: MachineEvent;
  from: StateValue;
  to: StateValue;
}

export interface LessonContext {
  beats: Record<string, Json>;          // per-beat local state, keyed by beat id
  score: number;                        // cumulative correct count
  mastery: Record<string, number>;      // skillId → level (0..1+), written by answers
  misconceptions: Record<string, number>; // misconceptionId → strength; the adaptivity signal
  vars: Record<string, Json>;           // teacher-defined variables (escape hatch)
  history: EventRecord[];               // complete audit trail
}

export function initialContext(vars: Record<string, Json> = {}): LessonContext {
  return { beats: {}, score: 0, mastery: {}, misconceptions: {}, vars, history: [] };
}

/** Immutable helper: set one beat's local state, preserving the others. Pure. */
export function withBeatState(ctx: LessonContext, beatId: string, state: Json): LessonContext {
  return { ...ctx, beats: { ...ctx.beats, [beatId]: state } };
}
