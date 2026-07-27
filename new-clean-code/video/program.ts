// VideoProgram: the video layer. It COMPOSES a lesson Session (the SM host) and
// owns everything "video": the single authoritative clock (beat time t), the
// transport (play/pause/seek/restart), per-frame assembly with a PERSISTENT stage
// (so visuals never blank on gates), gate-cue pausing, the caption track, and the
// audio channel. It imports NO template/DOM — hosts render VideoFrame + transport.
//
// Layering: video → { lesson (Session host), timeline, audio, render_contract,
// state_machine }. Nothing here depends on a renderer.

import type { MachineEvent, Transition } from "@lessonkit/state-machine";
import type { RenderIntent, RenderModel } from "@lessonkit/render-contract";
import {
  activeGate,
  cuesUpTo,
  sampleAt,
  sceneIntent,
  vizIntent,
  type Storyboard,
} from "@lessonkit/timeline";
import { activeCaption, type AudioManifest, type AudioSink, type CaptionSegment } from "@lessonkit/audio";
import { restoreSession, type Session } from "@lessonkit/lesson";
import { createAudioChannel, type AudioChannel } from "./audio.js";
import type { CaptionTrack, VideoFrame } from "./render_model.js";
import type { TimelineEntry, TransportState } from "./transport.js";
import { projectTranscript, type Turn } from "./transcript.js";

type Snapshot = ReturnType<Session["toSnapshot"]>;

export interface VideoProgramOptions {
  /** frame source for play(); returns a cancel fn. Inject for tests; defaults to rAF. */
  raf?: (cb: (dtMs: number) => void) => () => void;
  /** event that advances the SM at storyboard end (default "next"). */
  advanceEvent?: MachineEvent;
  /** prepared narration audio, keyed by beat id. */
  audio?: AudioManifest;
  /** caption segments per beat (word-highlight), keyed by beat id. */
  captions?: Record<string, CaptionSegment[]>;
  /** where audio plays; inject htmlAudioSink/speechSink in the browser. */
  audioSink?: AudioSink;
  /** which slot the persistent visual lives in (default "stage"). */
  stageSlot?: string;
}

interface BeatRef {
  type: string;
  params: Record<string, unknown>;
}

export class VideoProgram {
  private t = 0;
  private rate = 1;
  private playing = false;
  private cancel?: () => void;
  private lastStage: RenderIntent[] | null = null;
  private readonly resolvedGates = new Set<string>();
  /** live-visited beat snapshots (carry real recorded answers). */
  private readonly snapshots = new Map<string, Snapshot>();
  /** precomputed default-path snapshots so forward-seek is O(1) (see buildSpineSnapshots). */
  private readonly spineSnapshots = new Map<string, Snapshot>();
  private readonly initialSnapshot: Snapshot;
  /** storyboard() is memoized per active beat — it's re-derived only on beat change. */
  private sbCache: { id: string; sb: Storyboard | null } | null = null;
  private readonly subscribers = new Set<(f: VideoFrame) => void>();
  private readonly audioChannel: AudioChannel | null;
  private readonly stageSlot: string;
  private readonly spine: TimelineEntry[];
  private readonly spineStart = new Map<string, number>();
  private readonly estimatedTotal: number;
  private lastGlobal = 0;
  /** Beat-visit order + a cursor into it, for learner-paced Back/Next revisiting.
   *  (The global-time scrubber can't distinguish untimed explorable beats, which all
   *  sit at global time 0.) Forward progress truncates any "future" and appends. */
  private visited: string[] = [];
  private cursor = 0;
  /** True while we're driving sess.send() ourselves — suppresses the step-observer
   *  so our own send()/tick() (which already record + emit) don't double-fire. */
  private driving = false;
  private detachSession?: () => void;
  /** transcript() memo — history is append-only, so (length, activeBeat) is a sound key. */
  private trCache: { len: number; active: string; turns: Turn[] } | null = null;

  constructor(
    private readonly sess: Session,
    private readonly opts: VideoProgramOptions = {},
  ) {
    this.stageSlot = opts.stageSlot ?? "stage";
    this.audioChannel = opts.audioSink ? createAudioChannel(opts.audioSink, opts.audio ?? {}) : null;
    this.initialSnapshot = sess.toSnapshot();

    // Precompute the timed spine (default-next path) for progress estimates.
    this.spine = this.buildSpine();
    let acc = 0;
    for (const e of this.spine) {
      this.spineStart.set(e.beatId, acc);
      acc += e.duration;
    }
    this.estimatedTotal = acc;

    this.buildSpineSnapshots();
    this.captureSnapshot();
    this.visited = [this.sess.activeBeatId()];
    this.audioChannel?.reconcile(this.computeTransport(this.storyboard()), true);

    // Observe effect-driven transitions (a resolved `generate`, a `timer`, a
    // SignalSource) that re-enter through the Session's own send — bypassing our
    // send()/tick(). Without this the agent's background output would mutate the
    // Session invisibly and the frame would freeze on the "thinking" placeholder.
    this.detachSession = this.sess.subscribe(() => this.onSessionStep());
  }

  // ── public API ─────────────────────────────────────────────────────────────

  get session(): Session {
    return this.sess;
  }
  get time(): number {
    return this.t;
  }
  get done(): boolean {
    return this.sess.done;
  }
  get transport(): TransportState {
    return this.computeTransport(this.storyboard());
  }

  /** The full per-frame output: model (stage/prompt/prose) + caption + transport. */
  frame(): VideoFrame {
    const sb = this.storyboard();
    return { model: this.assembleModel(sb), caption: this.captionNow(), transport: this.computeTransport(sb) };
  }

  timeline(): TimelineEntry[] {
    return this.spine.slice();
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

  subscribe(fn: (f: VideoFrame) => void): () => void {
    this.subscribers.add(fn);
    fn(this.frame());
    return () => this.subscribers.delete(fn);
  }

  /** Advance beat time by dt (ms). Pauses at gate cues; advances the SM at end. */
  tick(dt: number): void {
    const sb = this.storyboard();
    if (!sb) return; // non-timed beat: waits for external events (gate/explain)

    const gateBefore = this.pendingGate(sb, this.t);
    if (gateBefore) { this.t = gateBefore.at; this.setPaused(); this.emit(); return; }

    this.t += dt * this.rate;

    const gateAfter = this.pendingGate(sb, this.t);
    if (gateAfter) { this.t = gateAfter.at; this.setPaused(); this.emit(); return; }

    if (this.t >= sb.duration) {
      this.t = sb.duration; // hold the final frame
      const prev = this.sess.activeBeatId();
      this.driving = true;
      try {
        this.sess.send(this.opts.advanceEvent ?? { type: "next" });
      } finally {
        this.driving = false;
      }
      const now = this.sess.activeBeatId();
      if (now !== prev) {
        this.t = 0; // moved to a new beat
        this.recordForward(prev);
      } // else terminal / unhandled: hold at duration
      this.reconcile(true);
    }
    this.emit();
  }

  /** Jump within the current beat (clamped; cannot cross an unsatisfied gate). */
  seekInBeat(t: number): void {
    const sb = this.storyboard();
    const max = sb ? sb.duration : 0;
    let target = t < 0 ? 0 : t > max ? max : t;
    if (sb) {
      const gate = this.firstUnresolvedGateAfter(sb, 0);
      if (gate && target > gate.at) target = gate.at;
    }
    this.t = target;
    this.reconcile(true);
    this.emit();
  }

  /**
   * Seek across beats by global time (ms). O(1) in BOTH directions: the target
   * beat's snapshot comes from the live-visited map (real recorded answers, wins)
   * or the precomputed default-path map. Past the end clamps to the last beat.
   */
  seek(globalMs: number): void {
    const target =
      this.spine.find((e) => globalMs >= this.spineStart.get(e.beatId)! && globalMs < this.spineStart.get(e.beatId)! + e.duration) ??
      this.spine[this.spine.length - 1];
    if (!target) {
      this.seekInBeat(globalMs);
      return;
    }
    const snap = this.snapshots.get(target.beatId) ?? this.spineSnapshots.get(target.beatId);
    if (snap) {
      this.sess.loadSnapshot(snap);
      this.sbCache = null; // beat position changed
      this.lastStage = null; // invalidate cached stage from the old position
      this.seekInBeat(globalMs - this.spineStart.get(target.beatId)!);
      return;
    }
    // A detour beat (never on the spine) has no precomputed snapshot.
    if (typeof console !== "undefined") console.warn(`[lessonkit] seek: no snapshot for beat "${target.beatId}" (detour?)`);
    this.seekInBeat(globalMs - (this.spineStart.get(this.sess.activeBeatId()) ?? 0));
  }

  send = (e: MachineEvent): void => {
    // Release an in-storyboard gate whose event just arrived, then resume.
    const t = this.transport;
    const prevBeat = this.sess.activeBeatId();
    this.driving = true;
    try {
      this.sess.send(e);
    } finally {
      this.driving = false;
    }
    this.sbCache = null; // context may have changed (answer recorded, beat advanced)
    if (t.atGate && t.gateEvent && e.type === t.gateEvent) {
      this.resolvedGates.add(t.gateEvent);
      if (this.playing) this.arm();
    }
    this.recordForward(prevBeat);
    this.reconcile(true);
    this.emit();
  };

  play(): void {
    this.playing = true;
    this.arm();
    this.reconcile();
    this.emit();
  }
  pause(): void {
    this.playing = false;
    this.disarm();
    this.reconcile();
    this.emit();
  }
  toggle(): void {
    this.playing ? this.pause() : this.play();
  }
  setRate(rate: number): void {
    this.rate = rate;
    this.opts.audioSink?.setRate?.(rate);
    this.emit();
  }

  restart(): void {
    this.disarm();
    this.playing = false;
    this.resolvedGates.clear();
    this.lastStage = null;
    this.sbCache = null;
    this.snapshots.clear(); // spineSnapshots are spine-derived & immutable — kept
    this.sess.loadSnapshot(this.initialSnapshot);
    this.t = 0;
    this.captureSnapshot();
    this.visited = [this.sess.activeBeatId()];
    this.cursor = 0;
    this.reconcile(true);
    this.emit();
  }

  // ── learner-paced beat navigation (revisit) ────────────────────────────────
  /** The beats visited so far, in order (for a host to render a clickable trail). */
  visitedBeats(): string[] {
    return this.visited.slice();
  }
  canBack(): boolean {
    return this.cursor > 0;
  }
  canForward(): boolean {
    return this.cursor < this.visited.length - 1;
  }
  /** Step to the previously-visited beat, restoring its state. Pauses playback. */
  back(): void {
    if (this.cursor > 0) this.goToIndex(this.cursor - 1);
  }
  /** Step forward again along the visited trail (after a Back). */
  forward(): void {
    if (this.cursor < this.visited.length - 1) this.goToIndex(this.cursor + 1);
  }
  /** Jump to any already-visited beat by id (e.g. clicking its section). */
  goToBeat(beatId: string): void {
    const idx = this.visited.indexOf(beatId);
    if (idx >= 0) this.goToIndex(idx);
  }

  dispose(): void {
    this.disarm();
    this.detachSession?.();
    this.detachSession = undefined;
    this.audioChannel?.dispose();
    this.subscribers.clear();
  }

  // ── internals ───────────────────────────────────────────────────────────────

  private beatRef(): BeatRef | null {
    const id = this.sess.activeBeatId();
    const meta = this.sess.lesson.chart.states[id]?.meta as { beat?: BeatRef } | undefined;
    return meta?.beat ?? null;
  }

  private storyboard(): Storyboard | null {
    // Memoized by active beat: a beat's storyboard is param-derived and stable
    // for the beat's lifetime, so we build it once instead of ~3×/frame. Cleared
    // on send()/seek/restart (context mutations that could change it).
    const id = this.sess.activeBeatId();
    if (this.sbCache && this.sbCache.id === id) return this.sbCache.sb;
    const ref = this.beatRef();
    let sb: Storyboard | null = null;
    if (ref) {
      const def = this.sess.lesson.beats[ref.type];
      if (def?.storyboard) sb = def.storyboard(ref.params, id, this.sess.context);
    }
    this.sbCache = { id, sb };
    return sb;
  }

  /** stage/prompt/prose intents, with the last scene retained across gates. */
  private assembleModel(sb: Storyboard | null): RenderModel {
    let current: RenderIntent[];
    if (sb) {
      const slot = (this.beatRef()?.params.slot as string) ?? this.stageSlot;
      const stage = sb.viz ? vizIntent(slot, sb.viz.name, sb.viz.props, this.t) : sceneIntent(slot, sampleAt(sb, this.t));
      current = [stage];
      for (const c of cuesUpTo(sb, this.t)) if (c.kind === "reveal") current.push(c.intent);
    } else {
      current = this.sess.render().intents;
    }
    const hasStage = current.some((i) => i.slot === this.stageSlot);
    if (hasStage) {
      this.lastStage = current.filter((i) => i.slot === this.stageSlot); // update cache
      return { intents: current };
    }
    // No stage content this beat (a gate) → backfill the frozen last scene.
    return { intents: this.lastStage ? [...current, ...this.lastStage] : current };
  }

  private captionNow(): CaptionTrack | null {
    const segs = this.opts.captions?.[this.sess.activeBeatId()];
    if (!segs) return null;
    const cap = activeCaption(segs, this.t);
    return cap ? { text: cap.text, words: cap.words, active: cap.active } : null;
  }

  private computeTransport(sb: Storyboard | null): TransportState {
    const beatId = this.sess.activeBeatId();
    const beatDuration = sb?.duration ?? 0;
    const start = this.spineStart.get(beatId);
    const globalTime = start != null ? start + this.t : this.lastGlobal;
    if (start != null) this.lastGlobal = globalTime;
    const gate = sb ? this.pendingGate(sb, this.t) : null;
    return {
      playing: this.playing,
      beatId,
      tInBeat: this.t,
      beatDuration,
      progress: beatDuration > 0 ? Math.min(1, this.t / beatDuration) : this.sess.done ? 1 : 0,
      globalTime,
      estimatedTotal: this.estimatedTotal,
      done: this.sess.done,
      timed: !!sb,
      atGate: !!gate,
      gateEvent: gate?.event ?? null,
      rate: this.rate,
    };
  }

  private pendingGate(sb: Storyboard, t: number): { at: number; event: string } | null {
    const g = activeGate(sb, t);
    return g && !this.resolvedGates.has(g.event) ? { at: g.at, event: g.event } : null;
  }
  private firstUnresolvedGateAfter(sb: Storyboard, from: number): { at: number; event: string } | null {
    for (const c of sb.cues ?? []) {
      if (c.kind === "gate" && c.at >= from && !this.resolvedGates.has(c.event)) return { at: c.at, event: c.event };
    }
    return null;
  }

  private captureSnapshot(): void {
    const id = this.sess.activeBeatId();
    if (!this.snapshots.has(id)) this.snapshots.set(id, this.sess.toSnapshot());
  }

  /** Record a forward beat change: snapshot the new beat, drop any "future" beats
   *  past the cursor (we branched), and append. No-op if the beat didn't change. */
  private recordForward(prevBeat: string): void {
    const now = this.sess.activeBeatId();
    if (now === prevBeat) return;
    this.captureSnapshot();
    this.visited = this.visited.slice(0, this.cursor + 1);
    this.visited.push(now);
    this.cursor = this.visited.length - 1;
  }

  /**
   * The Session transitioned outside our own send()/tick() — an effect-driven
   * re-entry (a resolved `generate` splicing a beat, a `timer`, a SignalSource). Sync
   * the video: fold a new beat into the visited trail (resetting the beat clock),
   * reconcile audio, and emit. A same-beat change (e.g. an agent `workspace.set` that
   * self-transitions to re-render the viz) just invalidates caches and re-emits.
   * Guarded by `driving` so our own send()/tick() don't double-record or double-emit.
   */
  private onSessionStep(): void {
    if (this.driving) return;
    const prevBeat = this.visited[this.cursor] ?? this.sess.activeBeatId();
    const now = this.sess.activeBeatId();
    this.sbCache = null; // beat and/or context changed
    if (now !== prevBeat) {
      this.t = 0; // entered a new beat — reset the clock (keep the frozen stage)
      this.recordForward(prevBeat);
    }
    this.reconcile(true);
    this.emit();
  }

  /** Move the cursor to a visited index and restore that beat's snapshot. */
  private goToIndex(idx: number): void {
    const id = this.visited[idx];
    if (id == null || idx === this.cursor) return;
    const snap = this.snapshots.get(id) ?? this.spineSnapshots.get(id);
    if (!snap) return; // nothing to restore to — leave as-is
    this.playing = false;
    this.disarm();
    this.cursor = idx;
    this.sess.loadSnapshot(snap);
    this.sbCache = null;
    this.lastStage = null; // the frozen stage came from the beat we're leaving
    this.t = 0;
    this.reconcile(true);
    this.emit();
  }

  private reconcile(force = false): void {
    this.audioChannel?.reconcile(this.computeTransport(this.storyboard()), force);
  }
  private setPaused(): void {
    this.playing = false;
    this.disarm();
    this.reconcile();
  }
  private arm(): void {
    if (this.cancel) return;
    const raf = this.opts.raf ?? defaultRaf();
    this.cancel = raf((dt) => this.tick(dt));
  }
  private disarm(): void {
    this.cancel?.();
    this.cancel = undefined;
  }
  private emit(): void {
    if (!this.subscribers.size) return;
    const f = this.frame();
    for (const fn of this.subscribers) fn(f);
  }

  /** Walk the default-next spine, resolving timed-beat durations. */
  private buildSpine(): TimelineEntry[] {
    const out: TimelineEntry[] = [];
    const seen = new Set<string>();
    let id: string | null = this.sess.lesson.chart.initial;
    let acc = 0;
    while (id && !seen.has(id)) {
      seen.add(id);
      const meta = this.sess.lesson.chart.states[id]?.meta as { beat?: BeatRef } | undefined;
      const ref = meta?.beat;
      const def = ref ? this.sess.lesson.beats[ref.type] : undefined;
      const sb = def?.storyboard ? def.storyboard(ref!.params, id, this.sess.context) : null;
      const duration = sb?.duration ?? 0;
      out.push({ beatId: id, startGlobal: acc, duration, timed: !!sb });
      acc += duration;
      // Default-next = the first UNGUARDED transition. Guarded edges are
      // wrong-answer/timeout detours (e.g. mcq/freeResponse `onWrong`) which the
      // compiler pushes FIRST; taking [0] blindly would walk into the detour and
      // corrupt the spine (chapters/progress/estimatedTotal) for gated lessons.
      const next: Transition[] | undefined = this.sess.lesson.chart.states[id]?.on?.next;
      id = next?.find((t) => t.guard == null)?.target ?? null;
    }
    return out;
  }

  /**
   * Precompute a snapshot at each default-path beat so forward-seek to an
   * un-visited beat is O(1). Walks a THROWAWAY replay session (no-op runner, no
   * policies/timers) so nothing effectful fires and the live session is untouched.
   * A bare advance event at an unanswered gate resolves to the unguarded spine
   * target, so this crosses gates WITHOUT fabricating an answer or bumping score —
   * the correct seek semantics ("arrived here along the default path"). Live-visited
   * snapshots (with real answers) always win in seek(). Degrades on any throw.
   */
  private buildSpineSnapshots(): void {
    try {
      const replay = restoreSession(this.sess.lesson, this.initialSnapshot);
      const advance = this.opts.advanceEvent ?? { type: "next" };
      const seen = new Set<string>();
      for (;;) {
        const id = replay.activeBeatId();
        if (seen.has(id)) break; // cycle guard
        seen.add(id);
        if (!this.spineSnapshots.has(id)) this.spineSnapshots.set(id, replay.toSnapshot());
        if (replay.done) break;
        replay.send(advance);
        if (replay.activeBeatId() === id) break; // unhandled / terminal → no move
      }
      replay.dispose();
    } catch {
      // leave spineSnapshots partially populated; seek degrades, never crashes.
    }
  }
}

export function createVideoProgram(session: Session, opts?: VideoProgramOptions): VideoProgram {
  return new VideoProgram(session, opts);
}

/** Browser rAF loop computing per-frame deltas. No-op outside the browser. */
function defaultRaf(): (cb: (dtMs: number) => void) => () => void {
  return (cb) => {
    const raf = (globalThis as { requestAnimationFrame?: (f: FrameRequestCallback) => number }).requestAnimationFrame;
    const caf = (globalThis as { cancelAnimationFrame?: (h: number) => void }).cancelAnimationFrame;
    if (!raf) return () => {};
    let handle = 0;
    let last: number | null = null;
    let cancelled = false;
    const loop = (ts: number) => {
      if (cancelled) return;
      const dt = last == null ? 16 : ts - last;
      last = ts;
      cb(dt);
      // Re-check AFTER cb: the tick may have disarmed us (e.g. auto-pause at a
      // gate). Rescheduling unconditionally here was the bug that kept the loop
      // — and setState — running at 60fps while paused.
      if (!cancelled) handle = raf(loop);
    };
    handle = raf(loop);
    return () => {
      cancelled = true;
      caf?.(handle);
    };
  };
}
