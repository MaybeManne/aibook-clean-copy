// THE OBSERVATION — everything a director needs to know to decide its next move, as one
// pure JSON value.
//
// This is the load-bearing piece of the whole design, and the reason is a constraint from
// the outset: the live teacher is a programmer who wants LOGS, and that ability has to
// transfer to an LLM afterwards. Both of those are satisfied by exactly one thing — a
// serializable snapshot of the situation — and only if there is ONE of it. So the human's
// terminal and the model's prompt read the same observation through the same formatter
// (`format.ts`), and swapping the human for the model is running a different client, not
// writing a second integration.
//
// Two properties it has to keep to earn that:
//   • PURE. It reads a settled session and allocates a value; it never sends, never waits.
//     So it is safe to call on every frame, and a test can assert on it headlessly.
//   • SELF-SUFFICIENT. It carries the ids a director must name (via `catalog`), the state
//     it must not clobber, the learner's outstanding question, AND the verdict on its own
//     previous turn. That last one is what closes the loop: a model that gets
//     "DANGLING_TARGET [flip]" back can fix its command without anyone parsing a stack trace.

import type { Json } from "@lessonstudio/state-machine";
import type { CompiledLesson } from "../lesson_sm/compile.js";
import type { LearnerSignals, LessonContext } from "../lesson_sm/context.js";
import { WORKSPACE_KEY } from "../beats/workspace.js";
import { projectTranscript, type TurnRole } from "../transcript.js";
import { toSource } from "@lessonstudio/render-contract";
import { beatCard, beatProseOf, catalog, type BeatCard, type LessonCatalog } from "./catalog.js";
import type { DirectionResult } from "./adjudicate.js";
import {
  ACTIVE_BEAT_VAR,
  ANNOTATIONS_VAR,
  AUTHORING_COMMAND_EVENT,
  DIRECTION_COMMAND_EVENT,
  FOCUS_VAR,
  GENERATED_BEAT_EVENT,
  HOLD_VAR,
  MESSAGE_SUBMIT_EVENT,
  type Annotation,
  type FocusState,
  type HoldState,
} from "./protocol.js";

/**
 * What `observe` needs from a running lesson — STRUCTURAL, not nominal. `Session` satisfies
 * it as-is, and stating it this way is what keeps `direction/` from importing `runtime/`
 * (which imports `direction/`): the seam stays acyclic, and a test can observe a hand-built
 * stub with no Session at all.
 */
export interface DirectionSubject {
  readonly lesson: CompiledLesson;
  readonly context: LessonContext;
  readonly done: boolean;
  activeBeatId(): string;
  /** The verdict on the previous director turn, when the host tracks one. */
  readonly lastResult?: DirectionResult | null;
}

/** One line of the recent conversation, flattened to plain text for a log or a prompt. */
export interface ObservedTurn {
  seq: number;
  role: TurnRole;
  beatId: string;
  kind: string;
  text: string;
}

/** A question the learner asked that no answer has landed for yet. */
export interface PendingQuestion {
  text: string;
  /** The beat they asked FROM — the one an answer should resume. */
  from: string;
  /** History seq of the asking event, so a director can tell "just now" from "a while ago". */
  seq: number;
}

export interface Observation {
  lesson: { id: string; version: number };
  /** Monotonic clock: `history.length`. Two observations with the same `step` are the same
   *  situation, which is how a polling client knows whether anything happened. */
  step: number;
  done: boolean;
  /** The beat on screen right now — including an ephemeral "thinking" leaf. */
  at: BeatCard | null;
  /** The beat a command with no explicit target means: the real beat behind an ephemeral
   *  leaf, else `at`. Named separately because those differ exactly when it matters. */
  anchor: string;
  /** THE WORDS ON THE LEARNER'S SCREEN — the `anchor` beat's prose in full, math included.
   *
   *  Everything else here describes the learner's STATE; this describes what they are looking
   *  at, which is what makes a question like "what's this integral?" answerable at all. It is
   *  the anchor's prose rather than the active leaf's precisely so that an interruption does
   *  not erase the subject: the learner asks FROM a beat, and that beat's content is what the
   *  question is about, even while an ephemeral "thinking" card is the thing on screen.
   *
   *  Truncated only past `showingMax` (and then visibly), because a teacher silently shown
   *  half a formula is worse off than one told the formula was clipped. */
  showing: string;
  /** What the stage is actually showing: the visual plus BOTH writers' values on it. */
  stage: {
    viz?: string;
    /** The learner's control values (the channel `setControl` writes). */
    values: Record<string, Json>;
    /** The director's own viz patch (the channel `workspace` writes). */
    workspace: Record<string, Json>;
  };
  /** Attention + pacing the director itself set — so it can see its own last gesture. */
  focus: FocusState | null;
  annotations: Annotation[];
  hold: HoldState | null;
  progress: {
    score: number;
    mastery: Record<string, number>;
    misconceptions: Record<string, number>;
  };
  /** Present only when the session runs a LearnerModel. */
  learner?: { model: string; signals: LearnerSignals };
  /** The tail of the conversation, oldest first. */
  recent: ObservedTurn[];
  /** An unanswered learner question, if there is one. The thing to act on first. */
  pending: PendingQuestion | null;
  /** The verdict on the director's PREVIOUS turn — accepted with notes, or refused with why. */
  last: DirectionResult | null;
  /** The menu of beats/visuals to name in a command. Omitted unless asked for (it is the
   *  large half of the payload and only changes when the lesson does). */
  catalog?: LessonCatalog;
}

export interface ObserveOptions {
  /** How many conversation turns to include (default 8). */
  recent?: number;
  /** Character budget for `showing` (default 1200 — a beat is a paragraph or two by design,
   *  so this clips only pathological prose, and says so when it does). */
  showingMax?: number;
  /** Include the full catalog. Default true on the first observation of a session and
   *  whenever the caller asks; a polling client can drop it to keep frames small. */
  catalog?: boolean;
}

/**
 * Snapshot a running lesson for a director. Pure — no I/O, no mutation, safe per frame.
 */
export function observe(subject: DirectionSubject, opts: ObserveOptions = {}): Observation {
  const { lesson, context } = subject;
  const activeId = subject.activeBeatId();
  const anchor = resumeAnchor(lesson, activeId);
  const at = beatCard(lesson, activeId);
  const local = (context.beats[anchor] as Record<string, Json> | undefined) ?? {};
  const values: Record<string, Json> = {};
  for (const [k, v] of Object.entries(local)) if (k !== WORKSPACE_KEY) values[k] = v;

  const obs: Observation = {
    lesson: { id: lesson.spec.id, version: lesson.spec.version },
    step: context.history.length,
    done: subject.done,
    at,
    anchor,
    showing: showing(lesson, anchor, opts.showingMax ?? 1200),
    stage: {
      ...(at?.viz?.name ? { viz: at.viz.name } : {}),
      values,
      workspace: (local[WORKSPACE_KEY] as Record<string, Json> | undefined) ?? {},
    },
    focus: (context.vars[FOCUS_VAR] as unknown as FocusState | undefined) ?? null,
    annotations: (context.vars[ANNOTATIONS_VAR] as unknown as Annotation[] | undefined) ?? [],
    hold: (context.vars[HOLD_VAR] as unknown as HoldState | undefined) ?? null,
    progress: { score: context.score, mastery: context.mastery, misconceptions: context.misconceptions },
    recent: recentTurns(subject, activeId, opts.recent ?? 8),
    pending: pendingQuestion(context),
    last: subject.lastResult ?? null,
  };
  if (context.learner) obs.learner = { model: context.learner.model, signals: context.learner.signals };
  if (opts.catalog !== false) obs.catalog = catalog(lesson);
  return obs;
}

/** The anchor beat's words, clipped only when absurdly long — and then it says so. */
function showing(lesson: CompiledLesson, anchor: string, max: number): string {
  const prose = beatProseOf(lesson, anchor);
  if (prose.length <= max) return prose;
  return `${prose.slice(0, max)}\n… (clipped — the beat shows ${prose.length} characters)`;
}

/**
 * A `DirectionSubject` from a bare (lesson, context) pair — no Session required.
 *
 * The active beat comes from `ctx.vars.__activeBeat`, which Session mirrors on every
 * committed step precisely so a holder of a CONTEXT can reconstruct the situation. The case
 * that needs it is the AI teacher answering a learner's question: that runs inside an EFFECT,
 * and an `EffectContext` carries `ctx` but deliberately not the Session that owns it (an
 * effect must not be able to re-enter the engine except through `send`). So the director gets
 * a real, complete observation without anyone widening that boundary.
 *
 * `done` is a parameter rather than derived: a context cannot know whether its state is
 * terminal, and every current caller is mid-lesson by construction (an effect is running).
 */
export function subjectFromContext(
  lesson: CompiledLesson,
  context: LessonContext,
  opts: { lastResult?: DirectionResult | null; done?: boolean } = {},
): DirectionSubject {
  const active = context.vars[ACTIVE_BEAT_VAR];
  const id = typeof active === "string" ? active : lesson.chart.initial;
  return {
    lesson,
    context,
    done: opts.done ?? false,
    activeBeatId: () => id,
    lastResult: opts.lastResult ?? null,
  };
}

/**
 * The real beat behind an ephemeral "thinking" leaf (its `resumeTo`), else the id itself.
 * Duplicated in spirit from Session's private `resumeTargetOf` because a director must be
 * able to compute it from a chart alone — this is the id its commands will default to.
 */
export function resumeAnchor(lesson: CompiledLesson, id: string): string {
  const beat = (lesson.chart.states[id]?.meta as { beat?: { params?: Record<string, unknown> } } | undefined)?.beat;
  const resumeTo = beat?.params?.resumeTo;
  return typeof resumeTo === "string" ? resumeTo : id;
}

function recentTurns(subject: DirectionSubject, activeId: string, n: number): ObservedTurn[] {
  if (n <= 0) return [];
  const turns = projectTranscript(subject.lesson, subject.context.history, activeId);
  return turns.slice(-n).map((t) => ({
    seq: t.seq,
    role: t.role,
    beatId: t.beatId,
    kind: t.kind,
    // `toSource`, not `toPlain`: a transcript line is read by a teacher or a model, and a beat
    // whose prose is mostly TeX would otherwise arrive as a wall of `\textcolor{#f87171}{…}`.
    text: t.content ? toSource(t.content).replace(/\s+/g, " ").trim() : "",
  }));
}

/**
 * The learner's outstanding question: the most recent `message.submit` / `ask.submit` with
 * no director turn after it. "Nothing after it" is the right test rather than tracking an
 * answered flag, because ANY director turn since is the answer (or a decision not to give
 * one) — and it stays a pure function of history, so replay agrees.
 */
function pendingQuestion(context: LessonContext): PendingQuestion | null {
  const asks = new Set([MESSAGE_SUBMIT_EVENT, "ask.submit"]);
  const answers = new Set([DIRECTION_COMMAND_EVENT, AUTHORING_COMMAND_EVENT, GENERATED_BEAT_EVENT]);
  for (let i = context.history.length - 1; i >= 0; i--) {
    const rec = context.history[i]!;
    const type = rec.event.type;
    if (answers.has(type)) return null;
    if (!asks.has(type)) continue;
    const payload = (rec.event.payload ?? {}) as { text?: unknown; value?: unknown };
    const raw = typeof payload.text === "string" ? payload.text : typeof payload.value === "string" ? payload.value : "";
    const q = raw.trim();
    if (!q) return null;
    const from = typeof rec.from === "string" ? rec.from : Object.keys(rec.from as Record<string, unknown>)[0]!;
    return { text: q, from, seq: rec.seq };
  }
  return null;
}
