// The fluent, single-file lesson builder — the human-facing authoring surface.
// `lesson(id, title).explain(...).demo(...).quiz(...).checkpoint(...)` accumulates
// beats and COMPILES DOWN to the existing lesson IR (defineLesson + the explain/mcq/
// freeResponse/explorable/branch beat builders) — there is NO new runtime path. Viz is
// plugged in as a VALUE (author/viz.ts); the builder stamps each with a deterministic
// name and hands the name+props to the beat, so the IR stays pure/replayable. Reading
// prose is routed to a single surface per beat (explain → the beat's own text; demo/quiz
// note → the `article` map) so the notebook panel never double-renders. React-free, so
// `.spec` (plain LessonSpec JSON) is usable headlessly and by a future generator/exporter.

import {
  animate,
  branch,
  decisionPolicy,
  defineLesson,
  explorable,
  freeResponse,
  mcq,
  topMisconception,
  type BeatSpec,
  type CompiledLesson,
  type LessonSpec,
  type Policy,
} from "@lessonkit/lesson";
import type { LessonContext } from "@lessonkit/lesson";
import { SceneBuilder } from "@lessonkit/video";
import type { Storyboard } from "@lessonkit/timeline";
import type { Guard, MachineEvent, Route } from "@lessonkit/state-machine";
import { article, type RichText } from "@lessonkit/render-contract";
import { toControls, type ControlDescriptor } from "./controls.js";
import type { DemoGoal, VizValue } from "./viz.js";

type Prose = string | RichText;
const toRich = (p: Prose): RichText => (typeof p === "string" ? article(p) : p);

// The button that advances a beat in the notebook player. Prose ("explain") and
// checkpoint beats are compiled to `explorable` beats — the only beat kind that carries
// interactive controls — so they surface this Continue affordance (a bare `explain` beat
// has none: it advances only under timed playback, which these learner-paced lessons omit).
const CONTINUE = { key: "__next", label: "Continue →", kind: "button" as const };

export interface DemoOpts {
  viz: VizValue;
  controls?: Record<string, ControlDescriptor>;
  /** Reading-panel explainer prose for this beat (book/blog). */
  note?: Prose;
  /** Fixed props passed to the viz in addition to control values. */
  vizProps?: Record<string, unknown>;
  /** Guided mode: hide Continue until the goal on a control value is met. */
  goal?: DemoGoal;
  task?: Prose;
  success?: Prose;
  /** Show a free-text "ask the tutor" box (needs a live author to answer). */
  ask?: boolean;
  /** Spoken narration (plain text, no markdown). Untimed — plays once on beat entry. */
  narration?: string;
  next?: string | null;
}

export interface ExplainOpts {
  next?: string | null;
  /** Spoken narration (plain text, no markdown). Untimed — plays once on beat entry. */
  narration?: string;
}

export interface AnimateOpts {
  /** Fluent declarative storyboard — the primary path (SceneBuilder verbs). */
  build?: (s: SceneBuilder) => void;
  /** Escape hatch: an inline figure/viz driven by the beat clock `t`. */
  viz?: VizValue;
  /** Escape hatch: a raw Storyboard. */
  storyboard?: Storyboard;
  /** Placeholder duration (ms); overwritten by the narration length when narrated. */
  duration?: number;
  /** Stage size for the storyboard (default 1280×720). */
  stage?: { w: number; h: number };
  /** Spoken narration (plain text). Timed — drives the scene duration + synced captions. */
  narration?: string;
  /** Stage slot the scene renders into (default "stage"). */
  slot?: string;
  /** Reading-panel prose for the notebook layout. */
  note?: Prose;
  next?: string | null;
}

export interface QuizOpts {
  prompt: Prose;
  /** Multiple choice → an mcq gate. */
  choices?: { text: string; correct?: boolean; misconception?: string }[];
  /** Accepted answers → a fill-in freeResponse gate. */
  accept?: string[];
  skill?: string;
  misconception?: string;
  correctFeedback?: string;
  wrongFeedback?: string;
  onWrong?: string;
  /** Reading-panel explainer prose for this beat. */
  note?: Prose;
  next?: string | null;
}

export interface CheckpointOpts {
  /** Skill whose mastery (≥1) triggers the challenge branch. */
  skill: string;
  /** Beat to route to when a misconception is recorded. */
  onMisconception: string;
  /** Beat to route to when the skill is mastered. */
  onMastery: string;
}

const withNext = <T extends object>(params: T, next: string | null | undefined): T & { next?: string | null } =>
  next !== undefined ? { ...params, next } : params;

/**
 * A single-file lesson. Chain beat methods (each returns `this`), then `renderLesson`
 * (browser) mounts it, or read `.spec` for headless use. Beat ids double as navigation
 * targets and as the deterministic viz-registration key.
 */
export class LessonBuilder {
  private readonly flow: BeatSpec[] = [];
  private readonly articleMap: Record<string, RichText> = {};
  private readonly vizDescriptors: VizValue[] = [];
  private readonly policyList: Policy[] = [];
  private lastVizName: string | undefined;

  constructor(
    private readonly id: string,
    private readonly title_: string,
    private readonly eyebrow_?: string,
  ) {}

  /**
   * A prose/reading beat. The prose renders in the reading panel (the `article` map) while
   * the persistent viz stays on stage, and a Continue button advances — unless `next` is
   * `null` (the terminal beat), which drops Continue so the lesson ends cleanly. Compiled to
   * an `explorable` (not the bare `explain` beat) so it carries that Continue affordance.
   */
  explain(id: string, prose: Prose, opts: ExplainOpts = {}): this {
    const params: Record<string, unknown> = {
      id,
      viz: { name: this.resolveVizName(id) },
      controls: opts.next === null ? [] : [CONTINUE],
      ...(opts.narration ? { narration: opts.narration } : {}),
    };
    this.flow.push(explorable(withNext(params, opts.next) as unknown as Parameters<typeof explorable>[0]));
    this.articleMap[id] = toRich(prose);
    return this;
  }

  /** An interactive demo: an inline viz + controls. Untimed — the lesson waits here. */
  demo(id: string, opts: DemoOpts): this {
    const name = `${this.id}:${id}`;
    opts.viz.name = name;
    this.vizDescriptors.push(opts.viz);
    this.lastVizName = name;

    const { controls, defaults } = toControls(opts.controls ?? {}, { includeNext: opts.next !== null });
    const params: Record<string, unknown> = {
      id,
      viz: { name, props: opts.vizProps ?? {} },
      controls,
      defaults,
    };
    if (opts.goal) params.goal = opts.goal;
    if (opts.task) params.task = toRich(opts.task);
    if (opts.success) params.success = toRich(opts.success);
    if (opts.ask) params.ask = opts.ask;
    if (opts.narration) params.narration = opts.narration;
    this.flow.push(explorable(withNext(params, opts.next) as unknown as Parameters<typeof explorable>[0]));

    if (opts.note) this.articleMap[id] = toRich(opts.note);
    return this;
  }

  /**
   * A timed animated scene — the one beat kind whose clock advances (so a figure or
   * declarative storyboard actually moves). Author motion fluently with `build`
   * (SceneBuilder verbs: `add`/`fadeIn`/`moveTo`/`scaleTo`/`colorTo`/…), or hand it a
   * clock-driven inline `viz`, or a raw `storyboard`. With `narration`, the offline
   * audio pass (`--audio`) sets the scene's duration to the voice length and
   * word-highlights captions in sync. Renders on the stage in either layout.
   */
  animate(id: string, opts: AnimateOpts = {}): this {
    const stage = opts.stage ?? { w: 1280, h: 720 };
    let storyboard: Storyboard;
    if (opts.storyboard) {
      storyboard = opts.storyboard;
    } else if (opts.build) {
      const b = new SceneBuilder(stage);
      opts.build(b);
      storyboard = b.build();
    } else {
      // viz-only (or empty) storyboard: the figure reads the beat clock `t` and props.
      storyboard = { duration: Math.max(1, opts.duration ?? 1), stage, initial: [], tweens: [] };
    }
    if (opts.duration) storyboard = { ...storyboard, duration: opts.duration };

    if (opts.viz) {
      const name = `${this.id}:${id}`;
      opts.viz.name = name;
      this.vizDescriptors.push(opts.viz);
      this.lastVizName = name;
      storyboard = { ...storyboard, viz: { name } };
    }

    this.flow.push(
      animate({
        id,
        storyboard,
        ...(opts.slot ? { slot: opts.slot } : {}),
        ...(opts.narration ? { narration: opts.narration } : {}),
        ...(opts.next !== undefined ? { next: opts.next } : {}),
      }),
    );
    if (opts.note) this.articleMap[id] = toRich(opts.note);
    return this;
  }

  /**
   * Attach spoken narration to the most recently added beat — sugar for the beats'
   * `narration` option. On `.explain`/`.demo` (untimed) the clip plays once on entry;
   * on `.animate` (timed) it also drives the scene's duration + synced captions. It is
   * a no-op on a `.quiz` gate (the narration pass synthesizes only explain/demo/animate).
   */
  narrate(text: string): this {
    const last = this.flow[this.flow.length - 1];
    if (!last) throw new Error("narrate(): no beat to narrate — add a beat first");
    if (last.type === "mcq" || last.type === "freeResponse") {
      console.warn(`narrate(): narration is ignored on the "${last.id}" quiz gate; attach it to an explain/demo/animate beat.`);
      return this;
    }
    (last.params as unknown as Record<string, unknown>).narration = text;
    return this;
  }

  /** A graded gate: `choices` → multiple choice, `accept` → fill-in. Records mastery/misconception. */
  quiz(id: string, opts: QuizOpts): this {
    if (opts.accept) {
      this.flow.push(
        freeResponse(
          withNext(
            {
              id,
              prompt: toRich(opts.prompt),
              accept: opts.accept,
              ...(opts.skill ? { skill: opts.skill } : {}),
              ...(opts.misconception ? { misconception: opts.misconception } : {}),
              ...(opts.correctFeedback ? { correctFeedback: opts.correctFeedback } : {}),
              ...(opts.wrongFeedback ? { wrongFeedback: opts.wrongFeedback } : {}),
              ...(opts.onWrong ? { onWrong: opts.onWrong } : {}),
            },
            opts.next,
          ) as unknown as Parameters<typeof freeResponse>[0],
        ),
      );
    } else {
      this.flow.push(
        mcq(
          withNext(
            {
              id,
              prompt: toRich(opts.prompt),
              choices: opts.choices ?? [],
              ...(opts.skill ? { skill: opts.skill } : {}),
              ...(opts.correctFeedback ? { correctFeedback: opts.correctFeedback } : {}),
              ...(opts.wrongFeedback ? { wrongFeedback: opts.wrongFeedback } : {}),
              ...(opts.onWrong ? { onWrong: opts.onWrong } : {}),
            },
            opts.next,
          ) as unknown as Parameters<typeof mcq>[0],
        ),
      );
    }
    if (opts.note) this.articleMap[id] = toRich(opts.note);
    return this;
  }

  /** A pure flow fork on a predicate. */
  branch(id: string, when: Guard<never>, thenId: string, elseId: string): this {
    this.flow.push(branch({ id, when: when as never, then: thenId, else: elseId }));
    return this;
  }

  /**
   * An adaptive decision node: on arrival a policy reads the blackboard and routes to
   * `onMisconception` (a recorded misconception) or `onMastery` (skill mastered); if
   * neither fires it falls through the spine (which excludes those detour targets). Shows
   * the previous demo's viz with a Continue button so a fall-through is never a dead end.
   */
  checkpoint(id: string, opts: CheckpointOpts): this {
    const beat = explorable({
      id,
      viz: { name: this.resolveVizName(id) },
      controls: [CONTINUE],
    });
    beat.routes = [
      { on: "signal.remediate", target: opts.onMisconception },
      { on: "signal.challenge", target: opts.onMastery },
    ] as Route[];
    this.flow.push(beat);

    this.policyList.push(
      decisionPolicy(id, (ctx): MachineEvent[] => {
        const mis = topMisconception(ctx);
        if (mis) return [{ type: "signal.remediate", payload: { topic: mis } }];
        if ((ctx.mastery[opts.skill] ?? 0) >= 1) return [{ type: "signal.challenge" }];
        return [];
      }),
    );
    return this;
  }

  /**
   * The stage viz for a prose/checkpoint beat: reuse the last demo's viz for visual
   * continuity (the persistent figure stays on stage), or, before any demo has run,
   * register a one-off blank figure so the stage is simply empty. Deterministic name ⇒
   * replay- and HMR-safe (same slot reused instead of leaking a registry entry).
   */
  private resolveVizName(id: string): string {
    if (this.lastVizName) return this.lastVizName;
    const name = `${this.id}:${id}:blank`;
    this.vizDescriptors.push({ __viz: "figure", draw: () => `<svg viewBox="0 0 10 10"></svg>`, name });
    return name;
  }

  /** The plain LessonSpec IR (JSON) — headless/exporter/generator friendly. */
  get spec(): LessonSpec {
    return { id: this.id, version: 1, title: this.title_, flow: this.flow };
  }

  /** Compile + collect everything the renderer needs. Throws (CompileError) if invalid. */
  build(): {
    spec: LessonSpec;
    lesson: CompiledLesson;
    article: Record<string, RichText>;
    descriptors: VizValue[];
    policies: Policy[];
    title: string;
    eyebrow?: string;
  } {
    return {
      spec: this.spec,
      lesson: defineLesson(this.spec),
      article: this.articleMap,
      descriptors: this.vizDescriptors,
      policies: this.policyList,
      title: this.title_,
      eyebrow: this.eyebrow_,
    };
  }
}

/** Start a new single-file lesson. `lesson(id, title, eyebrow?)`. */
export function lesson(id: string, title: string, eyebrow?: string): LessonBuilder {
  return new LessonBuilder(id, title, eyebrow);
}
