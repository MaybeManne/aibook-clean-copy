// The SERVER side of StudioView's narration contract. `useNarration` POSTs a beat's
// narration string to `/api/tts` and plays the clip it gets back; this module is the
// endpoint that answers. Two reasons it lives here rather than in the renderer:
//   • the API key stays in the dev process — it is never bundled into the browser;
//   • every line is content-hash cached to disk (`narrationKey`), so a line is
//     synthesized ONCE ever. Re-runs are offline, instant, and free — which also makes
//     a lesson's narration reproducible instead of re-billed on every reload.
//
// NODE ONLY, and deliberately NOT re-exported from audio/index.ts: `fileCache` reaches
// for node:fs and this file is imported by vite.config.ts, so keeping it off the barrel
// is what stops it leaking into a browser bundle.

import { fileCache, narrationKey, type AudioCache } from "./cache.js";
import { elevenLabsAdapter } from "./elevenlabs.js";
import { fakeTtsAdapter } from "./fake.js";
import type { NarrationAudio, TtsAdapter } from "./tts.js";

export interface TtsEndpointOptions {
  /** Defaults to `process.env.ELEVEN_LABS_API_KEY`. Absent ⇒ the silent fake adapter. */
  apiKey?: string;
  voice?: string;
  /** Directory for the on-disk clip cache (default `.audio-cache`). */
  cacheDir?: string;
  /** Override the adapter entirely (tests). */
  adapter?: TtsAdapter;
  cache?: AudioCache;
}

export interface TtsEndpoint {
  /** Synthesize (or read from cache) one narration line. */
  synthesize(text: string): Promise<NarrationAudio>;
  /** True when a real (audible) backend is in use — false ⇒ the silent fake. */
  readonly live: boolean;
}

/**
 * Build the cached synthesize function the dev endpoint (and any offline precompile
 * script) shares. With no key it falls back to the silent fake adapter so the whole
 * narration → captions → playback path still runs — honestly silent, never broken.
 */
export function ttsEndpoint(opts: TtsEndpointOptions = {}): TtsEndpoint {
  const apiKey = opts.apiKey ?? process.env.ELEVEN_LABS_API_KEY ?? "";
  const live = !!opts.adapter || !!apiKey;
  const adapter: TtsAdapter = opts.adapter ?? (apiKey ? elevenLabsAdapter({ apiKey }) : fakeTtsAdapter());
  const cache = opts.cache ?? fileCache(opts.cacheDir ?? ".audio-cache");

  return {
    live,
    async synthesize(text: string): Promise<NarrationAudio> {
      const key = narrationKey(text, opts.voice);
      const hit = await cache.get(key);
      if (hit) return hit;
      const fresh = await adapter.synthesize(text, opts.voice ? { voice: opts.voice } : {});
      await cache.put(key, fresh);
      return fresh;
    },
  };
}

// ── Vite dev-server plugin ──────────────────────────────────────────────────────
// Typed structurally (no `vite` import) so the audio layer keeps zero build-tool deps.

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
 * Mounts `POST /api/tts` on the Vite dev server: `{ text }` → the `NarrationAudio`
 * shape StudioView expects (`{ audio, mime, durationMs, words }`). Errors answer with
 * `{ error }` and a 200-family status the renderer treats as "no narration", because a
 * missing clip must degrade to silence rather than break the lesson.
 */
export function ttsDevPlugin(opts: TtsEndpointOptions = {}): VitePluginLike {
  const endpoint = ttsEndpoint(opts);
  return {
    name: "lessonstudio-tts",
    configureServer(server: DevServerLike): void {
      // eslint-disable-next-line no-console
      console.log(`[tts] /api/tts ready — ${endpoint.live ? "ElevenLabs (cached)" : "SILENT fake (no ELEVEN_LABS_API_KEY)"}`);
      server.middlewares.use("/api/tts", (req, res, next) => {
        if (req.method !== "POST") return next();
        void (async () => {
          res.setHeader("content-type", "application/json");
          try {
            const { text } = JSON.parse((await readBody(req)) || "{}") as { text?: string };
            if (!text || !text.trim()) {
              res.end(JSON.stringify({ error: "no text" }));
              return;
            }
            const clip = await endpoint.synthesize(text);
            res.end(JSON.stringify(clip));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("[tts] synthesis failed:", e instanceof Error ? e.message : e);
            res.end(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }));
          }
        })();
      });
    },
  };
}
