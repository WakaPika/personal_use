// 開発用：マッチアップの全シーンのピッチ図を1枚に並べる  node tests/contact.mjs <out.png> <self_vs_opp>
import { chromium } from './pw.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, slug] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 });
await page.goto(`file://${root}/dist/index.html#${slug}`);
const ids = await page.$$eval('.viz-tabs .tab:not([disabled])', (b) => b.map((x) => x.dataset.tab));
const shots = [];
for (const t of ids) {
  await page.click(`.viz-tabs .tab[data-tab="${t}"]`);
  const pills = await page.$$('.pills .pill-btn');
  const n = Math.max(1, pills.length);
  for (let i = 0; i < n; i++) {
    if (pills.length) await page.click(`.pills .pill-btn >> nth=${i}`);
    await page.waitForTimeout(80);
    const fig = await page.$('.pitch-wrap');
    shots.push(await fig.screenshot());
  }
}
await browser.close();
const { createRequire } = await import('node:module');
// 画像の結合は Python(PIL) に任せる
const fs = await import('node:fs');
const dir = out.replace(/\.png$/, '');
fs.mkdirSync(dir, { recursive: true });
shots.forEach((b, i) => fs.writeFileSync(path.join(dir, `${String(i).padStart(2, '0')}.png`), b));
console.log(`${shots.length} scenes -> ${dir}`);
