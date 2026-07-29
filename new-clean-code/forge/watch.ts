// THE DRIVE LOOP — the AI teacher watching a live session over the transport, which is the
// same loop a human teacher runs by hand: look, decide, send, read the verdict.
//
// It is a client of `teach/`'s `DirectionTransport` and nothing else, so it runs unchanged
// against the dev bus over HTTP (a real student in a browser) or against a bus in-process
// (headless tests, no port, no network). That is the payoff of tier 2 having been built as
// logs-in/commands-out: tier 3 needed a loop, not an integration.
//
// TWO DRIVE MODES, and only one of them is on by default:
//
//   • REACTIVE (default). The director is woken when the learner has asked something that
//     nothing has answered yet. This is the mode with an obvious contract — a question is a
//     request for a teacher — and it costs one model call per question.
//   • AUTONOMOUS (opt-in). The director is offered every situation the learner creates — an
//     advance, a slider, an answer — and may reply with nothing. Off by default for two
//     reasons: it spends a model call per learner action, and it would make the browser walks
//     nondeterministic — an AI teacher that may interject at any step is exactly what a
//     screenshot test cannot assert against.
//
// The loop-avoidance rule is the interesting part. A director's own turn commits steps, so
// "wake whenever the situation changed" would wake the director on its own gesture, forever.
// The guard is to REBASE after acting: the poll that follows a turn adopts the situation as
// the new baseline instead of reacting to it. So the loop is driven by changes the director
// did not make — which, in a session, means the learner.
//
// The trigger is the step counter (`history.length`) rather than "a new learner-attributed
// turn in the transcript", because the transcript is a DISCOURSE document: it records
// questions and answers, and deliberately drops a Continue and a slider drag. Those are
// exactly the situations an autonomous teacher is watching for, so the gate has to be the
// engine's clock, not the conversation's.

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
 * Run the AI teacher against a live session until it is done (or a bound is hit).
 *
 * Returns a report rather than throwing: a director loop that dies on a transport hiccup is
 * worse than one that logs and keeps watching, because the student is still in the lesson.
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

  // What we have already acted on. `answeredSeq` stops a question being answered twice (the
  // observation keeps reporting it as pending until a director turn lands); `seenStep` is the
  // autonomous-mode gate — the situation must have moved on since we last looked at it.
  // `rebase` absorbs the step our OWN turn just produced (see the header's loop-avoidance rule).
  let answeredSeq = -1;
  let seenStep = -1;
  let rebase = false;

  for (;;) {
    if (opts.signal?.aborted) return { turns, polls, stopped: "aborted" };
    polls++;

    // ONE observe per poll: the value and its text come from the same snapshot, so the model
    // can never be shown bytes that describe a situation other than the one it is reasoning
    // over. (Two calls would be two snapshots — a race that would be very hard to see.)
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
      // No page has connected yet (or the server blinked). Waiting is correct — a teacher
      // sitting down before the student opens the lesson is the normal case.
      idle++;
      if (opts.maxIdlePolls && idle >= opts.maxIdlePolls) return { turns, polls, stopped: "disconnected" };
      await sleep(pollMs);
      continue;
    }

    if (observation.done && opts.stopWhenDone !== false) return { turns, polls, stopped: "done" };

    // The poll after our own turn re-baselines rather than reacting: what changed was us.
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

    // Claim the trigger BEFORE the (slow) model call, so a poll that fires while the director
    // is still thinking cannot ask it the same question again.
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
      // Whatever this turn does to the situation is ours, so absorb it on the next poll —
      // including a turn that lands late, which is why this is set even when it is refused.
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
    // No sleep after a turn: the situation just changed, so look again immediately.
  }
}

/** Should the director be woken, and why? Pure — which is what makes the policy testable. */
export function wake(
  obs: Observation,
  s: { reactive: boolean; autonomous: boolean; answeredSeq: number; seenStep: number },
): DirectorReason | null {
  // A question outranks everything: someone is waiting.
  if (s.reactive && obs.pending && obs.pending.seq > s.answeredSeq) return "question";
  // Autonomous: only once the situation has moved on from the one we last considered. `-1`
  // means we have not looked yet, so sitting down mid-lesson offers the current situation.
  if (s.autonomous && obs.step > s.seenStep) return "step";
  return null;
}

/**
 * One turn, now: observe → direct → send. The `--once` path, and the honest unit the loop is
 * built from. Bounded and side-effect-free beyond the turn itself, so a human can ask the AI
 * teacher for a single intervention without handing it the session.
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
