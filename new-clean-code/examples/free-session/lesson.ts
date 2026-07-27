// The free-session "campaign" — the DEFAULT graph, before the tutor authors anything.
// It is deliberately the smallest lesson that still holds the engine's invariants: just
// "ask me anything". There are no pre-authored acts; every answer is generated live (plan.ts).
//
// Two beats, by necessity:
//   • `home` — where the learner lives. An `explain` beat, so it renders NO Continue button:
//     nothing advances it. The learner only ever ASKS (via the always-on Composer), and each
//     generated answer beat rejoins `home`. Because `home` is non-terminal (its spine edge
//     points at `end`), `sess.done` stays false, so the shared conversation never flips to
//     "Lesson complete ✓".
//   • `end`  — a reachable ENDING. The engine requires one (compile.ts NO_TERMINAL) and a beat
//     can't be its own ending, so a lone self-looping `home` would fail to compile. The learner
//     never actually reaches `end`: `home` shows no Continue, and answers rejoin `home`.
//
// Declaration order IS the spine (builder.ts / compile.ts buildSpine): home → end, end terminal.

import { lesson as authorLesson } from "@lessonkit/lesson";
import { article } from "@lessonkit/render-contract";

export const lessonSpec = authorLesson("free-session", "Ask me anything", (l) => {
  l.explain("home", {
    text: article(`# Ask me anything

Type a question below and I'll answer live — with an explanation, some math, an illustration,
or a small interactive demo, whatever fits the question. Try:

- *"Explain the Pythagorean theorem"*
- *"Draw a triangle"*
- *"Plot the sine wave"*`),
    narration:
      "Ask me anything — I'll answer with explanations, math, diagrams, or interactive demos, generated live.",
  });

  // The reachable ending that keeps the lesson compilable. Unreachable in practice (see above).
  l.explain("end", {
    text: "That's the session — thanks for exploring.",
    narration: "Session complete.",
  });
});
