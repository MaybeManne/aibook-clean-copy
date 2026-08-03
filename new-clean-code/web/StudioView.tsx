import React from "react";
import type { RenderIntent, RichText } from "@lessonstudio/intents";
import { defaultStudioLayout, defaultTheme, type StudioLayout, type Theme } from "@lessonstudio/theme";
import { IDLE_STATUS, type NarrationAudio } from "@lessonstudio/audio";
import type { LiveFrame, LiveProgram } from "@lessonstudio/live";
import { ConversationLog, nonEmptyStage, renderIntents } from "./conversation.js";
import { FocusFrame } from "./attention.js";
import { htmlAudioSink } from "./htmlAudioSink.js";
import { Composer } from "./Composer.js";
import { RichTextView } from "./richtext.js";

function useLiveFrame(program: LiveProgram): LiveFrame {
  const [frame, setFrame] = React.useState<LiveFrame>(() => program.frame());
  React.useEffect(() => program.subscribe(setFrame), [program]);
  return frame;
}

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

function useNarration(activeBeatId: string, narration: string | undefined): NarrationControl {
  const sink = React.useMemo(() => htmlAudioSink(), []);
  const clips = React.useRef(new Map<string, NarrationAudio>());
  const silenced = React.useRef(false);
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => sink.subscribe?.(bump), [sink, bump]);
  React.useEffect(() => () => sink.pause(), [sink]);

  React.useEffect(() => {
    if (!narration) return;
    const beatId = activeBeatId;
    const start = (clip: NarrationAudio): void => {
      sink.load(beatId, clip);
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
      .catch(() => {});
    return () => {
      cancelled = true;
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
      if (st.ended) sink.seek(0);
      sink.play();
    }
    bump();
  }, [sink, bump]);

  return { present: !!narration, loaded: status.loaded, playing: status.playing, ended: status.ended, silenced: silenced.current, toggle };
}

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

function ContinueButton({ theme, onNext }: { theme: Theme; onNext: () => void }): React.ReactElement {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Enter" && e.key !== "ArrowRight" && e.key !== " ") return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
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
        color: theme.color.onAccent,
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

/**
 * Publish the active theme to the DOCUMENT, not just to this subtree.
 *
 * Two things live outside React's tree and would otherwise stay dark forever: the page background
 * behind/around the fixed shell (visible during overscroll, and before React mounts), and the
 * scrollbar, which is styled by a static rule in each example's `index.html`. Both read the custom
 * properties written here, so a mode switch reaches them. `color-scheme` additionally tells the
 * browser to theme native widgets — form controls, the scrollbar gutter itself.
 */
function useDocumentTheme(theme: Theme): void {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const prev = { scheme: root.style.colorScheme, bg: document.body.style.background };
    root.style.colorScheme = theme.mode;
    document.body.style.background = theme.color.bg;
    root.style.setProperty("--ls-bg", theme.color.bg);
    root.style.setProperty("--ls-fg", theme.color.fg);
    root.style.setProperty("--ls-scrollbar", theme.color.scrollbar);
    root.dataset.lsTheme = theme.name;
    root.dataset.lsMode = theme.mode;
    return () => {
      root.style.colorScheme = prev.scheme;
      document.body.style.background = prev.bg;
    };
  }, [theme]);
}

/** CSS identifier guard — a symbol name reaches a stylesheet, so it may not carry a selector. */
const SAFE_SYMBOL = /^[A-Za-z][A-Za-z0-9_-]*$/;

/**
 * Emit the lesson's symbol→colour map as CSS rules.
 *
 * A lesson may colour-key its symbols so `v` is the same blue in the diagram and in the equation
 * (see `examples/pinhole`). That colour is authored *meaning*, so it belongs to the lesson — but it
 * still has to be legible in both modes, and the authored TeX string is built at module load, long
 * before a theme exists. So the lesson emits `\htmlClass{ls-sym-v}{v}` and the host supplies the
 * hues for the current mode here. Switching modes restyles existing math with no re-authoring.
 */
function SymbolColors({ colors }: { colors: Record<string, string> }): React.ReactElement | null {
  const css = React.useMemo(() => {
    return Object.entries(colors)
      .filter(([name]) => SAFE_SYMBOL.test(name))
      .map(([name, color]) => `.ls-sym-${name}{color:${color.replace(/[<>{};]/g, "")}}`)
      .join("");
  }, [colors]);
  return css ? <style>{css}</style> : null;
}

function HoldNotice({ theme, reason }: { theme: Theme; reason?: string }): React.ReactElement {
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        alignItems: "center",
        gap: theme.space(2),
        padding: `${theme.space(2)} ${theme.space(4)}`,
        border: `1px solid ${theme.color.borderSubtle}`,
        borderRadius: theme.radius,
        background: theme.color.surface,
        color: theme.color.muted,
        fontSize: theme.font.size.label,
      }}
      aria-live="polite"
      data-ls-hold=""
    >
      <span aria-hidden="true" style={{ color: theme.color.alert }}>
        ⏸
      </span>
      {reason ?? "Your teacher is setting something up…"}
    </div>
  );
}

export interface StudioViewProps {
  program: LiveProgram;
  theme?: Theme;
  /** Split-screen geometry (ratio / side / single-column). Data, not hardcoded — see StudioLayout. */
  layout?: StudioLayout;
  title?: RichText;
  eyebrow?: string;
  /**
   * Host chrome for the header bar's right side — a theme toggle, a template picker, a progress
   * readout. The view never decides which of these a learner gets; see `ThemeToggle` /
   * `TemplatePicker` for the ready-made ones.
   */
  actions?: React.ReactNode;
  /** Lesson-owned symbol→colour map for the current mode; see `SymbolColors`. */
  symbolColors?: Record<string, string>;
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

  useDocumentTheme(theme);
  const narration = useNarration(frame.activeBeatId, frame.narration);

  const bodyOf = (id: string): RichText | undefined => (props.article ? props.article[id] : undefined) ?? props.transcript?.[id];

  const stageOf = React.useCallback(
    (beatId: string): React.ReactNode => {
      const intents = nonEmptyStage(program.renderBeat(beatId, { autoplay: beatId === frame.activeBeatId }).intents)
        .filter((i) => !(i.kind === "viz" && (i as { persistent?: boolean }).persistent))
        .map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));
      if (!intents.length) return null;
      // Inline figures are the ONLY figures in a single-column template, so they carry the stage's
      // chrome here: a panel in the studio, bare on the page (with room to breathe) on paper.
      const framed = theme.chrome.stageFrame;
      return (
        <div
          style={
            framed
              ? { marginTop: theme.space(3), border: `1px solid ${theme.color.stageBorder}`, borderRadius: theme.radius, background: theme.color.stage, padding: theme.space(3) }
              : { margin: `${theme.space(6)} 0`, display: "flex", justifyContent: "center" }
          }
        >
          {renderIntents(intents, theme, send, `${beatId}:`)}
        </div>
      );
    },
    [program, frame.activeBeatId, theme, send],
  );

  const ownStage = nonEmptyStage(frame.model.intents).map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));

  const persistentViz = React.useRef<RenderIntent | null>(null);
  const fresh = ownStage.find((i) => i.kind === "viz" && (i as { persistent?: boolean }).persistent);
  if (fresh) persistentViz.current = fresh;
  const stage = ownStage.length ? ownStage : persistentViz.current ? [persistentViz.current] : [];
  const prompt = frame.model.intents.filter((i) => i.slot === "prompt");
  const prose = frame.model.intents.filter((i) => i.slot === "prose");

  const needsContinue = !frame.done && !frame.thinking && prompt.length === 0 && !frame.hold;

  const liveBlock = prose.length || prompt.length || needsContinue || frame.hold ? (
    <div style={{ marginTop: theme.space(3), display: "flex", flexDirection: "column", gap: theme.space(3) }}>
      {prose.length ? renderIntents(prose, theme, send) : null}
      {prompt.length ? renderIntents(prompt, theme, send) : null}
      {needsContinue ? <ContinueButton theme={theme} onNext={() => send({ type: "next" })} /> : null}
      {frame.hold ? <HoldNotice theme={theme} reason={frame.hold.reason} /> : null}
    </div>
  ) : null;

  const barBg: React.CSSProperties = { background: theme.color.surface, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" };

  return (
    <div
      data-ls-theme={theme.name}
      data-ls-mode={theme.mode}
      data-ls-layout={layout.split ? `split:${layout.stageSide}` : "single"}
      style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: theme.color.bg, color: theme.color.fg, fontFamily: theme.font.body }}
    >
      {props.symbolColors ? <SymbolColors colors={props.symbolColors} /> : null}
      {props.eyebrow || props.title || props.actions ? (
        <div style={{ flex: "0 0 auto", padding: `${theme.space(3)} ${theme.space(6)}`, borderBottom: `1px solid ${theme.color.borderSubtle}`, display: "flex", alignItems: "center", gap: theme.space(4), ...barBg }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {props.eyebrow ? <div style={{ color: theme.color.accent, fontSize: theme.font.size.eyebrow, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase" }}>{props.eyebrow}</div> : null}
            {props.title ? <div style={{ marginTop: props.eyebrow ? theme.space(1) : 0, fontSize: theme.font.size.heading, fontWeight: theme.font.weight.semibold, lineHeight: 1.3 }}><RichTextView value={props.title} theme={theme} /></div> : null}
          </div>
          {props.actions ? <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: theme.space(2) }}>{props.actions}</div> : null}
        </div>
      ) : null}

      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        {(() => {
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
                ...(theme.chrome.stageFrame
                  ? layout.stageSide === "left"
                    ? { borderRight: `1px solid ${theme.color.stageBorder}` }
                    : { borderLeft: `1px solid ${theme.color.stageBorder}` }
                  : null),
              }}
            >
              {stage.length || frame.focus || frame.annotations.length ? (
                <FocusFrame focus={frame.focus} annotations={frame.annotations} theme={theme}>
                  {stage.length ? renderIntents(stage, theme, send) : null}
                </FocusFrame>
              ) : null}
              {frame.thinking ? (
                <div style={{ position: "absolute", top: theme.space(4), right: theme.space(4), fontSize: theme.font.size.eyebrow, color: theme.color.accent, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase", opacity: 0.8 }}>
                  ✨ Thinking…
                </div>
              ) : null}
            </div>
          ) : null;

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
