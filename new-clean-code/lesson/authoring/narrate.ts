// Lesson-layer narration precompile. Walks a LessonSpec, synthesizes narration
// for every animated ("scene") beat that carries a `narration` script, and
// returns a NEW spec whose storyboards have audio-driven durations + caption
// cues baked in — plus the audio manifest + caption segments the Player and the
// video exporter consume. This is the offline step (like SocraticAI's
// generate_audio.py); it keeps the runtime engine/Player pure and deterministic.
//
// Layer note: `lesson` may depend on `audio` (both sit above `timeline`); the
// generic synthesis engine stays in `audio/`, this only maps it onto a LessonSpec.

import type { Json } from "@lessonkit/state-machine";
import type { Storyboard } from "@lessonkit/timeline";
import {
  narrate,
  type AudioManifest,
  type CaptionSegment,
  type NarrateOptions,
  type NarrationItem,
} from "@lessonkit/audio";
import type { LessonSpec } from "../lesson_sm/compile.js";

export interface PreparedLesson {
  /** New spec — animated beats' storyboards carry baked duration + caption cues. */
  spec: LessonSpec;
  /** beatId → synthesized narration audio (bytes + word timings). */
  audio: AudioManifest;
  /** beatId → caption segments (live word-highlight in Player / export). */
  captions: Record<string, CaptionSegment[]>;
}

interface SceneParams {
  storyboard: Storyboard;
  slot?: string;
  narration?: string;
}

/** Synthesize narration for a lesson's animated beats. Async (network) — offline. */
export async function prepareNarration(spec: LessonSpec, opts: NarrateOptions): Promise<PreparedLesson> {
  const items: NarrationItem[] = [];
  for (const b of spec.flow) {
    if (b.type !== "scene") continue;
    const p = b.params as unknown as SceneParams;
    if (p.narration && p.narration.trim()) {
      items.push({ id: b.id, text: p.narration, storyboard: p.storyboard });
    }
  }

  const prepared = await narrate(items, opts);

  const flow = spec.flow.map((b) => {
    const sb = prepared.storyboards[b.id];
    if (!sb) return b;
    const params = { ...(b.params as unknown as SceneParams), storyboard: sb };
    return { ...b, params: params as unknown as Json };
  });

  return { spec: { ...spec, flow }, audio: prepared.audio, captions: prepared.captions };
}
