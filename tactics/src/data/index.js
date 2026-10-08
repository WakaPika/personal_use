// データの登録簿。新しいシステムやマッチアップはここに import して配列へ追加するだけで UI に反映される。
import f433 from './formations/f433.js';
import f442 from './formations/f442.js';
import f4231 from './formations/f4231.js';
import f4141 from './formations/f4141.js';
import f352 from './formations/f352.js';
import f532 from './formations/f532.js';
import { f3421, f343, f541 } from './formations/planned.js';

import m433_442 from './matchups/m433_442.js';
import m442_4231 from './matchups/m442_4231.js';
import m352_433 from './matchups/m352_433.js';
import m4231_4141 from './matchups/m4231_4141.js';
import m532_433 from './matchups/m532_433.js';
import m4141_352 from './matchups/m4141_352.js';

export { sources, sourceById } from './sources.js';
export { glossary, GLOSSARY_CATEGORIES } from './glossary.js';

export const formationList = [f433, f442, f4231, f4141, f352, f532, f3421, f343, f541];
export const formations = Object.fromEntries(formationList.map((f) => [f.id, f]));
export const activeFormations = formationList.filter((f) => f.status === 'analysis');

export const matchupList = [m433_442, m442_4231, m352_433, m4231_4141, m532_433, m4141_352].filter(Boolean);

const pairKey = (x, y) => `${x}|${y}`;
const byPair = new Map();
for (const m of matchupList) {
  byPair.set(pairKey(m.teams.A, m.teams.B), m);
  byPair.set(pairKey(m.teams.B, m.teams.A), m);
}

export function matchupSlug(selfId, oppId) {
  return `${selfId}_vs_${oppId}`;
}

/**
 * 自チーム・相手チームから表示用のマッチアップを返す。
 * 詳細分析があればその entity と視点（self = 'A' | 'B'）を、なければ機械的な stub を返す。
 */
export function getMatchup(selfId, oppId) {
  const m = byPair.get(pairKey(selfId, oppId));
  if (m) {
    const self = m.teams.A === selfId ? 'A' : 'B';
    return { entry: m, self };
  }
  return { entry: makeStub(selfId, oppId), self: 'A' };
}

export function matchupStatus(selfId, oppId) {
  const fs = formations[selfId];
  const fo = formations[oppId];
  if (!fs || !fo) return 'none';
  if (fs.status === 'planned' || fo.status === 'planned') return 'planned';
  return byPair.has(pairKey(selfId, oppId)) ? 'analysis' : 'stub';
}

/** 公称配置の人数比較（機械的カウント。戦術分析ではない） */
export function nominalCounts(fSelf, fOpp) {
  const count = (f, pred) => f.slots.filter(pred).length;
  const fw = (f) => count(f, (s) => s.line === 'FW');
  const df = (f) => count(f, (s) => s.line === 'DF');
  const cmf = (f) => count(f, (s) => s.line === 'MF' && s.lane === 'central');
  const wide = (f) => count(f, (s) => s.lane === 'wide' && s.line !== 'GK');
  return [
    { label: '自の最前線 vs 相手の最終ライン', a: fw(fSelf), b: df(fOpp) },
    { label: '中盤中央（公称のMF・中央レーン）', a: cmf(fSelf), b: cmf(fOpp) },
    { label: '自の最終ライン vs 相手の最前線', a: df(fSelf), b: fw(fOpp) },
    { label: '両サイドの選手（SB・WB・SH・WG）', a: wide(fSelf), b: wide(fOpp) },
  ];
}

function makeStub(selfId, oppId) {
  return {
    id: `stub:${selfId}_${oppId}`,
    teams: { A: selfId, B: oppId },
    status: 'stub',
    scenes: [
      {
        id: 'overview',
        tab: 'overview',
        poss: null,
        title: '{A} vs {B}：公称配置の重ね合わせ',
        short: '基本配置',
        caption: '各システムの基本配置を機械的に重ねた図です。保持・非保持の可変、プレス方式、マークの受け渡しは反映していません。',
        teams: { A: { from: 'base' }, B: { from: 'base' } },
        overlays: [],
        relax: true,
      },
    ],
  };
}

/** 詳細分析があるマッチアップの一覧（相手を問わず） */
export function analysedOpponents(fid) {
  return matchupList
    .filter((m) => m.teams.A === fid || m.teams.B === fid)
    .map((m) => (m.teams.A === fid ? m.teams.B : m.teams.A));
}
