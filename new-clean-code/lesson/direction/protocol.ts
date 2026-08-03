import type { Json, MachineEvent } from "@lessonstudio/state-machine";
import type { BeatSpec } from "../lesson_sm/compile.js";

/**
 * The event carrying one director turn: `{ actor, commands }` (see `DirectorActor`). Session
 * intercepts it in `apply()` BEFORE the pure `transition()`, since the flat engine has no route
 * for it and would otherwise drop it silently.
 */
export const DIRECTION_COMMAND_EVENT = "direction.command";

/**
 * An accepted alias for `DIRECTION_COMMAND_EVENT`, kept so older logs stay replayable. An
 * `authoring.command` carries no actor and is attributed to `"ai"`.
 */
export const AUTHORING_COMMAND_EVENT = "authoring.command";

/**
 * The learner's say-anytime / interrupt move. Ambient: the flat engine has no route for it (the
 * active beat may not declare `message.submit`), so Session intercepts it before `transition()`.
 * It records the learner turn, enters a synthesized ephemeral "thinking" leaf that clones the
 * interrupted beat's viz (so the shared workspace never blanks), and fires a `generate` effect
 * to author the answer — while the leaf change cancels any in-flight generation, which is the
 * interrupt, for free.
 */
export const MESSAGE_SUBMIT_EVENT = "message.submit";

/** Build a `message.submit` event carrying the learner's free-text message. */
export function messageSubmit(textValue: string): MachineEvent {
  return { type: MESSAGE_SUBMIT_EVENT, payload: { text: textValue } };
}

/**
 * Who produced a turn of commands. The engine treats all four identically; the TRANSCRIPT does
 * not, because "your teacher stepped in" and "the tutor generated an aside" are different events
 * in a learner's day.
 *   • `teacher` — a human on a second screen, via `teach/`.
 *   • `ai`      — a model standing in the same place, via `forge/`.
 *   • `system`  — the engine or a policy acting structurally (no discourse turn).
 *   • `learner` — reserved: a learner-initiated structural move.
 */
export type DirectorActor = "teacher" | "ai" | "system" | "learner";

/**
 * A rectangle over the STAGE PANEL in normalized 0..1 coordinates (0,0 = top-left). Normalized
 * rather than pixels or viz-specific, so one implementation zooms an SVG figure, a Canvas2D viz
 * and the WebGL apparatus alike: the renderer applies it as a transform on the panel. A viz with
 * its own real camera is still reachable through `workspace`.
 */
export interface StageRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The live "we are looking here" state, held in `ctx.vars.__focus` (null = whole stage). */
export interface FocusState {
  rect: StageRect;
  /** Short caption shown while focused ("the two similar triangles"). */
  label?: string;
}

/** A point in the same normalized stage space. */
export type StagePoint = [number, number];

/**
 * One mark drawn OVER the stage, in normalized coordinates. Held as a list in
 * `ctx.vars.__annotations`; the renderer overlays them in an `<svg viewBox="0 0 1 1">`,
 * so they sit correctly on top of any visual and survive a focus zoom.
 */
export type Annotation =
  | { kind: "arrow"; from: StagePoint; to: StagePoint; label?: string; color?: string }
  | { kind: "circle"; at: StagePoint; r: number; label?: string; color?: string }
  | { kind: "rect"; rect: StageRect; label?: string; color?: string }
  | { kind: "label"; at: StagePoint; text: string; color?: string }
  | { kind: "ink"; points: StagePoint[]; color?: string };

/** The learner-visible pause a director takes while setting something up. */
export interface HoldState {
  reason?: string;
}

/** Reserved `ctx.vars` keys the director writes and the renderer reads. Reserved (not a
 *  beat param) because they must work on EVERY beat with no beat cooperation at all. */
export const FOCUS_VAR = "__focus";
export const ANNOTATIONS_VAR = "__annotations";
export const HOLD_VAR = "__hold";

/**
 * The active beat id, mirrored into `ctx.vars` by Session on every committed step, for anyone
 * holding a CONTEXT but not the Session that produced it — an effect runner (`ec.ctx`), a
 * persisted snapshot, a replayed history. See `subjectFromContext`.
 */
export const ACTIVE_BEAT_VAR = "__activeBeat";

/**
 * Which edge of a beat to rewrite, and to what. An edge is keyed by the event type that triggers
 * it: `on` defaults to `"next"` (the default advance edge — the spine); a gate's detour is its
 * own event key. `target: null` makes the edge terminal (advancing there ends the lesson). Pure
 * JSON — no guard/action refs — so a reroute is a plain recorded patch that replays
 * deterministically; the rewritten edge is a single UNGUARDED transition to `target`.
 */
export interface EdgePatch {
  /** Event key of the edge to rewrite. Default `"next"`. */
  on?: string;
  /** New target beat id, or `null` = terminal on that event. */
  target: string | null;
}

/** The prose a `say` turn shows, plus how it rejoins the lesson. */
export interface SayCommand {
  op: "say";
  /** Markdown + `$math$`, rendered by the same parser an authored `explain` uses. */
  text: string;
  /** Optional spoken variant (the renderer voices it via /api/tts). Omit for silence —
   *  TeX-heavy prose read aloud is worse than nothing. */
  narrate?: string;
  /** Where Continue goes. Omitted ⇒ back to the beat the learner is on (an interruption
   *  is a DETOUR, not a place to get stuck); `null` ⇒ this turn ends the lesson. */
  resume?: string | null;
  /** Reuse a visual the learner has already seen: props for the stage viz of `like`'s
   *  beat, or an explicit `{name, props}`. Omitted ⇒ inherit the current beat's stage. */
  show?: { like?: string; name?: string; props?: Record<string, Json>; persistent?: boolean };
  /**
   * How the detour ENDS. Omitted ⇒ one Continue back to `resume`, the shape every `say` has always
   * had. `"both"` ⇒ two buttons: back to `resume`, and onward to whatever the interrupted beat
   * advances to — an answer becomes a fork in the conversation instead of a rewind. An explicit
   * list ⇒ exactly those buttons, in order, with `to: null` ending the lesson.
   *
   * Opt-in because it changes what the learner sees at the end of every answer, which is a house
   * style decision belonging to the lesson (pinhole turns it on in its `polish`), not a default the
   * engine imposes.
   */
  exits?: "both" | Array<{ label: string; to: string | null }>;
  /** Explicit id (else derived from history length — unique per turn, stable on replay). */
  id?: string;
}

export type DirectorCommand =
  | { op: "addBeat"; spec: BeatSpec; enter?: boolean }
  | { op: "patchBeat"; beatId: string; params: Record<string, Json> }
  | { op: "rerouteBeat"; beatId: string; edge: EdgePatch }
  | { op: "setNext"; beatId: string; target: string | null }
  | { op: "goto"; beatId: string }

  | SayCommand
  | { op: "revisit"; beatId: string; resume?: string | null; note?: string }

  | { op: "setControl"; key: string; value: Json; beatId?: string }
  | { op: "setControls"; values: Record<string, Json>; beatId?: string }
  | { op: "workspace"; props: Record<string, Json>; label?: string; beatId?: string }

  | { op: "focus"; rect?: StageRect; at?: StagePoint; scale?: number; label?: string; clear?: boolean }
  | { op: "annotate"; shapes?: Annotation[]; clear?: boolean }

  | { op: "hold"; reason?: string }
  | { op: "release" };

/** Every op name, for capability lists and generated tool schemas. */
export const DIRECTOR_OPS = [
  "addBeat",
  "patchBeat",
  "rerouteBeat",
  "setNext",
  "goto",
  "say",
  "revisit",
  "setControl",
  "setControls",
  "workspace",
  "focus",
  "annotate",
  "hold",
  "release",
] as const;

export type DirectorOp = (typeof DIRECTOR_OPS)[number];

/**
 * The three STRUCTURAL ops, named as their own alias because `authoringCommand()` accepts
 * exactly this much.
 */
export type AuthoringCommand = Extract<DirectorCommand, { op: "addBeat" | "rerouteBeat" | "setNext" }>;

/** Ops that change the chart's TOPOLOGY (as opposed to what is on screen). These are the
 *  ones a `SUPERVISED` capability set holds for human approval. */
export const STRUCTURAL_OPS: DirectorOp[] = ["addBeat", "patchBeat", "rerouteBeat", "setNext", "goto", "say", "revisit"];

/** Build a `direction.command` event from one command or a list (one director turn). */
export function directionCommand(cmd: DirectorCommand | DirectorCommand[], actor: DirectorActor = "teacher"): MachineEvent {
  const commands = Array.isArray(cmd) ? cmd : [cmd];
  return { type: DIRECTION_COMMAND_EVENT, payload: { actor, commands } as unknown as Json };
}

/** Build the legacy `authoring.command` event (attributed to the AI tier). Kept so the
 *  existing generate path and its tests are byte-identical. */
export function authoringCommand(cmd: AuthoringCommand | AuthoringCommand[]): MachineEvent {
  const commands = Array.isArray(cmd) ? cmd : [cmd];
  return { type: AUTHORING_COMMAND_EVENT, payload: { commands } as unknown as Json };
}

/** Normalize a command to `(beatId, edgeKey, target)` — folds `setNext` into `rerouteBeat`
 *  on the `"next"` edge, so the adjudicator has one reroute code path. */
export function rerouteOf(cmd: DirectorCommand): { beatId: string; key: string; target: string | null } | null {
  if (cmd.op === "rerouteBeat") return { beatId: cmd.beatId, key: cmd.edge.on ?? "next", target: cmd.edge.target };
  if (cmd.op === "setNext") return { beatId: cmd.beatId, key: "next", target: cmd.target };
  return null;
}

/** Recover the command list from an event payload (tolerant of a bare single command). */
export function normalizeCommands(payload: unknown): DirectorCommand[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.commands)) return p.commands as DirectorCommand[];
  if (typeof p.op === "string") return [p as unknown as DirectorCommand];
  return [];
}

/** Recover the actor from a `direction.command` payload. A legacy `authoring.command`
 *  carries none and is attributed to `"ai"`, which is what produced it. */
export function actorOf(payload: unknown, fallback: DirectorActor = "ai"): DirectorActor {
  const a = (payload as { actor?: unknown } | null | undefined)?.actor;
  return a === "teacher" || a === "ai" || a === "system" || a === "learner" ? a : fallback;
}

/**
 * Resolve `focus`'s two spellings to the one rect the renderer applies. `at` + `scale`
 * is the teacher's phrasing ("3× on the hole"); the rect is clamped into the stage so a
 * point near an edge still yields a valid, on-screen window.
 */
export function focusRectOf(cmd: Extract<DirectorCommand, { op: "focus" }>): StageRect | null {
  if (cmd.clear) return null;
  if (cmd.rect) return clampRect(cmd.rect);
  const scale = cmd.scale && cmd.scale > 0 ? cmd.scale : 2;
  const [cx, cy] = cmd.at ?? [0.5, 0.5];
  const w = Math.min(1, 1 / scale);
  const h = Math.min(1, 1 / scale);
  return clampRect({ x: cx - w / 2, y: cy - h / 2, w, h });
}

function clampRect(r: StageRect): StageRect {
  const w = Math.min(1, Math.max(0.02, r.w));
  const h = Math.min(1, Math.max(0.02, r.h));
  return { x: Math.min(1 - w, Math.max(0, r.x)), y: Math.min(1 - h, Math.max(0, r.y)), w, h };
}

/**
 * Guardrail: a runtime/agent-authored beat must reference guards/actions BY NAME only.
 * Inline `__guards`/`__actions` are functions (not JSON) and would break durable replay
 * — the recorded command must reconstruct the beat as pure data. Inline fns remain a
 * compile-time authoring privilege (see compile.ts). Throws on violation.
 *
 * `params` is walked for the same reason, and it is not a hypothetical: `params` is typed `Json`,
 * so only a cast or a JavaScript host can put a function there, and both happen. Nothing would
 * refuse it — the beat would install and behave, and then `JSON.stringify(history)` would drop the
 * function on the way to the log, so `replay()` would rebuild a DIFFERENT beat and say nothing. A
 * recording that silently disagrees with the session is worse than a refusal.
 */
export function assertNoInlineFns(spec: BeatSpec): void {
  const g = spec.__guards && Object.keys(spec.__guards).length;
  const a = spec.__actions && Object.keys(spec.__actions).length;
  if (g || a) {
    throw new Error(
      `direction.command: beat "${spec.id}" carries inline __guards/__actions; ` +
        `runtime beats must reference guards/actions by name (JSON-only, for replay).`,
    );
  }
  const at = findFn(spec.params, "params");
  if (at) {
    throw new Error(
      `direction.command: beat "${spec.id}" carries a function at \`${at}\`; ` +
        `runtime beats must be pure JSON (a function does not survive the log, so it would not replay).`,
    );
  }
}

/** The path of the first function value in a params tree, or null. Depth-first, cycle-safe. */
function findFn(value: unknown, path: string, seen = new Set<object>()): string | null {
  if (typeof value === "function") return path;
  if (value === null || typeof value !== "object" || seen.has(value)) return null;
  seen.add(value);
  for (const [key, v] of Object.entries(value)) {
    const at = findFn(v, Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`, seen);
    if (at) return at;
  }
  return null;
}
