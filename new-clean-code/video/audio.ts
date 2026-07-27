// AudioChannel: makes audio a pure function of transport. The VideoProgram calls
// reconcile() after every tick/seek/play/pause — the channel loads the right clip
// on beat change, slaves the sink position to beat time (tolerance-gated so ticks
// don't stutter; forced on explicit seeks), and matches play/pause. This is the
// single-clock invariant, encapsulated. Depends on the audio layer only.

import type { AudioManifest, AudioSink } from "@lessonkit/audio";
import type { TransportState } from "./transport.js";

export interface AudioChannel {
  /** Idempotently bring the sink in line with transport. `force` re-seeks now. */
  reconcile(t: TransportState, force?: boolean): void;
  dispose(): void;
}

const SEEK_TOLERANCE_MS = 80;

export function createAudioChannel(sink: AudioSink, manifest: AudioManifest): AudioChannel {
  let loadedBeat: string | null = null;
  let lastSeek = 0;
  let wasPlaying = false;

  return {
    reconcile(t, force = false) {
      // 1. load the clip when the beat changes (null = silence for that beat)
      if (t.beatId !== loadedBeat) {
        loadedBeat = t.beatId;
        sink.load(t.beatId, manifest[t.beatId] ?? null);
        sink.seek(t.tInBeat);
        lastSeek = t.tInBeat;
        wasPlaying = false; // force a play() below if we should be playing
      }
      // 2. slave position to beat time — forced on seeks, tolerance-gated otherwise
      if (force || Math.abs(t.tInBeat - lastSeek) > SEEK_TOLERANCE_MS) {
        sink.seek(t.tInBeat);
        lastSeek = t.tInBeat;
      }
      // 3. match play/pause
      if (t.playing && !t.atGate && !t.done) {
        if (!wasPlaying) { sink.play(); wasPlaying = true; }
      } else if (wasPlaying) {
        sink.pause();
        wasPlaying = false;
      }
    },
    dispose() {
      sink.pause();
    },
  };
}
