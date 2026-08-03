import {
  enter,
  start,
  topId,
  transition,
  type Effect,
  type Json,
  type MachineEvent,
  type Step,
  type TransitionRecord,
} from "@lessonstudio/state-machine";
import type { RenderIntent, RenderModel } from "@lessonstudio/intents";
import { leafState, WORKSPACE_KEY, type RenderableBeat } from "../beats/index.js";
import { forkLesson, lowerBeat, validateBeatSpec, CompileError, type BeatSpec, type CompiledLesson } from "../lesson_sm/compile.js";
import { initialContext, type EventRecord, type LearnerRuntime, type LessonContext } from "../lesson_sm/context.js";
import type { LearnerModel } from "../policy/contracts.js";
import { adjudicate, failureResult, planResult, type DirectionPlan, type DirectionResult } from "../direction/adjudicate.js";
import type { Capabilities } from "../direction/capabilities.js";
import {
  ACTIVE_BEAT_VAR,
  actorOf,
  AUTHORING_COMMAND_EVENT,
  DIRECTION_COMMAND_EVENT,
  directionCommand,
  MESSAGE_SUBMIT_EVENT,
  normalizeCommands,
  type DirectorActor,
  type DirectorCommand,
} from "../direction/protocol.js";

export interface EffectContext {
  /** aborted when the state that spawned this effect is exited. */
  signal: AbortSignal;
  send: (event: MachineEvent) => void;
  ctx: LessonContext;
  /**
   * THIS session's live view of the lesson — the fork that runtime-spliced beats are written
   * into. Read-only from an effect's side, and NOT a route back into the engine: it carries no
   * `send`, so the one way an effect affects the machine is still `ec.send`.
   *
   * It is here because the alternative was silently wrong. A runner that closed over the
   * COMPILED lesson could not see any beat authored after construction: the `__ask-*` leaf the
   * learner is standing on, and — worse — every `__say-*` answer a director had already given.
   * `projectTranscript` found those turns but read their prose out of a chart that had no such
   * state, so the director's own past answers reached it as empty strings and it re-answered as
   * if it had never spoken.
   */
  lesson: CompiledLesson;
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
  attach(send: (event: MachineEvent) => void): () => void;
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
  /** Report from the last director turn (accepted or refused). Live-only, not context:
   *  it is feedback for whoever is directing, not state the lesson depends on. */
  private lastDirection: DirectionResult | null = null;

  /**
   * THIS session's view of the lesson, forked from the one it was constructed with: the spine
   * and the beat definitions are shared, the chart's state map and the registry are its own.
   * Everything that authors — `spliceBeat`, `applyDirection` — writes only here, so two
   * learners running one compiled lesson cannot edit each other's. Read it, don't mutate it.
   */
  readonly lesson: CompiledLesson;

  constructor(lesson: CompiledLesson, opts: SessionOptions = {}) {
    this.lesson = forkLesson(lesson);
    this.runner = opts.runner ?? defaultRunner(opts.onPersist);
    this.policies = opts.policies ?? [];
    this.learnerModel = opts.learnerModel;
    if (opts.onStep) this.observers.add(opts.onStep);

    this.step = start(this.lesson.chart, initialContext(opts.vars), this.lesson.registry);
    this.markActiveBeat();
    this.seedLearner();
    this.runEffects(this.step.effects);
    this.consultPolicies();

    for (const src of opts.signalSources ?? []) {
      this.detaches.push(src.attach((e) => this.send(e)));
    }
  }

  get done(): boolean {
    return this.step.done;
  }
  get context(): LessonContext {
    return this.step.context;
  }
  activeBeatId(): string {
    return topId(this.step.state);
  }

  send = (event: MachineEvent): void => {
    this.apply(event, false);
  };

  /**
   * Observe every committed step — including effect-driven ones (a resolved
   * `generate` → `direction.command`, a `timer`, a SignalSource) that re-enter via the
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
          if (i.kind === "scene") return { ...i, autoplay: false } as RenderIntent;
          if (i.kind !== "viz") return i;
          const props = (i as { props?: Record<string, unknown> }).props ?? {};
          return { ...i, props: { ...props, autoplay: false } } as RenderIntent;
        }),
      };
    }
    return { intents };
  }

  /** Detach signal sources + cancel effects. Call when tearing down. */
  dispose(): void {
    this.detaches.forEach((d) => d());
    this.detaches = [];
    this.observers.clear();
    this.cancelAll();
  }

  /**
   * Compile ONE runtime-authored beat into THIS session's chart + registry. Idempotent and
   * additive: an existing beat is never rewritten, so re-sending the same spec (which replay
   * does) is a no-op rather than a second install. Throws on a malformed spec — unknown type,
   * dangling target, no id.
   */
  spliceBeat(spec: BeatSpec): void {
    if (!spec || typeof spec.id !== "string" || !spec.id) throw new Error("spliceBeat: generated beat has no id");
    if (this.lesson.chart.states[spec.id]) return;
    const problems = validateBeatSpec(spec, this.lesson.beats, this.lesson.chart);
    if (problems.length) throw new CompileError(problems);
    this.lesson.chart.states[spec.id] = lowerBeat(spec, this.lesson.beats[spec.type]!, this.lesson.registry, spec.next ?? null);
  }

  private apply(event: MachineEvent, fromPolicy: boolean): void {
    if (event.type === DIRECTION_COMMAND_EVENT || event.type === AUTHORING_COMMAND_EVENT) {
      this.applyDirection(event, normalizeCommands(event.payload), fromPolicy);
      return;
    }
    if (event.type === MESSAGE_SUBMIT_EVENT) {
      this.applyMessage(event, fromPolicy);
      return;
    }

    const prev = this.step;
    const next = transition(this.lesson.chart, prev, event, this.lesson.registry);
    if (next === prev) return;

    let ctx = next.context;
    let appended: EventRecord | null = null;
    if (next.lastRecord) {
      appended = { seq: ctx.history.length, ...next.lastRecord };
      ctx = { ...ctx, history: [...ctx.history, appended] };
    }
    this.step = { ...next, context: ctx };
    this.markActiveBeat();
    if (appended) this.foldLearner(appended);

    this.cancelStale();
    this.runEffects(this.step.effects);

    if (!fromPolicy) this.consultPolicies();
    this.notify();
  }

  /**
   * Execute a director's turn (a list of commands): splice added beats, reroute existing ones,
   * patch the blackboard (controls / workspace / focus / annotations / hold), optionally jump
   * into a beat, and record the carrier event in history so replay re-creates the same edits as
   * data — no generator, no model, nobody re-invoked.
   *
   * The turn is ATOMIC: `adjudicate` plans against a shadow chart and this method installs the
   * result in one assignment plus one context merge, so a rejected command applies nothing and
   * never reaches history. On the live path the throw is caught by the runner or by `direct()`;
   * a raw `send` surfaces it to the caller.
   */
  private applyDirection(event: MachineEvent, commands: DirectorCommand[], fromPolicy: boolean, caps?: Capabilities): DirectionPlan {
    const prev = this.step;
    const plan = adjudicate(this.lesson, commands, {
      activeBeatId: this.resumeTargetOf(this.activeBeatId()),
      context: prev.context,
      ...(caps ? { capabilities: caps } : {}),
    });
    Object.assign(this.lesson.chart.states, plan.states);
    const patched = this.patchContext(prev.context, plan);

    const base: Step<LessonContext> = plan.enterId
      ? enter(this.lesson.chart, plan.enterId, patched, this.lesson.registry, event)
      : { state: prev.state, context: patched, effects: [], done: prev.done };
    const record: TransitionRecord = { event, from: prev.state, to: base.state };
    const rec: EventRecord = { seq: base.context.history.length, ...record };
    this.step = { ...base, context: { ...base.context, history: [...base.context.history, rec] }, lastRecord: record };
    this.markActiveBeat();
    this.foldLearner(rec);
    this.lastDirection = planResult(plan, actorOf(event.payload), commands.length);

    this.cancelStale();
    this.runEffects(this.step.effects);
    if (!fromPolicy) this.consultPolicies();
    this.notify();
    return plan;
  }

  /**
   * Fold a plan's three context patches into one new context — all three as MERGES on the same
   * committed step, so "point at the figure, re-pose it and zoom in" is one gesture rather than
   * three the learner watches happen in sequence.
   *
   * A `null` var DELETES its key (that is how `focus{clear}` and `release` are spelled), so a
   * cleared focus leaves no residue in snapshots.
   */
  private patchContext(ctx: LessonContext, plan: DirectionPlan): LessonContext {
    const varKeys = Object.keys(plan.vars);
    const beatIds = new Set([...Object.keys(plan.controls), ...Object.keys(plan.workspace)]);
    if (!varKeys.length && !beatIds.size) return ctx;
    const vars = { ...ctx.vars };
    for (const k of varKeys) {
      const v = plan.vars[k];
      if (v === null) delete vars[k];
      else vars[k] = v as Json;
    }
    const beats = { ...ctx.beats };
    for (const id of beatIds) {
      const prevLocal = (beats[id] as Record<string, Json> | undefined) ?? {};
      const nextLocal: Record<string, Json> = { ...prevLocal, ...(plan.controls[id] ?? {}) };
      const ws = plan.workspace[id];
      if (ws) nextLocal[WORKSPACE_KEY] = { ...((prevLocal[WORKSPACE_KEY] as Record<string, Json> | undefined) ?? {}), ...ws };
      beats[id] = nextLocal;
    }
    return { ...ctx, vars, beats };
  }

  /**
   * THE DIRECTOR'S DOOR — tier 2 and tier 3 both come through here and get identical treatment.
   * Submits one turn of commands and returns a REPORT instead of throwing, because the caller is
   * a teacher's terminal or a model's tool loop and both need "rejected, and here is why" as
   * data they can act on.
   *
   * `capabilities` bounds THIS turn only (default: unrestricted). It is deliberately not session
   * state: a recorded command replays under no capability check at all, since it already passed
   * one when it was made.
   */
  direct(commands: DirectorCommand | DirectorCommand[], actor: DirectorActor = "teacher", capabilities?: Capabilities): DirectionResult {
    const list = Array.isArray(commands) ? commands : [commands];
    try {
      this.applyDirection(directionCommand(list, actor), list, false, capabilities);
    } catch (e) {
      this.lastDirection = failureResult(actor, e, list.length);
    }
    return this.lastDirection!;
  }

  /** The report from the most recent director turn, or null if there has been none.
   *  `observe()` carries it so a model sees the consequence of its own last turn. */
  get lastResult(): DirectionResult | null {
    return this.lastDirection;
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
    const fromId = this.resumeTargetOf(this.activeBeatId());
    const question = String(((event.payload ?? {}) as { text?: string }).text ?? "").trim();
    const leafId = `__ask-${prev.context.history.length}`;
    this.spliceBeat(this.buildThinkingBeat(leafId, fromId));

    const entered = enter(this.lesson.chart, leafId, prev.context, this.lesson.registry, event);
    const record: TransitionRecord = { event, from: prev.state, to: entered.state };
    const rec: EventRecord = { seq: entered.context.history.length, ...record };
    this.step = { ...entered, context: { ...entered.context, history: [...entered.context.history, rec] }, lastRecord: record };
    this.markActiveBeat();
    this.foldLearner(rec);

    this.cancelStale();
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
        const defaults = { ...(p.defaults ?? {}), ...stored };
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
        this.apply(e, true);
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
      void this.runner.run(effect, { signal: controller.signal, send: this.send, ctx, lesson: this.lesson });
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
      context: { ...this.step.context, vars: { ...this.step.context.vars, [ACTIVE_BEAT_VAR]: id } },
    };
  }
}

export function createSession(lesson: CompiledLesson, opts?: SessionOptions): Session {
  return new Session(lesson, opts);
}

/**
 * O(n) reconstruction by folding the event log through the pure interpreter. A position-only
 * snapshot cannot rebuild a chart a director has since edited (added beats, rerouted edges);
 * replaying the log re-applies those turns from the recorded commands.
 */
export function replay(lesson: CompiledLesson, history: EventRecord[]): Session {
  const s = new Session(lesson, { runner: { run() {} }, policies: [] });
  for (const rec of history) s.send(rec.event);
  return s;
}
