#!/usr/bin/env tsx
// `direct` — the teacher's right-hand window: one command, sent into a live lesson.
//
//   tsx teach/cli/direct.ts say "look at the screen distance"
//   tsx teach/cli/direct.ts revisit flip --note "same figure, new eyes"
//   tsx teach/cli/direct.ts focus --scale 3 --at .4,.55 --label "the hole"
//   tsx teach/cli/direct.ts set v=13 --beat lens-explore
//   tsx teach/cli/direct.ts mark arrow .2,.3 .5,.6 --label "here"
//   tsx teach/cli/direct.ts hold "one sec, building you something"   /  release
//   tsx teach/cli/direct.ts json '[{"op":"say","text":"…"},{"op":"focus","clear":true}]'
//   tsx teach/cli/direct.ts obs --help          (look, don't touch)
//
// The subcommands are shorthand for the ops in `lesson/direction/protocol.ts` — no more, no
// less. `json` is the full escape hatch, so the CLI can never be the thing that limits what a
// teacher may do: anything the protocol accepts is one `direct json` away, and the shorthands
// exist only because typing JSON at speed while a student waits is not teaching.
//
// It prints the ENGINE's verdict, verbatim (`formatResult`) — the same bytes the log records
// and the same bytes a model reads in tier 3. Exit code 1 on a refused turn, so a teacher can
// script a sequence and have it stop where it broke.

import { httpTransport, type DirectResponse } from "../index.js";
import type { Annotation, DirectorCommand, StagePoint } from "@lessonstudio/lesson";
import type { Json } from "@lessonstudio/state-machine";

const USAGE = `usage: direct.ts <command> [args] [--origin URL]

  say <text> [--narrate TEXT] [--resume BEAT|--stay] [--like BEAT]
  revisit <beatId> [--note TEXT] [--resume BEAT]
  goto <beatId>
  set <key=value>... [--beat BEAT]          learner control channel (re-pose the visual)
  ws <key=value>... [--label TEXT]          director's viz props (highlight, camera, overlay)
  patch <beatId> <key=value>...             re-author a beat's params in place
  next <beatId> <target|null>
  focus --at X,Y [--scale N] [--label T] | focus --rect X,Y,W,H | unfocus
  mark arrow X,Y X,Y [--label T] | mark circle X,Y R | mark rect X,Y,W,H | mark label X,Y TEXT
  unmark
  hold [reason] | release
  json <DirectorCommand|DirectorCommand[]>
  obs [--json] [--help] [--no-catalog]      print the observation; sends nothing

stage coordinates are normalized 0..1 from the top-left, e.g. .4,.55`;

interface Flags {
  origin: string;
  actor: "teacher" | "ai" | "system" | "learner";
  timeoutMs: number;
  rest: string[];
  opt: Record<string, string | true>;
}

/** Split argv into positionals and `--flag [value]` pairs. A flag followed by another flag (or
 *  nothing) is a boolean, which is what lets `--stay` and `--label X` share one parser. */
function parse(argv: string[]): Flags {
  const rest: string[] = [];
  const opt: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]!;
    if (!v.startsWith("--")) {
      rest.push(v);
      continue;
    }
    const key = v.slice(2);
    const nxt = argv[i + 1];
    if (nxt === undefined || nxt.startsWith("--")) opt[key] = true;
    else {
      opt[key] = nxt;
      i++;
    }
  }
  const actor = typeof opt.actor === "string" ? opt.actor : "teacher";
  return {
    origin: (typeof opt.origin === "string" ? opt.origin : undefined) ?? process.env.LS_TEACH_ORIGIN ?? "http://localhost:5188",
    actor: actor === "ai" || actor === "system" || actor === "learner" ? actor : "teacher",
    timeoutMs: typeof opt.timeout === "string" ? Number(opt.timeout) || 6000 : 6000,
    rest,
    opt,
  };
}

const str = (v: string | true | undefined): string | undefined => (typeof v === "string" ? v : undefined);

/** `k=v` → a typed value: JSON where it parses (numbers, booleans, arrays, objects), else the
 *  raw string. So `set v=13` is a number and `set title=hello` is a string, with no quoting. */
function kv(pairs: string[]): Record<string, Json> {
  const out: Record<string, Json> = {};
  for (const p of pairs) {
    const i = p.indexOf("=");
    if (i <= 0) throw new Error(`expected key=value, got "${p}"`);
    const k = p.slice(0, i);
    const raw = p.slice(i + 1);
    try {
      out[k] = JSON.parse(raw) as Json;
    } catch {
      out[k] = raw;
    }
  }
  return out;
}

function point(s: string | undefined, what: string): StagePoint {
  const parts = (s ?? "").split(",").map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) throw new Error(`${what}: expected X,Y in 0..1, got "${s}"`);
  return [parts[0]!, parts[1]!];
}

function rect(s: string | undefined): { x: number; y: number; w: number; h: number } {
  const p = (s ?? "").split(",").map(Number);
  if (p.length !== 4 || p.some(Number.isNaN)) throw new Error(`expected X,Y,W,H in 0..1, got "${s}"`);
  return { x: p[0]!, y: p[1]!, w: p[2]!, h: p[3]! };
}

/** One argv → the commands to send (empty ⇒ this was a read-only subcommand). */
function build(f: Flags): DirectorCommand[] {
  const [cmd, ...args] = f.rest;
  switch (cmd) {
    case "say": {
      const text = args.join(" ");
      if (!text) throw new Error("say: needs text");
      const c: Extract<DirectorCommand, { op: "say" }> = { op: "say", text };
      const narrate = str(f.opt.narrate);
      if (narrate) c.narrate = narrate;
      // `--stay` means "don't send them back" (a terminal aside); `--resume BEAT` overrides
      // the default of returning to wherever the learner was standing.
      if (f.opt.stay === true) c.resume = null;
      else if (str(f.opt.resume)) c.resume = str(f.opt.resume)!;
      const like = str(f.opt.like);
      if (like) c.show = { like };
      return [c];
    }
    case "revisit": {
      const beatId = args[0];
      if (!beatId) throw new Error("revisit: needs a beatId");
      const c: Extract<DirectorCommand, { op: "revisit" }> = { op: "revisit", beatId };
      const note = str(f.opt.note);
      if (note) c.note = note;
      if (str(f.opt.resume)) c.resume = str(f.opt.resume)!;
      return [c];
    }
    case "goto": {
      const beatId = args[0];
      if (!beatId) throw new Error("goto: needs a beatId");
      return [{ op: "goto", beatId }];
    }
    case "set": {
      const values = kv(args);
      const beatId = str(f.opt.beat);
      const keys = Object.keys(values);
      if (!keys.length) throw new Error("set: needs key=value");
      if (keys.length === 1) {
        const k = keys[0]!;
        return [{ op: "setControl", key: k, value: values[k]!, ...(beatId ? { beatId } : {}) }];
      }
      return [{ op: "setControls", values, ...(beatId ? { beatId } : {}) }];
    }
    case "ws": {
      const props = kv(args);
      const label = str(f.opt.label);
      const beatId = str(f.opt.beat);
      return [{ op: "workspace", props, ...(label ? { label } : {}), ...(beatId ? { beatId } : {}) }];
    }
    case "patch": {
      const beatId = args[0];
      if (!beatId) throw new Error("patch: needs a beatId");
      return [{ op: "patchBeat", beatId, params: kv(args.slice(1)) }];
    }
    case "next": {
      const beatId = args[0];
      if (!beatId || args.length < 2) throw new Error("next: needs <beatId> <target|null>");
      const target = args[1] === "null" ? null : args[1]!;
      return [{ op: "setNext", beatId, target }];
    }
    case "focus": {
      const label = str(f.opt.label);
      if (str(f.opt.rect)) return [{ op: "focus", rect: rect(str(f.opt.rect)), ...(label ? { label } : {}) }];
      const at = point(str(f.opt.at) ?? args[0], "focus --at");
      const scale = Number(str(f.opt.scale) ?? args[1] ?? 2) || 2;
      return [{ op: "focus", at, scale, ...(label ? { label } : {}) }];
    }
    case "unfocus":
      return [{ op: "focus", clear: true }];
    case "mark": {
      const label = str(f.opt.label);
      const kind = args[0];
      const withLabel = <T extends object>(a: T): T => (label ? { ...a, label } : a);
      let shape: Annotation;
      if (kind === "arrow") shape = withLabel({ kind: "arrow", from: point(args[1], "mark arrow from"), to: point(args[2], "mark arrow to") });
      else if (kind === "circle") shape = withLabel({ kind: "circle", at: point(args[1], "mark circle at"), r: Number(args[2] ?? 0.1) || 0.1 });
      else if (kind === "rect") shape = withLabel({ kind: "rect", rect: rect(args[1]) });
      else if (kind === "label") shape = { kind: "label", at: point(args[1], "mark label at"), text: args.slice(2).join(" ") };
      else if (kind === "ink") shape = { kind: "ink", points: args.slice(1).map((p, i) => point(p, `mark ink point ${i}`)) };
      else throw new Error(`mark: unknown shape "${kind ?? ""}" (arrow|circle|rect|label|ink)`);
      return [{ op: "annotate", shapes: [shape] }];
    }
    case "unmark":
      return [{ op: "annotate", clear: true }];
    case "hold": {
      const reason = args.join(" ");
      return [{ op: "hold", ...(reason ? { reason } : {}) }];
    }
    case "release":
      return [{ op: "release" }];
    case "json": {
      const raw = args.join(" ");
      const parsed = JSON.parse(raw) as DirectorCommand | DirectorCommand[];
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    case "obs":
    case "observe":
      return [];
    default:
      throw new Error(`unknown command "${cmd ?? ""}"\n\n${USAGE}`);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (!argv.length || argv[0] === "--help" || argv[0] === "-h") {
    // eslint-disable-next-line no-console
    console.log(USAGE);
    process.exit(argv.length ? 0 : 1);
  }
  const f = parse(argv);
  const t = httpTransport({ origin: f.origin });

  let commands: DirectorCommand[];
  try {
    commands = build(f);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`direct: ${e instanceof Error ? e.message : e}`);
    process.exit(2);
    return;
  }

  // The read-only subcommand: print the situation through the one formatter.
  if (!commands.length) {
    const state = await t.observe({ catalog: f.opt["no-catalog"] !== true, help: f.opt.help === true });
    // eslint-disable-next-line no-console
    console.log(f.opt.json === true ? JSON.stringify(state.observation, null, 2) : state.text);
    return;
  }

  let res: DirectResponse;
  try {
    res = await t.direct(commands, { actor: f.actor, timeoutMs: f.timeoutMs });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`direct: cannot reach ${f.origin} — ${e instanceof Error ? e.message : e}`);
    process.exit(3);
    return;
  }

  if (res.applied && res.text) {
    // eslint-disable-next-line no-console
    console.log(res.text);
    process.exit(res.result?.ok ? 0 : 1);
  }
  // No verdict in time. Say which of the two silences this is — nobody polling, or a page that
  // took the turn and has not answered — because the fixes are different.
  // eslint-disable-next-line no-console
  console.error(
    res.status === "queued"
      ? `direct: turn ${res.turn} is QUEUED — no student page is polling ${f.origin}. It will apply when one connects.`
      : `direct: turn ${res.turn} was handed to the page but no verdict came back (status: ${res.status}).`,
  );
  process.exit(4);
}

void main();
