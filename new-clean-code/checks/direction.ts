import {
  catalog,
  createSession,
  demoSet,
  formatObservation,
  formatResult,
  messageSubmit,
  observe,
  projectTranscript,
  replay,
  FULL,
  OBSERVE_ONLY,
  SUPERVISED,
  DIRECTION_COMMAND_EVENT,
  type Capabilities,
  type DirectorCommand,
  type EventRecord,
  type Session,
} from "@lessonstudio/lesson";
import { defineLesson } from "@lessonstudio/authoring";
import { attachTeachClient, busTransport, createSessionBus, type SyncRequest, type SyncResponse } from "@lessonstudio/teach";
import { lessonSpec } from "../examples/pinhole/lesson.js";

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

function open(): Session {
  return createSession(defineLesson(lessonSpec), { runner: { run() {} } });
}

function advance(s: Session, n: number): void {
  for (let i = 0; i < n; i++) s.send({ type: "next" });
}

const vars = (s: Session): Record<string, unknown> => s.context.vars as unknown as Record<string, unknown>;
const local = (s: Session, id: string): Record<string, unknown> => (s.context.beats[id] as Record<string, unknown> | undefined) ?? {};

console.log("\n[vocabulary: every op, on the real lesson]");
{
  const s = open();
  advance(s, 1);
  assert(s.activeBeatId() === "wall-2", "the learner is standing at wall-2 before anyone intervenes");

  const said = s.direct({ op: "say", text: "Quick aside: the wall scatters every ray into every direction.", narrate: "Quick aside." });
  assert(said.ok && said.added.length === 1, "say is accepted and ADDS one beat (it is sugar over addBeat)");
  const asideId = said.added[0]!;
  assert(s.activeBeatId() === asideId, "the learner is moved into the aside immediately");
  assert(said.notes[0]!.startsWith('said "Quick aside'), "the note reads back what was said, clipped");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "wall-2", "and Continue returns them to exactly where they were interrupted");

  const asideBeat = (s.lesson.chart.states[asideId]!.meta as { beat: { params: Record<string, unknown> } }).beat;
  const asideViz = asideBeat.params.viz as { name?: string } | undefined;
  assert(asideViz?.name === "pinhole-3d", "the aside inherited the apparatus rather than blanking the stage");
  assert(asideBeat.params.narration === "Quick aside.", "and `narrate` rode through as the beat's narration");

  const zoomed = s.direct([
    { op: "focus", at: [0.4, 0.55], scale: 4, label: "the hole" },
    { op: "annotate", shapes: [{ kind: "arrow", from: [0.2, 0.3], to: [0.4, 0.55], label: "in here" }, { kind: "circle", at: [0.4, 0.55], r: 0.08 }] },
  ]);
  assert(zoomed.ok, "focus + annotate are accepted as ONE gesture");
  const focus = vars(s).__focus as { rect: { x: number; y: number; w: number; h: number }; label?: string };
  assert(focus.rect.w === 0.25 && focus.rect.h === 0.25, "at+scale lowered to a normalized rect (scale 4 ⇒ a quarter of the stage)");
  assert(Math.abs(focus.rect.x - 0.275) < 1e-9 && Math.abs(focus.rect.y - 0.425) < 1e-9, "centred on the point the teacher named");
  assert(focus.label === "the hole", "the caption came with it");
  assert((vars(s).__annotations as unknown[]).length === 2, "both marks are on the stage");
  assert(s.activeBeatId() === "wall-2", "pointing at the figure did NOT move the learner");

  s.direct({ op: "annotate", shapes: [{ kind: "label", at: [0.5, 0.9], text: "watch this" }] });
  assert((vars(s).__annotations as unknown[]).length === 1, "a second annotate REPLACES the marks rather than stacking them");
  s.direct([{ op: "focus", clear: true }, { op: "annotate", clear: true }]);
  assert(!("__focus" in vars(s)) && (vars(s).__annotations as unknown[]).length === 0, "clearing leaves no residue in vars (absent, not null)");

  s.direct({ op: "hold", reason: "one sec, building you something" });
  assert((vars(s).__hold as { reason: string }).reason === "one sec, building you something", "hold records the reason the learner is shown");
  s.direct({ op: "release" });
  assert(!("__hold" in vars(s)), "release removes it");

  advance(s, 7);
  assert(s.activeBeatId() === "move-screen", "walked to the explorable");
  const posed = s.direct([
    { op: "setControl", key: "v", value: 13 },
    { op: "workspace", props: { highlight: ["v"] }, label: "highlighted the screen distance" },
  ]);
  assert(posed.ok, "setControl + workspace accepted");
  assert(local(s, "move-screen").v === 13, "the director's value lands FLAT — the same key the learner's own slider writes");
  assert((local(s, "move-screen").__ws as Record<string, unknown>).highlight !== undefined, "and the viz-side patch lands under __ws, not mixed in with it");
  s.send(demoSet("v", 9));
  assert(local(s, "move-screen").v === 9, "the learner can still overwrite it — a director shares the channel, it does not own it");
  s.direct({ op: "setControls", values: { v: 12 } });
  assert(local(s, "move-screen").v === 12, "setControls is the same channel, several keys at once");

  advance(s, 1);
  assert(s.activeBeatId() === "gate-m", "the learner moved on to the second gate");
  const back = s.direct({ op: "revisit", beatId: "move-screen", note: "same figure, new eyes" });
  assert(back.ok && back.added.length === 1, "revisit CLONES the beat rather than jumping to it");
  const cloneId = back.added[0]!;
  const clone = (s.lesson.chart.states[cloneId]!.meta as { beat: { type: string; params: Record<string, unknown> } }).beat;
  assert(clone.type === "explorable", "the clone keeps the original's type");
  assert((clone.params.defaults as Record<string, unknown>).v === 12, "and is posed with the learner's LIVE value (12), not the authored default (7)");
  assert(clone.params.narration === undefined, "narration is dropped — a revisit is pointing back, not re-lecturing");
  assert(s.lesson.chart.states["move-screen"] !== undefined, "the original is untouched, so their place is never overwritten");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "gate-m", "Continue from the clone returns them to the gate they were on");

  const added = s.direct({
    op: "addBeat",
    spec: { id: "teacher-detour", type: "explain", params: { text: "## A detour\nTwo similar triangles, nothing more." }, next: "gate-m" },
    enter: false,
  });
  assert(added.ok && !added.enteredId, "addBeat with enter:false installs a beat WITHOUT moving the learner");
  const patched = s.direct({ op: "patchBeat", beatId: "teacher-detour", params: { text: "## A detour\nSimilar triangles — that is the whole idea." } });
  assert(patched.ok && patched.patched[0] === "teacher-detour", "patchBeat re-authors params in place");
  const rewired = s.direct({ op: "setNext", beatId: "teacher-detour", target: "move-object" });
  assert(rewired.ok && rewired.rerouted[0] === "teacher-detour", "setNext rewrites the advance edge");
  const jumped = s.direct({ op: "goto", beatId: "teacher-detour" });
  assert(jumped.ok && s.activeBeatId() === "teacher-detour", "goto moves the learner and changes no edges");
  s.send({ type: "next" });
  assert(s.activeBeatId() === "move-object", "the rewired edge is the one the learner actually takes");

  const directed = s.context.history.filter((r) => r.event.type === DIRECTION_COMMAND_EVENT);
  assert(directed.length === 13, `all 13 accepted turns are recorded as direction.command events (got ${directed.length})`);
}

console.log("\n[atomicity: all-or-nothing, and never in history]");
{
  const s = open();
  advance(s, 2);
  const before = { at: s.activeBeatId(), step: s.context.history.length, states: Object.keys(s.lesson.chart.states).length };

  const dangling = s.direct([{ op: "focus", at: [0.5, 0.5], scale: 2 }, { op: "goto", beatId: "no-such-beat" }]);
  assert(!dangling.ok && dangling.error?.kind === "invalid", "a dangling target is refused as invalid");
  assert(dangling.error!.problems![0]!.code === "DANGLING_TARGET", "with the structural problem named, so a director can fix it");
  assert(!("__focus" in vars(s)), "the VALID focus in the same batch did not apply either — the turn was atomic");
  assert(s.context.history.length === before.step, "and nothing reached history, so replay never sees a failed turn");

  const badSpec = s.direct([
    { op: "say", text: "this part is fine" },
    { op: "addBeat", spec: { id: "broken", type: "explain", params: { text: "x" }, next: "nowhere" } },
  ]);
  assert(!badSpec.ok, "a batch whose LAST command is bad is refused whole");
  assert(s.lesson.chart.states.broken === undefined, "the bad beat is absent");
  assert(Object.keys(s.lesson.chart.states).length === before.states, "and so is the good one in front of it — no beat was installed at all");
  assert(s.activeBeatId() === before.at, "the learner never moved");

  const inlineFn = s.direct({
    op: "addBeat",
    spec: { id: "impure", type: "explain", params: { text: "x" }, next: null, __actions: { boom: () => {} } } as never,
  });
  assert(!inlineFn.ok, "a runtime beat carrying an inline function is refused — it could not replay from the log");

  const strand = s.direct({ op: "setNext", beatId: "sharp", target: "wall-1" });
  assert(!strand.ok, "a reroute that makes the ending unreachable is refused");
  assert(strand.error!.problems?.[0]?.code === "NO_TERMINAL", "with NO_TERMINAL — the level-completable invariant, checked in one place");

  const selfLoop = s.direct({ op: "addBeat", spec: { id: "cul-de-sac", type: "explain", params: { text: "no way out" }, next: "cul-de-sac" }, enter: true });
  assert(!selfLoop.ok, "an ADDED beat that loops to itself is refused when the learner is put on it");
  assert(selfLoop.error!.problems?.[0]?.code === "NO_TERMINAL", "same NO_TERMINAL — entering a beat is a move, so it is checked like one");
  assert(s.lesson.chart.states["cul-de-sac"] === undefined && s.activeBeatId() === before.at, "and nothing was installed, so the learner is where they were");

  const unknownOp = s.direct({ op: "levitate" } as unknown as DirectorCommand);
  assert(!unknownOp.ok && unknownOp.error?.kind === "error", "an op the engine does not implement is REJECTED, never silently dropped");
  assert(s.context.history.length === before.step, "after six refused turns, history is still untouched");

  const recovered = s.direct({ op: "focus", at: [0.5, 0.5], scale: 2 });
  assert(recovered.ok && "__focus" in vars(s), "and the next well-formed turn from the same director lands normally");
  const parked = s.direct({ op: "addBeat", spec: { id: "cul-de-sac", type: "explain", params: { text: "no way out" }, next: "cul-de-sac" }, enter: false });
  assert(parked.ok, "the same self-looping beat with enter:false is ALLOWED — a dead end nobody is standing in strands nobody");
}

console.log("\n[isolation: directing one learner's lesson does not touch another's]");
{
  const shared = defineLesson(lessonSpec);
  const original = (shared.chart.states["wall-3"]!.on!.next ?? [])[0]?.target;
  const a = createSession(shared, { runner: { run() {} } });
  const b = createSession(shared, { runner: { run() {} } });
  const textOf = (s: Session, id: string): string =>
    String(((s.lesson.chart.states[id]!.meta as { beat: { params: { text?: unknown } } }).beat.params.text ?? ""));
  const bTextBefore = textOf(b, "wall-2");

  assert(a.direct({ op: "setNext", beatId: "wall-3", target: "recap" }).ok, "A's teacher reroutes wall-3 → recap");
  assert(a.direct({ op: "patchBeat", beatId: "wall-2", params: { text: "## Rewritten for A only" } }).ok, "and re-authors wall-2 for them");

  advance(a, 3);
  advance(b, 3);
  assert(a.activeBeatId() === "recap", "A takes the rerouted edge");
  assert(b.activeBeatId() === "hole-1", "B takes the ORIGINAL edge — the reroute never reached them");
  assert(textOf(b, "wall-2") === bTextBefore, "and B's wall-2 still says what the author wrote");
  assert((shared.chart.states["wall-3"]!.on!.next ?? [])[0]?.target === original, "the compiled lesson itself is pristine, so it can still seed a third learner");

  const probe = (correct: number): DirectorCommand => ({
    op: "addBeat",
    spec: {
      id: "probe",
      type: "mcq",
      params: { prompt: "which one?", choices: [{ text: "first", correct: correct === 0 }, { text: "second", correct: correct === 1 }] },
      next: "recap",
    },
    enter: true,
  });
  assert(a.direct(probe(0)).ok && b.direct(probe(1)).ok, "both learners get a beat called `probe`, keyed the same, graded differently");
  a.send({ type: "mcq.answer", payload: { choice: 0 } });
  b.send({ type: "mcq.answer", payload: { choice: 0 } });
  assert(local(a, "probe").lastCorrect === true, "A's answer is graded against A's OWN choices");
  assert(local(b, "probe").lastCorrect === false, "and B's against B's — one registry slot per session, not per compile");
}

console.log("\n[capabilities: one enforcement point, through the public door]");
{
  const s = open();
  advance(s, 2);

  assert(s.direct({ op: "focus", at: [0.5, 0.5], scale: 2 }, "ai", FULL).ok, "FULL permits everything (the tier-3 default: unrestricted)");

  const watched = s.direct({ op: "focus", at: [0.5, 0.5], scale: 3 }, "ai", OBSERVE_ONLY);
  assert(!watched.ok && watched.error?.kind === "denied", "OBSERVE_ONLY refuses even a focus — allow:[] denies every op");
  assert(watched.error!.detail.includes("observe-only"), "and names the regime, so a director can see why rather than guess");

  assert(s.direct({ op: "setControl", key: "v", value: 11, beatId: "move-screen" }, "ai", SUPERVISED).ok, "SUPERVISED still allows re-posing the visual");
  assert(s.direct({ op: "hold", reason: "thinking" }, "ai", SUPERVISED).ok, "…and pacing the learner");
  for (const cmd of [
    { op: "say", text: "let me add a beat" },
    { op: "addBeat", spec: { id: "sup-1", type: "explain", params: { text: "x" }, next: null } },
    { op: "goto", beatId: "wall-1" },
    { op: "revisit", beatId: "wall-1" },
  ] as DirectorCommand[]) {
    const r = s.direct(cmd, "ai", SUPERVISED);
    assert(!r.ok && r.error?.op === cmd.op && r.error.detail.includes("approval"), `SUPERVISED sends ${cmd.op} for approval instead of executing it`);
    assert(r.error!.kind === "review", `${cmd.op} is reported as \`review\`, distinctly from a flat denial`);
  }
  assert(watched.error!.kind === "denied", "while an op no approval could unlock stays `denied` — the two are not one word");
  assert(formatResult(s.lastResult!).includes("resending will not change"), "and the rendered verdict tells a director not to retry a review refusal (retrying is what it would otherwise do)");
  assert(formatResult(watched).includes("Fix and resend"), "whereas every other rejection still says fix and resend");
  assert(s.lesson.chart.states["sup-1"] === undefined, "a turn awaiting approval is a REJECTION, not engine-held pending state (nothing to replay, nothing to leak)");

  const capped: Capabilities = { name: "two-per-turn", allow: "*", maxPerTurn: 2 };
  assert(s.direct([{ op: "hold" }, { op: "release" }], "ai", capped).ok, "maxPerTurn accepts a turn at the cap");
  const over = s.direct([{ op: "hold" }, { op: "release" }, { op: "hold" }], "ai", capped);
  assert(!over.ok && over.error!.detail.includes("more than 2"), "and REFUSES one over it rather than truncating (a truncated turn would look like it landed)");

  const protective: Capabilities = { name: "spine-protected", allow: "*", protect: ["gate-invert"] };
  const attacked = s.direct({ op: "patchBeat", beatId: "gate-invert", params: { hint: "the answer is B" } }, "ai", protective);
  assert(!attacked.ok && attacked.error!.detail.includes("protected"), "a protected beat cannot be re-authored — the graded spine stays graded");
  assert(s.direct({ op: "revisit", beatId: "gate-invert" }, "ai", protective).ok, "but it can still be REVISITED, because protecting a beat limits editing, not teaching");

  const legal = s.direct({ op: "say", text: "recorded under FULL" }, "teacher", FULL);
  assert(legal.ok, "a turn accepted under FULL is in history");
  const back = replay(defineLesson(lessonSpec), s.context.history);
  assert(back.lesson.chart.states[legal.added[0]!] !== undefined, "and replays with no capability check at all — history is not re-adjudicated");
}

console.log("\n[replay: the taught session rebuilds from its own log]");
{
  const s = open();
  advance(s, 3);
  s.send(messageSubmit("Why is the image upside down?"));
  const answer = s.direct({ op: "say", text: "Because the rays cross at the hole: the top of the tree ends up at the bottom." });
  assert(answer.ok, "…and the teacher answers it by hand — the same door a model will use");
  assert(s.activeBeatId() === answer.added[0], "the answer is what the learner is looking at");
  s.send({ type: "next" });
  advance(s, 5);
  assert(s.activeBeatId() === "move-screen", "the walk continues into the explorable");
  s.direct([{ op: "setControl", key: "v", value: 13 }, { op: "focus", at: [0.6, 0.5], scale: 2.5, label: "the screen" }]);
  s.direct({ op: "revisit", beatId: "triangles", note: "compare it with the ratio" });
  s.send({ type: "next" });
  s.direct({ op: "hold", reason: "let me pull up the derivation" });

  const history: EventRecord[] = s.context.history;
  const teacherTurns = history.filter((r) => r.event.type === DIRECTION_COMMAND_EVENT).length;
  assert(teacherTurns === 4, "four teacher turns are in the log");

  const back = replay(defineLesson(lessonSpec), history);
  assert(back.activeBeatId() === s.activeBeatId(), "replay lands the learner on the same beat");
  assert(JSON.stringify(back.context.vars) === JSON.stringify(s.context.vars), "with the same focus/hold vars (attention is state, and state replays)");
  assert(JSON.stringify(back.context.beats) === JSON.stringify(s.context.beats), "and the same blackboard — the re-posed figure comes back re-posed");
  assert(back.context.history.length === history.length, "no extra records: replaying a direction is not a second direction");
  assert(back.lesson.chart.states[answer.added[0]!] !== undefined, "the beat the teacher wrote mid-lesson EXISTS in the rebuilt chart");
  assert(JSON.stringify(back.context.score) === JSON.stringify(s.context.score), "progress is identical");

  const turns = projectTranscript(back.lesson, back.context.history, back.activeBeatId());
  const roles = new Set(turns.map((t) => t.role));
  assert(roles.has("teacher"), "the rebuilt transcript attributes the intervention to the TEACHER, not the tutor");
  assert(turns.some((t) => t.role === "learner" && t.kind === "question"), "the learner's question is still theirs");
  const gestures = turns.filter((t) => t.role === "teacher" && t.kind === "action");
  assert(gestures.length >= 2, "and the wordless gestures (zoom, re-pose, pause) are their own turns in the log");
  assert(!turns.some((t) => t.kind === "action" && /rerouted|patched/.test(JSON.stringify(t.content))), "structural edits stay OUT of the learner's document — they belong in the teacher's log");
}

console.log("\n[observe + format: one serialization for a terminal and a prompt]");
{
  const s = open();
  advance(s, 8);
  assert(s.activeBeatId() === "move-screen", "at the explorable");
  s.send(demoSet("v", 11));
  s.direct([{ op: "focus", rect: { x: 0.1, y: 0.2, w: 0.5, h: 0.5 }, label: "the screen" }, { op: "annotate", shapes: [{ kind: "circle", at: [0.5, 0.5], r: 0.1 }] }]);
  s.send(messageSubmit("Does the hole size change the sharpness?"));

  const obs = observe(s);
  assert(obs.step === s.context.history.length, "the observation carries the step, so a director can tell a stale frame from a fresh one");
  assert(obs.anchor === "move-screen", "the ANCHOR resolves the ephemeral thinking leaf back to the real beat");
  assert(obs.at?.id.startsWith("__ask-") === true, "…while `at` reports where the learner literally is");
  assert(obs.stage.values.v === 11, "the live control value is in the observation (the figure as posed, not as authored)");
  assert(obs.focus?.label === "the screen" && obs.annotations.length === 1, "so are the focus and the marks");
  assert(obs.pending?.text === "Does the hole size change the sharpness?", "and the unanswered question, which is the thing a teacher is there to notice");
  assert(obs.last?.ok === true, "the verdict on the PREVIOUS turn rides along — what turns a blind emitter into one that can self-correct");
  assert(obs.recent.length > 0 && obs.recent.every((t) => typeof t.text === "string"), "recent turns are flattened to plain text for a log or a prompt");
  assert(obs.catalog?.beats.some((b) => b.id === "move-screen" && b.controls?.includes("v")) === true, "the catalog names the control keys a command may set");

  const text = formatObservation(obs);
  for (const marker of ["## LAST TURN — ACCEPTED", "## LEARNER ASKED", "## WHERE", "## STAGE", "## RECENT", "## BEATS"]) {
    assert(text.includes(marker), `the rendered screen has a ${marker} section`);
  }
  assert(text.includes("anchor  move-screen"), "it states the anchor explicitly, since that is what an untargeted command hits");
  assert(text.includes("v=11"), "and the posed value");
  assert(!formatObservation(obs, { catalog: false }).includes("## BEATS"), "a polling client can drop the catalog to keep frames small");
  assert(formatObservation(obs, { help: true }).includes(`{"op":"say"`), "and ask for the command reference — the same bytes that become a model's system prompt");

  const refused = s.direct({ op: "goto", beatId: "nope" });
  const rendered = formatResult(refused);
  assert(rendered.includes("REJECTED") && rendered.includes("NOTHING was applied"), "a refusal says plainly that nothing applied, so a director resends rather than assuming");
  assert(formatObservation(observe(s)).includes(rendered), "and the next observation carries that exact text — one serialization, no second rendering to drift");

  const cat = catalog(s.lesson);
  assert(cat.spine[0] === cat.entry && cat.spine.includes("recap"), "the catalog's spine is the authored order");
  assert(cat.visuals.includes("pinhole-3d"), "and it lists the visuals a `say` may reuse by name");
}

console.log("\n[showing: a question about the screen is answerable from the observation alone]");
{
  const s = open();
  advance(s, 1);
  assert(s.activeBeatId() === "wall-2", "at the beat that DISPLAYS the Lambertian integral");
  s.send(messageSubmit("what's this integral?"));

  const obs = observe(s, { catalog: false });
  assert(obs.at?.id.startsWith("__ask-") === true, "the learner is on an ephemeral thinking leaf…");
  assert(obs.anchor === "wall-2", "…but the anchor is the beat they asked FROM");
  assert(obs.showing.includes("Reflection off a matte (Lambertian) wall"), "`showing` carries the anchor's heading — an interruption does not erase the subject of the question");
  assert(obs.showing.includes("\\int_{\\Omega}") && obs.showing.includes("d\\omega_i"), "and the FORMULA itself, which is the thing 'this integral' points at");
  assert(obs.showing.includes("$$"), "math keeps its delimiters, so a reader can see where the formula starts and stops");
  assert(
    !obs.showing.includes("\\textcolor") && !obs.showing.includes("\\htmlClass"),
    "…but not the colour markup, in EITHER shape: colour is applied on the way to the screen, and a reader decoding #f87171 (or ls-sym-Lr) to find L_r is worse off",
  );
  assert(obs.showing.includes("average"), "the prose after the formula comes too — the gloss the lesson already gives");

  const text = formatObservation(obs);
  assert(text.includes("## ON SCREEN (wall-2)"), "the teacher's terminal shows it under its own heading, named with the beat it came from");
  assert(text.split("## ON SCREEN")[1]!.includes("\\frac{\\rho}{\\pi}"), "verbatim and un-elided — this is the one section a teacher cannot reconstruct from the rest");
  assert(
    !obs.recent.some((t) => t.text.includes("\\textcolor") || t.text.includes("\\htmlClass")),
    "and the same flattening cleans the transcript lines, which had the same wall of markup",
  );

  const bare = open();
  const obs2 = observe(bare, { catalog: false, showingMax: 20 });
  assert(typeof obs2.showing === "string", "`showing` is always a string, never undefined");
  const clipped = observe(s, { catalog: false, showingMax: 40 });
  assert(clipped.showing.length < obs.showing.length && clipped.showing.includes("clipped"), "an absurdly long beat is clipped VISIBLY — a teacher shown half a formula silently is worse off than one told it was cut");
}

console.log("\n[bus: the student page is authoritative, the bus can only ask]");
{
  const bus = createSessionBus();
  const s = open();
  advance(s, 2);

  const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    if (!url.endsWith("/sync")) throw new Error(`unexpected request: ${url}`);
    const req = JSON.parse(String(init?.body ?? "{}")) as SyncRequest;
    const out: SyncResponse = bus.sync(req);
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(out) } as unknown as Response);
  }) as typeof fetch;

  const client = attachTeachClient(s, { fetchImpl, intervalMs: 15, debounceMs: 0 });
  await settle(() => client.syncs >= 1, "the page's first sync");
  assert(bus.connected && bus.step === s.context.history.length, "the page announces itself and its step on the first sync");
  assert(bus.observation()?.anchor === s.activeBeatId(), "the bus holds the observation the PAGE pushed — it never computes one");
  assert(bus.log().some((l) => l.kind === "note" && l.text.includes("connected")), "and the log opens with the connection");
  assert(bus.log().some((l) => l.kind === "event" && l.type === "next"), "the learner's own moves are in the same log the teacher tails");

  const teacher = busTransport(bus);
  const state = await teacher.observe();
  assert(state.text.includes("## WHERE"), "the teacher reads the situation through the same formatter as the terminal");

  const res = await teacher.direct([{ op: "say", text: "You are two beats ahead of the class." }], { timeoutMs: 2000 });
  assert(res.applied && res.result?.ok === true, "a turn posted to the bus is applied BY THE PAGE and the verdict comes back");
  assert(res.status === "applied" && res.text!.includes("ACCEPTED"), "with the status and the engine's own words");
  assert(s.activeBeatId() === res.result!.added[0], "the learner really did move — the page adjudicated it locally, atomically, as if called directly");
  assert(client.applied === 1, "exactly one turn was applied");
  assert(bus.log().some((l) => l.kind === "direct" && l.turn === res.turn), "the batch is in the log");
  assert(bus.log().some((l) => l.kind === "verdict" && l.turn === res.turn && l.ok), "and so is its verdict, in the same bytes the teacher was answered with");

  const bad = await teacher.direct([{ op: "goto", beatId: "does-not-exist" }], { timeoutMs: 2000 });
  assert(bad.applied && bad.result?.ok === false, "a refused turn is DELIVERED as a verdict, not as a dead request");
  assert(bad.text!.includes("REJECTED"), "the teacher is told why");
  assert(s.activeBeatId() === res.result!.added[0], "and the lesson did not move — the bus cannot mutate anything, it can only ask");
  assert(bus.log().some((l) => l.kind === "verdict" && l.turn === bad.turn && !l.ok), "the refusal is in the log too, so a tail is a complete session record");

  const { lines, next } = await teacher.log(0);
  assert(next === lines.length && lines.every((l, i) => l.line === i), "the log is an append-only stream with a usable cursor");

  const orphan = bus.enqueue([{ op: "hold" }], "teacher");
  assert(bus.status(orphan) === "queued" && bus.verdict(orphan) === null, "a turn nobody has collected is `queued`, not `refused`");

  const syncsBefore = client.syncs;
  client.detach();
  await new Promise((r) => setTimeout(r, 60));
  assert(client.syncs === syncsBefore, "detach stops the polling dead");
  s.send({ type: "next" });
  assert(client.syncs === syncsBefore, "and a detached client does not observe the lesson it left");
  assert(bus.status(orphan) === "queued", "the orphaned turn is still waiting rather than having been applied behind a closed page");

  const rebuilt = replay(defineLesson(lessonSpec), s.context.history);
  assert(rebuilt.activeBeatId() === s.activeBeatId(), "the bus-taught session replays with no bus in sight");
  assert(rebuilt.lesson.chart.states[res.result!.added[0]!] !== undefined, "including the beat that arrived over the wire");
}

console.log(
  `\nDIRECTION PASSED — ${passed}/${passed} checks: every op adjudicated, bad turns atomic and unrecorded, ` +
    `capabilities enforced at one gate, and a teacher-taught session replayed from its log with no bus and no transport.`,
);
