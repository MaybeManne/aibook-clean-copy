// Adaptivity helpers. A Policy observes each settled step and may inject events;
// injected events are recorded in history and replayed with policies OFF, so this
// stays deterministic + replayable (see session.ts). A policy must be a PURE
// function of the settled step — no clocks, no randomness.
//
// The `decisionPolicy` pattern: a beat acts as an invisible "router". When the
// session settles on it, the policy reads the blackboard (mastery/misconceptions)
// and emits a semantic `signal.*` event. The beat's authored `routes` map that
// signal to a PRE-AUTHORED target (remediation / challenge). The policy only
// SELECTS among the teacher's edges — it never invents a destination.

import type { MachineEvent, Step } from "@lessonstudio/state-machine";
import type { LessonContext } from "../lesson_sm/context.js";
import type { Policy } from "./session.js";

/**
 * A Policy that fires `decide(ctx)` only while the active beat === `beatId`.
 * Use `beatId` as a decision node whose `routes` handle the emitted `signal.*`.
 */
export function decisionPolicy(beatId: string, decide: (ctx: LessonContext) => MachineEvent[]): Policy {
  return {
    observe(step: Step<LessonContext>): MachineEvent[] {
      return step.context.vars.__activeBeat === beatId ? decide(step.context) : [];
    },
  };
}

/** The misconception with the highest strength, or null if none recorded. Pure. */
export function topMisconception(ctx: LessonContext): string | null {
  let best: string | null = null;
  let bestN = 0;
  for (const [k, n] of Object.entries(ctx.misconceptions)) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}
