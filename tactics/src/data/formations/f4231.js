export default {
  id: '4-2-3-1',
  status: 'analysis',
  family: 'back4',
  alias: 'ダブルボランチ＋トップ下＋1トップ',
  summary:
    'ダブルボランチ（2ピボット）＋トップ下（10番）＋1トップ。2枚のボランチで中央と残り守備を安定させ、10番がライン間で受ける。非保持では10番が上がって4-4-2や4-4-1-1になりやすい。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LB', label: 'SB', name: '左SB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
    { id: 'RB', label: 'SB', name: '右SB', line: 'DF', lane: 'wide' },
    { id: 'LDM', label: 'DM', name: '左ボランチ', line: 'MF', lane: 'central' },
    { id: 'RDM', label: 'DM', name: '右ボランチ', line: 'MF', lane: 'central' },
    { id: 'LM', label: 'SH', name: '左SH', line: 'MF', lane: 'wide' },
    { id: 'AM', label: '10', name: 'トップ下（10番）', line: 'MF', lane: 'central' },
    { id: 'RM', label: 'SH', name: '右SH', line: 'MF', lane: 'wide' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 4-2-3-1',
      note: '公称配置。DF4・ボランチ2・2列目3・1トップの4列。',
      pos: { GK: [50, 4], LB: [15, 24], LCB: [37, 18], RCB: [63, 18], RB: [85, 24], LDM: [39, 36], RDM: [61, 36], LM: [16, 57], AM: [50, 55], RM: [84, 57], ST: [50, 70] },
    },
    {
      id: 'ip.2413',
      label: '保持 2-4-1-3',
      note: '両SBがボランチと同じ高さへ。SHは内側寄りの高い位置、10番はライン間。',
      pos: { GK: [50, 6], LCB: [34, 20], RCB: [66, 20], LB: [12, 44], LDM: [40, 36], RDM: [60, 36], RB: [88, 44], AM: [50, 60], LM: [22, 72], ST: [50, 78], RM: [78, 72] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 4-4-2',
      note: '10番がCFの横へ上がって第1ラインを2枚に。SHは相手SB、ボランチは相手中盤へ。',
      pos: { GK: [50, 9], LB: [16, 42], LCB: [38, 36], RCB: [62, 36], RB: [84, 42], LDM: [40, 56], RDM: [60, 56], LM: [18, 66], RM: [82, 66], AM: [42, 80], ST: [58, 83] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 4-4-1-1',
      note: '10番がCFの下で相手ピボットを見る。SHが下がって中盤4枚。',
      pos: { GK: [50, 5], LB: [16, 26], LCB: [39, 24], RCB: [61, 24], RB: [84, 26], LM: [18, 43], LDM: [40, 40], RDM: [60, 40], RM: [82, 43], AM: [50, 53], ST: [50, 64] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 4-4-1-1',
      note: '2列を低く構え、CFは高めに残してカウンターの起点にする。',
      pos: { GK: [50, 3], LB: [18, 14], LCB: [39, 12], RCB: [61, 12], RB: [82, 14], LM: [19, 28], LDM: [40, 26], RDM: [60, 26], RM: [81, 28], AM: [50, 38], ST: [50, 50] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 2, text: 'SHとSBで幅を分担。SHが内側に入るとSBが大外。' },
    { key: 'depth', label: '深さ（段差）', level: 3, text: 'DF・ボランチ・2列目・CFの4列で段差が大きい。' },
    { key: 'central', label: '中央密度', level: 3, text: 'ボランチ2＋10番。逆SHが絞ればさらに増える。' },
    { key: 'buildup', label: '第1ライン', value: '2CB＋2DM', text: 'ボックス型。相手1トップならボランチが前向きになりやすい。' },
    { key: 'press', label: '第1プレス', value: 'CF＋10', text: '10番が上がれば4-4-2の第1ライン。' },
    { key: 'rest', label: '残り守備', value: '2CB＋2DM（2+2）', text: '両SBを同時に上げやすい。' },
  ],
  phases: {
    buildUp:
      '2CB＋2ボランチの4枚で第1・第2ラインを作る。相手が1トップなら、ボランチのどちらかが前向きでフリーになりやすい。',
    progression:
      '10番が相手MFラインの背後（ライン間）で受け、SHは内と外を使い分ける。ボランチの片方が前進して8番化すると中盤3枚になる。',
    finalThird:
      'SH＋10番＋CFの4人で最終ライン前を攻め、SBが大外を取る。1トップはPA内の人数が少なくなりやすく、逆SHのファー侵入が鍵。',
    highPress:
      '10番が1列上がって4-4-2化。CFがCBへ寄せ、10番は相手ピボットを背中で消すか捕まえる。',
    midBlock:
      '4-4-1-1。逆サイドのSHが絞って中央に1枚加える。ボランチがCB前を守り、片方が前に出て10番やSHとプレスする。',
    lowBlock:
      '4-5-1や4-4-1-1で低く守り、1トップは高めに残してカウンターの起点にする。',
    attTransition:
      '10番＋SH＋CFの3人が速い出口。1トップへの縦パスと、10番のサポートの距離が鍵。',
    defTransition:
      '2枚のボランチが即座に中央を保護し、2CBと合わせた4枚で残り守備を作る。',
    restDefence:
      '2CB＋2ボランチの2+2を作りやすく、両SBを同時に上げやすい。',
  },
  roles: [
    { slot: 'AM', title: '10番（トップ下）', text: 'ライン間の受け手。非保持では最も位置を変える選手で、上がって第1ラインに入るか、下がって相手ピボットを見る。' },
    { slot: 'LDM', title: 'ボランチ（2ピボット）', text: '2枚で横幅を分担し、片方が前、片方が残る。CB前のスペースを守り、SBの前進を支える。' },
    { slot: 'LM', title: 'SH', text: '保持時は内側のポケットと大外を使い分け、非保持は相手SBへの対応。' },
    { slot: 'ST', title: 'CF（1トップ）', text: '背負う・裏へ抜ける・プレスを始める。CB2枚に対して孤立しやすい。' },
    { slot: 'LB', title: 'SB', text: 'ボランチ2枚の保護があるため、両SBが同時に上がりやすい。' },
    { slot: 'LCB', title: 'CB', text: '相手1トップには+1。ボランチとの4枚で前進の土台を作る。' },
    { slot: 'GK', title: 'GK', text: '4枚のビルドアップに加わって+1を作る。' },
  ],
  strengths: [
    { title: '2+2で中央が安定', why: 'ボランチ2枚がCB前を守るため、両SBの同時前進やボールロスト後の中央保護がしやすい。', sources: ['cv-4231', 'cv-doublepivot'] },
    { title: 'ライン間の10番', why: '相手MFラインの背後に常駐する受け手がいるので、縦パス1本で前進できる。', sources: ['cv-4231'] },
    { title: '4-4-2への切替が速い', why: '10番が1列上がるだけで第1ラインが2枚になり、ハイプレスへ移行できる。', sources: ['cv-4231'] },
  ],
  weaknesses: [
    { title: '1トップの孤立', why: '相手CB2枚に対してCFが1人。10番やSHの距離が遠いと起点を作れない。', sources: ['cv-4231'] },
    { title: '10番が高すぎると中盤で数的不利', why: '非保持で10番が戻らないと、ボランチ2枚 vs 相手の中盤3枚になる。', sources: ['cv-4231'] },
    { title: 'ボランチの横並び', why: '2枚が同じ高さに並ぶと、片方が釣り出された瞬間に背後のスペースが広がる。', sources: ['cv-doublepivot'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.2413', label: '2-4-1-3', text: '両SBがボランチと同じ高さへ。SHは内側、10番はライン間。' },
      { label: '3-2-4-1（片SB残し）', text: '片SBが残って3バック化。SHと10番、CFで前線を厚くする。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス 4-4-2', text: '10番がCFの横へ上がる。' },
      { shape: 'oop.mid', label: 'ミドル 4-4-1-1', text: '10番が相手ピボット番。' },
      { shape: 'oop.low', label: 'ロー 4-4-1-1', text: 'CFは高めに残してカウンター要員。' },
    ],
  },
  sources: ['cv-4231', 'cv-4231-key', 'cv-doublepivot', 'tierney2016'],
};
