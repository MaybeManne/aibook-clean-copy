// Easy authoring facade for videos. `defineVideo({ scenes })` + a fluent
// `scene(...)` builder compile DOWN to the existing lesson IR (animate/mcq/…
// beats), so there is no new runtime path. Escape hatches stay open: pass a raw
// Storyboard to animate(), a custom viz via storyboard.viz, custom beats by type,
// or drop to defineLesson. Depends on lesson (compile + prepare) + timeline.

import {
  animate,
  defineLesson,
  prepareNarration,
  type BeatSpec,
  type CompiledLesson,
  type LessonSpec,
  type PreparedLesson,
} from "@lessonkit/lesson";
import type { NarrateOptions } from "@lessonkit/audio";
import type { Easing, SceneNode, Storyboard, Tween } from "@lessonkit/timeline";
import type { RenderIntent } from "@lessonkit/render-contract";

/** Fluent Storyboard builder — animation as a few readable verbs. */
export class SceneBuilder {
  private nodes: SceneNode[] = [];
  private tweens: Tween[] = [];
  private cues: NonNullable<Storyboard["cues"]> = [];
  private end = 0;

  constructor(private readonly stage: { w: number; h: number }) {}

  add(node: SceneNode): this {
    this.nodes.push(node);
    return this;
  }
  private tween(target: string, property: Tween["property"], from: number | string | undefined, to: number | string, at: number, dur: number, easing?: Easing): this {
    this.tweens.push({ target, property, from, to, start: at, duration: dur, ...(easing ? { easing } : {}) });
    this.end = Math.max(this.end, at + dur);
    return this;
  }
  fadeIn(id: string, at = 0, dur = 500, easing: Easing = "easeOut"): this {
    return this.tween(id, "opacity", 0, 1, at, dur, easing);
  }
  fadeOut(id: string, at: number, dur = 400): this {
    return this.tween(id, "opacity", undefined, 0, at, dur);
  }
  moveTo(id: string, axis: "x" | "y", to: number, at: number, dur = 800, easing: Easing = "easeInOut"): this {
    return this.tween(id, axis, undefined, to, at, dur, easing);
  }
  scaleTo(id: string, to: number, at: number, dur = 600, easing: Easing = "easeInOut"): this {
    return this.tween(id, "scale", undefined, to, at, dur, easing);
  }
  colorTo(id: string, to: string, at: number, dur = 500): this {
    return this.tween(id, "fill", undefined, to, at, dur);
  }
  reveal(intent: RenderIntent, at: number): this {
    this.cues.push({ at, kind: "reveal", intent });
    this.end = Math.max(this.end, at);
    return this;
  }
  gate(event: string, at: number): this {
    this.cues.push({ at, kind: "gate", event });
    this.end = Math.max(this.end, at);
    return this;
  }
  hold(ms: number): this {
    this.end += ms;
    return this;
  }
  build(): Storyboard {
    return { duration: Math.max(1, this.end), stage: this.stage, initial: this.nodes, tweens: this.tweens, cues: this.cues };
  }
}

export interface SceneOptions {
  id: string;
  narration?: string;
  stage?: { w: number; h: number };
  slot?: string;
  next?: string | null;
}

/** Author a timed scene fluently; compiles to an `animate` beat. */
export function scene(opts: SceneOptions, build: (b: SceneBuilder) => void): BeatSpec {
  const b = new SceneBuilder(opts.stage ?? { w: 1280, h: 720 });
  build(b);
  return animate({
    id: opts.id,
    storyboard: b.build(),
    ...(opts.slot ? { slot: opts.slot } : {}),
    ...(opts.narration ? { narration: opts.narration } : {}),
    ...(opts.next !== undefined ? { next: opts.next } : {}),
  });
}

export interface VideoSpec {
  id: string;
  version?: number;
  title: string;
  flow: BeatSpec[];
}

export interface DefinedVideo {
  spec: LessonSpec;
  /** Compile without narration (silent/instant durations). */
  compile(): CompiledLesson;
  /** Synthesize narration (audio-driven durations + captions) then compile. */
  prepare(opts: NarrateOptions): Promise<{ lesson: CompiledLesson; prepared: PreparedLesson }>;
}

/** The recommended entry point. Escape hatch: use defineLesson + beats directly. */
export function defineVideo(spec: VideoSpec): DefinedVideo {
  const lessonSpec: LessonSpec = { id: spec.id, version: spec.version ?? 1, title: spec.title, flow: spec.flow };
  return {
    spec: lessonSpec,
    compile: () => defineLesson(lessonSpec),
    async prepare(opts) {
      const prepared = await prepareNarration(lessonSpec, opts);
      return { lesson: defineLesson(prepared.spec), prepared };
    },
  };
}
