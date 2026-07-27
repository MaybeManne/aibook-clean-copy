// Host for the LIVE co-play variant of "Attention, felt". Same lesson, viz and pure
// model as examples/attention — reused VERBATIM (imported across, not copied) — but
// mounted in the clockless `live/` template instead of the video one:
//
//   • a LiveProgram (no clock, no transport, no captions) drives a StudioView: the
//     persistent beam workspace on the left, the append-only conversation on the right,
//     and an ALWAYS-ON Composer beneath — so the learner can type or interrupt at any
//     moment, not only at a beat's `ask` prompt.
//   • the author is the REAL multi-provider one, behind a server proxy: the browser
//     never holds a key. `httpCompleter("/api/agent", () => provider)` POSTs the
//     grounding + question to dev/agent-proxy.ts, which reads keys from process.env and
//     fans out to Gemini / Claude Code / Anthropic. A provider dropdown switches live;
//     "Offline" returns empty prose so the engine uses its deterministic `fallbackText`.
//
// Facts + structure stay the ENGINE's (attentionPlan.assemble); the provider only fills
// the prose slot — so switching provider, or falling back offline, never changes which
// tokens get circled. Determinism holds: every answer is recorded as an authoring
// command and replays without re-calling any provider.
import "katex/dist/katex.min.css";
import "../attention/viz.js"; // registerViz("attention", …) — the shared canvas viz
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createSession,
  defaultLearnerModel,
  defaultRunner,
  defineLesson,
  generatingRunner,
  httpCompleter,
  pickAuthor,
  type Completer,
} from "@lessonkit/lesson";
import { createLiveProgram } from "@lessonkit/live";
import { StudioView } from "@lessonkit/render-web";
import { defaultTheme } from "@lessonkit/template";
import { articleText, attentionPlan, lessonSpec, policy } from "../attention/lesson.js";

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
    // "Offline" short-circuits to empty prose → claudeAuthor falls back to the plan's
    // deterministic `fallbackText` (no network, no console warning).
    const complete: Completer = (req) => (providerRef.current === "offline" ? Promise.resolve("") : http(req));
    return createLiveProgram(
      createSession(lesson, {
        runner: generatingRunner(pickAuthor(attentionPlan, { complete }), defaultRunner()),
        policies: [policy],
        learnerModel: defaultLearnerModel(),
      }),
    );
  }, []);
  React.useEffect(() => () => program.dispose(), [program]);

  return (
    <>
      <StudioView
        program={program}
        eyebrow="ML Internals · Attention (live)"
        article={articleText}
        placeholder="Ask about this token, or interrupt the tutor…"
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
