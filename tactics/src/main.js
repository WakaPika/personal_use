// エントリーポイント：ハッシュルーティング、状態、イベント委譲
import { formations, getMatchup, matchupSlug } from './data/index.js';
import { sharedDefs } from './lib/pitch.js';
import { icon } from './lib/ui.js';
import { renderMatchup, renderViz, scenesForTab } from './views/matchup.js';
import { renderSystems, renderFormation } from './views/formation.js';
import { renderGlossary, renderSources } from './views/reference.js';
import { selectorSheet, legendSheet } from './views/sheets.js';

const DEFAULT = ['4-3-3', '4-4-2'];
const LS = {
  get(k, d) { try { const v = localStorage.getItem(`ml.${k}`); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(`ml.${k}`, JSON.stringify(v)); } catch { /* 保存できない環境では無視 */ } },
};
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const state = {
  route: null,
  layers: LS.get('layers', {}),
  lanes: LS.get('lanes', false),
  dense: LS.get('dense', false),
  theme: LS.get('theme', 'dark'),
  glossaryCat: 'all',
  glossaryQ: '',
  sheet: null, // { kind: 'selector'|'legend', side }
  lastFocus: null,
  swapAnim: false,
};

const app = document.getElementById('app');

// ------------------------------------------------------------ routing
// ハッシュは英数字と . _ ~ - のみ（共有リンクでそのまま届く形式）
function parseRoute(hash) {
  const h = decodeURIComponent((hash || '').replace(/^#/, ''));
  let m = h.match(/^([\d-]+)_vs_([\d-]+)(?:\.([a-z0-9-]+))?$/);
  if (m && formations[m[1]] && formations[m[2]] && formations[m[1]].status === 'analysis' && formations[m[2]].status === 'analysis') {
    return { view: 'matchup', self: m[1], opp: m[2], scene: m[3] || null };
  }
  m = h.match(/^sys\.([\d-]+)(?:\.([a-z0-9.-]+))?$/);
  if (m && formations[m[1]]) return { view: 'formation', id: m[1], shape: m[2] || null };
  if (h === 'systems') return { view: 'systems' };
  m = h.match(/^glossary(?:\.([a-z0-9-]+))?$/);
  if (m) return { view: 'glossary', term: m[1] || null };
  if (h === 'sources') return { view: 'sources' };
  const last = LS.get('last', null);
  const lm = last && last.match(/^([\d-]+)_vs_([\d-]+)$/);
  if (lm && formations[lm[1]] && formations[lm[2]]) return { view: 'matchup', self: lm[1], opp: lm[2], scene: null };
  return { view: 'matchup', self: DEFAULT[0], opp: DEFAULT[1], scene: null };
}

function routeHash(r) {
  switch (r.view) {
    case 'matchup': return `#${matchupSlug(r.self, r.opp)}${r.scene ? `.${r.scene}` : ''}`;
    case 'formation': return `#sys.${r.id}${r.shape ? `.${r.shape}` : ''}`;
    case 'systems': return '#systems';
    case 'glossary': return `#glossary${r.term ? `.${r.term}` : ''}`;
    case 'sources': return '#sources';
    default: return '#';
  }
}

function replaceHash(h) {
  try { history.replaceState(null, '', h); } catch { /* サンドボックス環境では無視 */ }
}

function go(h) {
  if (location.hash === h) onRoute();
  else location.hash = h;
}

// ------------------------------------------------------------ render
function applyPrefs() {
  const root = document.documentElement;
  root.setAttribute('data-app-theme', state.theme);
  const cls = ['move', 'press', 'zone', 'count', 'free', 'mark', 'danger', 'marker'].filter((k) => state.layers[k] === false).map((k) => `hide-${k}`);
  if (state.dense) cls.push('dense');
  app.className = ['app', ...cls].join(' ');
  app.querySelectorAll('[data-act="dense"]').forEach((b) => b.setAttribute('aria-pressed', String(state.dense)));
}

function tabbar(view) {
  const item = (id, href, label, ic) =>
    `<a class="tb-item${view === id ? ' on' : ''}" href="${href}" ${view === id ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></a>`;
  const r = state.route;
  const matchHref = r && r.view === 'matchup' ? routeHash({ ...r, scene: null }) : `#${LS.get('last', matchupSlug(...DEFAULT))}`;
  return `<nav class="tabbar" aria-label="メイン">${item('matchup', matchHref, '噛み合わせ', icon.compare)}${item('systems', '#systems', 'システム', icon.systems)}${item('glossary', '#glossary', '用語', icon.glossary)}${item('sources', '#sources', '出典', icon.sources)}</nav>`;
}

function render() {
  const r = state.route;
  let view;
  if (r.view === 'matchup') {
    view = renderMatchup(r.self, r.opp, r.scene, { lanes: state.lanes });
    r.scene = view.sceneId;
    replaceHash(routeHash(r));
    LS.set('last', matchupSlug(r.self, r.opp));
    const rec = LS.get('recent', []).filter((x) => x !== matchupSlug(r.self, r.opp));
    rec.unshift(matchupSlug(r.self, r.opp));
    LS.set('recent', rec.slice(0, 6));
    document.title = `${r.self} vs ${r.opp}｜Matchup Lens`;
  } else if (r.view === 'formation') {
    view = renderFormation(r.id, r.shape);
    document.title = `${r.id}｜Matchup Lens`;
  } else if (r.view === 'systems') {
    view = renderSystems();
    document.title = 'システム｜Matchup Lens';
  } else if (r.view === 'glossary') {
    view = renderGlossary(state);
    document.title = '用語集｜Matchup Lens';
  } else {
    view = renderSources();
    document.title = '出典・方法｜Matchup Lens';
  }
  applyPrefs();
  app.innerHTML = `${sharedDefs()}${view.head}<main id="main" class="main view-${r.view}">${view.main}</main>${tabbar(r.view)}<div id="sheet" class="sheet-root" hidden></div>`;
  applyPrefs();
  if (state.swapAnim && !reduceMotion()) {
    app.querySelector('.pitch-wrap svg')?.classList.add('spin-in');
  }
  state.swapAnim = false;
  if (r.view === 'glossary' && r.term) {
    const el = document.getElementById(`term-${r.term}`);
    if (el) { el.querySelector('details')?.setAttribute('open', ''); el.scrollIntoView({ block: 'start' }); }
  }
}

function onRoute() {
  const prev = state.route;
  state.route = parseRoute(location.hash);
  // 用語へのリンクで開いたときは、検索・分類の絞り込みを解除して必ず表示する
  if (state.route.view === 'glossary' && state.route.term) {
    state.glossaryQ = '';
    state.glossaryCat = 'all';
  }
  closeSheet(false);
  render();
  // 視点の入れ替え（同じ組み合わせ）だけは読んでいた位置を保つ。別の組み合わせ・別画面は先頭へ
  const r = state.route;
  const samePair = prev && prev.view === 'matchup' && r.view === 'matchup' && [prev.self, prev.opp].sort().join() === [r.self, r.opp].sort().join();
  if (!samePair) window.scrollTo(0, 0);
}

// ------------------------------------------------------------ viz updates
function setScene(sceneId, { scroll = false } = {}) {
  const r = state.route;
  if (r.view !== 'matchup') return;
  r.scene = sceneId;
  const { entry, self } = getMatchup(r.self, r.opp);
  const viz = document.getElementById('viz');
  if (!viz) return;
  viz.innerHTML = renderViz(entry, self, sceneId, { lanes: state.lanes });
  replaceHash(routeHash(r));
  if (scroll) {
    const top = viz.getBoundingClientRect().top;
    const desktop = window.matchMedia('(min-width: 960px)').matches;
    if (!desktop && (top < 0 || top > window.innerHeight * 0.5)) {
      viz.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
  }
}

function setShape(shapeId) {
  const r = state.route;
  r.shape = shapeId;
  replaceHash(routeHash(r));
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}

// ------------------------------------------------------------ sheets
function openSheet(kind, opts = {}) {
  state.lastFocus = document.activeElement;
  state.sheet = { kind, ...opts };
  drawSheet();
}

function drawSheet() {
  const root = document.getElementById('sheet');
  if (!root || !state.sheet) return;
  const r = state.route;
  const body =
    state.sheet.kind === 'selector'
      ? selectorSheet({ selfId: r.self, oppId: r.opp, side: state.sheet.side || 'self', recent: LS.get('recent', []) })
      : legendSheet({ layers: state.layers, lanes: state.lanes, theme: state.theme });
  root.innerHTML = `<div class="sheet-backdrop" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="grip" aria-hidden="true"></div>${body}</div>`;
  root.hidden = false;
  document.body.classList.add('no-scroll');
  const first = root.querySelector('.sheet [aria-pressed="true"], .sheet .on, .sheet button');
  first?.focus({ preventScroll: true });
}

function closeSheet(restore = true) {
  const root = document.getElementById('sheet');
  state.sheet = null;
  if (root) { root.hidden = true; root.innerHTML = ''; }
  document.body.classList.remove('no-scroll');
  if (restore && state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus({ preventScroll: true });
}

// ------------------------------------------------------------ events
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const r = state.route;
  switch (act) {
    case 'pick':
      openSheet('selector', { side: el.dataset.side });
      break;
    case 'side':
      state.sheet.side = el.dataset.side;
      drawSheet();
      break;
    case 'choose': {
      const id = el.dataset.id;
      const next = el.dataset.side === 'self' ? { self: id, opp: r.opp } : { self: r.self, opp: id };
      closeSheet(false);
      go(routeHash({ view: 'matchup', ...next, scene: null }));
      break;
    }
    case 'cell':
      closeSheet(false);
      go(routeHash({ view: 'matchup', self: el.dataset.self, opp: el.dataset.opp, scene: null }));
      break;
    case 'sheet-nav':
      closeSheet(false);
      break;
    case 'sheet-close':
      closeSheet();
      break;
    case 'swap':
      state.swapAnim = true;
      go(routeHash({ view: 'matchup', self: r.opp, opp: r.self, scene: r.scene }));
      break;
    case 'tab': {
      const { entry, self } = getMatchup(r.self, r.opp);
      const list = scenesForTab(entry, self, el.dataset.tab);
      if (list.length) setScene(list[0].id);
      document.querySelector('.viz-tabs .tab.on')?.focus({ preventScroll: true });
      break;
    }
    case 'scene':
      setScene(el.dataset.scene);
      break;
    case 'goto-scene':
      setScene(el.dataset.scene, { scroll: true });
      break;
    case 'jump': {
      const t = document.getElementById(el.dataset.target);
      t?.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
      break;
    }
    case 'jump-card': {
      const t = document.getElementById(`card-${el.dataset.card}`);
      if (t) {
        t.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
        t.classList.remove('flash');
        void t.offsetWidth;
        t.classList.add('flash');
        t.focus({ preventScroll: true });
      }
      break;
    }
    case 'legend':
      openSheet('legend');
      break;
    case 'layer': {
      const k = el.dataset.layer;
      state.layers[k] = state.layers[k] === false;
      LS.set('layers', state.layers);
      applyPrefs();
      el.setAttribute('aria-checked', String(state.layers[k] !== false));
      break;
    }
    case 'lanes':
      state.lanes = !state.lanes;
      LS.set('lanes', state.lanes);
      document.querySelectorAll('.pitch-svg').forEach((s) => s.classList.toggle('show-lanes', state.lanes));
      el.setAttribute('aria-checked', String(state.lanes));
      break;
    case 'theme':
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      LS.set('theme', state.theme);
      applyPrefs();
      if (el.getAttribute('role') === 'switch') el.setAttribute('aria-checked', String(state.theme === 'light'));
      break;
    case 'shape':
      setShape(el.dataset.shape);
      break;
    case 'dense':
      state.dense = !state.dense;
      LS.set('dense', state.dense);
      applyPrefs();
      break;
    case 'gcat':
      state.glossaryCat = el.dataset.cat;
      render();
      break;
    case 'gterm':
      go(`#glossary.${el.dataset.term}`);
      break;
    default:
      break;
  }
});

document.addEventListener('input', (ev) => {
  if (ev.target.id === 'g-search') {
    state.glossaryQ = ev.target.value;
    const pos = ev.target.selectionStart;
    render();
    const inp = document.getElementById('g-search');
    inp.focus();
    try { inp.setSelectionRange(pos, pos); } catch { /* noop */ }
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && state.sheet) closeSheet();
  // タブの左右キー移動
  if ((ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && ev.target.matches?.('.viz-tabs .tab')) {
    const tabs = [...document.querySelectorAll('.viz-tabs .tab:not([disabled])')];
    const i = tabs.indexOf(ev.target);
    const n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    n?.click();
    ev.preventDefault();
  }
});

window.addEventListener('hashchange', onRoute);
onRoute();
try { performance.mark('ml-first-render'); } catch { /* 計測できない環境では無視 */ }
