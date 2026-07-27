// A COMPLETE interactive lesson in one file, authored with @lessonkit/author.
// Run it silent:   npm run lesson -- examples/integration.lesson.ts
// Run it narrated:  npm run lesson -- examples/integration.lesson.ts --audio   (real ElevenLabs TTS)
// Switch layout at render time (no rebuild): open the same server on  ?layout=theater
//
// It shows the whole single-file authoring story: prose with natural KaTeX (md``),
// spoken narration (.narrate / the `narration` opt), clock-driven animated scenes
// (.animate — the function drawing itself with its area filling in, then the Riemann
// rectangles building up), an inline plot() viz with a live slider, a fill-in gate,
// and an adaptive checkpoint that routes a wrong answer to a NARRATED remediation and
// a mastered one to a challenge. No App.tsx, no index.html, no registerFigure, no
// magic strings — and the SAME file renders silent or narrated, notebook or theater.

import { lesson, plot, slider, md, text } from "@lessonkit/author";

// Plot geometry shared by the animated scenes: data x∈[0,1] mapped into the 640×420 stage.
const px = (t: number) => 80 + t * 520; // x=0 → 80px, x=1 → 600px
const py = (v: number) => 360 - v * 300; // baseline (v=0) at 360px, v=1 at 60px
const STAGE = { w: 640, h: 420 };
// The parabola y=x² sampled as points, then as an SVG polyline (node at origin).
const curvePts = Array.from({ length: 21 }, (_, i) => i / 20).map((t) => [px(t), py(t * t)] as const);
const curve = curvePts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
// Polyline length — lets the draw-on reveal use an export-safe absolute dash.
const curveLen = curvePts.reduce((L, p, i) => (i ? L + Math.hypot(p[0] - curvePts[i - 1]![0], p[1] - curvePts[i - 1]![1]) : 0), 0);
// The filled region under the curve (curve, down to the x-axis, closed) — the integral.
const areaPath =
  "M " + curvePts.map(([x, y], i) => `${i === 0 ? "" : "L "}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + ` L ${px(1).toFixed(1)} ${py(0).toFixed(1)} Z`;
const SLICES = 8;
const dx = 1 / SLICES;

export default lesson("integration", "Integration — area under a curve", "Calculus · Integration")
  .animate("intro", {
    stage: STAGE,
    build: (s) => {
      // Axes are present from the first frame (they frame the empty stage on load).
      s.add({ id: "yaxis", kind: "line", x: px(0), y: py(1), x2: px(0), y2: py(0), stroke: "#5b6180" })
        .add({ id: "xaxis", kind: "line", x: px(0), y: py(0), x2: px(1), y2: py(0), stroke: "#5b6180" });
      // The shaded area under the curve — the integral — fills in AFTER the curve is drawn.
      // Added before the curve so it renders behind the stroke.
      s.add({ id: "area", kind: "path", x: 0, y: 0, d: areaPath, fill: "rgba(91,140,255,0.30)", opacity: 0 }).fadeIn("area", 2400, 900);
      // The function y=x² literally draws itself, left → right.
      s.add({ id: "curve", kind: "path", x: 0, y: 0, d: curve, stroke: "#ffd479", strokeWidth: 3, draw: 0, len: curveLen }).drawOn("curve", 500, 1900);
      // Labels: the function, then the integral notation over the shaded region.
      s.add({ id: "flabel", kind: "label", x: 470, y: 118, text: text("f(x) = x²"), size: 24, fill: "#ffd479", opacity: 0 }).fadeIn("flabel", 1600, 500);
      s.add({ id: "intlabel", kind: "label", x: 250, y: 322, text: text("∫₀¹ f(x) dx"), size: 24, fill: "#e8eaff", opacity: 0 }).fadeIn("intlabel", 3000, 600);
    },
    narration:
      "Here is a function, f of x. The definite integral — written as the integral from a to b of f of x, dee x — " +
      "is the signed area between the curve and the x axis: the shaded region filling in here beneath the parabola.",
    note: md`# Area under a curve
The definite integral $\int_a^b f(x)\,dx$ is the **signed area** between $f$ and the $x$-axis — the shaded region under the curve.
When we can't find it exactly, we *approximate* it — slice the region into thin rectangles and add them up. That's a **Riemann sum**.`,
  })

  .animate("build-up", {
    stage: STAGE,
    build: (s) => {
      // axes
      s.add({ id: "yaxis", kind: "line", x: px(0), y: py(1), x2: px(0), y2: py(0), stroke: "#5b6180" })
        .add({ id: "xaxis", kind: "line", x: px(0), y: py(0), x2: px(1), y2: py(0), stroke: "#5b6180" });
      // midpoint rectangles under y=x², faded in one at a time (left → right)
      for (let i = 0; i < SLICES; i++) {
        const mid = (i + 0.5) * dx;
        const h = mid * mid; // f(mid)
        const top = py(h);
        s.add({
          id: `bar${i}`,
          kind: "rect",
          x: px(i * dx),
          y: top,
          w: px(dx) - px(0) - 3,
          h: py(0) - top,
          fill: "rgba(91,140,255,0.55)",
          opacity: 0,
        }).fadeIn(`bar${i}`, i * 220, 340);
      }
      // the true curve draws over the bars, then the running-sum label
      s.add({ id: "curve", kind: "path", x: 0, y: 0, d: curve, stroke: "#ffd479", strokeWidth: 3, opacity: 0 })
        .fadeIn("curve", SLICES * 220, 500);
      s.add({ id: "sum", kind: "label", x: 300, y: 90, text: text("Σ f(xᵢ)·Δx  →  ∫₀¹ x² dx"), size: 24, fill: "#e8eaff", opacity: 0 })
        .fadeIn("sum", SLICES * 220 + 300, 500);
    },
    narration:
      "Watch as we lay down rectangles under the curve, left to right. " +
      "Each rectangle's height is the function at its midpoint, and together their areas fill in the region beneath the parabola — that sum is the integral.",
    note: md`## Building the sum
Each rectangle's height is $f$ at its midpoint; laid side by side they tile the region under $y = x^2$.
Their total area is the Riemann estimate $\Sigma$ — and as the slices get thinner it becomes the exact integral $\int_0^1 x^2\,dx$.`,
  })

  .demo("riemann", {
    viz: plot({ f: (x) => x * x, x: [0, 1], riemann: "n", method: "mid", shade: true }),
    controls: { n: slider(1, 60, 4, { label: "rectangles n" }) },
    note: md`## Play with it
Drag **n**. Each rectangle's height is $f$ at its midpoint; their total area is the estimate $\Sigma$.
- with few rectangles the estimate is coarse
- as $n$ grows, $\Sigma \to$ the true area $\int_0^1 x^2\,dx = \tfrac13$
> [tip] Watch the readout: $\Sigma$ closes in on $\int = 0.3333$ as you slide.`,
  })
  .narrate("Now try it yourself. Drag the slider to add more rectangles, and watch the estimate close in on one third.")

  .quiz("check", {
    prompt: md`Using the power rule, what is $\int_0^1 x^2\,dx$?`,
    accept: ["1/3", "0.333", "0.3333", "0.33"],
    skill: "power-rule",
    misconception: "no-antiderivative",
    correctFeedback: "Exactly — $\\int x^2\\,dx = x^3/3$, and $1^3/3 - 0 = 1/3$.",
    wrongFeedback: "Recall the power rule: $\\int x^n\\,dx = x^{n+1}/(n+1)$.",
  })

  .checkpoint("gate", { skill: "power-rule", onMisconception: "remediate", onMastery: "challenge" })

  .explain(
    "remediate",
    md`## Let's revisit the power rule
To integrate a power, raise the exponent by one and divide:
$$\int x^n\,dx = \frac{x^{n+1}}{n+1}$$
So $\int x^2\,dx = x^3/3$, and from $0$ to $1$ that is $\tfrac13$. Slide the demo again and watch $\Sigma$ land there.`,
    { next: "recap" },
  )
  .narrate(
    "Let's revisit the power rule. To integrate a power, raise the exponent by one and divide by the new exponent. " +
      "So the integral of x squared is x cubed over three, and evaluated from zero to one, that gives one third. " +
      "Slide the demo again and watch the sum land right there.",
  )

  .explain(
    "challenge",
    md`## Challenge
You've got the power rule. Predict this one *before* computing it:
$$\int_0^1 x^3\,dx = \;?$$
> [note] $x^{3+1}/(3+1) = x^4/4$, so the area is $\tfrac14$.`,
    { next: "recap" },
  )
  .narrate(
    "You've got the power rule. Predict this one before computing it: the integral from zero to one of x cubed. " +
      "Raise the exponent to four and divide by four, so the area is one quarter.",
  )

  .explain(
    "recap",
    md`# Recap
- The integral is the **signed area** under $f$.
- A Riemann sum with $n$ rectangles approaches it as $n \to \infty$.
- The power rule gives $\int_0^1 x^2\,dx = \tfrac13$.
Nice work.`,
    { next: null },
  )
  .narrate(
    "To recap: the integral is the signed area under the curve, a Riemann sum with more rectangles converges to it, " +
      "and the power rule gives one third. Nice work.",
  );
