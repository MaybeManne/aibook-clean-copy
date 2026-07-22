// MCQ beat. Two-phase flow, wired per-instance:
//   "mcq.answer"  → self-transition that RECORDS the answer (feedback then shows)
//   "next"        → routes by recorded correctness: wasWrong → onWrong, else advance
// Attempt count + last result live on the blackboard under beats[id]. The node is
// FLAT in v1 (the interpreter resolves top-level only); answered-ness is a
// blackboard flag, not a nested child.

import type {
  Action,
  Json,
  StateId,
  StateNode,
  Transition,
} from "@lessonkit/state-machine";
import type { Choice, RenderIntent, RichText } from "@lessonkit/render-contract";
import { text } from "@lessonkit/render-contract";
import type { LessonContext } from "../lesson_sm/context.js";
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
  correctFeedback?: string;
  wrongFeedback?: string;
  promptSlot?: string; // default "prompt"
  /** Adaptivity: a correct answer raises mastery of this skill (to 1). */
  skill?: string;
  /** Flow: route a wrong answer to this beat id (a detour). */
  onWrong?: string;
  /** Flow: route a no-answer timeout to this beat id. */
  onTimeout?: string;
}

interface McqLocal extends Record<string, Json> {
  attempts: number;
  lastPicked: number; // -1 = none
  lastCorrect: boolean;
}

function readLocal(ctx: LessonContext, id: string): McqLocal {
  const l = ctx.beats[id] as McqLocal | undefined;
  return l ?? { attempts: 0, lastPicked: -1, lastCorrect: false };
}

/** Action factory: record an answer (choice index on the event payload). */
function recordAnswer(id: string, params: McqParams): Action<LessonContext> {
  return (ctx, event) => {
    const choice = ((event.payload ?? {}) as { choice?: number }).choice ?? -1;
    const picked = params.choices[choice];
    const correct = !!picked?.correct;
    const prev = readLocal(ctx, id);
    const next: McqLocal = { attempts: prev.attempts + 1, lastPicked: choice, lastCorrect: correct };
    // Adaptivity signals: correct → raise skill mastery; wrong tagged choice → bump misconception.
    const mastery = correct && params.skill ? { ...ctx.mastery, [params.skill]: 1 } : ctx.mastery;
    const misconceptions =
      !correct && picked?.misconception
        ? { ...ctx.misconceptions, [picked.misconception]: (ctx.misconceptions[picked.misconception] ?? 0) + 1 }
        : ctx.misconceptions;
    return {
      context: {
        beats: { ...ctx.beats, [id]: next },          // full sub-object (engine merges shallow)
        score: correct ? ctx.score + 1 : ctx.score,
        mastery,
        misconceptions,
      },
    };
  };
}

export const McqBeat: RenderableBeat<McqParams> = {
  type: "mcq",
  outcomes: ["correct", "wrong", "next"],

  build(params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("mcq", params as unknown as Json) };
  },

  wire(params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const recordRef = `mcq.record:${id}`;
    registry.action(recordRef, recordAnswer(id, params));
    // Guard reads the recorded result (record runs on answer, before `next`).
    registry.guard(`mcq.wasWrong:${id}`, (ctx) => {
      const l = ctx.beats[id] as McqLocal | undefined;
      return l ? !l.lastCorrect : false;
    });

    const dn = defaultNext();
    const onNext: Transition[] = [];
    if (params.onWrong) onNext.push({ guard: `mcq.wasWrong:${id}`, target: params.onWrong });
    if (dn) onNext.push({ target: dn });
    // else: onNext stays [] → "next" is terminal here.

    const on: Record<string, Transition[]> = {
      "mcq.answer": [{ target: id, actions: [recordRef] }], // self: record + show feedback
      next: onNext,
    };
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
    const prompt = typeof params.prompt === "string" ? text(params.prompt) : params.prompt;

    let feedback: RichText | undefined;
    if (answered) {
      feedback = text(
        l.lastCorrect
          ? params.correctFeedback ?? "Correct!"
          : params.wrongFeedback ?? "Not quite — let's revisit this.",
      );
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
