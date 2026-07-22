// Headless acceptance for "Attention, felt". The canvas viz can't run without a DOM,
// so we (a) assert the shared PURE attention model directly, and (b) send the same
// events the viz emits to prove the tutor loop — real-time signal, settled-state
// policy, AND live generation with deterministic replay — all through the SM.

import { createSession, defaultRunner, defineLesson, generatingRunner, replay } from "@lessonkit/lesson";
import { toPlain } from "@lessonkit/render-contract";
import { attentionRow, peakedness, tokens, topTarget } from "./model.js";
import { fakeAuthor, lesson, lessonSpec, policy } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const CAT = tokens.indexOf("cat"); // 1
const IT = tokens.indexOf("it"); // 4

const runner = () => generatingRunner(fakeAuthor, defaultRunner());
function toExplore(): ReturnType<typeof createSession> {
  const s = createSession(lesson, { runner: runner(), policies: [policy] });
  s.send({ type: "next" }); // intro → explore
  return s;
}

console.log("attention/model: real softmax attention behaves");
{
  const row = attentionRow("semantic", IT, 0.6);
  assert(Math.abs(row.reduce((a, b) => a + b, 0) - 1) < 1e-9, "attention weights sum to 1 (softmax)");
  assert(topTarget("semantic", IT, 0.3) === CAT, "semantic head: “it” attends to “cat” (coreference)");
  assert(Math.abs(topTarget("positional", IT, 0.5) - IT) === 1, "positional head: “it” attends to a neighbour");
  assert(peakedness("semantic", IT, 0.2) > peakedness("semantic", IT, 3), "low τ is more focused than high τ");
}

console.log("attention/tutor: exploration is learner-paced — a viz signal never advances the beat");
{
  const s = toExplore();
  assert(s.activeBeatId() === "explore", "advanced intro → explore");
  s.send({ type: "signal.viz.uniform", payload: { temperature: 2.6 } }); // viz observed blurred attention…
  assert(s.activeBeatId() === "explore", "…but the learner stays on the explore beat (no teleport)");
}

console.log("attention/tutor: SETTLED-STATE — mcq adapts (challenge / remediation)");
{
  const right = toExplore();
  right.send({ type: "next" }); // explore → check
  right.send({ type: "mcq.answer", payload: { choice: 0 } }); // correct
  assert(right.context.mastery["temperature"] === 1, "correct answer raised mastery.temperature");
  right.send({ type: "next" }); // check → checkpoint → (policy) → challenge
  assert(right.activeBeatId() === "challenge", "policy routed a mastered learner to the challenge");

  const wrong = toExplore();
  wrong.send({ type: "next" });
  wrong.send({ type: "mcq.answer", payload: { choice: 1 } }); // "sharper" → misconception
  wrong.send({ type: "next" });
  assert(wrong.activeBeatId() === "remediate_temp", "policy routed a misconception to remediation");
}

console.log("attention/tutor: LIVE-AGENTIC — 'Explain this token' generates a bespoke beat");
{
  const s = toExplore();
  s.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner focuses “it” (as the viz would)
  s.send({ type: "demo.action", payload: { key: "explain" } }); // "Explain this token ✨"
  assert(s.activeBeatId() === "thinking", "moved to the thinking placeholder");
  await tick(); // author resolves → beat.generated
  assert(s.activeBeatId() === "gen-attention", "spliced + jumped into the generated explanation");
  const txt = s.render().intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
  assert(txt.includes("it") && txt.includes("cat"), "the generated beat explains the learner's ACTUAL focus (“it” → “cat”)");

  // Determinism: replay from history alone (fresh chart, no author) reproduces it.
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states["gen-attention"] === undefined, "fresh lesson has no generated beat");
  const r = replay(fresh, s.context.history);
  assert(r.activeBeatId() === "gen-attention", "REPLAY reconstructed the generated beat from history alone");
}

console.log("\nAttention flagship acceptance passed — real attention + learner-paced, settled-state, and live-agentic tutoring.");
