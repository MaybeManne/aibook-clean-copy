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
      onWrong: "remediate",
    }),
    explain({ id: "recap", text: "So $2+2=4$. Done.", next: null }),
    explain({ id: "remediate", text: "Count it out: 2, then 2 more → 4.", next: "recap" }),
  ],
});

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  console.log("  ok:", msg);
}

console.log("[correct path]");
{
  const s = new Session(lesson);
  assert(s.activeBeatId() === "intro", "starts at intro");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "q", "advances to the question");
  s.send({ type: "mcq.answer", payload: { choice: 1 } });
  s.send({ type: "next" });
  assert(s.activeBeatId() === "recap", "correct answer routes forward to recap");
  assert(s.context.score === 1, "score is 1");
  assert(s.context.mastery["addition"] === 1, "mastery of 'addition' recorded");
  s.send({ type: "next" });
  assert(s.done === true, "next at terminal recap ends the lesson");
}

console.log("[wrong path]");
{
  const s = new Session(lesson);
  s.send({ type: "next" });
  s.send({ type: "mcq.answer", payload: { choice: 0 } });
  s.send({ type: "next" });
  assert(s.activeBeatId() === "remediate", "wrong answer bends flow to remediation");
  assert(s.context.score === 0, "score is 0");
  assert((s.context.misconceptions["off-by-one"] ?? 0) === 1, "misconception 'off-by-one' recorded");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "recap", "remediation rejoins the recap");
  s.send({ type: "next" });
  assert(s.done === true, "next at terminal recap ends the lesson");
}

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

console.log("\nSMOKE PASSED — the headless engine compiles, routes on answers, and records history.");
