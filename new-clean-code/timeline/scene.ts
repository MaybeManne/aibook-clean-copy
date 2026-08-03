import type { RichText } from "@lessonstudio/intents";

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
  opacity?: number;
  scale?: number;
  rotation?: number;
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
  | (NodeBase & {
      kind: "label";
      /** A `RichText` tree, or just the words: `figures/nodes.ts` builds the tree, a director
       *  authoring a scene as JSON writes the string. Both reach the stage as plain text — the
       *  stage draws no math. */
      text: RichText | string;
      size?: number;
      /** Horizontal anchor (default "start"); "middle"/"end" for centered/right labels (axes ticks). */
      anchor?: "start" | "middle" | "end";
      /** Vertical baseline (default "hanging"); "middle" centers on y, "auto" sits on it. */
      baseline?: "hanging" | "middle" | "auto";
      /** Font weight (default 500). */
      weight?: number;
    })
  | (NodeBase & { kind: "path"; d: string; stroke?: string; strokeWidth?: number; draw?: number; len?: number })
  | (NodeBase & { kind: "ring"; rOuter: number; rInner: number; innerDy?: number; stroke?: string })
  | (NodeBase & { kind: "group"; children: SceneNode[] });

/** The resolved scene at one instant. `viewBox` is a camera-controlled window. */
export interface SceneSnapshot {
  nodes: SceneNode[];
  viewBox: { x: number; y: number; w: number; h: number };
}

/**
 * Animatable numeric/color properties (the union of what Tween.property may target).
 *
 * Declared as a runtime list with the type derived from it, so the vocabulary a director is
 * TOLD about (`SCENE_VOCABULARY`) and the vocabulary the sampler accepts cannot drift: there is
 * one list, and `AnimProp` is read off it.
 */
export const ANIM_PROPS = ["x", "y", "opacity", "scale", "rotation", "fill", "draw"] as const;

export type AnimProp = (typeof ANIM_PROPS)[number];

/** Props every node carries, whatever its kind — all of them animatable except `id`. */
export const NODE_BASE_PROPS = ["id", "x", "y", "opacity", "scale", "rotation", "fill", "gradient", "glow"] as const;
