// Presentation-agnostic template description. Binds the two axes:
//   layout      → WHERE each slot sits (slot map + arrangement)
//   components  → HOW each content `kind` renders (registry; value type R is
//                 renderer-specific, so this layer stays renderer-free)
//   theme       → tokens both consume
// Pure data. No React/DOM here.

import type { SlotName } from "@lessonkit/render-contract";
import type { Theme } from "./theme.js";

export interface Region {
  gridArea: string;
  [k: string]: unknown; // renderer-specific placement extensions
}

export interface Template<R> {
  layout: {
    slots: Record<SlotName, Region>;
    /** renderer-interpreted arrangement directive (e.g. a CSS grid-template). */
    arrangement: string;
  };
  components: Record<string /* intent kind */, R>;
  theme: Theme;
}
