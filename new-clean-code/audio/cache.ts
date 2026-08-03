import type { NarrationAudio } from "./tts.js";

/** Small, stable, dependency-free string hash → 12 hex chars (cyrb53). */
export function narrationKey(text: string, voice = ""): string {
  const s = `${voice} ${text}`;
  let h1 = 0xdeadbeef ^ s.length;
  let h2 = 0x41c6ce57 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return n.toString(16).padStart(12, "0").slice(0, 12);
}

export interface AudioCache {
  get(key: string): Promise<NarrationAudio | null>;
  put(key: string, audio: NarrationAudio): Promise<void>;
}

/** Filesystem cache: one JSON per key under `dir`. Node only (lazy fs import). */
export function fileCache(dir: string): AudioCache {
  return {
    async get(k) {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      try {
        return JSON.parse(await readFile(join(dir, `${k}.json`), "utf8")) as NarrationAudio;
      } catch {
        return null;
      }
    },
    async put(k, a) {
      const { mkdir, writeFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, `${k}.json`), JSON.stringify(a));
    },
  };
}
