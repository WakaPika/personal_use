export default {
  id: '4-1-4-1',
  status: 'analysis',
  family: 'back4',
  alias: '単独の6番＋4枚の中盤＋1トップ',
  summary:
    '4バックの前に単独の6番、その前に中盤4枚と1トップ。中央を5枚で締めるコンパクトさが武器で、長い保持では4-3-3に近づく。典型的な課題は6番の脇と1トップの孤立。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LB', label: 'SB', name: '左SB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
    { id: 'RB', label: 'SB', name: '右SB', line: 'DF', lane: 'wide' },
    { id: 'DM', label: '6', name: '6番（アンカー）', line: 'MF', lane: 'central' },
    { id: 'LM', label: 'SH', name: '左SH', line: 'MF', lane: 'wide' },
    { id: 'LCM', label: '8', name: '左8番', line: 'MF', lane: 'central' },
    { id: 'RCM', label: '8', name: '右8番', line: 'MF', lane: 'central' },
    { id: 'RM', label: 'SH', name: '右SH', line: 'MF', lane: 'wide' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 4-1-4-1',
      note: '公称配置。6番の前に中盤4枚が横に並ぶ。',
      pos: { GK: [50, 4], LB: [15, 24], LCB: [37, 18], RCB: [63, 18], RB: [85, 24], DM: [50, 33], LM: [15, 49], LCM: [37, 48], RCM: [63, 48], RM: [85, 49], ST: [50, 67] },
    },
    {
      id: 'ip.235',
      label: '保持 2-3-5（4-3-3化）',
      note: 'SHが前線の大外へ、8番がハーフスペースへ。長い保持では4-3-3とほぼ同じ形になる。',
      pos: { GK: [50, 6], LCB: [33, 20], RCB: [67, 20], LB: [14, 40], DM: [50, 35], RB: [86, 40], LM: [7, 72], LCM: [32, 65], ST: [50, 76], RCM: [68, 65], RM: [93, 72] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 4-4-2化',
      note: '片方の8番がCFの横へ上がって第1ラインを2枚にする。6番ともう一方の8番が中盤中央。',
      pos: { GK: [50, 9], LB: [16, 42], LCB: [38, 36], RCB: [62, 36], RB: [84, 42], DM: [44, 54], RCM: [62, 60], LM: [18, 64], RM: [82, 64], LCM: [40, 80], ST: [60, 83] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 4-1-4-1',
      note: '6番がCB前、中盤4枚が横に並んで幅を守る。CFは相手CBへ寄せるか、ピボットを背中で消す。',
      pos: { GK: [50, 5], LB: [16, 26], LCB: [39, 24], RCB: [61, 24], RB: [84, 26], DM: [50, 35], LM: [16, 47], LCM: [38, 47], RCM: [62, 47], RM: [84, 47], ST: [50, 61] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 4-5-1',
      note: 'SHがSBと組んで大外の2v1を防ぐ。中盤5枚でPA前を埋める。',
      pos: { GK: [50, 3], LB: [19, 14], LCB: [40, 12], RCB: [60, 12], RB: [81, 14], DM: [50, 24], LM: [18, 29], LCM: [37, 31], RCM: [63, 31], RM: [82, 29], ST: [50, 45] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 3, text: 'SHが大外を担当。保持時は4-3-3化して前線の幅を取る。' },
    { key: 'depth', label: '深さ（段差）', level: 2, text: '6番が1枚だけ下がって段差を作る。中盤4枚は同じ高さに並びやすい。' },
    { key: 'central', label: '中央密度', level: 3, text: '6番＋8番2枚。SHが絞れば中盤ラインは5枚。' },
    { key: 'buildup', label: '第1ライン', value: '2CB＋6', text: '8番の1枚が降りて一時的な2ピボットも作れる。' },
    { key: 'press', label: '第1プレス', value: 'CF（＋8番）', text: '8番のジャンプで第1ラインを2枚にする。' },
    { key: 'rest', label: '残り守備', value: '2CB＋6（2+1）', text: '片SBを残せば3+1。' },
  ],
  phases: {
    buildUp:
      '2CB＋6番で第1ラインを作る。8番の1枚が降りて一時的な2ピボットを作ることもある。',
    progression:
      '8番がSHの内側を走るか、10番の位置に絞って受ける。SHは開始位置が低いため、ドリブルと持ち運びで前進する役割が大きい。',
    finalThird:
      '長い保持では4-3-3化してSHが大外、8番がハーフスペースからPAへ侵入する。',
    highPress:
      'CFが相手CBへ寄せて外へ誘導するか、相手ピボットへのコースを消す。8番がジャンプしてCFを助け、ボールを片側に閉じ込める。',
    midBlock:
      '4-1-4-1の基本形。6番がCB前を一人でスクリーンし、SHは絞って中盤を助けつつ相手SBの上がりを追う。',
    lowBlock:
      '4-5-1。SHがSBとペアになって大外の2v1を防ぎ、タッチラインを守備に使う。',
    attTransition:
      'SHがカウンターの主な出口。ただし開始位置が深いため運ぶ距離が長く、CFの孤立を防ぐサポートが課題。',
    defTransition:
      '6番が中央の最初のスクリーン。8番とSHは素早く4-1-4-1の位置へ戻る。',
    restDefence:
      '2CB＋6番（＋片SB）。4-3-3と同じく両SBを上げると2+1になる。',
  },
  roles: [
    { slot: 'DM', title: '6番', text: 'CB前のスペースを一人でスクリーンし、デュエルとインターセプトで守る。脇を空けないための横移動量が大きい。' },
    { slot: 'LCM', title: '8番', text: 'ジャンプしてCFのプレスを助け、保持ではハーフスペースで受けてPAへ入る。' },
    { slot: 'LM', title: 'SH', text: '絞って中盤を助け、相手SBの上がりを追う。外へ追い出してタッチラインを守備に使う。' },
    { slot: 'ST', title: 'CF', text: '相手CBへ寄せて外へ誘導するか、下がってピボットを消す。保持では数的に孤立しやすい。' },
    { slot: 'LCB', title: 'CB', text: '6番の保護でカバーに専念できるが、相手CFへの縦パスには前へ出て潰す。' },
    { slot: 'LB', title: 'SB', text: 'SHとペアで大外を守る。保持では高い幅役。' },
    { slot: 'GK', title: 'GK', text: 'ビルドアップの+1。' },
  ],
  strengths: [
    { title: '中央5枚のコンパクトさ', why: '6番＋中盤4枚で中央とハーフスペースを同時に埋め、相手の中央突破を難しくする。', sources: ['cv-4141'] },
    { title: '6番がライン間を保護', why: '単独の6番がCB前の広いスペースを担当し、相手の受け手を前向きにさせない。', sources: ['cv-4141'] },
    { title: 'SH＋SBのペアで大外を守る', why: '大外で2v1を作られにくく、タッチラインを使って外へ追い出せる。', sources: ['cv-4141'] },
  ],
  weaknesses: [
    { title: '6番の脇', why: '8番がジャンプすると6番が1人で横幅を守ることになり、脇のハーフスペースが空く。', sources: ['cv-4141'] },
    { title: '1トップの孤立', why: '前線が1人なので、相手の第1ラインに対して常に数的不利。8番のジャンプが遅れるとプレスがかからない。', sources: ['cv-4141'] },
    { title: 'SHの攻撃出力が下がる', why: 'SHが深く守るため、奪った後に前線まで運ぶ距離が長い。', sources: ['cv-4141'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.235', label: '2-3-5（4-3-3化）', text: 'SHが前線の大外、8番がハーフスペースへ。' },
      { label: '8番降り（一時的な2ピボット）', text: '8番の1枚が6番の横へ降りてビルドアップを助ける。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス 4-4-2化', text: '8番の1枚がCFの横へ。' },
      { shape: 'oop.mid', label: 'ミドル 4-1-4-1', text: '6番がCB前、中盤4枚で幅。' },
      { shape: 'oop.low', label: 'ロー 4-5-1', text: 'SHとSBのペアで大外を守る。' },
    ],
  },
  sources: ['cv-4141', 'cv-451', 'cv-433'],
};
