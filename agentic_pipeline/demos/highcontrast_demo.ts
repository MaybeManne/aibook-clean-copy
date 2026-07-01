// DEMO — "highcontrast" preset: basic geometry (area and perimeter), built for
// accessibility. Pure black background, white text, electric-blue accent, large
// Arial type — high contrast end to end.
//
// Run it:  npx tsx demos/highcontrast_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Area and Perimeter of a Square",
  "A square has sides of length 5 units. Find its perimeter and its area."
);
lesson.setTemplate("highcontrast");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

// a 5x5 square: four corners and the four edges between them.
const SQUARE_POINTS: number[][] = [[0, 0], [5, 0], [5, 5], [0, 5]];
const SQUARE_EDGES: number[][][] = [
  [[0, 0], [5, 0]],
  [[5, 0], [5, 5]],
  [[5, 5], [0, 5]],
  [[0, 5], [0, 0]],
];

lesson
  // intro — the square drawn large on a grid.
  .addAct("intro", () => ({
    text:
      "A square has four equal sides. This one is 5 units on every side. We'll find " +
      "the distance around it (perimeter) and the space inside it (area).",
    jsCall: "showCoordinatePlane",
    jsArgs: { xRange: [-1, 6], yRange: [-1, 6], points: SQUARE_POINTS, lines: SQUARE_EDGES },
  }))
  // perimeter — add the four sides.
  .addAct("perimeter", () =>
    lesson.stepList([
      "Perimeter = the total length around the square.",
      "All four sides are equal: Perimeter = 4 × side.",
      "= 4 × 5 = 20 units.",
    ])
  )
  // area — side squared.
  .addAct("area", () => ({
    text: "Area is the space inside. For a square, multiply a side by itself:",
    rawHtml: lesson.latex("A = s^2 = 5^2 = 25 \\text{ square units}").rawHtml,
  }))
  // check — THREE ZONES: the square on the left, prompt right, question below.
  .addAct("check", () => ({
    ...lesson.multipleChoice("What is the area of a 5 × 5 square?", ["25", "20", "10", "50"], 0),
    text: "Area of a square is side times side. Multiply 5 by 5.",
    rawHtml: vizLeft(
      lesson.coordinatePlane([-1, 6], [-1, 6], SQUARE_POINTS, SQUARE_EDGES)
    ),
  }));


async function main() {
  await lesson.run();
  console.log(`final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "highcontrast_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
