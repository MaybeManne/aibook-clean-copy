// TIER 1 — deterministic human authoring, the Manim-shaped half of lessonStudio.
//
// `defineLesson({ flow: [...] })` plus one factory per beat kind, and an offline
// narration precompile. Pure and model-free: the same source always compiles to the
// same lesson, which is what makes a lesson a reviewable artifact rather than a
// generation. An AI could skip this module entirely and emit the same JSON IR — the
// point of the tier is that a HUMAN doesn't have to.
//
// Depends on `@lessonstudio/lesson` (the IR + beat registry) and `@lessonstudio/audio`
// (narration synthesis). Nothing depends on it: the engine plays what it is handed.
export * from "./dsl.js";
export * from "./narrate.js";
