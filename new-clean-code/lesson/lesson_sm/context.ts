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

/**
 * The Perceive layer's output: a coarse read of the learner, derived by a pluggable
 * `LearnerModel` (see `policy/contracts.ts`) and folded onto the blackboard on every
 * committed transition. Numbers are 0..1. This is DATA (it lives with the blackboard);
 * the interface that PRODUCES it lives in the policy layer — so a third party can swap
 * "what understanding/struggling means" without touching the engine.
 */
export interface LearnerSignals {
  understanding: number;                // 0 = lost, 1 = solid
  struggling: number;                   // 0 = smooth, 1 = stuck
  engagement: number;                   // 0 = disengaged, 1 = active
  byConcept?: Record<string, number>;   // optional per-skill understanding
}

/** A learner model's persisted, replay-reconstructable state + its derived signals. */
export interface LearnerRuntime {
  model: string;                        // the LearnerModel `name` that produced this
  state: Json;                          // opaque, model-owned (must be Json for replay)
  signals: LearnerSignals;
}

export interface LessonContext {
  beats: Record<string, Json>;          // per-beat local state, keyed by beat id
  score: number;                        // cumulative correct count
  mastery: Record<string, number>;      // skillId → level (0..1+), written by answers
  misconceptions: Record<string, number>; // misconceptionId → strength; the adaptivity signal
  vars: Record<string, Json>;           // teacher-defined variables (escape hatch)
  history: EventRecord[];               // complete audit trail
  /** Perceive output, present only when a Session runs with a LearnerModel. */
  learner?: LearnerRuntime;
}

export function initialContext(vars: Record<string, Json> = {}): LessonContext {
  return { beats: {}, score: 0, mastery: {}, misconceptions: {}, vars, history: [] };
}

/** Immutable helper: set one beat's local state, preserving the others. Pure. */
export function withBeatState(ctx: LessonContext, beatId: string, state: Json): LessonContext {
  return { ...ctx, beats: { ...ctx.beats, [beatId]: state } };
}
