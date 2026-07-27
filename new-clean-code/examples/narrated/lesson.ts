// A narrated animated lesson: one scene beat with a `narration` script. The
// storyboard's duration is a placeholder — prepareNarration overwrites it with
// the synthesized audio's exact length and merges caption cues.
import { animate, defineLesson, explain } from "@lessonkit/lesson";
import type { Storyboard } from "@lessonkit/timeline";

const scene: Storyboard = {
  duration: 1, // placeholder; narration drives the real duration
  stage: { w: 640, h: 360 },
  initial: [
    { id: "sun", kind: "circle", x: 120, y: 120, r: 40, opacity: 0, fill: "#ffcc33" },
    { id: "leaf", kind: "rect", x: 360, y: 200, w: 120, h: 60, opacity: 0, fill: "#3fb950" },
  ],
  tweens: [
    { target: "sun", property: "opacity", from: 0, to: 1, start: 0, duration: 600, easing: "easeOut" },
    { target: "leaf", property: "opacity", from: 0, to: 1, start: 400, duration: 600, easing: "easeOut" },
  ],
};

export const lessonSpec = {
  id: "narrated-demo",
  version: 1,
  title: "A narrated timeline beat",
  flow: [
    animate({
      id: "photo",
      storyboard: scene,
      slot: "stage",
      narration: "Sunlight reaches the leaf. The leaf turns light into sugar.",
    }),
    explain({ id: "outro", text: "That was a narrated, subtitled animation.", next: null }),
  ],
};

/** Convenience: compile the (unprepared) spec directly for non-narrated use. */
export const demo = defineLesson(lessonSpec);
