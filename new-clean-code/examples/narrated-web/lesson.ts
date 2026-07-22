// A video-like narrated explainer: four animated scenes on a 16:9 stage, each
// with its own narration. prepareNarration sets each scene's duration to its
// audio length and merges caption cues, so the whole thing plays as one
// continuous narrated video (SM sequences the scenes; each scene is a timeline).
import { animate } from "@lessonkit/lesson";
import { text } from "@lessonkit/render-contract";
import type { Storyboard } from "@lessonkit/timeline";

const STAGE = { w: 960, h: 540 };
const SUN = "#ffcc33";
const LEAF = "#3fb950";
const SKY = "#6ea8fe";

// ── Scene 1: title + sunrise ───────────────────────────────────────────────
const sunrise: Storyboard = {
  duration: 1,
  stage: STAGE,
  initial: [
    { id: "title", kind: "label", x: 250, y: 60, text: text("Photosynthesis"), size: 56, fill: "#e8eaff", opacity: 0 },
    { id: "ground", kind: "rect", x: 0, y: 470, w: 960, h: 70, fill: "#173a1f" },
    { id: "sun", kind: "circle", x: 480, y: 520, r: 60, fill: SUN, opacity: 0, scale: 0.6 },
  ],
  tweens: [
    { target: "title", property: "opacity", from: 0, to: 1, start: 0, duration: 800, easing: "easeOut" },
    { target: "sun", property: "opacity", from: 0, to: 1, start: 200, duration: 900, easing: "easeOut" },
    { target: "sun", property: "y", from: 520, to: 170, start: 200, duration: 2200, easing: "easeOut" },
    { target: "sun", property: "scale", from: 0.6, to: 1, start: 200, duration: 2200, easing: "easeOut" },
  ],
};

// ── Scene 2: light reaches the leaf ─────────────────────────────────────────
const lightToLeaf: Storyboard = {
  duration: 1,
  stage: STAGE,
  initial: [
    { id: "sun", kind: "circle", x: 480, y: 170, r: 60, fill: SUN },
    { id: "ray1", kind: "line", x: 500, y: 220, x2: 360, y2: 380, stroke: SUN, opacity: 0 },
    { id: "ray2", kind: "line", x: 520, y: 220, x2: 430, y2: 380, stroke: SUN, opacity: 0 },
    { id: "leaf", kind: "circle", x: 400, y: 400, r: 70, fill: LEAF, opacity: 0, scale: 0.5 },
    { id: "leafLabel", kind: "label", x: 360, y: 470, text: text("leaf"), size: 26, fill: "#e8eaff", opacity: 0 },
  ],
  tweens: [
    { target: "leaf", property: "opacity", from: 0, to: 1, start: 0, duration: 700, easing: "easeOut" },
    { target: "leaf", property: "scale", from: 0.5, to: 1, start: 0, duration: 700, easing: "easeOut" },
    { target: "ray1", property: "opacity", from: 0, to: 0.9, start: 500, duration: 700 },
    { target: "ray2", property: "opacity", from: 0, to: 0.9, start: 700, duration: 700 },
    { target: "leafLabel", property: "opacity", from: 0, to: 1, start: 900, duration: 600 },
  ],
};

// ── Scene 3: inputs (CO2 + water) flow in ───────────────────────────────────
const inputs: Storyboard = {
  duration: 1,
  stage: STAGE,
  initial: [
    { id: "sun", kind: "circle", x: 480, y: 170, r: 60, fill: SUN },
    { id: "leaf", kind: "circle", x: 400, y: 400, r: 70, fill: LEAF },
    { id: "co2", kind: "label", x: 60, y: 380, text: text("CO₂"), size: 34, fill: SKY, opacity: 0 },
    { id: "h2o", kind: "label", x: 60, y: 470, text: text("H₂O"), size: 34, fill: SKY, opacity: 0 },
  ],
  tweens: [
    { target: "co2", property: "opacity", from: 0, to: 1, start: 0, duration: 500 },
    { target: "co2", property: "x", from: 60, to: 320, start: 300, duration: 1600, easing: "easeInOut" },
    { target: "h2o", property: "opacity", from: 0, to: 1, start: 300, duration: 500 },
    { target: "h2o", property: "x", from: 60, to: 320, start: 600, duration: 1600, easing: "easeInOut" },
    { target: "leaf", property: "scale", from: 1, to: 1.12, start: 1900, duration: 500, easing: "easeInOut" },
  ],
};

// ── Scene 4: outputs (sugar + oxygen) ───────────────────────────────────────
const outputs: Storyboard = {
  duration: 1,
  stage: STAGE,
  initial: [
    { id: "sun", kind: "circle", x: 480, y: 170, r: 60, fill: SUN },
    { id: "leaf", kind: "circle", x: 400, y: 400, r: 70, fill: LEAF },
    { id: "sugar", kind: "label", x: 500, y: 380, text: text("sugar"), size: 34, fill: "#ffd479", opacity: 0 },
    { id: "o2", kind: "label", x: 500, y: 300, text: text("O₂"), size: 34, fill: "#8fe3ff", opacity: 0 },
  ],
  tweens: [
    { target: "sugar", property: "opacity", from: 0, to: 1, start: 200, duration: 500 },
    { target: "sugar", property: "x", from: 500, to: 800, start: 400, duration: 1600, easing: "easeInOut" },
    { target: "o2", property: "opacity", from: 0, to: 1, start: 500, duration: 500 },
    { target: "o2", property: "x", from: 500, to: 820, start: 700, duration: 1600, easing: "easeInOut" },
    { target: "o2", property: "y", from: 300, to: 140, start: 700, duration: 1600, easing: "easeOut" },
  ],
};

export const lessonSpec = {
  id: "photosynthesis-video",
  version: 1,
  title: "Photosynthesis — a narrated explainer",
  flow: [
    animate({ id: "sunrise", storyboard: sunrise, slot: "stage", narration: "Every day, the sun rises and floods the world with light." }),
    animate({ id: "light", storyboard: lightToLeaf, slot: "stage", narration: "That light lands on a leaf, where the real work begins." }),
    animate({ id: "inputs", storyboard: inputs, slot: "stage", narration: "The leaf pulls in carbon dioxide from the air and water from the soil." }),
    animate({ id: "outputs", storyboard: outputs, slot: "stage", narration: "It packs the energy into sugar, and releases oxygen for us to breathe.", next: null }),
  ],
};
