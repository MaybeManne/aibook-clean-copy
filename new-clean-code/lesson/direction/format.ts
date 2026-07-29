// THE ONE SERIALIZATION. An observation and a command verdict, as text.
//
// There is exactly one of this file on purpose. The live human teacher is a programmer
// reading a terminal; the AI teacher is a model reading a prompt. If those were two
// renderings they would drift, and the day we swapped the human for the model we would be
// debugging a formatter instead of a teacher. One formatter means the model is looking at
// literally the bytes the human looked at — so anything a human could act on, the model
// can, and a transcript of a human session is a usable example for the model.
//
// Written to be read by BOTH, which sets the style:
//   • plain text, one fact per line, stable key order — greppable, diffable, promptable
//   • ids verbatim and unadorned, because they are what a command must name
//   • the previous turn's verdict included, since that is what turns a blind emitter into
//     something that can correct itself
//   • no ANSI, no emoji, no box drawing: a log file, a pipe and a prompt all take it as-is
//
// Pure string building. No dependency on the terminal, the transport, or a model.

import type { Json } from "@lessonstudio/state-machine";
import type { BeatCard, LessonCatalog } from "./catalog.js";
import type { DirectionResult } from "./adjudicate.js";
import type { Observation } from "./observe.js";
import { DIRECTOR_OPS } from "./protocol.js";
import type { Capabilities } from "./capabilities.js";

export interface FormatOptions {
  /** Include the beat catalog (the id menu). Default true when the observation carries one. */
  catalog?: boolean;
  /** Include the "commands you may send" reference block. Default false — a human wants it
   *  once, a model wants it in the system prompt, neither wants it on every frame. */
  help?: boolean;
}

/**
 * Render an observation as the teacher's screen / the model's user message.
 *
 * Sections appear in the order a director actually reads them: what happened to my last
 * turn, what is the learner asking, where are they, what is on the stage, what have we
 * said lately, and (optionally) what may I name.
 */
export function formatObservation(obs: Observation, opts: FormatOptions = {}): string {
  const L: string[] = [];
  L.push(`# ${obs.lesson.id} v${obs.lesson.version}  step=${obs.step}${obs.done ? "  DONE" : ""}`);

  if (obs.last) {
    L.push("");
    L.push(formatResult(obs.last));
  }

  if (obs.pending) {
    // First, because it is the thing a teacher is being paid to notice.
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

  // The words the learner is reading. Deliberately verbatim and un-elided: this is the only
  // section a teacher cannot reconstruct from the rest, and the section a question points AT.
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
    L.push(COMMAND_HELP);
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
  // The whole batch was refused, which is the fact a director most needs stated plainly:
  // it should RESEND a corrected turn, not assume a partial application happened.
  L.push(`## LAST TURN — REJECTED (${r.error?.kind ?? "error"}${r.error?.op ? ` on "${r.error.op}"` : ""}, by ${r.actor})`);
  L.push(`  ${r.error?.detail ?? "unknown failure"}`);
  L.push(`  NOTHING was applied — all ${r.submitted} command(s) were discarded. Fix and resend.`);
  return L.join("\n");
}

/** The id menu: what a command may name. Spine first, then whatever has been added since. */
export function formatCatalog(cat: LessonCatalog): string {
  const L: string[] = [`## BEATS (entry: ${cat.entry})`];
  for (const b of cat.beats) L.push(`  ${describeBeat(b)}`);
  if (cat.visuals.length) {
    L.push(`  visuals: ${cat.visuals.join(" ")}`);
  }
  return L.join("\n");
}

/** One beat on one line: id, type, flags, visual, controls, the first words of its prose. */
export function describeBeat(b: BeatCard): string {
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
 * The command reference. Deliberately terse and example-led: it is both the `--help` a
 * programmer reads once and the vocabulary section of a model's system prompt, and in the
 * second role every extra word is a token spent on every turn.
 */
export const COMMAND_HELP = [
  `## COMMANDS (JSON objects; send one or a list — a list is ONE all-or-nothing turn)`,
  `  say         {"op":"say","text":"...","narrate":"...","resume":"<beatId>|null","show":{"like":"<beatId>"}}`,
  `                answer in your own voice: a new beat, entered now, Continue returns to \`resume\``,
  `                (omit resume => back to where the learner was; omit show => keep the current visual)`,
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

// ── small helpers ───────────────────────────────────────────────────────────────

function kv(o: Record<string, Json>): string {
  const keys = Object.keys(o).sort(); // stable order: diffable across frames
  if (!keys.length) return "(none)";
  return keys.map((k) => `${k}=${compact(o[k])}`).join(" ");
}

/** Values inline on one line; long arrays/objects are summarized rather than dumped, so a
 *  9-cell kernel or a 200-point ink stroke doesn't drown the situation it appears in. */
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
