// DEMO 2: BRANCHING BY DIFFICULTY.
//
// The lesson splits based on what the student says about their comfort level: an
// "easy" answer takes a short path, a "hard" answer takes a fuller explanation.
// Both rejoin at a final check, which loops back through a re-explanation until
// the student gets it right.
//
//   intro -> difficulty_check
//   difficulty_check --easy--> easy_explanation
//   difficulty_check --hard--> hard_explanation
//   easy_explanation -> final_check
//   hard_explanation -> final_check
//   final_check --correct--> DONE
//   final_check --incorrect--> re_explain
//   re_explain -> final_check        (loop back)
//
// Shows: branching into different paths based on student input.
//
// Run it:  npx tsx freeformDemo2.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


const lesson = new Lesson(
  "Pizza Fractions (branch by difficulty)",
  "A pizza has 8 equal slices. 5 are eaten, so 3 are left. How much is that as a fraction?"
);
lesson.setTemplate("default");

lesson
  .addAct("intro", () => ({
    text: "A pizza has 8 slices and 5 were eaten. Let's find out how much is left.",
    jsCall: "showFractionBar",
    jsArgs: { numerator: 5, denominator: 8, label: "5/8 eaten" },
  }))
  .addAct("difficulty_check", () =>
    lesson.multipleChoice(
      "How comfortable are you with fractions?",
      ["Easy — I've got this", "Hard — I need a walkthrough"],
      0
    )
  )
  .addAct("easy_explanation", () => ({
    text: "Quick version: 8 total minus 5 eaten leaves 3, so 3 out of 8 is 3/8.",
    jsCall: "showStepList",
    jsArgs: { steps: ["8 total, 5 eaten", "8 - 5 = 3 left", "3 out of 8 = 3/8"] },
  }))
  .addAct("hard_explanation", () => ({
    text: "Let's go slowly. The bottom number is the total slices; the top is how many we care about (the ones left).",
    jsCall: "showStepList",
    jsArgs: {
      steps: [
        "The pizza was cut into 8 equal slices -> denominator is 8",
        "5 slices were eaten, so 8 - 5 = 3 slices remain",
        "3 remaining slices out of 8 total -> numerator is 3",
        "Put together: 3/8",
      ],
    },
  }))
  .addAct("final_check", () =>
    lesson.multipleChoice("So how much pizza is LEFT?", ["3/8", "5/8", "1/8", "8/8"], 0)
  )
  .addAct("re_explain", () => ({
    ...lesson.highlight("Left = total - eaten = 8 - 5 = 3, written as 3/8"),
    text: "Not quite. Count the slices that are NOT eaten, then put that over 8.",
  }));

// the branching graph.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "difficulty_check" });
lesson.addTransition("difficulty_check", { easy: "easy_explanation", hard: "hard_explanation" });
lesson.addTransition("easy_explanation", { next: "final_check" });
lesson.addTransition("hard_explanation", { next: "final_check" });
lesson.addTransition("final_check", { correct: "DONE", incorrect: "re_explain" });
lesson.addTransition("re_explain", { next: "final_check" });


async function main() {
  // walk: the student picks "hard", then gets the final check wrong once (looping
  // through re_explain) before getting it right.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro            -> difficulty_check
  await lesson.step("hard"); //       difficulty_check -> hard_explanation
  await lesson.step("next"); //       hard_explanation -> final_check
  await lesson.step("incorrect"); //  final_check      -> re_explain
  await lesson.step("next"); //       re_explain       -> final_check  (loop back)
  await lesson.step("correct"); //    final_check      -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "freeform_demo2.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
