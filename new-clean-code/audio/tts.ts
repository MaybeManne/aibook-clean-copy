// Provider-agnostic text-to-speech with word-level timing. The rest of the
// system depends only on `TtsAdapter`, never a specific vendor (ElevenLabs,
// Azure, …). Times are in MILLISECONDS everywhere in this layer.

export interface WordTiming {
  word: string;
  start: number; // ms from clip start
  end: number; // ms
}

export interface NarrationAudio {
  /** Encoded bytes (base64 string) or a URL/path to a cached file. */
  audio: string;
  mime: string; // e.g. "audio/mpeg"
  durationMs: number;
  words: WordTiming[]; // word-level timestamps
}

export interface SynthesizeOptions {
  voice?: string;
}

export interface TtsAdapter {
  /** Synthesize one narration line. May be async (network). */
  synthesize(text: string, opts?: SynthesizeOptions): Promise<NarrationAudio>;
}
