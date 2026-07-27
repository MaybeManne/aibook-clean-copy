// The toy attention model — PURE and deterministic, so the browser viz and the
// headless test share one source of truth. It is a *real* attention mechanism
// (query·key scores → softmax → weighted focus, reshaped by temperature and by
// head), over a tiny hand-set embedding table rather than trained GPT-2 weights.
// That keeps it offline, replayable, and legible while the MECHANISM the learner
// feels — attend, softmax, temperature, heads — is exactly the real thing.

export const tokens: string[] = ["the", "cat", "sat", "because", "it", "purred"];

export type Head = "semantic" | "positional";
export const HEADS: Head[] = ["semantic", "positional"];

// 4-dim toy embeddings: [noun, pronoun, animate, action]. "it" shares `animate`
// with "cat", so on the semantic head the pronoun attends to its referent.
const EMB: number[][] = [
  [0, 0, 0, 0], // the
  [1, 0, 1, 0], // cat
  [0, 0, 0, 1], // sat
  [0, 0, 0, 0], // because
  [0, 1, 1, 0], // it
  [0, 0, 0, 1], // purred
];

const dot = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);

/** Raw query→key score for a head. Self-attention is masked (keeps the demo legible). */
export function score(head: Head, query: number, key: number): number {
  if (query === key) return -Infinity;
  if (head === "semantic") return dot(EMB[query] ?? [], EMB[key] ?? []);
  return -Math.abs(query - key); // positional: nearer tokens attend more
}

/** Softmax attention weights of `query` over all keys at temperature τ (>0). Sums to 1. */
export function attentionRow(head: Head, query: number, temperature: number): number[] {
  const T = Math.max(0.05, temperature);
  const scores = tokens.map((_, key) => score(head, query, key) / T);
  const finite = scores.filter((s) => Number.isFinite(s));
  const m = finite.length ? Math.max(...finite) : 0;
  const exps = scores.map((s) => (Number.isFinite(s) ? Math.exp(s - m) : 0));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
}

/** Index of the key `query` attends to most (self excluded), or -1. */
export function topTarget(head: Head, query: number, temperature: number): number {
  const row = attentionRow(head, query, temperature);
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
export function peakedness(head: Head, query: number, temperature: number): number {
  return Math.max(...attentionRow(head, query, temperature));
}

export const headOf = (positional: boolean): Head => (positional ? "positional" : "semantic");
