// The heart of the free session: how a learner's free-text question becomes a live "act".
//
// A free session is the LLM-OWNS-STRUCTURE end of the grounding spectrum (docs/VISION.md):
// the default lesson is just "ask me anything", and the tutor AUTHORS each answer's structure
// on the fly. To stay principled + replayable, the model's freedom is bounded to ONE tiny,
// closed contract — it replies with:
//
//     <markdown prose, may embed $KaTeX$ math>
//     ```html
//     <OPTIONAL single self-contained figure/demo: svg, or html+js+canvas>
//     ```
//
// which we map to a real BeatSpec the engine already renders + replays:
//   • prose only               → an `explain` beat   (text = article(markdown) → KaTeX)
//   • html present (+ caption) → an `explorable` beat hosting the `sandbox` viz (the iframe)
// Both `next: returnTo`, so the learner lands back on `home`. Nothing is invented that the
// engine can't render as DATA — the html is a plain string prop (replay-safe), and the act
// shape is a closed set. Same "assemble is pure, records → replays" discipline as
// attentionPlan; the only difference is that here the model authors the STRUCTURE too.
//
// WHY prose + a fenced ```html block, and NOT a JSON object: the answer is mostly LaTeX-laden
// prose, and LaTeX backslashes (\sum, \frac, \xi …) are invalid JSON string escapes — a model
// that forgets to double them makes JSON.parse throw (and \frac→\f, \beta→\b, \nu→\n corrupt
// SILENTLY even when it doesn't throw). Markdown needs no escaping and a fenced code block is
// the single most reliable thing a model emits, so this format is robust by construction — no
// dependence on the model escaping anything.
//
// The offline default author (no API key) fills the prose slot with `fallbackText`, which is a
// DETERMINISTIC keyword router emitting the SAME prose+fence text a live model would — so the
// no-key browser and the headless test author real acts through the exact same `assemble`
// parse path a live model takes.

import {
  offlineAuthor,
  type AuthorPlan,
  type BeatSpec,
  type GenerateRequest,
  type LessonAuthor,
} from "@lessonkit/lesson";
import type { Json } from "@lessonkit/state-machine";
import { article } from "@lessonkit/render-contract";

/** The tutor's structured act. Both fields optional; at least one must be present. */
export interface TutorAct {
  markdown?: string;
  html?: string;
}

const BACK = { key: "__next", label: "↩ Back", kind: "button" as const };

const SYSTEM =
  `You are a warm, precise tutor in a free-form session. The learner can ask ANYTHING.\n\n` +
  `Reply in this exact shape:\n` +
  `1. Your explanation as plain Markdown. Use $inline$ or $$display$$ KaTeX for any math. Keep ` +
  `it tight (1–4 short paragraphs). Write LaTeX and prose normally — no escaping, no JSON.\n` +
  `2. THEN, only when a picture or a thing-to-play-with teaches better than words, append ONE ` +
  "fenced code block tagged `html` holding a SINGLE self-contained HTML document for the figure " +
  `or interactive demo:\n\n` +
  "```html\n<!doctype html> … inline <style>, <svg>, <canvas>, <script> only …\n```\n\n" +
  `The html runs in a sandboxed iframe with NO access to the page or network, so everything must ` +
  `be inline — no external URLs, imports, fonts, or fetches. If words alone suffice, omit the ` +
  `block entirely and send only the Markdown.`;

/**
 * Decode the tutor's reply into an act. The prose is the Markdown; a fenced code block whose
 * body is markup (starts with `<`) is lifted out as the figure/demo. No JSON, so LaTeX in the
 * prose needs no escaping and can never break the parse. We scan ALL fences and take the first
 * html-ish one — the model is inconsistent about the language tag (```html, ```svg, or none),
 * and may precede the figure with a prose code sample, so we key off the CONTENT, not the tag.
 * Always returns an act (never null): a bare prose reply is a valid answer.
 */
export function parseAct(raw: string): TutorAct {
  const text = raw.trim();
  // ``` + optional language word + optional trailing space + newline, then the body, then ```.
  const fenceRe = /```[a-zA-Z0-9]*[ \t]*\r?\n?([\s\S]*?)```/g;
  for (let m = fenceRe.exec(text); m; m = fenceRe.exec(text)) {
    const inner = (m[1] ?? "").trim();
    if (inner.startsWith("<")) {
      // Drop the html block from the prose so it isn't shown twice (as code + rendered).
      const markdown = text.replace(m[0], "").trim();
      return { markdown: markdown || undefined, html: inner };
    }
  }
  return { markdown: text || undefined, html: undefined };
}

/** Encode an act back to the tutor's wire format — prose, then an optional ```html block. The
 *  offline author uses this so no-key/test runs travel the exact same `parseAct` path. */
export function encodeAct(act: TutorAct): string {
  const md = act.markdown ?? "";
  return act.html ? `${md}\n\n\`\`\`html\n${act.html}\n\`\`\`` : md;
}

/** act → BeatSpec. html present → explorable + sandbox iframe (+ caption + Back); else explain.
 *  `raw` is the model's original text — the graceful fallback body when nothing parsed. */
function beatFor(act: TutorAct, id: string, returnTo: string, raw: string): BeatSpec {
  if (typeof act.html === "string" && act.html.trim()) {
    return {
      id,
      type: "explorable",
      params: {
        viz: { name: "sandbox", props: { html: act.html } },
        controls: [BACK],
        // a string note is article-parsed at render → the caption gets KaTeX too.
        note: act.markdown ?? "",
      } as unknown as Json,
      next: returnTo,
    };
  }
  // Prose/math answer. article(...) so `$…$` renders (explain.text is NOT article-parsed when
  // given a plain string) AND survives into the folded transcript as RichText, not flat text.
  return {
    id,
    type: "explain",
    params: { text: article(act.markdown ?? raw) } as unknown as Json,
    next: returnTo,
  };
}

// Two tiny, self-contained figures the OFFLINE router can author without a model — enough to
// exercise both the interactive-demo path (canvas+js) and the static-illustration path (svg).
const SINE_HTML = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;height:100%;background:#fff;color:#334;font:14px system-ui,sans-serif}
#c{display:block;width:100%;height:100%}</style>
<canvas id="c" width="640" height="420"></canvas>
<script>
const cv=document.getElementById('c'),g=cv.getContext('2d'),W=640,H=420,mid=H/2;
g.clearRect(0,0,W,H);
g.strokeStyle='#e5e7eb';g.beginPath();g.moveTo(0,mid);g.lineTo(W,mid);g.stroke();
g.strokeStyle='#6366f1';g.lineWidth=2.5;g.beginPath();
for(let px=0;px<=W;px++){const t=px/W*4*Math.PI,y=mid-Math.sin(t)*160;px?g.lineTo(px,y):g.moveTo(px,y);}
g.stroke();
</script>`;

const TRIANGLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="100%" height="100%">
<polygon points="120,24 24,176 216,176" fill="#c7d2fe" stroke="#4338ca" stroke-width="3"/>
<text x="120" y="16" text-anchor="middle" font-family="system-ui" font-size="13" fill="#4338ca">A</text>
<text x="14" y="192" font-family="system-ui" font-size="13" fill="#4338ca">B</text>
<text x="226" y="192" text-anchor="end" font-family="system-ui" font-size="13" fill="#4338ca">C</text>
</svg>`;

/** Deterministic offline act — keyword-routed, so no-key/test runs author every act kind
 *  through the same `assemble` path a live model takes. A model replaces the prose + html;
 *  the STRUCTURE (which beat kind) is chosen the same way either way. */
function offlineAct(question: string): TutorAct {
  const q = question.toLowerCase();
  if (/\b(plot|graph|sine|sin|cos|curve|wave|function)\b/.test(q)) {
    return { markdown: "Here's a live plot of $y=\\sin x$ over $[0,4\\pi]$ — one smooth periodic wave.", html: SINE_HTML };
  }
  if (/\b(draw|sketch|diagram|illustrate|triangle|shape|figure|picture|geometry)\b/.test(q)) {
    return { markdown: "A quick sketch — a triangle, whose interior angles always sum to $180^\\circ$.", html: TRIANGLE_SVG };
  }
  return {
    markdown:
      `You asked: “${question}”. In a free session I answer with explanations and math — take the ` +
      `Pythagorean theorem, $a^2 + b^2 = c^2$, relating a right triangle's sides. Ask me to *draw* or ` +
      `*plot* something and I'll build a figure to go with it.`,
  };
}

/**
 * The plan for one generate request. A free session only ever fires `intent:"answer"` (from the
 * always-on Composer's `message.submit`), so we read the learner's question + where to return,
 * and hand back: the system + prompt a live model sees, the deterministic offline prose, and the
 * PURE `assemble` that turns raw model text into a real act beat (recorded → replayed as data).
 */
export function freeSessionPlan({ ctx, effect }: GenerateRequest): AuthorPlan {
  const returnTo = typeof effect.returnTo === "string" ? effect.returnTo : "home";
  const question = String(effect.question ?? "").trim();
  const id = `gen-act-${ctx.history.length}`; // history-indexed → replay-stable
  return {
    system: SYSTEM,
    prompt: question,
    fallbackText: encodeAct(offlineAct(question)),
    assemble: ({ text: raw }): BeatSpec => beatFor(parseAct(raw), id, returnTo, raw),
  };
}

/** The deterministic default author (offline). The App swaps in a live provider via
 *  `pickAuthor(freeSessionPlan, { complete })` when a key/completer is present. */
export const freeSessionAuthor: LessonAuthor = offlineAuthor(freeSessionPlan);
