import React from "react";
import { createRoot } from "react-dom/client";
import { MachinePage, subscribeMachine, type MachineSnapshot } from "@lessonstudio/machine";
import { resolvePreset } from "@lessonstudio/theme";
import { ThemeToggle, useThemeMode } from "@lessonstudio/web";

/** The machine tab for the convolution lesson — the richer graph: a guarded `next` into `reteach`,
 *  five explorables whose sliders are self-transitions, and three scenes that only advance. */
function MachineApp(): React.ReactElement {
  const [snapshot, setSnapshot] = React.useState<MachineSnapshot | null>(null);
  React.useEffect(() => subscribeMachine(setSnapshot), []);

  const { mode, setMode } = useThemeMode();
  const { theme } = resolvePreset("studio", mode);

  return (
    <MachinePage
      snapshot={snapshot}
      theme={theme}
      learnerUrl="/"
      actions={<ThemeToggle theme={theme} mode={mode} onMode={setMode} />}
    />
  );
}

createRoot(document.getElementById("root")!).render(<MachineApp />);
