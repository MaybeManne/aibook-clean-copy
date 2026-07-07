# Spec 05 — `rendering/render_web/`

A concrete renderer: React for the web. Consumes a `RenderModel` + a `Template`
and emits DOM, pushing `MachineEvent`s back up through a `send` callback.

**It does not import the engine or the lesson layer.** It knows only the render
contract (what to draw) and the template (where/how). The glue that binds a
`Session` to this renderer lives in the app/example layer (`useSession`), so the
renderer stays reusable and engine-free.

Depends on `render_contract` + `template`. Modules: `components.tsx`,
`Template.tsx`, `richtext.tsx`, `index.ts`. (`useSession` is specified here but
ships in the example layer.)

---

## Component contract

```ts
import type { MachineEvent } from "@lessonkit/state-machine"; // TYPE-ONLY import
import type { RenderIntent } from "@lessonkit/render-contract";
import type { Theme } from "@lessonkit/template";

/** Props every kind-component receives. */
export interface ComponentProps<I extends RenderIntent = RenderIntent> {
  intent: I;
  theme: Theme;
  /** push an event back to the host (Session). The renderer is otherwise stateless. */
  send: (event: MachineEvent) => void;
}

/** A React component for one intent kind. */
export type ComponentFor = (props: ComponentProps) => React.ReactElement | null;
```

> The `MachineEvent` import is **type-only** (`import type`) — no runtime
> dependency on the engine. The renderer emits well-formed event objects; it does
> not run transitions.

### Built-in components (one per known intent kind)

Each narrows its intent with `Extract<RenderIntent, { kind: ... }>` (per spec 02
narrowing note) and styles purely from `theme` tokens:

```ts
declare const TextComp:    ComponentFor;  // renders RichText, emphasis → theme color
declare const VisualComp:  ComponentFor;  // renders VisualRef (img / placeholder)
declare const McqComp:     ComponentFor;  // prompt + choice buttons + feedback + Continue
declare const FallbackComp: ComponentFor; // typed placeholder for unregistered kinds

/** The default component registry (the `R` for Template<ComponentFor>). */
export const defaultComponents: Record<string, ComponentFor>; // { text, visual, mcq }
```

**McqComp behavioral contract:**
- Before answering (`state === "unanswered"`): choices are enabled buttons;
  clicking choice `i` calls `send({ type: "mcq.answer", payload: { choice: i } })`;
  no Continue button.
- After answering: choices disabled; picked/correct styled via
  `theme.color.wrong`/`correct`; `feedback` shown if present; a **Continue**
  button calls `send({ type: "next" })`.

---

## `richtext.tsx` — RichText → React

```ts
import type { RichText } from "@lessonkit/render-contract";
export function RichTextView(props: { value: RichText }): React.ReactElement;
// → maps marks (strong/em/code) to elements; paragraphs to <p>. Pure render.
```

---

## `Template.tsx` — slot layout + dispatch

```ts
import type { MachineEvent } from "@lessonkit/state-machine";   // type-only
import type { RenderModel } from "@lessonkit/render-contract";
import type { Template } from "@lessonkit/template";
import type { ComponentFor } from "./components.js";

/** The concrete web template type. */
export type WebTemplate = Template<ComponentFor>;

/** A ready-to-use default (layout + defaultComponents + defaultTheme). */
export const defaultTemplate: WebTemplate;

export interface TemplateViewProps {
  model: RenderModel;
  template?: WebTemplate;          // defaults to defaultTemplate
  send: (event: MachineEvent) => void;
}

/**
 * Render one RenderModel through a template:
 *  - bySlot(model) groups intents by slot.
 *  - For each slot in template.layout.slots, place a region (gridArea) and
 *    render its intents, dispatching each to template.components[kind] or
 *    FallbackComp.
 * Stateless: all state lives in the host Session; events go out via `send`.
 */
export function TemplateView(props: TemplateViewProps): React.ReactElement;
```

---

## Glue: `useSession` (ships in the example/app layer, not in render_web)

Specified here for completeness; it is the ONLY place the renderer and the
lesson `Session` meet, so it lives at the app layer to keep both reusable.

```ts
import type { CompiledLesson } from "@lessonkit/lesson";
import type { MachineEvent } from "@lessonkit/state-machine";
import type { RenderModel } from "@lessonkit/render-contract";

export interface UseSession {
  model: RenderModel;
  send: (event: MachineEvent) => void;   // wraps Session.send + triggers re-render
  done: boolean;
  activeBeatId: string;
}

export function useSession(lesson: CompiledLesson): UseSession;
// → creates a Session (memoized), re-renders on each send. React-binding only.
```

---

## `index.ts` — public surface (render_web)

Re-exports `components` (ComponentProps, ComponentFor, defaultComponents),
`Template` (WebTemplate, defaultTemplate, TemplateView), `richtext` (RichTextView).
Does **not** export `useSession` (that's app-layer glue).

## Forward-compat: a second renderer

A `render_video/` package would implement the same shape against
`Template<FrameEmitter>` instead of `Template<ComponentFor>`, consuming the same
`RenderModel` + `ViewTransition`s (as tweens). No change to lesson, contract, or
template-data layers — the proof that the separation holds.
