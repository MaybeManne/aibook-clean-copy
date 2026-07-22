# Spec 07 — `audio/`

Text-to-speech narration + word-level subtitles + caching. Narration timing
*drives* a timed beat's duration, and a single clock keeps audio/visuals/captions
in sync. **Phase 2 — ✅ IMPLEMENTED** in `audio/`. Depends on `timeline` (Cue) +
`render_contract` (RichText) only.

Modules (as built): `tts.ts` (`TtsAdapter`/`WordTiming`/`NarrationAudio`),
`align.ts` (`charAlignmentToWords`), `subtitles.ts` (`toCaptions`/`captionCues`/
`activeCaption`), `cache.ts` (`narrationKey`/`fileCache`/`memoryCache`),
`elevenlabs.ts` (real adapter), `fake.ts` (deterministic test adapter),
`sink.ts` (`AudioSink`), `narrate.ts` (generic precompile), `index.ts`. The
`LessonSpec`-aware wrapper `prepareNarration` lives in `lesson/authoring` (lesson
may depend on audio). Chosen over the runtime-effect path: precompile keeps the
clock loop pure/deterministic.

---

## `tts.ts` — provider-agnostic synthesis with word timing

```ts
export interface WordTiming { word: string; start: number; end: number } // ms

export interface NarrationAudio {
  audio: ArrayBuffer | string;   // encoded bytes, or a URL/path to the cached file
  mime: string;                  // e.g. "audio/mpeg"
  durationMs: number;
  words: WordTiming[];           // word-level timestamps
}

export interface TtsAdapter {
  /** Synthesize one narration line. May be async (network). */
  synthesize(text: string, opts?: { voice?: string }): Promise<NarrationAudio>;
}
```

Providers are adapters (ElevenLabs like SocraticAI, or Azure — keys exist in the
embed-bench env; confirm at impl). The rest of the system depends only on
`TtsAdapter`, never a specific vendor.

---

## `subtitles.ts` — word timings → caption track

```ts
export interface CaptionSegment { text: RichText; start: number; end: number }

/** Group word timings into caption segments (by sentence / max length). Pure. */
export function toCaptions(words: WordTiming[], opts?: { maxChars?: number }): CaptionSegment[];

/** Convert a caption track into timeline `caption` cues for a Storyboard. Pure. */
export function captionCues(segments: CaptionSegment[]): Cue[];
```

---

## `cache.ts` — content-hash cache (survives re-runs)

```ts
export interface AudioCache {
  get(key: string): Promise<NarrationAudio | null>;
  put(key: string, audio: NarrationAudio): Promise<void>;
}
/** Stable key from narration text + voice (so identical lines reuse audio). */
export function narrationKey(text: string, voice?: string): string;
```

---

## How it plugs in (timing + sync)

- A timed beat with `narration` runs `TtsAdapter.synthesize` (cached); the
  resulting `durationMs` becomes the beat's `Storyboard.duration` (exact, not the
  word-count estimate SocraticAI used), and `captionCues(...)` are merged into the
  storyboard's `cues`.
- **Single-clock sync (the key anti-regression):** beat time `t` is authoritative.
  The audio element is *slaved* to `t` (on seek, set `audio.currentTime = t`).
  Visuals = `sampleAt(t)`; captions = `cuesUpTo(t)` filtered to `caption`. There is
  no independent audio clock, so there is no drift/race to recover from.
- Synthesis is an async **effect** (run by the Session's `EffectRunner`,
  spec 03), its result re-entering as an event — keeping the engine pure.

## Open items
- Voice/prosody controls; per-beat voice overrides.
- Streaming synthesis for long narration.
