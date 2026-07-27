// Host for the FREE SESSION — the LLM-owns-structure end of the grounding spectrum. The
// default lesson is just "ask me anything" (lesson.ts); the learner types a question and the
// tutor AUTHORS the answer's structure live — prose+math, an illustration, or an interactive
// demo — each rendered on the shared workspace, then rejoining home (plan.ts).
//
// It reuses the SAME clockless live host as attention-live, verbatim:
//   • a LiveProgram drives a StudioView — an always-on Composer beneath a split body (the
//     authored artifact on the left, the append-only conversation on the right). No transport.
//   • the author is the real multi-provider one behind a server proxy: the browser never holds
//     a key. `httpCompleter("/api/agent", () => provider)` POSTs the question to the dev proxy,
//     which reads keys from process.env and fans out to Gemini / Claude Code / Anthropic.
//     "Offline" returns empty prose → the engine uses the plan's deterministic `fallbackText`.
//
// The only free-session-specific wiring is `freeSessionPlan` + the `sandbox` viz. Everything
// else (splice, freeze, deterministic replay, transcript projection, this UI) is shared.
import "katex/dist/katex.min.css";
import "./viz.js"; // registerViz("sandbox", …) — the generic iframe artifact host
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createSession,
  defaultLearnerModel,
  defaultRunner,
  defineLesson,
  generatingRunner,
  httpCompleter,
  type Completer,
} from "@lessonkit/lesson";
import { createLiveProgram } from "@lessonkit/live";
import { StudioView } from "@lessonkit/render-web";
import { defaultTheme } from "@lessonkit/template";
import { segmentAuthor } from "./segment.js";
import { lessonSpec } from "./lesson.js";

const lesson = defineLesson(lessonSpec);

const PROVIDERS = [
  { id: "gemini", label: "Gemini 3.1 Pro" },
  { id: "claude-code", label: "Claude Code" },
  { id: "anthropic", label: "Anthropic API" },
  { id: "offline", label: "Offline (deterministic)" },
] as const;
type ProviderId = (typeof PROVIDERS)[number]["id"];

function App(): React.ReactElement {
  const [provider, setProvider] = React.useState<ProviderId>("gemini");
  // The completer reads the CURRENT provider through a ref, so the dropdown switches the
  // backend live without rebuilding the program (and thus without resetting the session).
  const providerRef = React.useRef<ProviderId>(provider);
  providerRef.current = provider;

  const program = React.useMemo(() => {
    const http = httpCompleter("/api/agent", () => providerRef.current);
    // "Offline" short-circuits to empty prose → the author falls back to the plan's
    // deterministic `fallbackText` (no network, no console warning).
    const complete: Completer = (req) => (providerRef.current === "offline" ? Promise.resolve("") : http(req));
    return createLiveProgram(
      createSession(lesson, {
        // The SEGMENT author: one question → a multi-step segment (narrated steps + animation +
        // demo + graded exercise), spliced atomically and persisted inline. maxTokens is well past
        // plan.ts's single-act 4096 — a 3–4-step segment with inline html/storyboards is large.
        runner: generatingRunner(segmentAuthor({ complete, maxTokens: 8192 }), defaultRunner()),
        learnerModel: defaultLearnerModel(),
      }),
    );
  }, []);
  React.useEffect(() => () => program.dispose(), [program]);

  return (
    <>
      <StudioView
        program={program}
        eyebrow="Free session · Ask me anything"
        placeholder="Ask me anything — say “draw…”, “plot…”, or just ask a question…"
      />
      <ProviderPicker provider={provider} onChange={setProvider} />
    </>
  );
}

/** Host-owned chrome: a small floating selector for the generation backend. Kept out of
 *  StudioView (which stays provider-agnostic) and layered on top as fixed-position UI. */
function ProviderPicker({ provider, onChange }: { provider: ProviderId; onChange: (p: ProviderId) => void }): React.ReactElement {
  const theme = defaultTheme;
  return (
    <div style={{ position: "fixed", top: theme.space(3), right: theme.space(6), zIndex: 10, display: "flex", alignItems: "center", gap: theme.space(2) }}>
      <label style={{ fontSize: theme.font.size.eyebrow, color: theme.color.muted, fontFamily: theme.font.body }}>tutor</label>
      <select
        value={provider}
        onChange={(e) => onChange(e.target.value as ProviderId)}
        style={{
          fontFamily: theme.font.body,
          fontSize: theme.font.size.body,
          color: theme.color.fg,
          background: theme.color.cardBg,
          border: `1px solid ${theme.color.borderSubtle}`,
          borderRadius: theme.radius,
          padding: `${theme.space(1)} ${theme.space(2)}`,
          outline: "none",
        }}
      >
        {PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
