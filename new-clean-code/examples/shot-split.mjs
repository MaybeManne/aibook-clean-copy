// Screenshot the template demo: the preset × mode matrix (the data-driven proof — one unmodified
// lesson under four presentations), the layout overrides, then advancing through scene + MCQ beats.
import puppeteer from "puppeteer";
const url = process.argv[2] ?? "http://localhost:5177/";
const out = process.argv[3] ?? "/tmp/ls-split";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 820, deviceScaleFactor: 1 });
const errors = [];
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));

const failures = [];
const check = (ok, msg) => {
  console.log(`  ${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures.push(msg);
};

const clickText = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || ""));
    if (el) { el.click(); return true; }
    return false;
  }, re.source);

const clickAttr = (sel) =>
  p.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) { el.click(); return true; }
    return false;
  }, sel);

/** The layout override is a select, not a button row — the demo's controls stay out of the lesson's way. */
const pickLayout = async (id) => {
  const got = await p.select("[data-ls-layout-pick]", id).catch(() => null);
  return Array.isArray(got) && got.includes(id);
};

/** Is there a narration control, and what does it currently offer? */
const narrationLabel = () =>
  p.evaluate(() => document.querySelector('button[aria-label*="narration" i]')?.getAttribute("aria-label") ?? null);

/** What the studio is currently rendering, read off the DOM rather than assumed. */
const state = () =>
  p.evaluate(() => {
    const root = document.querySelector("[data-ls-theme]");
    const scroller = document.querySelector("[data-lk-scroll]");
    return {
      theme: root?.getAttribute("data-ls-theme") ?? null,
      mode: root?.getAttribute("data-ls-mode") ?? null,
      layout: root?.getAttribute("data-ls-layout") ?? null,
      docMode: document.documentElement.dataset.lsMode ?? null,
      // The page ground must follow the theme, or a light template shows a dark gutter.
      bodyBg: getComputedStyle(document.body).backgroundColor,
      cssBg: getComputedStyle(document.documentElement).getPropertyValue("--ls-bg").trim(),
      colorScheme: document.documentElement.style.colorScheme,
      // Serif vs sans is the visible half of "a fundamentally different template".
      readingFont: scroller ? getComputedStyle(scroller.firstElementChild ?? scroller).fontFamily : null,
      svgFills: [...document.querySelectorAll("svg [fill]")].slice(0, 400).map((n) => n.getAttribute("fill")),
    };
  });

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(900);

// ---------------------------------------------------------------- the preset × mode matrix
console.log("[preset × mode: one lesson, four presentations]");
const seen = {};
let shot = 0;
for (const preset of ["studio", "paper"]) {
  check(await clickAttr(`[data-ls-preset="${preset}"]`), `picked preset ${preset}`);
  await sleep(500);
  for (const want of ["dark", "light"]) {
    const now = await state();
    if (now.mode !== want) {
      check(await clickAttr(`[data-ls-theme-toggle="${want}"]`), `toggled to ${want}`);
      await sleep(500);
    }
    const s = await state();
    const tag = `${preset}-${s.mode}`;
    check(s.theme === `${preset}-${s.mode}`, `${tag}: data-ls-theme is ${s.theme}`);
    check(s.mode === want, `${tag}: mode is ${want}`);
    check(s.docMode === s.mode, `${tag}: the document follows the shell (documentElement data-ls-mode=${s.docMode})`);
    check(s.colorScheme === want, `${tag}: color-scheme=${s.colorScheme}, so native widgets follow`);
    check(!!s.cssBg, `${tag}: --ls-bg published (${s.cssBg})`);
    check(s.layout === (preset === "paper" ? "single" : "split:left"), `${tag}: layout is ${s.layout}`);
    seen[tag] = s;
    await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-${tag}.png` });
  }
}

// The four presentations must differ from each other in ground AND, for paper, in typeface.
const grounds = new Set(Object.values(seen).map((s) => s.bodyBg));
check(grounds.size === 4, `all four presentations have a distinct page ground (${[...grounds].join(" | ")})`);
check(
  /serif/i.test(seen["paper-light"]?.readingFont ?? "") && !/serif/i.test((seen["studio-dark"]?.readingFont ?? "").replace(/sans-serif/gi, "")),
  `paper reads in a serif face and studio does not (paper: ${String(seen["paper-light"]?.readingFont).slice(0, 40)}…)`,
);

// The figure must be re-painted too, not just the chrome around it.
const darkFills = new Set(seen["studio-dark"]?.svgFills ?? []);
const lightFills = new Set(seen["studio-light"]?.svgFills ?? []);
check(darkFills.size > 0 && [...darkFills].some((f) => !lightFills.has(f)), "the figure's own fills change with the theme, not just the page chrome");

// ---------------------------------------------------------------- layout overrides
console.log("\n[layout overrides: geometry is separately addressable]");
check(await clickAttr('[data-ls-preset="studio"]'), "back to the studio preset");
await sleep(400);
check(await pickLayout("right60"), "override → visuals right 60%");
await sleep(500);
check((await state()).layout === "split:right", "layout is split:right");
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-override-right60.png` });

check(await pickLayout("single"), "override → force single column");
await sleep(500);
check((await state()).layout === "single", "layout is single");
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-override-single.png` });

check(await pickLayout("preset"), "back to the preset default");
await sleep(400);

// ---------------------------------------------------------------- walk the flow
console.log("\n[the lesson still plays]");
// The lesson's OWN affordances drive it — there is no debug Next on this page any more.
check(/narration/i.test((await narrationLabel()) ?? ""), `the narrated beat offers a narration control (${await narrationLabel()})`);
check(await clickText(/start/), "start (intro→explore)");
await sleep(900);
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-scene.png` });

check(await clickText(/i see how it builds/), "continue (explore→check)");
await sleep(700);
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-mcq.png` });

check(await clickText(/sums every product/), "answered the MCQ");
await sleep(600);
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-answered.png` });

// A mode switch AFTER answering must not reset the session.
check(await clickAttr('[data-ls-theme-toggle="light"]') || await clickAttr('[data-ls-theme-toggle="dark"]'), "toggled mode mid-lesson");
await sleep(500);
const after = await p.evaluate(() => document.body.innerText.includes("Continue") || document.body.innerText.includes("complete"));
check(after, "the answered state survives the theme switch (the lesson is not remounted)");
await p.screenshot({ path: `${out}-${String(++shot).padStart(2, "0")}-answered-switched.png` });

console.log("\nconsole errors:", errors.length ? errors.slice(0, 12) : "none");
console.log(`${shot} screenshots → ${out}-*.png`);
if (failures.length || errors.length) {
  console.log(`\nSPLIT WALK FAIL — ${failures.length} assertion(s), ${errors.length} console error(s)`);
  await b.close();
  process.exit(1);
}
console.log("\nSPLIT WALK PASS — one lesson, four presentations, layout overrides, and a mid-lesson mode switch that preserves state.");
await b.close();
