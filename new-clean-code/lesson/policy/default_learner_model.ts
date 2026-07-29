// The batteries-included Perceive policy: a small, transparent heuristic model of
// the learner, ported in spirit from activeReader's EWMA `learnerModel.js`. It reads
// only what any lesson already records — score, misconceptions, and the shape of each
// move — so it works with no per-lesson configuration. Swap it by implementing your
// own `LearnerModel` and registering it under a different name; nothing else changes.
//
// It never sees the chart, so it can't tell "correct" from the answer directly.
// Instead it watches the blackboard the beats maintain: a rise in `score` means the
// last graded answer was right; a rise in total misconception strength means it was
// wrong / revealed a gap. That keeps the model decoupled from any specific beat type.

import type { EventRecord } from "../lesson_sm/context.js";
import type { LearnerModel, LearnerSignals, PolicyView } from "./contracts.js";

/** Persisted, replay-safe model state. Flat + Json so it rides on the blackboard. */
interface HeuristicState {
  understanding: number; // EWMA of answer correctness, 0..1
  struggling: number; // EWMA of "stuck" (wrong answers + new misconceptions), 0..1
  engagement: number; // EWMA of active participation, 0..1
  lastScore: number; // score at the previous fold, to detect a correct answer
  misStrength: number; // total misconception strength at the previous fold
  answers: number; // graded answers seen
  interactions: number; // discourse moves seen (answers, questions)
  [k: string]: number; // index signature so it satisfies the Json constraint
}

const A = 0.4; // EWMA weight for graded evidence (recent answers move the needle)
const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);
const ewma = (prev: number, obs: number, a: number): number => prev + a * (obs - prev);
const sum = (r: Record<string, number>): number => Object.values(r).reduce((t, n) => t + n, 0);

const GRADED = new Set(["mcq.answer", "input.submit"]);
const DISCOURSE = new Set(["mcq.answer", "input.submit", "ask.submit", "message.submit"]);

export function defaultLearnerModel(): LearnerModel<HeuristicState> {
  return {
    name: "heuristic-ewma",

    initial(): HeuristicState {
      return {
        understanding: 0.5,
        struggling: 0,
        engagement: 0.5,
        lastScore: 0,
        misStrength: 0,
        answers: 0,
        interactions: 0,
      };
    },

    observe(state: HeuristicState, record: EventRecord, view: PolicyView): HeuristicState {
      const ctx = view.context;
      const type = record.event.type;
      const misStrength = sum(ctx.misconceptions);

      let { understanding, struggling, engagement } = state;
      let { answers, interactions } = state;

      if (GRADED.has(type)) {
        // A graded answer: correct iff cumulative score ticked up since last fold.
        const correct = ctx.score > state.lastScore;
        understanding = ewma(understanding, correct ? 1 : 0, A);
        struggling = ewma(struggling, correct ? 0 : 1, A);
        answers += 1;
      }

      // A freshly reinforced misconception is a struggle signal on its own.
      if (misStrength > state.misStrength) struggling = clamp01(struggling + 0.3);

      // Asking a question is active engagement (and a mild struggle hint).
      if (type === "ask.submit" || type === "message.submit") {
        engagement = ewma(engagement, 1, 0.5);
        struggling = clamp01(struggling + 0.1);
      } else if (type === "demo.set") {
        engagement = ewma(engagement, 0.85, 0.25); // fiddling a control = still engaged
      }

      if (DISCOURSE.has(type)) interactions += 1;

      return {
        understanding: clamp01(understanding),
        struggling: clamp01(struggling),
        engagement: clamp01(engagement),
        lastScore: ctx.score,
        misStrength,
        answers,
        interactions,
      };
    },

    signals(state: HeuristicState): LearnerSignals {
      return {
        understanding: state.understanding,
        struggling: state.struggling,
        engagement: state.engagement,
      };
    },
  };
}
