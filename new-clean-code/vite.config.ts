import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { ttsDevPlugin } from "./audio/dev_tts.js";
import { authorDevPlugin } from "./forge/dev_author.js";
import { directorDevPlugin } from "./forge/dev_director.js";
import { teachDevPlugin } from "./teach/dev_bus.js";

const r = (p: string) => resolve(import.meta.dirname, p);

const root = process.env.LS_ROOT ?? "examples/split-demo";

// Switchable root so the shared aliases below always load from the project root.
export default defineConfig({
  root,
  // One dep-optimizer cache PER ROOT. Vite's default resolves to the nearest package.json, which
  // is the repo root for every example — so two dev servers on two roots share one cache and
  // invalidate each other: the pinhole page 504s on `three` because the convolution root, which
  // does not use it, rewrote the cache without it. Keying on the root makes them independent.
  cacheDir: r(`node_modules/.vite/${root.replace(/[^a-zA-Z0-9]+/g, "-")}`),
  // Two dev endpoints, same shape and the same reason: the provider key stays in THIS
  // process, and every response is content-hash cached to disk.
  //   • `ttsDevPlugin`    answers POST /api/tts    (StudioView's useNarration → ElevenLabs)
  //   • `authorDevPlugin` answers POST /api/author (httpCompleter → Claude, for live authoring)
  // A narration line is billed once, and so is a learner's question against the same
  // grounding, which is what makes a re-run offline, free and reproducible.
  //
  //   • `directorDevPlugin` answers POST /api/direct (httpToolCompleter → a tool-calling
  //     model, for the AI TEACHER running INSIDE the page). Not cached: a director's turn is a
  //     response to a situation, and the same observation twice may well deserve a different
  //     move. With no key it answers `{error}` and the AI teacher stays silent.
  //
  // The last is not a provider at all: `teachDevPlugin` is the LIVE TEACHER's bus
  // (/api/session/{sync,log,observe,direct}) — a student page pushes its observation and pulls
  // commands, a teacher tails the log and posts commands back. It holds no key and calls
  // nothing external. The AI teacher of tier 3 rides these SAME four endpoints when it runs as
  // its own process (`tsx forge/cli/ai_teach.ts`), which is the canonical tier-3 shape: the
  // model is a different client of the human teacher's interface, not a second integration.
  plugins: [
    react(),
    ttsDevPlugin({ cacheDir: resolve(import.meta.dirname, ".audio-cache") }),
    authorDevPlugin({ cacheDir: resolve(import.meta.dirname, ".author-cache") }),
    directorDevPlugin(),
    teachDevPlugin({ logDir: resolve(import.meta.dirname, ".session-log") }),
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
      "@lessonstudio/authoring": r("authoring/index.ts"),
      "@lessonstudio/teach": r("teach/index.ts"),
      "@lessonstudio/forge": r("forge/index.ts"),
      "@lessonstudio/live": r("live/index.ts"),
      "@lessonstudio/template": r("template/index.ts"),
      "@lessonstudio/scene-svg": r("scene_svg/index.ts"),
      "@lessonstudio/render-web": r("rendering/render_web/index.ts"),
    },
  },
});
