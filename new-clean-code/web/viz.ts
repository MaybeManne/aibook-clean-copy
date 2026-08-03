import type { MachineEvent } from "@lessonstudio/state-machine";
import type { Theme } from "@lessonstudio/theme";

export interface VizProps {
  /** Beat clock (ms) when this viz is driven by a timed beat. */
  t?: number;
  [key: string]: unknown;
}

/**
 * The OUTBOUND channel — the mirror of `props`. A registered viz reports the learner's SEMANTIC
 * interaction back into the session so the tutor can observe and respond:
 *   • control writes   → `demo.set { key, value }` (recorded on the blackboard, replayable —
 *     the same event a slider emits, but authored by the viz);
 *   • semantic signals → `signal.viz.*` (e.g. `signal.viz.diverged`) that the active beat's
 *     `routes` (or a policy) map to a pre-authored destination.
 *
 * Only meaning flows here. Ephemeral render state — camera angle, in-flight drag deltas,
 * animation phase — stays inside the viz and is never sent, so replay and snapshots stay clean.
 */
export interface VizApi {
  send: (event: MachineEvent) => void;
  /**
   * The theme at mount time — a canvas/WebGL viz has to paint its own ground, so it needs the same
   * tokens the declarative figures get. Later switches arrive via `VizHandle.setTheme`, NOT by
   * remounting.
   */
  theme: Theme;
}

export interface VizHandle {
  /** Called on every frame/prop change. Read props.t for time-driven animation. */
  update?(props: VizProps): void;
  /**
   * The theme changed. Repaint — do NOT rebuild.
   *
   * A viz is mounted once and deliberately kept alive across beats (`persistent`), holding state the
   * engine cannot see: a camera pose, a drag in flight. Tearing it down on a dark/light switch would
   * throw that away and snap the learner's viewpoint back to the default, so the host calls this
   * instead of remounting. A viz that ignores it simply keeps its original colours.
   */
  setTheme?(theme: Theme): void;
  /**
   * OPTIONAL export bridge. A registered viz is opaque to the engine — it is not a SceneNode
   * tree, so `sampleAt` cannot rasterize it and a canvas/WebGL beat would otherwise be a hole in
   * any static export. Returning a data URL or an SVG string for the CURRENT state closes it, at
   * the viz's own discretion.
   */
  poster?(): string | null;
  /** Tear down listeners/timers/DOM. */
  destroy?(): void;
}

export type VizFactory = (el: HTMLElement, props: VizProps, api: VizApi) => VizHandle;

const registry = new Map<string, VizFactory>();

/** Register (or replace) a named visualization. */
export function registerViz(name: string, factory: VizFactory): void {
  registry.set(name, factory);
}

export function getViz(name: string): VizFactory | undefined {
  return registry.get(name);
}
