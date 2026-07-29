// M2 demo lesson — "But what is a convolution?" (interactive).
// The flow the vision calls for: (1) show the two distributions + guiding text, then
// (2) hand the student a REAL slider that flips-and-slides g across f so they watch the
// overlap interleave and the output (f∗g) generate itself, then (3) a check.
// The interactive figure is a registered SVG figure driven live by the slider value.

import { defineLesson, explorable, mcq } from "@lessonstudio/lesson";
import { math } from "@lessonstudio/render-contract";
import "./convolution.js"; // side-effect: registers the "convolution" + "conv-intro" figures

export const lessonSpec = {
  id: "convolution-intro",
  version: 1,
  title: "But what is a convolution?",
  flow: [
    // 1 — the two distributions + guiding text (a real "Start →" button advances)
    explorable({
      id: "intro",
      viz: { name: "conv-intro" },
      controls: [{ key: "__next", label: "Start →", kind: "button" }],
      note:
        "Here are two discrete distributions, $f$ and $g$. **Convolution** combines them into a " +
        "third, $f * g$. The value of $(f*g)[n]$ collects *every* way $f$ and $g$ can combine to " +
        "land at $n$: $\\;(f*g)[n] = \\sum_{k} f[k]\\, g[n-k]$.",
      next: "explore",
    }),

    // 2 — the interactive slider: flip g, slide it, watch the output build up
    explorable({
      id: "explore",
      viz: { name: "convolution" },
      controls: [
        { key: "shift", label: "shift  n", kind: "slider", min: 0, max: 5, step: 1 },
        { key: "__next", label: "I see how it builds — continue →", kind: "button" },
      ],
      defaults: { shift: 0 },
      note:
        "**Drag the slider.** For each shift $n$, $g$ is *flipped* and slid under $f$. Where they " +
        "overlap, the columns multiply — those are the gold products $f[k]\\,g[n-k]$ — and their " +
        "sum is the green bar $(f*g)[n]$. Slide right and watch the whole output curve generate itself.",
      next: "check",
    }),

    // 3 — check understanding
    mcq({
      id: "check",
      prompt: math("(f * g)[n] = \\sum_k f[k]\\,g[n-k]", true),
      choices: [
        { text: "It multiplies the two distributions pointwise.", misconception: "conv-is-pointwise-mult" },
        { text: "For each n, it sums every product f[k]·g[n−k] — the flipped, shifted overlap.", correct: true },
        { text: "It keeps the larger of f and g at each point.", misconception: "conv-is-max" },
      ],
      skill: "convolution-definition",
      correctFeedback: "Exactly — flip, slide, multiply the overlap, sum. That inner sum is the whole idea.",
      wrongFeedback: "Look at the slider again: at shift n the gold products are summed into the green bar.",
      next: null,
    }),
  ],
};

export const lesson = defineLesson(lessonSpec);
