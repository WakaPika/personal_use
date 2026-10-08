// E2E テスト（Playwright / Chromium）。dist/index.html を file:// で開いて検証する。
// 使い方: node tests/e2e.mjs   結果は test-results/report.json と標準出力
import { chromium } from './pw.mjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { formations, activeFormations, matchupStatus } from '../src/data/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = (h = '') => `file://${root}/dist/index.html${h ? `#${h}` : ''}`;
const outDir = path.join(root, 'test-results');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
let failures = 0;
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail });
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

const browser = await chromium.launch();
const ids = activeFormations.map((f) => f.id);

async function newPage(width = 390, height = 844) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return { ctx, page, errors };
}

async function overflowInfo(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const scrollers = ['.viz-tabs', '.pills', '.jump', '.matrix-wrap'];
    const bad = [];
    for (const el of document.querySelectorAll('main *, header *')) {
      if (scrollers.some((s) => el.closest(s))) continue;
      if (el.closest('svg')) continue;
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1) bad.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60));
    }
    return { vw, sw, bad: bad.slice(0, 5) };
  });
}

// ------------------------------------------------------------ 1. 横スクロールなし（375–430px）
for (const [w, h] of [[375, 667], [390, 844], [414, 896], [430, 932]]) {
  const { ctx, page, errors } = await newPage(w, h);
  const routes = ['4-3-3_vs_4-4-2', '4-4-2_vs_4-3-3', '3-5-2_vs_4-3-3.oop-wide', '4-3-3_vs_4-1-4-1', 'systems', 'sys.4-3-3', 'sys.5-3-2', 'sys.3-4-2-1', 'glossary', 'sources'];
  let worst = null;
  for (const r of routes) {
    await page.goto(url(r));
    await page.waitForTimeout(60);
    const o = await overflowInfo(page);
    if (o.sw > o.vw || o.bad.length) worst = { r, ...o };
  }
  // シートを開いた状態も確認
  await page.goto(url('4-3-3_vs_4-4-2'));
  await page.click('.tb-opp');
  const so = await page.evaluate(() => {
    const s = document.querySelector('.sheet');
    return { sw: s.scrollWidth, cw: s.clientWidth };
  });
  check(`横スクロールなし ${w}px（10画面＋選択シート）`, !worst && so.sw <= so.cw + 1, worst ? JSON.stringify(worst) : `sheet ${so.sw}/${so.cw}`);
  check(`JSエラーなし ${w}px`, errors.length === 0, errors.join(' | '));
  await page.screenshot({ path: path.join(outDir, `sheet-${w}.png`) });
  await ctx.close();
}

// ------------------------------------------------------------ 2. 36方向すべて
{
  const { ctx, page, errors } = await newPage(390, 844);
  let okAll = true;
  const notes = [];
  let analysisCount = 0;
  let stubCount = 0;
  for (const s of ids) {
    for (const o of ids) {
      await page.goto(url(`${s}_vs_${o}`));
      const info = await page.evaluate(() => ({
        hash: location.hash,
        players: document.querySelectorAll('#viz .players .pl').length,
        self: document.querySelectorAll('#viz .players .p-self').length,
        opp: document.querySelectorAll('#viz .players .p-opp').length,
        status: document.querySelector('.st')?.textContent || '',
        banner: !!document.querySelector('.banner'),
        qw: document.querySelectorAll('.qw-list > li').length,
        selfLabel: document.querySelector('.tb-self .tb-v')?.textContent.trim(),
        oppLabel: document.querySelector('.tb-opp .tb-v')?.textContent.trim(),
      }));
      const expected = matchupStatus(s, o);
      const statusOk = expected === 'analysis' ? info.status.includes('詳細分析') && info.qw === 3 && !info.banner : info.status.includes('未整備') && info.banner;
      if (expected === 'analysis') analysisCount++; else stubCount++;
      const ok = info.players === 22 && info.self === 11 && info.opp === 11 && statusOk && info.selfLabel === s && info.oppLabel === o;
      if (!ok) { okAll = false; notes.push(`${s} vs ${o}: ${JSON.stringify(info)}`); }
    }
  }
  check('36方向すべて表示（22人・自11/相手11・状態表示・3点）', okAll && analysisCount === 12 && stubCount === 24, `詳細${analysisCount}/未整備${stubCount} ${notes.slice(0, 3).join(' ; ')}`);
  check('36方向でJSエラーなし', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------ 3. 詳細分析12方向：全タブ・全シーン
{
  const { ctx, page, errors } = await newPage(390, 844);
  let scenes = 0;
  const bad = [];
  for (const s of ids) for (const o of ids) {
    if (matchupStatus(s, o) !== 'analysis') continue;
    await page.goto(url(`${s}_vs_${o}`));
    const tabs = await page.$$eval('.viz-tabs .tab', (b) => b.map((x) => ({ id: x.dataset.tab, disabled: x.disabled })));
    if (tabs.some((t) => t.disabled)) bad.push(`${s} vs ${o}: 無効タブ ${tabs.filter((t) => t.disabled).map((t) => t.id)}`);
    for (const t of tabs) {
      await page.click(`.viz-tabs .tab[data-tab="${t.id}"]`);
      const n = await page.$$eval('.pills .pill-btn', (b) => b.length);
      for (let i = 0; i < Math.max(1, n); i++) {
        if (n) await page.click(`.pills .pill-btn >> nth=${i}`);
        const info = await page.evaluate(() => ({
          pl: document.querySelectorAll('#viz .players .pl').length,
          sel: document.querySelector('.viz-tabs .tab.on')?.dataset.tab,
          title: document.querySelector('#viz svg title')?.textContent || '',
          desc: document.querySelector('#viz svg desc')?.textContent || '',
          hash: location.hash,
        }));
        scenes++;
        if (info.pl !== 22 || info.sel !== t.id || !info.title || !info.desc) bad.push(`${s} vs ${o} ${t.id}#${i}: ${JSON.stringify(info)}`);
      }
    }
  }
  check('詳細分析12方向×6タブの全シーンで22人＋SVGのtitle/desc', bad.length === 0, `${scenes}シーン ${bad.slice(0, 3).join(' ; ')}`);
  check('タブ操作でJSエラーなし', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------ 4. 選択UI（2操作）・入れ替え・視点の数
{
  const { ctx, page } = await newPage(390, 844);
  await page.goto(url('4-3-3_vs_4-4-2'));
  // 2操作：シートを開く → マトリクスのセル
  await page.click('.tb-self');
  await page.click('.matrix .cell[data-self="3-5-2"][data-opp="4-1-4-1"]');
  await page.waitForTimeout(50);
  let h = await page.evaluate(() => location.hash);
  check('2操作で任意の組み合わせへ（シート→マトリクス）', h.startsWith('#3-5-2_vs_4-1-4-1'), h);
  // 片側だけ変更（シート→チップ）
  await page.click('.tb-opp');
  await page.click('.f-chip[data-id="4-3-3"]');
  await page.waitForTimeout(50);
  h = await page.evaluate(() => location.hash);
  check('2操作で相手だけ変更（シート→チップ）', h.startsWith('#3-5-2_vs_4-3-3'), h);
  // 準備中は選べない
  await page.click('.tb-opp');
  const disabled = await page.$eval('.f-chip[data-id="3-4-2-1"]', (b) => b.disabled);
  check('拡張予定（3-4-2-1）は「準備中」で選択不可', disabled);
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => document.getElementById('sheet').hidden);
  check('Escでシートが閉じる', closed);

  // 入れ替え：シーンを保持して視点を反転
  await page.goto(url('4-3-3_vs_4-4-2.ip-build'));
  const before = await page.evaluate(() => ({
    tab: document.querySelector('.viz-tabs .tab.on').dataset.tab,
    firstCount: document.querySelector('#viz .count text')?.textContent,
  }));
  await page.click('.swap-btn');
  await page.waitForTimeout(80);
  const after = await page.evaluate(() => ({
    hash: location.hash,
    tab: document.querySelector('.viz-tabs .tab.on').dataset.tab,
    selfLabels: [...document.querySelectorAll('#viz .p-self text')].map((t) => t.textContent),
    qwHead: document.querySelector('.qw-h small')?.textContent,
    attackFirst: document.querySelector('#sec-attack .mech h3')?.textContent,
  }));
  check('入れ替えでURLが反転しシーンを保持', after.hash === '#4-4-2_vs_4-3-3.ip-build' && before.tab === 'ip-self' && after.tab === 'ip-opp', JSON.stringify({ before, after: { hash: after.hash, tab: after.tab } }));
  check('入れ替え後は自チーム（●）が4-4-2', after.selfLabels.includes('SH') && after.selfLabels.includes('CM') && !after.selfLabels.includes('WG'), after.selfLabels.join(','));
  check('入れ替え後の3点・攻撃セクションが4-4-2視点', (after.qwHead || '').includes('4-4-2') && !!after.attackFirst, `${after.qwHead} / ${after.attackFirst}`);

  // 人数バッジが視点で反転する
  await page.goto(url('4-3-3_vs_4-4-2'));
  const cA = await page.$$eval('#viz .count', (g) => g.map((x) => x.textContent));
  await page.goto(url('4-4-2_vs_4-3-3'));
  const cB = await page.$$eval('#viz .count', (g) => g.map((x) => x.textContent));
  check('人数バッジが視点で反転（中央MF 3v2+1 ⇄ 2v3−1）', cA.some((t) => t.includes('中央MF 3v2') && t.includes('+1')) && cB.some((t) => t.includes('中央MF 2v3') && t.includes('−1')), `${cA.join('|')} ⇄ ${cB.join('|')}`);
  check('人数ラベルが視点で切替（最前線 ⇄ 最終ライン）', cA.some((t) => t.startsWith('最前線 3v4')) && cB.some((t) => t.startsWith('最終ライン 4v3')), `${cA.join('|')} ⇄ ${cB.join('|')}`);

  // ディープリンク
  await page.goto(url('4-2-3-1_vs_4-4-2.oop-build'));
  const dl = await page.evaluate(() => ({ tab: document.querySelector('.viz-tabs .tab.on').dataset.tab, scene: document.querySelector('.pitch-wrap').dataset.scene }));
  check('ディープリンクでシーンを直接開く', dl.scene === 'oop-build' && dl.tab === 'ip-self', JSON.stringify(dl));

  // 3点 → 図が切り替わる
  await page.goto(url('4-3-3_vs_4-4-2'));
  await page.click('.qw-list > li:nth-child(2) .qw-item');
  const qs = await page.evaluate(() => document.querySelector('.pitch-wrap').dataset.scene);
  check('「今見るべき3点」をタップすると対応する図へ', qs === 'ip-prog', qs);
  // 因果カード → 図
  await page.click('#sec-defence .mech .sm-btn[data-act="goto-scene"]');
  const ms = await page.evaluate(() => document.querySelector('.pitch-wrap').dataset.scene);
  check('因果カードの「図で見る」で図が切り替わる', ['oop-press', 'oop-block'].includes(ms), ms);
  // 3点マーカーは噛み合わせ図に3つ
  await page.click('.viz-tabs .tab[data-tab="overview"]');
  const marks = await page.$$eval('#viz .qmark', (m) => m.length);
  check('噛み合わせ図に3点の番号マーカー', marks === 3, String(marks));
  await ctx.close();
}

// ------------------------------------------------------------ 5. レイヤー・テーマ・凡例
{
  const { ctx, page } = await newPage(390, 844);
  await page.goto(url('4-3-3_vs_4-4-2.ip-build'));
  await page.click('[data-act="legend"]');
  await page.click('.tg[data-layer="move"]');
  const hidden = await page.evaluate(() => getComputedStyle(document.querySelector('#viz .l-move')).display === 'none');
  check('レイヤー「動き」を非表示にできる', hidden);
  await page.click('.tg[data-layer="move"]');
  await page.click('.tg[data-act="lanes"]');
  const lanes = await page.evaluate(() => getComputedStyle(document.querySelector('#viz .l-lanes')).display !== 'none');
  check('5レーン補助線を表示できる', lanes);
  const bg1 = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.click('.tg[data-act="theme"]');
  const bg2 = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('屋外向けライト表示に切替（ダークが既定）', bg1 !== bg2 && (await page.evaluate(() => document.documentElement.dataset.appTheme)) === 'light', `${bg1} → ${bg2}`);
  await page.screenshot({ path: path.join(outDir, 'light-legend.png') });
  await ctx.close();
}

// ------------------------------------------------------------ 6. タップ領域・アクセシブルな名前
{
  const { ctx, page } = await newPage(390, 844);
  const routes = ['4-3-3_vs_4-4-2', 'sys.4-3-3', 'systems', 'glossary', 'sources'];
  const small = [];
  const unnamed = [];
  for (const r of routes) {
    await page.goto(url(r));
    const res = await page.evaluate(() => {
      const out = { small: [], unnamed: [] };
      for (const el of document.querySelectorAll('button, a.tb-item, a.cell, a.pill-btn, .opp-list a, .rel-list a, summary')) {
        const b = el.getBoundingClientRect();
        if (!b.width) continue;
        if (b.height < 43.5 || b.width < 43.5) out.small.push(`${el.className || el.tagName}:${Math.round(b.width)}x${Math.round(b.height)}`);
        const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
        if (!name) out.unnamed.push(el.className);
      }
      return out;
    });
    small.push(...res.small.map((s) => `${r} ${s}`));
    unnamed.push(...res.unnamed.map((s) => `${r} ${s}`));
  }
  check('操作要素のタップ領域が44×44px以上', small.length === 0, small.slice(0, 6).join(', '));
  check('すべてのボタンにアクセシブルな名前', unnamed.length === 0, unnamed.slice(0, 5).join(', '));
  // SVG は role=img + title/desc
  await page.goto(url('4-3-3_vs_4-4-2'));
  const svgA11y = await page.evaluate(() => {
    const s = document.querySelector('#viz svg');
    return s.getAttribute('role') === 'img' && !!s.querySelector('title')?.textContent && !!s.querySelector('desc')?.textContent;
  });
  check('ピッチ図SVGに role=img と title/desc', svgA11y);
  await ctx.close();
}

// ------------------------------------------------------------ 7. システム・用語集
{
  const { ctx, page } = await newPage(390, 844);
  for (const f of activeFormations) {
    await page.goto(url(`sys.${f.id}`));
    const pills = await page.$$eval('.pills .pill-btn', (b) => b.map((x) => x.dataset.shape));
    let ok = pills.length === f.shapes.length;
    for (const sh of pills) {
      await page.click(`.pills .pill-btn[data-shape="${sh}"]`);
      const n = await page.$$eval('.fm-viz .players .pl', (p) => p.length);
      if (n !== 11) ok = false;
    }
    const opps = await page.$$eval('.opp-list a', (a) => a.length);
    check(`システム ${f.id}：全${pills.length}形で11人・マッチアップ${opps}件`, ok && opps === 6);
  }
  await page.goto(url('glossary'));
  await page.fill('#g-search', 'Halbraum');
  const g = await page.$$eval('.term h3', (h) => h.map((x) => x.textContent));
  check('用語集：独語「Halbraum」でハーフスペースを検索', g.length === 1 && g[0] === 'ハーフスペース', g.join(','));
  await page.goto(url('glossary.rest-defence'));
  const open = await page.evaluate(() => document.querySelector('#term-rest-defence details')?.open);
  check('用語集：ディープリンクで用語を開く', open === true);
  await ctx.close();
}

// ------------------------------------------------------------ 8. 表示性能（CPU 4倍スロットリング）
{
  const { ctx, page } = await newPage(390, 844);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(url('4-3-3_vs_4-4-2'));
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => ({
    lcp: Math.round(window.__lcp),
    cls: +window.__cls.toFixed(3),
    dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),
    first: Math.round(performance.getEntriesByName('ml-first-render')[0]?.startTime || 0),
  }));
  // 操作から次の描画までの時間（INPの代替指標）
  const t = await page.evaluate(async () => {
    const times = [];
    for (const tab of ['ip-self', 'ip-opp', 'tr-loss', 'tr-win', 'adjust', 'overview']) {
      const b = document.querySelector(`.viz-tabs .tab[data-tab="${tab}"]`);
      const t0 = performance.now();
      b.click();
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
      times.push(performance.now() - t0);
    }
    return Math.round(Math.max(...times));
  });
  const size = fs.statSync(path.join(root, 'dist/index.html')).size;
  check(`初回描画（図＋3点）≤ 2.5s（CPU×4、file://）`, m.first > 0 && m.first <= 2500, `描画完了 ${m.first}ms / DCL ${m.dcl}ms / Chrome LCP ${m.lcp}ms`);
  check('CLS ≤ 0.1', m.cls <= 0.1, `CLS ${m.cls}`);
  check('タブ操作→次の描画 ≤ 200ms（CPU×4）', t <= 200, `最大 ${t}ms`);
  check('配信サイズ（単一HTML）', size < 500 * 1024, `${(size / 1024).toFixed(0)}KB（gzip前）`);
  await ctx.close();
}

// ------------------------------------------------------------ 9. デスクトップ
{
  const { ctx, page, errors } = await newPage(1280, 800);
  await page.goto(url('4-3-3_vs_4-4-2'));
  const d = await page.evaluate(() => {
    const viz = document.querySelector('.mu-viz').getBoundingClientRect();
    const txt = document.querySelector('.mu-text').getBoundingClientRect();
    return { twoCol: txt.left > viz.right - 1, sw: document.documentElement.scrollWidth, vw: innerWidth };
  });
  check('デスクトップ（1280px）で2カラム・横スクロールなし', d.twoCol && d.sw <= d.vw, JSON.stringify(d));
  await page.screenshot({ path: path.join(outDir, 'desktop-1280.png') });
  check('デスクトップでJSエラーなし', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ date: new Date().toISOString(), failures, results }, null, 2));
console.log(`\n${results.length - failures}/${results.length} passed`);
process.exit(failures ? 1 : 0);
