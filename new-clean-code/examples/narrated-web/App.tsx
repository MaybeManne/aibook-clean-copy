// Narrated photosynthesis explainer — theater layout. Real ElevenLabs audio +
// word-aligned captions from the generated manifest; the reusable VideoView
// provides the aspect-locked stage, caption overlay, and transport controls.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defineLesson } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, htmlAudioSink } from "@lessonkit/render-web";
import { md, text, type RichText } from "@lessonkit/render-contract";
import { preparedSpec, audioManifest, captions } from "./audio.gen.js";

const lesson = defineLesson(preparedSpec);

// running-transcript text per beat so the split layout's right panel is populated
const transcript: Record<string, RichText> = {};
for (const b of preparedSpec.flow) {
  const p = b.params as { narration?: string; text?: string | RichText };
  if (p.narration) transcript[b.id] = md(p.narration);
  else if (p.text != null) transcript[b.id] = typeof p.text === "string" ? text(p.text) : p.text;
}

function App(): React.ReactElement {
  const program = React.useMemo(
    () => createVideoProgram(createSession(lesson), { audio: audioManifest, captions, audioSink: htmlAudioSink() }),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="Biology · Photosynthesis" transcript={transcript} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
