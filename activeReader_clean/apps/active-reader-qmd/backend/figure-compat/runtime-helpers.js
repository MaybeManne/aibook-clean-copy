const fs = require('fs');
const puppeteer = require('puppeteer-core');

function chromeExecutablePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/opt/homebrew/bin/chromium',
  ].filter(Boolean);
  return candidates.find(p => fs.existsSync(p)) || null;
}

async function screenshotHtml(html, waitMs = 1200) {
  const executablePath = chromeExecutablePath();
  if (!executablePath) return null;
  let browser;
  let page;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
      ],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 900, height: 600 });
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, waitMs));
    const data = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 82 });
    return { data, mediaType: 'image/jpeg' };
  } catch (err) {
    console.warn('[screenshotHtml] skipped:', err.message);
    return null;
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

module.exports = { screenshotHtml };
