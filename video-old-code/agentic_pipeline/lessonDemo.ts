// DEMO: the pizza fractions lesson, built with the Lesson object.
//
// notice what's gone vs the old example: no hand-built LessonContext, no raw
// RegistryEntry arrays, no `extra` field. the teacher just makes a Lesson, adds
// acts, and uses the prebuilt visual methods. math goes through lesson.latex().
//
// Run it:  npx tsx lessonDemo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


// 1) make the lesson — title + the problem text, that's it.
const lesson = new Lesson(
  "Pizza Fractions",
  "A pizza is cut into 8 equal slices. You and your friends eat 5 of them. How much of the pizza is left?"
);

// 2) add acts. data goes straight into the method calls (no context junk-drawer).
lesson
  .addAct("intro", (ctx) => ({
    text:
      "Let's figure out how much pizza is left.\n\n" +
      `${ctx.problemText}\n\n` +
      "We'll picture it, do the math, then check our answer.",
  }))
  .addAct("show_eaten", () => lesson.fractionBar(5, 8, "5/8 eaten"))
  // a new visual: the pizza as a pie chart, eaten vs left.
  .addAct("the_pie", () =>
    lesson.pieChart([
      { label: "eaten", value: 5, color: "#ef4444" },
      { label: "left", value: 3, color: "#22c55e" },
    ])
  )
  // a new visual: the solution as a numbered step list.\
  .addAct("the_steps", () =>
    lesson.stepList([
      "Start with the whole pizza: 8/8.",
      "Subtract the 5 slices eaten: 8/8 - 5/8.",
      "What's left is 3/8.",
    ])
  )
  .addAct("the_math", () => lesson.latex("\\frac{8 - 5}{8} = \\frac{3}{8}"))
  // a new visual: 3/8 marked on a number line from 0 to 1.
  .addAct("on_a_line", () => lesson.numberLine(0, 1, [0.375], ["3/8"]))
  .addAct("quick_check", () =>
    lesson.multipleChoice("So how much pizza is LEFT?", ["3/8", "5/8", "8/8", "1/8"], 0)
  )
  .addAct("graph", () => lesson.graph(["x^2 + y^2 = 25"]));


// 3) run the lesson as a state machine, then assemble the collected results.
// run() is async, and this repo compiles .ts to CommonJS (no "type":"module"),
// so we wrap it in a small async function instead of using top-level await.
async function main() {
  await lesson.run();
  const page = assembleLesson(lesson.getResults(), lesson.title);

  const out = path.join(import.meta.dirname, "lesson_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
