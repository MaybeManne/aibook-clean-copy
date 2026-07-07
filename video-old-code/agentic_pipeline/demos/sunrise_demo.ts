// DEMO — "sunrise" preset: percentages in everyday life, warm and approachable.
// Soft cream background, amber accent — a gentle morning-study feel.
//
// Freeform LOOP: the student keeps trying the percentage question until they get
// it right, with a gentle nudge each time before finishing.
//   problem --correct--> solved --> DONE
//   problem --incorrect--> retry --> problem   (keep trying)
//
// Run it:  npx tsx demos/sunrise_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Percentages in Daily Life",
  "Your lunch costs $40 and you want to leave a 20% tip. How much is the tip, and what's the total?"
);
lesson.setTemplate("sunrise");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

// the bill split into the meal and the tip.
const SPLIT = [
  { label: "meal", value: 40, color: "#f59e0b" },
  { label: "tip", value: 8, color: "#22c55e" },
];

lesson
  // intro — the everyday scenario, with the bill shown as a pie.
  .addAct("intro", () => ({
    text:
      "Percentages show up every day — tips, discounts, sales tax. Let's figure " +
      "out a 20% tip on a $40 meal.",
    jsCall: "showPieChart",
    jsArgs: { slices: SPLIT },
  }))
  // what_is_percent — the core conversion, as steps.
  .addAct("what_is_percent", () =>
    lesson.stepList([
      "'Percent' means 'per 100', so 20% = 20/100.",
      "As a decimal, that's 0.20.",
      "To take a percent of a number, multiply: 0.20 × $40.",
    ])
  )
  // problem — THREE ZONES and the loop point: the bill pie on the left, prompt right,
  // question below. Keep looping until it's right.
  .addAct("problem", () => ({
    ...lesson.multipleChoice("How much is a 20% tip on a $40 meal?", ["$8", "$4", "$20", "$2"], 0),
    text: "Turn 20% into 0.20, then multiply by 40. The green slice on the left is the tip.",
    rawHtml: vizLeft(lesson.pieChart(SPLIT)),
  }))
  // retry — shown on a wrong answer: a warm nudge, then loop back to the problem.
  .addAct("retry", () => ({
    ...lesson.callout("No worries — 20% is one fifth. One fifth of $40 is $40 ÷ 5.", "info"),
    text: "Not quite, but you're close! Try thinking of 20% as 'one fifth', then split $40 into 5 equal parts.",
  }))
  // solved — reached once the answer is right; add the tip back for the total.
  .addAct("solved", () => ({
    ...lesson.highlight("Nice! 20% of $40 = $8, so the total is $48."),
    text: "You take the percent as a decimal, multiply, then add the tip back onto the bill.",
  }));

// the loop: keep trying the problem until it's correct, then finish.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "what_is_percent" });
lesson.addTransition("what_is_percent", { next: "problem" });
lesson.addTransition("problem", { correct: "solved", incorrect: "retry" });
lesson.addTransition("retry", { next: "problem" });
lesson.addTransition("solved", { next: "DONE" });


async function main() {
  // walk (student input hardcoded): miss it once, take the nudge, then get it right.
  await lesson.run(); //              -> intro
  await lesson.step("next"); //       intro          -> what_is_percent
  await lesson.step("next"); //       what_is_percent -> problem
  await lesson.step("incorrect"); //  problem        -> retry
  await lesson.step("next"); //       retry          -> problem   (keep trying)
  await lesson.step("correct"); //    problem        -> solved
  await lesson.step("next"); //       solved         -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "sunrise_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
