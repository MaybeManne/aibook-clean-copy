import type { AnimProp, NodeId, SceneNode } from "./scene.js";

export type Easing =
  | "smooth"
  | "smootherstep"
  | "rushInto"
  | "rushFrom"
  | "slowInto"
  | "thereAndBack"
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "cubicInOut"
  | "expoOut"
  | "backOut"
  | "elasticOut"
  | "bounceOut";

/** A camera keyframe: the visible viewBox window at time `at`. Interpolated (eased). */
export interface CameraKey {
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  easing?: Easing;
}

export interface Tween {
  target: NodeId;
  property: AnimProp;
  from?: number | string;
  to: number | string;
  start: number;
  duration: number;
  easing?: Easing;
}

export interface Storyboard {
  duration: number;
  initial: SceneNode[];
  tweens: Tween[];
  stage?: { w: number; h: number };
  /** Camera track: keyframed viewBox windows (pan/zoom/focus). Absent = whole stage. */
  camera?: CameraKey[];
  /**
   * ESCAPE HATCH: instead of (or alongside) the declarative scene, drive a named external
   * visualization (arbitrary JS/HTML/CSS/canvas). The renderer looks the name up in its viz
   * registry and feeds it `props` + the beat clock `t`. Browser only — arbitrary viz cannot be
   * rasterized (SVG scenes can).
   */
  viz?: { name: string; props?: Record<string, unknown> };
}
