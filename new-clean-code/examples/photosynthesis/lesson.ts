import { branch, defineLesson, explain, mcq } from "@lessonkit/lesson";
import { scoreAtLeast } from "./guards.js";

export const photosynthesis = defineLesson({
  id: "photosynthesis-101",
  version: 1,
  title: "How plants eat light",
  flow: [
    explain({
      id: "intro",
      text: "Plants turn sunlight into sugar. Let's see how.",
      visual: { kind: "image", src: "leaf.svg", slot: "stage" },
    }),

    mcq({
      id: "q1",
      prompt: "What gas do plants take IN during photosynthesis?",
      choices: [
        { text: "Oxygen" },
        { text: "Carbon dioxide", correct: true },
        { text: "Nitrogen" },
      ],
      wrongFeedback: "Not quite — think about what we breathe *out*.",
      onWrong: "remediate", // teacher-authored detour on a wrong answer
    }),

    // Detour beat: reached only via q1's onWrong route; rejoins the spine at the branch.
    explain({
      id: "remediate",
      text: "Recall: animals breathe OUT carbon dioxide. Plants take that IN.",
      next: "route",
    }),

    // Teacher-defined branch: the flow is the teacher's, not the engine's.
    branch({ id: "route", when: scoreAtLeast(1), then: "deep-dive", else: "recap" }),

    explain({ id: "deep-dive", text: "Great — now let's look at the Calvin cycle.", next: null }),
    explain({ id: "recap", text: "Let's recap the basics once more before moving on.", next: null }),
  ],
});
