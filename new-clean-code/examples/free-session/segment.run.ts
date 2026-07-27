// Headless acceptance for the SMARTER free-session tutor — one learner question authored as a
// whole VIDEO-LIKE SEGMENT (N steps → graded exercise), spliced as ONE atomic authoring turn.
// It drives a LiveProgram with the DETERMINISTIC offline segment author (no key, no DOM) and
// asserts the CONTRACT the studio depends on:
//   • ATOMIC SPLICE: one question splices every step beat + the exercise into `chart.states`
//     in a single turn, and the learner lands on step 1 only (proves the TAIL-FIRST /
//     reverse-order recipe — a wrong order would throw DANGLING_TARGET and never splice);
//   • CHAIN: edges walk s1 → … → sN → exercise → home, and pressing Continue (`next`) advances
//     one step at a time; a storyboard step carries `props.storyboard`, a sandbox step `props.html`;
//   • NARRATION is a SEPARATE spoken field (decision #3): the frame surfaces the active step's
//     narration string, distinct from its written prose;
//   • GRADED: a correct mcq raises `mastery[skill]` to 1, then `next` rejoins `home`; a correct
//     freeResponse does the same (the generic, visual-free route);
//   • TRANSCRIPT: the log folds to `tutor:prose(home) · learner:question · agent:explanation×(N+1)
//     · learner:answer` — proving GAP 1 (chain steps entered via `next` are still AGENT-authored)
//     and GAP 2 (the exercise turn shows its prompt, not a blank line);
//   • DETERMINISM: replay from history alone reconstructs every spliced beat and reproduces the
//     exact live transcript projection — the author is never re-invoked.
// The offline router emits the SAME wire text a live model would (via `encodeSegment`), so this
// exercises the exact `parseSegment` → `segmentToCommands` path the browser + a live model use.

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
import { offlineSegmentAuthor } from "./segment.js";
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
      runner: generatingRunner(offlineSegmentAuthor, defaultRunner()),
      learnerModel: defaultLearnerModel(),
    }),
  );
}

type Program = ReturnType<typeof createLiveProgram>;
const beatOf = (p: Program, id: string): { type?: string; params?: Record<string, unknown> } | undefined =>
  (p.session.lesson.chart.states[id]?.meta as { beat?: { type?: string; params?: Record<string, unknown> } } | undefined)?.beat;
const activeBeat = (p: Program): { type?: string; params?: Record<string, unknown> } | undefined => beatOf(p, p.activeBeatId());
const vizName = (b: { params?: Record<string, unknown> } | undefined): string | undefined =>
  (b?.params?.viz as { name?: string } | undefined)?.name;
const vizProps = (p: Program): Record<string, unknown> | undefined =>
  (p.frame().model.intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined)?.props;
const edgeTarget = (chart: Session["lesson"]["chart"], beatId: string): string | null | undefined => {
  const on = chart.states[beatId]?.on?.next;
  if (on === undefined) return undefined;
  return on.length === 0 ? null : on[0]?.target ?? null;
};

/** Ask one question and settle the authored segment. Returns step 1's beat id (the landing beat). */
async function ask(p: Program, question: string): Promise<string> {
  p.send(messageSubmit(question));
  assert(p.activeBeatId().startsWith("__ask-"), `“${question}” → ephemeral thinking leaf (say-anytime)`);
  await tick();
  const id = p.activeBeatId();
  assert(/^gen-seg-\d+-s1$/.test(id), `…the tutor AUTHORED a segment and the learner LANDS on step 1 (${id})`);
  return id;
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("free-session/segment: a “plot…” question → a multi-step segment (storyboard step · sandbox demo · graded mcq), spliced atomically");
let plotHistory: Session["context"]["history"] = [];
let plotTranscript = "";
let plotIds: string[] = [];
{
  const program = freshLive();
  const s1 = await ask(program, "plot the sine wave");
  const baseId = s1.replace(/-s1$/, "");
  const s2 = `${baseId}-s2`;
  const ex = `${baseId}-ex`;
  plotIds = [s1, s2, ex];
  const chart = program.session.lesson.chart;

  // ATOMIC SPLICE: every beat exists after ONE turn, but only step 1 is active.
  assert(!!chart.states[s1] && !!chart.states[s2] && !!chart.states[ex], "one turn spliced BOTH steps + the exercise into the chart (atomic)");
  assert(program.activeBeatId() === s1, "…and the learner is on step 1 ONLY (tail-first splice landed on step1)");

  // CHAIN edges: s1 → s2 → ex → home.
  assert(edgeTarget(chart, s1) === s2, "edge: step1 → step2");
  assert(edgeTarget(chart, s2) === ex, "edge: step2 → exercise");
  assert(edgeTarget(chart, ex) === "home", "edge: exercise → home (rejoins the ask-me-anything default)");

  // Step 1 = a declarative animated STORYBOARD (props.storyboard, no html).
  const b1 = activeBeat(program);
  assert(b1?.type === "explorable" && vizName(b1) === "storyboard", "step1 is an `explorable` rendered by the `storyboard` viz");
  const p1 = vizProps(program) ?? {};
  assert(!!p1.storyboard && p1.html === undefined, "…carrying `props.storyboard` (a declarative scene), not html");

  // NARRATION is a SEPARATE spoken field, distinct from the written prose (decision #3).
  const written1 = String(b1?.params?.note ?? "");
  const narr1 = String(b1?.params?.narration ?? "");
  assert(narr1.length > 0 && narr1 !== written1, "step1 carries a SPOKEN narration distinct from its written prose");
  assert((program.frame().narration ?? "") === narr1, "…and the live frame surfaces exactly that narration string (no audio in `live/`)");

  // Continue → step 2 = a self-contained SANDBOX demo (props.html with a live canvas).
  program.send({ type: "next" });
  assert(program.activeBeatId() === s2, "Continue advances to step 2");
  const b2 = activeBeat(program);
  assert(b2?.type === "explorable" && vizName(b2) === "sandbox", "step2 is an `explorable` rendered by the `sandbox` viz");
  const p2 = vizProps(program) ?? {};
  assert(String(p2.html ?? "").includes("<canvas") && String(p2.html ?? "").includes("sin"), "…carrying self-contained `props.html` that plots the sine wave (Math.sin)");

  // Continue → the graded exercise.
  program.send({ type: "next" });
  assert(program.activeBeatId() === ex, "Continue advances to the exercise");
  assert(activeBeat(program)?.type === "mcq", "the exercise is a graded `mcq` beat");

  // GRADED: the correct choice raises mastery; then `next` rejoins home.
  program.send({ type: "mcq.answer", payload: { choice: 0 } }); // choice 0 = "0" (correct: sin π = 0)
  assert(program.session.context.mastery["sine-values"] === 1, "a correct answer raises mastery of the exercise's skill to 1");
  program.send({ type: "next" });
  assert(program.activeBeatId() === "home", "…and Continue after the exercise rejoins `home`");
  assert(program.done === false, "still not done — the learner keeps asking");

  // TRANSCRIPT (GAP 1 + GAP 2): home opener · question · N+1 agent explanations · the answer.
  const turns = program.transcript();
  const shape = turns.map((t) => `${t.role}:${t.kind}`);
  assert(
    JSON.stringify(shape) === JSON.stringify(["tutor:prose", "learner:question", "agent:explanation", "agent:explanation", "agent:explanation", "learner:answer"]),
    "the log folds to: home opener · learner question · 3 agent explanations (2 steps + exercise) · learner answer",
  );
  assert(turns[2]!.beatId === s1 && turns[3]!.beatId === s2 && turns[4]!.beatId === ex, "…GAP 1: chain steps entered via `next` are attributed to the AGENT, not the tutor");
  assert(toPlain(turns[4]!.content as RichText).includes("sin"), "…GAP 2: the exercise turn shows its prompt (not a blank line)");

  plotHistory = program.session.context.history;
  plotTranscript = JSON.stringify(program.transcript()); // the LIVE projection, to match against replay
  program.dispose();
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("free-session/segment: a visual-free question → prose steps degrade to title-card storyboards, closing with a graded free-response");
{
  const program = freshLive();
  const s1 = await ask(program, "tell me a joke"); // no plot/draw keywords → the generic prose route
  const baseId = s1.replace(/-s1$/, "");
  const ex = `${baseId}-ex`;

  // A prose-only step still gets a viz + Continue: it degrades to a minimal title-card storyboard.
  const b1 = activeBeat(program);
  assert(b1?.type === "explorable" && vizName(b1) === "storyboard", "a visual-free step still renders as an `explorable` (never a Continue-less `explain`)");
  const p1 = vizProps(program) ?? {};
  assert(!!p1.storyboard && p1.html === undefined, "…its viz is a minimal title-card storyboard (so there is always a Continue)");

  // Walk to the exercise (2 steps).
  program.send({ type: "next" });
  program.send({ type: "next" });
  assert(program.activeBeatId() === ex, "Continue walks through both prose steps to the exercise");
  assert(activeBeat(program)?.type === "freeResponse", "the exercise is a graded `freeResponse` beat");

  // GRADED free-response: an accepted answer raises mastery, then rejoins home.
  program.send({ type: "input.submit", payload: { value: "aloud" } }); // in the accept list
  assert(program.session.context.mastery["reflection"] === 1, "a correct free-response answer raises mastery to 1");
  program.send({ type: "next" });
  assert(program.activeBeatId() === "home", "…and Continue rejoins `home`");

  // GAP 2 for freeResponse: the exercise turn surfaces its `prompt`.
  const exTurn = program.transcript().find((t) => t.beatId === ex);
  assert(exTurn?.role === "agent" && toPlain(exTurn.content as RichText).toLowerCase().includes("narration"), "the freeResponse turn shows its prompt (GAP 2, verified field: params.prompt)");
  program.dispose();
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("free-session/segment: replay reconstructs the whole segment from history alone (determinism — the author is never re-invoked)");
{
  const [s1, s2, ex] = plotIds;
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states[s1!] === undefined && fresh.chart.states[ex!] === undefined, "a fresh lesson has no generated segment beats");

  const r = replay(fresh, plotHistory);
  assert(!!r.lesson.chart.states[s1!] && !!r.lesson.chart.states[s2!] && !!r.lesson.chart.states[ex!], "REPLAY reconstructed EVERY spliced beat (steps + exercise) as pure DATA");

  // The step's authored html/storyboard survives the JSON round-trip verbatim.
  const s2Beat = (r.lesson.chart.states[s2!]?.meta as { beat?: { params?: Record<string, unknown> } } | undefined)?.beat;
  const html = String((s2Beat?.params?.viz as { props?: { html?: unknown } } | undefined)?.props?.html ?? "");
  assert(html.includes("<canvas") && html.includes("sin"), "…the sandbox step's authored html round-trips through replay verbatim");

  const replayed = projectTranscript(r.lesson, r.context.history, r.activeBeatId());
  assert(JSON.stringify(replayed) === plotTranscript, "…and the live transcript falls out of history alone (pure projection reproduces it exactly)");
}

console.log("\nSegment acceptance passed — one question authors a multi-step segment (storyboard · sandbox · graded exercise), spliced atomically tail-first, narrated with a separate spoken field, walked by Continue, graded to mastery, folded into an agent-attributed transcript, and reconstructed by deterministic replay.");
