// M4 host: the discrete-convolution lesson (3b1b SimpleExample) in the clockless live studio.
// Scene beats (flip/slide) play their storyboards on entry via SceneView's rAF clock; the
// explorable gate waits for the learner. Advancing a non-interactive beat is now StudioView's
// derived Continue affordance, so the old debug "Next →" harness is gone.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonstudio/lesson";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView } from "@lessonstudio/render-web";
import { defaultStudioLayout } from "@lessonstudio/template";
import { lesson } from "./lesson.js";

function App(): React.ReactElement {
  const program = React.useMemo(() => createLiveProgram(createSession(lesson)), []);
  React.useEffect(() => () => program.dispose(), [program]);

  return (
    <StudioView
      program={program}
      layout={defaultStudioLayout}
      eyebrow="lessonStudio · convolution"
      placeholder="(live composer — wired in M5)"
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
