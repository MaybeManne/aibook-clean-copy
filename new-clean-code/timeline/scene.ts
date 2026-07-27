// Light scene graph — declarative nodes, never code. The resolved scene at one
// instant (SceneSnapshot) is what a renderer draws.

import type { RichText } from "@lessonkit/render-contract";

export type NodeId = string;

/** A gradient fill (linear top→bottom, or radial center→edge). Stops are any CSS
 * color incl. rgba()/transparent, so it doubles as a soft glow/vignette. */
export interface Gradient {
  from: string;
  to: string;
  radial?: boolean;
}

/** Properties every node carries + can animate. */
export interface NodeBase {
  id: NodeId;
  x?: number;
  y?: number;
  opacity?: number; // 0..1
  scale?: number; // 1 = natural
  rotation?: number; // degrees
  fill?: string;
  /** Gradient fill (overrides `fill`) — depth + soft glows without a bitmap. */
  gradient?: Gradient;
  /** Soft outer-glow blur radius in px (0/absent = crisp). */
  glow?: number;
}

export type SceneNode =
  | (NodeBase & { kind: "rect"; w: number; h: number })
  | (NodeBase & { kind: "circle"; r: number; stroke?: string; strokeWidth?: number })
  | (NodeBase & { kind: "line" | "arrow"; x2: number; y2: number; stroke?: string })
  | (NodeBase & { kind: "label"; text: RichText; size?: number })
  // Arbitrary SVG path in local coords. `draw` (0..1) reveals the stroke
  // progressively (draw-on) — animate it with a tween. Supply `len` (the path's
  // length) to make draw-on EXPORT-safe (resvg ignores the pathLength fallback).
  | (NodeBase & { kind: "path"; d: string; stroke?: string; strokeWidth?: number; draw?: number; len?: number })
  // Shaded region between two circles (the outer at (x,y) radius rOuter; the
  // inner radius rInner offset down by innerDy — innerDy = rOuter-rInner makes
  // them share a bottom point, as in nested-tangent-circle problems; 0 = annulus).
  // Filled with even-odd rule so the ring/crescent is exact.
  | (NodeBase & { kind: "ring"; rOuter: number; rInner: number; innerDy?: number; stroke?: string })
  | (NodeBase & { kind: "group"; children: SceneNode[] });

/** The resolved scene at one instant. `viewBox` is a camera-controlled window. */
export interface SceneSnapshot {
  nodes: SceneNode[];
  viewBox: { x: number; y: number; w: number; h: number };
}

/** Animatable numeric/color properties (the union of what Tween.property may target). */
export type AnimProp = "x" | "y" | "opacity" | "scale" | "rotation" | "fill" | "draw";
