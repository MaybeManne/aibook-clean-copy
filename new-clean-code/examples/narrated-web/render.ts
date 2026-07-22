// Render the narrated explainer to an mp4 + dump sample PNG frames across the
// whole video (all four scenes). Requires @resvg/resvg-js + ffmpeg-static.
import { writeFileSync } from "node:fs";
import { defineLesson, prepareNarration } from "@lessonkit/lesson";
import { fakeTtsAdapter } from "@lessonkit/audio";
import { exportLesson, planFrames, resvgRasterizer } from "@lessonkit/render-video";
import { lessonSpec } from "./lesson.js";

const prepared = await prepareNarration(lessonSpec, { adapter: fakeTtsAdapter() });
const lesson = defineLesson(prepared.spec);

const plan = planFrames(lesson, { fps: 30, audio: prepared.audio, captions: prepared.captions });
const allFrames = plan.beats.flatMap((b) => b.frames.map((f) => ({ ...f, beat: b.beatId })));
console.log(`${plan.beats.length} scenes, ${plan.totalFrames} frames @ ${plan.fps}fps (${(plan.totalFrames / plan.fps).toFixed(1)}s)`);

// Dump 6 evenly spaced sample frames as PNG.
const raster = resvgRasterizer({ width: 960 });
const picks = Array.from({ length: 6 }, (_, i) => Math.floor((i / 5) * (allFrames.length - 1)));
for (let i = 0; i < picks.length; i++) {
  const f = allFrames[picks[i]!]!;
  writeFileSync(`/tmp/pv-${i}.png`, await raster.svgToPng(f.svg));
  console.log(`  sample ${i}: frame ${f.index} (${f.beat}, t=${Math.round(f.t)}ms) → /tmp/pv-${i}.png`);
}

const out = "/tmp/photosynthesis-video.mp4";
await exportLesson(lesson, { path: out, fps: 30, audio: prepared.audio, captions: prepared.captions });
console.log(`\nmp4 → ${out}`);
