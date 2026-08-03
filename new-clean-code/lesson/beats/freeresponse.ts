import type { Json, StateId, StateNode } from "@lessonstudio/state-machine";
import type { RenderIntent, RichText } from "@lessonstudio/intents";
import { md } from "../../intents/index.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { gradedAction, gradedWiring, rich, type Grade } from "./graded.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";

export interface FreeResponseParams {
  prompt: string | RichText;
  /** Accepted answers (matched after normalization: trim, lowercase, collapse spaces). */
  accept: string[];
  /** Feedback prose. A string is parsed as inline markdown+`$math$`, so it can carry symbols. */
  hint?: string | RichText;
  correctFeedback?: string | RichText;
  wrongFeedback?: string | RichText;
  promptSlot?: string;
  /** Adaptivity: a correct answer raises mastery of this skill (to 1). */
  skill?: string;
  /** Adaptivity: a wrong answer bumps this misconception's strength. */
  misconception?: string;
  onWrong?: string;
}

interface FrLocal extends Record<string, Json> {
  attempts: number;
  lastValue: string;
  answered: boolean;
  lastCorrect: boolean;
}

const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, "");

function readLocal(ctx: LessonContext, id: string): FrLocal {
  return (ctx.beats[id] as FrLocal | undefined) ?? { attempts: 0, lastValue: "", answered: false, lastCorrect: false };
}

function gradeText(accepted: Set<string>, params: FreeResponseParams, payload: Record<string, unknown>): Grade {
  const value = typeof payload.value === "string" ? payload.value : "";
  return {
    correct: accepted.has(norm(value)),
    local: { lastValue: value, answered: true },
    misconception: params.misconception,
  };
}

export const FreeResponseBeat: RenderableBeat<FreeResponseParams> = {
  type: "freeResponse",
  outcomes: ["correct", "wrong", "next"],

  paramsSchema: {
    doc:
      "A typed-answer checkpoint, graded by exact match after normalization (trim, lowercase, " +
      "strip whitespace). Only for answers with a short canonical form — use `mcq` otherwise.",
    params: {
      prompt: "the question; markdown + $math$",
      accept: "[string] — every spelling you will accept; matched after normalization",
      "?hint": "shown as the wrong-answer feedback when `wrongFeedback` is absent",
      "?correctFeedback": "prose shown after a right answer",
      "?wrongFeedback": "prose shown after a wrong answer",
      "?onWrong": "beat id to detour to on a wrong answer",
      "?skill": "a correct answer raises mastery of this skill name",
      "?misconception": "a wrong answer bumps this misconception's strength",
    },
    example: {
      prompt: "With $u=10$ and $v=5$, what is the magnification $m$?",
      accept: ["0.5", "1/2", ".5"],
      hint: "$m = v/u$.",
    },
  },

  build(params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("freeResponse", params as unknown as Json) };
  },

  wire(params, id: StateId, ctx: BeatWireCtx): BeatWiring {
    const accepted = new Set(params.accept.map(norm));
    return gradedWiring({
      ...ctx,
      id,
      prefix: "fr",
      answerEvent: "input.submit",
      onWrong: params.onWrong,
      action: gradedAction(id, params, (payload) => gradeText(accepted, params, payload)),
    });
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const l = readLocal(ctx, id);
    const prompt = typeof params.prompt === "string" ? md(params.prompt) : params.prompt;

    let feedback: RichText | undefined;
    if (l.answered) {
      feedback = l.lastCorrect
        ? rich(params.correctFeedback, "Correct!")
        : rich(params.wrongFeedback ?? params.hint, "Not quite — try again.");
    }

    return [
      {
        kind: "input",
        slot: params.promptSlot ?? "prompt",
        prompt,
        value: l.lastValue,
        answered: l.answered,
        correct: l.lastCorrect,
        feedback,
      } as unknown as RenderIntent,
    ];
  },
};
