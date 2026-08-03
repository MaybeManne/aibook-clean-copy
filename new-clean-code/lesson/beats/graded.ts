import type { Action, Json, StateId, Transition } from "@lessonstudio/state-machine";
import type { RichText } from "@lessonstudio/intents";
import { md } from "../../intents/index.js";
import type { LessonContext } from "../lesson_sm/context.js";
import type { BeatWireCtx, BeatWiring } from "./types.js";

/** The two blackboard fields every graded beat keeps, whatever else it stores beside them. */
export interface GradedLocal extends Record<string, Json> {
  attempts: number;
  lastCorrect: boolean;
}

/** One graded answer, as the beat itself judges it. */
export interface Grade {
  correct: boolean;
  /**
   * What this beat remembers about the attempt, minus `attempts`/`lastCorrect` (which the
   * shared action owns). The full sub-object is written to `ctx.beats[id]` — the engine merges
   * context shallowly, so a partial write here would silently drop the other fields.
   */
  local: Record<string, Json>;
  /** A misconception this particular WRONG answer implicates, if it carried one. Ignored when
   *  `correct`. `mcq` reads it off the picked choice; `freeResponse` off its params. */
  misconception?: string | undefined;
}

/** The adaptivity params a graded beat may declare. */
export interface GradedParams {
  skill?: string | undefined;
}

/**
 * The action a graded beat registers for its answer event: grade the payload, then apply the
 * bookkeeping every graded beat shares. `grade` gets the raw payload and the PREVIOUS local
 * record and returns only what it alone knows; everything derived — the incremented attempt
 * count, the score, the two adaptivity maps — is applied here.
 */
export function gradedAction<P extends GradedParams>(
  id: string,
  params: P,
  grade: (payload: Record<string, unknown>, prev: GradedLocal) => Grade,
): Action<LessonContext> {
  return (ctx, event) => {
    const prev = (ctx.beats[id] as GradedLocal | undefined) ?? { attempts: 0, lastCorrect: false };
    const g = grade((event.payload ?? {}) as Record<string, unknown>, prev);
    const local = { ...g.local, attempts: prev.attempts + 1, lastCorrect: g.correct };
    const mastery = g.correct && params.skill ? { ...ctx.mastery, [params.skill]: 1 } : ctx.mastery;
    const misconceptions =
      !g.correct && g.misconception
        ? { ...ctx.misconceptions, [g.misconception]: (ctx.misconceptions[g.misconception] ?? 0) + 1 }
        : ctx.misconceptions;
    return {
      context: {
        beats: { ...ctx.beats, [id]: local },
        score: g.correct ? ctx.score + 1 : ctx.score,
        mastery,
        misconceptions,
      },
    };
  };
}

export interface GradedWiring extends BeatWireCtx {
  id: StateId;
  /** Registry namespace for this beat type: `mcq`, `fr`. Part of no persisted artifact —
   *  charts are compiled fresh — but keep it stable, since it reads in a chart dump. */
  prefix: string;
  /** The event the learner's answer arrives on (`mcq.answer`, `input.submit`). */
  answerEvent: string;
  /** Detour for a wrong answer, if the author declared one. */
  onWrong?: string | undefined;
  /** The graded action, built with `gradedAction`. */
  action: Action<LessonContext>;
}

/**
 * The two-phase flow both graded beats have:
 *
 *   answerEvent → SELF-transition that records the answer (so feedback shows in place)
 *   "next"      → wrong ? onWrong : the spine's next beat
 *
 * Recording is its own phase because the `wasWrong` guard reads the RECORDED result rather than
 * the event, so the routing decision needs no payload and replays identically. An empty `next`
 * list makes the beat terminal on advance, which is what `reachesTerminal` looks for.
 */
export function gradedWiring(w: GradedWiring): BeatWiring {
  const recordRef = `${w.prefix}.record:${w.id}`;
  const wasWrongRef = `${w.prefix}.wasWrong:${w.id}`;
  w.registry.action(recordRef, w.action);
  w.registry.guard(wasWrongRef, (ctx) => {
    const l = ctx.beats[w.id] as GradedLocal | undefined;
    return l ? !l.lastCorrect : false;
  });

  const dn = w.defaultNext();
  const onNext: Transition[] = [];
  if (w.onWrong) onNext.push({ guard: wasWrongRef, target: w.onWrong });
  if (dn) onNext.push({ target: dn });

  return {
    on: {
      [w.answerEvent]: [{ target: w.id, actions: [recordRef] }],
      next: onNext,
    },
  };
}

/**
 * Authored feedback → RichText, with a default. A string goes through `md()`, so inline `$math$`
 * and `**bold**` work in feedback exactly as in a beat's body.
 */
export function rich(v: string | RichText | undefined, dflt: string): RichText {
  return v === undefined ? md(dflt) : typeof v === "string" ? md(v) : v;
}
