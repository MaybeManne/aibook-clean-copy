// AMC 10A 2023 #15 — "Nested Circles, the 2023π threshold" — the FULL lesson,
// ported from SocraticAI's amc10a_2023_p15 into LessonKit's declarative form.
// Every act, visualization, demo (Gauss pairing + growth chart), the complete
// derivation (ring area → π(4k−1) → Gauss sum → n(2n+1)π → threshold → 64), the
// real KaTeX math, and the interactive gates. Concentric rings (area math is
// identical to the tangent figure, and it reads far more clearly).
import { animate, explain, freeResponse, mcq } from "@lessonkit/lesson";
import { md, text } from "@lessonkit/render-contract";
import type { BeatSpec } from "@lessonkit/lesson";
import type { RenderIntent } from "@lessonkit/render-contract";
import type { SceneNode, Storyboard } from "@lessonkit/timeline";

const STAGE = { w: 640, h: 640 };
const CX = 320;
const BASE = 588; // the shared "common point" at the bottom (tangent-nested)
const S = 32; // px per unit radius (8 circles → r=256, fits above BASE)
const STROKE = "#8f93f0";
const DIM = "#33305a";
const DIMSHADE = "#2b2a4d";
const GOLD = "#ffce54";
const RED = "#f87171";
import type { Gradient } from "@lessonkit/timeline";
const RING_GRAD: Gradient = { from: "#aeb0ff", to: "#5457d6" }; // sheen top→base

const cyc = (r: number): number => BASE - r * S; // center-y of a circle tangent at BASE

// depth layers shared by every figure scene: a soft vignette + a glowing anchor
const vignette: SceneNode = { id: "vig", kind: "circle", x: CX, y: 330, r: 380, gradient: { from: "rgba(122,162,255,0.20)", to: "rgba(122,162,255,0)", radial: true } };
const anchorHalo: SceneNode = { id: "halo", kind: "circle", x: CX, y: BASE, r: 30, gradient: { from: "rgba(255,206,84,0.6)", to: "rgba(255,206,84,0)", radial: true } };
const dot: SceneNode = { id: "dot", kind: "circle", x: CX, y: BASE, r: 6, fill: GOLD, glow: 6 };

// ── scene-node helpers (tangent-nested at BASE; ring k = radii 2k-1 → 2k) ────
const circle = (r: number, opacity = 1, stroke = STROKE): SceneNode =>
  ({ id: `c${r}`, kind: "circle", x: CX, y: cyc(r), r: r * S, fill: "none", stroke, strokeWidth: 2.5, opacity });
const ring = (k: number, opacity = 1, shaded = true): SceneNode =>
  ({ id: `ring${k}`, kind: "ring", x: CX, y: cyc(2 * k), rOuter: 2 * k * S, rInner: (2 * k - 1) * S, innerDy: S, opacity, ...(shaded ? { gradient: RING_GRAD } : { fill: DIMSHADE }) });
const kLabel = (k: number, opacity = 1): SceneNode =>
  ({ id: `k${k}`, kind: "label", x: CX + 2 * k * S - 20, y: cyc(2 * k) - 12, text: text(`${k}`), size: 18, fill: "#e8eaff", opacity });
const areaLabel = (k: number, s: string, opacity = 1, fill = GOLD): SceneNode =>
  ({ id: `a${k}`, kind: "label", x: 470, y: 150 + k * 46, text: text(s), size: 26, fill, opacity });

const fadeIn = (id: string, at: number, dur = 500) =>
  ({ target: id, property: "opacity" as const, from: 0, to: 1, start: at, duration: dur, easing: "easeOut" as const });
const still = (nodes: SceneNode[]): Storyboard => ({ duration: 1, stage: STAGE, initial: nodes, tweens: [] });

/** Depth layers (vignette + anchor) that sit under/over every figure scene. */
const backdrop = (): SceneNode[] => [vignette];
const anchor2 = (): SceneNode[] => [anchorHalo, dot];

/** Accumulated figure: circles 1..c, rings 1..r, optional k-labels; some dimmed. */
function figure(opts: { circles: number; rings: number; kLabels?: boolean; focus?: number; areas?: [number, string][] }): SceneNode[] {
  const nodes: SceneNode[] = [...backdrop()];
  for (let k = 1; k <= opts.rings; k++) nodes.push(ring(k, 1, opts.focus == null || k === opts.focus));
  for (let r = 1; r <= opts.circles; r++) {
    const dimIt = opts.focus != null && r !== 2 * opts.focus && r !== 2 * opts.focus - 1;
    nodes.push(circle(r, 1, dimIt ? DIM : STROKE));
  }
  nodes.push(...anchor2());
  if (opts.kLabels) for (let k = 1; k <= opts.rings; k++) nodes.push(kLabel(k));
  for (const [k, s] of opts.areas ?? []) nodes.push(areaLabel(k, s));
  return nodes;
}

/** A centered-math beat: empty stage, math lines revealed in sequence. */
function mathBeat(p: { id: string; narration: string; lines: string[]; next?: string | null; keep?: SceneNode[] }): BeatSpec {
  const cues = p.lines.map((tex, i) => ({ at: i * 1400, kind: "reveal" as const, intent: { kind: "text", slot: "prose", content: md(tex) } as RenderIntent }));
  const sb: Storyboard = { duration: Math.max(1, (p.lines.length - 1) * 1400), stage: STAGE, initial: p.keep ?? [], tweens: [], cues };
  return animate({ id: p.id, storyboard: sb, slot: "stage", narration: p.narration, ...(p.next !== undefined ? { next: p.next } : {}) });
}

// ════════════════════════════════════════════════════════════════════════════
//  ACT 0 — the problem
// ════════════════════════════════════════════════════════════════════════════
const problem = mathBeat({
  id: "problem",
  narration: "Here's the problem. An even number of circles are nested, sharing a common center, and every other region is shaded. What's the least number of circles so the shaded area reaches two thousand twenty-three pi?",
  lines: [
    "An even number of circles are nested — radii $1, 2, 3, \\dots$ — all sharing a common center. Every other region is shaded, starting between radius $1$ and $2$.",
    "What is the **least number of circles** so the total shaded area is at least $2023\\pi$?",
  ],
});

// ════════════════════════════════════════════════════════════════════════════
//  ACT 1 — building the picture
// ════════════════════════════════════════════════════════════════════════════
const anchor = animate({ id: "anchor", storyboard: { ...still([dot]) }, slot: "stage", narration: "Before a single circle is drawn, one thing exists: a single point. Every circle in this problem touches it — that shared anchor is why the figure works." });

const c1c2: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [dot, circle(1, 0), circle(2, 0), ring(1, 0)],
  tweens: [fadeIn("c1", 0), fadeIn("c2", 700), fadeIn("ring1", 1400, 700)],
};
const first = animate({ id: "first", storyboard: c1c2, slot: "stage", narration: "Circle one, radius one. Then radius two expands outward from the same center. The band between them just lit up — that's ring number one, our first shaded region." });

const c3c4: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [...figure({ circles: 2, rings: 1 }), circle(3, 0), circle(4, 0), ring(2, 0)],
  tweens: [fadeIn("c3", 0), fadeIn("c4", 900), fadeIn("ring2", 1500, 700)],
};
const skip = animate({ id: "skip", storyboard: c3c4, slot: "stage", narration: "Radius three — but no new shading; that gap stays dark. Radius four, and the shading is back. Shade, skip, shade, skip: it alternates with perfect regularity." });

const fillOut: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    ...figure({ circles: 4, rings: 2 }),
    circle(5, 0), circle(6, 0), ring(3, 0), circle(7, 0), circle(8, 0), ring(4, 0),
    kLabel(1, 0), kLabel(2, 0), kLabel(3, 0), kLabel(4, 0),
  ],
  tweens: [
    fadeIn("c5", 0), fadeIn("c6", 300), fadeIn("ring3", 700, 500),
    fadeIn("c7", 1100), fadeIn("c8", 1400), fadeIn("ring4", 1800, 500),
    fadeIn("k1", 2300), fadeIn("k2", 2450), fadeIn("k3", 2600), fadeIn("k4", 2750),
  ],
};
const fill = animate({ id: "fill", storyboard: fillOut, slot: "stage", narration: "Fill out eight circles, arriving in pairs — each pair adds one shaded ring. Eight circles, four rings, labelled k equals one through four. With two-n circles you get exactly n rings. That one-to-two ratio unlocks everything." });

const gatePattern = mcq({
  id: "gate-pattern",
  prompt: md("Which boundaries define the shaded rings?"),
  choices: [
    { text: "Odd → even: (1→2), (3→4), (5→6), …", correct: true },
    { text: "Even → odd: (2→3), (4→5), (6→7), …" },
    { text: "Every ring is shaded" },
    { text: "Only the outermost ring" },
  ],
  correctFeedback: "Exactly — ring k runs from radius 2k−1 to 2k.",
  wrongFeedback: "Look again: the first band is radius 1→2, then it alternates.",
});

// ════════════════════════════════════════════════════════════════════════════
//  ACT 2 — computing one ring's area (focus + subtraction)
// ════════════════════════════════════════════════════════════════════════════
const ringAreaSb: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    ...figure({ circles: 8, rings: 4, focus: 1 }),
    { id: "outer", kind: "label", x: 40, y: 34, text: text("outer:  π·2² = 4π"), size: 24, fill: "#8fe3ff", opacity: 0 } as SceneNode,
    { id: "inner", kind: "label", x: 40, y: 74, text: text("inner:  π·1² = π"), size: 24, fill: RED, opacity: 0 } as SceneNode,
    { id: "disc", kind: "circle", x: CX, y: cyc(1), r: 1 * S, fill: RED, opacity: 0 } as SceneNode,
  ],
  tweens: [
    fadeIn("outer", 200),
    { target: "disc", property: "opacity", from: 0, to: 0.85, start: 900, duration: 400 },
    fadeIn("inner", 1200),
    { target: "disc", property: "opacity", from: 0.85, to: 0, start: 1900, duration: 800 },
    { target: "disc", property: "scale", from: 1, to: 0.2, start: 1900, duration: 800, easing: "easeIn" },
  ],
};
const ringArea = animate({ id: "ringArea", storyboard: ringAreaSb, slot: "stage", narration: "Here's the one move that unlocks everything: a ring is the big circle with the small one punched out. Outer circle, π times two squared, is four pi. Inner circle is one pi. Four pi in, one pi out — watch the inner disc flash red and vanish. What's left is pure ring." });

const gateOuter = freeResponse({
  id: "gate-outer",
  prompt: md("The outer circle has radius $2$. What is $\\pi(2)^2$?"),
  accept: ["4π", "4pi", "4\\pi", "4 pi"],
  hint: "Square the radius first: $2^2 = 4$, then multiply by π.",
  correctFeedback: "Right — the outer area is 4π.",
  onWrong: "recap-area",
});
const recapArea = explain({
  id: "recap-area",
  text: md("Recall the area of a circle: $A = \\pi r^2$. Double the radius and the area **quadruples** — the multipliers $1, 4, 9$ are perfect squares, because area lives in two dimensions."),
  html: `<div style="background:#12101f;border-radius:10px;padding:16px;color:#e8eaff;font-family:system-ui;text-align:center">
    <svg viewBox="0 0 380 140" style="width:100%;max-width:380px">
      <style>@keyframes gg{0%{opacity:0}100%{opacity:1}}.g1{animation:gg .6s .1s both}.g2{animation:gg .6s .9s both}.g3{animation:gg .6s 1.7s both}</style>
      <g class="g1"><circle cx="55" cy="70" r="22" fill="rgba(99,102,241,.5)" stroke="#818cf8"/><text x="55" y="128" fill="#9aa0bf" font-size="13" text-anchor="middle">π</text></g>
      <g class="g2"><circle cx="170" cy="70" r="44" fill="rgba(139,92,246,.45)" stroke="#a78bfa"/><text x="170" y="128" fill="#9aa0bf" font-size="13" text-anchor="middle">4π</text></g>
      <g class="g3"><circle cx="305" cy="70" r="60" fill="rgba(109,40,217,.4)" stroke="#c4b5fd"/><text x="305" y="128" fill="#9aa0bf" font-size="13" text-anchor="middle">9π</text></g>
    </svg></div>`,
  htmlSlot: "stage",
  next: "gate-first-ring",
});
const gateFirstRing = freeResponse({
  id: "gate-first-ring",
  prompt: md("So the first ring's area is $4\\pi - \\pi =$ ?"),
  accept: ["3π", "3pi", "3\\pi", "3 pi"],
  correctFeedback: "Ring 1 = 3π. Now let's generalize.",
});

// ════════════════════════════════════════════════════════════════════════════
//  ACT 3 — the general ring formula (the cancellation)
// ════════════════════════════════════════════════════════════════════════════
const formula = mathBeat({
  id: "formula",
  narration: "What we did for ring one works for every ring. Ring k lives between radii 2k minus 1 and 2k. Outer minus inner. Expand both squares — and brace yourself, because the four-k-squared terms cancel completely. What survives is shockingly simple: pi times four-k minus one. Linear. One formula, infinitely many rings.",
  lines: [
    "$A_k = \\pi(2k)^2 - \\pi(2k-1)^2$",
    "$= \\pi\\bigl[4k^2 - (4k^2 - 4k + 1)\\bigr]$",
    "$= \\pi\\bigl[4k - 1\\bigr]$",
    "$\\boxed{A_k = \\pi(4k - 1)}$",
  ],
});
const gateK2 = freeResponse({ id: "gate-k2", prompt: md("Check it — ring $k=2$: $A_2 = \\pi(4{\\cdot}2-1) =$ ?"), accept: ["7π", "7pi", "7\\pi", "7 pi"], correctFeedback: "7π ✓" });
const gateK3 = freeResponse({ id: "gate-k3", prompt: md("And ring $k=3$: $A_3 = \\pi(4{\\cdot}3-1) =$ ?"), accept: ["11π", "11pi", "11\\pi", "11 pi"], correctFeedback: "11π ✓" });

// ════════════════════════════════════════════════════════════════════════════
//  ACT 4 — spotting the pattern (areas reveal beside the rings)
// ════════════════════════════════════════════════════════════════════════════
const patternSb: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    ...figure({ circles: 8, rings: 4, kLabels: true }),
    areaLabel(1, "3π", 0), areaLabel(2, "7π", 0), areaLabel(3, "11π", 0), areaLabel(4, "15π", 0),
  ],
  tweens: [fadeIn("a1", 300), fadeIn("a2", 1400), fadeIn("a3", 2500), fadeIn("a4", 3600)],
};
const pattern = animate({ id: "pattern", storyboard: patternSb, slot: "stage", narration: "Now watch the four ring areas appear in sequence. Three pi. Seven pi. Eleven pi. Fifteen pi. Something is constant here — every single jump is identical. That's no accident: it's an arithmetic sequence, and it hands us a shortcut." });

const gateDiff = freeResponse({ id: "gate-diff", prompt: md("$7\\pi-3\\pi,\\; 11\\pi-7\\pi,\\; 15\\pi-11\\pi$ — the common difference is ?"), accept: ["4π", "4pi", "4\\pi", "4 pi", "4"], correctFeedback: "A constant 4π step — arithmetic." });
const gateA5 = freeResponse({ id: "gate-a5", prompt: md("Using $A_k=\\pi(4k-1)$, what is $A_5$?"), accept: ["19π", "19pi", "19\\pi", "19 pi"], correctFeedback: "19π ✓" });

// ════════════════════════════════════════════════════════════════════════════
//  ACT 5 — summing all the rings (the Gauss pairing demo)
// ════════════════════════════════════════════════════════════════════════════
const seqRow = (id: string, x: number, s: string, op = 0, fill = "#e8eaff"): SceneNode =>
  ({ id, kind: "label", x, y: 250, text: text(s), size: 30, fill, opacity: op });
const gaussSb: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    { id: "sum", kind: "label", x: 120, y: 150, text: text("S = 3π + 7π + 11π + 15π"), size: 30, fill: "#e8eaff", opacity: 0 } as SceneNode,
    seqRow("t1", 150, "3π"), seqRow("t2", 260, "7π"), seqRow("t3", 370, "11π"), seqRow("t4", 470, "15π"),
    { id: "arc1", kind: "line", x: 168, y: 300, x2: 490, y2: 300, stroke: GOLD, opacity: 0 } as SceneNode,
    { id: "arc2", kind: "line", x: 278, y: 335, x2: 390, y2: 335, stroke: "#8fe3ff", opacity: 0 } as SceneNode,
    { id: "p1", kind: "label", x: 300, y: 380, text: text("= 18π"), size: 26, fill: GOLD, opacity: 0 } as SceneNode,
    { id: "p2", kind: "label", x: 300, y: 420, text: text("= 18π"), size: 26, fill: "#8fe3ff", opacity: 0 } as SceneNode,
  ],
  tweens: [
    fadeIn("sum", 0), fadeIn("t1", 800), fadeIn("t2", 1000), fadeIn("t3", 1200), fadeIn("t4", 1400),
    fadeIn("arc1", 2000), fadeIn("p1", 2400), fadeIn("arc2", 3000), fadeIn("p2", 3400),
  ],
};
const summing = animate({ id: "summing", storyboard: gaussSb, slot: "stage", narration: "We need to add all the ring areas. Here's Gauss's trick, so elegant it feels like cheating: pair the first term with the last. Three pi meets fifteen pi — eighteen pi. Seven pi meets eleven pi — eighteen pi again. Every pair sums to the same thing." });

const sumResult = mathBeat({
  id: "sum-result",
  narration: "Two pairs, each eighteen pi. In general there are n over two pairs, so two S equals n times four-n plus two, all times pi. Divide by two, factor — and the total shaded area compresses into something gorgeous: pi times n times two-n plus one.",
  lines: [
    "$2S = n(4n+2)\\pi$",
    "$S = \\tfrac{n}{2}(4n+2)\\pi$",
    "$\\boxed{\\text{Total} = \\pi \\cdot n(2n+1)}$",
  ],
});
const gateSum = freeResponse({ id: "gate-sum", prompt: md("Sanity check, $n=4$: $\\pi\\cdot 4(2{\\cdot}4+1) = \\pi\\cdot 4\\times$ ?"), accept: ["9", "9π", "9pi"], correctFeedback: "4×9 = 36π ✓" });

// ════════════════════════════════════════════════════════════════════════════
//  ACT 6 — crossing the threshold
// ════════════════════════════════════════════════════════════════════════════
const threshold = mathBeat({
  id: "threshold",
  narration: "Now we point our weapon at the target. When does n times two-n plus one first crack two thousand twenty-three? Ignore the small stuff: two n squared is about 2023, so n is about thirty-one point eight. We test thirty-one and thirty-two. n equals 31 gives 31 times 63, that's 1953 — agonizingly close, but under. n equals 32 gives 32 times 65, that's 2080. We're over! And circles equal two-n, so the answer is sixty-four.",
  lines: [
    "$n(2n+1) \\geq 2023$",
    "$n \\approx \\sqrt{2023/2} \\approx 31.8$",
    "$n=31:\\; 31\\times 63 = 1953 \\;<\\; 2023$",
    "$n=32:\\; 32\\times 65 = 2080 \\;\\geq\\; 2023$",
    "$n = 32 \\Rightarrow 2n = \\boxed{64}\\text{ circles}$",
  ],
});
const gateThreshold = freeResponse({ id: "gate-threshold", prompt: md("Confirm: $32\\times(2{\\cdot}32+1) = 32\\times$ ?"), accept: ["65"], correctFeedback: "32×65 = 2080 ✓" });

// ════════════════════════════════════════════════════════════════════════════
//  ACT 7 — visualising the growth (the chart demo)
// ════════════════════════════════════════════════════════════════════════════
const AX = 90, AY = 560, AXR = 590, AYT = 90; // axes box
const cx = (c: number) => AX + (c / 64) * (AXR - AX);
const cy = (area: number) => AY - (area / 2080) * (AY - AYT);
const curveDot = (c: number, op = 0): SceneNode => {
  const n = c / 2;
  return { id: `g${c}`, kind: "circle", x: cx(c), y: cy(n * (2 * n + 1)), r: 6, fill: STROKE, opacity: op };
};
const growthSb: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    { id: "xax", kind: "line", x: AX, y: AY, x2: AXR, y2: AY, stroke: "#5a5f85" } as SceneNode,
    { id: "yax", kind: "line", x: AX, y: AY, x2: AX, y2: AYT, stroke: "#5a5f85" } as SceneNode,
    { id: "thr", kind: "line", x: AX, y: cy(2023), x2: AXR, y2: cy(2023), stroke: GOLD, opacity: 0 } as SceneNode,
    { id: "thrlbl", kind: "label", x: AXR - 120, y: cy(2023) - 34, text: text("2023π"), size: 22, fill: GOLD, opacity: 0 } as SceneNode,
    { id: "xlbl", kind: "label", x: AXR - 90, y: AY + 12, text: text("circles"), size: 18, fill: "#9aa0bf" } as SceneNode,
    ...[8, 16, 24, 32, 40, 48, 56, 64].map((c) => curveDot(c)),
    { id: "cross", kind: "circle", x: cx(64), y: cy(2080), r: 11, fill: RED, opacity: 0 } as SceneNode,
    { id: "crosslbl", kind: "label", x: 360, y: cy(2080) + 26, text: text("64 → 2080π"), size: 22, fill: RED, opacity: 0 } as SceneNode,
  ],
  tweens: [
    fadeIn("thr", 200), fadeIn("thrlbl", 400),
    ...[8, 16, 24, 32, 40, 48, 56, 64].map((c, i) => fadeIn(`g${c}`, 800 + i * 320, 300)),
    fadeIn("cross", 3600), fadeIn("crosslbl", 3900),
  ],
};
const growth = animate({ id: "growth", storyboard: growthSb, slot: "stage", narration: "Here's the whole story in one chart. That gold line is the enemy: two thousand twenty-three pi. Our shaded-area curve starts below it, climbs, and climbs — and at exactly sixty-four circles it punches clean through. Two thousand eighty pi, beating the target with fifty-seven pi to spare." });

// ════════════════════════════════════════════════════════════════════════════
//  ACT 8 — the answer
// ════════════════════════════════════════════════════════════════════════════
const finalSb: Storyboard = {
  duration: 1, stage: STAGE,
  initial: [
    ...figure({ circles: 8, rings: 4 }),
    { id: "ans", kind: "label", x: 200, y: 40, text: text("64 circles"), size: 44, fill: GOLD, opacity: 0 } as SceneNode,
    { id: "sub", kind: "label", x: 210, y: 600, text: text("32 rings · 2080π"), size: 26, fill: "#e8eaff", opacity: 0 } as SceneNode,
  ],
  tweens: [fadeIn("ans", 300, 700), fadeIn("sub", 1200, 700)],
};
const finale = animate({ id: "finale", storyboard: finalSb, slot: "stage", narration: "Sixty-four circles. Thirty-two rings. Two thousand eighty pi — we didn't just cross the threshold, we cleared it cleanly. The answer is sixty-four.", next: null });

export const lessonSpec = {
  id: "amc-nested-circles",
  version: 1,
  title: "Nested Circles — the 2023π threshold",
  flow: [
    problem,
    anchor, first, skip, fill, gatePattern,
    ringArea, gateOuter, gateFirstRing,
    formula, gateK2, gateK3,
    pattern, gateDiff, gateA5,
    summing, sumResult, gateSum,
    threshold, gateThreshold,
    growth,
    finale,
    recapArea, // detour target (reached only on a wrong outer-area answer)
  ],
};
