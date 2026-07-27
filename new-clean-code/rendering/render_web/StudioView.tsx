// StudioView: the live co-play chrome. It subscribes to a LiveProgram and renders a
// 2-row shell — a split body (persistent shared workspace on the left · the unified
// append-only conversation on the right) above an always-on Composer. There is NO
// transport bar, NO captions, and NO back/forward trail (contrast VideoView): the live
// host is clockless, and the learner drives progress by acting. The conversation is the
// shared ConversationLog; the current beat's live interactive surface renders inside its
// turn. The Composer is docked at every moment so the learner can ask or interrupt.
//
// Renderer-pure: it imports LiveProgram/LiveFrame as TYPES only and never reaches into
// the lesson/engine layers — a `message.submit` player move is built as a plain event,
// the same way the beat components construct their own events.

import React from "react";
import type { RenderIntent, RichText } from "@lessonkit/render-contract";
import { defaultTheme, type Theme } from "@lessonkit/template";
import type { NarrationAudio } from "@lessonkit/audio";
import type { LiveFrame, LiveProgram } from "@lessonkit/live";
import { ConversationLog, nonEmptyStage, renderIntents } from "./conversation.js";
import { htmlAudioSink } from "./htmlAudioSink.js";
import { Composer } from "./Composer.js";
import { RichTextView } from "./richtext.js";

function useLiveFrame(program: LiveProgram): LiveFrame {
  const [frame, setFrame] = React.useState<LiveFrame>(() => program.frame());
  React.useEffect(() => program.subscribe(setFrame), [program]);
  return frame;
}

/**
 * Speak a beat's narration ONCE on entry. The live host stays clockless: the frame carries
 * only the narration STRING, and this renderer-side effect turns it into audio — POSTing the
 * text to the dev `/api/tts` proxy (the key stays server-side), caching the clip per beat (so
 * stepping back/forward never refetches), and playing it via the one-shot `htmlAudioSink`.
 * A missing key / muted tab / autoplay block is a silent no-op — narration is enhancement, not
 * a dependency. Not word-synced to the storyboard rAF (no shared clock); acceptable for v1.
 */
function useNarration(activeBeatId: string, narration: string | undefined): void {
  const sink = React.useMemo(() => htmlAudioSink(), []);
  const clips = React.useRef(new Map<string, NarrationAudio>());
  React.useEffect(() => () => sink.pause(), [sink]); // stop audio on unmount

  React.useEffect(() => {
    if (!narration) return;
    const beatId = activeBeatId;
    const cached = clips.current.get(beatId);
    if (cached) {
      sink.load(beatId, cached);
      sink.play();
      return;
    }
    let cancelled = false;
    fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: narration }) })
      .then((r) => r.json())
      .then((data: { audio?: string; mime?: string; durationMs?: number; words?: unknown[]; error?: string }) => {
        if (cancelled || data.error || !data.audio) return;
        const clip: NarrationAudio = {
          audio: data.audio,
          mime: data.mime ?? "audio/mpeg",
          durationMs: data.durationMs ?? 0,
          words: (data.words ?? []) as NarrationAudio["words"],
        };
        clips.current.set(beatId, clip);
        sink.load(beatId, clip);
        sink.play();
      })
      .catch(() => {}); // network/muted → play nothing
    return () => {
      cancelled = true; // beat changed before the clip arrived → don't play it late
    };
  }, [activeBeatId, narration, sink]);
}

export interface StudioViewProps {
  program: LiveProgram;
  theme?: Theme;
  title?: RichText;
  eyebrow?: string;
  /** notebook-style authored explainer prose per beat (book/blog). */
  article?: Record<string, RichText>;
  /** caption-style running text per beat (fallback body when no `article`). */
  transcript?: Record<string, RichText>;
  /** Composer placeholder copy. */
  placeholder?: string;
}

export function StudioView(props: StudioViewProps): React.ReactElement {
  const theme = props.theme ?? defaultTheme;
  const { program } = props;
  const frame = useLiveFrame(program);
  const send = program.send;

  // Speak the active beat's narration on entry (renderer-side; the live layer stays clockless).
  useNarration(frame.activeBeatId, frame.narration);

  // A host layers its authored prose on top: `article` (book/blog) preferred, else the
  // caption-style `transcript`. Learner turns carry their own words, so never a body.
  const bodyOf = (id: string): RichText | undefined => (props.article ? props.article[id] : undefined) ?? props.transcript?.[id];

  // Each turn's persisted VISUAL, rendered inline in the conversation: re-derive the beat's
  // stage intents (pure, via the program) and render them with beat-scoped keys so every
  // step's figure mounts once and persists. Only the ACTIVE step animates (autoplay); past
  // steps hold a static final frame — so the scrolling log becomes the step-by-step "video".
  const stageOf = React.useCallback(
    (beatId: string): React.ReactNode => {
      const intents = nonEmptyStage(program.renderBeat(beatId, { autoplay: beatId === frame.activeBeatId }).intents).map((i) =>
        i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i,
      );
      return intents.length ? <div style={{ marginTop: theme.space(3) }}>{renderIntents(intents, theme, send, `${beatId}:`)}</div> : null;
    },
    [program, frame.activeBeatId, theme, send],
  );

  // stage fills its panel (letterboxed) via a per-intent fit hint the layout adds.
  const stage = nonEmptyStage(frame.model.intents).map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));
  const prompt = frame.model.intents.filter((i) => i.slot === "prompt");
  const prose = frame.model.intents.filter((i) => i.slot === "prose");

  // The current beat's live interactive surface — hosted inside its own turn by ConversationLog.
  const liveBlock = prose.length || prompt.length ? (
    <div style={{ marginTop: theme.space(3), display: "flex", flexDirection: "column", gap: theme.space(3) }}>
      {prose.length ? renderIntents(prose, theme, send) : null}
      {prompt.length ? renderIntents(prompt, theme, send) : null}
    </div>
  ) : null;

  const barBg: React.CSSProperties = { background: theme.color.surface, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: theme.color.bg, color: theme.color.fg, fontFamily: theme.font.body }}>
      {/* Row 1 — problem / eyebrow bar */}
      {props.eyebrow || props.title ? (
        <div style={{ flex: "0 0 auto", padding: `${theme.space(3)} ${theme.space(6)}`, borderBottom: `1px solid ${theme.color.borderSubtle}`, ...barBg }}>
          {props.eyebrow ? <div style={{ color: theme.color.accent, fontSize: theme.font.size.eyebrow, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase" }}>{props.eyebrow}</div> : null}
          {props.title ? <div style={{ marginTop: props.eyebrow ? theme.space(1) : 0, fontSize: theme.font.size.heading, fontWeight: theme.font.weight.semibold, lineHeight: 1.3 }}><RichTextView value={props.title} /></div> : null}
        </div>
      ) : null}

      {/* Row 2 — split body: persistent shared workspace | conversation */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: "0 0 50%", boxSizing: "border-box", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: theme.space(5), minWidth: 0, minHeight: 0 }}>
          {stage.length ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{renderIntents(stage, theme, send)}</div> : null}
          {frame.thinking ? (
            <div style={{ position: "absolute", top: theme.space(4), right: theme.space(4), fontSize: theme.font.size.eyebrow, color: theme.color.accent, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase", opacity: 0.8 }}>
              ✨ Thinking…
            </div>
          ) : null}
        </div>
        <ConversationLog
          turns={frame.transcript}
          theme={theme}
          send={send}
          liveBlock={liveBlock}
          done={frame.done}
          title={props.title}
          bodyOf={bodyOf}
          stageOf={stageOf}
          scrollerStyle={{ flex: "0 0 50%", boxSizing: "border-box", minWidth: 0, overflowY: "auto", overflowX: "hidden", minHeight: 0, borderLeft: `1px solid ${theme.color.borderSubtle}`, padding: `${theme.space(6)} ${theme.space(6)} ${theme.space(10)}` }}
        />
      </div>

      {/* Row 3 — always-on Composer (say anytime / interrupt) */}
      <div style={{ flex: "0 0 auto", borderTop: `1px solid ${theme.color.borderSubtle}`, padding: `${theme.space(3)} ${theme.space(6)}`, ...barBg }}>
        <Composer theme={theme} thinking={frame.thinking} placeholder={props.placeholder} onSubmit={(text) => send({ type: "message.submit", payload: { text } })} />
      </div>
    </div>
  );
}
