// The SERVER side of the authoring seam — the exact counterpart of `audio/dev_tts.ts`,
// and for the same two reasons:
//   • the API key stays in the dev process. `claudeAuthor` in a browser reaches a model
//     through `httpCompleter("/api/author")`, so the bundle never holds a credential.
//   • every request is content-hash cached to disk, so the SAME question against the
//     SAME grounding is answered once ever. Re-runs (the browser walk, a reload, a
//     learner re-reading) are offline, instant and free — which is also what makes a
//     generated lesson reproducible rather than re-billed on every visit.
//
// THREE PROVIDERS behind one endpoint, lifted from lessonkit's `dev/agent-proxy.ts`
// (the same fan-out, minus its TTS half — that lives in `audio/dev_tts.ts` here):
//   • `gemini`      — Google's REST API with `GEMINI_API_KEY`. Plain `fetch`, no SDK.
//   • `claude-code` — the local `claude` CLI in print mode. NO API KEY AT ALL: it runs
//     under whatever auth the developer's own Claude Code install already has.
//   • `anthropic`   — the Messages API with `ANTHROPIC_API_KEY` (via `anthropicCompleter`,
//     so the Node author and this proxy make the identical call).
// `provider: "auto"` (what the browser sends) resolves server-side to the first one that
// is actually reachable, so the same lesson build runs on whichever credential a machine
// happens to have — and on none of them, on deterministic fallback prose.
//
// Deliberately NOT used: `ANTHROPIC_AUTH_TOKEN`/`ANTHROPIC_BASE_URL`, which a running
// Claude Code session leaves in the environment. Those belong to that session, not to
// this app; `claude-code` is the sanctioned way to borrow that same auth.
//
// Failure is answered as `{ error }`, never a 500: `claudeAuthor` catches it and falls
// back to the plan's deterministic `fallbackText`, so a learner's question always gets
// an answer. No provider at all ⇒ every request errors ⇒ the whole lesson runs on
// fallback prose, exactly how the silent `fakeTtsAdapter` degrades narration.
//
// NODE ONLY, and deliberately NOT re-exported from `authoring/index.ts`: it reads
// `process.env` credentials, spawns a child process, and is imported by `vite.config.ts`.
// Keeping it off the barrel is what stops any of that from reaching a browser bundle —
// which is also why the two new completers live HERE rather than beside
// `anthropicCompleter`: a provider call the browser must never make should not sit in a
// file the browser can import.

import { anthropicCompleter, type Completer } from "./claude_author.js";
// Node builtins, imported statically because this file is Node-only by construction
// (the cache helpers below still import `fs` lazily, kept verbatim from `audio/cache.ts`).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";

/** Who writes the prose. `auto` = whichever of these the dev process can actually reach. */
export type AuthorProvider = "gemini" | "claude-code" | "anthropic";

/** The proxy wire format — exactly what `httpCompleter` POSTs. Provider auth is ours. */
export interface AuthorProxyRequest {
  /** `"auto"` (default), or one of `AuthorProvider` to pin it. Unknown ⇒ honest error. */
  provider?: string;
  system?: string;
  prompt?: string;
  model?: string;
  maxTokens?: number;
}

export interface AuthorEndpointOptions {
  /** Anthropic key. Defaults to `process.env.ANTHROPIC_API_KEY`. */
  apiKey?: string;
  /** Gemini key. Defaults to `process.env.GEMINI_API_KEY`. */
  geminiApiKey?: string;
  /** Pin the provider for every request (else `LS_AUTHOR_PROVIDER`, else `auto`). */
  provider?: AuthorProvider | "auto";
  /** Default model when the client doesn't name one for the resolved provider. */
  model?: string;
  /** Directory for the on-disk answer cache (default `.author-cache`); `false` disables it. */
  cacheDir?: string | false;
  /** Override the completion entirely (tests) — bypasses provider resolution. */
  complete?: Completer;
}

/** What actually happened, so the dev terminal can say which model wrote which answer. */
export interface AuthorAnswer {
  text: string;
  /** The RESOLVED provider (never `"auto"`), or `"injected"` for `opts.complete`. */
  provider: string;
  model: string;
  cached: boolean;
  ms: number;
}

export interface AuthorEndpoint {
  /** Answer one authoring request (cache first, then the provider). Throws on failure. */
  answer(req: AuthorProxyRequest): Promise<AuthorAnswer>;
  /** True when some model is reachable — false ⇒ every answer falls back to authored prose. */
  readonly live: boolean;
  /** The reachable providers, in the order `auto` would pick them. */
  readonly providers: string[];
}

// Matches `claude_author.ts`'s default — the client may override per request (`req.model`),
// and the cache key includes it, so switching models can never serve a stale answer.
const DEFAULT_MODEL = "claude-opus-5";
const DEFAULT_MAX_TOKENS = 2048;

// A concrete id, not a `-latest` alias: aliases silently re-point, and the cache key is the
// model NAME, so an alias would let a different model's prose live under the same key.
// Override with `GEMINI_MODEL` (`gemini-pro-latest` if a pinned id ever 404s — Google
// retires `-preview` ids on a rolling basis; that surfaces here as fallback prose).
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

// `sonnet`, not the CLI's own default: a tutor's paragraph is a small writing task, and
// the CLI pays a fixed agent-boot cost on top of the model call (~7 s with these flags vs
// ~29 s on the default model). Latency IS the UX here — the learner is watching a
// "thinking" affordance. Override with `LS_CLAUDE_CODE_MODEL`.
const DEFAULT_CLAUDE_CODE_MODEL = "sonnet";
const CLAUDE_CODE_TIMEOUT_MS = 60_000;

/** Stable 12-hex key over the WHOLE request, so a changed prompt or grounding is a new
 *  entry and a stale answer can never outlive the facts it was grounded in (cyrb53). */
function requestKey(parts: string): string {
  let h1 = 0xdeadbeef ^ parts.length;
  let h2 = 0x41c6ce57 ^ parts.length;
  for (let i = 0; i < parts.length; i++) {
    const ch = parts.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(12, "0").slice(0, 12);
}

// ── The two Node-only providers ─────────────────────────────────────────────────

/**
 * Gemini via the REST API — plain `fetch`, so it adds no dependency at all (the Anthropic
 * path needs its SDK only because `anthropicCompleter` is shared with the Node author).
 *
 * Two response shapes to respect: Gemini 3 THINKS before it writes, so (a) parts carrying
 * `thought: true` are internal and must be dropped, and (b) `maxOutputTokens` is spent on
 * thinking first — a 300-token budget returns a truncated sentence, so the floor below is
 * a correctness guard, not a preference. (`thinkingLevel`/`thinkingConfig` are rejected by
 * `v1beta` for this model, so the budget is the only lever.)
 */
const geminiCompleter: Completer = async (req) => {
  if (!req.apiKey) throw new Error("GEMINI_API_KEY not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${req.model}:generateContent?key=${req.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.system }] },
      contents: [{ role: "user", parts: [{ text: req.prompt }] }],
      generationConfig: { maxOutputTokens: Math.max(req.maxTokens, 1024) },
    }),
  });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as {
    candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };
  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p?.thought)
    .map((p) => p?.text ?? "")
    .join("")
    .trim();
  // An empty answer with MAX_TOKENS means thinking ate the budget: say so, rather than
  // letting the caller report the generic "model returned no text".
  if (!text && candidate?.finishReason === "MAX_TOKENS") throw new Error("gemini spent the whole token budget thinking — raise maxTokens");
  return text;
};

/**
 * The local `claude` CLI in print mode — the zero-credential provider. It runs under the
 * developer's own Claude Code auth, so `GEMINI_API_KEY`/`ANTHROPIC_API_KEY` are both
 * optional on a machine that already has the CLI.
 *
 * `--strict-mcp-config` skips whatever MCP servers the user's global config would boot
 * (irrelevant to writing a paragraph, and they dominate the latency); `--output-format
 * text` makes stdout the prose itself, so there is nothing to parse. `req.model` is
 * ignored on purpose: the client's model id names an API model, while the CLI wants its
 * own alias, and the two vocabularies should not be silently mixed.
 */
const claudeCodeCompleter: Completer = (req) =>
  new Promise<string>((resolve, reject) => {
    const child = spawn(
      "claude",
      ["-p", req.prompt, "--system-prompt", req.system, "--output-format", "text", "--strict-mcp-config", "--model", req.model],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`claude-code timed out after ${CLAUDE_CODE_TIMEOUT_MS / 1000}s`));
    }, CLAUDE_CODE_TIMEOUT_MS);
    child.stdout.on("data", (d) => (out += String(d)));
    child.stderr.on("data", (d) => (err += String(d)));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e instanceof Error ? e : new Error(String(e)));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim().slice(0, 300) || `claude exited ${code}`));
    });
  });

/** Is the `claude` CLI on PATH? Sync, so `live` is known before the dev server logs. */
function hasClaudeCli(): boolean {
  const path = process.env.PATH ?? "";
  return path.split(delimiter).some((dir) => dir && existsSync(join(dir, "claude")));
}

/**
 * Build the cached answer function the dev endpoint (and any offline pre-authoring
 * script) shares. Provider resolution happens HERE rather than in the browser: the client
 * cannot know which credentials exist, and it must not learn.
 */
export function authorEndpoint(opts: AuthorEndpointOptions = {}): AuthorEndpoint {
  const anthropicKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  const geminiKey = opts.geminiApiKey ?? process.env.GEMINI_API_KEY ?? "";
  const cli = hasClaudeCli();
  const dir = opts.cacheDir === false ? null : opts.cacheDir ?? ".author-cache";

  // Preference order for `auto`: an explicitly provisioned API key is a deliberate choice,
  // so it wins over the CLI, which is the zero-config fallback anyone with Claude Code has.
  const available: AuthorProvider[] = [
    ...(anthropicKey ? (["anthropic"] as const) : []),
    ...(geminiKey ? (["gemini"] as const) : []),
    ...(cli ? (["claude-code"] as const) : []),
  ];
  const pinned = opts.provider ?? (process.env.LS_AUTHOR_PROVIDER as AuthorProvider | "auto" | undefined);

  /** Resolve `auto`/a pinned name to a provider that is actually reachable, or explain why not. */
  function resolve(requested: string | undefined): AuthorProvider {
    const want = requested && requested !== "auto" ? requested : pinned && pinned !== "auto" ? pinned : "auto";
    if (want === "auto") {
      const first = available[0];
      if (!first) throw new Error("no author provider reachable — set GEMINI_API_KEY or ANTHROPIC_API_KEY, or install the claude CLI");
      return first;
    }
    if (want !== "gemini" && want !== "claude-code" && want !== "anthropic") throw new Error(`unknown provider "${want}"`);
    if (!available.includes(want)) {
      const why =
        want === "gemini" ? "GEMINI_API_KEY not set" : want === "anthropic" ? "ANTHROPIC_API_KEY not set" : "no `claude` CLI on PATH";
      throw new Error(`provider "${want}" requested but ${why}`);
    }
    return want;
  }

  /** Each provider names its models differently — a foreign id must not be forwarded. */
  function modelFor(provider: AuthorProvider, requested: string | undefined): string {
    const asked = requested ?? opts.model;
    switch (provider) {
      case "gemini":
        return asked && /^(gemini|gemma)/.test(asked) ? asked : process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
      case "claude-code":
        return process.env.LS_CLAUDE_CODE_MODEL ?? DEFAULT_CLAUDE_CODE_MODEL;
      case "anthropic":
        return asked && asked.startsWith("claude") ? asked : DEFAULT_MODEL;
    }
  }

  return {
    live: !!opts.complete || available.length > 0,
    providers: opts.complete ? ["injected"] : available,
    async answer(req: AuthorProxyRequest): Promise<AuthorAnswer> {
      const started = Date.now();
      const system = req.system ?? "";
      const prompt = (req.prompt ?? "").trim();
      if (!prompt) throw new Error("no prompt");
      const maxTokens = req.maxTokens ?? DEFAULT_MAX_TOKENS;

      const provider = opts.complete ? "injected" : resolve(req.provider);
      const model = provider === "injected" ? req.model ?? DEFAULT_MODEL : modelFor(provider, req.model);
      const complete =
        opts.complete ??
        (provider === "gemini" ? geminiCompleter : provider === "claude-code" ? claudeCodeCompleter : anthropicCompleter);
      const apiKey = provider === "gemini" ? geminiKey : provider === "anthropic" ? anthropicKey : undefined;

      // The provider is part of the key: two models answering the same question against the
      // same grounding are two different answers, and neither may be served for the other.
      const key = requestKey(JSON.stringify({ provider, model, maxTokens, system, prompt }));
      if (dir) {
        const cached = await readCache(dir, key);
        if (cached) return { text: cached, provider, model, cached: true, ms: Date.now() - started };
      }
      // Adaptive thinking is an Anthropic-API concept; the other two decide for themselves.
      const text = (
        await complete({ system, prompt, model, maxTokens, apiKey, ...(provider === "anthropic" ? { thinking: { type: "adaptive" as const } } : {}) })
      ).trim();
      if (!text) throw new Error("model returned no text");
      if (dir) await writeCache(dir, key, text);
      return { text, provider, model, cached: false, ms: Date.now() - started };
    },
  };
}

/** One JSON per key under `dir`. `fs` is imported lazily, as in `audio/cache.ts`. */
async function readCache(dir: string, key: string): Promise<string | null> {
  const { readFile } = await import("node:fs/promises");
  try {
    const { text } = JSON.parse(await readFile(join(dir, `${key}.json`), "utf8")) as { text?: string };
    return text && text.trim() ? text : null;
  } catch {
    return null;
  }
}
async function writeCache(dir: string, key: string, text: string): Promise<void> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${key}.json`), JSON.stringify({ text }));
}

// ── Vite dev-server plugin ──────────────────────────────────────────────────────
// The `vite` shapes are re-declared structurally here rather than imported from
// `audio/dev_tts.ts`: duplicating a third-party interface is what keeps BOTH layers
// free of a build-tool dependency, which is the whole reason either file is typed this
// way. (Copying a type declaration is not copying knowledge.)

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

/**
 * Mounts `POST /api/author` on the Vite dev server: the `httpCompleter` wire format in,
 * `{ text, provider, model }` or `{ error }` out. Always a 200-family status — a failed
 * generation is not a broken page, it is a beat authored from the plan's fallback prose, so
 * the renderer must see a normal response and let `claudeAuthor` decide. (`httpCompleter`
 * reads only `text`/`error`; the rest is for whoever is watching the network tab.)
 */
export function authorDevPlugin(opts: AuthorEndpointOptions = {}): VitePluginLike {
  const endpoint = authorEndpoint(opts);
  return {
    name: "lessonstudio-author",
    configureServer(server: DevServerLike): void {
      const [first, ...rest] = endpoint.providers;
      // eslint-disable-next-line no-console
      console.log(
        `[author] /api/author ready — ${
          first
            ? `${first}${rest.length ? ` (auto; also ${rest.join(", ")})` : ""}`
            : "OFFLINE fallback prose (no GEMINI_API_KEY / ANTHROPIC_API_KEY, no claude CLI)"
        }`,
      );
      server.middlewares.use("/api/author", (req, res, next) => {
        if (req.method !== "POST") return next();
        void (async () => {
          res.setHeader("content-type", "application/json");
          let provider = "?"; // hoisted so a failure can be attributed in the dev terminal
          try {
            const body = JSON.parse((await readBody(req)) || "{}") as AuthorProxyRequest;
            provider = body.provider ?? "auto";
            const answer = await endpoint.answer(body);
            // eslint-disable-next-line no-console
            console.log(
              `[author] ${answer.provider}/${answer.model} → ${answer.text.length} chars in ${answer.ms} ms${answer.cached ? " (cached)" : ""}`,
            );
            res.end(JSON.stringify({ text: answer.text, provider: answer.provider, model: answer.model }));
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            // eslint-disable-next-line no-console
            console.warn(`[author] ${provider} generation failed → fallback prose:`, message);
            res.end(JSON.stringify({ error: message }));
          }
        })();
      });
    },
  };
}
