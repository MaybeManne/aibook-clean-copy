import React from "react";
import type { Theme } from "@lessonstudio/theme";
import { MachineLegend, MachineView } from "./MachineView.js";
import type { MachineSnapshot } from "./mirror.js";

export interface MachinePageProps {
  /** null until the first snapshot arrives — a learner page may not be open yet. */
  snapshot: MachineSnapshot | null;
  theme: Theme;
  /** Slot for host controls (a theme toggle). */
  actions?: React.ReactNode;
  /** Shown in the waiting state, so the URL to open is on screen rather than in the docs. */
  learnerUrl?: string;
}

/**
 * The whole machine page: the chart, the event log, and the last director verdict.
 *
 * Read-only by construction, and that is the design rather than an omission — the learner page owns
 * the Session, this one owns a `MachineSnapshot`. It exists to answer "what is the engine actually
 * doing", including the two things nothing else on screen ever shows: the edges a beat has that the
 * learner is not currently being offered, and a director turn that was REFUSED (which is invisible
 * to a learner by design, and is exactly what you want to see when a tutor seems to be ignoring you).
 */
export function MachinePage({ snapshot, theme, actions, learnerUrl = "/?teach" }: MachinePageProps): React.ReactElement {
  const shell: React.CSSProperties = {
    minHeight: "100%",
    background: theme.color.bg,
    color: theme.color.fg,
    fontFamily: theme.font.body,
    display: "flex",
    flexDirection: "column",
  };

  if (!snapshot) {
    return (
      <div style={{ ...shell, alignItems: "center", justifyContent: "center", gap: theme.space(3), padding: theme.space(8) }}>
        <div style={{ fontSize: theme.font.size.heading, fontWeight: theme.font.weight.semibold }}>Waiting for a lesson…</div>
        <div style={{ color: theme.color.muted, fontFamily: theme.font.mono, fontSize: theme.font.size.caption, textAlign: "center" }}>
          Open <span style={{ color: theme.color.accent }}>{learnerUrl}</span> in another tab of this window.
          <br />
          This page mirrors it; it never drives it.
        </div>
      </div>
    );
  }

  const { lesson, activeBeatId, step, done, thinking, score, graph } = snapshot;
  const runtimeCount = graph.nodes.filter((n) => n.runtime).length;

  return (
    <div style={shell}>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: theme.space(4),
          padding: `${theme.space(3)} ${theme.space(5)}`,
          borderBottom: `1px solid ${theme.color.borderSubtle}`,
        }}
      >
        <div style={{ fontSize: theme.font.size.eyebrow, letterSpacing: theme.font.letterSpacing, color: theme.color.muted }}>
          MACHINE · {lesson.id} v{lesson.version}
        </div>
        <div style={{ fontFamily: theme.font.mono, fontSize: theme.font.size.caption, color: theme.color.fg }}>
          at <span style={{ color: theme.color.accent }}>{activeBeatId}</span>
          {thinking ? <span style={{ color: theme.color.accent }}> · authoring…</span> : null}
        </div>
        <div style={{ fontFamily: theme.font.mono, fontSize: theme.font.size.caption, color: theme.color.muted }}>
          step {step} · score {score} · {graph.nodes.length} beats
          {runtimeCount ? ` (${runtimeCount} live)` : ""} · {graph.edges.length} edges
          {done ? " · DONE" : ""}
        </div>
        <div style={{ marginLeft: "auto" }}>{actions}</div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <main data-lk-scroll style={{ flex: 1, overflow: "auto", padding: theme.space(5) }}>
          <MachineView snapshot={snapshot} theme={theme} />
          <div style={{ marginTop: theme.space(5) }}>
            <MachineLegend theme={theme} />
          </div>
        </main>

        <aside
          data-lk-scroll
          style={{
            width: 330,
            flexShrink: 0,
            overflow: "auto",
            borderLeft: `1px solid ${theme.color.borderSubtle}`,
            padding: theme.space(4),
            display: "flex",
            flexDirection: "column",
            gap: theme.space(4),
          }}
        >
          <Verdict snapshot={snapshot} theme={theme} />
          <EventLog snapshot={snapshot} theme={theme} />
        </aside>
      </div>
    </div>
  );
}

function heading(theme: Theme): React.CSSProperties {
  return {
    fontSize: theme.font.size.eyebrow,
    letterSpacing: theme.font.letterSpacing,
    color: theme.color.muted,
    marginBottom: theme.space(2),
  };
}

/** The last director turn. A refusal is the whole reason this panel exists. */
function Verdict({ snapshot, theme }: { snapshot: MachineSnapshot; theme: Theme }): React.ReactElement {
  const r = snapshot.lastResult;
  if (!r) {
    return (
      <section>
        <div style={heading(theme)}>LAST DIRECTOR TURN</div>
        <div style={{ color: theme.color.muted, fontFamily: theme.font.mono, fontSize: theme.font.size.caption }}>
          none yet — nobody has directed this session.
        </div>
      </section>
    );
  }
  const tone = r.ok ? theme.color.success : theme.color.error;
  const structural = [
    r.added.length ? `added ${r.added.join(" ")}` : "",
    r.patched.length ? `patched ${r.patched.join(" ")}` : "",
    r.rerouted.length ? `rerouted ${r.rerouted.join(" ")}` : "",
    r.enteredId ? `entered ${r.enteredId}` : "",
  ].filter(Boolean);

  return (
    <section>
      <div style={heading(theme)}>LAST DIRECTOR TURN</div>
      <div
        style={{
          border: `1px solid ${tone}`,
          borderRadius: theme.radius,
          padding: theme.space(2),
          fontFamily: theme.font.mono,
          fontSize: theme.font.size.caption,
          display: "flex",
          flexDirection: "column",
          gap: theme.space(1),
        }}
      >
        <div style={{ color: tone, fontWeight: theme.font.weight.semibold }}>
          {r.ok ? "ACCEPTED" : `REJECTED (${r.error?.kind ?? "error"}${r.error?.op ? ` on ${r.error.op}` : ""})`} · {r.submitted} cmd
          {r.submitted === 1 ? "" : "s"} · by {r.actor}
        </div>
        {r.ok ? (
          r.notes.map((n, i) => (
            <div key={i} style={{ color: theme.color.fg }}>
              + {n}
            </div>
          ))
        ) : (
          <div style={{ color: theme.color.fg }}>{r.error?.detail}</div>
        )}
        {structural.length ? <div style={{ color: theme.color.muted }}>= {structural.join("; ")}</div> : null}
        {!r.ok ? <div style={{ color: theme.color.muted }}>nothing was applied — no node in the picture moved.</div> : null}
      </div>
    </section>
  );
}

/** Newest first: the transitions, as the engine recorded them. */
function EventLog({ snapshot, theme }: { snapshot: MachineSnapshot; theme: Theme }): React.ReactElement {
  const lines = [...snapshot.historyTail].reverse();
  return (
    <section>
      <div style={heading(theme)}>EVENTS ({snapshot.step})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: theme.font.mono, fontSize: theme.font.size.caption }}>
        {lines.length === 0 ? <div style={{ color: theme.color.muted }}>nothing has happened yet.</div> : null}
        {lines.map((l, i) => (
          <div key={`${l.seq}-${i}`} style={{ display: "flex", gap: theme.space(2), opacity: i === 0 ? 1 : 0.72 }}>
            <span style={{ color: theme.color.muted, minWidth: 24, textAlign: "right" }}>{l.seq}</span>
            <span style={{ color: i === 0 ? theme.color.accent : theme.color.fg }}>{l.type}</span>
            <span style={{ color: theme.color.muted, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {l.from === l.to ? "(self)" : `→ ${l.to}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
