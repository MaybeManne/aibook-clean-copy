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
  kind: "slider" | "toggle" | "button" | "choice" | "matrix";
  /**
   * button: the machine event this one sends. Default is `next` for the reserved `__next` key and
   * a `demo.action` carrying `key` for anything else.
   *
   * It exists so a beat that wires its OWN edge can render a button for it — an `explain` offering
   * two ways out of a detour names `exit.0` and `exit.1` here. One event per button keeps one edge
   * per choice in the chart, which is what makes each one separately reroutable and separately
   * visible in the machine view; the alternative (one event, a guard reading the payload) would
   * collapse them into an edge nothing can point at.
   */
  event?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** choice: a labelled row of buttons; the selected value is the numeric option value. */
  options?: { value: number; label: string }[];
  rows?: number;
  cols?: number;
  /** matrix: row-major value keys, one per cell (length rows*cols), e.g. ["k0",…,"k8"]. */
  cellKeys?: string[];
  /** matrix: value key for the divisor field, e.g. "kdiv". */
  divisorKey?: string;
  /** matrix: labelled "load" buttons; the one whose values+div match the current cells is selected. */
  presets?: { label: string; values: number[]; div: number }[];
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
  | { kind: "ask"; slot: SlotName; prompt?: RichText; placeholder?: string }
  | {
      kind: "controls";
      slot: SlotName;
      controls: ControlSpec[];
      values: Record<string, ControlValue>;
    }
  | { kind: string; slot: SlotName; [k: string]: unknown };

export interface ViewTransition {
  effect: "enter" | "exit" | "emphasize";
  slot: SlotName;
}

export interface RenderModel {
  intents: RenderIntent[];
  transitions?: ViewTransition[];
}
