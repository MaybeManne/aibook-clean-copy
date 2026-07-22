// Audio layer: provider-agnostic TTS + word-level alignment + subtitles +
// content-hash cache + offline narration precompile. Pure core (align,
// subtitles, narrate) + Node adapters (elevenlabs, cache.fileCache). Depends on
// timeline (Storyboard/Cue) + render_contract (RichText) only — never the engine.
export * from "./tts.js";
export * from "./sink.js";
export * from "./align.js";
export * from "./subtitles.js";
export * from "./cache.js";
export * from "./elevenlabs.js";
export * from "./fake.js";
export * from "./narrate.js";
