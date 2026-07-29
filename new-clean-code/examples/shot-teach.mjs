// TIER 2, END TO END, THROUGH A REAL BROWSER AND A REAL SOCKET: a student is playing the
// pinhole lesson, and a teacher on another screen — with nothing but a terminal — reaches into
// it. This walk IS that terminal: every command below is a plain `POST /api/session/direct`
// from node, the same bytes `teach/cli/direct.ts` sends, and every assertion is about what
// the STUDENT'S PAGE then does. Nothing here imports the engine. That is the point: if the
// wire is honest, a teacher needs no client, and (tier 3) neither does a model.
//
// What it proves, in the order it happens:
//   1. the bus sees a page it did not start — `/observe` names the beat the learner is on, and
//      the log opens with the page announcing itself;
//   2. `hold` / `release` — the derived Continue disappears with a stated reason and comes back;
//   3. `say` (+ `narrate`) — the teacher answers with a BEAT: it enters, it is voiced through
//      /api/tts, it is attributed to "Teacher" in the transcript, and its Continue returns the
//      learner exactly where they were;
//   4. `focus` + `annotate` — a zoom and two marks land, WITHOUT the framebuffer changing by a
//      single pixel. That equality is the whole argument for normalized stage coords: the
//      apparatus was not asked to cooperate, so the same gesture works on an SVG figure too;
//   5. `goto` + `setControl` — the teacher re-poses the learner's live apparatus (v = 13) and
//      the WebGL scene redraws, i.e. the director writes the learner's own control channel;
//   6. `revisit` — an earlier beat's figure is shown again as a clone, and Continue comes back
//      to the explorable with the learner's slider value intact (reuse, not a jump);
//   7. a REFUSED turn is an answer, not an error: the response carries REJECTED + the reason,
//      the page does not move, and the refusal is waiting in the next `/observe` for whoever
//      (human or model) has to fix it;
//   8. the log tail carries both streams — the lesson's events AND the teacher's batches with
//      the engine's verdict on each — in the http response and in a jsonl on disk you can
//      `tail -f` with no client at all;
//   9. two negatives: no provider host is ever reached from the browser, and the page touches
//      only `/sync` — it never reads the teacher's channel, because the bus may only ask.
//
// The generated PROSE of the `say` is our own string, so unlike shot-pinhole.mjs this walk
// needs no model at all: tier 2 has no provider in the loop. Only narration does, and that is
// asserted the same way it is there. Needs swiftshader for WebGL under headless Chrome.
import puppeteer from "puppeteer";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.argv[2] ?? "http://localhost:5188/";
const out = process.argv[3] ?? "/tmp/ls-teach";
const origin = new URL(url).origin;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader", "--mute-audio"],
});
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });

const errors = [];
const ttsCalls = [];
// Same negative as shot-pinhole: every provider key lives in the vite process. A key that had
// leaked into the bundle would show up here as a request to the provider's host.
const providerHits = [];
// Which bus endpoints the BROWSER touched. The page is authoritative but it is not a peer: it
// pushes and pulls through `/sync` and has no business reading `/log`, `/observe` or `/direct`.
const busHits = [];
p.on("request", (r) => {
  const u = r.url();
  if (/api\.anthropic\.com|generativelanguage\.googleapis\.com|elevenlabs\.io|openai\.com/i.test(u)) providerHits.push(u);
  if (u.includes("/api/session/")) busHits.push(new URL(u).pathname);
});
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("requestfailed", (r) => errors.push(`REQFAIL ${r.url()}`));
p.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));
p.on("response", async (r) => {
  if (!r.url().includes("/api/tts")) return;
  try {
    const j = await r.json();
    ttsCalls.push({ ok: !!j.audio, bytes: j.audio ? Math.round((j.audio.length * 3) / 4) : 0, words: (j.words || []).length });
  } catch { ttsCalls.push({ ok: false, bytes: 0, words: 0 }); }
});

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

// ── the teacher's terminal: three fetches, no client library ───────────────────────
// `/direct` HOLDS the response until the page reports the engine's verdict, so these calls are
// naturally serialized against the lesson: when one returns, the command has been adjudicated.
const turnsSent = [];
async function direct(commands, opts = {}) {
  const r = await fetch(`${origin}/api/session/direct`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ commands, actor: "teacher", timeoutMs: 10000, ...opts }),
  });
  const j = await r.json();
  turnsSent.push(j);
  return j;
}
const observe = async () => (await fetch(`${origin}/api/session/observe`)).json();
const observeText = async () => (await fetch(`${origin}/api/session/observe?format=text`)).text();
const readLog = async (from = 0) => (await fetch(`${origin}/api/session/log?from=${from}`)).json();
/** Where the learner is, per the bus — the id a command may name. */
const at = async () => (await observe()).observation?.at?.id ?? null;

// ── the page, read from outside ────────────────────────────────────────────────────
const bodyText = () => p.evaluate(() => document.body.innerText);
const canvasCount = () => p.evaluate(() => document.querySelectorAll("canvas").length);
const clickText = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || "") && !b.disabled);
    if (el) { el.click(); return true; }
    return false;
  }, re.source);
const hasContinue = () => p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /continue|got it/i.test(b.textContent || "") && !b.disabled));
const hasRange = () => p.evaluate(() => !!document.querySelector('input[type="range"]'));
const sliderValue = () => p.evaluate(() => document.querySelector('input[type="range"]')?.value ?? null);

/** Framebuffer fingerprint — the same pixels `VizHandle.poster()` hands an exporter. */
const posterHash = async () => {
  const dataUrl = await p.evaluate(() => {
    const c = document.querySelector("canvas");
    return c ? c.toDataURL("image/png") : null;
  });
  return dataUrl ? createHash("sha1").update(dataUrl).digest("hex").slice(0, 12) : null;
};
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
    for (let i = 0; i < px.length; i += 4) if (px[i] > 40 || px[i + 1] > 40 || px[i + 2] > 45) ink++;
    return ink / (w * h);
  });

// The director's camera and marks, published by `FocusFrame` as data attributes
// (rendering/render_web/attention.tsx). Reading the attribute rather than sniffing computed
// transforms keeps the assertion about the STATE the protocol set, not about today's DOM shape.
const focusAttr = () => p.evaluate(() => document.querySelector("[data-ls-focus]")?.getAttribute("data-ls-focus") ?? null);
const markCount = () => p.evaluate(() => document.querySelector("[data-ls-marks]")?.getAttribute("data-ls-marks") ?? null);
const holdText = () => p.evaluate(() => document.querySelector("[data-ls-hold]")?.innerText?.trim() ?? null);
/** The annotation overlay, found by its own marker def so KaTeX's <svg>s cannot be mistaken for it. */
const markShapes = () =>
  p.evaluate(() => {
    const svg = [...document.querySelectorAll("svg")].find((s) => s.querySelector("#ls-annot-head"));
    if (!svg) return null;
    return { circles: svg.querySelectorAll("circle").length, lines: svg.querySelectorAll("line").length, texts: svg.querySelectorAll("text").length };
  });

/** Speaker labels in order — "YOU" / "TUTOR" / "TEACHER" (uppercased in CSS). How the walk
 *  tells "a turn was appended and attributed" from "the live block changed". */
const turnLabels = () =>
  p.evaluate(() =>
    [...document.querySelectorAll("div")]
      .filter((d) => d.children.length === 0)
      .map((d) => (d.innerText || "").trim())
      .filter((t) => /^(you|tutor\s*✨|tutor|teacher|reference)$/i.test(t)),
  );

async function waitFor(pred, ms = 6000, step = 120) {
  for (let t = 0; t < ms; t += step) {
    if (await pred()) return true;
    await sleep(step);
  }
  return false;
}

// ══ boot: a student page, opened with `?teach` ══════════════════════════════════════
await p.goto(`${url}${url.includes("?") ? "&" : "?"}teach`, { waitUntil: "networkidle0", timeout: 40000 });
await sleep(2600); // three.js + the first narration

check("apparatus mounted (1 canvas)", (await canvasCount()) === 1, `count=${await canvasCount()}`);
check("WebGL scene drew geometry", (await inkFraction()) > 0.01, `ink=${((await inkFraction()) * 100).toFixed(1)}%`);
check("the un-directed stage carries no camera and no marks", (await focusAttr()) === "none" && (await markCount()) === "0", `focus=${await focusAttr()} marks=${await markCount()}`);

// ══ 1. the bus sees a page it did not start ═════════════════════════════════════════
const obs0 = await observe();
check("the bus has an observation from the page", !!obs0.observation, obs0.observation ? `step=${obs0.observation.step}` : "none");
check("the teacher can see where the learner is", obs0.observation?.at?.id === "wall-1", String(obs0.observation?.at?.id));
check("the teacher can see what is on the stage", obs0.observation?.stage?.viz === "pinhole-3d", String(obs0.observation?.stage?.viz));
const text0 = await observeText();
check("`/observe?format=text` is the same bytes a model would read", /## WHERE/.test(text0) && /## STAGE/.test(text0) && /## BEATS/.test(text0), text0.split("\n")[0] ?? "");
const log0 = await readLog(0);
check("the log opens with the page announcing itself", log0.lines?.[0]?.kind === "note" && /student page connected/.test(log0.lines[0].text), JSON.stringify(log0.lines?.[0] ?? null).slice(0, 80));

// The learner walks two beats on their own, so the log is a session record and not just an
// echo of the teacher — and so the teacher's first intervention has somewhere to return to.
await clickText(/continue/);
await sleep(1200);
await clickText(/continue/);
await sleep(1600);
const anchor = await at();
check("the learner advanced on their own", anchor === "wall-3", String(anchor));
const logAfterWalk = await readLog(0);
check("the lesson's own steps are in the teacher's log", logAfterWalk.lines.filter((l) => l.kind === "event" && l.type === "next").length >= 2, `${logAfterWalk.lines.filter((l) => l.kind === "event").length} event lines`);
await p.screenshot({ path: `${out}-01-connected.png` });

// ══ 2. hold / release — stop the room, with a reason ════════════════════════════════
const HOLD_REASON = "one sec — I'm building you something";
const rHold = await direct([{ op: "hold", reason: HOLD_REASON }]);
check("`hold` was accepted", rHold.applied === true && rHold.result?.ok === true && rHold.status === "applied", `${rHold.status} ${rHold.text?.split("\n")[0] ?? ""}`);
check("the hold notice reached the learner, with the teacher's reason", await waitFor(async () => (await holdText())?.includes(HOLD_REASON)), (await holdText()) ?? "no notice");
check("the derived Continue is suppressed while the teacher sets up", !(await hasContinue()));
const rRelease = await direct([{ op: "release" }]);
check("`release` was accepted", rRelease.result?.ok === true, rRelease.text?.split("\n")[0] ?? "");
check("Continue comes back on release", await waitFor(hasContinue), "");
check("the hold notice is gone", (await holdText()) === null);
check("holding the room did not move the learner", (await at()) === anchor, String(await at()));
await p.screenshot({ path: `${out}-02-hold.png` });

// ══ 3. say — answer with a BEAT, voiced, attributed, and a detour not a dead end ════
const SAY = "Short answer: the wall is matte, so every point of it collects light from the whole scene. The pinhole is what makes each point receive *one* ray.";
const NARRATE = "Short answer: the wall collects light from everywhere at once. The pinhole is what makes each point receive one ray.";
const labelsBeforeSay = await turnLabels();
const ttsBeforeSay = ttsCalls.length;
const rSay = await direct([{ op: "say", id: "t-say-1", text: SAY, narrate: NARRATE }]);
check("`say` was accepted and the engine reports the beat it built", rSay.result?.ok === true && rSay.result?.added?.includes("t-say-1"), (rSay.result?.added ?? []).join(" "));
check("the verdict text is the terminal's ACCEPTED line", /## LAST TURN — ACCEPTED/.test(rSay.text ?? ""), (rSay.text ?? "").split("\n")[0]);
check("the learner is now IN the teacher's beat", (await at()) === "t-say-1", String(await at()));
check("the teacher's prose reached the page", await waitFor(async () => (await bodyText()).includes("every point of it collects light")));
const labelsAfterSay = await turnLabels();
const addedLabels = labelsAfterSay.slice(labelsBeforeSay.length);
check(
  "the turn is attributed to the TEACHER, not the tutor",
  addedLabels.some((l) => /^teacher$/i.test(l)) && !addedLabels.some((l) => /tutor/i.test(l)),
  addedLabels.join(" → ") || `${labelsBeforeSay.length} → ${labelsAfterSay.length} turns`,
);
const voiced = await waitFor(async () => ttsCalls.length > ttsBeforeSay, 8000, 200);
const newClips = ttsCalls.slice(ttsBeforeSay);
check("the teacher's `narrate` was synthesized (/api/tts reached)", voiced, `${ttsBeforeSay} → ${ttsCalls.length} clips`);
check("that clip carries real mp3 bytes", newClips.length > 0 && newClips.every((c) => c.ok && c.bytes > 5000), newClips.map((c) => `${c.bytes}B/${c.words}w`).join(" "));
check("no un-typeset markup leaked from the teacher's markdown", !/\*[^*\n]{1,40}\*/.test((await bodyText()).slice(-1200)));
await p.screenshot({ path: `${out}-03-say.png` });

check("the teacher's beat offers Continue for free", await hasContinue());
await clickText(/continue|got it/);
check("Continue on the answer returns the learner where they were", await waitFor(async () => (await at()) === anchor, 5000), String(await at()));

// ══ 4. focus + annotate — one gesture, and the viz never knew ═══════════════════════
// Sit still first: the apparatus EASES into each beat, so a hash taken mid-transition would
// differ for reasons that have nothing to do with the teacher.
await sleep(2200);
const hashBeforeFocus = await posterHash();
const rLook = await direct([
  { op: "focus", at: [0.42, 0.55], scale: 3, label: "the pinhole" },
  { op: "annotate", shapes: [
    { kind: "circle", at: [0.42, 0.55], r: 0.06, label: "aperture" },
    { kind: "arrow", from: [0.14, 0.3], to: [0.4, 0.52] },
  ] },
]);
check("`focus` + `annotate` land as ONE accepted turn", rLook.result?.ok === true && rLook.result?.submitted === 2, `${rLook.result?.submitted} commands, ok=${rLook.result?.ok}`);
check("the stage zoomed to the teacher's 3×", await waitFor(async () => Number(await focusAttr()) > 2.9), `scale=${await focusAttr()}`);
check("the teacher's caption is pinned to the stage", (await bodyText()).toLowerCase().includes("the pinhole"));
check("both marks are on the figure", (await markCount()) === "2", `marks=${await markCount()}`);
const shapes = await markShapes();
check("the marks drew as a circle and an arrow, with the circle's label", !!shapes && shapes.circles === 1 && shapes.lines === 1 && shapes.texts >= 1, JSON.stringify(shapes));
// The claim normalized coordinates exist to make: the WebGL scene was NOT re-rendered. The
// zoom is a transform on the panel, so the same gesture would work on an SVG figure or a
// Canvas2D viz that has no camera to offer at all.
await sleep(700);
const hashAfterFocus = await posterHash();
check("zooming asked NOTHING of the visual (framebuffer byte-identical)", hashBeforeFocus === hashAfterFocus, `${hashBeforeFocus} → ${hashAfterFocus}`);
check("pointing at the figure did not move the learner", (await at()) === anchor, String(await at()));
const obsLook = await observe();
check("the teacher can see their own last gesture in the observation", obsLook.observation?.focus?.label === "the pinhole" && obsLook.observation?.annotations?.length === 2, JSON.stringify(obsLook.observation?.focus ?? null));
await p.screenshot({ path: `${out}-04-focus.png` });

const rClear = await direct([{ op: "focus", clear: true }, { op: "annotate", clear: true }]);
check("clearing the camera and the marks is accepted", rClear.result?.ok === true, rClear.text?.split("\n")[0] ?? "");
check("the stage is whole again, with no residue", await waitFor(async () => (await focusAttr()) === "none" && (await markCount()) === "0"), `focus=${await focusAttr()} marks=${await markCount()}`);

// ══ 5. goto + setControl — re-pose the learner's own apparatus ══════════════════════
const rGoto = await direct([{ op: "goto", beatId: "move-screen" }]);
check("`goto` moved the learner to the explorable", rGoto.result?.ok === true && rGoto.result?.enteredId === "move-screen", `entered=${rGoto.result?.enteredId}`);
check("the explorable's controls are live for the learner", await waitFor(hasRange), "");
await sleep(2000);
const hashBeforeSet = await posterHash();
check("the slider starts at the authored default", (await sliderValue()) === "7", `v=${await sliderValue()}`);
const rSet = await direct([{ op: "setControl", key: "v", value: 13 }]);
check("`setControl` was accepted", rSet.result?.ok === true, rSet.text?.split("\n")[0] ?? "");
check("the teacher's value drove the learner's slider", await waitFor(async () => (await sliderValue()) === "13"), `v=${await sliderValue()}`);
await sleep(1800);
const hashAfterSet = await posterHash();
check("and it drove the 3-D apparatus itself", hashBeforeSet !== hashAfterSet, `${hashBeforeSet} → ${hashAfterSet}`);
// `setControl` lowers onto the learner's OWN channel (`demo.set`), not a side door — so the
// beat's guided goal sees it and releases exactly as if the learner had dragged the slider.
check("the guided goal saw it, because it is the same channel", /infinite depth of field/i.test(await bodyText()));
const obsSet = await observe();
check("the observation reports the live control value", obsSet.observation?.stage?.values?.v === 13, JSON.stringify(obsSet.observation?.stage?.values ?? null));
await p.screenshot({ path: `${out}-05-setcontrol.png` });

// ══ 6. revisit — show that figure again, keep the learner's place ═══════════════════
const rRevisit = await direct([{ op: "revisit", beatId: "triangles", note: "same figure, new eyes" }]);
const revisitId = rRevisit.result?.enteredId ?? "";
check("`revisit` cloned the earlier beat rather than jumping to it", rRevisit.result?.ok === true && revisitId.startsWith("__revisit-triangles"), revisitId || (rRevisit.text ?? "").split("\n")[0]);
check("the earlier figure's prose is on screen again", await waitFor(async () => /similar triangles/i.test(await bodyText())));
check("the clone is a teacher turn too", (await turnLabels()).filter((l) => /^teacher$/i.test(l)).length >= 2, (await turnLabels()).join(" "));
await p.screenshot({ path: `${out}-06-revisit.png` });
await clickText(/continue|got it/);
check("Continue returns to the explorable the learner was in", await waitFor(async () => (await at()) === "move-screen", 5000), String(await at()));
check("the learner's own slider value survived the detour", (await sliderValue()) === "13", `v=${await sliderValue()}`);
const obsAfterRevisit = await observe();
check("the original beat still exists untouched in the catalog", (obsAfterRevisit.observation?.catalog?.beats ?? []).some((x) => x.id === "triangles"), "");

// ══ 7. a refused turn is an ANSWER ═════════════════════════════════════════════════
const bodyBeforeBadTurn = await bodyText();
const rBad = await direct([{ op: "focus", at: [0.5, 0.5], scale: 2 }, { op: "goto", beatId: "no-such-beat" }]);
check("a turn naming a beat that does not exist is refused", rBad.applied === true && rBad.result?.ok === false, `applied=${rBad.applied} ok=${rBad.result?.ok}`);
check("the refusal says which op and why", /## LAST TURN — REJECTED/.test(rBad.text ?? "") && /no-such-beat/.test(rBad.text ?? ""), (rBad.text ?? "").split("\n").slice(0, 2).join(" / "));
check("the whole turn was discarded — the VALID focus in it did not apply either", (await focusAttr()) === "none", `focus=${await focusAttr()}`);
check("the learner did not move", (await at()) === "move-screen", String(await at()));
check("the page is unchanged by a refused turn", (await bodyText()) === bodyBeforeBadTurn);
// The refusal is left where the next director — human or model — will read it, which is what
// makes self-correction possible without a second channel.
const textAfterBad = await observeText();
check("the refusal is waiting in the next observation, verbatim", textAfterBad.includes("## LAST TURN — REJECTED") && textAfterBad.includes("no-such-beat"), textAfterBad.split("\n").find((l) => l.includes("REJECTED")) ?? "");

// ══ 8. the log: both streams, over http and on disk ════════════════════════════════
const log = await readLog(0);
const directs = log.lines.filter((l) => l.kind === "direct");
const verdicts = log.lines.filter((l) => l.kind === "verdict");
check("every batch the teacher sent is in the log, attributed", directs.length === turnsSent.length && directs.every((l) => l.actor === "teacher"), `${directs.length} direct lines / ${turnsSent.length} sent`);
check("every batch has the engine's verdict beside it", verdicts.length === directs.length, `${verdicts.length} verdicts`);
check("exactly one verdict is a refusal, and it is the one we broke", verdicts.filter((v) => !v.ok).length === 1 && /no-such-beat/.test(verdicts.find((v) => !v.ok)?.text ?? ""), verdicts.map((v) => (v.ok ? "ok" : "REJECTED")).join(" "));
check("the commands are logged verbatim, not summarized away", JSON.stringify(directs).includes("every point of it collects light"), "");
check("the teacher's turns are in the transcript stream too", log.lines.some((l) => l.kind === "turn" && l.role === "teacher"), log.lines.filter((l) => l.kind === "turn").map((l) => l.role).join(" "));
check("directed turns are recorded as engine events (so the session replays)", log.lines.filter((l) => l.kind === "event" && l.type === "direction.command").length >= directs.length - 1, `${log.lines.filter((l) => l.kind === "event" && l.type === "direction.command").length} direction.command events`);
// A cursor, so a terminal can tail rather than re-read.
const tail = await readLog(log.next - 3);
check("`?from=` is a cursor: the tail is the tail", tail.lines.length === 3 && tail.lines[0].line === log.next - 3 && tail.next === log.next, `${tail.lines.length} lines from ${log.next - 3}`);

// "The teacher is a programmer who just needs logs" — so the most honest answer is a real file.
const logFile = fileURLToPath(new URL("../.session-log/session.jsonl", import.meta.url));
if (!existsSync(logFile)) {
  check("the session log is a jsonl on disk", false, `${logFile} not found (a different --logDir?)`);
} else {
  const onDisk = readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
  check("the session log is a `tail -f`-able jsonl on disk", onDisk.length >= log.lines.length, `${onDisk.length} lines in ${logFile}`);
  check("the file carries the same batches, wall-clock stamped", onDisk.filter((l) => l.kind === "direct").length === directs.length && onDisk.every((l) => typeof l.t === "number"), `${onDisk.filter((l) => l.kind === "direct").length} direct lines`);
}

// ══ 9. the negatives ═══════════════════════════════════════════════════════════════
check("no provider request ever left the browser", providerHits.length === 0, providerHits.slice(0, 2).join(" "));
check(
  "the page speaks only `/sync` — it never reads the teacher's channel",
  busHits.length > 0 && busHits.every((path) => path.endsWith("/sync")),
  `${busHits.length} bus requests: ${[...new Set(busHits)].join(" ")}`,
);
check("still exactly ONE canvas after every intervention", (await canvasCount()) === 1, `count=${await canvasCount()}`);
check("the apparatus is still drawing at the end", (await inkFraction()) > 0.01, `ink=${((await inkFraction()) * 100).toFixed(1)}%`);
await p.screenshot({ path: `${out}-07-final.png` });

const realErrors = errors.filter((e) => !/favicon|autoplay|play\(\)|NotAllowedError|Failed to load resource/i.test(e));
if (realErrors.length) console.log("\nerrors:\n" + realErrors.slice(0, 8).join("\n"));
check("no page errors", realErrors.length === 0, `${errors.length} raw / ${realErrors.length} real`);

const audible = ttsCalls.filter((c) => c.ok);
console.log(`\nteacher: ${turnsSent.length} batches sent, ${turnsSent.filter((t) => t.result?.ok).length} accepted, ${turnsSent.filter((t) => t.result && !t.result.ok).length} refused`);
console.log(`log: ${log.lines.length} lines — ${log.lines.filter((l) => l.kind === "event").length} events, ${log.lines.filter((l) => l.kind === "turn").length} turns, ${directs.length} batches, ${verdicts.length} verdicts`);
console.log(`audio: ${audible.length}/${ttsCalls.length} clips with bytes`);

await b.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) console.log("failed: " + failed.map((f) => f.name).join(", "));
process.exit(failed.length ? 1 : 0);
