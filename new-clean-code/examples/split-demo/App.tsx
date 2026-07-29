// M2 host: mount the split-demo lesson in the clockless live studio, driven by a LiveProgram.
// The layout toggle proves the point-4 decoupling: the SAME lesson re-lays-out when we swap the
// StudioLayout DATA (ratio / side) — zero changes to the lesson spec.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonstudio/lesson";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView } from "@lessonstudio/render-web";
import { defaultStudioLayout, type StudioLayout } from "@lessonstudio/template";
import { lesson } from "./lesson.js";

const LAYOUTS: { id: string; label: string; layout: StudioLayout }[] = [
  { id: "left", label: "Visuals left · 50%", layout: defaultStudioLayout },
  { id: "right", label: "Visuals right · 60%", layout: { split: true, stageBasis: "60%", stageSide: "right" } },
  { id: "single", label: "Single column", layout: { split: false, stageBasis: "0", stageSide: "left" } },
];

function App(): React.ReactElement {
  const program = React.useMemo(() => createLiveProgram(createSession(lesson)), []);
  React.useEffect(() => () => program.dispose(), [program]);
  const [layoutId, setLayoutId] = React.useState("left");
  const layout = LAYOUTS.find((l) => l.id === layoutId)!.layout;

  return (
    <>
      <StudioView
        program={program}
        layout={layout}
        eyebrow="lessonStudio · M2 split-screen"
        placeholder="(live composer — wired in M5)"
      />
      {/* Debug harness: advance non-interactive (explain/scene) beats. A first-class "Continue"
          affordance for the clockless live model is an M5 polish item; this unblocks stepping. */}
      <div style={{ position: "fixed", top: 10, left: 12, zIndex: 10 }}>
        <button
          onClick={() => program.send({ type: "next" })}
          style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, cursor: "pointer", border: "1px solid #334155", background: "rgba(15,23,42,0.8)", color: "#cbd5e1", fontWeight: 600 }}
        >
          Next → (debug)
        </button>
      </div>
      {/* Template switcher — swaps layout DATA only; the lesson is untouched. */}
      <div style={{ position: "fixed", top: 10, right: 12, zIndex: 10, display: "flex", gap: 6 }}>
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayoutId(l.id)}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 8,
              cursor: "pointer",
              border: `1px solid ${layoutId === l.id ? "#818cf8" : "#334155"}`,
              background: layoutId === l.id ? "#818cf8" : "rgba(15,23,42,0.8)",
              color: layoutId === l.id ? "#0b0e1a" : "#cbd5e1",
              fontWeight: 600,
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
