// The structured per-frame output of the live layer. Contrast video/render_model.ts:
// there is NO caption track and NO transport here — the live host is clockless, so a
// "frame" is just the render model + the unified conversation + the two flags a co-play
// UI needs (is the lesson over, and is the agent mid-thought). Depends only on
// render_contract + the lesson-layer transcript type.

import type { RenderModel } from "@lessonstudio/render-contract";
import type { Annotation, FocusState, HoldState, Turn } from "@lessonstudio/lesson";

export interface LiveFrame {
  /** stage / prompt / prose intents for the shared workspace (same shape as video). */
  model: RenderModel;
  /** the unified, append-only conversation — a pure projection of session history. */
  transcript: Turn[];
  /** the currently-active beat id (the live interaction surface). */
  activeBeatId: string;
  /** the active beat's SPOKEN narration script, if any (a pure string — no audio, no clock).
   *  A renderer may synthesize + play it (see StudioView); the live layer stays clockless. */
  narration?: string;
  /** the lesson has reached a terminal beat. */
  done: boolean;
  /** the agent is authoring an answer — the active leaf is a synthesized `__ask-*` node.
   *  A host shows a "thinking…" affordance and keeps the Composer live for interrupts. */
  thinking: boolean;
  /**
   * WHERE WE ARE LOOKING, set by a director (`focus`). Normalized 0..1 over the stage panel,
   * so the host applies it as a transform on the panel rather than asking the visual to
   * cooperate — one implementation serves an SVG figure, a Canvas2D viz and the WebGL
   * apparatus alike. Null = the whole stage.
   */
  focus: FocusState | null;
  /** Marks drawn OVER the stage, in the same normalized space. Empty = nothing drawn. */
  annotations: Annotation[];
  /** The director has paused the learner while setting something up (`hold`). Null = free
   *  to advance. A host suppresses its derived Continue and says why. */
  hold: HoldState | null;
}
