// LAYER 2: end to end demo (TypeScript port of demo.py).
//
// Shows the whole flow: build a context, run the acts, assemble one HTML page.
//
// Run it:
//   node demo.ts             writes demo_lesson.html (the default lesson)
//   node demo.ts --preview   also writes demo_preview.html with the extra act
//                            types (multiple choice, slider, table)

import { writeFileSync } from "fs";
import * as path from "path";
import {
  runAllActs,
  multipleChoiceAct,
  sliderAct,
  tableAct,
} from "./actRegistry.ts";
import type { LessonContext, RegistryEntry } from "./actRegistry.ts";
import { assembleLesson } from "./layer2Assembler.ts";


// A throwaway registry just for --preview. these are the extra act types that
// aren't in actRegistry by default. handy to see them all at once.
const previewRegistry: RegistryEntry[] = [
  ["multiple_choice", multipleChoiceAct],
  ["slider", sliderAct],
  ["table", tableAct],
];


function main(): void {
  // the context every act receives. extra carries the per lesson numbers our
  // visual acts depend on (the fraction, the circle's radius).
  const ctx: LessonContext = {
    problemText:
      "A target is made of nested circles. If the radius of the outer circle " +
      "is 5, what does the region look like, and how much of it is shaded?",
    narrative: "We break the target into rings, measure each, and add them up.",
    plan: {},
    extra: {
      fraction: { numerator: 1, denominator: 4 },
      circleRadius: 5,
    },
  };

  // run every act in registry order, then stitch into one page.
  const acts = runAllActs(ctx);
  console.log(`Ran ${acts.length} acts: ${JSON.stringify(acts.map((a) => a.name))}`);

  const page = assembleLesson(acts, "Nested Circles - a Layer 2 demo lesson");
  const outPath = path.join(import.meta.dirname, "demo_lesson.html");
  writeFileSync(outPath, page);
  console.log(`Wrote ${outPath} (${page.length} bytes)`);

  // optional: render the extra act types so you can see what they do.
  if (process.argv.includes("--preview")) {
    const previewActs = runAllActs(ctx, previewRegistry);
    console.log(`Preview acts: ${JSON.stringify(previewActs.map((a) => a.name))}`);
    const previewPage = assembleLesson(previewActs, "Layer 2 extra act types preview");
    const previewPath = path.join(import.meta.dirname, "demo_preview.html");
    writeFileSync(previewPath, previewPage);
    console.log(`Wrote ${previewPath} (${previewPage.length} bytes)`);
  }
}

main();
