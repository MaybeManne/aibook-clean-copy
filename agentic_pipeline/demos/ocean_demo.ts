// DEMO — "ocean" preset: sine and cosine on the unit circle, focused long-form.
// Deep navy/teal, cyan accent — easy on the eyes for a long study session.
//
// Run it:  npx tsx demos/ocean_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Sine and Cosine",
  "On the unit circle, a point at angle θ has coordinates (cos θ, sin θ). What does that tell us about the two functions?"
);
lesson.setTemplate("ocean");

let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

// points stepping around the unit circle (quarter by quarter), with the two radii
// to 0 deg and 90 deg drawn in.
const CIRCLE: number[][] = [
  [1, 0], [0.87, 0.5], [0.5, 0.87], [0, 1],
  [-0.87, 0.5], [-1, 0], [0, -1], [0.5, -0.87],
];
const RADII: number[][][] = [[[0, 0], [1, 0]], [[0, 0], [0, 1]]];

lesson
  // intro — the unit circle itself.
  .addAct("intro", () => ({
    text:
      "Walk a point around a circle of radius 1. Its horizontal position is cos θ " +
      "and its vertical position is sin θ. Everything about these functions follows " +
      "from that picture.",
    jsCall: "showCoordinatePlane",
    jsArgs: { xRange: [-1.5, 1.5], yRange: [-1.5, 1.5], points: CIRCLE, lines: RADII },
  }))
  // the_values — the standard angles in a table.
  .addAct("the_values", () =>
    lesson.table(
      ["θ", "cos θ", "sin θ"],
      [
        ["0°", "1", "0"],
        ["30°", "0.87", "0.5"],
        ["45°", "0.71", "0.71"],
        ["60°", "0.5", "0.87"],
        ["90°", "0", "1"],
      ]
    )
  )
  // the_identity — the Pythagorean identity, quietly stated.
  .addAct("the_identity", () => ({
    text: "Because every point sits on a circle of radius 1, the coordinates always satisfy:",
    rawHtml: lesson.latex("\\sin^2\\theta + \\cos^2\\theta = 1").rawHtml,
  }))
  // check — THREE ZONES: the circle on the left, prompt on the right, question below.
  .addAct("check", () => ({
    ...lesson.multipleChoice("At θ = 90°, the point is at the top of the circle. What is sin(90°)?", ["1", "0", "0.5", "√2 / 2"], 0),
    text: "At 90° the point sits straight up at (0, 1). Since sin θ is the vertical coordinate, read it off directly.",
    rawHtml: vizLeft(
      lesson.coordinatePlane([-1.5, 1.5], [-1.5, 1.5], CIRCLE, RADII)
    ),
  }));


async function main() {
  await lesson.run();
  console.log(`final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "ocean_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
