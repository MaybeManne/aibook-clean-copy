// Host for "Attention, felt". Importing ./viz registers the canvas visualization;
// the session carries BOTH the settled-state policy AND a generatingRunner so the
// "Explain this token ✨" button (and the ask box) generate a bespoke beat live.
// The author here is `fakeAuthor` — deterministic and offline. The REAL Claude author
// drops in at the exact same `LessonAuthor` seam (see `attentionAuthor()` in lesson.ts,
// selected by ANTHROPIC_API_KEY); in the browser that key must live behind a server
// proxy, never in the bundle, so the shipped demo stays on the offline author.
// VideoView's notebook layout puts the persistent beam diagram beside the reader.
//
// Audio with NO API key: prepareNarration + fakeTtsAdapter give deterministic word
// timings offline; speechSink speaks them with the browser's built-in voice. Each
// interactive beat is UNTIMED, so its clip plays once when you arrive at it (see the
// untimed path in the AudioChannel) — exploration stays learner-paced. For studio
// audio, precompile with elevenLabsAdapter (examples/gen-audio.ts) and swap in
// htmlAudioSink + the generated caption track.
import "katex/dist/katex.min.css";
import "./viz.js"; // registerViz("attention", …)
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defaultRunner, defineLesson, generatingRunner, prepareNarration } from "@lessonkit/lesson";
import { fakeTtsAdapter } from "@lessonkit/audio";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, speechSink } from "@lessonkit/render-web";
import { articleText, fakeAuthor, lessonSpec, policy } from "./lesson.js";

const lesson = defineLesson(lessonSpec);
// Offline (here, at load): synthesize the narration manifest. Captions aren't passed —
// untimed beats have no clock to advance a word highlight, and the reader panel already
// shows the prose; speechSink speaks the full line on entry.
const { audio } = await prepareNarration(lessonSpec, { adapter: fakeTtsAdapter() });

function App(): React.ReactElement {
  const program = React.useMemo(
    () =>
      createVideoProgram(
        createSession(lesson, { runner: generatingRunner(fakeAuthor, defaultRunner()), policies: [policy] }),
        { audio, audioSink: speechSink() },
      ),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="ML Internals · Attention" article={articleText} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
