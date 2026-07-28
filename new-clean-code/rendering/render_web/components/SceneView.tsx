// SceneView: draws a timeline SceneSnapshot to SVG for the `scene` intent kind.
// It delegates the actual node drawing to the SHARED pure `snapshotToSvgInner`
// (also used by the offline frame exporter), so the interactive preview and an
// exported video frame are geometry-identical — the design's frame-identical
// promise, made literal. Imports the pure svg module directly (not the
// render_video barrel), so no Node-only encoder code reaches the browser bundle.
import React from "react";
import type { RenderIntent } from "@lessonstudio/render-contract";
import { asSceneIntent, sampleAt, type SceneSnapshot, type Storyboard } from "@lessonstudio/timeline";
import { snapshotToSvgInner } from "@lessonstudio/scene-svg";
import type { Theme } from "@lessonstudio/template";
import type { ComponentProps } from "./index.js";

type SceneParts = { snapshot?: SceneSnapshot; storyboard?: Storyboard; autoplay?: boolean; fit?: SceneFit };

/** Stable identity of a scene intent — the animation IDENTITY, not the per-frame content.
 *  Keys re-init on a new scene/beat but stays constant while the local clock runs (the
 *  frames come from our own state, so the parent re-rendering an equal intent is a no-op). */
function sceneSig(intent: RenderIntent): string {
  const p = intent as SceneParts;
  const snap = p.snapshot;
  if (!snap) return "";
  const vb = snap.viewBox;
  const sb = p.storyboard
    ? `${p.storyboard.duration}:${p.storyboard.initial.length}:${p.storyboard.tweens.length}`
    : "static";
  return `${vb.x},${vb.y},${vb.w},${vb.h}|${sb}|${p.autoplay === false ? 0 : 1}|${JSON.stringify(snap.nodes)}`;
}

/** A scene intent may carry a `fit` hint set by the layout: "contain" makes the
 *  SVG fill (letterbox within) its panel; default "width" keeps natural aspect. */
type SceneFit = "width" | "contain";

function SceneViewImpl({ intent, theme }: ComponentProps): React.ReactElement | null {
  const scene = asSceneIntent(intent as RenderIntent);
  const p = intent as SceneParts;
  const fit = p.fit ?? "width";
  const sb = p.storyboard;
  // Animate iff we have a real timeline AND this step is active (autoplay not disabled).
  const animate = !!sb && sb.duration > 0 && p.autoplay !== false;
  const sig = scene ? sceneSig(intent) : "";

  // The frame to draw. Animated → the local clock drives it; a past step holds the FINAL
  // frame; a plain snapshot draws as-is. Seeded here so the very first paint is correct.
  const [snap, setSnap] = React.useState<SceneSnapshot | null>(() =>
    sb ? sampleAt(sb, animate ? 0 : sb.duration) : scene?.snapshot ?? null,
  );

  React.useEffect(() => {
    if (!sb) {
      setSnap(scene?.snapshot ?? null);
      return;
    }
    if (!animate) {
      setSnap(sampleAt(sb, sb.duration)); // static: completed frame
      return;
    }
    // Local rAF clock: play 0 → duration once, then hold the last frame. No global
    // transport — the beat's timeline is a self-contained animation, played on entry.
    let raf = 0;
    let start = 0;
    const tick = (ts: number): void => {
      if (!start) start = ts;
      const t = Math.min(ts - start, sb.duration);
      setSnap(sampleAt(sb, t));
      if (t < sb.duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Re-init only when the scene IDENTITY changes (new beat / autoplay flip), not per frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, theme]);

  const svg = React.useMemo(() => (snap ? snapshotToSvgInner(snap, theme) : ""), [snap, theme]);
  if (!scene || !snap) return null;
  const vb = snap.viewBox;
  const style: React.CSSProperties =
    fit === "contain"
      ? { width: "100%", height: "100%", maxHeight: "100%", display: "block", background: "transparent" }
      : { width: "100%", height: "auto", display: "block", aspectRatio: `${vb.w} / ${vb.h}`, background: "transparent" };
  return <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} preserveAspectRatio="xMidYMid meet" style={style} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Re-render on parent updates only when the scene identity changes; the local clock's
// own setState always re-renders regardless of this comparator.
export const SceneView = React.memo(SceneViewImpl, (a, b) => {
  const ai = a.intent as SceneParts;
  const bi = b.intent as SceneParts;
  return a.theme === b.theme && ai.fit === bi.fit && sceneSig(a.intent) === sceneSig(b.intent);
});
