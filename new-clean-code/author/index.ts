// @lessonkit/author — the single-file, fluent authoring layer. Sits ABOVE lesson +
// video + render-web (packages their boilerplate); nothing in the core imports it back,
// so the one-way dependency rule holds. Author a whole lesson in one file:
//
//   import { lesson, plot, slider, md } from "@lessonkit/author";
//   export default lesson("integration", "Integration")
//     .explain("intro", md`# Area under a curve … $\int_a^b f$ …`)
//     .demo("riemann", { viz: plot({ f: x => x*x, x: [0,1], riemann: "n", shade: true }),
//                        controls: { n: slider(1, 50, 4) } })
//     .quiz("check", { prompt: md`$\int_0^1 x^2\,dx=?$`, accept: ["1/3"], skill: "power-rule" })
//     .checkpoint("gate", { skill: "power-rule", onMisconception: "remediate", onMastery: "challenge" });
//
// then: npm run lesson -- path/to/that/file.ts
//
// NOTE: this barrel re-exports `render.ts`, which imports React. A future HEADLESS
// runner should import from "@lessonkit/author/build.js" directly to stay React-free.

export * from "./text.js";
export * from "./controls.js";
export * from "./viz.js";
export * from "./build.js";
export * from "./render.js";
// The fluent storyboard builder, re-exported so authors using `.animate({ build })`
// get the animation verbs (add/fadeIn/moveTo/scaleTo/colorTo/…) from one import.
export { SceneBuilder } from "@lessonkit/video";
