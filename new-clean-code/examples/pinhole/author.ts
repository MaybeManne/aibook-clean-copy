// The pinhole lesson's AUTHORING PLAN — what the tutor may say when a learner asks a
// question mid-lesson, and what it is not allowed to make up.
//
// The division of labour is the whole design (see lesson/authoring/claude_author.ts):
//
//   • the ENGINE owns FACTS and STRUCTURE. The physics, the learner's CURRENT apparatus
//     state (u, v, and the magnification that follows from them), the beat id, its type,
//     and where Continue goes are all computed here, deterministically, from the lesson
//     spec and the session context. `assemble()` is pure.
//   • the MODEL owns VOICE — one short paragraph answering the question in the tutor's
//     register. It cannot emit an invalid beat, cannot reroute the lesson, and cannot
//     contradict a number, because it never gets to produce any of those.
//
// So the failure mode of a bad generation is "flat prose", not "broken lesson" — and the
// offline path (no API key) is the same code with `fallbackText` in the prose slot, which
// is why a keyless run still plays the whole conversational loop.
//
// One subtlety worth stating: the model is not told the numbers so that it can restate
// them — it is told them so it cannot contradict them. The numbers themselves are appended
// by `assemble()` as an engine-owned footer, colour-keyed through the same `palette.ts` the
// figure labels use. That is what makes a generated turn look native to the lesson rather
// than like a chat reply pasted into it.

import type { Json } from "@lessonstudio/state-machine";
import type { AuthoredProse, AuthorPlan, BeatSpec, GenerateRequest, LessonContext } from "@lessonstudio/lesson";
import { SYMBOL_COLOR, tex, type SymbolName } from "./palette.js";
import { PINHOLE_VIZ, type PinholeProps } from "./pinhole3d.js";
import { lessonSpec } from "./lesson.js";

/** The authored beats, by id — the plan reads the very spec it is planning against. */
const BEATS = new Map<string, BeatSpec>(lessonSpec.flow.map((b) => [b.id, b]));
const BEAT_ORDER = [...BEATS.keys()];

/** Fallback apparatus geometry, matching `pinhole3d.ts`'s own defaults. */
const FALLBACK = { u: 7, v: 7 };

/**
 * What the learner is looking at RIGHT NOW: the beat's authored `viz` props, overridden by
 * anything they have since dragged or slid (`demo.set` writes the live value into
 * `ctx.beats[id]`, and `explorable.defaults` seeds it). This is the piece a chat model
 * structurally cannot know and the engine structurally does — it is the reason this seam is
 * worth having at all, rather than pasting the lesson text into a chat window.
 */
function apparatusOf(ctx: LessonContext, beatId: string): { u: number; v: number } {
  const params = (BEATS.get(beatId)?.params ?? {}) as {
    viz?: { props?: Record<string, unknown> };
    defaults?: Record<string, unknown>;
  };
  const sources: Array<Record<string, unknown>> = [
    (ctx.beats[beatId] as Record<string, unknown> | undefined) ?? {}, // learner's live value
    params.defaults ?? {}, // the beat's starting value
    params.viz?.props ?? {}, // the authored apparatus state
  ];
  const pick = (key: "u" | "v"): number => {
    for (const src of sources) {
      const n = Number(src[key]);
      if (Number.isFinite(n)) return n;
    }
    return FALLBACK[key];
  };
  return { u: pick("u"), v: pick("v") };
}

/** Round for prose: `1.71`, but `2` rather than `2.00`. */
function num(x: number): string {
  return Number.isInteger(x) ? String(x) : x.toFixed(2).replace(/0$/, "");
}

// ── colour-keying generated prose ────────────────────────────────────────────────
// M4.6 made "every `v` in this lesson is sky-blue" structural rather than a habit, by
// routing the figure's label sprites and the authored KaTeX through one palette. A
// generated turn has to obey the same rule or it reads as foreign — so the ENGINE colours
// the symbols after the fact, instead of asking the model to emit `\textcolor{#38bdf8}{v}`
// (which it would do inconsistently, and which would let it invent hexes).
//
// Two maskings first, both load-bearing: `\text{...}` because the `m` in `5\,\text{m}` is
// metres and not magnification, and `\textcolor{...}{...}` because anything already
// coloured is already right. Only bare symbols in MATH are touched; prose words never are.

const MASK = "\u0000"; // NUL cannot occur in authored TeX, so `<NUL>n<NUL>` is unambiguous
const SYMBOL_OF: Record<string, SymbolName> = { "h'": "hp", h: "h", u: "u", v: "v", m: "m" };

/** Colour the bare `h' h u v m` tokens inside one math span. */
function colorSpan(body: string): string {
  const held: string[] = [];
  const hold = (m: string): string => `${MASK}${held.push(m) - 1}${MASK}`;
  const masked = body
    .replace(/\\textcolor\{[^}]*\}\{[^}]*\}/g, hold)
    .replace(/\\text\{[^}]*\}/g, hold);
  // A symbol is a LONE letter: not part of a TeX command (`\mu`) and not part of a word.
  const painted = masked.replace(/(?<![\\A-Za-z])(h'|h|u|v|m)(?![A-Za-z'])/g, (t) => tex(SYMBOL_OF[t]!));
  return painted.replace(new RegExp(`${MASK}(\\d+)${MASK}`, "g"), (_all, i: string) => held[Number(i)] ?? "");
}

/** Colour every math span in a prose string, leaving the words alone. */
export function colorizeMath(src: string): string {
  return src.replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_all, display: string | undefined, inline: string | undefined) =>
    display != null ? `$$${colorSpan(display)}$$` : `$${colorSpan(inline!)}$`,
  );
}

// ── the plan ─────────────────────────────────────────────────────────────────────

/** The hard physics of this lesson. The model may rephrase these; it may not contradict them. */
const PHYSICS = [
  "The apparatus is an object at distance u in front of a barrier with one small hole, and a screen at distance v behind it.",
  "Rays cross AT the hole, so the image on the screen is inverted (upside-down).",
  "The ray bundles form two similar triangles meeting at the hole, so h'/h = v/u, i.e. h' = h*v/u.",
  "Magnification m = v/u; it is written m = -v/u when the minus sign is used to record the inversion.",
  "A matte (Lambertian) wall reflects an average of the light arriving from every direction, so it forms no image.",
  "Each screen point receives light from exactly ONE direction, so no blur circle can form: a pinhole needs no focusing and has infinite depth of field.",
  "A smaller hole is sharper but dimmer. This lesson treats the hole as ideal and does not model diffraction.",
].join("\n");

const SYSTEM = [
  "You are the tutor voice inside an interactive lesson on the pinhole camera. The learner has",
  "interrupted to ask something. Answer in 1-3 sentences of warm, direct second-person prose.",
  "",
  "These facts are already established by the lesson. Do not contradict them, and introduce no",
  "numbers beyond the ones you are given:",
  PHYSICS,
  "",
  "Rules:",
  "- Plain prose. No headings, no bullet lists, no preamble like 'Great question'.",
  "- Inline LaTeX between single dollar signs is fine ($v/u$). Never write \\textcolor yourself.",
  "- The apparatus figure is on screen beside your words; point at it rather than re-describing it.",
  "- If the question is outside this lesson's scope, say so in one sentence and point back to what",
  "  the apparatus does show. Never invent an answer in order to look helpful.",
].join("\n");

/**
 * Build the plan for one `generate` request. Both entry points — the always-on Composer
 * (`message.submit`) and an explorable's own ask box (`ask.submit`) — raise the SAME effect
 * `{kind:"generate", intent:"answer", question, returnTo}`, so one plan serves both. The
 * `returnTo` beat is the one the learner asked FROM, which is what makes an interruption a
 * detour rather than a place to get stuck.
 */
export function pinholePlan(req: GenerateRequest): AuthorPlan {
  const question = String(req.effect.question ?? "").trim();
  const returnTo = typeof req.effect.returnTo === "string" ? req.effect.returnTo : undefined;
  const anchor = returnTo ?? (req.ctx.vars.__activeBeat as string) ?? BEAT_ORDER[0]!;
  const { u, v } = apparatusOf(req.ctx, anchor);
  const m = v / u;

  // How far the lesson has got, so the answer can lean on what has been shown and not spoil
  // what has not. Derived from the spec's order, so it is the same on replay.
  const reached = BEAT_ORDER.indexOf(anchor);
  const seen = reached < 0 ? [] : BEAT_ORDER.slice(0, reached + 1);

  const prompt = [
    `The learner asks: "${question}"`,
    "",
    `They are on lesson step "${anchor}". Steps covered so far: ${seen.join(", ") || "(the opening)"}.`,
    `The apparatus in front of them is set to u = ${num(u)} and v = ${num(v)}, so m = v/u = ${num(m)}.`,
    "Answer their question. Do not restate those numbers unless the question is about them.",
  ].join("\n");

  // The offline answer: what a keyless run and a failed API call both show, so it has to be
  // usable rather than an apology. Deterministic, and true of every question this lesson invites.
  const fallbackText =
    "Everything in this lesson follows from one rule: the hole lets exactly one ray direction " +
    "reach each point of the screen. That is why the image is organized rather than averaged, " +
    "why it arrives inverted, and why it stays sharp at any screen distance.";

  return {
    system: SYSTEM,
    prompt,
    fallbackText,
    /**
     * The pure part: drop the prose into a real beat of the lesson.
     *   • `explain` renders into the `prose` slot and nothing into `prompt`, so StudioView's
     *     DERIVED Continue appears on it for free (M4.5) — no new affordance to build.
     *   • `next: anchor` is what resumes the interrupted step on that Continue.
     *   • the id is derived from history length: unique per question, and identical on replay.
     *   • it carries the apparatus at the state the learner is looking at (plus `labels`,
     *     since a question here is nearly always about the geometry), so the figure explains
     *     the answer instead of lurching to some authored pose.
     *   • the footer is the ENGINE's, not the model's: the live numbers, colour-keyed.
     * Everything is plain JSON — no inline guards or actions — which is exactly what lets the
     * recorded `beat.generated` event rebuild this beat on replay with no model in the loop.
     *
     * No `narration`: the prose is full of TeX, and read aloud that is worse than silence.
     * Speaking a generated answer needs a separate spoken variant from the model — a real
     * feature, but a different one.
     */
    assemble(prose: AuthoredProse): BeatSpec {
      const footer =
        `> With the apparatus as you have it now — $${tex("u")} = ${num(u)}$, $${tex("v")} = ${num(v)}$ — ` +
        `the magnification is $${tex("m")} = ${tex("v")}/${tex("u")} = ${num(m)}$.`;
      const props: PinholeProps = { u, v, rays: true, image: true, labels: true };
      return {
        id: `__answer-${req.ctx.history.length}`,
        type: "explain",
        params: {
          text: `${colorizeMath(prose.text.trim())}\n\n${footer}`,
          viz: { name: PINHOLE_VIZ, props: props as Record<string, unknown>, persistent: true },
        } as unknown as Json,
        next: anchor,
      };
    },
  };
}

/** Re-exported so a check can assert generated prose against the same table the figure uses. */
export { SYMBOL_COLOR };
