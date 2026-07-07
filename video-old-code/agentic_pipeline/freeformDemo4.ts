// DEMO 4: MULTI-TOPIC WEB.
//
// The student chooses which part of the fraction to learn first, so the order of
// topics varies run to run. The numerator and denominator lessons link to each
// other, and either can lead on to the final check — there's no single fixed path.
//
//   intro -> topic_select
//   topic_select --numerator--> learn_numerator
//   topic_select --denominator--> learn_denominator
//   topic_select --both--> learn_both
//   learn_numerator --next--> learn_denominator
//   learn_denominator --next--> learn_numerator   (cover the other part)
//   learn_denominator --done--> final_check        (both parts covered)
//   learn_both --next--> final_check
//   final_check -> DONE
//
// Shows: a non-linear web where the order of topics can vary.
//
// Run it:  npx tsx freeformDemo4.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


const lesson = new Lesson(
  "Pizza Fractions (pick your path)",
  "A pizza has 8 equal slices. 5 are eaten, so 3 are left. How much is that as a fraction?"
);
lesson.setTemplate("default");

lesson
  .addAct("intro", () => ({
    text: "A pizza has 8 slices and 5 were eaten. A fraction has two parts — let's learn them in whatever order you like.",
    jsCall: "showFractionBar",
    jsArgs: { numerator: 5, denominator: 8, label: "5/8 eaten" },
  }))
  .addAct("topic_select", () =>
    lesson.multipleChoice(
      "What do you want to learn first?",
      ["Numerator", "Denominator", "Both"],
      0
    )
  )
  .addAct("learn_numerator", () => ({
    ...lesson.highlight("Numerator = 3 (the slices that are LEFT)"),
    text: "The numerator is the top number: how many slices we're counting. Here, 3 slices are left.",
  }))
  .addAct("learn_denominator", () => ({
    ...lesson.highlight("Denominator = 8 (the TOTAL slices)"),
    text: "The denominator is the bottom number: the size of the whole. The pizza was cut into 8 slices.",
  }))
  .addAct("learn_both", () => ({
    text: "Both parts at once: numerator over denominator.",
    jsCall: "showStepList",
    jsArgs: { steps: ["Numerator = 3 (slices left)", "Denominator = 8 (total slices)", "Fraction = 3/8"] },
  }))
  .addAct("final_check", () =>
    lesson.multipleChoice("So how much pizza is LEFT?", ["3/8", "5/8", "1/8", "8/8"], 0)
  );

// the web: topic_select fans out; the two single-topic lessons link to each other
// and on to the final check.
lesson.setStartAct("intro");
lesson.addTransition("intro", { next: "topic_select" });
lesson.addTransition("topic_select", {
  numerator: "learn_numerator",
  denominator: "learn_denominator",
  both: "learn_both",
});
lesson.addTransition("learn_numerator", { next: "learn_denominator" });
lesson.addTransition("learn_denominator", { next: "learn_numerator", done: "final_check" });
lesson.addTransition("learn_both", { next: "final_check" });
lesson.addTransition("final_check", { next: "DONE" });


async function main() {
  // walk: learn the numerator first, then the denominator, then finish — an order
  // that differs from the natural denominator-then-numerator reading.
  await lesson.run(); //               -> intro
  await lesson.step("next"); //        intro             -> topic_select
  await lesson.step("numerator"); //   topic_select      -> learn_numerator
  await lesson.step("next"); //        learn_numerator   -> learn_denominator
  await lesson.step("done"); //        learn_denominator -> final_check
  await lesson.step("next"); //        final_check       -> DONE

  console.log(`freeform mode: ${lesson.getFreeformMode()}, final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "freeform_demo4.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
