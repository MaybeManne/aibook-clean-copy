import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonstudio/lesson";
import { createLiveProgram } from "@lessonstudio/live";
import { attachMachineMirror } from "@lessonstudio/machine";
import { StudioView, ThemeToggle, useThemeMode } from "@lessonstudio/web";
import { resolvePreset } from "@lessonstudio/theme";
import { lesson } from "./lesson.js";

function App(): React.ReactElement {
  const program = React.useMemo(() => createLiveProgram(createSession(lesson)), []);
  React.useEffect(() => () => program.dispose(), [program]);
  // Mirror the statechart to `/machine.html` — this lesson has the richer graph of the two.
  React.useEffect(() => attachMachineMirror(program.session), [program]);

  const { mode, setMode } = useThemeMode();
  const { theme, layout } = resolvePreset("studio", mode);

  return (
    <StudioView
      program={program}
      theme={theme}
      layout={layout}
      eyebrow="lessonStudio · convolution"
      placeholder="Ask a question…"
      actions={<ThemeToggle theme={theme} mode={mode} onMode={setMode} />}
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
