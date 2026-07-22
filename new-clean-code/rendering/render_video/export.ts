// exportLesson: the offline mp4 pipeline. planFrames (pure) → rasterize each
// frame to PNG (adapter) → concatenate per-beat audio → encode (adapter). Because
// it reuses the same sampleAt/snapshotToSvg as the interactive Player, the export
// is frame-identical to the preview. Rasterizer + encoder are injectable so tests
// can run the pure plan without any native dependency.

import type { CompiledLesson } from "@lessonkit/lesson";
import { planFrames, type FramePlan, type PlanOptions } from "./frames.js";
import { resvgRasterizer, type Rasterizer } from "./rasterize.js";
import { ffmpegEncoder, type AudioClip, type Encoder } from "./encode.js";

export interface ExportOptions extends PlanOptions {
  path: string; // output .mp4 path
  rasterizer?: Rasterizer;
  encoder?: Encoder;
}

function decodeAudio(a: { audio: string; mime: string }): AudioClip | null {
  if (!a.audio) return null;
  // A bare file path/URL can't be muxed inline; base64 (which contains "/") can.
  if (/^(https?:|blob:|\/)/.test(a.audio) || /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(a.audio)) return null;
  const b64 = a.audio.startsWith("data:") ? a.audio.slice(a.audio.indexOf(",") + 1) : a.audio;
  return { bytes: Buffer.from(b64, "base64"), mime: a.mime };
}

/** Render a prepared lesson to an mp4. Requires @resvg/resvg-js + ffmpeg-static. */
export async function exportLesson(lesson: CompiledLesson, opts: ExportOptions): Promise<{ path: string; plan: FramePlan }> {
  const plan = planFrames(lesson, opts);
  const rasterizer = opts.rasterizer ?? resvgRasterizer(opts.size?.width ? { width: opts.size.width } : {});
  const encoder = opts.encoder ?? ffmpegEncoder();

  const frames: Uint8Array[] = [];
  const audio: AudioClip[] = [];
  for (const beat of plan.beats) {
    for (const f of beat.frames) frames.push(await rasterizer.svgToPng(f.svg));
    if (beat.audio) {
      const clip = decodeAudio(beat.audio);
      if (clip) audio.push(clip);
    }
  }

  const { path } = await encoder.encode({
    fps: plan.fps,
    frames,
    audio,
    outPath: opts.path,
    ...(opts.size?.width ? { width: opts.size.width } : {}),
    ...(opts.size?.height ? { height: opts.size.height } : {}),
  });
  return { path, plan };
}
