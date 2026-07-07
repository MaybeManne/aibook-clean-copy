// LAYER 0: orchestrator (TypeScript port of orchestrator.py).
//
// Drives the 6-stage lesson authoring pipeline. straight port of orchestrator.py.
//
// ADAPTATIONS YOU SHOULD KNOW ABOUT (TS differs from Python here, unavoidably):
//   1. ASYNC. the TS LLM SDKs (@anthropic-ai/sdk, @google/genai, openai) are all
//      Promise-based, whereas the Python SDKs are synchronous. so every function
//      that calls an LLM (callLlm, callLlmText, the _call* helpers, _retryWithErrors,
//      every stage*, stage3bVizVisualRevision, stage5Review, takeScreenshot, main)
//      is `async` and its callers `await` it. behavior is otherwise the same.
//   2. OPTIONAL DEPS. Python does try/except ImportError and raises RuntimeError if a
//      package is used but missing. TS imports the three SDKs statically (hard deps),
//      so the "package not installed" RuntimeError path is not reproduced.
//   3. SDK config keys. @google/genai uses camelCase config (systemInstruction,
//      responseMimeType, responseSchema, maxOutputTokens, thinkingConfig) where the
//      Python google-genai SDK used snake_case. mapped faithfully.
//   4. JSON.stringify is used for json.dumps. it does not escape non-ASCII (matches
//      the ensure_ascii=False calls; the one ensure_ascii=True call, the schema
//      injection, differs only if a schema contains non-ASCII, which it doesn't).
//
// VERIFICATION: typecheck-only. there are no API keys here, so the pipeline cannot be
// run end-to-end. tsc proves the port compiles against the real SDK types and that the
// control flow / types are internally consistent. it does NOT prove the LLM calls
// behave correctly at runtime, that the prompts produce valid output, or that the
// subprocess/playwright integrations work. those need a live run with keys.

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { execFileSync, spawnSync } from "child_process";
import { pathToFileURL } from "url";

import { assembleContent, assembleViz, AssemblyError } from "./assembler.ts";
import { validatePlan, validateActSpec, validateGateSpec, validateVizSpec } from "./validate.ts";
import {
  assertPlanShape,
  assertActSpecShape,
  assertGateSpecShape,
  assertVizSpecShape,
  assertVizImplementsPlanActions,
} from "./pipelineTypes.ts";

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const PIPELINE_DIR = import.meta.dirname;
const PROMPTS_DIR = path.join(PIPELINE_DIR, "prompts");
const CODE2HTML_DIR = path.dirname(PIPELINE_DIR);

// ─────────────────────────────────────────────────────────────────────
// LLM provider dispatch
// ─────────────────────────────────────────────────────────────────────

const GEMINI_MODELS = new Set(["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"]);
const ANTHROPIC_MODELS = new Set([
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
  "claude-sonnet-4-6",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-7",
]);

const OPENROUTER_PREFIX = "openrouter:";

// True if model is routed via OpenRouter. check this BEFORE _isGemini.
function _isOpenrouter(model: any): boolean {
  return typeof model === "string" && model.startsWith(OPENROUTER_PREFIX);
}

// Strip the openrouter: prefix to get the underlying provider/model slug.
function _stripOpenrouter(model: string): string {
  return _isOpenrouter(model) ? model.slice(OPENROUTER_PREFIX.length) : model;
}

// True if model is a Gemini model (else treated as Anthropic).
function _isGemini(model: string): boolean {
  if (_isOpenrouter(model)) return false;
  return model.startsWith("gemini-") || GEMINI_MODELS.has(model);
}

// Load a system prompt from the prompts directory.
export function loadPrompt(name: string): string {
  return fs.readFileSync(path.join(PROMPTS_DIR, `${name}.md`), "utf8");
}

// Call an LLM with structured JSON output. dispatches by model name. returns parsed JSON.
export async function callLlm(
  systemPrompt: string,
  userMessage: string,
  outputSchema: any,
  model = "gemini-2.5-flash"
): Promise<any> {
  if (_isOpenrouter(model)) return _callOpenrouter(systemPrompt, userMessage, outputSchema, model);
  if (_isGemini(model)) return _callGemini(systemPrompt, userMessage, outputSchema, model);
  return _callAnthropic(systemPrompt, userMessage, outputSchema, model);
}

// Call an LLM for plain-text output. dispatches by model name. returns a string.
export async function callLlmText(
  systemPrompt: string,
  userMessage: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  if (_isOpenrouter(model)) return _callOpenrouterText(systemPrompt, userMessage, model);
  if (_isGemini(model)) return _callGeminiText(systemPrompt, userMessage, model);
  return _callAnthropicText(systemPrompt, userMessage, model);
}

async function _callAnthropic(
  systemPrompt: string,
  userMessage: string,
  outputSchema: any,
  model: string
): Promise<any> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    tools: [{ name: "output", description: "Return structured output", input_schema: outputSchema }],
    tool_choice: { type: "tool", name: "output" },
  });

  for (const block of response.content) {
    if (block.type === "tool_use") return block.input;
  }
  throw new Error("No structured output returned from Claude API");
}

async function _callGemini(
  systemPrompt: string,
  userMessage: string,
  outputSchema: any,
  model: string
): Promise<any> {
  const client = new GoogleGenAI({});

  // always clean the schema to satisfy Gemini API restrictions
  outputSchema = _cleanSchemaForGemini(outputSchema);

  const response = await client.models.generateContent({
    model,
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: outputSchema,
      temperature: 0.7,
      maxOutputTokens: 65536,
      thinkingConfig: { thinkingBudget: 8192 },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return JSON.parse(text);
}

async function _callAnthropicText(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  for (const block of response.content) {
    if (block.type === "text") return block.text;
  }
  throw new Error("No text response returned from Claude API");
}

async function _callGeminiText(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const client = new GoogleGenAI({});

  const response = await client.models.generateContent({
    model,
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "text/plain",
      temperature: 0.7,
      maxOutputTokens: 65536,
      thinkingConfig: { thinkingBudget: 8192 },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return text;
}

// Build an OpenAI-compatible client pointed at OpenRouter.
function _openrouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set. Export it before running OpenRouter models.");
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://github.com/code2html",
      "X-Title": "code2html agentic pipeline",
    },
  });
}

async function _callOpenrouter(
  systemPrompt: string,
  userMessage: string,
  outputSchema: any,
  model: string
): Promise<any> {
  const client = _openrouterClient();
  const realModel = _stripOpenrouter(model);

  const cleanedSchema = _cleanSchemaForGemini(outputSchema);
  const systemWithSchema =
    `${systemPrompt}\n\n` +
    `## Output Format (REQUIRED)\n` +
    `You MUST respond with a single valid JSON object that conforms to this schema. ` +
    `No prose, no markdown fences — just the JSON object.\n\n` +
    "```json\n" +
    `${JSON.stringify(cleanedSchema, null, 2)}\n` +
    "```\n";

  // smaller output budget for models with limited context windows
  const smallCtx = new Set(["qwen/qwen-2.5-coder-32b-instruct", "mistralai/mistral-small-3.1-24b-instruct"]);
  const outTokens = smallCtx.has(realModel) ? 8000 : 16000;

  const response = await client.chat.completions.create({
    model: realModel,
    messages: [
      { role: "system", content: systemWithSchema },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: outTokens,
  });
  const text = response.choices[0].message.content;
  if (!text) throw new Error(`Empty response from OpenRouter (${realModel})`);

  // strip markdown fences if present — many providers leak ```json ... ```
  let stripped = text.trim();
  const fenceMatch = stripped.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    stripped = fenceMatch[1].trim();
  } else if (stripped.startsWith("```")) {
    let lines = stripped.split("\n");
    if (lines[0].startsWith("```")) lines = lines.slice(1);
    if (lines.length && lines[lines.length - 1].trim() === "```") lines = lines.slice(0, -1);
    stripped = lines.join("\n").trim();
  }
  // if still not parseable JSON, try to find the first { ... } block
  if (stripped && stripped[0] !== "{") {
    const objMatch = stripped.match(/\{[\s\S]*\}/);
    if (objMatch) stripped = objMatch[0];
  }
  try {
    return JSON.parse(stripped);
  } catch (e: any) {
    const snippet = text.slice(0, 500).replace(/\n/g, " ");
    throw new Error(`OpenRouter (${realModel}) returned non-JSON: ${e}. Payload start: ${JSON.stringify(snippet)}`);
  }
}

async function _callOpenrouterText(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const client = _openrouterClient();
  const realModel = _stripOpenrouter(model);

  const response = await client.chat.completions.create({
    model: realModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });
  const text = response.choices[0].message.content;
  if (!text) throw new Error(`Empty text response from OpenRouter (${realModel})`);
  return text;
}

// Run `node --check` on JS code. returns list of syntax error strings, empty if clean.
function _checkJsSyntax(code: string): string[] {
  const p = path.join(os.tmpdir(), `orch_${Date.now()}_${Math.random().toString(36).slice(2)}.js`);
  fs.writeFileSync(p, code);
  try {
    execFileSync("node", ["--check", p], { timeout: 10000, stdio: "pipe" });
    return [];
  } catch (e: any) {
    // node missing or timed out -> skip silently, same as Python's except branch
    if (e && (e.code === "ENOENT" || e.signal === "SIGTERM" || e.killed)) return [];
    const stderr = e && e.stderr ? String(e.stderr).trim() : String(e);
    return [stderr];
  } finally {
    try {
      fs.unlinkSync(p);
    } catch {}
  }
}

// Heuristic layout audit of a viz plugin. returns human-readable warnings (empty = clean).
function _checkVizLayout(code: string, viewboxW = 800, viewboxH = 400): string[] {
  const warnings: string[] = [];
  if (!code) return warnings;

  // stacked text pattern: y: ...i*... inside svgEl("text", ...) with no clearSlot()
  const stacked = code.match(/svgEl\(\s*["']text["'][^)]*?y\s*:\s*[^,}]*\bi\s*\*/g);
  if (stacked && stacked.length && !code.includes("clearSlot")) {
    warnings.push(
      'stacked-text risk: found `y: ...i*...` inside svgEl("text", ...) ' +
        "but no clearSlot() helper — repeated calls will overlap. " +
        "Add a slot map + clearSlot() before loops that draw text."
    );
  }

  // out-of-bounds coordinates (literals only)
  for (const m of code.matchAll(/["']?([xy])["']?\s*:\s*["']?(-?\d{3,5})["']?/g)) {
    const axis = m[1];
    const val = parseInt(m[2], 10);
    const bound = axis === "x" ? viewboxW : viewboxH;
    if (val < -50 || val > bound + 50) {
      warnings.push(`out-of-bounds: ${axis}=${val} outside viewBox 0..${bound}`);
      if (warnings.length > 8) break; // don't drown in noise
    }
  }

  // zone discipline: count text creations vs Z.<NAME> references
  const textCount = (code.match(/svgEl\(\s*["']text["']/g) || []).length;
  const zoneRefs = (code.match(/\bZ\.[A-Z_]+\b/g) || []).length;
  if (textCount >= 5 && zoneRefs === 0) {
    warnings.push(
      `zone discipline: ${textCount} text elements created but no ` +
        "Z.<ZONE> references — layout is freehand. Define `var Z = {...}` " +
        "and place every overlay inside a named zone."
    );
  }
  return warnings;
}

const ALLOWED_DSL = new Set(["say", "show", "do", "card", "inline", "title", "duration", "vizPanel", "marker"]);

// Reject a reviewer correction that introduces non-existent DSL methods or syntax errors.
function _rejectIfInvalidDsl(corrected: string, original: string, label = "content"): string {
  if (corrected === original) return corrected;
  const bad = new Set<string>();
  for (const m of corrected.matchAll(/\n\s*\.([a-zA-Z_]\w*)\(/g)) {
    if (!ALLOWED_DSL.has(m[1])) bad.add(m[1]);
  }
  if (bad.size) {
    console.log(`  WARNING: reviewer ${label} used invalid DSL methods ${reprStrList([...bad].sort())} — rejecting correction.`);
    return original;
  }
  if (_checkJsSyntax(corrected).length) {
    console.log(`  WARNING: reviewer ${label} has syntax errors — rejecting.`);
    return original;
  }
  return corrected;
}

// Python repr of a sorted string list, for messages: ['a', 'b'].
function reprStrList(xs: string[]): string {
  return `[${xs.map((x) => `'${x}'`).join(", ")}]`;
}

// Retry a structured LLM call with validation errors injected as feedback.
async function _retryWithErrors(
  systemPrompt: string,
  userMsg: string,
  schema: any,
  errors: string[],
  model: string
): Promise<any> {
  const errorLines = errors.map((e) => `  - ${e}`).join("\n");
  const retryMsg =
    `${userMsg}\n\n` +
    `## Validation Errors — Please Fix\n\n` +
    `Your previous output had these issues that must be corrected:\n` +
    `${errorLines}\n\n` +
    `Return a corrected version that addresses all of the above.`;
  return callLlm(systemPrompt, retryMsg, schema, model);
}

// Recursively prepare a JSON Schema for the Gemini API (strips unsupported keywords).
function _cleanSchemaForGemini(schema: any): any {
  if (schema === null || typeof schema !== "object" || Array.isArray(schema)) return schema;

  const allowed = new Set([
    "type", "properties", "required", "items", "enum", "description",
    "format", "nullable", "minimum", "maximum", "minItems", "maxItems",
  ]);

  const cleaned: any = {};

  // resolve array type like ["string","null"] -> type="string", nullable=true
  const rawType = schema.type;
  if (Array.isArray(rawType)) {
    const nonNull = rawType.filter((t: any) => t !== "null");
    const hasNull = rawType.includes("null");
    cleaned.type = nonNull.length ? nonNull[0] : "string";
    if (hasNull) cleaned.nullable = true;
  } else if (rawType) {
    cleaned.type = rawType;
  }

  for (const k of Object.keys(schema)) {
    const v = schema[k];
    if (k === "type") continue; // already handled above
    if (!allowed.has(k)) continue;
    if (k === "properties" && v !== null && typeof v === "object" && !Array.isArray(v)) {
      const props: any = {};
      for (const pk of Object.keys(v)) props[pk] = _cleanSchemaForGemini(v[pk]);
      cleaned[k] = props;
    } else if (k === "items") {
      cleaned[k] = _cleanSchemaForGemini(v);
    } else if (k === "enum") {
      const cleanEnum = v.filter((e: any) => e !== null);
      if (cleanEnum.length) cleaned[k] = cleanEnum;
      // if all values were null, skip the enum entirely
    } else {
      cleaned[k] = v;
    }
  }

  // default to object if type was never set
  if (!("type" in cleaned)) cleaned.type = "object";

  // arrays must have items defined
  if (cleaned.type === "array" && !("items" in cleaned)) cleaned.items = { type: "string" };

  return cleaned;
}

// Load a JSON schema and prepare it for tool_use / structured output.
function _schemaForTool(schemaName: string): any {
  const schema = JSON.parse(fs.readFileSync(path.join(PIPELINE_DIR, "schemas", `${schemaName}.json`), "utf8"));

  // flatten nodes: replace oneOf/$ref items with an inline union schema
  if (schema.properties && schema.properties.nodes) {
    schema.properties.nodes = {
      type: "array",
      description: "Ordered sequence of act, gate, and marker nodes",
      items: {
        type: "object",
        properties: {
          // common
          type: { type: "string", enum: ["act", "gate", "marker"], description: "Node discriminator" },
          id: { type: "string" },
          // act fields
          title: { type: "string" },
          objective: { type: "string" },
          context_from_previous: { type: "string" },
          viz_panel: { type: "string" },
          beat_outline: {
            type: "array",
            items: {
              type: "object",
              properties: {
                narration_hint: { type: "string" },
                card_type: { type: "string" },
                viz_actions: { type: "array", items: { type: "string" } },
                inline_at_end: { type: "boolean" },
              },
              required: ["narration_hint"],
            },
          },
          wrong_path_acts: {
            type: "array",
            description: "Branch act nodes (same structure as top-level act nodes)",
            items: { type: "object" },
          },
          // gate fields
          gate_type: { type: "string", enum: ["quiz", "fill-in", "proof-builder", "interactive"] },
          after_act: { type: "string" },
          question_hint: { type: "string" },
          wrong_path_hint: { type: "string" },
          // marker field
          label: { type: "string" },
        },
        required: ["type"],
      },
    };
  }

  return _cleanSchemaForGemini(schema);
}

// ─────────────────────────────────────────────────────────────────────
// Stage 1: Solution Planner (natural language)
// ─────────────────────────────────────────────────────────────────────

export async function stage1Solve(problemText: string, objectives: string | null = null, model = "gemini-2.5-flash"): Promise<string> {
  console.log("\n=== Stage 1: Solution planning (narrative) ===");

  const systemPrompt = loadPrompt("solution_planner");
  let userMsg = `## Math Problem\n\n${problemText}\n`;
  if (objectives) userMsg += `\n## Learning Objectives\n\n${objectives}\n`;

  let narrative = await callLlmText(systemPrompt, userMsg, model);
  const errors = _validateNarrative(narrative);
  if (errors.length) {
    console.log(`  WARNING: Narrative has issues, retrying:`);
    for (const e of errors) console.log(`    - ${e}`);
    const retryMsg =
      userMsg + "\n\n## Previous attempt had issues — please fix:\n" + errors.map((e) => `- ${e}`).join("\n");
    narrative = await callLlmText(systemPrompt, retryMsg, model);
  }
  return narrative;
}

function _validateNarrative(narrative: string): string[] {
  const errs: string[] = [];
  if (!narrative || narrative.trim().length < 200) errs.push("narrative is empty or too short (< 200 chars)");
  if (narrative && narrative.length > 20000) errs.push(`narrative is too long (${narrative.length} chars > 20k)`);
  return errs;
}

// ─────────────────────────────────────────────────────────────────────
// Stage 2: Structure Agent (narrative -> lesson_plan.json)
// ─────────────────────────────────────────────────────────────────────

export async function stage2Structure(problemText: string, narrative: string, objectives: string | null = null, model = "gemini-2.5-flash"): Promise<any> {
  console.log("\n=== Stage 2: Structuring lesson plan ===");

  const systemPrompt = loadPrompt("planner");

  let userMsg = `## Solution & Pedagogical Narrative\n\n${narrative}\n\n---\n\n`;
  userMsg += `## Math Problem\n\n${problemText}\n`;
  if (objectives) userMsg += `\n## Learning Objectives\n\n${objectives}\n`;

  const schema = _schemaForTool("lesson_plan");
  let plan = await callLlm(systemPrompt, userMsg, schema, model);

  let errors = validatePlan(plan);
  if (errors.length) {
    console.log(`  WARNING: Plan has validation errors, retrying:`);
    for (const e of errors) console.log(`    - ${e}`);
    plan = await _retryWithErrors(systemPrompt, userMsg, schema, errors, model);
    errors = validatePlan(plan);
    if (errors.length) {
      console.log(`  WARNING: Plan still has validation errors after retry:`);
      for (const e of errors) console.log(`    - ${e}`);
    }
  }

  // structural assertion — any raise here is a planner/schema bug, not a soft issue.
  assertPlanShape(plan);
  return plan;
}

// ─────────────────────────────────────────────────────────────────────
// Stage 2: Author acts and gates
// ─────────────────────────────────────────────────────────────────────

function _actContext(plan: any, node: any, nodeIndex: number): string {
  const vizActions = plan.viz_requirements?.actions || [];
  const actionsRef = vizActions
    .map((a: any) => `  - ${a.method}(${Object.keys(a.params_schema || {}).join(", ")}): ${a.description}`)
    .join("\n");

  const nodes = plan.nodes;
  let nextAct: any = null;
  for (let j = nodeIndex + 1; j < nodes.length; j++) {
    if (nodes[j].type === "act") {
      nextAct = nodes[j];
      break;
    }
  }

  const arcLines: string[] = [];
  for (const n of nodes) {
    const nid = n.id ?? "";
    const t = n.type;
    if (t === "act") {
      const marker = nid === node.id ? "  ← YOU ARE HERE" : "";
      arcLines.push(`  [act]   ${nid}: ${n.title}${marker}`);
    } else if (t === "gate") {
      arcLines.push(`  [gate]  ${nid} (${n.gate_type ?? "?"}): ${(n.question_hint ?? "").slice(0, 60)}`);
    } else if (t === "marker") {
      arcLines.push(`  [—]     ${n.label ?? ""}`);
    }
  }

  const problemText = plan.problem?.text ?? "";

  let ctx = `## Problem Being Taught
${problemText}

## Lesson Arc (your position marked)
${arcLines.join("\n")}

## Your Act
Title: ${node.title}
ID: ${node.id}
Objective: ${node.objective}
Viz panel: ${node.viz_panel ?? "none"}

## Context from previous acts
${node.context_from_previous ?? "None"}

## Beat outline (from the planner)
${JSON.stringify(node.beat_outline, null, 2)}

## Available viz actions
${actionsRef}
`;
  if (nextAct) {
    ctx += `\n## What comes next\nTitle: ${nextAct.title}\nObjective: ${nextAct.objective}\n`;
  }

  return ctx;
}

export async function stage2AuthorActs(plan: any, model = "gemini-2.5-flash"): Promise<any> {
  console.log("\n=== Stage 3: Authoring acts ===");

  const systemPrompt = loadPrompt("act_worker");
  const schema = _schemaForTool("act_spec");
  const actSpecs: any = {};

  // collect all act nodes (main path + branch)
  const actNodes: [any, number][] = [];
  plan.nodes.forEach((node: any, i: number) => {
    if (node.type === "act") {
      actNodes.push([node, i]);
    } else if (node.type === "gate") {
      for (const wp of node.wrong_path_acts || []) {
        if (wp && typeof wp === "object" && wp.type === "act") actNodes.push([wp, i]);
      }
    }
  });

  const failures: [string, string][] = [];
  for (const [node, idx] of actNodes) {
    const actId = node.id;
    console.log(`  Authoring: ${actId} (${node.title})`);

    const userMsg = _actContext(plan, node, idx);
    try {
      let spec = await callLlm(systemPrompt, userMsg, schema, model);
      spec.act_id = actId;
      spec.title = node.title;

      let errors = validateActSpec(spec, plan, node);
      if (errors.length) {
        console.log(`    Retrying: ${errors.length} validation error(s)... (${errors})`);
        spec = await _retryWithErrors(systemPrompt, userMsg, schema, errors, model);
        spec.act_id = actId;
        spec.title = node.title;
        errors = validateActSpec(spec, plan, node);
        if (errors.length) {
          failures.push([actId, `validation after retry: ${errors}`]);
          continue;
        }
      }

      // structural assertion — catches dup beats, beat-count drift, bad IDs.
      assertActSpecShape(spec, node);
      actSpecs[actId] = spec;
    } catch (e: any) {
      console.log(`    ERROR: ${actId} failed: ${e?.message ?? e}`);
      failures.push([actId, String(e?.message ?? e)]);
    }
  }

  if (failures.length) {
    const lines = failures.map(([aid, reason]) => `  - ${aid}: ${reason}`);
    throw new Error(`stage2_author_acts: ${failures.length}/${actNodes.length} act(s) failed:\n` + lines.join("\n"));
  }

  return actSpecs;
}

function _gateContext(plan: any, node: any, actSpecs: any): string {
  const afterActId = node.after_act;
  const afterActSpec = actSpecs[afterActId] ?? {};

  const nodes = plan.nodes;
  let gateIdx = -1;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === node.id) {
      gateIdx = i;
      break;
    }
  }
  let nextAct: any = null;
  for (let j = gateIdx + 1; j < nodes.length; j++) {
    if (nodes[j].type === "act") {
      nextAct = nodes[j];
      break;
    }
  }

  const arcLines: string[] = [];
  for (const n of nodes) {
    const nid = n.id ?? "";
    const t = n.type;
    if (t === "act") {
      arcLines.push(`  [act]   ${nid}: ${n.title}`);
    } else if (t === "gate") {
      const marker = nid === node.id ? "  ← THIS GATE" : "";
      arcLines.push(`  [gate]  ${nid} (${n.gate_type ?? "?"})${marker}`);
    } else if (t === "marker") {
      arcLines.push(`  [—]     ${n.label ?? ""}`);
    }
  }

  // summarize concepts learned up to and including the preceding act
  const priorConcepts: string[] = [];
  for (const n of nodes) {
    if (n.type === "act") {
      priorConcepts.push(`  - ${n.title}: ${n.objective ?? ""}`);
      if (n.id === afterActId) break;
    }
  }

  const problemText = plan.problem?.text ?? "";

  let ctx = `## Problem Being Taught
${problemText}

## Lesson Arc (this gate marked)
${arcLines.join("\n")}

## Concepts taught so far (up to the preceding act)
${priorConcepts.join("\n")}

## Gate to Author
ID: ${node.id}
Type: ${node.gate_type}
After act: ${afterActId}
Question hint: ${node.question_hint ?? "N/A"}
Wrong path hint: ${node.wrong_path_hint ?? "N/A"}

## Preceding act (full spec — the content the student just saw)
${Object.keys(afterActSpec).length ? JSON.stringify(afterActSpec, null, 2) : "Not available"}
`;
  if (nextAct) {
    ctx += `\n## Next act (where student goes if correct)\nTitle: ${nextAct.title}\nObjective: ${nextAct.objective}\n`;
  }
  if (node.wrong_path_acts && node.wrong_path_acts.length) {
    const ids = (node.wrong_path_acts as any[]).filter((a) => a && typeof a === "object").map((a) => a.id);
    ctx += `\n## Wrong path act IDs to remediate\n${JSON.stringify(ids, null, 2)}\n`;
  }

  return ctx;
}

export async function stage2bAuthorGates(plan: any, actSpecs: any, model = "gemini-2.5-flash"): Promise<any> {
  console.log("\n=== Stage 3b: Authoring gates ===");

  const systemPrompt = loadPrompt("gate_worker");
  const schema = _schemaForTool("gate_spec");
  const gateSpecs: any = {};
  const failures: [string, string][] = [];

  const gateNodes = plan.nodes.filter((n: any) => n.type === "gate");
  console.log(`  Plan declares ${gateNodes.length} gate(s): ${JSON.stringify(gateNodes.map((n: any) => n.id))}`);

  for (const node of gateNodes) {
    const gateId = node.id;
    console.log(`  Authoring: ${gateId}`);
    const userMsg = _gateContext(plan, node, actSpecs);

    // overwrite plan-authoritative fields (LLM values for these are discarded).
    const inject = (spec: any): any => {
      spec.gate_id = gateId;
      spec.after_act = node.after_act;
      spec.gate_type = node.gate_type;
      if (node.wrong_path_acts && node.wrong_path_acts.length) {
        spec.wrong_path_acts = (node.wrong_path_acts as any[]).filter((a) => a && typeof a === "object").map((a) => a.id);
      }
      return spec;
    };

    try {
      let spec = await callLlm(systemPrompt, userMsg, schema, model);
      spec = inject(spec);
      let errors = validateGateSpec(spec, plan);
      if (errors.length) {
        console.log(`    Retrying: ${errors.length} validation error(s)...`);
        spec = await _retryWithErrors(systemPrompt, userMsg, schema, errors, model);
        spec = inject(spec);
        errors = validateGateSpec(spec, plan);
        if (errors.length) {
          failures.push([gateId, `validation after retry: ${errors}`]);
          continue;
        }
      }

      // structural assertion — enforces gate_id == plan_node.id before the assembler.
      assertGateSpecShape(spec, node);
      gateSpecs[gateId] = spec;
    } catch (e: any) {
      // don't let one gate nuke the whole stage — collect failures, report at end.
      console.log(`    ERROR: ${gateId} failed: ${e?.message ?? e}`);
      failures.push([gateId, String(e?.message ?? e)]);
    }
  }

  if (failures.length) {
    const lines = failures.map(([gid, reason]) => `  - ${gid}: ${reason}`);
    throw new Error(
      `stage2b_author_gates: ${failures.length}/${gateNodes.length} gate(s) failed:\n` +
        lines.join("\n") +
        "\n(Partial gate_specs were not returned. Fix inputs or rerun.)"
    );
  }

  return gateSpecs;
}

// ─────────────────────────────────────────────────────────────────────
// Stage 3: Author visualization
// ─────────────────────────────────────────────────────────────────────

function _buildVizTimeline(actSpecs: any, plan: any): any[] {
  const timeline: any[] = [];
  for (const node of plan.nodes) {
    if (node.type !== "act") continue;
    const actId = node.id;
    const spec = actSpecs[actId];
    if (!spec) continue;
    (spec.beats || []).forEach((beat: any, beatIdx: number) => {
      for (const va of beat.viz_actions || []) {
        timeline.push({
          act_id: actId,
          act_title: node.title,
          beat_idx: beatIdx,
          say_snippet: (beat.say ?? "").slice(0, 80),
          method: va.method,
          params: va.params ?? {},
          offset: va.offset ?? 0,
        });
      }
    });
  }
  return timeline;
}

export async function stage3AuthorViz(plan: any, actSpecs: any, model = "gemini-2.5-flash"): Promise<any> {
  console.log("\n=== Stage 4: Authoring visualization ===");

  const vizReq = plan.viz_requirements || {};
  if (vizReq.type === "none") {
    console.log("  No visualization needed.");
    return { mode: "preset", preset: "numberLine", config: null, actions_implemented: [] };
  }

  const systemPrompt = loadPrompt("viz_worker");
  const timeline = _buildVizTimeline(actSpecs, plan);
  const problemText = plan.problem?.text ?? "";

  let userMsg = `## Problem Being Taught
${problemText}

## Visualization Requirements (from planner)
${JSON.stringify(vizReq, null, 2)}

## Ordered Action Timeline (temporal sequence across the full lesson)
${JSON.stringify(timeline, null, 2)}
`;

  // read full reference viz plugin — skip for models that fail on large prompts.
  const smallCtxModels = new Set([
    "qwen/qwen-2.5-coder-32b-instruct",
    "mistralai/mistral-small-3.1-24b-instruct",
    "meta-llama/llama-3.3-70b-instruct",
    "nvidia/llama-3.1-nemotron-70b-instruct",
  ]);
  const realModel = _isOpenrouter(model) ? _stripOpenrouter(model) : model;
  const includeReference = !smallCtxModels.has(realModel);

  if (includeReference) {
    const contentDir = path.join(CODE2HTML_DIR, "content");
    const candidates = fs.existsSync(contentDir)
      ? fs.readdirSync(contentDir).filter((f) => /^amc10a_2023_p15_.*\.js$/.test(f)).sort().map((f) => path.join(contentDir, f))
      : [];
    const examplePath = candidates.length ? candidates[candidates.length - 1] : null;
    if (examplePath && fs.statSync(examplePath).isFile()) {
      const vizSection = fs.readFileSync(examplePath, "utf8");
      userMsg += `\n## Reference: Complete production viz plugin\n\`\`\`javascript\n${vizSection}\n\`\`\`\n`;
    }
  }

  const schema = _schemaForTool("viz_spec");
  let spec = await callLlm(systemPrompt, userMsg, schema, model);

  // syntax-check generated JS before validation
  if (spec.code) {
    const syntaxErrors = _checkJsSyntax(spec.code);
    if (syntaxErrors.length) {
      console.log(`  JS syntax error(s) detected — retrying...`);
      spec = await _retryWithErrors(systemPrompt, userMsg, schema, syntaxErrors.map((e) => `JS syntax error: ${e}`), model);
    }
  }

  let errors = validateVizSpec(spec, plan, actSpecs);
  const layoutWarnings = _checkVizLayout(spec.code ?? "");
  if (layoutWarnings.length) {
    console.log(`  Layout audit found ${layoutWarnings.length} issue(s) — retrying:`);
    for (const w of layoutWarnings) console.log(`    - ${w}`);
    errors = errors.concat(layoutWarnings.map((w) => `Layout: ${w}`));
  }
  if (errors.length) {
    console.log(`  Retrying: ${errors.length} validation error(s)...`);
    spec = await _retryWithErrors(systemPrompt, userMsg, schema, errors, model);
    // re-check syntax after retry
    if (spec.code) {
      const syntaxErrors = _checkJsSyntax(spec.code);
      if (syntaxErrors.length) {
        console.log(`  WARNING: JS syntax errors remain after retry:`);
        for (const e of syntaxErrors) console.log(`    - ${e}`);
      }
    }
    errors = validateVizSpec(spec, plan, actSpecs);
    if (errors.length) {
      console.log(`  Retrying again: ${errors.length} validation error(s)...`);
      spec = await _retryWithErrors(systemPrompt, userMsg, schema, errors, model);
      errors = validateVizSpec(spec, plan, actSpecs);
      if (errors.length) {
        console.log(`  WARNING: Viz spec still has errors after 2 retries:`);
        for (const e of errors) console.log(`    - ${e}`);
      }
    }
  }

  // structural assertions: shape + plan-declared-action coverage.
  assertVizSpecShape(spec);
  assertVizImplementsPlanActions(spec, plan);
  return spec;
}

export async function stage3bVizVisualRevision(
  plan: any,
  actSpecs: any,
  gateSpecs: any,
  vizSpec: any,
  workDir: string,
  model: string
): Promise<any> {
  console.log("\n=== Stage 4b: Viz visual self-revision ===");
  if (_isGemini(model)) {
    console.log("  Skipped — Gemini model; use an Anthropic model for sighted feedback.");
    return vizSpec;
  }
  if (!vizSpec || !vizSpec.code) {
    console.log("  Skipped — no viz code to revise.");
    return vizSpec;
  }

  const tmpDir = path.join(workDir, "_viz_preview");
  fs.mkdirSync(tmpDir, { recursive: true });
  const contentJs = assembleContent(plan, actSpecs, gateSpecs, vizSpec);
  const vizJs = assembleViz(vizSpec);
  const contentPath = path.join(tmpDir, "preview_content.js");
  const vizPath = path.join(tmpDir, "preview_viz.js");
  const htmlPath = path.join(tmpDir, "preview.html");
  const shotPath = path.join(tmpDir, "preview.png");
  fs.writeFileSync(contentPath, contentJs);
  fs.writeFileSync(vizPath, vizJs ?? "");

  if (!buildHtml(contentPath, vizPath, htmlPath)) {
    console.log("  Skipped — preview build failed.");
    return vizSpec;
  }
  if (!(await takeScreenshot(htmlPath, shotPath))) {
    console.log("  Skipped — screenshot failed.");
    return vizSpec;
  }

  const screenshotBlock = _encodeScreenshotForLlm(shotPath);
  if (!screenshotBlock) return vizSpec;

  const systemPrompt = loadPrompt("viz_worker");
  const userMsg =
    "## Self-revision pass\n" +
    "You previously authored the viz plugin below. A screenshot of the " +
    "rendered lesson is attached. Look for visual bugs: elements off-screen, " +
    "overlapping text, empty groups, wrong colors, missing animations. " +
    "Return a revised viz_spec implementing the SAME actions but with visual " +
    "fixes. If the screenshot looks correct, return the existing code unchanged.\n\n" +
    `## Current viz code\n\`\`\`javascript\n${vizSpec.code}\n\`\`\`\n`;
  const schema = _schemaForTool("viz_spec");

  let revised: any = null;
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model,
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: [{ type: "text", text: userMsg }, screenshotBlock] as any }],
      tools: [{ name: "output", description: "Return revised viz_spec", input_schema: schema }],
      tool_choice: { type: "tool", name: "output" },
    });
    for (const block of response.content) {
      if (block.type === "tool_use") {
        revised = block.input;
        break;
      }
    }
  } catch (e: any) {
    console.log(`  Revision failed: ${e?.message ?? e}`);
    return vizSpec;
  }

  if (!revised || !revised.code) return vizSpec;
  if (_checkJsSyntax(revised.code).length) {
    console.log("  Revised code has syntax errors — keeping original.");
    return vizSpec;
  }
  const errs = validateVizSpec(revised, plan, actSpecs);
  if (errs.length) {
    console.log(`  Revised code failed validation (${errs.length} errs) — keeping original.`);
    return vizSpec;
  }
  if (revised.code === vizSpec.code) {
    console.log("  No visual changes needed.");
  } else {
    console.log("  Applied visual revision from sighted viz_worker.");
  }
  return revised;
}

// ─────────────────────────────────────────────────────────────────────
// Stage 4: Assemble
// ─────────────────────────────────────────────────────────────────────

export function stage4Assemble(plan: any, actSpecs: any, gateSpecs: any, vizSpec: any, outputDir: string): [string, string | null] {
  console.log("\n=== Stage 5: Assembling ===");

  fs.mkdirSync(outputDir, { recursive: true });

  const contentJs = assembleContent(plan, actSpecs, gateSpecs, vizSpec);
  let lessonId = String(plan.meta.title ?? "lesson").toLowerCase();
  lessonId = lessonId.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  const contentPath = path.join(outputDir, `${lessonId}.js`);
  fs.writeFileSync(contentPath, contentJs);
  console.log(`  Content: ${contentPath} (${contentJs.length} bytes)`);

  const vizJs = vizSpec ? assembleViz(vizSpec) : null;
  let vizPath: string | null = null;
  if (vizJs) {
    vizPath = path.join(outputDir, `viz_${lessonId}.js`);
    fs.writeFileSync(vizPath, vizJs);
    console.log(`  Viz:     ${vizPath} (${vizJs.length} bytes)`);
  }

  return [contentPath, vizPath];
}

// ─────────────────────────────────────────────────────────────────────
// Stage 5: Review and fix
// ─────────────────────────────────────────────────────────────────────

const REVIEW_OUTPUT_SCHEMA = {
  type: "object",
  required: ["status", "issues"],
  properties: {
    status: { type: "string", enum: ["pass", "issues_found"] },
    issues: {
      type: "array",
      items: {
        type: "object",
        required: ["severity", "location", "description"],
        properties: {
          severity: { type: "string", enum: ["error", "warning", "suggestion"] },
          location: { type: "string" },
          description: { type: "string" },
          fix: { type: "string" },
        },
      },
    },
    corrected_content_js: { type: ["string", "null"] },
    corrected_viz_js: { type: ["string", "null"] },
  },
};

export async function stage5Review(
  plan: any,
  contentJs: string,
  vizJs: string | null = null,
  screenshotPath: string | null = null,
  model = "gemini-2.5-flash"
): Promise<[string, string | null, any[]]> {
  console.log("\n=== Stage 6: Reviewing ===");
  if (screenshotPath && fs.existsSync(screenshotPath)) {
    console.log(`  (sighted mode — screenshot provided)`);
  }

  const systemPrompt = loadPrompt("reviewer");

  let userMsg = `## Lesson Plan
\`\`\`json
${JSON.stringify(plan, null, 2)}
\`\`\`

## Assembled Content JS
\`\`\`javascript
${contentJs}
\`\`\`
`;
  if (vizJs) {
    userMsg += `
## Viz Plugin JS
\`\`\`javascript
${vizJs}
\`\`\`
`;
  }

  // multimodal if screenshot provided and using Anthropic
  let screenshotBlock: any = null;
  if (screenshotPath && _isGemini(model)) {
    console.log(
      `  WARNING: --screenshot requested but model is Gemini; ` + `falling back to BLIND review. Use --model claude-... for sighted.`
    );
  }
  if (screenshotPath && !_isGemini(model)) {
    screenshotBlock = _encodeScreenshotForLlm(screenshotPath);
    if (screenshotBlock) {
      userMsg += "\n## Screenshot of rendered lesson\n(See attached image — analyze for visual bugs.)\n";
    }
  }

  // for Anthropic with screenshot: raw client call with image block
  let client: Anthropic | null = null;
  let result: any;
  if (screenshotBlock && !_isGemini(model)) {
    client = new Anthropic();
    const response = await client.messages.create({
      model,
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: [{ type: "text", text: userMsg }, screenshotBlock] as any }],
      tools: [{ name: "output", description: "Return structured review output", input_schema: REVIEW_OUTPUT_SCHEMA as any }],
      tool_choice: { type: "tool", name: "output" },
    });
    result = null;
    for (const block of response.content) {
      if (block.type === "tool_use") {
        result = block.input;
        break;
      }
    }
    if (result === null) throw new Error("No structured output from reviewer");
  } else {
    result = await callLlm(systemPrompt, userMsg, REVIEW_OUTPUT_SCHEMA, model);
  }

  const issues = result.issues ?? [];
  const errorsList = issues.filter((i: any) => i.severity === "error");
  const warningsList = issues.filter((i: any) => i.severity === "warning");
  const suggestionsList = issues.filter((i: any) => i.severity === "suggestion");

  if (result.status === "pass") {
    console.log("  Review: PASS (no issues)");
  } else {
    console.log(
      `  Review: ${errorsList.length} error(s), ${warningsList.length} warning(s), ${suggestionsList.length} suggestion(s)`
    );
    for (const issue of issues) {
      const icon = ({ error: "X", warning: "!", suggestion: "~" } as any)[issue.severity];
      console.log(`    [${icon}] ${issue.location}: ${issue.description}`);
      if (issue.fix) console.log(`        Fix: ${issue.fix}`);
    }
  }

  let reviewedContent = result.corrected_content_js || contentJs;
  let reviewedViz = result.corrected_viz_js || vizJs;

  // retry once if the reviewer's correction fails basic syntax.
  if (reviewedContent !== contentJs && _checkJsSyntax(reviewedContent).length) {
    const synErrs = _checkJsSyntax(reviewedContent);
    console.log(`  Reviewer correction has syntax errors — retrying once:`);
    for (const e of synErrs) console.log(`    - ${e}`);
    const retryUser =
      userMsg +
      "\n\n## Your previous corrected_content_js had syntax errors:\n" +
      synErrs.map((e) => `- ${e}`).join("\n") +
      "\nRe-emit a corrected_content_js that passes `node --check`.\n";
    try {
      if (screenshotBlock && !_isGemini(model)) {
        const response = await client!.messages.create({
          model,
          max_tokens: 16000,
          system: systemPrompt,
          messages: [{ role: "user", content: [{ type: "text", text: retryUser }, screenshotBlock] as any }],
          tools: [{ name: "output", description: "re-emit review", input_schema: REVIEW_OUTPUT_SCHEMA as any }],
          tool_choice: { type: "tool", name: "output" },
        });
        for (const block of response.content) {
          if (block.type === "tool_use") {
            result = block.input;
            break;
          }
        }
      } else {
        result = await callLlm(systemPrompt, retryUser, REVIEW_OUTPUT_SCHEMA, model);
      }
      reviewedContent = result.corrected_content_js || contentJs;
      reviewedViz = result.corrected_viz_js || vizJs;
    } catch (e: any) {
      console.log(`  Retry failed: ${e?.message ?? e} — keeping original.`);
      reviewedContent = contentJs;
      reviewedViz = vizJs;
    }
  }

  reviewedContent = _rejectIfInvalidDsl(reviewedContent, contentJs, "content");
  if (vizJs) {
    reviewedViz = _rejectIfInvalidDsl(reviewedViz, vizJs, "viz");
  }

  return [reviewedContent, reviewedViz, issues];
}

// ─────────────────────────────────────────────────────────────────────
// Build HTML (optional)
// ─────────────────────────────────────────────────────────────────────

export function buildHtml(contentJsPath: string, vizJsPath: string | null, outputHtmlPath: string): boolean {
  console.log("\n=== Building HTML ===");
  // resolve all paths to absolute so build.sh works regardless of cwd
  const contentAbs = path.resolve(contentJsPath);
  const vizAbs = vizJsPath ? path.resolve(vizJsPath) : null;
  const outputAbs = path.resolve(outputHtmlPath);

  const buildSh = path.join(CODE2HTML_DIR, "build.sh");
  const cmdArgs = vizAbs ? [contentAbs, vizAbs, outputAbs] : ["--mx", contentAbs, outputAbs];

  const result = spawnSync(buildSh, cmdArgs, { cwd: CODE2HTML_DIR, encoding: "utf8" });
  if (result.status !== 0) {
    console.log(`  Build failed: ${result.stderr}`);
    return false;
  } else {
    console.log(`  ${String(result.stdout).trim()}`);
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Screenshot (optional — requires playwright)
// ─────────────────────────────────────────────────────────────────────

export async function takeScreenshot(htmlPath: string, screenshotPath: string, waitMs = 2000): Promise<boolean> {
  let chromium: any;
  try {
    // indirect specifier: keeps tsc from requiring playwright to be installed
    // (it's an optional runtime dep, mirroring Python's try/except ImportError).
    const specifier = "playwright";
    const pw: any = await import(specifier);
    chromium = pw.chromium;
  } catch {
    console.log("  [screenshot] playwright not installed — skipping.");
    console.log("  To enable: npm install playwright && npx playwright install chromium");
    return false;
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`file://${path.resolve(htmlPath)}`);
    await page.waitForTimeout(waitMs);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await browser.close();
    console.log(`  Screenshot: ${screenshotPath}`);
    return true;
  } catch (e: any) {
    console.log(`  [screenshot] failed: ${e?.message ?? e}`);
    return false;
  }
}

// Return a base64 image block for a multimodal Anthropic message, or null if missing.
function _encodeScreenshotForLlm(screenshotPath: string): any {
  if (!fs.existsSync(screenshotPath)) return null;
  const b64 = fs.readFileSync(screenshotPath).toString("base64");
  return { type: "image", source: { type: "base64", media_type: "image/png", data: b64 } };
}

// ─────────────────────────────────────────────────────────────────────
// Save/load intermediate artifacts
// ─────────────────────────────────────────────────────────────────────

export function saveArtifacts(
  workDir: string,
  opts: {
    problemText?: string | null;
    narrative?: string | null;
    plan?: any;
    actSpecs?: any;
    gateSpecs?: any;
    vizSpec?: any;
  } = {}
): void {
  fs.mkdirSync(workDir, { recursive: true });

  if (opts.problemText !== undefined && opts.problemText !== null) {
    fs.writeFileSync(path.join(workDir, "problem.md"), opts.problemText);
  }
  if (opts.narrative !== undefined && opts.narrative !== null) {
    fs.writeFileSync(path.join(workDir, "narrative.md"), opts.narrative);
  }
  if (opts.plan) {
    fs.writeFileSync(path.join(workDir, "lesson_plan.json"), JSON.stringify(opts.plan, null, 2));
  }
  if (opts.actSpecs && Object.keys(opts.actSpecs).length) {
    const actsDir = path.join(workDir, "acts");
    fs.mkdirSync(actsDir, { recursive: true });
    for (const actId of Object.keys(opts.actSpecs)) {
      fs.writeFileSync(path.join(actsDir, `${actId}.json`), JSON.stringify(opts.actSpecs[actId], null, 2));
    }
  }
  if (opts.gateSpecs && Object.keys(opts.gateSpecs).length) {
    const gatesDir = path.join(workDir, "gates");
    fs.mkdirSync(gatesDir, { recursive: true });
    for (const gateId of Object.keys(opts.gateSpecs)) {
      fs.writeFileSync(path.join(gatesDir, `${gateId}.json`), JSON.stringify(opts.gateSpecs[gateId], null, 2));
    }
  }
  if (opts.vizSpec) {
    fs.writeFileSync(path.join(workDir, "viz_spec.json"), JSON.stringify(opts.vizSpec, null, 2));
  }
}

export function loadProblemText(workDir: string): string {
  const p = path.join(workDir, "problem.md");
  if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  return "";
}

export function loadArtifacts(workDir: string): [string | null, any, any, any, any] {
  let narrative: string | null = null;
  const narrativePath = path.join(workDir, "narrative.md");
  if (fs.existsSync(narrativePath)) narrative = fs.readFileSync(narrativePath, "utf8");

  let plan: any = null;
  const planPath = path.join(workDir, "lesson_plan.json");
  if (fs.existsSync(planPath)) plan = JSON.parse(fs.readFileSync(planPath, "utf8"));

  const actSpecs: any = {};
  const actsDir = path.join(workDir, "acts");
  if (fs.existsSync(actsDir)) {
    for (const f of fs.readdirSync(actsDir).filter((x) => x.endsWith(".json")).sort()) {
      const spec = JSON.parse(fs.readFileSync(path.join(actsDir, f), "utf8"));
      actSpecs[spec.act_id] = spec;
    }
  }

  const gateSpecs: any = {};
  const gatesDir = path.join(workDir, "gates");
  if (fs.existsSync(gatesDir)) {
    for (const f of fs.readdirSync(gatesDir).filter((x) => x.endsWith(".json")).sort()) {
      const spec = JSON.parse(fs.readFileSync(path.join(gatesDir, f), "utf8"));
      gateSpecs[spec.gate_id] = spec;
    }
  }

  let vizSpec: any = null;
  const vizPath = path.join(workDir, "viz_spec.json");
  if (fs.existsSync(vizPath)) vizSpec = JSON.parse(fs.readFileSync(vizPath, "utf8"));

  return [narrative, plan, actSpecs, gateSpecs, vizSpec];
}

// ─────────────────────────────────────────────────────────────────────
// Main (CLI)
// ─────────────────────────────────────────────────────────────────────

const STAGE_CHOICES = ["narrative", "plan", "acts", "viz", "assemble", "review", "all"];

function parseArgs(argv: string[]): any {
  const args: any = {
    problem: undefined, narrative: undefined, plan: undefined, resume: undefined,
    objectives: undefined, work_dir: "output", output: undefined, stage: "all",
    no_review: false, screenshot: false, viz_screenshot_feedback: false,
    model: "gemini-2.5-flash", viz_model: undefined,
  };
  const usageExit = (msg: string) => {
    console.error(`orchestrator.ts: error: ${msg}`);
    process.exit(2);
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--problem": args.problem = argv[++i]; break;
      case "--narrative": args.narrative = argv[++i]; break;
      case "--plan": args.plan = argv[++i]; break;
      case "--resume": args.resume = argv[++i]; break;
      case "--objectives": args.objectives = argv[++i]; break;
      case "--work-dir": args.work_dir = argv[++i]; break;
      case "--output": args.output = argv[++i]; break;
      case "--stage": args.stage = argv[++i]; break;
      case "--no-review": args.no_review = true; break;
      case "--screenshot": args.screenshot = true; break;
      case "--viz-screenshot-feedback": args.viz_screenshot_feedback = true; break;
      case "--model": args.model = argv[++i]; break;
      case "--viz-model": args.viz_model = argv[++i]; break;
      default: usageExit(`unrecognized argument: ${a}`);
    }
  }
  const inputs = [args.problem, args.narrative, args.plan, args.resume].filter((x) => x !== undefined);
  if (inputs.length !== 1) usageExit("exactly one of --problem/--narrative/--plan/--resume is required");
  if (!STAGE_CHOICES.includes(args.stage)) usageExit(`--stage must be one of ${STAGE_CHOICES.join(", ")}`);
  return args;
}

export async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  // --viz-model defaults to --model when not explicitly specified
  args.viz_model = args.viz_model || args.model;

  let workDir = args.work_dir;
  fs.mkdirSync(workDir, { recursive: true });

  let narrative: string | null = null;
  let plan: any = null;
  let actSpecs: any = {};
  let gateSpecs: any = {};
  let vizSpec: any = null;

  // ── load or generate artifacts ──
  if (args.resume) {
    console.log(`Resuming from: ${args.resume}`);
    [narrative, plan, actSpecs, gateSpecs, vizSpec] = loadArtifacts(args.resume);
    workDir = args.resume;
  } else if (args.plan) {
    plan = JSON.parse(fs.readFileSync(args.plan, "utf8"));
    saveArtifacts(workDir, { plan });
  } else if (args.narrative) {
    narrative = fs.existsSync(args.narrative) ? fs.readFileSync(args.narrative, "utf8") : args.narrative;
  } else if (args.problem) {
    const problemText = fs.existsSync(args.problem) ? fs.readFileSync(args.problem, "utf8") : args.problem;

    let objectives: string | null = null;
    if (args.objectives) objectives = fs.existsSync(args.objectives) ? fs.readFileSync(args.objectives, "utf8") : args.objectives;

    narrative = await stage1Solve(problemText, objectives, args.model);
    saveArtifacts(workDir, { problemText, narrative });
    console.log(`  Saved narrative to: ${path.join(workDir, "narrative.md")}`);
  }

  if (args.stage === "narrative") {
    console.log("\nDone (stage: narrative). Edit the narrative, then re-run with --narrative.");
    return;
  }

  // ── Stage 2: Structure Agent ──
  if (!plan && narrative) {
    let problemText: string;
    if (args.problem) {
      problemText = fs.existsSync(args.problem) ? fs.readFileSync(args.problem, "utf8") : args.problem;
    } else {
      problemText = loadProblemText(workDir);
    }

    let objectives: string | null = null;
    if (args.objectives) objectives = fs.existsSync(args.objectives) ? fs.readFileSync(args.objectives, "utf8") : args.objectives;

    plan = await stage2Structure(problemText, narrative, objectives, args.model);
    saveArtifacts(workDir, { plan });
    console.log(`  Saved plan to: ${path.join(workDir, "lesson_plan.json")}`);
  }

  if (args.stage === "plan") {
    console.log("\nDone (stage: plan). Edit the plan, then re-run with --plan.");
    return;
  }

  // ── Stage 3a: Author acts ──
  if (Object.keys(actSpecs).length === 0 && plan) {
    actSpecs = await stage2AuthorActs(plan, args.model);
    saveArtifacts(workDir, { actSpecs });
  }

  // ── Stage 3b: Author gates ──
  if (Object.keys(gateSpecs).length === 0 && plan && Object.keys(actSpecs).length) {
    gateSpecs = await stage2bAuthorGates(plan, actSpecs, args.model);
    saveArtifacts(workDir, { gateSpecs });
  }

  if (args.stage === "acts") {
    console.log("\nDone (stage: acts). Edit act/gate specs, then re-run with --resume.");
    return;
  }

  // ── Stage 4: Author visualization ──
  if (!vizSpec && plan) {
    vizSpec = await stage3AuthorViz(plan, actSpecs, args.viz_model);
    if (args.viz_screenshot_feedback && vizSpec) {
      if (_isGemini(args.viz_model)) {
        console.log("\n  ⚠️  WARNING: --viz-screenshot-feedback requires an Anthropic model (multimodal tool-use).");
        console.log(
          `     Current model: ${args.model} (Gemini). Stage 4b will be SKIPPED — your viz agent will not see ` +
            "its render. Pass --model claude-sonnet-4-20250514 (or similar) to enable sighted self-revision."
        );
      } else {
        vizSpec = await stage3bVizVisualRevision(plan, actSpecs, gateSpecs, vizSpec, workDir, args.model);
      }
    }
    saveArtifacts(workDir, { vizSpec });
  }

  if (args.stage === "viz") {
    console.log("\nDone (stage: viz). Edit viz spec, then re-run with --resume.");
    return;
  }

  // ── Stage 5: Assemble ──
  let contentPath: string | null = null;
  let vizPath: string | null = null;
  if (plan && Object.keys(actSpecs).length) {
    [contentPath, vizPath] = stage4Assemble(plan, actSpecs, gateSpecs, vizSpec, workDir);
  }

  if (args.stage === "assemble") {
    console.log("\nDone (stage: assemble). Review the JS, then re-run with --resume.");
    return;
  }

  // ── Stage 6: Review ──
  if (contentPath && !args.no_review) {
    let screenshot: string | null = null;
    if (args.screenshot && args.output) {
      if (buildHtml(contentPath, vizPath, args.output)) {
        const shotPath = path.join(workDir, "screenshot.png");
        if (await takeScreenshot(args.output, shotPath)) screenshot = shotPath;
      }
    }

    const contentJs = fs.readFileSync(contentPath, "utf8");
    let vizJs: string | null = null;
    if (vizPath) vizJs = fs.readFileSync(vizPath, "utf8");

    const [reviewedContent, reviewedViz, issues] = await stage5Review(plan, contentJs, vizJs, screenshot, args.model);

    if (reviewedContent !== contentJs) {
      fs.writeFileSync(contentPath, reviewedContent);
      console.log(`  Updated: ${contentPath}`);
    }
    if (vizPath && reviewedViz && reviewedViz !== vizJs) {
      fs.writeFileSync(vizPath, reviewedViz);
      console.log(`  Updated: ${vizPath}`);
    }

    const reportPath = path.join(workDir, "review_report.json");
    fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
    console.log(`  Report:  ${reportPath}`);
  }

  if (args.stage === "review") {
    console.log("\nDone (stage: review).");
    return;
  }

  // ── Build HTML (final) ──
  if (contentPath && args.output) {
    buildHtml(contentPath, vizPath, args.output);
  }

  console.log("\nPipeline complete.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
