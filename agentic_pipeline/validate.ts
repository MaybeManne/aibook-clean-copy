// LAYER 1: validation (TypeScript port of validate.py).
//
// Validates the pipeline's JSON artifacts (plan, act specs, gate specs, viz spec)
// against structural rules and cross references. each validator returns a list of
// error strings, empty means valid.
//
// NOTE: validate.py optionally uses the Python `jsonschema` package for full JSON
// Schema validation, and falls back to the structural checks below when it isn't
// installed. this port has no jsonschema wired up, so tryJsonschema always reports
// "unavailable" and we go straight to the structural checks. that matches Python's
// behavior when jsonschema isn't installed. the structural checks are a faithful port.
//
// Inputs are typed `any` on purpose: these functions exist to check possibly
// malformed data, same as the Python dicts they came from.

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

const SCHEMA_DIR = path.join(import.meta.dirname, "schemas");

function loadSchema(name: string): any {
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, `${name}.json`), "utf8"));
}

// jsonschema isn't available here, so this always returns null (unavailable), which
// sends every validator down the structural-check path. same as Python's ImportError.
function tryJsonschema(_data: any, _schema: any): string[] | null {
  return null;
}


// Validate a lesson plan: required fields, unique node ids, and that gate/marker
// after_act values point at real acts.
export function validatePlan(plan: any): string[] {
  const errors: string[] = [];

  const schema = loadSchema("lesson_plan");
  const schemaErrors = tryJsonschema(plan, schema);
  if (schemaErrors !== null) {
    errors.push(...schemaErrors);
    if (errors.length) return errors;
  }

  // structural checks
  if (!("meta" in plan)) errors.push("Missing 'meta' field");
  else if (!("title" in (plan.meta || {}))) errors.push("Missing 'meta.title'");

  if (!("problem" in plan)) errors.push("Missing 'problem' field");
  else if (!("text" in (plan.problem || {}))) errors.push("Missing 'problem.text'");

  if (!("nodes" in plan)) {
    errors.push("Missing 'nodes' field");
    return errors;
  }

  // node ids must be unique (branch act ids count too)
  const ids = new Set<any>();
  const actIds = new Set<any>();
  for (const node of plan.nodes) {
    const nid = node.id;
    const ntype = node.type;
    if (nid) {
      if (ids.has(nid)) errors.push(`Duplicate node ID: ${nid}`);
      ids.add(nid);
    }
    if (ntype === "act") {
      actIds.add(nid);
      for (const wp of node.wrong_path_acts || []) {
        if (wp && typeof wp === "object") actIds.add(wp.id);
      }
    }
  }

  // gate after_act references
  for (const node of plan.nodes) {
    if (node.type === "gate") {
      const after = node.after_act;
      if (after && !actIds.has(after)) {
        errors.push(`Gate ${node.id} references non-existent act: ${after}`);
      }
    }
  }

  // marker after_act references
  for (const node of plan.nodes) {
    if (node.type === "marker") {
      const after = node.after_act;
      if (after && !actIds.has(after)) {
        errors.push(`Marker '${node.label}' references non-existent act: ${after}`);
      }
    }
  }

  return errors;
}


// Validate one act spec: act_id, non-empty beats, each beat has a say, no duplicate
// narration, and (optionally) viz actions match the plan and the plan node outline.
export function validateActSpec(actSpec: any, plan: any = null, planNode: any = null): string[] {
  const errors: string[] = [];

  const schema = loadSchema("act_spec");
  const schemaErrors = tryJsonschema(actSpec, schema);
  if (schemaErrors !== null) {
    errors.push(...schemaErrors);
    if (errors.length) return errors;
  }

  if (!("act_id" in actSpec)) errors.push("Missing 'act_id'");
  if (!("beats" in actSpec)) {
    errors.push("Missing 'beats'");
    return errors;
  }
  if (!actSpec.beats || actSpec.beats.length === 0) errors.push("Act has no beats");

  (actSpec.beats as any[]).forEach((beat, i) => {
    if (!("say" in beat)) errors.push(`Beat ${i} missing 'say' field`);
    else if (typeof beat.say !== "string" || !beat.say.trim()) {
      errors.push(`Beat ${i} 'say' must be non-empty string`);
    }
  });

  // duplicate beat detection: catches the act_worker repeating narration.
  // null-proto map so prototype-name says ("toString"/"valueOf"/"__proto__"/...)
  // don't false-match against inherited members, matching the Python dict.
  const seen: Record<string, number> = Object.create(null);
  (actSpec.beats || []).forEach((beat: any, i: number) => {
    const say = beat.say ?? "";
    if (say && say in seen) {
      errors.push(
        `Beat ${i} has duplicate 'say' text of beat ${seen[say]} (act_worker must produce unique narration)`
      );
    } else {
      seen[say] = i;
    }
  });

  // cross-check viz actions against the plan if we have one
  if (plan && plan.viz_requirements?.actions?.length) {
    const known = new Set((plan.viz_requirements.actions as any[]).map((a) => a.method));
    (actSpec.beats || []).forEach((beat: any, i: number) => {
      for (const va of beat.viz_actions || []) {
        if (va.method && !known.has(va.method)) {
          errors.push(`Beat ${i} uses unknown viz action: ${va.method}`);
        }
      }
    });
  }

  // plan-node-specific checks: beat count + per-beat viz_action presence.
  // the planner outline is the structural source of truth, one beat per entry.
  if (planNode !== null) {
    const outline = planNode.beat_outline || [];
    const beats = actSpec.beats || [];
    if (outline.length && beats.length !== outline.length) {
      errors.push(
        `Beat count mismatch: produced ${beats.length}, plan outline has ${outline.length}. ` +
          "Act worker must emit exactly one beat per outline entry."
      );
    }
    outline.forEach((out: any, i: number) => {
      const requiredMethods = out.viz_actions || [];
      if (!requiredMethods.length || i >= beats.length) return;
      const beat = beats[i];
      const gotMethods = (beat.viz_actions || [])
        .map((va: any) => va.method)
        .filter((m: any) => m);
      const missing = requiredMethods.filter((m: any) => !gotMethods.includes(m));
      if (missing.length) {
        errors.push(
          `Beat ${i} missing required viz_actions from plan: ${missing}. ` +
            `Got: ${gotMethods.length ? gotMethods : "[]"}.`
        );
      }
    });
  }

  return errors;
}


// Validate one gate spec: gate_type, after_act, and the type-specific required fields.
// gate_id is intentionally NOT checked here (the pipeline injects it, not the LLM).
export function validateGateSpec(gateSpec: any, _plan: any = null): string[] {
  const errors: string[] = [];

  const schema = loadSchema("gate_spec");
  const schemaErrors = tryJsonschema(gateSpec, schema);
  if (schemaErrors !== null) {
    errors.push(...schemaErrors);
    if (errors.length) return errors;
  }

  if (!("gate_type" in gateSpec)) errors.push("Missing 'gate_type'");
  if (!("after_act" in gateSpec)) errors.push("Missing 'after_act'");
  // gate_id is pipeline-injected, never check it here

  const gt = gateSpec.gate_type;
  if (gt === "quiz") {
    if (!gateSpec.question) errors.push("Quiz gate missing 'question'");
    if (!gateSpec.options) errors.push("Quiz gate missing 'options'");
    if (gateSpec.correct === undefined || gateSpec.correct === null) {
      errors.push("Quiz gate missing 'correct'");
    }
  } else if (gt === "fill-in") {
    const prompt = gateSpec.prompt;
    if (!prompt) {
      errors.push("Fill-in gate missing 'prompt'");
    } else if (!prompt.includes("[___]")) {
      errors.push(
        "Fill-in gate 'prompt' missing [___] blank marker — the engine " +
          "splits on [___] to render the input field; without it no input " +
          "is drawn and the student cannot answer."
      );
    }
    if (!gateSpec.blank) errors.push("Fill-in gate missing 'blank'");
  }

  return errors;
}


// Validate one viz spec: mode plus the mode-specific required field, and (optionally)
// that every viz action used across acts is listed in actions_implemented.
export function validateVizSpec(vizSpec: any, _plan: any = null, allActs: any = null): string[] {
  const errors: string[] = [];

  const schema = loadSchema("viz_spec");
  const schemaErrors = tryJsonschema(vizSpec, schema);
  if (schemaErrors !== null) {
    errors.push(...schemaErrors);
    if (errors.length) return errors;
  }

  const mode = vizSpec.mode;
  if (!mode) {
    errors.push("Missing 'mode'");
    return errors;
  }

  if (mode === "custom_code" && !vizSpec.code) errors.push("custom_code mode requires 'code' field");
  if (mode === "mobject_plugin" && !vizSpec.mobject_plugin_code) {
    errors.push("mobject_plugin mode requires 'mobject_plugin_code' field");
  }
  if (mode === "preset" && !vizSpec.preset) errors.push("preset mode requires 'preset' field");

  // cross-check: every viz action used in an act should be implemented
  if (allActs && vizSpec.actions_implemented) {
    const implemented = new Set(vizSpec.actions_implemented);
    for (const actId of Object.keys(allActs)) {
      const act = allActs[actId];
      for (const beat of act.beats || []) {
        for (const va of beat.viz_actions || []) {
          const method = va.method;
          if (method && !implemented.has(method)) {
            errors.push(`Act ${actId} uses viz action '${method}' not in actions_implemented`);
          }
        }
      }
    }
  }

  return errors;
}


// Run every validator on a full set of artifacts. returns a map of category to
// errors, only categories with errors appear. empty map means everything is valid.
export function validateAll(
  plan: any,
  actSpecs: Record<string, any>,
  gateSpecs: Record<string, any>,
  vizSpec: any
): Record<string, string[]> {
  const results: Record<string, string[]> = {};

  const planErrors = validatePlan(plan);
  if (planErrors.length) results["plan"] = planErrors;

  for (const actId of Object.keys(actSpecs)) {
    const errs = validateActSpec(actSpecs[actId], plan);
    if (errs.length) results[`act:${actId}`] = errs;
  }

  for (const gateId of Object.keys(gateSpecs)) {
    const errs = validateGateSpec(gateSpecs[gateId], plan);
    if (errs.length) results[`gate:${gateId}`] = errs;
  }

  if (vizSpec) {
    const errs = validateVizSpec(vizSpec, plan, actSpecs);
    if (errs.length) results["viz"] = errs;
  }

  return results;
}


// CLI, mirrors validate.py's __main__: --plan, --act (repeatable), --gate (repeatable), --viz.
function main(): void {
  const argv = process.argv.slice(2);
  let planPath: string | undefined;
  const actPaths: string[] = [];
  const gatePaths: string[] = [];
  let vizPath: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--plan") planPath = argv[++i];
    else if (a === "--act") actPaths.push(argv[++i]);
    else if (a === "--gate") gatePaths.push(argv[++i]);
    else if (a === "--viz") vizPath = argv[++i];
  }

  let plan: any = null;
  if (planPath) {
    plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
    const errors = validatePlan(plan);
    if (errors.length) {
      console.log("PLAN errors:");
      for (const e of errors) console.log(`  - ${e}`);
    } else {
      console.log("PLAN: OK");
    }
  }

  for (const p of actPaths) {
    const spec = JSON.parse(fs.readFileSync(p, "utf8"));
    const errors = validateActSpec(spec, plan);
    const label = spec.act_id ?? p;
    if (errors.length) {
      console.log(`ACT ${label} errors:`);
      for (const e of errors) console.log(`  - ${e}`);
    } else {
      console.log(`ACT ${label}: OK`);
    }
  }

  for (const p of gatePaths) {
    const spec = JSON.parse(fs.readFileSync(p, "utf8"));
    const errors = validateGateSpec(spec, plan);
    const label = spec.gate_id ?? p;
    if (errors.length) {
      console.log(`GATE ${label} errors:`);
      for (const e of errors) console.log(`  - ${e}`);
    } else {
      console.log(`GATE ${label}: OK`);
    }
  }

  if (vizPath) {
    const spec = JSON.parse(fs.readFileSync(vizPath, "utf8"));
    const errors = validateVizSpec(spec, plan);
    if (errors.length) {
      console.log("VIZ errors:");
      for (const e of errors) console.log(`  - ${e}`);
    } else {
      console.log("VIZ: OK");
    }
  }
}

// run as a CLI only when invoked directly (not when imported).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
