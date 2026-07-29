// Prove the scene ANIMATES: navigate to the slide beat, then take rapid shots to catch
// the circle at different x positions across its 2s slide.
import puppeteer from "puppeteer";
const url = process.argv[2] ?? "http://localhost:5178/";
const out = process.argv[3] ?? "/tmp/ls-anim";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu",
    // Headless backgrounds the page and throttles/pauses rAF — disable so the
    // scene's local animation clock runs at full rate during capture.
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ],
});
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 820, deviceScaleFactor: 1 });
await p.bringToFront();
const clickText = (re) =>
  p.evaluate((src) => {
    const el = [...document.querySelectorAll("button")].find((b) => new RegExp(src, "i").test(b.textContent || ""));
    if (el) { el.click(); return true; } return false;
  }, re.source);

// The kernel circle's on-screen x (px), robust to transform-based positioning.
const kernelX = () =>
  p.evaluate(() => {
    const c = document.querySelector("svg circle");
    return c ? Math.round(c.getBoundingClientRect().x) : null;
  });

await p.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await sleep(700);                  // default layout = visuals LEFT (active scene in the left panel)
await clickText(/next/);          // intro → slide (animation starts on mount)
// Capture the LEFT stage panel across the 2s slide — the circle should march left→right.
const xs = [];
for (const [i, t] of [[1, 200], [2, 500], [3, 700], [4, 1100]].entries()) {
  await sleep(t);
  xs.push(await kernelX());
  await p.screenshot({ path: `${out}-0${i + 1}.png`, clip: { x: 0, y: 40, width: 640, height: 740 } });
}
console.log("kernel screen-x over time (should increase):", xs);
await b.close();
