// The unified document. `projectTranscript` folds the lesson's event log into an
// append-only, role-attributed conversation — the "scroll-up text" side of the live
// video. It is a PURE projection of `history` (+ the compiled chart for prose), so
// it replays deterministically and stays a mirror of session state, never a second
// source of truth. The opening turn is the initial beat, pinned as the reference.
//
// Roles: `tutor` (authored beats), `learner` (answers/questions), `agent` (an AI tutor's
// generated explanations + workspace gestures), `teacher` (a live human who stepped in
// mid-lesson). The engine executes a teacher's command and an AI's identically — that
// symmetry is the point of `direction/` — but the DOCUMENT must not: "your teacher jumped
// in" and "the tutor generated an aside" are different events in a learner's day, so the
// actor recorded on the carrier event decides the role here.
//
// A `demo.set` (the learner fiddling a slider) is NOT a discourse move, so it is dropped
// rather than spamming the log.
//
// Layering: lives in the lesson layer as a top-level peer above lesson_sm / beats /
// direction (it reads CompiledLesson + EventRecord and the beat.generated / workspace.set
// event names). Above render_contract. Shared by BOTH the video/ and live/ hosts — that
// shared use is why it belongs here rather than inside video/.

import type { RichText } from "@lessonstudio/render-contract";
import { article, md, text } from "@lessonstudio/render-contract";
import type { CompiledLesson, EventRecord } from "./lesson_sm/index.js";
import { DEMO_SET_EVENT, DEMO_SET_MANY_EVENT, WORKSPACE_SET_EVENT } from "./beats/index.js";
import {
  actorOf,
  AUTHORING_COMMAND_EVENT,
  DIRECTION_COMMAND_EVENT,
  focusRectOf,
  GENERATED_BEAT_EVENT,
  MESSAGE_SUBMIT_EVENT,
  normalizeCommands,
  type DirectorActor,
  type DirectorCommand,
} from "./direction/protocol.js";

export type TurnRole = "tutor" | "learner" | "agent" | "teacher";

export interface Turn {
  /** Stable React key: "open" for the pinned opener, else the source event's seq. */
  key: string;
  seq: number;
  /** The beat this turn belongs to — click to revisit, and the viz state it pairs with. */
  beatId: string;
  role: TurnRole;
  kind: "prose" | "answer" | "question" | "action" | "explanation";
  /** Event/param-derived text. A host may layer its own authored `article[beatId]` on top. */
  content?: RichText;
  /** True when this turn's beat is the currently-active one (the live interaction surface). */
  live: boolean;
  /** The opening reference turn (the initial beat), pinned at the top. */
  pinned?: boolean;
}

interface BeatMeta {
  type: string;
  params: Record<string, unknown>;
}

function beatOf(lesson: CompiledLesson, id: string): BeatMeta | null {
  const meta = lesson.chart.states[id]?.meta as { beat?: BeatMeta } | undefined;
  return meta?.beat ?? null;
}

/** Ephemeral beats (the "thinking" leaf synthesized for an interrupt) are engine
 *  scaffolding, not discourse — they never become a turn. */
function isEphemeral(lesson: CompiledLesson, id: string): boolean {
  return beatOf(lesson, id)?.params.ephemeral === true;
}

/** Top-level state id from a (possibly nested) StateValue. */
function topId(s: unknown): string {
  return typeof s === "string" ? s : Object.keys(s as Record<string, unknown>)[0]!;
}

/** The authored prose a beat carries in its params (explain.text / explorable.note). */
function beatProse(beat: BeatMeta | null): RichText | undefined {
  if (!beat) return undefined;
  // explain.text / explorable.note carry prose; mcq & freeResponse carry the question in
  // `prompt` — surface it so an authored exercise turn isn't a blank line in the log.
  const src =
    beat.type === "explain"
      ? beat.params.text
      : beat.type === "explorable"
        ? beat.params.note
        : beat.type === "mcq" || beat.type === "freeResponse"
          ? beat.params.prompt
          : undefined;
  // AUTHORED strings are markup, so parse them with the same parser the beat's own
  // renderer uses — block-level for prose, single-paragraph for a gate's question.
  // `text()` here would make the log the one place a lesson's `$h' = h\,v/u$` shows up
  // as literal dollar signs, silently disagreeing with the live block above it.
  // (Learner-typed and engine-derived strings below stay `text()`: they are content,
  // not markup, and must never be reinterpreted.)
  if (typeof src === "string") return beat.type === "mcq" || beat.type === "freeResponse" ? md(src) : article(src);
  if (Array.isArray(src)) return src as RichText;
  return undefined;
}

/** A short human phrase for an agent workspace gesture — the payload's `label` wins. */
function actionSummary(payload: Record<string, unknown>): string {
  if (typeof payload.label === "string" && payload.label) return payload.label;
  const props = (payload.props ?? {}) as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof props.annotation === "string" && props.annotation) parts.push(props.annotation);
  if (Array.isArray(props.highlight) && props.highlight.length) {
    parts.push(`highlighted ${props.highlight.length} token${props.highlight.length > 1 ? "s" : ""}`);
  }
  const cam = props.camera as { zoom?: number } | undefined;
  if (cam && typeof cam.zoom === "number" && cam.zoom !== 1) parts.push(cam.zoom > 1 ? "zoomed in" : "zoomed out");
  return parts.length ? parts.join(" · ") : "adjusted the workspace";
}

/**
 * Which voice a director speaks in. The engine's four actors collapse to three roles,
 * because the document cares about who the LEARNER should think acted: a policy acting
 * structurally (`system`) reads as the tutor's own machinery, not as a third party.
 */
function roleOfActor(actor: DirectorActor): TurnRole {
  return actor === "teacher" ? "teacher" : actor === "learner" ? "learner" : actor === "system" ? "tutor" : "agent";
}

/**
 * One phrase for the LEARNER-VISIBLE, non-prose part of a director's turn: what changed
 * on screen that isn't already covered by a beat's own words. Structural edits
 * (`patchBeat`, `rerouteBeat`, `setNext`) are deliberately silent here — rewiring the
 * lesson is not something to narrate to a student; it belongs in the teacher's log
 * (`direction/format.ts`), which is a different document with a different reader.
 * Returns "" when the turn had nothing to show.
 */
function directionSummary(cmds: DirectorCommand[]): string {
  const parts: string[] = [];
  for (const cmd of cmds) {
    switch (cmd.op) {
      case "setControl":
        parts.push(`set ${cmd.key} to ${JSON.stringify(cmd.value)}`);
        break;
      case "setControls":
        parts.push(`set ${Object.entries(cmd.values).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ")}`);
        break;
      case "workspace":
        parts.push(cmd.label ?? actionSummary({ props: cmd.props }));
        break;
      case "focus":
        parts.push(focusRectOf(cmd) ? (cmd.label ? `zoomed in on ${cmd.label}` : "zoomed in") : "zoomed back out");
        break;
      case "annotate": {
        const n = cmd.clear ? 0 : (cmd.shapes ?? []).length;
        parts.push(n ? `drew on the figure` : "erased the marks");
        break;
      }
      case "hold":
        parts.push(cmd.reason ? `paused — ${cmd.reason}` : "paused for a moment");
        break;
      case "release":
        parts.push("carried on");
        break;
      case "goto":
        parts.push("went back to an earlier step");
        break;
      default:
        break; // structural / prose ops: covered by the beat turn, or intentionally silent
    }
  }
  return parts.join(" · ");
}

/**
 * Fold the event log into ordered conversation turns. `activeBeatId` marks which
 * turns are live (their beat is the current position). Deterministic and pure: the
 * same (lesson, history) always yields the same turns.
 */
export function projectTranscript(lesson: CompiledLesson, history: EventRecord[], activeBeatId: string): Turn[] {
  const turns: Turn[] = [];

  // Opening reference: the initial beat. `start()` records no event, so it never
  // appears as a transition's `to` — seed it here so the log always has a head.
  const initial = lesson.chart.initial;
  turns.push({ key: "open", seq: -1, beatId: initial, role: "tutor", kind: "prose", content: beatProse(beatOf(lesson, initial)), live: false, pinned: true });

  // Beats whose prose has already been spoken — so re-entering one (e.g. resuming an
  // explorable after the agent answers) doesn't duplicate its turn in the log.
  const spoken = new Set<string>([initial]);

  // Every beat introduced by the AGENT at play time — via an `addBeat` authoring command or
  // the legacy `beat.generated`. A multi-step authored segment splices step1 (entered by the
  // command) but reaches steps 2..N + the exercise via plain `next` advances; those later
  // beats are still AGENT-authored, so pre-scanning the spliced ids lets us attribute them as
  // `agent:explanation` rather than `tutor:prose` (they were never in the hand-written spine).
  // A DIRECTED beat also remembers WHO added it, so beats 2..N of a spliced segment are
  // attributed to the same voice as the beat that introduced them.
  const authored = new Set<string>();
  const authoredBy = new Map<string, TurnRole>();
  for (const rec of history) {
    if (rec.event.type === DIRECTION_COMMAND_EVENT || rec.event.type === AUTHORING_COMMAND_EVENT) {
      const role = roleOfActor(actorOf(rec.event.payload));
      for (const cmd of normalizeCommands(rec.event.payload)) {
        const id = cmd.op === "addBeat" ? cmd.spec?.id : undefined;
        if (typeof id === "string") {
          authored.add(id);
          authoredBy.set(id, role);
        }
      }
    } else if (rec.event.type === GENERATED_BEAT_EVENT) {
      const id = (rec.event.payload as { id?: unknown } | undefined)?.id;
      if (typeof id === "string") authored.add(id);
    }
  }

  for (const rec of history) {
    const from = topId(rec.from);
    const to = topId(rec.to);
    const type = rec.event.type;
    const payload = (rec.event.payload ?? {}) as Record<string, unknown>;

    if (type === "mcq.answer") {
      const choice = typeof payload.choice === "number" ? payload.choice : -1;
      const choices = (beatOf(lesson, to)?.params.choices as Array<{ text?: string }> | undefined) ?? [];
      const picked = choices[choice]?.text ?? `choice ${choice + 1}`;
      turns.push({ key: `s${rec.seq}`, seq: rec.seq, beatId: to, role: "learner", kind: "answer", content: text(`You answered: ${picked}`), live: false });
      continue;
    }
    if (type === "input.submit" || type === "ask.submit") {
      const value = typeof payload.value === "string" ? payload.value : typeof payload.text === "string" ? payload.text : "";
      turns.push({ key: `s${rec.seq}`, seq: rec.seq, beatId: to, role: "learner", kind: type === "ask.submit" ? "question" : "answer", content: text(value), live: false });
      continue;
    }
    if (type === MESSAGE_SUBMIT_EVENT) {
      // Say-anytime: a learner question, anchored to the beat it was asked FROM (the
      // interrupted real beat), not the ephemeral thinking leaf it transiently enters.
      const value = typeof payload.text === "string" ? payload.text : "";
      turns.push({ key: `s${rec.seq}`, seq: rec.seq, beatId: from, role: "learner", kind: "question", content: text(value), live: false });
      continue;
    }
    if (type === WORKSPACE_SET_EVENT) {
      // Coalesce consecutive agent gestures on the same beat into a single turn.
      const last = turns[turns.length - 1];
      const summary = actionSummary(payload);
      if (last && last.role === "agent" && last.kind === "action" && last.beatId === to) last.content = text(summary);
      else turns.push({ key: `s${rec.seq}`, seq: rec.seq, beatId: to, role: "agent", kind: "action", content: text(summary), live: false });
      continue;
    }
    if (type === DEMO_SET_EVENT || type === DEMO_SET_MANY_EVENT) continue; // learner viz-fiddling — not a discourse move

    // A director's turn. Its PROSE half (a `say`, a `revisit` clone, a spliced segment)
    // falls through to the generic new-beat branch below, attributed to this actor; its
    // GESTURE half (zoom, annotate, re-pose, pause) has no beat of its own, so it becomes
    // an `action` turn pushed AFTER the prose — the words first, then what they pointed at.
    let gesture: { role: TurnRole; text: string } | null = null;
    let directedRole: TurnRole | null = null;
    if (type === DIRECTION_COMMAND_EVENT || type === AUTHORING_COMMAND_EVENT) {
      directedRole = roleOfActor(actorOf(rec.event.payload));
      const summary = directionSummary(normalizeCommands(rec.event.payload));
      if (summary) gesture = { role: directedRole, text: summary };
    }

    // Any other event that ENTERED a NEW, non-ephemeral, not-yet-spoken beat is a spoken
    // turn (the tutor's authored prose, or a director's if the beat was added at play time).
    if (to !== from && !isEphemeral(lesson, to) && !spoken.has(to)) {
      spoken.add(to);
      const role = directedRole ?? (type === GENERATED_BEAT_EVENT ? "agent" : authoredBy.get(to) ?? (authored.has(to) ? "agent" : "tutor"));
      turns.push({
        key: `s${rec.seq}`,
        seq: rec.seq,
        beatId: to,
        role,
        kind: role === "tutor" ? "prose" : "explanation",
        content: beatProse(beatOf(lesson, to)),
        live: false,
      });
    }

    if (gesture) {
      // Coalesce consecutive gestures by the same voice on the same beat, as the agent's
      // `workspace.set` path already does — a teacher nudging three sliders is one move.
      const last = turns[turns.length - 1];
      if (last && last.role === gesture.role && last.kind === "action" && last.beatId === to) last.content = text(gesture.text);
      else turns.push({ key: `d${rec.seq}`, seq: rec.seq, beatId: to, role: gesture.role, kind: "action", content: text(gesture.text), live: false });
    }
  }

  for (const t of turns) t.live = t.beatId === activeBeatId;
  return turns;
}
