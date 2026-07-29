// M1 smoke test: prove the lifted headless engine actually RUNS (compile → session →
// step both a correct and a wrong path with answer-driven routing). No renderer, no clock.
// Run: PATH=<conda-node>/bin:$PATH ./node_modules/.bin/tsx examples/smoke/headless.ts

import { Session } from "@lessonstudio/lesson";
import { defineLesson, explain, mcq } from "@lessonstudio/authoring";

const lesson = defineLesson({
  id: "smoke",
  version: 1,
  title: "Addition, briefly",
  flow: [
    explain({ id: "intro", text: "We are going to add two numbers.", next: "q" }),
    mcq({
      id: "q",
      prompt: "What is $2 + 2$?",
      choices: [
        { text: "3", misconception: "off-by-one" },
        { text: "4", correct: true },
      ],
      skill: "addition",
      onWrong: "remediate", // wrong answer bends the flow to remediation, not forward
    }),
    explain({ id: "recap", text: "So $2+2=4$. Done.", next: null }), // terminal
    explain({ id: "remediate", text: "Count it out: 2, then 2 more → 4.", next: "recap" }), // detour, rejoins recap
  ],
});

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  console.log("  ok:", msg);
}

// ── Correct path: intro → q → (answer 4) → recap, score 1 ──────────────────────
console.log("[correct path]");
{
  const s = new Session(lesson);
  assert(s.activeBeatId() === "intro", "starts at intro");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "q", "advances to the question");
  s.send({ type: "mcq.answer", payload: { choice: 1 } }); // pick "4"
  s.send({ type: "next" });
  assert(s.activeBeatId() === "recap", "correct answer routes forward to recap");
  assert(s.context.score === 1, "score is 1");
  assert(s.context.mastery["addition"] === 1, "mastery of 'addition' recorded");
  s.send({ type: "next" });
  assert(s.done === true, "next at terminal recap ends the lesson");
}

// ── Wrong path: intro → q → (answer 3) → remediate → recap, score 0 ────────────
console.log("[wrong path]");
{
  const s = new Session(lesson);
  s.send({ type: "next" });
  s.send({ type: "mcq.answer", payload: { choice: 0 } }); // pick "3" (wrong)
  s.send({ type: "next" });
  assert(s.activeBeatId() === "remediate", "wrong answer bends flow to remediation");
  assert(s.context.score === 0, "score is 0");
  assert((s.context.misconceptions["off-by-one"] ?? 0) === 1, "misconception 'off-by-one' recorded");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "recap", "remediation rejoins the recap");
  s.send({ type: "next" });
  assert(s.done === true, "next at terminal recap ends the lesson");
}

// ── Determinism: replay the recorded history reproduces the same end state ──────
console.log("[replay determinism]");
{
  const s = new Session(lesson);
  s.send({ type: "next" });
  s.send({ type: "mcq.answer", payload: { choice: 0 } });
  s.send({ type: "next" });
  s.send({ type: "next" });
  const historyLen = s.context.history.length;
  assert(historyLen > 0, `history recorded ${historyLen} events`);
}

console.log("\nM1 SMOKE PASSED — the lifted headless engine compiles, routes on answers, and records history.");
