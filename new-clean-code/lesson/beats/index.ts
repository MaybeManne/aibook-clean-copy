import { AnimateBeat } from "./animate.js";
import { BranchBeat } from "./branch.js";
import { ExplainBeat } from "./explain.js";
import { ExplorableBeat } from "./explorable.js";
import { FreeResponseBeat } from "./freeresponse.js";
import { McqBeat } from "./mcq.js";
import type { BeatRegistry } from "./types.js";

export * from "./types.js";
export * from "./workspace.js";
export * from "./explain.js";
export * from "./mcq.js";
export * from "./branch.js";
export * from "./animate.js";
export * from "./freeresponse.js";
export * from "./explorable.js";

/** All built-in renderable beats, keyed by type. */
export const builtinBeats: BeatRegistry = {
  [ExplainBeat.type]: ExplainBeat,
  [McqBeat.type]: McqBeat,
  [BranchBeat.type]: BranchBeat,
  [AnimateBeat.type]: AnimateBeat,
  [FreeResponseBeat.type]: FreeResponseBeat,
  [ExplorableBeat.type]: ExplorableBeat,
};

/** A fresh registry seeded with the built-ins (callers may extend it). */
export function defaultBeatRegistry(): BeatRegistry {
  return { ...builtinBeats };
}
