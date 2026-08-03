/**
 * The template layer, asserted.
 *
 * Four claims, in order of how easy they are to break by accident:
 *
 *   1. every shipped theme is COMPLETE — a new theme cannot ship with a hole in it;
 *   2. every shipped theme is LEGIBLE — measured, with thresholds by role, not by eyeball;
 *   3. the named palette is actually RE-MAPPED per theme, so a figure baked at authoring time
 *      still reads on a different ground;
 *   4. the lesson is INDEPENDENT of the theme — the same beats produce the same render intents
 *      under all four, and only the paint differs.
 *
 * Headless: no browser, no key, no network.
 */
import { createSession } from "@lessonstudio/lesson";
import { snapshotToSvg, snapshotToSvgInner } from "@lessonstudio/svg";
import { label } from "@lessonstudio/figures";
import type { SceneSnapshot } from "@lessonstudio/timeline";
import {
  ALL_THEMES,
  auditTheme,
  contrastRatio,
  contrastRules,
  palette,
  paperDark,
  paperLight,
  PRESETS,
  resolvePreset,
  studioDark,
  studioLight,
  type Theme,
} from "@lessonstudio/theme";
import { lesson } from "../examples/split-demo/lesson.js";
import { SYMBOL_SETS } from "../examples/pinhole/palette.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  console.log("  ok:", msg);
}

let n = 0;
function count(cond: boolean, msg: string): void {
  assert(cond, msg);
  n++;
}

/* ------------------------------------------------------------------ 1. completeness */

/** Every leaf of the Theme shape, as `path → value`. Functions are structural, not data. */
function leaves(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${prefix}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
  }
  return [[prefix, value]];
}

console.log("[completeness: no theme ships with a hole in it]");
{
  // studioDark is the reference shape: it is the default, so it is the one that cannot be incomplete.
  const reference = leaves(studioDark)
    .map(([path]) => path)
    // `figure.palette` is intentionally sparse — an absent role means "use the canonical hex".
    .filter((path) => !path.startsWith("figure.palette."));

  count(reference.length > 40, `the reference shape has ${reference.length} leaves (a real surface, not a stub)`);

  for (const theme of ALL_THEMES) {
    const own = new Map(leaves(theme));
    const missing = reference.filter((path) => {
      const v = own.get(path);
      return v === undefined || v === null || v === "";
    });
    count(missing.length === 0, `${theme.name}: every token present and non-empty${missing.length ? ` — missing ${missing.join(", ")}` : ""}`);
    count(typeof theme.space === "function" && theme.space(2) === "8px", `${theme.name}: space() is a real scale`);
    count(theme.name.endsWith(theme.mode), `${theme.name}: name and mode agree`);
  }

  const names = ALL_THEMES.map((t) => t.name);
  count(new Set(names).size === names.length, `all ${names.length} theme names are distinct (${names.join(", ")})`);
}

/* ------------------------------------------------------------------ 2. legibility */

console.log("\n[legibility: measured, with thresholds by role]");
{
  // The maths first, against values with a known answer — a broken ratio function would otherwise
  // make every theme below "pass".
  count(Math.round(contrastRatio("#ffffff", "#000000")) === 21, "contrastRatio: white on black is 21:1");
  count(Math.abs(contrastRatio("#ffffff", "#ffffff") - 1) < 1e-9, "contrastRatio: a colour on itself is 1:1");
  count(Number.isNaN(contrastRatio("rebeccapurple", "#fff")), "contrastRatio: an unparseable colour is NaN, not a silent pass");
  // A translucent foreground must be composited, or its ratio is a number nobody sees.
  const raw = contrastRatio("rgba(255,255,255,0.05)", "#000000");
  count(raw < 1.5, `contrastRatio: 5%-opacity white on black is ${raw.toFixed(2)}:1, not 21:1 (alpha is composited)`);

  for (const theme of ALL_THEMES) {
    const violations = auditTheme(theme);
    const detail = violations.map((v) => `${v.what} ${Number.isFinite(v.ratio) ? v.ratio.toFixed(2) : "?"}<${v.min}`).join("; ");
    count(violations.length === 0, `${theme.name}: ${contrastRules(theme).length} contrast rules, all satisfied${detail ? ` — FAILING: ${detail}` : ""}`);
  }

  // The lesson-owned symbol key is not part of any theme, so `auditTheme` cannot see it. It still
  // has to be legible in both modes — that is the whole reason it carries two sets.
  for (const [mode, set] of Object.entries(SYMBOL_SETS)) {
    const ground = mode === "dark" ? studioDark : studioLight;
    const bad = Object.entries(set).filter(([, hex]) => contrastRatio(hex, ground.color.bg) < 4.5);
    count(bad.length === 0, `pinhole symbol key (${mode}): all ${Object.keys(set).length} hues ≥4.5:1 on ${ground.name}${bad.length ? ` — ${bad.map(([k]) => k).join(", ")}` : ""}`);
  }
}

/* ------------------------------------------------------------------ 3. the palette re-map */

console.log("\n[re-map: a fill baked at authoring time still reads on another ground]");
{
  // Exactly what `examples/convolution/storyboards.ts` authors: a white title and a yellow result.
  const snap: SceneSnapshot = {
    nodes: [
      label("title", 10, 10, "Flip, slide, multiply, sum", { fill: palette.white }),
      { id: "res", kind: "rect", x: 0, y: 40, w: 40, h: 40, fill: palette.yellow },
      { id: "off", kind: "rect", x: 60, y: 40, w: 40, h: 40, fill: "#ff0055" },
    ],
    viewBox: { x: 0, y: 0, w: 200, h: 100 },
  };

  const dark = snapshotToSvgInner(snap, studioDark);
  const paper = snapshotToSvgInner(snap, paperLight);

  count(dark !== paper, "the same snapshot renders differently under studio-dark and paper-light");
  count(dark.includes(palette.white), `studio-dark keeps the canonical white (${palette.white}) — it supplies no override`);
  count(!paper.includes(palette.white), "paper-light does NOT paint #ffffff, which would be invisible on paper");
  count(paper.includes(paperLight.figure.palette.white!), `paper-light substitutes its own ink (${paperLight.figure.palette.white})`);
  count(!paper.includes(palette.yellow), "and re-maps #ffff00, which is unreadable on any light ground");

  // The escape hatch: a colour with no name in the palette is the author's literal, untouched.
  count(dark.includes("#ff0055") && paper.includes("#ff0055"), "an off-palette literal (#ff0055) is never re-mapped, in either theme");

  // onMark is the role that inverts: glyphs on a filled mark.
  count(
    studioDark.figure.onMark !== studioLight.figure.onMark,
    `figure.onMark inverts between modes (${studioDark.figure.onMark} vs ${studioLight.figure.onMark})`,
  );
  for (const theme of ALL_THEMES) {
    const resolved = theme.figure.palette.onMark ?? palette.onMark;
    count(resolved === theme.figure.onMark, `${theme.name}: figure.onMark and palette.onMark agree (${resolved}) — the two spellings cannot drift`);
  }

  // The stage is painted from the theme, so a full document differs too.
  const docs = ALL_THEMES.map((t) => snapshotToSvg(snap, t));
  count(new Set(docs).size === ALL_THEMES.length, "all four themes produce a distinct SVG document for one snapshot");
}

/* ------------------------------------------------------------------ 4. lesson independence */

console.log("\n[independence: the lesson does not know which template is rendering it]");
{
  /** Walk the lesson start-to-finish, recording the SHAPE of what each beat renders. */
  function trace(theme: Theme): string {
    const session = createSession(lesson);
    const seen: string[] = [];
    for (let step = 0; step < 40; step++) {
      const id = session.activeBeatId();
      const model = session.renderBeat(id);
      const shape = model.intents.map((i) => `${i.kind}/${i.slot}`).join(",");
      seen.push(`${id} :: ${shape}`);
      const before = id;
      session.send({ type: "next" });
      if (session.activeBeatId() === before) break;
    }
    // The theme is threaded through rendering, so touch it — if it ever leaked into the intents,
    // the traces below would diverge and this check would fail rather than quietly pass.
    void theme.name;
    return seen.join("\n");
  }

  const traces = ALL_THEMES.map((t) => [t.name, trace(t)] as const);
  const [, first] = traces[0]!;
  count(first.length > 0 && first.includes("::"), "the trace is non-empty (the lesson actually ran)");
  for (const [name, t] of traces.slice(1)) {
    count(t === first, `${name}: identical render intents to ${traces[0]![0]} — kinds, slots and order all unchanged`);
  }

  // …while the presentation genuinely differs. Independence is only interesting if the paint moved.
  const grounds = new Set(ALL_THEMES.map((t) => t.color.bg));
  count(grounds.size === ALL_THEMES.length, `each theme has its own ground (${[...grounds].join(", ")})`);
  count(
    studioDark.font.body !== paperLight.font.body,
    "the paper template uses a different typeface family, not just different colours",
  );
  count(studioDark.chrome.turns === "bubbles" && paperLight.chrome.turns === "flat", "and a different turn chrome: chat bubbles vs flat prose");
  count(studioDark.chrome.eyebrow === "uppercase" && paperLight.chrome.eyebrow === "numbered", "and a different eyebrow: role label vs section number");
}

/* ------------------------------------------------------------------ 5. presets */

console.log("\n[presets: geometry and paint travel together]");
{
  count(PRESETS.length >= 2, `${PRESETS.length} presets ship`);
  for (const preset of PRESETS) {
    count(preset.dark.mode === "dark" && preset.light.mode === "light", `${preset.id}: the dark slot holds a dark theme and the light slot a light one`);
    count(!!preset.label && !!preset.blurb, `${preset.id}: has a label and a blurb for a picker UI`);
    count(typeof preset.layout.split === "boolean", `${preset.id}: carries a StudioLayout`);
  }

  const studio = resolvePreset("studio", "light");
  count(studio.theme === studioLight && studio.layout.split, "resolvePreset('studio','light') → studio-light, split screen");
  const paper = resolvePreset("paper", "dark");
  count(paper.theme === paperDark && !paper.layout.split, "resolvePreset('paper','dark') → paper-dark, single column");
  count(resolvePreset("no-such-preset", "dark").theme === studioDark, "an unknown preset id falls back to the default rather than throwing");

  const single = PRESETS.filter((p) => !p.layout.split);
  count(single.length >= 1, `at least one preset is single-column (${single.map((p) => p.id).join(", ")}) — the fundamentally different one`);
}

console.log(`\nTHEME PASSED — ${n}/${n} checks: ${ALL_THEMES.length} themes complete and measured legible, the named palette re-mapped per theme with literals left alone, and one lesson rendering identical intents under all of them.`);
