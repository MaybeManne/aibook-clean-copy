// THE BUS — a mailbox between one student page and one teacher, and nothing more.
//
// It holds no lesson, no Session, no chart. That is the design, not an omission: the page is
// authoritative, so this side can only queue what the teacher proposes, remember the last
// observation the page pushed, and file the verdicts that come back. Everything a teacher
// reads is derived from what the page sent; everything a teacher sends is adjudicated over
// there, by the engine, or not at all.
//
// PURE and time-free — no fs, no http, no `Date.now()`. So it runs identically in three
// places, which is what makes the tiers one implementation instead of three:
//   • behind the dev-server plugin (`dev_bus.ts`), for a real browser session;
//   • in-process, for headless tests and for the AI director (`busTransport`);
//   • in a future WebSocket server, if polling ever stops being enough.
//
// The log is the teacher's primary view ("just give me logs"), so it interleaves both
// streams: what the lesson did, and what the teacher did to it.

// The ONE value import reaches `direction/format.ts` DIRECTLY and relatively, rather than
// `@lessonstudio/lesson`. Not style — a load-order fact: this file is on `vite.config.ts`'s
// import path (through `dev_bus.ts`), and a vite config is bundled by esbuild before vite's
// own `resolve.alias` exists, so an aliased value import there cannot resolve. Going through
// the barrel would also drag the whole engine (session, beats, compile) into that bundle to
// obtain two pure string functions. `format.ts` has no value dependencies of its own, so this
// stays a leaf. The TYPES below keep using the alias: `import type` is erased, so it never
// needs resolving at all.
import { formatObservation, formatResult } from "../lesson/direction/format.js";
import type { DirectionResult, DirectorActor, DirectorCommand, Observation } from "@lessonstudio/lesson";
import type { LogLine, QueuedBatch, SyncRequest, SyncResponse, TurnVerdict } from "./wire.js";

/** A log line minus the index the bus assigns — distributed over the union member by member. */
type Unlined<T> = T extends { line: number } ? Omit<T, "line"> : never;

/** Where one proposed turn has got to. Reported by `/direct` so "not applied" is never
 *  confused with "refused": the first is a missing page, the second is the engine's answer. */
export type TurnStatus = "queued" | "dispatched" | "applied" | "unknown";

export interface SessionBus {
  /** browser → bus: the one round trip. Push state, pull queued commands. */
  sync(req: SyncRequest): SyncResponse;
  /** teacher → bus: queue one all-or-nothing turn. Returns its `turn` id. */
  enqueue(commands: DirectorCommand[], actor?: DirectorActor): number;
  /** The last observation the page pushed, or null before it connects. */
  observation(): Observation | null;
  /** That observation as text — the ONE serialization, the bytes a model would read too. */
  text(opts?: { catalog?: boolean; help?: boolean }): string;
  verdict(turn: number): DirectionResult | null;
  status(turn: number): TurnStatus;
  /** Resolve when the page reports a verdict for `turn`. Null if `tick(n)` calls elapse
   *  first — the bus has no clock, so the CALLER supplies the deadline (see `waitFor`). */
  await(turn: number): Promise<DirectionResult>;
  log(from?: number): LogLine[];
  onLog(fn: (line: LogLine) => void): () => void;
  /** A page has synced at least once. */
  readonly connected: boolean;
  /** The page's last reported step (`history.length`). */
  readonly step: number;
}

export function createSessionBus(): SessionBus {
  const lines: LogLine[] = [];
  const listeners = new Set<(l: LogLine) => void>();
  const queue: QueuedBatch[] = [];
  const dispatched = new Set<number>();
  const verdicts = new Map<number, DirectionResult>();
  const waiters = new Map<number, ((r: DirectionResult) => void)[]>();
  // A conversation turn is logged once. Keyed WITHOUT its text, because the transcript may
  // later coalesce a director gesture into an existing turn — re-logging the same turn every
  // time it grew would spam the tail, and the teacher already sees their own gesture as a
  // `direct` line. The current wording is always one `/observe` away.
  const seenTurns = new Set<string>();

  let obs: Observation | null = null;
  let ack = 0;
  let nextTurn = 1;
  let connected = false;

  // `Omit` over a union keeps only the shared keys, so it is spelled distributively here —
  // otherwise every `push` would have to launder its own payload through a cast.
  function push(l: Unlined<LogLine>): void {
    const line = { line: lines.length, ...l } as LogLine;
    lines.push(line);
    for (const fn of listeners) fn(line);
  }

  /** File one verdict: remember it, log it, wake whoever is waiting on that turn. */
  function report(v: TurnVerdict): void {
    verdicts.set(v.turn, v.result);
    dispatched.delete(v.turn);
    push({ kind: "verdict", turn: v.turn, ok: v.result.ok, text: formatResult(v.result) });
    const ws = waiters.get(v.turn);
    if (!ws) return;
    waiters.delete(v.turn);
    for (const w of ws) w(v.result);
  }

  return {
    get connected(): boolean {
      return connected;
    },
    get step(): number {
      return obs?.step ?? 0;
    },

    sync(req: SyncRequest): SyncResponse {
      if (!connected) {
        connected = true;
        push({ kind: "note", text: `student page connected at step ${req.step}` });
      }

      // 1. new history records → the event stream. `ack` is the page's cursor: it sends
      //    `history.slice(ack)`, so a record is logged exactly once even across reloads.
      for (const rec of req.records ?? []) {
        if (rec.seq < ack) continue;
        push({ kind: "event", step: rec.seq, type: rec.type, from: rec.from, to: rec.to });
        ack = Math.max(ack, rec.seq + 1);
      }

      // 2. the observation, plus any conversation turns it revealed. This is what makes the
      //    tail readable as a lesson rather than as a machine trace.
      obs = req.observation;
      for (const t of req.observation?.recent ?? []) {
        const key = `${t.seq}|${t.role}|${t.beatId}`;
        if (seenTurns.has(key) || !t.text) continue;
        seenTurns.add(key);
        push({ kind: "turn", seq: t.seq, role: t.role, beatId: t.beatId, text: t.text });
      }

      // 3. verdicts for turns this page applied. `formatResult` verbatim — the log shows the
      //    same bytes the director is answered with, so a tail is a usable session record.
      for (const v of req.verdicts ?? []) report(v);

      // 4. hand over the queue. A batch handed to a page that then dies is lost rather than
      //    re-delivered: silently re-running a teacher's turn against a session that has
      //    moved on is worse than making them resend it (and `/direct` says which happened).
      const out = queue.splice(0, queue.length);
      for (const b of out) dispatched.add(b.turn);
      return { ack, commands: out };
    },

    enqueue(commands: DirectorCommand[], actor: DirectorActor = "teacher"): number {
      const turn = nextTurn++;
      queue.push({ turn, actor, commands });
      push({ kind: "direct", turn, actor, commands });
      return turn;
    },

    observation(): Observation | null {
      return obs;
    },

    text(opts: { catalog?: boolean; help?: boolean } = {}): string {
      if (!obs) return "# no student page has connected yet";
      return formatObservation(obs, opts);
    },

    verdict(turn: number): DirectionResult | null {
      return verdicts.get(turn) ?? null;
    },

    status(turn: number): TurnStatus {
      if (verdicts.has(turn)) return "applied";
      if (dispatched.has(turn)) return "dispatched";
      if (queue.some((b) => b.turn === turn)) return "queued";
      return "unknown";
    },

    await(turn: number): Promise<DirectionResult> {
      const done = verdicts.get(turn);
      if (done) return Promise.resolve(done);
      return new Promise<DirectionResult>((resolve) => {
        const ws = waiters.get(turn) ?? [];
        ws.push(resolve);
        waiters.set(turn, ws);
      });
    },

    log(from = 0): LogLine[] {
      return from <= 0 ? lines.slice() : lines.slice(from);
    },

    onLog(fn: (l: LogLine) => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

/**
 * `bus.await(turn)` with a deadline, for a caller that does have a clock. Resolves null on
 * timeout rather than rejecting: "the page has not applied it yet" is an ordinary outcome a
 * teacher's terminal reports, not an error.
 */
export function waitFor(bus: SessionBus, turn: number, timeoutMs: number): Promise<DirectionResult | null> {
  if (timeoutMs <= 0) return Promise.resolve(bus.verdict(turn));
  return new Promise<DirectionResult | null>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, timeoutMs);
    void bus.await(turn).then((r) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    });
  });
}
