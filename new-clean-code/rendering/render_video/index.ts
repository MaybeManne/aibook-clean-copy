// Offline video export: pure frame planning (svg + frames) plus adapter-driven
// rasterize/encode and the exportLesson orchestrator. Shares sampleAt +
// snapshotToSvg with render_web so exported frames match the live preview.
// Depends on render_contract, template, timeline, lesson. The Node-only bits
// (rasterize/encode) load their native deps lazily.
export * from "./svg.js";
export * from "./frames.js";
export * from "./rasterize.js";
export * from "./encode.js";
export * from "./export.js";
