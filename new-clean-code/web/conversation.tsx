import React from "react";
import type { MachineEvent } from "@lessonstudio/state-machine";
import type { RenderIntent, RichText } from "@lessonstudio/intents";
import type { Theme } from "@lessonstudio/theme";
import type { Turn, TurnRole } from "@lessonstudio/lesson";
import { defaultComponents, FallbackComp } from "./components/index.js";
import { RichTextView } from "./richtext.js";

/** Map render intents to components with stable keys (so VizView's imperative mount survives
 *  across frames instead of remounting). `keyPrefix` scopes the keys to a turn's beat so the
 *  SAME viz kind can persist inline in many turns at once without key collisions. */
export function renderIntents(intents: RenderIntent[], theme: Theme, send: (e: MachineEvent) => void, keyPrefix = ""): React.ReactNode {
  return intents.map((intent, i) => {
    const Comp = defaultComponents[intent.kind] ?? FallbackComp;
    return <Comp key={`${keyPrefix}${intent.kind}:${intent.slot}:${i}`} intent={intent} theme={theme} send={send} />;
  });
}

/** A scene intent whose snapshot has no nodes is "empty" — skip drawing it. */
export function nonEmptyStage(intents: RenderIntent[]): RenderIntent[] {
  return intents.filter((i) => {
    if (i.slot !== "stage") return false;
    if (i.kind === "scene") {
      const snap = (i as { snapshot?: { nodes?: unknown[] } }).snapshot;
      return !!snap?.nodes && snap.nodes.length > 0;
    }
    return true;
  });
}

function turnMeta(role: TurnRole, theme: Theme): { label: string; color: string; align: "left" | "right" } {
  // `flat` chrome (the paper template) has no chat geometry: everything is one column, so nothing
  // right-aligns. The role still gets its own colour, it just labels a section instead of a bubble.
  const align = theme.chrome.turns === "bubbles" ? "right" : "left";
  switch (role) {
    case "learner": return { label: "You", color: theme.color.fg, align };
    case "teacher": return { label: "Teacher", color: theme.color.alert, align: "left" };
    case "agent": return { label: "Tutor ✨", color: theme.color.accent, align: "left" };
    default: return { label: "Tutor", color: theme.color.accent, align: "left" };
  }
}

export interface ConversationLogProps {
  turns: Turn[];
  theme: Theme;
  send: (e: MachineEvent) => void;
  /** The active beat's live interactive surface (prose + prompt intents), pre-rendered
   *  by the host; it is hosted inside the active prose/explanation turn, or appended. */
  liveBlock?: React.ReactNode;
  /** Show the "Lesson complete ✓" footer. */
  done?: boolean;
  /** Optional heading pinned above the first turn. */
  title?: RichText;
  /** Host-layered authored body per beat (book/blog prose). Learner turns never get one. */
  bodyOf?: (beatId: string) => RichText | undefined;
  /** A beat's persisted VISUAL (figure/demo/scene), rendered INLINE beneath its prose so the
   *  conversation carries every step's artifact — not just the active one. The host decides
   *  autoplay (active step animates; past steps hold a static final frame). Learner turns never
   *  get one; a beat with no stage viz returns null. */
  stageOf?: (beatId: string) => React.ReactNode;
  /** Click-to-revisit a past turn's beat (video seek). Omit → the log is read-only (live). */
  onRevisit?: (beatId: string) => void;
  /** Styling for the scroll container — each host owns its own panel chrome. */
  scrollerStyle?: React.CSSProperties;
}

/**
 * The unified document: one append-only, role-attributed conversation log. Auto-scrolls
 * to follow the live turn (appends land at the bottom; a revisit brings the now-active
 * turn into view). The current beat's live interactive surface (`liveBlock`) renders
 * inside its own turn so its projected prose isn't shown twice.
 */
export function ConversationLog(props: ConversationLogProps): React.ReactElement {
  const { turns, theme, send, liveBlock, done, title, bodyOf, stageOf, onRevisit, scrollerStyle } = props;
  const scroller = React.useRef<HTMLDivElement>(null);
  const liveRef = React.useRef<HTMLDivElement>(null);

  let liveEntryIndex = -1;
  for (let i = 0; i < turns.length; i++) {
    const tr = turns[i]!;
    if (tr.live && (tr.kind === "prose" || tr.kind === "explanation")) liveEntryIndex = i;
  }

  React.useEffect(() => {
    if (liveRef.current) liveRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    else scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, liveEntryIndex]);

  // `flat` drops the chat geometry (cards, bubbles, right-alignment) so the log reads as one column
  // of prose; `numbered` labels each authored turn as a section. Together they are the difference
  // between a transcript and a chapter — the same turns, told as a document.
  const flat = theme.chrome.turns === "flat";
  const numbered = theme.chrome.eyebrow === "numbered";

  const sectionNo = React.useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    for (const t of turns) {
      if (t.role === "learner" || t.kind === "action") continue;
      map.set(t.key, ++n);
    }
    return map;
  }, [turns]);

  return (
    <div ref={scroller} data-lk-scroll style={scrollerStyle}>
      <div style={{ maxWidth: theme.font.measure, margin: "0 auto", fontSize: theme.font.size.article, lineHeight: theme.font.lineHeight, color: theme.color.fg }}>
        {title ? (
          <div
            style={
              flat
                ? { fontSize: theme.font.size.display, fontWeight: theme.font.weight.bold, lineHeight: 1.12, letterSpacing: "-0.01em", textAlign: "center", margin: `${theme.space(4)} 0 ${theme.space(10)}` }
                : { fontSize: theme.font.size.heading, fontWeight: theme.font.weight.bold, lineHeight: 1.25, margin: `0 0 ${theme.space(5)}` }
            }
          >
            <RichTextView value={title} theme={theme} />
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: flat ? theme.space(8) : theme.space(4) }}>
          {turns.map((turn, i) => {
            const isLiveEntry = i === liveEntryIndex;
            if (turn.role === "agent" && turn.kind === "action") {
              return (
                <div key={turn.key} style={{ alignSelf: "center", fontSize: theme.font.size.body, color: theme.color.muted, fontStyle: "italic", opacity: turn.live ? 1 : 0.7 }}>
                  ✎ {turn.content ? <RichTextView value={turn.content} theme={theme} /> : "annotated the workspace"}
                </div>
              );
            }
            const meta = turnMeta(turn.role, theme);
            const body = turn.role === "learner" ? undefined : bodyOf?.(turn.beatId);
            const projected = isLiveEntry ? undefined : turn.content;
            const clickable = !turn.live && !!onRevisit;
            const right = meta.align === "right";
            return (
              <div
                key={turn.key}
                ref={isLiveEntry ? liveRef : undefined}
                onClick={clickable ? () => onRevisit!(turn.beatId) : undefined}
                title={clickable ? "revisit" : undefined}
                style={{
                  alignSelf: right ? "flex-end" : "stretch",
                  maxWidth: right ? "85%" : undefined,
                  // Flat: only the learner's own asides are indented off the margin, so authored
                  // prose sits flush in the measure like body text rather than inside a container.
                  padding: flat
                    ? turn.role === "learner"
                      ? `0 0 0 ${theme.space(4)}`
                      : 0
                    : `${theme.space(2)} ${theme.space(4)}`,
                  borderLeft: flat
                    ? turn.role === "learner"
                      ? `2px solid ${theme.color.accentSoft}`
                      : undefined
                    : right
                      ? undefined
                      : `2px solid ${turn.live ? meta.color : turn.pinned ? theme.color.borderSubtle : "transparent"}`,
                  background: flat
                    ? "transparent"
                    : turn.role === "learner"
                      ? theme.color.cardBg
                      : turn.live
                        ? theme.color.cardBgActive
                        : turn.pinned
                          ? theme.color.cardBg
                          : "transparent",
                  borderRadius: flat ? 0 : right ? 12 : 8,
                  // Flat holds every section at full strength: a book does not dim its earlier pages.
                  opacity: flat || turn.live ? 1 : 0.85,
                  transition: theme.transition.card,
                  cursor: clickable ? "pointer" : "default",
                }}
              >
                <div
                  style={{
                    fontSize: theme.font.size.eyebrow,
                    fontWeight: theme.font.weight.bold,
                    letterSpacing: theme.font.letterSpacing,
                    textTransform: "uppercase",
                    color: turn.live || !flat ? meta.color : theme.color.muted,
                    marginBottom: flat ? theme.space(2) : theme.space(1),
                    textAlign: right ? "right" : "left",
                  }}
                >
                  {turn.pinned
                    ? "Reference"
                    : numbered && sectionNo.has(turn.key)
                      ? `${sectionNo.get(turn.key)} · ${meta.label}`
                      : meta.label}
                </div>
                {body ? <RichTextView value={body} theme={theme} /> : null}
                {turn.role !== "learner" ? stageOf?.(turn.beatId) : null}
                {projected ? <div style={{ marginTop: body ? theme.space(2) : 0 }}><RichTextView value={projected} theme={theme} /></div> : null}
                {isLiveEntry ? liveBlock : null}
              </div>
            );
          })}
          {liveEntryIndex === -1 && liveBlock ? <div ref={liveRef}>{liveBlock}</div> : null}
        </div>
        {done ? <div style={{ color: theme.color.muted, padding: theme.space(2), marginTop: theme.space(4) }}>Lesson complete ✓</div> : null}
      </div>
    </div>
  );
}
