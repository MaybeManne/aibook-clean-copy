// Flagship host: register the figure (side-effect import), build a VideoProgram
// over the narration-prepared lesson with the adaptivity policy, and hand it to
// VideoView's split layout with the authored article + narration audio.
import "katex/dist/katex.min.css";
import "./figures.js"; // registers "unit-circle-sine"
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defineLesson } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, htmlAudioSink } from "@lessonkit/render-web";
import { preparedSpec, audioManifest, captions } from "./audio.gen.js";
import { articleText, policy } from "./lesson.js";

const lesson = defineLesson(preparedSpec);

function App(): React.ReactElement {
  const program = React.useMemo(
    () => createVideoProgram(createSession(lesson, { policies: [policy] }), { audio: audioManifest, captions, audioSink: htmlAudioSink() }),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="Trigonometry · The sine wave" article={articleText} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
