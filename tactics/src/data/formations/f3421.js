export default {
  id: '3-4-2-1',
  status: 'analysis',
  family: 'back3',
  alias: '3CB＋WB＋ダブルボランチ＋2シャドー＋1トップ',
  summary:
    '3CB＋WB2枚＋ダブルボランチ＋2人のシャドー（10番）＋1トップ。保持では3-2-5で5レーンを埋め、2人のシャドーがハーフスペースを占有する。非保持は5-4-1で低く守るか、5-2-3で前から寄せる。論点はボランチ2枚の脇とWBの上下動の負荷。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LCB', label: 'CB', name: '左CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'CB', label: 'CB', name: '中央CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'LWB', label: 'WB', name: '左WB', line: 'MF', lane: 'wide' },
    { id: 'LDM', label: 'DM', name: '左ボランチ', line: 'MF', lane: 'central' },
    { id: 'RDM', label: 'DM', name: '右ボランチ', line: 'MF', lane: 'central' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'MF', lane: 'wide' },
    { id: 'LAM', label: '10', name: '左シャドー', line: 'FW', lane: 'central' },
    { id: 'RAM', label: '10', name: '右シャドー', line: 'FW', lane: 'central' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 3-4-2-1',
      note: '公称配置。2人のシャドーが1トップの下、ハーフスペースに立つ。',
      pos: { GK: [50, 4], LCB: [29, 19], CB: [50, 16], RCB: [71, 19], LWB: [9, 45], LDM: [40, 37], RDM: [60, 37], RWB: [91, 45], LAM: [33, 60], RAM: [67, 60], ST: [50, 71] },
    },
    {
      id: 'ip.325',
      label: '保持 3-2-5',
      note: 'WBが最前線の大外、シャドーがハーフスペース、CFが中央で前線5枚。後方は3CB＋ボランチ2枚の3+2。',
      pos: { GK: [50, 6], LCB: [26, 20], CB: [50, 16], RCB: [74, 20], LDM: [40, 34], RDM: [60, 34], LWB: [6, 72], LAM: [32, 70], ST: [50, 78], RAM: [68, 70], RWB: [94, 72] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 5-2-3',
      note: 'CF＋シャドー2人の前線3枚が内側から寄せ、外へ誘導。ボールサイドのWBが相手SB・WBへジャンプする。',
      pos: { GK: [50, 8], LWB: [12, 52], LCB: [32, 36], CB: [50, 33], RCB: [68, 36], RWB: [88, 52], LDM: [40, 54], RDM: [60, 54], LAM: [34, 78], ST: [50, 84], RAM: [66, 78] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 5-4-1',
      note: 'シャドーが中盤の大外へ下がり、5バック＋中盤4枚の2列。CFは1人で相手のビルドアップを外へ誘導する。',
      pos: { GK: [50, 5], LWB: [10, 26], LCB: [31, 23], CB: [50, 21], RCB: [69, 23], RWB: [90, 26], LAM: [18, 44], LDM: [40, 40], RDM: [60, 40], RAM: [82, 44], ST: [50, 58] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 5-4-1',
      note: 'PA幅を5枚、その前を4枚で埋める。カウンターの出口はCF1人と、走り出すシャドー。',
      pos: { GK: [50, 3], LWB: [12, 14], LCB: [31, 11], CB: [50, 10], RCB: [69, 11], RWB: [88, 14], LAM: [20, 28], LDM: [40, 26], RDM: [60, 26], RAM: [80, 28], ST: [50, 44] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 3, text: 'WBが最前線の大外まで上がれば、5レーンすべてに選手がいる。' },
    { key: 'depth', label: '深さ（段差）', level: 3, text: '3CB・ボランチ・シャドー・CFの4列。' },
    { key: 'central', label: '中央密度', level: 2, text: 'ボランチ2枚＋シャドー2人。シャドーが高いと中盤は2枚。' },
    { key: 'buildup', label: '第1ライン', value: '3CB＋2ボランチ', text: '3-2の5枚。相手2トップには+3、前線3枚にもGK込みで+1。' },
    { key: 'press', label: '第1プレス', value: 'CF＋2シャドー', text: '5-2-3で内側から寄せて外へ誘導。' },
    { key: 'rest', label: '残り守備', value: '3CB＋2ボランチ（3+2）', text: '前線5枚で攻めても後方に5枚残る。' },
  ],
  phases: {
    buildUp:
      '3CB＋ボランチ2枚の3-2で第1・第2ラインを作る。相手が2トップなら後方は大きな数的優位で、外CBが運べる。相手が前線3枚で来てもGKを加えれば4v3。',
    progression:
      'シャドーがハーフスペース（相手のSBとCBの間、MFラインの背後）で受ける。WBが大外で相手SBをピン留めし、外CBの持ち運びかボランチの縦パスでシャドーへ。',
    finalThird:
      '3-2-5で前線5枚。WBが大外、シャドーがハーフスペースのポケット、CFが中央。相手の4バックに対して5v4を作りやすい。',
    highPress:
      '5-2-3。CFとシャドーが内側から寄せて相手を外へ誘導し、ボールサイドのWBが前へジャンプ。ボランチ2枚は中央を締める。',
    midBlock:
      '5-4-1。シャドーが中盤の大外まで下がり、2列で守る。CFは1人で相手のビルドアップを片側へ追い込む。',
    lowBlock:
      '5-4-1でPA前を2列で埋める。カウンターの出口がCF1人になりやすく、シャドーの走り出しが鍵。',
    attTransition:
      'CF＋シャドー2人の3人が出口。シャドーは相手SBの背後や中盤の脇へ斜めに走る。',
    defTransition:
      '3CB＋ボランチ2枚の5枚が後方に残るため、中央の即時奪回と背後のカバーを両立しやすい。WBの背後は外CBがスライドして守る。',
    restDefence:
      '3+2が基本。前線5枚で攻めても後方に5枚残り、相手の1〜2トップに数的優位を保てる。',
  },
  roles: [
    { slot: 'LAM', title: 'シャドー（10番）', text: 'ハーフスペースで受け、前を向いてCFやWBとつながる。CFと入れ替わって背後へ走る。非保持では5-4-1の中盤の大外、または5-2-3の前線へ。' },
    { slot: 'LWB', title: 'WB', text: '保持では最前線の大外で幅を取り、非保持では5バックの一角。上下動の負荷が最も大きい。' },
    { slot: 'LDM', title: 'ボランチ（2枚）', text: '3CBの前で配球し、シャドーへの縦パスを入れる。非保持では中央を2枚で守る。脇（大外寄りの中盤）が空きやすい。' },
    { slot: 'ST', title: 'CF（1トップ）', text: 'CBを引き付けてシャドーの受けるスペースを作る。非保持では相手のビルドアップを片側に追い込むか、中央のコースを消す。' },
    { slot: 'LCB', title: '外CB', text: '持ち運びで前進を始め、WBの背後をカバーする。' },
    { slot: 'CB', title: '中央CB', text: 'ラインの統率とCFへの対応。' },
    { slot: 'GK', title: 'GK', text: '相手が前線3枚で寄せたときの+1。' },
  ],
  strengths: [
    { title: 'ハーフスペースの2人', why: '2人のシャドーが相手のSBとCBの間に常駐し、4バックの相手には誰が見るかの判断を迫る。', sources: ['cv-343', 'cv-4321', 'sv-halfspace'] },
    { title: '3+2の残り守備', why: '前線5枚で攻めても、3CB＋ボランチ2枚が後方に残る。', sources: ['cv-3241', 'cv-restdef'] },
    { title: '5-2-3と5-4-1の切替', why: 'シャドーが前線に残れば5-2-3で前から、下がれば5-4-1で低く守れる。', sources: ['cv-3241', 'cv-glasner'] },
    { title: '5レーンの占有', why: 'WBが大外、シャドーがハーフスペース、CFが中央で、前線の5レーンを埋めやすい。', sources: ['cv-343'] },
  ],
  weaknesses: [
    { title: 'ボランチ2枚の脇', why: '中盤中央が2枚なので、相手の3センターやトップ下に対して数的不利になりやすく、ボランチの脇が空く。', sources: ['cv-3241', 'cv-343'] },
    { title: 'WBの負荷と背後', why: 'WB1人で大外を上下するため、高い位置で失うと背後のスペースを外CBが1人で守ることになる。', sources: ['cv-343', 'cv-wingbacks'] },
    { title: '5-4-1でのCFの孤立', why: '低く守るとシャドーが中盤の大外まで下がり、カウンターの出口がCF1人になる。', sources: ['cv-3241'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.325', label: '3-2-5', text: 'WBが最前線、シャドーがハーフスペース、CFが中央。' },
      { label: '2-3-5（外CBの上がり）', text: '外CBの1人がボランチの横へ上がり、中盤を3枚にする。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス 5-2-3', text: 'CF＋シャドーで内側から寄せ、WBがジャンプ。' },
      { shape: 'oop.mid', label: 'ミドル 5-4-1', text: 'シャドーが中盤の大外へ下がる。' },
      { shape: 'oop.low', label: 'ロー 5-4-1', text: 'PA前を2列で埋める。' },
    ],
  },
  sources: ['cv-343', 'cv-3241', 'cv-4321', 'cv-glasner', 'cv-wingbacks', 'cv-restdef', 'sv-halfspace', 'tierney2016'],
};
