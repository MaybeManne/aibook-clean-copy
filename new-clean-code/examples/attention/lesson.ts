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
//
// AUTHORING NOTE: the flow is written with the fluent builder (lesson/authoring/builder.ts).
// Declaration order IS the spine (no hand-wired `next:`), recap is terminal because it's
// last, and detours are wired to their sources + rejoin by REFERENCE. This is the same IR
// a hand-written BeatSpec[] would produce — and the same vocabulary the LLM author emits.

import {
  decisionPolicy,
  defineLesson,
  generate,
  lesson as authorLesson,
  offlineAuthor,
  pickAuthor,
  topMisconception,
  type AuthorPlan,
  type BeatSpec,
  type ClaudeAuthorOptions,
  type GenerateRequest,
  type LessonAuthor,
  type LessonContext,
  type Policy,
} from "@lessonkit/lesson";
import { article, type RichText } from "@lessonkit/render-contract";
import { attentionRow, headOf, SENTENCES, sentenceTokens, tokens, topTarget, type Head } from "./model.js";

const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };
const TEMP = { key: "temperature", label: "softmax temperature τ", kind: "slider" as const, min: 0.1, max: 3, step: 0.1 };
const HEAD = { key: "positional", label: "positional head", kind: "toggle" as const };
const EXPLAIN = { key: "explain", label: "Explain this token ✨", kind: "button" as const };

export const lessonSpec = authorLesson("attention-felt", "Attention, felt", (l) => {
  // ── The spine: declared top-to-bottom. Declaration ORDER is the path; recap is last,
  //    so it's the ending. None of these four carry a `next:`. ──
  l.explorable("intro", {
    viz: { name: "attention", props: { focus: 4, temperature: 0.4, positional: false } },
    controls: [CONTINUE],
    defaults: { focus: 4 },
    narration:
      "Every token in a transformer decides what to look at. It scores every other token, softmaxes those scores into weights that sum to one, and mixes them. The beam you see is that distribution. Let's play with it.",
  });

  const explore = l.explorable("explore", {
    viz: { name: "attention" },
    controls: [TEMP, HEAD, EXPLAIN, CONTINUE],
    defaults: { focus: 4, temperature: 0.6, positional: false },
    ask: { placeholder: "Ask about this token…" }, // learner types a question → the tutor answers, then resumes here
    narration:
      "Click a token on the lower row to make it the query. Slide temperature to sharpen or blur its focus, and flip the head to attend by meaning or by position. Try focusing “it” on the semantic head, then hit Explain this token.",
  });

  l.mcq("check", {
    prompt: "Raising the softmax temperature τ makes a token's attention…",
    skill: "temperature",
    choices: [
      { text: "…spread out — more uniform across tokens", correct: true },
      { text: "…sharper — focused on one token", misconception: "temp-backwards" },
      { text: "…unchanged", misconception: "temp-none" },
    ],
    correctFeedback: "Right — a higher τ flattens the softmax toward uniform.",
    wrongFeedback: "Not quite — higher τ flattens the distribution, so attention spreads out.",
  });

  const checkpoint = l.explorable("checkpoint", {
    viz: { name: "attention", props: { focus: 4, temperature: 0.5 } },
    controls: [CONTINUE],
    narration: "Let me look at how that went and pick where we go next.",
  });

  const recap = l.explorable("recap", {
    viz: { name: "attention", props: { focus: 4, temperature: 0.3, positional: false } },
    controls: [],
    narration:
      "To recap: attention is a softmax over query-key scores, temperature controls how sharp it is, and different heads attend by different relations. You felt all three. Nice work.",
  });

  // ── Detours: declared once, then wired to source + rejoin by REFERENCE (all → recap). ──
  const thinking = l
    .explain("thinking", { text: "Reading your attention pattern…", narration: "Reading your attention pattern." })
    .rejoins(recap);

  const remediate = l
    .explorable("remediate_temp", {
      viz: { name: "attention" },
      controls: [{ ...TEMP, max: 1.2 }, CONTINUE],
      defaults: { focus: 4, temperature: 0.4, positional: false },
      narration:
        "Let's revisit temperature. It divides every score before the softmax, so a high temperature flattens attention toward uniform and a low one sharpens it. Nudge the slider and watch the bright beam hold.",
    })
    .rejoins(recap);

  const challenge = l
    .explorable("challenge", {
      viz: { name: "attention", props: {} },
      controls: [TEMP, HEAD, CONTINUE],
      defaults: { focus: 1, temperature: 0.5, positional: true },
      narration:
        "You've got it — here's a twist. You're on the positional head now, focused on “cat”. Notice it attends to its neighbours, not by meaning. Real models run many such heads in parallel.",
    })
    .rejoins(recap);

  // Live-agentic "Explain this token ✨": read the learner's ACTUAL selection and ask the tutor.
  explore.on("demo.action", thinking, {
    as: "req-gen",
    action: (ctx: LessonContext) => {
      const s = (ctx.beats["explore"] ?? {}) as { focus?: number; temperature?: number; positional?: boolean };
      return { effects: [generate({ token: s.focus ?? 4, temperature: s.temperature ?? 0.6, positional: !!s.positional })] };
    },
  });

  // Settled-state adaptivity: `policy` fires a signal on checkpoint; each routes a detour.
  checkpoint.on("signal.remediate", remediate);
  checkpoint.on("signal.challenge", challenge);
});

export const lesson = defineLesson(lessonSpec);

/** Adaptivity (settled-state): fires only on `checkpoint`; SELECTS a pre-authored route. */
export const policy: Policy = decisionPolicy("checkpoint", (ctx) => {
  const mis = topMisconception(ctx);
  if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
  if ((ctx.mastery["temperature"] ?? 0) >= 1) return [{ type: "signal.challenge" }];
  return [];
});

/**
 * Heuristic intent check: does the learner's free text ask to SEE a different sentence
 * (vs. a question about the current one)? Kept deterministic so the offline author and a
 * live model take the same STRUCTURAL branch — the engine decides WHICH beat gets authored;
 * the model only writes its prose. (Roadmap: let the model pick the palette index itself,
 * still bounded to sentences the engine can ground.)
 */
function wantsNewSentence(question: string): boolean {
  const q = question.toLowerCase();
  return /\b(another|different|new|other|next)\b/.test(q) && /\b(sentence|example|phrase|text|one)\b/.test(q);
}

/**
 * The shared GROUNDING for both authors. Given a generate request it computes the
 * FACTS from the pure attention model (which token attends where, at what τ/head) and
 * returns an `AuthorPlan`: the grounded BeatSpec skeleton (`assemble`), the deterministic
 * offline prose (`fallbackText`), and the prompts a live model would receive. `fakeAuthor`
 * fills the prose slot with `fallbackText`; a Claude author fills it with a live sentence —
 * but the viz props, ids, and `next` are computed HERE, never by the model. That is the
 * "engine owns facts + structure, LLM owns voice" split, made concrete, so the offline and
 * live authors can never drift: they run the exact same `assemble`.
 */
export function attentionPlan({ ctx, effect }: GenerateRequest): AuthorPlan {
  const factSheet = (s: number, token: number, head: Head, temp: number, top: number): string => {
    const toks = sentenceTokens(s);
    const w = top >= 0 ? attentionRow(head, token, temp, s)[top]! : 0;
    return [
      `Tokens, in order: ${toks.map((t) => `“${t}”`).join(", ")}.`,
      `The learner's query token is “${toks[token]}”.`,
      `Head: ${head}. Softmax temperature τ = ${temp.toFixed(2)}.`,
      top >= 0
        ? `On this head at this τ, “${toks[token]}” attends most strongly to “${toks[top]}” (weight ${w.toFixed(2)}).`
        : `On this head at this τ, “${toks[token]}” has no other token to attend to.`,
      `A higher τ flattens the softmax toward uniform; a lower τ sharpens the focus.`,
    ].join("\n");
  };
  const system = (facts: string): string =>
    `You are a warm, precise tutor embedded in an interactive attention visualization. ` +
    `Stay grounded in exactly these facts — the tokens, weights, and target below are computed for you, so don't invent different ones:\n\n${facts}\n\n` +
    `Reply with 1–3 sentences of plain explanation grounded in these exact tokens and τ. No preamble, no lists, no markdown.`;

  // ── Conversational answer (message.submit): answer IN CONTEXT, then RESUME the beat the
  // learner asked from. The agent also circles the coreferent pair on the same viz. A
  // history-indexed id keeps repeated questions distinct (and stays deterministic on
  // replay, which reads the recorded spec rather than re-invoking any author).
  if (effect.intent === "answer") {
    const returnTo = typeof effect.returnTo === "string" ? effect.returnTo : "recap";
    const question = String(effect.question ?? "").trim();
    const local = (ctx.beats[returnTo] ?? {}) as { focus?: number; temperature?: number; positional?: boolean; sentence?: number };
    const s = Math.max(0, Math.min(SENTENCES.length - 1, Number(local.sentence ?? 0)));

    // "Show me another sentence" — a request the pre-authored lesson never anticipated.
    // The tutor doesn't REFUSE (the old failure): it AUTHORS a real detour beat rendering a
    // DIFFERENT sentence from the palette — with its OWN real attention, grounded here by the
    // engine — then rejoins the spine (next = returnTo). The learner chooses WHICH artifact by
    // asking; the engine owns the facts + the structure (so the viz can never show a sentence
    // it can't ground); the model writes only the framing prose. Recorded as an addBeat
    // command, so it replays as data. (Roadmap: let the model pick the palette index itself,
    // still bounded to sentences the engine can ground.)
    if (wantsNewSentence(question) && SENTENCES.length > 1) {
      const nextS = (s + 1) % SENTENCES.length;
      const toks = sentenceTokens(nextS);
      const focus = Math.max(0, toks.indexOf("it")); // the pronoun makes the sharpest example
      const temp = 0.5;
      const top = topTarget("semantic", focus, temp, nextS);
      const target = top >= 0 ? toks[top] : "—";
      return {
        system: system(factSheet(nextS, focus, "semantic", temp, top)),
        prompt: `The learner asked to see a different sentence, so the diagram now shows “${toks.join(" ")}”, focused on “${toks[focus]}”. In 1–2 sentences note that on the semantic head it attends to “${target}” — its referent by meaning, not the nearest noun — and invite them to slide τ or flip the head, then hit Back.`,
        fallbackText: `Here's a fresh sentence: “${toks.join(" ")}”. Focus is on “${toks[focus]}”, and on the semantic head it attends to “${target}” — its referent by meaning, not the nearest word. Slide τ or flip the head to compare, then hit Back when you're done.`,
        assemble: ({ text: prose }): BeatSpec => ({
          id: `gen-sentence-${ctx.history.length}`,
          type: "explorable",
          params: {
            viz: {
              name: "attention",
              props: {
                sentence: nextS,
                focus,
                temperature: temp,
                positional: false,
                highlight: top >= 0 ? [focus, top] : [focus],
                annotation: `“${toks[focus]}” → “${target}”`,
              },
            },
            controls: [TEMP, HEAD, { key: "__next", label: "↩ Back to exploring", kind: "button" }],
            defaults: { focus, temperature: temp, positional: false, sentence: nextS },
            note: prose,
          },
          next: returnTo,
        }),
      };
    }

    // Otherwise: answer IN CONTEXT about the sentence on screen, then resume the beat.
    const toks = sentenceTokens(s);
    const token = Math.max(0, Math.min(toks.length - 1, Number(local.focus ?? 4)));
    const head: Head = headOf(!!local.positional);
    const temp = Number(local.temperature ?? 0.6);
    const top = topTarget(head, token, temp, s);
    const target = top >= 0 ? toks[top] : "—";
    return {
      system: system(factSheet(s, token, head, temp, top)),
      prompt: `The learner is focused on “${toks[token]}” and asks: “${question}”. Answer it in context; the pair “${toks[token]}” → “${target}” is already circled on screen.`,
      fallbackText: `You asked: “${question}” — good question. Right now “${toks[token]}” attends most to “${target}” on the ${head} head (τ=${temp.toFixed(2)}); I've circled the pair. Nudge τ and ask again whenever.`,
      assemble: ({ text: prose }): BeatSpec => ({
        id: `gen-answer-${ctx.history.length}`,
        type: "explorable",
        params: {
          viz: {
            name: "attention",
            props: {
              sentence: s,
              focus: token,
              temperature: temp,
              positional: !!local.positional,
              highlight: top >= 0 ? [token, top] : [token],
              annotation: `“${toks[token]}” → “${target}”`,
            },
          },
          controls: [{ key: "__next", label: "↩ Back to exploring", kind: "button" }],
          note: prose,
        },
        next: returnTo,
      }),
    };
  }

  // ── Live-agentic "Explain this token ✨": explain the learner's ACTUAL focus.
  const token = Math.max(0, Math.min(tokens.length - 1, Number(effect.token ?? 4)));
  const head: Head = headOf(!!effect.positional);
  const temp = Number(effect.temperature ?? 0.6);
  const top = topTarget(head, token, temp);
  const target = top >= 0 ? tokens[top] : "—";
  const w = top >= 0 ? attentionRow(head, token, temp)[top]! : 0;
  const why =
    head === "semantic"
      ? "they share meaning features (both are animate), so it attends to its referent"
      : "it's a neighbour — the positional head rewards nearby tokens";
  return {
    system: system(factSheet(0, token, head, temp, top)),
    prompt: `Explain to the learner why “${tokens[token]}” attends where it does right now, and how τ changes the sharpness of that focus.`,
    fallbackText: `You focused “${tokens[token]}”. On the ${head} head at τ=${temp.toFixed(2)}, it attends most to “${target}” (${w.toFixed(2)}) — ${why}. Lower τ to sharpen that focus; raise it to blur it out.`,
    assemble: ({ text: prose }): BeatSpec => ({
      id: "gen-attention",
      type: "explain",
      params: { text: prose },
      next: "recap",
    }),
  };
}

/**
 * The DEFAULT author: deterministic and offline — canned prose over the shared grounding.
 * It stands in for a Claude client and drives every test + the browser demo (which must
 * never hold an API key). "Drop a real one in at this same seam" is now literal:
 * `attentionAuthor()` returns the live Claude author whenever ANTHROPIC_API_KEY is set.
 */
export const fakeAuthor: LessonAuthor = offlineAuthor(attentionPlan);

/**
 * The seam selector: the LIVE Claude author when a key (or an injected completer) is
 * present, else `fakeAuthor`. Same grounding either way — only the prose is live.
 */
export const attentionAuthor = (opts: Omit<ClaudeAuthorOptions, "plan"> = {}): LessonAuthor =>
  pickAuthor(attentionPlan, opts);

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
