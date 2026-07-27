// Video layer: the clock + transport + per-frame VideoFrame, composing a lesson
// Session. Separate from the state machine (which stays generic) and from the
// template/renderer (which only consumes VideoFrame + transport). Depends on
// lesson (Session host), timeline, audio, render_contract.
export * from "./transport.js";
export * from "./render_model.js";
export * from "./audio.js";
export * from "./program.js";
export * from "./player_compat.js";
export * from "./authoring.js";
export * from "./transcript.js";
