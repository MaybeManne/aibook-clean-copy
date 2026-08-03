import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defaultRunner } from "@lessonstudio/lesson";
import { directingRunner, httpToolCompleter, pickDirector } from "@lessonstudio/forge";
import { attachTeachClient } from "@lessonstudio/teach";
import { attachMachineMirror } from "@lessonstudio/machine";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView, ThemeToggle, useThemeMode } from "@lessonstudio/web";
import { resolvePreset } from "@lessonstudio/theme";
import { md } from "@lessonstudio/intents";
import { symbolColors, tex } from "./palette.js";
import { lesson } from "./lesson.js";
import { PINHOLE_VIZ_SCHEMA } from "./pinhole3d.js";
import { nativeVoice, PINHOLE_BRIEF, pinholeSilence } from "./tutor.js";

const director = nativeVoice(
  pickDirector({
    complete: httpToolCompleter("/api/direct", { provider: "auto" }),
    brief: PINHOLE_BRIEF,
    onWarn: (message) => console.warn(`[tutor] ${message}`),
  }),
);

function App(): React.ReactElement {
  const program = React.useMemo(
    () =>
      createLiveProgram(
        createSession(lesson, {
          runner: directingRunner(director, {
            base: defaultRunner(),
            onSilence: pinholeSilence,
            visuals: PINHOLE_VIZ_SCHEMA,
          }),
        }),
      ),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);

  // Mirror the statechart to any `/machine.html` tab in this window. One-way and unconditional:
  // publishing costs a JSON projection per step, and a page that has to be enabled is a page nobody
  // remembers exists when a lesson starts behaving strangely.
  React.useEffect(() => attachMachineMirror(program.session), [program]);

  React.useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("teach")) return;
    const client = attachTeachClient(program.session);
    return () => client.detach();
  }, [program]);

  const { mode, setMode } = useThemeMode();
  const { theme } = resolvePreset("studio", mode);

  return (
    <StudioView
      program={program}
      theme={theme}
      // A wider stage than the studio default: this lesson's apparatus is the point.
      layout={{ split: true, stageBasis: "56%", stageSide: "left" }}
      eyebrow="lessonStudio · pinhole camera"
      title={md(
        `A matte wall shows no image. A pinhole shows a sharp, inverted one of height ` +
          `$${tex("hp")} = ${tex("h")}\\,${tex("v")}/${tex("u")}$. Why?`,
      )}
      placeholder="Ask about the apparatus…"
      // The lesson's symbol key, resolved for this mode — the coloured TeX above reads it as CSS.
      symbolColors={symbolColors(mode)}
      actions={<ThemeToggle theme={theme} mode={mode} onMode={setMode} />}
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
