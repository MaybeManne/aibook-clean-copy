// Headless acceptance for the interactive lesson: the explorable beat records
// control values, and the policy routes a wrong answer to remediation and a right
// answer to the challenge — deterministically, through the pure state machine.

import { createSession } from "@lessonkit/lesson";
import { lesson, policy } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

function toCheck(): ReturnType<typeof createSession> {
  const s = createSession(lesson, { policies: [policy] });
  s.send({ type: "next" }); // intro → demo
  return s;
}

console.log("interactive: explorable demo records control state");
{
  const s = toCheck();
  assert(s.activeBeatId() === "demo", "advanced intro → demo");
  s.send({ type: "demo.set", payload: { key: "r", value: 6 } });
  const local = s.context.beats["demo"] as { r?: number } | undefined;
  assert(local?.r === 6, "demo.set wrote r=6 to the blackboard");
  s.send({ type: "demo.set", payload: { key: "r", value: 2 } });
  assert((s.context.beats["demo"] as { r?: number }).r === 2, "demo.set updates live");
}

console.log("interactive: WRONG answer adapts → remediation");
{
  const s = toCheck();
  s.send({ type: "next" }); // demo → check
  assert(s.activeBeatId() === "check", "advanced demo → check");
  s.send({ type: "mcq.answer", payload: { choice: 1 } }); // "doubles" → misconception "linear"
  assert((s.context.misconceptions["linear"] ?? 0) >= 1, "wrong answer recorded a misconception");
  s.send({ type: "next" }); // check → checkpoint → (policy) → remediate
  assert(s.activeBeatId() === "remediate", "policy routed wrong answer to remediation");
}

console.log("interactive: RIGHT answer adapts → challenge");
{
  const s = toCheck();
  s.send({ type: "next" }); // demo → check
  s.send({ type: "mcq.answer", payload: { choice: 0 } }); // correct → mastery.scaling = 1
  assert(s.context.mastery["scaling"] === 1, "correct answer raised mastery");
  s.send({ type: "next" }); // check → checkpoint → (policy) → challenge
  assert(s.activeBeatId() === "challenge", "policy routed correct answer to the challenge");
}

console.log("\nInteractive acceptance passed — explorable state + adaptive routing.");
