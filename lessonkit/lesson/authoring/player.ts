// Player: the single authoritative clock for timed beats. Wraps a Session;
// samples the active beat's storyboard at beat time `t`, and at storyboard end
// emits the advance event so the (pure) state machine moves to the next beat.
// Clock-agnostic: tick(dt) is driven manually in tests, or by rAF in play().

import type { Json, MachineEvent } from "@lessonkit/state-machine";
import type { RenderModel } from "@lessonkit/render-contract";
import { cuesUpTo, sampleAt, sceneIntent, type Storyboard } from "@lessonkit/timeline";
import { leafState, type RenderableBeat } from "../beats/index.js";
import type { Session } from "./session.js";

export interface PlayerOptions {
  /** frame source for play(); returns a cancel fn. Inject for tests; defaults to rAF. */
  raf?: (cb: (dtMs: number) => void) => () => void;
  /** event emitted to advance the SM at storyboard end (default "next"). */
  advanceEvent?: MachineEvent;
}

interface BeatRef {
  type: string;
  params: Json;
}

export class Player {
  private t = 0;
  private cancel?: () => void;

  constructor(
    private readonly session: Session,
    private readonly opts: PlayerOptions = {},
  ) {}

  get time(): number {
    return this.t;
  }
  get done(): boolean {
    return this.session.done;
  }

  private beatRef(): BeatRef | null {
    const id = this.session.activeBeatId();
    const node = this.session.lesson.chart.states[id];
    const meta = node?.meta as { beat?: BeatRef } | undefined;
    return meta?.beat ?? null;
  }

  /** The active beat's storyboard, if it is a timed beat. */
  private storyboard(): Storyboard | null {
    const ref = this.beatRef();
    if (!ref) return null;
    const def = this.session.lesson.beats[ref.type] as RenderableBeat | undefined;
    if (!def?.storyboard) return null;
    const leaf = leafState(this.sessionState(), this.session.activeBeatId());
    return def.storyboard(ref.params, leaf, this.session.context);
  }

  private sessionState(): import("@lessonkit/state-machine").StateValue {
    // active state value is reconstructable from activeBeatId for flat beats;
    // the leaf helper tolerates a plain id here.
    return this.session.activeBeatId();
  }

  /** Render model for the current beat at the current `t`. */
  frame(): RenderModel {
    const sb = this.storyboard();
    if (!sb) return this.session.render(); // non-timed beat → static render
    const slot = ((this.beatRef()?.params as { slot?: string })?.slot) ?? "stage";
    const intents = [sceneIntent(slot, sampleAt(sb, this.t))];
    for (const c of cuesUpTo(sb, this.t)) {
      if (c.kind === "reveal") intents.push(c.intent);
    }
    return { intents };
  }

  /** Advance beat time by `dt` ms. At storyboard end, advance the SM. */
  tick(dt: number): void {
    const sb = this.storyboard();
    if (!sb) return; // non-timed beat waits for external events
    this.t += dt;
    if (this.t >= sb.duration) {
      this.t = 0;
      this.session.send(this.opts.advanceEvent ?? { type: "next" });
    }
  }

  /** Jump within the current beat (clamped to its duration). */
  seek(t: number): void {
    const sb = this.storyboard();
    const max = sb ? sb.duration : 0;
    this.t = t < 0 ? 0 : t > max ? max : t;
  }

  play(): void {
    if (this.cancel) return;
    const raf = this.opts.raf ?? defaultRaf();
    this.cancel = raf((dt) => this.tick(dt));
  }
  pause(): void {
    this.cancel?.();
    this.cancel = undefined;
  }
}

export function createPlayer(session: Session, opts?: PlayerOptions): Player {
  return new Player(session, opts);
}

/** Browser rAF loop computing per-frame deltas. No-op outside the browser. */
function defaultRaf(): (cb: (dtMs: number) => void) => () => void {
  return (cb) => {
    const raf = (globalThis as { requestAnimationFrame?: (f: FrameRequestCallback) => number })
      .requestAnimationFrame;
    const caf = (globalThis as { cancelAnimationFrame?: (h: number) => void }).cancelAnimationFrame;
    if (!raf) return () => {};
    let handle = 0;
    let last: number | null = null;
    const loop = (ts: number) => {
      const dt = last == null ? 16 : ts - last;
      last = ts;
      cb(dt);
      handle = raf(loop);
    };
    handle = raf(loop);
    return () => caf?.(handle);
  };
}
