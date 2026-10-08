import { formations, getMatchup, matchupStatus, nominalCounts, analysedOpponents, matchupSlug } from '../data/index.js';
import { TABS, PHASE_LABEL, STATUS } from '../data/schema.js';
import { resolveScene } from '../lib/scene.js';
import { renderPitch } from '../lib/pitch.js';
import { esc, fmt, plain, teamTag } from '../lib/text.js';
import { icon, statusChip, evidenceChip, sourceLinks, countText } from '../lib/ui.js';

export function perspective(entry, self) {
  return { A: entry.teams.A, B: entry.teams.B, self };
}

/** シーンがこの視点でどのタブに入るか */
export function tabOfScene(scene, self) {
  switch (scene.tab) {
    case 'overview': return 'overview';
    case 'ip': return scene.poss === self ? 'ip-self' : 'ip-opp';
    case 'tr': return scene.poss === self ? 'tr-win' : 'tr-loss';
    case 'adjust': return 'adjust';
    default: return 'overview';
  }
}

export function scenesForTab(entry, self, tabId) {
  const list = entry.scenes.filter((s) => tabOfScene(s, self) === tabId);
  if (tabId === 'adjust') list.sort((x, y) => (x.poss === self) - (y.poss === self));
  return list;
}

export function defaultScene(entry) {
  return entry.scenes[0].id;
}

function header(selfId, oppId) {
  return `<header class="mbar" role="banner">
    <button class="team-btn tb-self" data-act="pick" data-side="self" aria-label="自チームのシステムを変更（現在 ${esc(selfId)}）">
      <span class="tb-k"><i class="sym sym-self" aria-hidden="true"></i>自チーム</span><span class="tb-v">${esc(selfId)}${icon.chevron}</span>
    </button>
    <button class="swap-btn" data-act="swap" aria-label="自チームと相手を入れ替える">${icon.swap}<span>入替</span></button>
    <button class="team-btn tb-opp" data-act="pick" data-side="opp" aria-label="相手のシステムを変更（現在 ${esc(oppId)}）">
      <span class="tb-k"><i class="sym sym-opp" aria-hidden="true"></i>相手</span><span class="tb-v">${esc(oppId)}${icon.chevron}</span>
    </button>
  </header>`;
}

// ------------------------------------------------------------ viz
export function renderViz(entry, self, sceneId, opts = {}) {
  const ctx = perspective(entry, self);
  const scene = entry.scenes.find((s) => s.id === sceneId) || entry.scenes[0];
  const curTab = tabOfScene(scene, self);
  const tabs = TABS.map((t) => {
    const has = scenesForTab(entry, self, t.id).length > 0;
    const sel = t.id === curTab;
    return `<button role="tab" class="tab${sel ? ' on' : ''}" aria-selected="${sel}" ${has ? '' : 'disabled aria-disabled="true"'} data-act="tab" data-tab="${t.id}">${esc(t.label)}</button>`;
  }).join('');
  const siblings = scenesForTab(entry, self, curTab);
  const pills = siblings.length > 1
    ? `<div class="pills" role="group" aria-label="この局面の図">${siblings
        .map((s, i) => `<button class="pill-btn${s.id === scene.id ? ' on' : ''}" aria-pressed="${s.id === scene.id}" data-act="scene" data-scene="${s.id}"><b>${i + 1}</b>${fmt(s.short, ctx)}</button>`)
        .join('')}</div>`
    : '';

  const resolved = resolveScene(formations, entry, scene, { relax: !!scene.relax });
  const markers = scene.tab === 'overview' && entry.quickWatch ? entry.quickWatch[self].map((q, i) => ({ n: i + 1, at: q.at })) : [];
  const svg = renderPitch({
    ...resolved,
    self,
    markers,
    labels: { self: `自 ${ctx[self]}`, opp: `相手 ${ctx[self === 'A' ? 'B' : 'A']}` },
    title: plain(scene.title, ctx),
    desc: plain(scene.caption, ctx),
    idPrefix: `pz-${scene.id}`,
    lanes: opts.lanes,
  });
  const textAlt = describeOverlays(resolved, ctx);
  const linked = (entry.mechanisms || []).filter((m) => m.scene === scene.id);
  const adjLinked = (entry.adjustments || []).filter((a) => a.scene === scene.id);
  const links = [...linked.map((m) => ({ id: m.id, t: m.title })), ...adjLinked.map((a) => ({ id: a.id, t: a.title }))];

  return `<div class="viz-tabs" role="tablist" aria-label="局面">${tabs}</div>
  ${pills}
  <figure class="pitch-wrap" data-scene="${scene.id}">${svg}</figure>
  <figcaption class="viz-cap">
    <div class="cap-head"><h2 class="cap-title">${fmt(scene.title, ctx)}</h2>
      <button class="ghost-btn" data-act="legend" aria-label="凡例と表示レイヤー">${icon.layers}<span>凡例・表示</span></button></div>
    <p>${fmt(scene.caption, ctx)}</p>
    ${links.length ? `<div class="cap-links">${links.map((l) => `<button class="link-btn" data-act="jump-card" data-card="${l.id}">${fmt(l.t, ctx)} ${icon.arrowRight}</button>`).join('')}</div>` : ''}
    ${textAlt ? `<details class="alt"><summary>図の内容をテキストで読む</summary>${textAlt}</details>` : ''}
  </figcaption>`;
}

function who(p, ctx) {
  if (!p) return '';
  const isSelf = p.team === ctx.self;
  return `${isSelf ? '自' : '相手'}${p.label === 'GK' ? 'GK' : p.name}`;
}

function describeOverlays(resolved, ctx) {
  const items = [];
  const { byKey } = resolved;
  for (const o of resolved.overlays) {
    const from = typeof o.from === 'string' ? who(byKey[o.from], ctx) : '';
    const to = typeof o.to === 'string' ? who(byKey[o.to], ctx) : '指定エリア';
    switch (o.t) {
      case 'pass': items.push(`パス（点線矢印）：${from} → ${to}${o.label ? `（${o.label}）` : ''}`); break;
      case 'run': items.push(`移動（実線矢印）：${from || '移動前の位置'} → ${to}${o.label ? `（${o.label}）` : ''}`); break;
      case 'press': items.push(`プレス（太い矢印）：${from} → ${to}`); break;
      case 'shadow': items.push(`カバーシャドウ（扇形）：${from}が背中で${to}へのコースを消す`); break;
      case 'mark': items.push(`マーク関係（点線）：${who(byKey[o.aKey], ctx)} ⇔ ${who(byKey[o.bKey], ctx)}`); break;
      case 'free': items.push(`フリーマン（破線の円）：${who(byKey[o.who], ctx)}${o.label ? `「${o.label}」` : ''}`); break;
      case 'zone': items.push(`狙うスペース（斜線の領域）：${o.label || ''}`); break;
      case 'danger': items.push(`危険地点（⚠）：${o.label || ''}`); break;
      case 'count': {
        const mine = ctx.self === 'A' ? o.a : o.b;
        const theirs = ctx.self === 'A' ? o.b : o.a;
        const d = mine - theirs;
        items.push(`人数関係：${o.label || ''} 自${mine} 対 相手${theirs}（${d > 0 ? `自チーム+${d}` : d < 0 ? `相手+${-d}` : '同数'}）`);
        break;
      }
      case 'note': items.push(`注記：${o.text}`); break;
      default: break;
    }
  }
  return items.length ? `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
}

// ------------------------------------------------------------ sections
function mechCard(m, ctx) {
  const mine = m.attacker === ctx.self;
  const tagged = (side, word) =>
    `<i class="sym sym-${side}" aria-hidden="true"></i>${word}<span class="sr">（${side === 'self' ? '自チーム' : '相手'}）</span>`;
  const aimLabel = tagged(mine ? 'self' : 'opp', '狙い');
  const counterLabel = tagged(mine ? 'opp' : 'self', '対策');
  const readjustLabel = mine ? '再調整（自チーム）' : '再調整（相手）';
  return `<article class="mech ${mine ? 'mine' : 'theirs'}" id="card-${m.id}" tabindex="-1">
    <header class="mech-h">
      <div class="mech-meta"><span class="chip ph">${esc(PHASE_LABEL[m.phase] || '')}</span>${evidenceChip(m.evidence)}</div>
      <h3>${fmt(m.title, ctx)}</h3>
    </header>
    <ol class="chain">
      <li class="c-premise"><b>前提</b><p>${fmt(m.premise, ctx)}</p></li>
      <li class="c-setup"><b>配置</b><p>${fmt(m.setup, ctx)}</p></li>
      <li><b>現象</b><p>${fmt(m.phenomenon, ctx)}</p></li>
      <li class="c-aim"><b>${aimLabel}</b><p>${fmt(m.aim, ctx)}</p></li>
      <li class="c-counter"><b>${counterLabel}</b><p>${fmt(m.counter, ctx)}</p></li>
    </ol>
    <div class="mech-foot">
      ${m.scene ? `<button class="sm-btn" data-act="goto-scene" data-scene="${m.scene}">図で見る</button>` : ''}
      <details><summary>再調整・例外・出典</summary>
        ${m.readjust ? `<p><b>${readjustLabel}</b>${fmt(m.readjust, ctx)}</p>` : ''}
        ${m.exception ? `<p><b>成立しないケース</b>${fmt(m.exception, ctx)}</p>` : ''}
        ${sourceLinks(m.sources)}
      </details>
    </div>
  </article>`;
}

function section(id, title, sub, body) {
  return `<section class="sec" id="sec-${id}" aria-labelledby="h-${id}">
    <h2 id="h-${id}" class="sec-h">${title}${sub ? `<small>${sub}</small>` : ''}</h2>${body}</section>`;
}

function quickWatch(entry, self, ctx) {
  const items = entry.quickWatch[self];
  return `<section class="qw" id="sec-qw" aria-labelledby="h-qw">
    <h2 id="h-qw" class="qw-h">今見るべき3点<small>${teamTag(self, ctx)} の視点</small></h2>
    <ol class="qw-list">${items
      .map(
        (q, i) => `<li><button class="qw-item" data-act="goto-scene" data-scene="${q.scene}">
          <span class="qw-n" aria-hidden="true">${i + 1}</span>
          <span class="qw-body"><span class="qw-t">${fmt(q.text, ctx)}</span>
          <span class="qw-look">見る場所：${fmt(q.look, ctx)}</span>
          <span class="qw-why">${fmt(q.why, ctx)}</span></span></button></li>`,
      )
      .join('')}</ol>
  </section>`;
}

function superiorityBlock(entry, ctx) {
  const kinds = { numerical: '数的', positional: '位置的', qualitative: '質的' };
  const rows = entry.superiority
    .map((s) => {
      let badge;
      if (s.kind === 'numerical') {
        const mine = ctx.self === 'A' ? s.a : s.b;
        const theirs = ctx.self === 'A' ? s.b : s.a;
        badge = countText(mine, theirs);
      } else {
        const mine = s.holder === ctx.self;
        badge = `<span class="cnt cnt-${mine ? 'self' : 'opp'}"><b>${mine ? '自' : '相手'}</b><i>${mine ? '有利' : '有利'}</i></span>`;
      }
      return `<li class="sup"><div class="sup-h"><span class="chip k-${s.kind}">${kinds[s.kind]}</span><span class="sup-z">${fmt(s.zone, ctx)}</span>${badge}</div>
        <p>${fmt(s.text, ctx)}</p><p class="cond">条件：${fmt(s.when, ctx)}</p></li>`;
    })
    .join('');
  const free = (entry.freemen || [])
    .map((f) => `<li><span class="free-dot" aria-hidden="true"></span><span><b>${fmt(f.who, ctx)}</b> ― ${fmt(f.when, ctx)}</span>${f.scene ? `<button class="sm-btn" data-act="goto-scene" data-scene="${f.scene}">図</button>` : ''}</li>`)
    .join('');
  return `<ul class="sup-list">${rows}</ul>
    <h3 class="sub-h">フリーマンになりやすい選手</h3><ul class="free-list">${free}</ul>`;
}

function interplayBlock(entry, ctx) {
  const order = [...entry.interplay].sort((x, y) => (x.builder === ctx.self ? -1 : 1) - (y.builder === ctx.self ? -1 : 1));
  return `<div class="ip-grid">${order
    .map((ip) => {
      const mineBuild = ip.builder === ctx.self;
      const builderCount = ip.builder === 'A' ? ip.a : ip.b;
      const presserCount = ip.builder === 'A' ? ip.b : ip.a;
      const mine = mineBuild ? builderCount : presserCount;
      const theirs = mineBuild ? presserCount : builderCount;
      return `<article class="ip-card ${mineBuild ? 'mine' : 'theirs'}">
        <h3>${mineBuild ? '自チームのビルドアップ × 相手のプレス' : '相手のビルドアップ × 自チームのプレス'}</h3>
        <div class="ip-vs"><div><small>${mineBuild ? '自' : '相手'}の後方</small><b>${esc(ip.build)}</b></div><div class="ip-c">${countText(mine, theirs)}</div><div><small>${mineBuild ? '相手' : '自'}のプレス</small><b>${esc(ip.press)}</b></div></div>
        <p><b>鍵</b>${fmt(ip.key, ctx)}</p><p><b>外し方</b>${fmt(ip.escape, ctx)}</p>
        ${ip.scene ? `<button class="sm-btn" data-act="goto-scene" data-scene="${ip.scene}">図で見る</button>` : ''}
      </article>`;
    })
    .join('')}</div>`;
}

function restBlock(entry, ctx) {
  const opp = ctx.self === 'A' ? 'B' : 'A';
  const rd = (team) => {
    const r = entry.restDefence[team];
    const defenders = team === 'A' ? r.a : r.b;
    const attackers = team === 'A' ? r.b : r.a;
    const mine = team === ctx.self;
    return `<div class="rd ${mine ? 'mine' : 'theirs'}"><small>${mine ? '自チームの残り守備' : '相手の残り守備'}</small>
      <b>${fmt(r.shape, ctx)}</b> <span class="muted">vs ${fmt(r.vs, ctx)}</span> ${countText(mine ? defenders : attackers, mine ? attackers : defenders)}
      <p>${fmt(r.note, ctx)}</p></div>`;
  };
  return `<div class="rd-grid">${rd(ctx.self)}${rd(opp)}</div>`;
}

function duelsBlock(entry, ctx) {
  const opp = ctx.self === 'A' ? 'B' : 'A';
  return `<ul class="duels">${entry.duels
    .map((d) => {
      const left = ctx.self === 'A' ? d.a : d.b;
      const right = ctx.self === 'A' ? d.b : d.a;
      return `<li><div class="duel-h"><span class="d-self">${teamTag(ctx.self, ctx)} ${esc(left)}</span><span class="d-x" aria-hidden="true">×</span><span class="d-opp">${teamTag(opp, ctx)} ${esc(right)}</span></div>
      <p>${fmt(d.text, ctx)}</p>${d.scene ? `<button class="sm-btn" data-act="goto-scene" data-scene="${d.scene}">図</button>` : ''}</li>`;
    })
    .join('')}</ul>`;
}

function adjustBlock(entry, ctx) {
  const list = [...entry.adjustments].sort((x, y) => (x.by === ctx.self) - (y.by === ctx.self));
  return `<div class="adj-list">${list
    .map((a) => {
      const mine = a.by === ctx.self;
      return `<article class="adj ${mine ? 'mine' : 'theirs'}" id="card-${a.id}" tabindex="-1">
        <header><span class="by">${mine ? '自チームの修正' : '相手の修正'}</span><h3>${fmt(a.title, ctx)}</h3></header>
        <dl class="adj-dl"><dt>きっかけ</dt><dd>${fmt(a.trigger, ctx)}</dd><dt>変更</dt><dd>${fmt(a.change, ctx)}</dd><dt>効果</dt><dd>${fmt(a.effect, ctx)}</dd></dl>
        <div class="resp"><b>${a.response.by === ctx.self ? '→ 自チームの再調整' : '→ 相手の再調整'}</b><p>${fmt(a.response.text, ctx)}</p></div>
        ${a.scene ? `<button class="sm-btn" data-act="goto-scene" data-scene="${a.scene}">図で見る</button>` : ''}
      </article>`;
    })
    .join('')}</div>`;
}

function setPieceBlock(entry, ctx) {
  return `<p class="note">セットプレーは通常のシステムの延長ではなく、別の局面として扱います。ここでは「誰を残すか」と人数のトレードオフだけを示します。</p>
  <ul class="sp-list">${entry.setPieces.map((s) => `<li><div class="sp-h"><b>${fmt(s.title, ctx)}</b>${evidenceChip(s.evidence)}</div><p>${fmt(s.text, ctx)}</p></li>`).join('')}</ul>`;
}

function validityBlock(entry, ctx) {
  const v = entry.validity;
  const list = (title, arr, cls) => `<div class="val ${cls}"><h3 class="sub-h">${title}</h3><ul>${arr.map((t) => `<li>${fmt(t, ctx)}</li>`).join('')}</ul></div>`;
  return `${list('この分析が成立する前提', v.assumptions, 'ok')}${list('成立しない・変わるケース', v.exceptions, 'ng')}${list('ゲームステートによる変化', v.gameState, 'gs')}${list('選手特性による変化', v.profiles, 'pp')}`;
}

function jumpNav() {
  const items = [
    ['qw', '3点'], ['attack', '攻撃'], ['defence', '守備'], ['sup', '優位'], ['interplay', '前進×プレス'], ['duels', 'キーバトル'], ['transition', '切替'], ['adjust', '修正'], ['setpiece', 'セットプレー'], ['validity', '前提'], ['src', '出典'],
  ];
  return `<nav class="jump" aria-label="セクションへ移動"><button class="jump-mode" data-act="dense" aria-pressed="false"><span class="dm-full">全文</span><span class="dm-key">要点のみ</span></button>${items.map(([id, l]) => `<button data-act="jump" data-target="sec-${id}">${l}</button>`).join('')}</nav>`;
}

export function renderMatchup(selfId, oppId, sceneId, opts) {
  const { entry, self } = getMatchup(selfId, oppId);
  const ctx = perspective(entry, self);
  const sid = entry.scenes.some((s) => s.id === sceneId) ? sceneId : defaultScene(entry);
  const status = matchupStatus(selfId, oppId);
  const head = header(selfId, oppId);

  const statusRow = `<div class="status-row">${statusChip(status)}<span class="muted">${
    status === 'analysis' ? `視点：${teamTag(self, ctx)}・更新 ${esc(entry.updated)}` : STATUS[status].long
  }</span></div>`;

  if (entry.status === 'stub') {
    return { head, main: renderStub(entry, ctx, sid, statusRow, opts), entry, self, sceneId: sid };
  }

  const opp = self === 'A' ? 'B' : 'A';
  const mech = entry.mechanisms;
  const attack = mech.filter((m) => m.attacker === self && m.phase !== 'transition');
  const defence = mech.filter((m) => m.attacker === opp && m.phase !== 'transition');
  const trLoss = mech.filter((m) => m.attacker === opp && m.phase === 'transition');
  const trWin = mech.filter((m) => m.attacker === self && m.phase === 'transition');

  const main = `<div class="mu" data-self="${self}">
    <div class="mu-viz">
      <section class="viz" id="viz" aria-label="噛み合わせ図">${renderViz(entry, self, sid, opts)}</section>
      <div class="summary">${statusRow}<p class="thesis"><span class="thesis-k">構図</span>${fmt(entry.thesis[self], ctx)}</p></div>
    </div>
    <div class="mu-text">
      ${quickWatch(entry, self, ctx)}
      ${jumpNav()}
      ${section('attack', '攻撃', '自チーム保持：優位・攻略ポイント・狙うスペース', attack.map((m) => mechCard(m, ctx)).join(''))}
      ${section('defence', '守備', '相手保持：噛み合わせ・プレス・リスク', defence.map((m) => mechCard(m, ctx)).join(''))}
      ${section('sup', '数的・位置的・質的優位とフリーマン', '', superiorityBlock(entry, ctx))}
      ${section('interplay', 'ビルドアップ × プレス', '第1ラインの人数とフリーマンの出どころ', interplayBlock(entry, ctx))}
      ${section('duels', 'キーバトル', 'SB・WB・WG／ピボット／ライン間', duelsBlock(entry, ctx))}
      ${section('transition', 'トランジションと残り守備', '', `${restBlock(entry, ctx)}
        <h3 class="sub-h">攻→守（自チームがボールを失った直後）</h3>${trLoss.map((m) => mechCard(m, ctx)).join('') || '<p class="muted">該当なし</p>'}
        <h3 class="sub-h">守→攻（自チームがボールを奪った直後）</h3>${trWin.map((m) => mechCard(m, ctx)).join('') || '<p class="muted">該当なし</p>'}`)}
      ${section('adjust', '相手の対応 → 再調整', '試合中の修正案', adjustBlock(entry, ctx))}
      ${section('setpiece', 'セットプレー', '', setPieceBlock(entry, ctx))}
      ${section('validity', '成立条件と例外', 'この分析が当てはまらないケース', validityBlock(entry, ctx))}
      ${section('src', '出典とエビデンス', '', `<p class="note">${evidenceChip('I')} は前提条件つきの構造的推論、${evidenceChip('P')} は指導者資料で共有される原則、${evidenceChip('F')} は出典で確認できる定義・研究知見。勝率や統計値は掲載していません。</p>${sourceLinks(entry.sources)}
        <p class="muted small">システム単体の解説：<a href="#sys.${esc(entry.teams.A)}">${esc(entry.teams.A)}</a>／<a href="#sys.${esc(entry.teams.B)}">${esc(entry.teams.B)}</a></p>`)}
    </div>
  </div>`;
  return { head, main, entry, self, sceneId: sid };
}

function renderStub(entry, ctx, sid, statusRow, opts) {
  const fS = formations[entry.teams.A];
  const fO = formations[entry.teams.B];
  const counts = nominalCounts(fS, fO);
  const related = new Set([...analysedOpponents(fS.id).map((o) => [fS.id, o]), ...analysedOpponents(fO.id).map((o) => [o, fO.id])].map((p) => p.join('|')));
  const relLinks = [...related].map((k) => {
    const [a, b] = k.split('|');
    return `<li><a href="#${matchupSlug(a, b)}">${esc(a)} vs ${esc(b)}</a></li>`;
  }).join('');
  const sideFacts = (f) => `<div class="stub-f"><h3><a href="#sys.${esc(f.id)}">${esc(f.id)}</a></h3><p>${esc(f.summary)}</p>
    <p class="small"><b>強み</b>${(f.strengths || []).map((s) => esc(s.title)).join('／')}</p>
    <p class="small"><b>弱み</b>${(f.weaknesses || []).map((s) => esc(s.title)).join('／')}</p></div>`;
  return `<div class="mu stub" data-self="A">
    <div class="mu-viz">
      <div class="banner" role="note"><b>この組み合わせの詳細分析は未整備です。</b>以下は公称配置の重ね合わせと人数の機械的な比較で、戦術的な分析ではありません。プレス方式や可変で人数関係は変わります。</div>
      <section class="viz" id="viz" aria-label="公称配置の重ね合わせ">${renderViz(entry, 'A', sid, opts)}</section>
      <div class="summary">${statusRow}</div>
    </div>
    <div class="mu-text">
      ${section('counts', '公称配置の人数比較', '自動算出・未検証', `<ul class="cnt-list">${counts
        .map((c) => `<li><span>${esc(c.label)}</span>${countText(c.a, c.b)}</li>`)
        .join('')}</ul><p class="note">公称配置の line（DF/MF/FW）と lane（中央/サイド）の登録値を数えただけの値です。実際の試合では保持・非保持の可変により変わります。</p>`)}
      ${section('each', '各システムの単体分析', 'システム単体として出典に基づく内容', `<div class="stub-grid">${sideFacts(fS)}${sideFacts(fO)}</div>`)}
      ${section('related', '関連する詳細分析', '', relLinks ? `<ul class="rel-list">${relLinks}</ul>` : '<p class="muted">なし</p>')}
    </div>
  </div>`;
}
