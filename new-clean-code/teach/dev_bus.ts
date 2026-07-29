// THE DEV BUS — the four endpoints that put a live teacher next to a student's browser.
//
//   POST /api/session/sync      the page: push state, pull queued commands  (one round trip)
//   GET  /api/session/log       the teacher: the append-only log, from a cursor
//   GET  /api/session/observe   the teacher: the current situation, ?format=text|json
//   POST /api/session/direct    the teacher: propose a turn, read the engine's verdict
//
// Polling, plain JSON, no WebSocket, no new dependency. The state lives in a pure
// `SessionBus` (see bus.ts) and this file adds only the two things a dev server can offer
// that a pure module cannot: HTTP, and a log on disk. The disk half matters more than it
// looks — the requirement was "the teacher is a programmer who just needs logs", and the
// most honest answer to that is a real jsonl file they can `tail -f` with no client at all.
//
// NODE ONLY, and deliberately NOT re-exported from teach/index.ts — same reason as
// `audio/dev_tts.ts`: this file reaches for `node:fs` and is imported by vite.config.ts, and
// keeping it off the barrel is what stops it being pulled into a browser bundle.

import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createSessionBus, waitFor, type SessionBus } from "./bus.js";
// Direct and relative, not through the barrel — see the note in bus.ts: a vite config is
// bundled before `resolve.alias` exists.
import { formatObservation, formatResult } from "../lesson/direction/format.js";
import { TEACH_BASE, TEACH_PATHS, type DirectRequest, type DirectResponse, type LogResponse, type SyncRequest } from "./wire.js";

export interface TeachBusOptions {
  /** Directory for the session log (default `.session-log`). Truncated on server start: one
   *  dev-server run is one teaching session, and a stale tail is worse than none. */
  logDir?: string;
  /** Log file name (default `session.jsonl`). */
  file?: string;
  /** Mount point (default `/api/session`). */
  base?: string;
  /** Supply your own bus — a node-side harness can then read the same log the CLI reads. */
  bus?: SessionBus;
  /** Skip the startup banner. */
  quiet?: boolean;
  /** Default wait for `/direct` when the caller does not ask (ms). */
  waitMs?: number;
}

// ── vite dev-server shapes, structurally typed (no `vite` import) ────────────────

interface DevReq {
  method?: string | undefined;
  url?: string | undefined;
  on(event: "data", cb: (chunk: Buffer | string) => void): void;
  on(event: "end", cb: () => void): void;
  on(event: "error", cb: (e: unknown) => void): void;
}
interface DevRes {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}
interface DevServerLike {
  middlewares: {
    use(path: string, handler: (req: DevReq, res: DevRes, next: () => void) => void): void;
  };
}
export interface VitePluginLike {
  name: string;
  configureServer(server: DevServerLike): void;
}

function readBody(req: DevReq): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += typeof chunk === "string" ? chunk : chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

/** Query params from the remainder connect leaves on `req.url` after the mount prefix. */
function query(req: DevReq): URLSearchParams {
  const i = (req.url ?? "").indexOf("?");
  return new URLSearchParams(i >= 0 ? (req.url ?? "").slice(i + 1) : "");
}

function sendJson(res: DevRes, value: unknown, status = 200): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(value));
}

function sendText(res: DevRes, text: string, status = 200): void {
  res.statusCode = status;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end(text);
}

/** The plugin, plus the bus it serves so a node-side harness can drive it in-process. */
export interface TeachDevPlugin extends VitePluginLike {
  readonly bus: SessionBus;
  /** Absolute path of the jsonl the teacher can tail. */
  readonly logPath: string;
}

/**
 * Mount the bus on the Vite dev server.
 *
 * Every response is a 200-family JSON body even for a refused command: a rejection is the
 * engine's ANSWER, not a transport error, and collapsing the two would make a teacher's
 * terminal unable to tell "the server is down" from "you named a beat that doesn't exist".
 */
export function teachDevPlugin(opts: TeachBusOptions = {}): TeachDevPlugin {
  const bus = opts.bus ?? createSessionBus();
  const base = opts.base ?? TEACH_BASE;
  const dir = opts.logDir ?? ".session-log";
  const logPath = join(dir, opts.file ?? "session.jsonl");
  const defaultWait = opts.waitMs ?? 6000;

  // One dev-server run = one session log. Stamped with a wall clock HERE rather than in the
  // bus, so the bus stays deterministic and an in-process test can diff two logs.
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(logPath, "");
  } catch {
    /* a read-only checkout still serves the HTTP half — the log is a convenience */
  }
  bus.onLog((line) => {
    try {
      appendFileSync(logPath, `${JSON.stringify({ t: Date.now(), ...line })}\n`);
    } catch {
      /* ignore: never let logging break a lesson */
    }
  });

  return {
    name: "lessonstudio-teach",
    bus,
    logPath,
    configureServer(server: DevServerLike): void {
      if (!opts.quiet) {
        // eslint-disable-next-line no-console
        console.log(`[teach] ${base}/{sync,log,observe,direct} ready — log: ${logPath}`);
      }

      // ── the page ──────────────────────────────────────────────────────────────
      server.middlewares.use(`${base}${TEACH_PATHS.sync}`, (req, res, next) => {
        if (req.method !== "POST") return next();
        void (async () => {
          try {
            const body = JSON.parse((await readBody(req)) || "{}") as SyncRequest;
            sendJson(res, bus.sync(body));
          } catch (e) {
            sendJson(res, { error: String(e instanceof Error ? e.message : e) }, 400);
          }
        })();
      });

      // ── the teacher ───────────────────────────────────────────────────────────
      server.middlewares.use(`${base}${TEACH_PATHS.observe}`, (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const q = query(req);
        const fmt = { catalog: q.get("catalog") !== "0", help: q.get("help") === "1" };
        const observation = bus.observation();
        if (q.get("format") === "text") return sendText(res, bus.text(fmt));
        sendJson(res, { observation, text: observation ? formatObservation(observation, fmt) : bus.text(fmt) });
      });

      server.middlewares.use(`${base}${TEACH_PATHS.log}`, (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const q = query(req);
        const from = Number(q.get("from") ?? 0) || 0;
        const lines = bus.log(from);
        const out: LogResponse = { lines, next: from + lines.length };
        sendJson(res, out);
      });

      server.middlewares.use(`${base}${TEACH_PATHS.direct}`, (req, res, next) => {
        if (req.method !== "POST") return next();
        void (async () => {
          try {
            const body = JSON.parse((await readBody(req)) || "{}") as DirectRequest;
            const commands = Array.isArray(body.commands) ? body.commands : [];
            if (!commands.length) return sendJson(res, { error: "no commands" }, 400);
            const turn = bus.enqueue(commands, body.actor ?? "teacher");
            // Hold the response until the page applies the turn, so the terminal prints the
            // real verdict instead of "queued" — this is the whole loop, in one request.
            const ms = body.wait === false ? 0 : (body.timeoutMs ?? defaultWait);
            const result = await waitFor(bus, turn, ms);
            const out: DirectResponse = { turn, queued: commands.length, applied: !!result, status: bus.status(turn) };
            if (result) {
              out.result = result;
              out.text = formatResult(result);
            }
            sendJson(res, out);
          } catch (e) {
            sendJson(res, { error: String(e instanceof Error ? e.message : e) }, 400);
          }
        })();
      });
    },
  };
}
