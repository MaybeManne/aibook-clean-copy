// SceneView: draws a timeline SceneSnapshot to SVG. Registered for the `scene`
// intent kind. The same snapshot a Player samples each frame is what this draws,
// so the interactive preview matches a future frame export exactly.
import React from "react";
import type { RenderIntent } from "@lessonkit/render-contract";
import { asSceneIntent, type SceneNode, type SceneSnapshot } from "@lessonkit/timeline";
import type { Theme } from "@lessonkit/template";
import { RichTextView } from "../richtext.js";
import type { ComponentFor } from "./index.js";

function transform(n: { x?: number; y?: number; scale?: number; rotation?: number }): string {
  const parts: string[] = [];
  if (n.x || n.y) parts.push(`translate(${n.x ?? 0} ${n.y ?? 0})`);
  if (n.rotation) parts.push(`rotate(${n.rotation})`);
  if (n.scale != null && n.scale !== 1) parts.push(`scale(${n.scale})`);
  return parts.join(" ");
}

function Node({ n, theme }: { n: SceneNode; theme: Theme }): React.ReactElement | null {
  const common = { opacity: n.opacity ?? 1, transform: transform(n) || undefined };
  const fill = n.fill ?? theme.color.accent;
  switch (n.kind) {
    case "rect":
      return <rect {...common} width={n.w} height={n.h} fill={fill} rx={6} />;
    case "circle":
      return <circle {...common} r={n.r} fill={fill} />;
    case "line":
    case "arrow":
      return <line {...common} x1={0} y1={0} x2={n.x2 - (n.x ?? 0)} y2={n.y2 - (n.y ?? 0)} stroke={n.stroke ?? fill} strokeWidth={4} />;
    case "label":
      return (
        <foreignObject {...common} width={400} height={80}>
          <div style={{ color: fill, fontFamily: theme.font.body, fontSize: n.size ?? 32 }}>
            <RichTextView value={n.text} />
          </div>
        </foreignObject>
      );
    case "group":
      return (
        <g {...common}>
          {n.children.map((c, i) => (
            <Node key={c.id ?? i} n={c} theme={theme} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

export const SceneView: ComponentFor = ({ intent, theme }) => {
  const scene = asSceneIntent(intent as RenderIntent);
  if (!scene) return null;
  const snap: SceneSnapshot = scene.snapshot;
  return (
    <svg
      viewBox={`0 0 ${snap.viewBox.w} ${snap.viewBox.h}`}
      style={{ width: "100%", height: "auto", background: theme.color.choiceBg, borderRadius: theme.radius }}
    >
      {snap.nodes.map((n, i) => (
        <Node key={n.id ?? i} n={n} theme={theme} />
      ))}
    </svg>
  );
};
