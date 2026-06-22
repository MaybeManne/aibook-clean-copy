// SCHEMA TYPES: TypeScript interfaces generated from schemas/*.json.
//
// These mirror the JSON schemas the pipeline uses (act_spec.json, gate_spec.json,
// viz_spec.json, lesson_plan.json). The .json files stay the source of truth for
// the LLM tool calls; these interfaces just give the TypeScript code the same
// shapes to work with.
//
// Keys are snake_case on purpose. they are the actual wire format the LLMs emit
// and the assembler reads, so they must match the JSON exactly. don't camelCase them.


// ---- shared little enums (kept as string unions) ----

// Which viz panel an act/beat draws into. null means no panel.
export type VizPanel = "svg" | "figure" | "chart" | null;

// The kinds of interactive gate.
export type GateType = "quiz" | "fill-in" | "proof-builder" | "interactive";


// ---- act_spec.json ----

// One viz action inside a beat: a method name plus its params and timing offset.
export interface VizActionSpec {
  method: string;
  params?: Record<string, any>;      // additionalProperties: true
  offset?: string | number;          // default 0
}

// A card attached to a beat. type is fixed, everything else is open (additionalProperties).
export interface Card {
  type:
    | "text" | "latex" | "derivation" | "recap" | "bar-chart"
    | "figure" | "title" | "plot-2d" | "split" | "graph" | "code-runner";
  [key: string]: any;
}

// One beat: a line of narration plus optional card and viz actions.
export interface Beat {
  say: string;
  duration?: number | null;
  card?: Card | null;
  viz_actions?: VizActionSpec[];     // default []
  inline_viz?: string | boolean | null;
  viz_panel_override?: string | null;
}

// Worker output: the full beat spec for one act.
export interface ActSpec {
  act_id: string;
  title: string;
  viz_panel: VizPanel;
  beats: Beat[];
}


// ---- gate_spec.json ----

// The blank config for a fill-in gate.
export interface Blank {
  answer?: string[];
  width?: number;
  placeholder?: string;
}

// Worker output for one gate. Lots of optional fields because different gate_types
// use different ones (quiz vs fill-in vs proof-builder vs interactive).
// NOTE: gate_id is NOT in the schema required list. the pipeline injects it from
// the plan node, so it shows up here as optional.
export interface GateSpec {
  gate_type: GateType;
  after_act: string;
  label?: string | null;

  // quiz
  question?: string;
  options?: string[];
  correct?: number | string;
  explanations?: Record<string, string>;

  // fill-in
  prompt?: string;
  blank?: Blank;
  hint?: string;
  successMessage?: string;

  // proof-builder
  instruction?: string;
  availablePieces?: any[];
  correctOrder?: any[];
  slots?: number;

  // interactive
  title?: string;
  description?: string;
  slider?: Record<string, any>;
  compute?: string;
  displays?: any[];
  challenge?: string;

  // branch acts for wrong answers
  wrong_path_acts?: string[];

  // injected by the pipeline from the plan node
  gate_id?: string;
}


// ---- viz_spec.json ----

export type VizMode = "preset" | "custom_code" | "mobject_plugin" | "three_js";

// The vizConfig object handed to L.viz().
export interface VizConfig {
  plugin?: string;
  config?: Record<string, any>;
}

// Viz agent output: the visualization plugin spec.
export interface VizSpec {
  mode: VizMode;
  preset?: "numberLine" | "coordPlane" | "unitCircle";
  preset_options?: Record<string, any>;
  config?: VizConfig | null;
  code?: string;                     // custom_code mode
  mobject_plugin_code?: string;      // mobject_plugin mode
  three_js_code?: string;            // three_js mode
  actions_implemented?: string[];
}


// ---- lesson_plan.json ----

export interface PlanMeta {
  title: string;
  source: string;
  answer?: string;
  estimated_duration_minutes?: number;
}

export interface PlanProblem {
  text: string;
  highlight?: string;
}

// One declared viz action in viz_requirements.actions.
export interface VizAction {
  method: string;
  description: string;
  params_schema?: Record<string, string>;
}

export interface VizRequirements {
  type: "custom" | "preset_number_line" | "preset_coord_plane" | "preset_unit_circle" | "none";
  description: string;
  config?: Record<string, any>;
  actions: VizAction[];
  viewBox?: string;                  // default "0 0 500 500"
}

// One planner-level beat hint (lighter than the worker's full Beat).
export interface BeatOutline {
  narration_hint: string;
  card_type?:
    | "text" | "latex" | "derivation" | "recap" | "bar-chart"
    | "figure" | "title" | "plot-2d" | "split" | "none";
  viz_actions?: string[];
  inline_at_end?: boolean;
}

// The three node kinds in the lesson DAG, discriminated by `type`.
export interface ActNode {
  type: "act";
  id: string;
  title: string;
  objective: string;
  depends_on?: string[];
  context_from_previous?: string;
  beat_outline: BeatOutline[];
  viz_panel: VizPanel;
}

export interface GateNode {
  type: "gate";
  id: string;
  gate_type: GateType;
  after_act: string;
  question_hint?: string;
  wrong_path_hint?: string | null;
  wrong_path_acts?: ActNode[];       // nested branch acts
}

export interface MarkerNode {
  type: "marker";
  label: string;
  after_act: string;
}

export type PlanNode = ActNode | GateNode | MarkerNode;

// Planner output: the whole lesson DAG.
export interface LessonPlan {
  meta: PlanMeta;
  problem: PlanProblem;
  viz_requirements: VizRequirements;
  nodes: PlanNode[];
}
