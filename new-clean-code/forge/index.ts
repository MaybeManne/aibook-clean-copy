// TIER 3 — THE AI HALF. Everything nondeterministic lives behind this barrel: the
// generate/direct effect seam, the prompt-plan contract, the Claude-backed author, and the
// AI TEACHER — a model standing exactly where the live human teacher of tier 2 stood, with
// the same vocabulary (`tools.ts` generates its tools from the command union), the same
// observation text, and the same adjudication.
//
// The boundary is enforced by imports, not by convention: `@lessonstudio/lesson` does
// NOT export any of this, and nothing here is reachable from the engine, so a lesson
// plays identically with this module deleted. Forge reaches the engine only through its
// public surface, as a third party would — which is what makes the `lessonForge` repo
// split (docs/ROADMAP.md, "the two-repo cut") a directory move.
//
// Deliberately NOT exported here: `dev_author.ts` and `dev_director.ts`. Both are Node-only
// (they read env keys, and one reads the filesystem) and must never be importable from a
// browser bundle — the same rule `audio/dev_tts.ts` follows. A dev server imports them by
// path; `cli/` is likewise off the barrel because a CLI is an entry point, not a library.
export * from "./seam.js";
export * from "./claude_author.js";
export * from "./tools.js";
export * from "./tool_call.js";
export * from "./director.js";
export * from "./watch.js";
