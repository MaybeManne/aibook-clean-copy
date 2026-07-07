import type { Guard } from "@lessonkit/state-machine";
import type { LessonContext } from "@lessonkit/lesson";

/** Reusable escape-hatch guard factory. */
export const scoreAtLeast =
  (n: number): Guard<LessonContext> =>
  (ctx) =>
    ctx.score >= n;
