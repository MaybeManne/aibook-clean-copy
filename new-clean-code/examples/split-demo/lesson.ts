import { defineLesson, explorable, mcq } from "@lessonstudio/authoring";
import { math } from "@lessonstudio/intents";
import "./convolution.js";

export const lessonSpec = {
  id: "convolution-intro",
  version: 1,
  title: "But what is a convolution?",
  flow: [
    explorable({
      id: "intro",
      viz: { name: "conv-intro" },
      controls: [{ key: "__next", label: "Start →", kind: "button" }],
      note:
        "Here are two discrete distributions, $f$ and $g$. **Convolution** combines them into a " +
        "third, $f * g$. The value of $(f*g)[n]$ collects *every* way $f$ and $g$ can combine to " +
        "land at $n$: $\\;(f*g)[n] = \\sum_{k} f[k]\\, g[n-k]$.",
      // Narration is prose, not the note read aloud: plain words, no notation, nothing to look at
      // while listening. It also gives every template a spoken track to pause — the control in the
      // composer bar appears exactly when the active beat has one.
      narration:
        "Here are two distributions. Convolution combines them into a third one, and each value of " +
        "that third one collects every way the two can combine to land in the same place.",
      next: "explore",
    }),

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
      narration:
        "Drag the slider. At each shift the second distribution is flipped and slid underneath the " +
        "first. Where they overlap the columns multiply, and the sum of those products is the green bar.",
      next: "check",
    }),

    mcq({
      id: "check",
      prompt: math("(f * g)[n] = \\sum_k f[k]\\,g[n-k]", true),
      choices: [
        { text: "It multiplies the two distributions pointwise.", misconception: "conv-is-pointwise-mult" },
        { text: "For each n, it sums every product f[k]·g[n−k] — the flipped, shifted overlap.", correct: true },
        { text: "It keeps the larger of f and g at each point.", misconception: "conv-is-max" },
      ],
      narration: "One question, then you are done. What does that sum actually do?",
      skill: "convolution-definition",
      correctFeedback: "Exactly — flip, slide, multiply the overlap, sum. That inner sum is the whole idea.",
      wrongFeedback: "Look at the slider again: at shift n the gold products are summed into the green bar.",
      next: null,
    }),
  ],
};

export const lesson = defineLesson(lessonSpec);
