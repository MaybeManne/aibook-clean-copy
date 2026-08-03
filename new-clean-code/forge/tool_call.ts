import type { ToolCall, ToolSpec } from "./tools.js";

/**
 * One turn of the conversation with the model. Text only: a director's turn ENDS when it emits
 * tool calls, and the verdict on those calls arrives as the next observation's `last` rather
 * than as a `tool_result` inside this conversation.
 */
export interface ToolMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ToolRequest {
  system: string;
  messages: ToolMessage[];
  tools: ToolSpec[];
  model: string;
  maxTokens: number;
  apiKey?: string;
  /** Passed through when set (adaptive thinking on Opus 4.6+). */
  thinking?: { type: "adaptive" };
  /** `"auto"` (default) lets the model answer in prose; `"any"` forces a tool call. */
  toolChoice?: "auto" | "any";
}

/** What came back: whatever it said, and whatever it called. */
export interface ToolTurn {
  text: string;
  calls: ToolCall[];
  /** Provider stop reason when available — diagnostic only; no control flow depends on it. */
  stopReason?: string;
}

export type ToolCompleter = (req: ToolRequest) => Promise<ToolTurn>;

/**
 * The Anthropic key from the environment, or `undefined` — including in a browser, where there
 * is no `process` at all. That guard is what lets `pickDirector` choose the live director or the
 * offline one with the SAME call on either side of the wire.
 */
export function envApiKey(): string | undefined {
  return typeof process !== "undefined" ? process.env?.ANTHROPIC_API_KEY : undefined;
}

/**
 * The real call. Non-streaming: a director's turn is a few hundred tokens of tool calls.
 * Exported because `dev_director.ts` is the SERVER end of exactly this call — browser →
 * `httpToolCompleter` → `/api/direct` → here.
 */
export const anthropicToolCompleter: ToolCompleter = async (req) => {
  const specifier: string = "@anthropic-ai/sdk";
  const mod: any = await import( specifier);
  const Anthropic: any = mod.default ?? mod.Anthropic ?? mod;
  const client: any = new Anthropic(req.apiKey ? { apiKey: req.apiKey } : {});
  const body: any = {
    model: req.model,
    max_tokens: req.maxTokens,
    system: req.system,
    messages: req.messages.map((m) => ({ role: m.role, content: m.text })),
    tools: req.tools,
  };
  if (req.thinking) body.thinking = req.thinking;
  if (req.toolChoice) body.tool_choice = { type: req.toolChoice };
  const msg: any = await client.messages.create(body);
  return readTurn(msg);
};

function readTurn(msg: unknown): ToolTurn {
  const m = (msg ?? {}) as { content?: unknown; stop_reason?: unknown };
  const blocks: any[] = Array.isArray(m.content) ? m.content : [];
  const text = blocks
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("")
    .trim();
  const calls: ToolCall[] = blocks
    .filter((b) => b?.type === "tool_use" && typeof b.name === "string")
    .map((b) => ({
      id: String(b.id ?? ""),
      name: String(b.name),
      input: (b.input ?? {}) as Record<string, unknown>,
    }));
  const out: ToolTurn = { text, calls };
  if (typeof m.stop_reason === "string") out.stopReason = m.stop_reason;
  return out;
}

/**
 * A browser-safe completer that POSTs to a server proxy instead of holding a key. The proxy
 * answers `{text, calls}` on success or `{error}` on failure; a thrown error degrades the AI
 * teacher to silence, which `directingRunner`'s `onSilence` floor then answers.
 *
 * `apiKey` is never sent — auth is the proxy's job. `provider` names which model the proxy
 * should use (`"auto"` = whichever it can reach); it is a REQUEST, not a fact, because only the
 * server knows which credentials exist.
 */
export function httpToolCompleter(url: string, opts: { provider?: string | (() => string) } = {}): ToolCompleter {
  return async (req) => {
    const provider = typeof opts.provider === "function" ? opts.provider() : opts.provider;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...(provider ? { provider } : {}),
        system: req.system,
        messages: req.messages,
        tools: req.tools,
        model: req.model,
        maxTokens: req.maxTokens,
        toolChoice: req.toolChoice,
      }),
    });
    let data: { text?: string; calls?: ToolCall[]; error?: string } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
    }
    if (!res.ok || data.error) throw new Error(data.error ?? `director proxy responded ${res.status}`);
    return { text: (data.text ?? "").trim(), calls: Array.isArray(data.calls) ? data.calls : [] };
  };
}
