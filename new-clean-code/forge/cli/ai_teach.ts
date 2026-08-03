#!/usr/bin/env tsx

import { FULL, OBSERVE_ONLY, SUPERVISED, formatCapabilities, type Capabilities } from "@lessonstudio/lesson";
import { httpTransport, formatLogLine } from "@lessonstudio/teach";
import { directorIsLive, pickDirector } from "../director.js";
import { driveDirector, directorTurn, type DriveTurn } from "../watch.js";

const USAGE = `usage: ai_teach.ts [options]

  --origin URL        dev server origin (default http://localhost:5188)
  --once              take a single turn now, then exit
  --autonomous        offer the director every learner action, not just questions
  --dry-run           decide and print, but send nothing to the lesson
  --supervised        run under SUPERVISED capabilities (no structural ops)
  --observe-only      run under OBSERVE_ONLY (the director may only watch)
  --brief TEXT        extra subject-matter grounding for the system prompt
  --model ID          model id (default claude-opus-5)
  --max-turns N       stop after N director turns
  --poll MS           poll interval when nothing has changed (default 700)
  --log               also stream the session log, as \`tail\` would
  --quiet             turns only, no per-poll status`;

interface Flags {
  origin: string;
  once: boolean;
  autonomous: boolean;
  dryRun: boolean;
  caps: Capabilities;
  brief?: string;
  model?: string;
  maxTurns?: number;
  pollMs: number;
  log: boolean;
  quiet: boolean;
}

function parse(argv: string[]): Flags {
  const opt: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]!;
    if (!v.startsWith("--")) continue;
    const nxt = argv[i + 1];
    if (nxt === undefined || nxt.startsWith("--")) opt[v.slice(2)] = true;
    else {
      opt[v.slice(2)] = nxt;
      i++;
    }
  }
  const str = (k: string): string | undefined => (typeof opt[k] === "string" ? (opt[k] as string) : undefined);
  const num = (k: string): number | undefined => {
    const s = str(k);
    return s === undefined ? undefined : Number(s);
  };
  return {
    origin: str("origin") ?? "http://localhost:5188",
    once: opt["once"] === true,
    autonomous: opt["autonomous"] === true,
    dryRun: opt["dry-run"] === true,
    caps: opt["observe-only"] ? OBSERVE_ONLY : opt["supervised"] ? SUPERVISED : FULL,
    ...(str("brief") !== undefined ? { brief: str("brief")! } : {}),
    ...(str("model") !== undefined ? { model: str("model")! } : {}),
    ...(num("max-turns") !== undefined ? { maxTurns: num("max-turns")! } : {}),
    pollMs: num("poll") ?? 700,
    log: opt["log"] === true,
    quiet: opt["quiet"] === true,
  };
}

const out = (s: string): void => {
  console.log(s);
};

function printTurn(t: DriveTurn, dry: boolean): void {
  const head = `>>> turn ${t.n} (${t.reason}, step ${t.step})`;
  if (!t.commands.length) {
    out(`${head}  — nothing (the director chose to stay out of the way)`);
    return;
  }
  out(`${head}  ${t.commands.map((c) => c.op).join(" ")}`);
  out(JSON.stringify(t.commands));
  if (dry) return out("    (dry run — not sent)");
  if (t.response?.text) return out(t.response.text.split("\n").map((l) => `    ${l}`).join("\n"));
  out(`    not applied (${t.response?.status ?? "no response"})`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) return out(USAGE);
  const f = parse(argv);

  const transport = httpTransport({ origin: f.origin, actor: "ai" });
  const live = directorIsLive({ ...(f.model !== undefined ? { model: f.model } : {}) });
  const director = pickDirector({
    ...(f.model !== undefined ? { model: f.model } : {}),
    ...(f.brief !== undefined ? { brief: f.brief } : {}),
    onWarn: (m) => out(`!! ${m}`),
  });

  out(`# ai_teach → ${f.origin}   teacher: ${live ? "claude" : "offline (no ANTHROPIC_API_KEY)"}`);
  out(formatCapabilities(f.caps));
  if (f.autonomous) out("# autonomous: the director sees every learner action, not just questions");
  if (f.dryRun) out("# dry run: nothing will be sent");

  const drive = f.dryRun
    ? { ...transport, direct: async () => ({ turn: 0, queued: 0, applied: false, status: "unknown" as const }) }
    : transport;

  if (f.once) {
    const t = await directorTurn({ transport: drive, director, capabilities: f.caps });
    printTurn(t, f.dryRun);
    return;
  }

  let logCursor = 0;
  const stop = new AbortController();
  process.on("SIGINT", () => {
    out("\n# stopping");
    stop.abort();
  });

  const report = await driveDirector({
    transport: drive,
    director,
    capabilities: f.caps,
    autonomous: f.autonomous,
    pollMs: f.pollMs,
    ...(f.maxTurns !== undefined ? { maxTurns: f.maxTurns } : {}),
    signal: stop.signal,
    onPoll: async (obs) => {
      if (f.log) {
        const { lines, next } = await drive.log(logCursor);
        logCursor = next;
        for (const l of lines) out(formatLogLine(l));
      }
      if (!f.quiet && !obs) out("… waiting for a student page");
    },
    onTurn: (t) => printTurn(t, f.dryRun),
    onWarn: (m) => out(`!! ${m}`),
  });

  out(`# ${report.stopped} — ${report.turns.length} turn(s) over ${report.polls} poll(s)`);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
