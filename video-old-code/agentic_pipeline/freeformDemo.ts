// DEMO: a BRANCHING pizza fractions lesson, built on the freeform state machine.
//
// Instead of a fixed IDLE -> act0 -> act1 -> DONE chain, the graph branches and
// loops: the quick check sends a correct answer forward to the advanced topic, and
// a wrong answer back through a re-explanation and around to the check again.
//
//   intro -> quick_check
//   quick_check --correct--> advanced
//   quick_check --incorrect--> re_explain
//   re_explain -> quick_check        (loop back)
//   advanced -> DONE
//
// run() validates the graph, then we drive it by firing named triggers with step().
// This walk gets the check wrong once (showing the loop), then right.
//
// Run it:  npx tsx freeformDemo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


const lesson = new Lesson(
  "Pizza Fractions (branching)",
  "A pizza is cut into 8 equal slices. You eat 5 of them. How much is left?"
);
lesson.setTemplate("default");

// the acts.
lesson
  .addAct("intro", () => ({
    text: "A pizza is cut into 8 equal slices and 5 are eaten. Let's work out how much is left.",
    jsCall: "showFractionBar",
    jsArgs: { numerator: 5, denominator: 8, label: "5/8 eaten" },
  }))
  .addAct("quick_check", () =>
    lesson.multipleChoice("How much pizza is LEFT?", ["3/8", "5/8", "8/8", "1/8"], 0)
  )
  .addAct("re_explain", () => ({
    text: "Not quite. Start from the whole pizza and subtract what was eaten, then come back to the check.",
    jsCall: "showStepList",
    jsArgs: { steps: ["Whole pizza = 8/8", "Eaten = 5/8", "Left = 8/8 - 5/8 = 3/8"] },
  }))
  .addAct("advanced", () => ({
    text: "Correct. Now place 3/8 on a number line to see where it sits between 0 and 1.",
    jsCall: "showNumberLine",
    jsArgs: { min: 0, max: 1, points: [0.375], labels: ["3/8"] },
  }));

// the branching/looping transition graph.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "quick_check" });
lesson.addTransition("quick_check", { correct: "advanced", incorrect: "re_explain" });
lesson.addTransition("re_explain", { next: "quick_check" });
lesson.addTransition("advanced", { next: "DONE" });


async function main() {
  // run() validates the graph and enters the start act (intro). then we drive the
  // branches by hand: get it wrong, re-explain, loop back, then get it right.
  await lesson.run(); //               -> intro
  await lesson.step("next"); //        intro      -> quick_check
  await lesson.step("incorrect"); //   quick_check -> re_explain
  await lesson.step("next"); //        re_explain  -> quick_check  (loop back)
  await lesson.step("correct"); //     quick_check -> advanced
  await lesson.step("next"); //        advanced    -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "freeform_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
