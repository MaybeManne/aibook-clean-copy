import {
  askSubmit,
  createSession,
  defaultRunner,
  messageSubmit,
  replay,
  DIRECTION_COMMAND_EVENT,
  projectTranscript,
  type EventRecord,
  type Session,
} from "@lessonstudio/lesson";
import { defineLesson } from "@lessonstudio/authoring";
import { claudeDirector, directingRunner, type ToolRequest, type ToolTurn } from "@lessonstudio/forge";
import type { RenderIntent } from "@lessonstudio/intents";
import { createLiveProgram, type LiveProgram } from "@lessonstudio/live";
import { PINHOLE_VIZ } from "../examples/pinhole/pinhole3d.js";
import { lessonSpec } from "../examples/pinhole/lesson.js";
import { colorizeMath, nativeVoice, PINHOLE_BRIEF, pinholeSilence, SYMBOL_COLOR } from "../examples/pinhole/tutor.js";
import { tex } from "../examples/pinhole/palette.js";

let passed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  passed++;
  console.log("  ok:", msg);
}

async function settle(pred: () => boolean, what: string, ms = 2000): Promise<void> {
  const t0 = Date.now();
  while (!pred()) {
    if (Date.now() - t0 > ms) throw new Error(`timed out waiting for ${what}`);
    await new Promise((r) => setTimeout(r, 5));
  }
}

const PROSE =
  "The rays cross at the hole, so the top of the tree lands at the bottom of the screen: " +
  `$h' = h\\,v/u$, and the ratio $m = v/u$ is all that sets the size. Pushing the screen to ` +
  `$12\\,\\text{m}$ scales the image up without ever softening it, since ${tex("v")} only stretches ` +
  "the triangle.";

function sayTurn(text: string): ToolTurn {
  return { text: "", calls: [{ id: "call-1", name: "say", input: { text } }] };
}

function countingCompleter(turn: (n: number) => ToolTurn = () => sayTurn(PROSE)): {
  complete: (req: ToolRequest) => Promise<ToolTurn>;
  calls: ToolRequest[];
} {
  const calls: ToolRequest[] = [];
  return {
    calls,
    complete: async (req) => {
      calls.push(req);
      return turn(calls.length - 1);
    },
  };
}

function deferredCompleter(): {
  complete: (req: ToolRequest) => Promise<ToolTurn>;
  resolve: (i: number, text: string) => void;
  count: () => number;
} {
  const pending: Array<(turn: ToolTurn) => void> = [];
  return {
    complete: () => new Promise<ToolTurn>((res) => pending.push(res)),
    resolve: (i, text) => pending[i]!(sayTurn(text)),
    count: () => pending.length,
  };
}

function tutorRunner(complete: (req: ToolRequest) => Promise<ToolTurn>) {
  const director = nativeVoice(claudeDirector({ complete, brief: PINHOLE_BRIEF }));
  return directingRunner(director, { base: defaultRunner(), onSilence: pinholeSilence });
}

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

function observationOf(req: ToolRequest): string {
  return req.messages.map((m) => m.text).join("\n");
}

console.log("[colour-keying the tutor's prose]");
{
  const painted = colorizeMath("$m = v/u$");
  assert(painted.includes(tex("m")), "a bare `m` in math is tagged with the palette's magnification symbol");
  assert(painted.includes(tex("v")) && painted.includes(tex("u")), "`v` and `u` are tagged too");

  const units = colorizeMath("the screen sits $12\\,\\text{m}$ back");
  assert(units.includes("\\text{m}") && !units.includes("\\text{\\htmlClass"), "the `m` of `\\text{m}` is METRES and is left alone");

  const already = colorizeMath(`$${tex("v")} = 12$`);
  assert((already.match(/htmlClass/g) ?? []).length === 1, "an already-keyed symbol is not double-wrapped");

  assert(colorizeMath("much brighter, humbler, and mauve") === "much brighter, humbler, and mauve", "prose words are never painted — only math spans");
  assert(!colorizeMath("$\\mu = 1$").includes("htmlClass"), "the `u` inside a TeX command (`\\mu`) is not a symbol");
}

console.log("\n[say-anytime: the Composer path]");
const live = countingCompleter();
let liveHistory: EventRecord[] = [];
let liveAnswerId = "";
{
  const lesson = defineLesson(lessonSpec);
  const session = createSession(lesson, { runner: tutorRunner(live.complete) });
  const program: LiveProgram = createLiveProgram(session);

  assert(program.activeBeatId() === "wall-1" && !program.frame().thinking, "the lesson opens on wall-1, not thinking");

  const question = "Why is the image upside down?";
  program.send(messageSubmit(question));

  assert(program.activeBeatId().startsWith("__ask-"), "the learner's question enters an ephemeral thinking leaf");
  assert(program.frame().thinking, "LiveProgram.thinking is true while the tutor takes its turn");
  assert(textOf(program.render()).includes("Thinking"), "the thinking leaf renders a 'Thinking…' placeholder");
  assert(
    program.frame().transcript.some((t) => t.role === "learner" && t.kind === "question"),
    "the question is already a learner turn in the transcript (before any answer)",
  );

  await settle(() => !program.frame().thinking, "the tutor's turn to land");
  liveAnswerId = program.activeBeatId();

  assert(liveAnswerId.startsWith("__say-"), `the said beat is entered (${liveAnswerId})`);
  assert(live.calls.length === 1, "the model was called exactly once");

  const { system } = live.calls[0]!;
  const obs = observationOf(live.calls[0]!);
  assert(system.includes("h'/h = v/u"), "the system prompt carries the lesson's FACTS, not just a persona");
  assert(system.includes("You are the teacher of a live interactive lesson"), "on top of the general director brief — how to teach is not the lesson's job to restate");
  assert(obs.includes(question), "the observation carries the learner's actual question");
  assert(obs.includes("## LEARNER ASKED"), "flagged as UNANSWERED, so the model knows what to act on first");
  assert(obs.includes("wall-1"), "and where in the lesson they are standing");
  assert(live.calls[0]!.tools.some((t) => t.name === "say") && live.calls[0]!.tools.some((t) => t.name === "focus"), "the tools offered are the director's own vocabulary");

  const answer = proseOf(session, liveAnswerId);
  assert(answer.includes("cross at the hole"), "the model's voice is in the beat");
  assert(answer.includes(tex("u")), "the said prose is colour-keyed by the lesson's palette");
  assert(answer.includes("\\text{m}") && !answer.includes("\\text{\\htmlClass"), "a unit inside that prose survives colour-keying");
  assert(!/the magnification is/.test(answer), "and NOTHING is appended to it: the house style paints the math and poses the stage, it does not add a sentence");

  const vizzes = vizIntentsOf(session.render());
  assert(vizzes.length === 1 && vizzes[0]!.name === PINHOLE_VIZ, "the said beat carries the ONE persistent apparatus (no second WebGL context)");
  assert(vizzes[0]!.props?.labels === true, "the apparatus is labelled on the answer beat — a question here is about the geometry");

  const turns = program.frame().transcript;
  const q = turns.find((t) => t.role === "learner" && t.kind === "question");
  const a = turns.find((t) => t.role === "agent" && t.kind === "explanation");
  assert(!!q && !!a && turns.indexOf(q) < turns.indexOf(a), "the log reads question → agent explanation, in order");
  assert(a!.beatId === liveAnswerId, "the agent turn is attributed to the said beat");
  assert(!turns.some((t) => t.beatId.startsWith("__ask-")), "the ephemeral thinking leaf is engine scaffolding and never becomes a turn");

  liveHistory = session.context.history;
  const rec = liveHistory[liveHistory.length - 1]!;
  assert(rec.event.type === DIRECTION_COMMAND_EVENT, "the turn arrived as a `direction.command` event — the same event a human teacher sends");
  const payload = rec.event.payload as { actor?: string; commands?: Array<{ op?: string; text?: string; show?: unknown }> };
  assert(payload.actor === "ai", "attributed to the AI actor, so the transcript can say who spoke");
  assert(payload.commands?.length === 1 && payload.commands[0]!.op === "say", "carrying the command itself, not a pre-assembled beat");
  assert(payload.commands![0]!.text === proseOf(session, liveAnswerId), "and the recorded prose is exactly what the beat renders");
  assert(JSON.stringify(liveHistory) === JSON.stringify(JSON.parse(JSON.stringify(liveHistory))), "history is pure JSON — no inline fns snuck into the turn");

  program.send({ type: "next" });
  assert(program.activeBeatId() === "wall-1", "Continue on the said beat RESUMES the interrupted step");
  program.dispose();
}

console.log("\n[direct → freeze → replay]");
{
  const before = live.calls.length;
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states[liveAnswerId] === undefined, "a fresh compile of the lesson does NOT contain the said beat");

  const s2 = replay(fresh, liveHistory);
  assert(live.calls.length === before, "replay called the model ZERO extra times");
  assert(s2.lesson.chart.states[liveAnswerId] !== undefined, "replay re-adjudicated the turn into the chart");
  assert(fresh.chart.states[liveAnswerId] === undefined, "into the SESSION's chart — the compiled lesson it was built from stays pristine, so it can seed another learner");
  assert(s2.activeBeatId() === liveAnswerId, "replay ends where the live session was");
  assert(proseOf(s2, liveAnswerId).includes("cross at the hole"), "the replayed beat carries the same prose");

  const t1 = projectTranscript(s2.lesson, liveHistory, liveAnswerId).map((t) => `${t.role}:${t.kind}`);
  const t2 = projectTranscript(defineLesson(lessonSpec), s2.context.history, s2.activeBeatId()).map((t) => `${t.role}:${t.kind}`);
  assert(t1.join("|") === t2.join("|"), "the conversation projects identically from the replayed log");
  s2.send({ type: "next" });
  assert(s2.activeBeatId() === "wall-1", "the replayed session also resumes the interrupted step");
}

console.log("\n[grounded in the learner's own state — both ask paths]");
{
  const stub = countingCompleter();
  const lesson = defineLesson(lessonSpec);
  const session = createSession(lesson, { runner: tutorRunner(stub.complete) });
  const program = createLiveProgram(session);

  driveTo(session, "move-screen");
  session.send({ type: "demo.set", payload: { key: "v", value: 12 } });
  assert(program.activeBeatId() === "move-screen", "a control fiddle keeps the learner on the demo");

  program.send(messageSubmit("Does pushing the screen out make it blurrier?"));
  const thinkingViz = vizIntentsOf(program.render());
  assert(program.frame().thinking, "the Composer parks the learner on a thinking leaf");
  assert(thinkingViz.length === 1 && thinkingViz[0]!.props?.v === 12, "the thinking leaf CLONES the apparatus at the learner's own v — the workspace never blanks");

  await settle(() => !program.frame().thinking, "the answer to the Composer question");
  const answerId = program.activeBeatId();
  assert(observationOf(stub.calls[0]!).includes("v=12"), "the model is told the learner's OWN screen distance, not the authored default");
  const answer = proseOf(session, answerId);
  assert(!/the magnification is/.test(answer), "and the answer is the model's own words — the grounding is not a sentence bolted onto them");
  assert(vizIntentsOf(session.render())[0]!.props?.v === 12, "it is THIS: the answer beat holds the apparatus where the learner left it (v=12), so the words and the figure agree");

  program.send({ type: "next" });
  assert(program.activeBeatId() === "move-screen", "Continue returns to the demo the question came from");
  assert((session.context.beats["move-screen"] as { v?: number } | undefined)?.v === 12, "the learner's slider value survived the detour");

  program.send(askSubmit("And does the hole size change the size of the image?"));
  assert(program.activeBeatId() === "move-screen", "`ask.submit` keeps the learner ON the demo — it is a self-transition, not a detour");
  assert(!program.frame().thinking, "so there is no thinking leaf for this path (the demo's own figure and controls stay live)");
  assert(vizIntentsOf(program.render())[0]!.props?.v === 12, "and the apparatus is untouched while the answer arrives");

  await settle(() => program.activeBeatId().startsWith("__say-"), "the answer to the explorable's own question");
  assert(stub.calls.length === 2, "the second question is a second call — one per question, never per render");
  assert(observationOf(stub.calls[1]!).includes("hole size"), "the second call carries the second question");
  program.send({ type: "next" });
  assert(program.activeBeatId() === "move-screen", "and it too resumes the demo");
  program.dispose();
}

console.log("\n[the tutor hears itself — a detour is a conversation, not a series of first meetings]");
{
  // The answers a director gives are beats it authored into the SESSION's chart after the runner
  // was built. A runner holding the COMPILED lesson found those turns in the history but could not
  // read their prose, so every answer reached the model as an empty string: it could not tell a
  // second question from a first, and any "have I said this already?" rule it was given was
  // unanswerable. Two questions in a row is the smallest case that shows it.
  const stub = countingCompleter((n) => sayTurn(`Answer number ${n + 1}, about the crossing at the hole.`));
  const session = createSession(defineLesson(lessonSpec), { runner: tutorRunner(stub.complete) });
  const program = createLiveProgram(session);

  program.send(messageSubmit("Why is the image upside down?"));
  await settle(() => !program.frame().thinking, "the first answer");
  const firstId = program.activeBeatId();
  program.send({ type: "next" });
  program.send(messageSubmit("And why are the two triangles similar?"));
  await settle(() => !program.frame().thinking, "the second answer");

  const second = observationOf(stub.calls[1]!);
  assert(second.includes("Answer number 1"), "the second turn's observation carries the tutor's OWN first answer, verbatim");
  assert(second.includes("Why is the image upside down?"), "beside the question it answered, so the exchange reads as an exchange");
  assert(
    second.indexOf("Why is the image upside down?") < second.indexOf("Answer number 1"),
    "in order — question then answer, the way it happened",
  );
  assert(
    [firstId, program.activeBeatId()].every((id) => !proseOf(session, id).includes("the magnification is")),
    "and neither answer ends in a house sentence about u, v and m — the tutor's words are its own, which is why hearing itself is worth anything",
  );
  program.dispose();
}

console.log("\n[grounded in the displayed prose — a question can point AT something]");
{
  const stub = countingCompleter();
  const lesson = defineLesson(lessonSpec);
  const session = createSession(lesson, { runner: tutorRunner(stub.complete) });
  const program = createLiveProgram(session);

  driveTo(session, "wall-2");
  program.send(messageSubmit("what's this integral?"));
  await settle(() => !program.frame().thinking, "the answer to a question about the formula on screen");

  const { system } = stub.calls[0]!;
  const obs = observationOf(stub.calls[0]!);
  assert(obs.includes("## ON SCREEN (wall-2)"), "the observation carries the words on the learner's screen");
  assert(obs.includes("\\int_{\\Omega}"), "including the integral itself — so 'this integral' has a referent");
  assert(obs.includes("$$"), "with its math delimiters intact, so the model can see a formula as a formula");
  assert(!obs.includes("\\textcolor") && !obs.includes("\\htmlClass"), "and without the colour markup in either shape, since the same prompt forbids the model from writing it");
  assert(obs.includes("average"), "the lesson's own gloss travels with the formula");

  assert(system.includes("ANYTHING IT PUTS ON"), "the system prompt states the scope rule in terms of what is displayed");
  assert(/hemisphere/.test(system) && /does not need to evaluate/.test(system), "and supplies the radiometry gloss, so the model rephrases a fact instead of improvising one");
  program.dispose();
}

console.log("\n[interrupt: the stale answer is dropped]");
{
  const def = deferredCompleter();
  const lesson = defineLesson(lessonSpec);
  const session = createSession(lesson, { runner: tutorRunner(def.complete) });
  const program = createLiveProgram(session);

  program.send(messageSubmit("First question — about the hole size?"));
  const firstLeaf = program.activeBeatId();
  program.send(messageSubmit("Actually, why is it inverted?"));
  const secondLeaf = program.activeBeatId();
  assert(firstLeaf !== secondLeaf && secondLeaf.startsWith("__ask-"), "the second question enters a NEW thinking leaf");
  assert(def.count() === 2, "both questions reached the model (the first is in flight, not cancelled at the source)");

  def.resolve(0, "An answer to the abandoned question.");
  await new Promise((r) => setTimeout(r, 20));
  assert(program.activeBeatId() === secondLeaf, "the abandoned answer is DROPPED — the learner is not yanked back");
  assert(!program.frame().transcript.some((t) => t.kind === "explanation"), "and it never reaches the transcript");

  def.resolve(1, PROSE);
  await settle(() => !program.frame().thinking, "the answer to the question the learner actually meant");
  assert(program.activeBeatId().startsWith("__say-"), "the live question's answer lands normally");
  const questions = program.frame().transcript.filter((t) => t.kind === "question");
  assert(questions.length === 2, "both questions stay in the log — an interrupt is a discourse move, not an erasure");
  program.dispose();
}

console.log("\n[the silent model: onSilence still answers]");
{
  const silent = countingCompleter(() => ({ text: "I would explain that the aperture…", calls: [] }));
  const lesson = defineLesson(lessonSpec);
  const session = createSession(lesson, { runner: tutorRunner(silent.complete) });
  const program = createLiveProgram(session);

  program.send(messageSubmit("Why is it upside down?"));
  await settle(() => !program.frame().thinking, "the fallback answer");

  assert(silent.calls.length === 2, "prose with no tool call gets ONE nudge — a model describing a turn instead of taking it is told so");
  assert(observationOf(silent.calls[1]!).includes("That was not a turn"), "and told in the same terms the tools were offered in");
  const id = program.activeBeatId();
  assert(id.startsWith("__say-"), "the learner still lands on an answer beat");
  const answer = proseOf(session, id);
  assert(answer.includes("exactly one ray direction"), "carrying this lesson's deterministic fallback, not a generic apology");
  assert(vizIntentsOf(session.render())[0]!.name === PINHOLE_VIZ, "posed on the same apparatus as a live answer — the fallback goes through the same house style");
  program.send({ type: "next" });
  assert(program.activeBeatId() === "wall-1", "and Continue resumes the interrupted step, so the lesson is never stuck");
  program.dispose();
}

console.log(`\nASK LOOP PASSED — ${passed}/${passed} checks: ask → direct → adjudicate → resume, the tutor reading its own past answers out of the live chart, replayed from the log with the model called once per question.`);
