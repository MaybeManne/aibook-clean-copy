import type { DirectionTransport, DirectResponse } from "@lessonstudio/teach";
import { FULL, type Capabilities, type DirectionResult, type DirectorCommand, type Observation } from "@lessonstudio/lesson";
import type { Director, DirectorReason } from "./director.js";

/** One completed pass of the loop, for a log line or a test assertion. */
export interface DriveTurn {
  /** 1-based index of this director turn within the run. */
  n: number;
  reason: DirectorReason;
  /** The step the observation was taken at. */
  step: number;
  commands: DirectorCommand[];
  /** The engine's verdict, once the page reports it. Null if nothing was sent, or if the
   *  page never applied the turn within the timeout (`response.status` says which). */
  result: DirectionResult | null;
  response: DirectResponse | null;
}

export interface DriveOptions {
  transport: DirectionTransport;
  director: Director;
  /** Default `FULL` — tier 3 unrestricted, as specified. */
  capabilities?: Capabilities;
  /** Answer unanswered learner questions. Default true. */
  reactive?: boolean;
  /** Offer the director every CHANGE in the situation — an advance, a slider, an answer — and
   *  not only questions. Default FALSE: opt-in, see the header. */
  autonomous?: boolean;
  /** Poll interval when the situation has not changed (ms). Default 700. */
  pollMs?: number;
  /** Stop after this many DIRECTOR TURNS (not polls). Default: unbounded. */
  maxTurns?: number;
  /** Stop after this many polls with nothing to do. Default: unbounded (a teacher waits). */
  maxIdlePolls?: number;
  /** Stop when the lesson reports done. Default true. */
  stopWhenDone?: boolean;
  /** How long to wait for the page to apply each turn (ms). Default 8000. */
  timeoutMs?: number;
  onTurn?: (turn: DriveTurn) => void;
  onPoll?: (obs: Observation | null) => void;
  onWarn?: (message: string) => void;
  /** Cooperative cancellation — the CLI wires SIGINT to this. */
  signal?: AbortSignal;
}

export interface DriveReport {
  turns: DriveTurn[];
  polls: number;
  /** Why the loop returned — useful in a test, and the last line the CLI prints. */
  stopped: "done" | "maxTurns" | "maxIdlePolls" | "aborted" | "disconnected";
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Run the AI teacher against a live session until it is done (or a bound is hit). Returns a
 * report rather than throwing, so a transport hiccup logs and the watch continues.
 */
export async function driveDirector(opts: DriveOptions): Promise<DriveReport> {
  const capabilities = opts.capabilities ?? FULL;
  const reactive = opts.reactive !== false;
  const autonomous = opts.autonomous === true;
  const pollMs = opts.pollMs ?? 700;
  const timeoutMs = opts.timeoutMs ?? 8000;
  const turns: DriveTurn[] = [];
  let polls = 0;
  let idle = 0;

  let answeredSeq = -1;
  let seenStep = -1;
  let rebase = false;

  for (;;) {
    if (opts.signal?.aborted) return { turns, polls, stopped: "aborted" };
    polls++;

    let observation: Observation | null = null;
    let text = "";
    try {
      const seen = await opts.transport.observe({ catalog: true });
      observation = seen.observation;
      text = seen.text;
    } catch (err) {
      opts.onWarn?.(`observe failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    opts.onPoll?.(observation);

    if (!observation) {
      idle++;
      if (opts.maxIdlePolls && idle >= opts.maxIdlePolls) return { turns, polls, stopped: "disconnected" };
      await sleep(pollMs);
      continue;
    }

    if (observation.done && opts.stopWhenDone !== false) return { turns, polls, stopped: "done" };

    if (rebase) {
      rebase = false;
      seenStep = Math.max(seenStep, observation.step);
    }

    const reason = wake(observation, { reactive, autonomous, answeredSeq, seenStep });

    if (!reason) {
      idle++;
      if (opts.maxIdlePolls && idle >= opts.maxIdlePolls) return { turns, polls, stopped: "maxIdlePolls" };
      await sleep(pollMs);
      continue;
    }
    idle = 0;

    if (observation.pending) answeredSeq = Math.max(answeredSeq, observation.pending.seq);
    seenStep = Math.max(seenStep, observation.step);

    let commands: DirectorCommand[] = [];
    try {
      commands = await opts.director.direct({ observation, text, reason, capabilities });
    } catch (err) {
      opts.onWarn?.(`director failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    const turn: DriveTurn = { n: turns.length + 1, reason, step: observation.step, commands, result: null, response: null };

    if (commands.length) {
      rebase = true;
      try {
        const res = await opts.transport.direct(commands, { actor: "ai", timeoutMs });
        turn.response = res;
        turn.result = res.result ?? null;
        if (!res.applied) opts.onWarn?.(`turn ${res.turn} not applied (${res.status})`);
      } catch (err) {
        opts.onWarn?.(`direct failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    turns.push(turn);
    opts.onTurn?.(turn);
    if (opts.maxTurns && turns.length >= opts.maxTurns) return { turns, polls, stopped: "maxTurns" };
    if (opts.signal?.aborted) return { turns, polls, stopped: "aborted" };
  }
}

/** Should the director be woken, and why? Pure — which is what makes the policy testable. */
export function wake(
  obs: Observation,
  s: { reactive: boolean; autonomous: boolean; answeredSeq: number; seenStep: number },
): DirectorReason | null {
  if (s.reactive && obs.pending && obs.pending.seq > s.answeredSeq) return "question";
  if (s.autonomous && obs.step > s.seenStep) return "step";
  return null;
}

/**
 * One turn, now: observe → direct → send. The `--once` path. Bounded and side-effect-free beyond
 * the turn itself, so a human can ask the AI teacher for a single intervention without handing
 * it the session.
 */
export async function directorTurn(
  opts: Pick<DriveOptions, "transport" | "director" | "capabilities" | "timeoutMs"> & { reason?: DirectorReason },
): Promise<DriveTurn> {
  const capabilities = opts.capabilities ?? FULL;
  const { observation, text } = await opts.transport.observe({ catalog: true });
  if (!observation) throw new Error("no student page has connected yet — nothing to teach");
  const reason = opts.reason ?? (observation.pending ? "question" : "nudge");
  const commands = await opts.director.direct({ observation, text, reason, capabilities });
  const turn: DriveTurn = { n: 1, reason, step: observation.step, commands, result: null, response: null };
  if (commands.length) {
    const res = await opts.transport.direct(commands, { actor: "ai", timeoutMs: opts.timeoutMs ?? 8000 });
    turn.response = res;
    turn.result = res.result ?? null;
  }
  return turn;
}
