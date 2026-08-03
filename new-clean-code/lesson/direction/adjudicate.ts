import type { Json, StateNode, Statechart } from "@lessonstudio/state-machine";
import {
  CompileError,
  lowerBeat,
  reachesTerminal,
  validateBeatSpec,
  validateReroute,
  type BeatSpec,
  type CompiledLesson,
  type CompileProblem,
} from "../lesson_sm/compile.js";
import type { LessonContext } from "../lesson_sm/context.js";
import { WORKSPACE_KEY } from "../beats/workspace.js";
import { assertPermitted, DirectionDenied, FULL, type Capabilities } from "./capabilities.js";
import {
  ANNOTATIONS_VAR,
  assertNoInlineFns,
  FOCUS_VAR,
  focusRectOf,
  HOLD_VAR,
  rerouteOf,
  type DirectorActor,
  type DirectorCommand,
  type DirectorOp,
} from "./protocol.js";

/**
 * A validated, installable edit. `states` holds every node the turn creates or rewrites (keyed
 * by beat id); installing the plan is a plain assign into `chart.states`, so it cannot
 * half-apply. The three context patches are applied the same way — one merge on one step.
 */
export interface DirectionPlan {
  states: Record<string, StateNode>;
  /** The beat to ENTER after installing, or null to stay where the learner is. */
  enterId: string | null;
  /** Merge into `ctx.vars` — the reserved director keys (`__focus`/`__annotations`/`__hold`). */
  vars: Record<string, Json>;
  /** Merge into `ctx.beats[beatId]` — the LEARNER control channel, written by the director. */
  controls: Record<string, Record<string, Json>>;
  /** Merge into `ctx.beats[beatId].__ws` — the AGENT viz channel (highlight/camera/overlay). */
  workspace: Record<string, Record<string, Json>>;
  /** Beat ids this turn ADDS (for reporting back to the director). */
  added: string[];
  /** Beat ids whose params this turn RE-AUTHORS. */
  patched: string[];
  /** Beat ids whose edges this turn REWRITES. */
  rerouted: string[];
  /** One short line per accepted command — what the director reads back as confirmation. */
  notes: string[];
}

export interface AdjudicateOptions {
  /** Where the learner is standing — the landing point when no command enters a beat. */
  activeBeatId: string;
  /**
   * The live blackboard. Read for two things, both of which are identical on replay: the
   * learner's CURRENT control values (so a `revisit` clones what they are actually looking
   * at, not the authored pose) and `history.length` as the id counter.
   */
  context: LessonContext;
  /** What this director is allowed to do. Default `FULL` — unrestricted. */
  capabilities?: Capabilities;
}

/**
 * What a director is TOLD about its turn: "did that land, and if not, why". `format.ts` renders
 * it; `observe()` carries the last one, so a model can self-correct on its next turn without
 * anybody parsing an exception.
 */
export interface DirectionResult {
  ok: boolean;
  /** Who was directing (echoed back so a log line is self-describing). */
  actor: DirectorActor;
  /** Commands submitted. On failure NONE of them applied — the turn is all-or-nothing. */
  submitted: number;
  /** One line per accepted command, in order. Empty on failure. */
  notes: string[];
  added: string[];
  patched: string[];
  rerouted: string[];
  /** The beat the learner was moved into, if any. */
  enteredId: string | null;
  /**
   * Present iff `!ok`, and the field a director branches on. `denied` = capabilities refused it
   * outright; `review` = capabilities WOULD allow it once a human approves, so the same command
   * may land later unchanged; `invalid` = structural; `error` = anything else. All four are
   * REJECTIONS: nothing applied, and the engine holds no pending state.
   */
  error?: {
    kind: "denied" | "review" | "invalid" | "error";
    /** The op that was refused, when known. */
    op?: string;
    /** Why, in one line — safe to show a human AND to feed back to a model. */
    detail: string;
    /** Structural problems, when the refusal was a compile failure. */
    problems?: CompileProblem[];
  };
}

/** The report for an accepted turn. */
export function planResult(plan: DirectionPlan, actor: DirectorActor, submitted: number): DirectionResult {
  return {
    ok: true,
    actor,
    submitted,
    notes: plan.notes,
    added: plan.added,
    patched: plan.patched,
    rerouted: plan.rerouted,
    enteredId: plan.enterId,
  };
}

/**
 * The report for a REJECTED turn. Classifies the throw so the director learns which kind of "no"
 * it got: a capability refusal is worth escalating, a structural one worth rewriting.
 */
export function failureResult(actor: DirectorActor, err: unknown, submitted: number): DirectionResult {
  const base = { ok: false as const, actor, submitted, notes: [], added: [], patched: [], rerouted: [], enteredId: null };
  if (err instanceof DirectionDenied) {
    const kind = err.kind === "review" ? ("review" as const) : ("denied" as const);
    return { ...base, error: { kind, op: err.op, detail: `${err.kind}: ${err.message}` } };
  }
  if (err instanceof CompileError) {
    return {
      ...base,
      error: { kind: "invalid", detail: err.problems.map((p) => `${p.code}${p.beatId ? ` [${p.beatId}]` : ""}: ${p.detail}`).join("; "), problems: err.problems },
    };
  }
  return { ...base, error: { kind: "error", detail: err instanceof Error ? err.message : String(err) } };
}

function emptyPlan(): DirectionPlan {
  return { states: {}, enterId: null, vars: {}, controls: {}, workspace: {}, added: [], patched: [], rerouted: [], notes: [] };
}

function beatOf(chart: Statechart<LessonContext>, id: string): { type: string; params: Record<string, Json> } | null {
  const meta = chart.states[id]?.meta as { beat?: { type: string; params: Record<string, Json> } } | undefined;
  return meta?.beat ?? null;
}

function advanceOf(node: StateNode): string | null {
  const edge = node.on?.next;
  if (!edge || edge.length === 0) return null;
  return edge[edge.length - 1]?.target ?? null;
}

/**
 * Plan a director's turn. Throws on the first inadmissible command — `CompileError` for a
 * structural problem, `DirectionDenied` for a capability refusal, a plain `Error` for a
 * non-JSON beat — and in every case NOTHING has been installed, so the caller's state is
 * untouched. On success the returned plan is safe to apply.
 */
export function adjudicate(lesson: CompiledLesson, commands: DirectorCommand[], opts: AdjudicateOptions): DirectionPlan {
  const plan = emptyPlan();
  const caps = opts.capabilities ?? FULL;
  const seq = opts.context.history.length;
  const shadow = (): Statechart<LessonContext> => ({ ...lesson.chart, states: { ...lesson.chart.states, ...plan.states } });
  const landing = (): string => plan.enterId ?? opts.activeBeatId;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]!;
    const op = cmd.op as DirectorOp;

    switch (cmd.op) {
      case "addBeat": {
        assertPermitted(caps, op, i);
        install(cmd.spec, cmd.enter !== false);
        break;
      }

      case "patchBeat": {
        assertPermitted(caps, op, i, cmd.beatId);
        const chart = shadow();
        const node = chart.states[cmd.beatId];
        const beat = beatOf(chart, cmd.beatId);
        if (!node || !beat) throw dangling(cmd.beatId, `patchBeat: beat "${cmd.beatId}" does not exist`);
        const spec: BeatSpec = { id: cmd.beatId, type: beat.type, params: { ...beat.params, ...cmd.params } as Json, next: advanceOf(node) };
        const problems = validateBeatSpec(spec, lesson.beats, chart);
        if (problems.length) throw new CompileError(problems);
        plan.states[cmd.beatId] = lowerBeat(spec, lesson.beats[spec.type]!, lesson.registry, spec.next ?? null);
        if (!plan.patched.includes(cmd.beatId)) plan.patched.push(cmd.beatId);
        plan.notes.push(`patched ${cmd.beatId} (${Object.keys(cmd.params).join(", ")})`);
        break;
      }

      case "rerouteBeat":
      case "setNext": {
        const reroute = rerouteOf(cmd)!;
        assertPermitted(caps, op, i, reroute.beatId);
        const chart = shadow();
        const problems = validateReroute(reroute.beatId, reroute.target, chart);
        if (problems.length) throw new CompileError(problems);
        const node = chart.states[reroute.beatId]!;
        plan.states[reroute.beatId] = {
          ...node,
          on: { ...(node.on ?? {}), [reroute.key]: reroute.target === null ? [] : [{ target: reroute.target }] },
        };
        if (!plan.rerouted.includes(reroute.beatId)) plan.rerouted.push(reroute.beatId);
        plan.notes.push(`rerouted ${reroute.beatId} --${reroute.key}--> ${reroute.target ?? "(end)"}`);
        break;
      }

      case "goto": {
        assertPermitted(caps, op, i);
        if (!shadow().states[cmd.beatId]) throw dangling(cmd.beatId, `goto: beat "${cmd.beatId}" does not exist`);
        plan.enterId = cmd.beatId;
        plan.notes.push(`moved the learner to ${cmd.beatId}`);
        break;
      }

      case "say": {
        assertPermitted(caps, op, i);
        const from = landing();
        const resume = cmd.resume === undefined ? from : cmd.resume;
        const id = cmd.id ?? `__say-${seq}-${i}`;
        const params: Record<string, Json> = { text: cmd.text };
        if (cmd.narrate) params.narration = cmd.narrate;
        const viz = showViz(cmd.show, from);
        if (viz) params.viz = viz;
        const exits = sayExits(cmd.exits, resume, typeof cmd.resume === "string" ? cmd.resume : opts.activeBeatId);
        if (exits) params.exits = exits as unknown as Json;
        install({ id, type: "explain", params: params as Json, next: resume }, true);
        const onward = exits?.find((e) => e.to !== resume);
        plan.notes.push(
          `said "${clip(cmd.text)}"${resume ? ` (resumes ${resume})` : " (ends the lesson)"}` +
            (onward ? `, or on to ${onward.to ?? "the end"}` : ""),
        );
        break;
      }

      case "revisit": {
        assertPermitted(caps, op, i);
        const from = landing();
        const src = beatOf(shadow(), cmd.beatId);
        if (!src) throw dangling(cmd.beatId, `revisit: beat "${cmd.beatId}" does not exist`);
        const resume = cmd.resume === undefined ? from : cmd.resume;
        const id = `__revisit-${cmd.beatId}-${seq}-${i}`;
        const params: Record<string, Json> = { ...src.params };
        delete params.narration;
        delete params.ephemeral;
        const live = (opts.context.beats[cmd.beatId] as Record<string, Json> | undefined) ?? {};
        if (Object.keys(live).length) {
          params.defaults = { ...((params.defaults as Record<string, Json> | undefined) ?? {}), ...live };
        }
        if (cmd.note) params.note = cmd.note;
        install({ id, type: src.type, params: params as Json, next: resume }, true);
        plan.notes.push(`revisited ${cmd.beatId}${resume ? ` (resumes ${resume})` : ""}`);
        break;
      }

      case "setControl":
      case "setControls": {
        assertPermitted(caps, op, i);
        const target = cmd.beatId ?? landing();
        requireBeat(target, cmd.op);
        const values = cmd.op === "setControl" ? { [cmd.key]: cmd.value } : cmd.values;
        plan.controls[target] = { ...(plan.controls[target] ?? {}), ...values };
        plan.notes.push(`set ${Object.entries(values).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ")} on ${target}`);
        break;
      }

      case "workspace": {
        assertPermitted(caps, op, i);
        const target = cmd.beatId ?? landing();
        requireBeat(target, cmd.op);
        plan.workspace[target] = { ...(plan.workspace[target] ?? {}), ...cmd.props };
        plan.notes.push(cmd.label ?? `adjusted the workspace on ${target}`);
        break;
      }

      case "focus": {
        assertPermitted(caps, op, i);
        const rect = focusRectOf(cmd);
        plan.vars[FOCUS_VAR] = rect ? ({ rect, ...(cmd.label ? { label: cmd.label } : {}) } as unknown as Json) : null;
        plan.notes.push(rect ? `focused ${fmtRect(rect)}${cmd.label ? ` — ${cmd.label}` : ""}` : "cleared the focus");
        break;
      }

      case "annotate": {
        assertPermitted(caps, op, i);
        const shapes = cmd.clear ? [] : (cmd.shapes ?? []);
        plan.vars[ANNOTATIONS_VAR] = shapes as unknown as Json;
        plan.notes.push(shapes.length ? `drew ${shapes.length} mark${shapes.length > 1 ? "s" : ""} on the stage` : "erased the marks");
        break;
      }

      case "hold": {
        assertPermitted(caps, op, i);
        plan.vars[HOLD_VAR] = { ...(cmd.reason ? { reason: cmd.reason } : {}) } as unknown as Json;
        plan.notes.push(cmd.reason ? `held the lesson — ${cmd.reason}` : "held the lesson");
        break;
      }

      case "release": {
        assertPermitted(caps, op, i);
        plan.vars[HOLD_VAR] = null;
        plan.notes.push("released the hold");
        break;
      }

      default: {
        throw new Error(`direction: unknown op "${String((cmd as { op?: unknown }).op)}"`);
      }
    }
  }

  if (plan.rerouted.length || plan.patched.length || plan.enterId) {
    const from = landing();
    if (!reachesTerminal(shadow(), from)) {
      throw new CompileError([{ code: "NO_TERMINAL", detail: `this turn would strand the learner: no path from "${from}" to an ending` }]);
    }
  }

  return plan;

  function install(spec: BeatSpec, enterIt: boolean): void {
    if (!spec || typeof spec.id !== "string" || !spec.id) throw new Error("addBeat: beat has no id");
    assertNoInlineFns(spec);
    const chart = shadow();
    if (chart.states[spec.id] === undefined) {
      const problems = validateBeatSpec(spec, lesson.beats, chart);
      if (problems.length) throw new CompileError(problems);
      plan.states[spec.id] = lowerBeat(spec, lesson.beats[spec.type]!, lesson.registry, spec.next ?? null);
      plan.added.push(spec.id);
    }
    if (enterIt) plan.enterId = spec.id;
  }

  /**
   * A detour's ways out (see `SayCommand.exits`). `null` = leave the beat with its single Continue.
   *
   * `onwardFrom` is the beat the learner INTERRUPTED, not `back`, and the difference shows up when a
   * turn contains several `say`s: those chain behind one another, so "back" is one step down the
   * chain while "what's next" still means what's next in the LESSON. When the director names its own
   * `resume`, that beat is both.
   *
   * A resume of `null` gets no exits: the turn ends the lesson, there is nothing to go back to, and
   * the terminal Continue the empty `next` edge already renders is the honest affordance.
   */
  function sayExits(
    spec: Extract<DirectorCommand, { op: "say" }>["exits"],
    back: string | null,
    onwardFrom: string,
  ): Array<{ label: string; to: string | null }> | null {
    if (!spec) return null;
    if (Array.isArray(spec)) return spec.length ? spec : null;
    if (back === null) return null;
    const node = shadow().states[onwardFrom];
    if (!node) return null;
    const backExit = { label: "← Back to the lesson", to: back };
    const onward = advanceOf(node);
    if (onward === null) return [backExit, { label: "Finish the lesson →", to: null }];
    if (onward === back) return [backExit];
    return [backExit, { label: "Move on to what's next →", to: onward }];
  }

  function requireBeat(id: string, opName: string): void {
    if (!shadow().states[id]) throw dangling(id, `${opName}: beat "${id}" does not exist`);
  }

  function showViz(show: Extract<DirectorCommand, { op: "say" }>["show"], from: string): Json | null {
    const inheritFrom = show?.like ?? (show?.name ? null : from);
    let name = show?.name;
    let props: Record<string, Json> = {};
    let persistent = show?.persistent;
    if (inheritFrom) {
      const src = beatOf(shadow(), inheritFrom);
      const srcViz = src?.params.viz as { name?: string; props?: Record<string, Json>; persistent?: boolean } | undefined;
      if (srcViz?.name) {
        name = srcViz.name;
        props = { ...(srcViz.props ?? {}) };
        persistent = persistent ?? srcViz.persistent;
        const live = (opts.context.beats[inheritFrom] as Record<string, Json> | undefined) ?? {};
        for (const [k, v] of Object.entries(live)) if (k !== WORKSPACE_KEY) props[k] = v;
        Object.assign(props, (live[WORKSPACE_KEY] as Record<string, Json> | undefined) ?? {});
      }
    }
    if (!name) return null;
    return { name, props: { ...props, ...(show?.props ?? {}) }, ...(persistent ? { persistent: true } : {}) } as unknown as Json;
  }
}

function dangling(beatId: string, detail: string): CompileError {
  const problem: CompileProblem = { code: "DANGLING_TARGET", beatId, detail };
  return new CompileError([problem]);
}

function clip(s: string, n = 48): string {
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > n ? `${one.slice(0, n - 1)}…` : one;
}

function fmtRect(r: { x: number; y: number; w: number; h: number }): string {
  const p = (n: number): string => n.toFixed(2);
  return `[${p(r.x)},${p(r.y)} ${p(r.w)}×${p(r.h)}]`;
}
