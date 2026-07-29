// THE ENGINE. Lesson semantics on top of the generic statechart: the IR and its
// compiler, the built-in beats, the runtime host, the direction protocol a director
// speaks, the policy SPI, and the transcript projection. Depends on state_machine +
// render_contract (+ timeline for scene/viz intents) only.
//
// Deliberately absent, and enforced by imports rather than by a comment:
//   • deterministic authoring sugar  → `@lessonstudio/authoring`  (tier 1)
//   • the live teacher's transport   → `@lessonstudio/teach`      (tier 2)
//   • anything that calls a model    → `@lessonstudio/forge`      (tier 3)
// The engine plays frozen artifacts and adjudicates commands; it never composes a
// lesson and never generates one. That is what keeps it deterministic and replayable.
export * from "./lesson_sm/index.js";
export * from "./beats/index.js";
export * from "./runtime/index.js";
export * from "./direction/index.js";
export * from "./policy/index.js";
export * from "./transcript.js";
