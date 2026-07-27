// A NODE-ONLY Vite dev-server plugin: the server side of `httpCompleter`. It exposes
// POST /api/agent and fans out to a chosen provider, reading every credential ONLY from
// `process.env` — so keys live server-side and never enter the browser bundle, the
// transcript, or the chat. The only data forwarded to a provider is the grounding
// `system` prompt + the learner's `prompt` (the question). It answers `{text}` on
// success or `{error}` on failure; a thrown/`{error}` response degrades the live author
// back to its deterministic offline prose, so a question never dead-ends.
//
// This file is intentionally NOT in any package barrel and NOT in the tsc `include`: it
// is loaded only by Vite (esbuild) when the dev server boots, exactly like vite.config.ts.
// Dev-server-only egress — it has no effect on a production build.

import type { Plugin } from "vite";
import { spawn } from "node:child_process";
import type { IncomingMessage, ServerResponse } from "node:http";
// Reuse the ONE ElevenLabs adapter (the call shape + char→word alignment) — the dev proxy is
// the only place the key is read (`process.env`), exactly like the agent providers below.
// Relative specifier: this file is esbuild-loaded by Vite, not in the tsc `include`.
import { elevenLabsAdapter } from "../audio/elevenlabs.js";

interface AgentRequest {
  provider?: string;
  system?: string;
  prompt?: string;
  model?: string;
  maxTokens?: number;
}

interface TtsRequest {
  text?: string;
  voice?: string;
}

const CLAUDE_CODE_TIMEOUT_MS = 60_000;
const MAX_TTS_CHARS = 2_000; // narration scripts are a few sentences; cap runaway input

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

/**
 * Gemini 3 Pro via the user's own `GEMINI_API_KEY`. Model overridable via `GEMINI_MODEL`.
 * NOTE: `-preview` model ids are deprecated by Google on a rolling basis (a stale one
 * 404s with "no longer available" → we degrade to offline prose). If that happens, bump
 * this default or set `GEMINI_MODEL` — e.g. the floating alias `gemini-pro-latest`, which
 * tracks the current Pro and won't 404 (the live path is non-deterministic anyway; replay
 * uses recorded text, so a floating alias costs no reproducibility).
 */
async function callGemini(system: string, prompt: string, maxTokens?: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const model = process.env.GEMINI_MODEL ?? "gemini-3.1-pro-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens ?? 2048 },
  };
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p?.text ?? "").join("").trim();
}

/** Claude Code under the user's own local auth (`claude -p`). No API key needed. */
function callClaudeCode(system: string, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("claude", ["-p", prompt, "--system-prompt", system, "--output-format", "text"], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("claude-code timed out"));
    }, CLAUDE_CODE_TIMEOUT_MS);
    child.stdout.on("data", (d) => (out += String(d)));
    child.stderr.on("data", (d) => (err += String(d)));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim() || `claude exited ${code}`));
    });
  });
}

/** Anthropic Messages API — only when `ANTHROPIC_API_KEY` is present. */
async function callAnthropic(system: string, prompt: string, model?: string, maxTokens?: number): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY not set");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: model ?? "claude-opus-4-8", max_tokens: maxTokens ?? 2048, system, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content?: Array<{ type?: string; text?: string }> };
  const blocks = Array.isArray(data.content) ? data.content : [];
  return blocks.filter((b) => b?.type === "text" && typeof b.text === "string").map((b) => b.text as string).join("").trim();
}

/**
 * ElevenLabs TTS — the SPOKEN narration path. Reads `ELEVEN_LABS_API_KEY` (or the legacy
 * `ELEVENLABS_API_KEY`) ONLY here, server-side. The browser sends just the narration `text`;
 * we return `{audio(base64), mime, durationMs, words}`. No key ever reaches the bundle; a
 * missing key surfaces as `{error}` (the client silently plays nothing — narration is optional).
 */
async function callElevenLabs(text: string, voice?: string): Promise<{ audio: string; mime: string; durationMs: number; words: unknown[] }> {
  const apiKey = process.env.ELEVEN_LABS_API_KEY ?? process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVEN_LABS_API_KEY not set");
  const clip = await elevenLabsAdapter({ apiKey }).synthesize(text.slice(0, MAX_TTS_CHARS), voice ? { voice } : {});
  return { audio: clip.audio, mime: clip.mime, durationMs: clip.durationMs, words: clip.words };
}

/** The Vite plugin: mounts POST /api/agent and POST /api/tts on the dev server's connect stack. */
export function agentProxy(): Plugin {
  return {
    name: "lessonkit-agent-proxy",
    configureServer(server) {
      // Spoken narration. Only the narration text egresses; the key stays in `process.env`.
      server.middlewares.use("/api/tts", async (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
        if (req.method !== "POST") return next();
        try {
          const parsed = JSON.parse((await readBody(req)) || "{}") as TtsRequest;
          const text = (parsed.text ?? "").trim();
          if (!text) return sendJson(res, 200, { error: "empty narration text" });
          sendJson(res, 200, await callElevenLabs(text, parsed.voice));
        } catch (e) {
          const message = String((e as Error)?.message ?? e);
          console.warn("[lessonkit] tts proxy failed → narration skipped:", message);
          sendJson(res, 200, { error: message });
        }
      });

      server.middlewares.use("/api/agent", async (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
        if (req.method !== "POST") return next();
        let provider: string | undefined; // hoisted so the catch can name it in its log
        try {
          const raw = await readBody(req);
          const parsed = JSON.parse(raw || "{}") as AgentRequest;
          provider = parsed.provider;
          const system = parsed.system ?? "";
          const prompt = parsed.prompt ?? "";
          const { model, maxTokens } = parsed;
          let text: string;
          switch (provider) {
            case "gemini":
              text = await callGemini(system, prompt, maxTokens);
              break;
            case "claude-code":
              text = await callClaudeCode(system, prompt);
              break;
            case "anthropic":
              text = await callAnthropic(system, prompt, model, maxTokens);
              break;
            default:
              return sendJson(res, 400, { error: `unknown provider "${provider ?? ""}"` });
          }
          sendJson(res, 200, { text });
        } catch (e) {
          const message = String((e as Error)?.message ?? e);
          // Surface the real cause in the DEV TERMINAL (where the dev is looking): the
          // client only degrades to offline prose + a browser-console warn, so without
          // this a dead model / bad key looks like "the tutor gives canned answers".
          console.warn(`[lessonkit] agent proxy: ${provider ?? "?"} failed → offline fallback:`, message);
          // 200 + {error}: httpCompleter treats {error} as a failure and falls back to
          // offline prose, without surfacing a scary network error in the client console.
          sendJson(res, 200, { error: message });
        }
      });
    },
  };
}
