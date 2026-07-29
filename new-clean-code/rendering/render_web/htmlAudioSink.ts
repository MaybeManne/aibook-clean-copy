// Browser AudioSink backed by an HTMLAudioElement, per beat. The Player owns the
// clock; this sink is slaved to it — `seek(ms)` sets `currentTime`, so audio
// never runs on its own clock (no drift, the anti-regression from SocraticAI).
// Lives in render_web so the DOM stays out of the lesson/audio layers.
//
// It also reports `status()` and `subscribe()`, which exist for exactly one caller: a
// learner-facing pause control. The element is the single source of truth there — the
// button's label is derived from `paused`/`ended` rather than from a mirrored React flag,
// so a clip that stalls, is blocked by autoplay policy, or ends on its own can never leave
// the UI claiming something the audio isn't doing.

import { IDLE_STATUS, type AudioSink, type AudioStatus, type NarrationAudio } from "@lessonstudio/audio";

// base64 contains "/" and "+", so a naive includes("/") misfires. Only treat the
// payload as a URL when it clearly is one; otherwise it's base64 → a data URL.
function isUrl(s: string): boolean {
  return /^(data:|https?:|blob:|\/|\.\/|\.\.\/)/.test(s) || /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(s);
}
function srcFor(a: NarrationAudio): string {
  return isUrl(a.audio) ? a.audio : `data:${a.mime};base64,${a.audio}`;
}

export function htmlAudioSink(): AudioSink {
  const cache = new Map<string, HTMLAudioElement>();
  const listeners = new Set<() => void>();
  let current: HTMLAudioElement | null = null;
  let rate = 1;

  const emit = (): void => {
    for (const l of listeners) l();
  };

  return {
    setRate(r) {
      rate = r;
      if (current) current.playbackRate = r;
    },
    load(beatId, audio) {
      current?.pause();
      if (!audio || !audio.audio) {
        current = null; // no clip / silent beat
        emit();
        return;
      }
      let el = cache.get(beatId);
      if (!el) {
        el = new Audio(srcFor(audio));
        el.preload = "auto";
        for (const ev of ["play", "playing", "pause", "ended"]) el.addEventListener(ev, emit);
        cache.set(beatId, el);
      }
      current = el;
      current.currentTime = 0;
      current.playbackRate = rate;
      emit();
    },
    play() {
      if (current) current.playbackRate = rate;
      current?.play().catch(emit); // a rejected play() (autoplay policy) must still refresh the UI
    },
    pause() {
      current?.pause();
    },
    seek(ms) {
      if (current && current.readyState >= 1) current.currentTime = ms / 1000;
    },
    status(): AudioStatus {
      if (!current) return IDLE_STATUS;
      return { loaded: true, playing: !current.paused && !current.ended, ended: current.ended };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
