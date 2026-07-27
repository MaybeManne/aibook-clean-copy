// AudioChannel: makes audio a pure function of transport. The VideoProgram calls
// reconcile() after every tick/seek/play/pause. Two modes:
//   • TIMED beats (scenes): load the clip on beat change, slave the sink position to
//     beat time (tolerance-gated so ticks don't stutter; forced on explicit seeks),
//     and match play/pause. This is the single-clock invariant, encapsulated.
//   • UNTIMED beats (interactive explorable/explain): there is no clock — the clip is
//     a one-shot that plays when the learner ARRIVES at the beat. We fire it once on
//     entry and then leave it alone: no seek-slaving (so dragging a slider, which
//     re-emits at t=0, never restarts the narration) and no timeline play/pause gate
//     (the transport bar governs the timeline the beat doesn't have). Leaving the
//     beat stops it (the next beat's load() pauses the previous clip).
// Depends on the audio layer only.

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
      const clip = manifest[t.beatId] ?? null;

      // 1. load the clip when the beat changes (null = silence for that beat)
      if (t.beatId !== loadedBeat) {
        loadedBeat = t.beatId;
        sink.load(t.beatId, clip);
        sink.seek(0);
        lastSeek = 0;
        wasPlaying = false;
        // Untimed (interactive) beat: the clip is a one-shot — play it on ENTRY,
        // then fall through to the early return so nothing seeks/gates it after.
        if (!t.timed) {
          if (clip) { sink.play(); wasPlaying = true; }
          return;
        }
        sink.seek(t.tInBeat);
        lastSeek = t.tInBeat;
      }

      // Untimed beats have no clock and aren't driven by the transport: once the
      // entry play() has fired, later reconciles (slider edits, re-emits) are no-ops.
      if (!t.timed) return;

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
