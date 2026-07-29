// TIER 3 — THE AI TEACHER. A model standing exactly where the human teacher stood.
//
// The whole design of tiers 2 and 3 was aimed at making this file boring, and it is: a
// director reads the observation the human reads (`formatObservation` — the same bytes, not a
// second rendering) and emits the commands the human emits (`DirectorCommand[]`, adjudicated
// by the same `adjudicate`). There is no AI-specific path into the engine. Swapping the human
// for the model is running a different client of `teach/`'s transport.
//
// Three things follow from that, and they are the reason to build it this way round:
//
//   • UNRESTRICTED BY DEFAULT, LIMITABLE BY CONFIG. The director runs under `FULL`
//     capabilities — every op, no per-turn cap — which is the "don't limit its power" half of
//     the requirement. The knob is `capabilities`, enforced in one place (`adjudicate`), so
//     tightening it later is a value, not a refactor.
//   • REPLAY IS FREE. Commands ride in recorded `direction.command` events, so
//     `replay(lesson, history)` rebuilds an AI-taught session with the model never called
//     again — "generate → freeze → replay" holds for a teacher exactly as it did for an
//     author. The model's memory of its own turn is the history, not a chat transcript.
//   • IT CANNOT BREAK THE LESSON. Every turn is adjudicated: an invalid beat, a dangling
//     target, a move that would strand the learner is refused WHOLE, and the refusal comes
//     back as the next observation's `last` — feedback in the same words a human would get.
//     So "unrestricted" means unrestricted in policy, never in structure.
//
// `direct()` takes ONE argument on purpose. The plan sketched `direct(obs, feedback)`, but the
// verdict on the previous turn is already inside the observation (`obs.last`) — because the
// human teacher needed it there. A second parameter would be a second channel, and then the
// model would be reading something the human never sees, which is the exact drift this whole
// arrangement exists to prevent.

import {
  COMMAND_HELP,
  FULL,
  directionCommand,
  formatObservation,
  observe,
  subjectFromContext,
  type Capabilities,
  type CompiledLesson,
  type DirectorCommand,
  type EffectContext,
  type EffectRunner,
  type Observation,
} from "@lessonstudio/lesson";
import type { Effect } from "@lessonstudio/state-machine";
import { envApiKey } from "./claude_author.js";
import { commandsFromCalls, directorTools, type ToolCall } from "./tools.js";
import { anthropicToolCompleter, type ToolCompleter, type ToolMessage } from "./tool_call.js";

/** Why the director was woken. It changes what a good turn looks like, so the model is told. */
export type DirectorReason =
  /** The learner asked something and is waiting on a thinking leaf. Answer it. */
  | "question"
  /** A step was committed and the director is being offered the situation (autonomous mode). */
  | "step"
  /** A human explicitly asked for a turn (`ai_teach --once`). */
  | "nudge";

/** One turn's worth of input: the situation, the bytes, and why now. */
export interface DirectorRequest {
  observation: Observation;
  /** The observation as text — the exact rendering the human teacher's terminal shows. */
  text: string;
  reason: DirectorReason;
  /** The regime this turn runs under. Reported to the model so it does not learn it from refusals. */
  capabilities: Capabilities;
}

/**
 * The pluggable teacher. One method, async, returning a turn of commands — an empty array is
 * a legitimate answer and the common one in autonomous mode ("they are fine, leave them").
 */
export interface Director {
  direct(req: DirectorRequest): Promise<DirectorCommand[]>;
}

// ── the system prompt ───────────────────────────────────────────────────────────

/**
 * The teaching brief. Short on purpose: the vocabulary is in the tool schemas and the
 * situation is in the observation, so what is left is the JUDGEMENT — when to speak, when to
 * point, when to shut up. That is the part a model gets wrong by default, because it is
 * rewarded for producing output, and a teacher's most common correct move is silence.
 */
export const DIRECTOR_BRIEF = [
  "You are the teacher of a live interactive lesson. A learner is working through it right now,",
  "and you are watching over their shoulder. You act by calling tools — the same commands a human",
  "teacher at a terminal uses. Everything you send is adjudicated by the engine; if a turn is",
  "refused you will see exactly why in the next observation, and you should fix it and resend.",
  "",
  "HOW TO TEACH HERE",
  "  • Answer the question they actually asked, in 1-3 sentences. `say` is your voice.",
  "  • Show, don't only tell. If your words refer to something on the stage, `focus` on it or",
  "    `annotate` it in the same turn — a turn is atomic, so prose + a zoom + a mark land together.",
  "  • Reuse what is already there. `revisit` re-shows a beat they have seen, posed with their",
  "    own current values, without taking away their place. Prefer it to `goto`.",
  "  • `setControl` moves their slider for them: better than describing a value, and it releases",
  "    a guided goal exactly as if they had dragged it themselves.",
  "  • Do not narrate structure ('I will now add a beat'). Just teach.",
  "  • If they are working and not stuck, call `done`. Interrupting a thinking learner is a cost.",
  "",
  "WHAT NOT TO DO",
  "  • Never invent a beat id. Only name ids from the BEATS catalog (this turn's own additions count).",
  "  • Never leave a `hold` on: release it in the same turn you set it up, or the very next one.",
  "  • Never assume a turn landed. Read the verdict at the top of the next observation.",
].join("\n");

/** The full system prompt: the brief, the command reference, and the regime. */
export function directorSystem(caps: Capabilities, extra?: string): string {
  const parts = [DIRECTOR_BRIEF, "", COMMAND_HELP];
  if (caps.allow !== "*" || caps.review?.length || caps.maxPerTurn) {
    parts.push("", `NOTE: you are running under capabilities "${caps.name}" — only the tools you were given are available.`);
  }
  if (extra) parts.push("", extra);
  return parts.join("\n");
}

/** The user message for one turn: why you are being woken, then the situation verbatim. */
export function directorPrompt(req: DirectorRequest): string {
  const why =
    req.reason === "question"
      ? "The learner asked you something and is waiting. Answer it."
      : req.reason === "step"
        ? "The learner just did something. Decide whether to step in — `done` is usually right."
        : "You have been asked for a turn.";
  return `${why}\n\n${req.text}`;
}

// ── the live director ───────────────────────────────────────────────────────────

export interface ClaudeDirectorOptions {
  /** Injectable provider call (tests, or the dev proxy). Default: the real Messages API. */
  complete?: ToolCompleter;
  /** Defaults to `process.env.ANTHROPIC_API_KEY` (Node only; never read in a browser). */
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  /** Adaptive thinking. `true`/omitted ⇒ on (this is a judgement task, unlike prose). */
  thinking?: boolean;
  /** Appended to the system prompt — the lesson's own subject-matter grounding. */
  brief?: string;
  /**
   * How many times to ask when the model replies with prose instead of tool calls. Default 2.
   * A director that only talks has done nothing, so it is nudged once; past that, an empty
   * turn is the honest outcome rather than a loop that spends tokens to look busy.
   */
  maxRounds?: number;
  /** Called with every provider round — the hook the tests count model calls through. */
  onRound?: (round: { n: number; text: string; calls: ToolCall[] }) => void;
  /** Called when a turn is dropped for a reason the caller may want to log. */
  onWarn?: (message: string) => void;
}

const DEFAULT_MODEL = "claude-opus-5";
const DEFAULT_MAX_TOKENS = 4096;

/**
 * The live AI teacher: a tool-calling loop whose tools ARE the direction protocol
 * (`forge/tools.ts` generates them from the command union, so this function never enumerates
 * an op and cannot fall behind one).
 *
 * A model turn ends the loop as soon as it calls anything — including `done`. Prose with no
 * call gets one nudge, because "I would explain that the aperture..." is a model describing a
 * turn instead of taking it, and saying so once fixes it far more cheaply than a forced
 * `tool_choice` on every request (which suppresses the model's own reasoning about whether to
 * act at all — the judgement we most want it exercising).
 */
export function claudeDirector(opts: ClaudeDirectorOptions = {}): Director {
  const complete = opts.complete ?? anthropicToolCompleter;
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const thinking = opts.thinking === false ? undefined : ({ type: "adaptive" } as const);
  const maxRounds = Math.max(1, opts.maxRounds ?? 2);

  return {
    async direct(req: DirectorRequest): Promise<DirectorCommand[]> {
      const system = directorSystem(req.capabilities, opts.brief);
      const tools = directorTools(req.capabilities);
      const messages: ToolMessage[] = [{ role: "user", text: directorPrompt(req) }];

      for (let n = 1; n <= maxRounds; n++) {
        let turn;
        try {
          turn = await complete({ system, messages, tools, model, maxTokens, apiKey: opts.apiKey, thinking });
        } catch (err) {
          // A provider failure is not a teaching decision: do nothing this turn and let the
          // lesson carry on. The learner's own beat is still on screen and still playable.
          opts.onWarn?.(`director call failed: ${err instanceof Error ? err.message : String(err)}`);
          return [];
        }
        opts.onRound?.({ n, text: turn.text, calls: turn.calls });

        const parsed = commandsFromCalls(turn.calls);
        if (parsed.unknown.length) opts.onWarn?.(`director called unknown tool(s): ${parsed.unknown.join(" ")}`);
        if (parsed.commands.length) return parsed.commands;
        if (parsed.done) return [];
        if (n === maxRounds) break;

        // Prose with no call. Say so, in the same terms the tools were offered in.
        messages.push({ role: "assistant", text: turn.text || "(no output)" });
        messages.push({
          role: "user",
          text:
            "That was not a turn — nothing reached the learner. Take the action itself: call the tools " +
            "(`say` to speak, `focus`/`annotate` to point, `setControl` to re-pose the visual), or call " +
            "`done` if the right move is to leave them alone.",
        });
      }
      opts.onWarn?.("director produced no tool calls; treating the turn as empty");
      return [];
    },
  };
}

// ── the offline director ────────────────────────────────────────────────────────

export interface OfflineDirectorOptions {
  /**
   * A scripted sequence of turns, consumed one per `direct()` call. When it runs out the
   * fallback below takes over, so a script can cover the interesting part of a session
   * without having to answer for the whole of it.
   */
  script?: DirectorCommand[][];
  /** Full manual control: return the turn for any request. Takes precedence over `script`. */
  respond?: (req: DirectorRequest, turn: number) => DirectorCommand[];
  /** Prose for the default answer to a question. */
  fallbackText?: string;
}

/**
 * The deterministic director — the keyless default, and the same pattern as `offlineAuthor`.
 *
 * Its default behaviour is the minimum a teacher owes a learner: answer a question, and
 * otherwise stay out of the way. That makes it a usable stand-in rather than a stub — the
 * browser walks and the headless tests run the real tier-3 code path (observation → director
 * → adjudication → history → replay) with nothing nondeterministic in it.
 */
export function offlineDirector(opts: OfflineDirectorOptions = {}): Director {
  const script = opts.script ? [...opts.script] : [];
  let turn = 0;
  return {
    async direct(req: DirectorRequest): Promise<DirectorCommand[]> {
      const n = turn++;
      if (opts.respond) return opts.respond(req, n);
      if (script.length) return script.shift() ?? [];
      const q = req.observation.pending;
      if (!q) return [];
      const text =
        opts.fallbackText ??
        `Good question — "${q.text}" is exactly the thing to be asking here. Let's look at it on the figure in front of you.`;
      return [{ op: "say", text, resume: q.from }];
    },
  };
}

/**
 * Pick the director at the seam: LIVE when a key (or a completer) is available, else the
 * deterministic offline one. The whole opt-in policy, in the shape `pickAuthor` established —
 * so `ANTHROPIC_API_KEY` is the only difference between a scripted teacher and a real one, and
 * everything runs offline by default.
 */
export function pickDirector(opts: ClaudeDirectorOptions & OfflineDirectorOptions = {}): Director {
  if (opts.complete) return claudeDirector(opts);
  const apiKey = opts.apiKey ?? envApiKey();
  return apiKey ? claudeDirector({ ...opts, apiKey }) : offlineDirector(opts);
}

/** True when a live director would be chosen — for a CLI banner that says which teacher ran. */
export function directorIsLive(opts: ClaudeDirectorOptions = {}): boolean {
  return !!(opts.complete ?? opts.apiKey ?? envApiKey());
}

// ── the reactive drive: a learner's question, answered by the AI teacher ────────

export interface DirectingRunnerOptions {
  capabilities?: Capabilities;
  /** How many recent conversation turns to show the director. Default 8. */
  recent?: number;
  /** Delegate for every effect kind other than `generate`. */
  base?: EffectRunner;
  /**
   * What to do when the director answers a QUESTION with nothing. Default: a short
   * acknowledgement that resumes the beat they asked from. Not optional in spirit — a learner
   * sitting on a thinking leaf with no answer coming is the one failure mode this path can
   * produce, and it is worse than a bland sentence.
   */
  onSilence?: (req: DirectorRequest) => DirectorCommand[];
  onTurn?: (turn: { reason: DirectorReason; commands: DirectorCommand[] }) => void;
  onWarn?: (message: string) => void;
}

/**
 * An `EffectRunner` that routes the engine's `generate` effect to a DIRECTOR instead of an
 * author — the reactive drive mode, and the drop-in upgrade of `generatingRunner`.
 *
 * The difference is what the learner's question can be answered WITH. An author returns a
 * beat; a director returns a turn, so the AI teacher can answer in prose *and* zoom the
 * figure *and* move the slider, atomically, exactly as the human teacher does. Same seam,
 * same event, same adjudication — `generatingRunner` remains for the author case and neither
 * knows about the other.
 *
 * The observation is built from `ec.ctx` via `subjectFromContext`, so this needs no Session
 * reference: an effect must not be able to re-enter the engine except through `send`.
 */
export function directingRunner(lesson: CompiledLesson, director: Director, opts: DirectingRunnerOptions = {}): EffectRunner {
  const capabilities = opts.capabilities ?? FULL;
  return {
    run(effect: Effect, ec: EffectContext): void {
      if (effect.kind !== "generate") {
        opts.base?.run(effect, ec);
        return;
      }
      const observation = observe(subjectFromContext(lesson, ec.ctx), { recent: opts.recent ?? 8 });
      const req: DirectorRequest = {
        observation,
        text: formatObservation(observation),
        reason: "question",
        capabilities,
      };
      void Promise.resolve(director.direct(req))
        .then((commands) => {
          // The beat that asked was exited (an interrupt, or they navigated) → drop the turn.
          // Standard effect cancellation: answering a question nobody is on any more would
          // yank a learner out of whatever they moved to.
          if (ec.signal.aborted) return;
          const turn = commands.length ? commands : (opts.onSilence ?? defaultSilence)(req);
          opts.onTurn?.({ reason: "question", commands: turn });
          if (turn.length) ec.send(directionCommand(turn, "ai"));
        })
        .catch((err) => {
          opts.onWarn?.(`director failed: ${err instanceof Error ? err.message : String(err)}`);
        });
    },
  };
}

/** The floor under a silent director: acknowledge, and give them back their beat. */
function defaultSilence(req: DirectorRequest): DirectorCommand[] {
  const q = req.observation.pending;
  if (!q) return [];
  return [
    {
      op: "say",
      text: "Let's come back to that in a moment — keep going with what's in front of you for now.",
      resume: q.from,
    },
  ];
}
