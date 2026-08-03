import { topId } from "../state_machine/index.js";
import type { RichText } from "@lessonstudio/intents";
import { article, md, text } from "../intents/index.js";
import type { CompiledLesson, EventRecord } from "./lesson_sm/index.js";
import { DEMO_SET_EVENT, DEMO_SET_MANY_EVENT } from "./beats/index.js";
import {
  actorOf,
  AUTHORING_COMMAND_EVENT,
  DIRECTION_COMMAND_EVENT,
  focusRectOf,
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

function isEphemeral(lesson: CompiledLesson, id: string): boolean {
  return beatOf(lesson, id)?.params.ephemeral === true;
}

function beatProse(beat: BeatMeta | null): RichText | undefined {
  if (!beat) return undefined;
  const src =
    beat.type === "explain"
      ? beat.params.text
      : beat.type === "explorable"
        ? beat.params.note
        : beat.type === "mcq" || beat.type === "freeResponse"
          ? beat.params.prompt
          : undefined;
  if (typeof src === "string") return beat.type === "mcq" || beat.type === "freeResponse" ? md(src) : article(src);
  if (Array.isArray(src)) return src as RichText;
  return undefined;
}

function actionSummary(props: Record<string, unknown>): string {
  const parts: string[] = [];
  if (typeof props.annotation === "string" && props.annotation) parts.push(props.annotation);
  if (Array.isArray(props.highlight) && props.highlight.length) {
    parts.push(`highlighted ${props.highlight.length} token${props.highlight.length > 1 ? "s" : ""}`);
  }
  const cam = props.camera as { zoom?: number } | undefined;
  if (cam && typeof cam.zoom === "number" && cam.zoom !== 1) parts.push(cam.zoom > 1 ? "zoomed in" : "zoomed out");
  return parts.length ? parts.join(" · ") : "adjusted the workspace";
}

function roleOfActor(actor: DirectorActor): TurnRole {
  return actor === "teacher" ? "teacher" : actor === "learner" ? "learner" : actor === "system" ? "tutor" : "agent";
}

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
        parts.push(cmd.label ?? actionSummary(cmd.props));
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
        break;
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

  const initial = lesson.chart.initial;
  turns.push({ key: "open", seq: -1, beatId: initial, role: "tutor", kind: "prose", content: beatProse(beatOf(lesson, initial)), live: false, pinned: true });

  const spoken = new Set<string>([initial]);

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
      const value = typeof payload.text === "string" ? payload.text : "";
      turns.push({ key: `s${rec.seq}`, seq: rec.seq, beatId: from, role: "learner", kind: "question", content: text(value), live: false });
      continue;
    }
    if (type === DEMO_SET_EVENT || type === DEMO_SET_MANY_EVENT) continue;

    let gesture: { role: TurnRole; text: string } | null = null;
    let directedRole: TurnRole | null = null;
    if (type === DIRECTION_COMMAND_EVENT || type === AUTHORING_COMMAND_EVENT) {
      directedRole = roleOfActor(actorOf(rec.event.payload));
      const summary = directionSummary(normalizeCommands(rec.event.payload));
      if (summary) gesture = { role: directedRole, text: summary };
    }

    if (to !== from && !isEphemeral(lesson, to) && !spoken.has(to)) {
      spoken.add(to);
      const role = directedRole ?? authoredBy.get(to) ?? (authored.has(to) ? "agent" : "tutor");
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
      const last = turns[turns.length - 1];
      if (last && last.role === gesture.role && last.kind === "action" && last.beatId === to) last.content = text(gesture.text);
      else turns.push({ key: `d${rec.seq}`, seq: rec.seq, beatId: to, role: gesture.role, kind: "action", content: text(gesture.text), live: false });
    }
  }

  for (const t of turns) t.live = t.beatId === activeBeatId;
  return turns;
}
