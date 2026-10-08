// データ検証：選手数・座標・重なり・参照・因果の欠落・禁止表現をチェックする。
// 使い方: node scripts/validate.mjs   （エラーがあれば exit 1）
import { formations, formationList, matchupList, glossary, sources, sourceById } from '../src/data/index.js';
import { resolveScene, overlappingPairs, metersBetween, PLAYER_MIN_GAP_M } from '../src/lib/scene.js';

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const CHAIN = ['premise', 'setup', 'phenomenon', 'aim', 'counter'];
const PHASES = ['buildup', 'progression', 'final', 'wide', 'press', 'block', 'transition', 'setpiece'];
const BANNED = [/必ず/, /絶対/, /勝率/, /確実に/];

function scanText(where, obj) {
  const walk = (v, p) => {
    if (typeof v === 'string') {
      for (const re of BANNED) if (re.test(v)) err(`${where}${p}: 禁止表現 ${re} を含む: ${v.slice(0, 40)}…`);
      const bad = v.match(/\{(?!A\}|B\})[^}]*\}/);
      if (bad) err(`${where}${p}: 不明なトークン ${bad[0]}`);
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'pos' && k !== 'tweak') walk(x, `${p}.${k}`);
  };
  walk(obj, '');
}

function checkSources(where, ids) {
  for (const id of ids || []) if (!sourceById[id]) err(`${where}: 出典 ${id} が未登録`);
}

// ---- formations
for (const f of formationList) {
  const ids = f.slots.map((s) => s.id);
  if (ids.length !== 11) err(`${f.id}: 選手枠が ${ids.length} 人`);
  if (new Set(ids).size !== ids.length) err(`${f.id}: 選手枠IDが重複`);
  if (f.slots.filter((s) => s.label === 'GK').length !== 1) err(`${f.id}: GK が1人ではない`);
  if (!f.shapes.some((s) => s.id === 'base')) err(`${f.id}: base shape がない`);
  for (const sh of f.shapes) {
    for (const id of ids) {
      const p = sh.pos[id];
      if (!p) { err(`${f.id} ${sh.id}: ${id} の座標なし`); continue; }
      if (p[0] < 1 || p[0] > 99 || p[1] < 1 || p[1] > 99) err(`${f.id} ${sh.id}: ${id} が範囲外 ${p}`);
    }
    for (const k of Object.keys(sh.pos)) if (!ids.includes(k)) err(`${f.id} ${sh.id}: 余分な座標 ${k}`);
    const players = ids.filter((id) => sh.pos[id]).map((id) => ({ key: id, x: sh.pos[id][0], y: sh.pos[id][1] }));
    for (const [a, b, d] of overlappingPairs(players)) err(`${f.id} ${sh.id}: ${a} と ${b} が重なる（${d.toFixed(1)}m）`);
  }
  if (f.status === 'analysis') {
    for (const k of ['summary', 'facts', 'phases', 'roles', 'strengths', 'weaknesses', 'variations']) if (!f[k]) err(`${f.id}: ${k} がない`);
    for (const k of ['buildUp', 'progression', 'finalThird', 'highPress', 'midBlock', 'lowBlock', 'attTransition', 'defTransition', 'restDefence']) if (!f.phases?.[k]) err(`${f.id}: phases.${k} がない`);
    for (const v of [...(f.variations?.ip || []), ...(f.variations?.oop || [])]) if (v.shape && !f.shapes.some((s) => s.id === v.shape)) err(`${f.id}: variation の shape ${v.shape} がない`);
    for (const s of [...f.strengths, ...f.weaknesses]) { if (!s.why) err(`${f.id}: 「${s.title}」に why がない`); checkSources(`${f.id} ${s.title}`, s.sources); }
    checkSources(f.id, f.sources);
    scanText(f.id, f);
  }
}

// ---- matchups
const TAB_NEED = ['overview', 'ipA', 'ipB', 'trA', 'trB', 'adjust'];
for (const m of matchupList) {
  const w = m.id;
  const fA = formations[m.teams.A];
  const fB = formations[m.teams.B];
  if (!fA || !fB) { err(`${w}: チームが未登録`); continue; }
  scanText(w, m);
  for (const t of ['A', 'B']) {
    if (!m.thesis?.[t]) err(`${w}: thesis.${t} がない`);
    const qw = m.quickWatch?.[t];
    if (!qw || qw.length !== 3) err(`${w}: quickWatch.${t} が3点ではない`);
    for (const q of qw || []) {
      if (!m.scenes.some((s) => s.id === q.scene)) err(`${w}: quickWatch のシーン ${q.scene} がない`);
      if (!q.at || !q.text || !q.look || !q.why) err(`${w}: quickWatch の項目が不足: ${q.text}`);
    }
  }
  const sceneIds = new Set();
  const have = new Set();
  for (const sc of m.scenes) {
    if (sceneIds.has(sc.id)) err(`${w}: シーンID重複 ${sc.id}`);
    sceneIds.add(sc.id);
    if (sc.tab === 'overview') have.add('overview');
    if (sc.tab === 'ip') have.add(`ip${sc.poss}`);
    if (sc.tab === 'tr') have.add(`tr${sc.poss}`);
    if (sc.tab === 'adjust') have.add('adjust');
    if (!['overview', 'ip', 'tr', 'adjust'].includes(sc.tab)) err(`${w} ${sc.id}: tab が不正`);
    if (sc.tab !== 'overview' && !['A', 'B'].includes(sc.poss)) err(`${w} ${sc.id}: poss が不正`);
    let res;
    try { res = resolveScene(formations, m, sc); } catch (e) { err(`${w} ${sc.id}: ${e.message}`); continue; }
    const byTeam = { A: res.players.filter((p) => p.team === 'A'), B: res.players.filter((p) => p.team === 'B') };
    if (res.players.length !== 22 || byTeam.A.length !== 11 || byTeam.B.length !== 11) err(`${w} ${sc.id}: 選手数 ${res.players.length}`);
    for (const t of ['A', 'B']) if (byTeam[t].filter((p) => p.label === 'GK').length !== 1) err(`${w} ${sc.id}: ${t} の GK が1人ではない`);
    for (const p of res.players) if (p.x < 1 || p.x > 99 || p.y < 1 || p.y > 99) err(`${w} ${sc.id}: ${p.key} が範囲外 (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
    for (const [a, b, d] of overlappingPairs(res.players)) err(`${w} ${sc.id}: ${a} と ${b} が重なる（${d.toFixed(1)}m < ${PLAYER_MIN_GAP_M}m）`);
    for (const o of res.overlays) {
      if (o.t === 'count' && (typeof o.a !== 'number' || typeof o.b !== 'number')) err(`${w} ${sc.id}: count に a/b がない`);
      if (o.t === 'count' || o.t === 'danger') {
        for (const p of res.players) if (metersBetween(o.at, [p.x, p.y]) < 3.2) warn(`${w} ${sc.id}: ${o.t}「${o.label || ''}」が ${p.key} に近い`);
      }
    }
    if (sc.tab === 'overview' && m.quickWatch) {
      for (const t of ['A', 'B']) for (const q of m.quickWatch[t]) {
        for (const p of res.players) if (metersBetween(q.at, [p.x, p.y]) < 4.9) err(`${w} overview: 3点マーカー「${q.text.slice(0, 10)}…」(${t}) が ${p.key} と重なる`);
      }
    }
    if (!sc.title || !sc.caption || !sc.short) err(`${w} ${sc.id}: title/caption/short が不足`);
  }
  for (const need of TAB_NEED) if (!have.has(need)) err(`${w}: タブ ${need} のシーンがない`);

  const mechIds = new Set();
  for (const mc of m.mechanisms) {
    if (mechIds.has(mc.id)) err(`${w}: mechanism ID 重複 ${mc.id}`);
    mechIds.add(mc.id);
    for (const k of CHAIN) if (!mc[k] || mc[k].length < 8) err(`${w} ${mc.id}: 因果の ${k} がない／短い`);
    if (!['A', 'B'].includes(mc.attacker)) err(`${w} ${mc.id}: attacker が不正`);
    if (!PHASES.includes(mc.phase)) err(`${w} ${mc.id}: phase が不正 ${mc.phase}`);
    if (!['F', 'P', 'I'].includes(mc.evidence)) err(`${w} ${mc.id}: evidence が不正`);
    if (mc.scene && !sceneIds.has(mc.scene)) err(`${w} ${mc.id}: scene ${mc.scene} がない`);
    if (!mc.exception) warn(`${w} ${mc.id}: 成立しないケースが未記入`);
    checkSources(`${w} ${mc.id}`, mc.sources);
  }
  const roles = (side) => m.mechanisms.filter((x) => x.attacker === side);
  for (const t of ['A', 'B']) {
    if (!roles(t).some((x) => x.phase !== 'transition')) err(`${w}: ${t} の保持の因果がない`);
    if (!roles(t).some((x) => x.phase === 'transition')) err(`${w}: ${t} 側のトランジションの因果がない`);
  }
  for (const a of m.adjustments || []) {
    for (const k of ['title', 'trigger', 'change', 'effect']) if (!a[k]) err(`${w} ${a.id}: ${k} がない`);
    if (!a.response?.text || !['A', 'B'].includes(a.response?.by)) err(`${w} ${a.id}: response が不正`);
    if (a.scene && !sceneIds.has(a.scene)) err(`${w} ${a.id}: scene ${a.scene} がない`);
  }
  if (!(m.adjustments || []).some((a) => a.by === 'A') || !(m.adjustments || []).some((a) => a.by === 'B')) err(`${w}: 両チームの修正案が必要`);
  for (const k of ['assumptions', 'exceptions', 'gameState', 'profiles']) if (!m.validity?.[k]?.length) err(`${w}: validity.${k} がない`);
  for (const k of ['superiority', 'freemen', 'interplay', 'duels', 'setPieces']) if (!m[k]?.length) err(`${w}: ${k} がない`);
  if (!m.restDefence?.A || !m.restDefence?.B) err(`${w}: restDefence がない`);
  for (const s of m.superiority || []) {
    if (s.kind === 'numerical' && (typeof s.a !== 'number' || typeof s.b !== 'number')) err(`${w}: superiority「${s.zone}」に a/b がない`);
    if (s.kind !== 'numerical' && !['A', 'B'].includes(s.holder)) err(`${w}: superiority「${s.zone}」に holder がない`);
  }
  for (const x of [...(m.interplay || []), ...(m.duels || []), ...(m.freemen || [])]) if (x.scene && !sceneIds.has(x.scene)) err(`${w}: 参照シーン ${x.scene} がない`);
  checkSources(w, m.sources);
}

// ---- glossary / sources
const gIds = new Set(glossary.map((g) => g.id));
for (const g of glossary) {
  for (const r of g.related || []) if (!gIds.has(r)) err(`用語 ${g.id}: 関連語 ${r} が未登録`);
  checkSources(`用語 ${g.id}`, g.sources);
  if (!g.short || !g.long) err(`用語 ${g.id}: 定義が不足`);
}
const sIds = new Set();
for (const s of sources) {
  if (sIds.has(s.id)) err(`出典ID重複 ${s.id}`);
  sIds.add(s.id);
}

const pairs = new Set(matchupList.map((m) => [m.teams.A, m.teams.B].sort().join('|')));
console.log(`formations: ${formationList.length}（分析 ${formationList.filter((f) => f.status === 'analysis').length}）, matchups: ${matchupList.length}（組 ${pairs.size}）, glossary: ${glossary.length}, sources: ${sources.length}`);
for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `✗ ${errors.length} errors, ${warns.length} warnings` : `✓ OK（警告 ${warns.length}）`);
process.exit(errors.length ? 1 : 0);
