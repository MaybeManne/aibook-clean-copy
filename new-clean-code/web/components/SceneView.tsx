import React from "react";
import type { RenderIntent } from "@lessonstudio/intents";
import { asSceneIntent, sampleAt, type SceneSnapshot, type Storyboard } from "@lessonstudio/timeline";
import { snapshotToSvgInner } from "@lessonstudio/svg";
import type { Theme } from "@lessonstudio/theme";
import type { ComponentProps } from "./index.js";

type SceneParts = { snapshot?: SceneSnapshot; storyboard?: Storyboard; autoplay?: boolean; fit?: SceneFit };

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

type SceneFit = "width" | "contain";

function SceneViewImpl({ intent, theme }: ComponentProps): React.ReactElement | null {
  const scene = asSceneIntent(intent as RenderIntent);
  const p = intent as SceneParts;
  const fit = p.fit ?? "width";
  const sb = p.storyboard;
  const animate = !!sb && sb.duration > 0 && p.autoplay !== false;
  const sig = scene ? sceneSig(intent) : "";

  const [snap, setSnap] = React.useState<SceneSnapshot | null>(() =>
    sb ? sampleAt(sb, animate ? 0 : sb.duration) : scene?.snapshot ?? null,
  );

  React.useEffect(() => {
    if (!sb) {
      setSnap(scene?.snapshot ?? null);
      return;
    }
    if (!animate) {
      setSnap(sampleAt(sb, sb.duration));
      return;
    }
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

export const SceneView = React.memo(SceneViewImpl, (a, b) => {
  const ai = a.intent as SceneParts;
  const bi = b.intent as SceneParts;
  return a.theme === b.theme && ai.fit === bi.fit && sceneSig(a.intent) === sceneSig(b.intent);
});
