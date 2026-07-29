// Host for the pinhole lesson: the clockless live studio with the 3-D apparatus in the
// workspace panel (left) and the accumulating notebook on the right.
//
// Note what is NOT here: no debug "Next →" harness. Advancing is now a first-class
// derived affordance in StudioView, and narration is voiced by the /api/tts dev endpoint
// (vite.config.ts), so this host is just a mount point — plus the ONE line that makes the
// Composer mean something: a runner that can serve `generate`.
//
// The seam, end to end: the learner types a question → Session enters an ephemeral thinking
// leaf and raises a `generate` effect → `generatingRunner` hands it to the author → the
// author asks Claude THROUGH `/api/author` (so the key stays in the dev process and never
// enters this bundle) → the returned prose is assembled into a grounded `explain` beat →
// that beat rides back as a `beat.generated` event, which is spliced in, entered, AND
// recorded in history. So replay rebuilds the answer from the log with no model in the loop.
//
// `defaultRunner()` stays underneath so `timer`/`persist` effects still work — the generate
// branch is an addition to the runner, not a replacement for it.
import "katex/dist/katex.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { createSession, defaultRunner } from "@lessonstudio/lesson";
import { generatingRunner, httpCompleter, pickAuthor } from "@lessonstudio/forge";
import { attachTeachClient } from "@lessonstudio/teach";
import { createLiveProgram } from "@lessonstudio/live";
import { StudioView } from "@lessonstudio/render-web";
import { md } from "@lessonstudio/render-contract";
import { tex } from "./palette.js";
import { lesson } from "./lesson.js";
import { pinholePlan } from "./author.js";

/**
 * A browser author. `complete` is injected, so `pickAuthor` never looks for an API key here
 * (`envApiKey()` would be undefined in a browser anyway) — the proxy owns provider auth. If
 * the proxy has no key, or the call fails, `claudeAuthor` catches it and assembles the plan's
 * deterministic `fallbackText` instead: a learner's question is answered either way.
 *
 * `"auto"`, not a provider name: WHICH model writes the prose is a property of the machine
 * the dev server runs on (Gemini key? Anthropic key? just a local `claude` CLI?), and the
 * page has no way to know — nor should it, since knowing means the credential leaked. The
 * proxy resolves it and reports the choice in the dev terminal. Pin it there with
 * `LS_AUTHOR_PROVIDER=gemini|claude-code|anthropic`.
 */
const author = pickAuthor(pinholePlan, { complete: httpCompleter("/api/author", "auto") });

function App(): React.ReactElement {
  const program = React.useMemo(
    () => createLiveProgram(createSession(lesson, { runner: generatingRunner(author, defaultRunner()) })),
    [],
  );
  React.useEffect(() => () => program.dispose(), [program]);

  // TIER 2 — open the page with `?teach` and a live teacher can watch this session from a
  // terminal and intervene in it (`teach/cli/{tail,direct}.ts`). Opt-in by URL rather than
  // always-on for one reason: a lesson that quietly polls a bus is a lesson whose behaviour
  // depends on something off-page, and the deterministic walks must stay deterministic.
  React.useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("teach")) return;
    const client = attachTeachClient(program.session);
    return () => client.detach();
  }, [program]);

  return (
    <StudioView
      program={program}
      // The apparatus is the anchor of this lesson, so give it the larger share.
      layout={{ split: true, stageBasis: "56%", stageSide: "left" }}
      eyebrow="lessonStudio · pinhole camera"
      title={md(
        `A matte wall shows no image. A pinhole shows a sharp, inverted one of height ` +
          `$${tex("hp")} = ${tex("h")}\\,${tex("v")}/${tex("u")}$. Why?`,
      )}
      placeholder="Ask about the apparatus…"
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
