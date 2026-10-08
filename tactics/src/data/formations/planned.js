// 拡張予定のシステム。基本配置だけを登録し、分析コンテンツは未作成（status: 'planned'）。
// 分析を追加するときは f433.js と同じ構造でファイルを作り、status を 'analysis' にする。

const back3 = [
  { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
  { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
  { id: 'CB', label: 'CB', name: '中央CB', line: 'DF', lane: 'central' },
  { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
];

export const f3421 = {
  id: '3-4-2-1',
  status: 'planned',
  family: 'back3',
  alias: '3バック＋2シャドー＋1トップ',
  summary: '3CB＋WB＋ダブルボランチ＋2シャドー＋1トップ。分析は準備中。',
  slots: [
    ...back3,
    { id: 'LWB', label: 'WB', name: '左WB', line: 'MF', lane: 'wide' },
    { id: 'LDM', label: 'DM', name: '左ボランチ', line: 'MF', lane: 'central' },
    { id: 'RDM', label: 'DM', name: '右ボランチ', line: 'MF', lane: 'central' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'MF', lane: 'wide' },
    { id: 'LAM', label: '10', name: '左シャドー', line: 'FW', lane: 'central' },
    { id: 'RAM', label: '10', name: '右シャドー', line: 'FW', lane: 'central' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    { id: 'base', label: '基本配置 3-4-2-1', note: '公称配置。', pos: { GK: [50, 4], LCB: [29, 19], CB: [50, 16], RCB: [71, 19], LWB: [9, 45], LDM: [40, 37], RDM: [60, 37], RWB: [91, 45], LAM: [33, 60], RAM: [67, 60], ST: [50, 71] } },
  ],
  sources: [],
};

export const f343 = {
  id: '3-4-3',
  status: 'planned',
  family: 'back3',
  alias: '3バック＋中盤4枚＋3トップ',
  summary: '3CB＋WB＋2CM＋3トップ。分析は準備中。',
  slots: [
    ...back3,
    { id: 'LWB', label: 'WB', name: '左WB', line: 'MF', lane: 'wide' },
    { id: 'LCM', label: 'CM', name: '左CM', line: 'MF', lane: 'central' },
    { id: 'RCM', label: 'CM', name: '右CM', line: 'MF', lane: 'central' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'MF', lane: 'wide' },
    { id: 'LW', label: 'WG', name: '左WG', line: 'FW', lane: 'wide' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
    { id: 'RW', label: 'WG', name: '右WG', line: 'FW', lane: 'wide' },
  ],
  shapes: [
    { id: 'base', label: '基本配置 3-4-3', note: '公称配置。', pos: { GK: [50, 4], LCB: [29, 19], CB: [50, 16], RCB: [71, 19], LWB: [9, 45], LCM: [40, 38], RCM: [60, 38], RWB: [91, 45], LW: [20, 65], ST: [50, 70], RW: [80, 65] } },
  ],
  sources: [],
};

export const f541 = {
  id: '5-4-1',
  status: 'planned',
  family: 'back3',
  alias: '5バック＋中盤4枚＋1トップ',
  summary: '5バック＋中盤4枚＋1トップ。分析は準備中。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LWB', label: 'WB', name: '左WB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
    { id: 'CB', label: 'CB', name: '中央CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'DF', lane: 'wide' },
    { id: 'LM', label: 'SH', name: '左SH', line: 'MF', lane: 'wide' },
    { id: 'LCM', label: 'CM', name: '左CM', line: 'MF', lane: 'central' },
    { id: 'RCM', label: 'CM', name: '右CM', line: 'MF', lane: 'central' },
    { id: 'RM', label: 'SH', name: '右SH', line: 'MF', lane: 'wide' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    { id: 'base', label: '基本配置 5-4-1', note: '公称配置。', pos: { GK: [50, 4], LWB: [10, 24], LCB: [30, 17], CB: [50, 15], RCB: [70, 17], RWB: [90, 24], LM: [15, 44], LCM: [39, 40], RCM: [61, 40], RM: [85, 44], ST: [50, 62] } },
  ],
  sources: [],
};
