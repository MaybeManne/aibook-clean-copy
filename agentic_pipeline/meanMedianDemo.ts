// DEMO: mean / median / mode, built with the Lesson object + the template system.
//
// dataset is [4, 7, 7, 9, 13]. the "default" template does all the layout work:
// a clean dark two-column slide per act (visual left, text right), so we just set
// it and add acts. no manual placement needed.
//
// Run it:  npx tsx meanMedianDemo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


// 1) make the lesson.
const lesson = new Lesson(
  "Mean, Median, and Mode",
  "Find the mean, median, and mode of the dataset [4, 7, 7, 9, 13]."
);

// 2) the default template handles the two-column dark layout automatically.
lesson.setTemplate("default");

// 3) add the acts.
lesson
  .addAct("intro", () => ({
    text:
      "Our dataset is [4, 7, 7, 9, 13].\n\n" +
      "The MEAN is the average: add everything up and divide by how many there are.\n\n" +
      "The MEDIAN is the middle value once the numbers are sorted.\n\n" +
      "The MODE is the value that shows up most often.",
  }))
  .addAct("dataset_chart", () =>
    lesson.barChart(["4", "7", "7", "9", "13"], [4, 7, 7, 9, 13], "Our Dataset")
  )
  .addAct("mean_steps", () =>
    lesson.stepList([
      "Add all the numbers: 4 + 7 + 7 + 9 + 13 = 40.",
      "Divide by the count: 40 ÷ 5 = 8.",
      "The mean is 8.",
    ])
  )
  .addAct("mean_math", () =>
    lesson.latex("\\frac{4+7+7+9+13}{5} = \\frac{40}{5} = 8")
  )
  .addAct("median_steps", () =>
    lesson.stepList([
      "Sort the numbers: 4, 7, 7, 9, 13.",
      "Find the middle value (the 3rd of 5).",
      "The median is 7.",
    ])
  )
  .addAct("number_line", () =>
    lesson.numberLine(0, 15, [4, 7, 9, 13], ["4", "7(median)", "9", "13"])
  )
  .addAct("mode_highlight", () => lesson.highlight("Mode = 7 (appears twice)"))
  .addAct("summary_table", () =>
    lesson.table(
      ["Measure", "Value"],
      [["Mean", "8"], ["Median", "7"], ["Mode", "7"]]
    )
  )
  .addAct("check", () =>
    lesson.multipleChoice(
      "What is the mean of [4, 7, 7, 9, 13]?",
      ["8", "7", "9", "40"],
      0
    )
  );


// 4) run the lesson, then assemble with the customized template. run() is async,
// and this repo compiles .ts to CommonJS (no "type":"module"), so we wrap it in a
// small async function instead of using top-level await.
async function main() {
  await lesson.run();
  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());

  const out = path.join(import.meta.dirname, "mean_median_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
