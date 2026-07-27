// Host for the interactive circle-area lesson. Registers the demo figure (a
// declarative, exportable SVG that redraws from the slider value), builds a
// VideoProgram whose session carries the adaptivity policy, and hands it to
// VideoView's split layout with the authored article.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession } from "@lessonkit/lesson";
import { createVideoProgram } from "@lessonkit/video";
import { VideoView, registerFigure } from "@lessonkit/render-web";
import { articleText, lesson, policy } from "./lesson.js";

// The demo visualization: a circle whose size + area label track the `r` control.
// Pure SVG string → renders in the browser AND rasterizes into mp4 export.
registerFigure("circle-area", (props, _t, theme) => {
  const r = Math.max(1, Math.round(Number((props.r as number) ?? 3)));
  const R = 20 + r * 17;
  const cx = 180;
  const cy = 160;
  const acc = theme.color.accent;
  return `<svg viewBox="0 0 360 340" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cg" cx="42%" cy="36%" r="72%">
        <stop offset="0%" stop-color="${theme.color.accentLight}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${acc}" stop-opacity="0.22"/>
      </radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#cg)" stroke="${acc}" stroke-width="2.5"/>
    <line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${theme.color.fg}" stroke-width="1.5" stroke-dasharray="4 3"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="${theme.color.fg}"/>
    <text x="${cx + R / 2}" y="${cy - 9}" fill="${theme.color.fg}" font-size="14" text-anchor="middle" font-family="ui-monospace, monospace">r = ${r}</text>
    <text x="180" y="315" fill="${theme.color.fg}" font-size="24" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-weight="600">A = ${r * r}π</text>
  </svg>`;
});

function App(): React.ReactElement {
  const program = React.useMemo(() => createVideoProgram(createSession(lesson, { policies: [policy] })), []);
  React.useEffect(() => () => program.dispose(), [program]);
  return <VideoView program={program} layout="notebook" eyebrow="Geometry · Circle Area" article={articleText} />;
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
