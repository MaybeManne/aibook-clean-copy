import type {
  Json,
  Registry,
  StateId,
  StateNode,
  StateValue,
  Transition,
  Route,
} from "@lessonstudio/state-machine";
import type { RenderIntent } from "@lessonstudio/intents";
import type { Storyboard } from "@lessonstudio/timeline";
import type { LessonContext } from "../lesson_sm/context.js";

/** Context handed to a beat's `wire()` during compilation. */
export interface BeatWireCtx {
  registry: Registry<LessonContext>;
  /** This beat's default "next" target on the spine (string id, or null = terminal). */
  defaultNext(): StateId | null;
}

/** Extra routing a beat splices onto its node, returned from `wire()`. */
export interface BeatWiring {
  routes?: Route[];
  on?: Record<string, Transition[]>;
}

/**
 * What a beat's `params` look like, as data a director can be shown.
 *
 * A beat type is only authorable by someone who knows its param shape, and until this existed the
 * only description lived in a TypeScript interface no model ever sees — which is why a director
 * could `addBeat` in principle and never usefully in practice. Kept deliberately compact (one line
 * per field) rather than full JSON Schema: it is rendered into a prompt and into a tool schema, and
 * both want prose more than they want validation. Adjudication is still the enforcement.
 */
export interface BeatParamsSchema {
  /** One sentence: what this beat kind is FOR, so a director picks the right one. */
  doc: string;
  /** Param name → one-line description. Prefix a name with `?` to mark it optional. */
  params: Record<string, string>;
  /** A minimal working example, as the JSON a director would actually send. */
  example: Json;
}

/** The statechart half of a beat. */
export interface BeatDef<P = Json> {
  type: string;
  /** Build the StateNode for an instance; stores beat ref in node.meta. */
  build(params: P, id: StateId): StateNode;
  /** Advisory outcome event types (for tooling/agents). */
  outcomes?: string[];
  /**
   * How to author this beat, for a director that must emit it as JSON. Optional so a
   * host-registered beat type is not forced to document itself — but a type with no schema is
   * one a model cannot be expected to use, and `beatSchemas()` reports it as undocumented.
   */
  paramsSchema?: BeatParamsSchema;
  /**
   * Per-instance wiring: register guards/actions and return routing to splice in.
   * Optional — simple beats (Explain) need none and rely on the compiler's
   * default `on.next`.
   */
  wire?(params: P, id: StateId, ctx: BeatWireCtx): BeatWiring;
}

/** The render half. */
export interface RenderableBeat<P = Json> extends BeatDef<P> {
  render(params: P, state: string, ctx: LessonContext): RenderIntent[];
  /**
   * Optional TIMED half (video subsystem): the beat's animation as a Storyboard.
   * Beats without it are instant; a Player samples this over beat time `t` and
   * emits the advance event at the end. `render()` may return the t=end snapshot.
   */
  storyboard?(params: P, state: string, ctx: LessonContext): Storyboard;
}

/**
 * Name → RenderableBeat, used by both the compiler and the renderer. Params are
 * `any` here because at registry level they originate from the JSON IR and are
 * dispatched dynamically by type; each concrete beat keeps its precise P.
 */
export type BeatRegistry = Record<string, RenderableBeat<any>>;

/** Extract the leaf state name for a beat id from a (nested) StateValue. Pure. */
export function leafState(state: StateValue, beatId: string): string {
  let cur: StateValue = state;
  while (typeof cur !== "string") {
    const key = Object.keys(cur)[0]!;
    const child = cur[key]!;
    if (key === beatId) return typeof child === "string" ? child : leafName(child);
    cur = child;
  }
  return cur;
}

function leafName(v: StateValue): string {
  return typeof v === "string" ? v : leafName(v[Object.keys(v)[0]!]!);
}

/** Helper: build the opaque `meta` payload the renderer reads back. */
export function beatMeta(type: string, params: Json): Json {
  return { beat: { type, params } };
}
