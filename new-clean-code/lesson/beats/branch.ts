import type { StateId, StateNode } from "@lessonstudio/state-machine";
import type { RenderIntent } from "@lessonstudio/intents";
import type { BeatWiring, RenderableBeat } from "./types.js";

export interface BranchParams {
  whenRef: string;
  then: StateId;
  else: StateId;
}

export const BranchBeat: RenderableBeat<BranchParams> = {
  type: "branch",
  outcomes: ["next"],

  paramsSchema: {
    doc:
      "An invisible fork: routes to `then` when the named guard passes, `else` otherwise. " +
      "`whenRef` must name a guard the LESSON already registered — you cannot define one, since " +
      "runtime-authored beats are pure JSON. Prefer `explain` with `exits` to offer the learner a " +
      "choice; use `branch` only to reuse a guard the lesson exposes.",
    params: {
      whenRef: "name of an already-registered guard",
      then: "beat id taken when the guard passes",
      else: "beat id taken when it does not",
    },
    example: { whenRef: "masteredMagnification", then: "hard-q", else: "recap" },
  },

  build(_params, id): StateNode {
    return { id };
  },

  wire(params): BeatWiring {
    return {
      routes: [
        { on: "next", guard: params.whenRef, target: params.then },
        { on: "next", target: params.else },
      ],
    };
  },

  render(): RenderIntent[] {
    return [];
  },
};
