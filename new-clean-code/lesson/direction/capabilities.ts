// CAPABILITIES — how much of the direction protocol a given director may actually use.
//
// The design requirement is "unrestricted now, limitable gradually", and the way to make
// that true rather than aspirational is to put the knob in from the start and leave it
// open. So `FULL` is the default and it permits everything; tightening a director later
// is passing a different value here, not a refactor. There is exactly ONE enforcement
// point (`adjudicate`), so no caller — human CLI, AI tool loop, policy — can route around
// it, and no new op can accidentally ship unguarded.
//
// Pure data + pure predicates. Nothing here knows who the director is.

import { STRUCTURAL_OPS, type DirectorOp } from "./protocol.js";

export interface Capabilities {
  /** Shown in observations and logs, so a director can see the regime it is under. */
  name: string;
  /** `"*"` = every op. An explicit list is a whitelist; `[]` denies everything. */
  allow: "*" | DirectorOp[];
  /**
   * Ops that are legal but must be APPROVED by a human before they execute. Adjudication
   * rejects them with `kind: "review"`, which the transport turns into a queue entry —
   * the engine never holds pending state, because pending state that isn't in history
   * isn't replayable.
   */
  review?: DirectorOp[];
  /** Maximum commands accepted in one turn. Undefined/0 = uncapped. */
  maxPerTurn?: number;
  /**
   * Beat ids the director may not rewrite or rewire — the graded spine, typically. It may
   * still `goto`, `revisit` (which clones) and `say` around them, so protecting a beat
   * limits editing, not teaching.
   */
  protect?: string[];
}

/**
 * Everything, uncapped: tier 3 as specified ("I don't want to limit its power"). Every
 * command still passes structural adjudication — an AI teacher cannot emit an invalid
 * beat or soft-lock the learner — but nothing is withheld on policy grounds.
 */
export const FULL: Capabilities = { name: "full", allow: "*" };

/**
 * Show-and-tell only: the director may act on the visual, point at it, and pace the
 * learner, but not change the lesson's structure. The natural first limit to impose,
 * and a useful regime for an AI that is being watched.
 */
export const SUPERVISED: Capabilities = { name: "supervised", allow: "*", review: STRUCTURAL_OPS };

/** No commands at all — a director that may only watch (`observe`/`format` still work). */
export const OBSERVE_ONLY: Capabilities = { name: "observe-only", allow: [] };

/** Why a command was refused. `forbidden` = not in `allow`; `review` = needs a human;
 *  `cap` = over `maxPerTurn`; `protected` = the target beat is off limits. */
export type DenyKind = "forbidden" | "review" | "cap" | "protected";

/** Thrown by `adjudicate` when capabilities refuse a command. Distinct from CompileError:
 *  the command was well-formed, and a different regime would have accepted it. */
export class DirectionDenied extends Error {
  constructor(
    readonly op: string,
    readonly kind: DenyKind,
    readonly detail: string,
  ) {
    super(`direction: ${op} denied (${kind}) — ${detail}`);
    this.name = "DirectionDenied";
  }
}

/** Is this op available at all under `caps`? */
export function permits(caps: Capabilities, op: DirectorOp): boolean {
  return caps.allow === "*" || caps.allow.includes(op);
}

/** Does this op need a human's approval before it may execute? */
export function needsReview(caps: Capabilities, op: DirectorOp): boolean {
  return !!caps.review?.includes(op);
}

/** Is this beat off limits to structural editing? */
export function isProtected(caps: Capabilities, beatId: string): boolean {
  return !!caps.protect?.includes(beatId);
}

/**
 * Check one command against the regime, throwing `DirectionDenied` on refusal. `index` is
 * its position in the turn, so `maxPerTurn` is enforced per command rather than by
 * truncating a batch (a silently truncated turn is worse than a rejected one: the director
 * would believe it landed).
 */
export function assertPermitted(caps: Capabilities, op: DirectorOp, index: number, targetBeatId?: string): void {
  if (!permits(caps, op)) throw new DirectionDenied(op, "forbidden", `"${op}" is not permitted under capabilities "${caps.name}"`);
  if (needsReview(caps, op)) throw new DirectionDenied(op, "review", `"${op}" requires approval under capabilities "${caps.name}"`);
  if (caps.maxPerTurn && index >= caps.maxPerTurn) {
    throw new DirectionDenied(op, "cap", `more than ${caps.maxPerTurn} command(s) in one turn`);
  }
  if (targetBeatId && isProtected(caps, targetBeatId)) {
    throw new DirectionDenied(op, "protected", `beat "${targetBeatId}" is protected under capabilities "${caps.name}"`);
  }
}
