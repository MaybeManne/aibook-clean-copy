// Browser entry: `npm run dev` serves this; click through the lesson.
import React from "react";
import { createRoot } from "react-dom/client";
import { TemplateView, defaultTemplate } from "@lessonkit/render-web";
import { photosynthesis } from "./lesson.js";
import { useSession } from "./useSession.js";

function App(): React.ReactElement {
  const { model, send, done, activeBeatId } = useSession(photosynthesis);
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", minHeight: "100vh" }}>
      <TemplateView model={model} template={defaultTemplate} send={send} />
      {!done && activeBeatId !== "q1" ? (
        <div style={{ padding: 24 }}>
          <button onClick={() => send({ type: "next" })}>Next →</button>
        </div>
      ) : null}
      {done ? <div style={{ padding: 24, color: "#9aa0bf" }}>Lesson complete.</div> : null}
    </div>
  );
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
