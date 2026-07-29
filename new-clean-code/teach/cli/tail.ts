#!/usr/bin/env tsx
// `tail` — the teacher's left-hand window: the session log, streaming.
//
//   tsx teach/cli/tail.ts [--origin http://localhost:5188] [--from 0] [--once] [--json]
//
// This is the "just give me logs" half of tier 2, and it is intentionally the least clever
// program in the repo: poll `/log` from a cursor, print what is new. The dev bus also writes
// the same lines to `.session-log/session.jsonl`, so `tail -f` on that file is an equally
// valid client and this CLI is a convenience, not a dependency.
//
// What scrolls past is both streams interleaved — the lesson's events and conversation turns,
// and the teacher's own batches with the engine's verdict under each one. That interleaving is
// the point: you can see the student's confusion and your answer to it in one column.

import { formatLogLine, httpTransport } from "../index.js";

interface Args {
  origin: string;
  from: number;
  once: boolean;
  json: boolean;
  intervalMs: number;
}

function parse(argv: string[]): Args {
  const a: Args = { origin: process.env.LS_TEACH_ORIGIN ?? "http://localhost:5188", from: 0, once: false, json: false, intervalMs: 700 };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--origin" || v === "-o") a.origin = argv[++i] ?? a.origin;
    else if (v === "--from") a.from = Number(argv[++i] ?? 0) || 0;
    else if (v === "--interval") a.intervalMs = Number(argv[++i] ?? 700) || 700;
    else if (v === "--once") a.once = true;
    else if (v === "--json") a.json = true;
    else if (v === "--help" || v === "-h") {
      // eslint-disable-next-line no-console
      console.log("usage: tail.ts [--origin URL] [--from N] [--interval MS] [--once] [--json]");
      process.exit(0);
    }
  }
  return a;
}

async function main(): Promise<void> {
  const args = parse(process.argv.slice(2));
  const t = httpTransport({ origin: args.origin });
  let cursor = args.from;
  let warned = false;

  const pull = async (): Promise<void> => {
    try {
      const { lines, next } = await t.log(cursor);
      cursor = next;
      warned = false;
      for (const l of lines) {
        // eslint-disable-next-line no-console
        console.log(args.json ? JSON.stringify(l) : formatLogLine(l));
      }
    } catch (e) {
      // A dev server that is not up yet is the normal state at the start of a session, so say
      // it once and keep trying rather than exiting on the teacher.
      if (!warned) {
        warned = true;
        // eslint-disable-next-line no-console
        console.error(`[tail] waiting for ${args.origin} — ${e instanceof Error ? e.message : e}`);
      }
    }
  };

  await pull();
  if (args.once) return;
  // eslint-disable-next-line no-console
  console.error(`[tail] following ${args.origin} (ctrl-c to stop)`);
  const timer = setInterval(() => void pull(), args.intervalMs);
  process.on("SIGINT", () => {
    clearInterval(timer);
    process.exit(0);
  });
}

void main();
