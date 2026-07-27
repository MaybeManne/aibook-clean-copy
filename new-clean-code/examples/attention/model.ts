// The toy attention model — PURE and deterministic, so the browser viz and the
// headless test share one source of truth. It is a *real* attention mechanism
// (query·key scores → softmax → weighted focus, reshaped by temperature and by
// head), over a tiny hand-set embedding table rather than trained GPT-2 weights.
// That keeps it offline, replayable, and legible while the MECHANISM the learner
// feels — attend, softmax, temperature, heads — is exactly the real thing.
//
// A SENTENCE is the playable artifact: its tokens + a 4-dim embedding table. The
// lesson ships a small PALETTE of them. `SENTENCES[0]` is the flagship's original
// sentence and every function defaults to it, so all pre-existing behavior (the
// spine, every test) is byte-identical — the palette is purely additive. The extra
// sentences are what the agent can author a detour to when a learner asks to "see
// another sentence": a genuinely different sentence with its OWN real attention,
// never a fabricated one (see lesson.ts `attentionPlan`, docs/VISION.md grounding).

export type Head = "semantic" | "positional";
export const HEADS: Head[] = ["semantic", "positional"];

/** A playable sentence: its tokens, and a tiny hand-set embedding table over the
 *  dims [noun, pronoun, animate, action]. Real softmax attention runs over `emb`. */
export interface Sentence {
  tokens: string[];
  emb: number[][];
}

// The palette. Each sentence is curated so a pronoun resolves to its referent BY
// MEANING — the semantic head jumps across the sentence to find it — which is the
// teachable moment. Sentence 1 makes the point sharper than the default: the pronoun
// "it" refers to the far animate noun ("dog"), NOT the nearer inanimate one ("ball"),
// so the semantic and positional heads visibly disagree.
export const SENTENCES: Sentence[] = [
  {
    tokens: ["the", "cat", "sat", "because", "it", "purred"],
    emb: [
      [0, 0, 0, 0], // the
      [1, 0, 1, 0], // cat     (noun, animate)
      [0, 0, 0, 1], // sat     (action)
      [0, 0, 0, 0], // because
      [0, 1, 1, 0], // it   → cat (shares `animate`)
      [0, 0, 0, 1], // purred  (action)
    ],
  },
  {
    tokens: ["the", "dog", "chased", "the", "ball", "because", "it", "barked"],
    emb: [
      [0, 0, 0, 0], // the
      [1, 0, 1, 0], // dog     (noun, animate)
      [0, 0, 0, 1], // chased  (action)
      [0, 0, 0, 0], // the
      [1, 0, 0, 0], // ball    (noun, inanimate)
      [0, 0, 0, 0], // because
      [0, 1, 1, 0], // it   → dog (shares `animate`), though "ball" is the nearer noun
      [0, 0, 0, 1], // barked  (action)
    ],
  },
];

/** The default sentence's tokens — a named export for callers that only ever render
 *  the lesson's original sentence (the flagship spine, the tests). */
export const tokens: string[] = SENTENCES[0]!.tokens;

/** The tokens of sentence `s` (defaults to the original). */
export const sentenceTokens = (s = 0): string[] => (SENTENCES[s] ?? SENTENCES[0]!).tokens;

const dot = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);

/** Raw query→key score for a head, on sentence `s`. Self-attention is masked (keeps
 *  the demo legible). */
export function score(head: Head, query: number, key: number, s = 0): number {
  if (query === key) return -Infinity;
  const emb = (SENTENCES[s] ?? SENTENCES[0]!).emb;
  if (head === "semantic") return dot(emb[query] ?? [], emb[key] ?? []);
  return -Math.abs(query - key); // positional: nearer tokens attend more
}

/** Softmax attention weights of `query` over all keys at temperature τ (>0), on
 *  sentence `s`. Sums to 1. */
export function attentionRow(head: Head, query: number, temperature: number, s = 0): number[] {
  const T = Math.max(0.05, temperature);
  const scores = sentenceTokens(s).map((_, key) => score(head, query, key, s) / T);
  const finite = scores.filter((sc) => Number.isFinite(sc));
  const m = finite.length ? Math.max(...finite) : 0;
  const exps = scores.map((sc) => (Number.isFinite(sc) ? Math.exp(sc - m) : 0));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
}

/** Index of the key `query` attends to most (self excluded) on sentence `s`, or -1. */
export function topTarget(head: Head, query: number, temperature: number, s = 0): number {
  const row = attentionRow(head, query, temperature, s);
  let best = -1;
  let bestW = -1;
  row.forEach((w, key) => {
    if (key !== query && w > bestW) {
      bestW = w;
      best = key;
    }
  });
  return best;
}

/** Peakedness of a query's attention: max weight (→1 fully focused, →1/n uniform). */
export function peakedness(head: Head, query: number, temperature: number, s = 0): number {
  return Math.max(...attentionRow(head, query, temperature, s));
}

export const headOf = (positional: boolean): Head => (positional ? "positional" : "semantic");
