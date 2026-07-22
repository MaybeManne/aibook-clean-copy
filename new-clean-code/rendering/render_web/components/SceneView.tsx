// SceneView: draws a timeline SceneSnapshot to SVG for the `scene` intent kind.
// It delegates the actual node drawing to the SHARED pure `snapshotToSvgInner`
// (also used by the offline frame exporter), so the interactive preview and an
// exported video frame are geometry-identical — the design's frame-identical
// promise, made literal. Imports the pure svg module directly (not the
// render_video barrel), so no Node-only encoder code reaches the browser bundle.
import React from "react";
import type { RenderIntent } from "@lessonkit/render-contract";
import { asSceneIntent, type SceneSnapshot } from "@lessonkit/timeline";
import { snapshotToSvgInner } from "@lessonkit/scene-svg";
import type { Theme } from "@lessonkit/template";
import type { ComponentProps } from "./index.js";

/** Cheap structural signature of a scene — two frames that sample identically
 *  (paused / seek-to-same) share it, so we skip both the SVG rebuild and the DOM
 *  replace. `sampleAt` returns a fresh object each call, so identity won't do. */
function sceneSig(intent: RenderIntent): string {
  const snap = (intent as { snapshot?: SceneSnapshot }).snapshot;
  if (!snap) return "";
  const vb = snap.viewBox;
  return `${vb.x},${vb.y},${vb.w},${vb.h}|${JSON.stringify(snap.nodes)}`;
}

/** A scene intent may carry a `fit` hint set by the layout: "contain" makes the
 *  SVG fill (letterbox within) its panel; default "width" keeps natural aspect. */
type SceneFit = "width" | "contain";

function SceneViewImpl({ intent, theme }: ComponentProps): React.ReactElement | null {
  const scene = asSceneIntent(intent as RenderIntent);
  const snap = scene?.snapshot;
  const fit = (intent as { fit?: SceneFit }).fit ?? "width";
  // hooks run unconditionally (before any early return)
  const svg = React.useMemo(() => (snap ? snapshotToSvgInner(snap, theme) : ""), [snap ? sceneSig(intent) : "", theme]);
  if (!scene || !snap) return null;
  const vb = snap.viewBox;
  const style: React.CSSProperties =
    fit === "contain"
      ? { width: "100%", height: "100%", maxHeight: "100%", display: "block", background: "transparent" }
      : { width: "100%", height: "auto", display: "block", aspectRatio: `${vb.w} / ${vb.h}`, background: "transparent" };
  return <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} preserveAspectRatio="xMidYMid meet" style={style} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export const SceneView = React.memo(SceneViewImpl, (a, b) => {
  const ai = a.intent as { fit?: SceneFit };
  const bi = b.intent as { fit?: SceneFit };
  return a.theme === b.theme && ai.fit === bi.fit && sceneSig(a.intent) === sceneSig(b.intent);
});
