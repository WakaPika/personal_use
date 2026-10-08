export default {
  id: '4-4-2',
  status: 'analysis',
  family: 'back4',
  alias: '2トップ＋フラットな4-4の2ライン',
  summary:
    '2トップ＋4枚の2ライン。2トップが相手CB2枚を同時に固定でき、2列の横スライドでコンパクトに守りやすい。中央MFが2枚のため、3枚の中盤には人数とパス角度で不利になりやすい。',
  slots: [
    { id: 'GK', label: 'GK', name: 'GK', line: 'GK', lane: 'central' },
    { id: 'LB', label: 'SB', name: '左SB', line: 'DF', lane: 'wide' },
    { id: 'LCB', label: 'CB', name: '左CB', line: 'DF', lane: 'central' },
    { id: 'RCB', label: 'CB', name: '右CB', line: 'DF', lane: 'central' },
    { id: 'RB', label: 'SB', name: '右SB', line: 'DF', lane: 'wide' },
    { id: 'LM', label: 'SH', name: '左SH', line: 'MF', lane: 'wide' },
    { id: 'LCM', label: 'CM', name: '左CM', line: 'MF', lane: 'central' },
    { id: 'RCM', label: 'CM', name: '右CM', line: 'MF', lane: 'central' },
    { id: 'RM', label: 'SH', name: '右SH', line: 'MF', lane: 'wide' },
    { id: 'LS', label: 'CF', name: '左CF', line: 'FW', lane: 'central' },
    { id: 'RS', label: 'CF', name: '右CF', line: 'FW', lane: 'central' },
  ],
  shapes: [
    {
      id: 'base',
      label: '基本配置 4-4-2',
      note: '公称配置。DF4・MF4・FW2の3ライン。',
      pos: { GK: [50, 4], LB: [15, 24], LCB: [37, 18], RCB: [63, 18], RB: [85, 24], LM: [15, 46], LCM: [39, 42], RCM: [61, 42], RM: [85, 46], LS: [41, 65], RS: [59, 65] },
    },
    {
      id: 'ip.244',
      label: '保持 2-4-4',
      note: 'SBが上がってCMと同じ高さへ。SHは内側の高い位置、2トップと並んで前線4枚。',
      pos: { GK: [50, 6], LCB: [35, 20], RCB: [65, 20], LB: [12, 42], LCM: [40, 39], RCM: [60, 39], RB: [88, 42], LM: [22, 68], LS: [42, 76], RS: [58, 76], RM: [78, 68] },
    },
    {
      id: 'oop.high',
      label: 'ハイプレス 4-4-2',
      note: '2トップが相手CBへ。SHは相手SB、CMは相手の中盤を捕まえる位置まで押し上げる。',
      pos: { GK: [50, 9], LB: [16, 42], LCB: [38, 36], RCB: [62, 36], RB: [84, 42], LM: [18, 64], LCM: [40, 58], RCM: [60, 58], RM: [82, 64], LS: [40, 82], RS: [60, 82] },
    },
    {
      id: 'oop.mid',
      label: 'ミドルブロック 4-4-2',
      note: '2トップが相手ピボットへのコースを背中で消し、SHが絞ってフラットな4枚を作る。',
      pos: { GK: [50, 5], LB: [16, 26], LCB: [39, 24], RCB: [61, 24], RB: [84, 26], LM: [19, 43], LCM: [40, 41], RCM: [60, 41], RM: [81, 43], LS: [42, 57], RS: [58, 57] },
    },
    {
      id: 'oop.low',
      label: 'ローブロック 4-4-1-1',
      note: '2列を低く。FWの1枚が下がって相手ピボットを見る。',
      pos: { GK: [50, 3], LB: [18, 14], LCB: [39, 12], RCB: [61, 12], RB: [82, 14], LM: [20, 28], LCM: [40, 27], RCM: [60, 27], RM: [80, 28], LS: [50, 39], RS: [52, 52] },
    },
  ],
  facts: [
    { key: 'width', label: '幅', level: 2, text: 'SHが幅を担当。保持時はSBが上がって大外を取る。' },
    { key: 'depth', label: '深さ（段差）', level: 1, text: '同じライン上に並びやすく、ライン内の段差が少ない。' },
    { key: 'central', label: '中央密度', level: 1, text: '中央MFは2枚。SHが絞れば非保持で4枚。' },
    { key: 'buildup', label: '第1ライン', value: '2CB＋2CM', text: 'ボックス型。2トップへの長いボールも常に選択肢。' },
    { key: 'press', label: '第1プレス', value: '2トップ', text: '相手CB2枚を同時に見られる。' },
    { key: 'rest', label: '残り守備', value: '2CB＋2CM（2+2）', text: 'SBを上げても4枚が残りやすい。' },
  ],
  phases: {
    buildUp:
      '2CB＋2CMのボックス、またはSB経由で前進する。2トップへの長いボールで相手の最終ラインと直接勝負する選択肢を常に持てる。',
    progression:
      'SB→SH→CFの縦の連係と、2トップの縦関係（片方が降りて受け、片方が背後へ）。中央は2枚なので、外→中の順で前進することが多い。',
    finalThird:
      '2トップでPA内にニアとファーの2人を確保できる。SHの内側侵入とSBのオーバーラップで大外からクロス。',
    highPress:
      '2トップが相手CBへ寄せ、外へ追い出してサイドで閉じ込めるか、内へ誘導して中央の罠にかける。後方のFWが背後から挟み、CMが前から寄せる形もある。',
    midBlock:
      '2トップが相手ピボットへのコースを背中で消し、SHが絞ってフラットな4枚を作る。2列のままボールサイドへ横スライドしてコンパクトさを保つ。',
    lowBlock:
      '4-4の2ラインを低く構え、FWの1枚が下がって4-4-1-1や4-5-1になる。PA前の中央を2列で埋める。',
    attTransition:
      '奪ったら2トップが即座の出口。1人が足元で起点を作り、もう1人が背後へ走る。SHが外から追い越す。',
    defTransition:
      '2CMと2CBが中央を締め、SHが帰陣する。2トップは相手の最初のパス（CB・ピボット）を遅らせる。',
    restDefence:
      'SBを上げても2CB＋2CMの4枚が残りやすい。相手が1トップなら後方は大きな数的優位。',
  },
  roles: [
    { slot: 'LS', title: 'CF（2トップ）', text: '2人で相手CB2枚を固定する。ターゲットと裏抜けの組み合わせ。非保持では第1ラインと、相手ピボットへのカバーシャドウ。' },
    { slot: 'LCM', title: 'CM', text: '2枚で中央を横幅ごと守る。片方が前に出たら片方は残る。セカンドボール回収の中心。' },
    { slot: 'LM', title: 'SH', text: '保持時は幅か内側の受け手、非保持は絞って中盤4枚目。大外の守備と中央の補助を両立する負荷が最も大きい。' },
    { slot: 'LB', title: 'SB', text: 'SHと縦関係で大外を担当。相手WGやWBとの1対1が多い。' },
    { slot: 'LCB', title: 'CB', text: '相手2トップとは2v2になりやすく、対人の強さが要求される。相手1トップなら+1。' },
    { slot: 'GK', title: 'GK', text: 'ロングボールの起点と背後のカバー。' },
  ],
  strengths: [
    { title: '2トップがCB2枚を固定', why: '相手最終ラインの中央に2v2を作り、CBのどちらも前に出にくくする。', sources: ['cv-442', 'cv-twoupfront'] },
    { title: '明確な2ラインで横スライドが容易', why: '4枚×2列はボールサイドへのスライドでコンパクトさを保ちやすい。', sources: ['cv-442'] },
    { title: '奪った後の出口と人数', why: '前線に2人残るため、奪った瞬間の出口と追い越しの人数を確保できる。', sources: ['cv-442'] },
  ],
  weaknesses: [
    { title: '中央2枚 vs 中盤3枚', why: '相手が6番＋8番2枚なら中央は2v3。SHが絞れば同数にできるが、今度は大外が空く。', sources: ['cv-442', 'cv-442-diamond'] },
    { title: '段差の少なさ（ライン間）', why: '同じ高さに並ぶため、選手間を通す縦パス1本で複数人が外されやすい。', sources: ['cv-442'] },
    { title: '第1ラインが3枚になると数的不利', why: '相手が3バックや6番落としで第1ラインを3枚にすると、2トップでは1人余る。', sources: ['es-lavolpiana'] },
  ],
  variations: {
    ip: [
      { shape: 'ip.244', label: '2-4-4', text: 'SBが上がり、SHが内側の高い位置へ。前線4枚で相手最終ラインを押し下げる。' },
      { label: '4-4-1-1（2トップの縦関係）', text: 'FWの1枚が降りて中盤とつなぐ。中央の人数不足を補う。' },
    ],
    oop: [
      { shape: 'oop.high', label: 'ハイプレス 4-4-2', text: '2トップが相手CBへ。外切りでサイドに閉じ込める。' },
      { shape: 'oop.mid', label: 'ミドル 4-4-2', text: 'SHが絞ったフラット4。2トップがピボットを消す。' },
      { shape: 'oop.low', label: 'ロー 4-4-1-1', text: 'FW1枚がピボット番。2列を低く。' },
      { label: 'ダイヤモンド（4-1-2-1-2）', text: '中央の人数不足を解消する別形。幅は失う。' },
    ],
  },
  sources: ['cv-442', 'cv-twoupfront', 'cv-442-diamond', 'es-lavolpiana', 'bradley2011', 'tierney2016'],
};
