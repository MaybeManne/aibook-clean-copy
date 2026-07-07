# Spec 04 — `template/`

Presentation-agnostic description of *where* content goes (slots → regions) and
the design tokens (theme). **Pure data — no React, no DOM.** A concrete renderer
(spec 05) interprets these. Keeping this layer renderer-free is what lets the
same template description target web today and video later.

Depends on `render_contract` (for `SlotName`). Modules: `theme.ts`, `template.ts`.

---

## `theme.ts` — design tokens

```ts
/** Tokens consumed by components. Reskinning = swap this object only. */
export interface Theme {
  color: {
    bg: string; fg: string; muted: string; alert: string; accent: string;
    correct: string; wrong: string;
    choiceBg: string; choiceBorder: string;
  };
  radius: string;
  /** spacing scale: space(n) → a CSS length. */
  space: (n: number) => string;
  font: { body: string; mono: string };
}

export const defaultTheme: Theme;
```

> The theme is intentionally a flat token bag, not CSS. A video renderer reads
> the same `color`/`space` tokens to drive frame styling.

---

## `template.ts` — layout (slots → regions) + component binding

```ts
import type { SlotName } from "@lessonkit/render-contract";
import type { Theme } from "./theme.js";

/** Placement of a slot. Web uses gridArea; other renderers may add fields. */
export interface Region {
  gridArea: string;
  [k: string]: unknown;          // renderer-specific placement extensions
}

/**
 * A Template binds the two presentation axes:
 *   layout      → WHERE each slot is placed (the slot map + arrangement)
 *   components  → HOW each content `kind` renders (the component registry)
 *   theme       → tokens both consume
 *
 * `components` is typed by the renderer (spec 05) since its value type is
 * renderer-specific (React components for web, frame emitters for video). This
 * layer specifies only the SHAPE; the value type is a renderer parameter `R`.
 */
export interface Template<R> {
  layout: {
    slots: Record<SlotName, Region>;
    /** renderer-interpreted arrangement directive (e.g. a CSS grid-template). */
    arrangement: string;
  };
  components: Record<string /* intent kind */, R>;
  theme: Theme;
}
```

### Contract notes

- **Slots are the "where" axis, components the "how" axis** — independent. The
  same `RenderModel` through a different `Template` lays out and styles
  differently with zero lesson changes.
- A `kind` with no registered component MUST resolve to a renderer-provided
  **typed placeholder** (never a crash) — the open-intent-kind guarantee from
  spec 02. The placeholder component is supplied by the renderer, not here.
- `Template<R>` is generic over the component value type `R` so this package
  stays renderer-free; spec 05 instantiates `R = ComponentFor` (React).

---

## `index.ts` — public surface

Re-exports `theme` (Theme, defaultTheme) and `template` (Region, Template).

> `defaultTemplate` is NOT defined here — a default *needs* concrete components,
> so it lives in the renderer (spec 05). This package ships only the data shapes
> + tokens.
