// A beat's timeline as pure JSON: an initial scene, timed property tweens, and
// sub-beat cues (reveal an intent, set a caption, pause at a gate). Serializable
// and AI-authorable — no functions, no eval.

import type { RenderIntent, RichText } from "@lessonkit/render-contract";
import type { AnimProp, NodeId, SceneNode } from "./scene.js";

export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut";

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
  stage?: { w: number; h: number }; // viewBox; default 1920x1080
}
