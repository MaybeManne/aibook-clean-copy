// Browser AudioSink backed by an HTMLAudioElement, per beat. The Player owns the
// clock; this sink is slaved to it — `seek(ms)` sets `currentTime`, so audio
// never runs on its own clock (no drift, the anti-regression from SocraticAI).
// Lives in render_web so the DOM stays out of the lesson/audio layers.

import type { AudioSink, NarrationAudio } from "@lessonkit/audio";

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
  let current: HTMLAudioElement | null = null;
  let rate = 1;

  return {
    setRate(r) {
      rate = r;
      if (current) current.playbackRate = r;
    },
    load(beatId, audio) {
      current?.pause();
      if (!audio || !audio.audio) {
        current = null; // no clip / silent beat
        return;
      }
      let el = cache.get(beatId);
      if (!el) {
        el = new Audio(srcFor(audio));
        el.preload = "auto";
        cache.set(beatId, el);
      }
      current = el;
      current.currentTime = 0;
      current.playbackRate = rate;
    },
    play() {
      if (current) current.playbackRate = rate;
      current?.play().catch(() => {});
    },
    pause() {
      current?.pause();
    },
    seek(ms) {
      if (current && current.readyState >= 1) current.currentTime = ms / 1000;
    },
  };
}
