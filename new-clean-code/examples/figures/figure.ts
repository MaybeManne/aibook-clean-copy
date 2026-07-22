// DEMO: adding ANY figure kind, unrelated to the built-in primitives.
// An author registers a name → a pure `(props, t) => <svg string>` function and
// uses it in a scene via `storyboard.viz`. It renders live in the browser AND
// rasterizes into the mp4 export — full creative freedom (paths, gradients,
// filters, trig-driven motion), no relation to rect/circle/ring/etc.
import { registerFigure } from "@lessonkit/scene-svg"; // pure/browser-safe (also re-exported by render-web)
import { animate } from "@lessonkit/lesson";

const palette = ["#7aa2ff", "#a78bfa", "#f472b6", "#5ce1e6", "#ffce54"];

registerFigure("orbits", (_props, t) => {
  const cx = 320, cy = 320, bodies = 5;
  const T = t / 1000;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">`;
  s += `<defs><radialGradient id="halo"><stop offset="0%" stop-color="#7aa2ff" stop-opacity="0.35"/><stop offset="100%" stop-color="#7aa2ff" stop-opacity="0"/></radialGradient>`;
  s += `<filter id="soft"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="230" fill="url(#halo)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="10" fill="#ffce54" filter="url(#soft)"/>`;
  for (let i = 0; i < bodies; i++) {
    const a = T * (0.5 + i * 0.22) + i * 1.3;
    const rx = 55 + i * 46, ry = 38 + i * 30;
    const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#3a3f66" stroke-width="1.5"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${8 + i * 2}" fill="${palette[i]}"/>`;
  }
  return s + `</svg>`;
});

export const lessonSpec = {
  id: "figures-demo",
  version: 1,
  title: "Custom figures",
  flow: [
    animate({
      id: "orbit",
      storyboard: { duration: 6000, stage: { w: 640, h: 640 }, initial: [], tweens: [], viz: { name: "orbits" } },
      slot: "stage",
      next: null,
    }),
  ],
};
