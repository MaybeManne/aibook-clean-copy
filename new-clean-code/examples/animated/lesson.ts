import { animate, defineLesson, explain } from "@lessonkit/lesson";
import { text } from "@lessonkit/render-contract";
import type { Storyboard } from "@lessonkit/timeline";

// A circle fades in, then slides across the stage; a caption is revealed midway.
const intro: Storyboard = {
  duration: 1000,
  stage: { w: 400, h: 200 },
  initial: [{ id: "c", kind: "circle", x: 50, y: 100, r: 30, opacity: 0, fill: "#6ea8fe" }],
  tweens: [
    { target: "c", property: "opacity", from: 0, to: 1, start: 0, duration: 400, easing: "easeOut" },
    { target: "c", property: "x", from: 50, to: 350, start: 200, duration: 800, easing: "easeInOut" },
  ],
  cues: [{ at: 500, kind: "reveal", intent: { kind: "text", slot: "prose", content: text("Watch it move →") } }],
};

export const demo = defineLesson({
  id: "anim-demo",
  version: 1,
  title: "A timeline beat",
  flow: [
    animate({ id: "a1", storyboard: intro, slot: "stage" }),
    explain({ id: "outro", text: "That was a timeline beat — animated on a single clock.", next: null }),
  ],
});

export { intro };
