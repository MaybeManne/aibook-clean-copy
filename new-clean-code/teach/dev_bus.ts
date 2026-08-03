import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { postJson, query, sendJson, sendText, type VitePluginLike } from "../dev/http.js";
import { createSessionBus, waitFor, type SessionBus } from "./bus.js";
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

/** The plugin, plus the bus it serves so a node-side harness can drive it in-process. */
export interface TeachDevPlugin extends VitePluginLike {
  readonly bus: SessionBus;
  /** Absolute path of the jsonl the teacher can tail. */
  readonly logPath: string;
}

/**
 * Mount the bus on the Vite dev server. Every response is a 200-family JSON body even for a
 * refused command: a rejection is the engine's ANSWER, not a transport error.
 */
export function teachDevPlugin(opts: TeachBusOptions = {}): TeachDevPlugin {
  const bus = opts.bus ?? createSessionBus();
  const base = opts.base ?? TEACH_BASE;
  const dir = opts.logDir ?? ".session-log";
  const logPath = join(dir, opts.file ?? "session.jsonl");
  const defaultWait = opts.waitMs ?? 6000;

  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(logPath, "");
  } catch {
  }
  bus.onLog((line) => {
    try {
      appendFileSync(logPath, `${JSON.stringify({ t: Date.now(), ...line })}\n`);
    } catch {
    }
  });

  return {
    name: "lessonstudio-teach",
    bus,
    logPath,
    configureServer(server): void {
      if (!opts.quiet) {
        console.log(`[teach] ${base}/{sync,log,observe,direct} ready — log: ${logPath}`);
      }

      postJson(server, `${base}${TEACH_PATHS.sync}`, async (raw) => {
        try {
          return { status: 200, json: bus.sync(JSON.parse(raw || "{}") as SyncRequest) };
        } catch (e) {
          return { status: 400, json: { error: String(e instanceof Error ? e.message : e) } };
        }
      });

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

      postJson(server, `${base}${TEACH_PATHS.direct}`, async (raw) => {
        try {
          const body = JSON.parse(raw || "{}") as DirectRequest;
          const commands = Array.isArray(body.commands) ? body.commands : [];
          if (!commands.length) return { status: 400, json: { error: "no commands" } };
          const turn = bus.enqueue(commands, body.actor ?? "teacher");
          const ms = body.wait === false ? 0 : (body.timeoutMs ?? defaultWait);
          const result = await waitFor(bus, turn, ms);
          const out: DirectResponse = { turn, queued: commands.length, applied: !!result, status: bus.status(turn) };
          if (result) {
            out.result = result;
            out.text = formatResult(result);
          }
          return { status: 200, json: out };
        } catch (e) {
          return { status: 400, json: { error: String(e instanceof Error ? e.message : e) } };
        }
      });
    },
  };
}
