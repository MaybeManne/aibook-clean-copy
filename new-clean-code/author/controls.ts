// Control descriptors for the demo builder. An author writes controls as an OBJECT
// keyed by the value name — `{ n: slider(1, 50, 4) }` — which is nicer than the
// engine's flat `ControlSpec[]` + separate `defaults` map. `toControls` lowers the
// object to exactly that pair and (optionally) appends the `__next` Continue button.
// Pure — no React, no DOM.

import type { ControlSpec, ControlValue } from "@lessonkit/render-contract";

export interface ControlDescriptor {
  kind: "slider" | "toggle" | "button";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  default: ControlValue;
}

/** A numeric slider. `slider(min, max, default?, { step, unit, label })`. */
export function slider(
  min: number,
  max: number,
  def = min,
  opts: { step?: number; unit?: string; label?: string } = {},
): ControlDescriptor {
  return { kind: "slider", min, max, step: opts.step ?? 1, unit: opts.unit, label: opts.label, default: def };
}

/** A boolean toggle. */
export function toggle(def = false, opts: { label?: string } = {}): ControlDescriptor {
  return { kind: "toggle", label: opts.label, default: def };
}

/** A plain action button (emits `demo.action {key}`; the reserved key `__next` advances). */
export function button(label: string): ControlDescriptor {
  return { kind: "button", label, default: false };
}

/**
 * Lower a controls object → the engine's `{ ControlSpec[], defaults }`. Buttons carry
 * no default value. Appends a Continue (`__next`) button unless `includeNext` is false
 * (e.g. a terminal beat, where it would be a dead no-op — see the explorable beat, which
 * already hides `__next` in guided mode until the goal is met).
 */
export function toControls(
  obj: Record<string, ControlDescriptor>,
  opts: { includeNext: boolean } = { includeNext: true },
): { controls: ControlSpec[]; defaults: Record<string, ControlValue> } {
  const controls: ControlSpec[] = [];
  const defaults: Record<string, ControlValue> = {};
  for (const [key, d] of Object.entries(obj)) {
    if (d.kind === "button") {
      controls.push({ key, label: d.label ?? key, kind: "button" });
      continue;
    }
    const spec: ControlSpec = { key, label: d.label ?? key, kind: d.kind };
    if (d.kind === "slider") {
      spec.min = d.min;
      spec.max = d.max;
      spec.step = d.step;
      if (d.unit) spec.unit = d.unit;
    }
    controls.push(spec);
    defaults[key] = d.default;
  }
  if (opts.includeNext) controls.push({ key: "__next", label: "Continue →", kind: "button" });
  return { controls, defaults };
}
