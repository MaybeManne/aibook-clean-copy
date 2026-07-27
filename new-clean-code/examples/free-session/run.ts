// Headless acceptance for the FREE SESSION — the LLM-owns-structure demo. It drives a
// LiveProgram with the DETERMINISTIC offline author (no key, no DOM) and asserts the CORE the
// studio depends on:
//   • the default graph is just "ask me anything": `home` is active, non-terminal (so the log
//     never shows "Lesson complete ✓"), and the stage starts empty;
//   • a learner question enters an ephemeral thinking leaf, then the tutor AUTHORS a real act
//     that splices in and is entered — for each act kind:
//       – prose/math   → an `explain` beat whose article text carries the answer + math;
//       – illustration → an `explorable` beat hosting the `sandbox` iframe with authored <svg>;
//       – interactive  → an `explorable` beat whose sandbox html is a live <canvas> demo;
//   • each authored act rejoins `home` (next = returnTo), and the log folds to
//     learner-question · agent-explanation;
//   • determinism: replay from history alone reconstructs every authored act beat as DATA.
// The offline author routes by keyword (plan.ts `offlineAct`) and emits the SAME prose+```html
// text a live model would, so this exercises the exact `assemble` parse path the browser uses.

import { createLiveProgram } from "@lessonkit/live";
import {
  createSession,
  defaultLearnerModel,
  defaultRunner,
  defineLesson,
  generatingRunner,
  messageSubmit,
  projectTranscript,
  replay,
  type Session,
} from "@lessonkit/lesson";
import { toPlain, type RichText } from "@lessonkit/render-contract";
import { freeSessionAuthor, parseAct } from "./plan.js";
import { lessonSpec } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

function freshLive(): ReturnType<typeof createLiveProgram> {
  const lesson = defineLesson(lessonSpec);
  return createLiveProgram(
    createSession(lesson, {
      runner: generatingRunner(freeSessionAuthor, defaultRunner()),
      learnerModel: defaultLearnerModel(),
    }),
  );
}

type Program = ReturnType<typeof createLiveProgram>;
const activeBeat = (p: Program): { type?: string; params?: Record<string, unknown> } | undefined =>
  (p.session.lesson.chart.states[p.activeBeatId()]?.meta as { beat?: { type?: string; params?: Record<string, unknown> } } | undefined)?.beat;
const vizProps = (p: Program): Record<string, unknown> | undefined =>
  (p.frame().model.intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined)?.props;
const frameText = (p: Program): string =>
  p.frame().model.intents.map((i) => ("content" in i ? toPlain(i.content as RichText) : "")).join(" ");
const edgeTarget = (chart: Session["lesson"]["chart"], beatId: string): string | null | undefined => {
  const on = chart.states[beatId]?.on?.next;
  if (on === undefined) return undefined;
  return on.length === 0 ? null : on[0]?.target ?? null;
};

/** Ask one question and settle the authored act. Returns the spliced act beat's id. */
async function ask(p: Program, question: string): Promise<string> {
  p.send(messageSubmit(question));
  assert(p.activeBeatId().startsWith("__ask-"), `“${question}” → ephemeral thinking leaf (say-anytime)`);
  await tick();
  const id = p.activeBeatId();
  assert(id.startsWith("gen-act-"), `…the tutor AUTHORED an act beat (${id})`);
  return id;
}

console.log("free-session: the wire format survives LaTeX + inline html (the failure that killed the JSON contract)");
{
  // The exact shape that broke JSON.parse in the browser: prose thick with LaTeX backslashes
  // (\sum, \frac, \times — none a valid JSON escape) followed by a self-contained html demo.
  const raw =
    "A 3×3 kernel slides over the pixels: $\\sum_i \\sum_j \\text{K}_{i,j}\\times I$, and $\\frac{1}{9}$ blurs.\n\n" +
    "```html\n<canvas id=c></canvas><script>Math.sin(0);/* draw */</script>\n```";
  const act = parseAct(raw);
  assert(act.markdown?.includes("\\sum") && act.markdown?.includes("\\frac"), "LaTeX (\\sum, \\frac) survives verbatim in the prose (this is what broke JSON.parse)");
  assert(!act.markdown?.includes("```"), "…and the fenced html block is lifted OUT of the caption (shown once, rendered — not as code)");
  assert(act.html?.includes("<canvas") && act.html?.includes("<script"), "…the fenced body becomes the figure html verbatim");
  const prose = parseAct("Just words, no figure — $e^{i\\pi}+1=0$.");
  assert(prose.html === undefined && prose.markdown?.includes("\\pi"), "a bare prose reply (no fence) is a valid act: all markdown, no html");

  // The model is inconsistent about the fence's language tag — key off the BODY, not the tag.
  const svgTagged = parseAct("The water cycle:\n\n```svg\n<svg><text>rain</text></svg>\n```");
  assert(svgTagged.html?.startsWith("<svg"), "a figure fenced as ```svg is still lifted (content, not tag, decides)");
  const untagged = parseAct("Here:\n\n```\n<svg><circle/></svg>\n```");
  assert(untagged.html?.startsWith("<svg"), "an UNTAGGED ``` fence holding markup is lifted too");
  const codeThenFig = parseAct("Kernel: `[0,1,0]`.\n\n```python\nprint('hi')\n```\n\n```html\n<canvas></canvas>\n```");
  assert(codeThenFig.html === "<canvas></canvas>", "a prose CODE fence is skipped; the html figure is the one that's lifted");
  assert(codeThenFig.markdown?.includes("```python"), "…and the prose code sample stays in the caption (rendered as code, not stolen)");
}

console.log("free-session: the default graph is just “ask me anything” — home is active, non-terminal, stage empty");
{
  const program = freshLive();
  assert(program.activeBeatId() === "home", "starts on `home`");
  assert(program.done === false, "`home` is non-terminal → done stays false (no “Lesson complete ✓”)");
  assert(edgeTarget(program.session.lesson.chart, "home") === "end", "home advances to the reachable `end` (spine) but shows no Continue");
  assert(edgeTarget(program.session.lesson.chart, "end") === null, "`end` is the reachable terminal (keeps the lesson compilable)");
  const stage = program.frame().model.intents.filter((i) => i.slot === "stage");
  assert(stage.length === 0, "the stage starts empty (nothing authored yet)");
  program.dispose();
}

console.log("free-session: a prose/math question → the tutor authors an `explain` act carrying the answer + math");
let mathHistory: Session["context"]["history"] = [];
let mathTranscript = "";
let mathActId = "";
{
  const program = freshLive();
  mathActId = await ask(program, "explain the pythagorean theorem");
  const beat = activeBeat(program);
  assert(beat?.type === "explain", "a prose/math answer is an `explain` beat (no figure)");
  assert(Array.isArray(beat?.params?.text), "…its text is RichText (article-parsed → KaTeX survives into the transcript)");
  assert(frameText(program).toLowerCase().includes("pythagorean"), "…and it answers the question");
  assert(frameText(program).includes("a^2"), "…including the math ($a^2 + b^2 = c^2$)");
  assert(edgeTarget(program.session.lesson.chart, mathActId) === "home", "the authored act rejoins `home` (next = returnTo)");
  assert(program.done === false, "still not done — the learner just keeps asking");

  const shape = program.transcript().map((t) => `${t.role}:${t.kind}`);
  assert(
    JSON.stringify(shape) === JSON.stringify(["tutor:prose", "learner:question", "agent:explanation"]),
    "the log folds to: home opener · learner question · agent explanation",
  );
  mathHistory = program.session.context.history;
  mathTranscript = JSON.stringify(program.transcript()); // the LIVE projection, to match against replay
  program.dispose();
}

console.log("free-session: a “draw…” question → the tutor authors an illustration (explorable + sandbox iframe, <svg>)");
{
  const program = freshLive();
  const id = await ask(program, "draw a triangle for me");
  const beat = activeBeat(program);
  assert(beat?.type === "explorable", "an illustration answer is an `explorable` beat (hosts the artifact)");
  assert((beat?.params?.viz as { name?: string } | undefined)?.name === "sandbox", "…rendered by the generic `sandbox` viz");
  const html = String(vizProps(program)?.html ?? "");
  assert(html.includes("<svg") && html.includes("<polygon"), "…whose html is the authored self-contained SVG");
  const controls = (beat?.params?.controls as Array<{ key?: string }> | undefined) ?? [];
  assert(controls.some((c) => c.key === "__next"), "…with a Back control to return home");
  assert(edgeTarget(program.session.lesson.chart, id) === "home", "the illustration rejoins `home`");

  program.send({ type: "next" }); // ↩ Back
  assert(program.activeBeatId() === "home", "Back returns the learner to `home`");
  program.dispose();
}

console.log("free-session: a “plot…” question → the tutor authors an INTERACTIVE demo (explorable + sandbox, live <canvas>+<script>)");
let demoHistory: Session["context"]["history"] = [];
let demoActId = "";
{
  const program = freshLive();
  demoActId = await ask(program, "plot the sine wave");
  const beat = activeBeat(program);
  assert(beat?.type === "explorable", "an interactive demo is an `explorable` beat");
  const html = String(vizProps(program)?.html ?? "");
  assert(html.includes("<canvas") && html.includes("<script"), "…whose html is a self-contained canvas+JS demo");
  assert(html.includes("sin"), "…that actually plots the sine wave (Math.sin)");
  demoHistory = [...program.session.context.history];
  program.send({ type: "next" }); // ↩ Back
  assert(program.activeBeatId() === "home", "Back returns to `home`");
  program.dispose();
}

console.log("free-session: replay reconstructs each authored act from history alone (determinism — no author re-invoked)");
{
  const freshMath = defineLesson(lessonSpec);
  assert(freshMath.chart.states[mathActId] === undefined, "a fresh lesson has no generated act beat");
  const rm = replay(freshMath, mathHistory);
  assert(rm.lesson.chart.states[mathActId] !== undefined, "REPLAY reconstructed the prose/math `explain` act as DATA");
  const replayedProse = projectTranscript(rm.lesson, rm.context.history, rm.activeBeatId());
  assert(JSON.stringify(replayedProse) === mathTranscript, "…and the live transcript falls out of history alone (pure projection reproduces it)");

  const rd = replay(defineLesson(lessonSpec), demoHistory);
  const demoBeat = (rd.lesson.chart.states[demoActId]?.meta as { beat?: { params?: Record<string, unknown> } } | undefined)?.beat;
  const html = String((demoBeat?.params?.viz as { props?: { html?: unknown } } | undefined)?.props?.html ?? "");
  assert(html.includes("<canvas") && html.includes("sin"), "REPLAY reconstructed the interactive demo's authored html verbatim (JSON round-trip)");
}

console.log("\nFree-session acceptance passed — ask-me-anything default · the tutor authors prose/math, an SVG illustration, and a live canvas demo · each rejoins home · deterministic replay of every authored act.");
