export default {
  id: '4-3-3',
  status: 'analysis',
  family: 'back4',
  alias: 'シングルピボット＋2人の8番＋3トップ',
  summary:
    '1アンカー（6番）＋2人の8番＋3トップ。5レーンを埋めやすく、前線3枚で高い位置からプレスできる。構造的な弱点は6番の脇と、SB・WGの間（SBの背後）。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LB', label: 'SB', name: '左SB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
    { id: 'RB', label: 'SB', name: '右SB', line: 'DF', lane: 'wide' },
    { id: 'DM', label: '6', name: '6番（アンカー）', line: 'MF', lane: 'central' },
    { id: 'LCM', label: '8', name: '左8番', line: 'MF', lane: 'central' },
    { id: 'RCM', label: '8', name: '右8番', line: 'MF', lane: 'central' },
    { id: 'LW', label: 'WG', name: '左WG', line: 'FW', lane: 'wide' },
    { id: 'ST', label: 'CF', name: 'CF', line: 'FW', lane: 'central' },
    { id: 'RW', label: 'WG', name: '右WG', line: 'FW', lane: 'wide' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 4-3-3',
      note: '公称配置。6番が2人の8番の後ろに立つ三角形が基準。',
      pos: { GK: [50, 4], LB: [15, 24], LCB: [37, 18], RCB: [63, 18], RB: [85, 24], DM: [50, 34], LCM: [32, 47], RCM: [68, 47], LW: [14, 66], ST: [50, 70], RW: [86, 66] },
    },
    {
      id: 'ip.235',
      label: '保持 2-3-5',
      note: '両SBが6番と同じ高さへ。8番が前線のハーフスペース、WGが大外で前線5枚。残り守備は2CB＋6番。',
      pos: { GK: [50, 6], LCB: [33, 20], RCB: [67, 20], LB: [16, 40], DM: [50, 36], RB: [84, 40], LW: [6, 74], LCM: [31, 70], ST: [50, 77], RCM: [69, 70], RW: [94, 74] },
    },
    {
      id: 'ip.325',
      label: '保持 3-2-5',
      note: '右SBが残って3バック、左SBが6番の横へ入る（インバート）。中央の2ピボットで6番が消されにくい。',
      pos: { GK: [50, 6], LCB: [32, 18], RCB: [54, 16], RB: [76, 20], LB: [40, 36], DM: [60, 36], LW: [6, 74], LCM: [31, 70], ST: [50, 77], RCM: [69, 70], RW: [94, 74] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 4-3-3',
      note: 'CF＋2WGが第1ライン、8番が相手CM／ピボットへジャンプ。6番は中盤の背後を一人で管理。',
      pos: { GK: [50, 9], LB: [16, 42], LCB: [38, 36], RCB: [62, 36], RB: [84, 42], DM: [50, 52], LCM: [36, 66], RCM: [64, 66], LW: [22, 82], ST: [50, 86], RW: [78, 82] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 4-1-4-1',
      note: 'WGが中盤ラインまで下がる。6番がCB前、4人の中盤ラインで横幅を守る。',
      pos: { GK: [50, 5], LB: [17, 26], LCB: [39, 24], RCB: [61, 24], RB: [83, 26], DM: [50, 36], LW: [16, 47], LCM: [37, 48], RCM: [63, 48], RW: [84, 47], ST: [50, 61] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 4-5-1',
      note: '中盤5枚がPA前を横幅ごと守る。8番はSBのサポートでクロス対応まで下がる。',
      pos: { GK: [50, 3], LB: [19, 14], LCB: [40, 12], RCB: [60, 12], RB: [81, 14], DM: [50, 24], LW: [18, 29], LCM: [37, 31], RCM: [63, 31], RW: [82, 29], ST: [50, 45] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 3, text: 'WGが大外に常駐。保持時はSBも加わり5レーンを埋めやすい。' },
    { key: 'depth', label: '深さ（段差）', level: 3, text: '6番–8番–前線の3段。縦パスの角度を作りやすい。' },
    { key: 'central', label: '中央密度', level: 2, text: '中央MFは3枚。非保持で4-1-4-1にすると中盤ラインは5枚。' },
    { key: 'buildup', label: '第1ライン', value: '2CB＋6（＋GK）', text: '相手2トップなら3v2、GK込みで4v2。' },
    { key: 'press', label: '第1プレス', value: 'CF＋2WG', text: '8番のジャンプで中盤を捕まえる。' },
    { key: 'rest', label: '残り守備', value: '2CB＋6（2+1）', text: '片SBを残せば3+1。' },
  ],
  phases: {
    buildUp:
      '2CB＋6番（＋GK）で第1ラインを作る。相手が2トップなら3v2（GK込み4v2）、1トップならCBが運べる。6番が背中で消されたら、6番がCB間に降りて3枚化するか、片SB／8番が降りて2ピボットにする。',
    progression:
      '8番が相手MFラインの外側・背後（ハーフスペース）に立ち、WGは大外で相手SBをピン留めする。6番への縦パス、CBの持ち運び、SB経由の外循環が主な前進ルート。',
    finalThird:
      'WG（大外）＋8番（ハーフスペース）＋CF（中央）で前線5レーンを埋める。SBの追い越しで大外2v1を作り、カットバックとファーへのクロスを狙う。',
    highPress:
      'CF＋2WGが第1ライン、8番がジャンプして相手CM／ピボットを捕まえる。WGが内側から寄せてSBを背中で消す方法と、外から寄せて中央の罠へ誘導する方法がある。',
    midBlock:
      'WGが下がって4-1-4-1。6番がCB前のスペースをスクリーンし、8番は中央を優先して閉じる。外を越えられたら8番がスライドしてSBを助ける。',
    lowBlock:
      '4-5-1。8番がSBの背後をカバーしてクロスに対応し、CBがPAの外へ釣り出されないようにする。',
    attTransition:
      '奪ったらWGの幅を使った速い展開が第一の出口。CFは中央で起点を作り、逆WGが背後へ、8番が2列目から追い越す。',
    defTransition:
      'ボール周辺の8番・WG・CFで即時奪回（カウンタープレス）。後方は2CB＋6番（＋片SB）で背後と最初の縦パスを管理する。',
    restDefence:
      '両SBを高くすると2CB＋6番の2+1。相手が2トップなら同数に近づくため、片SBを残した3+1（3-2-5）に切り替える判断が多い。',
  },
  roles: [
    { slot: 'DM', title: '6番（アンカー）', text: '第1ライン直後の受け手。前を向けるかで前進の質が決まる。非保持ではCB前のスペースと8番の背後を一人でカバーする。' },
    { slot: 'LCM', title: '8番', text: 'ハーフスペースで受けて前進し、PAへ遅れて侵入。非保持では相手CM／ピボットへのジャンプ役。' },
    { slot: 'LW', title: 'WG', text: '大外で相手SBをピン留めし1v1。非保持はSBへのコースを消しながらCBへ寄せ、ブロックではSHの位置まで戻る。' },
    { slot: 'ST', title: 'CF', text: 'CB間でピン留めと裏抜け、降りて8番やWGを使う。相手が3CBだと数的に孤立しやすい。' },
    { slot: 'LB', title: 'SB', text: '保持では大外の幅役か、内側に入る2枚目のピボット（インバート）。非保持はWGと縦関係で大外を守る。' },
    { slot: 'LCB', title: 'CB', text: '幅を取って相手FWの間隔を広げ、空いたら運ぶ。残り守備の最後尾として相手CFの背後抜けを管理。' },
    { slot: 'GK', title: 'GK', text: 'ビルドアップの+1。相手2トップに対して第1ラインを4v2にできるかは足元の質次第。' },
  ],
  strengths: [
    { title: '前線3枚で高い位置から圧力', why: 'CF＋2WGが相手CB・SBの近くに立てるため、ボールを失った直後やハイプレスで人数をかけやすい。8番のジャンプで中盤も捕まえられる。', sources: ['cv-433'] },
    { title: '5レーンを埋めやすい', why: 'WGが大外、8番がハーフスペース、CFが中央。SBが上がれば大外で2v1も作れる。', sources: ['cv-433', 'sv-halfspace'] },
    { title: '中央の三角形', why: '6番＋8番2枚の段差でパスの角度が生まれる。中央MFが2枚の相手には中央で+1になりやすい。', sources: ['cv-433', 'cv-433-key'] },
  ],
  weaknesses: [
    { title: '6番の脇', why: '6番は1人で横幅を守るため、8番が前へジャンプした瞬間に脇（ハーフスペース）が空く。相手の10番や降りるFWの受け場所になる。', sources: ['cv-433'] },
    { title: 'SBとWGの間、SBの背後', why: 'WGが高く残るとSBが大外で数的不利になり、素早いサイドチェンジでその状態を突かれやすい。', sources: ['cv-433'] },
    { title: '1トップの孤立', why: '相手が2CB・3CBならCFは常に数的不利。WG・8番の押し上げが遅いと起点を作れない。', sources: ['cv-433'] },
    { title: '両SB前進時の残り守備', why: '2CB＋6番の3枚で相手2トップを見ると+1しかなく、6番がボールへ出ると2v2になる。', sources: ['cv-restdef'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.235', label: '2-3-5', text: '両SBが上がり、8番が前線のハーフスペースへ。前線の人数と幅は最大、残り守備は2CB＋6番。' },
      { shape: 'ip.325', label: '3-2-5', text: '片SBが残って3バック、逆SBが6番の横へ（インバート）。2トップの相手に6番を消されにくい。' },
      { label: '6番落とし（西: salida lavolpiana）', text: '6番がCBの間へ降りて第1ラインを3枚化。2トップのプレスに+1を作るが、中盤中央は1枚減る。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス 4-3-3', text: 'CF＋WGで第1ライン、8番がジャンプ。' },
      { shape: 'oop.mid', label: 'ミドル 4-1-4-1', text: 'WGが中盤ラインへ。6番がCB前をスクリーン。' },
      { shape: 'oop.low', label: 'ロー 4-5-1', text: '中盤5枚でPA前を横幅ごと守る。' },
    ],
  },
  sources: ['cv-433', 'cv-433-key', 'cv-restdef', 'cv-4141', 'sv-halfspace', 'es-lavolpiana', 'bradley2011', 'tierney2016'],
};
