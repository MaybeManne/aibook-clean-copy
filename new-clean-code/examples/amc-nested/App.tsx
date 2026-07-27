// AMC nested-circles presentation. The whole host is now this: build a
// VideoProgram over the (narration-prepared) lesson and hand it to VideoView's
// notebook layout. Real ElevenLabs audio + word-aligned captions come from the
// generated manifest; transport, scrolling, persistent stage, and caption overlay
// all live in the reusable video layer + chrome.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defineLesson } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, htmlAudioSink } from "@lessonkit/render-web";
import { md, text, type RichText } from "@lessonkit/render-contract";
import { preparedSpec, audioManifest, captions } from "./audio.gen.js";

const lesson = defineLesson(preparedSpec);

// running-transcript text per beat (narration for scenes, prose for explains)
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
  return <VideoView program={program} layout="notebook" eyebrow="AMC 10A 2023 #15 · Nested Circles" transcript={transcript} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
