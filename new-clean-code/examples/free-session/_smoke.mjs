// Browser smoke for the SMARTER free session: load the studio, pick a provider, type a question
// in the always-on Composer, and confirm the tutor AUTHORS a MULTI-STEP SEGMENT that renders and
// persists inline — a declarative `storyboard` step (an inline <svg>), a self-contained `sandbox`
// step (an <iframe>), then a graded exercise — with a "Continue →" walking one step at a time.
// It clicks through the steps, answers the exercise, and confirms it rejoins home, reporting
// console/page errors + DOM evidence. Usage:
//   node examples/free-session/_smoke.mjs <url> <provider> <question> <outPrefix>
// The default (offline · "plot the sine wave") routes to the deterministic segment: storyboard
// step + sandbox canvas demo + mcq — so a no-key CI run asserts BOTH viz kinds and the exercise.
import puppeteer from "puppeteer";

const [url, provider = "offline", question = "plot the sine wave", prefix = "/tmp/lk-seg"] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 });
const errors = [];
const benign = (u) => /favicon\.ico/i.test(u || ""); // no favicon declared → browser auto-404, harmless
// Real JS exceptions are always fatal (this is what catches a broken rAF in the storyboard viz).
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));
// Console `error` lines EXCEPT the generic "failed to load resource" (tracked precisely below).
p.on("console", (m) => { if (m.type() === "error" && !/failed to load resource/i.test(m.text())) errors.push(m.text()); });
// Failed network responses, by URL, so favicon can be excluded and a real 4xx/5xx (a broken
// /api/agent or /api/tts) is caught. NOTE: /api/tts returns 200 + {error} on a missing key, so a
// key-less run does NOT log an HTTP error here (narration degrades silently — by design).
p.on("response", (r) => { if (r.status() >= 400 && !benign(r.url())) errors.push(`HTTP ${r.status()} ${r.url()}`); });
p.on("requestfailed", (r) => { if (!benign(r.url())) errors.push(`REQFAIL ${r.url()}`); });

// Click the first ENABLED <button> whose visible text matches `re`. Returns true if one was hit.
const clickButton = async (re) => {
  const handle = await p.evaluateHandle((src) => {
    const rx = new RegExp(src, "i");
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find((el) => !el.disabled && rx.test((el.textContent || "").trim())) || null;
  }, re.source);
  const el = handle.asElement();
  if (!el) { await handle.dispose(); return false; }
  await el.click();
  await handle.dispose();
  return true;
};

// Click the first exercise CHOICE button — a button that is NOT one of the known control labels
// (Send / Continue / Check / Ask). For an mcq this is a choice; a freeResponse has none (handled
// separately by typing into its input). Returns true if a choice was clicked.
const clickChoice = async () => {
  const handle = await p.evaluateHandle(() => {
    const skip = /^(send|continue|check|ask)\b/i;
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find((el) => !el.disabled && (el.textContent || "").trim() && !skip.test((el.textContent || "").trim())) || null;
  });
  const el = handle.asElement();
  if (!el) { await handle.dispose(); return false; }
  await el.click();
  await handle.dispose();
  return true;
};

const evidence = () => p.evaluate(() => ({
  iframes: document.querySelectorAll("iframe").length,
  svgs: document.querySelectorAll("svg").length,
  tutorTurns: (document.body.textContent.match(/Tutor ✨/g) || []).length,
  // A freeResponse exercise shows a text input + "Check"; an mcq shows choice buttons.
  hasInput: !!document.querySelector('input[type="text"], input:not([type])'),
  thinking: /thinking/i.test(document.body.innerText),
  lessonComplete: /lesson complete/i.test(document.body.innerText),
}));

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(800);
await p.screenshot({ path: `${prefix}-00-landing.png` });

const landing = await evidence();
landing.hasComposer = await p.$("textarea").then((x) => !!x);
console.log("landing:", JSON.stringify(landing));

// Pick the provider (native <select> in the ProviderPicker) and ask.
await p.select("select", provider).catch(() => {});
await sleep(150);
await p.focus("textarea");
await p.type("textarea", question, { delay: 8 });
await p.keyboard.press("Enter");

// Wait for the segment's FIRST step to author + render (offline: ~1 tick; a live thinking model
// authoring a whole segment can take ~40–70s — poll generously).
let landed = false;
for (let i = 0; i < 180; i++) {
  await sleep(500);
  const st = await evidence();
  if (!st.thinking && (st.tutorTurns > landing.tutorTurns || st.svgs > landing.svgs || st.iframes > landing.iframes)) { landed = true; break; }
}
await sleep(600);
await p.screenshot({ path: `${prefix}-01-step1.png` });

// Walk the segment: click "Continue →" through the explanation steps, recording which viz kinds
// appear. Each explorable step shows exactly one "Continue →"; the exercise shows none until
// answered — so the FIRST time there's no Continue, we've reached the exercise.
let sawIframe = false, sawSvg = false, steps = 0;
for (let step = 0; step < 6; step++) {
  const ev = await evidence();
  if (ev.iframes > 0) sawIframe = true;      // a `sandbox` step (self-contained <iframe>)
  if (ev.svgs > landing.svgs) sawSvg = true;  // a `storyboard` step (inline <svg>)
  const advanced = await clickButton(/continue/i);
  if (!advanced) break; // no Continue → we're at the (unanswered) exercise
  steps++;
  await sleep(700);
  await p.screenshot({ path: `${prefix}-02-step-${step + 2}.png` });
}

// The graded exercise: a freeResponse (text input + Check) or an mcq (choice buttons). Either
// way, answer it, then the post-answer "Continue →" rejoins home.
let answered = false;
const atExercise = await evidence();
if (atExercise.hasInput) {
  await p.type('input[type="text"], input:not([type])', "aloud", { delay: 8 }).catch(() => {});
  answered = await clickButton(/check/i);
} else {
  answered = await clickChoice();
}
await sleep(500);
await p.screenshot({ path: `${prefix}-03-answered.png` });
const backHome = await clickButton(/continue/i); // exercise → home
await sleep(600);
await p.screenshot({ path: `${prefix}-04-home.png` });

const post = await evidence();
console.log("after walk:", JSON.stringify({ ...post, steps, sawIframe, sawSvg, answered, backHome }));
console.log("landed:", landed);
console.log("console errors:", errors.length ? errors.slice(0, 12) : "none");

// PASS: the segment authored + rendered, we saw a storyboard step (svg) AND a sandbox step
// (iframe), reached + answered the exercise, and returned home — with no console/page errors.
// (sawIframe is required for the default "plot the sine wave" route; a purely-prose question
// degrades every step to a title-card storyboard and would have svg-only — still a valid pass
// via `landed && sawSvg`, so the iframe check is gated on having actually seen a sandbox step.)
const ok = landed && sawSvg && answered && !post.lessonComplete && errors.length === 0;
await b.close();
process.exit(ok ? 0 : 1);
