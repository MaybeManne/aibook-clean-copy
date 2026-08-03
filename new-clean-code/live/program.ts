import type { MachineEvent } from "@lessonstudio/state-machine";
import type { RenderModel } from "@lessonstudio/intents";
import {
  ANNOTATIONS_VAR,
  FOCUS_VAR,
  HOLD_VAR,
  projectTranscript,
  type Annotation,
  type FocusState,
  type HoldState,
  type Session,
  type Turn,
} from "@lessonstudio/lesson";
import type { LiveFrame } from "./frame.js";

const THINKING_PREFIX = "__ask-";

export class LiveProgram {
  private readonly subscribers = new Set<(f: LiveFrame) => void>();
  private detachSession?: () => void;
  /** transcript() memo — history is append-only, so (length, activeBeat) is a sound key. */
  private trCache: { len: number; active: string; turns: Turn[] } | null = null;

  constructor(private readonly sess: Session) {
    this.detachSession = this.sess.subscribe(() => this.emit());
  }

  get session(): Session {
    return this.sess;
  }
  get done(): boolean {
    return this.sess.done;
  }
  activeBeatId(): string {
    return this.sess.activeBeatId();
  }
  /** The agent is authoring — the active leaf is the ephemeral `__ask-*` thinking beat. */
  get thinking(): boolean {
    return this.sess.activeBeatId().startsWith(THINKING_PREFIX);
  }

  /** The full per-frame output: render model + conversation + done/thinking flags + the
   *  director's attention/pacing state (read off the reserved `ctx.vars` keys — so it works
   *  on every beat, with no beat cooperation and no new event route). */
  frame(): LiveFrame {
    const vars = this.sess.context.vars;
    return {
      model: this.render(),
      transcript: this.transcript(),
      activeBeatId: this.sess.activeBeatId(),
      narration: this.activeNarration(),
      done: this.sess.done,
      thinking: this.thinking,
      focus: (vars[FOCUS_VAR] as unknown as FocusState | undefined) ?? null,
      annotations: (vars[ANNOTATIONS_VAR] as unknown as Annotation[] | undefined) ?? [],
      hold: (vars[HOLD_VAR] as unknown as HoldState | undefined) ?? null,
    };
  }

  /** Passthrough to the Session's render model for the shared workspace. */
  render(): RenderModel {
    return this.sess.render();
  }

  /** Render any beat's visual WITHOUT moving the machine — so a renderer can persist each
   *  authored step's figure inline in the conversation (past steps → `autoplay:false`, a
   *  static final frame). Pure passthrough to the Session; layering stays clockless. */
  renderBeat(beatId: string, opts?: { autoplay?: boolean }): RenderModel {
    return this.sess.renderBeat(beatId, opts);
  }

  /** The active beat's spoken-narration string (a plain param), or undefined. No audio here —
   *  a renderer decides whether/how to voice it; the live layer never touches a clock or sink. */
  private activeNarration(): string | undefined {
    const meta = this.sess.lesson.chart.states[this.sess.activeBeatId()]?.meta as
      | { beat?: { params?: { narration?: unknown } } }
      | undefined;
    const n = meta?.beat?.params?.narration;
    return typeof n === "string" && n.trim() ? n : undefined;
  }

  /** The unified conversation log — a pure projection of the session's event history.
   *  Memoized by (history length, active beat), both of which change on any transition. */
  transcript(): Turn[] {
    const history = this.sess.context.history;
    const active = this.sess.activeBeatId();
    if (this.trCache && this.trCache.len === history.length && this.trCache.active === active) return this.trCache.turns;
    const turns = projectTranscript(this.sess.lesson, history, active);
    this.trCache = { len: history.length, active, turns };
    return turns;
  }

  /** A player's move. Learner text (`message.submit`), an answer, a control fiddle, or the
   *  agent's `direction.command` — all go through the one Session dispatch. */
  send = (e: MachineEvent): void => {
    this.sess.send(e);
  };

  subscribe(fn: (f: LiveFrame) => void): () => void {
    this.subscribers.add(fn);
    fn(this.frame());
    return () => this.subscribers.delete(fn);
  }

  dispose(): void {
    this.detachSession?.();
    this.detachSession = undefined;
    this.subscribers.clear();
  }

  private emit(): void {
    if (!this.subscribers.size) return;
    const f = this.frame();
    for (const fn of this.subscribers) fn(f);
  }
}

export function createLiveProgram(session: Session): LiveProgram {
  return new LiveProgram(session);
}
