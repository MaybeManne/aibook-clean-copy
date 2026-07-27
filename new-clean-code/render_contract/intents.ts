// Render intents: the typed, presentation-free description of WHAT to show. An
// intent names a `slot` (where) and a `kind` (how) — never a color or pixel.
// The union is OPEN: custom beats may emit their own `kind`.

import type { RichText } from "./richtext.js";

export type SlotName = string;

export interface Choice {
  text: string;
  picked?: boolean;
  revealedCorrect?: boolean;
}

export type McqViewState = "unanswered" | "answered" | "revealed";

export interface VisualRef {
  kind: "image" | "shape" | "embed";
  src?: string;
  data?: unknown;
}

/** One interactive control in an explorable demo. `button` with key "__next" advances. */
export interface ControlSpec {
  key: string;
  label: string;
  kind: "slider" | "toggle" | "button";
  min?: number; // slider
  max?: number; // slider
  step?: number; // slider
  unit?: string; // slider value suffix (e.g. "π")
}

export type ControlValue = number | boolean;

export type RenderIntent =
  | { kind: "text"; slot: SlotName; content: RichText; emphasis?: "normal" | "muted" | "alert" }
  | { kind: "visual"; slot: SlotName; ref: VisualRef }
  | {
      kind: "mcq";
      slot: SlotName;
      prompt: RichText;
      choices: Choice[];
      state: McqViewState;
      feedback?: RichText;
    }
  | { kind: "input"; slot: SlotName; prompt: RichText; value: string }
  | { kind: "ask"; slot: SlotName; prompt?: RichText; placeholder?: string } // conversational free-text question → ask.submit
  | {
      kind: "controls";
      slot: SlotName;
      controls: ControlSpec[];
      values: Record<string, ControlValue>;
    }
  | { kind: string; slot: SlotName; [k: string]: unknown }; // open extension

export interface ViewTransition {
  effect: "enter" | "exit" | "emphasize";
  slot: SlotName;
}

export interface RenderModel {
  intents: RenderIntent[];
  transitions?: ViewTransition[];
}

/** Group intents by slot. Renderers iterate regions and pull their intents. Pure. */
export function bySlot(model: RenderModel): Record<SlotName, RenderIntent[]> {
  const out: Record<SlotName, RenderIntent[]> = {};
  for (const intent of model.intents) {
    (out[intent.slot] ??= []).push(intent);
  }
  return out;
}

/** Type guard for narrowing the open union by `kind` (the union defeats control-flow narrowing). */
export function isKind<K extends string>(
  intent: RenderIntent,
  kind: K,
): intent is Extract<RenderIntent, { kind: K }> {
  return intent.kind === kind;
}
