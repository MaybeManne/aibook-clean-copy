// A REAL LLM author for the `LessonAuthor` seam — the opt-in drop-in that stands
// where `fakeAuthor` stands (see generate.ts). The design principle is a strict
// division of labour:
//
//   • the ENGINE guarantees FACTS and STRUCTURE — which token attends where, the
//     viz props, the beat id/type/next — all computed deterministically from the
//     lesson's pure model, in the plan's `assemble()`;
//   • the LLM contributes only VOICE — one short paragraph of teaching prose.
//
// So the model can never hallucinate the highlighted tokens or emit an invalid
// BeatSpec: the only thing it produces is text that lands in a slot the engine
// already validated. That is stronger than schema-forcing a whole BeatSpec (and
// needs no structured-output wire format). The prose is recorded into history via
// the `beat.generated` event, so replay reconstructs the answer from data and never
// re-invokes this author — the "generate → freeze → replay" invariant holds with a
// live model exactly as it does with the fake one.
//
// The `@anthropic-ai/sdk` import is LAZY (a runtime `import()` of a non-literal
// specifier) so the core `@lessonkit/lesson` package keeps NO hard dependency on it:
// `tsc --noEmit` and headless `tsx` never touch the SDK, and it is only loaded when
// a live generation actually fires with a key present.

import type { BeatSpec } from "../lesson_sm/compile.js";
import type { GenerateRequest, LessonAuthor } from "./generate.js";

/** What the LLM contributes: the teaching voice. The engine owns everything else. */
export interface AuthoredProse {
  /** The explanation/answer text (1–3 sentences), grounded by the surrounding facts. */
  text: string;
}

/**
 * The bridge between a lesson's deterministic grounding and a pluggable author. A
 * lesson builds one of these per `generate` request; BOTH `offlineAuthor` (canned)
 * and `claudeAuthor` (live) drive it, so there is a SINGLE grounding path and the two
 * authors can never drift. `assemble` is pure and must produce a valid BeatSpec.
 */
export interface AuthorPlan {
  /** System prompt: the tutor persona + the HARD facts the prose must not contradict. */
  system: string;
  /** User prompt: what to write this time (the learner's question / current focus). */
  prompt: string;
  /** Deterministic prose used offline (fake author) and as the live fallback. */
  fallbackText: string;
  /** Assemble the final grounded BeatSpec, dropping the prose into the right slot. Pure. */
  assemble(prose: AuthoredProse): BeatSpec;
}

/** The Claude call, factored out so tests/proxies can inject a completion without the SDK. */
export interface CompletionRequest {
  system: string;
  prompt: string;
  model: string;
  maxTokens: number;
  apiKey?: string;
  /** Passed through to the Messages API when set (adaptive thinking on Opus 4.6+). */
  thinking?: { type: "adaptive" };
}
export type Completer = (req: CompletionRequest) => Promise<string>;

export interface ClaudeAuthorOptions {
  /** Per-request grounding: the same plan `offlineAuthor` uses (shared, no drift). */
  plan: (req: GenerateRequest) => AuthorPlan;
  /** Defaults to `process.env.ANTHROPIC_API_KEY` (Node only; never read in a browser). */
  apiKey?: string;
  /** Model id. Defaults to Anthropic's most capable current model. */
  model?: string;
  /** Output budget (leaves headroom for adaptive thinking). Default 2048. */
  maxTokens?: number;
  /**
   * Adaptive thinking (the model chooses its own depth — near-zero for this trivial
   * writing task, so latency stays low). `true`/omitted ⇒ on; `false` ⇒ off. On
   * Opus 4.8 a `budget_tokens` config is rejected, so only `{type:"adaptive"}` is sent.
   */
  thinking?: boolean;
  /** Injectable completion (tests, or a server proxy). Default: the real Anthropic SDK. */
  complete?: Completer;
}

const DEFAULT_MODEL = "claude-opus-4-8";
const DEFAULT_MAX_TOKENS = 2048;

/** Read the API key from the environment (Node); undefined in a browser (no `process`). */
export function envApiKey(): string | undefined {
  return typeof process !== "undefined" ? process.env?.ANTHROPIC_API_KEY : undefined;
}

/**
 * The default completer: one plain Messages API call, returning the concatenated text
 * blocks. Plain text (not structured output) because the ONLY thing we want from the
 * model is a sentence — structure and facts are the engine's job. Non-streaming: the
 * output is a few dozen tokens, well under any request-timeout risk. The SDK is loaded
 * lazily through a non-literal specifier so it is never a static dependency of core.
 */
const anthropicComplete: Completer = async (req) => {
  const specifier: string = "@anthropic-ai/sdk"; // widened to `string` ⇒ tsc won't resolve it
  // `@vite-ignore`: leave this runtime import as-is (the SDK is never bundled for the
  // browser — see vite.config `optimizeDeps.exclude`); silences Vite's dep-scan warning.
  const mod: any = await import(/* @vite-ignore */ specifier);
  const Anthropic: any = mod.default ?? mod.Anthropic ?? mod;
  const client: any = new Anthropic(req.apiKey ? { apiKey: req.apiKey } : {});
  const body: any = {
    model: req.model,
    max_tokens: req.maxTokens,
    system: req.system,
    messages: [{ role: "user", content: req.prompt }],
  };
  if (req.thinking) body.thinking = req.thinking;
  const msg: any = await client.messages.create(body);
  const blocks: any[] = Array.isArray(msg?.content) ? msg.content : [];
  return blocks
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("")
    .trim();
};

/**
 * A browser-safe completer that POSTs to a server proxy instead of calling a provider
 * SDK directly — so the API keys stay SERVER-SIDE and never enter the bundle. The proxy
 * answers `{text}` on success or `{error}` on failure (and a non-2xx status is treated as
 * an error), so a thrown error degrades `claudeAuthor` to its deterministic `fallbackText`.
 * `provider` may be a getter (`() => string`) so a UI dropdown can switch provider live
 * without rebuilding the author. The `apiKey`/`thinking` fields of the request are NOT
 * sent — provider auth + thinking policy are the proxy's job (see dev/agent-proxy.ts).
 */
export function httpCompleter(url: string, provider: string | (() => string)): Completer {
  return async (req) => {
    const p = typeof provider === "function" ? provider() : provider;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: p, system: req.system, prompt: req.prompt, model: req.model, maxTokens: req.maxTokens }),
    });
    let data: { text?: string; error?: string } = {};
    try {
      data = (await res.json()) as { text?: string; error?: string };
    } catch {
      /* non-JSON body → fall through to the status check below */
    }
    if (!res.ok || data.error) throw new Error(data.error ?? `agent proxy responded ${res.status}`);
    return (data.text ?? "").trim();
  };
}

/**
 * The offline author: the deterministic default. Runs the SAME grounding as the live
 * author but fills the prose slot with the plan's `fallbackText` — fully offline, so it
 * drives tests and the browser demo (which must never hold an API key). Equivalent, by
 * construction, to a hand-written fake — but sharing one `assemble` with `claudeAuthor`.
 */
export function offlineAuthor(plan: (req: GenerateRequest) => AuthorPlan): LessonAuthor {
  return {
    generate(req: GenerateRequest): BeatSpec {
      const p = plan(req);
      return p.assemble({ text: p.fallbackText });
    },
  };
}

/**
 * The live Claude author: authors the prose with a real model, drops it into the
 * plan's grounded BeatSpec. Degrades gracefully — an API error or an empty reply falls
 * back to the deterministic `fallbackText`, so a learner's question never dead-ends.
 */
export function claudeAuthor(opts: ClaudeAuthorOptions): LessonAuthor {
  const complete = opts.complete ?? anthropicComplete;
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const thinking = opts.thinking === false ? undefined : ({ type: "adaptive" } as const);
  return {
    async generate(req: GenerateRequest): Promise<BeatSpec> {
      const p = plan(req, opts.plan);
      let prose = "";
      try {
        prose = await complete({ system: p.system, prompt: p.prompt, model, maxTokens, apiKey: opts.apiKey, thinking });
      } catch (err) {
        if (typeof console !== "undefined") console.warn("[lessonkit] Claude author fell back to offline prose:", err);
      }
      return p.assemble({ text: prose || p.fallbackText });
    },
  };
}

/** Small indirection so `claudeAuthor` reads clearly; keeps `plan` a plain call. */
function plan(req: GenerateRequest, fn: (req: GenerateRequest) => AuthorPlan): AuthorPlan {
  return fn(req);
}

/**
 * Select the author at the seam: the LIVE Claude author when a key is available (or a
 * completer is injected), else the deterministic OFFLINE author. This is the whole
 * opt-in policy — the default stays offline and replayable; a real model drops in the
 * moment `ANTHROPIC_API_KEY` is set, at the very same `LessonAuthor` boundary.
 */
export function pickAuthor(
  planFn: (req: GenerateRequest) => AuthorPlan,
  opts: Omit<ClaudeAuthorOptions, "plan"> = {},
): LessonAuthor {
  if (opts.complete) return claudeAuthor({ plan: planFn, ...opts });
  const apiKey = opts.apiKey ?? envApiKey();
  return apiKey ? claudeAuthor({ plan: planFn, ...opts, apiKey }) : offlineAuthor(planFn);
}
