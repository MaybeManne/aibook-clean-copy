// DEMO — "chalk" preset: long division, classic classroom feel. Chalkboard green,
// handwritten Patrick Hand type, chalk-yellow accent.
//
// Freeform BRANCHING: a correct answer finishes; a wrong answer detours through a
// different, easier worked example before looping back to the check.
//   check --correct--> solved --> DONE
//   check --incorrect--> other_example --> check   (retry)
//
// Run it:  npx tsx demos/chalk_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Long Division: 156 ÷ 12",
  "Work through 156 ÷ 12 one digit at a time, the way you would on the chalkboard."
);
lesson.setTemplate("chalk");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

lesson
  // intro — the problem and the plan.
  .addAct("intro", () => ({
    text:
      "Long division is just repeated 'how many times does it fit?' We'll divide " +
      "156 by 12, working left to right across the digits.",
    jsCall: "showCallout",
    jsArgs: { text: "Divide, multiply, subtract, bring down — then repeat.", style: "info" },
  }))
  // steps — the full worked division.
  .addAct("steps", () =>
    lesson.stepList([
      "12 into 15 goes 1 time. Write 1.  (1 × 12 = 12)",
      "15 − 12 = 3. Bring down the 6 to make 36.",
      "12 into 36 goes 3 times. Write 3.  (3 × 12 = 36)",
      "36 − 36 = 0. Nothing left over.",
      "Reading the top: the answer is 13.",
    ])
  )
  // the_math — the result in math.
  .addAct("the_math", () => ({
    text: "So our quotient is:",
    rawHtml: lesson.latex("156 \\div 12 = 13").rawHtml,
  }))
  // check — THREE ZONES and the branch point: the working as a table on the left,
  // prompt right, question along the bottom.
  .addAct("check", () => ({
    ...lesson.multipleChoice("What is 156 ÷ 12?", ["13", "12", "14", "11"], 0),
    text: "Follow the two rounds of work on the left, then read the digits across the top.",
    rawHtml: vizLeft(
      lesson.table(
        ["Round", "Bring down", "Fits", "Left"],
        [
          ["12 into 15", "—", "1", "3"],
          ["12 into 36", "6", "3", "0"],
        ]
      )
    ),
  }))
  // other_example — shown on a wrong answer: a smaller, cleaner division worked all
  // the way through, then loop back to the check.
  .addAct("other_example", () => ({
    ...lesson.stepList([
      "Let's warm up on an easier one: 84 ÷ 12.",
      "12 into 8 doesn't go, so look at 84 together.",
      "12 × 7 = 84 exactly, so 84 ÷ 12 = 7.",
      "Same moves work for 156 ÷ 12 — head back and try again.",
    ]),
    text: "Not quite. Let's slow down with a smaller problem, then return to 156 ÷ 12.",
  }))
  // solved — reached only on a correct answer; check by multiplying back.
  .addAct("solved", () => ({
    ...lesson.highlight("Correct! And 13 × 12 = 156, so it checks out."),
    text: "Multiplying the answer by the divisor returns the number you started with — a quick way to be sure.",
  }));

// the branching graph: correct -> solved -> DONE; wrong -> other_example -> check.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "steps" });
lesson.addTransition("steps", { next: "the_math" });
lesson.addTransition("the_math", { next: "check" });
lesson.addTransition("check", { correct: "solved", incorrect: "other_example" });
lesson.addTransition("other_example", { next: "check" });
lesson.addTransition("solved", { next: "DONE" });


async function main() {
  // walk (student input hardcoded): miss the check once, work the easier example,
  // then get it right.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro         -> steps
  await lesson.step("next"); //       steps         -> the_math
  await lesson.step("next"); //       the_math      -> check
  await lesson.step("incorrect"); //  check         -> other_example
  await lesson.step("next"); //       other_example  -> check   (retry)
  await lesson.step("correct"); //    check         -> solved
  await lesson.step("next"); //       solved        -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "chalk_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
