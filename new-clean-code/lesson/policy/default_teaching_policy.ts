// The batteries-included Decide policy: a thin, reactive teacher. It reads the
// learner signals the Perceive layer folded onto the blackboard and the last move,
// and emits a coarse intent. It is deliberately minimal — the point of v1 is a solid,
// pure CONTRACT with a working default, not a clever tutor. Replace it by implementing
// your own `TeachingPolicy` (e.g. "insert a worked example after two wrong answers").
//
// Note on scope: in the co-play demo the reactive "learner asks → agent answers"
// behaviour is realized directly by the ask/message mechanism (a `generate` effect),
// so this policy is not the thing that answers questions there. It is the documented
// Decide seam — exercised in tests and consumed by the (deferred) autonomous loop and
// by anyone wiring it through `teachingPolicyToPolicy`.

import type { AgentIntent, PolicyView, TeachingPolicy } from "./contracts.js";

export function defaultTeachingPolicy(): TeachingPolicy {
  return {
    name: "reactive-default",
    decide(view: PolicyView): AgentIntent | null {
      const last = view.lastEvent?.type;

      // A free-text turn from the learner → the agent should author an answer.
      if (last === "message.submit" || last === "ask.submit") {
        return { kind: "author", goal: "answer" };
      }

      // Otherwise, lean on the learner signals: a clearly struggling learner gets a
      // remediation offer; a confident one gets nudged deeper.
      const s = view.context.learner?.signals;
      if (s) {
        if (s.struggling >= 0.7) return { kind: "author", goal: "remediate" };
        if (s.understanding >= 0.85 && s.struggling <= 0.2) return { kind: "author", goal: "challenge" };
      }

      return { kind: "none" };
    },
  };
}
