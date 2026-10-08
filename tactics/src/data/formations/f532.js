export default {
  id: '5-3-2',
  status: 'analysis',
  family: 'back3',
  alias: 'WBが低い5バック基準形',
  summary:
    '3-5-2と同じ人員で、WBの開始位置が低い5バック基準形。PA幅を5枚＋中盤3枚で守り、2トップを出口にする。保持時にWBを上げて3-5-2へ移行できるかが攻撃の質を決める。',
  phaseOf: '3-5-2',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LWB', label: 'WB', name: '左WB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'CB', label: 'CB', name: '中央CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'DF', lane: 'wide' },
    { id: 'LCM', label: '8', name: '左8番', line: 'MF', lane: 'central' },
    { id: 'DM', label: '6', name: '6番', line: 'MF', lane: 'central' },
    { id: 'RCM', label: '8', name: '右8番', line: 'MF', lane: 'central' },
    { id: 'LS', label: 'CF', name: '左CF', line: 'FW', lane: 'central' },
    { id: 'RS', label: 'CF', name: '右CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 5-3-2',
      note: '公称配置。WBが最終ラインの高さに並ぶ。',
      pos: { GK: [50, 4], LWB: [10, 26], LCB: [30, 18], CB: [50, 16], RCB: [70, 18], RWB: [90, 26], LCM: [31, 41], DM: [50, 37], RCM: [69, 41], LS: [41, 60], RS: [59, 60] },
    },
    {
      id: 'ip.352',
      label: '保持 3-5-2化',
      note: 'WBが中盤の高さまで上がり、3CB＋中盤5枚の形へ移行する。',
      pos: { GK: [50, 6], LCB: [26, 21], CB: [50, 17], RCB: [74, 21], DM: [50, 33], LCM: [33, 48], RCM: [67, 48], LWB: [8, 58], RWB: [92, 58], LS: [41, 72], RS: [59, 72] },
    },
    {
      id: 'oop.high',
      label: '前からの守備 5-3-2',
      note: '2トップが外へ寄せてボールを片側に閉じ込め、WBと近い8番がジャンプする。',
      pos: { GK: [50, 7], LWB: [12, 44], LCB: [32, 32], CB: [50, 30], RCB: [68, 32], RWB: [88, 44], LCM: [33, 56], DM: [50, 52], RCM: [67, 56], LS: [40, 76], RS: [60, 76] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 5-3-2',
      note: '2トップが相手ピボットを消し、中盤3枚が横スライド、WBが相手の大外へ出る。',
      pos: { GK: [50, 5], LWB: [10, 28], LCB: [31, 24], CB: [50, 22], RCB: [69, 24], RWB: [90, 28], LCM: [30, 42], DM: [50, 40], RCM: [70, 42], LS: [42, 57], RS: [58, 57] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 5-3-2',
      note: 'PA幅を5枚、その前を3枚で守る。クリア後の回収地点が低くなりやすい。',
      pos: { GK: [50, 3], LWB: [12, 14], LCB: [31, 11], CB: [50, 10], RCB: [69, 11], RWB: [88, 14], LCM: [31, 27], DM: [50, 25], RCM: [69, 27], LS: [43, 41], RS: [57, 41] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 1, text: '保持でWBが上がるまでは幅が不足しやすい。' },
    { key: 'depth', label: '深さ（段差）', level: 2, text: '5バック・中盤3・2トップの3列。' },
    { key: 'central', label: '中央密度', level: 3, text: '3CB＋中盤3枚でPA前の中央が厚い。' },
    { key: 'buildup', label: '第1ライン', value: '3CB＋6', text: 'WBが低い分、出口は2トップへの直接球になりやすい。' },
    { key: 'press', label: '第1プレス', value: '2トップ（外切り）', text: '高い位置から追い回す設計ではない。' },
    { key: 'rest', label: '残り守備', value: '3CB＋6（3+1）', text: '保持時もWBの片方が残ることが多い。' },
  ],
  phases: {
    buildUp:
      '3CB＋6番。WBの位置が低いので、保持時に3-5-2へ移行する時間を作れるかが鍵。2トップへの直接球で時間を稼ぐ選択も多い。',
    progression:
      '2トップへの直接球と中盤3枚のセカンド回収、外CBの持ち運び。',
    finalThird:
      'WBの上がりが遅れると幅が不足する。2トップ＋8番の中央突破と、逆WBのファー侵入。',
    highPress:
      '高い位置から追い回すより、2トップが外へ寄せてボールを片側に閉じ込め、WBと近い8番がジャンプする。',
    midBlock:
      '5-3-2。2トップが相手ピボットを消し、中盤3枚が横スライド、WBが相手の大外へ出る。',
    lowBlock:
      '5-3-2や5-4-1。PA内の人数は確保しやすいが、クリア後の回収地点が低くなりやすい。',
    attTransition:
      '2トップが出口。WBは低い位置から長い距離を走る必要があり、カウンター初期の幅をどこで作るかが課題。',
    defTransition:
      '5バックへの帰陣が速く、PA前を素早く埋められる。',
    restDefence:
      '3CB＋6番の3+1が基本で、相手の2トップや1トップに数的優位を保ちやすい。',
  },
  roles: [
    { slot: 'LWB', title: 'WB', text: '守備では最終ラインの一角。保持では長い距離を上がって幅を作る。出る・出ないの判断が守備の中心課題。' },
    { slot: 'LCB', title: '外CB', text: 'WBが前に出た背後をカバーし、相手WGとの1v1にも対応する。' },
    { slot: 'DM', title: '6番', text: '中盤3枚の中心。2トップの背後で相手の10番や降りるFWを見る。' },
    { slot: 'LCM', title: '8番', text: '横スライドの量が最も多い。ボールサイドへ寄せ、逆サイドへの展開には間に合わないことがある。' },
    { slot: 'LS', title: 'CF（2トップ）', text: '奪った後の出口。相手ピボットへのコースを背中で消す。' },
    { slot: 'CB', title: '中央CB', text: 'PA内の統率。' },
    { slot: 'GK', title: 'GK', text: 'ロングボールの起点。' },
  ],
  strengths: [
    { title: 'PA幅を5枚で守る', why: '5バックで相手の大外とハーフスペースを同時に見られ、クロスにもPA内の人数を確保しやすい。', sources: ['cv-wingbacks', 'pt-lance-linha5'] },
    { title: '中央の人数', why: '3CB＋中盤3枚で中央レーンが厚く、ライン間で前を向かせにくい。', sources: ['cv-352-key'] },
    { title: '2トップの出口', why: '奪った瞬間に前線に2人いるので、直接的なカウンターが成立しやすい。', sources: ['cv-twoupfront'] },
  ],
  weaknesses: [
    { title: '大きなサイドチェンジ', why: '中盤3枚で横幅を守るため、逆サイドへの速い展開にスライドが間に合わないことがある。', sources: ['cv-inzaghi'] },
    { title: 'WBが出た後のチャネル', why: 'WBが相手SBへ出て、外CBがWGについていくと、外CBと中央CBの間が空く。', sources: ['cv-wingbacks'] },
    { title: '保持時の幅不足', why: 'WBの開始位置が低いため、攻撃に移る時間がないと幅を作れない。', sources: ['cv-352-key'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.352', label: '3-5-2化', text: 'WBが中盤の高さまで上がる。' },
      { label: '3-4-1-2', text: '8番の1枚が2トップの下へ。' },
    ],
    oop: [
      { shape: 'oop.high', label: '前からの守備', text: '2トップが外切り、WBと8番がジャンプ。' },
      { shape: 'oop.mid', label: 'ミドル 5-3-2', text: '中盤3枚の横スライド。' },
      { shape: 'oop.low', label: 'ロー 5-3-2', text: 'PA幅を5枚で守る。' },
      { label: '5-4-1', text: 'FW1枚が中盤の脇へ下がる。' },
    ],
  },
  sources: ['cv-352-key', 'cv-wingbacks', 'cv-twoupfront', 'cv-inzaghi', 'pt-lance-linha5', 'it-uu-difesa3'],
};
