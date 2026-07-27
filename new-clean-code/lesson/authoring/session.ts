// Session: the one stateful object — the boundary between the pure engine and
// the effectful world. It drives the pure interpreter, owns history, runs
// effects (with cancellation), and consults policies. React (or any view) reads
// render() and calls send().

import {
  enter,
  restore,
  snapshot,
  start,
  transition,
  type Effect,
  type Json,
  type MachineEvent,
  type Snapshot,
  type StateNode,
  type Step,
  type TransitionRecord,
} from "@lessonkit/state-machine";
import type { RenderIntent, RenderModel } from "@lessonkit/render-contract";
import { leafState, type RenderableBeat } from "../beats/index.js";
import { lowerBeat, reachesTerminal, validateBeatSpec, validateReroute, CompileError, type BeatSpec, type CompiledLesson } from "../lesson_sm/compile.js";
import { initialContext, type EventRecord, type LearnerRuntime, type LessonContext } from "../lesson_sm/context.js";
import type { LearnerModel } from "../policy/contracts.js";
import { AUTHORING_COMMAND_EVENT, assertNoInlineFns, normalizeCommands, rerouteOf, type AuthoringCommand } from "./commands.js";

/**
 * The event that carries a runtime-authored beat (its `BeatSpec` is the payload).
 * Session intercepts it: splice the beat into the live chart, then jump into it.
 * Because the spec rides in the event, it lands in history and is re-created on
 * replay WITHOUT re-invoking the generator — the "generate → freeze → replay" line.
 * It is now a legacy alias for an `addBeat` authoring command (see commands.ts).
 */
export const GENERATED_BEAT_EVENT = "beat.generated";

/**
 * The learner's say-anytime / interrupt move. Ambient: the flat engine has no route
 * for it (the active beat may not declare `message.submit`), so Session intercepts it
 * in `apply()` before `transition()`. It records the learner turn, enters a synthesized
 * ephemeral "thinking" leaf that clones the interrupted beat's viz (so the shared
 * workspace never blanks), and fires a `generate` effect to author the answer — while
 * the leaf change cancels any in-flight generation (that is the interrupt, for free).
 */
export const MESSAGE_SUBMIT_EVENT = "message.submit";

/** Build a `message.submit` event carrying the learner's free-text message. */
export function messageSubmit(textValue: string): MachineEvent {
  return { type: MESSAGE_SUBMIT_EVENT, payload: { text: textValue } };
}

// ── pluggable collaborators ──────────────────────────────────────────────────

export interface EffectContext {
  /** aborted when the state that spawned this effect is exited. */
  signal: AbortSignal;
  send: (event: MachineEvent) => void;
  ctx: LessonContext;
}
export interface EffectRunner {
  run(effect: Effect, ec: EffectContext): void | Promise<void>;
}

/** Pull-based: observes each settled step, may inject events (e.g. derived signals). */
export interface Policy {
  observe(step: Step<LessonContext>, lesson: CompiledLesson): MachineEvent[];
}

/** Push-based: external adapter (gaze/LLM watcher) that emits semantic events anytime. */
export interface SignalSource {
  attach(send: (event: MachineEvent) => void): () => void; // returns detach
}

/** Passive per-step observer. MUST NOT re-enter send() synchronously. */
export type StepObserver = (step: Step<LessonContext>) => void;

export interface SessionOptions {
  vars?: Record<string, Json>;
  runner?: EffectRunner;
  policies?: Policy[];
  signalSources?: SignalSource[];
  onPersist?: (payload: Json) => void;
  /** Observe every committed step (incl. effect-driven ones). See `subscribe`. */
  onStep?: StepObserver;
  /**
   * Perceive policy. When set, its pure fold runs on every committed transition and
   * writes `ctx.learner` — so `replay` reconstructs the learner read for free. Omit
   * for the plain video path (leaves `ctx.learner` undefined, zero behavior change).
   */
  learnerModel?: LearnerModel;
}

/** Default runner: handles `timer` (cancellable) and `persist`. Custom effects need a custom runner. */
export function defaultRunner(onPersist?: (payload: Json) => void): EffectRunner {
  return {
    run(effect, ec) {
      if (effect.kind === "timer") {
        const e = effect as { ms: number; emit: MachineEvent };
        const id = setTimeout(() => {
          if (!ec.signal.aborted) ec.send(e.emit);
        }, e.ms);
        ec.signal.addEventListener("abort", () => clearTimeout(id));
      } else if (effect.kind === "persist") {
        onPersist?.((effect as { payload: Json }).payload);
      }
    },
  };
}

// ── Session ──────────────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

interface InFlight {
  stateKey: string;
  controller: AbortController;
}

export class Session {
  private step: Step<LessonContext>;
  private inFlight: InFlight[] = [];
  private detaches: Array<() => void> = [];
  private readonly runner: EffectRunner;
  private readonly policies: Policy[];
  private readonly learnerModel?: LearnerModel;
  private readonly observers = new Set<StepObserver>();

  constructor(
    readonly lesson: CompiledLesson,
    opts: SessionOptions = {},
  ) {
    this.runner = opts.runner ?? defaultRunner(opts.onPersist);
    this.policies = opts.policies ?? [];
    this.learnerModel = opts.learnerModel;
    if (opts.onStep) this.observers.add(opts.onStep);

    this.step = start(lesson.chart, initialContext(opts.vars), lesson.registry);
    this.markActiveBeat();
    this.seedLearner();
    this.runEffects(this.step.effects);
    this.consultPolicies();

    for (const src of opts.signalSources ?? []) {
      this.detaches.push(src.attach((e) => this.send(e)));
    }
  }

  // ── public API ───────────────────────────────────────────────────────────

  get done(): boolean {
    return this.step.done;
  }
  get context(): LessonContext {
    return this.step.context;
  }
  activeBeatId(): string {
    const s = this.step.state;
    return typeof s === "string" ? s : Object.keys(s)[0]!;
  }

  send = (event: MachineEvent): void => {
    this.apply(event, /* fromPolicy */ false);
  };

  /**
   * Observe every committed step — including effect-driven ones (a resolved
   * `generate` → `beat.generated`, a `timer`, a SignalSource) that re-enter via the
   * runner's `send` rather than a caller's. The video layer subscribes here so those
   * async transitions drive a frame; without it they'd mutate the Session invisibly.
   * Passive: an observer must NOT call `send()` synchronously (re-entrancy). Returns
   * a detach fn. Does not fire on subscribe — call `render()`/`activeBeatId()` for the
   * current state.
   */
  subscribe(fn: StepObserver): () => void {
    this.observers.add(fn);
    return () => this.observers.delete(fn);
  }

  render(): RenderModel {
    const id = this.activeBeatId();
    const node = this.lesson.chart.states[id];
    const meta = node?.meta as { beat?: { type: string; params: Json } } | undefined;
    const beat = meta?.beat;
    if (!beat) return { intents: [] };
    const def = this.lesson.beats[beat.type] as RenderableBeat | undefined;
    if (!def) return { intents: [] };
    return { intents: def.render(beat.params, leafState(this.step.state, id), this.context) };
  }

  /**
   * Render ANY beat in the live chart as if it were active, WITHOUT moving the machine.
   * The clockless studio uses this to persist each authored step's visual INLINE in the
   * conversation: a past step re-derives its own figure from its own (pure) leaf state.
   * `__activeBeat` is overridden to `beatId` so the beat's render() locates the RIGHT leaf
   * state; the live context/step is untouched. `opts.autoplay:false` is threaded into any
   * `viz` intent's props so a self-animating viz paints its FINAL frame (only the ACTIVE
   * step animates). Returns an empty model for an unknown or type-less beat.
   */
  renderBeat(beatId: string, opts?: { autoplay?: boolean }): RenderModel {
    const meta = this.lesson.chart.states[beatId]?.meta as { beat?: { type: string; params: Json } } | undefined;
    const beat = meta?.beat;
    if (!beat) return { intents: [] };
    const def = this.lesson.beats[beat.type] as RenderableBeat | undefined;
    if (!def) return { intents: [] };
    const ctx: LessonContext = { ...this.context, vars: { ...this.context.vars, __activeBeat: beatId } };
    const intents = def.render(beat.params, leafState(this.step.state, beatId), ctx);
    if (opts?.autoplay === false) {
      return {
        intents: intents.map((i) => {
          if (i.kind !== "viz") return i;
          const props = (i as { props?: Record<string, unknown> }).props ?? {};
          return { ...i, props: { ...props, autoplay: false } } as RenderIntent;
        }),
      };
    }
    return { intents };
  }

  /** O(1) capture of the live position. */
  toSnapshot(): Snapshot<LessonContext> {
    return snapshot(this.lesson.chart, this.step);
  }
  /** O(1) restore (no replay). Cancels in-flight effects. */
  loadSnapshot(snap: Snapshot<LessonContext>): void {
    this.cancelAll();
    this.step = restore(this.lesson.chart, snap);
    this.markActiveBeat();
  }

  /** Detach signal sources + cancel effects. Call when tearing down. */
  dispose(): void {
    this.detaches.forEach((d) => d());
    this.detaches = [];
    this.observers.clear();
    this.cancelAll();
  }

  /**
   * Compile ONE runtime-authored (e.g. LLM-generated) beat into the live chart +
   * registry. Idempotent and additive — an existing beat is never rewritten, so the
   * spine and any other Session sharing this CompiledLesson are unaffected. Throws
   * on a malformed spec (unknown type / dangling target / no id) — LLM output is the
   * untrusted-input case, so it fails loudly rather than corrupting the chart.
   */
  spliceBeat(spec: BeatSpec): void {
    if (!spec || typeof spec.id !== "string" || !spec.id) throw new Error("spliceBeat: generated beat has no id");
    if (this.lesson.chart.states[spec.id]) return; // already present → idempotent (replay-safe)
    const problems = validateBeatSpec(spec, this.lesson.beats, this.lesson.chart);
    if (problems.length) throw new CompileError(problems);
    this.lesson.chart.states[spec.id] = lowerBeat(spec, this.lesson.beats[spec.type]!, this.lesson.registry, spec.next ?? null);
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private apply(event: MachineEvent, fromPolicy: boolean): void {
    // Ambient / meta moves the flat engine can't route are intercepted BEFORE the pure
    // transition() (which would silently drop them). Each records its own history entry.

    // Legacy alias: a bare BeatSpec payload → a single addBeat command (jump in).
    if (event.type === GENERATED_BEAT_EVENT && isPlainObject(event.payload)) {
      this.applyAuthoring(event, [{ op: "addBeat", spec: event.payload as unknown as BeatSpec, enter: true }], fromPolicy);
      return;
    }
    // The agent's structural action vocabulary (addBeat, …) — validated then committed.
    if (event.type === AUTHORING_COMMAND_EVENT) {
      const commands = normalizeCommands(event.payload);
      for (const c of commands) if (c.op === "addBeat") assertNoInlineFns(c.spec);
      this.applyAuthoring(event, commands, fromPolicy);
      return;
    }
    // The learner's say-anytime / interrupt move.
    if (event.type === MESSAGE_SUBMIT_EVENT) {
      this.applyMessage(event, fromPolicy);
      return;
    }

    const prev = this.step;
    const next = transition(this.lesson.chart, prev, event, this.lesson.registry);
    if (next === prev) return; // unhandled — ignored by the engine

    // Session owns history: append a sequenced record for the edge just taken.
    let ctx = next.context;
    let appended: EventRecord | null = null;
    if (next.lastRecord) {
      appended = { seq: ctx.history.length, ...next.lastRecord };
      ctx = { ...ctx, history: [...ctx.history, appended] };
    }
    this.step = { ...next, context: ctx };
    this.markActiveBeat();
    if (appended) this.foldLearner(appended);

    // Cancellation: effects don't outlive the state that spawned them.
    this.cancelStale();
    this.runEffects(this.step.effects);

    if (!fromPolicy) this.consultPolicies();
    this.notify();
  }

  /**
   * Execute an authoring turn (a list of commands): splice added beats, reroute existing
   * ones, optionally jump into a beat, and record the carrier event in history so replay
   * re-creates the same edits as data (no generator re-invocation). `addBeat` with
   * `enter !== false` jumps into the beat; with `enter:false` it is a topology-only edit
   * and we stay put. `rerouteBeat`/`setNext` rewrite an existing beat's edge.
   *
   * The turn is ATOMIC: every command is adjudicated (valid target, JSON-only, and the set
   * of reroutes must not soft-lock the learner) and, if ANY step is rejected, the chart is
   * rolled back to exactly its prior shape and the error rethrown — so a bad turn is a pure
   * no-op that never reaches history (replay-safe). On the live path the throw is caught by
   * `generatingRunner` (logged, learner unaffected); a direct send surfaces it to the caller.
   */
  private applyAuthoring(event: MachineEvent, commands: AuthoringCommand[], fromPolicy: boolean): void {
    const prev = this.step;
    let enterId: string | null = null;
    const addedIds: string[] = []; // beats this turn spliced (to remove on rollback)
    const savedEdges = new Map<string, StateNode["on"]>(); // pre-mutation `on` maps (to restore on rollback)
    try {
      for (const cmd of commands) {
        if (cmd.op === "addBeat") {
          const isNew = this.lesson.chart.states[cmd.spec.id] === undefined;
          this.spliceBeat(cmd.spec); // throws on a malformed spec (loud failure)
          if (isNew && this.lesson.chart.states[cmd.spec.id]) addedIds.push(cmd.spec.id);
          if (cmd.enter !== false) enterId = cmd.spec.id; // last requested-to-enter wins
          continue;
        }
        // rerouteBeat / setNext — rewrite an existing beat's edge (default the advance edge).
        const reroute = rerouteOf(cmd);
        if (!reroute) continue;
        const problems = validateReroute(reroute.beatId, reroute.target, this.lesson.chart);
        if (problems.length) throw new CompileError(problems);
        const node = this.lesson.chart.states[reroute.beatId]!;
        if (!savedEdges.has(reroute.beatId)) savedEdges.set(reroute.beatId, node.on); // save ONCE, pre-mutation
        // The rewritten edge is a single UNGUARDED transition (or [] = terminal). `next`
        // edges here carry no actions, so nothing is dropped; rewiring a guarded/branch
        // edge is out of scope for v1 (it would need named guard refs).
        node.on = { ...(node.on ?? {}), [reroute.key]: reroute.target === null ? [] : [{ target: reroute.target }] };
      }
      // Level-completable invariant: from where the learner LANDS after this turn, an ending
      // must still be reachable. Only checked when a reroute happened — `addBeat` is additive
      // (it can only add orphan nodes, which never strand the learner), so Slice 1's
      // add-and-jump answer path is untouched.
      if (savedEdges.size) {
        const landing = enterId ?? this.activeBeatId();
        if (!reachesTerminal(this.lesson.chart, landing)) {
          throw new CompileError([{ code: "NO_TERMINAL", detail: `reroute would strand the learner: no path from "${landing}" to an ending` }]);
        }
      }
    } catch (err) {
      for (const [id, on] of savedEdges) this.lesson.chart.states[id]!.on = on; // undo edge rewrites
      for (const id of addedIds) delete this.lesson.chart.states[id]; // undo splices
      throw err;
    }

    const base: Step<LessonContext> = enterId
      ? enter(this.lesson.chart, enterId, prev.context, this.lesson.registry, event)
      : { state: prev.state, context: prev.context, effects: [], done: prev.done };
    const record: TransitionRecord = { event, from: prev.state, to: base.state };
    const rec: EventRecord = { seq: base.context.history.length, ...record };
    this.step = { ...base, context: { ...base.context, history: [...base.context.history, rec] }, lastRecord: record };
    this.markActiveBeat();
    this.foldLearner(rec);

    this.cancelStale();
    this.runEffects(this.step.effects);
    if (!fromPolicy) this.consultPolicies();
    this.notify();
  }

  /**
   * The learner's say-anytime move. Records the turn, enters an ephemeral "thinking"
   * leaf that clones the interrupted beat's viz (so the shared workspace never blanks),
   * and fires a `generate` effect to author the answer (which resumes the interrupted
   * beat on Continue). Entering a NEW leaf makes any prior in-flight generation stale →
   * cancelled: that leaf change IS the interrupt, for free.
   */
  private applyMessage(event: MachineEvent, fromPolicy: boolean): void {
    const prev = this.step;
    // Anchor to the REAL beat. If a prior message already put us on a thinking leaf
    // (i.e. this message IS an interrupt), resume the beat that leaf stands in for —
    // never the ephemeral leaf itself, which would strand Continue on a dead node.
    const fromId = this.resumeTargetOf(this.activeBeatId());
    const question = String(((event.payload ?? {}) as { text?: string }).text ?? "").trim();
    // Deterministic ephemeral leaf id — history length is rebuilt identically on replay.
    const leafId = `__ask-${prev.context.history.length}`;
    this.spliceBeat(this.buildThinkingBeat(leafId, fromId));

    const entered = enter(this.lesson.chart, leafId, prev.context, this.lesson.registry, event);
    const record: TransitionRecord = { event, from: prev.state, to: entered.state };
    const rec: EventRecord = { seq: entered.context.history.length, ...record };
    this.step = { ...entered, context: { ...entered.context, history: [...entered.context.history, rec] }, lastRecord: record };
    this.markActiveBeat();
    this.foldLearner(rec);

    // Interrupt: the leaf just changed, so cancelStale aborts any prior generation.
    this.cancelStale();
    // Author the answer (same request shape as explorable.requestAsk). Built inline as a
    // plain Effect so Session doesn't import the authoring generate() helper (no cycle).
    const genEffect: Effect = { kind: "generate", intent: "answer", question, returnTo: fromId };
    this.runEffects([...this.step.effects, ...(question ? [genEffect] : [])]);
    if (!fromPolicy) this.consultPolicies();
    this.notify();
  }

  /**
   * Synthesize the ephemeral "thinking" leaf. Clones the interrupted beat's viz + the
   * learner's current control values + the agent's `__ws` patch, so the shared workspace
   * renders identically while the answer is authored; falls back to a prose leaf if the
   * interrupted beat has no viz. Marked `ephemeral` so the transcript skips it; `next`
   * resumes the interrupted beat. It also records `resumeTo` = that real beat in its
   * params, so a follow-up interrupt (which lands ON this leaf) can resolve back to the
   * real beat rather than chaining onto the leaf (see `resumeTargetOf`).
   */
  private buildThinkingBeat(leafId: string, fromId: string): BeatSpec {
    const meta = this.lesson.chart.states[fromId]?.meta as { beat?: { type: string; params: Record<string, unknown> } } | undefined;
    const fromBeat = meta?.beat;
    const stored = (this.step.context.beats[fromId] as Record<string, Json> | undefined) ?? {};
    if (fromBeat?.type === "explorable" && fromBeat.params && typeof fromBeat.params === "object") {
      const p = fromBeat.params as { viz?: { name?: string; props?: Record<string, unknown> }; defaults?: Record<string, unknown> };
      if (p.viz?.name) {
        const defaults = { ...(p.defaults ?? {}), ...stored }; // learner control values + agent __ws patch
        return {
          id: leafId,
          type: "explorable",
          params: { viz: { name: p.viz.name, props: { ...(p.viz.props ?? {}) } }, controls: [], defaults, note: "Thinking…", ephemeral: true, resumeTo: fromId } as unknown as Json,
          next: fromId,
        };
      }
    }
    return { id: leafId, type: "explain", params: { text: "Thinking…", ephemeral: true, resumeTo: fromId } as unknown as Json, next: fromId };
  }

  /**
   * Resolve a beat id to the real beat it stands for. For a normal beat that's itself;
   * for an ephemeral "thinking" leaf it's the `resumeTo` real beat stamped into its
   * params — so interrupting an in-flight answer re-anchors to the original beat, not
   * the transient leaf.
   */
  private resumeTargetOf(id: string): string {
    const beat = (this.lesson.chart.states[id]?.meta as { beat?: { params?: Record<string, unknown> } } | undefined)?.beat;
    const resumeTo = beat?.params?.resumeTo;
    return typeof resumeTo === "string" ? resumeTo : id;
  }

  /** Seed `ctx.learner` from the model's initial state (before any events). No-op if
   *  no learner model is configured. */
  private seedLearner(): void {
    const m = this.learnerModel;
    if (!m) return;
    const state = m.initial();
    const learner: LearnerRuntime = { model: m.name, state, signals: m.signals(state) };
    this.step = { ...this.step, context: { ...this.step.context, learner } };
  }

  /** Perceive: fold the just-committed record into `ctx.learner` (pure, replay-safe). */
  private foldLearner(rec: EventRecord): void {
    const m = this.learnerModel;
    if (!m) return;
    const ctx = this.step.context;
    const prevState = ctx.learner?.state ?? m.initial();
    const state = m.observe(prevState, rec, { context: ctx, activeBeatId: this.activeBeatId(), lastEvent: rec.event });
    const learner: LearnerRuntime = { model: m.name, state, signals: m.signals(state) };
    this.step = { ...this.step, context: { ...ctx, learner } };
  }

  /** Fire step-observers with the committed step. Passive — observers can't mutate the SM. */
  private notify(): void {
    if (this.observers.size === 0) return;
    const step = this.step;
    for (const fn of this.observers) fn(step);
  }

  /** Run policies once; inject any events. Policy-injected events don't re-trigger policies (v1). */
  private consultPolicies(): void {
    for (const p of this.policies) {
      for (const e of p.observe(this.step, this.lesson)) {
        this.apply(e, /* fromPolicy */ true);
      }
    }
  }

  private stateKey(): string {
    return JSON.stringify(this.step.state);
  }

  private runEffects(effects: Effect[]): void {
    const stateKey = this.stateKey();
    const ctx = this.context;
    for (const effect of effects) {
      const controller = new AbortController();
      this.inFlight.push({ stateKey, controller });
      void this.runner.run(effect, { signal: controller.signal, send: this.send, ctx });
    }
  }

  /** Abort effects whose originating state is no longer active. */
  private cancelStale(): void {
    const cur = this.stateKey();
    this.inFlight = this.inFlight.filter((f) => {
      if (f.stateKey !== cur) {
        f.controller.abort();
        return false;
      }
      return true;
    });
  }
  private cancelAll(): void {
    this.inFlight.forEach((f) => f.controller.abort());
    this.inFlight = [];
  }

  /** Stash active beat id so a beat's render() can locate its local state. */
  private markActiveBeat(): void {
    const id = this.activeBeatId();
    this.step = {
      ...this.step,
      context: { ...this.step.context, vars: { ...this.step.context.vars, __activeBeat: id } },
    };
  }
}

// ── factory + persistence helpers ──────────────────────────────────────────────

export function createSession(lesson: CompiledLesson, opts?: SessionOptions): Session {
  return new Session(lesson, opts);
}

export function snapshotSession(s: Session): Snapshot<LessonContext> {
  return s.toSnapshot();
}
export function restoreSession(lesson: CompiledLesson, snap: Snapshot<LessonContext>): Session {
  const s = new Session(lesson, { runner: { run() {} } }); // no effects on restore
  s.loadSnapshot(snap);
  return s;
}

/** O(n) reconstruction by folding the event log through the pure interpreter. */
export function replay(lesson: CompiledLesson, history: EventRecord[]): Session {
  const s = new Session(lesson, { runner: { run() {} }, policies: [] });
  for (const rec of history) s.send(rec.event);
  return s;
}
