import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { ttsDevPlugin } from "./audio/dev_tts.js";
import { directorDevPlugin } from "./forge/dev_director.js";
import { teachDevPlugin } from "./teach/dev_bus.js";

const r = (p: string) => resolve(import.meta.dirname, p);

const root = process.env.LS_ROOT ?? "examples/split-demo";

export default defineConfig({
  root,
  cacheDir: r(`node_modules/.vite/${root.replace(/[^a-zA-Z0-9]+/g, "-")}`),
  plugins: [
    react(),
    ttsDevPlugin({ cacheDir: resolve(import.meta.dirname, ".audio-cache") }),
    directorDevPlugin(),
    teachDevPlugin({ logDir: resolve(import.meta.dirname, ".session-log") }),
  ],
  server: { fs: { allow: [import.meta.dirname, resolve(import.meta.dirname, "..")] } },
  resolve: {
    alias: {
      "@lessonstudio/state-machine": r("state_machine/index.ts"),
      "@lessonstudio/intents": r("intents/index.ts"),
      "@lessonstudio/timeline": r("timeline/index.ts"),
      "@lessonstudio/figures": r("figures/index.ts"),
      "@lessonstudio/audio": r("audio/index.ts"),
      "@lessonstudio/lesson": r("lesson/index.ts"),
      "@lessonstudio/authoring": r("authoring/index.ts"),
      "@lessonstudio/teach": r("teach/index.ts"),
      "@lessonstudio/forge": r("forge/index.ts"),
      "@lessonstudio/live": r("live/index.ts"),
      "@lessonstudio/theme": r("theme/index.ts"),
      "@lessonstudio/svg": r("svg/index.ts"),
      "@lessonstudio/machine": r("machine/index.ts"),
      "@lessonstudio/web": r("web/index.ts"),
    },
  },
});
