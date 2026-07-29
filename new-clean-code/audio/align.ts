// Character-level alignment → word-level timings. This is the alignment core
// LessonKit shares with SocraticAI (generate_audio.py:alignment_to_cues): TTS
// providers return per-character start/end times; we group runs of non-space
// characters into words, carrying each word's [start,end]. Pure.

import type { WordTiming } from "./tts.js";

/** ElevenLabs-shaped character alignment (seconds). */
export interface CharAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

const isSpace = (c: string): boolean => c === " " || c === "\n" || c === "\t";

/** Build word timings from character timing arrays. Seconds → ms. Pure. */
export function charAlignmentToWords(al: CharAlignment): WordTiming[] {
  const chars = al.characters ?? [];
  const starts = al.character_start_times_seconds ?? [];
  const ends = al.character_end_times_seconds ?? [];
  if (!chars.length) return [];

  const words: WordTiming[] = [];
  let current = "";
  let wordStart = 0;
  let wordEnd = 0;

  const flush = (): void => {
    if (current) words.push({ word: current, start: wordStart * 1000, end: wordEnd * 1000 });
    current = "";
  };

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    if (isSpace(ch)) {
      flush();
    } else {
      if (!current) wordStart = starts[i] ?? wordEnd;
      current += ch;
      wordEnd = ends[i] ?? wordStart;
    }
  }
  flush();
  return words;
}

/** Total clip duration (ms) implied by the last character end time. */
export function alignmentDurationMs(al: CharAlignment): number {
  const ends = al.character_end_times_seconds ?? [];
  return ends.length ? (ends[ends.length - 1] ?? 0) * 1000 : 0;
}
