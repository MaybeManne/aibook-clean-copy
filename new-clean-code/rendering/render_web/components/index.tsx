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
// A renderable for a content kind. `ComponentType` (not a bare call signature) so
// it accepts BOTH plain function components and `React.memo`-wrapped ones.
export type ComponentFor = React.ComponentType<ComponentProps>;

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

type InputIntent = Extract<RenderIntent, { kind: "input" }> & {
  answered?: boolean;
  correct?: boolean;
  feedback?: RichText;
};

const InputComp: ComponentFor = ({ intent, theme, send }) => {
  const it = intent as InputIntent;
  const [value, setValue] = React.useState("");
  const answered = !!it.answered;
  const border = answered ? (it.correct ? theme.color.correct : theme.color.wrong) : theme.color.choiceBorder;
  return (
    <div style={{ display: "grid", gap: theme.space(2) }}>
      <div style={{ color: theme.color.fg, fontFamily: theme.font.body, fontWeight: 600 }}>
        <RichTextView value={it.prompt} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) send({ type: "input.submit", payload: { value } });
        }}
        style={{ display: "flex", gap: theme.space(2) }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="your answer…"
          style={{
            flex: 1, padding: theme.space(3), background: theme.color.choiceBg, color: theme.color.fg,
            border: `2px solid ${border}`, borderRadius: theme.radius, fontFamily: theme.font.body, fontSize: 16,
          }}
        />
        <button type="submit" style={{ padding: `${theme.space(2)} ${theme.space(4)}`, background: theme.color.accent, color: theme.color.bg, border: "none", borderRadius: theme.radius, cursor: "pointer", fontWeight: 600 }}>
          Check
        </button>
      </form>
      {it.feedback ? (
        <div style={{ color: it.correct ? theme.color.correct : theme.color.muted, fontStyle: "italic" }}>
          <RichTextView value={it.feedback} />
        </div>
      ) : null}
      {answered ? (
        <button onClick={() => send({ type: "next" })} style={{ justifySelf: "start", padding: `${theme.space(2)} ${theme.space(4)}`, background: "transparent", color: theme.color.accent, border: `2px solid ${theme.color.accent}`, borderRadius: theme.radius, cursor: "pointer", fontWeight: 600 }}>
          Continue →
        </button>
      ) : null}
    </div>
  );
};

type AskIntent = Extract<RenderIntent, { kind: "ask" }>;

/** Conversational free-text box: the learner asks; on submit fires `ask.submit {text}`
 *  (the agent then authors an answer). Distinct from `input` — no grading, no Continue. */
const AskComp: ComponentFor = ({ intent, theme, send }) => {
  const it = intent as AskIntent;
  const [value, setValue] = React.useState("");
  const submit = (): void => {
    const q = value.trim();
    if (!q) return;
    send({ type: "ask.submit", payload: { text: q } });
    setValue("");
  };
  return (
    <div style={{ display: "grid", gap: theme.space(2) }}>
      {it.prompt ? (
        <div style={{ color: theme.color.muted, fontFamily: theme.font.body, fontSize: theme.font.size.label }}>
          <RichTextView value={it.prompt} />
        </div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        style={{ display: "flex", gap: theme.space(2) }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={it.placeholder ?? "Ask the tutor a question…"}
          style={{
            flex: 1, padding: theme.space(3), background: theme.color.choiceBg, color: theme.color.fg,
            border: `2px solid ${theme.color.choiceBorder}`, borderRadius: theme.radius, fontFamily: theme.font.body, fontSize: 16,
          }}
        />
        <button type="submit" style={{ padding: `${theme.space(2)} ${theme.space(4)}`, background: "transparent", color: theme.color.accent, border: `2px solid ${theme.color.accent}`, borderRadius: theme.radius, cursor: "pointer", fontWeight: 600 }}>
          Ask ✨
        </button>
      </form>
    </div>
  );
};

type ControlsIntent = Extract<RenderIntent, { kind: "controls" }>;

/** Interactive demo controls: sliders/toggles/buttons that emit `demo.set` (or `next`). */
const ControlsComp: ComponentFor = ({ intent, theme, send }) => {
  const it = intent as ControlsIntent;
  const label: React.CSSProperties = { color: theme.color.muted, fontSize: theme.font.size.label, fontFamily: theme.font.body };
  return (
    <div style={{ display: "grid", gap: theme.space(3) }}>
      {it.controls.map((c) => {
        if (c.kind === "button") {
          const advance = c.key === "__next";
          return (
            <button
              key={c.key}
              onClick={() => send(advance ? { type: "next" } : { type: "demo.action", payload: { key: c.key } })}
              style={{ justifySelf: "start", padding: `${theme.space(2)} ${theme.space(4)}`, background: theme.color.accent, color: theme.color.bg, border: "none", borderRadius: theme.radius, cursor: "pointer", fontWeight: theme.font.weight.semibold, fontFamily: theme.font.body }}
            >
              {c.label}
            </button>
          );
        }
        if (c.kind === "toggle") {
          const on = !!it.values[c.key];
          return (
            <label key={c.key} style={{ display: "flex", alignItems: "center", gap: theme.space(2), cursor: "pointer", ...label, color: theme.color.fg }}>
              <input type="checkbox" checked={on} onChange={(e) => send({ type: "demo.set", payload: { key: c.key, value: e.target.checked } })} style={{ accentColor: theme.color.accent, width: 16, height: 16 }} />
              {c.label}
            </label>
          );
        }
        // slider
        const val = Number(it.values[c.key] ?? c.min ?? 0);
        return (
          <div key={c.key} style={{ display: "grid", gap: theme.space(1) }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
              <span>{c.label}</span>
              <span style={{ color: theme.color.accent, fontFamily: theme.font.mono, fontVariantNumeric: "tabular-nums" }}>{val}{c.unit ?? ""}</span>
            </div>
            <input
              type="range"
              min={c.min ?? 0}
              max={c.max ?? 100}
              step={c.step ?? 1}
              value={val}
              onChange={(e) => send({ type: "demo.set", payload: { key: c.key, value: Number(e.target.value) } })}
              style={{ width: "100%", accentColor: theme.color.accent, cursor: "pointer" }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** HTML/SVG/CSS escape hatch: render an author-supplied markup string as-is. */
type HtmlIntent = Extract<RenderIntent, { kind: string }> & { html: string };
const HtmlComp: ComponentFor = ({ intent }) => {
  const it = intent as HtmlIntent;
  return <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: it.html }} />;
};

/** Typed placeholder for unregistered/custom kinds (never crash on unknowns). */
export const FallbackComp: ComponentFor = ({ intent, theme }) => (
  <div style={{ color: theme.color.muted, fontFamily: theme.font.mono }}>[unrendered kind: {intent.kind}]</div>
);

import { SceneView } from "./SceneView.js";
import { CaptionView } from "./CaptionView.js";
import { VizView } from "./VizView.js";

// Memoized so a per-frame VideoFrame update only re-renders components whose
// intent actually changed (SceneView carries its own snapshot-signature compare;
// the rest use React's shallow prop compare — `theme`/`send` are stable refs).
export const defaultComponents: Record<string, ComponentFor> = {
  text: React.memo(TextComp),
  visual: React.memo(VisualComp),
  mcq: React.memo(McqComp),
  input: React.memo(InputComp),
  ask: React.memo(AskComp),
  scene: SceneView,
  caption: React.memo(CaptionView),
  controls: React.memo(ControlsComp),
  html: React.memo(HtmlComp),
  viz: React.memo(VizView),
};
