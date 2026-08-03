import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import { postJson, type VitePluginLike } from "../dev/http.js";
import { anthropicToolCompleter, type ToolCompleter, type ToolMessage, type ToolTurn } from "./tool_call.js";
import type { ToolCall, ToolSpec } from "./tools.js";

/** Who takes the turn. `auto` = whichever of these the dev process can actually reach. */
export type DirectorProvider = "gemini" | "claude-code" | "anthropic";

interface DirectProxyRequest {
  /** `"auto"` (default), or one of `DirectorProvider` to pin it. Unknown ⇒ honest error. */
  provider?: string;
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
  /** Anthropic key. Defaults to `process.env.ANTHROPIC_API_KEY`. */
  apiKey?: string;
  /** Gemini key. Defaults to `process.env.GEMINI_API_KEY`. */
  geminiApiKey?: string;
  /** Pin the provider for every request (else `LS_AI_PROVIDER`, else `auto`). */
  provider?: DirectorProvider | "auto";
  /** Model id when the client does not name one for the resolved provider. */
  model?: string;
  maxTokens?: number;
  /** Override the provider call — a test injects a fake here and never touches the network. */
  complete?: ToolCompleter;
  /** Skip the startup banner. */
  quiet?: boolean;
}

/** The plugin, plus the handler it mounts — exported so a test can drive the endpoint
 *  in-process, with no server, no port and no key. */
export interface DirectorDevPlugin extends VitePluginLike {
  /** `(body) => response body`. The whole endpoint, minus HTTP. */
  handle(body: string): Promise<{ status: number; json: Record<string, unknown> }>;
  /** True when some model is reachable — false ⇒ every turn is the offline director's. */
  readonly live: boolean;
  /** The reachable providers, in the order `auto` picks them. */
  readonly providers: string[];
}

const DEFAULT_MODEL = "claude-opus-5";
const DEFAULT_MAX_TOKENS = 4096;

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

const DEFAULT_CLAUDE_CODE_MODEL = "sonnet";
const CLAUDE_CODE_TIMEOUT_MS = 60_000;

type Node = Record<string, unknown>;

function isOpen(node: Node): boolean {
  const t = node.type;
  if (t === undefined) return true;
  return t === "object" && !Object.keys((node.properties ?? {}) as object).length;
}

const AS_JSON_TEXT = "Send this as JSON encoded in a string.";

function geminiSchema(node: Node): Node {
  const out: Node = {};
  for (const k of ["description", "enum", "minItems", "maxItems", "format"]) if (node[k] !== undefined) out[k] = node[k];
  if (isOpen(node)) return { ...out, type: "string", description: `${node.description ?? "Any JSON value."} ${AS_JSON_TEXT}` };
  const t = node.type;
  if (Array.isArray(t)) {
    out.type = String(t.find((x) => x !== "null") ?? "string");
    if (t.includes("null")) out.nullable = true;
    return out;
  }
  if (t === "array") return { ...out, type: "array", items: geminiSchema((node.items ?? {}) as Node) };
  if (t === "object") {
    const props = (node.properties ?? {}) as Record<string, Node>;
    out.type = "object";
    out.properties = Object.fromEntries(Object.keys(props).map((n) => [n, geminiSchema(props[n]!)]));
    if (Array.isArray(node.required) && node.required.length) out.required = node.required;
    return out;
  }
  out.type = String(t);
  return out;
}

/** The tool table as `functionDeclarations`. */
export function geminiFunctionDeclarations(tools: ToolSpec[]): Node[] {
  return tools.map((t) => {
    const props = (t.input_schema.properties ?? {}) as Record<string, Node>;
    const names = Object.keys(props);
    if (!names.length) return { name: t.name, description: t.description };
    const parameters: Node = { type: "object", properties: Object.fromEntries(names.map((n) => [n, geminiSchema(props[n]!)])) };
    if (t.input_schema.required?.length) parameters.required = t.input_schema.required;
    return { name: t.name, description: t.description, parameters };
  });
}

function parseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

function restore(node: Node, value: unknown): unknown {
  if (isOpen(node)) return typeof value === "string" ? parseJson(value) : value;
  if (node.type === "array" && Array.isArray(value)) return value.map((v) => restore((node.items ?? {}) as Node, v));
  if (node.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    const props = (node.properties ?? {}) as Record<string, Node>;
    return Object.fromEntries(Object.entries(value as Node).map(([k, v]) => [k, props[k] ? restore(props[k]!, v) : v]));
  }
  return value;
}

/** One tool call's arguments, read back against the schema they were sent under. Tolerant on
 *  purpose: this is also the right handling for a prompted model that stringifies an object
 *  it was asked for inline, so `claude-code` shares it. */
export function restoreArgs(spec: ToolSpec | undefined, args: unknown): Record<string, unknown> {
  const input = (args ?? {}) as Record<string, unknown>;
  if (!spec) return input;
  const props = (spec.input_schema.properties ?? {}) as Record<string, Node>;
  return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, props[k] ? restore(props[k]!, v) : v]));
}

const geminiToolCompleter: ToolCompleter = async (req) => {
  if (!req.apiKey) throw new Error("GEMINI_API_KEY not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${req.model}:generateContent?key=${req.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.system }] },
      contents: req.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
      tools: [{ functionDeclarations: geminiFunctionDeclarations(req.tools) }],
      toolConfig: { functionCallingConfig: { mode: req.toolChoice === "any" ? "ANY" : "AUTO" } },
      generationConfig: { maxOutputTokens: Math.max(req.maxTokens, 1024) },
    }),
  });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string; thought?: boolean; functionCall?: { name?: string; args?: unknown } }> };
    }>;
  };
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  const byName = new Map(req.tools.map((t) => [t.name, t]));
  const calls: ToolCall[] = [];
  for (const p of parts) {
    const name = p?.functionCall?.name;
    if (typeof name === "string" && name) calls.push({ id: `gemini-${calls.length}`, name, input: restoreArgs(byName.get(name), p.functionCall?.args) });
  }
  const text = parts
    .filter((p) => !p?.thought)
    .map((p) => p?.text ?? "")
    .join("")
    .trim();
  if (!text && !calls.length && candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("gemini spent the whole token budget thinking — raise maxTokens");
  }
  const out: ToolTurn = { text, calls };
  if (candidate?.finishReason) out.stopReason = candidate.finishReason;
  return out;
};

const PROMPTED_FORMAT = [
  "",
  "HOW TO ACT",
  "You have no tool-calling channel here, so emit your turn as JSON instead. Reply with ONLY a",
  "JSON array of the calls you are making, in order, and nothing else — no prose, no code fence,",
  "no explanation:",
  '  [{"name": "say", "input": {"text": "..."}}, {"name": "focus", "input": {"rect": {"x":0.1,"y":0.1,"w":0.4,"h":0.4}}}]',
  'An empty turn is `[{"name": "done", "input": {}}]`. These are the tools, as JSON Schema:',
].join("\n");

function promptedSystem(req: { system: string; tools: ToolSpec[] }): string {
  const table = req.tools.map((t) => `  ${t.name}: ${t.description}\n    input: ${JSON.stringify(t.input_schema)}`).join("\n");
  return `${req.system}\n${PROMPTED_FORMAT}\n${table}`;
}

function promptedMessages(messages: ToolMessage[]): string {
  if (messages.length === 1) return messages[0]!.text;
  return messages.map((m) => `${m.role === "user" ? "SITUATION" : "YOUR LAST REPLY"}:\n${m.text}`).join("\n\n");
}

function sliceCalls(out: string): string | null {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(out);
  if (fenced) return fenced[1]!.trim();
  const open = out.indexOf("[");
  const close = out.lastIndexOf("]");
  if (open >= 0 && close > open) return out.slice(open, close + 1);
  return null;
}

/**
 * Read a prompted reply as a turn: no child process, no network, pure string in. A reply with no
 * parseable calls is NOT an error — it comes back as `text` with an empty `calls`.
 */
export function parsePromptedTurn(out: string, tools: ToolSpec[] = []): ToolTurn {
  const slice = sliceCalls(out);
  if (!slice) return { text: out.trim(), calls: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(slice);
  } catch {
    return { text: out.trim(), calls: [] };
  }
  const byName = new Map(tools.map((t) => [t.name, t]));
  const list = Array.isArray(parsed) ? parsed : [parsed];
  const calls: ToolCall[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as { name?: unknown; input?: unknown; args?: unknown; arguments?: unknown };
    if (typeof e.name !== "string" || !e.name) continue;
    calls.push({ id: `prompted-${calls.length}`, name: e.name, input: restoreArgs(byName.get(e.name), e.input ?? e.args ?? e.arguments) });
  }
  const text = calls.length ? out.replace(slice, "").replace(/```(?:json)?|```/g, "").trim() : out.trim();
  return { text, calls };
}

const claudeCodeToolCompleter: ToolCompleter = (req) =>
  new Promise<ToolTurn>((resolve, reject) => {
    const child = spawn(
      "claude",
      ["-p", promptedMessages(req.messages), "--system-prompt", promptedSystem(req), "--output-format", "text", "--strict-mcp-config", "--model", req.model],
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
      if (code === 0) resolve(parsePromptedTurn(out, req.tools));
      else reject(new Error(err.trim().slice(0, 300) || `claude exited ${code}`));
    });
  });

function hasClaudeCli(): boolean {
  const path = process.env.PATH ?? "";
  return path.split(delimiter).some((dir) => dir && existsSync(join(dir, "claude")));
}

export function directorDevPlugin(opts: DirectorDevOptions = {}): DirectorDevPlugin {
  const path = opts.path ?? "/api/direct";
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const anthropicKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  const geminiKey = opts.geminiApiKey ?? process.env.GEMINI_API_KEY ?? "";
  const cli = hasClaudeCli();
  const available: DirectorProvider[] = [
    ...(anthropicKey ? (["anthropic"] as const) : []),
    ...(geminiKey ? (["gemini"] as const) : []),
    ...(cli ? (["claude-code"] as const) : []),
  ];
  const pinned = opts.provider ?? (process.env.LS_AI_PROVIDER as DirectorProvider | "auto" | undefined);

  function resolve(requested: string | undefined): DirectorProvider {
    const want = requested && requested !== "auto" ? requested : pinned && pinned !== "auto" ? pinned : "auto";
    if (want === "auto") {
      const first = available[0];
      if (!first) throw new Error("no AI provider reachable — set ANTHROPIC_API_KEY or GEMINI_API_KEY, or install the claude CLI");
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

  function modelFor(provider: DirectorProvider, requested: string | undefined): string {
    const asked = requested ?? opts.model;
    switch (provider) {
      case "gemini":
        return asked && /^(gemini|gemma)/.test(asked) ? asked : process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
      case "claude-code":
        return process.env.LS_CLAUDE_CODE_MODEL ?? DEFAULT_CLAUDE_CODE_MODEL;
      case "anthropic":
        return asked && asked.startsWith("claude") ? asked : opts.model ?? DEFAULT_MODEL;
    }
  }

  async function handle(raw: string): Promise<{ status: number; json: Record<string, unknown> }> {
    let body: DirectProxyRequest;
    try {
      body = JSON.parse(raw || "{}") as DirectProxyRequest;
    } catch (e) {
      return { status: 400, json: { error: `bad request: ${e instanceof Error ? e.message : String(e)}` } };
    }
    if (!Array.isArray(body.messages) || !body.messages.length) return { status: 400, json: { error: "no messages" } };
    if (!Array.isArray(body.tools) || !body.tools.length) return { status: 400, json: { error: "no tools" } };

    let provider: string;
    let model: string;
    let complete: ToolCompleter;
    let apiKey: string | undefined;
    if (opts.complete) {
      provider = "injected";
      model = body.model ?? opts.model ?? DEFAULT_MODEL;
      complete = opts.complete;
    } else {
      try {
        const chosen = resolve(body.provider);
        provider = chosen;
        model = modelFor(chosen, body.model);
        complete = chosen === "gemini" ? geminiToolCompleter : chosen === "claude-code" ? claudeCodeToolCompleter : anthropicToolCompleter;
        apiKey = chosen === "gemini" ? geminiKey : chosen === "anthropic" ? anthropicKey : undefined;
      } catch (e) {
        return { status: 200, json: { error: e instanceof Error ? e.message : String(e) } };
      }
    }

    try {
      const turn = await complete({
        system: body.system ?? "",
        messages: body.messages,
        tools: body.tools,
        model,
        maxTokens: body.maxTokens ?? maxTokens,
        ...(apiKey ? { apiKey } : {}),
        ...(provider === "anthropic" || provider === "injected" ? { thinking: { type: "adaptive" as const } } : {}),
        ...(body.toolChoice ? { toolChoice: body.toolChoice } : {}),
      });
      return { status: 200, json: { text: turn.text, calls: turn.calls, provider, model } };
    } catch (e) {
      return { status: 200, json: { error: e instanceof Error ? e.message : String(e), provider, model } };
    }
  }

  return {
    name: "lessonstudio-director",
    handle,
    live: !!opts.complete || available.length > 0,
    providers: opts.complete ? ["injected"] : available,
    configureServer(server): void {
      if (!opts.quiet) {
        const [first, ...rest] = opts.complete ? ["injected"] : available;
        console.log(
          `[director] ${path} ready — ${
            first
              ? `${first}${rest.length ? ` (auto; also ${rest.join(", ")})` : ""}`
              : "NO PROVIDER (tier 3 in-page stays silent; set ANTHROPIC_API_KEY or GEMINI_API_KEY, or install the claude CLI)"
          }`,
        );
      }
      postJson(server, path, handle);
    },
  };
}
