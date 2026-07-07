// Glue: binds a lesson Session to React. This is the ONLY place the renderer and
// the lesson layer meet, so it lives in the app layer to keep both reusable.
import { useCallback, useMemo, useReducer } from "react";
import type { MachineEvent } from "@lessonkit/state-machine";
import { createSession, type CompiledLesson, type Session } from "@lessonkit/lesson";
import type { RenderModel } from "@lessonkit/render-contract";

export interface UseSession {
  model: RenderModel;
  send: (event: MachineEvent) => void;
  done: boolean;
  activeBeatId: string;
}

export function useSession(lesson: CompiledLesson): UseSession {
  const session: Session = useMemo(() => createSession(lesson), [lesson]);
  const [, force] = useReducer((n: number) => n + 1, 0);
  const send = useCallback(
    (event: MachineEvent) => {
      session.send(event);
      force();
    },
    [session],
  );
  return { model: session.render(), send, done: session.done, activeBeatId: session.activeBeatId() };
}
