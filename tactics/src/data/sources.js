// 参照資料。type は資料の種類、tier は信頼度の優先順位（1が最優先）。
// access:
//   'verified'  … 2026-10 のWeb検索で資料の存在とURLを確認（本文の要約は検索結果の抜粋に基づく）
//   'citation'  … 書誌情報で参照（この環境ではリンク先に到達できず未確認）
// 制作環境のネットワーク方針で個別ページの直接取得はできなかったため、内容は検索結果の抜粋で照合している。

export const SOURCE_TYPES = {
  research: { label: '査読論文', tier: 1 },
  official: { label: '公式資料', tier: 2 },
  provider: { label: 'データ定義', tier: 2 },
  coaching: { label: '指導者向け資料', tier: 3 },
  media: { label: '戦術メディア', tier: 4 },
  base: { label: '基礎調査', tier: 3 },
};

export const sources = [
  // ---- 査読論文 ----
  {
    id: 'low2020', type: 'research', lang: 'en', access: 'citation',
    title: 'A Systematic Review of Collective Tactical Behaviours in Football Using Positional Data',
    by: 'Low, Coutinho, Gonçalves, Rein, Memmert, Sampaio', year: 2020, venue: 'Sports Medicine 50(2):343–385',
    url: 'https://doi.org/10.1007/s40279-019-01194-7',
    note: '位置データによる集団戦術研究のレビュー。ポジション、数的不均衡、タスク制約が集団行動を変えると整理。「フォーメーション単独で結果を断定しない」設計の根拠。',
  },
  {
    id: 'bradley2011', type: 'research', lang: 'en', access: 'verified',
    title: 'The effect of playing formation on high-intensity running and technical profiles in English FA Premier League soccer matches',
    by: 'Bradley, Carling, et al.', year: 2011, venue: 'Journal of Sports Sciences 29(8):821–830',
    url: 'https://doi.org/10.1080/02640414.2011.561868',
    note: '20試合・153人の観察研究。4-4-2／4-3-3／4-5-1で高強度走行の総量に差はなく、4-5-1は保持時の超高強度走行が少なく非保持時に多かった。4-3-3のFWは高強度走行が多かった。',
  },
  {
    id: 'tierney2016', type: 'research', lang: 'en', access: 'verified',
    title: 'Match play demands of 11 versus 11 professional football using Global Positioning System tracking: Variations across common playing formations',
    by: 'Tierney, Young, Clarke, Duncan', year: 2016, venue: 'Human Movement Science 49:1–8',
    url: 'https://pureportal.coventry.ac.uk/en/publications/match-play-demands-of-11-versus-11-professional-football-using-gl-2/',
    note: '1クラブ46選手のGPS観察。5つのフォーメーションで走行要求が異なり、3-5-2は総走行距離などが最も多かった。特定サンプルのため一般化には注意。',
  },
  {
    id: 'forcher2023rest', type: 'research', lang: 'en', access: 'verified',
    title: 'The Success Factors of Rest Defense in Soccer – A Mixed-Methods Approach of Expert Interviews, Tracking Data, and Machine Learning',
    by: 'Forcher, Forcher, Altmann, Jekauc, Kempe', year: 2023, venue: 'Journal of Sports Science and Medicine 22:707–725',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10690503/',
    note: '専門家インタビュー＋ブンデスリーガ153試合のトラッキング。残り守備＝保持中に最後方の選手がカウンターに備える配置。深いスペースと危険な相手の管理、ロスト直後の素早い奪回が成功要因。',
  },
  {
    id: 'forcher2024press', type: 'research', lang: 'en', access: 'verified',
    title: 'The keys of pressing to gain the ball – Characteristics of defensive pressure in elite soccer using tracking data',
    by: 'Forcher, et al.', year: 2024, venue: 'Science and Medicine in Football 8(2):161–169',
    url: 'https://doi.org/10.1080/24733938.2022.2158213',
    note: 'ブンデスリーガ153試合。ボールに近い位置とボール奪取直前で守備圧力が高く、ボール保持者への圧力が奪取と結びつく。',
  },
  {
    id: 'peters2025', type: 'research', lang: 'en', access: 'verified',
    title: 'A rule-based approach to classify counterpressing – analysis of its risks and relationship with rest defence',
    by: 'Peters, Parmar, Davies, James', year: 2025, venue: 'International Journal of Performance Analysis in Sport',
    url: 'https://repository.mdx.ac.uk/item/219q97',
    note: 'プレミアリーグ2020/21全380試合。相手陣でのロスト後、残り守備ゾーンの人数が被シュート・被前進と有意に関連。残り守備の組織とカウンタープレス開始には有意な関係なし。',
  },

  // ---- 公式資料 ----
  {
    id: 'fifa-ip', type: 'official', lang: 'en', access: 'verified',
    title: 'Football language: In possession', by: 'FIFA Training Centre', year: null,
    url: 'https://www.fifatrainingcentre.com/en/resources-tools/football-language/in-possession/index.php',
    note: '保持局面の用語定義。本サイトのフェーズ分類の基準。',
  },
  {
    id: 'fifa-oop', type: 'official', lang: 'en', access: 'verified',
    title: 'Football language: Out of possession', by: 'FIFA Training Centre', year: null,
    url: 'https://www.fifatrainingcentre.com/en/resources-tools/football-language/out-of-possession/index.php',
    note: '非保持局面の用語定義（ハイ／ミドル／ロー、カウンタープレス等）。',
  },
  {
    id: 'fifa-efi', type: 'official', lang: 'en', access: 'verified',
    title: 'Enhanced Football Intelligence (FIFA World Cup 2022)', by: 'FIFA', year: 2022,
    url: 'https://www.fifatrainingcentre.com/media/native/world-cup-2022/Enhanced%20Football%20Intelligence%20EN.pdf',
    note: 'トラッキングデータからPhases of play（ビルドアップ、前進、ファイナルサード、ハイ／ミドル／ローブロック、カウンタープレス等）を算出する枠組み。',
  },
  {
    id: 'uefa-ucl-2223', type: 'official', lang: 'en', access: 'verified',
    title: '2022/23 Champions League: tactical talking points', by: 'UEFA', year: 2023,
    url: 'https://www.uefa.com/uefachampionsleague/news/0282-1839121e5648-4e3e6286e1b8-1000--2022-23-champions-league-tactical-talking-points/',
    note: '2CB＋1CMでのビルドアップ、自陣でプレスを引き込んでから第1ラインを越える傾向。',
  },
  {
    id: 'uefa-observers-2122', type: 'official', lang: 'en', access: 'verified',
    title: 'UEFA technical observers review 2021/22 season', by: 'UEFA', year: 2022,
    url: 'https://www.uefa.com/insideuefa/news/0278-15f1330f89e5-c6e98c04a3cf-1000--uefa-technical-observers-review-2021-22-season/',
    note: '5バックの増加と、フォーメーションの効果はラベルではなく運用で決まるという指摘。',
  },

  // ---- データ定義 ----
  {
    id: 'opta-sequences', type: 'provider', lang: 'en', access: 'verified',
    title: 'Possessions and sequences in football', by: 'Opta Analyst (Stats Perform)', year: 2021,
    url: 'https://theanalyst.com/articles/possessions-and-sequences-in-football',
    note: 'Opta定義のSequence（守備アクション・中断・シュートで終わる一連のプレー）とPossession。',
  },
  {
    id: 'sp-phases', type: 'provider', lang: 'en', access: 'verified',
    title: 'Phases of play – an introduction', by: 'Stats Perform', year: 2019,
    url: 'https://www.statsperform.com/resource/phases-of-play-an-introduction',
    note: 'イベントデータを局面（ビルドアップ、トランジション等）に分類するルールベースモデル。',
  },
  {
    id: 'sb-counterpress', type: 'provider', lang: 'en', access: 'verified',
    title: 'How StatsBomb Data Helps Measure Counter-Pressing', by: 'StatsBomb', year: 2018,
    url: 'https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/',
    note: 'StatsBombのPressureイベント（保持者の約5ヤード以内）と、ロスト後5秒以内のプレスをカウンタープレスとする定義。',
  },
  {
    id: 'sb-opendata', type: 'provider', lang: 'en', access: 'verified',
    title: 'StatsBomb Open Data', by: 'StatsBomb', year: null,
    url: 'https://github.com/statsbomb/open-data',
    note: '研究・教育用途のイベントデータ。将来の実データ検証の候補。',
  },
  {
    id: 'pl-ppda', type: 'provider', lang: 'en', access: 'verified',
    title: 'Passes per defensive action: explained', by: 'Premier League', year: null,
    url: 'https://www.premierleague.com/news/4250153',
    note: 'PPDAの定義（相手陣側60%での相手パス数÷守備アクション数）。プロバイダーごとに守備アクションの定義が異なる。',
  },

  // ---- 指導者向け資料（Coaches' Voice） ----
  { id: 'cv-433', type: 'coaching', lang: 'en', access: 'verified', title: "The 4-3-3: football tactics explained", by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-3-3-football-tactics-explained-formation-liverpool-klopp-barcelona-guardiola/', note: '前線3枚のプレス、WGの内切り／外切り、6番の役割、SBとWGの間の弱点、4-1-4-1への移行。' },
  { id: 'cv-433-key', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-3-3 formation: five key points', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-3-3-formation-klopp-arteta-xavi/', note: '4-3-3の要点。' },
  { id: 'cv-442', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-4-2: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-4-2-football-tactics-ferguson-simeone-hasenhuttl-dyche/', note: '2トップによるCB固定とピボットへのカバーシャドウ、SHの絞り、2列の横スライド、段差の少なさ。' },
  { id: 'cv-442-diamond', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-4-2 diamond: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-4-2-diamond-football-tactics-explained-klopp-potter-allegri/', note: '中盤中央の人数を増やすダイヤモンド型。' },
  { id: 'cv-4231', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-2-3-1: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/the-4-2-3-1-football-tactics-pochettino-guardiola-flick-southgate/', note: '10番が上がる4-4-2化／下がってピボット番、ダブルピボットの役割、1トップの孤立。' },
  { id: 'cv-4231-key', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-2-3-1 formation: key points', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-2-3-1-formation-fundamentals/', note: '4-2-3-1の要点。' },
  { id: 'cv-doublepivot', type: 'coaching', lang: 'en', access: 'verified', title: 'Double pivot: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/double-pivot-football-tactics-explained-bayern-munich-chelsea/', note: 'ダブルピボットがSBの同時前進を支える。' },
  { id: 'cv-4141', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-1-4-1 formation: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-1-4-1-formation-football-tactics-explained/', note: '単独6番のスクリーン、8番のジャンプ、SHの絞りとタッチライン利用、保持時の4-3-3化、SHの攻撃出力の低下。' },
  { id: 'cv-451', type: 'coaching', lang: 'en', access: 'verified', title: 'The 4-5-1 formation: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/4-5-1-formation-football-tactics/', note: '4-5-1の低いブロック。' },
  { id: 'cv-352-key', type: 'coaching', lang: 'en', access: 'verified', title: 'The 3-5-2 formation: five key points', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/3-5-2-formation-conte-mourinho-guardiola/', note: '3CBによる第1ラインの+1（GK込み4v3）、WBの役割、中央の人数。' },
  { id: 'cv-back3', type: 'coaching', lang: 'en', access: 'verified', title: 'The back three: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/back-three-explained-why-conte-moyes-guardiola/', note: '3バックの保持・非保持、利点と欠点。' },
  { id: 'cv-wingbacks', type: 'coaching', lang: 'en', access: 'verified', title: 'Wing-backs: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/wing-backs-football-tactics-explained-conte-tuchel/', note: 'WBは守備で5バック化、攻撃で幅を担う。' },
  { id: 'cv-twoupfront', type: 'coaching', lang: 'en', access: 'verified', title: 'Two up front: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/two-up-front-football-tactics-explained-simeone-conte-atletico-juventus/', note: '2トップの組み合わせと役割分担。' },
  { id: 'cv-inzaghi', type: 'coaching', lang: 'en', access: 'verified', title: 'Simone Inzaghi tactics and style of play', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/simone-inzaghi-tactics-and-style-of-play/', note: '5-3-2の守備：2トップが外へ寄せて片側に閉じ込め、WBと近い8番がジャンプ。5バック化で中盤の大外を譲る。' },
  { id: 'cv-restdef', type: 'coaching', lang: 'en', access: 'verified', title: 'What is rest defence? Football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/rest-defence-explained/', note: '残り守備の人数（5+5、6+4）と2-3／3-2の形、独語 Rest に由来。' },
  { id: 'cv-midblock', type: 'coaching', lang: 'en', access: 'verified', title: 'The mid-block: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/mid-block-football-tactics-explained/', note: 'ミドルブロックの原則。' },
  { id: 'cv-lowblock', type: 'coaching', lang: 'en', access: 'verified', title: 'The low block: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/low-block-football-tactics-explained-simeone-dyche-mourinho/', note: 'ローブロックの原則。' },
  { id: 'cv-counterpress', type: 'coaching', lang: 'en', access: 'verified', title: 'In Focus: Counter-pressing', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/in-focus-counter-pressing-1/', note: '最も近い選手が保持者へ、周囲が危険なパスコースを消す。背後のスペースがリスク。' },
  { id: 'cv-att-transitions', type: 'coaching', lang: 'en', access: 'verified', title: 'Attacking transitions: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/attacking-transitions-football-tactics-explained-klopp-liverpool-mourinho/', note: '奪った直後の最初のパスと出口の考え方。' },
  { id: 'cv-highpress', type: 'coaching', lang: 'en', access: 'verified', title: 'In Focus: High press', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/in-focus-high-press/', note: 'プレッシングトラップ：空いているように見せて誘い込み、複数人で囲む。' },
  { id: 'cv-glossary', type: 'coaching', lang: 'en', access: 'verified', title: 'Glossary: football tactics and coaching definitions', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/glossary-football-tactics-coaching/', note: 'ハーフスペース、カウンタープレス、サードマンラン等の定義。' },
  { id: 'cv-thirdman', type: 'coaching', lang: 'en', access: 'verified', title: 'Third-man runs: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/third-man-runs-football-tactics-explained-gasperini-guardiola/', note: '2v2を数的優位に変える第3の選手の動き。' },
  { id: 'cv-positional', type: 'coaching', lang: 'en', access: 'verified', title: 'Positional play: football tactics explained', by: "Coaches' Voice", url: 'https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/', note: 'ポジショナルプレーの原則。' },
  { id: 'es-cv-conte', type: 'coaching', lang: 'es', access: 'verified', title: 'Análisis: Las variables tácticas de Antonio Conte', by: "The Coaches' Voice（スペイン語版）", url: 'https://es.coachesvoice.com/analisis-las-variables-tacticas-de-antonio-conte/', note: '3-5-2系の可変についてのスペイン語分析。' },

  // ---- 戦術メディア（多言語） ----
  { id: 'sv-halfspace', type: 'media', lang: 'de/en', access: 'verified', title: 'Glossary: Half-space (Halbraum)', by: 'Spielverlagerung', url: 'https://spielverlagerung.com/glossary/pitch-zones/half-space/', note: 'ハーフスペース（独: Halbraum）の定義。中央とサイドの間の縦レーンで、斜めのパスと走路が生まれやすい。' },
  { id: 'sv-restattack', type: 'media', lang: 'de/en', access: 'verified', title: 'Rest-Attack（Restverteidigung を起点とした論考）', by: 'Spielverlagerung', url: 'https://spielverlagerung.com/?p=12948', note: 'ボールから遠い選手の残り守備と、近い選手のカウンタープレスを区別する独語圏の整理。' },
  { id: 'sv-juego', type: 'media', lang: 'en', access: 'verified', title: 'Juego de Posición under Pep Guardiola', by: 'Spielverlagerung', year: 2014, url: 'https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/', note: 'ポジショナルプレーと数的優位の作り方。' },
  { id: 'de-abkippen', type: 'media', lang: 'de', access: 'verified', title: 'Der abkippende Sechser – was ist das eigentlich?', by: '90min.de', url: 'https://www.90min.de/posts/6582083-der-abkippende-sechser-was-ist-das-eigentlich', note: '6番がCBの間・横へ降りる「Abkippen」の解説（補助資料）。' },
  { id: 'es-lavolpiana', type: 'media', lang: 'es', access: 'verified', title: 'La salida "Lavolpiana"', by: 'El Espectador', url: 'https://www.elespectador.com/deportes/la-salida-lavolpiana-articulo-916178/', note: '6番がCB間に降りて2トップに3v2を作るビルドアップ（salida lavolpiana）。' },
  { id: 'es-superioridad', type: 'media', lang: 'es', access: 'verified', title: 'Carlos Antonio Vélez explica qué es la superioridad en el fútbol', by: 'Win Sports', url: 'https://www.winsports.co/cav-sulas/noticias/carlos-antonio-velez-explica-que-es-la-superioridad-en-el-futbol-83827', note: '数的・位置的・質的優位（superioridad numérica / posicional / cualitativa）の区別（補助資料）。' },
  { id: 'it-uu-difesa3', type: 'media', lang: 'it', access: 'verified', title: 'Perché la difesa a 3 ha così successo?', by: "L'Ultimo Uomo", url: 'https://ultimouomo.com/perche-la-difesa-a-3-ha-cosi-successo', note: '3バックが低い位置のビルドアップで循環を改善し、相手を引き出してライン間に受け手を作る。' },
  { id: 'it-uu-352', type: 'media', lang: 'it', access: 'verified', title: 'Il 3-5-2 è davvero il male del calcio italiano?', by: "L'Ultimo Uomo", url: 'https://ultimouomo.com/3-5-2-male-calcio-italiano-serie-a-conte-allegri-gasperini', note: '3-5-2が守備時に5-3-2化し、WBが実質SBになる構造。' },
  { id: 'pt-lance-linha5', type: 'media', lang: 'pt', access: 'verified', title: 'Defender com linha de 5 no futebol: veja vantagens e desvantagens', by: 'Lance!', url: 'https://www.lance.com.br/lancepedia/defender-com-linha-de-5-futebol.html', note: '5バックで横の通路を閉じ内側へ誘導、3CBによるカバー（補助資料）。' },
  { id: 'pt-frade', type: 'research', lang: 'pt', access: 'verified', title: 'Entrevista com Vítor Frade (Periodização Tática)', by: 'Revista Conexões', year: 2015, url: 'https://periodicos.sbu.unicamp.br/ojs/index.php/conexoes/article/view/2155', note: '戦術的ピリオダイゼーション。試合を攻撃組織・守備組織・2つのトランジションの局面で捉える枠組みの背景。' },

  // ---- 基礎調査 ----
  { id: 'deep-research', type: 'base', lang: 'ja', access: 'verified', title: 'サッカー戦術・フォーメーション噛み合わせ分析サイト設計のためのDeep Research', by: '依頼者提供資料', url: null, note: '要件、戦術モデル、6マッチアップの基礎仮説、QA基準。' },
];

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
