// DEMO: the pizza fractions lesson, built with the Lesson object.
//
// notice what's gone vs the old example: no hand-built LessonContext, no raw
// RegistryEntry arrays, no `extra` field. the teacher just makes a Lesson, adds
// acts, and uses the prebuilt visual methods. math goes through lesson.latex().
//
// Run it:  npx tsx lessonDemo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { runAllActs } from "./actRegistry.ts";
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
  .addAct("the_math", () => lesson.latex("\\frac{8 - 5}{8} = \\frac{3}{8}"))
  .addAct("quick_check", () =>
    lesson.multipleChoice("So how much pizza is LEFT?", ["3/8", "5/8", "8/8", "1/8"], 0)
  );

// 3) run + assemble. toContext()/getRegistry() plug straight into the existing pipeline.
const acts = runAllActs(lesson.toContext(), lesson.getRegistry());
const page = assembleLesson(acts, lesson.title);

const out = path.join(import.meta.dirname, "lesson_demo.html");
writeFileSync(out, page);
console.log(`Wrote ${out} (${page.length} bytes)`);
