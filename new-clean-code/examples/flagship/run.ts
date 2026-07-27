// Headless acceptance for the interactive-first flagship: guided tasks gate the
// Continue button until accomplished, and the inline question adapts (wrong →
// remediation, right → challenge) — all through the pure state machine.
import { createSession, defineLesson } from "@lessonkit/lesson";
import type { RenderIntent } from "@lessonkit/render-contract";
import { lessonSpec, policy } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

const lesson = defineLesson(lessonSpec);
const fresh = () => createSession(lesson, { policies: [policy] });

function advanceTo(s: ReturnType<typeof fresh>, beatId: string): void {
  for (let i = 0; i < 24 && s.activeBeatId() !== beatId; i++) s.send({ type: "next" });
  assert(s.activeBeatId() === beatId, `reached "${beatId}"`);
}
function continueShown(s: ReturnType<typeof fresh>): boolean {
  const c = s.render().intents.find((i: RenderIntent) => i.kind === "controls") as { controls?: { key: string }[] } | undefined;
  return !!c?.controls?.some((k) => k.key === "__next");
}

console.log("flagship: guided task gates progress (learn-by-doing)");
{
  const s = fresh();
  advanceTo(s, "discover");
  assert(!continueShown(s), "Continue is HIDDEN until the task is done (θ=0)");
  s.send({ type: "demo.set", payload: { key: "theta", value: 310 } });
  assert((s.context.beats["discover"] as { theta?: number }).theta === 310, "drag recorded θ=310");
  assert(continueShown(s), "Continue APPEARS once the point is dragged around (goal met)");
}

console.log("flagship: WRONG answer adapts → remediation");
{
  const s = fresh();
  advanceTo(s, "check");
  s.send({ type: "mcq.answer", payload: { choice: 1 } }); // "0 (at the side)" → sin-cos-swap
  assert((s.context.misconceptions["sin-cos-swap"] ?? 0) >= 1, "misconception recorded");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "remediate", "policy routed wrong answer to remediation");
}

console.log("flagship: RIGHT answer adapts → challenge");
{
  const s = fresh();
  advanceTo(s, "check");
  s.send({ type: "mcq.answer", payload: { choice: 0 } }); // "−1 (bottom)" correct → mastery.sine
  assert(s.context.mastery["sine"] === 1, "mastery recorded");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "challenge", "policy routed correct answer to the challenge");
}

console.log("\nFlagship acceptance passed — guided tasks + inline check + adaptive routing.");
