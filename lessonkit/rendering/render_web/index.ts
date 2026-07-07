// React renderer. Consumes RenderModel + Template; pushes events via `send`.
// Does NOT import the engine (MachineEvent is type-only) or the lesson layer.
// useSession (the lesson↔renderer glue) lives in the app/example layer.
export * from "./components/index.js";
export * from "./Template.js";
export * from "./richtext.js";
