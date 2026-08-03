import { BINDING_OPS, COMPARE_OPS } from "./bind.js";
import { easings } from "./sample.js";
import { ANIM_PROPS, NODE_BASE_PROPS, type SceneNode } from "./scene.js";
import type { Easing } from "./storyboard.js";

/**
 * THE DECLARATIVE DRAWING VOCABULARY, as data.
 *
 * A `Storyboard` is pure JSON all the way down — `Easing` and `AnimProp` are string unions, a
 * `Tween` is a flat record, and a `SceneNode` is a plain object. That means a language model can
 * emit a whole new animated figure through `addBeat {type:"scene"}` and have it compile, render,
 * replay and rasterize like an authored one.
 *
 * It could always do that. What it could not do is KNOW that, because nothing described the
 * vocabulary. This module is that description, in one place, so the director's tool schema and
 * the director's help text are two renderings of one list rather than two lists that drift.
 */
export interface NodeKindDoc {
  kind: string;
  /** Props this kind adds on top of `NODE_BASE_PROPS`. Empty string = base props only. */
  props: string;
  doc: string;
}

export const SCENE_NODE_KINDS = [
  { kind: "rect", props: "w, h", doc: "axis-aligned rectangle anchored at (x,y)" },
  { kind: "circle", props: "r, stroke?, strokeWidth?", doc: "circle centred on (x,y)" },
  { kind: "line", props: "x2, y2, stroke?", doc: "segment from (x,y) to (x2,y2)" },
  { kind: "arrow", props: "x2, y2, stroke?", doc: "line with a head at (x2,y2)" },
  { kind: "label", props: "text, size?, anchor?, baseline?, weight?", doc: "plain text; `text` is a RichText tree or a string. NOT math — TeX is not rendered on the stage" },
  { kind: "path", props: "d, stroke?, strokeWidth?, draw?, len?", doc: "SVG path; animate `draw` 0→1 with `len` set to stroke it on" },
  { kind: "ring", props: "rOuter, rInner, innerDy?, stroke?", doc: "annulus — an aperture, an orbit, a donut" },
  { kind: "group", props: "children", doc: "nests nodes; animating the group moves them together" },
] as const satisfies readonly NodeKindDoc[];

/** Compile-time guard: every `kind` in the `SceneNode` union must be documented above.
 *  `line | arrow` share one union member and are documented separately, hence both listed. */
type Documented = (typeof SCENE_NODE_KINDS)[number]["kind"];
type Undocumented = Exclude<SceneNode["kind"], Documented>;
const _allKindsDocumented: Undocumented extends never ? true : Undocumented = true;
void _allKindsDocumented;

/** Every easing name the sampler implements — read off the implementation, never retyped. */
export const EASING_NAMES = Object.keys(easings) as Easing[];

/**
 * The whole vocabulary in one object: what a director may draw, what it may animate, and how the
 * motion may be shaped. Pure data — safe to embed in a prompt or a JSON schema.
 */
export const SCENE_VOCABULARY = {
  baseProps: NODE_BASE_PROPS,
  nodeKinds: SCENE_NODE_KINDS,
  animProps: ANIM_PROPS,
  easings: EASING_NAMES,
  tween: "{target: <node id>, property: <animProp>, from?, to, start: <ms>, duration: <ms>, easing?}",
  camera: "{at: <ms>, x, y, w, h, easing?} — keyframed viewBox window; omit for the whole stage",
  storyboard: "{duration: <ms>, initial: SceneNode[], tweens: Tween[], stage?: {w,h}, camera?: CameraKey[]}",
  bindingOps: BINDING_OPS,
  compareOps: COMPARE_OPS,
} as const;

/**
 * How to make a figure REACT — the `explorable` half of the vocabulary.
 *
 * Kept beside the drawing vocabulary because it is the same act: a binding is a number you have
 * not computed yet. Its own block because it answers a different question — not "what can I draw"
 * but "how does what I draw follow the learner's hand".
 */
export function formatBindings(): string {
  const L: string[] = ["## BINDINGS (an `explorable`'s figure, reacting to its own controls)"];
  L.push("  Give the `explorable` a viz of {name:\"declarative\", props:{storyboard: …}} and write a");
  L.push("  BINDING wherever a number goes. Its control values are the storyboard's inputs, so the");
  L.push("  figure re-draws as the learner drags — a new interactive demo out of pure JSON.");
  L.push(`    {"$ref":"hole"}                     the live value of the control keyed \`hole\` (a toggle reads 1/0)`);
  L.push(`    {"$mul":[{"$ref":"hole"},0.9]}      arithmetic: ${BINDING_OPS.filter((o) => o !== "$ref" && o !== "$if").join(" ")}`);
  L.push(`    {"$if":[{"$gt":[{"$ref":"hole"},20]},"#ef4444","#38bdf8"]}   pick between two values`);
  L.push(`  $sub and $div fold left; $clamp is [value,lo,hi]; $round is [value] or [value,step];`);
  L.push(`  $if compares with ${COMPARE_OPS.join(" ")}. That is the whole language — there is nothing else,`);
  L.push("  and a binding to a control you did not declare is refused with the rest of the turn.");
  return L.join("\n");
}

/**
 * The vocabulary as a compact help block — the same bytes in a teacher's terminal and in a model's
 * system prompt, matching `COMMAND_HELP`'s house style.
 */
export function formatSceneVocabulary(): string {
  const L: string[] = ["## DRAWING (a `scene` beat's storyboard — pure JSON, no code)"];
  L.push(`  storyboard  ${SCENE_VOCABULARY.storyboard}`);
  L.push(`  tween       ${SCENE_VOCABULARY.tween}`);
  L.push(`  camera      ${SCENE_VOCABULARY.camera}`);
  L.push(`  every node  ${SCENE_VOCABULARY.baseProps.join(", ")}`);
  L.push(`  node kinds`);
  for (const k of SCENE_VOCABULARY.nodeKinds) {
    L.push(`    ${k.kind.padEnd(7)} ${k.props.padEnd(38)} ${k.doc}`);
  }
  L.push(`  animate     ${SCENE_VOCABULARY.animProps.join(" ")}`);
  L.push(`  easings     ${SCENE_VOCABULARY.easings.join(" ")}`);
  L.push("  coordinates are stage units, growing right and DOWN; set stage:{w,h} and draw inside it.");
  return L.join("\n");
}
