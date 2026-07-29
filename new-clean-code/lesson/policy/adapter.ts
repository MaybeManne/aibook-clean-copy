// Bridge: turn a pure Decide policy (TeachingPolicy → AgentIntent) into the engine's
// low-level pull-based `Policy` (observe(step) → MachineEvent[]), so a third party's
// "what to do" policy can drive a session without touching the Session internals. The
// caller supplies the `map` from a coarse intent to concrete engine events — the SAME
// discipline `decisionPolicy` uses: the policy SELECTS among the teacher's authored
// edges/targets, it never invents a destination or an effect.
//
// This is the only file in the policy layer that references the runtime host, and only
// as a type (`Policy`) — so it erases at runtime and introduces no cycle.

import type { MachineEvent, Step } from "@lessonstudio/state-machine";
import type { LessonContext } from "../lesson_sm/context.js";
import type { Policy } from "../runtime/session.js";
import type { AgentIntent, PolicyView, TeachingPolicy } from "./contracts.js";

function topId(s: Step<LessonContext>["state"]): string {
  return typeof s === "string" ? s : Object.keys(s)[0]!;
}

/** Read-only view over a settled step, for handing to a pure policy. */
export function viewOf(step: Step<LessonContext>): PolicyView {
  return { context: step.context, activeBeatId: topId(step.state), lastEvent: step.lastRecord?.event };
}

/**
 * Adapt a TeachingPolicy to a low-level `Policy`. `map` translates the coarse intent
 * (never `none`/null — those are filtered) into the events to inject. Returns `[]` for
 * a deferred/no-op intent, so the session simply settles.
 */
export function teachingPolicyToPolicy(
  tp: TeachingPolicy,
  map: (intent: AgentIntent, view: PolicyView) => MachineEvent[],
): Policy {
  return {
    observe(step: Step<LessonContext>): MachineEvent[] {
      const view = viewOf(step);
      const intent = tp.decide(view);
      if (!intent || intent.kind === "none") return [];
      return map(intent, view);
    },
  };
}
