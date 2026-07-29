// Rasterize a standalone .svg → .png via headless Chrome, so a pure-path render can be eyeballed.
// Usage: tsx/node rasterize.mjs <in.svg> <out.png> [w] [h]
import puppeteer from "puppeteer";
const [, , inSvg, outPng, w = "1280", h = "720"] = process.argv;
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
await p.goto(`file://${inSvg}`, { waitUntil: "networkidle0", timeout: 30000 });
await p.screenshot({ path: outPng, clip: { x: 0, y: 0, width: +w, height: +h } });
await b.close();
console.log(`rasterized ${inSvg} → ${outPng}`);
