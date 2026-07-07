import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const r = (p: string) => resolve(import.meta.dirname, p);

export default defineConfig({
  root: "examples/photosynthesis",
  plugins: [react()],
  resolve: {
    alias: {
      "@lessonkit/state-machine": r("state_machine/index.ts"),
      "@lessonkit/render-contract": r("render_contract/index.ts"),
      "@lessonkit/timeline": r("timeline/index.ts"),
      "@lessonkit/lesson": r("lesson/index.ts"),
      "@lessonkit/template": r("template/index.ts"),
      "@lessonkit/render-web": r("rendering/render_web/index.ts"),
    },
  },
});
