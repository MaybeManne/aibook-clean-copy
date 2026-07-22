// A media-player control bar: play/pause, a click-to-seek scrubber with chapter
// markers, elapsed/total, a speed cycler, and a CC toggle. Pure presentational —
// reads a TransportState + chapter offsets and calls back.
import React from "react";
import type { Theme } from "@lessonkit/template";
import type { TransportState } from "@lessonkit/video";

const fmt = (ms: number): string => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const RATES = [1, 1.25, 1.5, 0.75];

export interface TransportBarProps {
  transport: TransportState;
  theme: Theme;
  chapters?: number[]; // chapter start times (ms) for scrubber markers
  ccOn?: boolean;
  onToggle: () => void;
  onSeek: (globalMs: number) => void;
  onRestart: () => void;
  onRate?: (rate: number) => void;
  onToggleCC?: () => void;
}

export function TransportBar({ transport, theme, chapters = [], ccOn = true, onToggle, onSeek, onRestart, onRate, onToggleCC }: TransportBarProps): React.ReactElement {
  const total = transport.estimatedTotal || 1;
  const pct = Math.min(100, (transport.globalTime / total) * 100);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const seekFromEvent = (clientX: number): void => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * total);
  };

  // Flat: the host layout (Split row 3 / theater pill) supplies the chrome.
  const bar: React.CSSProperties = { display: "flex", alignItems: "center", gap: theme.space(3), width: "100%" };
  const round = (bg: string, fg: string): React.CSSProperties => ({
    width: 36, height: 36, flex: "0 0 auto", display: "grid", placeItems: "center",
    background: bg, color: fg, border: bg === "transparent" ? `1px solid ${theme.color.borderSubtle}` : "none",
    borderRadius: 999, cursor: "pointer", fontSize: 13, fontFamily: theme.font.body, transition: theme.transition.fast,
  });
  const chip = (on: boolean): React.CSSProperties => ({
    minWidth: 38, height: 28, padding: "0 10px", display: "grid", placeItems: "center",
    background: "transparent", color: on ? theme.color.accent : theme.color.muted,
    border: `1px solid ${on ? theme.color.accent : theme.color.borderSubtle}`,
    borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: theme.font.mono, transition: theme.transition.fast,
  });

  return (
    <div style={bar}>
      <button onClick={onToggle} style={round(theme.color.accent, theme.color.bg)} aria-label={transport.playing ? "Pause" : "Play"}>
        {transport.playing ? "❚❚" : "▶"}
      </button>
      <button onClick={onRestart} style={round("transparent", theme.color.muted)} aria-label="Restart">↺</button>

      <div
        ref={trackRef}
        onClick={(e) => seekFromEvent(e.clientX)}
        style={{ position: "relative", flex: 1, height: 18, display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 999, background: theme.color.stageBorder }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 4, borderRadius: 999, background: theme.color.accent }} />
        {chapters.map((c, i) => {
          const seen = transport.globalTime >= c;
          return (
            <div
              key={i}
              title={`chapter ${i + 1}`}
              style={{ position: "absolute", left: `${(c / total) * 100}%`, top: "50%", width: 9, height: 9, marginLeft: -4.5, transform: "translateY(-50%)", borderRadius: 999, boxSizing: "border-box", background: seen ? theme.color.accent : theme.color.bg, border: `1.5px solid ${seen ? theme.color.accent : theme.color.muted}` }}
            />
          );
        })}
        <div style={{ position: "absolute", left: `${pct}%`, width: 13, height: 13, marginLeft: -6, borderRadius: 999, background: theme.color.fg, boxShadow: theme.shadow }} />
      </div>

      <span style={{ color: theme.color.muted, fontFamily: theme.font.mono, fontSize: 12, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {fmt(transport.globalTime)} / {fmt(total)}
      </span>
      {onRate ? (
        <button onClick={() => onRate(RATES[(RATES.indexOf(transport.rate) + 1) % RATES.length]!)} style={chip(false)} aria-label="Speed">
          {transport.rate}x
        </button>
      ) : null}
      {onToggleCC ? (
        <button onClick={onToggleCC} style={chip(ccOn)} aria-label="Toggle captions">CC</button>
      ) : null}
    </div>
  );
}
