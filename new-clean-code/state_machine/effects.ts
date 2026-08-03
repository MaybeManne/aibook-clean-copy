import type { Json, MachineEvent } from "./types.js";

export type Effect =
  | { kind: "persist"; payload: Json }
  | { kind: "timer"; ms: number; emit: MachineEvent }
  | { kind: string; [k: string]: unknown };
