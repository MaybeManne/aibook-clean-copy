// THE TEACHER'S SIDE of the wire, behind one interface with two implementations.
//
// `DirectionTransport` is what a director talks to — and the only thing it talks to. A human
// at a terminal (`cli/direct.ts`, `cli/tail.ts`) and, in tier 3, a model (`forge/`) both hold
// one of these and neither knows which implementation it got:
//   • `httpTransport` — polls the dev server; the real student-in-a-browser case.
//   • `busTransport`  — the same bus in-process; headless tests and the AI director loop run
//                       with no server, no port and no network, which is what keeps them
//                       deterministic and runnable offline.
//
// Three methods, because a director does exactly three things: look, act, and read back what
// happened. Swapping polling for a WebSocket later is a third implementation of this file's
// interface and touches nothing else.

import { formatObservation, formatResult, type DirectionResult, type DirectorActor, type DirectorCommand, type Observation } from "@lessonstudio/lesson";
import { waitFor, type SessionBus } from "./bus.js";
import {
  TEACH_BASE,
  TEACH_PATHS,
  teachUrl,
  type DirectRequest,
  type DirectResponse,
  type LogLine,
  type LogResponse,
} from "./wire.js";

/** What `observe()` gives a director: the value to reason over AND the bytes to read. */
export interface ObservedState {
  observation: Observation | null;
  text: string;
}

export interface ObserveRequest {
  /** Include the beat catalog (the id menu). Default true. */
  catalog?: boolean;
  /** Include the command reference. Default false — a model wants it in its system prompt. */
  help?: boolean;
}

export interface DirectOptions {
  actor?: DirectorActor;
  /** How long to wait for the page to apply the turn and report back. 0 ⇒ fire and forget. */
  timeoutMs?: number;
}

export interface DirectionTransport {
  /** Look: the current situation, as a value and as text. */
  observe(opts?: ObserveRequest): Promise<ObservedState>;
  /** Act: propose ONE all-or-nothing turn, and read the engine's verdict on it. */
  direct(commands: DirectorCommand[], opts?: DirectOptions): Promise<DirectResponse>;
  /** Read back: the session log from a cursor. */
  log(from?: number): Promise<LogResponse>;
}

// ── in-process ──────────────────────────────────────────────────────────────────

/**
 * Talk to a bus directly. Used by tests and by the AI director; identical semantics to the
 * HTTP transport because both are thin wrappers over the same bus methods — the point of
 * having the bus be pure.
 */
export function busTransport(bus: SessionBus, defaults: DirectOptions = {}): DirectionTransport {
  return {
    async observe(opts: ObserveRequest = {}): Promise<ObservedState> {
      const observation = bus.observation();
      return { observation, text: observation ? formatObservation(observation, opts) : bus.text(opts) };
    },
    async direct(commands: DirectorCommand[], opts: DirectOptions = {}): Promise<DirectResponse> {
      const turn = bus.enqueue(commands, opts.actor ?? defaults.actor ?? "teacher");
      const timeoutMs = opts.timeoutMs ?? defaults.timeoutMs ?? 0;
      const result = await waitFor(bus, turn, timeoutMs);
      return response(turn, commands.length, result, bus.status(turn));
    },
    async log(from = 0): Promise<LogResponse> {
      const lines = bus.log(from);
      return { lines, next: from + lines.length };
    },
  };
}

// ── over the dev server ─────────────────────────────────────────────────────────

export interface HttpTransportOptions extends DirectOptions {
  /** Origin of the dev server, e.g. `http://localhost:5188`. */
  origin?: string;
  /** Mount point (default `/api/session`). */
  base?: string;
  fetchImpl?: typeof fetch;
}

/**
 * Talk to the dev bus over the four endpoints. The teacher's terminal, a `curl`, and a model
 * driving the same paths are indistinguishable to the server — that symmetry is what makes
 * tier 3 "run the other client" rather than a second integration.
 */
export function httpTransport(opts: HttpTransportOptions = {}): DirectionTransport {
  const origin = (opts.origin ?? "").replace(/\/+$/, "");
  const base = teachUrl(origin, opts.base ?? TEACH_BASE);
  const f = opts.fetchImpl ?? fetch;

  async function json<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await f(`${base}${path}`, init);
    const body = await res.text();
    if (!res.ok) throw new Error(`${path} → HTTP ${res.status}: ${body.slice(0, 200)}`);
    return JSON.parse(body || "{}") as T;
  }

  return {
    async observe(o: ObserveRequest = {}): Promise<ObservedState> {
      const q = new URLSearchParams();
      if (o.catalog === false) q.set("catalog", "0");
      if (o.help) q.set("help", "1");
      const suffix = q.size ? `?${q.toString()}` : "";
      return json<ObservedState>(`${TEACH_PATHS.observe}${suffix}`);
    },
    async direct(commands: DirectorCommand[], o: DirectOptions = {}): Promise<DirectResponse> {
      const timeoutMs = o.timeoutMs ?? opts.timeoutMs ?? 6000;
      const payload: DirectRequest = { commands, actor: o.actor ?? opts.actor ?? "teacher", wait: timeoutMs > 0, timeoutMs };
      return json<DirectResponse>(TEACH_PATHS.direct, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    async log(from = 0): Promise<LogResponse> {
      return json<LogResponse>(`${TEACH_PATHS.log}?from=${from}`);
    },
  };
}

// ── shared ──────────────────────────────────────────────────────────────────────

/** Build the one response shape both transports return, rendering the verdict through the
 *  single formatter so a terminal and a prompt read the same bytes. */
export function response(turn: number, queued: number, result: DirectionResult | null, status: DirectResponse["status"]): DirectResponse {
  const out: DirectResponse = { turn, queued, applied: !!result, status };
  if (result) {
    out.result = result;
    out.text = formatResult(result);
  }
  return out;
}

/** Render a log line for a human tail. One line in, one line out; a verdict's multi-line
 *  `formatResult` text is indented under its header rather than reflowed. */
export function formatLogLine(l: LogLine): string {
  const n = String(l.line).padStart(4);
  switch (l.kind) {
    case "note":
      return `${n} --  ${l.text}`;
    case "event":
      return `${n} #${String(l.step).padEnd(3)} ${l.type.padEnd(20)} ${l.from} -> ${l.to}`;
    case "turn":
      return `${n} ${String(l.seq).padStart(3)} ${l.role.padEnd(7)} ${l.beatId.padEnd(14)} ${l.text}`;
    case "direct":
      return `${n} >>> turn ${l.turn} by ${l.actor}: ${l.commands.map((c) => c.op).join(" ")}\n${JSON.stringify(l.commands)}`;
    case "verdict":
      return `${n} <<< turn ${l.turn} ${l.ok ? "ok" : "REFUSED"}\n${l.text
        .split("\n")
        .map((s) => `       ${s}`)
        .join("\n")}`;
    default:
      return `${n} ${JSON.stringify(l)}`;
  }
}
