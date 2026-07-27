// MOVED — the transcript projection now lives in the lesson layer
// (`lesson/transcript.ts`), because it is a pure projection of lesson state and is
// shared by BOTH the video/ and live/ hosts. This one-line re-export shim preserves
// the historical `@lessonkit/video` / `./transcript.js` import paths.
export { projectTranscript } from "@lessonkit/lesson";
export type { Turn, TurnRole } from "@lessonkit/lesson";
