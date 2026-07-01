// DEMO 3: RETRY LOOP WITH MAX ATTEMPTS.
//
// The student gets three tries at the same question, with a fresh hint after each
// wrong answer. A correct answer at any point finishes; after the third attempt the
// lesson ends either way (we give up gracefully rather than loop forever).
//
//   intro -> attempt1
//   attempt1 --correct--> DONE
//   attempt1 --incorrect--> hint
//   hint -> attempt2
//   attempt2 --correct--> DONE
//   attempt2 --incorrect--> hint2
//   hint2 -> attempt3
//   attempt3 --correct--> DONE
//   attempt3 --incorrect--> DONE        (give up after 3 tries)
//
// Shows: a finite retry loop — 3 attempts with progressive hints.
//
// Run it:  npx tsx freeformDemo3.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


const lesson = new Lesson(
  "Pizza Fractions (3 tries)",
  "A pizza has 8 equal slices. 5 are eaten, so 3 are left. How much is that as a fraction?"
);
lesson.setTemplate("default");

const question = "How much pizza is LEFT?";
const options = ["3/8", "5/8", "1/8", "8/8"];

lesson
  .addAct("intro", () => ({
    text: "A pizza has 8 slices and 5 were eaten. You get three tries to name the fraction left.",
    jsCall: "showFractionBar",
    jsArgs: { numerator: 5, denominator: 8, label: "5/8 eaten" },
  }))
  .addAct("attempt1", () => lesson.multipleChoice(question, options, 0))
  .addAct("hint", () => ({
    ...lesson.highlight("Hint: count the slices that are NOT eaten."),
    text: "Try 1 didn't land. Look at how many slices remain on the pizza.",
  }))
  .addAct("attempt2", () => lesson.multipleChoice(question, options, 0))
  .addAct("hint2", () => ({
    text: "Try 2 didn't land either. Here's the arithmetic spelled out.",
    jsCall: "showStepList",
    jsArgs: { steps: ["8 slices total", "5 were eaten", "8 - 5 = 3 left", "3 over 8 = 3/8"] },
  }))
  .addAct("attempt3", () => lesson.multipleChoice(question, options, 0));

// the retry graph: each attempt either finishes or drops to a hint, capped at 3.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "attempt1" });
lesson.addTransition("attempt1", { correct: "DONE", incorrect: "hint" });
lesson.addTransition("hint", { next: "attempt2" });
lesson.addTransition("attempt2", { correct: "DONE", incorrect: "hint2" });
lesson.addTransition("hint2", { next: "attempt3" });
lesson.addTransition("attempt3", { correct: "DONE", incorrect: "DONE" });


async function main() {
  // walk: wrong on the first two attempts (showing both hints), right on the third.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro    -> attempt1
  await lesson.step("incorrect"); //  attempt1 -> hint
  await lesson.step("next"); //       hint     -> attempt2
  await lesson.step("incorrect"); //  attempt2 -> hint2
  await lesson.step("next"); //       hint2    -> attempt3
  await lesson.step("correct"); //    attempt3 -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "freeform_demo3.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
