// EXAMPLE: a brand new lesson written by a teacher (port of example_custom_lesson.py).
//
// This is what YOU write to make a lesson. it's the input to the framework.
//
// Notice what's NOT here: no state machine, no assembler guts, no vizLib code.
// you just: import a few helpers, describe your problem, write a couple of act
// functions, list them, and run it.
//
// Run it:  node exampleCustomLesson.ts

import { writeFileSync } from "fs";
import * as path from "path";
import { runAllActs } from "./actRegistry.ts";
import type { LessonContext, ActOutput, RegistryEntry } from "./actRegistry.ts";
import { assembleLesson } from "./layer2Assembler.ts";


// 1) YOUR PROBLEM + ANY DATA YOUR VISUALS NEED.
// put numbers your acts care about into extra so the acts can read them.
const ctx: LessonContext = {
  problemText:
    "A pizza is cut into 8 equal slices. You and your friends eat 5 of them. " +
    "How much of the pizza is left?",
  extra: {
    slicesTotal: 8,
    slicesEaten: 5,
  },
};


// 2) YOUR ACTS.
// each act is a function: ctx in, ActOutput out. show words with text, and
// optionally a visual by naming a vizLib function in jsCall plus its jsArgs.

// just set up the problem in plain words. no visual.
function intro(ctx: LessonContext): ActOutput {
  return {
    text:
      "Let's figure out how much pizza is left.\n\n" +
      `${ctx.problemText}\n\n` +
      "We'll picture it first, then check our answer.",
  };
}

// draw a fraction bar of the slices that got eaten. numbers come from ctx.extra.
function showEaten(ctx: LessonContext): ActOutput {
  const eaten = ctx.extra?.slicesEaten ?? 0;
  const total = ctx.extra?.slicesTotal ?? 1;
  return {
    text: `Here's the ${eaten} out of ${total} slices that got eaten:`,
    jsCall: "showFractionBar",
    jsArgs: {
      numerator: eaten,
      denominator: total,
      label: `${eaten}/${total} eaten`,
    },
  };
}

// a multiple choice gut check. green if they pick right, red if not.
function quickCheck(ctx: LessonContext): ActOutput {
  return {
    text: "So how much pizza is LEFT?",
    jsCall: "showMultipleChoice",
    jsArgs: {
      question: "Pick the fraction of the pizza still on the table.",
      options: ["3/8", "5/8", "8/8", "1/8"],
      correctIndex: 0, // 8 - 5 = 3 slices left, so 3/8
    },
  };
}


// 3) YOUR RUNNING ORDER.
// a list of [name, function]. reorder, add, or remove lines to change the lesson.
const myLesson: RegistryEntry[] = [
  ["intro", intro],
  ["show_eaten", showEaten],
  ["quick_check", quickCheck],
];


// 4) RUN IT. same for every lesson, just leave it as is.
const acts = runAllActs(ctx, myLesson);
const page = assembleLesson(acts, "Pizza Fractions");
const out = path.join(import.meta.dirname, "example_custom_lesson.html");
writeFileSync(out, page);
console.log(`Wrote ${out} (${page.length} bytes)`);
