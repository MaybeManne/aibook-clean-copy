import {
  FULL,
  directionCommand,
  directorHelp,
  formatObservation,
  observe,
  subjectFromContext,
  type BeatRegistry,
  type Capabilities,
  type DirectorCommand,
  type EffectContext,
  type EffectRunner,
  type Observation,
  type VisualSchema,
} from "@lessonstudio/lesson";
import type { Effect } from "@lessonstudio/state-machine";
import { commandsFromCalls, directorTools, type ToolCall } from "./tools.js";
import { anthropicToolCompleter, envApiKey, type ToolCompleter, type ToolMessage } from "./tool_call.js";

/** Why the director was woken. It changes what a good turn looks like, so the model is told. */
export type DirectorReason =
  | "question"
  | "step"
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

const DIRECTOR_BRIEF = [
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

/**
 * The full system prompt: the brief, the command reference, and the regime.
 *
 * `opts` carries what a director may AUTHOR — the beat types in the host's registry and the props
 * each registered visual accepts. Both are optional and both should be passed: without them the
 * model is told the ops and left to guess the payloads, which in practice means it never uses
 * `addBeat` at all.
 */
export function directorSystem(
  caps: Capabilities,
  extra?: string,
  opts: { beats?: BeatRegistry; visuals?: Record<string, VisualSchema> } = {},
): string {
  const parts = [DIRECTOR_BRIEF, "", directorHelp(opts)];
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
   * The beat registry this session compiled with. Documents the types the director may `addBeat`,
   * in both the system prompt and the tool schema. Defaults to `defaultBeatRegistry()`; pass the
   * host's own registry if it added types.
   */
  beats?: BeatRegistry;
  /**
   * How many times to ask when the model replies with prose instead of tool calls. Default 2.
   * Past the nudge, an empty turn is the outcome rather than a loop.
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
 * (`forge/tools.ts` generates them from the command union, so this function never enumerates an
 * op). A model turn ends the loop as soon as it calls anything — including `done`; prose with no
 * call gets one nudge (see `maxRounds`).
 */
export function claudeDirector(opts: ClaudeDirectorOptions = {}): Director {
  const complete = opts.complete ?? anthropicToolCompleter;
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const thinking = opts.thinking === false ? undefined : ({ type: "adaptive" } as const);
  const maxRounds = Math.max(1, opts.maxRounds ?? 2);

  return {
    async direct(req: DirectorRequest): Promise<DirectorCommand[]> {
      // The visuals come off the observation rather than a constructor option: the host already
      // declares them once for `observe()`, and a second place to say it is a second place to
      // forget. `catalog:false` frames simply carry no VISUALS block that turn.
      const visuals = req.observation.catalog?.visualSchemas;
      const system = directorSystem(req.capabilities, opts.brief, { beats: opts.beats, ...(visuals ? { visuals } : {}) });
      const tools = directorTools(req.capabilities, { ...(opts.beats ? { beats: opts.beats } : {}) });
      const messages: ToolMessage[] = [{ role: "user", text: directorPrompt(req) }];

      for (let n = 1; n <= maxRounds; n++) {
        let turn;
        try {
          turn = await complete({ system, messages, tools, model, maxTokens, apiKey: opts.apiKey, thinking });
        } catch (err) {
          opts.onWarn?.(`director call failed: ${err instanceof Error ? err.message : String(err)}`);
          return [];
        }
        opts.onRound?.({ n, text: turn.text, calls: turn.calls });

        const parsed = commandsFromCalls(turn.calls);
        if (parsed.unknown.length) opts.onWarn?.(`director called unknown tool(s): ${parsed.unknown.join(" ")}`);
        if (parsed.commands.length) return parsed.commands;
        if (parsed.done) return [];
        if (n === maxRounds) break;

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

export interface OfflineDirectorOptions {
  /**
   * A scripted sequence of turns, consumed one per `direct()` call. When it runs out the
   * fallback below takes over, so a script need only cover part of a session.
   */
  script?: DirectorCommand[][];
  /** Full manual control: return the turn for any request. Takes precedence over `script`. */
  respond?: (req: DirectorRequest, turn: number) => DirectorCommand[];
  /** Prose for the default answer to a question. */
  fallbackText?: string;
}

/**
 * The deterministic director — the keyless default. Answers a question and otherwise stays out
 * of the way, so the browser and the headless checks run the real code path (observation →
 * director → adjudication → history → replay) with nothing nondeterministic in it.
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
 * deterministic offline one. `ANTHROPIC_API_KEY` is the only difference between a scripted
 * teacher and a real one, and everything runs offline by default.
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

export interface DirectingRunnerOptions {
  capabilities?: Capabilities;
  /** How many recent conversation turns to show the director. Default 8. */
  recent?: number;
  /**
   * What each registered visual accepts (see `ObserveOptions.visuals`). Declared here, at the one
   * place the host wires the director in, and carried to the model on the observation — so a
   * director is told the real prop surface of the apparatus AND what it does not model.
   */
  visuals?: Record<string, VisualSchema>;
  /** Delegate for every effect kind other than `generate`. */
  base?: EffectRunner;
  /**
   * What to do when the director answers a QUESTION with nothing. Default: a short
   * acknowledgement that resumes the beat they asked from.
   */
  onSilence?: (req: DirectorRequest) => DirectorCommand[];
  onTurn?: (turn: { reason: DirectorReason; commands: DirectorCommand[] }) => void;
  onWarn?: (message: string) => void;
}

/**
 * An `EffectRunner` that routes the engine's `generate` effect to a `Director`, so a learner's
 * question is answered with a whole turn — prose *and* a zoomed figure *and* a moved slider,
 * atomically, exactly as the human teacher does.
 *
 * The observation is built from `ec.ctx` and `ec.lesson` via `subjectFromContext`, so this needs
 * no Session reference: an effect must not be able to re-enter the engine except through `send`.
 *
 * `ec.lesson` and not a captured one, deliberately. A director's own past answers live in beats
 * the Session spliced in AFTER this runner was built, so reading the compiled lesson made every
 * previous `say` project as empty text — the model could not see what it had already told the
 * learner, and answered each question as if it were the first.
 */
export function directingRunner(director: Director, opts: DirectingRunnerOptions = {}): EffectRunner {
  const capabilities = opts.capabilities ?? FULL;
  return {
    run(effect: Effect, ec: EffectContext): void {
      if (effect.kind !== "generate") {
        opts.base?.run(effect, ec);
        return;
      }
      const returnTo = typeof effect.returnTo === "string" ? effect.returnTo : undefined;
      const observation = observe(subjectFromContext(ec.lesson, ec.ctx, { activeBeat: returnTo }), {
        recent: opts.recent ?? 8,
        ...(opts.visuals ? { visuals: opts.visuals } : {}),
      });
      const req: DirectorRequest = {
        observation,
        text: formatObservation(observation),
        reason: "question",
        capabilities,
      };
      void Promise.resolve(director.direct(req))
        .then((commands) => {
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
