import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

interface Check {
  name: string;
  file: string;
  /** What a passing run proves — printed as the suite's summary, so a green run says
   *  something rather than just being green. */
  proves: string;
}

const CHECKS: Check[] = [
  { name: "smoke", file: "smoke.ts", proves: "the engine compiles, routes on answers and records history" },
  { name: "convolution", file: "convolution.ts", proves: "storyboards sample to the figures they claim, and the 2-D kernels are correct" },
  { name: "showcase", file: "showcase.ts", proves: "every animation verb in the vocabulary actually animates" },
  { name: "ask", file: "ask.ts", proves: "ask → direct → adjudicate → resume, with the tutor reading its own past answers, replayed with the model called once per question" },
  { name: "direction", file: "direction.ts", proves: "every director op adjudicated, bad turns atomic, capabilities enforced at one gate" },
  { name: "ai_teach", file: "ai_teach.ts", proves: "the AI path is the same path, with no credential near the page" },
  { name: "theme", file: "theme.ts", proves: "every shipped theme is complete and measurably legible, and one lesson renders identical intents under all of them" },
  { name: "graph", file: "graph.ts", proves: "the statechart projects to a drawable graph with every candidate on every edge, laid out deterministically, mirrored as pure replay-stable JSON" },
  { name: "authoring_power", file: "authoring_power.ts", proves: "a director is told what it may author and can build a new figure — and a new interactive one — as pure JSON that renders and replays, or is refused atomically" },
  { name: "dev_config", file: "dev_config.ts", proves: "the dev server's own config loads under plain Node, and the two alias tables agree" },
];

const here = dirname(fileURLToPath(import.meta.url));

const wanted = process.argv.slice(2);
const unknown = wanted.filter((w) => !CHECKS.some((c) => c.name === w));
if (unknown.length) {
  console.error(`unknown check(s): ${unknown.join(", ")}\nknown: ${CHECKS.map((c) => c.name).join(", ")}`);
  process.exit(2);
}
const selected = wanted.length ? CHECKS.filter((c) => wanted.includes(c.name)) : CHECKS;

function run(c: Check): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(here, "..", "node_modules", "tsx", "dist", "cli.mjs"), join(here, c.file)], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d: Buffer) => (out += d.toString()));
    child.stderr.on("data", (d: Buffer) => (out += d.toString()));
    child.on("close", (code) => resolve({ code: code ?? 1, out }));
  });
}

const failed: string[] = [];
for (const c of selected) {
  const { code, out } = await run(c);
  const verdict = code === 0 ? "PASS" : "FAIL";
  const tail = out.trimEnd().split("\n").filter((l) => l.trim()).pop() ?? "(no output)";
  console.log(`${verdict}  ${c.name.padEnd(12)} ${code === 0 ? tail.trim() : ""}`);
  if (code !== 0) {
    failed.push(c.name);
    console.log(out.trimEnd().split("\n").map((l) => `       │ ${l}`).join("\n"));
  }
}

if (failed.length) {
  console.log(`\n${failed.length}/${selected.length} FAILED — ${failed.join(", ")}`);
  process.exit(1);
}
const all = selected.length === CHECKS.length ? "ALL " : "";
console.log(`\n${all}${selected.length} CHECK${selected.length === 1 ? "" : "S"} PASS. Proven: ${selected.map((c) => c.proves).join("; ")}.`);
