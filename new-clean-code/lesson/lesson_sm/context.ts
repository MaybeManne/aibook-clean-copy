import type { Json, MachineEvent, StateValue } from "@lessonstudio/state-machine";

/** One recorded transition, with a monotonic sequence number. Owned by the Session. */
export interface EventRecord {
  seq: number;
  event: MachineEvent;
  from: StateValue;
  to: StateValue;
}

/**
 * The Perceive layer's output: a coarse read of the learner, derived by a pluggable
 * `LearnerModel` (see `policy/contracts.ts`) and folded onto the blackboard on every committed
 * transition. Numbers are 0..1. This is DATA; the interface that PRODUCES it lives in the policy
 * layer, so a third party can swap "what understanding means" without touching the engine.
 */
export interface LearnerSignals {
  understanding: number;
  struggling: number;
  engagement: number;
  byConcept?: Record<string, number>;
}

/** A learner model's persisted, replay-reconstructable state + its derived signals. */
export interface LearnerRuntime {
  model: string;
  state: Json;
  signals: LearnerSignals;
}

export interface LessonContext {
  beats: Record<string, Json>;
  score: number;
  mastery: Record<string, number>;
  misconceptions: Record<string, number>;
  vars: Record<string, Json>;
  history: EventRecord[];
  /** Perceive output, present only when a Session runs with a LearnerModel. */
  learner?: LearnerRuntime;
}

export function initialContext(vars: Record<string, Json> = {}): LessonContext {
  return { beats: {}, score: 0, mastery: {}, misconceptions: {}, vars, history: [] };
}
