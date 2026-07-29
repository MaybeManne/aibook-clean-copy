// Lesson-layer narration precompile. Walks a LessonSpec and synthesizes narration
// for every beat that carries a `narration` script:
//   • animated ("scene") beats — the storyboard's duration is rewritten to the
//     audio length and caption cues are baked in (audio slaved to the beat clock);
//   • interactive ("explorable"/"explain") beats — UNTIMED, so there's no clock to
//     drive: we synthesize audio + captions only and leave the beat untouched. The
//     AudioChannel plays such a clip once on beat entry (learner-paced, not timed).
// Returns a NEW spec (scene storyboards updated) plus the audio manifest + caption
// segments the Player and the video exporter consume. This is the offline step
// (like SocraticAI's generate_audio.py); it keeps the runtime engine/Player pure
// and deterministic.
//
// Layer note: `lesson` may depend on `audio` (both sit above `timeline`); the
// generic synthesis engine stays in `audio/`, this only maps it onto a LessonSpec.

import type { Json } from "@lessonstudio/state-machine";
import type { Storyboard } from "@lessonstudio/timeline";
import {
  narrate,
  type AudioManifest,
  type CaptionSegment,
  type NarrateOptions,
  type NarrationItem,
} from "@lessonstudio/audio";
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

/** Beat types whose narration is UNTIMED — synthesized to audio+captions, played on entry. */
const UNTIMED_NARRATED = new Set(["explorable", "explain"]);

/** Synthesize narration for a lesson's narrated beats. Async (network) — offline. */
export async function prepareNarration(spec: LessonSpec, opts: NarrateOptions): Promise<PreparedLesson> {
  const items: NarrationItem[] = [];
  for (const b of spec.flow) {
    const narration = (b.params as unknown as { narration?: string }).narration;
    if (!narration || !narration.trim()) continue;
    if (b.type === "scene") {
      // timed: carry the storyboard so its duration + caption cues get rewritten.
      items.push({ id: b.id, text: narration, storyboard: (b.params as unknown as SceneParams).storyboard });
    } else if (UNTIMED_NARRATED.has(b.type)) {
      // untimed: audio + captions only; the beat is left untouched (no clock).
      items.push({ id: b.id, text: narration });
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
