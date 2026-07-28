// Web Speech AudioSink: audible narration with NO API key, using the browser's
// built-in speechSynthesis. It speaks each beat's narration text (reconstructed
// from the manifest's word list). Play/pause map to resume/pause; seeking mid-
// utterance isn't supported by the platform (no-op) — captions stay clock-driven.
// A no-key fallback; the primary path plays real synthesized audio via htmlAudioSink.

import { IDLE_STATUS, type AudioSink, type AudioStatus, type NarrationAudio } from "@lessonstudio/audio";

export interface SpeechSinkOptions {
  rate?: number; // 0.1–10, default 1
  pitch?: number;
  voiceName?: string; // substring match against available voices
}

export function speechSink(opts: SpeechSinkOptions = {}): AudioSink {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const listeners = new Set<() => void>();
  let text = "";
  let started = false;
  let done = false;

  const emit = (): void => {
    for (const l of listeners) l();
  };

  const pickVoice = (): SpeechSynthesisVoice | undefined => {
    if (!synth || !opts.voiceName) return undefined;
    return synth.getVoices().find((v) => v.name.toLowerCase().includes(opts.voiceName!.toLowerCase()));
  };

  return {
    load(_beatId: string, audio: NarrationAudio | null) {
      synth?.cancel();
      started = false;
      done = false;
      text = audio?.words?.map((w) => w.word).join(" ") ?? "";
      emit();
    },
    play() {
      if (!synth || !text) return;
      if (synth.paused && started) { synth.resume(); emit(); return; }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate ?? 1;
      if (opts.pitch != null) u.pitch = opts.pitch;
      const v = pickVoice();
      if (v) u.voice = v;
      u.onend = () => { done = true; emit(); };
      synth.speak(u);
      started = true;
      done = false;
      emit();
    },
    pause() {
      synth?.pause();
      emit();
    },
    seek() {
      /* speechSynthesis can't seek mid-utterance */
    },
    status(): AudioStatus {
      if (!synth || !text) return IDLE_STATUS;
      return { loaded: true, playing: started && !done && !synth.paused, ended: done };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
