// DEMO — "technical" preset: binary search, explained mathematically, for a
// technical / developer audience. Dark, ultra-minimal, tight Inter type.
//
// Freeform BRANCHING: the check sends a correct answer on to the advanced view,
// and a wrong answer through a simpler, more concrete explanation before looping
// back to try the check again.
//   check --correct--> advanced --> DONE
//   check --incorrect--> simpler --> check   (retry)
//
// Run it:  npx tsx demos/technical_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Binary Search: O(log n)",
  "Why does binary search take only about log2(n) comparisons on a sorted array of n elements?"
);
lesson.setTemplate("technical");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

lesson
  // intro — the core idea, with a chart of how the search space shrinks.
  .addAct("intro", () => ({
    text:
      "Binary search probes the middle of a sorted range and discards half of it " +
      "each step. The search space collapses geometrically, not linearly.",
    jsCall: "showBarChart",
    jsArgs: { labels: ["start", "1 step", "2 steps", "3 steps"], values: [16, 8, 4, 2], title: "Search space halves each step" },
  }))
  // halving — the recurrence written out as steps.
  .addAct("halving", () =>
    lesson.stepList([
      "Begin with n candidates.",
      "Each comparison halves the range: n -> n/2 -> n/4 -> ...",
      "After k steps, n / 2^k candidates remain.",
      "Search ends when n / 2^k = 1.",
    ])
  )
  // the_math — solve for k.
  .addAct("the_math", () => ({
    text: "Solving n / 2^k = 1 for the number of steps k:",
    rawHtml: lesson.latex("2^k = n \\implies k = \\log_2 n").rawHtml,
  }))
  // check — THREE ZONES and the branch point: steps-vs-n chart left, explanation
  // right, MCQ bottom.
  .addAct("check", () => ({
    ...lesson.multipleChoice(
      "Worst-case comparisons to search 1024 sorted items?",
      ["10", "1024", "512", "20"],
      0
    ),
    text: "The step count is log2(n). Since 2^10 = 1024, a thousand-element array needs only about ten comparisons.",
    rawHtml: vizLeft(
      lesson.barChart(["n=8", "n=64", "n=1024"], [3, 6, 10], "Comparisons = log2(n)")
    ),
  }))
  // simpler — shown on a wrong answer: a concrete phone-book analogy, then loop back.
  .addAct("simpler", () => ({
    ...lesson.callout("Phone book with 1000 names: open the middle, decide which half holds your name, throw the other half away. Repeat.", "warning"),
    text: "Not quite. Each look throws away half the remaining names, so ~1000 shrinks to ~500, ~250, ~125 ... reaching 1 in about ten looks. Let's try the check again.",
  }))
  // advanced — shown on a correct answer: the recurrence and its consequence.
  .addAct("advanced", () => ({
    text: "Correct. Formally the cost obeys T(n) = T(n/2) + O(1), which unrolls to O(log n): doubling the input adds exactly one comparison.",
    rawHtml: lesson.latex("T(n) = T(n/2) + O(1) = O(\\log n)").rawHtml,
  }));

// the branching graph: correct -> advanced -> DONE; wrong -> simpler -> back to check.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "halving" });
lesson.addTransition("halving", { next: "the_math" });
lesson.addTransition("the_math", { next: "check" });
lesson.addTransition("check", { correct: "advanced", incorrect: "simpler" });
lesson.addTransition("simpler", { next: "check" });
lesson.addTransition("advanced", { next: "DONE" });


async function main() {
  // walk (student input hardcoded): miss the check once, see the simpler take, then
  // get it right and move on to the advanced view.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro     -> halving
  await lesson.step("next"); //       halving   -> the_math
  await lesson.step("next"); //       the_math  -> check
  await lesson.step("incorrect"); //  check     -> simpler
  await lesson.step("next"); //       simpler   -> check   (retry)
  await lesson.step("correct"); //    check     -> advanced
  await lesson.step("next"); //       advanced  -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "technical_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
