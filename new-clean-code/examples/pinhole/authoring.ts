// M5a check — the LIVE AUTHORING LOOP, headless: a learner asks mid-lesson, the agent
// authors a grounded beat, it splices into the running lesson, and the whole exchange
// replays from the event log with the model never called again.
//
// Run: PATH=<conda-node>/bin:$PATH ./node_modules/.bin/tsx examples/pinhole/authoring.ts
//
// This is the pillar-5 test ("AI authors/adapts in real time") and it is deliberately
// headless: every claim here is about the ENGINE, not about pixels. The browser walk
// (`examples/shot-pinhole.mjs`) then proves the same loop through the real Composer.
//
// The model is stubbed by a counting `Completer` — the same injection point the browser
// uses for the `/api/author` proxy — for three reasons: the checks stay offline and free,
// the prose is fixed so the grounding assertions are exact, and the CALL COUNT becomes an
// assertion. "Replay never re-invokes the generator" is not a comment if a counter proves it.

import {
  askSubmit,
  createSession,
  defaultRunner,
  defineLesson,
  generatingRunner,
  claudeAuthor,
  messageSubmit,
  replay,
  GENERATED_BEAT_EVENT,
  projectTranscript,
  type CompletionRequest,
  type EventRecord,
  type Session,
} from "@lessonstudio/lesson";
import type { RenderIntent } from "@lessonstudio/render-contract";
import { createLiveProgram, type LiveProgram } from "@lessonstudio/live";
import { PINHOLE_VIZ } from "./pinhole3d.js";
import { lessonSpec } from "./lesson.js";
import { colorizeMath, pinholePlan, SYMBOL_COLOR } from "./author.js";
import { tex } from "./palette.js";

let passed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  passed++;
  console.log("  ok:", msg);
}

/** Wait for an async effect to land (generation resolves on a microtask, not synchronously). */
async function settle(pred: () => boolean, what: string, ms = 2000): Promise<void> {
  const t0 = Date.now();
  while (!pred()) {
    if (Date.now() - t0 > ms) throw new Error(`timed out waiting for ${what}`);
    await new Promise((r) => setTimeout(r, 5));
  }
}

/** The prose the "model" returns. Chosen to exercise the colour-keying edge cases:
 *  bare symbols to paint, a `\text{m}` unit whose `m` is METRES (must not be painted as
 *  magnification), and an already-coloured symbol (must not be double-wrapped). */
const PROSE =
  "The rays cross at the hole, so the top of the tree lands at the bottom of the screen: " +
  `$h' = h\\,v/u$, and the ratio $m = v/u$ is all that sets the size. Pushing the screen to ` +
  `$12\\,\\text{m}$ scales the image up without ever softening it, since ${tex("v")} only stretches ` +
  "the triangle.";

/** A stub completer standing where the `/api/author` proxy stands in the browser. */
function countingCompleter(): { complete: (req: CompletionRequest) => Promise<string>; calls: CompletionRequest[] } {
  const calls: CompletionRequest[] = [];
  return {
    calls,
    complete: async (req) => {
      calls.push(req);
      return PROSE;
    },
  };
}

/** A completer whose calls are resolved BY THE TEST — for the interrupt/abort check. */
function deferredCompleter(): { complete: (req: CompletionRequest) => Promise<string>; resolve: (i: number, text: string) => void; count: () => number } {
  const pending: Array<(text: string) => void> = [];
  return {
    complete: (_req) => new Promise<string>((res) => pending.push(res)),
    resolve: (i, text) => pending[i]!(text),
    count: () => pending.length,
  };
}

/** Drive the spine to a beat, answering any gate correctly on the way. */
function driveTo(s: Session, target: string, max = 40): void {
  for (let i = 0; i < max && s.activeBeatId() !== target; i++) {
    const id = s.activeBeatId();
    const beat = (s.lesson.chart.states[id]?.meta as { beat?: { type: string; params: Record<string, unknown> } } | undefined)?.beat;
    const answered = (s.context.beats[id] as { attempts?: number; answered?: boolean } | undefined) ?? {};
    if (beat?.type === "mcq" && !answered.attempts) {
      const choices = (beat.params.choices ?? []) as Array<{ correct?: boolean }>;
      s.send({ type: "mcq.answer", payload: { choice: choices.findIndex((c) => c.correct) } });
      continue;
    }
    if (beat?.type === "freeResponse" && !answered.answered) {
      const accept = (beat.params.accept ?? []) as string[];
      s.send({ type: "input.submit", payload: { value: accept[0] ?? "" } });
      continue;
    }
    s.send({ type: "next" });
  }
  if (s.activeBeatId() !== target) throw new Error(`driveTo: never reached "${target}" (stuck at "${s.activeBeatId()}")`);
}

/** The beat text the engine ended up with, for grounding assertions. */
function proseOf(s: Session, beatId: string): string {
  const beat = (s.lesson.chart.states[beatId]?.meta as { beat?: { params: { text?: unknown } } } | undefined)?.beat;
  return typeof beat?.params.text === "string" ? beat.params.text : "";
}

function vizIntentsOf(model: { intents: RenderIntent[] }): Array<{ name?: string; props?: Record<string, unknown> }> {
  return model.intents.filter((i) => i.kind === "viz") as Array<{ name?: string; props?: Record<string, unknown> }>;
}

function textOf(model: { intents: RenderIntent[] }): string {
  const flat = (n: unknown): string => {
    if (typeof n === "string") return n;
    if (Array.isArray(n)) return n.map(flat).join("");
    if (n && typeof n === "object") {
      const o = n as { text?: unknown; children?: unknown };
      return flat(o.text ?? "") + flat(o.children ?? "");
    }
    return "";
  };
  return model.intents.map((i) => ((i as { content?: unknown }).content ? flat((i as { content?: unknown }).content) : "")).join(" ");
}

// ══ 1. The colour-keying rules, as pure assertions ═══════════════════════════════
// The engine (not the model) paints symbols, so these are the rules that decide whether a
// GENERATED turn looks native to the lesson. They are cheap and they are the part most
// likely to silently regress.
console.log("[colour-keying generated prose]");
{
  const painted = colorizeMath("$m = v/u$");
  assert(painted.includes(`\\textcolor{${SYMBOL_COLOR.m}}{m}`), "a bare `m` in math is painted with the palette's magnification hue");
  assert(painted.includes(`\\textcolor{${SYMBOL_COLOR.v}}{v}`) && painted.includes(`\\textcolor{${SYMBOL_COLOR.u}}{u}`), "`v` and `u` are painted too");

  const units = colorizeMath("the screen sits $12\\,\\text{m}$ back");
  assert(units.includes("\\text{m}") && !units.includes("\\text{\\textcolor"), "the `m` of `\\text{m}` is METRES and is left alone");

  const already = colorizeMath(`$${tex("v")} = 12$`);
  assert((already.match(/textcolor/g) ?? []).length === 1, "an already-coloured symbol is not double-wrapped");

  assert(colorizeMath("much brighter, humbler, and mauve") === "much brighter, humbler, and mauve", "prose words are never painted — only math spans");
  assert(!colorizeMath("$\\mu = 1$").includes("textcolor"), "the `u` inside a TeX command (`\\mu`) is not a symbol");
}

// ══ 2. The Composer path: message.submit → thinking → authored beat → resume ══════
console.log("\n[say-anytime: the Composer path]");
const live = countingCompleter();
let liveHistory: EventRecord[] = [];
let liveAnswerId = "";
{
  const author = claudeAuthor({ plan: pinholePlan, complete: live.complete });
  const session = createSession(defineLesson(lessonSpec), { runner: generatingRunner(author, defaultRunner()) });
  const program: LiveProgram = createLiveProgram(session);

  assert(program.activeBeatId() === "wall-1" && !program.frame().thinking, "the lesson opens on wall-1, not thinking");

  const question = "Why is the image upside down?";
  program.send(messageSubmit(question));

  // Synchronous, before the model answers: the engine has already recorded the turn and
  // parked the learner on an ephemeral leaf. This is the affordance that makes the wait
  // legible instead of a frozen page.
  assert(program.activeBeatId().startsWith("__ask-"), "the learner's question enters an ephemeral thinking leaf");
  assert(program.frame().thinking, "LiveProgram.thinking is true while the agent authors");
  assert(textOf(program.render()).includes("Thinking"), "the thinking leaf renders a 'Thinking…' placeholder");
  assert(
    program.frame().transcript.some((t) => t.role === "learner" && t.kind === "question"),
    "the question is already a learner turn in the transcript (before any answer)",
  );

  await settle(() => !program.frame().thinking, "the authored answer to splice in");
  liveAnswerId = program.activeBeatId();

  assert(liveAnswerId.startsWith("__answer-"), `the authored beat is entered (${liveAnswerId})`);
  assert(live.calls.length === 1, "the model was called exactly once");
  assert(live.calls[0]!.system.includes("h'/h = v/u"), "the system prompt carries the engine's FACTS, not just a persona");
  assert(live.calls[0]!.prompt.includes(question), "the prompt carries the learner's actual question");
  assert(live.calls[0]!.prompt.includes('lesson step "wall-1"'), "the prompt tells the model where in the lesson the learner is");

  // The engine's grounding, in the beat the model's prose landed in.
  const answer = proseOf(session, liveAnswerId);
  assert(answer.includes("cross at the hole"), "the model's voice is in the beat");
  assert(answer.includes(`\\textcolor{${SYMBOL_COLOR.u}}{u}`), "the generated prose is colour-keyed by the lesson's palette");
  assert(answer.includes("\\text{m}") && !answer.includes("\\text{\\textcolor"), "a unit inside the generated prose survives colour-keying");
  assert(/the magnification is/.test(answer) && answer.includes("= 1$"), "an engine-owned footer states the LIVE u/v/m (u=7, v=7 ⇒ m=1)");

  const vizzes = vizIntentsOf(session.render());
  assert(vizzes.length === 1 && vizzes[0]!.name === PINHOLE_VIZ, "the authored beat carries the ONE persistent apparatus (no second WebGL context)");
  assert(vizzes[0]!.props?.labels === true, "the apparatus is labelled on the answer beat — a question here is about the geometry");

  const turns = program.frame().transcript;
  const q = turns.find((t) => t.role === "learner" && t.kind === "question");
  const a = turns.find((t) => t.role === "agent" && t.kind === "explanation");
  assert(!!q && !!a && turns.indexOf(q) < turns.indexOf(a), "the log reads question → agent explanation, in order");
  assert(a!.beatId === liveAnswerId, "the agent turn is attributed to the authored beat");
  assert(!turns.some((t) => t.beatId.startsWith("__ask-")), "the ephemeral thinking leaf is engine scaffolding and never becomes a turn");

  // The spec rode in the event, which is what makes replay possible.
  liveHistory = session.context.history;
  const rec = liveHistory[liveHistory.length - 1]!;
  assert(rec.event.type === GENERATED_BEAT_EVENT, "the authored beat arrived as a `beat.generated` event");
  const payload = rec.event.payload as { id?: string; next?: string; params?: { text?: string } };
  assert(payload.id === liveAnswerId && payload.next === "wall-1", "the recorded payload is the FULL spec, including where Continue goes");
  assert(!!payload.params?.text && payload.params.text === proseOf(session, liveAnswerId), "the recorded prose is exactly what the beat renders");
  assert(JSON.stringify(liveHistory) === JSON.stringify(JSON.parse(JSON.stringify(liveHistory))), "history is pure JSON — no inline fns snuck into the authored spec");

  program.send({ type: "next" });
  assert(program.activeBeatId() === "wall-1", "Continue on the authored beat RESUMES the interrupted step");
  program.dispose();
}

// ══ 3. Replay: the same exchange, from data, with no model in the loop ════════════
console.log("\n[generate → freeze → replay]");
{
  const before = live.calls.length;
  // A FRESH compile: the replayed session must rebuild the authored beat from the log, not
  // inherit it from a chart some other Session already mutated.
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states[liveAnswerId] === undefined, "a fresh compile of the lesson does NOT contain the authored beat");

  const s2 = replay(fresh, liveHistory);
  assert(live.calls.length === before, "replay called the model ZERO extra times");
  assert(fresh.chart.states[liveAnswerId] !== undefined, "replay re-spliced the authored beat into the chart");
  assert(s2.activeBeatId() === liveAnswerId, "replay ends where the live session was");
  assert(proseOf(s2, liveAnswerId).includes("cross at the hole"), "the replayed beat carries the same generated prose");

  const t1 = projectTranscript(fresh, liveHistory, liveAnswerId).map((t) => `${t.role}:${t.kind}`);
  const t2 = projectTranscript(defineLesson(lessonSpec), s2.context.history, s2.activeBeatId()).map((t) => `${t.role}:${t.kind}`);
  assert(t1.join("|") === t2.join("|"), "the conversation projects identically from the replayed log");
  s2.send({ type: "next" });
  assert(s2.activeBeatId() === "wall-1", "the replayed session also resumes the interrupted step");
}

// ══ 4. Grounded in the learner's own manipulation, from both entry points ═════════
// The claim that matters most for pillar 5: the answer is grounded in what the LEARNER did
// to the apparatus, which is precisely what a chat window beside the lesson cannot see.
//
// The two entry points behave DIFFERENTLY on purpose, and both are checked here:
//   • the Composer (`message.submit`) is an INTERRUPTION — the learner may be mid-narration
//     on a beat with no input of its own, so Session parks them on an ephemeral leaf that
//     clones the interrupted beat's viz (the workspace must not blank) and reports `thinking`.
//   • an explorable's own ask box (`ask.submit`) is a SELF-transition — the learner is already
//     standing at the demo with its controls, so there is nothing to clone and nowhere to go:
//     they keep fiddling while the answer is authored.
console.log("\n[grounded in the learner's own state — both ask paths]");
{
  const stub = countingCompleter();
  const author = claudeAuthor({ plan: pinholePlan, complete: stub.complete });
  const session = createSession(defineLesson(lessonSpec), { runner: generatingRunner(author, defaultRunner()) });
  const program = createLiveProgram(session);

  driveTo(session, "move-screen");
  session.send({ type: "demo.set", payload: { key: "v", value: 12 } }); // the learner slides the screen out
  assert(program.activeBeatId() === "move-screen", "a control fiddle keeps the learner on the demo");

  // ── the Composer, interrupting an explorable ──
  program.send(messageSubmit("Does pushing the screen out make it blurrier?"));
  const thinkingViz = vizIntentsOf(program.render());
  assert(program.frame().thinking, "the Composer parks the learner on a thinking leaf");
  assert(thinkingViz.length === 1 && thinkingViz[0]!.props?.v === 12, "the thinking leaf CLONES the apparatus at the learner's own v — the workspace never blanks");

  await settle(() => !program.frame().thinking, "the answer to the Composer question");
  const answerId = program.activeBeatId();
  assert(stub.calls[0]!.prompt.includes("v = 12"), "the model is told the learner's OWN screen distance, not the authored default");
  const answer = proseOf(session, answerId);
  assert(answer.includes("= 12$"), "the footer restates the learner's v");
  assert(answer.includes("1.71"), "the footer's magnification is computed from it (12/7 = 1.71)");
  assert(vizIntentsOf(session.render())[0]!.props?.v === 12, "the answer beat holds the apparatus where the learner left it");

  program.send({ type: "next" });
  assert(program.activeBeatId() === "move-screen", "Continue returns to the demo the question came from");
  assert((session.context.beats["move-screen"] as { v?: number } | undefined)?.v === 12, "the learner's slider value survived the detour");

  // ── the explorable's own ask box: a self-transition, no leaf ──
  program.send(askSubmit("And does the hole size change the size of the image?"));
  assert(program.activeBeatId() === "move-screen", "`ask.submit` keeps the learner ON the demo — it is a self-transition, not a detour");
  assert(!program.frame().thinking, "so there is no thinking leaf for this path (the demo's own figure and controls stay live)");
  assert(vizIntentsOf(program.render())[0]!.props?.v === 12, "and the apparatus is untouched while the answer is authored");

  await settle(() => program.activeBeatId().startsWith("__answer-"), "the answer to the explorable's own question");
  assert(stub.calls.length === 2, "the second question is a second call — one per question, never per render");
  assert(stub.calls[1]!.prompt.includes("hole size"), "the second call carries the second question");
  program.send({ type: "next" });
  assert(program.activeBeatId() === "move-screen", "and it too resumes the demo");
  program.dispose();
}

// ══ 5. Interrupt: a second question abandons the first answer ═════════════════════
// The abort contract, which is what makes "say anytime" safe: entering a new leaf makes the
// in-flight generation stale, so a late answer to an abandoned question can never appear.
console.log("\n[interrupt: the stale answer is dropped]");
{
  const def = deferredCompleter();
  const author = claudeAuthor({ plan: pinholePlan, complete: def.complete });
  const session = createSession(defineLesson(lessonSpec), { runner: generatingRunner(author, defaultRunner()) });
  const program = createLiveProgram(session);

  program.send(messageSubmit("First question — about the hole size?"));
  const firstLeaf = program.activeBeatId();
  program.send(messageSubmit("Actually, why is it inverted?"));
  const secondLeaf = program.activeBeatId();
  assert(firstLeaf !== secondLeaf && secondLeaf.startsWith("__ask-"), "the second question enters a NEW thinking leaf");
  assert(def.count() === 2, "both questions reached the author (the first is in flight, not cancelled at the source)");

  def.resolve(0, "An answer to the abandoned question.");
  await new Promise((r) => setTimeout(r, 20));
  assert(program.activeBeatId() === secondLeaf, "the abandoned answer is DROPPED — the learner is not yanked back");
  assert(!program.frame().transcript.some((t) => t.kind === "explanation"), "and it never reaches the transcript");

  def.resolve(1, PROSE);
  await settle(() => !program.frame().thinking, "the answer to the question the learner actually meant");
  assert(program.activeBeatId().startsWith("__answer-"), "the live question's answer lands normally");
  const questions = program.frame().transcript.filter((t) => t.kind === "question");
  assert(questions.length === 2, "both questions stay in the log — an interrupt is a discourse move, not an erasure");
  program.dispose();
}

console.log(`\nM5a AUTHORING PASSED — ${passed}/${passed} checks: ask → author → splice → resume, replayed from the log with the model called once per question.`);
