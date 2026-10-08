export default {
  id: '3-5-2',
  status: 'analysis',
  family: 'back3',
  alias: '3CB＋WB＋中盤3枚＋2トップ',
  summary:
    '3CB＋WB2枚＋中盤3枚＋2トップ。3CBで第1ラインに数的優位を作りやすく、中央3枚と2トップで中央が厚い。幅はWBが一人で担うため、WBの背後と判断負荷が最大の論点。非保持では5-3-2になる。',
  phaseOf: '5-3-2',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LCB', label: 'CB', name: '左CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'CB', label: 'CB', name: '中央CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB（外CB）', line: 'DF', lane: 'central' },
    { id: 'LWB', label: 'WB', name: '左WB', line: 'MF', lane: 'wide' },
    { id: 'RWB', label: 'WB', name: '右WB', line: 'MF', lane: 'wide' },
    { id: 'DM', label: '6', name: '6番', line: 'MF', lane: 'central' },
    { id: 'LCM', label: '8', name: '左8番', line: 'MF', lane: 'central' },
    { id: 'RCM', label: '8', name: '右8番', line: 'MF', lane: 'central' },
    { id: 'LS', label: 'CF', name: '左CF', line: 'FW', lane: 'central' },
    { id: 'RS', label: 'CF', name: '右CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 3-5-2',
      note: '公称配置。WBが中盤の高さで幅を取る。',
      pos: { GK: [50, 4], LCB: [29, 19], CB: [50, 16], RCB: [71, 19], LWB: [8, 46], DM: [50, 33], LCM: [32, 47], RCM: [68, 47], RWB: [92, 46], LS: [40, 66], RS: [60, 66] },
    },
    {
      id: 'ip.352',
      label: '保持 3-5-2（WB高）',
      note: 'WBが相手の最終ライン付近まで上がり、8番がハーフスペース、2トップが中央。',
      pos: { GK: [50, 6], LCB: [24, 22], CB: [50, 17], RCB: [76, 22], DM: [50, 34], LCM: [33, 52], RCM: [67, 52], LWB: [6, 68], RWB: [94, 68], LS: [40, 77], RS: [60, 77] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 3-5-2',
      note: '2トップが相手CBへ。WBと近い8番が外へジャンプしてサイドに閉じ込める。',
      pos: { GK: [50, 8], LCB: [32, 38], CB: [50, 35], RCB: [68, 38], LWB: [10, 58], RWB: [90, 58], DM: [50, 54], LCM: [34, 64], RCM: [66, 64], LS: [40, 82], RS: [60, 82] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 5-3-2',
      note: 'WBが最終ラインに入って5バック。中盤3枚が横にスライドし、2トップがピボットを消す。',
      pos: { GK: [50, 5], LWB: [10, 28], LCB: [31, 24], CB: [50, 22], RCB: [69, 24], RWB: [90, 28], LCM: [30, 42], DM: [50, 40], RCM: [70, 42], LS: [42, 57], RS: [58, 57] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 5-3-2',
      note: 'PA幅を5枚で守る。中盤3枚の脇（大外の中盤の高さ）は譲りやすい。',
      pos: { GK: [50, 3], LWB: [12, 15], LCB: [31, 12], CB: [50, 11], RCB: [69, 12], RWB: [88, 15], LCM: [32, 28], DM: [50, 26], RCM: [68, 28], LS: [43, 42], RS: [57, 42] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 2, text: '片側の幅はWB1人。WBの高さで幅の質が決まる。' },
    { key: 'depth', label: '深さ（段差）', level: 3, text: '3CB・6番・8番・2トップで縦に段差がある。' },
    { key: 'central', label: '中央密度', level: 3, text: '中盤3枚＋2トップ＋3CBで中央レーンが厚い。' },
    { key: 'buildup', label: '第1ライン', value: '3CB（＋GK）', text: '相手が2枚なら+1、3枚ならGKで4v3。' },
    { key: 'press', label: '第1プレス', value: '2トップ＋ジャンプ', text: 'WBと8番が外へ出て閉じ込める。' },
    { key: 'rest', label: '残り守備', value: '3CB＋6（3+1）', text: '2トップ相手でも+2になりやすい。' },
  ],
  phases: {
    buildUp:
      '3CBで相手の第1ラインに+1を作りやすい。相手が3人で来ても、GKを加えれば4v3にできる。',
    progression:
      '外CBの持ち運び、WBへの展開、8番のハーフスペース侵入。2トップの縦関係で中央にも起点を作れる。',
    finalThird:
      '2トップ＋8番の侵入でPA内の人数を確保し、WBが大外からクロス。逆WBのファー侵入が得点パターン。',
    highPress:
      '2トップが相手CBへ寄せ、ボールが外へ出たらWBと近い8番がジャンプしてサイドで閉じ込める。',
    midBlock:
      'WBが最終ラインに入って5-3-2。中盤3枚の横スライドが生命線で、2トップは相手ピボットへのコースを消す。',
    lowBlock:
      '5-3-2または5-4-1でPA幅を守る。中盤3枚の脇は構造的に譲りやすい。',
    attTransition:
      '2トップが即座の出口。WBが外から追い越して幅を作る。',
    defTransition:
      'WBが高い位置でボールを失った直後、その背後が最も危険。外CBがスライドしてカバーする。',
    restDefence:
      '3CB＋6番の3+1を作りやすく、相手2トップに対しても+1〜+2を保てる。',
  },
  roles: [
    { slot: 'LWB', title: 'WB', text: '片側の幅を一人で担当。攻撃では大外、守備では5バックの一角。上下動の負荷が最も大きい。' },
    { slot: 'LCB', title: '外CB（伊: braccetto）', text: '持ち運んで前進し、WBの背後と相手WGをカバーする。3バックの機能性を決める役割。' },
    { slot: 'CB', title: '中央CB', text: 'ラインの統率と背後のカバー。相手CFへの対応。' },
    { slot: 'DM', title: '6番', text: '3CBの前で中央を守り、ビルドアップでは第2ラインの受け手。' },
    { slot: 'LCM', title: '8番', text: 'ハーフスペースへの侵入とWBのサポート。非保持では外へのスライドとジャンプ。' },
    { slot: 'LS', title: 'CF（2トップ）', text: '2人で相手CBを固定する。縦関係で降りる役と裏へ抜ける役を分ける。' },
    { slot: 'GK', title: 'GK', text: '相手が3枚でプレスしてきたときの+1。' },
  ],
  strengths: [
    { title: '第1ラインの+1', why: '3CBで相手の2トップに3v2、3枚で来てもGKを使って4v3にできる。', sources: ['cv-352-key', 'cv-back3'] },
    { title: '中央の厚み', why: '3CB＋中盤3枚＋2トップで中央レーンに人数が集まり、縦パスの受け手とセカンド回収役が多い。', sources: ['cv-352-key'] },
    { title: '2トップ', why: 'CB2枚を同時に固定し、直接的なボールにも競り合う人数がいる。', sources: ['cv-twoupfront'] },
    { title: '非保持で5バック化', why: 'WBが下がってPA幅を5枚で守れる。', sources: ['cv-wingbacks'] },
  ],
  weaknesses: [
    { title: 'WBの背後', why: 'WBが高い位置でボールを失うと、その背後へ直接ボールが出る。外CBが釣り出されるとチャネルが空く。', sources: ['cv-wingbacks'] },
    { title: '大外の判断負荷', why: '相手がWG＋SBの2人を大外に置くと、WB1人では足りず、外CBか8番の助けが必要になる。', sources: ['cv-352-key', 'it-uu-352'] },
    { title: '中盤の脇', why: '5-3-2になると中盤3枚で横幅を守るため、大外の中盤の高さを譲りやすい。', sources: ['cv-inzaghi'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.352', label: '3-5-2（WB高）', text: 'WBが最終ライン付近まで上がる。' },
      { label: '3-4-1-2', text: '8番の1枚が10番の位置へ上がり、2トップの下で受ける。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス', text: '2トップ＋WB・8番のジャンプ。' },
      { shape: 'oop.mid', label: 'ミドル 5-3-2', text: 'WBが最終ラインへ。' },
      { shape: 'oop.low', label: 'ロー 5-3-2', text: 'PA幅を5枚で守る。' },
      { label: '5-4-1', text: 'FWの1枚が中盤の脇まで下がり、中盤の幅を補う。' },
    ],
  },
  sources: ['cv-352-key', 'cv-back3', 'cv-wingbacks', 'cv-twoupfront', 'cv-inzaghi', 'it-uu-difesa3', 'it-uu-352', 'tierney2016'],
};
