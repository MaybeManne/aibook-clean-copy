// LAYER 1: assembler (TypeScript port of assembler.py).
//
// Turns the JSON artifacts (plan, act specs, gate specs, viz spec) into MX.lesson()
// JavaScript. BLIND, deterministic, no LLM. throws AssemblyError when the artifacts
// break the contract (e.g. plan declares a gate but no spec exists).
//
// This is a straight port. inputs are typed `any` because they're plain JSON dicts,
// same as the Python.
//
// One number-format caveat: Python str() prints a whole-number float as "5.0", but
// JSON.parse collapses 5.0 to the JS number 5, so this port prints "5". integers and
// non-integer floats are unaffected. only matters if an artifact has integral floats.

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

export class AssemblyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssemblyError";
  }
}

// Escape a string for a JS double-quoted literal. order matters:
// backslash, then quote, then newline, then strip carriage returns.
function jsStr(s: string): string {
  s = s.replace(/\\/g, "\\\\");
  s = s.replace(/"/g, '\\"');
  s = s.replace(/\n/g, "\\n");
  s = s.replace(/\r/g, "");
  return `"${s}"`;
}

// Python's str() for a number (used by jsValue). JSON can't tell 5 from 5.0, so
// integral values print without a trailing ".0" (see caveat at top of file).
function pyNum(v: number): string {
  return String(v);
}

// Convert a value to its JS literal form.
function jsValue(v: any, indent = 0): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return pyNum(v);
  if (typeof v === "string") return jsStr(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    const items = v.map((item) => jsValue(item, indent + 2));
    if (items.reduce((a, i) => a + i.length, 0) < 60) {
      return "[" + items.join(", ") + "]";
    }
    const pad = " ".repeat(indent + 2);
    const inner = items.join(",\n" + pad);
    return "[\n" + pad + inner + "\n" + " ".repeat(indent) + "]";
  }
  if (typeof v === "object") return jsObj(v, indent);
  return String(v);
}

// Convert a dict to a JS object literal. valid-identifier keys stay bare, others quoted.
function jsObj(obj: any, indent = 0): string {
  const keys = Object.keys(obj);
  if (keys.length === 0) return "{}";
  const pad = " ".repeat(indent + 2);
  const pairs: string[] = [];
  for (const k of keys) {
    const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : jsStr(k);
    const valStr = jsValue(obj[k], indent + 2);
    pairs.push(`${keyStr}: ${valStr}`);
  }
  if (pairs.reduce((a, p) => a + p.length, 0) < 80) {
    return "{ " + pairs.join(", ") + " }";
  }
  const inner = pairs.join(",\n" + pad);
  return "{\n" + pad + inner + "\n" + " ".repeat(indent) + "}";
}

// Wrap JS code into a function(k) body (for interactive compute fields). Unused in
// the current pipeline but kept to match assembler.py.
function jsFnBody(codeStr: string): string {
  return `function(k) {\n    ${codeStr}\n  }`;
}

// Emit one beat as a chained A.say() statement.
export function emitBeat(beat: any, indent = 4): string {
  const pad = " ".repeat(indent);
  const chainPad = " ".repeat(indent + 1);

  const sayText = beat.say;
  const lines = [`${pad}A.say(${jsStr(sayText)})`];

  // .vizPanel() override first
  if (beat.viz_panel_override) {
    lines.push(`${chainPad}.vizPanel(${jsStr(beat.viz_panel_override)})`);
  }

  // .show() / .title() / .card()
  const card = beat.card;
  if (card) {
    const cardType = card.type;
    if (cardType === "text" && "content" in card && Object.keys(card).length <= 2) {
      lines.push(`${chainPad}.show(${jsStr(card.content)})`);
    } else if (cardType === "latex" && "content" in card) {
      const cardData: any = {};
      for (const k of Object.keys(card)) if (k !== "type") cardData[k] = card[k];
      const content = cardData.content;
      delete cardData.content;
      if (Object.keys(cardData).length > 0) {
        lines.push(`${chainPad}.show(${jsObj({ type: "latex", content, ...cardData }, indent + 3)})`);
      } else {
        lines.push(`${chainPad}.show(${jsStr(content)})`);
      }
    } else if (cardType === "title") {
      const heading = card.heading ?? "";
      const subheading = card.subheading ?? "";
      if (subheading) {
        lines.push(`${chainPad}.title(${jsStr(heading)}, ${jsStr(subheading)})`);
      } else {
        lines.push(`${chainPad}.title(${jsStr(heading)})`);
      }
    } else {
      const cardData: any = {};
      for (const k of Object.keys(card)) if (k !== "type") cardData[k] = card[k];
      lines.push(`${chainPad}.card(${jsStr(cardType)}, ${jsObj(cardData, indent + 3)})`);
    }
  }

  // .do() calls
  for (const va of beat.viz_actions || []) {
    const method = va.method;
    const params = va.params ?? {};
    const offset = va.offset ?? 0;

    const args = [jsStr(method)];
    const paramsNonEmpty = Object.keys(params).length > 0;
    if (paramsNonEmpty || offset) {
      args.push(paramsNonEmpty ? jsObj(params, indent + 3) : "{}");
    }
    if (offset && offset !== 0) {
      args.push(typeof offset === "string" ? jsStr(String(offset)) : String(offset));
    }

    lines.push(`${chainPad}.do(${args.join(", ")})`);
  }

  // .inline()
  const inline = beat.inline_viz;
  if (inline) {
    if (typeof inline === "string") {
      lines.push(`${chainPad}.inline(${jsStr(inline)})`);
    } else {
      lines.push(`${chainPad}.inline()`);
    }
  }

  // .duration()
  if (beat.duration) {
    lines.push(`${chainPad}.duration(${beat.duration})`);
  }

  return lines.join("\n") + ";";
}

// Emit an L.act() block from an ActSpec.
export function emitAct(actSpec: any, indent = 0): string {
  const pad = " ".repeat(indent);
  const lines: string[] = [];
  lines.push(`${pad}L.act(${jsStr(actSpec.title)}, function(A) {`);

  if (actSpec.viz_panel) {
    lines.push(`${pad}  A.vizPanel(${jsStr(actSpec.viz_panel)});`);
    lines.push("");
  }

  for (const beat of actSpec.beats) {
    lines.push(emitBeat(beat, indent + 2));
    lines.push("");
  }

  lines.push(`${pad}});`);
  return lines.join("\n");
}

// Emit an L.ask()/L.askFillIn()/L.askProof() call from a GateSpec.
export function emitGate(gateSpec: any, branchActSpecs: any = null, indent = 0): string {
  const pad = " ".repeat(indent);
  const gt = gateSpec.gate_type;

  const opts: any = {};

  if (gt === "quiz") {
    opts.question = gateSpec.question;
    opts.options = gateSpec.options;
    opts.correct = gateSpec.correct;
    opts.explain = gateSpec.explanations ?? {};
  } else if (gt === "fill-in") {
    if (gateSpec.label) opts.label = gateSpec.label;
    opts.prompt = gateSpec.prompt;
    opts.blank = gateSpec.blank;
    if (gateSpec.hint) opts.hint = gateSpec.hint;
    if (gateSpec.successMessage) opts.successMessage = gateSpec.successMessage;
  } else if (gt === "proof-builder") {
    if (gateSpec.label) opts.label = gateSpec.label;
    if (gateSpec.instruction) opts.instruction = gateSpec.instruction;
    if (gateSpec.availablePieces) opts.availablePieces = gateSpec.availablePieces;
    if (gateSpec.correctOrder) opts.correctOrder = gateSpec.correctOrder;
    if (gateSpec.slots) opts.slots = gateSpec.slots;
  } else if (gt === "interactive") {
    opts.type = "interactive";
    if (gateSpec.label) opts.label = gateSpec.label;
    if (gateSpec.title) opts.title = gateSpec.title;
    if (gateSpec.slider) opts.slider = gateSpec.slider;
    if (gateSpec.displays) opts.displays = gateSpec.displays;
    if (gateSpec.challenge) opts.challenge = gateSpec.challenge;
  }

  const methodMap: Record<string, string> = {
    quiz: "ask",
    "fill-in": "askFillIn",
    "proof-builder": "askProof",
    interactive: "ask",
  };
  const method = methodMap[gt];

  const wrongActs = gateSpec.wrong_path_acts ?? [];
  const hasWrongPath =
    wrongActs.length > 0 && branchActSpecs && Object.keys(branchActSpecs).length > 0;

  if (!hasWrongPath) {
    return `${pad}L.${method}(${jsObj(opts, indent + 2)});`;
  }

  const lines = [`${pad}L.${method}({`];
  const innerPad = pad + "  ";

  for (const k of Object.keys(opts)) {
    lines.push(`${innerPad}${k}: ${jsValue(opts[k], innerPad.length)},`);
  }

  lines.push(`${innerPad}wrongPath: function(B) {`);
  for (const actId of wrongActs) {
    if (actId in branchActSpecs) {
      const branchAct = branchActSpecs[actId];
      let actJs = emitAct(branchAct, innerPad.length + 2);
      actJs = actJs.replace("L.act(", "B.act(");
      lines.push(actJs);
    }
  }
  lines.push(`${innerPad}}`);

  lines.push(`${pad}});`);
  return lines.join("\n");
}

// Emit an L.marker() call.
export function emitMarker(label: string, indent = 0): string {
  const pad = " ".repeat(indent);
  return `${pad}L.marker(${jsStr(label)});`;
}

// Python repr of a sorted string list, for error messages: ['a', 'b'].
function reprStrList(xs: string[]): string {
  return `[${xs.map((x) => `'${x}'`).join(", ")}]`;
}

// Assemble the full MX.lesson() content JS from the artifacts.
export function assembleContent(plan: any, actSpecs: any, gateSpecs: any, vizSpec: any): string {
  const lines: string[] = [];
  const meta = plan.meta;
  const problem = plan.problem;

  lines.push(`MX.lesson(${jsStr(meta.title)}, function(L) {`);
  lines.push("");

  // source + meta
  lines.push(`L.source(${jsStr(meta.source)});`);
  const metaObj: any = {};
  for (const k of Object.keys(meta)) if (k !== "title" && k !== "source") metaObj[k] = meta[k];
  if (Object.keys(metaObj).length > 0) {
    lines.push(`L.meta(${jsObj(metaObj)});`);
  }
  lines.push("");

  // problem
  const problemOpts: any = {};
  if (problem.highlight) problemOpts.highlight = problem.highlight;
  if (Object.keys(problemOpts).length > 0) {
    lines.push(`L.problem(${jsStr(problem.text)}, ${jsObj(problemOpts)});`);
  } else {
    lines.push(`L.problem(${jsStr(problem.text)});`);
  }
  lines.push("");

  // viz config
  if (vizSpec) {
    const vizConfig = vizSpec.config;
    if (vizConfig) {
      lines.push(`L.viz(${jsObj(vizConfig)});`);
      lines.push("");
    }
  }

  // collect branch act specs from gate wrong paths
  const branchActSpecs: any = {};
  for (const gid of Object.keys(gateSpecs)) {
    const gspec = gateSpecs[gid];
    for (const actId of gspec.wrong_path_acts || []) {
      if (actId in actSpecs) branchActSpecs[actId] = actSpecs[actId];
    }
  }

  for (const node of plan.nodes) {
    const ntype = node.type;

    if (ntype === "act") {
      const actId = node.id;
      if (actId in actSpecs) {
        lines.push("");
        lines.push(emitAct(actSpecs[actId], 0));
        lines.push("");
      } else {
        lines.push(`// WARNING: No act spec found for ${actId}`);
      }
    } else if (ntype === "gate") {
      const gateId = node.id;
      if (!(gateId in gateSpecs)) {
        throw new AssemblyError(
          `Gate '${gateId}' declared in plan but no spec in gate_specs. ` +
            `Available gate IDs: ${reprStrList(Object.keys(gateSpecs).sort())}. ` +
            `Gate worker stage likely failed silently.`
        );
      }
      lines.push("");
      lines.push(emitGate(gateSpecs[gateId], branchActSpecs, 0));
      lines.push("");
    } else if (ntype === "marker") {
      lines.push("");
      lines.push(emitMarker(node.label));
      lines.push("");
    }
  }

  lines.push("});");
  return lines.join("\n");
}

// Normalize viz code that may have arrived as one compact JSON line (where a //
// comment would otherwise eat the rest of the file). inserts real newlines after
// ; { } when outside string literals. returns code unchanged if it already has newlines.
function normalizeVizCode(code: string): string {
  if (code.includes("\n")) return code;

  const result: string[] = [];
  let i = 0;
  const n = code.length;
  let inString: string | null = null; // null | '"' | "'" | '`'

  while (i < n) {
    const c = code[i];
    if (inString) {
      result.push(c);
      if (c === "\\" && i + 1 < n) {
        i += 1;
        result.push(code[i]);
      } else if (c === inString) {
        inString = null;
      }
    } else if (c === '"' || c === "'" || c === "`") {
      inString = c;
      result.push(c);
    } else if (c === ";") {
      result.push(c);
      result.push("\n");
    } else if (c === "{") {
      result.push(c);
      result.push("\n");
    } else if (c === "}") {
      result.push("\n");
      result.push(c);
    } else {
      result.push(c);
    }
    i += 1;
  }

  return result.join("");
}

// Extract the viz plugin JS from a VizSpec, or null if handled inline / unknown mode.
export function assembleViz(vizSpec: any): string | null {
  const mode = vizSpec.mode;

  if (mode === "custom_code") {
    const code = vizSpec.code || null;
    return code ? normalizeVizCode(code) : null;
  } else if (mode === "mobject_plugin") {
    const code = vizSpec.mobject_plugin_code || null;
    return code ? normalizeVizCode(code) : null;
  } else if (mode === "three_js") {
    const code = vizSpec.three_js_code || null;
    return code ? normalizeVizCode(code) : null;
  } else if (mode === "preset") {
    return null;
  }
  return null;
}

// Full assembly: load JSONs, emit JS files. returns [contentPath, vizPathOrNull].
export function assemble(
  planPath: string,
  actsDir: string,
  gatesDir: string,
  vizSpecPath: string,
  outputDir: string
): [string, string | null] {
  fs.mkdirSync(outputDir, { recursive: true });

  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));

  // glob in Python returns [] for a missing dir; readdirSync throws, so guard it.
  const globJson = (dir: string, prefix: string): string[] =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => new RegExp(`^${prefix}_.*\\.json$`).test(f)).sort()
      : [];

  const actSpecs: any = {};
  for (const p of globJson(actsDir, "act")) {
    const spec = JSON.parse(fs.readFileSync(path.join(actsDir, p), "utf8"));
    actSpecs[spec.act_id] = spec;
  }

  const gateSpecs: any = {};
  for (const p of globJson(gatesDir, "gate")) {
    const spec = JSON.parse(fs.readFileSync(path.join(gatesDir, p), "utf8"));
    gateSpecs[spec.gate_id] = spec;
  }

  let vizSpec: any = null;
  if (fs.existsSync(vizSpecPath)) {
    vizSpec = JSON.parse(fs.readFileSync(vizSpecPath, "utf8"));
  }

  const contentJs = assembleContent(plan, actSpecs, gateSpecs, vizSpec);
  let lessonId = String(plan.meta.title ?? "lesson").toLowerCase();
  lessonId = lessonId.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  const contentPath = path.join(outputDir, `${lessonId}.js`);
  fs.writeFileSync(contentPath, contentJs);
  console.log(`Content: ${contentPath} (${contentJs.length} bytes)`);

  const vizJs = vizSpec ? assembleViz(vizSpec) : null;
  let vizPath: string | null = null;
  if (vizJs) {
    vizPath = path.join(outputDir, `viz_${lessonId}.js`);
    fs.writeFileSync(vizPath, vizJs);
    console.log(`Viz:     ${vizPath} (${vizJs.length} bytes)`);
  }

  return [contentPath, vizPath];
}

// CLI, mirrors assembler.py's __main__.
function main(): void {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const idx = argv.indexOf(flag);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };
  const planPath = get("--plan");
  const actsDir = get("--acts");
  const gatesDir = get("--gates");
  const vizPath = get("--viz");
  const outputDir = get("--output");
  if (!planPath || !actsDir || !gatesDir || !vizPath || !outputDir) {
    console.error("usage: assembler.ts --plan P --acts D --gates D --viz P --output D");
    process.exit(2);
  }

  const [contentPath, vizOut] = assemble(planPath, actsDir, gatesDir, vizPath, outputDir);
  console.log(`\nAssembly complete.`);
  if (vizOut) {
    console.log(`  Content: ${contentPath}`);
    console.log(`  Viz:     ${vizOut}`);
  } else {
    console.log(`  Content: ${contentPath}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
