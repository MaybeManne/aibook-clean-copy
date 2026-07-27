// Null narration bundle, aliased as `@lesson-audio` when `npm run lesson` runs WITHOUT
// `--audio`. `preparedSpec` is null, so the host renders the lesson silently. The
// `--audio` path points the alias at the generated `.gen.ts` (real audio) instead.
import type { LessonSpec } from "@lessonkit/lesson";
import type { AudioManifest, CaptionSegment } from "@lessonkit/audio";

export const preparedSpec: LessonSpec | null = null;
export const audioManifest: AudioManifest = {};
export const captions: Record<string, CaptionSegment[]> = {};
