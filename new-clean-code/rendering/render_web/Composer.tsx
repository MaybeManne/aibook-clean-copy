// Composer: the always-on text input docked at the bottom of the live studio. Unlike
// a beat-gated `ask` prompt, this is available at EVERY moment — the learner may type a
// question or interrupt the agent mid-thought. It is purely presentational: it owns only
// the draft text and hands a trimmed string to `onSubmit`; the host maps that to a
// `message.submit` player move. Enter sends, Shift+Enter inserts a newline. It stays
// enabled while the agent is thinking (a second submit IS the interrupt).

import React from "react";
import { defaultTheme, type Theme } from "@lessonkit/template";

export interface ComposerProps {
  /** Called with the trimmed, non-empty draft when the learner sends. */
  onSubmit: (text: string) => void;
  theme?: Theme;
  placeholder?: string;
  /** The agent is authoring — surfaces a subtle hint; the input stays live for interrupts. */
  thinking?: boolean;
}

export function Composer(props: ComposerProps): React.ReactElement {
  const theme = props.theme ?? defaultTheme;
  const [draft, setDraft] = React.useState("");

  const submit = (): void => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    props.onSubmit(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.space(1), width: "100%" }}>
      {props.thinking ? (
        <div style={{ fontSize: theme.font.size.eyebrow, color: theme.color.muted, fontStyle: "italic", padding: `0 ${theme.space(2)}` }}>
          The tutor is thinking… you can send again to redirect.
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "flex-end", gap: theme.space(3), width: "100%" }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={props.placeholder ?? "Ask anything, or interrupt…"}
          style={{
            flex: 1,
            minWidth: 0,
            resize: "none",
            fontFamily: theme.font.body,
            fontSize: theme.font.size.body,
            lineHeight: 1.5,
            color: theme.color.fg,
            background: theme.color.cardBg,
            border: `1px solid ${theme.color.borderSubtle}`,
            borderRadius: theme.radius,
            padding: `${theme.space(2)} ${theme.space(3)}`,
            outline: "none",
          }}
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          aria-label="Send message"
          style={{
            flex: "0 0 auto",
            padding: `${theme.space(2)} ${theme.space(4)}`,
            fontFamily: theme.font.body,
            fontWeight: theme.font.weight.semibold,
            color: draft.trim() ? theme.color.bg : theme.color.muted,
            background: draft.trim() ? theme.color.accent : "transparent",
            border: `1px solid ${draft.trim() ? theme.color.accent : theme.color.borderSubtle}`,
            borderRadius: theme.radius,
            cursor: draft.trim() ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
