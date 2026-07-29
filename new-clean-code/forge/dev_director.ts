// THE SERVER SIDE OF THE AI TEACHER — `POST /api/direct`, the tool-calling counterpart of
// `/api/author` (`dev_author.ts`) and `/api/tts` (`audio/dev_tts.ts`), and node-only for the
// same reason: the API key stays in THIS process.
//
// It exists because tier 3 has two shapes, and only one of them can hold a credential:
//
//   • THE AI TEACHER AS A SEPARATE PROCESS — `forge/cli/ai_teach.ts` polls the four
//     /api/session endpoints exactly as a human teacher's terminal does. It runs in Node, so
//     it reads the key directly and this proxy is not involved at all. That is the canonical
//     tier-3 shape: "run the other client".
//   • THE AI TEACHER INSIDE THE PAGE — `directingRunner` answers the learner's question from
//     within the session, with no external process and no polling latency. The page cannot
//     hold a key, so it reaches the model through `httpToolCompleter("/api/direct")` → here.
//
// Failure is answered as `{error}`, never a 500 — `claudeDirector` catches it and returns an
// empty turn, so a missing key degrades the AI teacher to silence (and `directingRunner`'s
// `onSilence` floor still answers the learner). No key ⇒ every request errors ⇒ the lesson
// plays exactly as it does with tier 3 switched off, which is how the whole repo degrades.
//
// NOT re-exported from `forge/index.ts`: it reads `process.env` and is imported by
// `vite.config.ts`. Keeping it off the barrel is what stops the key-reading path from
// reaching a browser bundle. Its imports stay relative and value-leaf for the load-order
// reason spelled out in `tools.ts` — a vite config is bundled before `resolve.alias` exists.

import { anthropicToolCompleter, type ToolCompleter, type ToolMessage } from "./tool_call.js";
import type { ToolSpec } from "./tools.js";

/** What the browser POSTs — the fields of a `ToolRequest` that survive the wire (no key). */
interface DirectProxyRequest {
  system?: string;
  messages?: ToolMessage[];
  tools?: ToolSpec[];
  model?: string;
  maxTokens?: number;
  toolChoice?: "auto" | "any";
}

export interface DirectorDevOptions {
  /** Mount path (default `/api/direct`). */
  path?: string;
  /** Model id when the client does not name one. */
  model?: string;
  maxTokens?: number;
  /** Override the provider call — a test injects a fake here and never touches the network. */
  complete?: ToolCompleter;
  /** Skip the startup banner. */
  quiet?: boolean;
}

// ── vite dev-server shapes, structurally typed (no `vite` import) ────────────────

interface DevReq {
  method?: string | undefined;
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
  middlewares: { use(path: string, handler: (req: DevReq, res: DevRes, next: () => void) => void): void };
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

/** The plugin, plus the handler it mounts — exported so a test can drive the endpoint
 *  in-process, with no server, no port and no key. */
export interface DirectorDevPlugin extends VitePluginLike {
  /** `(body) => response body`. The whole endpoint, minus HTTP. */
  handle(body: string): Promise<{ status: number; json: Record<string, unknown> }>;
}

export function directorDevPlugin(opts: DirectorDevOptions = {}): DirectorDevPlugin {
  const path = opts.path ?? "/api/direct";
  const complete = opts.complete ?? anthropicToolCompleter;
  const model = opts.model ?? "claude-opus-5";
  const maxTokens = opts.maxTokens ?? 4096;

  async function handle(raw: string): Promise<{ status: number; json: Record<string, unknown> }> {
    let body: DirectProxyRequest;
    try {
      body = JSON.parse(raw || "{}") as DirectProxyRequest;
    } catch (e) {
      return { status: 400, json: { error: `bad request: ${e instanceof Error ? e.message : String(e)}` } };
    }
    if (!Array.isArray(body.messages) || !body.messages.length) return { status: 400, json: { error: "no messages" } };
    if (!Array.isArray(body.tools) || !body.tools.length) return { status: 400, json: { error: "no tools" } };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey && complete === anthropicToolCompleter) {
      // Stated plainly rather than attempted and failed: the browser turns this into an empty
      // director turn, and a developer reading the network tab learns what to set.
      return { status: 200, json: { error: "no ANTHROPIC_API_KEY in the dev server environment" } };
    }

    try {
      const turn = await complete({
        system: body.system ?? "",
        messages: body.messages,
        tools: body.tools,
        model: body.model ?? model,
        maxTokens: body.maxTokens ?? maxTokens,
        ...(apiKey ? { apiKey } : {}),
        thinking: { type: "adaptive" },
        ...(body.toolChoice ? { toolChoice: body.toolChoice } : {}),
      });
      return { status: 200, json: { text: turn.text, calls: turn.calls } };
    } catch (e) {
      return { status: 200, json: { error: e instanceof Error ? e.message : String(e) } };
    }
  }

  return {
    name: "lessonstudio-director",
    handle,
    configureServer(server: DevServerLike): void {
      if (!opts.quiet) {
        // eslint-disable-next-line no-console
        console.log(`[director] ${path} ready — ${process.env.ANTHROPIC_API_KEY ? "live" : "NO KEY (tier 3 in-page stays silent)"}`);
      }
      server.middlewares.use(path, (req, res, next) => {
        if (req.method !== "POST") return next();
        void (async () => {
          const out = await handle(await readBody(req));
          res.statusCode = out.status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(out.json));
        })();
      });
    },
  };
}
