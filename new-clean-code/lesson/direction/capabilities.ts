import { STRUCTURAL_OPS, type DirectorOp } from "./protocol.js";

export interface Capabilities {
  /** Shown in observations and logs, so a director can see the regime it is under. */
  name: string;
  /** `"*"` = every op. An explicit list is a whitelist; `[]` denies everything. */
  allow: "*" | DirectorOp[];
  /**
   * Ops that are legal but must be APPROVED by a human before they execute. Adjudication refuses
   * them and says so distinctly — `DirectionResult.error.kind === "review"`, not `"denied"` — so
   * a director can tell "ask someone" from "never".
   *
   * The engine holds nothing pending, so there is no queue here for anyone to approve later:
   * `review` is a rejection carrying a reason a human could act on.
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
 * Everything, uncapped. Every command still passes structural adjudication — a director cannot
 * emit an invalid beat or soft-lock the learner — but nothing is withheld on policy grounds.
 */
export const FULL: Capabilities = { name: "full", allow: "*" };

/**
 * Show-and-tell only: the director may act on the visual, point at it and pace the learner, but
 * not change the lesson's structure.
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

function isProtected(caps: Capabilities, beatId: string): boolean {
  return !!caps.protect?.includes(beatId);
}

/**
 * Check one command against the regime, throwing `DirectionDenied` on refusal. `index` is its
 * position in the turn, so `maxPerTurn` is enforced per command rather than by truncating a
 * batch (a silently truncated turn would leave the director believing it landed).
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
