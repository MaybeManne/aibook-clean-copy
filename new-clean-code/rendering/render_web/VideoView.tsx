// VideoView: the reusable player chrome. Subscribes to a VideoProgram and renders
// either a cinematic "theater" layout (full-bleed centered canvas + lower-third
// captions + a media control bar with chapter markers/speed/CC) or a "notebook"
// layout (sticky stage + scrolling transcript). Hosts pass the program; content is
// derived from the per-frame VideoFrame. No lesson knowledge beyond intents.
import React from "react";
import type { MachineEvent } from "@lessonkit/state-machine";
import type { RenderIntent, RichText } from "@lessonkit/render-contract";
import { defaultTheme, type Theme } from "@lessonkit/template";
import type { VideoFrame, VideoProgram } from "@lessonkit/video";
import { RichTextView } from "./richtext.js";
import { TransportBar } from "./TransportBar.js";
// The conversation log + its presentational helpers are shared with the live StudioView.
import { ConversationLog, nonEmptyStage, renderIntents } from "./conversation.js";

function useFrame(program: VideoProgram): VideoFrame {
  const [frame, setFrame] = React.useState<VideoFrame>(() => program.frame());
  React.useEffect(() => program.subscribe(setFrame), [program]);
  return frame;
}

function Caption({ frame, theme }: { frame: VideoFrame; theme: Theme }): React.ReactElement | null {
  const cap = frame.caption;
  if (!cap) return null;
  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", pointerEvents: "none" }}>
      <span style={{ fontFamily: theme.font.body, fontSize: theme.font.size.caption, lineHeight: 1.5, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
        {cap.words && cap.words.length
          ? cap.words.map((w, i) => (
              <span key={i} style={{ color: i === cap.active ? theme.color.accent : theme.color.fg, fontWeight: i === cap.active ? theme.font.weight.bold : theme.font.weight.normal, transition: "color 120ms" }}>
                {w.word}{" "}
              </span>
            ))
          : <RichTextView value={cap.text} />}
      </span>
    </div>
  );
}

function navBtn(theme: Theme, enabled: boolean): React.CSSProperties {
  return {
    flex: "0 0 auto", padding: `${theme.space(2)} ${theme.space(3)}`, background: "transparent",
    color: enabled ? theme.color.accent : theme.color.muted,
    border: `1px solid ${enabled ? theme.color.accent : theme.color.borderSubtle}`,
    borderRadius: theme.radius, cursor: enabled ? "pointer" : "not-allowed", opacity: enabled ? 1 : 0.5,
    fontFamily: theme.font.body, fontWeight: theme.font.weight.semibold, whiteSpace: "nowrap",
  };
}

export interface VideoViewProps {
  program: VideoProgram;
  theme?: Theme;
  layout?: "theater" | "notebook";
  title?: RichText;
  eyebrow?: string;
  transcript?: Record<string, RichText>; // notebook: beatId → running text (caption-style)
  article?: Record<string, RichText>; // notebook: beatId → authored explainer prose (book/blog)
  maxStageWidth?: number;
}

export function VideoView(props: VideoViewProps): React.ReactElement {
  const theme = props.theme ?? defaultTheme;
  const { program } = props;
  const frame = useFrame(program);
  const send = program.send;
  const [cc, setCc] = React.useState(true);
  const chapters = React.useMemo(() => program.timeline().map((e) => e.startGlobal), [program]);

  const controls = (
    <TransportBar
      transport={frame.transport}
      theme={theme}
      chapters={chapters}
      ccOn={cc}
      onToggle={() => program.toggle()}
      onSeek={(ms) => program.seek(ms)}
      onRestart={() => program.restart()}
      onRate={(r) => program.setRate(r)}
      onToggleCC={() => setCc((v) => !v)}
    />
  );

  if ((props.layout ?? "theater") === "notebook") {
    return <Split program={program} frame={frame} theme={theme} send={send} controls={controls} title={props.title} eyebrow={props.eyebrow} transcript={props.transcript ?? {}} article={props.article} cc={cc} />;
  }

  // ── theater: full-bleed cinematic canvas ──────────────────────────────────
  const stage = nonEmptyStage(frame.model.intents);
  const prose = frame.model.intents.filter((i) => i.slot === "prose");
  const prompt = frame.model.intents.filter((i) => i.slot === "prompt");
  const maxW = props.maxStageWidth ?? 640;

  return (
    <div style={{ position: "fixed", inset: 0, background: theme.color.bg, display: "flex", flexDirection: "column", fontFamily: theme.font.body }}>
      {props.eyebrow ? (
        <div style={{ textAlign: "center", padding: `${theme.space(5)} 0 0`, color: theme.color.accent, letterSpacing: 2, fontSize: 13, fontWeight: theme.font.weight.bold, textTransform: "uppercase" }}>
          {props.eyebrow}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: theme.space(5), padding: `${theme.space(4)} ${theme.space(6)}` }}>
        {stage.length ? (
          <div style={{ width: "100%", maxWidth: maxW, maxHeight: "60vh", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%" }}>{renderIntents(stage, theme, send)}</div>
          </div>
        ) : null}
        {prose.length ? (
          <div style={{ maxWidth: 860, textAlign: "center", color: theme.color.fg, fontSize: theme.font.size.heading, lineHeight: 1.6 }}>
            {renderIntents(prose, theme, send)}
          </div>
        ) : null}
        {prompt.length ? <div style={{ width: "100%", maxWidth: 620 }}>{renderIntents(prompt, theme, send)}</div> : null}
      </div>
      <div style={{ minHeight: 64, display: "flex", alignItems: "center", justifyContent: "center", padding: `0 ${theme.space(6)}` }}>
        {cc ? <Caption frame={frame} theme={theme} /> : null}
      </div>
      <div style={{ display: "flex", margin: `0 auto ${theme.space(5)}`, maxWidth: 1000, width: "90%", boxSizing: "border-box", padding: `${theme.space(2)} ${theme.space(4)}`, background: theme.color.surface, border: `1px solid ${theme.color.borderSubtle}`, borderRadius: 999, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>{controls}</div>
    </div>
  );
}

// Split shell: a 3-row layout (top problem/eyebrow bar · 50/50 viz + document panel ·
// full-width control bar) modeled on SocraticAI. The viz panel is persistent and fills
// its half (fit="contain"); the right panel is the UNIFIED DOCUMENT — one append-only,
// role-attributed conversation log (tutor prose · learner answers/questions · agent
// explanations + gestures) projected from session history. Hosts layer their authored
// prose per beat via `article` (preferred) or `transcript`. The current beat's live
// interactive surface renders inside its own turn. Captions sit over the viz.
function Split({
  program, frame, theme, send, controls, title, eyebrow, transcript, article, cc,
}: {
  program: VideoProgram; frame: VideoFrame; theme: Theme; send: (e: MachineEvent) => void;
  controls: React.ReactNode; title?: RichText; eyebrow?: string; transcript: Record<string, RichText>;
  article?: Record<string, RichText>; cc: boolean;
}): React.ReactElement {
  const t = frame.transport;
  // A host layers its authored prose on top: `article` (book/blog) preferred, else the
  // caption-style `transcript`. Learner turns carry their own words, so never a body.
  const bodyOf = (id: string): RichText | undefined => (article ? article[id] : undefined) ?? transcript[id];

  // stage fills its panel (letterboxed) via a per-intent fit hint the layout adds.
  const stage = nonEmptyStage(frame.model.intents).map((i) => (i.kind === "scene" ? ({ ...i, fit: "contain" } as RenderIntent) : i));
  const prompt = frame.model.intents.filter((i) => i.slot === "prompt");
  const prose = frame.model.intents.filter((i) => i.slot === "prose");

  const barBg: React.CSSProperties = { background: theme.color.surface, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" };

  // The current beat's live interactive surface — hosted inside its own turn by ConversationLog.
  const liveBlock = prose.length || prompt.length ? (
    <div style={{ marginTop: theme.space(3), display: "flex", flexDirection: "column", gap: theme.space(3) }}>
      {prose.length ? renderIntents(prose, theme, send) : null}
      {prompt.length ? renderIntents(prompt, theme, send) : null}
    </div>
  ) : null;

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: theme.color.bg, color: theme.color.fg, fontFamily: theme.font.body }}>
      {/* Row 1 — problem / eyebrow bar */}
      {eyebrow || title ? (
        <div style={{ flex: "0 0 auto", padding: `${theme.space(3)} ${theme.space(6)}`, borderBottom: `1px solid ${theme.color.borderSubtle}`, ...barBg }}>
          {eyebrow ? <div style={{ color: theme.color.accent, fontSize: theme.font.size.eyebrow, fontWeight: theme.font.weight.bold, letterSpacing: theme.font.letterSpacing, textTransform: "uppercase" }}>{eyebrow}</div> : null}
          {title ? <div style={{ marginTop: eyebrow ? theme.space(1) : 0, fontSize: theme.font.size.heading, fontWeight: theme.font.weight.semibold, lineHeight: 1.3 }}><RichTextView value={title} /></div> : null}
        </div>
      ) : null}

      {/* Row 2 — split body: persistent viz | reading panel */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: "0 0 50%", boxSizing: "border-box", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: theme.space(5), minWidth: 0, minHeight: 0 }}>
          {stage.length ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{renderIntents(stage, theme, send)}</div> : null}
          {cc ? (
            <div style={{ position: "absolute", left: "50%", bottom: theme.space(4), transform: "translateX(-50%)", maxWidth: "92%", background: theme.color.subtitleBg, borderRadius: 10, padding: `${theme.space(1)} ${theme.space(3)}`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
              <Caption frame={frame} theme={theme} />
            </div>
          ) : null}
        </div>
        <ConversationLog
          turns={program.transcript()}
          theme={theme}
          send={send}
          liveBlock={liveBlock}
          done={t.done}
          title={title}
          bodyOf={bodyOf}
          onRevisit={(beatId) => program.goToBeat(beatId)}
          scrollerStyle={{ flex: "0 0 50%", boxSizing: "border-box", minWidth: 0, overflowY: "auto", overflowX: "hidden", minHeight: 0, borderLeft: `1px solid ${theme.color.borderSubtle}`, padding: `${theme.space(6)} ${theme.space(6)} ${theme.space(10)}` }}
        />
      </div>

      {/* Row 3 — Back · transport · Next (beat-level revisit for untimed lessons) */}
      <div style={{ flex: "0 0 auto", borderTop: `1px solid ${theme.color.borderSubtle}`, padding: `${theme.space(3)} ${theme.space(6)}`, display: "flex", alignItems: "center", gap: theme.space(4), ...barBg }}>
        <button aria-label="Previous beat" disabled={!program.canBack()} onClick={() => program.back()} style={navBtn(theme, program.canBack())}>← Back</button>
        <div style={{ flex: 1, minWidth: 0 }}>{controls}</div>
        <button aria-label="Next beat" disabled={!program.canForward()} onClick={() => program.forward()} style={navBtn(theme, program.canForward())}>Next →</button>
      </div>
    </div>
  );
}
