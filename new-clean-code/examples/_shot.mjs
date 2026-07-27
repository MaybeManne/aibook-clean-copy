// Reusable puppeteer screenshot harness for the browser examples.
// Usage: node examples/_shot.mjs <url> <outPrefix> [clickPlay=1] [shots=5] [gapMs=2500]
import puppeteer from "puppeteer";

const [url, prefix, clickPlay = "1", shots = "5", gapMs = "2500"] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 });
const errors = [];
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
p.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).split("\n")[0]));

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(800);
await p.screenshot({ path: `${prefix}-00-initial.png` });

if (clickPlay === "1") {
  // click the first button whose text contains "Play"
  const clicked = await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find(
      (b) => /play/i.test(b.getAttribute("aria-label") || "") || /play|▶/i.test(b.textContent || ""),
    );
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log("clicked play:", clicked);
}

const n = parseInt(shots, 10), gap = parseInt(gapMs, 10);
for (let i = 1; i <= n; i++) {
  await sleep(gap);
  await p.screenshot({ path: `${prefix}-${String(i).padStart(2, "0")}.png` });
}
// also capture scroll metrics of any scroll container
const scroll = await p.evaluate(() => {
  const els = [...document.querySelectorAll("*")].filter((e) => e.scrollHeight > e.clientHeight + 4 && getComputedStyle(e).overflowY !== "visible");
  return els.map((e) => ({ tag: e.tagName, cls: e.className, scrollH: e.scrollHeight, clientH: e.clientHeight }));
});
console.log("scrollable containers:", JSON.stringify(scroll));
console.log("console errors:", errors.length ? errors.slice(0, 12) : "none");
await b.close();
