// ボトムシート（マッチアップ選択、凡例・表示設定）
import { activeFormations, formationList, matchupStatus, matchupSlug } from '../data/index.js';
import { esc } from '../lib/text.js';
import { icon } from '../lib/ui.js';

export function selectorSheet({ selfId, oppId, side, recent }) {
  const chips = formationList
    .map((f) => {
      const planned = f.status === 'planned';
      const cur = side === 'self' ? selfId : oppId;
      const other = side === 'self' ? oppId : selfId;
      const st = planned ? 'planned' : side === 'self' ? matchupStatus(f.id, other) : matchupStatus(other, f.id);
      return `<button class="f-chip${f.id === cur ? ' on' : ''}${planned ? ' planned' : ''}" ${planned ? 'disabled aria-disabled="true"' : ''} aria-pressed="${f.id === cur}" data-act="choose" data-side="${side}" data-id="${esc(f.id)}">
        <b>${esc(f.id)}</b><small>${planned ? '準備中' : st === 'analysis' ? '◆ 詳細β' : '・ 未整備'}</small></button>`;
    })
    .join('');
  const ids = activeFormations.map((f) => f.id);
  const matrix = `<div class="matrix-wrap"><table class="matrix compact"><thead><tr><th scope="col"><span class="sr">自チーム＼相手</span><span aria-hidden="true">自＼相</span></th>${ids
    .map((o) => `<th scope="col">${esc(o)}</th>`)
    .join('')}</tr></thead><tbody>${ids
    .map(
      (s) => `<tr><th scope="row">${esc(s)}</th>${ids
        .map((o) => {
          const st = matchupStatus(s, o);
          const cur = s === selfId && o === oppId;
          return `<td><button class="cell c-${st}${cur ? ' cur' : ''}" data-act="cell" data-self="${esc(s)}" data-opp="${esc(o)}" aria-label="${esc(s)} 対 ${esc(o)}${st === 'analysis' ? '（詳細分析あり）' : '（未整備）'}${cur ? '・表示中' : ''}"><i aria-hidden="true">${st === 'analysis' ? '◆' : '・'}</i></button></td>`;
        })
        .join('')}</tr>`,
    )
    .join('')}</tbody></table></div>`;
  const rec = (recent || []).filter((r) => r !== matchupSlug(selfId, oppId)).slice(0, 4);
  return `<div class="sheet-h"><h2 id="sheet-title">マッチアップを選択</h2><button class="icon-btn" data-act="sheet-close" aria-label="閉じる">${icon.close}</button></div>
    <div class="seg" role="tablist" aria-label="変更するチーム">
      <button role="tab" aria-selected="${side === 'self'}" class="${side === 'self' ? 'on' : ''}" data-act="side" data-side="self"><i class="sym sym-self" aria-hidden="true"></i>自チーム <b>${esc(selfId)}</b></button>
      <button role="tab" aria-selected="${side === 'opp'}" class="${side === 'opp' ? 'on' : ''}" data-act="side" data-side="opp"><i class="sym sym-opp" aria-hidden="true"></i>相手 <b>${esc(oppId)}</b></button>
    </div>
    <div class="f-grid">${chips}</div>
    <h3 class="sheet-sub">全${ids.length * ids.length}方向から一度に選ぶ<small>行＝自チーム／列＝相手</small></h3>
    ${matrix}
    <p class="legend-line"><span class="cell-l c-analysis">◆</span>詳細分析 β　<span class="cell-l c-stub">・</span>未整備</p>
    ${rec.length ? `<h3 class="sheet-sub">最近見た組み合わせ</h3><div class="pills wrap">${rec
      .map((r) => `<a class="pill-btn" href="#${esc(r)}" data-act="sheet-nav">${esc(r.replace('_vs_', ' vs '))}</a>`)
      .join('')}</div>` : ''}`;
}

const LAYERS = [
  ['move', '動き（パス・移動）'],
  ['press', 'プレスとカバーシャドウ'],
  ['zone', '狙うスペース'],
  ['count', '人数関係'],
  ['free', 'フリーマン'],
  ['mark', 'マーク関係'],
  ['danger', '危険地点'],
  ['marker', '見るべき3点の番号'],
];

function sample(kind) {
  const svg = (inner) => `<svg class="lg-svg pitch-svg" viewBox="0 0 120 52" aria-hidden="true">${inner}</svg>`;
  switch (kind) {
    case 'self': return svg('<g class="pl p-self" transform="translate(60,26)"><circle r="20"/><text y="7" font-size="19">6</text></g>');
    case 'opp': return svg('<g class="pl p-opp" transform="translate(60,26)"><rect x="-19" y="-19" width="38" height="38" rx="7"/><text y="7" font-size="17">CM</text></g>');
    case 'pass': return svg('<path class="arr pass a-self" d="M10,26 L100,26" marker-end="url(#ah-self)"/>');
    case 'run': return svg('<path class="arr run a-self" d="M10,26 L100,26" marker-end="url(#ah-self)"/>');
    case 'press': return svg('<path class="arr press a-opp" d="M10,26 L100,26" marker-end="url(#ap-opp)"/>');
    case 'shadow': return svg('<path class="shadow s-opp" d="M12,26 L112,6 L112,46 Z"/><g class="pl p-opp" transform="translate(16,26)"><rect x="-11" y="-11" width="22" height="22" rx="5"/></g>');
    case 'zone': return svg('<g class="zone z-self"><rect x="8" y="6" width="104" height="40" rx="10" fill="url(#hz-self)"/></g>');
    case 'free': return svg('<g class="free f-self"><circle cx="60" cy="26" r="22"/></g><g class="pl p-self" transform="translate(60,26)"><circle r="14"/></g>');
    case 'mark': return svg('<line class="mark" x1="12" y1="26" x2="108" y2="26"/>');
    case 'danger': return svg('<g class="danger" transform="translate(60,30)"><path d="M0,-22 L20,14 L-20,14 Z"/><text y="9" font-size="21">!</text></g>');
    case 'count': return svg('<g class="count c-self" transform="translate(8,12)"><rect class="c-main" width="66" height="28" rx="6"/><text x="33" y="20" font-size="18">3v2</text><rect class="c-sign" x="66" width="38" height="28" rx="6"/><text class="c-sign-t" x="85" y="20" font-size="18">+1</text></g>');
    case 'marker': return svg('<g class="qmark" transform="translate(60,26)"><circle r="18"/><text y="7" font-size="20">1</text></g>');
    default: return '';
  }
}

export function legendSheet({ layers, lanes, theme }) {
  const items = [
    ['self', '自チーム（塗りの円）'],
    ['opp', '相手（枠線の四角）'],
    ['pass', 'パス（点線矢印）'],
    ['run', '移動・持ち運び（実線矢印）'],
    ['press', 'プレス（太線＋山形の矢じり）'],
    ['shadow', 'カバーシャドウ（扇形の影）'],
    ['zone', '狙うスペース（斜線の領域）'],
    ['free', 'フリーマン（破線の円）'],
    ['mark', 'マーク関係（点線）'],
    ['count', '人数関係（自チーム側の人数が先）'],
    ['danger', 'トランジションの危険地点'],
    ['marker', '今見るべき3点の場所'],
  ];
  return `<div class="sheet-h"><h2 id="sheet-title">凡例・表示</h2><button class="icon-btn" data-act="sheet-close" aria-label="閉じる">${icon.close}</button></div>
    <p class="note">色は補助です。チームは形（円／四角）、動きは線種、人数は「+1／=／−1」の記号でも区別できます。自チームは常に下から上へ攻める向きで表示します。</p>
    <ul class="lg-list">${items.map(([k, l]) => `<li>${sample(k)}<span>${l}</span></li>`).join('')}</ul>
    <h3 class="sheet-sub">表示するレイヤー</h3>
    <div class="toggles">${LAYERS.map(([k, l]) => `<button class="tg" role="switch" aria-checked="${layers[k] !== false}" data-act="layer" data-layer="${k}"><span class="tg-ui" aria-hidden="true"></span>${l}</button>`).join('')}
      <button class="tg" role="switch" aria-checked="${!!lanes}" data-act="lanes"><span class="tg-ui" aria-hidden="true"></span>5レーンと3分割の補助線</button>
      <button class="tg" role="switch" aria-checked="${theme === 'light'}" data-act="theme"><span class="tg-ui" aria-hidden="true"></span>屋外向けライト表示</button>
    </div>`;
}
