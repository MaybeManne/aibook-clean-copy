import React from "react";
import type { RenderIntent } from "@lessonstudio/intents";
import { asCaptionIntent } from "@lessonstudio/timeline";
import type { Theme } from "@lessonstudio/theme";
import { RichTextView } from "../richtext.js";
import type { ComponentFor } from "./index.js";

export const CaptionView: ComponentFor = ({ intent, theme }) => {
  const cap = asCaptionIntent(intent as RenderIntent);
  if (!cap) return null;

  const box: React.CSSProperties = {
    textAlign: "center",
    padding: theme.space(2),
    fontFamily: theme.font.body,
    fontSize: 22,
    lineHeight: 1.4,
    color: theme.color.fg,
  };

  if (cap.words && cap.words.length) {
    return (
      <div style={box}>
        {cap.words.map((w, i) => (
          <span
            key={i}
            style={{ color: i === cap.active ? theme.color.accent : theme.color.fg, fontWeight: i === cap.active ? 700 : 400 }}
          >
            {w.word}{" "}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div style={box}>
      <RichTextView value={cap.text} theme={theme} />
    </div>
  );
};
