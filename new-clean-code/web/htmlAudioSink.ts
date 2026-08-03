import { IDLE_STATUS, type AudioSink, type AudioStatus, type NarrationAudio } from "@lessonstudio/audio";

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
        current = null;
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
      current?.play().catch(emit);
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
