// The browser entry: turn a built lesson into a running player. This is the ONLY
// file in @lessonkit/author that touches React / the renderer — it packages the
// per-example App.tsx boilerplate (register viz → createSession → createVideoProgram →
// mount VideoView in the notebook layout) behind one call. Keeping it separate from
// build.ts means the spec-building path stays React-free and headless-usable.

import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { createSession, defineLesson, type LessonSpec } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, registerFigure, registerViz, htmlAudioSink } from "@lessonkit/render-web";
import { text } from "@lessonkit/render-contract";
import type { AudioManifest, CaptionSegment } from "@lessonkit/audio";
import type { LessonBuilder } from "./build.js";
import type { VizValue } from "./viz.js";

/**
 * The offline-narration artifact (produced by `author/gen-audio.ts`): the prepared spec
 * (scene durations baked to audio length + caption cues) plus the audio + captions the
 * player consumes. `renderLesson` renders from `preparedSpec` and slaves audio to the clock.
 */
export interface AudioBundle {
  preparedSpec: LessonSpec;
  audioManifest: AudioManifest;
  captions: Record<string, CaptionSegment[]>;
}

export interface RenderOptions {
  /** Player layout, chosen at render time. Default "notebook". */
  layout?: "notebook" | "theater";
  /** Generated narration bundle. When present, audio + word-highlighted captions play. */
  audio?: AudioBundle | null;
}

/** Register every inline viz descriptor under its stamped deterministic name. */
function registerAll(descriptors: VizValue[]): void {
  for (const d of descriptors) {
    if (!d.name) continue;
    if (d.__viz === "figure") {
      const draw = d.draw;
      // Forward the beat clock `t` so a figure used as an `.animate` scene's viz can
      // animate; it stays 0 for untimed `.explain`/`.demo` beats (a harmless no-op there).
      registerFigure(d.name, (props, t, theme) => draw(props, theme, t));
    } else {
      // The author factory's api.send is the engine's MachineEvent sink; the shapes
      // line up structurally — the cast just relaxes the `unknown` event param.
      registerViz(d.name, d.factory as Parameters<typeof registerViz>[1]);
    }
  }
}

/**
 * Mount a single-file lesson. Registers its inline viz, builds a session (+ any adaptive
 * policies), and renders the player into `el` (default `#root`) in the chosen `layout`.
 * With `opts.audio` (a generated narration bundle) it renders from the prepared spec and
 * wires audio + captions into the program; without it, the lesson is silent (as before).
 * Re-using one React root per element keeps HMR from double-mounting; deterministic viz
 * names mean re-registration replaces rather than leaks.
 */
export function renderLesson(builder: LessonBuilder, opts: RenderOptions = {}, el?: HTMLElement | null): void {
  const built = builder.build();
  registerAll(built.descriptors);

  const mount = el ?? (typeof document !== "undefined" ? document.getElementById("root") : null);
  if (!mount) throw new Error("renderLesson: no mount element (pass one, or add <div id=\"root\">)");

  // With a narration bundle, render from the prepared spec (scene durations baked to
  // audio length + caption cues); descriptors/policies/article still come from the live
  // builder (beat ids match), so viz lookup and adaptive routing are unaffected.
  const bundle = opts.audio ?? null;
  const lesson = bundle ? defineLesson(bundle.preparedSpec) : built.lesson;
  const session = createSession(lesson, { policies: built.policies });
  const program = bundle
    ? createVideoProgram(session, { audio: bundle.audioManifest, captions: bundle.captions, audioSink: htmlAudioSink() })
    : createVideoProgram(session);

  const layout = opts.layout ?? "notebook";

  function App(): React.ReactElement {
    React.useEffect(() => () => program.dispose(), []);
    return React.createElement(VideoView, {
      program,
      layout,
      title: text(built.title),
      ...(built.eyebrow ? { eyebrow: built.eyebrow } : {}),
      article: built.article,
    });
  }

  const holder = mount as HTMLElement & { __lkRoot?: Root };
  const root = holder.__lkRoot ?? (holder.__lkRoot = createRoot(mount));
  root.render(React.createElement(App));
}
