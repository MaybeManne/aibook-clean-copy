// Offline narration precompile (generic core). Given narration jobs — each an
// id + text + its beat's Storyboard — synthesize (cached) and let narration
// DRIVE the timeline: the audio's exact length becomes the storyboard duration
// (not SocraticAI's word-count estimate), and caption cues are merged in. Pure
// orchestration around one async adapter call; no clock, no DOM. Depends on
// timeline (Storyboard/Cue) only.

import type { Storyboard } from "@lessonkit/timeline";
import { memoryCache, narrationKey, type AudioCache } from "./cache.js";
import { captionCues, toCaptions, type CaptionSegment } from "./subtitles.js";
import type { NarrationAudio, TtsAdapter } from "./tts.js";

export interface NarrationItem {
  id: string;
  text: string;
  /**
   * The beat's storyboard, for TIMED (scene) beats: its duration is rewritten to
   * the audio length and caption cues are merged in. OMIT for untimed interactive
   * beats (explorable/explain) — they have no clock, so we synthesize audio +
   * captions only and leave the beat untouched (see the AudioChannel, which plays
   * an untimed beat's clip once on entry).
   */
  storyboard?: Storyboard;
}

/** id → synthesized audio (bytes stay here, out of the visual timeline). */
export type AudioManifest = Record<string, NarrationAudio>;

export interface PreparedNarration {
  /** id → storyboard with duration = audio length and caption cues merged. */
  storyboards: Record<string, Storyboard>;
  /** id → synthesized narration audio + word timings. */
  audio: AudioManifest;
  /** id → caption segments (for live word-highlight in Player / export). */
  captions: Record<string, CaptionSegment[]>;
}

export interface NarrateOptions {
  adapter: TtsAdapter;
  cache?: AudioCache;
  voice?: string;
  maxWords?: number;
}

/** Synthesize each job and bind audio duration + captions into its storyboard. */
export async function narrate(items: NarrationItem[], opts: NarrateOptions): Promise<PreparedNarration> {
  const cache = opts.cache ?? memoryCache();
  const out: PreparedNarration = { storyboards: {}, audio: {}, captions: {} };

  for (const item of items) {
    const key = narrationKey(item.text, opts.voice);
    let na = await cache.get(key);
    if (!na) {
      na = await opts.adapter.synthesize(item.text, opts.voice ? { voice: opts.voice } : {});
      await cache.put(key, na);
    }
    const segments = toCaptions(na.words, { maxWords: opts.maxWords });
    out.audio[item.id] = na;
    out.captions[item.id] = segments;
    // Only timed beats carry a storyboard to rewrite; untimed ones get audio+captions.
    if (item.storyboard) {
      out.storyboards[item.id] = {
        ...item.storyboard,
        duration: na.durationMs || item.storyboard.duration,
        cues: [...(item.storyboard.cues ?? []), ...captionCues(segments)],
      };
    }
  }
  return out;
}
