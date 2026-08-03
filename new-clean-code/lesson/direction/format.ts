import type { Json } from "@lessonstudio/state-machine";
import type { BeatCard, LessonCatalog } from "./catalog.js";
import type { DirectionResult } from "./adjudicate.js";
import type { Observation } from "./observe.js";
import { DIRECTOR_OPS } from "./protocol.js";
import type { Capabilities } from "./capabilities.js";
import { formatAuthoring, formatVisuals, type VisualSchema } from "./schemas.js";
import { defaultBeatRegistry, type BeatRegistry } from "../beats/index.js";

export interface FormatOptions {
  /** Include the beat catalog (the id menu). Default true when the observation carries one. */
  catalog?: boolean;
  /** Include the "commands you may send" reference block. Default false — a human wants it
   *  once, a model wants it in the system prompt, neither wants it on every frame. */
  help?: boolean;
  /** Which beat types the help documents. Default `defaultBeatRegistry()`; pass the host's own
   *  registry when it registered extra types, so the help describes what actually exists. */
  beats?: BeatRegistry;
}

/**
 * Render an observation as the teacher's screen / the model's user message. Sections appear in
 * the order a director reads them: what happened to my last turn, what is the learner asking,
 * where are they, what is on the stage, what have we said lately, and what may I name.
 */
export function formatObservation(obs: Observation, opts: FormatOptions = {}): string {
  const L: string[] = [];
  L.push(`# ${obs.lesson.id} v${obs.lesson.version}  step=${obs.step}${obs.done ? "  DONE" : ""}`);

  if (obs.last) {
    L.push("");
    L.push(formatResult(obs.last));
  }

  if (obs.pending) {
    L.push("");
    L.push(`## LEARNER ASKED (unanswered, seq ${obs.pending.seq}, from ${obs.pending.from})`);
    L.push(`  ${obs.pending.text}`);
  }

  L.push("");
  L.push("## WHERE");
  L.push(`  at      ${obs.at ? describeBeat(obs.at) : "(unknown)"}`);
  if (obs.anchor !== obs.at?.id) L.push(`  anchor  ${obs.anchor}   (commands with no beatId target this)`);
  if (obs.at?.next !== undefined) L.push(`  next    ${obs.at.next ?? "(end of lesson)"}`);
  const edges = Object.entries(obs.at?.edges ?? {});
  if (edges.length) L.push(`  edges   ${edges.map(([k, t]) => `${k} -> ${t ?? "(end)"}`).join("   ")}`);

  if (obs.showing) {
    L.push("");
    L.push(`## ON SCREEN (${obs.anchor})`);
    for (const line of obs.showing.split("\n")) L.push(`  ${line}`);
  }

  L.push("");
  L.push("## STAGE");
  L.push(`  viz     ${obs.stage.viz ?? "(none)"}`);
  L.push(`  values  ${kv(obs.stage.values)}`);
  if (Object.keys(obs.stage.workspace).length) L.push(`  ws      ${kv(obs.stage.workspace)}`);
  if (obs.at?.controls?.length) L.push(`  keys    ${obs.at.controls.join(" ")}`);
  L.push(`  focus   ${obs.focus ? `${rect(obs.focus.rect)}${obs.focus.label ? ` "${obs.focus.label}"` : ""}` : "(whole stage)"}`);
  if (obs.annotations.length) L.push(`  marks   ${obs.annotations.map((a) => a.kind).join(" ")}`);
  if (obs.hold) L.push(`  HELD    ${obs.hold.reason ?? "(no reason given)"}`);

  L.push("");
  L.push("## PROGRESS");
  L.push(`  score ${obs.progress.score}`);
  if (Object.keys(obs.progress.mastery).length) L.push(`  mastery ${kv(obs.progress.mastery as unknown as Record<string, Json>)}`);
  if (Object.keys(obs.progress.misconceptions).length) L.push(`  misconceptions ${kv(obs.progress.misconceptions as unknown as Record<string, Json>)}`);
  if (obs.learner) {
    const s = obs.learner.signals;
    L.push(`  signals understanding=${num(s.understanding)} struggling=${num(s.struggling)} engagement=${num(s.engagement)}  (${obs.learner.model})`);
  }

  if (obs.recent.length) {
    L.push("");
    L.push("## RECENT");
    for (const t of obs.recent) L.push(`  ${String(t.seq).padStart(3)} ${t.role.padEnd(7)} ${t.beatId.padEnd(14)} ${t.text}`);
  }

  if (obs.catalog && opts.catalog !== false) {
    L.push("");
    L.push(formatCatalog(obs.catalog));
  }

  if (opts.help) {
    L.push("");
    L.push(directorHelp({ beats: opts.beats, visuals: obs.catalog?.visualSchemas }));
  }
  return L.join("\n");
}

/** The verdict on one turn: what landed, or precisely what did not and why. */
export function formatResult(r: DirectionResult): string {
  const L: string[] = [];
  if (r.ok) {
    L.push(`## LAST TURN — ACCEPTED (${r.submitted} command${r.submitted === 1 ? "" : "s"}, by ${r.actor})`);
    for (const n of r.notes) L.push(`  + ${n}`);
    const structural = [
      r.added.length ? `added ${r.added.join(" ")}` : "",
      r.patched.length ? `patched ${r.patched.join(" ")}` : "",
      r.rerouted.length ? `rerouted ${r.rerouted.join(" ")}` : "",
      r.enteredId ? `learner now at ${r.enteredId}` : "",
    ].filter(Boolean);
    if (structural.length) L.push(`  = ${structural.join("; ")}`);
    return L.join("\n");
  }
  L.push(`## LAST TURN — REJECTED (${r.error?.kind ?? "error"}${r.error?.op ? ` on "${r.error.op}"` : ""}, by ${r.actor})`);
  L.push(`  ${r.error?.detail ?? "unknown failure"}`);
  const discarded = `NOTHING was applied — all ${r.submitted} command(s) were discarded.`;
  L.push(
    r.error?.kind === "review"
      ? `  ${discarded} This op needs a human's approval; resending will not change that. Teach another way.`
      : `  ${discarded} Fix and resend.`,
  );
  return L.join("\n");
}

function formatCatalog(cat: LessonCatalog): string {
  const L: string[] = [`## BEATS (entry: ${cat.entry})`];
  for (const b of cat.beats) L.push(`  ${describeBeat(b)}`);
  if (cat.visualSchemas) {
    L.push("");
    L.push(formatVisuals(cat.visualSchemas));
  } else if (cat.visuals.length) {
    L.push(`  visuals: ${cat.visuals.join(" ")}`);
  }
  return L.join("\n");
}

function describeBeat(b: BeatCard): string {
  const flags = [b.runtime ? "runtime" : "", b.ephemeral ? "ephemeral" : "", b.checkpoint ? "checkpoint" : ""].filter(Boolean);
  const bits = [
    b.id.padEnd(16),
    b.type.padEnd(11),
    b.viz ? `viz=${b.viz.name}` : "",
    b.controls?.length ? `keys=${b.controls.join(",")}` : "",
    flags.length ? `[${flags.join(" ")}]` : "",
    b.head ? `"${b.head}"` : "",
  ].filter(Boolean);
  return bits.join(" ");
}

/** Render capabilities so a director can see the regime it is under, not infer it from refusals. */
export function formatCapabilities(caps: Capabilities): string {
  const L: string[] = [`## CAPABILITIES "${caps.name}"`];
  L.push(`  allow   ${caps.allow === "*" ? "everything" : caps.allow.join(" ") || "(nothing)"}`);
  if (caps.review?.length) L.push(`  review  ${caps.review.join(" ")}   (rejected until a human approves)`);
  if (caps.maxPerTurn) L.push(`  max     ${caps.maxPerTurn} command(s) per turn`);
  if (caps.protect?.length) L.push(`  protect ${caps.protect.join(" ")}   (not editable)`);
  return L.join("\n");
}

/**
 * The command reference — terse and example-led. It is both the `--help` a programmer reads once
 * and the vocabulary section of a model's system prompt.
 */
export const COMMAND_HELP = [
  `## COMMANDS (JSON objects; send one or a list — a list is ONE all-or-nothing turn)`,
  `  say         {"op":"say","text":"...","narrate":"...","resume":"<beatId>|null","show":{"like":"<beatId>"}}`,
  `                answer in your own voice: a new beat, entered now, Continue returns to \`resume\``,
  `                (omit resume => back to where the learner was; omit show => keep the current visual)`,
  `                "exits":"both" gives TWO ways out — back to where they were, or on to what follows`,
  `  revisit     {"op":"revisit","beatId":"<id>","note":"..."}`,
  `                show that beat again as a CLONE, posed with the learner's current values; their place is kept`,
  `  goto        {"op":"goto","beatId":"<id>"}                     move the learner, change no edges`,
  `  addBeat     {"op":"addBeat","spec":{"id":"...","type":"explain|mcq|explorable|...","params":{...},"next":"<id>|null"},"enter":true}`,
  `  patchBeat   {"op":"patchBeat","beatId":"<id>","params":{...}}  re-author params in place (shallow merge)`,
  `  setNext     {"op":"setNext","beatId":"<id>","target":"<id>|null"}`,
  `  rerouteBeat {"op":"rerouteBeat","beatId":"<id>","edge":{"on":"next","target":"<id>|null"}}`,
  `  setControl  {"op":"setControl","key":"v","value":13,"beatId":"<id>"}   re-pose the visual (learner channel)`,
  `  setControls {"op":"setControls","values":{"v":13,"u":40}}             several as one gesture`,
  `  workspace   {"op":"workspace","props":{...},"label":"..."}            viz-side props: highlight, camera, overlay`,
  `  focus       {"op":"focus","at":[0.4,0.55],"scale":3,"label":"..."} | {"op":"focus","rect":{"x":0,"y":0,"w":1,"h":1}} | {"op":"focus","clear":true}`,
  `                stage coords are NORMALIZED 0..1, origin top-left; works on every visual`,
  `  annotate    {"op":"annotate","shapes":[{"kind":"arrow","from":[.2,.3],"to":[.5,.6],"label":"..."},`,
  `                {"kind":"circle","at":[.5,.5],"r":.1},{"kind":"rect","rect":{...}},{"kind":"label","at":[.5,.9],"text":"..."},`,
  `                {"kind":"ink","points":[[.1,.1],[.2,.2]]}]}   shapes REPLACE the current marks; {"clear":true} erases`,
  `  hold        {"op":"hold","reason":"..."} / {"op":"release"}   stop the learner advancing while you set up`,
  ``,
  `RULES`,
  `  a turn is atomic: if any command is refused, NONE apply — read the verdict and resend`,
  `  targets must be beats that exist (this turn's own additions count)`,
  `  a beat spec must be pure JSON — no inline functions (it has to replay from the log)`,
  `  you may not strand the learner: an ending must stay reachable from wherever they land`,
  `  ops: ${DIRECTOR_OPS.join(" ")}`,
].join("\n");

/**
 * The WHOLE reference: the ops, the beat types those ops install, the drawing vocabulary a beat is
 * written in, and the visuals it may name.
 *
 * `COMMAND_HELP` alone is what a director used to be given, and it is why `addBeat` went unused:
 * the ops were documented and the things they take were not, so prose in `say` was the only move a
 * model could be confident about. This composes all four halves, and takes the registry as a
 * parameter so a host that added a beat type does not have to remember to document it twice.
 */
export function directorHelp(opts: { beats?: BeatRegistry; visuals?: Record<string, VisualSchema> } = {}): string {
  return [COMMAND_HELP, "", formatAuthoring(opts.beats ?? defaultBeatRegistry(), opts.visuals)].join("\n");
}

function kv(o: Record<string, Json>): string {
  const keys = Object.keys(o).sort();
  if (!keys.length) return "(none)";
  return keys.map((k) => `${k}=${compact(o[k])}`).join(" ");
}

function compact(v: Json | undefined, max = 40): string {
  const s = JSON.stringify(v ?? null);
  if (s.length <= max) return s;
  if (Array.isArray(v)) return `[${v.length} items]`;
  return `${s.slice(0, max - 1)}…`;
}

function rect(r: { x: number; y: number; w: number; h: number }): string {
  return `x=${num(r.x)} y=${num(r.y)} w=${num(r.w)} h=${num(r.h)}`;
}

function num(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
