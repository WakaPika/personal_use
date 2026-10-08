import { formations, formationList, activeFormations, matchupStatus, matchupSlug } from '../data/index.js';
import { renderPitch } from '../lib/pitch.js';
import { esc } from '../lib/text.js';
import { statusChip, sourceLinks, icon } from '../lib/ui.js';
import { toScene } from '../lib/scene.js';

function playersOf(f, shapeId) {
  const shape = f.shapes.find((s) => s.id === shapeId) || f.shapes[0];
  return f.slots.map((slot) => {
    const [x, y] = toScene('A', shape.pos[slot.id]);
    return { key: `A:${slot.id}`, team: 'A', id: slot.id, label: slot.label, name: slot.name, x, y };
  });
}

export function formationPitch(f, shapeId, { compact = false, idPrefix = 'fz' } = {}) {
  const shape = f.shapes.find((s) => s.id === shapeId) || f.shapes[0];
  return renderPitch({
    players: playersOf(f, shape.id),
    self: 'A',
    labels: compact ? null : { self: `${f.id}｜${shape.label}`, opp: null },
    title: `${f.id} ${shape.label}`,
    desc: shape.note,
    idPrefix: `${idPrefix}-${f.id}-${shape.id}`.replace(/[^a-z0-9-]/gi, ''),
    compact,
  });
}

function sysHeader(title, sub) {
  return `<header class="pbar" role="banner"><div class="pbar-t"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div></header>`;
}

export function renderSystems() {
  const card = (f) => `<a class="sys-card${f.status === 'planned' ? ' planned' : ''}" href="#sys.${esc(f.id)}">
      <div class="sys-thumb">${formationPitch(f, 'base', { compact: true, idPrefix: 'th' })}</div>
      <div class="sys-meta"><b class="sys-name">${esc(f.id)}</b>${statusChip(f.status)}<span class="sys-alias">${esc(f.alias)}</span></div>
    </a>`;
  const ids = activeFormations.map((f) => f.id);
  const matrix = `<div class="matrix-wrap"><table class="matrix"><caption>行＝自チーム、列＝相手。セルをタップすると開きます。</caption>
    <thead><tr><th scope="col"><span class="sr">自チーム＼相手</span></th>${ids.map((o) => `<th scope="col">${esc(o)}</th>`).join('')}</tr></thead>
    <tbody>${ids
      .map(
        (s) => `<tr><th scope="row">${esc(s)}</th>${ids
          .map((o) => {
            const st = matchupStatus(s, o);
            return `<td><a class="cell c-${st}" href="#${matchupSlug(s, o)}" aria-label="${esc(s)} 対 ${esc(o)}：${st === 'analysis' ? '詳細分析あり' : '未整備'}"><i aria-hidden="true">${st === 'analysis' ? '◆' : '・'}</i></a></td>`;
          })
          .join('')}</tr>`,
      )
      .join('')}</tbody></table></div>
    <p class="legend-line"><span class="cell-l c-analysis">◆</span>詳細分析 β　<span class="cell-l c-stub">・</span>未整備（公称配置の比較のみ）</p>`;
  return {
    head: sysHeader('システム', `${activeFormations.length}種＋拡張予定${formationList.length - activeFormations.length}種`),
    main: `<div class="page">
      <section class="sec"><h2 class="sec-h">全${ids.length * ids.length}方向の噛み合わせ</h2>${matrix}</section>
      <section class="sec"><h2 class="sec-h">システム一覧</h2><div class="sys-grid">${formationList.map(card).join('')}</div></section>
    </div>`,
  };
}

const PHASE_ROWS = [
  ['保持', [['buildUp', 'ビルドアップ'], ['progression', '前進'], ['finalThird', 'ファイナルサード']]],
  ['非保持', [['highPress', 'ハイプレス'], ['midBlock', 'ミドルブロック'], ['lowBlock', 'ローブロック']]],
  ['トランジション', [['defTransition', '攻→守'], ['restDefence', '残り守備'], ['attTransition', '守→攻']]],
];

export function renderFormation(id, shapeId) {
  const f = formations[id];
  if (!f) return null;
  const shape = f.shapes.find((s) => s.id === shapeId) || f.shapes[0];
  const shapePills = f.shapes
    .map((s) => `<button class="pill-btn${s.id === shape.id ? ' on' : ''}" aria-pressed="${s.id === shape.id}" data-act="shape" data-shape="${s.id}">${esc(s.label)}</button>`)
    .join('');
  const head = sysHeader(esc(f.id), esc(f.alias));
  if (f.status === 'planned') {
    return {
      head,
      main: `<div class="page fm"><div class="fm-viz"><div class="status-row">${statusChip('planned')}</div>
        <figure class="pitch-wrap">${formationPitch(f, 'base')}</figure></div>
        <div class="fm-text"><div class="banner" role="note">${esc(f.id)} は基本配置のみ登録済みで、分析コンテンツは準備中です。マッチアップの選択肢にもまだ表示していません。</div>
        <p class="muted">追加手順：<code>src/data/formations/</code> に 4-3-3 と同じ構造のファイルを作り、<code>status: 'analysis'</code> にして <code>src/data/index.js</code> に登録します。</p></div></div>`,
    };
  }
  const facts = f.facts
    .map(
      (x) => `<li class="fact"><span class="fact-k">${esc(x.label)}</span>${
        x.level ? `<span class="lv" aria-label="${x.level}/3">${[1, 2, 3].map((n) => `<i class="${n <= x.level ? 'on' : ''}"></i>`).join('')}</span>` : `<b class="fact-v">${esc(x.value)}</b>`
      }<span class="fact-t">${esc(x.text)}</span></li>`,
    )
    .join('');
  const phases = PHASE_ROWS.map(
    ([g, rows]) => `<div class="ph-group"><h3 class="sub-h">${g}</h3><dl class="ph-dl">${rows
      .map(([k, l]) => `<dt>${l}</dt><dd>${esc(f.phases[k])}</dd>`)
      .join('')}</dl></div>`,
  ).join('');
  const roles = f.roles.map((r) => `<li><b>${esc(r.title)}</b><p>${esc(r.text)}</p></li>`).join('');
  const sw = (arr, cls) => `<ul class="sw ${cls}">${arr.map((s) => `<li><b>${esc(s.title)}</b><p><span class="why">なぜ</span>${esc(s.why)}</p></li>`).join('')}</ul>`;
  const vars = (arr) => `<ul class="var-list">${arr
    .map((v) => `<li>${v.shape ? `<button class="sm-btn" data-act="shape" data-shape="${v.shape}">図</button>` : '<span class="sm-pad"></span>'}<div><b>${esc(v.label)}</b><p>${esc(v.text)}</p></div></li>`)
    .join('')}</ul>`;
  const opps = activeFormations
    .map((o) => {
      const st = matchupStatus(f.id, o.id);
      return `<li><a href="#${matchupSlug(f.id, o.id)}"><span>vs <b>${esc(o.id)}</b></span>${st === 'analysis' ? statusChip('analysis') : statusChip('stub')}${icon.arrowRight}</a></li>`;
    })
    .join('');
  return {
    head,
    main: `<div class="page fm">
      <div class="fm-viz">
        <div class="status-row">${statusChip(f.status)}${f.phaseOf ? `<span class="muted">同じ人員の別フェーズ形：<a href="#sys.${esc(f.phaseOf)}">${esc(f.phaseOf)}</a></span>` : ''}</div>
        <p class="thesis">${esc(f.summary)}</p>
        <div class="pills" role="group" aria-label="局面ごとの形">${shapePills}</div>
        <figure class="pitch-wrap">${formationPitch(f, shape.id)}</figure>
        <figcaption class="viz-cap"><h2 class="cap-title">${esc(shape.label)}</h2><p>${esc(shape.note)}</p></figcaption>
      </div>
      <div class="fm-text">
        <section class="sec"><h2 class="sec-h">Quick facts</h2><ul class="facts">${facts}</ul></section>
        <section class="sec"><h2 class="sec-h">局面ごとの振る舞い</h2>${phases}</section>
        <section class="sec"><h2 class="sec-h">強みになりやすい構造</h2>${sw(f.strengths, 'st')}</section>
        <section class="sec"><h2 class="sec-h">弱点になりやすい構造</h2>${sw(f.weaknesses, 'wk')}</section>
        <section class="sec"><h2 class="sec-h">選手の役割</h2><ul class="roles">${roles}</ul></section>
        <section class="sec"><h2 class="sec-h">よくある可変</h2><h3 class="sub-h">保持時</h3>${vars(f.variations.ip)}<h3 class="sub-h">非保持時</h3>${vars(f.variations.oop)}</section>
        <section class="sec"><h2 class="sec-h">${esc(f.id)} から見たマッチアップ</h2><ul class="opp-list">${opps}</ul></section>
        <section class="sec"><h2 class="sec-h">出典</h2><p class="note">強み・弱みは一般的な役割設定を前提にした傾向で、選手特性やプレス方式で変わります。</p>${sourceLinks(f.sources)}</section>
      </div>
    </div>`,
  };
}
