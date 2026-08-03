/**
 * BINDINGS — the one thing a director could not previously say.
 *
 * A `Storyboard` is already pure JSON, so an agent can author a whole new figure and have it
 * render, replay and rasterize. What it could not author was a figure that REACTS: `explorable`
 * wires its controls to a visual by NAME, resolved in a code registry, and a director may not
 * register code (`assertNoInlineFns` is what keeps a recorded turn replayable). So "show me a
 * wider hole" was unanswerable — not because the idea is hard, but because there was no way to
 * write "this rectangle's height IS the hole slider" as data.
 *
 * A binding is that sentence: `{"$ref":"hole"}` anywhere a number goes, plus enough arithmetic to
 * place things relative to it. Deliberately small and deliberately not a language —
 *
 *   • no `eval`, no strings-as-code: the ops are a closed list, checked against it before use;
 *   • total: every malformed or unknown input resolves to `0` rather than throwing, so a bad
 *     binding is a wrong picture and never a crashed lesson (and `validateBindings` catches it
 *     at adjudication time, before the learner sees either);
 *   • JSON end to end, so a bound figure survives the freeze → replay round trip like any beat.
 *
 * It is not Turing-complete and must not become so. There are no user functions, no loops, and no
 * way to name a new op — the point is that everything expressible here is safe to record and
 * re-run, which is exactly the property the code escape hatch does not have.
 */
import type { SceneNode } from "./scene.js";
import type { Storyboard } from "./storyboard.js";

/** Every binding op, as data — `validateBindings`, `resolve` and the director's help read this. */
export const BINDING_OPS = [
  "$ref",
  "$add",
  "$sub",
  "$mul",
  "$div",
  "$min",
  "$max",
  "$clamp",
  "$round",
  "$if",
] as const;

/** The comparisons `$if` tests with. Same closed-list discipline as the ops. */
export const COMPARE_OPS = ["$lt", "$lte", "$gt", "$gte", "$eq"] as const;

export type BindingOp = (typeof BINDING_OPS)[number];
export type CompareOp = (typeof COMPARE_OPS)[number];

/** A number, a literal string (colours, labels), or something computed from the controls. */
export type Expr = number | string | Binding;

export type Predicate =
  | { $lt: [Expr, Expr] }
  | { $lte: [Expr, Expr] }
  | { $gt: [Expr, Expr] }
  | { $gte: [Expr, Expr] }
  | { $eq: [Expr, Expr] };

export type Binding =
  /** The value of a control, by key. A toggle reads as 1/0. */
  | { $ref: string }
  | { $add: Expr[] }
  /** Folded left: `[a, b, c]` is `a - b - c`. */
  | { $sub: Expr[] }
  | { $mul: Expr[] }
  | { $div: Expr[] }
  | { $min: Expr[] }
  | { $max: Expr[] }
  /** `[value, lo, hi]`. */
  | { $clamp: [Expr, Expr, Expr] }
  /** `[value]` to the nearest integer, or `[value, step]` to the nearest multiple of `step`. */
  | { $round: [Expr] | [Expr, Expr] }
  /** `[predicate, then, else]` — the one branch, and the only reason a string literal is an Expr. */
  | { $if: [Predicate, Expr, Expr] };

/** Control values a binding reads. Numbers, booleans and numeric strings all resolve. */
export type BindingValues = Record<string, unknown>;

const OPS = new Set<string>(BINDING_OPS);
const COMPARES = new Set<string>(COMPARE_OPS);

function soleKey(v: unknown): string | null {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return null;
  const keys = Object.keys(v);
  return keys.length === 1 ? keys[0]! : null;
}

/** True for a well-formed-looking binding node — one key, and that key a known op. */
export function isBinding(v: unknown): v is Binding {
  const k = soleKey(v);
  return k !== null && OPS.has(k);
}

function isPredicate(v: unknown): v is Predicate {
  const k = soleKey(v);
  return k !== null && COMPARES.has(k);
}

/**
 * One key, and that key starts with `$` — a binding or a TYPO for one. `$multipy` is not a
 * binding, and silently treating it as a plain object would put an `[object Object]` where a
 * number belongs; this is how validation tells the two cases apart and complains.
 */
function looksBound(v: unknown): boolean {
  const k = soleKey(v);
  return k !== null && k.startsWith("$");
}

/** True if a binding appears anywhere inside — the cheap test before doing any resolving work. */
export function containsBinding(v: unknown): boolean {
  if (isBinding(v) || looksBound(v)) return true;
  if (Array.isArray(v)) return v.some(containsBinding);
  if (typeof v === "object" && v !== null) return Object.values(v).some(containsBinding);
  return false;
}

function toNum(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function fold(args: unknown[], values: BindingValues, f: (a: number, b: number) => number, seed?: number): number {
  const nums = args.map((a) => toNum(resolveExpr(a, values)));
  if (nums.length === 0) return seed ?? 0;
  if (seed !== undefined && nums.length === 1) return f(seed, nums[0]!);
  return nums.reduce(f);
}

function compare(p: Predicate, values: BindingValues): boolean {
  const op = Object.keys(p)[0] as CompareOp;
  const pair = (p as Record<string, unknown>)[op];
  const args = Array.isArray(pair) ? pair : [];
  const a = resolveExpr(args[0], values);
  const b = resolveExpr(args[1], values);
  if (op === "$eq") {
    // Loose on purpose: a `$ref` to a choice control is a string, and comparing it to a string
    // literal is the natural thing to write. Numbers still compare as numbers.
    return typeof a === "string" || typeof b === "string" ? String(a) === String(b) : a === b;
  }
  const x = toNum(a);
  const y = toNum(b);
  return op === "$lt" ? x < y : op === "$lte" ? x <= y : op === "$gt" ? x > y : x >= y;
}

/**
 * Resolve one expression against the control values. TOTAL — an unknown key, a wrong arity, a
 * malformed op all yield `0` rather than an exception, because this runs inside a render.
 */
export function resolveExpr(e: unknown, values: BindingValues): number | string {
  if (typeof e === "number") return Number.isFinite(e) ? e : 0;
  if (typeof e === "string") return e;
  if (!isBinding(e)) return 0;
  const op = Object.keys(e)[0] as BindingOp;
  const arg = (e as Record<string, unknown>)[op];
  const args = Array.isArray(arg) ? arg : [];

  switch (op) {
    case "$ref": {
      if (typeof arg !== "string") return 0;
      const v = values[arg];
      if (typeof v === "number") return Number.isFinite(v) ? v : 0;
      if (typeof v === "boolean") return v ? 1 : 0;
      if (typeof v === "string") {
        const n = Number(v);
        return v.trim() !== "" && Number.isFinite(n) ? n : v;
      }
      return 0;
    }
    case "$add":
      return fold(args, values, (a, b) => a + b);
    case "$sub":
      return fold(args, values, (a, b) => a - b);
    case "$mul":
      return fold(args, values, (a, b) => a * b);
    case "$div":
      return fold(args, values, (a, b) => (b === 0 ? 0 : a / b));
    case "$min":
      return fold(args, values, (a, b) => Math.min(a, b));
    case "$max":
      return fold(args, values, (a, b) => Math.max(a, b));
    case "$clamp": {
      const x = toNum(resolveExpr(args[0], values));
      const lo = toNum(resolveExpr(args[1], values));
      const hi = toNum(resolveExpr(args[2], values));
      return Math.min(Math.max(x, Math.min(lo, hi)), Math.max(lo, hi));
    }
    case "$round": {
      const x = toNum(resolveExpr(args[0], values));
      if (args.length < 2) return Math.round(x);
      const step = toNum(resolveExpr(args[1], values));
      return step === 0 ? Math.round(x) : Math.round(x / step) * step;
    }
    case "$if": {
      const pred = args[0];
      const taken = isPredicate(pred) && compare(pred, values) ? args[1] : args[2];
      return resolveExpr(taken, values);
    }
  }
}

/**
 * Deep-replace every binding inside `value` with what it resolves to, leaving everything else
 * structurally identical. Generic rather than node-aware on purpose: it means a binding works in
 * any position the format has or grows — a node's `x`, a gradient stop, a tween's `to`, a camera
 * keyframe — without this file knowing the scene format.
 */
export function resolveBindings<T>(value: T, values: BindingValues): T {
  if (isBinding(value)) return resolveExpr(value, values) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => resolveBindings(v, values)) as unknown as T;
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveBindings(v, values);
    return out as unknown as T;
  }
  return value;
}

/** `resolveBindings` over a node list — the scene-shaped name for it. */
export function resolveScene(nodes: SceneNode[], values: BindingValues): SceneNode[] {
  return resolveBindings(nodes, values);
}

/**
 * A storyboard with every binding resolved: `initial`, `tweens` and `camera` all at once, so a
 * bound `to:` on a tween composes with a bound node the same way an authored number does.
 */
export function resolveStoryboard(sb: Storyboard, values: BindingValues): Storyboard {
  return resolveBindings(sb, values);
}

export interface BindingProblem {
  /** Where it is, as a dotted/bracketed path from the root of what was validated. */
  path: string;
  detail: string;
}

/**
 * Report what is wrong with the bindings inside `value`. Returns problems, never throws, and says
 * nothing about a value with no bindings in it.
 *
 * `keys` is what makes this worth running: given the control keys of the beat being authored, a
 * `$ref` to a slider that does not exist is caught while the turn can still be refused, instead of
 * silently resolving to 0 and drawing a figure the learner cannot make move.
 */
export function validateBindings(value: unknown, opts: { keys?: readonly string[] } = {}): BindingProblem[] {
  const problems: BindingProblem[] = [];
  const keys = opts.keys ? new Set(opts.keys) : null;

  const arity = (op: string, args: unknown[], path: string, min: number, max = min): boolean => {
    if (args.length < min || args.length > max) {
      const want = min === max ? `${min}` : `${min}-${max}`;
      problems.push({ path, detail: `${op} takes ${want} argument${max === 1 ? "" : "s"}, got ${args.length}` });
      return false;
    }
    return true;
  };

  const walkExpr = (e: unknown, path: string): void => {
    if (typeof e === "number" || typeof e === "string") return;
    if (!isBinding(e)) {
      if (looksBound(e)) {
        const op = Object.keys(e as object)[0]!;
        problems.push({ path, detail: `unknown binding op "${op}" — the ops are ${BINDING_OPS.join(" ")}` });
        return;
      }
      problems.push({ path, detail: `expected a number, a string or a binding, got ${describe(e)}` });
      return;
    }
    const op = Object.keys(e)[0] as BindingOp;
    const arg = (e as Record<string, unknown>)[op];
    const args = Array.isArray(arg) ? arg : [];

    if (op === "$ref") {
      if (typeof arg !== "string" || arg.trim() === "") {
        problems.push({ path, detail: "$ref takes a control key as a string" });
      } else if (keys && !keys.has(arg)) {
        problems.push({ path, detail: `$ref "${arg}" is not a control on this beat (have: ${[...keys].join(" ") || "none"})` });
      }
      return;
    }
    if (!Array.isArray(arg)) {
      problems.push({ path, detail: `${op} takes an array of arguments` });
      return;
    }
    const ok =
      op === "$clamp"
        ? arity(op, args, path, 3)
        : op === "$round"
          ? arity(op, args, path, 1, 2)
          : op === "$if"
            ? arity(op, args, path, 3)
            : op === "$sub" || op === "$div"
              ? arity(op, args, path, 2, Infinity)
              : arity(op, args, path, 1, Infinity);
    if (!ok) return;

    if (op === "$if") {
      const pred = args[0];
      if (!isPredicate(pred)) {
        problems.push({ path: `${path}.$if[0]`, detail: `expected a comparison (${COMPARE_OPS.join(" ")})` });
      } else {
        const cmp = Object.keys(pred)[0]!;
        const pair = (pred as Record<string, unknown>)[cmp];
        if (!Array.isArray(pair) || pair.length !== 2) {
          problems.push({ path: `${path}.$if[0].${cmp}`, detail: `${cmp} compares exactly 2 values` });
        } else {
          pair.forEach((p, i) => walkExpr(p, `${path}.$if[0].${cmp}[${i}]`));
        }
      }
      walkExpr(args[1], `${path}.$if[1]`);
      walkExpr(args[2], `${path}.$if[2]`);
      return;
    }
    args.forEach((a, i) => walkExpr(a, `${path}.${op}[${i}]`));
  };

  const walk = (v: unknown, path: string): void => {
    if (isBinding(v) || looksBound(v)) {
      walkExpr(v, path);
      return;
    }
    if (Array.isArray(v)) {
      v.forEach((item, i) => walk(item, `${path}[${i}]`));
      return;
    }
    if (typeof v === "object" && v !== null) {
      for (const [k, item] of Object.entries(v)) walk(item, path ? `${path}.${k}` : k);
    }
  };

  walk(value, "");
  return problems;
}

function describe(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "an array";
  return typeof v === "object" ? `an object with keys ${Object.keys(v).join(",") || "(none)"}` : typeof v;
}
