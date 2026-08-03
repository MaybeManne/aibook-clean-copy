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
  /**
   * Optional: what playback is doing right now. Needed only by a learner-facing control — a
   * pause button has to say "Pause", "Resume" or "Replay", and only the sink knows which.
   */
  status?(): AudioStatus;
  /** Optional: fires whenever `status()` would change (play / pause / end / new clip). */
  subscribe?(listener: () => void): () => void;
}

/** A snapshot of playback, for rendering a control. */
export interface AudioStatus {
  /** A clip is selected (a silent beat has none). */
  loaded: boolean;
  /** Actively advancing right now. */
  playing: boolean;
  /** Ran to the end — a control should offer "replay", not "resume". */
  ended: boolean;
}

export const IDLE_STATUS: AudioStatus = { loaded: false, playing: false, ended: false };
