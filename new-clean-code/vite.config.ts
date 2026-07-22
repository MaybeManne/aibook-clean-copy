import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const r = (p: string) => resolve(import.meta.dirname, p);

export default defineConfig({
  // Switchable root so the shared aliases below always load from the project
  // root (positional `vite <dir>` would look for the config inside <dir>).
  root: process.env.LK_ROOT ?? "examples/photosynthesis",
  plugins: [react()],
  resolve: {
    alias: {
      "@lessonkit/state-machine": r("state_machine/index.ts"),
      "@lessonkit/render-contract": r("render_contract/index.ts"),
      "@lessonkit/timeline": r("timeline/index.ts"),
      "@lessonkit/audio": r("audio/index.ts"),
      "@lessonkit/lesson": r("lesson/index.ts"),
      "@lessonkit/video": r("video/index.ts"),
      "@lessonkit/template": r("template/index.ts"),
      "@lessonkit/render-web": r("rendering/render_web/index.ts"),
      "@lessonkit/render-video": r("rendering/render_video/index.ts"),
      "@lessonkit/scene-svg": r("rendering/render_video/svg.ts"),
    },
  },
});
