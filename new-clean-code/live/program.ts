// LiveProgram: the live layer's host. It COMPOSES a lesson Session (the SM host) and
// owns nothing "video" — no clock, no transport, no gates, no caption, no audio, no
// spine/back-forward trail. Learner and agent are both players emitting events; the
// agent may author the environment (add/reroute beats) at play time. A "frame" is the
// current render model + the unified conversation + two flags (done, thinking).
//
// The single sync point is `sess.subscribe`: EVERY committed step — a learner send, an
// agent authoring command, or an effect-driven re-entry (a resolved `generate` splicing
// the answer beat, a timer, a SignalSource) — flows through the Session's own notify,
// so one observer drives every frame. `send()` therefore does NOT emit itself (that
// would double-fire); it just forwards to the Session and lets the observer react.
//
// Layering: live → { lesson (Session host), render_contract, state_machine }. Nothing
// here depends on a renderer, the clock, or the timeline.

import type { MachineEvent } from "@lessonstudio/state-machine";
import type { RenderModel } from "@lessonstudio/render-contract";
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

/** Active-leaf prefix marking the synthesized "thinking" beat (see Session.applyMessage). */
const THINKING_PREFIX = "__ask-";

export class LiveProgram {
  private readonly subscribers = new Set<(f: LiveFrame) => void>();
  private detachSession?: () => void;
  /** transcript() memo — history is append-only, so (length, activeBeat) is a sound key. */
  private trCache: { len: number; active: string; turns: Turn[] } | null = null;

  constructor(private readonly sess: Session) {
    // One observer for the whole live loop: caller sends AND effect-driven re-entries
    // (the agent's answer resolving, a timer) both re-enter through the Session's notify,
    // so subscribing once here is the only sync a clockless host needs.
    this.detachSession = this.sess.subscribe(() => this.emit());
  }

  // ── public API ─────────────────────────────────────────────────────────────

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
   *  agent's `workspace.set` / `authoring.command` — all go through the one Session dispatch. */
  send = (e: MachineEvent): void => {
    this.sess.send(e);
    // No emit here: the Session's notify (via `subscribe`) fires the frame, covering both
    // this call and any effect-driven re-entry it triggers. Emitting here would double-fire.
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

  // ── internals ────────────────────────────────────────────────────────────────

  private emit(): void {
    if (!this.subscribers.size) return;
    const f = this.frame();
    for (const fn of this.subscribers) fn(f);
  }
}

export function createLiveProgram(session: Session): LiveProgram {
  return new LiveProgram(session);
}
