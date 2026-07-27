// Tagged-template sugar for authored rich text, so a lesson file writes prose with
// NATURAL KaTeX and never imports the render-contract layer directly.
//
//   md`# Title
//   The integral $\int_a^b f$ is the **signed area**.`   → block article (headings/
//   lists/callouts + inline $…$ / display $$…$$ math)
//   tex`\int_0^1 x^2`                                     → a single inline math node
//
// IMPORTANT: both tags read `strings.raw`, so a LaTeX backslash (`\int`, `\tfrac`,
// `\,`) survives — a *cooked* template literal would turn `\t` into a TAB and `\n`
// into a newline and corrupt the math. Pure: no React, no DOM.

import { article, math, type RichText } from "@lessonkit/render-contract";

/** Reassemble a tagged template from its RAW parts (LaTeX backslashes preserved). */
function joinRaw(strings: TemplateStringsArray, values: unknown[]): string {
  const raw = strings.raw;
  let out = raw[0] ?? "";
  for (let i = 0; i < values.length; i++) out += String(values[i]) + (raw[i + 1] ?? "");
  return out;
}

/** Block-level prose with inline `$…$` / display `$$…$$` KaTeX and `**bold**`/`*em*`. */
export function md(strings: TemplateStringsArray, ...values: unknown[]): RichText {
  return article(joinRaw(strings, values));
}

/** A single inline math fragment: `tex\`\\frac{dy}{dx}\``. */
export function tex(strings: TemplateStringsArray, ...values: unknown[]): RichText {
  return math(joinRaw(strings, values).trim(), false);
}

// A plain inline text run — the RichText a scene `label` node wants, so `.animate({ build })`
// can add labels without reaching into render-contract. `text("Σ → ∫")`.
export { text } from "@lessonkit/render-contract";
