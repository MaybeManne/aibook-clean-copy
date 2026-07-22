// Word timings → caption segments → timeline caption cues, plus the pure
// per-frame "which caption + which word is active at t" function shared by the
// interactive Player and the offline exporter (single clock; mirrors
// SocraticAI subtitles.js:_renderWords, but sampled from ONE beat clock `t`).

import { text, type RichText } from "@lessonkit/render-contract";
import type { Cue } from "@lessonkit/timeline";
import type { WordTiming } from "./tts.js";

export interface CaptionSegment {
  text: string;
  start: number; // ms
  end: number; // ms
  words: WordTiming[]; // absolute-time words in this segment
}

const SENTENCE_END = new Set([".", "!", "?", ";"]);

/** Group words into caption segments on sentence end or a max length. Pure. */
export function toCaptions(words: WordTiming[], opts: { maxWords?: number } = {}): CaptionSegment[] {
  const maxWords = opts.maxWords ?? 10;
  const segments: CaptionSegment[] = [];
  let cur: WordTiming[] = [];

  const flush = (): void => {
    if (!cur.length) return;
    segments.push({
      text: cur.map((w) => w.word).join(" "),
      start: cur[0]!.start,
      end: cur[cur.length - 1]!.end,
      words: cur,
    });
    cur = [];
  };

  for (const w of words) {
    cur.push(w);
    const last = w.word.trim().slice(-1);
    if ((last && SENTENCE_END.has(last)) || cur.length >= maxWords) flush();
  }
  flush();
  return segments;
}

/** Caption segments → timeline `caption` cues (baked into a storyboard). Pure. */
export function captionCues(segments: CaptionSegment[]): Cue[] {
  return segments.map((s) => ({ at: s.start, kind: "caption" as const, text: text(s.text) }));
}

/** The active caption at beat time `t` (ms), with word offsets for highlight. Pure. */
export function activeCaption(
  segments: CaptionSegment[],
  t: number,
): { text: RichText; words: WordTiming[]; active: number } | null {
  const seg = segments.find((s) => t >= s.start && t < s.end);
  if (!seg) return null;
  const active = seg.words.findIndex((w) => t >= w.start && t < w.end);
  return { text: text(seg.text), words: seg.words, active };
}
