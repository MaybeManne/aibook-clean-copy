/**
 * THE DEV SERVER STARTS.
 *
 * A check for the one failure this suite is structurally blind to. `vite.config.ts` is loaded by
 * plain **Node**: Vite esbuild-bundles it into `node_modules/.vite-temp/*.mjs`, inlining relative
 * imports and leaving bare specifiers external. Its own `resolve.alias` table does not apply to
 * that load. So a single `import { x } from "@lessonstudio/timeline"` in any file reachable from
 * the config — through `audio/dev_tts.ts`, `forge/dev_director.ts` or `teach/dev_bus.ts`, and those
 * reach `lesson/` because the bus formats observations and serves `?help=1` — kills the server
 * before it starts, with `ERR_MODULE_NOT_FOUND` and no line number in your own code.
 *
 * Nothing else notices. `tsc` resolves the alias from `tsconfig.json`, `tsx` resolves it for every
 * check in this suite, and Vite resolves it for everything it serves. Only the config load does
 * not, and only when someone runs `npm run dev`.
 *
 * Hence the rule this file enforces: **a file reachable from `vite.config.ts` imports another
 * package by relative barrel path** (`../../timeline/index.js`) **when it imports VALUES.** Type-only
 * imports may keep the alias — they are erased before Node ever sees them. It is enforced by doing
 * the thing rather than by reading the source: load the config the way Vite loads it.
 */
import { loadConfigFromFile } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

let passed = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  passed++;
  console.log("  ok:", msg);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

console.log("[the config Vite will load, loaded the way Vite loads it]");

let loaded: Awaited<ReturnType<typeof loadConfigFromFile>> = null;
let failure = "";
try {
  loaded = await loadConfigFromFile({ command: "serve", mode: "development" }, resolve(root, "vite.config.ts"), root);
} catch (e) {
  failure = e instanceof Error ? e.message.split("\n")[0]! : String(e);
}
assert(
  loaded !== null,
  "`vite.config.ts` loads under plain Node — every cross-package VALUE import reachable from it is relative" +
    (failure ? `\n    ${failure}\n    (an alias in a config-reachable file: see the header of this check)` : ""),
);
const config = loaded!.config;

const plugins = (config.plugins as Array<{ name?: string } | undefined> | undefined) ?? [];
const names = plugins.flat(2).map((p) => p?.name);
for (const p of ["lessonstudio-tts", "lessonstudio-director", "lessonstudio-teach"]) {
  assert(names.includes(p), `and it still mounts \`${p}\` — the config loading is only good news if the dev plugins are in it`);
}

console.log("\n[two alias tables that must not drift]");
{
  const alias = config.resolve?.alias;
  assert(!!alias && !Array.isArray(alias), "the config aliases by object literal, so it can be compared entry by entry");
  const vite = alias as Record<string, string>;

  const tsconfig = JSON.parse(readFileSync(resolve(root, "tsconfig.json"), "utf8")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  const paths = tsconfig.compilerOptions.paths;

  assert(
    Object.keys(vite).sort().join(",") === Object.keys(paths).sort().join(","),
    `every package aliased for the type checker is aliased for the bundler and back (${Object.keys(vite).length} each)`,
  );
  for (const [name, target] of Object.entries(vite)) {
    assert(target === resolve(root, paths[name]![0]!), `\`${name}\` points at the same file in both tables`);
    assert(existsSync(target), `…and that file exists`);
  }

  // The other half of the drift: a package added to the tree and to neither table. It would
  // typecheck through relative imports and then 404 the first time a page imported it by name.
  const dirs = ["state_machine", "intents", "timeline", "figures", "audio", "lesson", "authoring", "teach", "forge", "live", "theme", "svg", "machine", "web"];
  for (const d of dirs) {
    assert(Object.values(vite).includes(resolve(root, `${d}/index.ts`)), `the \`${d}/\` barrel is reachable by name`);
  }
  assert(dirs.length === Object.keys(vite).length, "and there are no aliases left over for packages that no longer exist");
}

console.log(
  `\nDEV CONFIG PASSED — ${passed}/${passed} checks: the dev server's config loads under plain Node (so no ` +
    `config-reachable file imports a sibling package by alias for a value), it still mounts all three dev ` +
    `plugins, and the type checker's alias table and the bundler's agree entry for entry.`,
);
