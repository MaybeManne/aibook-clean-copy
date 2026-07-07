// DEMO — "notion" preset: an introduction to calculus derivatives, calm and
// document-like. Warm off-white, serif title, Inter body.
//
// Freeform RETRY LOOP: the student gets three attempts at the same derivative
// question, with a fuller hint after each miss, then moves on either way.
//   attempt1 --incorrect--> hint1 --> attempt2 --incorrect--> hint2 --> attempt3
//   any --correct--> mastered;  attempt3 --incorrect--> mastered (move on)
//
// Run it:  npx tsx demos/notion_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "An Introduction to Derivatives",
  "A derivative measures how fast a function is changing. How do we find the slope of a curve at a single point?"
);
lesson.setTemplate("notion");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

// a few points along y = x^2, plus a tangent line at x = 1 (slope 2 through (1,1)).
const PARABOLA: number[][] = [[-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4]];
const TANGENT: number[][][] = [[[-0.5, -2], [2.5, 4]]];

// one attempt slide: the curve on the left, a prompt on the right, the choices
// along the bottom. `prompt` changes so each retry reads a little differently.
const attempt = (prompt: string) => () => ({
  ...lesson.multipleChoice("Using the power rule, what is d/dx of x^3?", ["3x^2", "x^2", "3x", "x^3 / 3"], 0),
  text: prompt,
  rawHtml: vizLeft(lesson.coordinatePlane([-3, 3], [-1, 5], PARABOLA, TANGENT)),
});

lesson
  // intro — the idea of a changing rate, with the curve sketched on a plane.
  .addAct("intro", () => ({
    text:
      "Think of driving: your speed is how fast your position changes. The " +
      "derivative captures exactly that idea for any function, at any instant.",
    jsCall: "showCoordinatePlane",
    jsArgs: { xRange: [-3, 3], yRange: [-1, 5], points: PARABOLA, lines: TANGENT },
  }))
  // the_limit — the formal definition, set quietly in math.
  .addAct("the_limit", () => ({
    text: "Formally, the derivative is the slope of the line between two points as they slide together:",
    rawHtml: lesson.latex("f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}").rawHtml,
  }))
  // power_rule — a clean shortcut, as steps.
  .addAct("power_rule", () =>
    lesson.stepList([
      "The power rule: d/dx of x^n is n · x^(n-1).",
      "For f(x) = x^2, that gives f'(x) = 2x.",
      "At x = 1, the slope is 2 — the tangent line on the left.",
    ])
  )
  // three attempts at the same question, each prompt a touch more direct.
  .addAct("attempt1", attempt("Apply the power rule to x^3. Take your first try."))
  .addAct("hint1", () => ({
    ...lesson.callout("The power rule brings the exponent down to the front as a coefficient.", "info"),
    text: "Not quite. For x^n, the n moves in front. Keep that in mind and try again.",
  }))
  .addAct("attempt2", attempt("With the exponent moved to the front, what do you get?"))
  .addAct("hint2", () => ({
    ...lesson.callout("For x^3: bring the 3 down, then lower the exponent by one -> 3 · x^2.", "warning"),
    text: "Still off. The 3 comes down as a coefficient and the new exponent is 3 - 1 = 2.",
  }))
  .addAct("attempt3", attempt("Last try: the 3 out front, the exponent one lower."))
  // mastered — reached on a correct answer, or after the third attempt either way.
  .addAct("mastered", () => ({
    ...lesson.highlight("d/dx of x^3 = 3x^2"),
    text: "The power rule in action: coefficient 3, exponent lowered to 2. The same move handles any power of x.",
  }));

// the retry graph: three attempts, progressive hints, then move on.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "the_limit" });
lesson.addTransition("the_limit", { next: "power_rule" });
lesson.addTransition("power_rule", { next: "attempt1" });
lesson.addTransition("attempt1", { correct: "mastered", incorrect: "hint1" });
lesson.addTransition("hint1", { next: "attempt2" });
lesson.addTransition("attempt2", { correct: "mastered", incorrect: "hint2" });
lesson.addTransition("hint2", { next: "attempt3" });
lesson.addTransition("attempt3", { correct: "mastered", incorrect: "mastered" });
lesson.addTransition("mastered", { next: "DONE" });


async function main() {
  // walk (student input hardcoded): miss the first two attempts (showing both
  // hints), land the third.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro     -> the_limit
  await lesson.step("next"); //       the_limit -> power_rule
  await lesson.step("next"); //       power_rule -> attempt1
  await lesson.step("incorrect"); //  attempt1  -> hint1
  await lesson.step("next"); //       hint1     -> attempt2
  await lesson.step("incorrect"); //  attempt2  -> hint2
  await lesson.step("next"); //       hint2     -> attempt3
  await lesson.step("correct"); //    attempt3  -> mastered
  await lesson.step("next"); //       mastered  -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "notion_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
