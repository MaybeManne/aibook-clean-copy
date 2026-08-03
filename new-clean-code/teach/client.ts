import { observe, type Session } from "@lessonstudio/lesson";
import { TEACH_BASE, TEACH_PATHS, flattenRecord, teachUrl, type LoggedRecord, type SyncRequest, type SyncResponse, type TurnVerdict } from "./wire.js";

export interface TeachClientOptions {
  /** Mount point, absolute or same-origin relative. Default `/api/session`. */
  url?: string;
  /**
   * Idle poll period. A frame pushes immediately, so this only bounds how long a teacher's
   * command waits while the learner is doing nothing — which is exactly when they intervene.
   */
  intervalMs?: number;
  /** Debounce for frame-triggered syncs, so a burst of effects is one round trip. */
  debounceMs?: number;
  /** Conversation turns per observation (default 8). */
  recent?: number;
  fetchImpl?: typeof fetch;
  /** Called on transport failure. Default: one `console.warn`, then silence. */
  onError?: (e: unknown) => void;
}

export interface TeachClient {
  /** Sync now (used by tests, and after applying a turn so the verdict lands promptly). */
  sync(): Promise<void>;
  /** Number of completed syncs — a walk can wait on this instead of sleeping blindly. */
  readonly syncs: number;
  /** Turns applied on this page. */
  readonly applied: number;
  detach(): void;
}

export function attachTeachClient(session: Session, opts: TeachClientOptions = {}): TeachClient {
  const base = teachUrl(opts.url ?? TEACH_BASE, "");
  const f = opts.fetchImpl ?? fetch;
  const recent = opts.recent ?? 8;
  const interval = opts.intervalMs ?? 1500;
  const debounce = opts.debounceMs ?? 80;
  const warn =
    opts.onError ??
    ((e: unknown): void => {
      console.warn("[teach] sync failed:", e instanceof Error ? e.message : e);
    });

  let ack = 0;
  let pending: TurnVerdict[] = [];
  let inFlight = false;
  let again = false;
  let syncs = 0;
  let applied = 0;
  let stopped = false;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function sync(): Promise<void> {
    if (stopped) return;
    if (inFlight) {
      again = true;
      return;
    }
    inFlight = true;
    try {
      const observation = observe(session, { recent });
      const records: LoggedRecord[] = session.context.history.slice(ack).map(flattenRecord);
      const body: SyncRequest = { step: observation.step, observation, records, verdicts: pending };
      const sent = pending;
      const res = await f(`${base}${TEACH_PATHS.sync}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const out = (await res.json()) as SyncResponse;
      if (sent.length) pending = pending.filter((v) => !sent.includes(v));
      if (typeof out.ack === "number") ack = out.ack;
      syncs++;

      for (const batch of out.commands ?? []) {
        const result = session.direct(batch.commands, batch.actor);
        pending.push({ turn: batch.turn, result });
        applied++;
      }
      if (out.commands?.length) again = true;
    } catch (e) {
      warn(e);
    } finally {
      inFlight = false;
      if (again && !stopped) {
        again = false;
        void sync();
      }
    }
  }

  function schedule(): void {
    if (stopped || debounceTimer) return;
    debounceTimer = setTimeout(() => {
      debounceTimer = undefined;
      void sync();
    }, debounce);
  }

  const detachSession = session.subscribe(() => schedule());
  const timer = setInterval(() => void sync(), interval);
  void sync();

  return {
    sync,
    get syncs() {
      return syncs;
    },
    get applied() {
      return applied;
    },
    detach(): void {
      stopped = true;
      detachSession();
      clearInterval(timer);
      if (debounceTimer) clearTimeout(debounceTimer);
    },
  };
}
