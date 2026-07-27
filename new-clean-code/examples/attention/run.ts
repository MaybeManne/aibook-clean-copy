// Headless acceptance for "Attention, felt". The canvas viz can't run without a DOM,
// so we (a) assert the shared PURE attention model directly, and (b) send the same
// events the viz emits to prove the tutor loop — real-time signal, settled-state
// policy, AND live generation with deterministic replay — all through the SM.

import { askSubmit, claudeAuthor, createSession, defaultRunner, defineLesson, generatingRunner, pickAuthor, prepareNarration, replay, workspaceSet } from "@lessonkit/lesson";
import { toPlain } from "@lessonkit/render-contract";
import { createVideoProgram, projectTranscript } from "@lessonkit/video";
import { fakeTtsAdapter, type AudioSink } from "@lessonkit/audio";
import { attentionRow, peakedness, tokens, topTarget } from "./model.js";
import { attentionPlan, fakeAuthor, lesson, lessonSpec, policy } from "./lesson.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const CAT = tokens.indexOf("cat"); // 1
const IT = tokens.indexOf("it"); // 4

const runner = () => generatingRunner(fakeAuthor, defaultRunner());
function toExplore(): ReturnType<typeof createSession> {
  const s = createSession(lesson, { runner: runner(), policies: [policy] });
  s.send({ type: "next" }); // intro → explore
  return s;
}

console.log("attention/model: real softmax attention behaves");
{
  const row = attentionRow("semantic", IT, 0.6);
  assert(Math.abs(row.reduce((a, b) => a + b, 0) - 1) < 1e-9, "attention weights sum to 1 (softmax)");
  assert(topTarget("semantic", IT, 0.3) === CAT, "semantic head: “it” attends to “cat” (coreference)");
  assert(Math.abs(topTarget("positional", IT, 0.5) - IT) === 1, "positional head: “it” attends to a neighbour");
  assert(peakedness("semantic", IT, 0.2) > peakedness("semantic", IT, 3), "low τ is more focused than high τ");
}

console.log("attention/tutor: exploration is learner-paced — a viz signal never advances the beat");
{
  const s = toExplore();
  assert(s.activeBeatId() === "explore", "advanced intro → explore");
  s.send({ type: "signal.viz.uniform", payload: { temperature: 2.6 } }); // viz observed blurred attention…
  assert(s.activeBeatId() === "explore", "…but the learner stays on the explore beat (no teleport)");
}

console.log("attention/tutor: SETTLED-STATE — mcq adapts (challenge / remediation)");
{
  const right = toExplore();
  right.send({ type: "next" }); // explore → check
  right.send({ type: "mcq.answer", payload: { choice: 0 } }); // correct
  assert(right.context.mastery["temperature"] === 1, "correct answer raised mastery.temperature");
  right.send({ type: "next" }); // check → checkpoint → (policy) → challenge
  assert(right.activeBeatId() === "challenge", "policy routed a mastered learner to the challenge");

  const wrong = toExplore();
  wrong.send({ type: "next" });
  wrong.send({ type: "mcq.answer", payload: { choice: 1 } }); // "sharper" → misconception
  wrong.send({ type: "next" });
  assert(wrong.activeBeatId() === "remediate_temp", "policy routed a misconception to remediation");
}

console.log("attention/tutor: LIVE-AGENTIC — 'Explain this token' generates a bespoke beat");
{
  const s = toExplore();
  s.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner focuses “it” (as the viz would)
  s.send({ type: "demo.action", payload: { key: "explain" } }); // "Explain this token ✨"
  assert(s.activeBeatId() === "thinking", "moved to the thinking placeholder");
  await tick(); // author resolves → beat.generated
  assert(s.activeBeatId() === "gen-attention", "spliced + jumped into the generated explanation");
  const txt = s.render().intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
  assert(txt.includes("it") && txt.includes("cat"), "the generated beat explains the learner's ACTUAL focus (“it” → “cat”)");

  // Determinism: replay from history alone (fresh chart, no author) reproduces it.
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states["gen-attention"] === undefined, "fresh lesson has no generated beat");
  const r = replay(fresh, s.context.history);
  assert(r.activeBeatId() === "gen-attention", "REPLAY reconstructed the generated beat from history alone");
}

console.log("attention/ask: a learner's free-text QUESTION generates an in-context answer that RESUMES the beat (conversation seam)");
{
  const s = toExplore();
  s.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner focuses “it”
  s.send(askSubmit("why does it look at cat?")); // learner types a question (not a graded gate)
  assert(s.activeBeatId() === "explore", "ask.submit is a self-transition — the learner stays on the beat while the tutor thinks");
  assert(s.context.history.some((r) => r.event.type === "ask.submit"), "the question is recorded in history as a learner discourse move");

  await tick(); // the author resolves → the answer beat splices in + is jumped into
  const answerId = s.activeBeatId();
  assert(answerId.startsWith("gen-answer"), "the tutor's bespoke answer beat was spliced in and entered");
  const intents = s.render().intents;
  const txt = intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
  assert(txt.includes("why does it look at cat?"), "the answer echoes the learner's ACTUAL question");
  assert(txt.includes("cat"), "…and answers in context (“it” attends to “cat”)");
  const viz = intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined;
  assert(Array.isArray(viz?.props?.highlight) && (viz!.props!.highlight as number[]).includes(IT), "the agent circled the token on the SAME persistent viz");

  s.send({ type: "next" }); // "↩ Back to exploring"
  assert(s.activeBeatId() === "explore", "Continue on the answer RESUMES the beat the learner asked from (returnTo)");

  // Determinism: replay reconstructs the whole ask → answer → resume loop from history alone.
  const fresh = defineLesson(lessonSpec);
  const r = replay(fresh, s.context.history);
  assert(r.lesson.chart.states[answerId] !== undefined, "REPLAY reconstructed the generated answer beat as data (no author)");
  assert(r.activeBeatId() === "explore", "REPLAY reproduces the resume — the learner is back on explore");
}

console.log("attention/author: the REAL Claude adapter is an OPT-IN drop-in at the same seam — engine owns facts, the model owns voice, replay never re-calls it");
{
  // No network. An injected completer stands in for the Anthropic SDK call (which
  // `pickAuthor` would wire when ANTHROPIC_API_KEY is set); it records what the model
  // was asked and returns live prose — so we prove the seam, the grounding split, and
  // replay determinism entirely offline.
  const seen: { system: string; prompt: string }[] = [];
  let calls = 0;
  const complete = async (req: { system: string; prompt: string }): Promise<string> => {
    calls += 1;
    seen.push({ system: req.system, prompt: req.prompt });
    return "Great question — this is the live tutor voice speaking.";
  };

  // ── Opt-in policy: a key selects the LIVE author; its absence keeps the offline default.
  const savedKey = process.env.ANTHROPIC_API_KEY;
  const isLive = (a: { generate: unknown }): boolean => (a.generate as { constructor: { name: string } }).constructor.name === "AsyncFunction";
  try {
    delete process.env.ANTHROPIC_API_KEY;
    assert(!isLive(pickAuthor(attentionPlan, {})), "no key + no completer ⇒ the DETERMINISTIC offline author (default stays replayable)");
    process.env.ANTHROPIC_API_KEY = "sk-ant-probe-unused";
    assert(isLive(pickAuthor(attentionPlan, {})), "a present ANTHROPIC_API_KEY selects the LIVE Claude author at the SAME seam");
  } finally {
    if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = savedKey;
  }
  assert(isLive(pickAuthor(attentionPlan, { complete })), "an injected completer (a server proxy, or this test) also selects the live author");

  // ── Live generation through the real Session/runner (completer injected, no network).
  // A FRESH chart: earlier tests splice their own `gen-answer-N` into the shared `lesson`,
  // and spliceBeat is idempotent (replay-safe), so isolate this run on its own lesson.
  const authorLesson = defineLesson(lessonSpec);
  const s = createSession(authorLesson, { runner: generatingRunner(claudeAuthor({ plan: attentionPlan, complete }), defaultRunner()), policies: [policy] });
  s.send({ type: "next" }); // intro → explore
  s.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner focuses “it”
  s.send(askSubmit("why does it look at cat?"));
  await tick(); // the live author resolves → the answer beat splices in

  const answerId = s.activeBeatId();
  assert(answerId.startsWith("gen-answer"), "the live author spliced its answer beat at the very same seam as the fake one");
  assert(calls === 1, "the model was invoked exactly once for the generation");
  const intents = s.render().intents;
  const txt = intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
  assert(txt.includes("this is the live tutor voice speaking"), "the beat's PROSE is the model's live voice (the nondeterministic part)");
  const viz = intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined;
  const hl = (viz?.props?.highlight ?? []) as number[];
  assert(hl.includes(IT) && hl.includes(CAT), "the FACTS — the circled “it”→“cat” pair — are the ENGINE's, computed from the model, NOT the LLM's");
  assert(seen[0]!.system.includes("cat") && seen[0]!.system.includes("τ"), "the model was TETHERED: the hard facts (target token + τ) were in its system prompt");

  // Determinism: replay reconstructs the LIVE beat (prose and all) from history alone,
  // WITHOUT re-invoking the model — generate → freeze → replay holds for a live author.
  const before = calls;
  const fresh = defineLesson(lessonSpec);
  const r = replay(fresh, s.context.history);
  assert(r.activeBeatId() === answerId, "REPLAY reconstructed the live answer beat from history alone");
  const rtxt = r.render().intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
  assert(rtxt.includes("this is the live tutor voice speaking"), "REPLAY reproduced the model's exact recorded prose (frozen, not regenerated)");
  assert(calls === before, "REPLAY did NOT re-invoke the model — the recorded spec is the source of truth");

  // Graceful degradation: an API error falls back to the deterministic offline prose,
  // so a learner's question never dead-ends. (warn is expected here; silence it.)
  const warn = console.warn;
  console.warn = () => {};
  try {
    const dLesson = defineLesson(lessonSpec); // isolate: own chart, so the fallback beat is truly this one's
    const d = createSession(dLesson, { runner: generatingRunner(claudeAuthor({ plan: attentionPlan, complete: async () => { throw new Error("api down"); } }), defaultRunner()), policies: [policy] });
    d.send({ type: "next" });
    d.send({ type: "demo.set", payload: { key: "focus", value: IT } });
    d.send(askSubmit("what if the api is down?"));
    await tick();
    const dtxt = d.render().intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");
    assert(d.activeBeatId().startsWith("gen-answer") && dtxt.includes("good question"), "on API failure the beat still splices, with the deterministic fallback prose");
  } finally {
    console.warn = warn;
  }
}

console.log("attention/workspace: the AGENT points/annotates/zooms the SAME viz — a channel distinct from the learner's controls");
{
  const s = toExplore();
  s.send({ type: "demo.set", payload: { key: "temperature", value: 1.2 } }); // learner nudges a control
  s.send(workspaceSet({ highlight: [IT, CAT], annotation: "“it” → “cat”", camera: { zoom: 1.4, focus: IT } })); // agent acts
  assert(s.activeBeatId() === "explore", "workspace.set is a self-transition — the agent annotates without leaving the beat");

  const intents = s.render().intents;
  const viz = intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined;
  assert(Array.isArray(viz?.props?.highlight) && (viz!.props!.highlight as number[]).includes(IT), "the agent's highlight reaches the viz props");
  assert(viz!.props!.annotation === "“it” → “cat”", "the agent's annotation reaches the viz props");
  assert((viz!.props!.camera as { zoom?: number }).zoom === 1.4, "the agent's camera reaches the viz props");
  assert(viz!.props!.temperature === 1.2, "the learner's control value coexists with the agent's workspace patch");

  const controls = intents.find((i) => i.kind === "controls") as { values?: Record<string, unknown> } | undefined;
  assert(controls?.values?.highlight === undefined && controls?.values?.__ws === undefined, "agent props do NOT leak into the controls UI (no phantom controls)");
  assert(controls!.values!.temperature === 1.2, "the learner's control value still drives the controls UI");

  const kinds = s.context.history.map((r) => r.event.type);
  assert(kinds.includes("demo.set") && kinds.includes("workspace.set"), "history keeps the two writers DISTINCT (transcript can attribute each)");

  const r = replay(lesson, s.context.history);
  const rviz = r.render().intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined;
  assert(rviz?.props?.annotation === "“it” → “cat”", "REPLAY reconstructs the agent's workspace annotation from history alone");
}

console.log("attention/live-video: a BACKGROUND-generated beat drives the video FRAME (Session→VideoProgram onStep sync)");
{
  // The gap this closes: `beat.generated` resolves asynchronously and re-enters via
  // the runner's send (Session.send), NOT VideoProgram.send — so without the step
  // observer the frame would freeze on the "thinking" placeholder forever.
  const program = createVideoProgram(
    createSession(lesson, { runner: generatingRunner(fakeAuthor, defaultRunner()), policies: [policy] }),
  );
  type Frame = ReturnType<typeof program.frame>;
  let frames = 0;
  let last: Frame | null = null;
  const unsub = program.subscribe((f) => { frames += 1; last = f; });
  const textOf = (f: Frame): string =>
    f.model.intents.map((i) => ("content" in i ? toPlain(i.content as Parameters<typeof toPlain>[0]) : "")).join(" ");

  program.send({ type: "next" }); // intro → explore
  program.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // focus "it" (as the viz would)
  program.send({ type: "demo.action", payload: { key: "explain" } }); // "Explain this token ✨"
  assert(program.session.activeBeatId() === "thinking", "clicked Explain → session on the thinking placeholder");
  assert(!textOf(last!).includes("attends most to"), "the pre-resolution frame is still the placeholder, not the explanation");
  const framesBeforeResolve = frames;

  await tick(); // the author's Promise resolves → beat.generated re-enters through the runner

  assert(program.session.activeBeatId() === "gen-attention", "author resolved → session spliced + jumped into the generated beat");
  assert(frames > framesBeforeResolve, "the step-observer drove a NEW frame with NO further transport call (the browser-sync fix)");
  assert(textOf(last!).includes("it") && textOf(last!).includes("cat"), "the LIVE frame now shows the generated explanation (learner's actual focus)");
  assert(last!.transport.beatId === "gen-attention", "transport reports the generated beat");
  assert(program.visitedBeats().includes("gen-attention"), "the generated beat entered the visited trail — scroll-back-able");
  unsub();
  program.dispose();
}

console.log("attention/document: the unified log projects history into an append-only, role-attributed transcript (deterministic)");
{
  // Drive a full episode: explore → learner fiddles a control (a NON-discourse move) →
  // the agent points/annotates (two gestures) → "Explain" generates a bespoke beat.
  const program = createVideoProgram(
    createSession(lesson, { runner: generatingRunner(fakeAuthor, defaultRunner()), policies: [policy] }),
  );
  const s = program.session;
  program.send({ type: "next" }); // intro → explore
  program.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner fiddles — NOT a turn
  program.send(workspaceSet({ highlight: [IT, CAT], annotation: "“it” → “cat”" })); // agent gesture
  program.send(workspaceSet({ camera: { zoom: 1.4, focus: IT } })); // a SECOND gesture, same beat
  program.send({ type: "demo.action", payload: { key: "explain" } }); // explore → thinking
  await tick(); // author resolves → gen-attention

  const turns = program.transcript();
  const shape = turns.map((tn) => `${tn.role}:${tn.kind}`);
  assert(
    JSON.stringify(shape) === JSON.stringify(["tutor:prose", "tutor:prose", "agent:action", "tutor:prose", "agent:explanation"]),
    "history folds into the expected turn sequence (open · explore · agent gesture · thinking · generated explanation)",
  );
  assert(turns[0]!.pinned === true && turns[0]!.beatId === "intro", "the opening turn is the pinned initial beat (the reference head)");
  assert(turns.filter((tn) => tn.role === "learner").length === 0, "a learner demo.set (slider fiddling) produces NO turn — not a discourse move");
  assert(turns.filter((tn) => tn.role === "agent" && tn.kind === "action").length === 1, "two consecutive agent gestures on the same beat COALESCE into one action turn");
  const gen = turns[turns.length - 1]!;
  assert(gen.role === "agent" && gen.kind === "explanation" && gen.beatId === "gen-attention", "the generated beat is an AGENT explanation turn");
  assert(turns.filter((tn) => tn.live).length === 1 && gen.live, "exactly the active beat's turn is live (the current interaction surface)");

  // Determinism: the identical log falls out of a fresh replay of history ALONE.
  const fresh = defineLesson(lessonSpec);
  const r = replay(fresh, s.context.history);
  const replayed = projectTranscript(r.lesson, r.context.history, r.activeBeatId());
  assert(JSON.stringify(replayed) === JSON.stringify(turns), "REPLAY reproduces the identical transcript from history alone (pure projection)");
  program.dispose();
}

console.log("attention/audio: interactive beats speak — narration plays ONCE on entry, not on a clock");
{
  // A recording sink stands in for speechSink/htmlAudioSink so we can assert the
  // beat-entry playback contract without a DOM.
  type Call = { fn: "load" | "play" | "pause" | "seek"; beat?: string; clip?: boolean; ms?: number };
  const calls: Call[] = [];
  const sink: AudioSink = {
    load: (beat, audio) => calls.push({ fn: "load", beat, clip: !!audio }),
    play: () => calls.push({ fn: "play" }),
    pause: () => calls.push({ fn: "pause" }),
    seek: (ms) => calls.push({ fn: "seek", ms }),
  };

  const { audio } = await prepareNarration(lessonSpec, { adapter: fakeTtsAdapter() });
  assert(audio["intro"]?.words.length && audio["explore"]?.words.length, "prepareNarration synthesized the untimed beats' narration");
  assert(audio["check"] === undefined, "the mcq gate has no narration (not an explorable/explain beat)");

  const played = (beat: string): boolean => {
    const i = calls.findIndex((c) => c.fn === "load" && c.beat === beat);
    return i >= 0 && !!calls[i]!.clip && calls.slice(i + 1).some((c) => c.fn === "play");
  };

  // Construction reconciles the first beat (intro) → its clip loads and plays.
  const program = createVideoProgram(
    createSession(lesson, { runner: generatingRunner(fakeAuthor, defaultRunner()), policies: [policy] }),
    { audio, audioSink: sink },
  );
  assert(played("intro"), "narration played on ENTRY to the first (untimed) beat");

  calls.length = 0;
  program.send({ type: "next" }); // intro → explore
  assert(played("explore"), "advancing to a new untimed beat plays its narration");

  // A slider edit on the SAME beat must NOT restart the narration (no clock to re-seek).
  calls.length = 0;
  program.send({ type: "demo.set", payload: { key: "temperature", value: 1.4 } });
  assert(calls.length === 0, "a control edit on the same beat does not reload/replay/seek audio");

  // Landing on a beat with no narration is silent (load, but no play).
  calls.length = 0;
  program.send({ type: "next" }); // explore → check (mcq, no narration)
  assert(calls.some((c) => c.fn === "load" && c.beat === "check" && !c.clip), "the mcq beat loaded a null (silent) clip");
  assert(!calls.some((c) => c.fn === "play"), "…and nothing played on the silent beat");

  // Revisiting a beat replays its narration (Back restores + re-enters).
  calls.length = 0;
  program.back(); // check → explore
  assert(played("explore"), "revisiting a beat (Back) replays its narration");
  program.dispose();
}

console.log("\nAttention flagship acceptance passed — real attention + learner-paced, settled-state, live-agentic tutoring (fake OR real Claude author at one seam), and on-entry narration.");
