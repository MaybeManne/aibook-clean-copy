import type { EventRecord } from "../lesson_sm/context.js";
import type { LearnerModel, LearnerSignals, PolicyView } from "./contracts.js";

interface HeuristicState {
  understanding: number;
  struggling: number;
  engagement: number;
  lastScore: number;
  misStrength: number;
  answers: number;
  interactions: number;
  [k: string]: number;
}

const A = 0.4;
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
        const correct = ctx.score > state.lastScore;
        understanding = ewma(understanding, correct ? 1 : 0, A);
        struggling = ewma(struggling, correct ? 0 : 1, A);
        answers += 1;
      }

      if (misStrength > state.misStrength) struggling = clamp01(struggling + 0.3);

      if (type === "ask.submit" || type === "message.submit") {
        engagement = ewma(engagement, 1, 0.5);
        struggling = clamp01(struggling + 0.1);
      } else if (type === "demo.set") {
        engagement = ewma(engagement, 0.85, 0.25);
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
