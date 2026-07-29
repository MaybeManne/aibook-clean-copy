// ElevenLabs TTS adapter — the proven SocraticAI path (generate_audio.py):
// POST /text-to-speech/{voice}/with-timestamps → base64 audio + character
// alignment, which charAlignmentToWords turns into word timings. Node/global
// `fetch`; no extra dependency.

import { alignmentDurationMs, charAlignmentToWords, type CharAlignment } from "./align.js";
import type { NarrationAudio, SynthesizeOptions, TtsAdapter } from "./tts.js";

const API_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE = "pNInz6obpgDQGcFmaJgB"; // Adam — clear male narration
const DEFAULT_MODEL = "eleven_multilingual_v2";
const VOICE_SETTINGS = { stability: 0.6, similarity_boost: 0.75, style: 0.1, use_speaker_boost: true };

export interface ElevenLabsOptions {
  apiKey: string;
  voice?: string;
  model?: string;
}

interface TimestampsResponse {
  audio_base64?: string;
  alignment?: CharAlignment;
  normalized_alignment?: CharAlignment;
}

export function elevenLabsAdapter(opts: ElevenLabsOptions): TtsAdapter {
  const model = opts.model ?? DEFAULT_MODEL;
  return {
    async synthesize(text: string, o: SynthesizeOptions = {}): Promise<NarrationAudio> {
      const voice = o.voice ?? opts.voice ?? DEFAULT_VOICE;
      const resp = await fetch(`${API_BASE}/${voice}/with-timestamps`, {
        method: "POST",
        headers: { "xi-api-key": opts.apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ text, model_id: model, voice_settings: VOICE_SETTINGS }),
      });
      if (!resp.ok) {
        throw new Error(`ElevenLabs API error ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
      }
      const data = (await resp.json()) as TimestampsResponse;
      const al = data.alignment ?? data.normalized_alignment ?? { characters: [], character_start_times_seconds: [], character_end_times_seconds: [] };
      return {
        audio: data.audio_base64 ?? "",
        mime: "audio/mpeg",
        durationMs: alignmentDurationMs(al),
        words: charAlignmentToWords(al),
      };
    },
  };
}
