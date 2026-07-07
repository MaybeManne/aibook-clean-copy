// Branch beat: pure flow, no content. On "next" it routes to `then` if the
// guard passes, else `else`. The guard function itself is registered by the
// compiler (from the DSL's escape-hatch predicate); this beat only references it
// by name. Renders nothing.

import type { StateId, StateNode } from "@lessonkit/state-machine";
import type { RenderIntent } from "@lessonkit/render-contract";
import type { BeatWiring, RenderableBeat } from "./types.js";

export interface BranchParams {
  whenRef: string; // registered guard name
  then: StateId;
  else: StateId;
}

export const BranchBeat: RenderableBeat<BranchParams> = {
  type: "branch",
  outcomes: ["next"],

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
