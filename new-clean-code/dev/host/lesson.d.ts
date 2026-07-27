// The `@lesson` alias points at an arbitrary author file (chosen at run time via
// LK_LESSON). Its default export is always a LessonBuilder — declare that so main.tsx
// type-checks without knowing which lesson is loaded.
declare module "@lesson" {
  const lesson: import("@lessonkit/author").LessonBuilder;
  export default lesson;
}

// The `@lesson-audio` alias points at the generated narration bundle when the dev server
// was booted with `--audio` (LK_LESSON_AUDIO), and at dev/host/no-audio.ts otherwise.
// Declare the shared shape so main.tsx type-checks regardless of which is aliased.
declare module "@lesson-audio" {
  const preparedSpec: import("@lessonkit/lesson").LessonSpec | null;
  const audioManifest: import("@lessonkit/audio").AudioManifest;
  const captions: Record<string, import("@lessonkit/audio").CaptionSegment[]>;
  export { preparedSpec, audioManifest, captions };
}
