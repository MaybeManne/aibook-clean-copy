// THE DIRECTION PROTOCOL — the vocabulary in which a DIRECTOR (a live human teacher,
// or an AI teacher standing exactly where the human stood) edits a lesson that is
// already being played, in the same language the lesson was authored in. One
// discriminated union, PURE JSON, carried in an event payload so it lands in history
// and replays without re-invoking whoever produced it ("generate → freeze → replay").
// The engine adjudicates every command (validate → install) before committing.
//
// This module is the SEAM, and it deliberately knows nothing about who is on the other
// side of it: the human teacher's terminal and the model's tool call produce the same
// bytes. That symmetry is the whole point — tier 3 is "run the other CLI", not a second
// integration (see docs/ROADMAP.md, "the three tiers").
//
// The union is organized by what a teacher actually reaches for mid-lesson:
//
//   STRUCTURE   addBeat · patchBeat · rerouteBeat / setNext · goto
//   DISCOURSE   say · revisit                     (sugar — the adjudicator expands both
//                                                  into addBeat, so "answer with a beat"
//                                                  and "show that again, then come back"
//                                                  cost the engine no new concepts)
//   WORKSPACE   setControl / setControls · workspace   (act on the visual the learner is
//                                                       looking at, reusing what is there)
//   ATTENTION   focus · annotate                  (zoom into a figure, draw on it — in
//                                                  normalized stage coords, so ONE
//                                                  implementation serves every viz)
//   PACING      hold · release                    (stop the learner advancing while you
//                                                  set something up)
//
// Everything is plain JSON with no inline functions, which is exactly what lets a
// director's whole turn be replayed from the log with nobody in the loop.

import type { Json, MachineEvent } from "@lessonstudio/state-machine";
import type { BeatSpec } from "../lesson_sm/compile.js";

/**
 * The event carrying one director turn: `{ actor, commands }`. Session intercepts it in
 * `apply()` BEFORE the pure `transition()` — the flat engine has no route for it, so it
 * would otherwise be silently dropped.
 *
 * The payload records the ACTOR because the transcript has to be able to say who acted:
 * a beat the live human teacher added mid-lesson is not the same discourse move as one
 * the AI tutor generated, even though the engine executes them identically.
 */
export const DIRECTION_COMMAND_EVENT = "direction.command";

/**
 * The original name of the same event, kept as an accepted alias forever (v1 shipped
 * `authoring.command` before there was a human-teacher tier). An `authoring.command`
 * carries no actor and is attributed to `"ai"` — which is what it always was.
 */
export const AUTHORING_COMMAND_EVENT = "authoring.command";

/**
 * The event that carries ONE runtime-authored beat (its `BeatSpec` is the payload).
 * Session intercepts it: splice the beat into the live chart, then jump into it.
 * Because the spec rides in the event, it lands in history and is re-created on replay
 * WITHOUT re-invoking the generator — the "generate → freeze → replay" line. It is a
 * legacy alias for a single `{op:"addBeat", enter:true}` command; kept forever so
 * existing lessons, tests and the AI seam are never broken by a protocol addition.
 */
export const GENERATED_BEAT_EVENT = "beat.generated";

/**
 * The learner's say-anytime / interrupt move. Ambient: the flat engine has no route for
 * it (the active beat may not declare `message.submit`), so Session intercepts it before
 * `transition()`. It records the learner turn, enters a synthesized ephemeral "thinking"
 * leaf that clones the interrupted beat's viz (so the shared workspace never blanks), and
 * fires a `generate` effect to author the answer — while the leaf change cancels any
 * in-flight generation (that is the interrupt, for free).
 *
 * It lives here, with the director vocabulary, because it is the OTHER half of the same
 * conversation: this is the learner's move that a director answers.
 */
export const MESSAGE_SUBMIT_EVENT = "message.submit";

/** Build a `message.submit` event carrying the learner's free-text message. */
export function messageSubmit(textValue: string): MachineEvent {
  return { type: MESSAGE_SUBMIT_EVENT, payload: { text: textValue } };
}

// ── who is directing ────────────────────────────────────────────────────────────

/**
 * Who produced a turn of commands. The engine treats all four identically (that is the
 * point of the seam); the TRANSCRIPT does not, because "your teacher stepped in" and
 * "the tutor generated an aside" are different things to a learner.
 *   • `teacher` — a human on a second screen, via `teach/`.
 *   • `ai`      — a model standing in the same place, via `forge/`.
 *   • `system`  — the engine or a policy acting structurally (no discourse turn).
 *   • `learner` — reserved: a learner-initiated structural move (e.g. "show me that again").
 */
export type DirectorActor = "teacher" | "ai" | "system" | "learner";

// ── attention: focus + annotation, in normalized stage coordinates ──────────────

/**
 * A rectangle over the STAGE PANEL in normalized 0..1 coordinates (0,0 = top-left).
 * Normalized, not pixels and not viz-specific: one implementation then zooms an SVG
 * figure, a Canvas2D viz and the WebGL apparatus alike, because the renderer applies it
 * as a transform on the panel rather than asking the visual to cooperate. A viz that
 * exposes its own real camera (conv2d's `zoom`, pinhole3d's props) is still reachable
 * through `workspace` — this is the floor that works everywhere, not a replacement.
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
 * The active beat id, mirrored into `ctx.vars` by Session on every committed step. Written
 * for the benefit of anyone holding a CONTEXT but not the Session that produced it — an
 * effect runner (`ec.ctx`), a persisted snapshot, a replayed history. That is what lets
 * `subjectFromContext` build a full observation with no Session reference, which is how the
 * AI director answers a learner's question from inside an effect (see forge/director.ts).
 */
export const ACTIVE_BEAT_VAR = "__activeBeat";

// ── the command union ───────────────────────────────────────────────────────────

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
  /** Explicit id (else derived from history length — unique per turn, stable on replay). */
  id?: string;
}

export type DirectorCommand =
  // ── STRUCTURE ────────────────────────────────────────────────────────────────
  /** Add a new beat to the live chart. `enter` (default true) jumps into it; pass
   *  false to add-for-later (e.g. spine insertion, where a later reroute wires the jump). */
  | { op: "addBeat"; spec: BeatSpec; enter?: boolean }
  /**
   * Re-author an EXISTING beat's params in place (a shallow merge — `{text}` rewords an
   * explain, `{defaults:{v:13}}` re-poses its figure). The beat is re-lowered and
   * adjudicated exactly like a new one, so a patch that would strand the learner is
   * rejected whole. Its ADVANCE edge is preserved (a prior `setNext` survives a patch).
   */
  | { op: "patchBeat"; beatId: string; params: Record<string, Json> }
  /** Rewrite an EXISTING beat's edge (default the `next`/advance edge) to a new target.
   *  The learner's path changes; the beat's other edges are untouched. Adjudicated. */
  | { op: "rerouteBeat"; beatId: string; edge: EdgePatch }
  /** Sugar for `rerouteBeat` on the default advance edge: point `beatId`'s `next` at
   *  `target` (or `null` = make it terminal). Spine insertion composes as
   *  `addBeat(B, next=C, enter:false)` + `setNext(A, B)`. */
  | { op: "setNext"; beatId: string; target: string | null }
  /** Move the learner to an EXISTING beat now, changing no edges. The bluntest move in
   *  the protocol and the one a teacher reaches for most ("go back to the diagram"). */
  | { op: "goto"; beatId: string }

  // ── DISCOURSE (sugar over addBeat) ───────────────────────────────────────────
  /** Answer in the tutor's own voice: a new `explain` beat, entered now, whose Continue
   *  resumes where the learner was. This is "answer the question with a beat". */
  | SayCommand
  /**
   * Show an existing beat again WITHOUT losing the learner's place: a clone of `beatId`
   * (its type, its params, its visual) is entered now and resumes `resume` on Continue.
   * Cloning rather than `goto` is what makes this reuse-a-visual instead of a jump — the
   * original beat keeps its own edges, and the learner's position is never overwritten.
   */
  | { op: "revisit"; beatId: string; resume?: string | null; note?: string }

  // ── WORKSPACE ────────────────────────────────────────────────────────────────
  /** Set one control value on the learner's live visual (the same channel as their own
   *  slider: `demo.set`), attributed to the director. */
  | { op: "setControl"; key: string; value: Json; beatId?: string }
  /** Set several control values as ONE gesture ("load the Gaussian preset"). */
  | { op: "setControls"; values: Record<string, Json>; beatId?: string }
  /** Patch the AGENT-side viz props (`__ws`): highlight, camera, overlay — anything the
   *  visual reads that is not a learner control. `label` is the transcript's phrase. */
  | { op: "workspace"; props: Record<string, Json>; label?: string; beatId?: string }

  // ── ATTENTION ────────────────────────────────────────────────────────────────
  /**
   * Zoom the stage panel. Either an explicit `rect`, or `at` + `scale` (centre a point
   * and magnify around it — the form a teacher actually says: "3× on the hole").
   * `clear: true` returns to the whole stage.
   */
  | { op: "focus"; rect?: StageRect; at?: StagePoint; scale?: number; label?: string; clear?: boolean }
  /** Draw over the stage. `shapes` REPLACES the current marks (drawing is a statement,
   *  not an accumulation); `clear: true` erases them. */
  | { op: "annotate"; shapes?: Annotation[]; clear?: boolean }

  // ── PACING ───────────────────────────────────────────────────────────────────
  /** Suppress the learner's advance while you set something up; the renderer shows why. */
  | { op: "hold"; reason?: string }
  /** Release a hold. */
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
 * The subset of the union that existed when the protocol was called "authoring": the
 * three STRUCTURAL ops. Kept as a named alias because `forge/seam.ts` and the generated
 * `beat.generated` path speak exactly this much, and neither should have to widen.
 */
export type AuthoringCommand = Extract<DirectorCommand, { op: "addBeat" | "rerouteBeat" | "setNext" }>;

/** Ops that change the chart's TOPOLOGY (as opposed to what is on screen). These are the
 *  ones a `SUPERVISED` capability set holds for human approval. */
export const STRUCTURAL_OPS: DirectorOp[] = ["addBeat", "patchBeat", "rerouteBeat", "setNext", "goto", "say", "revisit"];

// ── builders ────────────────────────────────────────────────────────────────────

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

/** Keep a normalized rect inside the unit square, preserving its size where possible. */
export function clampRect(r: StageRect): StageRect {
  const w = Math.min(1, Math.max(0.02, r.w));
  const h = Math.min(1, Math.max(0.02, r.h));
  return { x: Math.min(1 - w, Math.max(0, r.x)), y: Math.min(1 - h, Math.max(0, r.y)), w, h };
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
      `direction.command: beat "${spec.id}" carries inline __guards/__actions; ` +
        `runtime beats must reference guards/actions by name (JSON-only, for replay).`,
    );
  }
}
