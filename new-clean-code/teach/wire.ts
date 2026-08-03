import type { DirectionResult, DirectorActor, DirectorCommand, Observation } from "@lessonstudio/lesson";

/** Default mount point. Every path below is relative to it. */
export const TEACH_BASE = "/api/session";

/** The four endpoints, named so the client, the plugin and the CLIs cannot disagree. */
export const TEACH_PATHS = {
  sync: "/sync",
  log: "/log",
  observe: "/observe",
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
 * A history record, flattened for the log: one line, one event, `type` at the top level, rather
 * than the engine's nested `{event:{type,payload}}`.
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
 * One line of the session log — the teacher's primary view, so it carries both streams
 * interleaved: what the LESSON did (events, conversation turns) and what the TEACHER did (their
 * batches and the engine's verdicts on them).
 *
 * Time is NOT stamped here, so an in-process test can compare logs byte-for-byte; the dev plugin
 * adds `t` when it writes to disk.
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

function flatState(id: unknown): string {
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
