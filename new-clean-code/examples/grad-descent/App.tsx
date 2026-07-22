// Host for the gradient-descent playground. Importing ./viz registers the canvas
// visualization (side effect); the session carries the settled-state adaptivity
// policy; the demo beat's authored route handles the viz's real-time divergence
// signal. VideoView's notebook layout puts the persistent 3D viz beside the reader.
import "katex/dist/katex.min.css";
import "./viz.js"; // registerViz("grad-descent", …)
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView } from "@lessonkit/render-web";
import { articleText, lesson, policy } from "./lesson.js";

function App(): React.ReactElement {
  const program = React.useMemo(() => createVideoProgram(createSession(lesson, { policies: [policy] })), []);
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="ML Internals · Gradient Descent" article={articleText} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
