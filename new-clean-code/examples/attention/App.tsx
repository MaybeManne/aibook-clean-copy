// Host for "Attention, felt". Importing ./viz registers the canvas visualization;
// the session carries BOTH the settled-state policy AND a generatingRunner (fake
// author standing in for an LLM) so the "Explain this token ✨" button generates a
// bespoke beat live. VideoView's notebook layout puts the persistent beam diagram
// beside the reader.
import "katex/dist/katex.min.css";
import "./viz.js"; // registerViz("attention", …)
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defaultRunner, generatingRunner } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView } from "@lessonkit/render-web";
import { articleText, fakeAuthor, lesson, policy } from "./lesson.js";

function App(): React.ReactElement {
  const program = React.useMemo(
    () => createVideoProgram(createSession(lesson, { runner: generatingRunner(fakeAuthor, defaultRunner()), policies: [policy] })),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="ML Internals · Attention" article={articleText} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
