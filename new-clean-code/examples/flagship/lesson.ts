// Flagship demo — "Sine from a circle." INTERACTIVE-FIRST: after a short spoken
// hook, the learner DISCOVERS the wave by dragging, must accomplish guided tasks
// to advance (guided goals), answers an inline question mid-flow, and the lesson
// adapts (wrong → remediation, right → challenge). Not "watch then quiz" — the
// doing IS the teaching. Exports lessonSpec (for gen-audio) + policy + articleText.

import { animate, explorable, mcq, decisionPolicy, topMisconception, type LessonSpec, type Policy } from "@lessonkit/lesson";
import { article, md, text, type RichText } from "@lessonkit/render-contract";
import type { SceneNode, Storyboard } from "@lessonkit/timeline";

const STAGE = { w: 960, h: 460 };
const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };
const thetaSlider = (label: string) => ({ key: "theta", label, kind: "slider" as const, min: 0, max: 360, step: 5, unit: "°" });
const sineSb = (props: Record<string, number> = {}): Storyboard => ({ duration: 1, stage: STAGE, initial: [], tweens: [], viz: { name: "unit-circle-sine", props } });

// ── hook: a short narrated intro that DRAWS ITSELF ON with a camera push-in ─────
const introWave = sinePath(120, 300, 720, 92, 1.5);
const hookSb: Storyboard = {
  duration: 1, // overwritten by narration length
  stage: STAGE,
  initial: [
    { id: "title", kind: "label", x: 250, y: 66, text: text("Sine from a circle"), size: 52, fill: "#eef0ff", opacity: 0 },
    { id: "xax", kind: "arrow", x: 92, y: 300, x2: 884, y2: 300, stroke: "#5b6180" },
    { id: "yax", kind: "arrow", x: 120, y: 412, x2: 120, y2: 150, stroke: "#5b6180" },
    { id: "wave", kind: "path", d: introWave.d, len: introWave.len, stroke: "#818cf8", strokeWidth: 4, draw: 0 } as SceneNode,
  ],
  tweens: [
    { target: "title", property: "opacity", from: 0, to: 1, start: 0, duration: 700, easing: "easeOut" },
    { target: "wave", property: "draw", from: 0, to: 1, start: 400, duration: 2600, easing: "easeInOut" },
  ],
  camera: [
    { at: 0, x: 0, y: 0, w: 960, h: 460 },
    { at: 3200, x: 60, y: 28, w: 840, h: 402, easing: "easeInOut" },
  ],
};

function sinePath(x0: number, baseY: number, w: number, amp: number, periods: number, N = 180): { d: string; len: number } {
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const p = i / N;
    pts.push([x0 + p * w, baseY - amp * Math.sin(p * periods * Math.PI * 2)]);
  }
  let d = "";
  let len = 0;
  pts.forEach((pt, i) => {
    d += i ? ` L${pt[0].toFixed(1)} ${pt[1].toFixed(1)}` : `M${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
    if (i) len += Math.hypot(pt[0] - pts[i - 1]![0], pt[1] - pts[i - 1]![1]);
  });
  return { d, len };
}

export const lessonSpec: LessonSpec = {
  id: "sine-from-circle",
  title: "Sine from a circle",
  version: 1,
  flow: [
    // 1. brief spoken hook — then straight into doing (no long watch phase)
    animate({ id: "hook", storyboard: hookSb, slot: "stage", narration: "Every wave is a circle in disguise. Let's build one — and you're driving." }),

    // 2. DISCOVER by dragging all the way around (task gates progress)
    explorable({
      id: "discover",
      viz: { name: "unit-circle-sine" },
      controls: [thetaSlider("drag θ around →"), CONTINUE],
      defaults: { theta: 0 },
      goal: { key: "theta", min: 300 },
      task: md("**Drag the point all the way around.** Watch its height paint a curve on the right."),
      success: md("You just drew a **sine wave** — it's simply the *height* of a point going around a circle."),
    }),

    // 3. guided task: find the crest
    explorable({
      id: "crest",
      viz: { name: "unit-circle-sine" },
      controls: [thetaSlider("park it at the top"), CONTINUE],
      defaults: { theta: 30 },
      goal: { key: "theta", equals: 90, tolerance: 6 },
      task: md("**Park the point at the very top.** Where is the wave highest?"),
      success: md("At **90°** the height is the whole radius, so $\\sin 90° = 1$ — the crest."),
    }),

    // 4. inline question — mid-flow, not a final quiz
    mcq({
      id: "check",
      prompt: md("At the **bottom** of the circle (**270°**), what is $\\sin\\theta$?"),
      skill: "sine",
      choices: [
        { text: "−1  (the point is at the very bottom)", correct: true },
        { text: "0  (the point is at the side)", misconception: "sin-cos-swap" },
        { text: "1  (same as the top)", },
      ],
      correctFeedback: "Exactly — at 270° the point is lowest, so sin 270° = −1.",
      wrongFeedback: "Picture 270°: the point is at the very bottom, so its height is −1.",
    }),

    // 5. adaptive decision node
    {
      ...explorable({ id: "checkpoint", viz: { name: "unit-circle-sine", props: { theta: 270 } }, controls: [CONTINUE], next: "recap" }),
      routes: [
        { on: "signal.remediate", target: "remediate" },
        { on: "signal.challenge", target: "challenge" },
      ],
    },

    // 6a. remediation (only if the misconception fired): do it hands-on
    explorable({
      id: "remediate",
      viz: { name: "unit-circle-sine" },
      controls: [thetaSlider("drag to the bottom"), CONTINUE],
      defaults: { theta: 200 },
      goal: { key: "theta", equals: 270, tolerance: 6 },
      task: md("Let's feel it: **drag the point to the bottom (270°)** and read the height."),
      success: md("There it is — at 270° the height is **−1**. The *height* is the sine, not the sideways position."),
      next: "recap",
    }),

    // 6b. challenge (if they nailed it): discover where sine is negative
    explorable({
      id: "challenge",
      viz: { name: "unit-circle-sine" },
      controls: [thetaSlider("find the dip"), CONTINUE],
      defaults: { theta: 30 },
      goal: { key: "theta", min: 181, max: 359 },
      task: md("**Challenge:** put the point somewhere the wave dips *below* zero."),
      success: md("Nice — anywhere from **180° to 360°** the point is below centre, so $\\sin\\theta < 0$."),
      next: "recap",
    }),

    // 7. short spoken close
    animate({ id: "recap", storyboard: sineSb({ theta: 45 }), slot: "stage", narration: "And that's the whole idea: every wave is a circle, unrolled. You built it yourself.", next: null }),
  ],
};

export const policy: Policy = decisionPolicy("checkpoint", (ctx) => {
  const mis = topMisconception(ctx);
  if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
  if ((ctx.mastery["sine"] ?? 0) >= 1) return [{ type: "signal.challenge" }];
  return [];
});

export const articleText: Record<string, RichText> = {
  hook: article(`# Sine from a circle
Every **wave** — a musical note, a light ray, an AC current — is the shadow of something turning in a circle. You're about to build one by hand.`),

  discover: article(`## Take the wheel
Grab the slider and send the point around. The dashed line carries its **height** to the right, tracing a curve as $\\theta$ grows.
> [tip] The circle and the wave are the *same motion*, seen two ways.`),

  crest: article(`## Where's the top?
The height above the centre **is** $\\sin\\theta$:
$$\\text{height} = \\sin\\theta$$
Find the angle where that height is as big as it gets.`),

  check: article(`## Quick check
You've found the crest. Now predict the **trough**.`),

  checkpoint: article(`Reading your answer…`),

  remediate: article(`## Let's feel the bottom
The most common slip is reading the point's *sideways* position instead of its **height**.
> [warning] Sideways is $\\cos\\theta$; height is $\\sin\\theta$.
Drag to 270° and watch the height hit its lowest.`),

  challenge: article(`## Going negative
Above the axis $\\sin\\theta>0$; below it, $\\sin\\theta<0$.
> Where, in one full turn, is the wave below zero?`),

  recap: article(`# You built a sine wave
- The **height** of a point circling at radius $1$ is $\\sin\\theta$
- Unrolling that height over $\\theta$ *is* the sine wave
- Crest $+1$ at $90°$, trough $-1$ at $270°$, zeros at $0°/180°/360°$`),
};
