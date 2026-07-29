import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { ttsDevPlugin } from "./audio/dev_tts.js";
import { authorDevPlugin } from "./lesson/authoring/dev_author.js";

const r = (p: string) => resolve(import.meta.dirname, p);

// Switchable root so the shared aliases below always load from the project root.
export default defineConfig({
  root: process.env.LS_ROOT ?? "examples/split-demo",
  // Two dev endpoints, same shape and the same reason: the provider key stays in THIS
  // process, and every response is content-hash cached to disk.
  //   • `ttsDevPlugin`    answers POST /api/tts    (StudioView's useNarration → ElevenLabs)
  //   • `authorDevPlugin` answers POST /api/author (httpCompleter → Claude, for live authoring)
  // A narration line is billed once, and so is a learner's question against the same
  // grounding, which is what makes a re-run offline, free and reproducible.
  plugins: [
    react(),
    ttsDevPlugin({ cacheDir: resolve(import.meta.dirname, ".audio-cache") }),
    authorDevPlugin({ cacheDir: resolve(import.meta.dirname, ".author-cache") }),
  ],
  // The example root sits below the repo, and node_modules is a symlink to the sibling
  // lessonkit checkout — allow both so Vite's fs guard serves engine source + KaTeX fonts.
  server: { fs: { allow: [import.meta.dirname, resolve(import.meta.dirname, "..")] } },
  resolve: {
    alias: {
      "@lessonstudio/state-machine": r("state_machine/index.ts"),
      "@lessonstudio/render-contract": r("render_contract/index.ts"),
      "@lessonstudio/timeline": r("timeline/index.ts"),
      "@lessonstudio/visuals": r("visuals/index.ts"),
      "@lessonstudio/audio": r("audio/index.ts"),
      "@lessonstudio/lesson": r("lesson/index.ts"),
      "@lessonstudio/live": r("live/index.ts"),
      "@lessonstudio/template": r("template/index.ts"),
      "@lessonstudio/scene-svg": r("scene_svg/index.ts"),
      "@lessonstudio/render-web": r("rendering/render_web/index.ts"),
    },
  },
});
