// Interactive "video-game" lesson demoing the three new capabilities:
//   1. explorable demo  — drag the radius, the figure recomputes live (Phase 1)
//   2. adaptivity        — a wrong answer routes to remediation, a right one to a
//                          challenge, via a policy that reads the blackboard (Phase 2)
//   3. article reader    — the right panel is an authored book/blog explainer (Phase 3)
//
// Flow spine: intro → demo → check → checkpoint → recap.
// `remediate`/`challenge` are OFF-spine detours reached only via signal.* routes
// the `checkpoint` decision node exposes; the policy only SELECTS among them.

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

export const lessonSpec: LessonSpec = {
  id: "circle-area",
  title: "The area of a circle",
  version: 1,
  flow: [
    explorable({ id: "intro", viz: { name: "circle-area", props: { r: 4 } }, controls: [CONTINUE] }),

    explorable({
      id: "demo",
      viz: { name: "circle-area" },
      controls: [
        { key: "r", label: "radius r", kind: "slider", min: 1, max: 8, step: 1 },
        CONTINUE,
      ],
      defaults: { r: 3 },
    }),

    mcq({
      id: "check",
      prompt: "If you double the radius, the area…",
      skill: "scaling",
      choices: [
        { text: "…quadruples (×4)", correct: true },
        { text: "…doubles (×2)", misconception: "linear" },
        { text: "…triples (×3)", misconception: "linear" },
      ],
      correctFeedback: "Exactly — area scales with r².",
      wrongFeedback: "Not quite — area depends on r², not r.",
    }),

    // Decision node: on arrival the policy reads mastery/misconceptions and emits a
    // signal.* that these routes map to a pre-authored beat. If neither fires it
    // falls through to `recap`.
    {
      ...explorable({ id: "checkpoint", viz: { name: "circle-area", props: { r: 5 } }, controls: [CONTINUE], next: "recap" }),
      routes: [
        { on: "signal.remediate", target: "remediate" },
        { on: "signal.challenge", target: "challenge" },
      ],
    },

    explorable({
      id: "remediate",
      viz: { name: "circle-area" },
      controls: [{ key: "r", label: "radius r", kind: "slider", min: 1, max: 6, step: 1 }, CONTINUE],
      defaults: { r: 2 },
      next: "recap",
    }),

    explorable({ id: "challenge", viz: { name: "circle-area", props: { r: 6 } }, controls: [CONTINUE], next: "recap" }),

    explorable({ id: "recap", viz: { name: "circle-area", props: { r: 4 } }, controls: [], next: null }),
  ],
};

export const lesson = defineLesson(lessonSpec);

/** Adaptivity: fires only on the `checkpoint` beat; picks a pre-authored route. */
export const policy: Policy = decisionPolicy("checkpoint", (ctx) => {
  const mis = topMisconception(ctx);
  if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
  if ((ctx.mastery["scaling"] ?? 0) >= 1) return [{ type: "signal.challenge" }];
  return [];
});

/** The separately-authored explainer, keyed by beat id (book/blog prose). */
export const articleText: Record<string, RichText> = {
  intro: article(`# The area of a circle
A circle's area grows with the **square** of its radius:
$$A = \\pi r^2$$
That little exponent changes everything — let's build intuition for it.`),

  demo: article(`## Play with it
Drag the radius and watch the area respond. Notice how *fast* the area grows.
- the radius $r$ grows linearly
- the area $A = \\pi r^2$ grows **quadratically**
> [tip] Try going from $r = 2$ to $r = 4$. Did the area merely double?`),

  check: article(`## Quick check
You've felt the growth. Now predict it.`),

  checkpoint: article(`Reading your answer…`),

  remediate: article(`## Let's revisit scaling
Doubling $r$ multiplies the area by $2^2 = 4$ — not 2. Area lives in **two dimensions**, so it scales with the *square* of the radius.
> [warning] "Double the radius → double the area" is the most common trap here.
Drag the slider again and watch the area **quadruple** as $r$ goes $2 \\to 4$.`),

  challenge: article(`## Challenge
You've got the $r^2$ idea. Here's a harder one:
> A pizza of radius 10 costs \\$12. What should a radius-15 pizza cost for the same price-per-area?
*Hint: areas scale as $15^2 / 10^2 = 2.25$.*`),

  recap: article(`# Recap
- Area is $A = \\pi r^2$
- It scales with the **square** of the radius
- Doubling $r$ gives **×4** the area
Nice work.`),
};
