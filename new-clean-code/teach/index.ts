// TIER 2 — the live human teacher. A programmer on a second screen, watching a student play
// and intervening: answer with a beat, act a demo, reuse a visual that is already on screen,
// zoom into a figure, hold the room while they set something up.
//
// The interface is deliberately not a GUI. It is LOGS IN, COMMANDS OUT — because that is what
// a programmer wants at 2am, and because it is the same interface a model consumes and emits.
// Tier 3 (`forge/`) is therefore a different CLIENT of this module's transport, not a second
// integration: same observation, same formatter, same four endpoints, same adjudicator.
//
// What lives here is only the plumbing between the two: the wire types, the pure mailbox, the
// teacher-side transport, and the page-side client. The VOCABULARY (`DirectorCommand`), the
// judge (`adjudicate`) and the views (`observe`/`format`) are all in `lesson/direction/`,
// where the engine can enforce them — a transport must never be able to widen what is legal.
//
// `dev_bus.ts` (the Vite plugin) and `cli/*` are node-only and stay OFF this barrel, so
// nothing here drags `node:fs` into a browser bundle.
export * from "./wire.js";
export * from "./bus.js";
export * from "./transport.js";
export * from "./client.js";
