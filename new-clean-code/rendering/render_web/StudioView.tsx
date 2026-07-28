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
import type { RenderIntent, RichText } from "@lessonstudio/render-contract";
import { defaultStudioLayout, defaultTheme, type StudioLayout, type Theme } from "@lessonstudio/template";
import { IDLE_STATUS, type NarrationAudio } from "@lessonstudio/audio";
import type { LiveFrame, LiveProgram } from "@lessonstudio/live";
import { ConversationLog, nonEmptyStage, renderIntents } from "./conversation.js";
import { htmlAudioSink } from "./htmlAudioSink.js";
import { Composer } from "./Composer.js";
import { RichTextView } from "./richtext.js";

function useLiveFrame(program: LiveProgram): LiveFrame {
  const [frame, setFrame] = React.useState<LiveFrame>(() => program.frame());
  React.useEffect(() => program.subscribe(setFrame), [program]);
  return frame;
}

/** What the learner-facing narration control needs to know and do. */
interface NarrationControl {
  /** The active beat has narration at all — nothing to control otherwise. */
  present: boolean;
  /** A clip is selected (it may still be synthesizing on the first visit to a beat). */
  loaded: boolean;
  playing: boolean;
  /** The clip ran out: the control offers "replay" rather than "resume". */
  ended: boolean;
  /** The learner asked for silence, so later beats stay quiet until they resume. */
  silenced: boolean;
  toggle: () => void;
}

/**
 * Speak a beat's narration ONCE on entry. The live host stays clockless: the frame carries
 * only the narration STRING, and this renderer-side effect turns it into audio — POSTing the
 * text to the dev `/api/tts` proxy (the key stays server-side), caching the clip per beat (so
 * stepping back/forward never refetches), and playing it via the one-shot `htmlAudioSink`.
 * A missing key / muted tab / autoplay block is a silent no-op — narration is enhancement, not
 * a dependency. Not word-synced to the storyboard rAF (no shared clock); acceptable for v1.
 *
 * It also returns a control, because "stop talking" is a learner move like any other. Pausing
 * is a STANDING preference, not a one-clip pause: a learner who wants to read in silence, or
 * who is listening to something else, would otherwise be re-interrupted by the very next beat.
 * So `silenced` suppresses autoplay for later beats too (their clips still load, so resuming
 * is instant), and resuming plays the current beat from where it stopped. That makes this the
 * mute toggle as well as the pause button — one control, one meaning: "narration on / off".
 */
function useNarration(activeBeatId: string, narration: string | undefined): NarrationControl {
  const sink = React.useMemo(() => htmlAudioSink(), []);
  const clips = React.useRef(new Map<string, NarrationAudio>());
  const silenced = React.useRef(false);
  // The sink (i.e. the audio element) is the source of truth for playback state; this just
  // re-renders the control when it changes, instead of mirroring `playing` into React state
  // where it could drift from what the audio is actually doing.
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => sink.subscribe?.(bump), [sink, bump]);
  React.useEffect(() => () => sink.pause(), [sink]); // stop audio on unmount

  React.useEffect(() => {
    if (!narration) return;
    const beatId = activeBeatId;
    const start = (clip: NarrationAudio): void => {
      sink.load(beatId, clip); // load even when silenced, so "resume" is instant
      if (!silenced.current) sink.play();
    };
    const cached = clips.current.get(beatId);
    if (cached) {
      start(cached);
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
        start(clip);
      })
      .catch(() => {}); // network/muted → play nothing
    return () => {
      cancelled = true; // beat changed before the clip arrived → don't play it late
    };
  }, [activeBeatId, narration, sink]);

  const status = sink.status?.() ?? IDLE_STATUS;
  const toggle = React.useCallback(() => {
    const st = sink.status?.() ?? IDLE_STATUS;
    if (st.playing) {
      silenced.current = true;
      sink.pause();
    } else {
      silenced.current = false;
      if (st.ended) sink.seek(0); // finished → replay from the top
      sink.play();
    }
    bump();
  }, [sink, bump]);

  return { present: !!narration, loaded: status.loaded, playing: status.playing, ended: status.ended, silenced: silenced.current, toggle };
}

/** Pause / play / replay glyphs, drawn rather than typed: `⏸ ▶ ↻` are tofu boxes wherever the
 *  symbol font is missing (headless Chrome, minimal Linux images), and a broken icon on the one
 *  control that stops the talking is not a cosmetic problem. Decorative — the label carries it. */
function NarrationIcon({ kind }: { kind: "pause" | "play" | "replay" }): React.ReactElement {
  const common = { width: 11, height: 11, viewBox: "0 0 12 12", fill: "currentColor", "aria-hidden": true, focusable: false } as const;
  if (kind === "pause") {
    return (
      <svg {...common}>
        <rect x="1.5" y="1" width="3" height="10" rx="0.6" />
        <rect x="7.5" y="1" width="3" height="10" rx="0.6" />
      </svg>
    );
  }
  if (kind === "play") {
    return (
      <svg {...common}>
        <path d="M2 1.2 11 6 2 10.8Z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M10.2 6a4.2 4.2 0 1 1-1.6-3.3" />
      <path d="M10.6 0.9v2.4H8.2" />
    </svg>
  );
}

/**
 * The narration pause/resume control. Its label is DERIVED from the audio element's own
 * state (via `AudioSink.status()`), never from a mirrored flag — so it cannot sit there
 * saying "Pause" over silence that autoplay policy blocked. `P` is the keyboard equivalent,
 * ignored while a text field has focus (the Composer owns typing).
 */
function NarrationButton({ theme, control }: { theme: Theme; control: NarrationControl }): React.ReactElement {
  const { toggle } = control;
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "p" && e.key !== "P") return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const label = control.playing ? "Pause narration" : control.ended ? "Replay narration" : control.loaded ? "Resume narration" : "Play narration";
  const icon = control.playing ? "pause" : control.ended ? "replay" : "play";

  return (
    <button
      onClick={toggle}
      title={`${label} (P)`}
      aria-label={label}
      aria-pressed={control.playing}
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        gap: theme.space(2),
        padding: `${theme.space(2)} ${theme.space(3)}`,
        fontFamily: theme.font.body,
        fontSize: theme.font.size.eyebrow,
        color: control.playing ? theme.color.accent : theme.color.muted,
        background: "transparent",
        border: `1px solid ${control.playing ? theme.color.accent : theme.color.borderSubtle}`,
        borderRadius: theme.radius,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <NarrationIcon kind={icon} />
      {label}
    </button>
  );
}

/**
 * The clockless model's advance affordance. A beat with no interactive surface of its own
 * (explain / scene / a narrated 3-D step) still ends on the default `next` outcome, but
 * nothing was ever there to fire it — so a narration-heavy lesson could not be played.
 *
 * It is DERIVED, not authored: if the active beat renders nothing into the `prompt` slot,
 * the learner needs a way forward, so we draw one. Beats that own their own advance (mcq
 * and freeResponse ship a "Continue →" once answered; explorable ships a `__next` button)
 * all render into `prompt`, so they suppress this automatically and never double up.
 *
 * Never auto-advances on audio end: the learner sets the pace, which is the whole premise
 * of the clockless host. `Enter`/`→`/`Space` are bound as a keyboard equivalent, ignored
 * while a text field (the Composer) has focus.
 */
function ContinueButton({ theme, onNext }: { theme: Theme; onNext: () => void }): React.ReactElement {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Enter" && e.key !== "ArrowRight" && e.key !== " ") return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return; // composer owns these keys
      e.preventDefault();
      onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext]);

  return (
    <button
      onClick={onNext}
      style={{
        justifySelf: "start",
        alignSelf: "flex-start",
        padding: `${theme.space(2)} ${theme.space(4)}`,
        background: theme.color.accent,
        color: theme.color.bg,
        border: "none",
        borderRadius: theme.radius,
        cursor: "pointer",
        fontWeight: theme.font.weight.semibold,
        fontFamily: theme.font.body,
      }}
    >
      Continue →
    </button>
  );
}

export interface StudioViewProps {
  program: LiveProgram;
  theme?: Theme;
  /** Split-screen geometry (ratio / side / single-column). Data, not hardcoded — see StudioLayout. */
  layout?: StudioLayout;
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
  const layout = props.layout ?? defaultStudioLayout;
  const { program } = props;
  const frame = useLiveFrame(program);
  const send = program.send;

  // Speak the active beat's narration on entry (renderer-side; the live layer stays clockless).
  const narration = useNarration(frame.activeBeatId, frame.narration);

  // A host layers its authored prose on top: `article` (book/blog) preferred, else the
  // caption-style `transcript`. Learner turns carry their own words, so never a body.
  const bodyOf = (id: string): RichText | undefined => (props.article ? props.article[id] : undefined) ?? props.transcript?.[id];

  // Each turn's persisted VISUAL, rendered inline in the conversation: re-derive the beat's
  // stage intents (pure, via the program) and render them with beat-scoped keys so every
  // step's figure mounts once and persists. Only the ACTIVE step animates (autoplay); past
  // steps hold a static final frame — so the scrolling log becomes the step-by-step "video".
  const stageOf = React.useCallback(
    (beatId: string): React.ReactNode => {
      const intents = nonEmptyStage(program.renderBeat(beatId, { autoplay: beatId === frame.activeBeatId }).intents)
        // A `persistent` viz is ONE apparatus living in the workspace panel — never copied
        // per turn (see VizIntent.persistent: N turns would mean N WebGL contexts).
        .filter((i) => !(i.kind === "viz" && (i as { persistent?: boolean }).persistent))
        .map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));
      return intents.length ? <div style={{ marginTop: theme.space(3) }}>{renderIntents(intents, theme, send, `${beatId}:`)}</div> : null;
    },
    [program, frame.activeBeatId, theme, send],
  );

  // stage fills its panel (letterboxed) via a per-intent fit hint the layout adds.
  const ownStage = nonEmptyStage(frame.model.intents).map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));

  // A `persistent` viz is the lesson's ONE shared apparatus, so it outlives the beat that
  // introduced it: gates (mcq/freeResponse) contribute nothing to the stage, and without
  // this the workspace would blank out — unmounting the WebGL context mid-lesson and, worse,
  // taking the figure away exactly when the learner is being asked to reason about it. We
  // therefore remember the last persistent stage viz and re-render it while the active beat
  // supplies no stage content of its own. A beat that DOES fill the stage still wins, so an
  // author can always replace the workspace.
  const persistentViz = React.useRef<RenderIntent | null>(null);
  const fresh = ownStage.find((i) => i.kind === "viz" && (i as { persistent?: boolean }).persistent);
  if (fresh) persistentViz.current = fresh;
  const stage = ownStage.length ? ownStage : persistentViz.current ? [persistentViz.current] : [];
  const prompt = frame.model.intents.filter((i) => i.slot === "prompt");
  const prose = frame.model.intents.filter((i) => i.slot === "prose");

  // Nothing in `prompt` ⇒ this beat has no way to advance itself, so supply the Continue.
  const needsContinue = !frame.done && !frame.thinking && prompt.length === 0;

  // The current beat's live interactive surface — hosted inside its own turn by ConversationLog.
  const liveBlock = prose.length || prompt.length || needsContinue ? (
    <div style={{ marginTop: theme.space(3), display: "flex", flexDirection: "column", gap: theme.space(3) }}>
      {prose.length ? renderIntents(prose, theme, send) : null}
      {prompt.length ? renderIntents(prompt, theme, send) : null}
      {needsContinue ? <ContinueButton theme={theme} onNext={() => send({ type: "next" })} /> : null}
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

      {/* Row 2 — split body: persistent shared workspace | reading (conversation + math steps).
          Geometry comes from `layout` DATA (ratio + side + split on/off), not hardcoded here. */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        {(() => {
          // The visuals panel — sized from layout.stageBasis, sited from layout.stageSide.
          const stagePanel = layout.split ? (
            <div
              key="stage"
              style={{
                flex: `0 0 ${layout.stageBasis}`,
                boxSizing: "border-box",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: theme.space(5),
                minWidth: 0,
                minHeight: 0,
                ...(layout.stageSide === "left"
                  ? { borderRight: `1px solid ${theme.color.borderSubtle}` }
                  : { borderLeft: `1px solid ${theme.color.borderSubtle}` }),
              }}
            >
              {stage.length ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{renderIntents(stage, theme, send)}</div> : null}
              {frame.thinking ? (
                <div style={{ position: "absolute", top: theme.space(4), right: theme.space(4), fontSize: theme.font.size.eyebrow, color: theme.color.accent, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase", opacity: 0.8 }}>
                  ✨ Thinking…
                </div>
              ) : null}
            </div>
          ) : null;

          // The reading panel — the accumulating notebook of steps (md + KaTeX) + live interaction.
          // Takes the remaining space; no border when it is the sole column.
          const readingPanel = (
            <ConversationLog
              key="reading"
              turns={frame.transcript}
              theme={theme}
              send={send}
              liveBlock={liveBlock}
              done={frame.done}
              title={props.title}
              bodyOf={bodyOf}
              stageOf={stageOf}
              scrollerStyle={{ flex: "1 1 0%", boxSizing: "border-box", minWidth: 0, overflowY: "auto", overflowX: "hidden", minHeight: 0, padding: `${theme.space(6)} ${theme.space(6)} ${theme.space(10)}` }}
            />
          );

          const panels = layout.stageSide === "left" ? [stagePanel, readingPanel] : [readingPanel, stagePanel];
          return panels;
        })()}
      </div>

      {/* Row 3 — always-on Composer (say anytime / interrupt), plus the narration control.
          The pause button lives here rather than in the header because the header is optional
          and this row never is: "stop talking" must always be one click away. */}
      <div style={{ flex: "0 0 auto", borderTop: `1px solid ${theme.color.borderSubtle}`, padding: `${theme.space(3)} ${theme.space(6)}`, ...barBg }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: theme.space(3) }}>
          {narration.present ? <NarrationButton theme={theme} control={narration} /> : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Composer theme={theme} thinking={frame.thinking} placeholder={props.placeholder} onSubmit={(text) => send({ type: "message.submit", payload: { text } })} />
          </div>
        </div>
      </div>
    </div>
  );
}
