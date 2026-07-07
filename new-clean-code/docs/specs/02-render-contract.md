# Spec 02 — `render_contract/`

The typed, presentation-free description of *what to show*. This is the handshake
between a lesson (which produces it) and any renderer (which consumes it).
**Imports nothing from this repo.** No React, no DOM, no engine types.

Modules: `richtext.ts`, `intents.ts`, `index.ts`.

---

## `richtext.ts` — portable rich text

A small node tree (ProseMirror-style) so spans can be highlighted/animated and
the future video renderer can tween at span granularity. A markdown parser may
feed this; the contract is the tree, not the markdown.

```ts
export type Mark = "strong" | "em" | "code";

export type RichNode =
  | { type: "text"; text: string; marks?: Mark[] }
  | { type: "paragraph"; children: RichNode[] };

export type RichText = RichNode[];

/** Convenience: a plain string → one paragraph. The 90% authoring case. */
export function text(s: string): RichText;

/** Flatten to a plain string (headless tests, alt-text, logging). Pure. */
export function toPlain(rt: RichText): string;
```

> Markdown/inline-mark parsing (`**bold**`, `$math$`) is a future helper that
> outputs `RichText`; not part of this minimal contract.

---

## `intents.ts` — render intents & model

```ts
export type SlotName = string;

/** A single MCQ option's view-state (set by the producing beat). */
export interface Choice {
  text: string;
  picked?: boolean;
  revealedCorrect?: boolean;
}

export type McqViewState = "unanswered" | "answered" | "revealed";

export interface VisualRef {
  kind: "image" | "shape" | "embed";
  src?: string;
  data?: unknown;       // renderer-interpreted payload for shape/embed
}

/**
 * A render intent names a `slot` (WHERE) and a `kind` (HOW). It never names a
 * color, font, or pixel coordinate — those belong to the template/theme.
 * The union is OPEN: custom beats may emit their own `kind`; renderers supply a
 * component or fall back to a typed placeholder.
 */
export type RenderIntent =
  | { kind: "text";   slot: SlotName; content: RichText; emphasis?: "normal" | "muted" | "alert" }
  | { kind: "visual"; slot: SlotName; ref: VisualRef }
  | { kind: "mcq";    slot: SlotName; prompt: RichText; choices: Choice[];
      state: McqViewState; feedback?: RichText }
  | { kind: "input";  slot: SlotName; prompt: RichText; value: string }
  | { kind: string;   slot: SlotName; [k: string]: unknown };  // open extension

/** Transient animation cue between steps (Manim-like; consumed by renderers). */
export interface ViewTransition {
  effect: "enter" | "exit" | "emphasize";
  slot: SlotName;
}

/** The complete description of one rendered step. */
export interface RenderModel {
  intents: RenderIntent[];
  transitions?: ViewTransition[];
}

/** Group intents by slot. Renderers iterate regions and pull their intents. Pure. */
export function bySlot(model: RenderModel): Record<SlotName, RenderIntent[]>;
```

### Narrowing note (binding contract for renderers)

The open `{ kind: string; ... }` member defeats TypeScript discriminated-union
narrowing on `kind`. Renderers MUST narrow with
`Extract<RenderIntent, { kind: "mcq" }>` (or a provided helper) rather than
relying on control-flow narrowing. A helper may be added:

```ts
export function isKind<K extends string>(
  intent: RenderIntent, kind: K,
): intent is Extract<RenderIntent, { kind: K }>;   // → type guard
```

---

## `index.ts` — public surface

Re-exports all of `richtext` and `intents`.

### Video kinds are open-extension, defined upstream (dependency rule)

The video subsystem's `scene` and `caption` intents are **not** added to this
union — `render_contract` imports nothing, and `scene` references `SceneSnapshot`
which lives in `timeline` (a dependent layer). They ride the open
`{ kind: string; ... }` member, and their typed forms (`SceneIntent`,
`CaptionIntent`) are defined in `timeline/` and consumed by `render_web`. The
arrow stays one-way: `timeline → render_contract`, never the reverse.

## Forward-compat notes (not in v1 contract, designed-for)

- **Sub-beat timing** (SocraticAI "say+do"): an optional `at?: number | string`
  on intents (or on `ViewTransition`) to schedule reveals on a timeline. Adding
  it is backward-compatible because intents are open structs.
- **Asset refs**: `VisualRef.kind` can grow (`video`, `three`, `jsxgraph`)
  without breaking consumers, mirroring SocraticAI's pluggable card types.
