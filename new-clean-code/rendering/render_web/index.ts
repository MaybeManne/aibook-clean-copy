// React renderer. Consumes RenderModel + Template; pushes events via `send`.
// Does NOT import the engine (MachineEvent is type-only) or the lesson layer.
// useSession (the lesson↔renderer glue) lives in the app/example layer.
export * from "./components/index.js";
export * from "./Template.js";
export * from "./richtext.js";
export * from "./htmlAudioSink.js";
export * from "./speechSink.js";
export * from "./viz.js";
export * from "./conversation.js";
// the director's camera + marks over the stage panel (focus / annotate).
export * from "./attention.js";
export * from "./StudioView.js";
export * from "./Composer.js";
// arbitrary SVG figures (browser + export) — re-exported for author convenience.
// `registerSceneFigure` authors a figure from declarative SceneNodes (visuals vocabulary).
export { registerFigure, registerSceneFigure, sceneFigure, getFigure, type SvgFigure, type SceneFigureOpts } from "@lessonstudio/scene-svg";
