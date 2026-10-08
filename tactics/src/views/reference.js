// 用語集と出典・方法論ページ
import { glossary, GLOSSARY_CATEGORIES, sources, sourceById } from '../data/index.js';
import { SOURCE_TYPES } from '../data/sources.js';
import { EVIDENCE, STATUS } from '../data/schema.js';
import { esc } from '../lib/text.js';
import { sourceLinks, evidenceChip, statusChip, icon } from '../lib/ui.js';

const LANG = { de: '独', es: '西', it: '伊', pt: '葡' };

export function renderGlossary(state) {
  const cat = state.glossaryCat || 'all';
  const q = (state.glossaryQ || '').trim().toLowerCase();
  const list = glossary.filter((t) => {
    if (cat !== 'all' && t.cat !== cat) return false;
    if (!q) return true;
    const hay = [t.ja, t.en, ...(t.aliases || []), ...Object.values(t.i18n || {}), t.short].join(' ').toLowerCase();
    return hay.includes(q);
  });
  const chips = [{ id: 'all', label: 'すべて' }, ...GLOSSARY_CATEGORIES]
    .map((c) => `<button class="pill-btn${c.id === cat ? ' on' : ''}" aria-pressed="${c.id === cat}" data-act="gcat" data-cat="${c.id}">${esc(c.label)}${c.en ? `<small>${esc(c.en)}</small>` : ''}</button>`)
    .join('');
  const term = (t) => {
    const i18n = t.i18n ? Object.entries(t.i18n).map(([k, v]) => `<span class="i18n"><i>${LANG[k] || k}</i>${esc(v)}</span>`).join('') : '';
    const rel = (t.related || [])
      .map((r) => glossary.find((g) => g.id === r))
      .filter(Boolean)
      .map((g) => `<button class="link-btn" data-act="gterm" data-term="${g.id}">${esc(g.ja)}</button>`)
      .join('');
    return `<li class="term" id="term-${t.id}"><div class="term-h"><h3>${esc(t.ja)}</h3><span class="term-en">${esc(t.en)}</span></div>
      ${t.aliases?.length ? `<p class="aliases">別名：${t.aliases.map(esc).join('、')}</p>` : ''}
      ${i18n ? `<p class="i18n-row">${i18n}</p>` : ''}
      <p class="term-s">${esc(t.short)}</p>
      <details><summary>詳しく</summary><p>${esc(t.long)}</p>
        ${t.provider ? `<p class="provider"><b>${esc(t.provider.label)} の定義</b>${esc(t.provider.text)}</p>` : ''}
        ${rel ? `<p class="rel">関連：${rel}</p>` : ''}${sourceLinks(t.sources)}</details></li>`;
  };
  return {
    head: `<header class="pbar" role="banner"><div class="pbar-t"><b>用語集</b><span>${glossary.length}語・8分類</span></div></header>`,
    main: `<div class="page">
      <div class="g-tools"><label class="search">${icon.search}<span class="sr">用語を検索</span><input id="g-search" type="search" inputmode="search" autocomplete="off" placeholder="例：ハーフスペース、Rest defence、Halbraum" value="${esc(state.glossaryQ || '')}"></label>
      <div class="pills wrap" role="group" aria-label="分類">${chips}</div></div>
      <ul class="terms" id="g-list">${list.map(term).join('') || '<li class="muted">該当する用語はありません。</li>'}</ul>
    </div>`,
  };
}

export function renderSources() {
  const groups = Object.entries(SOURCE_TYPES).sort((a, b) => a[1].tier - b[1].tier);
  const srcList = groups
    .map(([type, meta]) => {
      const items = sources.filter((s) => s.type === type);
      if (!items.length) return '';
      return `<h3 class="sub-h">${esc(meta.label)}<small>優先度 ${meta.tier}</small></h3><ul class="src-list">${items
        .map(
          (s) => `<li><div class="src-h">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : `<b>${esc(s.title)}</b>`}</div>
          <div class="src-m"><span>${esc(s.by)}${s.year ? `（${s.year}）` : ''}${s.venue ? ` ${esc(s.venue)}` : ''}</span><span class="chip lang">${esc(s.lang)}</span><span class="chip acc acc-${s.access}">${s.access === 'verified' ? '存在確認済' : '書誌のみ'}</span></div>
          <p>${esc(s.note)}</p></li>`,
        )
        .join('')}</ul>`;
    })
    .join('');
  const qa = [
    'システムだけを根拠に戦い方を断定していない（Formation ≠ Game model）',
    '保持と非保持を区別している',
    '「3v2」などの人数を図で実際に数えている',
    '中央・幅・ハーフスペース・背後のどこかを明示している',
    'いつ起きるか（トリガー・前提条件）がある',
    '前提条件 → 選手配置 → 現象 → 狙い → 相手の対策 の因果でつながっている',
    '相手の対策と、それに対する再調整がある',
    '攻→守と守→攻がある',
    'セットプレーを別の局面として扱っている',
    '選手特性とゲームステートによる変化を書いている',
    '出典・原則・推論を区別している。「必ず」「絶対」を使わない',
    '実データに基づかない勝率・統計値を載せない',
  ];
  return {
    head: `<header class="pbar" role="banner"><div class="pbar-t"><b>出典・方法</b><span>エビデンスと品質基準</span></div></header>`,
    main: `<div class="page">
      <section class="sec"><h2 class="sec-h">このサイトの読み方</h2>
        <p>フォーメーションの名前だけで優劣は決まりません。位置データの研究でも、集団の戦術行動はポジション、数的関係、課題の条件などで変わることが整理されています。本サイトはシステム同士の噛み合わせを「前提条件つきの構造」として示します。</p>
        <ul class="ev-legend">${Object.entries(EVIDENCE).map(([k, e]) => `<li>${evidenceChip(k)}<span>${esc(e.long)}</span></li>`).join('')}</ul>
        <ul class="ev-legend">${Object.keys(STATUS).map((k) => `<li>${statusChip(k)}<span>${esc(STATUS[k].long)}</span></li>`).join('')}</ul>
        ${sourceLinks(['low2020', 'uefa-observers-2122'])}
      </section>
      <section class="sec"><h2 class="sec-h">戦術QAチェックリスト</h2><p class="note">詳細分析（β）はすべてこの基準で作成しています。人間の専門家によるレビューと実試合データでの検証は未実施です。</p><ul class="qa">${qa.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
      <section class="sec"><h2 class="sec-h">表示設定</h2><div class="theme-row"><span>テーマ</span><button class="sm-btn" data-act="theme">ダーク／屋外向けライトを切り替え</button></div></section>
      <section class="sec"><h2 class="sec-h">参照資料</h2><p class="note">2026年10月時点のWeb検索で資料の存在とURLを確認しました。制作環境の制約で個別ページは直接取得できず、内容は検索結果の抜粋で照合しています。「書誌のみ」はリンク先に到達できなかった資料です。</p>${srcList}</section>
    </div>`,
  };
}

export { sourceById };
