// The agent's structural action vocabulary — how a player edits the environment
// itself, in the same language the teacher authored it. One discriminated union,
// PURE JSON, carried in an event payload so it lands in history and replays without
// re-invoking the author ("generate → freeze → replay"). Session adjudicates every
// command (validate → splice/reroute) before committing.
//
// v1 ships `addBeat` (= today's spliceBeat), plus `rerouteBeat` / `setNext` (rewriting
// an EXISTING node's edges — the agent personalizes the main path, not just splices
// side-beats). Every reroute is adjudicated by Session before commit: the target must
// already exist (`validateReroute`), the beat must carry no inline fns, and the result
// must not soft-lock the learner (`reachesTerminal`, the "level stays completable"
// invariant). The union stays open so future ops are additive.

import type { Json, MachineEvent } from "@lessonstudio/state-machine";
import type { BeatSpec } from "../lesson_sm/compile.js";

/**
 * The event carrying one authoring "turn" (a list of commands). Session intercepts it
 * in `apply()` BEFORE the pure `transition()` — the flat engine has no route for it, so
 * it would otherwise be silently dropped. `beat.generated` stays as a legacy alias for
 * a single `{op:"addBeat", enter:true}` so `video/` and existing tests are untouched.
 */
export const AUTHORING_COMMAND_EVENT = "authoring.command";

/**
 * Which edge of a beat to rewrite, and to what. An edge is keyed by the event type that
 * triggers it: `on` defaults to `"next"` (the default advance edge — the spine). A gate's
 * detour ("onWrong"-style) is its own event key. `target: null` makes the edge terminal
 * (advancing there ends the lesson). Pure JSON — no guard/action refs — so a reroute is a
 * plain recorded patch that replays deterministically; the rewritten edge is a single
 * UNGUARDED transition to `target` (rewiring a guarded/branch edge is out of scope for v1).
 */
export interface EdgePatch {
  /** Event key of the edge to rewrite. Default `"next"`. */
  on?: string;
  /** New target beat id, or `null` = terminal on that event. */
  target: string | null;
}

export type AuthoringCommand =
  /** Add a new beat to the live chart. `enter` (default true) jumps into it; pass
   *  false to add-for-later (e.g. spine insertion, where a later reroute wires the jump). */
  | { op: "addBeat"; spec: BeatSpec; enter?: boolean }
  /** Rewrite an EXISTING beat's edge (default the `next`/advance edge) to a new target.
   *  The learner's path changes; the beat's other edges are untouched. Adjudicated. */
  | { op: "rerouteBeat"; beatId: string; edge: EdgePatch }
  /** Sugar for `rerouteBeat` on the default advance edge: point `beatId`'s `next` at
   *  `target` (or `null` = make it terminal). Spine insertion composes as
   *  `addBeat(B, next=C, enter:false)` + `setNext(A, B)`. */
  | { op: "setNext"; beatId: string; target: string | null };

/** Build an `authoring.command` event from one command or a list (an authoring turn). */
export function authoringCommand(cmd: AuthoringCommand | AuthoringCommand[]): MachineEvent {
  const commands = Array.isArray(cmd) ? cmd : [cmd];
  return { type: AUTHORING_COMMAND_EVENT, payload: { commands } as unknown as Json };
}

/** Normalize a command to `(beatId, edgeKey, target)` — folds `setNext` into `rerouteBeat`
 *  on the `"next"` edge, so Session has one reroute code path. */
export function rerouteOf(cmd: AuthoringCommand): { beatId: string; key: string; target: string | null } | null {
  if (cmd.op === "rerouteBeat") return { beatId: cmd.beatId, key: cmd.edge.on ?? "next", target: cmd.edge.target };
  if (cmd.op === "setNext") return { beatId: cmd.beatId, key: "next", target: cmd.target };
  return null;
}

/** Recover the command list from an event payload (tolerant of a bare single command). */
export function normalizeCommands(payload: unknown): AuthoringCommand[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.commands)) return p.commands as AuthoringCommand[];
  if (typeof p.op === "string") return [p as unknown as AuthoringCommand];
  return [];
}

/**
 * Guardrail: a runtime/agent-authored beat must reference guards/actions BY NAME only.
 * Inline `__guards`/`__actions` are functions (not JSON) and would break durable replay
 * — the recorded command must reconstruct the beat as pure data. Inline fns remain a
 * compile-time authoring privilege (see compile.ts). Throws on violation.
 */
export function assertNoInlineFns(spec: BeatSpec): void {
  const g = spec.__guards && Object.keys(spec.__guards).length;
  const a = spec.__actions && Object.keys(spec.__actions).length;
  if (g || a) {
    throw new Error(
      `authoring.command: beat "${spec.id}" carries inline __guards/__actions; ` +
        `runtime beats must reference guards/actions by name (JSON-only, for replay).`,
    );
  }
}
