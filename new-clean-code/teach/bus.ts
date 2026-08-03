import { formatObservation, formatResult } from "../lesson/direction/format.js";
import type { DirectionResult, DirectorActor, DirectorCommand, Observation } from "@lessonstudio/lesson";
import type { LogLine, QueuedBatch, SyncRequest, SyncResponse, TurnVerdict } from "./wire.js";

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
  const seenTurns = new Set<string>();

  let obs: Observation | null = null;
  let ack = 0;
  let nextTurn = 1;
  let connected = false;

  function push(l: Unlined<LogLine>): void {
    const line = { line: lines.length, ...l } as LogLine;
    lines.push(line);
    for (const fn of listeners) fn(line);
  }

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

      for (const rec of req.records ?? []) {
        if (rec.seq < ack) continue;
        push({ kind: "event", step: rec.seq, type: rec.type, from: rec.from, to: rec.to });
        ack = Math.max(ack, rec.seq + 1);
      }

      obs = req.observation;
      for (const t of req.observation?.recent ?? []) {
        const key = `${t.seq}|${t.role}|${t.beatId}`;
        if (seenTurns.has(key) || !t.text) continue;
        seenTurns.add(key);
        push({ kind: "turn", seq: t.seq, role: t.role, beatId: t.beatId, text: t.text });
      }

      for (const v of req.verdicts ?? []) report(v);

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
