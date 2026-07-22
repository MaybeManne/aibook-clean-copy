// The structured per-frame output of the video layer. Captions are a FIRST-CLASS
// track (not mixed into the intent soup), so the renderer places them in dedicated
// chrome instead of guessing a slot. Depends on render_contract + timeline types.

import type { RenderIntent, RenderModel, RichText, SlotName } from "@lessonkit/render-contract";
import { captionIntent, type CaptionWord } from "@lessonkit/timeline";

export interface CaptionTrack {
  text: RichText;
  words?: CaptionWord[];
  active: number; // index of the word active now, or -1
}

export interface VideoFrame {
  /** stage / prompt / prose intents only — caption is NOT mixed in here. */
  model: RenderModel;
  /** the transport-owned caption for this instant, or null. */
  caption: CaptionTrack | null;
  /** playback state for controls + progress. */
  transport: import("./transport.js").TransportState;
}

/** Bridge: render a caption track as a slot-routed intent (backward-compat hosts). */
export function captionAsIntent(track: CaptionTrack, slot: SlotName = "caption"): RenderIntent {
  return captionIntent(slot, track.text, { words: track.words, active: track.active });
}
