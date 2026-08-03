import type { Json, StateId, StateNode, Transition } from "@lessonstudio/state-machine";
import type { Choice, RenderIntent, RichText } from "@lessonstudio/intents";
import { md } from "../../intents/index.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { gradedAction, gradedWiring, rich, type Grade } from "./graded.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";

export interface ChoiceSpec {
  text: string;
  correct?: boolean;
  /** Adaptivity: picking this wrong choice bumps this misconception's strength. */
  misconception?: string;
}

export interface McqParams {
  prompt: string | RichText;
  choices: ChoiceSpec[];
  maxAttempts?: number;
  /** Feedback prose. A string is parsed as inline markdown+`$math$`, so it can carry symbols. */
  correctFeedback?: string | RichText;
  wrongFeedback?: string | RichText;
  promptSlot?: string;
  /** Adaptivity: a correct answer raises mastery of this skill (to 1). */
  skill?: string;
  /** Flow: route a wrong answer to this beat id (a detour). */
  onWrong?: string;
  /** Flow: route a no-answer timeout to this beat id. */
  onTimeout?: string;
  /**
   * Optional spoken narration — a plain string, synthesized on DEMAND (see
   * `ExplainParams.narration`). The live host reads `params.narration` off ANY beat,
   * so a checkpoint question can speak its prompt without special-casing.
   */
  narration?: string;
}

interface McqLocal extends Record<string, Json> {
  attempts: number;
  lastPicked: number;
  lastCorrect: boolean;
}

function readLocal(ctx: LessonContext, id: string): McqLocal {
  const l = ctx.beats[id] as McqLocal | undefined;
  return l ?? { attempts: 0, lastPicked: -1, lastCorrect: false };
}

function gradeChoice(params: McqParams, payload: Record<string, unknown>): Grade {
  const choice = typeof payload.choice === "number" ? payload.choice : -1;
  const picked = params.choices[choice];
  return {
    correct: !!picked?.correct,
    local: { lastPicked: choice },
    misconception: picked?.misconception,
  };
}

export const McqBeat: RenderableBeat<McqParams> = {
  type: "mcq",
  outcomes: ["correct", "wrong", "next"],

  paramsSchema: {
    doc: "A multiple-choice checkpoint. Marks the beat a checkpoint, so it scores and gates progress.",
    params: {
      prompt: "the question; markdown + $math$",
      choices: "[{text, correct?, misconception?}] — exactly one should be `correct: true`",
      "?correctFeedback": "prose shown after a right answer (default 'Correct!')",
      "?wrongFeedback": "prose shown after a wrong answer",
      "?onWrong": "beat id to detour to on a wrong answer",
      "?skill": "a correct answer raises mastery of this skill name",
      "?narration": "spoken variant, synthesized on demand",
    },
    example: {
      prompt: "Doubling $u$ while holding $v$ fixed does what to the image?",
      choices: [
        { text: "Halves it", correct: true },
        { text: "Doubles it", misconception: "m-proportional-to-u" },
      ],
      correctFeedback: "Right — $m=v/u$, so $u$ is in the denominator.",
    },
  },

  build(params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("mcq", params as unknown as Json) };
  },

  wire(params, id: StateId, ctx: BeatWireCtx): BeatWiring {
    const wiring = gradedWiring({
      ...ctx,
      id,
      prefix: "mcq",
      answerEvent: "mcq.answer",
      onWrong: params.onWrong,
      action: gradedAction(id, params, (payload) => gradeChoice(params, payload)),
    });
    const on: Record<string, Transition[]> = { ...wiring.on };
    if (params.onTimeout) on["mcq.timeout"] = [{ target: params.onTimeout }];
    return { on };
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const l = readLocal(ctx, id);
    const answered = l.lastPicked >= 0;

    const choices: Choice[] = params.choices.map((c, i) => ({
      text: c.text,
      picked: answered && l.lastPicked === i,
      revealedCorrect: answered && !!c.correct,
    }));
    const prompt = typeof params.prompt === "string" ? md(params.prompt) : params.prompt;

    let feedback: RichText | undefined;
    if (answered) {
      feedback = l.lastCorrect ? rich(params.correctFeedback, "Correct!") : rich(params.wrongFeedback, "Not quite — let's revisit this.");
    }

    return [
      {
        kind: "mcq",
        slot: params.promptSlot ?? "prompt",
        prompt,
        choices,
        state: answered ? "answered" : "unanswered",
        feedback,
      },
    ];
  },
};
