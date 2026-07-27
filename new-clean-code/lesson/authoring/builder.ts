// A fluent, reference-based front-end for authoring lessons — the "OOP surface" over the
// SAME BeatSpec/LessonSpec IR that `dsl.ts` emits and that the runtime + LLM author consume.
// Nothing here is new runtime machinery: `lesson(...)` returns a plain LessonSpec, so it
// flows through the exact same `defineLesson` → `compileLesson` path. The point is purely
// ergonomic — the three things that make a tool like Manim easy to author and MODIFY, brought
// to lessons:
//   • sequencing = declaration order. No hand-wired `next:` strings; the spine falls out of
//     the order you add spine beats, and the last one is terminal (see compile.ts buildSpine).
//     Inserting an intermediate beat is adding a line, not rewiring three edges.
//   • real references. You route to a `BeatHandle`, not a re-quoted string id, so a typo'd
//     target is a *compile* error, and detours are wired by the variable you already hold.
//   • routes & detours as METHODS on the beat you route FROM — co-located, instead of bolted
//     onto a helper's result via object-spread (`{ ...explorable({...}), routes: [...] }`).
//
// Because the output is plain data, perfecting this surface for HUMAN authors is exactly what
// defines the LLM author's vocabulary too (docs/VISION.md): the agent emits the same beats and
// edges, just as JSON instead of method calls. This module is a compiler front-end, not a
// second engine — the statechart underneath is unchanged, so replay / interrupt-resume /
// agent-as-author all keep working.

import type { Action, Guard, Json, Route } from "@lessonkit/state-machine";
import type { Storyboard } from "@lessonkit/timeline";
import type { BeatSpec, LessonSpec } from "../lesson_sm/compile.js";
import type { LessonContext } from "../lesson_sm/context.js";
import type { ExplainParams, ExplorableParams, FreeResponseParams, McqParams } from "../beats/index.js";

/**
 * A live handle to a beat that has been added to the lesson. Its methods mutate the
 * underlying BeatSpec in place, so you choreograph routes/detours by REFERENCE after
 * declaring the beats — never by re-quoting a string id.
 */
export interface BeatHandle {
  readonly id: string;

  /**
   * Route `event` (fired while on this beat) to a detour `target`. An optional inline
   * `action` runs on the transition — e.g. to read the learner's live state and push an
   * effect. Name it with `as` for a readable registry entry; otherwise one is derived.
   * Inline actions are a COMPILE-TIME privilege (the author holds the pen): runtime/LLM
   * authoring references guards & actions by name only (see commands.ts assertNoInlineFns).
   */
  on(event: string, target: BeatHandle, opts?: { action?: Action<LessonContext>; as?: string }): BeatHandle;

  /** Gate sugar (mcq / freeResponse): where a WRONG answer detours to. */
  onWrong(target: BeatHandle): BeatHandle;

  /**
   * Where this OFF-SPINE detour beat rejoins the flow. Omit and the beat is terminal.
   * Spine beats never call this — their successor is simply the next beat you declared.
   */
  rejoins(target: BeatHandle): BeatHandle;
}

/**
 * Accumulates beats in declaration order and emits a plain LessonSpec. Pure — no engine
 * state, no I/O. Use the `lesson(...)` entry point rather than constructing this directly.
 */
export class LessonBuilder {
  private readonly flow: BeatSpec[] = [];
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly version: number,
  ) {}

  private add(spec: BeatSpec): BeatHandle {
    this.flow.push(spec);
    const handle: BeatHandle = {
      id: spec.id,
      on(event, target, opts) {
        const route: Route = { on: event, target: target.id };
        if (opts?.action) {
          const name = opts.as ?? `${spec.id}.on:${event}`;
          spec.__actions = { ...(spec.__actions ?? {}), [name]: opts.action };
          route.actions = [name];
        }
        spec.routes = [...(spec.routes ?? []), route];
        return handle;
      },
      onWrong(target) {
        (spec.params as Record<string, unknown>).onWrong = target.id;
        return handle;
      },
      rejoins(target) {
        spec.next = target.id;
        return handle;
      },
    };
    return handle;
  }

  explorable(id: string, params: ExplorableParams): BeatHandle {
    return this.add({ id, type: "explorable", params: params as unknown as Json });
  }
  mcq(id: string, params: McqParams): BeatHandle {
    return this.add({ id, type: "mcq", params: params as unknown as Json });
  }
  explain(id: string, params: ExplainParams): BeatHandle {
    return this.add({ id, type: "explain", params: params as unknown as Json });
  }
  freeResponse(id: string, params: FreeResponseParams): BeatHandle {
    return this.add({ id, type: "freeResponse", params: params as unknown as Json });
  }
  animate(id: string, params: { storyboard: Storyboard; slot?: string; narration?: string }): BeatHandle {
    return this.add({ id, type: "scene", params: params as unknown as Json });
  }
  /** A predicate fork. `then`/`else` are the beats to jump to (real references). */
  branch(id: string, opts: { when: Guard<LessonContext>; then: BeatHandle; else: BeatHandle }): BeatHandle {
    const whenRef = `branch.when:${id}`;
    return this.add({
      id,
      type: "branch",
      params: { whenRef, then: opts.then.id, else: opts.else.id } as unknown as Json,
      __guards: { [whenRef]: opts.when },
    });
  }

  /** Emit the accumulated flow as a plain LessonSpec. */
  spec(): LessonSpec {
    return { id: this.id, version: this.version, title: this.title, flow: this.flow };
  }
}

/**
 * Author a lesson with the fluent builder. Returns a plain LessonSpec — feed it to
 * `defineLesson` exactly like a hand-written spec. Declare the spine top-to-bottom
 * (order is the path), then wire detours/routes by reference.
 */
export function lesson(
  id: string,
  title: string,
  build: (l: LessonBuilder) => void,
  opts: { version?: number } = {},
): LessonSpec {
  const b = new LessonBuilder(id, title, opts.version ?? 1);
  build(b);
  return b.spec();
}
