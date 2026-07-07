// Light scene graph — declarative nodes, never code. The resolved scene at one
// instant (SceneSnapshot) is what a renderer draws.

import type { RichText } from "@lessonkit/render-contract";

export type NodeId = string;

/** Properties every node carries + can animate. */
export interface NodeBase {
  id: NodeId;
  x?: number;
  y?: number;
  opacity?: number; // 0..1
  scale?: number; // 1 = natural
  rotation?: number; // degrees
  fill?: string;
}

export type SceneNode =
  | (NodeBase & { kind: "rect"; w: number; h: number })
  | (NodeBase & { kind: "circle"; r: number })
  | (NodeBase & { kind: "line" | "arrow"; x2: number; y2: number; stroke?: string })
  | (NodeBase & { kind: "label"; text: RichText; size?: number })
  | (NodeBase & { kind: "group"; children: SceneNode[] });

/** The resolved scene at one instant. */
export interface SceneSnapshot {
  nodes: SceneNode[];
  viewBox: { w: number; h: number };
}

/** Animatable numeric/color properties (the union of what Tween.property may target). */
export type AnimProp = "x" | "y" | "opacity" | "scale" | "rotation" | "fill";
