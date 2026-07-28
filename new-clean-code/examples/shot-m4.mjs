// Drive the convolution NARRATIVE SPINE end-to-end in a real browser and assert what matters:
//   1. all 16 beats reach the screen in order (combine → dice → dice-formula → intro → flip →
//      slide → explore → product-grid → polynomial → check → image-2d → image-blur →
//      image-filters → summary; reteach only on a wrong MCQ answer);
//   2. the grid figures render (dice-grid readout, prod-grid diagonal readout);
//   3. the 2-D image PLAYGROUNDS: the conv2d <canvas> mounts on image-2d/blur/filters; on image-2d a
//      canvas drag + scroll-wheel round-trip out to the zoom control (gesture → demo.set → prop); on
//      image-filters the `matrix` kernel editor renders (9 cells + divisor), preset buttons load a
//      weight set (aria-pressed), and hand-editing a cell flips the derived label to "Custom";
//   4. guided goals GATE Continue — absent until the goal is met (dice sum→7, explore shift→4,
//      product-grid diag→4, image-blur sweep→100); the two edited image beats have NO goal, so their
//      Continue shows immediately;
//   5. Continue advances non-interactive beats, and NO debug harness is present;
//   6. KaTeX renders (no raw `$math$` leaks) on the math beats;
//   7. narration is requested per narrated beat (/api/tts), and no page/console errors.
// Run against `LS_ROOT=examples/convolution vite --port 5178`.
import puppeteer from "puppeteer";
const url = process.argv[2] ?? "http://localhost:5178/";
const out = process.argv[3] ?? "/tmp/ls-m4";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"],
});
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 });
await p.bringToFront();

const errors = [];
const ttsCalls = [];
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));
p.on("response", async (r) => {
  if (!r.url().includes("/api/tts")) return;
  try { const j = await r.json(); ttsCalls.push(!!j.audio); } catch { ttsCalls.push(false); }
});

const results = [];
const check = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const bodyText = () => p.evaluate(() => document.body.innerText);
const hasButton = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    return [...document.querySelectorAll("button")].some((el) => rx.test(el.textContent || "") && !el.disabled);
  }, re.source);
const clickText = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || "") && !b.disabled);
    if (el) { el.click(); return true; }
    return false;
  }, re.source);
const setSlider = (v) =>
  p.evaluate((val) => {
    const inp = document.querySelector('input[type="range"]');
    if (!inp) return false;
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    set.call(inp, String(val));
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }, v);
// read the first range slider's numeric value (zoom, on the image beats)
const readSlider = () =>
  p.evaluate(() => {
    const inp = document.querySelector('input[type="range"]');
    return inp ? Number(inp.value) : null;
  });
// count number inputs (matrix editor = 9 cells + 1 divisor)
const countNumberInputs = () => p.evaluate(() => document.querySelectorAll('input[type="number"]').length);
// set the Nth number input the React way (native setter + input/change) — a matrix cell edit
const setNumberInput = (idx, v) =>
  p.evaluate(({ i, val }) => {
    const inp = document.querySelectorAll('input[type="number"]')[i];
    if (!inp) return false;
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    set.call(inp, String(val));
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }, { i: idx, val: v });
// a <span> whose trimmed text is exactly `txt` — targets the matrix's DERIVED status label
// ("Identity" / "Custom") without matching the note prose (markdown emphasis, not a span).
const hasSpanExactly = (txt) =>
  p.evaluate((t) => [...document.querySelectorAll("span")].some((s) => (s.textContent || "").trim() === t), txt);
// synthesize a scroll-wheel over the canvas centre (the zoom gesture; deltaY<0 zooms in)
const dispatchWheel = (deltaY) =>
  p.evaluate((dy) => {
    const c = document.querySelector("canvas");
    if (!c) return false;
    const r = c.getBoundingClientRect();
    c.dispatchEvent(new WheelEvent("wheel", { deltaY: dy, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true }));
    return true;
  }, deltaY);
// synthesize a pointer drag across the canvas (the kernel-placement gesture)
const dispatchPointerDrag = () =>
  p.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return false;
    const r = c.getBoundingClientRect();
    const mk = (type, x, y) => new PointerEvent(type, { pointerId: 1, clientX: x, clientY: y, bubbles: true, cancelable: true });
    c.dispatchEvent(mk("pointerdown", r.left + r.width * 0.3, r.top + r.height * 0.3));
    c.dispatchEvent(mk("pointermove", r.left + r.width * 0.62, r.top + r.height * 0.62));
    c.dispatchEvent(mk("pointerup", r.left + r.width * 0.62, r.top + r.height * 0.62));
    return true;
  });
// SVG <text> lives outside innerText; read the scene/figure text directly.
const svgHasText = (needle) =>
  p.evaluate((n) => [...document.querySelectorAll("svg")].some((s) => (s.textContent || "").includes(n)), needle);
// the conv2d raster viz mounts a <canvas>; the choice picker mounts labelled <button>s.
const hasCanvas = () => p.evaluate(() => !!document.querySelector("canvas"));
const ariaPressed = (label) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || ""));
    return el ? el.getAttribute("aria-pressed") === "true" : null;
  }, label.source);
const ADV = /continue|compute it|got it/i;
const advance = async (labelForLog) => { const ok = await clickText(ADV); console.log(`advance(${labelForLog}): ${ok}`); await sleep(850); return ok; };

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(900);

// 1 — combine (scene): three ways to combine; a derived Continue advances it
await p.screenshot({ path: `${out}-01-combine.png` });
check("1 combine: scene SVG present", await p.evaluate(() => !!document.querySelector("svg")));
check("1 combine: no debug 'next' harness", !(await hasButton(/debug/)));
await advance("combine→dice");

// 2 — dice (explorable, goal sum==7): grid renders; goal gates Continue
check("2 dice: reached", (await bodyText()).includes("most likely total"));
check("2 dice: grid figure renders", await svgHasText("Roll two dice"));
const diceGatedBefore = await hasButton(ADV);
await setSlider(7); await sleep(450);
await p.screenshot({ path: `${out}-02-dice.png` });
check("2 dice: readout P(sum=7)=6/36 after slide", await svgHasText("P(sum = 7) = 6/36"));
check("2 dice: goal gates Continue (hidden→shown)", !diceGatedBefore && (await hasButton(ADV)), `before=${diceGatedBefore}`);
await advance("dice→dice-formula");

// 3 — dice-formula (explain): the definition, KaTeX
check("3 dice-formula: reached", (await bodyText()).includes("pattern behind the dice"));
check("3 dice-formula: KaTeX rendered", await p.evaluate(() => !!document.querySelector(".katex")));
check("3 dice-formula: no raw $math$ leak", (await bodyText()).match(/\$[^$\n]{1,60}\$/g) === null);
await p.screenshot({ path: `${out}-03-dice-formula.png` });
await advance("dice-formula→intro");

// 4 — intro (explorable, no goal): conv-setup; __next shows immediately
check("4 intro: reached", (await bodyText()).includes("compute one by hand"));
check("4 intro: conv-setup figure renders", await svgHasText("a ∗ b"));
await p.screenshot({ path: `${out}-04-intro.png` });
await advance("intro→flip");

// 5 — flip (scene)
await sleep(2600);
await p.screenshot({ path: `${out}-05-flip.png` });
check("5 flip: scene SVG present", await p.evaluate(() => !!document.querySelector("svg")));
await advance("flip→slide");

// 6 — slide (scene)
await sleep(3000);
await p.screenshot({ path: `${out}-06-slide.png` });
check("6 slide: scene SVG present", await p.evaluate(() => !!document.querySelector("svg")));
await advance("slide→explore");

// 7 — explore (explorable, goal shift==4)
check("7 explore: reached", (await bodyText()).includes("through every shift"));
const exGatedBefore = await hasButton(ADV);
await setSlider(4); await sleep(450);
await p.screenshot({ path: `${out}-07-explore.png` });
check("7 explore: goal gates Continue", !exGatedBefore && (await hasButton(ADV)), `before=${exGatedBefore}`);
await advance("explore→product-grid");

// 8 — product-grid (explorable, goal diag==4): NEW grid; diagonals ARE a∗b
check("8 product-grid: reached", (await bodyText()).includes("Sweep through every diagonal"));
check("8 product-grid: grid figure renders", await svgHasText("Grid of products"));
const pgGatedBefore = await hasButton(ADV);
await setSlider(4); await sleep(450);
await p.screenshot({ path: `${out}-08-product-grid.png` });
check("8 product-grid: diagonal 4 readout = (a∗b)[4]", await svgHasText("(a ∗ b)[4]"));
check("8 product-grid: goal gates Continue", !pgGatedBefore && (await hasButton(ADV)), `before=${pgGatedBefore}`);
await advance("product-grid→polynomial");

// 9 — polynomial (explain, KaTeX)
check("9 polynomial: reached", (await bodyText()).includes("hidden identity"));
check("9 polynomial: KaTeX rendered", await p.evaluate(() => !!document.querySelector(".katex")));
await p.screenshot({ path: `${out}-09-polynomial.png` });
await advance("polynomial→check");

// 10 — check (mcq): answer correctly → summary
check("10 check: reached", (await bodyText()).includes("which computation gives"));
await p.screenshot({ path: `${out}-10-mcq.png` });
console.log("answer:", await clickText(/aligned products/));
await sleep(700);
await p.screenshot({ path: `${out}-11-answered.png` });
check("10 check: correct feedback shown", (await bodyText()).toLowerCase().includes("right —") || (await bodyText()).includes("three columns"));
await advance("check→image-2d");

// 12 — image-2d (explorable PLAYGROUND, no goal): drag to place the kernel, scroll to zoom
check("12 image-2d: reached", (await bodyText()).includes("same idea, now on an image"));
check("12 image-2d: conv2d canvas mounted", await hasCanvas());
check("12 image-2d: zoom slider present", (await readSlider()) !== null);
check("12 image-2d: Continue shown immediately (no goal gate)", await hasButton(ADV));
await sleep(600); // let a few closeup frames render so lastGeom (the gesture geometry) is cached
const zoomBefore = await readSlider();
await dispatchPointerDrag(); await sleep(300); // place the 3×3 window (emits kx/ky)
// three zoom-in notches, spaced so the eased zoom compounds (each reads the settled prior value)
await dispatchWheel(-120); await sleep(300);
await dispatchWheel(-120); await sleep(300);
await dispatchWheel(-120); await sleep(700);
const zoomAfter = await readSlider();
await p.screenshot({ path: `${out}-13-image-2d.png` });
check("12 image-2d: canvas survives drag + wheel gestures", await hasCanvas());
check("12 image-2d: wheel gesture round-trips to the zoom control", zoomBefore !== null && zoomAfter !== null && zoomAfter > zoomBefore, `${zoomBefore}→${zoomAfter}`);
await advance("image-2d→image-blur");

// 13 — image-blur (explorable, goal sweep==100): slide the blur across the sprite
check("13 image-blur: reached", (await bodyText()).includes("Drag the sweep"));
check("13 image-blur: conv2d canvas present", await hasCanvas());
const blurGatedBefore = await hasButton(ADV);
await setSlider(100); await sleep(500);
await p.screenshot({ path: `${out}-14-image-blur.png` });
check("13 image-blur: goal gates Continue (hidden→shown)", !blurGatedBefore && (await hasButton(ADV)), `before=${blurGatedBefore}`);
await advance("image-blur→image-filters");

// 14 — image-filters (explorable EDITOR, no goal): edit the live 3×3 kernel + load presets
check("14 image-filters: reached", (await bodyText()).includes("Now you hold the kernel"));
check("14 image-filters: conv2d canvas present", await hasCanvas());
check("14 image-filters: kernel matrix renders (9 cells + divisor = 10 number inputs)", (await countNumberInputs()) === 10, `${await countNumberInputs()} inputs`);
check("14 image-filters: preset buttons render (Gaussian + Sobel-X)", (await hasButton(/Gaussian/)) && (await hasButton(/Sobel-X/)));
check("14 image-filters: picture choice renders (Einstein)", await hasButton(/Einstein/));
check("14 image-filters: Continue shown immediately (no goal gate)", await hasButton(ADV));
// opens on the Identity preset (cells match it) → its button is selected, label reads "Identity"
check("14 image-filters: opens on the Identity preset (aria-pressed)", (await ariaPressed(/Identity/)) === true);
// switch the source picture → its button becomes selected (aria-pressed)
console.log("pick Coffee:", await clickText(/Coffee/)); await sleep(400);
check("14 image-filters: picture choice selects (Coffee aria-pressed)", (await ariaPressed(/Coffee/)) === true);
// hand-edit one kernel cell → no preset matches → derived label flips to "Custom", Identity deselects
await setNumberInput(0, 3); await sleep(450);
check("14 image-filters: editing a cell deselects the preset", (await ariaPressed(/Identity/)) === false);
check("14 image-filters: derived label flips to 'Custom'", await hasSpanExactly("Custom"));
// load the Gaussian preset atomically (one demo.setMany) → its button becomes selected
console.log("load Gaussian:", await clickText(/Gaussian/)); await sleep(450);
check("14 image-filters: loading a preset selects it (Gaussian aria-pressed)", (await ariaPressed(/Gaussian/)) === true);
// zoom via the slider (still the only range control) — smoke: no crash, canvas stays
await setSlider(4); await sleep(450);
await p.screenshot({ path: `${out}-15-image-filters.png` });
check("14 image-filters: zoom slider drives the canvas", await hasCanvas());
await advance("image-filters→summary");

// 15 — summary (explain): recap the views, now five faces
check("15 summary: reached", (await bodyText()).includes("One operation, many faces"));
check("15 summary: names the image face", (await bodyText()).toLowerCase().includes("edge-detection"));
await p.screenshot({ path: `${out}-16-summary.png` });

// narration + errors
const audible = ttsCalls.filter(Boolean).length;
check("narration requested for narrated beats", ttsCalls.length >= 8, `${audible}/${ttsCalls.length} clips with audio`);
// favicon/autoplay noise is not a lesson bug — fail only on real page/script errors.
const realErrors = errors.filter((e) => !/favicon|autoplay|play\(\)|NotAllowedError|Failed to load resource/i.test(e));
if (realErrors.length) console.log("errors:\n" + realErrors.slice(0, 8).join("\n"));
check("no page/console errors", realErrors.length === 0, `${errors.length} raw / ${realErrors.length} real`);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} browser checks passed`);
console.log(passed === results.length ? "M4 BROWSER WALK PASS" : "M4 BROWSER WALK FAIL");
await b.close();
if (passed !== results.length) process.exit(1);
