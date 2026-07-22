// AudioSink: the playback contract. The Player owns the single clock (beat time
// `t`) and SLAVES the sink to it (seek on scrub / beat-change), so there is no
// independent audio clock and no drift. Implementations: a no-op for headless
// runs; an HTMLAudioElement-backed sink in render_web for the browser.

import type { NarrationAudio } from "./tts.js";

export interface AudioSink {
  /** Select the clip for a beat (null = silence); resets playback position. */
  load(beatId: string, audio: NarrationAudio | null): void;
  play(): void;
  pause(): void;
  /** Slave the audio position to beat time `t` (ms). */
  seek(ms: number): void;
  /** Optional: match playback speed (1 = normal). */
  setRate?(rate: number): void;
}

export const noopSink: AudioSink = { load() {}, play() {}, pause() {}, seek() {} };
