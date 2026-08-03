import { postJson, type VitePluginLike } from "../dev/http.js";
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

interface TtsEndpoint {
  /** Synthesize (or read from cache) one narration line. */
  synthesize(text: string): Promise<NarrationAudio>;
  /** True when a real (audible) backend is in use — false ⇒ the silent fake. */
  readonly live: boolean;
}

function ttsEndpoint(opts: TtsEndpointOptions = {}): TtsEndpoint {
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

/**
 * Mounts `POST /api/tts` on the Vite dev server: `{ text }` → the `NarrationAudio` shape
 * StudioView expects (`{ audio, mime, durationMs, words }`). Errors answer `{ error }` with a
 * 200 status, which the renderer treats as "no narration".
 */
export function ttsDevPlugin(opts: TtsEndpointOptions = {}): VitePluginLike {
  const endpoint = ttsEndpoint(opts);
  return {
    name: "lessonstudio-tts",
    configureServer(server): void {
      console.log(`[tts] /api/tts ready — ${endpoint.live ? "ElevenLabs (cached)" : "SILENT fake (no ELEVEN_LABS_API_KEY)"}`);
      postJson(server, "/api/tts", async (raw) => {
        try {
          const { text } = JSON.parse(raw || "{}") as { text?: string };
          if (!text || !text.trim()) return { status: 200, json: { error: "no text" } };
          return { status: 200, json: await endpoint.synthesize(text) };
        } catch (e) {
          console.warn("[tts] synthesis failed:", e instanceof Error ? e.message : e);
          return { status: 200, json: { error: String(e instanceof Error ? e.message : e) } };
        }
      });
    },
  };
}
