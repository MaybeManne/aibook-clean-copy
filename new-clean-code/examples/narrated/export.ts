// Phase 3 acceptance: the pure frame plan (sampleAt → SVG, captions burned in)
// is produced with ZERO native deps, so it runs in `npm test`. Actual mp4
// encoding is attempted only when @resvg/resvg-js + ffmpeg-static are installed.
import { defineLesson, prepareNarration } from "@lessonkit/lesson";
import { fakeTtsAdapter } from "@lessonkit/audio";
import { exportLesson, planFrames } from "@lessonkit/render-video";
import { lessonSpec } from "./lesson.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ FAILED: ${msg}`);
    process.exit(1);
  }
}

const prepared = await prepareNarration(lessonSpec, { adapter: fakeTtsAdapter() });
const lesson = defineLesson(prepared.spec);

// 1. Pure frame plan (no rasterizer, no encoder)
const plan = planFrames(lesson, { fps: 30, audio: prepared.audio, captions: prepared.captions });
assert(plan.beats.length === 1, `only the timed beat yields frames (got ${plan.beats.length})`);
assert(plan.totalFrames === 120, `4000ms × 30fps = 120 frames (got ${plan.totalFrames})`);

const first = plan.beats[0]!.frames[0]!;
assert(first.svg.includes("<circle"), "frame SVG draws the scene (circle)");
assert(first.svg.includes("Sunlight"), "caption is burned into the frame");
assert(!!plan.beats[0]!.audio, "beat carries its narration audio for muxing");
console.log(`✓ pure frame plan: ${plan.totalFrames} frames, captions burned in, audio attached`);

// 2. Real encode — only if the optional native deps resolve.
try {
  const [resvg, ffmpeg] = ["@resvg/resvg-js", "ffmpeg-static"];
  await import(/* @vite-ignore */ resvg!);
  await import(/* @vite-ignore */ ffmpeg!);
} catch {
  console.log("• skipping mp4 encode (install @resvg/resvg-js + ffmpeg-static to enable)");
  console.log("\nPhase 3 acceptance passed — frame-identical plan produced offline.");
  process.exit(0);
}

const { tmpdir } = await import("node:os");
const { join } = await import("node:path");
const { existsSync, statSync } = await import("node:fs");
const out = join(tmpdir(), "lessonkit-narrated-demo.mp4");
const res = await exportLesson(lesson, { path: out, fps: 30, audio: prepared.audio, captions: prepared.captions });
assert(existsSync(res.path) && statSync(res.path).size > 0, `mp4 written to ${res.path}`);
console.log(`✓ encoded mp4: ${res.path} (${(statSync(res.path).size / 1024).toFixed(0)} KB)`);

console.log("\nPhase 3 acceptance passed — offline mp4 export.");
