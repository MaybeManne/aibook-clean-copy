// Generic host for `npm run lesson -- <file>`. It imports the authored lesson through
// the `@lesson` alias (vite.config resolves it to the file named by LK_LESSON — a REAL
// file, so HMR of the author's lesson works) and mounts it. No per-lesson App.tsx or
// index.html is needed: this file IS the host for every single-file lesson.
//
// Narration: `@lesson-audio` resolves to the generated bundle when the server was booted
// with `--audio` (else a null stub), so audio is opt-in with zero source changes. Layout
// is a render-time switch via `?layout=theater` (default notebook) — no rebuild.

import "katex/dist/katex.min.css";
import { renderLesson } from "@lessonkit/author";
import lesson from "@lesson";
import { preparedSpec, audioManifest, captions } from "@lesson-audio";

const layout = new URLSearchParams(window.location.search).get("layout") === "theater" ? "theater" : "notebook";
const audio = preparedSpec ? { preparedSpec, audioManifest, captions } : null;

renderLesson(lesson, { layout, audio });
