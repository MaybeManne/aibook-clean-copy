/**
 * CAN THE TUTOR BUILD WHAT THE AUTHOR BUILT?
 *
 * The question this file answers empirically, because "the director is as expressive as the author"
 * is easy to assert in a doc comment and easy to be wrong about. Four things have to hold at once:
 *
 *   1. the power is DISCLOSED — every registered beat type is described, with a worked example that
 *      is itself authorable, or else named as undocumented rather than silently unusable;
 *   2. a new FIGURE is authorable as pure JSON — a `scene` the lesson never anticipated compiles,
 *      renders and survives replay;
 *   3. a new INTERACTIVE figure is authorable as pure JSON — the one thing that used to require
 *      registering code. A bound `declarative` explorable must actually redraw when its slider moves;
 *   4. the surface stays SAFE — a malformed binding is refused atomically, and no beat may carry a
 *      function, because a recorded turn that cannot be re-run is not a recording.
 *
 * Plus Phase 3's promise: a two-exit answer must leave an ending reachable from BOTH ways out.
 */
import { defineLesson } from "@lessonstudio/authoring";
import {
  assertNoInlineFns,
  beatSchemas,
  createSession,
  defaultBeatRegistry,
  formatAuthoring,
  reachesTerminal,
  replay,
  validateBeatSpec,
  type BeatSpec,
  type Session,
} from "@lessonstudio/lesson";
import { allDirectorTools } from "@lessonstudio/forge";
import { getFigure } from "@lessonstudio/svg";
import { resolvePreset } from "@lessonstudio/theme";
import { BINDING_OPS, SCENE_VOCABULARY, asSceneIntent, resolveExpr, validateBindings, type Storyboard } from "@lessonstudio/timeline";
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

const { theme } = resolvePreset("studio", "dark");

/** Render a beat's viz intent the way a browser would, but headlessly: the figure registry, the
 *  merged props, the theme. Returns the SVG string, which is what we get to make claims about. */
function drawn(s: Session, beatId: string): string {
  const intents = s.renderBeat(beatId).intents as Array<{ kind: string; name?: string; props?: Record<string, unknown> }>;
  const viz = intents.find((i) => i.kind === "viz");
  if (!viz?.name) throw new Error(`no viz intent on ${beatId}`);
  const figure = getFigure(viz.name);
  if (!figure) throw new Error(`no registered figure "${viz.name}"`);
  return figure(viz.props ?? {}, 0, theme);
}

// ── 1. The disclosure ─────────────────────────────────────────────────────────────────────────

console.log("[what a director is told it may author]");
{
  const registry = defaultBeatRegistry();
  const schemas = beatSchemas(registry);
  assert(schemas.types.length === Object.keys(registry).length, "every registered beat type appears in the director's schema list");
  assert(schemas.undocumented.length === 0, "and every one of them is DOCUMENTED — nothing ships a type a model cannot use");

  const addBeat = allDirectorTools().find((t) => t.name === "addBeat")!;
  const spec = (addBeat.input_schema.properties as { spec: { properties: Record<string, { enum?: string[]; description?: string }> } }).spec;
  const named = spec.properties.type?.enum ?? [];
  assert(
    Object.keys(registry).every((t) => named.includes(t)),
    `the addBeat tool's \`type\` enum names all ${Object.keys(registry).length} of them (${named.join(", ")}) — not three in prose`,
  );
  const params = spec.properties.params?.description ?? "";
  assert(
    Object.keys(registry).every((t) => params.includes(`${t}:`)),
    "and its `params` description carries a per-type shape, projected off the registry so it cannot drift",
  );
  assert(params.includes("storyboard") && params.includes("controls"), "including the two that matter for building a new demo");

  // The examples are the part a model will copy, so they had better be authorable. Dangling targets
  // are exempt and only there: an example names ids like `hard-q` to show the SHAPE of an arm, and
  // cannot know the beat ids of whatever lesson it is later pasted into. Everything else — unknown
  // type, malformed binding — is a defect in the disclosure itself.
  const lesson = defineLesson(lessonSpec);
  for (const card of schemas.types) {
    const example: BeatSpec = { id: "__example", type: card.type, params: card.schema!.example, next: "recap" };
    const problems = validateBeatSpec(example, registry, lesson.chart).filter((p) => p.code !== "DANGLING_TARGET");
    assert(
      problems.length === 0,
      `the worked example for \`${card.type}\` would itself be accepted (not merely described)${problems.length ? `: ${problems[0]!.detail}` : ""}`,
    );
  }

  // An example is authorable only if it also DRAWS. The `scene` example labels its ray with a bare
  // string, and the drawing vocabulary says that is allowed — which used to be false in the one
  // place it mattered: the renderer flattened a label through `toPlain`, which threw on a string
  // after adjudication had already accepted the beat.
  const sceneCard = schemas.types.find((c) => c.type === "scene")!;
  const example = sceneCard.schema!.example as unknown as { storyboard: Storyboard };
  const svg = getFigure("declarative")!({ storyboard: example.storyboard }, 0, theme);
  assert(svg.includes("one ray, one direction"), "and the `scene` example RENDERS: its bare-string label reaches the stage, as the vocabulary promises");

  const help = formatAuthoring(registry);
  assert(SCENE_VOCABULARY.nodeKinds.every((k) => help.includes(k.kind)), "the help text names every drawable node kind");
  assert(SCENE_VOCABULARY.easings.every((e) => help.includes(e)), "…every easing…");
  assert(BINDING_OPS.every((op) => help.includes(op)), "…and every binding op, so `$ref` is discoverable rather than folklore");
}

// ── 2. A new figure, as data ──────────────────────────────────────────────────────────────────

const APERTURE: Storyboard = {
  duration: 900,
  stage: { w: 400, h: 200 },
  initial: [
    { id: "wall", kind: "rect", x: 190, y: 20, w: 12, h: 160, fill: "#334155" },
    { id: "ray-a", kind: "line", x: 20, y: 40, x2: 380, y2: 160, stroke: "#f59e0b", opacity: 0 },
    { id: "ray-b", kind: "line", x: 20, y: 160, x2: 380, y2: 40, stroke: "#f59e0b", opacity: 0 },
    { id: "cap", kind: "label", x: 20, y: 190, text: "two rays, crossing at the hole", size: 16 },
  ],
  tweens: [
    { target: "ray-a", property: "opacity", to: 1, start: 0, duration: 500, easing: "smooth" },
    { target: "ray-b", property: "opacity", to: 1, start: 200, duration: 500, easing: "smooth" },
  ],
};

console.log("\n[a figure the lesson never anticipated, authored as pure JSON]");
{
  const s = open();
  s.send({ type: "next" });
  const result = s.direct({ op: "addBeat", spec: { id: "crossing-rays", type: "scene", params: { storyboard: APERTURE } as never }, enter: true }, "ai");
  assert(result.ok, "a director installs a whole new animated figure with `addBeat` — no code, no registration");
  assert(s.activeBeatId() === "crossing-rays", "and the learner is standing in it");

  const intents = s.render().intents.map((i) => asSceneIntent(i)).filter((i) => i !== null);
  const scene = intents[0];
  assert(!!scene, "it renders: a scene intent, the same kind an authored `scene` beat emits");
  assert(scene?.storyboard === APERTURE, "carrying the storyboard, so a renderer with a clock animates it");
  assert((scene?.snapshot.nodes ?? []).length === APERTURE.initial!.length, "and an initial frame with all five primitives, for a renderer without one");

  let inlineThrew = false;
  try {
    assertNoInlineFns({ id: "crossing-rays", type: "scene", params: { storyboard: APERTURE } as never });
  } catch {
    inlineThrew = true;
  }
  assert(!inlineThrew, "the beat holds no function anywhere — which is the precondition for the next assertion");

  // The whole point of the freeze: the tutor's figure is in the LOG, so it comes back without a model.
  const rebuilt = replay(defineLesson(lessonSpec), s.context.history);
  assert(rebuilt.activeBeatId() === "crossing-rays", "replayed from the event log alone, the learner lands back in it");
  assert(
    JSON.stringify(rebuilt.render().intents) === JSON.stringify(s.render().intents),
    "and it draws identically — the figure is data, so no provider is consulted",
  );
}

// ── 3. A new INTERACTIVE figure, as data ──────────────────────────────────────────────────────

/** "What if the hole were wider?" — the question the three.js apparatus cannot answer, authored by
 *  a director as a bound storyboard: the hole's height IS the slider, and the blur follows it. */
function widerHole(): BeatSpec {
  return {
    id: "wider-hole",
    type: "explorable",
    params: {
      controls: [{ kind: "slider", key: "hole", label: "hole width", min: 2, max: 40, step: 2 }],
      defaults: { hole: 4 },
      viz: {
        name: "declarative",
        props: {
          storyboard: {
            duration: 0,
            stage: { w: 400, h: 200 },
            initial: [
              { id: "wall", kind: "rect", x: 190, y: 20, w: 12, h: 160, fill: "#334155" },
              // The hole: centred on the wall, as tall as the slider says.
              { id: "hole", kind: "rect", x: 190, y: { $sub: [100, { $div: [{ $ref: "hole" }, 2] }] }, w: 12, h: { $ref: "hole" } },
              // The blur it throws on the screen: proportional, and never thinner than a unit.
              {
                id: "blur",
                kind: "rect",
                x: 340,
                y: { $sub: [100, { $ref: "hole" }] },
                w: 40,
                h: { $max: [{ $mul: [{ $ref: "hole" }, 2] }, 1] },
                fill: "#f59e0b",
              },
              { id: "cap", kind: "label", x: 20, y: 190, text: "wider hole: brighter, blurrier", size: 16 },
            ],
            tweens: [],
          },
        },
      },
    } as never,
    next: "wall-3",
  };
}

console.log("\n[an INTERACTIVE figure, as data — the gap that used to need code]");
{
  const s = open();
  s.send({ type: "next" });
  const result = s.direct({ op: "addBeat", spec: widerHole(), enter: true }, "ai");
  assert(result.ok, "a director installs an explorable whose visual is `declarative` — a figure whose behaviour is entirely its props");

  const narrow = drawn(s, "wider-hole");
  assert(narrow.includes('height="4"'), "at the default the hole is drawn 4 units tall: the binding resolved against the control value");
  assert(narrow.includes('height="8"'), "and the blur is twice that, from the same value — arithmetic, as data");

  s.send({ type: "demo.set", payload: { key: "hole", value: 30 } });
  const wide = drawn(s, "wider-hole");
  assert(wide !== narrow, "drag the slider and the SVG changes — a reactive demo with no registered code behind it");
  assert(wide.includes('height="30"') && wide.includes('height="60"'), "the hole is 30 and the blur 60: the picture tracks the slider");
  assert(wide.includes("translate(190 85)"), "and a DERIVED position moved with it (`$sub[100, hole/2]` ⇒ 85), so composed arithmetic works, not just `$ref`");

  const rebuilt = replay(defineLesson(lessonSpec), s.context.history);
  assert(drawn(rebuilt, "wider-hole") === wide, "replay reproduces the dragged state exactly — the slider move is in the log like everything else");
}

// ── 4. Safety: refused atomically, and never a function ───────────────────────────────────────

console.log("\n[a malformed demo is refused, not drawn]");
{
  const s = open();
  s.send({ type: "next" });
  const nodesBefore = Object.keys(s.lesson.chart.states).length;
  const stepsBefore = s.context.history.length;
  const holeNode = (spec: BeatSpec): Record<string, unknown> =>
    (spec.params as { viz: { props: { storyboard: { initial: Array<Record<string, unknown>> } } } }).viz.props.storyboard.initial[1]!;

  const typo = widerHole();
  holeNode(typo)["h"] = { $mull: ["hole"] };
  const bad = s.direct({ op: "addBeat", spec: typo, enter: true }, "ai");
  assert(!bad.ok && bad.error?.kind === "invalid", "a mistyped op (`$mull`) is refused at adjudication, before anything renders");
  assert((bad.error?.problems ?? []).some((p) => p.code === "BAD_BINDING"), "as a BAD_BINDING problem — a reason a model can read and retry from");
  assert(Object.keys(s.lesson.chart.states).length === nodesBefore, "and nothing was installed — the chart is what it was");
  assert(s.context.history.length === stepsBefore, "nor is there a step in the history: a refused turn did not happen");
  assert(s.activeBeatId() === "wall-2", "the learner did not move");

  const ghost = widerHole();
  holeNode(ghost)["h"] = { $ref: "aperture" };
  const refused = s.direct({ op: "addBeat", spec: ghost, enter: true }, "ai");
  assert(!refused.ok, "so is a `$ref` to a control the beat never declared — which would otherwise resolve to 0 and draw a demo that cannot move");

  // The same schema a director is shown is what refuses it: a `scene` with no storyboard used to
  // pass adjudication and throw inside `render()`, which is a crash in the learner's tab.
  const empty = s.direct({ op: "addBeat", spec: { id: "no-figure", type: "scene", params: { narration: "…" } as never }, enter: true }, "ai");
  assert(
    !empty.ok && (empty.error?.problems ?? []).some((p) => p.code === "MISSING_PARAM"),
    "and a beat missing a param its own `paramsSchema` marks required is refused, rather than crashing the renderer",
  );
  assert(s.lesson.chart.states["no-figure"] === undefined, "…with nothing installed, like every other refusal");

  // Refusal is a guard, not the only guard: the resolver itself is total, so a binding that somehow
  // reaches a renderer is a wrong number and never a crashed lesson.
  assert(resolveExpr({ $mull: [1, 2] } as never, {}) === 0, "an unknown op resolves to 0 rather than throwing");
  assert(resolveExpr({ $div: [1, 0] } as never, {}) === 0, "so does a division by zero");
  assert(resolveExpr({ $ref: "nope" }, {}) === 0, "and a missing control");
  assert(validateBindings({ $mull: [1] }).length === 1, "and `validateBindings` is what turns each of those into a refusal instead");

  let inlineThrew = false;
  try {
    assertNoInlineFns({ id: "x", type: "explain", params: { text: "hi", onEnter: (() => {}) as never } });
  } catch {
    inlineThrew = true;
  }
  assert(inlineThrew, "a beat carrying a FUNCTION is rejected outright — the one thing a director may never author, because it would not replay");
}

// ── 5. Phase 3: both ways out of a detour, and an ending behind each ──────────────────────────

console.log("\n[a two-exit answer, and an ending reachable from both exits]");
{
  const s = open();
  s.send({ type: "next" });
  const said = s.direct({ op: "say", text: "Both at once: brighter **and** blurrier.", exits: "both" }, "ai");
  assert(said.ok, 'the tutor answers with `exits: "both"`');
  const id = said.added[0]!;

  const node = s.lesson.chart.states[id]!;
  const keys = Object.keys(node.on ?? {}).filter((k) => k.startsWith("exit."));
  assert(keys.length === 2, "the answer beat has two exit edges…");
  const targets = keys.map((k) => node.on?.[k]?.[0]?.target ?? null);
  assert(targets[0] === "wall-2" && targets[1] === "wall-3", "…one back to the interrupted beat, one onward past it");
  for (const t of targets) {
    assert(
      t !== null && reachesTerminal(s.lesson.chart, t),
      `an ending is still reachable from the "${t}" exit — the no-stranding invariant covers the new edges`,
    );
  }

  // And the exits are real: send one and the learner is where its label said.
  assert(s.direct({ op: "goto", beatId: id }, "teacher").ok && s.activeBeatId() === id, "standing in the answer again");
  s.send({ type: keys[1]! });
  assert(s.activeBeatId() === "wall-3", "the onward exit moves the learner FORWARD — a detour is no longer a dead end");

  // `to: null` is the other thing an exit may be, and it must end the lesson rather than strand.
  const ender = s.direct(
    {
      op: "addBeat",
      spec: {
        id: "that-is-all",
        type: "explain",
        params: {
          text: "That is the whole idea.",
          exits: [
            { label: "Back to the wall", to: "wall-3" },
            { label: "I'm done", to: null },
          ],
        } as never,
      },
      enter: true,
    },
    "ai",
  );
  assert(ender.ok, "an exit may also END the lesson (`to: null`)");
  assert(s.lesson.chart.states["that-is-all"]?.on?.["exit.1"]?.length === 0, "wired as an empty candidate list — how the interpreter spells terminal");
  s.send({ type: "exit.1" });
  assert(s.done, "and sending it finishes the lesson, from a beat the tutor wrote mid-session");
}

console.log(
  `\nAUTHORING POWER PASSED — ${passed}/${passed} checks: every registered beat type is disclosed with an ` +
    `example that would itself be accepted; a director authors a new animated figure AND a slider-driven one as ` +
    `pure JSON that renders and replays; a mistyped binding is refused atomically and a function outright; and a ` +
    `two-exit answer leads forward, backward, or to an ending.`,
);
