// The LLM / agent authoring boundary. Generation is I/O and nondeterministic, so
// it lives in an Effect run by a custom EffectRunner — the engine stays pure. The
// author returns a BeatSpec; the runner emits it as a `beat.generated` event, which
// Session splices into the live chart, jumps into, AND records in history — so
// replay reconstructs the beat from data, never re-invoking the generator.
// See docs/VISION.md ("generate → freeze → replay").

import type { Effect, Json } from "@lessonkit/state-machine";
import type { BeatSpec } from "../lesson_sm/compile.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { GENERATED_BEAT_EVENT, type EffectContext, type EffectRunner } from "./session.js";

/** The effect a beat declares (from an entry action) to request generation. Open payload. */
export interface GenerateEffect {
  kind: "generate";
  [k: string]: unknown;
}

/** Build a generate effect (e.g. returned from a beat's entry action's `effects`). */
export function generate(req: Record<string, Json> = {}): GenerateEffect {
  return { kind: "generate", ...req };
}

/** What the author is handed: the settled context + the requesting effect's fields. */
export interface GenerateRequest {
  ctx: LessonContext;
  effect: GenerateEffect;
}

/**
 * The pluggable generator. A real one wraps an LLM client (async); a fake one is
 * deterministic and offline (drives tests), mirroring `fakeTtsAdapter`. It MUST
 * return a valid BeatSpec — Session.spliceBeat validates and throws loudly if not.
 */
export interface LessonAuthor {
  generate(req: GenerateRequest): BeatSpec | Promise<BeatSpec>;
}

/**
 * An EffectRunner that turns `generate` effects into `beat.generated` events via the
 * author, delegating every other effect kind to `base` (default: nothing). Abort-aware:
 * if the beat that requested generation is exited before the author returns, the
 * result is dropped (the standard effect-cancellation contract).
 */
export function generatingRunner(author: LessonAuthor, base?: EffectRunner): EffectRunner {
  return {
    run(effect: Effect, ec: EffectContext): void {
      if (effect.kind === "generate") {
        Promise.resolve(author.generate({ ctx: ec.ctx, effect: effect as GenerateEffect }))
          .then((spec) => {
            if (!ec.signal.aborted) ec.send({ type: GENERATED_BEAT_EVENT, payload: spec as unknown as Json });
          })
          .catch((err) => {
            if (typeof console !== "undefined") console.error("[lessonkit] generation failed:", err);
          });
        return;
      }
      base?.run(effect, ec);
    },
  };
}
