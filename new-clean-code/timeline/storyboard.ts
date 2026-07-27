// A beat's timeline as pure JSON: an initial scene, timed property tweens, and
// sub-beat cues (reveal an intent, set a caption, pause at a gate). Serializable
// and AI-authorable — no functions, no eval.

import type { RenderIntent, RichText } from "@lessonkit/render-contract";
import type { AnimProp, NodeId, SceneNode } from "./scene.js";

export type Easing =
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
  from?: number | string; // omitted = node's base value
  to: number | string;
  start: number; // ms from beat start
  duration: number; // ms
  easing?: Easing; // default "linear"
}

export type Cue =
  | { at: number; kind: "reveal"; intent: RenderIntent }
  | { at: number; kind: "caption"; text: RichText }
  | { at: number; kind: "narrationMark"; label: string }
  | { at: number; kind: "gate"; event: string };

export interface Storyboard {
  duration: number; // total beat time (ms)
  initial: SceneNode[]; // scene at t=0
  tweens: Tween[];
  cues?: Cue[];
  stage?: { w: number; h: number }; // full canvas; default 1920x1080
  /** Camera track: keyframed viewBox windows (pan/zoom/focus). Absent = whole stage. */
  camera?: CameraKey[];
  /**
   * ESCAPE HATCH: instead of (or alongside) the declarative scene, drive a named
   * external visualization (arbitrary JS/HTML/CSS/canvas). The renderer looks the
   * name up in its viz registry and feeds it `props` + the beat clock `t`. Keeps
   * the engine pure (a declarative pointer) while allowing any visual. Browser
   * only — arbitrary viz cannot be rasterized for mp4 export (SVG scenes can).
   */
  viz?: { name: string; props?: Record<string, unknown> };
}
