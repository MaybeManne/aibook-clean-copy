// Live layer: the clockless, co-play host (parallel to video/). It composes a lesson
// Session with NO clock/transport — learner and agent are both players emitting events,
// and the agent may author the environment at play time. Depends on lesson (Session
// host) + render_contract; consumed by rendering/render_web (StudioView + Composer).
export * from "./frame.js";
export * from "./program.js";
