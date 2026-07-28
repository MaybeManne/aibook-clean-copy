// The visuals layer: a ManimCE-inspired vocabulary for authoring figures as pure, declarative
// SceneNodes (never imperative draw calls). Everything here maps math space → the engine's
// existing scene-graph primitives, so figures are replayable, seekable, and export-safe.
//
//   coords   — makeFrame/Frame: data coords → stage pixels (Manim Axes.coords_to_point; y-flipped for SVG)
//   nodes    — dot/line/label/group + polygon/star/arc/brace + axes/numberLine/plot/area/areaBetween/riemannRectangles
//   anim     — animation verbs as pure Tween[] generators (fadeIn/drawOn/slideTo/spin/indicate/stagger/moveAlongPoints)
//   palette  — the 3Blue1Brown / ManimCE default colors
//
// ValueTracker/always_redraw note: Manim's per-frame recompute has no new node kind here — a
// changing scalar is a control/param value, and "recompute from it every frame" IS the pure
// `sampleAt` sampler (declarative scenes) or a `registerFigure` figure (whole-figure recompute).
// Keeping the scene graph pure data is what preserves export-safety.

export * from "./coords.js";
export * from "./palette.js";
export * from "./nodes.js";
export * from "./anim.js";
