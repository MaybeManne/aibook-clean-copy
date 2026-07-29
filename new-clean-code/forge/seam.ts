// The LLM / agent authoring boundary — and the reason `forge/` is a module of its own.
// Generation is I/O and nondeterministic, so it lives in an Effect run by a custom
// EffectRunner: the engine stays pure and never imports this file. The author returns a
// BeatSpec; the runner emits it as a `beat.generated` event, which Session splices into
// the live chart, jumps into, AND records in history — so replay reconstructs the beat
// from data, never re-invoking the generator.
// See docs/VISION.md ("generate → freeze → replay").
//
// Everything here talks to the engine through its PUBLIC surface (`@lessonstudio/lesson`)
// exactly as a third party would, which is what makes the eventual `lessonForge` repo
// split a directory move rather than an untangling.

import type { Effect, Json } from "@lessonstudio/state-machine";
import {
  GENERATED_BEAT_EVENT,
  authoringCommand,
  type AuthoringCommand,
  type BeatSpec,
  type EffectContext,
  type EffectRunner,
  type LessonContext,
} from "@lessonstudio/lesson";

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
 * What an author may return: a bare `BeatSpec` (the common case — add + jump into a
 * new beat) or one/many `AuthoringCommand`s (a structural "turn" — e.g. Slice 2's
 * reroute). A bare BeatSpec is wrapped as `{op:"addBeat", enter:true}`, so existing
 * offline/Claude authors and their tests are untouched.
 */
export type AuthorResult = BeatSpec | AuthoringCommand | AuthoringCommand[];

/** True for an AuthoringCommand or a list of them (vs. a bare BeatSpec, which has no `op`). */
function isCommandLike(r: AuthorResult): r is AuthoringCommand | AuthoringCommand[] {
  return Array.isArray(r) || (!!r && typeof r === "object" && "op" in r);
}

/**
 * The pluggable generator. A real one wraps an LLM client (async); a fake one is
 * deterministic and offline (drives tests), mirroring `fakeTtsAdapter`. A returned
 * BeatSpec is validated by Session.spliceBeat, which throws loudly if malformed.
 */
export interface LessonAuthor {
  generate(req: GenerateRequest): AuthorResult | Promise<AuthorResult>;
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
          .then((result) => {
            if (ec.signal.aborted) return; // beat was exited (interrupt/navigation) → drop
            // Commands go out as `authoring.command`; a bare BeatSpec keeps the legacy
            // `beat.generated` alias so video/ and existing tests are unaffected.
            if (isCommandLike(result)) ec.send(authoringCommand(result));
            else ec.send({ type: GENERATED_BEAT_EVENT, payload: result as unknown as Json });
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
