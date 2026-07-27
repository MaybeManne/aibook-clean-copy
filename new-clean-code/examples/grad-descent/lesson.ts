// Gradient-descent playground — the de-risking vertical slice for the ML/AI-internals
// wedge (see docs/VISION.md). It exercises EVERY new seam of the tutored-3D loop:
//
//   • a registered 3D (canvas 2.5D) viz            → App.tsx `grad-descent`
//   • the OUTBOUND viz channel (VizApi.send)       → the viz writes the dragged start
//       point to the blackboard (demo.set) and emits a SEMANTIC signal when the
//       learner blows the run up (signal.viz.diverged)
//   • an observing tutor, TWO ways:
//       1. real-time  — the `demo` beat ROUTES `signal.viz.diverged` → `remediate`
//          the instant the learner drives learning-rate past the stability edge;
//       2. settled-state — a `decisionPolicy` at `checkpoint` reads mastery/
//          misconceptions from the mcq and SELECTS a pre-authored remediation/challenge.
//   • semantic-vs-ephemeral split — lr / start point / outcome live in the IR
//       (replayable); camera + animation phase stay inside the viz.
//
// Flow spine: intro → demo → check → checkpoint → recap.
// `remediate` / `challenge` are OFF-spine detours reached only via routes.

import {
  decisionPolicy,
  defineLesson,
  explorable,
  mcq,
  topMisconception,
  type LessonSpec,
  type Policy,
} from "@lessonkit/lesson";
import { article, type RichText } from "@lessonkit/render-contract";

const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };
const LR = { key: "lr", label: "learning rate α", kind: "slider" as const, min: 0.05, max: 1.6, step: 0.05 };

export const lessonSpec: LessonSpec = {
  id: "gradient-descent",
  title: "Gradient descent, felt",
  version: 1,
  flow: [
    explorable({
      id: "intro",
      viz: { name: "grad-descent", props: { surface: "bowl", x0: -2.8, y0: 2.6 } },
      controls: [CONTINUE],
      defaults: { lr: 0.3 },
    }),

    // The heart of the slice. Drag the start point (→ demo.set, blackboard) and tune
    // α (→ demo.set). Play is LEARNER-PACED: the viz still emits `signal.viz.diverged`
    // when a run blows up (the tutor observes it), but it never routes you away —
    // adaptivity happens at the check + checkpoint below, when YOU press Continue.
    explorable({
      id: "demo",
      viz: { name: "grad-descent", props: { surface: "bowl" } },
      controls: [LR, CONTINUE],
      defaults: { lr: 0.3, x0: -2.8, y0: 2.6 },
      next: "check",
    }),

    mcq({
      id: "check",
      prompt: "If the learning rate α is too large, gradient descent will…",
      skill: "lr",
      choices: [
        { text: "…overshoot the valley and diverge", correct: true },
        { text: "…converge, just more slowly", misconception: "lr-too-small-model" },
        { text: "…always reach the minimum faster", misconception: "bigger-is-better" },
      ],
      correctFeedback: "Right — past a stability threshold each step overshoots and the loss blows up.",
      wrongFeedback: "Not quite — a large α makes each step overshoot, so the iterates diverge.",
      next: "checkpoint",
    }),

    // Decision node: on arrival the policy reads the blackboard and emits a signal.*
    // these routes map to a pre-authored beat; if neither fires it falls to `recap`.
    {
      ...explorable({
        id: "checkpoint",
        viz: { name: "grad-descent", props: { surface: "bowl", x0: -2.4, y0: 2.2 } },
        controls: [CONTINUE],
        next: "recap",
      }),
      routes: [
        { on: "signal.remediate", target: "remediate" },
        { on: "signal.challenge", target: "challenge" },
      ],
    },

    // Remediation: α is capped BELOW the stability edge, so the learner watches it
    // actually settle. Reached from the demo (real-time) or the checkpoint (policy).
    explorable({
      id: "remediate",
      viz: { name: "grad-descent", props: { surface: "bowl", x0: -2.8, y0: 2.6 } },
      controls: [{ ...LR, max: 0.9 }, CONTINUE],
      defaults: { lr: 0.2 },
      next: "recap",
    }),

    // Challenge: a curved ravine where a single global α is a poor fit — the payoff
    // for learners who nailed the concept.
    explorable({
      id: "challenge",
      viz: { name: "grad-descent", props: { surface: "ravine", x0: -3, y0: 2.4 } },
      controls: [LR, CONTINUE],
      defaults: { lr: 0.15 },
      next: "recap",
    }),

    explorable({ id: "recap", viz: { name: "grad-descent", props: { surface: "bowl", x0: 0.2, y0: -0.2 } }, controls: [], next: null }),
  ],
};

export const lesson = defineLesson(lessonSpec);

/** Adaptivity (settled-state): fires only on `checkpoint`; SELECTS a pre-authored route. */
export const policy: Policy = decisionPolicy("checkpoint", (ctx) => {
  const mis = topMisconception(ctx);
  if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
  if ((ctx.mastery["lr"] ?? 0) >= 1) return [{ type: "signal.challenge" }];
  return [];
});

/** The separately-authored explainer, keyed by beat id (book/blog prose). */
export const articleText: Record<string, RichText> = {
  intro: article(`# Gradient descent, felt
To train almost anything, we repeatedly step **downhill** on a loss surface:
$$\\theta \\leftarrow \\theta - \\alpha \\, \\nabla L(\\theta)$$
The step size $\\alpha$ — the **learning rate** — decides everything. Let's feel it.`),

  demo: article(`## Roll the ball
Drag the glowing start point anywhere on the surface, then tune the learning rate $\\alpha$.
Each step moves against the gradient by $\\alpha \\lVert\\nabla L\\rVert$.
- small $\\alpha$ → slow, safe crawl to the valley
- large $\\alpha$ → big leaps… maybe too big
> [tip] Crank $\\alpha$ up and watch what happens when the steps get greedy.`),

  check: article(`## Quick check
You've felt it. Now name it.`),

  checkpoint: article(`Reading your run…`),

  remediate: article(`## Rein it in
Past a threshold, each step **overshoots** the valley and the next gradient is even bigger — so the iterates spiral outward. That's divergence.
> [warning] "Bigger learning rate = faster" is the trap. Faster only *until* you cross the stability edge.
Here $\\alpha$ is capped safely below that edge — watch the ball actually settle.`),

  challenge: article(`## Challenge: the ravine
This surface is a **curved valley** — steep across, gentle along. One global $\\alpha$ is either too big for the steep direction or too small for the gentle one.
> This is exactly why momentum and per-parameter rates (Adam, RMSProp) exist.
*Find an $\\alpha$ that makes progress without bouncing off the walls.*`),

  recap: article(`# Recap
- Gradient descent steps downhill: $\\theta \\leftarrow \\theta - \\alpha\\nabla L$
- Too-large $\\alpha$ **overshoots** and diverges
- Curved valleys defeat a single global rate → adaptive optimizers
Nice work.`),
};
