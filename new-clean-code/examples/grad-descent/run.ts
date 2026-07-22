// Headless acceptance for the gradient-descent slice. The canvas viz can't run
// without a DOM, so we send the SAME events the viz emits (demo.set for the dragged
// start point, signal.viz.diverged when a run blows up) and assert the tutor loop
// closes deterministically through the pure state machine — both the real-time
// route and the settled-state policy.

import { createSession } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { lesson, policy } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

function toDemo(): ReturnType<typeof createSession> {
  const s = createSession(lesson, { policies: [policy] });
  s.send({ type: "next" }); // intro → demo
  return s;
}

console.log("grad-descent: viz writes the dragged start point to the blackboard");
{
  const s = toDemo();
  assert(s.activeBeatId() === "demo", "advanced intro → demo");
  s.send({ type: "demo.set", payload: { key: "x0", value: -1.5 } }); // viz drag commit
  s.send({ type: "demo.set", payload: { key: "y0", value: 0.75 } });
  s.send({ type: "demo.set", payload: { key: "lr", value: 0.6 } }); // α slider
  const local = s.context.beats["demo"] as { x0?: number; y0?: number; lr?: number } | undefined;
  assert(local?.x0 === -1.5 && local?.y0 === 0.75, "demo.set from viz wrote x0/y0 (replayable)");
  assert(local?.lr === 0.6, "α slider recorded on the blackboard");
}

console.log("grad-descent: exploration is learner-paced — a viz signal never advances the beat");
{
  const s = toDemo();
  assert(s.activeBeatId() === "demo", "on the demo beat");
  s.send({ type: "signal.viz.diverged", payload: { lr: 1.4 } }); // viz observed divergence…
  assert(s.activeBeatId() === "demo", "…but the learner stays on the demo (no teleport)");
}

console.log("grad-descent: SETTLED-STATE — correct answer adapts → challenge");
{
  const s = toDemo();
  s.send({ type: "next" }); // demo → check
  assert(s.activeBeatId() === "check", "advanced demo → check");
  s.send({ type: "mcq.answer", payload: { choice: 0 } }); // "overshoot/diverge" → correct
  assert(s.context.mastery["lr"] === 1, "correct answer raised mastery.lr");
  s.send({ type: "next" }); // check → checkpoint → (policy) → challenge
  assert(s.activeBeatId() === "challenge", "policy routed a mastered learner to the challenge");
}

console.log("grad-descent: SETTLED-STATE — misconception adapts → remediate");
{
  const s = toDemo();
  s.send({ type: "next" }); // demo → check
  s.send({ type: "mcq.answer", payload: { choice: 1 } }); // "converges slowly" → misconception
  assert((s.context.misconceptions["lr-too-small-model"] ?? 0) >= 1, "wrong answer recorded a misconception");
  s.send({ type: "next" }); // check → checkpoint → (policy) → remediate
  assert(s.activeBeatId() === "remediate", "policy routed a misconception to remediation");
}

console.log("grad-descent: Back / Next revisit beats (untimed demos the scrubber can't reach)");
{
  const program = createVideoProgram(createSession(lesson, { policies: [policy] }));
  assert(program.transport.beatId === "intro", "starts at intro");
  assert(!program.canBack(), "no Back at the start");
  program.send({ type: "next" }); // intro → demo
  assert(program.transport.beatId === "demo" && program.canBack(), "advanced to demo; Back now available");
  program.back();
  assert(program.transport.beatId === "intro" && program.canForward(), "Back returned to intro; Next available");
  program.forward();
  assert(program.transport.beatId === "demo", "Next returned to demo");
  program.goToBeat("intro");
  assert(program.transport.beatId === "intro", "clicking a visited beat (goToBeat) revisits it");
  program.dispose();
}

console.log("\nGrad-descent acceptance passed — outbound viz channel, learner-paced tutoring, revisit nav.");
