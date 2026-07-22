import "./figure.js"; // registers the "orbits" figure
import { writeFileSync } from "node:fs";
import { defineLesson } from "@lessonkit/lesson";
import { planFrames, resvgRasterizer } from "@lessonkit/render-video";
import { lessonSpec } from "./figure.js";
const plan = planFrames(defineLesson(lessonSpec), { fps: 30 });
const b = plan.beats[0]!;
const r = resvgRasterizer({ width: 640 });
for (const frac of [0.3, 0.65]) {
  const f = b.frames[Math.floor(b.frames.length * frac)]!;
  writeFileSync(`/tmp/fig-${frac}.png`, await r.svgToPng(f.svg));
}
console.log(`custom figure exported: ${b.frames.length} frames`);
