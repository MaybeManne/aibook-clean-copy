// Phase 2 acceptance: narration drives duration, caption cues are merged, the
// Player emits a word-highlighted caption intent, and the audio sink is slaved to
// the single clock. Uses the deterministic fakeTtsAdapter — no API key, no
// network — so it runs in `npm test`. A real ElevenLabs pass runs only when
// ELEVENLABS_API_KEY is set.
import { createSession, defineLesson, prepareNarration } from "@lessonkit/lesson";
import { createPlayer } from "@lessonkit/video";
import { elevenLabsAdapter, fakeTtsAdapter, type AudioSink, type NarrationAudio } from "@lessonkit/audio";
import { asCaptionIntent } from "@lessonkit/timeline";
import { lessonSpec } from "./lesson.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ FAILED: ${msg}`);
    process.exit(1);
  }
}

// Recording sink to prove the Player slaves audio to the clock.
const events: string[] = [];
const recordingSink: AudioSink = {
  load: (id, a: NarrationAudio | null) => events.push(`load:${id}:${a ? "audio" : "silent"}`),
  play: () => events.push("play"),
  pause: () => events.push("pause"),
  seek: (ms) => events.push(`seek:${Math.round(ms)}`),
};

const prepared = await prepareNarration(lessonSpec, { adapter: fakeTtsAdapter() });

// 1. narration drives duration + caption cues merged into the storyboard
const sb = (prepared.spec.flow[0]!.params as { storyboard: { duration: number; cues?: { kind: string }[] } }).storyboard;
assert(sb.duration === 4000, `duration driven by audio (10 words × 400ms = 4000, got ${sb.duration})`);
assert((sb.cues ?? []).some((c) => c.kind === "caption"), "caption cues merged into storyboard");
assert((prepared.captions.photo?.length ?? 0) === 2, `two caption segments from two sentences (got ${prepared.captions.photo?.length})`);
console.log("✓ narration drives duration; caption cues + segments produced");

// 2. Player emits a word-highlighted caption + slaves the audio sink to t
const lesson = defineLesson(prepared.spec);
const session = createSession(lesson);
const player = createPlayer(session, {
  audio: prepared.audio,
  captions: prepared.captions,
  audioSink: recordingSink,
});
assert(events[0] === "load:photo:audio", `sink loads narration on the first beat (got ${events[0]})`);

player.seek(200); // within first word (0–400ms)
const f = player.frame();
const cap = f.intents.map(asCaptionIntent).find(Boolean);
assert(!!cap, "frame() emits a caption intent");
assert(cap!.active === 0 && cap!.words![0]!.word === "Sunlight", `first word highlighted at t=200 (got active=${cap!.active})`);
assert(events.includes("seek:200"), "seek slaves the audio position to beat time");
console.log("✓ Player emits word-highlighted captions and slaves audio to the clock");

// 3. at storyboard end the SM advances and the sink loads the next beat
player.tick(4000);
assert(session.activeBeatId() === "outro", `storyboard end advances the SM (got ${session.activeBeatId()})`);
assert(events.some((e) => e.startsWith("load:outro")), "sink reloads on beat change");
console.log("✓ storyboard end advances the SM and reloads audio");

// Optional: real ElevenLabs synthesis when a key is present.
if (process.env.ELEVENLABS_API_KEY) {
  const real = await prepareNarration(lessonSpec, { adapter: elevenLabsAdapter({ apiKey: process.env.ELEVENLABS_API_KEY }) });
  const rsb = (real.spec.flow[0]!.params as { storyboard: { duration: number } }).storyboard;
  console.log(`✓ ElevenLabs synthesis: photo narration = ${(rsb.duration / 1000).toFixed(2)}s`);
}

console.log("\nPhase 2 acceptance passed — TTS alignment + subtitles + single-clock audio.");
