import type { Json, MachineEvent } from "@lessonstudio/state-machine";
import type { EventRecord, LearnerSignals, LessonContext } from "../lesson_sm/context.js";

export type { LearnerSignals } from "../lesson_sm/context.js";

/**
 * A read-only window on the game, handed to every policy call. It is exactly the
 * data a policy may sense: the settled blackboard (which already carries score,
 * mastery, misconceptions and — after the fold — `learner.signals`), which beat is
 * live, and the event that just landed. No chart, no effects, no way to mutate.
 */
export interface PolicyView {
  context: LessonContext;
  activeBeatId: string;
  /** The event whose transition produced this view (absent for the initial view). */
  lastEvent?: MachineEvent;
}

/**
 * The "understanding / struggling" policy. A PURE fold over the recorded event
 * stream: on every committed transition the Session calls `observe(state, record,
 * view)` and writes the result (plus `signals(state)`) onto `ctx.learner`. Because
 * it is pure and folded from history, `replay` reconstructs `ctx.learner` for free.
 *
 * `S` is the model's own state and MUST be Json (it rides on the blackboard and must
 * survive snapshot/replay). Implementations own its shape entirely — the engine only
 * stores it and hands it back.
 */
export interface LearnerModel<S extends Json = Json> {
  /** Stable name; policies register and are referenced BY NAME (like guards/actions). */
  readonly name: string;
  /** The starting state, before any events. Pure. */
  initial(): S;
  /** Fold one committed transition into new state. Pure — no clocks, no randomness. */
  observe(state: S, record: EventRecord, view: PolicyView): S;
  /** Project state into the coarse signals the rest of the system reads. Pure. */
  signals(state: S): LearnerSignals;
}

/**
 * A coarse, declarative statement of what the agent wants to do next — the output of the Decide
 * layer. It chooses WHAT, never HOW: turning an intent into concrete, validated edits is the Act
 * layer's job.
 */
export type AgentIntent =
  | { kind: "none" }
  | { kind: "say"; topic?: string }
  | { kind: "author"; goal: string; note?: string }
  | { kind: "gesture"; note?: string };

/**
 * The "what to do" policy. A PURE function from a read-only view to a coarse intent (or null =
 * defer). No LLM call here, no effects, which keeps it replay-safe and safe to accept from
 * strangers.
 */
export interface TeachingPolicy {
  readonly name: string;
  decide(view: PolicyView): AgentIntent | null;
}
