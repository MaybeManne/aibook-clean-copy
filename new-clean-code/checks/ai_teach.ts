import {
  createSession,
  demoSet,
  formatObservation,
  messageSubmit,
  observe,
  projectTranscript,
  replay,
  subjectFromContext,
  DIRECTION_COMMAND_EVENT,
  DIRECTOR_OPS,
  FULL,
  OBSERVE_ONLY,
  STRUCTURAL_OPS,
  SUPERVISED,
  type Capabilities,
  type DirectorCommand,
  type DirectorOp,
  type Observation,
  type Session,
} from "@lessonstudio/lesson";
import { defineLesson } from "@lessonstudio/authoring";
import { attachTeachClient, busTransport, createSessionBus, type SyncRequest, type SyncResponse } from "@lessonstudio/teach";
import {
  allDirectorTools,
  claudeDirector,
  commandsFromCalls,
  directingRunner,
  directorIsLive,
  directorPrompt,
  directorSystem,
  directorTools,
  directorTurn,
  driveDirector,
  httpToolCompleter,
  isDirectorOp,
  offlineDirector,
  pickDirector,
  wake,
  DONE_TOOL,
  type Director,
  type DirectorRequest,
  type DriveTurn,
  type ToolCall,
  type ToolCompleter,
  type ToolRequest,
  type ToolTurn,
} from "@lessonstudio/forge";
import { directorDevPlugin, geminiFunctionDeclarations, parsePromptedTurn, restoreArgs } from "../forge/dev_director.js";
import type { DevReq, DevRes } from "../dev/http.js";
import { lessonSpec } from "../examples/pinhole/lesson.js";

let passed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  passed++;
  console.log("  ok:", msg);
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function settle(pred: () => boolean, what: string, ms = 3000): Promise<void> {
  const t0 = Date.now();
  while (!pred()) {
    if (Date.now() - t0 > ms) throw new Error(`timed out waiting for ${what}`);
    await sleep(5);
  }
}

function open(): Session {
  return createSession(defineLesson(lessonSpec), { runner: { run() {} } });
}

function advance(s: Session, n: number): void {
  for (let i = 0; i < n; i++) s.send({ type: "next" });
}

const vars = (s: Session): Record<string, unknown> => s.context.vars as unknown as Record<string, unknown>;

function stubCompleter(turns: ToolTurn[]): { complete: ToolCompleter; seen: ToolRequest[] } {
  const seen: ToolRequest[] = [];
  const queue = [...turns];
  return {
    seen,
    complete: async (req) => {
      seen.push(req);
      const next = queue.shift();
      if (!next) throw new Error(`stub completer called ${seen.length} time(s) — the script ran out`);
      return next;
    },
  };
}

const call = (name: string, input: Record<string, unknown> = {}): ToolCall => ({ id: `t${name}`, name, input });
const spoke = (text: string, calls: ToolCall[] = []): ToolTurn => ({ text, calls });

function requestFor(s: Session, reason: DirectorRequest["reason"] = "question", caps: Capabilities = FULL): DirectorRequest {
  const observation = observe(s, { catalog: true });
  return { observation, text: formatObservation(observation), reason, capabilities: caps };
}

console.log("\n[tools: one vocabulary, said twice]");
{
  const tools = allDirectorTools();
  const names = tools.map((t) => t.name);
  assert(names.length === DIRECTOR_OPS.length + 1, `every op is a tool, plus \`done\` (${DIRECTOR_OPS.length}+1)`);
  assert(DIRECTOR_OPS.every((op) => names.includes(op)), "no op is missing — the model's action space is the human's");
  assert(names.filter((n) => !isDirectorOp(n)).join() === DONE_TOOL, "and the only non-op tool is `done`");
  assert(new Set(names).size === names.length, "no tool is offered twice");
  assert(tools.every((t) => t.description.length > 40 && t.input_schema.type === "object"), "each tool carries teaching guidance and an object schema");
  assert(
    tools.find((t) => t.name === "revisit")!.description.includes("instead of"),
    "the descriptions say WHEN to reach for an op (`revisit` vs `goto`), which is the actual skill",
  );

  const INPUTS: Record<DirectorOp, Record<string, unknown>> = {
    say: { text: "The hole picks one ray per direction.", narrate: "One ray per direction." },
    revisit: { beatId: "flip", note: "look again" },
    goto: { beatId: "recap" },
    addBeat: { spec: { id: "extra", type: "explain", params: { text: "hi" }, next: null }, enter: false },
    patchBeat: { beatId: "recap", params: { text: "reworded" } },
    setNext: { beatId: "recap", target: null },
    rerouteBeat: { beatId: "flip", edge: { on: "next", target: "recap" } },
    setControl: { key: "v", value: 13 },
    setControls: { values: { v: 9, d: 2 } },
    workspace: { props: { highlight: ["v"] }, label: "highlighted v" },
    focus: { at: [0.4, 0.55], scale: 4, label: "the hole" },
    annotate: { shapes: [{ kind: "circle", at: [0.4, 0.55], r: 0.08 }] },
    hold: { reason: "one sec" },
    release: {},
  };
  const parsed = commandsFromCalls(DIRECTOR_OPS.map((op) => call(op, INPUTS[op])));
  assert(parsed.commands.length === DIRECTOR_OPS.length, "every op round-trips from a tool call to a command");
  assert(parsed.commands.map((c) => c.op).join(" ") === DIRECTOR_OPS.join(" "), "in the order the model called them — one atomic turn, not a set");
  assert(!parsed.done && !parsed.unknown.length, "with nothing flagged");
  const said = parsed.commands.find((c) => c.op === "say") as Extract<DirectorCommand, { op: "say" }>;
  assert(said.text === INPUTS.say.text && said.narrate === "One ray per direction.", "the input IS the command minus `op` — no translation layer to drift");
  const zoom = parsed.commands.find((c) => c.op === "focus") as Extract<DirectorCommand, { op: "focus" }>;
  assert(zoom.at?.[0] === 0.4 && zoom.scale === 4, "including the nested shapes — a point stays a normalized [x,y] all the way down");

  const idle = commandsFromCalls([call(DONE_TOOL, { why: "they are working" })]);
  assert(idle.done && !idle.commands.length, "`done` parses as an explicit choice to do nothing");

  const messy = commandsFromCalls([call("hold"), call("sayNicely", { text: "x" }), call("release")]);
  assert(messy.unknown.join() === "sayNicely", "an invented tool is reported…");
  assert(messy.commands.map((c) => c.op).join(" ") === "hold release", "…and the valid calls in the same turn still stand");
  const helpful = commandsFromCalls([call("say", { op: "goto", text: "a" })]);
  assert(helpful.commands[0]!.op === "say", "the TOOL NAME decides the op, so an input that helpfully repeats `op` cannot rewrite the call");
}

console.log("\n[capabilities: the tool list explains, adjudication enforces]");
{
  const full = directorTools(FULL, { done: false }).map((t) => t.name);
  assert(full.length === DIRECTOR_OPS.length, "FULL withholds nothing — tier 3 unrestricted, as specified");

  const sup = directorTools(SUPERVISED).map((t) => t.name);
  assert(STRUCTURAL_OPS.every((op) => !sup.includes(op)), "SUPERVISED withholds every structural op (they need a human)");
  assert(["focus", "annotate", "setControl", "workspace", "hold", "release"].every((op) => sup.includes(op)), "…and keeps show-and-tell, which is most of teaching");
  assert(sup.includes(DONE_TOOL), "`done` survives every regime: a director must always be able to decline");

  const obs = directorTools(OBSERVE_ONLY).map((t) => t.name);
  assert(obs.join() === DONE_TOOL, "OBSERVE_ONLY leaves `done` alone — the regime is legible in one glance rather than discovered through refusals");
  assert(directorSystem(OBSERVE_ONLY).includes('capabilities "observe-only"'), "and the system prompt names the regime, so it is not learned from failures");
  assert(!directorSystem(FULL).includes("NOTE: you are running under"), "while an unrestricted director is told nothing about limits it does not have");

  const s = open();
  advance(s, 1);
  const { complete } = stubCompleter([spoke("", [call("say", { text: "sneaking a word in" })])]);
  const cmds = await claudeDirector({ complete, apiKey: "test" }).direct(requestFor(s, "question", OBSERVE_ONLY));
  assert(cmds.length === 1 && cmds[0]!.op === "say", "a model can emit a command it was not offered (parsing does not judge)…");
  const verdict = s.direct(cmds, "ai", OBSERVE_ONLY);
  assert(!verdict.ok && verdict.error!.kind === "denied", "…and the engine refuses it under the same capabilities");
  assert(verdict.error!.detail.includes("not permitted") && verdict.error!.op === "say", "with a reason a model can read and act on next turn");
  assert(s.activeBeatId() === "wall-2", "the learner did not move: an unrestricted-by-default director is still structurally harmless");
}

console.log("\n[the loop: what one turn costs]");
{
  const s = open();
  advance(s, 8);
  assert(s.activeBeatId() === "move-screen", "at the explorable, where a learner has something to ask about");
  s.send(demoSet("v", 11));
  s.send(messageSubmit("Does the hole size change the sharpness?"));

  const acting = stubCompleter([
    spoke("Pointing at the aperture.", [
      call("say", { text: "Sharpness is the aperture's job: a smaller hole admits fewer rays per point." }),
      call("focus", { at: [0.4, 0.55], scale: 3, label: "the hole" }),
    ]),
  ]);
  const req = requestFor(s);
  const rounds: number[] = [];
  const turn = await claudeDirector({ complete: acting.complete, apiKey: "test", onRound: (r) => rounds.push(r.n) }).direct(req);
  assert(acting.seen.length === 1, "a turn that calls tools costs exactly ONE provider call");
  assert(rounds.join() === "1", "and reports exactly one round to the caller (the hook a cost test counts)");
  assert(turn.map((c) => c.op).join(" ") === "say focus", "prose and a zoom arrive as ONE atomic turn, in the order called");

  const sent = acting.seen[0]!;
  assert(sent.messages.length === 1 && sent.messages[0]!.role === "user", "the first round is a single user message: the situation, and why it is being shown");
  assert(sent.messages[0]!.text.includes(req.text), "which carries the teacher's screen VERBATIM — one serialization for a terminal and a prompt");
  assert(sent.messages[0]!.text.includes("Does the hole size change the sharpness?"), "so the question, the posed value and the catalog all reach the model");
  assert(sent.system.includes("HOW TO TEACH HERE") && sent.system.includes('{"op":"say"'), "the system prompt is the brief plus the same command reference the CLI prints");
  assert(sent.tools.length === DIRECTOR_OPS.length + 1, "and the tools are the whole protocol");
  assert(sent.thinking?.type === "adaptive", "thinking is on: choosing whether to interrupt is a judgement, unlike writing prose");
  assert(sent.toolChoice === undefined, "and tool use is never FORCED — 'say nothing' has to remain a reachable answer");

  const stalling = stubCompleter([spoke("I would explain that the aperture controls sharpness."), spoke("Yes, I think that is the right approach.")]);
  const warns: string[] = [];
  const nothing = await claudeDirector({ complete: stalling.complete, apiKey: "test", onWarn: (m) => warns.push(m) }).direct(requestFor(s));
  assert(!nothing.length, "a director that only talks has done nothing, and the turn is empty rather than pretend");
  assert(stalling.seen.length === 2, "it is nudged exactly ONCE — bounded, so a chatty model cannot spend a lesson's budget on one question");
  assert(stalling.seen[1]!.messages.length === 3, "the nudge is a real exchange: its own words back, then the correction");
  assert(stalling.seen[1]!.messages[2]!.text.includes("was not a turn"), "told in the same terms the tools were offered in");
  assert(warns.some((w) => w.includes("no tool calls")), "and the caller is warned, since a silent no-op is the one failure mode worth logging");

  const recovering = stubCompleter([spoke("Let me think about how to show this."), spoke("", [call("focus", { at: [0.5, 0.5], scale: 2 })])]);
  const recovered = await claudeDirector({ complete: recovering.complete, apiKey: "test" }).direct(requestFor(s));
  assert(recovered.length === 1 && recovered[0]!.op === "focus", "a nudged director's second-round turn is taken");
  assert(recovering.seen.length === 2, "for two calls total — the ceiling, not a new floor");

  const declining = stubCompleter([spoke("", [call(DONE_TOOL, { why: "they are mid-thought" })])]);
  const declined = await claudeDirector({ complete: declining.complete, apiKey: "test" }).direct(requestFor(s, "step"));
  assert(!declined.length && declining.seen.length === 1, "`done` ends the turn on the first call: silence is cheap, as it must be");

  const broken: ToolCompleter = async () => {
    throw new Error("503 upstream");
  };
  const outageWarns: string[] = [];
  const outage = await claudeDirector({ complete: broken, apiKey: "test", onWarn: (m) => outageWarns.push(m) }).direct(requestFor(s));
  assert(!outage.length && outageWarns[0]!.includes("503"), "a provider failure is an empty turn plus a warning — the learner's own beat is still on screen and still playable");

  const inventive = stubCompleter([spoke("", [call("zoomHard", { x: 1 }), call("hold", { reason: "one sec" })])]);
  const inventiveWarns: string[] = [];
  const survived = await claudeDirector({ complete: inventive.complete, apiKey: "test", onWarn: (m) => inventiveWarns.push(m) }).direct(requestFor(s));
  assert(survived.length === 1 && survived[0]!.op === "hold", "a hallucinated tool is dropped and the rest of the turn lands");
  assert(inventiveWarns[0]!.includes("zoomHard"), "with the name reported, because that is next turn's prompt material");

  assert(directorPrompt(requestFor(s, "question")).startsWith("The learner asked you something"), "a question says: answer it");
  assert(directorPrompt(requestFor(s, "step")).includes("`done` is usually right"), "an autonomous step says: probably stay out of the way");
  assert(directorPrompt(requestFor(s, "nudge")).startsWith("You have been asked for a turn"), "and a human's `--once` says only that it was asked for");
}

console.log("\n[reactive: the question the learner actually asked]");
let taught: Session | null = null;
let modelCalls = 0;
{
  const lesson = defineLesson(lessonSpec);
  const stub = stubCompleter([
    spoke("", [
      call("say", { text: "Yes — a smaller hole means fewer rays per point on the screen, so the image sharpens (and dims)." }),
      call("focus", { at: [0.42, 0.5], scale: 3, label: "the aperture" }),
      call("setControl", { key: "v", value: 13, beatId: "move-screen" }),
    ]),
  ]);
  const complete: ToolCompleter = async (req) => {
    modelCalls++;
    return stub.complete(req);
  };
  const turns: { reason: string; commands: DirectorCommand[] }[] = [];
  const s = createSession(lesson, {
    runner: directingRunner(claudeDirector({ complete, apiKey: "test" }), { onTurn: (t) => turns.push(t) }),
  });
  advance(s, 8);
  s.send(demoSet("v", 11));
  s.send(messageSubmit("Does the hole size change the sharpness?"));
  assert(s.activeBeatId().startsWith("__ask-"), "the learner waits on a thinking leaf, with their own figure still on the stage");

  await settle(() => turns.length === 1, "the AI teacher's answer");
  assert(modelCalls === 1, "one question cost one model call");
  assert(turns[0]!.reason === "question" && turns[0]!.commands.length === 3, "the turn arrived whole: prose, a zoom and a control move together");
  const answerId = s.activeBeatId();
  assert(!answerId.startsWith("__ask-"), "the learner is out of the thinking leaf and into the answer");
  assert((vars(s).__focus as { label?: string }).label === "the aperture", "the zoom the model asked for is on the stage — `say` alone would have been a worse answer");
  assert((s.context.beats["move-screen"] as Record<string, unknown>).v === 13, "and the slider moved on the learner's own channel, not a private one");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "move-screen", "Continue returns them to the beat they asked from: an answer never costs a learner their place");
  assert((s.context.beats["move-screen"] as Record<string, unknown>).v === 13, "with the figure still posed as the AI teacher left it — the re-pose is waiting for them when they get back");

  taught = s;

  const quiet = defineLesson(lessonSpec);
  const heard: DirectorCommand[][] = [];
  const q = createSession(quiet, {
    runner: directingRunner(offlineDirector({ respond: () => [] }), { onTurn: (t) => heard.push(t.commands) }),
  });
  advance(q, 1);
  q.send(messageSubmit("Wait, why is the wall bright everywhere?"));
  await settle(() => heard.length === 1, "the silence floor");
  assert(heard[0]!.length === 1 && heard[0]![0]!.op === "say", "a director that answers a QUESTION with nothing is backstopped by an acknowledgement");
  assert(!q.activeBeatId().startsWith("__ask-"), "so the learner is never left on a thinking leaf waiting for a turn that is not coming");
  q.send({ type: "next" });
  assert(q.activeBeatId() === "wall-2", "and the floor resumes the beat they asked from, like any other answer");

  const race = defineLesson(lessonSpec);
  const gates: Array<(cmds: DirectorCommand[]) => void> = [];
  const gated: Director = { direct: () => new Promise((resolve) => gates.push(resolve)) };
  const landed: DirectorCommand[][] = [];
  const r = createSession(race, { runner: directingRunner(gated, { onTurn: (t) => landed.push(t.commands) }) });
  advance(r, 1);
  r.send(messageSubmit("First question?"));
  await settle(() => gates.length === 1, "the first director call");
  r.send(messageSubmit("Actually, never mind — this instead?"));
  await settle(() => gates.length === 2, "the second director call");
  gates[0]!([{ op: "say", text: "An answer to a question nobody is on any more." }]);
  await sleep(20);
  assert(!landed.length, "the abandoned question's answer is dropped, not delivered late");
  gates[1]!([{ op: "say", text: "Because every point on the wall scatters light in every direction." }]);
  await settle(() => landed.length === 1, "the live question's answer");
  assert(landed.length === 1, "exactly one turn reached the lesson — the interrupt cancelled the other");
  const spokenText = (r.lesson.chart.states[r.activeBeatId()]!.meta as { beat: { params: { text?: string } } }).beat.params.text;
  assert(spokenText!.startsWith("Because every point"), "and it is the answer to the question they are actually waiting on");
}

console.log("\n[freeze → replay: an AI-taught session is an artifact]");
{
  const s = taught!;
  const before = modelCalls;
  const history = s.context.history;
  const back = replay(defineLesson(lessonSpec), history);
  assert(modelCalls === before && before === 1, "replaying an AI-taught session calls the model ZERO further times");
  assert(back.activeBeatId() === s.activeBeatId(), "it lands the learner on the same beat");
  assert(JSON.stringify(back.context.vars) === JSON.stringify(s.context.vars), "with the same zoom (attention is state, and state replays)");
  assert(JSON.stringify(back.context.beats) === JSON.stringify(s.context.beats), "and the same re-posed figure");
  assert(back.context.history.length === history.length, "no extra records: replaying a director's turn is not a second turn");

  const added = history.find((r) => r.event.type === DIRECTION_COMMAND_EVENT);
  assert(added !== undefined, "the turn is in history as ONE `direction.command` event, which is why any of this holds");
  assert((added!.event.payload as { actor?: string }).actor === "ai", "carrying the actor, so the engine's identical treatment of teacher and AI is recoverable");

  const turns = projectTranscript(back.lesson, back.context.history, back.activeBeatId());
  const roles = new Set(turns.map((t) => t.role));
  assert(roles.has("agent") && !roles.has("teacher"), "the rebuilt document attributes the intervention to the AGENT — a learner's day distinguishes them even though the engine does not");
  assert(turns.some((t) => t.role === "learner" && t.kind === "question"), "the learner's question is still theirs");
  assert(turns.some((t) => t.role === "agent" && t.kind === "action"), "and the wordless part of the turn (the zoom, the slider) is its own turn in the log");

  const fromCtx = observe(subjectFromContext(back.lesson, back.context));
  const fromSession = observe(back);
  assert(fromCtx.anchor === fromSession.anchor && fromCtx.step === fromSession.step, "an observation built from a bare CONTEXT matches the Session's own");
  assert(JSON.stringify(fromCtx.stage) === JSON.stringify(fromSession.stage), "including the stage, which is the half a director acts on");
}

console.log("\n[drive: run the other client]");
{
  const bus = createSessionBus();
  const s = open();
  const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    if (!url.endsWith("/sync")) throw new Error(`unexpected request: ${url}`);
    const out: SyncResponse = bus.sync(JSON.parse(String(init?.body ?? "{}")) as SyncRequest);
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(out) } as unknown as Response);
  }) as typeof fetch;
  const client = attachTeachClient(s, { fetchImpl, intervalMs: 10, debounceMs: 0 });
  await settle(() => client.syncs >= 1, "the student page's first sync");
  const transport = busTransport(bus);

  advance(s, 1);
  s.send(messageSubmit("Why does the image come out upside down?"));
  await settle(() => bus.observation()?.pending !== null, "the page pushing the question to the bus");

  const report = await driveDirector({
    transport,
    director: offlineDirector({ fallbackText: "Because rays cross at the hole: the top of the tree lands at the bottom of the screen." }),
    pollMs: 8,
    maxIdlePolls: 5,
    timeoutMs: 2000,
  });
  assert(report.turns.length === 1, "a question wakes the director exactly once, however many times the loop polls");
  assert(report.turns[0]!.reason === "question" && report.turns[0]!.result?.ok === true, "the turn is applied BY THE PAGE and the verdict comes back through the same channel a human reads");
  assert(report.stopped === "maxIdlePolls", "and then it goes back to watching — a loop that has nothing to do does nothing");
  assert(s.activeBeatId() === report.turns[0]!.result!.added[0], "the answer is on the learner's screen");
  assert(bus.log().some((l) => l.kind === "direct" && l.actor === "ai"), "the log records who taught, so a human tailing the session sees the AI's turns in their own stream");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "wall-2", "and the learner is returned to where they asked from");

  const seen: DriveTurn[] = [];
  const stop = new AbortController();
  const running = driveDirector({
    transport,
    director: offlineDirector({ respond: () => [{ op: "annotate", shapes: [{ kind: "circle", at: [0.5, 0.5], r: 0.05 }] }] }),
    reactive: false,
    autonomous: true,
    pollMs: 8,
    timeoutMs: 2000,
    onTurn: (t) => seen.push(t),
    signal: stop.signal,
  });
  await settle(() => seen.length === 1, "the director being offered the situation it sat down in front of");
  assert(seen[0]!.reason === "step", "an autonomous director is offered the situation, not a question");
  await sleep(120);
  assert(seen.length === 1, "and is NOT woken by its own gesture — the poll after a turn re-baselines instead of reacting to it");
  s.send({ type: "next" });
  await settle(() => seen.length === 2, "a learner action waking it again");
  assert(seen[1]!.reason === "step" && seen.length === 2, "so the loop is driven by the person being taught, one turn per thing they do");
  stop.abort();
  const aborted = await running;
  assert(aborted.stopped === "aborted", "SIGINT (or any signal) ends the loop between turns, not mid-turn");

  const t = open();
  advance(t, 8);
  const learnerTurns = (x: Session): number => projectTranscript(x.lesson, x.context.history, x.activeBeatId()).filter((v) => v.role === "learner").length;
  const clock = t.context.history.length;
  const discourse = learnerTurns(t);
  t.send(demoSet("v", 9));
  assert(t.context.history.length === clock + 1, "a slider drag advances the engine's clock…");
  assert(learnerTurns(t) === discourse, "…and adds nothing to the conversation — so a transcript-driven gate would sleep through a learner working the figure");

  const at = (step: number, pending: number | null): Observation =>
    ({ step, pending: pending === null ? null : { text: "?", from: "x", seq: pending } }) as Observation;
  assert(wake(at(5, 3), { reactive: true, autonomous: false, answeredSeq: -1, seenStep: 9 }) === "question", "a question outranks everything: someone is waiting");
  assert(wake(at(5, 3), { reactive: true, autonomous: false, answeredSeq: 3, seenStep: 9 }) === null, "an answered question does not re-wake, even while the observation still reports it");
  assert(wake(at(5, null), { reactive: true, autonomous: false, answeredSeq: -1, seenStep: 1 }) === null, "reactive alone ignores a step: not every change is a request for a teacher");
  assert(wake(at(5, null), { reactive: true, autonomous: true, answeredSeq: -1, seenStep: 1 }) === "step", "autonomous takes it");
  assert(wake(at(5, null), { reactive: true, autonomous: true, answeredSeq: -1, seenStep: 5 }) === null, "…but only once");

  const dry: DriveTurn = await directorTurn({
    transport: { ...transport, direct: async () => ({ turn: 0, queued: 0, applied: false, status: "unknown" as const }) },
    director: offlineDirector({ respond: () => [{ op: "hold", reason: "thinking about it" }] }),
  });
  assert(dry.commands.length === 1 && dry.reason === "nudge", "`--once` with no pending question is a NUDGE: a human asked for a turn");
  assert(dry.response?.applied === false && !("__hold" in vars(s)), "and a dry run removes the ability to send rather than remembering not to — nothing reached the lesson");

  client.detach();
  const orphaned = await driveDirector({ transport: busTransport(createSessionBus()), director: offlineDirector(), pollMs: 8, maxIdlePolls: 3 });
  assert(orphaned.stopped === "disconnected" && !orphaned.turns.length, "a bus with no student page is `disconnected`, not an error: a teacher who sits down early just waits");
  await (async () => {
    let threw = "";
    try {
      await directorTurn({ transport: busTransport(createSessionBus()), director: offlineDirector() });
    } catch (e) {
      threw = e instanceof Error ? e.message : String(e);
    }
    assert(threw.includes("no student page"), "while a one-shot turn says so plainly instead of teaching an empty room");
  })();
}

console.log("\n[the proxy: no key in the bundle, no 500 on the wire]");
{
  const envBefore = { anthropic: process.env.ANTHROPIC_API_KEY, gemini: process.env.GEMINI_API_KEY, path: process.env.PATH, pin: process.env.LS_AI_PROVIDER };
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.LS_AI_PROVIDER;
  delete process.env.GEMINI_MODEL;
  process.env.PATH = "";
  try {
    const bare = directorDevPlugin({ quiet: true });
    const body = (extra: Record<string, unknown> = {}): string =>
      JSON.stringify({ messages: [{ role: "user", text: "hi" }], tools: allDirectorTools(), ...extra });
    assert(!bare.live && !bare.providers.length, "with no key and no CLI the endpoint reports itself dead rather than pretending");
    const noKey = await bare.handle(body({ provider: "anthropic" }));
    assert(noKey.status === 200 && String(noKey.json.error).includes("ANTHROPIC_API_KEY"), "with no key the endpoint SAYS so, at status 200 — a developer reading the network tab learns what to set");
    const noneAtAll = await bare.handle(body({ provider: "auto" }));
    assert(String(noneAtAll.json.error).includes("no AI provider reachable"), "and `auto` with nothing reachable names all three ways to fix it, rather than blaming the one it tried first");
    assert(String((await bare.handle(body({ provider: "openai" }))).json.error).includes('unknown provider "openai"'), "a provider the endpoint does not implement is refused by name — a typo must not silently fall back to another model");
    assert(!directorIsLive(), "and the seam reports itself offline…");
    const offline = await pickDirector().direct({
      observation: { pending: { text: "Why upside down?", from: "wall-2", seq: 3 } } as Observation,
      text: "",
      reason: "question",
      capabilities: FULL,
    });
    assert(offline.length === 1 && offline[0]!.op === "say", "…so the keyless default is a deterministic director that still answers the learner");
    assert(directorIsLive({ apiKey: "test" }), "one env var (or an injected completer) is the whole difference between a scripted teacher and a real one");

    assert((await bare.handle("{oops")).status === 400, "a malformed body is a 400");
    assert((await bare.handle(JSON.stringify({ tools: allDirectorTools() }))).status === 400, "so is a request with no messages");
    assert((await bare.handle(JSON.stringify({ messages: [{ role: "user", text: "hi" }] }))).status === 400, "and one with no tools — the endpoint is not a general proxy");
    const failing = directorDevPlugin({
      quiet: true,
      complete: async () => {
        throw new Error("upstream 529 overloaded");
      },
    });
    const failed = await failing.handle(JSON.stringify({ messages: [{ role: "user", text: "hi" }], tools: allDirectorTools() }));
    assert(failed.status === 200 && String(failed.json.error).includes("529"), "a provider failure comes back as `{error}`, never a 500: the browser turns it into an empty turn, not an exception");

    assert(directorDevPlugin({ quiet: true, apiKey: "a", geminiApiKey: "g" }).providers.join(",") === "anthropic,gemini", "an explicitly provisioned Anthropic key outranks a Gemini one, and both outrank the zero-config CLI — a deliberate choice beats a found one, and it is also strongest-tool-calling-contract first");
    assert(directorDevPlugin({ quiet: true, geminiApiKey: "g" }).providers.join(",") === "gemini", "…and with only the second key present, `auto` is Gemini rather than an error");

    await (async () => {
      const gem = directorDevPlugin({ quiet: true, geminiApiKey: "g-test" });
      const sent: Array<{ url: string; body: Record<string, unknown> }> = [];
      const realFetch = globalThis.fetch;
      globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
        sent.push({ url: String(url), body: JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown> });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                finishReason: "STOP",
                content: {
                  parts: [
                    { text: "(internal deliberation)", thought: true },
                    { functionCall: { name: "setControl", args: { key: "v", value: "12" } } },
                  ],
                },
              },
            ],
          }),
        } as unknown as Response;
      }) as typeof fetch;
      try {
        const out = await gem.handle(
          JSON.stringify({
            provider: "gemini",
            system: "you are the teacher",
            messages: [{ role: "user", text: "the situation" }, { role: "assistant", text: "my last reply" }],
            tools: allDirectorTools(),
            model: "claude-opus-5",
          }),
        );
        const { url, body: req } = sent[0]!;
        assert(url.includes("key=g-test") && !JSON.stringify(req).includes("g-test"), "the key rides in the query string Gemini expects and nowhere else");
        assert(url.includes("models/gemini-") && !url.includes("claude"), "a model id belonging to another provider is NOT forwarded — each names its models differently, and a foreign id is a 404 at best");
        await gem.handle(JSON.stringify({ provider: "gemini", messages: [{ role: "user", text: "hi" }], tools: allDirectorTools(), model: "gemini-2.5-pro" }));
        assert(sent[1]!.url.includes("models/gemini-2.5-pro"), "while an id that IS Gemini's is passed through, so a developer can pin one");

        const contents = req.contents as Array<{ role: string; parts: Array<{ text: string }> }>;
        assert((req.systemInstruction as { parts: Array<{ text: string }> }).parts[0]!.text === "you are the teacher", "the system prompt travels as `systemInstruction`, not as a first user turn");
        assert(contents[0]!.role === "user" && contents[1]!.role === "model", "and the nudge round's assistant turn becomes role `model` — Gemini 400s on a role it does not know, which is exactly the path a nudge takes");
        assert((req.toolConfig as { functionCallingConfig: { mode: string } }).functionCallingConfig.mode === "AUTO", "tool use is AUTO by default: deciding whether to act at all is the judgement we most want the model exercising");
        assert((req.generationConfig as { maxOutputTokens: number }).maxOutputTokens >= 1024, "with a floor under the token budget, because Gemini 3 spends it on thinking FIRST and a small one returns nothing at all");

        const decls = (req.tools as Array<{ functionDeclarations: Array<Record<string, unknown>> }>)[0]!.functionDeclarations;
        const byName = new Map(decls.map((d) => [String(d.name), d]));
        assert(decls.length === DIRECTOR_OPS.length + 1, "every op is offered here too — one vocabulary, whichever provider answers");
        assert(!("parameters" in byName.get("release")!), "a no-argument tool OMITS `parameters` entirely: Gemini rejects an OBJECT schema with empty properties, and `release` is exactly that");
        const params = (d: string): Record<string, Record<string, unknown>> => (byName.get(d)!.parameters as { properties: Record<string, Record<string, unknown>> }).properties;
        assert(params("say").resume!.type === "string" && params("say").resume!.nullable === true, "`[\"string\",\"null\"]` becomes `nullable`, since Gemini's `type` is one enum value and an array there is a 400 rather than a coercion");
        assert(params("setControl").value!.type === "string" && String(params("setControl").value!.description).includes("JSON encoded in a string"), "a field of ANY type travels as JSON TEXT, and the model is told so in the schema itself");

        const calls = out.json.calls as ToolCall[];
        assert(out.json.provider === "gemini" && String(out.json.model).startsWith("gemini"), "the response reports which provider and model actually answered — `auto` must not be a mystery afterwards");
        assert(calls.length === 1 && calls[0]!.name === "setControl", "a `functionCall` part comes back as a tool call…");
        assert((calls[0]!.input as { value: unknown }).value === 12, "…with the stringified field PARSED BACK, so `setControl v 12` is a number and not the string \"12\" — encoder and decoder ask one `isOpen`, so they cannot drift");
        assert(!!calls[0]!.id, "and a synthesized call id, because a ToolCall without one would be a lie");
        assert(String(out.json.text) === "", "the `thought: true` part is dropped: internal deliberation is not the turn's prose");
      } finally {
        globalThis.fetch = realFetch;
      }
    })();

    {
      const tools = allDirectorTools();
      const fenced = parsePromptedTurn('Here is my turn:\n```json\n[{"name":"say","input":{"text":"Rays cross at the hole."}}]\n```', tools);
      assert(fenced.calls.length === 1 && (fenced.calls[0]!.input as { text: string }).text === "Rays cross at the hole.", "a fenced JSON array is read as the turn it is");
      assert(fenced.text === "Here is my turn:", "and the array is stripped from the prose, so a `say` is not echoed twice");
      const bare2 = parsePromptedTurn('[{"name":"focus","args":{"scale":2}},{"name":"release","arguments":{}}]', tools);
      assert(bare2.calls.length === 2 && bare2.calls[1]!.name === "release", "an unfenced array works too, and `args`/`arguments` are accepted beside `input` — a model that picked the other spelling still acted");
      assert((parsePromptedTurn('[{"name":"setControl","input":{"key":"v","value":"12"}}]', tools).calls[0]!.input as { value: unknown }).value === 12, "and a stringified value is restored against the same schema Gemini's is — one decoder for both prompted dialects");
      const prose = parsePromptedTurn("I would explain that the aperture sets the sharpness.", tools);
      assert(!prose.calls.length && prose.text.startsWith("I would explain"), "a reply with no array is NOT an error: it is prose with no calls, which is the case the director's nudge round exists to answer");
      assert(!parsePromptedTurn("[not json at all", tools).calls.length, "and neither is unparseable JSON — the turn is empty and the lesson plays on");
      assert(restoreArgs(undefined, { anything: "x" }).anything === "x", "arguments for a tool that is not in the table pass through untouched — naming an unknown tool is `commandsFromCalls`'s verdict to give, not the decoder's");
    }

    await (async () => {
      const mounts = new Map<string, (req: DevReq, res: DevRes, next: () => void) => void>();
      bare.configureServer({ middlewares: { use: (p, h) => void mounts.set(p, h) } });
      assert(mounts.has("/api/direct"), "the plugin mounts its path on the dev server it is handed");
      const mounted = mounts.get("/api/direct")!;

      let fellThrough = false;
      mounted({ method: "GET", on: () => {} }, { statusCode: 0, setHeader: () => {}, end: () => {} }, () => {
        fellThrough = true;
      });
      assert(fellThrough, "and a non-POST falls through to the next middleware rather than being answered or 405'd");

      const emit: Record<string, ((arg?: unknown) => void)[]> = {};
      const req: DevReq = {
        method: "POST",
        on: (ev: string, cb: (arg?: unknown) => void) => void (emit[ev] ??= []).push(cb),
      } as DevReq;
      const res = {
        statusCode: 0,
        headers: {} as Record<string, string>,
        body: "",
        setHeader(n: string, v: string) {
          this.headers[n] = v;
        },
        end(b?: string) {
          this.body = b ?? "";
        },
      };
      let nexted = false;
      mounted(req, res as unknown as DevRes, () => {
        nexted = true;
      });
      const whole = JSON.stringify({ messages: [{ role: "user", text: "hi" }], tools: allDirectorTools() });
      for (const chunk of [whole.slice(0, 11), whole.slice(11)]) for (const cb of emit.data ?? []) (cb as (c: string) => void)(chunk);
      for (const cb of emit.end ?? []) cb();
      for (let i = 0; i < 200 && !res.body; i++) await new Promise((r) => setTimeout(r, 1));
      assert(!nexted && res.statusCode === 200, "a POST is handled here, at the status the handler chose");
      assert(res.headers["content-type"] === "application/json", "declared as JSON, so a browser parses it instead of guessing");
      assert(String((JSON.parse(res.body) as { error?: string }).error).includes("ANTHROPIC_API_KEY"), "and the body is the handler's own answer — the split body reassembled before it ran, or the endpoint would have seen `{\"messages\":` and called it malformed");
    })();

    const posted: string[] = [];
    const served = directorDevPlugin({
      quiet: true,
      complete: async (req) => {
        assert(req.apiKey === undefined, "the proxy hands the provider no key from the request — auth is the SERVER's job, always");
        return spoke("", [call("say", { text: "Rays cross at the hole, so the image lands inverted." })]);
      },
    });
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      const body = String(init?.body ?? "");
      posted.push(body);
      const out = await served.handle(body);
      return { ok: true, status: out.status, json: async () => out.json } as unknown as Response;
    }) as typeof fetch;
    try {
      const inPage = await claudeDirector({ complete: httpToolCompleter("/api/direct") }).direct({
        observation: { pending: null } as Observation,
        text: "## WHERE\n  anchor  wall-2",
        reason: "question",
        capabilities: FULL,
      });
      assert(inPage.length === 1 && inPage[0]!.op === "say", "a page with no credential can still drive the AI teacher, through the proxy");
      assert(!/apiKey|api_key|sk-ant/.test(posted[0]!), "and the request it sent carries NO credential field at all — the negative the browser walks also assert");
      assert(JSON.parse(posted[0]!).tools.length === DIRECTOR_OPS.length + 1, "the tools travel with the request, so the proxy stays a pipe and never a second vocabulary");
    } finally {
      globalThis.fetch = realFetch;
    }
  } finally {
    const restore = (k: "ANTHROPIC_API_KEY" | "GEMINI_API_KEY" | "PATH" | "LS_AI_PROVIDER", v: string | undefined): void => {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    };
    restore("ANTHROPIC_API_KEY", envBefore.anthropic);
    restore("GEMINI_API_KEY", envBefore.gemini);
    restore("LS_AI_PROVIDER", envBefore.pin);
    restore("PATH", envBefore.path);
  }
}

console.log(
  `\nAI TEACHER PASSED — ${passed}/${passed} checks: the tool surface is the command union, one model call per turn, ` +
    `capabilities still refused at the engine's gate, a learner's question answered in-session and dropped when abandoned, ` +
    `an AI-taught session replayed with the model unreachable, the drive loop driven by the learner rather than by itself, ` +
    `three providers resolved behind one endpoint, and no credential anywhere near the page.`,
);
