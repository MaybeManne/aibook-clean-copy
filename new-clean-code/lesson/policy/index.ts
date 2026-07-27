// The policy layer: the open, extensible Perceive → Decide → Act SPI. Public surface
// = the three interfaces + the data they exchange (in contracts.ts), a name→impl
// registry, an adapter to the low-level Policy, and a batteries-included default of
// each pure policy. See docs (roadmap): a "write your own policy" guide ships with the
// OSS release. Layering: over lesson_sm; only `adapter.ts` touches authoring, as a type.

export * from "./contracts.js";
export * from "./registry.js";
export * from "./adapter.js";
export { defaultLearnerModel } from "./default_learner_model.js";
export { defaultTeachingPolicy } from "./default_teaching_policy.js";
