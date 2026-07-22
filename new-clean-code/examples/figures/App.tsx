// Browser demo of a custom figure: importing ./figure registers the "orbits"
// figure; the VideoProgram drives its clock and VideoView renders it. The exact
// same figure function rasterizes into mp4 (see figure/render.ts).
import "./figure.js"; // side-effect: registers the "orbits" figure
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defineLesson } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView } from "@lessonkit/render-web";
import { lessonSpec } from "./figure.js";

const lesson = defineLesson(lessonSpec);
function App(): React.ReactElement {
  const program = React.useMemo(() => createVideoProgram(createSession(lesson)), []);
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="theater" eyebrow="Custom figure · any SVG you want" maxStageWidth={620} />;
}
const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
