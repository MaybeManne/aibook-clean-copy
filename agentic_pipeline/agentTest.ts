// AGENT TEST — end-to-end agentic lesson generation.
//
// An LLM agent (Claude) is given the SocraticAI Lesson "API" in its system prompt
// and asked to design a lesson as a structured JSON plan. We then build that plan
// with the REAL Lesson class — real setTemplate(), real visualize(), real addAct(),
// real run() — and write the HTML out.
//
// The API key is read from the environment (ANTHROPIC_API_KEY), never hardcoded.
// Run it:  ANTHROPIC_API_KEY=sk-ant-... npx tsx agentic_pipeline/agentTest.ts

import { writeFileSync } from "fs";
import * as path from "path";

import Anthropic from "@anthropic-ai/sdk";

import { assembleLesson } from "./layer2Assembler.ts";
import { Lesson } from "./lesson.ts";
import type { ActOutput, ActLocation } from "./actRegistry.ts";

// NOTE: the user asked for "claude-sonnet-5", which is not a real model ID. The
// current Sonnet is claude-sonnet-4-6 — used here to honor the "Sonnet" intent.
const MODEL = "claude-sonnet-4-6";

// ─────────────────────────────────────────────────────────────────────────────
// the plan shape the agent returns
// ─────────────────────────────────────────────────────────────────────────────
interface PlanVisual {
  type: string; // a lesson.visualize() type, e.g. "fractionBar", "multipleChoice"
  args: Record<string, any>;
}
interface PlanAct {
  name: string;
  text?: string; // the explanation shown in the right column
  visual?: PlanVisual | null;
  location?: ActLocation | null; // optional placement override
}
interface PlanTransition {
  from: string;
  edges: Record<string, string>; // { trigger: nextActName }
}
interface LessonPlan {
  title: string;
  template: string;
  sm: "linear" | "freeform";
  acts: PlanAct[];
  startAct?: string | null;
  transitions?: PlanTransition[] | null;
  walk?: string[] | null; // triggers to fire (in order) after entering the start act
}

const VISUAL_TYPES = [
  "fractionBar", "multipleChoice", "slider", "table", "numberLine", "coordinatePlane",
  "highlight", "stepList", "barChart", "vennDiagram", "pieChart", "boxPlot", "callout",
  "latex", "graph",
];
const TEMPLATES = [
  "default", "dark", "minimal", "duolingo", "technical", "notion", "ocean",
  "chalk", "sunrise", "highcontrast", "kids",
];

const SYSTEM_PROMPT = `You are a math lesson generator for SocraticAI, an interactive teaching platform.

You design a lesson that a program then builds with a real Lesson object. The Lesson API you are designing for:
- lesson.setTemplate(name): pick a visual theme.
- lesson.addAct(name, fn): add one "act" (one slide) to the lesson, in order.
- lesson.visualize(type, args): attach a prebuilt visual to an act.

Each slide has three zones. The builder places pieces automatically:
- LEFT: a diagram visual (fractionBar, barChart, numberLine, coordinatePlane, vennDiagram, pieChart, boxPlot, graph).
- RIGHT: the act's explanatory text, plus textual visuals (stepList, highlight, callout, table, latex).
- BOTTOM: a question visual (multipleChoice, slider).
An act may combine text + one visual. You may override placement with an act "location" of "left", "right", or "bottom".

Available templates: ${TEMPLATES.join(", ")}.

Available visualize() types and their args:
- fractionBar: { numerator: number, denominator: number, label?: string }
- multipleChoice: { question: string, options: string[], correctIndex: number }   (correctIndex is 0-based)
- slider: { label: string, min: number, max: number, step: number, defaultValue: number }
- table: { headers: string[], rows: any[][] }
- numberLine: { min: number, max: number, points?: number[], labels?: string[] }
- coordinatePlane: { xRange: [number, number], yRange: [number, number], points?: number[][], lines?: number[][][] }
- highlight: { text: string, color?: string }
- stepList: { steps: string[] }
- barChart: { labels: string[], values: number[], title?: string }
- pieChart: { slices: { label: string, value: number, color?: string }[] }
- callout: { text: string, style?: "info" | "warning" | "success" }
- latex: { expression: string }

State machine:
- "linear": acts run top to bottom, start to finish. Simplest — use this unless branching is truly needed.
- "freeform": a branching/looping graph. If you use it, provide "startAct", "transitions" (list of { from, edges }), and "walk"
  (the ordered list of triggers to fire after the start act, ending at DONE). Every act must be reachable from the start and
  every act must have a path to a "DONE" node. Use edges like { correct: "yay", incorrect: "reexplain" }.

Respond with ONLY a single JSON object (no markdown fences, no prose) of this shape:
{
  "title": string,
  "template": string,
  "sm": "linear" | "freeform",
  "acts": [ { "name": string, "text": string, "visual": { "type": string, "args": object } | null, "location": "left"|"right"|"bottom"|null } ],
  "startAct": string | null,
  "transitions": [ { "from": string, "edges": { "<trigger>": "<actName>" } } ] | null,
  "walk": string[] | null
}`;

const USER_PROMPT =
  "Create an interactive lesson about pizza fractions for a 7 year old. Use the duolingo template. Make it fun and simple.";

// pull the first {...} JSON object out of the model's text (defensive against stray prose/fences).
function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("no JSON object found in agent response");
  return text.slice(start, end + 1);
}

// build one act's ActOutput from the plan: the explanation text plus the visual (if any).
function actOutput(lesson: Lesson, act: PlanAct): ActOutput {
  const base: ActOutput = { text: act.text ?? "" };
  if (!act.visual) return base;
  const viz = lesson.visualize(act.visual.type, act.visual.args); // real validation happens here
  return { ...viz, text: base.text };
}

// drive a freeform lesson to DONE: follow the agent's walk, then fall back to the
// first available edge (with a guard) if the walk runs out before DONE.
async function driveFreeform(lesson: Lesson, walk: string[]): Promise<void> {
  const queue = [...walk];
  let guard = 0;
  while (lesson.state !== "DONE" && lesson.state !== "ERROR" && guard++ < 50) {
    const trigger = queue.shift() ?? Object.keys(lesson.transitions[lesson.state] ?? {})[0];
    if (!trigger) break;
    await lesson.step(trigger);
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Run: ANTHROPIC_API_KEY=sk-... npx tsx agentic_pipeline/agentTest.ts");
  }
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  console.log(`=== 1) Asking the agent (${MODEL}) to design the lesson ===`);
  console.log(`User: ${USER_PROMPT}\n`);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: USER_PROMPT }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
  console.log("=== 2) Raw agent response ===");
  console.log(rawText, "\n");

  const plan: LessonPlan = JSON.parse(extractJson(rawText));
  console.log("=== 3) Parsed plan ===");
  console.log(JSON.stringify(plan, null, 2), "\n");

  // ── build the lesson with the REAL Lesson class ──
  console.log("=== 4) Building the lesson with the real Lesson class ===");
  const lesson = new Lesson(plan.title || "Pizza Fractions", USER_PROMPT);

  try {
    lesson.setTemplate(plan.template);
  } catch {
    console.log(`(template "${plan.template}" not found — falling back to "duolingo")`);
    lesson.setTemplate("duolingo");
  }

  for (const act of plan.acts) {
    lesson.addAct(act.name, () => actOutput(lesson, act), act.location ? { location: act.location } : undefined);
  }

  if (plan.sm === "freeform") {
    for (const t of plan.transitions ?? []) lesson.addTransition(t.from, t.edges);
    if (plan.startAct) lesson.setStartAct(plan.startAct);
  }

  console.log(`freeform mode: ${lesson.getFreeformMode()}`);

  // ── run it ──
  console.log("\n=== 5) Running the lesson ===");
  await lesson.run();
  if (lesson.getFreeformMode()) await driveFreeform(lesson, plan.walk ?? []);
  console.log(`\nfinal state: ${lesson.state}, acts rendered: ${lesson.getResults().length}`);

  // ── write the HTML ──
  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "agentTestpizza.html");
  writeFileSync(out, page);
  console.log(`\n=== 6) Wrote ${out} (${page.length} bytes) ===`);
}

main().catch((e) => {
  console.error("AGENT TEST FAILED:", e?.message ?? e);
  process.exit(1);
});
