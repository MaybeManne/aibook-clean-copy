// The SMARTER free-session tutor: one learner question → a whole VIDEO-LIKE SEGMENT.
//
// Where `plan.ts` authors ONE act (prose, or an explorable+iframe) that rejoins `home`,
// this author writes a short lesson on the fly: N explanation STEPS — each with a written
// write-up, a separately-worded SPOKEN narration, and an optional visual (a self-contained
// sandbox figure OR a declarative animated storyboard) — then a graded EXERCISE (mcq /
// free-response). Every step + the exercise are spliced as ONE atomic authoring turn and
// render INLINE in the scrolling conversation (StudioView), persisting as the learner
// presses Continue. The left workspace mirrors the active step.
//
// WHY a custom LessonAuthor and not `pickAuthor` (as `plan.ts` uses): `pickAuthor`/`claudeAuthor`
// wrap a single-beat `AuthorPlan` and can only ever emit ONE `BeatSpec`. A segment is a CHAIN of
// beats, so we author it as `AuthoringCommand[]` — `generatingRunner` sends those as one
// `authoring.command` event, which `Session.applyAuthoring` splices atomically and records, so
// replay reconstructs the whole segment from history as DATA (generate → freeze → replay).
// `plan.ts` is deliberately LEFT UNTOUCHED as the tested single-act fallback (its `run.ts`
// acceptance stays green); this module is wired only into `App.tsx` (the browser default).
//
// WIRE FORMAT — Markdown, LaTeX-safe, multi-section (see SEGMENT_SYSTEM). Prose + narration are
// plain Markdown (so `$\sum$`/`$\frac{}{}$` never break a parse — the failure that killed the
// JSON contract in `plan.ts`); the ONLY JSON is a `storyboard` block (geometry/timing, no
// backslashes) where JSON is safe. `parseSegment` is LENIENT — it never throws; a prose-only
// step is valid, a malformed storyboard is caught and degraded to a title-card. The offline
// router emits the SAME wire text a live model would (via `encodeSegment`), so no-key browsers
// and headless tests travel the exact `parseSegment` → `segmentToCommands` path a live model does.

import {
  type AuthoringCommand,
  type BeatSpec,
  type Completer,
  type GenerateRequest,
  type LessonAuthor,
} from "@lessonkit/lesson";
import type { Json } from "@lessonkit/state-machine";
import type { Storyboard } from "@lessonkit/timeline";
import { text } from "@lessonkit/render-contract";

// ─────────────────────────────────────────────────────────────────────────────
// Parsed shapes (the pure intermediate between the wire text and the beat chain)
// ─────────────────────────────────────────────────────────────────────────────

/** One explanation step: written prose (shown), a spoken script (narrated — may DIFFER),
 *  and AT MOST one visual — self-contained `html` OR a declarative `storyboard`. */
export interface SegStep {
  title: string;
  written: string;
  narration: string;
  html?: string;
  storyboard?: Storyboard;
}

export interface McqChoice {
  text: string;
  correct?: boolean;
  misconception?: string;
}

/** A graded check. `mcq` grades a choice; `free` matches normalized text. */
export type SegExercise =
  | { kind: "mcq"; prompt: string; choices: McqChoice[]; skill?: string; correctFeedback?: string; wrongFeedback?: string }
  | { kind: "free"; prompt: string; accept: string[]; skill?: string; correctFeedback?: string; wrongFeedback?: string };

export interface ParsedSegment {
  steps: SegStep[];
  exercise?: SegExercise;
}

// ─────────────────────────────────────────────────────────────────────────────
// System prompt — the closed contract a live model writes to
// ─────────────────────────────────────────────────────────────────────────────

export const SEGMENT_SYSTEM =
  `You are a warm, precise tutor. Turn the learner's question into a SHORT video-like segment: ` +
  `2–4 explanation steps, then ONE graded exercise. Reply in EXACTLY this Markdown shape (no ` +
  `preamble, no JSON wrapper):\n\n` +
  `## Step: <short title>\n` +
  `<written explanation — Markdown, use $inline$/$$display$$ KaTeX for math. 1–3 tight sentences.>\n\n` +
  `> narrate: <the SPOKEN script for this step — a natural, conversational voiceover. It may ` +
  `differ from the written text; write it to be HEARD, not read. Plain prose, no math symbols.>\n\n` +
  "Optionally append ONE visual for the step — EITHER a self-contained figure/demo:\n" +
  "```html\n<!doctype html> … inline <style>/<svg>/<canvas>/<script> only, no network …\n```\n" +
  "OR a declarative animated scene (pure JSON, geometry + timed tweens, PLAIN-TEXT labels — no " +
  "LaTeX in a storyboard):\n" +
  "```storyboard\n{ \"duration\": 2000, \"stage\": {\"w\":640,\"h\":360}, \"initial\": [ …SceneNode… ], \"tweens\": [ …Tween… ] }\n```\n\n" +
  `Repeat the "## Step:" block for each step. THEN close with exactly one exercise:\n\n` +
  `## Exercise\n` +
  `> type: mcq   (or: free)\n` +
  `<the question — Markdown + $KaTeX$ ok>\n` +
  `- [x] the correct choice\n` +
  `- a wrong choice (misconception: short-slug)\n` +
  `- another wrong choice\n\n` +
  `For a free-response exercise use "> type: free" and "> accept: answer one, answer two" instead ` +
  `of choices. Keep everything self-contained; put math in PROSE (KaTeX) or an html <svg>, never ` +
  `in a storyboard label.`;

// ─────────────────────────────────────────────────────────────────────────────
// Parsing — lenient, fence-aware, never throws
// ─────────────────────────────────────────────────────────────────────────────

interface RawSection {
  header: string;
  body: string;
}

/** Split on top-level `## ` headers, IGNORING any `##` that appears inside a fenced block
 *  (an html/storyboard body may contain `##`). Text before the first header is dropped. */
function splitSections(raw: string): RawSection[] {
  const out: RawSection[] = [];
  let cur: { header: string; lines: string[] } | null = null;
  let inFence = false;
  for (const line of raw.split(/\r?\n/)) {
    if (/^```/.test(line)) inFence = !inFence;
    const m = !inFence ? /^##\s+(.*)$/.exec(line) : null;
    if (m) {
      if (cur) out.push({ header: cur.header, body: cur.lines.join("\n") });
      cur = { header: (m[1] ?? "").trim(), lines: [] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) out.push({ header: cur.header, body: cur.lines.join("\n") });
  return out;
}

/** Pull the FIRST visual out of a step body: a ```storyboard JSON block (parsed, malformed →
 *  ignored) or the first fenced block whose body is markup (`startsWith("<")` — content, not
 *  tag, decides, exactly like `plan.ts`'s parseAct). Returns the visual + the body with it removed. */
function liftVisual(body: string): { rest: string; html?: string; storyboard?: Storyboard } {
  const fenceRe = /```([a-zA-Z0-9]*)[ \t]*\r?\n?([\s\S]*?)```/g;
  for (let m = fenceRe.exec(body); m; m = fenceRe.exec(body)) {
    const tag = (m[1] ?? "").toLowerCase();
    const inner = (m[2] ?? "").trim();
    if (tag === "storyboard") {
      try {
        const sb = JSON.parse(inner) as Storyboard;
        if (sb && Array.isArray(sb.initial)) return { rest: body.replace(m[0], "").trim(), storyboard: sb };
      } catch {
        /* malformed storyboard JSON → leave it in prose, degrade to a title-card later */
      }
      continue;
    }
    if (inner.startsWith("<")) return { rest: body.replace(m[0], "").trim(), html: inner };
  }
  return { rest: body.trim() };
}

/** A `> narrate:` line → the spoken script; the remaining lines → the written prose. */
function liftNarration(body: string): { written: string; narration: string } {
  const kept: string[] = [];
  const spoken: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = /^>\s*narrate:\s*(.*)$/i.exec(line);
    if (m) spoken.push((m[1] ?? "").trim());
    else kept.push(line);
  }
  return { written: kept.join("\n").trim(), narration: spoken.join(" ").trim() };
}

function stripHeaderPrefix(header: string): string {
  return header.replace(/^(step|demo)\s*:?\s*/i, "").trim();
}

function parseStep(section: RawSection): SegStep {
  const { rest, html, storyboard } = liftVisual(section.body);
  const { written, narration } = liftNarration(rest);
  const title = stripHeaderPrefix(section.header) || "Step";
  return { title, written, narration, html, storyboard };
}

function parseExercise(section: RawSection): SegExercise {
  const lines = section.body.split(/\r?\n/);
  let kind: "mcq" | "free" = "mcq";
  let skill: string | undefined;
  let accept: string[] = [];
  const choices: McqChoice[] = [];
  const promptLines: string[] = [];
  for (const line of lines) {
    let m: RegExpExecArray | null;
    if ((m = /^>\s*type:\s*(mcq|free\w*)/i.exec(line))) {
      kind = /^free/i.test(m[1] ?? "") ? "free" : "mcq";
    } else if ((m = /^>\s*accept:\s*(.*)$/i.exec(line))) {
      accept = (m[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    } else if ((m = /^>\s*skill:\s*(.*)$/i.exec(line))) {
      skill = (m[1] ?? "").trim() || undefined;
    } else if ((m = /^\s*-\s+(\[[ xX]\]\s*)?(.*)$/.exec(line))) {
      const correct = /\[[xX]\]/.test(m[1] ?? "");
      let choiceText = (m[2] ?? "").trim();
      const mis = /\(misconception:\s*([^)]+)\)\s*$/i.exec(choiceText);
      const misconception = mis ? mis[1]?.trim() : undefined;
      if (mis) choiceText = choiceText.replace(mis[0], "").trim();
      if (choiceText) choices.push({ text: choiceText, correct: correct || undefined, misconception });
    } else if (line.trim()) {
      promptLines.push(line);
    }
  }
  const prompt = promptLines.join("\n").trim() || "Quick check:";
  if (kind === "free") return { kind: "free", prompt, accept: accept.length ? accept : ["ok"], skill };
  // mcq: guarantee at least one correct choice so the beat is answerable.
  const safeChoices = choices.length ? choices : [{ text: "Yes", correct: true }, { text: "No" }];
  if (!safeChoices.some((c) => c.correct)) safeChoices[0]!.correct = true;
  return { kind: "mcq", prompt, choices: safeChoices, skill };
}

/** Decode wire text → a segment. LENIENT: never throws; unknown sections are ignored, a
 *  bare-prose step is valid, a missing/blank exercise is fine (omitted). */
export function parseSegment(raw: string): ParsedSegment {
  const sections = splitSections(raw.trim());
  const steps: SegStep[] = [];
  let exercise: SegExercise | undefined;
  for (const s of sections) {
    if (/^exercise/i.test(s.header)) exercise = parseExercise(s);
    else steps.push(parseStep(s));
  }
  return { steps, exercise };
}

/** Encode a segment back to the wire format — the offline router uses this so no-key/test runs
 *  travel the exact same `parseSegment` path a live model's text does (no author divergence). */
export function encodeSegment(seg: ParsedSegment): string {
  const parts: string[] = [];
  for (const s of seg.steps) {
    let block = `## Step: ${s.title}\n${s.written}`;
    if (s.narration) block += `\n\n> narrate: ${s.narration}`;
    if (s.html) block += `\n\n\`\`\`html\n${s.html}\n\`\`\``;
    else if (s.storyboard) block += `\n\n\`\`\`storyboard\n${JSON.stringify(s.storyboard)}\n\`\`\``;
    parts.push(block);
  }
  const ex = seg.exercise;
  if (ex) {
    let block = `## Exercise\n> type: ${ex.kind}`;
    if (ex.skill) block += `\n> skill: ${ex.skill}`;
    if (ex.kind === "free") block += `\n> accept: ${ex.accept.join(", ")}\n${ex.prompt}`;
    else {
      block += `\n${ex.prompt}`;
      for (const c of ex.choices) {
        const mark = c.correct ? "[x] " : "";
        const mis = c.misconception ? ` (misconception: ${c.misconception})` : "";
        block += `\n- ${mark}${c.text}${mis}`;
      }
    }
    parts.push(block);
  }
  return parts.join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment → authoring commands (the TAIL-FIRST / reverse-order splice recipe)
// ─────────────────────────────────────────────────────────────────────────────

const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };

/** A minimal declarative title-card, used when a step declares no visual — so every step is an
 *  `explorable` with a viz + a Continue button (a prose-only `explain` renders no Continue). */
function titleCard(title: string): Storyboard {
  return {
    duration: 900,
    stage: { w: 640, h: 300 },
    initial: [
      { id: "bg", kind: "rect", x: 0, y: 0, w: 640, h: 300, fill: "#12162a" },
      { id: "t", kind: "label", x: 320, y: 158, text: text(title), size: 26, fill: "#eef0ff", opacity: 0 },
    ],
    tweens: [{ target: "t", property: "opacity", to: 1, start: 0, duration: 600, easing: "easeOut" }],
  };
}

function stepBeat(step: SegStep, id: string, next: string): BeatSpec {
  const viz = step.html
    ? { name: "sandbox", props: { html: step.html } }
    : { name: "storyboard", props: { storyboard: step.storyboard ?? titleCard(step.title) } };
  return {
    id,
    type: "explorable",
    params: {
      viz,
      controls: [CONTINUE],
      note: step.written || step.title, // WRITTEN prose (string → article() → KaTeX at render)
      narration: step.narration || undefined, // SPOKEN script (separate field; TTS reads this)
    } as unknown as Json,
    next,
  };
}

function exerciseBeat(ex: SegExercise, id: string, returnTo: string): BeatSpec {
  if (ex.kind === "mcq") {
    return {
      id,
      type: "mcq",
      params: {
        prompt: ex.prompt,
        choices: ex.choices.map((c) => ({ text: c.text, correct: c.correct, misconception: c.misconception })),
        skill: ex.skill,
        correctFeedback: ex.correctFeedback ?? "Correct — nicely done.",
        wrongFeedback: ex.wrongFeedback ?? "Not quite — look back over the steps above and try again.",
      } as unknown as Json,
      next: returnTo, // no onWrong (v1) → mcq routes `next` back home either way
    };
  }
  return {
    id,
    type: "freeResponse",
    params: {
      prompt: ex.prompt,
      accept: ex.accept,
      skill: ex.skill,
      correctFeedback: ex.correctFeedback ?? "That's it.",
      wrongFeedback: ex.wrongFeedback ?? "Close — re-read the steps and give it another go.",
    } as unknown as Json,
    next: returnTo,
  };
}

/**
 * Turn a parsed segment into the atomic authoring turn. LOAD-BEARING ORDER: `applyAuthoring`
 * splices commands one-by-one and `validateBeatSpec` throws `DANGLING_TARGET` if a beat's `next`
 * points at a beat not yet in the chart. So we emit `addBeat`s TAIL-FIRST — exercise, then
 * stepN…step2, then step1 LAST — so every `next` target already exists when its beat splices.
 * `enter:false` on all but step1 (enter:true, emitted last): `applyAuthoring` keeps the LAST
 * enter-requested id, so the learner lands on step1 with the whole chain spliced behind it.
 */
export function segmentToCommands(seg: ParsedSegment, opts: { baseId: string; returnTo: string }): AuthoringCommand[] {
  const { baseId, returnTo } = opts;
  const steps = seg.steps.length ? seg.steps : [{ title: "Answer", written: "", narration: "" }];
  const stepIds = steps.map((_, i) => `${baseId}-s${i + 1}`);
  const exId = `${baseId}-ex`;
  const hasEx = !!seg.exercise;

  const nextOf = (i: number): string => (i < steps.length - 1 ? stepIds[i + 1]! : hasEx ? exId : returnTo);
  const specs = steps.map((s, i) => stepBeat(s, stepIds[i]!, nextOf(i)));

  const cmds: AuthoringCommand[] = [];
  if (hasEx) cmds.push({ op: "addBeat", spec: exerciseBeat(seg.exercise!, exId, returnTo), enter: false });
  for (let i = steps.length - 1; i >= 1; i--) cmds.push({ op: "addBeat", spec: specs[i]!, enter: false });
  cmds.push({ op: "addBeat", spec: specs[0]!, enter: true }); // step1 last → land here
  return cmds;
}

// ─────────────────────────────────────────────────────────────────────────────
// Offline deterministic router — the no-key / headless path (same parse route)
// ─────────────────────────────────────────────────────────────────────────────

// Two self-contained figures (mirroring plan.ts's SINE_HTML / TRIANGLE_SVG) for the sandbox path.
const SINE_HTML = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;height:100%;background:#fff;color:#334;font:14px system-ui,sans-serif}
#c{display:block;width:100%;height:100%}</style>
<canvas id="c" width="640" height="420"></canvas>
<script>
const cv=document.getElementById('c'),g=cv.getContext('2d'),W=640,H=420,mid=H/2;
g.clearRect(0,0,W,H);
g.strokeStyle='#e5e7eb';g.beginPath();g.moveTo(0,mid);g.lineTo(W,mid);g.stroke();
g.strokeStyle='#6366f1';g.lineWidth=2.5;g.beginPath();
for(let px=0;px<=W;px++){const t=px/W*4*Math.PI,y=mid-Math.sin(t)*160;px?g.lineTo(px,y):g.moveTo(px,y);}
g.stroke();
</script>`;

const TRIANGLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="100%" height="100%">
<polygon points="120,24 24,176 216,176" fill="#c7d2fe" stroke="#4338ca" stroke-width="3"/>
<text x="120" y="16" text-anchor="middle" font-family="system-ui" font-size="13" fill="#4338ca">A</text>
<text x="14" y="192" font-family="system-ui" font-size="13" fill="#4338ca">B</text>
<text x="226" y="192" text-anchor="end" font-family="system-ui" font-size="13" fill="#4338ca">C</text>
</svg>`;

// A declarative animated scene: a dot bounces across an axis, tracing the swing of a sine wave.
const RISING_WAVE_SB: Storyboard = {
  duration: 2400,
  stage: { w: 640, h: 360 },
  initial: [
    { id: "bg", kind: "rect", x: 0, y: 0, w: 640, h: 360, fill: "#12162a" },
    { id: "axis", kind: "line", x: 40, y: 180, x2: 600, y2: 180, stroke: "#2a3155" },
    { id: "dot", kind: "circle", x: 40, y: 180, r: 8, fill: "#818cf8", glow: 10, opacity: 0 },
    { id: "cap", kind: "label", x: 320, y: 330, text: text("one full swing of y = sin x"), size: 20, fill: "#9aa0bf", opacity: 0 },
  ],
  tweens: [
    { target: "dot", property: "opacity", to: 1, start: 0, duration: 300 },
    { target: "dot", property: "x", from: 40, to: 600, start: 0, duration: 2200, easing: "linear" },
    { target: "dot", property: "y", from: 180, to: 60, start: 0, duration: 700, easing: "easeInOut" },
    { target: "dot", property: "y", from: 60, to: 300, start: 700, duration: 1100, easing: "easeInOut" },
    { target: "dot", property: "y", from: 300, to: 180, start: 1800, duration: 600, easing: "easeInOut" },
    { target: "cap", property: "opacity", to: 1, start: 500, duration: 500 },
  ],
};

// A triangle drawing itself on, stroke by stroke (draw-on path).
const TRIANGLE_BUILD_SB: Storyboard = {
  duration: 1800,
  stage: { w: 480, h: 360 },
  initial: [
    { id: "bg", kind: "rect", x: 0, y: 0, w: 480, h: 360, fill: "#12162a" },
    { id: "tri", kind: "path", x: 0, y: 0, d: "M240 60 L80 300 L400 300 Z", stroke: "#818cf8", strokeWidth: 4, draw: 0, len: 1000 },
  ],
  tweens: [{ target: "tri", property: "draw", from: 0, to: 1, start: 0, duration: 1500, easing: "easeInOut" }],
};

/** Deterministic, keyword-routed segment — the offline default. Emits the SAME structure a live
 *  model would; `segmentAuthor` re-encodes + re-parses it so the offline path is identical. */
export function offlineSegment(question: string): ParsedSegment {
  const q = question.toLowerCase();

  if (/\b(plot|graph|sine|sin|cos|curve|wave|function)\b/.test(q)) {
    return {
      steps: [
        {
          title: "The shape of a sine wave",
          written: "A sine wave rises to a peak, falls through zero to a trough, and repeats forever. Watch a point trace one full swing of $y=\\sin x$.",
          narration: "Let's start with the shape. A sine wave climbs to a peak, falls back through the middle to a trough, and then repeats — one smooth, endless swing.",
          storyboard: RISING_WAVE_SB,
        },
        {
          title: "Plotting it across four periods",
          written: "Here is the same curve drawn over $[0,4\\pi]$ — four full periods. Every hump has the same height and width; that regularity is what *periodic* means.",
          narration: "Now here's the full curve over four periods. Notice how every hump is identical — same height, same width. That repetition is exactly what we mean by periodic.",
          html: SINE_HTML,
        },
      ],
      exercise: {
        kind: "mcq",
        prompt: "At $x = \\pi$, what is the value of $\\sin x$?",
        skill: "sine-values",
        choices: [
          { text: "0", correct: true },
          { text: "1", misconception: "confuses-pi-with-half-pi" },
          { text: "-1", misconception: "off-by-half-period" },
        ],
      },
    };
  }

  if (/\b(draw|sketch|diagram|illustrate|triangle|shape|figure|picture|geometry)\b/.test(q)) {
    return {
      steps: [
        {
          title: "Building a triangle",
          written: "A triangle is three points joined by three straight sides. Watch one draw itself, corner to corner.",
          narration: "A triangle is the simplest closed shape there is — three corners joined by three straight sides. Let's watch one build itself.",
          storyboard: TRIANGLE_BUILD_SB,
        },
        {
          title: "Its interior angles",
          written: "Label the corners $A$, $B$, $C$. However you stretch the triangle, the three interior angles always sum to $180^\\circ$.",
          narration: "Now label the corners A, B, and C. Here's the fact that never changes: no matter how you stretch it, those three inside angles always add up to a hundred and eighty degrees.",
          html: TRIANGLE_SVG,
        },
      ],
      exercise: {
        kind: "mcq",
        prompt: "The interior angles of any triangle sum to…",
        skill: "triangle-angle-sum",
        choices: [
          { text: "$180^\\circ$", correct: true },
          { text: "$360^\\circ$", misconception: "confuses-with-quadrilateral" },
          { text: "$90^\\circ$", misconception: "confuses-with-right-angle" },
        ],
      },
    };
  }

  // Generic prose segment — no visuals, so each step degrades to a title-card (exercises that path).
  return {
    steps: [
      {
        title: "Framing your question",
        written: `You asked: “${question}”. In a live session I break an idea into a few short steps, narrate each one aloud, and finish with a quick check.`,
        narration: "Great question. I'll break this into a few short steps, talk you through each one, and then give you a quick check at the end to see it stuck.",
      },
      {
        title: "A worked example",
        written: "Take the Pythagorean theorem, $a^2 + b^2 = c^2$: the square of the hypotenuse equals the sum of the squares of the two legs. Ask me to *draw* or *plot* something and I'll build a visual to match.",
        narration: "As a quick example, the Pythagorean theorem says a squared plus b squared equals c squared — the long side squared equals the other two sides squared and added up. Ask me to draw or plot something and I'll build a picture for it.",
      },
    ],
    exercise: {
      kind: "free",
      prompt: "In your own words: what is one thing a step's *narration* can do that its written text cannot?",
      accept: ["spoken", "speak", "audio", "voice", "heard", "hear", "aloud", "sound", "tts", "listen"],
      skill: "reflection",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// The author
// ─────────────────────────────────────────────────────────────────────────────

export interface SegmentAuthorOptions {
  /** Injected completion (dev proxy in the browser). Omitted → always offline (tests). */
  complete?: Completer;
  /** Output budget — a multi-step segment with inline html is large; default well past plan.ts. */
  maxTokens?: number;
  /** Model hint forwarded to the proxy (which picks the real model per provider). */
  model?: string;
}

/**
 * The segment author. `generate` reads the learner's question + return target, gets the model's
 * segment text (live) or "" (offline / error), parses it, and — on an empty or step-less parse —
 * falls back through the offline router's ENCODED text so the exact `parseSegment` path always
 * runs. Returns the atomic `AuthoringCommand[]` chain. Never dead-ends.
 */
export function segmentAuthor(opts: SegmentAuthorOptions = {}): LessonAuthor {
  const { complete, maxTokens = 8192, model = "claude-opus-4-8" } = opts;
  return {
    async generate({ ctx, effect }: GenerateRequest): Promise<AuthoringCommand[]> {
      const returnTo = typeof effect.returnTo === "string" ? effect.returnTo : "home";
      const question = String(effect.question ?? "").trim();
      const baseId = `gen-seg-${ctx.history.length}`; // history-indexed → replay-stable

      let raw = "";
      if (complete) {
        try {
          raw = await complete({ system: SEGMENT_SYSTEM, prompt: question, model, maxTokens });
        } catch {
          raw = ""; // a proxy/network error degrades to the offline segment below
        }
      }
      let seg = parseSegment(raw);
      if (seg.steps.length === 0) seg = parseSegment(encodeSegment(offlineSegment(question)));
      return segmentToCommands(seg, { baseId, returnTo });
    },
  };
}

/** The deterministic default (offline) author — no completer, so it always routes through
 *  `offlineSegment`. Used by the headless acceptance test and the no-key browser path. */
export const offlineSegmentAuthor: LessonAuthor = segmentAuthor();
