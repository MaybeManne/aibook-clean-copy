// Live-agentic generation demo (Increment 2). A beat requests an LLM-authored
// remediation via a `generate` effect; the author returns a BeatSpec; Session
// splices it into the live chart, jumps into it, and records the carrier event in
// history — so REPLAY reconstructs the beat from data alone, never re-invoking the
// author. This is the "generate → freeze → replay" boundary (docs/VISION.md), and
// the same seam the ML flagship's real-time tutor will use with a real LLM client.

import { defineLesson, explain, generate, type LessonAuthor, type LessonSpec } from "@lessonkit/lesson";

export const genLessonSpec: LessonSpec = {
  id: "grad-descent-gen",
  title: "Gradient descent — live remediation",
  version: 1,
  flow: [
    explain({ id: "intro", text: "You drove the learning rate past the stability edge and the run diverged.", next: "gate" }),

    // On `ask.generate`, DECLARE a generate effect (the actual LLM call stays in the
    // runner) and move to a "thinking" placeholder; the runner's result arrives as
    // `beat.generated`, which Session splices in + jumps to.
    {
      ...explain({ id: "gate", text: "Ask the tutor to explain what just happened.", next: "outro" }),
      routes: [{ on: "ask.generate", actions: ["req-gen"], target: "thinking" }],
      __actions: {
        "req-gen": () => ({ effects: [generate({ topic: "divergence", misconception: "bigger-is-better" })] }),
      },
    },

    explain({ id: "thinking", text: "Generating a tailored explanation…", next: "outro" }),
    explain({ id: "outro", text: "Back to the lesson.", next: null }),
  ],
};

export const genLesson = defineLesson(genLessonSpec);

/**
 * A deterministic FAKE author (stands in for an LLM client — mirrors fakeTtsAdapter).
 * A real author would call the Claude API here and return the same BeatSpec shape.
 * It MUST return a valid BeatSpec; Session.spliceBeat validates and throws loudly if
 * the type is unknown or a target dangles.
 */
export const fakeAuthor: LessonAuthor = {
  generate({ effect }) {
    const topic = String(effect.topic ?? "this");
    return {
      id: "gen-remediation",
      type: "explain",
      params: {
        text: `Tailored for your run: when the learning rate is too large, each step overshoots the valley and the next gradient is larger still — that runaway is ${topic}. Shrink α below the stability edge and the same descent converges.`,
      },
      next: "outro",
    };
  },
};
