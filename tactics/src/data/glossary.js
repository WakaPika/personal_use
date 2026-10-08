// 戦術用語集。各用語は分類、短い定義（観戦中に読む1文）、長い定義、他言語表記、関連語、出典、プロバイダー定義を持つ。
export const GLOSSARY_CATEGORIES = [
  { id: 'space', label: '空間', en: 'Space' },
  { id: 'positioning', label: '配置', en: 'Positioning' },
  { id: 'ip', label: '保持', en: 'In Possession' },
  { id: 'oop', label: '非保持', en: 'Out of Possession' },
  { id: 'pressing', label: 'プレス', en: 'Pressing' },
  { id: 'transition', label: '切替', en: 'Transition' },
  { id: 'setpiece', label: 'セットプレー', en: 'Set Piece' },
  { id: 'data', label: 'データ', en: 'Data' },
];

export const glossary = [
  // ---- Space ----
  {
    id: 'width', cat: 'space', ja: '幅', en: 'Width', aliases: ['横幅'],
    short: '攻撃側が横方向に相手を広げる距離。',
    long: '大外（タッチライン際）に選手を置くと、相手の守備ブロックが横に伸びて選手間が空く。守備側から見れば、幅を取られるほどスライドの距離が長くなる。',
    related: ['half-space', 'pin', 'compactness'], sources: ['cv-glossary'],
  },
  {
    id: 'depth', cat: 'space', ja: '深さ（段差）', en: 'Depth', aliases: ['縦の段差'],
    short: '縦方向の配置差。最終ラインの裏を狙う選手と、ライン間に立つ選手で相手を縦に引き延ばす。',
    long: '同じ高さに並ぶと1本のパスで複数人が外されやすく、段差があるとパスの角度とカバーが生まれる。4-4-2の弱点として挙げられる「段差の少なさ」はこの意味。',
    related: ['line-breaking', 'compactness'], sources: ['cv-442'],
  },
  {
    id: 'half-space', cat: 'space', ja: 'ハーフスペース', en: 'Half-space', aliases: ['HS'],
    i18n: { de: 'Halbraum', es: 'carril interior', it: 'mezzo spazio' },
    short: '中央とサイドの間にある2本の縦レーン。斜めのパスと走路が生まれやすい。',
    long: 'ピッチを縦に5分割したときの2番目と4番目のレーン（目安はPAの外縁からゴールエリアの外縁まで）。保持者は中央とほぼ同じ選択肢を持ちながら、外へも中へも斜めに展開できる。独語 Halbraum に由来し、Spielverlagerung の議論で広まったとされる。',
    related: ['five-lanes', 'pocket'], sources: ['sv-halfspace', 'cv-glossary'],
  },
  {
    id: 'pocket', cat: 'space', ja: 'ポケット', en: 'Pocket', aliases: [],
    short: '守備ライン間・選手間の受け場所。PA脇のCBとSBの間を指すことも多い。',
    long: '相手が誰も捕まえにくい隙間。ここで前を向いた選手からカットバックや斜めの縦パスが生まれる。',
    related: ['half-space', 'channel'], sources: [],
  },
  {
    id: 'channel', cat: 'space', ja: 'チャネル', en: 'Channel', aliases: ['CB-SB間'],
    short: 'CBとSBの間などの縦の通路。裏抜けとロングボールの狙い所。',
    long: 'SBやWBが前に出た直後、外CBがWGに釣られた直後に広がる。2トップの片方が流れて起点を作る場所でもある。',
    related: ['pocket', 'rest-defence'], sources: [],
  },
  {
    id: 'five-lanes', cat: 'space', ja: '5レーン', en: 'Five lanes', aliases: [],
    short: 'ピッチを縦に5本へ分けて立ち位置を整理する考え方。',
    long: '大外2本・ハーフスペース2本・中央1本。保持では各レーンに選手を置いて相手の守備者を分散させる。本サイトの図では「5レーン」レイヤーで表示できる。',
    related: ['half-space', 'width'], sources: ['sv-halfspace'],
  },

  // ---- Positioning ----
  {
    id: 'pin', cat: 'positioning', ja: 'ピン留め', en: 'Pinning', aliases: ['固定'],
    short: '相手をその位置から動けなくする立ち位置。',
    long: '大外のWGが相手SBを外に留めると、SBとCBの間が広がる。2トップが相手CB2枚を固定すると、CBが前に出て潰しにくくなる。',
    related: ['width', 'superiority'], sources: ['cv-442'],
  },
  {
    id: 'overload', cat: 'positioning', ja: 'オーバーロード', en: 'Overload', aliases: ['数的優位を作る'],
    short: '特定のエリアに人数をかけて数的優位を作ること。',
    long: '片側に人数を集めて相手を寄せ、逆サイドの1v1（アイソレーション）を作る使い方もある。',
    related: ['isolation', 'superiority'], sources: ['cv-thirdman'],
  },
  {
    id: 'isolation', cat: 'positioning', ja: 'アイソレーション', en: 'Isolation', aliases: [],
    short: '意図的に1対1を作ること。',
    long: '逆サイドに人数を集めてから、大外で待つWGへ展開して1v1を作る。質的優位を生かす典型的な手段。',
    related: ['overload', 'superiority'], sources: [],
  },
  {
    id: 'superiority', cat: 'positioning', ja: '数的・位置的・質的優位', en: 'Numerical / positional / qualitative superiority', aliases: ['優位性'],
    i18n: { es: 'superioridad numérica / posicional / cualitativa' },
    short: '数＝人数が多い、位置＝相手を無力化する位置取り、質＝個の能力差。',
    long: '数的優位はそのエリアの人数差、位置的優位は相手が関与できない立ち位置（ライン間、背中側など）、質的優位は1v1や空中戦などの個の差。スペイン語圏のポジショナルプレーの議論で区別される。本サイトでは「+1」などの記号を数的優位に限って使う。',
    related: ['free-man', 'overload'], sources: ['es-superioridad', 'sv-juego'],
  },
  {
    id: 'free-man', cat: 'positioning', ja: 'フリーマン', en: 'Free man', aliases: ['フリーの選手', '浮いている選手'],
    i18n: { es: 'hombre libre' },
    short: '守備側の誰にも捕まっていない選手。',
    long: '数的・位置的優位の結果として生まれる。図では破線の円で示す。誰がフリーになるかは相手のプレス方式で変わるため、本サイトでは必ず条件とセットで示す。',
    related: ['superiority'], sources: ['sv-juego'],
  },
  {
    id: 'pivot', cat: 'positioning', ja: 'ピボット（6番・ボランチ）', en: 'Pivot', aliases: ['アンカー', 'ボランチ', '6番'],
    i18n: { de: 'Sechser / Doppelsechs', es: 'pivote', it: 'regista / mediano' },
    short: '中盤の底で配球と守備のバランスを担う選手。',
    long: '1人ならシングルピボット（アンカー）、2人ならダブルピボット。ダブルピボットはSBの同時前進を支えやすく、シングルピボットは脇のスペースが論点になる。',
    related: ['salida', 'rest-defence'], sources: ['cv-doublepivot', 'de-abkippen'],
  },

  // ---- In Possession ----
  {
    id: 'build-up', cat: 'ip', ja: 'ビルドアップ', en: 'Build-up', aliases: ['組み立て'],
    i18n: { es: 'salida de balón', it: 'costruzione dal basso', pt: 'saída de bola' },
    short: 'GK・DFから組織的に前進を始める局面。',
    long: 'FIFAの局面分類（EFI）では、相手のプレッシャーの有無でビルドアップを区別する。本サイトでは「第1ライン（ボールを持つ最後方の列）vs 相手の第1プレス」の人数から読む。',
    related: ['salida', 'first-line'], sources: ['fifa-ip', 'fifa-efi', 'uefa-ucl-2223'],
  },
  {
    id: 'first-line', cat: 'ip', ja: '第1ライン', en: 'First line', aliases: [],
    short: 'ビルドアップでボールを持つ最後方の列（CB・GK・降りた6番など）。',
    long: '相手の第1プレス（FWなど）との人数差が、ビルドアップの出発点になる。例：2CB＋6番 vs 2トップ＝3v2。',
    related: ['build-up', 'superiority'], sources: [],
  },
  {
    id: 'line-breaking', cat: 'ip', ja: 'ラインブレイク', en: 'Line-breaking pass', aliases: ['縦パス'],
    short: '相手の守備ラインを越えて味方に届くパス。',
    long: 'ライン間で受ける選手（8番、10番、降りるFW）への縦パスが典型。',
    related: ['depth', 'third-man'], sources: [],
  },
  {
    id: 'third-man', cat: 'ip', ja: 'サードマン', en: 'Third-man run', aliases: ['3人目の動き'],
    i18n: { es: 'tercer hombre', pt: 'terceiro homem' },
    short: '2人のパス交換の間に、3人目が前向きで受ける動き。',
    long: '2v2の状況を数的優位に変える。受け手を捕まえに出た守備者の背後を、3人目が使う形が多い。',
    related: ['overload', 'line-breaking'], sources: ['cv-thirdman', 'cv-glossary'],
  },
  {
    id: 'overlap', cat: 'ip', ja: 'オーバーラップ', en: 'Overlap', aliases: [],
    short: 'ボール保持者の外側を後ろから追い越す動き。',
    long: '大外で2v1を作る基本形。追い越した選手の背後（残り守備）の管理とセットで考える。',
    related: ['underlap', 'rest-defence'], sources: [],
  },
  {
    id: 'underlap', cat: 'ip', ja: 'アンダーラップ', en: 'Underlap', aliases: ['インナーラップ'],
    short: 'ボール保持者の内側を追い越す動き。',
    long: 'WGが大外で相手SBをピン留めしているとき、SBや8番がCBとSBの間（チャネル）へ走り込む。',
    related: ['overlap', 'channel'], sources: [],
  },
  {
    id: 'invert', cat: 'ip', ja: 'インバート', en: 'Inverted full-back', aliases: ['偽SB', '偽サイドバック'],
    short: 'SBやWBが中盤の内側へ入る動き。',
    long: '中央の人数を増やし、6番の横に2人目のピボットを作る。ボールを失ったときの残り守備も厚くなる。代わりに大外の人数が減る。',
    related: ['pivot', 'rest-defence'], sources: ['uefa-observers-2122'],
  },
  {
    id: 'salida', cat: 'ip', ja: '6番落とし（サリーダ・ラボルピアーナ）', en: 'Salida lavolpiana', aliases: ['アンカー落とし'],
    i18n: { es: 'salida lavolpiana', de: 'abkippender Sechser' },
    short: '6番がCBの間・横へ降り、第1ラインを3枚にするビルドアップ。',
    long: '2トップのプレスに対して3v2を作る。メキシコで指揮したリカルド・ラ・ボルペの名に由来する呼び名。代わりに中盤中央の人数が1人減る。',
    related: ['build-up', 'pivot'], sources: ['es-lavolpiana', 'de-abkippen'],
  },
  {
    id: 'braccetto', cat: 'ip', ja: '外CB（ブラッチェット）', en: 'Wide centre-back (back three)', aliases: [],
    i18n: { it: 'braccetto' },
    short: '3バックの左右のCB。持ち運び、WBの背後のカバー、相手WGへの対応を担う。',
    long: 'イタリア語圏の通称。3バックが機能するかは、この選手が運べるか、WBの背後へスライドできるかで大きく変わる。',
    related: ['channel'], sources: ['cv-back3'],
  },

  // ---- Out of Possession ----
  {
    id: 'block', cat: 'oop', ja: 'ハイ／ミドル／ローブロック', en: 'High / mid / low block', aliases: [],
    short: '非保持で守備組織を構える高さ。',
    long: 'FIFAの局面分類（EFI）では、ブロックの高さと保持者への圧力で区別する。本サイトの図では「ミドルブロック」を基準に、ハイプレスとローブロックを別の形として扱う。',
    related: ['compactness', 'trigger'], sources: ['fifa-oop', 'fifa-efi', 'cv-midblock', 'cv-lowblock'],
  },
  {
    id: 'compactness', cat: 'oop', ja: 'コンパクトネス', en: 'Compactness', aliases: [],
    short: 'チームの縦横の距離の小ささ。',
    long: '位置データの研究では、チームの幅・長さ・面積などで測られる。コンパクトさは選手配置だけでなく、相手や数的関係などの文脈でも変わる。',
    related: ['block', 'slide'], sources: ['low2020'],
  },
  {
    id: 'slide', cat: 'oop', ja: 'スライド', en: 'Shift / slide', aliases: [],
    short: 'ボールサイドへ守備ブロック全体が横に移動すること。',
    long: '4-4の2列はスライドしやすいとされる。中盤3枚（5-3-2など）は、大きなサイドチェンジに対してスライドの距離が長くなる。',
    related: ['compactness'], sources: ['cv-442', 'cv-inzaghi'],
  },
  {
    id: 'jump', cat: 'oop', ja: 'ジャンプ', en: 'Jump / step out', aliases: ['前に出る'],
    short: '自分のラインを離れて前へ出る守備。',
    long: '出た選手の背後を誰が埋めるかとセットで考える。8番のジャンプは6番の脇を、WBのジャンプはチャネルを空けやすい。',
    related: ['pressing-trap', 'channel'], sources: ['cv-4141', 'cv-inzaghi'],
  },
  {
    id: 'man-oriented', cat: 'oop', ja: 'マンオリエンテーション', en: 'Man-oriented defending', aliases: ['マンツーマン寄り'],
    short: 'ゾーンを基準にしつつ、特定の相手を基準に位置を取る守備。',
    long: '相手がマン寄りで守ると、数的優位の場所よりも「人を引き出して空いた背後」を使うことが主題になる。本サイトの多くの分析は、ゾーン基準を前提条件として明記している。',
    related: ['free-man'], sources: [],
  },

  // ---- Pressing ----
  {
    id: 'trigger', cat: 'pressing', ja: 'プレッシングトリガー', en: 'Pressing trigger', aliases: ['プレスのスイッチ'],
    short: 'プレスを一斉に始めるきっかけ。',
    long: 'バックパス、SBやWBへのパス、背を向けたトラップ、浮き球などが典型。トリガーが共有されていないと、1人だけが出て背後を空ける。',
    related: ['pressing-trap', 'cover-shadow'], sources: ['cv-highpress'],
  },
  {
    id: 'cover-shadow', cat: 'pressing', ja: 'カバーシャドウ', en: 'Cover shadow', aliases: ['背中で消す'],
    short: '寄せる選手が自分の背中で、背後の相手へのパスコースを消すこと。',
    long: '図では扇形の影で示す。2トップが相手CBへ寄せながら6番を背中で消せるかが、多くのマッチアップの分かれ目になる。',
    related: ['trigger', 'first-line'], sources: ['cv-442'],
  },
  {
    id: 'pressing-trap', cat: 'pressing', ja: 'プレッシングトラップ', en: 'Pressing trap', aliases: ['罠'],
    short: '空いて見えるエリアへボールを誘い込み、複数人で一気に囲む。',
    long: '外へ追い出してタッチラインを使う「サイドの罠」と、内へ誘う「中央の罠」がある。',
    related: ['trigger'], sources: ['cv-highpress', 'cv-433'],
  },

  // ---- Transition ----
  {
    id: 'counterpress', cat: 'transition', ja: 'カウンタープレス', en: 'Counter-press', aliases: ['即時奪回', 'ゲーゲンプレス'],
    i18n: { de: 'Gegenpressing' },
    short: 'ボールを失った直後の即時奪回。',
    long: '最も近い選手が保持者へ寄せ、周囲が危険なパスコースを消す。人数をかけるほど背後が空くため、残り守備とセットで評価する。',
    related: ['rest-defence', 'outlet'], sources: ['cv-counterpress', 'cv-glossary', 'sb-counterpress', 'peters2025'],
    provider: { label: 'StatsBomb', text: 'Pressure イベント（保持者からおよそ5ヤード以内への接近）のうち、オープンプレーでのロスト後5秒以内のものを counterpress としてフラグ付けする。' },
  },
  {
    id: 'rest-defence', cat: 'transition', ja: '残り守備（レストディフェンス）', en: 'Rest defence', aliases: ['レストディフェンス', 'リスク管理'],
    i18n: { de: 'Restverteidigung' },
    short: '保持中、ボールを失った場合に備えて後方に残しておく配置。',
    long: '2-3や3-2の形が多い。独語の Rest（残り）に由来。研究では、深いスペースと危険な相手の管理、ロスト直後の素早い奪回が成功要因とされ、相手陣でのロスト後は残り守備ゾーンの人数が被シュートと関連した。本サイトでは「2CB＋6番（2+1）」のように人数と形で表す。',
    related: ['counterpress', 'channel'], sources: ['cv-restdef', 'forcher2023rest', 'peters2025', 'sv-restattack'],
  },
  {
    id: 'outlet', cat: 'transition', ja: 'アウトレット（出口）', en: 'Outlet', aliases: ['出口'],
    short: '奪った直後の最初のパスの受け手。',
    long: '2トップ、残っているWG、相手SBの背後などが典型。最初のパスを前に出せるかで、カウンターになるか保持に切り替えるかが決まる。',
    related: ['counterpress'], sources: ['cv-att-transitions'],
  },
  {
    id: 'second-ball', cat: 'transition', ja: 'セカンドボール', en: 'Second ball', aliases: ['こぼれ球'],
    short: '競り合いやクリアの後のこぼれ球。',
    long: 'ロングボールを多用する相手には、落下点の前にいる中盤（6番・CM）の数と向きが重要になる。',
    related: ['outlet'], sources: [],
  },

  // ---- Set Piece ----
  {
    id: 'zonal-man', cat: 'setpiece', ja: 'ゾーン／マンツーマン（セットプレー）', en: 'Zonal / man marking', aliases: [],
    short: 'CK・FKの守備で、エリアを守るか人を守るか。',
    long: '多くのチームは併用する。本サイトでは、セットプレーを通常のフォーメーションの延長として扱わず、別の局面として「誰を残すか」を中心に書く。',
    related: ['counter-protection'], sources: ['cv-glossary'],
  },
  {
    id: 'counter-protection', cat: 'setpiece', ja: 'カウンター対策要員', en: 'Counter protection', aliases: ['残し'],
    short: '攻撃側セットプレーで後方に残す人数と配置。',
    long: '相手が前線に何人残すかで決まる。相手がFWを2人残せば、こちらは最低でも3人を残す判断が多く、PA内に送れる人数が減る。',
    related: ['rest-defence'], sources: [],
  },

  // ---- Data ----
  {
    id: 'xg', cat: 'data', ja: 'xG（期待ゴール）', en: 'Expected goals', aliases: ['ゴール期待値'],
    short: 'シュート機会が得点になる確率を、過去のシュートデータから推定した値。',
    long: 'モデルはプロバイダー（Opta、StatsBomb等）ごとに異なり、同じシュートでも値が変わる。数値を比較するときは同じ提供元で揃える。本サイトはxGを掲載していない。',
    related: ['xa'], sources: [],
  },
  {
    id: 'xa', cat: 'data', ja: 'xA', en: 'Expected assists', aliases: [],
    short: 'パスがアシストになる期待値系の指標。',
    long: '定義はプロバイダーによって異なる（受けたシュートのxGを使うものと、パス自体を評価するものがある）。',
    related: ['xg'], sources: [],
  },
  {
    id: 'sequence', cat: 'data', ja: 'シークエンス', en: 'Sequence', aliases: [],
    short: '一方のチームに属する一連のプレー。守備アクション、中断、シュートで終わる。',
    long: 'Opta の定義。タックルやインターセプトだけではシークエンスは始まらず、その後にパスやドリブルなどの制御されたプレーが続いたときに始まる。',
    related: ['possession'], sources: ['opta-sequences'],
    provider: { label: 'Opta', text: 'Sequence＝守備アクション・プレーの中断・シュートで終わる、一方のチームに属する一連のプレー。' },
  },
  {
    id: 'possession', cat: 'data', ja: 'ポゼッション（保持単位）', en: 'Possession', aliases: [],
    short: '同じチームのシークエンスの連続。相手がボールを制御すると終わる。',
    long: 'Opta の定義。シュートがCKになった場合、シークエンスは終わってもポゼッションは続く。「支配率」とは別の概念。',
    related: ['sequence'], sources: ['opta-sequences'],
    provider: { label: 'Opta', text: 'Possession＝同じチームに属する1つ以上のシークエンスの連続。相手がボールを制御した時点で終わる。' },
  },
  {
    id: 'ppda', cat: 'data', ja: 'PPDA', en: 'Passes per defensive action', aliases: [],
    short: '相手陣側60%での相手のパス数 ÷ 守備アクション数。小さいほど前からの圧力が強い傾向。',
    long: '守備アクションに何を含めるか（タックル、インターセプト、チャレンジ、ファウルなど）は提供元によって異なる。プレス強度の目安で、プレスの質そのものは表さない。',
    related: ['trigger'], sources: ['pl-ppda'],
  },
  {
    id: 'phases-of-play', cat: 'data', ja: '局面分類（Phases of play）', en: 'Phases of play', aliases: ['フェーズ'],
    short: 'トラッキングやイベントデータから、ビルドアップやブロックなどの局面を自動分類する枠組み。',
    long: 'FIFA EFI はビルドアップ、前進、ファイナルサード、ハイ／ミドル／ローブロック、カウンタープレス等を算出する。Stats Perform もルールベースの局面モデルを公開している。本サイトのタブ構成（保持・非保持・攻→守・守→攻）はこの考え方に合わせている。',
    related: ['block', 'build-up'], sources: ['fifa-efi', 'sp-phases', 'pt-frade'],
  },
];
