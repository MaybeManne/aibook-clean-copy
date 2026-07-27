import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(dir, 'architecture.svg'), 'utf8');
const scale = Number(process.argv[2] || 2); // 2x for crisp slides

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1740, height: 1080, deviceScaleFactor: scale });
await page.setContent(
  `<!doctype html><html><body style="margin:0">${svg}</body></html>`,
  { waitUntil: 'networkidle0' }
);
const el = await page.$('svg');
await el.screenshot({ path: join(dir, 'architecture.png') });
await browser.close();
console.log(`wrote architecture.png @ ${scale}x`);
