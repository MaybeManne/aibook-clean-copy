// "Attention, felt" — the ML-internals flagship. The learner plays a real softmax
// attention mechanism (toy embeddings, real math — see model.ts). Exploration is
// LEARNER-PACED (nothing auto-advances); the tutor helps two ways:
//   1. live-agentic — "Explain this token ✨" (which the learner presses) declares a
//      `generate` effect; the author reads the learner's ACTUAL focus/head/τ and a
//      bespoke explanation beat is spliced in (recorded → replayable, no re-gen);
//   2. settled-state — the mcq → a `decisionPolicy` selects remediation vs challenge.
// The viz still emits `signal.viz.uniform` when attention blurs, but it is only an
// OBSERVATION now — it never routes the learner away mid-play.
//
// Flow spine: intro → explore → check → checkpoint → recap.
// remediate_temp / challenge / thinking are OFF-spine detours reached via routes.

import {
  decisionPolicy,
  defineLesson,
  explain,
  explorable,
  generate,
  mcq,
  topMisconception,
  type LessonAuthor,
  type LessonContext,
  type LessonSpec,
  type Policy,
} from "@lessonkit/lesson";
import { article, type RichText } from "@lessonkit/render-contract";
import { attentionRow, headOf, tokens, topTarget, type Head } from "./model.js";

const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };
const TEMP = { key: "temperature", label: "softmax temperature τ", kind: "slider" as const, min: 0.1, max: 3, step: 0.1 };
const HEAD = { key: "positional", label: "positional head", kind: "toggle" as const };
const EXPLAIN = { key: "explain", label: "Explain this token ✨", kind: "button" as const };

export const lessonSpec: LessonSpec = {
  id: "attention-felt",
  title: "Attention, felt",
  version: 1,
  flow: [
    explorable({ id: "intro", viz: { name: "attention", props: { focus: 4, temperature: 0.4, positional: false } }, controls: [CONTINUE], defaults: { focus: 4 } }),

    {
      ...explorable({
        id: "explore",
        viz: { name: "attention" },
        controls: [TEMP, HEAD, EXPLAIN, CONTINUE],
        defaults: { focus: 4, temperature: 0.6, positional: false },
        next: "check",
      }),
      // Learner-paced: exploration NEVER routes you away. The viz still emits
      // signal.viz.uniform (the tutor observes it), but only the explicit "Explain
      // this token ✨" button (which you press) changes the beat.
      routes: [
        { on: "demo.action", actions: ["req-gen"], target: "thinking" }, // "Explain this token ✨"
      ],
      __actions: {
        // Read the learner's ACTUAL selection and ask the author to explain it.
        "req-gen": (ctx: LessonContext) => {
          const l = (ctx.beats["explore"] ?? {}) as { focus?: number; temperature?: number; positional?: boolean };
          return { effects: [generate({ token: l.focus ?? 4, temperature: l.temperature ?? 0.6, positional: !!l.positional })] };
        },
      },
    },

    mcq({
      id: "check",
      prompt: "Raising the softmax temperature τ makes a token's attention…",
      skill: "temperature",
      choices: [
        { text: "…spread out — more uniform across tokens", correct: true },
        { text: "…sharper — focused on one token", misconception: "temp-backwards" },
        { text: "…unchanged", misconception: "temp-none" },
      ],
      correctFeedback: "Right — a higher τ flattens the softmax toward uniform.",
      wrongFeedback: "Not quite — higher τ flattens the distribution, so attention spreads out.",
      next: "checkpoint",
    }),

    {
      ...explorable({ id: "checkpoint", viz: { name: "attention", props: { focus: 4, temperature: 0.5 } }, controls: [CONTINUE], next: "recap" }),
      routes: [
        { on: "signal.remediate", target: "remediate_temp" },
        { on: "signal.challenge", target: "challenge" },
      ],
    },

    explorable({
      id: "remediate_temp",
      viz: { name: "attention" },
      controls: [{ ...TEMP, max: 1.2 }, CONTINUE],
      defaults: { focus: 4, temperature: 0.4, positional: false },
      next: "recap",
    }),

    explorable({
      id: "challenge",
      viz: { name: "attention", props: {} },
      controls: [TEMP, HEAD, CONTINUE],
      defaults: { focus: 1, temperature: 0.5, positional: true },
      next: "recap",
    }),

    explain({ id: "thinking", text: "Reading your attention pattern…", next: "recap" }),

    explorable({ id: "recap", viz: { name: "attention", props: { focus: 4, temperature: 0.3, positional: false } }, controls: [], next: null }),
  ],
};

export const lesson = defineLesson(lessonSpec);

/** Adaptivity (settled-state): fires only on `checkpoint`; SELECTS a pre-authored route. */
export const policy: Policy = decisionPolicy("checkpoint", (ctx) => {
  const mis = topMisconception(ctx);
  if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
  if ((ctx.mastery["temperature"] ?? 0) >= 1) return [{ type: "signal.challenge" }];
  return [];
});

/**
 * Deterministic FAKE author (stands in for a Claude-API client — drop a real one in
 * at this same seam). It reads the learner's actual focus/head/τ and explains THAT
 * token's attention, computed from the shared pure model.
 */
export const fakeAuthor: LessonAuthor = {
  generate({ effect }) {
    const token = Math.max(0, Math.min(tokens.length - 1, Number(effect.token ?? 4)));
    const head: Head = headOf(!!effect.positional);
    const temp = Number(effect.temperature ?? 0.6);
    const top = topTarget(head, token, temp);
    const w = top >= 0 ? attentionRow(head, token, temp)[top]! : 0;
    const why =
      head === "semantic"
        ? "they share meaning features (both are animate), so it attends to its referent"
        : "it's a neighbour — the positional head rewards nearby tokens";
    return {
      id: "gen-attention",
      type: "explain",
      params: {
        text: `You focused “${tokens[token]}”. On the ${head} head at τ=${temp.toFixed(2)}, it attends most to “${top >= 0 ? tokens[top] : "—"}” (${w.toFixed(2)}) — ${why}. Lower τ to sharpen that focus; raise it to blur it out.`,
      },
      next: "recap",
    };
  },
};

/** Book/blog explainer, keyed by beat id. */
export const articleText: Record<string, RichText> = {
  intro: article(`# Attention, felt
A transformer token decides *what to look at*. For each token it scores every other
token, softmaxes the scores into weights that sum to 1, and mixes their values by
those weights:
$$\\mathrm{attn}(q) = \\mathrm{softmax}\\!\\left(\\frac{q \\cdot k}{\\tau}\\right)$$
The beam you see is that distribution. Let's play with it.`),

  explore: article(`## Play with it
Click a token on the lower row to make it the **query**. Its beams show where its
attention goes.
- **temperature τ** — low τ sharpens the focus; high τ blurs it toward uniform
- **head** — the *semantic* head attends by meaning; flip to the *positional* head to
  attend by nearness
> [tip] Focus **“it”** on the semantic head at low τ — watch it lock onto **“cat”**.
Then hit **Explain this token ✨** and the tutor reads *your* selection.`),

  check: article(`## Quick check
You've felt the knob. Now name what it does.`),

  checkpoint: article(`Reading your run…`),

  remediate_temp: article(`## Temperature, again
Softmax with temperature τ divides every score by τ before exponentiating. Big τ ⇒
small differences ⇒ a **flat**, near-uniform distribution. Small τ ⇒ exaggerated
differences ⇒ a **peaked** one.
> [warning] High temperature doesn't "focus harder" — it does the opposite.
τ is capped low here; nudge it and watch the single bright beam hold.`),

  challenge: article(`## Challenge: heads see differently
You're on the **positional** head now, focused on **“cat”**. Notice it attends to its
*neighbours*, not by meaning. Real models run many heads in parallel — each learns a
different relation, and the next layer combines them.
> Flip back to the semantic head and compare where “cat” looks.`),

  recap: article(`# Recap
- Attention = **softmax of query·key scores** → weights that sum to 1
- **Temperature** sharpens (low) or blurs (high) the focus
- Different **heads** attend by different relations (meaning vs position)
You felt all three. Nice work.`),
};
