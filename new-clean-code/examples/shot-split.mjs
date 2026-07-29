// Screenshot the M2 split-screen demo: initial layout, the two alternate template layouts
// (the data-driven proof), then advancing through the scene + MCQ beats.
import puppeteer from "puppeteer";
const url = process.argv[2] ?? "http://localhost:5177/";
const out = process.argv[3] ?? "/tmp/ls-m2";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 820, deviceScaleFactor: 1 });
const errors = [];
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));

const clickText = (re) =>
  p.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll("button")].find((b) => rx.test(b.textContent || ""));
    if (el) { el.click(); return true; }
    return false;
  }, re.source);

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(900);
await p.screenshot({ path: `${out}-01-left50.png` });

console.log("→ right60:", await clickText(/right/));
await sleep(500);
await p.screenshot({ path: `${out}-02-right60.png` });

console.log("→ single:", await clickText(/single/));
await sleep(500);
await p.screenshot({ path: `${out}-03-single.png` });

// back to the default split, then walk the flow via the debug Next button
console.log("→ left50:", await clickText(/left/));
await sleep(400);
console.log("→ next(intro→slide):", await clickText(/next/));
await sleep(900);
await p.screenshot({ path: `${out}-04-scene.png` });

console.log("→ next(slide→check):", await clickText(/next/));
await sleep(700);
await p.screenshot({ path: `${out}-05-mcq.png` });

// answer the MCQ (pick the correct choice text)
console.log("→ answer:", await clickText(/sums every product/));
await sleep(600);
await p.screenshot({ path: `${out}-06-answered.png` });

console.log("console errors:", errors.length ? errors.slice(0, 12) : "none");
await b.close();
