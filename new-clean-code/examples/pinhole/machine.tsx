import React from "react";
import { createRoot } from "react-dom/client";
import { MachinePage, subscribeMachine, type MachineSnapshot } from "@lessonstudio/machine";
import { resolvePreset } from "@lessonstudio/theme";
// The presentation controls, from the same place the learner page gets them — `useThemeMode`
// persists the choice, so flipping either tab flips this one on its next mount.
import { ThemeToggle, useThemeMode } from "@lessonstudio/web";

/**
 * The machine tab. Subscribes to whatever lesson page is open in this window and draws its
 * statechart; it holds no Session and sends no events, so nothing here can perturb the thing it is
 * watching. Open it beside `index.html` — a second monitor is the intended use.
 */
function MachineApp(): React.ReactElement {
  const [snapshot, setSnapshot] = React.useState<MachineSnapshot | null>(null);
  React.useEffect(() => subscribeMachine(setSnapshot), []);

  const { mode, setMode } = useThemeMode();
  const { theme } = resolvePreset("studio", mode);

  return (
    <MachinePage
      snapshot={snapshot}
      theme={theme}
      learnerUrl="/?teach"
      actions={<ThemeToggle theme={theme} mode={mode} onMode={setMode} />}
    />
  );
}

createRoot(document.getElementById("root")!).render(<MachineApp />);
