// Drive the pinhole lesson end-to-end in a real browser and assert the things that
// actually matter:
//   1. the 3-D apparatus mounts and RENDERS (a non-blank WebGL framebuffer);
//   2. narration is audible — /api/tts answers with real mp3 bytes + word timings, per beat;
//   3. exactly ONE canvas exists no matter how many turns accumulate (VizIntent.persistent),
//      including THROUGH the gates, which contribute no stage content of their own;
//   4. Continue advances non-interactive beats, with no debug harness present;
//   5. a WRONG answer routes into remediation and the graph rejoins the main line — for both
//      the MCQ and the fill-in gate;
//   6. the eased apparatus state actually changes between beats (framebuffer hashes differ);
//   7. the learner's slider drives the 3-D scene, and a guided goal gates Continue;
//   8. variables are COLOUR-CODED in the math, in the same hues the figure labels use, and no
//      authored markup (`$math$`, `**bold**`) leaks through as literal text;
//   9. the learner can pause the narration — and it STAYS paused into the next beat;
//  10. the learner interrupts through the always-on Composer and the director WRITES a beat
//      that splices into the running lesson: a thinking affordance appears without the
//      workspace blanking, the answer is grounded in the apparatus THIS learner manipulated
//      (v = 13 → m = 13/7 = 1.86, not the authored default v = 7 → m = 1), it lands as a
//      role-attributed turn in the same colour key as the rest of the lesson, and Continue
//      resumes the interrupted explorable with the slider value intact;
//  11. no provider request ever leaves the browser — narration and direction both go through
//      the dev endpoints, so every provider credential stays in the vite process.
// The generated PROSE is never asserted, because WHICH model wrote it is a property of the
// machine: /api/direct resolves `auto` to Gemini, the local `claude` CLI, or the Anthropic API,
// and answers `{error}` when it can reach none of them (then the runner's `onSilence` supplies
// the lesson's deterministic paragraph). So this walk checks only what the ENGINE owns — which
// is exactly the claim worth checking, since it must hold on every one of those paths. The
// other half of it — that the exchange replays from the event log with the model never called
// again — is proved in checks/ask.ts, where a counting stub can assert the call count itself.
// Needs swiftshader for WebGL under headless Chrome.
import puppeteer from "puppeteer";
import { createHash } from "node:crypto";

const url = process.argv[2] ?? "http://localhost:5188/";
const out = process.argv[3] ?? "/tmp/ls-pinhole";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader", "--mute-audio"],
});
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });

const errors = [];
const ttsCalls = [];
const directCalls = [];
// Both provider keys live in the vite process, never in the bundle (audio/dev_tts.ts,
// forge/dev_director.ts). The proof is negative and belongs in the walk: if a key ever
// reached the browser, the request to the provider would show up HERE.
const providerHits = [];
p.on("request", (r) => { if (/api\.anthropic\.com|generativelanguage\.googleapis\.com|elevenlabs\.io|openai\.com/i.test(r.url())) providerHits.push(r.url()); });
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("requestfailed", (r) => errors.push(`REQFAIL ${r.url()}`));
p.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));
p.on("response", async (r) => {
  if (!r.url().includes("/api/tts")) return;
  try {
    const j = await r.json();
    ttsCalls.push({ ok: !!j.audio, bytes: j.audio ? Math.round((j.audio.length * 3) / 4) : 0, ms: j.durationMs ?? 0, words: (j.words || []).length });
  } catch { ttsCalls.push({ ok: false, bytes: 0, ms: 0, words: 0 }); }
});
// The director proxy. `mode` records which path the run took — "live" when the dev process
// reached a model (the response names which one and carries its tool calls), "fallback" when it
// reached none and `onSilence` supplied the lesson's own paragraph. Either way the turn must
// complete, so the walk asserts the seam was reached and prints the mode rather than requiring
// one of them.
p.on("response", async (r) => {
  if (!r.url().includes("/api/direct")) return;
  try {
    const j = await r.json();
    const ops = (j.calls || []).map((c) => c.name).join(",");
    directCalls.push({
      mode: j.error ? "fallback" : "live",
      detail: j.error ? String(j.error).slice(0, 60) : `${j.provider ?? "?"}/${j.model ?? "?"}, ${ops || "no call"}`,
    });
  } catch { directCalls.push({ mode: "unreadable", detail: `HTTP ${r.status()}` }); }
});

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const bodyText = () => p.evaluate(() => document.body.innerText);
const canvasCount = () => p.evaluate(() => document.querySelectorAll("canvas").length);
const clickText = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || "") && !b.disabled);
    if (el) { el.click(); return true; }
    return false;
  }, re.source);

/** Framebuffer fingerprint — the same pixels VizHandle.poster() hands to an exporter. */
const posterHash = async () => {
  const dataUrl = await p.evaluate(() => {
    const c = document.querySelector("canvas");
    return c ? c.toDataURL("image/png") : null;
  });
  return dataUrl ? createHash("sha1").update(dataUrl).digest("hex").slice(0, 12) : null;
};
/** Fraction of non-background pixels — proves the WebGL scene actually drew something. */
const inkFraction = () =>
  p.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return -1;
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return -2;
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    const px = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let ink = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 40 || px[i + 1] > 40 || px[i + 2] > 45) ink++; // bg is #0f0e17
    }
    return ink / (w * h);
  });

// The conversation log ACCUMULATES every past turn, so matching regexes against the whole
// page finds stale text from beats already gone by ("v — screen distance" in an earlier card
// looks exactly like the slider label). Two fixes, both used below:
//   • `mark()` / `tailMatch()` — match only text added since the last checkpoint;
//   • DOM signals — a range slider or an answer box exists ONLY while its beat is active,
//     because controls render into the live block, never into the past turns.
// Diff at the first DIVERGENCE, not at the old length: the page ends with chrome that
// mutates in place (the Continue button, the narration label), so the snapshot is not a
// prefix of the next one — slicing at its length lands a few characters PAST the start of
// the new turn and can cut the phrase you are matching in half ("similar t|riangles").
let markText = "";
const mark = async () => { markText = await bodyText(); };
const tailMatch = async (re) => {
  const now = await bodyText();
  let i = 0;
  while (i < markText.length && i < now.length && markText[i] === now[i]) i++;
  return re.test(now.slice(i));
};
const hasRange = () => p.evaluate(() => !!document.querySelector('input[type="range"]'));
const hasAnswerBox = () =>
  p.evaluate(() => [...document.querySelectorAll("input")].some((i) => i.type !== "range" && /answer/i.test(i.placeholder || "")));

/** Poll until `pred()` holds (or give up). Used for anything the network gates — a clip arriving. */
async function waitFor(pred, ms = 6000, step = 300) {
  for (let t = 0; t < ms; t += step) {
    if (await pred()) return true;
    await sleep(step);
  }
  return false;
}

// KaTeX turns `\textcolor{#fbbf24}{u}` into an inline `color:` style, so the rendered colours can
// be read straight back out of the DOM and compared with the palette the 3-D labels use.
const RGB = { h: "rgb(74, 222, 128)", hp: "rgb(248, 113, 113)", u: "rgb(251, 191, 36)", v: "rgb(56, 189, 248)", m: "rgb(196, 181, 253)" };
const mathColors = () =>
  p.evaluate(() => [...new Set([...document.querySelectorAll(".katex [style*='color']")].map((e) => e.style.color).filter(Boolean))]);

/** The narration control's label IS `AudioSink.status()`, i.e. the audio element's own
 *  paused/ended flags — so reading it back is reading real playback state, not a UI guess. */
const narrationLabel = () =>
  p.evaluate(() => {
    const el = [...document.querySelectorAll("button")].find((b) => /narration/i.test(b.textContent || ""));
    return el ? (el.textContent || "").trim() : null;
  });
const clickNarration = () => clickText(/narration/);

/** Click Continue until `pred()` is true. State-driven, so it survives beat re-ordering. */
async function advanceUntil(pred, max = 14) {
  for (let i = 0; i < max; i++) {
    if (await pred()) return i;
    if (!(await clickText(/continue|got it/))) return -1;
    await sleep(1400);
  }
  return (await pred()) ? max : -1;
}

// ── the always-on Composer (say anytime / interrupt) ──────────────────────────────
// Typing and sending are two evaluates on purpose: the Send button is disabled until React
// has the draft, so the second call must run after that flush.
//
// The send call reads the page back before it returns, across MICROTASKS only. That is the
// whole trick: React 18 flushes a discrete event's update in a microtask, and every queued
// microtask drains before the event loop can deliver a network reply — so this read is
// guaranteed to happen after the thinking leaf is painted and before /api/direct can answer.
// It has to be: with no API key the proxy rejects in single-digit milliseconds, so a poll
// started after the round trip would race the answer and see an empty page.
const typeQuestion = (q) =>
  p.evaluate((text) => {
    const ta = document.querySelector("textarea");
    if (!ta) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    setter.call(ta, text);
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }, q);

const sendQuestion = () =>
  p.evaluate(async () => {
    const btn = [...document.querySelectorAll("button")].find((b) => /^send$/i.test((b.textContent || "").trim()) && !b.disabled);
    if (!btn) return { sent: false, text: document.body.innerText, draft: null, canvases: document.querySelectorAll("canvas").length };
    btn.click();
    await Promise.resolve(); // React's flush is queued ahead of this continuation…
    await Promise.resolve(); // …and no network reply can interleave with a microtask drain.
    return {
      sent: true,
      text: document.body.innerText,
      draft: document.querySelector("textarea")?.value ?? null,
      canvases: document.querySelectorAll("canvas").length,
    };
  });

/** The conversation's speaker labels, in order — "YOU" / "TUTOR ✨" / "TUTOR" (the log
 *  uppercases them in CSS). Counting these is how the walk tells "a turn was appended"
 *  from "the live block changed", without reaching into the program. */
const turnLabels = () =>
  p.evaluate(() =>
    [...document.querySelectorAll("div")]
      .filter((d) => d.children.length === 0)
      .map((d) => (d.innerText || "").trim())
      .filter((t) => /^(you|tutor\s*✨|tutor|reference)$/i.test(t)),
  );

/** The engine-owned footer on a generated beat: `> With the apparatus as you have it now …`,
 *  which `article()` renders as a callout. Read the INNERMOST matching element so the numbers
 *  can be asserted without the rest of the transcript coming along. */
const footerText = () =>
  p.evaluate(() => {
    const hits = [...document.querySelectorAll("div")].filter((d) => /the magnification is/i.test(d.innerText || ""));
    return hits.length ? (hits[hits.length - 1].innerText || "").replace(/\s+/g, " ") : "";
  });
const footerColors = () =>
  p.evaluate(() => {
    const hits = [...document.querySelectorAll("div")].filter((d) => /the magnification is/i.test(d.innerText || ""));
    const el = hits[hits.length - 1];
    return el ? [...new Set([...el.querySelectorAll(".katex [style*='color']")].map((e) => e.style.color).filter(Boolean))] : [];
  });

const sliderValue = () => p.evaluate(() => document.querySelector('input[type="range"]')?.value ?? null);
const hasContinue = () => p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /continue|got it/i.test(b.textContent || "") && !b.disabled));

const setSlider = (value) =>
  p.evaluate((v) => {
    const el = document.querySelector('input[type="range"]');
    if (!el) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, String(v));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }, value);

// ══ boot ═══════════════════════════════════════════════════════════════════════════
await p.goto(url, { waitUntil: "networkidle0", timeout: 40000 });
await sleep(2600); // three.js + first synthesis

check("apparatus mounted (1 canvas)", (await canvasCount()) === 1, `count=${await canvasCount()}`);
const ink0 = await inkFraction();
check("WebGL scene drew geometry", ink0 > 0.01, `ink=${(ink0 * 100).toFixed(1)}%`);
check("no debug harness left", !(await bodyText()).toLowerCase().includes("debug"));
check("Continue affordance present", await clickText(/^\s*$/) === false && (await p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /continue/i.test(b.textContent || "")))));

// The header states the result — h′ = h·v/u — and every symbol in it is colour-keyed to the figure.
const titleColors = await mathColors();
check(
  "header math is colour-coded (h′, h, v, u)",
  [RGB.hp, RGB.h, RGB.v, RGB.u].every((c) => titleColors.includes(c)),
  titleColors.join(" "),
);
await p.screenshot({ path: `${out}-01-wall.png` });
const h0 = await posterHash();

// ══ walk to the inversion gate ═════════════════════════════════════════════════════
const stepsToGate = await advanceUntil(() => tailMatch(/Through a pinhole, the image formed/i));
check("reached inversion gate", stepsToGate >= 0, `${stepsToGate} advances`);
const h1 = await posterHash();
check("apparatus state changed across beats", h0 !== h1, `${h0} → ${h1}`);
check("apparatus still drawing at the gate", (await inkFraction()) > 0.01, `ink=${((await inkFraction()) * 100).toFixed(1)}%`);
check("apparatus survives the gate (still 1 canvas)", (await canvasCount()) === 1, `count=${await canvasCount()}`);
await p.screenshot({ path: `${out}-02-gate-inverted.png` });

// ══ wrong answer → remediation → rejoin ════════════════════════════════════════════
check("picked a wrong choice", await clickText(/Upright and the same size/));
await sleep(800);
check("wrong answer gave feedback", /Follow one ray/i.test(await bodyText()));
await clickText(/continue/);
await sleep(1600);
check("wrong answer routed to remediation", /Why it flips/i.test(await bodyText()));
await p.screenshot({ path: `${out}-03-remediation.png` });

await mark();
const stepsToTri = await advanceUntil(() => tailMatch(/similar triangles/i), 3);
check("remediation rejoined main line", stepsToTri >= 0, `${stepsToTri} advances`);
check("KaTeX rendered the geometry", await p.evaluate(() => document.querySelectorAll(".katex").length > 3));
const triColors = await mathColors();
check(
  "similar-triangles math keeps the figure's colour key",
  [RGB.hp, RGB.h, RGB.v, RGB.u, RGB.m].every((c) => triColors.includes(c)),
  triColors.join(" "),
);
await p.screenshot({ path: `${out}-04-triangles.png` });

// ══ narration: pause, stay paused, resume ══════════════════════════════════════════
// Autoplay is only unblocked after a user gesture, and the walk has clicked plenty by now —
// but tolerate either order: wait for playback, and start it by hand if the policy held it back.
check("narration control present", (await narrationLabel()) !== null, (await narrationLabel()) ?? "no button");
let playing = await waitFor(async () => /pause/i.test((await narrationLabel()) ?? ""));
if (!playing) {
  await clickNarration();
  playing = await waitFor(async () => /pause/i.test((await narrationLabel()) ?? ""), 4000);
}
check("narration is playing (control offers Pause)", playing, (await narrationLabel()) ?? "");
await clickNarration();
await sleep(400);
const pausedLabel = await narrationLabel();
check("pause stopped the clip", /resume|replay/i.test(pausedLabel ?? ""), pausedLabel ?? "");
// A pause is a standing preference, not a one-clip pause: the NEXT beat must stay quiet.
await clickText(/continue/);
await sleep(2400);
const nextLabel = await narrationLabel();
check("pause persists into the next beat", !!nextLabel && !/pause/i.test(nextLabel), nextLabel ?? "");
await clickNarration();
check("resume plays the narration again", await waitFor(async () => /pause/i.test((await narrationLabel()) ?? ""), 4000), (await narrationLabel()) ?? "");
await p.screenshot({ path: `${out}-04b-narration.png` });

// ══ the guided screen-distance explorable ══════════════════════════════════════════
// A range slider exists only while an explorable is the ACTIVE beat — the reliable signal.
const stepsToScreen = await advanceUntil(hasRange, 4);
check("reached move-screen explorable", stepsToScreen >= 0, `${stepsToScreen} advances`);
const hBefore = await posterHash();
check(
  "Continue hidden until the goal is met",
  !(await p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /got it/i.test(b.textContent || "")))),
);
check("slider present", await p.evaluate(() => !!document.querySelector('input[type="range"]')));
await setSlider(13);
await sleep(1600);
const hAfter = await posterHash();
check("slider drove the 3-D apparatus", hBefore !== hAfter, `${hBefore} → ${hAfter}`);
// The guided goal SWAPS task prose for success prose, so match the whole body (the string is
// unique to this beat's success message) and confirm the gate released the Continue button.
check("goal met revealed success prose", /infinite depth of field/i.test(await bodyText()));
check("goal met released Continue", await p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /got it/i.test(b.textContent || ""))));
await p.screenshot({ path: `${out}-05-move-screen.png` });

// ══ say anytime: the learner interrupts, the director writes a beat ════════════════
// Placed HERE, one slider drag into the explorable, on purpose: the learner has just pushed
// the screen out to v = 13, so a grounded answer must talk about THEIR apparatus (v = 13,
// m = 13/7 = 1.86) and not the beat's authored default (v = 7, m = 1). That difference is the
// entire argument for answering INSIDE the lesson rather than beside it in a chat window —
// the engine can see the manipulated state, a chat window structurally cannot.
const QUESTION = "Wait — with the screen out this far, is the image going blurry?";
const labelsBefore = await turnLabels();
const ttsBefore = ttsCalls.length;
await mark();
check("Composer took the question", await typeQuestion(QUESTION));
await sleep(150); // let React enable Send from the draft
const sent = await sendQuestion();
check("the question was sent mid-lesson", sent.sent === true);
check("the Composer clears its draft on send", sent.draft === "", JSON.stringify(sent.draft));
// Read synchronously with the click (see sendQuestion): the wait must be LEGIBLE, and with a
// keyless proxy the answer can land before any poll could run.
// Match the UI's own ellipsis form ("✨ Thinking…", "The tutor is thinking… you can send again"),
// not the bare word: on a LIVE provider the generated prose is arbitrary text, and a tutor
// writing "thinking like a physicist" must not read as a thinking affordance still on screen.
const THINKING = /thinking…/i;
let thinkingSeen = THINKING.test(sent.text || "");
if (!thinkingSeen) thinkingSeen = await waitFor(async () => THINKING.test(await bodyText()), 1500, 50);
check("the question parks the learner on a thinking affordance", thinkingSeen, thinkingSeen ? "" : "no 'Thinking…' ever painted");
// The ephemeral leaf CLONES the interrupted beat's viz, so the workspace must not blank —
// and it must not mount a second WebGL context to do it.
check("the workspace does not blank while the tutor thinks", sent.canvases === 1, `canvases=${sent.canvases}`);

const landed = await waitFor(async () => /the magnification is/i.test(await bodyText()), 15000, 200);
check("the director wrote a beat and it spliced into the running lesson", landed);
check("/api/direct was reached (the client → proxy seam is wired)", directCalls.length >= 1, directCalls.map((c) => `${c.mode}: ${c.detail}`).join(" | "));
check("the thinking placeholder is gone once the answer lands", !THINKING.test(await bodyText()));
// No `narration` on a generated beat is a decision, not an omission (examples/pinhole/tutor.ts):
// the prose is full of TeX and reading TeX aloud is worse than silence.
check("a generated beat is silent by design (no new narration clip)", ttsCalls.length === ttsBefore, `${ttsBefore} → ${ttsCalls.length} clips`);

// The engine owns the numbers: the model contributes voice, the footer contributes fact.
const footer = await footerText();
check("the answer carries the engine-owned grounded footer", /the magnification is/i.test(footer), footer.slice(0, 90));
// v = 13 and m = 1.86 exist nowhere in the lesson source: the authored default is v = 7,
// m = 1. So these two numbers can only have come from the slider the learner just dragged,
// and 13/7 can only have been COMPUTED — not echoed back from the prompt.
check(
  "the footer is grounded in the LEARNER's apparatus (v = 13, m = 13/7 = 1.86)",
  /\b13\b/.test(footer) && /1\.86/.test(footer),
  footer.slice(0, 140),
);
const footColors = await footerColors();
check(
  "generated math wears the same colour key as the figure (u, v, m)",
  [RGB.u, RGB.v, RGB.m].every((c) => footColors.includes(c)),
  footColors.join(" "),
);

const labelsAfter = await turnLabels();
const added = labelsAfter.slice(labelsBefore.length);
// Exactly TWO turns: the question and the answer. The ephemeral thinking leaf is engine
// scaffolding and must leave no trace in the log, and the ✨ is what marks the tutor as
// having acted in the moment rather than having been authored ahead of time.
check(
  "the exchange lands as two attributed turns: You → Tutor ✨",
  added.length === 2 && /^you$/i.test(added[0] ?? "") && /tutor/i.test(added[1] ?? "") && (added[1] ?? "").includes("✨"),
  added.join(" → ") || `${labelsBefore.length} → ${labelsAfter.length} turns`,
);
check("the learner's question is echoed verbatim in the log", (await bodyText()).includes(QUESTION));
check("still exactly ONE canvas after the detour", (await canvasCount()) === 1, `count=${await canvasCount()}`);
check("the apparatus is still drawing on the generated beat", (await inkFraction()) > 0.01);
await p.screenshot({ path: `${out}-05b-generated-answer.png` });

// An `explain` beat renders into `prose` and nothing into `prompt`, so StudioView's DERIVED
// Continue appears on the generated beat for free — and `next: <the interrupted beat>` is
// what makes the interruption a detour instead of a place to get stuck.
check("the generated beat offers Continue for free", await hasContinue());
await clickText(/continue|got it/);
await sleep(1400);
check("Continue on the answer RESUMED the interrupted explorable", await hasRange());
check("the learner's slider value survived the detour", (await sliderValue()) === "13", `v=${await sliderValue()}`);
const labelsResumed = await turnLabels();
check("resuming is not a new step (no turn appended)", labelsResumed.length === labelsAfter.length, `${labelsAfter.length} → ${labelsResumed.length}`);
check("no provider request ever left the browser", providerHits.length === 0, providerHits.slice(0, 2).join(" "));

// ══ the fill-in gate: wrong first ══════════════════════════════════════════════════
const stepsToM = await advanceUntil(hasAnswerBox, 4);
check("reached magnification gate", stepsToM >= 0, `${stepsToM} advances`);
check("apparatus survives the fill-in gate", (await canvasCount()) === 1);
const typed = await p.evaluate(() => {
  const el = [...document.querySelectorAll("input")].find((i) => i.type !== "range" && /answer/i.test(i.placeholder || ""));
  if (!el) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(el, "5");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
});
check("typed a wrong answer", typed);
await mark();
await clickText(/check/);
await sleep(800);
await clickText(/continue/);
await sleep(1700);
check("wrong fill-in routed to walkthrough", await tailMatch(/substitute/i));
await p.screenshot({ path: `${out}-06-fillin-remediation.png` });

// ══ move-object explorable (goal u = 7) then the recap ══════════════════════════════
const stepsToObj = await advanceUntil(hasRange, 4);
check("reached move-object explorable", stepsToObj >= 0, `${stepsToObj} advances`);
await setSlider(7);
await sleep(1600);
check("goal met revealed m = 1 prose", /same size as the object/i.test(await bodyText()));
await p.screenshot({ path: `${out}-07-move-object.png` });

await mark();
const stepsToRecap = await advanceUntil(() => tailMatch(/Key takeaways/i), 5);
check("reached the recap", stepsToRecap >= 0, `${stepsToRecap} advances`);
check("still exactly ONE canvas after every turn", (await canvasCount()) === 1, `count=${await canvasCount()}`);
check("apparatus still drawing at the end", (await inkFraction()) > 0.01);
// Every authored string in the transcript went through the markdown+KaTeX parser. A leftover
// `$` means some field (a gate's feedback, a hint, a past turn's prose) is being printed as
// literal text instead; a leftover `**` means an emphasis run failed to pair — which is what
// happens when a `**bold**` wraps a `$math$` span and the two parsers are applied separately.
const raw = (await bodyText()).match(/\$[^$\n]{1,60}\$/g);
check("no un-typeset $math$ anywhere in the transcript", raw === null, raw ? raw.slice(0, 3).join(" | ") : "");
const rawBold = (await bodyText()).match(/\*\*[^*\n]{1,60}\*\*/g);
check("no un-styled **bold** anywhere in the transcript", rawBold === null, rawBold ? rawBold.slice(0, 3).join(" | ") : "");
await p.screenshot({ path: `${out}-08-recap.png` });

// ══ narration ══════════════════════════════════════════════════════════════════════
const audible = ttsCalls.filter((c) => c.ok);
check("narration synthesized per beat", audible.length >= 10, `${audible.length}/${ttsCalls.length} clips with audio`);
check("clips carry real mp3 bytes", audible.length > 0 && audible.every((c) => c.bytes > 5000), `min=${audible.length ? Math.min(...audible.map((c) => c.bytes)) : 0}B`);
check("clips carry word timings", audible.length > 0 && audible.every((c) => c.words > 0), `min words=${audible.length ? Math.min(...audible.map((c) => c.words)) : 0}`);
console.log(
  `\naudio: ${audible.length} clips, ${(audible.reduce((a, c) => a + c.bytes, 0) / 1024).toFixed(0)} KB, ${(audible.reduce((a, c) => a + c.ms, 0) / 1000).toFixed(1)}s narration`,
);
console.log(`director: ${directCalls.length} /api/direct call(s) — ${directCalls.map((c) => `${c.mode} (${c.detail})`).join(", ") || "none"}`);

const realErrors = errors.filter(
  (e) => !/favicon|autoplay|play\(\)|NotAllowedError|Failed to load resource/i.test(e),
);
if (realErrors.length) console.log("\nerrors:\n" + realErrors.slice(0, 8).join("\n"));
check("no page errors", realErrors.length === 0, `${errors.length} raw / ${realErrors.length} real`);

await b.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) console.log("failed: " + failed.map((f) => f.name).join(", "));
process.exit(failed.length ? 1 : 0);
