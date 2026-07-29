// The direction layer: the typed, adjudicated vocabulary in which a director — a live
// human teacher or an AI teacher — edits a lesson mid-play, plus the pure projections
// a director reads to decide (catalog / observation / text format).
//
// It is the seam between the engine and whoever is teaching through it, and it knows
// nothing about which of the two is on the other side.
export * from "./protocol.js";
export * from "./capabilities.js";
export * from "./adjudicate.js";
export * from "./catalog.js";
export * from "./observe.js";
export * from "./format.js";
