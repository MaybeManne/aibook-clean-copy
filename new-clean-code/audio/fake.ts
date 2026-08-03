import type { NarrationAudio, SynthesizeOptions, TtsAdapter } from "./tts.js";
import type { WordTiming } from "./tts.js";

export interface FakeTtsOptions {
  /** words per second (default 2.5). */
  wps?: number;
}

export function fakeTtsAdapter(opts: FakeTtsOptions = {}): TtsAdapter {
  const wps = opts.wps ?? 2.5;
  const perWordMs = 1000 / wps;
  return {
    synthesize(text: string, _o: SynthesizeOptions = {}): Promise<NarrationAudio> {
      const tokens = text.split(/\s+/).filter(Boolean);
      const words: WordTiming[] = tokens.map((word, i) => ({
        word,
        start: Math.round(i * perWordMs),
        end: Math.round((i + 1) * perWordMs),
      }));
      const durationMs = Math.max(perWordMs, tokens.length * perWordMs);
      return Promise.resolve({ audio: "", mime: "audio/mpeg", durationMs, words });
    },
  };
}
