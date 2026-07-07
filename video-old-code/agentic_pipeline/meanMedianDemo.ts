// DEMO: mean / median / mode as a slideshow where EVERY slide is a full two-column
// split — a visual on the left, the explanation on the right.
//
// dataset is [4, 7, 7, 9, 13]. the "default" template does all the styling and
// layout; each act = one slide. setTemplate("default") is the only template call.
//
// HOW BOTH COLUMNS GET FILLED. assembleAct routes the pieces of one act by type:
//   - act.text                                  -> RIGHT column
//   - a diagram jsCall (barChart, numberLine, pieChart) -> LEFT column
//   - a textual jsCall (stepList, table, highlight) or multipleChoice -> RIGHT column
//   - rawHtml: KaTeX -> RIGHT, anything else -> LEFT column
// An ActOutput has only ONE jsCall. When the right column needs a jsCall piece
// (stepList / table / highlight / mcq), that slot is taken, so we render the LEFT
// diagram as rawHtml (via vizLeft) instead. intro and mean don't need a jsCall on
// the right, so their chart can stay a plain jsCall.
//
// Run it:  npx tsx meanMedianDemo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


const lesson = new Lesson(
  "Mean, Median, and Mode",
  "Find the mean, median, and mode of the dataset [4, 7, 7, 9, 13]."
);

// the default template handles the dark, two-column slide layout.
lesson.setTemplate("default");

// the dataset, reused by several charts.
const LABELS = ["4", "7", "7", "9", "13"];
const VALUES = [4, 7, 7, 9, 13];

// render a diagram (the output of a Lesson visual method) as a left-column rawHtml
// block, leaving the act's jsCall slot free for the right-column piece.
let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

lesson
  // intro — barChart left (jsCall), text right.
  .addAct("intro", () => ({
    text:
      "Our dataset is [4, 7, 7, 9, 13]. The mean is the average, the median is " +
      "the middle value, and the mode is the most frequent value.",
    jsCall: "showBarChart",
    jsArgs: { labels: LABELS, values: VALUES, title: "Our Dataset" },
  }))
  // mean — barChart left (jsCall); steps as text + the equation in KaTeX (rawHtml) right.
  .addAct("mean", () => ({
    text:
      "Add all numbers: 4 + 7 + 7 + 9 + 13 = 40\n" +
      "Divide by count: 40 ÷ 5 = 8\n" +
      "Mean = 8",
    jsCall: "showBarChart",
    jsArgs: { labels: LABELS, values: VALUES, title: "Mean = 8" },
    rawHtml: lesson.latex("\\frac{4+7+7+9+13}{5} = 8").rawHtml,
  }))
  // median — numberLine left (rawHtml), stepList right (jsCall).
  .addAct("median", () => ({
    ...lesson.stepList([
      "Sort the numbers: 4, 7, 7, 9, 13",
      "Find the middle value (3rd of 5)",
      "Median = 7",
    ]),
    rawHtml: vizLeft(lesson.numberLine(0, 15, [4, 7, 7, 9, 13], ["4", "7", "7(median)", "9", "13"])),
  }))
  // mode — pieChart of the frequencies left (rawHtml), highlight + text right.
  .addAct("mode", () => ({
    ...lesson.highlight("Mode = 7 (appears twice)"),
    text: "The mode is the value that appears most often in the dataset.",
    rawHtml: vizLeft(
      lesson.pieChart([
        { label: "4", value: 1 },
        { label: "7", value: 2 },
        { label: "9", value: 1 },
        { label: "13", value: 1 },
      ])
    ),
  }))
  // summary — barChart left (rawHtml), results table right (jsCall).
  .addAct("summary", () => ({
    ...lesson.table(
      ["Measure", "Value"],
      [["Mean", "8"], ["Median", "7"], ["Mode", "7"]]
    ),
    rawHtml: vizLeft(lesson.barChart(LABELS, VALUES, "Our Dataset")),
  }))
  // check — barChart left (rawHtml), multiple choice right (jsCall -> mcq).
  .addAct("check", () => ({
    ...lesson.multipleChoice("What is the mean of [4, 7, 7, 9, 13]?", ["8", "7", "9", "40"], 0),
    rawHtml: vizLeft(lesson.barChart(LABELS, VALUES, "Our Dataset")),
  }));


// run the lesson, then assemble with the customized template. run() is async, and
// this repo compiles .ts to CommonJS (no "type":"module"), so we wrap it in main().
async function main() {
  await lesson.run();
  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());

  const out = path.join(import.meta.dirname, "mean_median_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
