// VISUAL TEST: exercise every prebuilt visual method that lessonDemo.ts doesn't.
//
// lessonDemo.ts already covers fractionBar, multipleChoice, latex, pieChart,
// stepList, numberLine, and graph. this file hits the other 11 — one act each,
// minimal but valid args — so we can eyeball that each one actually renders.
//
// Run it:  npx tsx visualTest.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";


// one lesson, one act per untested visual.
const lesson = new Lesson(
  "Visual Test",
  "Smoke test for the 11 prebuilt visuals not covered by lessonDemo."
);

lesson
  .addAct("number_line", () => lesson.numberLine(0, 10, [3, 7], ["3", "7"]))
  .addAct("coordinate_plane", () =>
    lesson.coordinatePlane([-5, 5], [-5, 5], [[1, 2], [-3, 4]], [[[0, 0], [4, 4]]])
  )
  .addAct("highlight", () => lesson.highlight("This is the key step.", "#fde047"))
  .addAct("step_list", () =>
    lesson.stepList(["First, set it up.", "Then, solve it.", "Finally, check it."])
  )
  .addAct("bar_chart", () =>
    lesson.barChart(["A", "B", "C"], [4, 7, 2], "Counts by group")
  )
  .addAct("venn_diagram", () =>
    lesson.vennDiagram(12, 8, 3, ["Set A", "Set B"])
  )
  .addAct("pie_chart", () =>
    lesson.pieChart([
      { label: "red", value: 3, color: "#ef4444" },
      { label: "blue", value: 5, color: "#3b82f6" },
    ])
  )
  .addAct("box_plot", () => lesson.boxPlot(1, 3, 5, 7, 9, "Sample spread"))
  .addAct("callout", () => lesson.callout("Remember to simplify!", "info"))
  .addAct("slider", () => lesson.slider("Pick a value", 0, 100, 5, 50))
  .addAct("table", () =>
    lesson.table(["Name", "Score"], [["Ana", 90], ["Ben", 75]])
  );


// run the lesson as a state machine, then assemble the collected results.
// run() is async and this repo compiles .ts to CommonJS (no "type":"module"),
// so we wrap it in a small async function instead of using top-level await.
async function main() {
  await lesson.run();
  const page = assembleLesson(lesson.getResults(), lesson.title);

  const out = path.join(import.meta.dirname, "visual_test.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
