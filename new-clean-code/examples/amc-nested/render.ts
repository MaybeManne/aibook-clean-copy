// Render the animated (non-gate) scenes of the AMC lesson to PNG frames + an mp4,
// so the declarative visualization can be inspected/exported. Gates are
// interactive and excluded from the video. Requires @resvg/resvg-js + ffmpeg-static.
import { writeFileSync } from "node:fs";
import { defineLesson } from "@lessonkit/lesson";
import { exportLesson, planFrames, resvgRasterizer } from "@lessonkit/render-video";
import { preparedSpec, audioManifest, captions } from "./audio.gen.js"; // real ElevenLabs audio

const lesson = defineLesson(preparedSpec);
const prepared = { audio: audioManifest, captions };

const plan = planFrames(lesson, { fps: 30, audio: prepared.audio, captions: prepared.captions });
const all = plan.beats.flatMap((b) => b.frames.map((f) => ({ ...f, beat: b.beatId })));
console.log(`${plan.beats.length} animated scenes, ${plan.totalFrames} frames (${(plan.totalFrames / plan.fps).toFixed(1)}s)`);

const raster = resvgRasterizer({ width: 520 });
const picks = Array.from({ length: 6 }, (_, i) => Math.floor((i / 5) * (all.length - 1)));
for (let i = 0; i < picks.length; i++) {
  const f = all[picks[i]!]!;
  writeFileSync(`/tmp/amc-${i}.png`, await raster.svgToPng(f.svg));
  console.log(`  sample ${i}: ${f.beat} t=${Math.round(f.t)}ms → /tmp/amc-${i}.png`);
}
await exportLesson(lesson, { path: "/tmp/amc-nested.mp4", fps: 30, audio: prepared.audio, captions: prepared.captions });
console.log("mp4 → /tmp/amc-nested.mp4");
