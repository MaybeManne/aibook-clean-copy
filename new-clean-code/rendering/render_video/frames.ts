// Pure frame planning: walk a lesson's beat path and, for each TIMED beat,
// sample its storyboard at frame times → an SVG per frame (burning in captions).
// Reuses the same `sampleAt` + `snapshotToSvg` as interactive playback, so
// exported frames match the preview. No canvas, no encoder, no I/O — fully
// testable offline. Rasterization + muxing happen in later, adapter-driven steps.

import type { StateValue } from "@lessonkit/state-machine";
import { sampleAt } from "@lessonkit/timeline";
import type { AudioManifest, CaptionSegment, NarrationAudio } from "@lessonkit/audio";
import { activeCaption } from "@lessonkit/audio";
import { type CompiledLesson, initialContext, type EventRecord } from "@lessonkit/lesson";
import { defaultTheme, type Theme } from "@lessonkit/template";
import { frameSvg, frameFigureSvg, getFigure } from "./svg.js";

export interface FrameSpec {
  index: number; // global frame index across the whole video
  t: number; // beat time (ms) this frame samples
  svg: string;
}
export interface BeatFrames {
  beatId: string;
  durationMs: number;
  frames: FrameSpec[];
  audio?: NarrationAudio;
}
export interface FramePlan {
  fps: number;
  totalFrames: number;
  beats: BeatFrames[];
}

export interface PlanOptions {
  fps?: number; // default 30
  theme?: Theme;
  /** Recorded path (from a Session's history) to pick branches; default = spine. */
  history?: EventRecord[];
  audio?: AudioManifest;
  captions?: Record<string, CaptionSegment[]>;
  size?: { width?: number; height?: number };
}

const leaf = (s: StateValue): string => (typeof s === "string" ? s : Object.keys(s)[0]!);

/** The ordered beat ids to render: from history if given, else the default spine. */
function beatOrder(lesson: CompiledLesson, history?: EventRecord[]): string[] {
  if (history && history.length) {
    const ids = [leaf(lesson.chart.initial as unknown as StateValue)];
    for (const r of history) ids.push(leaf(r.to));
    return ids.filter((id, i) => i === 0 || id !== ids[i - 1]); // drop consecutive dupes
  }
  const order: string[] = [];
  const seen = new Set<string>();
  let id: string | null = lesson.chart.initial;
  while (id && !seen.has(id)) {
    seen.add(id);
    order.push(id);
    id = lesson.chart.states[id]?.on?.next?.[0]?.target ?? null;
  }
  return order;
}

/** Resolve a beat's storyboard (timed beats only; others → null). */
function storyboardFor(lesson: CompiledLesson, id: string) {
  const meta = lesson.chart.states[id]?.meta as { beat?: { type: string; params: unknown } } | undefined;
  const ref = meta?.beat;
  if (!ref) return null;
  const def = lesson.beats[ref.type];
  if (!def?.storyboard) return null;
  return def.storyboard(ref.params as never, id, initialContext());
}

/** Build the full frame plan for a compiled (narration-prepared) lesson. Pure. */
export function planFrames(lesson: CompiledLesson, opts: PlanOptions = {}): FramePlan {
  const fps = opts.fps ?? 30;
  const theme = opts.theme ?? defaultTheme;
  const dtMs = 1000 / fps;
  const beats: BeatFrames[] = [];
  let index = 0;

  for (const id of beatOrder(lesson, opts.history)) {
    const sb = storyboardFor(lesson, id);
    if (!sb) continue; // non-timed beat: no frames (kept out of the video)
    const segs = opts.captions?.[id];
    const count = Math.max(1, Math.ceil(sb.duration / dtMs));
    const frames: FrameSpec[] = [];
    const figureName = sb.viz && getFigure(sb.viz.name) ? sb.viz.name : null;
    for (let i = 0; i < count; i++) {
      const t = Math.min(i * dtMs, sb.duration);
      const cap = segs ? activeCaption(segs, t) : null;
      const capArg = cap ? { words: cap.words, active: cap.active } : null;
      const snap = sampleAt(sb, t);
      const svg = figureName
        ? frameFigureSvg(figureName, sb.viz!.props ?? {}, t, theme, snap.viewBox.w, snap.viewBox.h, capArg, opts.size)
        : frameSvg(snap, theme, capArg, opts.size);
      frames.push({ index: index++, t, svg });
    }
    beats.push({ beatId: id, durationMs: sb.duration, frames, audio: opts.audio?.[id] });
  }
  return { fps, totalFrames: index, beats };
}
