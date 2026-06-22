// LAYER 1: pipeline types + structural assertions (TypeScript port of pipeline_types.py).
//
// Two things live here, same as the Python:
//   1. interfaces mirroring the JSON schemas (documentation + typing).
//   2. runtime assert* functions called at each stage boundary. these fail fast
//      with a precise message when a stage produces the wrong shape.
//
// The assert* functions are the runnable part. they take plain `any` (the Python
// took plain dicts and used .get()), so they can check possibly-malformed data.
//
// NOTE on naming: pipeline_types.py called the beat-level {method, params, offset}
// shape `VizAction`, but that name means something different in schemas/types.ts
// (the plan-level {method, description, params_schema}). to avoid the collision we
// call the beat-level one `BeatVizAction` here. the plan-level shape keeps the name
// `VizActionSpec` (same as in the Python). the interfaces are type-only (erased at
// runtime), so the overlap with schemas/types.ts costs nothing.

// ---- primitive building blocks ----

export type ActId = string; // ^act_[a-z0-9_]+$
export type GateId = string; // ^gate_[a-z0-9_]+$
export type VizModeLiteral = "svg" | "figure" | "chart" | null;
export type GateType = "quiz" | "fill-in" | "proof-builder" | "interactive";
export type NodeType = "act" | "gate" | "marker";

export interface BeatVizAction {
  method: string;
  params?: Record<string, any>;
  offset?: string | number;
}

export interface Beat {
  say?: string;
  card?: Record<string, any> | null;
  viz_actions?: BeatVizAction[];
  inline_viz?: string | boolean | null;
  duration?: number | null;
  viz_panel_override?: string | null;
}

export interface ActSpec {
  act_id: ActId;
  title: string;
  viz_panel: "svg" | "figure" | "chart" | null;
  beats: Beat[];
}

export interface BlankConfig {
  answer?: string[];
  width?: number;
  placeholder?: string;
}

export interface GateSpec {
  gate_id?: GateId; // injected by orchestrator from plan node id
  gate_type?: GateType;
  after_act?: ActId;
  question?: string;
  options?: string[];
  correct?: number | string;
  explanations?: Record<string, string>;
  prompt?: string;
  blank?: BlankConfig;
  hint?: string;
  successMessage?: string;
  instruction?: string;
  availablePieces?: Record<string, string>[];
  correctOrder?: string[];
  slots?: number;
  title?: string;
  description?: string;
  slider?: Record<string, any>;
  compute?: string;
  displays?: Record<string, string>[];
  challenge?: string;
  wrong_path_acts?: ActId[];
}

export interface VizSpec {
  mode?: "preset" | "custom_code" | "mobject_plugin" | "three_js";
  preset?: string | null;
  config?: Record<string, any> | null;
  code?: string | null;
  mobject_plugin_code?: string | null;
  three_js_code?: string | null;
  actions_implemented?: string[];
}

export interface BeatOutline {
  narration_hint?: string;
  card_type?: string | null;
  viz_actions?: string[];
  inline_at_end?: boolean;
}

export interface ActNode {
  type?: "act";
  id?: ActId;
  title?: string;
  objective?: string;
  viz_panel?: "svg" | "figure" | "chart" | null;
  beat_outline?: BeatOutline[];
  context_from_previous?: string;
  wrong_path_acts?: ActNode[];
}

export interface GateNode {
  type?: "gate";
  id?: GateId;
  gate_type?: GateType;
  after_act?: ActId;
  question_hint?: string;
  wrong_path_hint?: string;
  wrong_path_acts?: ActNode[];
}

export interface MarkerNode {
  type: "marker";
  label: string;
  after_act: ActId;
}

export type PlanNode = ActNode | GateNode | MarkerNode;

export interface VizActionSpec {
  method?: string;
  description?: string;
  params_schema?: Record<string, string>;
}

export interface VizRequirements {
  type?: "custom" | "preset_number_line" | "preset_coord_plane" | "preset_unit_circle" | "none";
  description?: string;
  actions?: VizActionSpec[];
  config?: Record<string, any>;
  viewBox?: string;
}

export interface PlanMeta {
  title?: string;
  source?: string;
  answer?: string;
  estimated_duration_minutes?: number;
}

export interface PlanProblem {
  text?: string;
  highlight?: string;
}

export interface LessonPlan {
  meta: PlanMeta;
  problem: PlanProblem;
  viz_requirements: VizRequirements;
  nodes: PlanNode[];
}

export type ActSpecMap = Record<string, ActSpec>;
export type GateSpecMap = Record<string, GateSpec>;


// ─────────────────────────────────────────────────────────────────────
// Runtime structural assertions, called at every stage boundary.
// Each throws TypeError with a "[pipeline contract] ..." message naming the bad
// field. they do NOT mutate their argument.
// ─────────────────────────────────────────────────────────────────────

const ACT_ID_RE = /^act_[a-z0-9_]+$/;
const GATE_ID_RE = /^gate_[a-z0-9_]+$/;
const VALID_GATE_TYPES = new Set(["quiz", "fill-in", "proof-builder", "interactive"]);
const VALID_NODE_TYPES = new Set(["act", "gate", "marker"]);
const VALID_VIZ_MODES = new Set(["preset", "custom_code", "mobject_plugin", "three_js"]);

// True for a plain object (Python isinstance(x, dict)), excluding arrays/null.
function isDict(x: any): boolean {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

// Rough match for Python's type(x).__name__, used only in error text.
function typeName(x: any): string {
  if (x === null || x === undefined) return "NoneType";
  if (Array.isArray(x)) return "list";
  if (typeof x === "object") return "dict";
  if (typeof x === "string") return "str";
  if (typeof x === "number") return Number.isInteger(x) ? "int" : "float";
  if (typeof x === "boolean") return "bool";
  return typeof x;
}

// Rough match for Python's {x!r}: quote strings, None for null/undefined.
function pyRepr(x: any): string {
  if (x === null || x === undefined) return "None";
  if (typeof x === "string") return `'${x}'`;
  return String(x);
}

// Throw unless cond is truthy. single failure mode for every assert_* check.
function require_(cond: any, msg: string): void {
  if (!cond) {
    throw new TypeError(`[pipeline contract] ${msg}`);
  }
}

// Return [firstIndex, dupIndex] of the first repeated value, or null.
function findDuplicate(xs: any[]): [number, number] | null {
  // null-proto map so prototype-name keys ("toString", "valueOf", "__proto__", ...)
  // behave like a Python dict — no inherited members to false-match against.
  const seen: Record<string, number> = Object.create(null);
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x in seen) return [seen[x], i];
    seen[x] = i;
  }
  return null;
}

// Throw unless `plan` matches LessonPlan. Called after stage 2.
export function assertPlanShape(plan: any): void {
  require_(isDict(plan), `plan must be dict, got ${typeName(plan)}`);
  require_("meta" in plan && "title" in plan.meta, "plan.meta.title missing");
  require_("problem" in plan && "text" in plan.problem, "plan.problem.text missing");
  require_(Array.isArray(plan.nodes), "plan.nodes must be list");

  const ids = new Set<string>();
  plan.nodes.forEach((n: any, i: number) => {
    require_(isDict(n), `plan.nodes[${i}] not a dict`);
    const t = n.type;
    require_(VALID_NODE_TYPES.has(t), `plan.nodes[${i}].type=${pyRepr(t)} invalid`);
    if (t === "act" || t === "gate") {
      const nid = n.id;
      require_(typeof nid === "string", `plan.nodes[${i}].id missing`);
      if (t === "act") {
        require_(ACT_ID_RE.test(nid), `act id ${pyRepr(nid)} must match ^act_[a-z0-9_]+$`);
      } else {
        require_(GATE_ID_RE.test(nid), `gate id ${pyRepr(nid)} must match ^gate_[a-z0-9_]+$`);
        require_(VALID_GATE_TYPES.has(n.gate_type), `gate ${nid} has invalid gate_type ${pyRepr(n.gate_type)}`);
        require_(typeof n.after_act === "string", `gate ${nid}.after_act missing`);
      }
      require_(!ids.has(nid), `duplicate node id: ${nid}`);
      ids.add(nid);
    }
  });
}

// Throw unless `spec` matches ActSpec. With plan_node, also checks act_id match,
// beat count match, and unique beat 'say' fields.
export function assertActSpecShape(spec: any, planNode: any = null): void {
  require_(isDict(spec), `act spec not a dict: ${typeName(spec)}`);
  require_(ACT_ID_RE.test(spec.act_id ?? ""), `act_id missing/invalid: ${pyRepr(spec.act_id)}`);
  const beats = spec.beats;
  require_(Array.isArray(beats) && beats.length > 0, `act ${spec.act_id}: beats must be non-empty list`);
  beats.forEach((b: any, i: number) => {
    require_(isDict(b), `act ${spec.act_id} beat ${i} not dict`);
    require_(typeof b.say === "string" && b.say.trim(), `act ${spec.act_id} beat ${i} missing/empty 'say'`);
  });

  const says = beats.map((b: any) => b.say);
  const dupIdx = findDuplicate(says);
  if (dupIdx !== null) {
    throw new TypeError(
      `[pipeline contract] act ${spec.act_id}: duplicate beat text at ` +
        `positions (${dupIdx[0]}, ${dupIdx[1]}). Act worker produced repeated narration. ` +
        `Offending text: ${pyRepr(String(says[dupIdx[0]]).slice(0, 100))}`
    );
  }

  if (planNode !== null) {
    require_(spec.act_id === planNode.id, `act_id ${pyRepr(spec.act_id)} != plan node id ${pyRepr(planNode.id)}`);
    const outline = planNode.beat_outline || [];
    if (outline.length) {
      require_(
        beats.length === outline.length,
        `act ${spec.act_id}: produced ${beats.length} beats, plan ` +
          `beat_outline has ${outline.length}. Act worker dropped or ` +
          `duplicated beats.`
      );
    }
  }
}

// Throw unless `spec` matches GateSpec after orchestrator injection (gate_id present
// and authoritative). With plan_node, checks gate_id/gate_type/after_act all match.
export function assertGateSpecShape(spec: any, planNode: any = null): void {
  require_(isDict(spec), `gate spec not a dict: ${typeName(spec)}`);
  require_(GATE_ID_RE.test(spec.gate_id ?? ""), `gate_id missing/invalid (must be injected from plan): ${pyRepr(spec.gate_id)}`);
  require_(VALID_GATE_TYPES.has(spec.gate_type), `gate ${spec.gate_id}: invalid gate_type ${pyRepr(spec.gate_type)}`);
  require_(
    typeof spec.after_act === "string" && ACT_ID_RE.test(spec.after_act),
    `gate ${spec.gate_id}: after_act missing/invalid`
  );

  if (planNode !== null) {
    require_(
      spec.gate_id === planNode.id,
      `gate_id mismatch: spec=${pyRepr(spec.gate_id)} plan=${pyRepr(planNode.id)}. ` + `Assembler lookup would fail.`
    );
    require_(spec.gate_type === planNode.gate_type, `gate ${spec.gate_id}: gate_type mismatch with plan`);
    require_(spec.after_act === planNode.after_act, `gate ${spec.gate_id}: after_act mismatch with plan`);
  }
}

// Throw unless `spec` matches VizSpec for its declared mode.
export function assertVizSpecShape(spec: any): void {
  require_(isDict(spec), "viz spec not dict");
  require_(VALID_VIZ_MODES.has(spec.mode), `viz spec mode ${pyRepr(spec.mode)} invalid`);
  if (spec.mode === "custom_code") {
    require_(typeof spec.code === "string" && spec.code.trim(), "custom_code mode requires non-empty 'code'");
  } else if (spec.mode === "mobject_plugin") {
    require_(
      typeof spec.mobject_plugin_code === "string" && spec.mobject_plugin_code.trim(),
      "mobject_plugin mode requires non-empty 'mobject_plugin_code'"
    );
  } else if (spec.mode === "three_js") {
    require_(
      typeof spec.three_js_code === "string" && spec.three_js_code.trim(),
      "three_js mode requires non-empty 'three_js_code'"
    );
  } else if (spec.mode === "preset") {
    require_(typeof spec.preset === "string" && spec.preset.trim(), "preset mode requires non-empty 'preset'");
  }
}

// Throw unless every action declared in plan.viz_requirements.actions appears in
// viz_spec.actions_implemented. catches silent drops by the viz agent.
export function assertVizImplementsPlanActions(vizSpec: any, plan: any): void {
  const declared = new Set<string>(
    (plan.viz_requirements?.actions || []).map((a: any) => a.method)
  );
  const implemented = new Set<string>(vizSpec.actions_implemented || []);
  const missing = [...declared].filter((m) => !implemented.has(m));
  if (missing.length) {
    missing.sort();
    // match Python's repr of a sorted list: ['m2', 'm3']
    const reprList = `[${missing.map((m) => `'${m}'`).join(", ")}]`;
    throw new TypeError(
      `[pipeline contract] viz_spec is missing ${missing.length} action(s) ` +
        `declared in the plan: ${reprList}. Viz agent silently dropped them.`
    );
  }
}
