// The component registry: one React component per content `kind` (the "how"
// axis). MCQ styling/colors live here, driven by theme tokens — the lesson
// never sees any of it. `MachineEvent` is a TYPE-ONLY import: no runtime
// dependency on the engine.
import React from "react";
import type { MachineEvent } from "@lessonkit/state-machine";
import type { Choice, RenderIntent, RichText } from "@lessonkit/render-contract";
import type { Theme } from "@lessonkit/template";
import { RichTextView } from "../richtext.js";

export interface ComponentProps<I extends RenderIntent = RenderIntent> {
  intent: I;
  theme: Theme;
  send: (event: MachineEvent) => void;
}
export type ComponentFor = (props: ComponentProps) => React.ReactElement | null;

type TextIntent = Extract<RenderIntent, { kind: "text" }>;
type VisualIntent = Extract<RenderIntent, { kind: "visual" }>;
type McqIntent = Extract<RenderIntent, { kind: "mcq" }>;

const TextComp: ComponentFor = ({ intent, theme }) => {
  const it = intent as TextIntent;
  const color =
    it.emphasis === "muted" ? theme.color.muted : it.emphasis === "alert" ? theme.color.alert : theme.color.fg;
  return (
    <div style={{ color, fontFamily: theme.font.body, lineHeight: 1.5 }}>
      <RichTextView value={it.content} />
    </div>
  );
};

const VisualComp: ComponentFor = ({ intent, theme }) => {
  const it = intent as VisualIntent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 160,
        background: theme.color.choiceBg,
        borderRadius: theme.radius,
        color: theme.color.muted,
      }}
    >
      {it.ref.src ? <img src={it.ref.src} alt="" style={{ maxHeight: 220 }} /> : `[${it.ref.kind}]`}
    </div>
  );
};

const McqComp: ComponentFor = ({ intent, theme, send }) => {
  const it = intent as McqIntent;
  const answered = it.state !== "unanswered";
  return (
    <div style={{ display: "grid", gap: theme.space(2) }}>
      <div style={{ color: theme.color.fg, fontFamily: theme.font.body, fontWeight: 600 }}>
        <RichTextView value={it.prompt} />
      </div>
      <div style={{ display: "grid", gap: theme.space(2) }}>
        {it.choices.map((c: Choice, i: number) => {
          const border =
            answered && c.revealedCorrect
              ? theme.color.correct
              : answered && c.picked && !c.revealedCorrect
                ? theme.color.wrong
                : theme.color.choiceBorder;
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => send({ type: "mcq.answer", payload: { choice: i } })}
              style={{
                textAlign: "left",
                padding: theme.space(3),
                background: theme.color.choiceBg,
                color: theme.color.fg,
                border: `2px solid ${border}`,
                borderRadius: theme.radius,
                cursor: answered ? "default" : "pointer",
                fontFamily: theme.font.body,
              }}
            >
              {c.text}
            </button>
          );
        })}
      </div>
      {it.feedback ? (
        <div style={{ color: theme.color.muted, fontStyle: "italic" }}>
          <RichTextView value={it.feedback as RichText} />
        </div>
      ) : null}
      {answered ? (
        <button
          onClick={() => send({ type: "next" })}
          style={{
            justifySelf: "start",
            padding: `${theme.space(2)} ${theme.space(4)}`,
            background: theme.color.accent,
            color: theme.color.bg,
            border: "none",
            borderRadius: theme.radius,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continue →
        </button>
      ) : null}
    </div>
  );
};

/** Typed placeholder for unregistered/custom kinds (never crash on unknowns). */
export const FallbackComp: ComponentFor = ({ intent, theme }) => (
  <div style={{ color: theme.color.muted, fontFamily: theme.font.mono }}>[unrendered kind: {intent.kind}]</div>
);

import { SceneView } from "./SceneView.js";

export const defaultComponents: Record<string, ComponentFor> = {
  text: TextComp,
  visual: VisualComp,
  mcq: McqComp,
  scene: SceneView,
};
