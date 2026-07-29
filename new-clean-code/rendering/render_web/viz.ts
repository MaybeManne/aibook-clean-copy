// Viz registry: the escape hatch for arbitrary visualizations. An author (or an
// AI) registers a named factory that mounts ANY JS/DOM/canvas/SVG/WebGL into a
// container and exposes `update(props)` (called each frame with the beat clock
// `t`) + `destroy()`. The engine/timeline only carry the name + props — arbitrary
// code lives here at the render leaf, so replay/state stay pure. Browser only.
//
// `MachineEvent` is a TYPE-ONLY import (like the component registry) — this file
// carries no runtime dependency on the engine.
import type { MachineEvent } from "@lessonstudio/state-machine";

export interface VizProps {
  /** Beat clock (ms) when this viz is driven by a timed beat. */
  t?: number;
  [key: string]: unknown;
}

/**
 * The OUTBOUND channel — the mirror of `props`. A registered viz reports the
 * learner's SEMANTIC interaction back into the session so the tutor can observe
 * and respond:
 *   • control writes  → `demo.set { key, value }` (recorded on the blackboard,
 *     replayable — the same event a slider emits, but authored by the viz);
 *   • semantic signals → `signal.viz.*` (e.g. `signal.viz.diverged`) that the
 *     active beat's `routes` (or a policy) map to a pre-authored destination.
 *
 * Governing rule (see docs/VISION.md): only meaning flows here. Ephemeral render
 * state — camera angle, in-flight drag deltas, animation phase — stays inside the
 * viz and is never sent, so replay/snapshot/analytics stay clean.
 */
export interface VizApi {
  send: (event: MachineEvent) => void;
}

export interface VizHandle {
  /** Called on every frame/prop change. Read props.t for time-driven animation. */
  update?(props: VizProps): void;
  /**
   * OPTIONAL export bridge. A registered viz is opaque to the engine — it is not a
   * SceneNode tree, so `sampleAt` cannot rasterize it and a canvas/WebGL beat would
   * otherwise be a hole in any static export (and give lessonForge's screenshot
   * reviewer nothing to look at). Returning a data URL or an SVG string for the
   * CURRENT state closes that hole at the viz's own discretion.
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
