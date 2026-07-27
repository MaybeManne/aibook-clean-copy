// Headless acceptance for the LIVE co-play variant. The canvas viz needs a DOM, so we
// drive the SM directly through a LiveProgram (the clockless host) and assert the
// co-play CORE the studio depends on:
//   • say-anytime: message.submit enters an ephemeral thinking leaf (a real leaf change)
//     that CLONES the interrupted beat's viz — the shared workspace never blanks;
//   • the agent answers on that SAME workspace and the flow RESUMES the interrupted beat;
//   • interrupt: a second message before the first resolves discards the first (cancelStale);
//   • determinism: replay from history alone reproduces the whole ask → answer → resume loop.
// It reuses examples/attention's lesson/model/viz-registration VERBATIM (imported across),
// with the deterministic offline `fakeAuthor` standing in for a live provider.

import {
  createLiveProgram,
} from "@lessonkit/live";
import {
  authoringCommand,
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
import { fakeAuthor, lessonSpec, policy } from "../attention/lesson.js";
import { tokens } from "../attention/model.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const IT = tokens.indexOf("it"); // 4

/** A fresh live program on its OWN compiled lesson, so runtime-spliced beats never
 *  collide across blocks (spliceBeat is idempotent — shared charts would leak prose). */
function freshLive(): ReturnType<typeof createLiveProgram> {
  const lesson = defineLesson(lessonSpec);
  return createLiveProgram(
    createSession(lesson, {
      runner: generatingRunner(fakeAuthor, defaultRunner()),
      policies: [policy],
      learnerModel: defaultLearnerModel(),
    }),
  );
}

type Program = ReturnType<typeof createLiveProgram>;
const vizProps = (p: Program): Record<string, unknown> | undefined =>
  (p.frame().model.intents.find((i) => i.kind === "viz") as { props?: Record<string, unknown> } | undefined)?.props;
const frameText = (p: Program): string =>
  p.frame().model.intents.map((i) => ("content" in i ? toPlain(i.content as RichText) : "")).join(" ");

/** The current `next` (advance) target of a beat in a live chart: an id, `null` if the beat
 *  is terminal (empty `next` edge), or `undefined` if it has no `next` edge at all. Lets the
 *  acceptance read the SPINE straight off the chart, before and after a runtime reroute. */
const edgeTarget = (chart: Session["lesson"]["chart"], beatId: string): string | null | undefined => {
  const on = chart.states[beatId]?.on?.next;
  if (on === undefined) return undefined;
  return on.length === 0 ? null : on[0]?.target ?? null;
};

console.log("attention-live: a learner message enters an ephemeral thinking leaf that clones the shared workspace");
let answerId = "";
let resumedHistory: Session["context"]["history"] = [];
{
  const program = freshLive();
  let frames = 0;
  const unsub = program.subscribe(() => (frames += 1));

  program.send({ type: "next" }); // intro → explore
  assert(program.activeBeatId() === "explore", "advanced intro → explore");
  program.send({ type: "demo.set", payload: { key: "focus", value: IT } }); // learner focuses “it” (as the viz would)

  program.send(messageSubmit("why does it look at cat?")); // say-anytime — no beat had to declare it
  assert(program.activeBeatId().startsWith("__ask-"), "message.submit entered an ephemeral thinking leaf (a real leaf change — the basis of the interrupt)");
  assert(program.thinking === true, "the live program reports `thinking` while the agent authors");
  assert(program.frame().thinking === true, "…and the flag rides on the frame the view renders");
  assert(vizProps(program)?.focus === IT, "the thinking leaf CLONES the interrupted beat's viz (shared workspace never blanks; keeps the learner's focus)");
  const framesWhileThinking = frames;

  await tick(); // the agent resolves → the answer beat splices in and is entered
  assert(frames > framesWhileThinking, "the effect-driven answer re-entry drove a NEW frame via the single Session subscribe (clockless sync)");
  answerId = program.activeBeatId();
  assert(answerId.startsWith("gen-answer"), "after the agent resolves, the answer beat is spliced in and entered");
  assert(program.thinking === false, "no longer thinking once the answer lands");

  const turns = program.transcript();
  const shape = turns.map((t) => `${t.role}:${t.kind}`);
  assert(
    JSON.stringify(shape) === JSON.stringify(["tutor:prose", "tutor:prose", "learner:question", "agent:explanation"]),
    "the unified log folds to: open · explore · learner question · agent explanation",
  );
  const q = turns.find((t) => t.role === "learner" && t.kind === "question")!;
  assert(q.beatId === "explore", "the learner's question is anchored to the beat it was asked FROM (explore), not the ephemeral leaf");
  assert(toPlain(q.content!).includes("why does it look at cat?"), "the log echoes the learner's ACTUAL question");
  const ans = turns[turns.length - 1]!;
  assert(ans.role === "agent" && ans.kind === "explanation" && ans.beatId === answerId, "the answer is an AGENT explanation turn on the generated beat");
  assert(toPlain(ans.content!).includes("cat"), "…answered in context (“it” attends to “cat”)");
  const hl = vizProps(program)?.highlight;
  assert(Array.isArray(hl) && (hl as number[]).includes(IT), "the agent circled the token on the SAME persistent workspace (viz.props.highlight)");

  program.send({ type: "next" }); // "↩ Back to exploring"
  assert(program.activeBeatId() === "explore", "Continue on the answer RESUMES the interrupted beat (returnTo = explore)");

  resumedHistory = program.session.context.history;
  unsub();
  program.dispose();
}

console.log("attention-live: replay reconstructs the whole ask → answer → resume loop from history alone (determinism)");
{
  const fresh = defineLesson(lessonSpec);
  assert(fresh.chart.states[answerId] === undefined, "a fresh lesson has no generated answer beat");
  const r = replay(fresh, resumedHistory);
  assert(r.lesson.chart.states[answerId] !== undefined, "REPLAY reconstructed the generated answer beat as DATA (no author invoked)");
  assert(r.activeBeatId() === "explore", "REPLAY reproduces the resume — the learner is back on explore");

  // The unified log is a pure projection, so it too falls out of history alone.
  const replayed = projectTranscript(r.lesson, r.context.history, r.activeBeatId());
  const original = projectTranscript(fresh, resumedHistory, "explore");
  assert(JSON.stringify(replayed) === JSON.stringify(original), "REPLAY reproduces the identical transcript from history alone (pure projection)");
}

console.log("attention-live: interrupt — a second message before the first resolves discards the first (cancelStale)");
{
  const program = freshLive();
  program.send({ type: "next" }); // intro → explore
  program.send(messageSubmit("first question, about the pronoun it")); // agent starts thinking…
  assert(program.activeBeatId().startsWith("__ask-"), "the first message put us on a thinking leaf");
  program.send(messageSubmit("second question, about the noun cat")); // …interrupted before it resolves
  assert(program.activeBeatId().startsWith("__ask-"), "the interrupting message enters a NEW thinking leaf (the leaf change is the interrupt)");

  await tick(); // both authors' promises settle in one microtask drain
  const id = program.activeBeatId();
  assert(id.startsWith("gen-answer"), "after the interrupt, exactly one answer beat lands");
  const txt = frameText(program);
  assert(txt.includes("second question, about the noun cat"), "ONLY the second (interrupting) question is answered");
  assert(!txt.includes("first question, about the pronoun it"), "the first, in-flight generation was DISCARDED — the interrupt came for free");

  const turns = program.transcript();
  assert(turns.filter((t) => t.role === "learner" && t.kind === "question").length === 2, "both learner questions are recorded as turns (history keeps the discourse)");
  assert(turns.filter((t) => t.role === "agent" && t.kind === "explanation").length === 1, "but only ONE agent answer was authored (the interrupted generation produced none)");

  program.send({ type: "next" }); // "↩ Back to exploring"
  assert(program.activeBeatId() === "explore", "Continue after a CHAINED interrupt still resumes the real beat (resumeTo threads through the thinking leaf)");
  program.dispose();
}

// ── Slice 2: structural editing — the agent authors the ENVIRONMENT (reroutes the path) ──
// The learner's spine is intro → explore → check → checkpoint → recap (recap terminal).
// The agent's new move set: rewrite an existing beat's edge (rerouteBeat/setNext) so the
// MAIN path is personalized at play time — the tutoring analogue of editing the level.

console.log("attention-live (Slice 2): the agent personalizes the spine — setNext skips a beat, and the reroute REPLAYS from history");
let rerouteHistory: Session["context"]["history"] = [];
{
  const program = freshLive();
  program.send({ type: "next" }); // intro → explore
  assert(program.activeBeatId() === "explore", "on explore");
  assert(edgeTarget(program.session.lesson.chart, "explore") === "check", "explore advances to `check` by default (the pre-authored spine)");

  // The learner has clearly mastered τ, so the agent skips the check gate: point explore's
  // advance edge straight at recap. This is a player editing the game environment itself.
  program.send(authoringCommand({ op: "setNext", beatId: "explore", target: "recap" }));
  assert(edgeTarget(program.session.lesson.chart, "explore") === "recap", "setNext rewrote explore's advance edge → recap (the spine is now personalized)");
  assert(program.activeBeatId() === "explore", "a reroute is a topology edit — the learner stays put (no jump)");

  program.send({ type: "next" }); // learner advances along the NEW edge
  assert(program.activeBeatId() === "recap", "advancing now follows the rerouted path — the learner skipped `check` + `checkpoint`");

  rerouteHistory = program.session.context.history;
  assert(
    rerouteHistory.filter((r) => r.event.type === "authoring.command").length === 1,
    "the reroute was recorded in history as ONE authoring.command (a data patch, not a code edit)",
  );
  program.dispose();
}

console.log("attention-live (Slice 2): replay reconstructs the rerouted spine from history alone (determinism holds under structural edits)");
{
  const fresh = defineLesson(lessonSpec);
  assert(edgeTarget(fresh.chart, "explore") === "check", "a fresh lesson still has the ORIGINAL spine (explore → check)");
  const r = replay(fresh, rerouteHistory);
  assert(edgeTarget(r.lesson.chart, "explore") === "recap", "REPLAY re-applied the recorded reroute as DATA (explore → recap; no author invoked)");
  assert(r.activeBeatId() === "recap", "REPLAY reproduces the personalized traversal — the learner ends on recap");
}

console.log("attention-live (Slice 2): spine insertion composes — addBeat(enter:false) + rerouteBeat, adjudicated as one atomic turn");
{
  const program = freshLive();
  program.send({ type: "next" }); // intro → explore
  // Insert a personalized note between checkpoint and recap: add it WITHOUT jumping, then
  // reroute checkpoint's advance edge through it. One turn — the set is adjudicated together.
  program.send(
    authoringCommand([
      { op: "addBeat", spec: { id: "personal-note", type: "explain", params: { text: "Because you nailed the coreference case, here's the multi-head view." }, next: "recap" }, enter: false },
      { op: "rerouteBeat", beatId: "checkpoint", edge: { target: "personal-note" } },
    ]),
  );
  assert(program.session.lesson.chart.states["personal-note"] !== undefined, "the inserted beat was spliced (add-for-later, enter:false)");
  assert(edgeTarget(program.session.lesson.chart, "checkpoint") === "personal-note", "checkpoint now advances THROUGH the inserted beat");
  assert(edgeTarget(program.session.lesson.chart, "personal-note") === "recap", "…which advances to recap — the ending stays reachable (invariant held)");
  assert(program.activeBeatId() === "explore", "insertion didn't move the learner (enter:false + a downstream reroute)");
  program.dispose();
}

console.log("attention-live (Slice 2): guardrails — a soft-locking reroute and an inline-fn beat are BOTH rejected, and the chart is rolled back (atomic turn)");
{
  const program = freshLive();
  program.send({ type: "next" }); // intro → explore

  // (1) Soft-lock: recap is the ONLY terminal (next: null). Rerouting it back into the lesson
  // removes every ending → the learner could never finish. The level-completable invariant
  // must reject it, and the atomic turn must leave recap terminal.
  const recapBefore = edgeTarget(program.session.lesson.chart, "recap"); // null (terminal)
  let softLockRejected = false;
  try {
    program.send(authoringCommand({ op: "setNext", beatId: "recap", target: "explore" }));
  } catch {
    softLockRejected = true;
  }
  assert(softLockRejected, "a reroute that removes the only ending is REJECTED (level-completable invariant)");
  assert(edgeTarget(program.session.lesson.chart, "recap") === recapBefore && recapBefore === null, "…and the chart is rolled back — recap is still terminal");

  // (2) Inline fns: a runtime beat must reference guards/actions BY NAME (JSON-only, so the
  // recorded command replays as data). An addBeat carrying inline __actions is rejected
  // before it can corrupt the chart or poison replay.
  let inlineFnRejected = false;
  try {
    program.send(
      authoringCommand({ op: "addBeat", spec: { id: "sneaky", type: "explain", params: { text: "x" }, __actions: { boom: () => ({}) } } }),
    );
  } catch {
    inlineFnRejected = true;
  }
  assert(inlineFnRejected, "an addBeat carrying inline __actions is REJECTED (assertNoInlineFns — replay-safety)");
  assert(program.session.lesson.chart.states["sneaky"] === undefined, "…and the rejected beat never entered the chart");

  // (3) A MIXED turn that soft-locks must roll back BOTH its edits: a beat it already spliced
  // and the edge it already rewrote — the turn is all-or-nothing. The added beat is an orphan
  // (nothing routes to it), so it can't rescue reachability; the turn is rejected as a whole.
  let mixedRejected = false;
  try {
    program.send(
      authoringCommand([
        { op: "addBeat", spec: { id: "orphan-end", type: "explain", params: { text: "unreachable" }, next: null }, enter: false },
        { op: "setNext", beatId: "recap", target: "explore" }, // removes the only REACHABLE ending
      ]),
    );
  } catch {
    mixedRejected = true;
  }
  assert(mixedRejected, "a mixed turn whose reroute soft-locks is rejected as a whole");
  assert(program.session.lesson.chart.states["orphan-end"] === undefined, "…and the beat it had already spliced is rolled back too (atomic turn — all-or-nothing)");
  assert(edgeTarget(program.session.lesson.chart, "recap") === null, "…and recap is still terminal");
  program.dispose();
}

// ── "Show me another sentence" — the agent AUTHORS the environment to satisfy a request
// the pre-authored lesson never anticipated: a REAL detour beat rendering a DIFFERENT
// sentence (its own real attention, grounded by the engine), which then rejoins the spine.
// This is the exact failure that motivated the co-play redesign — the tutor used to REFUSE
// it — now resolved through the same addBeat → splice → replay path, with the model bounded
// to sentences the engine can ground (the palette in model.ts).
console.log("attention-live (new-sentence authoring): a learner asks for another sentence → the agent authors a grounded, different-sentence detour that rejoins the spine");
{
  const program = freshLive();
  program.send({ type: "next" }); // intro → explore
  assert(program.activeBeatId() === "explore", "on explore");
  assert(Number(vizProps(program)?.sentence ?? 0) === 0, "explore shows the lesson's ORIGINAL sentence (sentence 0)");

  program.send(messageSubmit("can you show me another sentence?"));
  assert(program.activeBeatId().startsWith("__ask-"), "the request enters an ephemeral thinking leaf (say-anytime — no beat declared it)");

  await tick(); // the agent authors the detour beat
  const sid = program.activeBeatId();
  assert(sid.startsWith("gen-sentence"), "the agent AUTHORED a new-sentence beat (not an in-context answer) — the old refusal is gone");

  const props = vizProps(program)!;
  assert(Number(props.sentence) === 1, "…the shared workspace now renders a DIFFERENT sentence from the palette");
  const hl = props.highlight as number[];
  assert(Array.isArray(hl) && hl.length === 2, "the engine GROUNDED the new sentence — its coreferent pair is circled (computed, not model-invented)");
  assert(typeof props.annotation === "string" && (props.annotation as string).includes("→"), "…and annotated with the engine-computed target");
  const txt = frameText(program);
  assert(txt.includes("dog"), "the authored prose is about the NEW sentence (the grounded fallback names its tokens)");

  assert(edgeTarget(program.session.lesson.chart, sid) === "explore", "the authored detour REJOINS the spine (next = returnTo = explore)");
  program.send({ type: "next" }); // ↩ Back to exploring
  assert(program.activeBeatId() === "explore", "Continue returns the learner to the spine");
  assert(Number(vizProps(program)?.sentence ?? 0) === 0, "…back on the original sentence");

  // Determinism: the authored different-sentence detour replays from history alone.
  const hist = program.session.context.history;
  const r = replay(defineLesson(lessonSpec), hist);
  assert(r.lesson.chart.states[sid] !== undefined, "REPLAY reconstructed the authored new-sentence beat as DATA (no author invoked)");
  assert(r.activeBeatId() === "explore", "REPLAY reproduces the resume onto the spine");
  program.dispose();
}

console.log("\nAttention live-coplay acceptance passed — say-anytime + shared-workspace answer + interrupt + deterministic replay, plus Slice 2 structural editing (reroute/insert the path, soft-lock + inline-fn guardrails, reroute replays), plus new-sentence authoring (the agent authors a grounded different-sentence detour instead of refusing).");
