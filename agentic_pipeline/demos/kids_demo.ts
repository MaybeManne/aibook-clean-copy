// DEMO — "kids" preset: shapes and colors, for very young children (ages 4-7).
// Bold primary colors, extra-large friendly Nunito type. Short, happy sentences.
//
// Freeform BRANCHING: get the question right and we celebrate; get it wrong and we
// re-explain in an even simpler way, then try again.
//   question --correct--> celebrate --> DONE
//   question --incorrect--> re_explain --> question   (try again)
//
// Run it:  npx tsx demos/kids_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Shapes and Colors",
  "Let's learn about shapes! A circle is round. A square has 4 sides. A triangle has 3 sides."
);
lesson.setTemplate("kids");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

lesson
  // intro — meet the three shapes. The bar shows 1 out of 3 filled in.
  .addAct("intro", () => ({
    text: "Look! Here are 3 shapes. A circle, a square, and a triangle. One box is filled in. That is 1 out of 3!",
    jsCall: "showFractionBar",
    jsArgs: { numerator: 1, denominator: 3, label: "1 out of 3 shapes" },
  }))
  // question — THREE ZONES: a bar on the left, the prompt on the right, the choices
  // along the bottom. Nice and simple.
  .addAct("question", () => ({
    ...lesson.multipleChoice("Which shape has 3 sides?", ["Triangle", "Circle", "Square"], 0),
    text: "A triangle has 3 sides. A circle has 0 sides. A square has 4 sides. Which one has 3?",
    rawHtml: vizLeft(lesson.fractionBar(3, 3, "count to 3!")),
  }))
  // re_explain — shown on a wrong answer, even simpler, then loop back.
  .addAct("re_explain", () => ({
    ...lesson.highlight("A triangle has 3 sides: 1, 2, 3!"),
    text: "That's okay! Let's count together. A triangle has 3 straight sides. Count them: 1, 2, 3. Now try again!",
  }))
  // celebrate — reached only when the answer is right.
  .addAct("celebrate", () => ({
    ...lesson.highlight("Yay! A triangle has 3 sides!"),
    text: "Great job! You found the triangle. You are a shape star!",
  }));

// the branching graph.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "question" });
lesson.addTransition("question", { correct: "celebrate", incorrect: "re_explain" });
lesson.addTransition("re_explain", { next: "question" });
lesson.addTransition("celebrate", { next: "DONE" });


async function main() {
  // walk (student input hardcoded): get it wrong once, see the simpler version, then
  // get it right and celebrate.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro      -> question
  await lesson.step("incorrect"); //  question   -> re_explain
  await lesson.step("next"); //       re_explain  -> question   (try again)
  await lesson.step("correct"); //    question   -> celebrate
  await lesson.step("next"); //       celebrate  -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "kids_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
