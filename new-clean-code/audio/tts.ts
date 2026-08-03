export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface NarrationAudio {
  /** Encoded bytes (base64 string) or a URL/path to a cached file. */
  audio: string;
  mime: string;
  durationMs: number;
  words: WordTiming[];
}

export interface SynthesizeOptions {
  voice?: string;
}

export interface TtsAdapter {
  /** Synthesize one narration line. May be async (network). */
  synthesize(text: string, opts?: SynthesizeOptions): Promise<NarrationAudio>;
}
