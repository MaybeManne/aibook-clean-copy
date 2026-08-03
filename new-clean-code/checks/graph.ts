import {
  catalog,
  chartGraph,
  createSession,
  danglingEdges,
  graphNode,
  lessonGraph,
  replay,
  type ChartGraph,
  type Session,
} from "@lessonstudio/lesson";
import { defineLesson } from "@lessonstudio/authoring";
import {
  attachMachineMirror,
  layoutGraph,
  machineSnapshot,
  overlaps,
  subscribeMachine,
  type MachineSnapshot,
} from "@lessonstudio/machine";
import { lessonSpec } from "../examples/pinhole/lesson.js";

let passed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  passed++;
  console.log("  ok:", msg);
}

function open(): Session {
  return createSession(defineLesson(lessonSpec), { runner: { run() {} } });
}

function advance(s: Session, n: number): void {
  for (let i = 0; i < n; i++) s.send({ type: "next" });
}

const edgesFrom = (g: ChartGraph, from: string, on?: string) =>
  g.edges.filter((e) => e.from === from && (on === undefined || e.on === on));

console.log("[chartGraph: every candidate on every edge]");
{
  const lesson = defineLesson(lessonSpec);
  const g = lessonGraph(lesson);
  const cat = catalog(lesson);

  assert(g.nodes.length === Object.keys(lesson.chart.states).length, "every state in the chart is a node — nothing is filtered out of the picture");
  assert(g.entry === lesson.chart.initial && g.spine[0] === g.entry, "the entry is the entry, and the spine starts there");

  // The claim that motivates the whole projection: `catalog()` reports ONE target per event key.
  const gateNext = edgesFrom(g, "gate-invert", "next");
  assert(gateNext.length === 2, "the mcq gate has TWO candidates on `next` — the wrong-answer detour and the fall-through");
  assert(gateNext[0]!.guard === "mcq.wasWrong:gate-invert" && gateNext[0]!.to === "why-flips", "the guarded candidate is tried FIRST, by name, and leads to the reteach");
  assert(!gateNext[1]!.guard && gateNext[1]!.to === "triangles", "the unguarded fall-through is second — the order the interpreter resolves them in");
  assert(cat.beats.find((b) => b.id === "gate-invert")!.next === "triangles", "…while the catalog reports only the last of the two, which is what it is for");
  assert(cat.beats.find((b) => b.id === "gate-invert")!.edges.next === undefined, "and the catalog's `edges` skips `next` entirely, so the detour is invisible there");

  // The second omission: self-transitions, which is every slider in the lesson.
  const selfies = edgesFrom(g, "wall-1").filter((e) => e.self);
  assert(selfies.length === 2 && selfies.every((e) => e.to === "wall-1"), "a beat's own `demo.set`/`demo.setMany` show up as self-edges");
  assert(Object.keys(cat.beats[0]!.edges).length === 0, "…which the catalog drops (it lists nothing for wall-1)");

  const recap = edgesFrom(g, "recap", "next");
  assert(recap.length === 1 && recap[0]!.to === null, "the last beat's advance edge is drawn, with `to: null` — an ending is an edge, not a missing one");
  assert(graphNode(g, "recap")!.terminal === true, "and the node itself is marked terminal, by the same test `reachesTerminal` makes");
  assert(graphNode(g, "gate-invert")!.checkpoint === true && graphNode(g, "wall-1")!.checkpoint === undefined, "checkpoints are marked; ordinary prose beats are not");
  assert(danglingEdges(g).length === 0, "no edge in a compiled lesson points at a beat that does not exist");
  assert(g.nodes.every((n) => n.runtime === undefined), "nothing in a freshly compiled lesson is marked runtime-authored");
}

console.log("\n[a bare chart, with no spine to compare against]");
{
  const lesson = defineLesson(lessonSpec);
  const bare = chartGraph(lesson.chart);
  assert(bare.spine.length === 0, "a `Statechart` alone genuinely does not know which nodes were authored…");
  assert(bare.nodes.length === lessonGraph(lesson).nodes.length, "…but every node and edge is still there");
  assert(bare.nodes.every((n) => n.spineIndex === undefined), "so no node claims a spine position it cannot know");
}

console.log("\n[layout: deterministic, non-overlapping, and lanes that mean something]");
{
  const g = lessonGraph(defineLesson(lessonSpec));
  const a = layoutGraph(g);
  const b = layoutGraph(g);
  assert(JSON.stringify(a) === JSON.stringify(b), "the same graph lays out to byte-identical geometry — no measurement, no randomness");
  assert(overlaps(a).length === 0, "no two beats are drawn on top of each other");

  assert(a.main[0] === "wall-1" && a.main[a.main.length - 1] === "recap", "the main column is the walk from the entry along the unguarded advance edge");
  assert(!a.main.includes("why-flips") && !a.main.includes("m-walkthrough"), "the two reteach beats are NOT in it — they are reachable only through a guard");
  const detours = a.nodes.filter((n) => n.lane === "detour").map((n) => n.id);
  assert(detours.join(" ") === "why-flips m-walkthrough", "…they are the detour lane, in authored order");
  const why = a.nodes.find((n) => n.id === "why-flips")!;
  const gate = a.nodes.find((n) => n.id === "gate-invert")!;
  assert(why.row === gate.row && why.x > gate.x, "and a detour sits beside the beat that sends the learner to it");
  assert(a.end !== null && a.end.y > Math.max(...a.nodes.map((n) => n.y)), "the end-of-lesson marker is below everything, where a reader looks for it");
  assert(a.edges.every((e) => e.d.length > 0), "every edge got a path — including the self-arcs and the one to the end");
  assert(a.edges.filter((e) => e.dashed).every((e) => !!e.guard), "dashed means guarded, and only guarded");
}

console.log("\n[a live session: the tutor's own beats, in their own lane]");
{
  const s = open();
  advance(s, 1);
  const before = lessonGraph(s.lesson).nodes.length;

  const said = s.direct(
    { op: "say", text: "A wider hole is brighter and blurrier at once.", exits: "both" },
    "ai",
  );
  assert(said.ok, "the tutor answers with a two-exit `say`");
  const id = said.added[0]!;

  const g = lessonGraph(s.lesson);
  assert(g.nodes.length === before + 1, "the graph has one more node than before — a live edit is visible without recompiling anything");
  const node = graphNode(g, id)!;
  assert(node.runtime === true, "and it is marked runtime-authored, so a reader can tell it from the lesson as written");
  assert(node.type === "explain" && !!node.head, "with its type and its opening words, which is how a human recognizes it");

  // Phase 3's design claim, stated as geometry: one event key per exit ⇒ two separately drawable
  // edges. A single `demo.action` edge guarded on its payload would be ONE line here.
  const exits = g.edges.filter((e) => e.from === id && e.on.startsWith("exit."));
  assert(exits.length === 2, "its two ways out are two separate edges — which is what made them separately drawable");
  assert(exits.some((e) => e.to === "wall-2") && exits.some((e) => e.to === "wall-3"), "one back to the beat they interrupted, one onward to what follows it");
  assert(new Set(exits.map((e) => e.on)).size === 2, "on two distinct event keys, so a reroute can address either without touching the other");

  const laid = layoutGraph(g);
  const lane = laid.nodes.find((n) => n.id === id)!;
  assert(lane.lane === "runtime", "the answer is drawn in the runtime lane, not spliced into the spine");
  assert(lane.row === laid.nodes.find((n) => n.id === "wall-2")!.row, "level with the beat it interrupted");
  assert(overlaps(laid).length === 0, "and the picture still has nothing overlapping");
}

console.log("\n[MachineSnapshot: pure JSON, and true about the session]");
{
  const s = open();
  advance(s, 2);
  s.send({ type: "demo.set", payload: { key: "u", value: 9 } });
  s.send({ type: "demo.set", payload: { key: "u", value: 11 } });
  s.direct({ op: "goto", beatId: "recap" }, "teacher");
  s.direct({ op: "setNext", beatId: "recap", target: "no-such-beat" }, "teacher");

  const snap = machineSnapshot(s);
  assert(snap.activeBeatId === s.activeBeatId() && snap.step === s.context.history.length, "it reports where the learner is and how many steps have happened");
  assert(snap.lesson.id === "pinhole-camera" && snap.lesson.version === 1, "named with the lesson and its version, so a stale tab is recognizable");
  assert(snap.lastResult?.ok === false && snap.lastResult.error?.kind === "invalid", "the REFUSED turn is carried — the one thing a learner's screen never shows");
  assert(graphNode(snap.graph, "recap")!.terminal === true, "and the refusal changed no edge: recap still ends the lesson");
  assert(snap.traversed.includes("wall-1>wall-2"), "the travelled path is the from→to of the whole history…");
  assert(
    snap.historyTail.filter((l) => l.from === "wall-3" && l.to === "wall-3").length === 2 &&
      snap.traversed.filter((k) => k === "wall-3>wall-3").length === 1,
    "…deduped: two slider moves are two log lines but one painted self-edge",
  );
  assert(snap.historyTail[snap.historyTail.length - 1]!.type === "direction.command", "the event log's newest line is the last thing that was sent");

  const round = JSON.parse(JSON.stringify(snap)) as MachineSnapshot;
  assert(JSON.stringify(round) === JSON.stringify(snap), "the whole snapshot survives a JSON round-trip unchanged — it is data, not a handle");
  assert(overlaps(layoutGraph(round.graph)).length === 0, "and the received copy lays out on its own, with no access to the session it came from");

  const rebuilt = replay(defineLesson(lessonSpec), s.context.history);
  assert(JSON.stringify(machineSnapshot(rebuilt).graph) === JSON.stringify(snap.graph), "a replayed session produces the SAME graph — the picture is a function of the log");
}

console.log("\n[the mirror: one-way, over a real channel]");
{
  const s = open();
  advance(s, 1);

  // Attach FIRST, then subscribe: a machine tab opened mid-lesson is the normal case, and it is
  // exactly the case a channel cannot serve by itself, since a `BroadcastChannel` retains nothing.
  const detach = attachMachineMirror(s);
  const seen: MachineSnapshot[] = [];
  const unsubscribe = subscribeMachine((snap) => seen.push(snap));
  await new Promise((r) => setTimeout(r, 50));
  assert(seen.length >= 1, "a page that subscribes after the lesson started is caught up anyway — `hello` is answered with a snapshot");
  const first = seen[seen.length - 1]!;
  assert(first.activeBeatId === "wall-2", "…and it is the state the session is actually in, not the state it started in");

  const n = seen.length;
  s.send({ type: "next" });
  await new Promise((r) => setTimeout(r, 50));
  assert(seen.length > n, "every committed step publishes");
  assert(seen[seen.length - 1]!.activeBeatId === "wall-3", "with the learner where they now are");

  detach();
  const after = seen.length;
  s.send({ type: "next" });
  await new Promise((r) => setTimeout(r, 50));
  assert(seen.length === after, "and detaching stops it — the mirror holds no lasting claim on the session");
  unsubscribe();
}

console.log(
  `\nGRAPH PASSED — ${passed}/${passed} checks: every candidate on every edge (including the guarded detour and ` +
    `the self-transitions the catalog hides), a deterministic non-overlapping layout whose lanes separate the ` +
    `authored lesson from what the tutor added live, and a snapshot that is pure JSON, replay-stable and one-way.`,
);
