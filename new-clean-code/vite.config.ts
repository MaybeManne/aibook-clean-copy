import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { agentProxy } from "./dev/agent-proxy";

const r = (p: string) => resolve(import.meta.dirname, p);

// `npm run lesson -- <file>` sets LK_LESSON to a single authored lesson; the `@lesson`
// alias points the generic host (dev/host/main.tsx) at that REAL file so HMR works.
const lessonFile = process.env.LK_LESSON ? resolve(process.env.LK_LESSON) : null;
// With `--audio`, LK_LESSON_AUDIO names the generated narration bundle; `@lesson-audio`
// points at it (else a null stub) so audio is opt-in with no source changes.
const lessonAudio = process.env.LK_LESSON_AUDIO ? resolve(process.env.LK_LESSON_AUDIO) : r("dev/host/no-audio.ts");

export default defineConfig({
  // Switchable root so the shared aliases below always load from the project
  // root (positional `vite <dir>` would look for the config inside <dir>).
  root: process.env.LK_ROOT ?? "examples/photosynthesis",
  // agentProxy is the SERVER side of httpCompleter: POST /api/agent → provider, keys
  // read only from process.env (server-side, dev egress only). Never bundled to the client.
  plugins: [react(), agentProxy()],
  // The Claude author loads `@anthropic-ai/sdk` via a runtime `import()` and only when
  // a live generation fires with a key — it is NEVER bundled for the browser (the demo
  // runs the offline author). tsc/tsx ignore it via a widened specifier, but Vite's
  // esbuild dep-scanner still sees the string and, failing to resolve it, would skip
  // pre-bundling for ALL deps. Excluding it keeps the scan clean without installing it.
  optimizeDeps: { exclude: ["@anthropic-ai/sdk"] },
  // A single authored lesson file may live outside the repo tree; allow the host dir
  // plus the lesson's own directory so Vite's fs guard doesn't block it.
  server: { fs: { allow: [import.meta.dirname, ...(lessonFile ? [dirname(lessonFile)] : []), dirname(lessonAudio)] } },
  resolve: {
    alias: {
      ...(lessonFile ? { "@lesson": lessonFile } : {}),
      "@lesson-audio": lessonAudio,
      "@lessonkit/author": r("author/index.ts"),
      "@lessonkit/state-machine": r("state_machine/index.ts"),
      "@lessonkit/render-contract": r("render_contract/index.ts"),
      "@lessonkit/timeline": r("timeline/index.ts"),
      "@lessonkit/audio": r("audio/index.ts"),
      "@lessonkit/lesson": r("lesson/index.ts"),
      "@lessonkit/video": r("video/index.ts"),
      "@lessonkit/live": r("live/index.ts"),
      "@lessonkit/template": r("template/index.ts"),
      "@lessonkit/render-web": r("rendering/render_web/index.ts"),
      "@lessonkit/render-video": r("rendering/render_video/index.ts"),
      "@lessonkit/scene-svg": r("rendering/render_video/svg.ts"),
    },
  },
});
