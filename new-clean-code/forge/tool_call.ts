// THE TOOL-CALLING WIRE — one provider request, factored out of the director that uses it.
//
// `claude_author.ts` has a `Completer` that returns a STRING, because an author contributes
// prose. A director contributes ACTIONS, so it needs the other shape: a request carrying
// tools, and a reply carrying tool calls. Same three-way split as the author's, for the same
// reasons:
//   • `anthropicToolCompleter` — the real Messages API call. Node-side; the SDK is imported
//     lazily through a non-literal specifier so core never gains a hard dependency on it.
//   • `httpToolCompleter`      — browser-safe: POSTs to a proxy, so the API key stays in the
//     dev process and never enters a bundle (`forge/dev_director.ts` is the server half).
//   • an injected fake         — what the headless tests use, so tier 3 is verifiable with
//     no key, no network and no nondeterminism.
//
// This file has NO value dependency on the engine — only types, which are erased. That is
// what lets `dev_director.ts` (and therefore `vite.config.ts`) import it: a vite config is
// bundled by esbuild before `resolve.alias` exists, so a value import of
// `@lessonstudio/lesson` on that path cannot resolve. Same rule as `teach/bus.ts`.

import type { ToolCall, ToolSpec } from "./tools.js";

/**
 * One turn of the conversation with the model.
 *
 * Text only, and that is a deliberate limit: a director's turn ENDS when it emits tool
 * calls, because the verdict on those calls comes from the engine (as the next
 * observation's `last`), not from a tool_result inside this conversation. So no message
 * here ever has to echo a `tool_use` block back, and the shape stays this small. The
 * model's memory of its own actions is the recorded history — which is also what keeps
 * replay honest: there is no chat transcript the session depends on.
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
 * The real call. Non-streaming: a director's turn is a few hundred tokens of tool calls, and
 * streaming would buy nothing but a partial JSON parse to get wrong.
 *
 * Exported because `dev_director.ts` is the SERVER end of exactly this call — browser →
 * `httpToolCompleter` → `/api/direct` → here. One implementation of the request, whichever
 * side of the wire it runs on.
 */
export const anthropicToolCompleter: ToolCompleter = async (req) => {
  const specifier: string = "@anthropic-ai/sdk"; // widened to `string` ⇒ tsc won't resolve it
  // `@vite-ignore`: the SDK is never bundled for the browser (see vite.config optimizeDeps).
  const mod: any = await import(/* @vite-ignore */ specifier);
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

/**
 * Read a Messages API response into a `ToolTurn`. Shared with the dev proxy so the browser
 * and Node paths cannot disagree about what the model said.
 */
export function readTurn(msg: unknown): ToolTurn {
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
 * answers `{text, calls}` on success or `{error}` on failure; a thrown error degrades the
 * director to its offline behaviour, exactly as `httpCompleter` degrades the author.
 *
 * `apiKey` is never sent — auth is the proxy's job, and this function is the reason the
 * browser bundle can drive an AI teacher without ever holding a credential.
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
      /* non-JSON body → the status check below reports it */
    }
    if (!res.ok || data.error) throw new Error(data.error ?? `director proxy responded ${res.status}`);
    return { text: (data.text ?? "").trim(), calls: Array.isArray(data.calls) ? data.calls : [] };
  };
}
