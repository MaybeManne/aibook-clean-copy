// An effect is DECLARED by an action and RUN by the shell (a higher-layer
// Session), never by the interpreter. This is how all I/O and nondeterminism
// (timers, network, LLM calls) stays out of the pure engine. Open set.

import type { Json, MachineEvent } from "./types.js";

export type Effect =
  | { kind: "persist"; payload: Json }
  | { kind: "timer"; ms: number; emit: MachineEvent }
  | { kind: string; [k: string]: unknown };
