// Session: the one stateful object — the boundary between the pure engine and
// the effectful world. It drives the pure interpreter, owns history, runs
// effects (with cancellation), and consults policies. React (or any view) reads
// render() and calls send().

import {
  restore,
  snapshot,
  start,
  transition,
  type Effect,
  type Json,
  type MachineEvent,
  type Snapshot,
  type Step,
} from "@lessonkit/state-machine";
import type { RenderModel } from "@lessonkit/render-contract";
import { leafState, type RenderableBeat } from "../beats/index.js";
import type { CompiledLesson } from "../lesson_sm/compile.js";
import { initialContext, type EventRecord, type LessonContext } from "../lesson_sm/context.js";

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

export interface SessionOptions {
  vars?: Record<string, Json>;
  runner?: EffectRunner;
  policies?: Policy[];
  signalSources?: SignalSource[];
  onPersist?: (payload: Json) => void;
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

  constructor(
    readonly lesson: CompiledLesson,
    opts: SessionOptions = {},
  ) {
    this.runner = opts.runner ?? defaultRunner(opts.onPersist);
    this.policies = opts.policies ?? [];

    this.step = start(lesson.chart, initialContext(opts.vars), lesson.registry);
    this.markActiveBeat();
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
    this.cancelAll();
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private apply(event: MachineEvent, fromPolicy: boolean): void {
    const prev = this.step;
    const next = transition(this.lesson.chart, prev, event, this.lesson.registry);
    if (next === prev) return; // unhandled — ignored by the engine

    // Session owns history: append a sequenced record for the edge just taken.
    let ctx = next.context;
    if (next.lastRecord) {
      const rec: EventRecord = { seq: ctx.history.length, ...next.lastRecord };
      ctx = { ...ctx, history: [...ctx.history, rec] };
    }
    this.step = { ...next, context: ctx };
    this.markActiveBeat();

    // Cancellation: effects don't outlive the state that spawned them.
    this.cancelStale();
    this.runEffects(this.step.effects);

    if (!fromPolicy) this.consultPolicies();
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
