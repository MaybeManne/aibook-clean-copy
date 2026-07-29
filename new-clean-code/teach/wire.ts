// THE WIRE between the student's page and the teacher's terminal. Four shapes and four
// paths, and that is the whole protocol.
//
// It is deliberately dumb: polling, plain JSON over the dev server, no WebSocket and no new
// dependency. Two reasons, both about who is authoritative. The STUDENT'S PAGE holds the
// Session — it adjudicates every command and it owns history — so the teacher's side must be
// a client that proposes and reads back, never a peer that mutates. And a poll loop is the
// one transport that is identical for a browser, a shell script, a `curl`, and (in tier 3) a
// model driving the same endpoints: nothing has to be re-plumbed to swap the human out.
//
// What crosses the wire is the STRUCTURED observation, not its text. Text is rendered on
// arrival by `formatObservation` — one formatter, called wherever a human or a model needs
// to read (see lesson/direction/format.ts). Sending pre-rendered text would fork that.

import type { DirectionResult, DirectorActor, DirectorCommand, Observation } from "@lessonstudio/lesson";

/** Default mount point. Every path below is relative to it. */
export const TEACH_BASE = "/api/session";

/** The four endpoints, named so the client, the plugin and the CLIs cannot disagree. */
export const TEACH_PATHS = {
  /** browser → bus: push state, pull queued commands. ONE round trip per frame. */
  sync: "/sync",
  /** teacher → bus: the append-only log (also readable as a jsonl file on disk). */
  log: "/log",
  /** teacher → bus: the current observation, `?format=text|json`. */
  observe: "/observe",
  /** teacher → bus: enqueue a turn of commands; the response carries the engine's verdict. */
  direct: "/direct",
} as const;

/** One director turn waiting to be applied. `turn` is the bus's own monotonic id, which is
 *  how a verdict finds its way back to the terminal that asked for it. */
export interface QueuedBatch {
  turn: number;
  actor: DirectorActor;
  commands: DirectorCommand[];
}

/** The engine's answer to one queued turn, reported back by the page that applied it. */
export interface TurnVerdict {
  turn: number;
  result: DirectionResult;
}

/**
 * A history record, flattened for the log. Nested `{event:{type,payload}}` is correct in the
 * engine and miserable in a jsonl a human greps, so the wire flattens it: one line, one
 * event, `type` at the top level.
 */
export interface LoggedRecord {
  seq: number;
  type: string;
  from: string;
  to: string;
  payload?: unknown;
}

/** browser → bus, once per frame (and on an idle timer, so queued commands still land). */
export interface SyncRequest {
  /** `observation.step` — the monotonic history length. Same step ⇒ same situation. */
  step: number;
  observation: Observation;
  /** History records the bus has not acknowledged yet (see `SyncResponse.ack`). */
  records?: LoggedRecord[];
  /** Verdicts for batches this page applied since its last sync. */
  verdicts?: TurnVerdict[];
}

/** bus → browser. */
export interface SyncResponse {
  /** How many records the bus has logged. The page sends `history.slice(ack)` next time. */
  ack: number;
  /** Turns to apply now, in the order the teacher sent them. */
  commands: QueuedBatch[];
}

/** teacher → bus. `wait` asks the bus to hold the response until the page reports a verdict
 *  (so `direct say …` prints ACCEPTED/REJECTED, not "queued"), bounded by `timeoutMs`. */
export interface DirectRequest {
  commands: DirectorCommand[];
  actor?: DirectorActor;
  wait?: boolean;
  timeoutMs?: number;
}

/** bus → teacher. `applied` false means no verdict came back in time — which is a different
 *  (and recoverable) thing from a rejection, so `status` says WHY: still `queued` (no page is
 *  polling), `dispatched` (a page took it and has not answered yet), or `applied`. */
export interface DirectResponse {
  turn: number;
  queued: number;
  applied: boolean;
  status: "queued" | "dispatched" | "applied" | "unknown";
  result?: DirectionResult;
  /** `formatResult(result)` when there is one — the same bytes the model would read. */
  text?: string;
}

/**
 * One line of the session log. The teacher's primary view, so it carries the two streams a
 * human actually wants interleaved: what the LESSON did (events, conversation turns) and what
 * the TEACHER did (their batches and the engine's verdicts on them).
 *
 * Time is NOT stamped here — the pure bus stays deterministic so an in-process test can
 * compare logs byte-for-byte. The dev plugin adds `t` when it writes to disk.
 */
export type LogLine =
  | { line: number; kind: "note"; text: string }
  | { line: number; kind: "event"; step: number; type: string; from: string; to: string }
  | { line: number; kind: "turn"; seq: number; role: string; beatId: string; text: string }
  | { line: number; kind: "direct"; turn: number; actor: DirectorActor; commands: DirectorCommand[] }
  | { line: number; kind: "verdict"; turn: number; ok: boolean; text: string };

/** bus → teacher for `GET /log?from=N`. `next` is the cursor to pass next time. */
export interface LogResponse {
  lines: LogLine[];
  next: number;
}

/**
 * Flatten a `StateId` (a string, or the object form a compound chart uses) to the one id a
 * log line shows. Mirrors what `observe`/`transcript` do — a log that printed `[object
 * Object]` for `from` would be worse than no log.
 */
export function flatState(id: unknown): string {
  if (typeof id === "string") return id;
  if (id && typeof id === "object") {
    const k = Object.keys(id as Record<string, unknown>)[0];
    if (k) return k;
  }
  return "";
}

/** One `EventRecord` → one `LoggedRecord`. Structurally typed: the wire does not need the
 *  engine's record type, only the four fields it prints. */
export function flattenRecord(rec: { seq: number; event: { type: string; payload?: unknown }; from: unknown; to: unknown }): LoggedRecord {
  const out: LoggedRecord = { seq: rec.seq, type: rec.event.type, from: flatState(rec.from), to: flatState(rec.to) };
  if (rec.event.payload !== undefined) out.payload = rec.event.payload;
  return out;
}

/** Join the base and a path without doubling or dropping a slash. */
export function teachUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, "")}${path}`;
}
