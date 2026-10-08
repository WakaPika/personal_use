// 開発用：指定ハッシュのスクリーンショットを撮る  node tests/shot.mjs <outdir> <width> <height> <hash>...
import { chromium } from './pw.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, w, h, ...hashes] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
for (const hsh of hashes) {
  await page.goto(`file://${root}/dist/index.html#${hsh}`);
  await page.waitForTimeout(250);
  const full = process.env.FULL === '1';
  const name = hsh.replace(/[^a-z0-9._-]/gi, '_') || 'home';
  await page.screenshot({ path: path.join(out, `${name}-${w}${full ? '-full' : ''}.png`), fullPage: full });
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  console.log(hsh, 'scrollWidth/innerWidth', sw.join('/'));
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
