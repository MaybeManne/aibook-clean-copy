// Launch the dev server on a SINGLE authored lesson file:
//   npm run lesson -- examples/integration.lesson.ts            (silent)
//   npm run lesson -- examples/integration.lesson.ts --audio    (real ElevenLabs narration)
//   npm run lesson -- examples/integration.lesson.ts --audio --fake   (silent test audio, no key)
// It resolves the file to an absolute path, points the `@lesson` alias at it (LK_LESSON)
// and boots Vite with the generic host as its root (LK_ROOT=dev/host). With `--audio` it
// first runs the offline generator (author/gen-audio.ts) and points `@lesson-audio` at the
// generated bundle (LK_LESSON_AUDIO). Layout is a render-time switch — open `?layout=theater`.

import { spawn, spawnSync } from "node:child_process";
import { resolve, dirname, basename } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const audio = args.includes("--audio");
const fake = args.includes("--fake");
const arg = args.find((a) => !a.startsWith("--"));
if (!arg) {
  console.error("usage: npm run lesson -- <lesson-file.ts> [--audio] [--fake]");
  process.exit(1);
}
const file = resolve(process.cwd(), arg);
if (!existsSync(file)) {
  console.error(`lesson file not found: ${file}`);
  process.exit(1);
}

const env = { ...process.env, LK_LESSON: file, LK_ROOT: "dev/host" };

if (audio) {
  const genPath = resolve(dirname(file), ".audio", basename(file).replace(/\.ts$/, "") + ".gen.ts");
  console.log(`Generating narration → ${genPath}`);
  const gen = spawnSync("tsx", ["author/gen-audio.ts", file, genPath, ...(fake ? ["--fake"] : [])], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
  });
  if (gen.status !== 0) {
    console.error("narration generation failed; aborting.");
    process.exit(gen.status ?? 1);
  }
  env.LK_LESSON_AUDIO = genPath;
}

const child = spawn("vite", [], { cwd: repoRoot, stdio: "inherit", shell: true, env });
child.on("exit", (code) => process.exit(code ?? 0));
