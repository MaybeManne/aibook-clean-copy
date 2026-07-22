// FreeResponse beat: a fill-in-the-blank gate. Two-phase like MCQ:
//   "input.submit" (payload.value) → self-transition recording the answer
//   "next"                          → routes wrong → onWrong, else advance
// The submitted value is normalized and matched against `accept`. Answered-ness +
// last result live on the blackboard under beats[id] (flat node, v1).

import type { Action, Json, StateId, StateNode, Transition } from "@lessonkit/state-machine";
import type { RenderIntent, RichText } from "@lessonkit/render-contract";
import { text } from "@lessonkit/render-contract";
import type { LessonContext } from "../lesson_sm/context.js";
import { beatMeta, type BeatWireCtx, type BeatWiring, type RenderableBeat } from "./types.js";

export interface FreeResponseParams {
  prompt: string | RichText;
  /** Accepted answers (matched after normalization: trim, lowercase, collapse spaces). */
  accept: string[];
  hint?: string;
  correctFeedback?: string;
  wrongFeedback?: string;
  promptSlot?: string; // default "prompt"
  /** Adaptivity: a correct answer raises mastery of this skill (to 1). */
  skill?: string;
  /** Adaptivity: a wrong answer bumps this misconception's strength. */
  misconception?: string;
  onWrong?: string; // route a wrong answer to this beat id (a detour)
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

function recordAnswer(id: string, params: FreeResponseParams): Action<LessonContext> {
  const accepted = new Set(params.accept.map(norm));
  return (ctx, event) => {
    const value = ((event.payload ?? {}) as { value?: string }).value ?? "";
    const correct = accepted.has(norm(value));
    const prev = readLocal(ctx, id);
    const next: FrLocal = { attempts: prev.attempts + 1, lastValue: value, answered: true, lastCorrect: correct };
    const mastery = correct && params.skill ? { ...ctx.mastery, [params.skill]: 1 } : ctx.mastery;
    const misconceptions =
      !correct && params.misconception
        ? { ...ctx.misconceptions, [params.misconception]: (ctx.misconceptions[params.misconception] ?? 0) + 1 }
        : ctx.misconceptions;
    return { context: { beats: { ...ctx.beats, [id]: next }, score: correct ? ctx.score + 1 : ctx.score, mastery, misconceptions } };
  };
}

export const FreeResponseBeat: RenderableBeat<FreeResponseParams> = {
  type: "freeResponse",
  outcomes: ["correct", "wrong", "next"],

  build(params, id): StateNode {
    return { id, checkpoint: true, meta: beatMeta("freeResponse", params as unknown as Json) };
  },

  wire(params, id: StateId, { registry, defaultNext }: BeatWireCtx): BeatWiring {
    const recordRef = `fr.record:${id}`;
    registry.action(recordRef, recordAnswer(id, params));
    registry.guard(`fr.wasWrong:${id}`, (ctx) => {
      const l = ctx.beats[id] as FrLocal | undefined;
      return l ? !l.lastCorrect : false;
    });

    const dn = defaultNext();
    const onNext: Transition[] = [];
    if (params.onWrong) onNext.push({ guard: `fr.wasWrong:${id}`, target: params.onWrong });
    if (dn) onNext.push({ target: dn });

    return {
      on: {
        "input.submit": [{ target: id, actions: [recordRef] }],
        next: onNext,
      },
    };
  },

  render(params, _state, ctx): RenderIntent[] {
    const id = (ctx.vars.__activeBeat as string) ?? "";
    const l = readLocal(ctx, id);
    const prompt = typeof params.prompt === "string" ? text(params.prompt) : params.prompt;

    let feedback: RichText | undefined;
    if (l.answered) {
      feedback = text(
        l.lastCorrect ? params.correctFeedback ?? "Correct!" : params.wrongFeedback ?? params.hint ?? "Not quite — try again.",
      );
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
