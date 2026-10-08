# Matchup Lens — サッカー戦術 噛み合わせリファレンス

> 試合を観戦しながら、2チームのシステムの噛み合わせを数秒で把握し、ピッチ上で何を見るべきか分かる戦術リファレンス。

- **公開版（claude.ai Artifact・非公開リンク）**: https://claude.ai/artifact/MpqytcJGhZDM27tWmVKrNE
  ※ 初期状態では所有者のみ閲覧可能。共有はページの Share メニューから行う。
- **ローカルで開く**: `dist/index.html` をブラウザで直接開く（単一HTML、外部依存はGoogle Fontsのみ。オフラインでもシステムフォントで動作）

## 何ができるか

| 機能 | 内容 |
|---|---|
| システム選択 | 自チーム／相手を6×6＝36方向から選択。シート→マトリクスのセルで **2操作** |
| 視点の入れ替え | ⇄ ボタンで自チームと相手を反転。図は常に「自チームが下から上へ攻める」向きに180°回転し、人数バッジ（3v2 +1 ⇄ 2v3 −1）とラベル（最前線⇄最終ライン）も反転 |
| ピッチ図（SVG） | 両チーム22人、攻撃方向、パス（点線）、移動（実線）、プレス（太線＋山形）、カバーシャドウ（扇形）、狙うスペース（斜線）、フリーマン（破線の円）、マーク関係（点線）、人数関係（+1/=/−1）、危険地点（⚠）、3点マーカー（①②③）|
| 局面タブ | 噛み合わせ／自保持／相手保持／攻→守／守→攻／修正。タブ内に複数シーン |
| 今見るべき3点 | 視点ごとの3点。タップで対応する図へ |
| 詳細 | 攻撃・守備（因果カード）、優位性とフリーマン、ビルドアップ×プレス、キーバトル、トランジションと残り守備、相手の対応→再調整、セットプレー、成立条件と例外、出典 |
| 因果カード | すべて **前提 → 配置 → 現象 → 狙い → 対策** の順。再調整・成立しないケース・出典は折りたたみ。「要点のみ」表示切替あり |
| システム単体ページ | 6システム×局面ごとの形（基本／保持／ハイ／ミドル／ロー）、Quick facts、9局面の振る舞い、役割、強み・弱み（なぜ）、可変、マッチアップ一覧 |
| 用語集 | 41語・8分類。独・西・伊・葡の表記、Opta/StatsBombの定義差、検索 |
| 出典・方法 | エビデンス区分、ステータス定義、戦術QAチェックリスト、参照資料51件 |
| 表示設定 | レイヤーの表示／非表示、5レーン補助線、屋外向けライト表示（既定はダーク）|

### 状態表示（未検証のものを完成済みとして見せない）

| 表示 | 意味 | 対象 |
|---|---|---|
| ◆ 詳細分析 β | 出典に基づく構造分析。人間の戦術レビュー・実試合データでの検証は**未実施** | 6組12方向 |
| ・ 未整備 | 公称配置の重ね合わせと人数の機械的比較のみ。「戦術分析ではない」と明示 | 残り24方向 |
| 準備中 | 基本配置のみ登録 | 3-4-2-1 / 3-4-3 / 5-4-1 |

詳細分析の6組：4-3-3 vs 4-4-2（基準ページ）／4-4-2 vs 4-2-3-1／3-5-2 vs 4-3-3／4-2-3-1 vs 4-1-4-1／5-3-2 vs 4-3-3／4-1-4-1 vs 3-5-2。勝率・統計値は掲載していない。

## URL（ディープリンク）

ハッシュは共有リンクでそのまま届くよう英数字と `. _ ~ -` のみで構成。

| 例 | 画面 |
|---|---|
| `#4-3-3_vs_4-4-2` | マッチアップ（左＝自チーム）|
| `#4-4-2_vs_4-3-3.ip-build` | 視点を反転し、特定シーンを開く |
| `#sys.3-5-2` / `#sys.3-5-2.oop.mid` | システム単体／局面の形 |
| `#systems` `#glossary` `#glossary.rest-defence` `#sources` | 一覧・用語・出典 |

## 開発

```bash
cd tactics
npm install          # esbuild のみ
npm run validate     # データ検証
npm run build        # dist/index.html と dist/artifact.html を生成
npm test             # 検証 → ビルド → E2E（Playwright/Chromium）
```

構成：

```
src/
  main.js              ルーティング・状態・イベント委譲
  styles.css           デザイントークン（ダーク既定＋ライト）とレイアウト
  index.html           テンプレート
  lib/pitch.js         縦向きピッチのSVGレンダラー
  lib/scene.js         シーン定義 → 22人の座標とオーバーレイに解決、重なり判定
  lib/text.js          {A}/{B} トークンを視点つきのチーム表記へ
  views/               matchup / formation / reference（用語・出典）/ sheets
  data/schema.js       データモデル（JSDoc）と定数
  data/formations/     システム（f433.js など）と拡張予定（planned.js）
  data/matchups/       マッチアップ（m433_442.js など）
  data/glossary.js     用語集
  data/sources.js      参照資料
  data/index.js        登録簿・36方向の解決・未整備ページの自動生成
scripts/validate.mjs   データ検証
scripts/build.mjs      単一HTMLへのビルド
tests/e2e.mjs          E2E テスト
```

## データ構造

### 座標系

- `x`: 0–100（攻撃方向に向かって左→右、ピッチ幅68m）、`y`: 0–100（自陣ゴールライン→相手ゴールライン、105m）
- **システムの形**はそのチームが上へ攻める「チーム座標」
- **マッチアップのシーン**は A が上へ攻める「シーン座標」。B の形は `(100−x, 100−y)` に変換して置く。表示時、視点が B なら全体を180°回転（左右の向きは保たれる）

### システム（`data/formations/*.js`）

```js
{
  id: '4-3-3', status: 'analysis' | 'planned', alias, summary,
  slots: [{ id: 'DM', label: '6', name: '6番（アンカー）', line: 'MF', lane: 'central' }, ...11],
  shapes: [{ id: 'base' | 'ip.235' | 'oop.mid' ..., label, note, pos: { DM: [50, 34], ... } }],
  facts: [{ key, label, level?: 1-3, value?, text }],
  phases: { buildUp, progression, finalThird, highPress, midBlock, lowBlock, attTransition, defTransition, restDefence },
  roles: [{ slot, title, text }],
  strengths / weaknesses: [{ title, why, sources }],
  variations: { ip: [{ shape?, label, text }], oop: [...] },
  sources: [sourceId],
}
```

「公称フォーメーション」と「局面ごとの形」を分けて持つ（例：3-5-2 は `oop.mid` が 5-3-2、4-3-3 は `oop.mid` が 4-1-4-1）。3-5-2 と 5-3-2 は同じ枠ID を使い、`line`（公称のDF/MF）だけが異なる。

### マッチアップ（`data/matchups/*.js`）

A vs B を **1つの entity** として持ち、両方向（A視点・B視点）の表示を生成する。テキストは `{A}` `{B}` トークンで書き、表示時に「● 自4-3-3」「■ 相手4-4-2」に置き換わる。

```js
{
  id, teams: { A: '4-3-3', B: '4-4-2' }, status: 'analysis', updated,
  thesis: { A, B },                               // 視点ごとの一文の構図
  quickWatch: { A: [3項目], B: [3項目] },          // { text, look, why, scene, at:[x,y] }
  mechanisms: [{                                   // 因果カード
    id, attacker: 'A'|'B', phase, scene, evidence: 'F'|'P'|'I',
    title, premise, setup, phenomenon, aim, counter, readjust, exception, sources,
  }],
  superiority: [{ kind: 'numerical'|'positional'|'qualitative', zone, a?, b?, holder?, text, when }],
  freemen, interplay, restDefence: { A, B }, duels,
  adjustments: [{ by, title, trigger, change, effect, response: { by, text }, scene? }],
  setPieces, validity: { assumptions, exceptions, gameState, profiles }, sources,
  scenes: [{
    id, tab: 'overview'|'ip'|'tr'|'adjust', poss: 'A'|'B'|null, title, short, caption, ball,
    teams: { A: { from: 'ip.235', shift?, tweak?: { DM: [50, 27] } }, B: {...} },
    overlays: [
      { t: 'pass'|'run'|'press', from, to, curve?, label? },  // from/to は 'A:DM' か [x,y]
      { t: 'shadow', from, to }, { t: 'mark', a, b }, { t: 'free', who, label, lpos? },
      { t: 'zone', team, c:[x,y], w, h, label }, { t: 'danger', at, label }, { t: 'note', at, text },
      { t: 'count', at, a, b, label: '中盤' | { A: '最前線', B: '最終ライン' } },  // a=A側の人数, b=B側の人数
    ],
  }],
}
```

- `attacker` が視点チームなら「攻撃」セクション、相手なら「守備」セクションへ。`phase: 'transition'` は「攻→守／守→攻」へ振り分ける
- シーンは `tab` と `poss` から視点ごとのタブに自動で入る（例：`tab:'ip', poss:'B'` は A視点では「相手保持」、B視点では「自保持」）
- 人数バッジは `a/b` から視点側の人数を先に表示し、+1／=／−1 を自動計算

### 追加・更新の手順

- **新しいマッチアップ**：`data/matchups/` に1ファイル追加 → `data/index.js` の `matchupList` に追加。36方向のマトリクスや状態表示は自動で更新される
- **新しいシステム**（例：3-4-2-1）：`planned.js` の定義を `f433.js` と同じ構造のファイルに移し `status: 'analysis'` に。選択UI・36方向（→49方向）に自動で加わる
- **検証**：`npm run validate` が、選手数（11×2、GK各1）、座標範囲、**選手記号の重なり（5.4m未満）**、オーバーレイの参照、因果5項目の欠落、両チームの保持／トランジション／修正案の有無、全タブのシーン、出典IDの存在、視点依存ラベル、禁止表現（「必ず」「絶対」「勝率」「確実に」）をチェックする

## 戦術コンテンツの方針

- フォーメーションだけで優劣を断定しない。位置データの研究でも集団の戦術行動はポジション、数的関係、課題の条件などで変わる（Low et al., 2020）
- すべての分析は「前提条件 → 選手配置 → 戦術的な現象 → 狙い → 相手の対策」と、さらに再調整・成立しないケースを持つ
- エビデンスを区別：**出典**（定義・研究知見）／**原則**（指導者資料で共有される原則）／**推論**（前提条件つきの構造的推論。実試合データで未検証）。現在の因果カードはすべて「推論」
- セットプレーは通常配置の延長ではなく、「誰を残すか」の人数トレードオフとして別局面で扱う
- ゲームステート（リード／ビハインド）と選手特性による変化を各マッチアップに明記

## 参照資料（抜粋。全51件はアプリの「出典」ページと `src/data/sources.js`）

| 種類 | 主な資料 |
|---|---|
| 査読論文 | Low et al. (2020) *Sports Medicine*（集団戦術行動のレビュー）／Bradley et al. (2011) *J Sports Sci*（フォーメーションと高強度走行）／Tierney et al. (2016) *Hum Mov Sci*（フォーメーション別のGPS要求）／Forcher et al. (2023) *JSSM*（残り守備の成功要因）／Forcher et al. (2024) *Sci Med Football*（プレスと守備圧力）／Peters et al. (2025) *IJPAS*（カウンタープレスと残り守備） |
| 公式 | FIFA Training Centre「Football language（In/Out of possession）」、FIFA Enhanced Football Intelligence（Phases of play）、UEFA 技術レポート（2021/22, 2022/23） |
| データ定義 | Opta Analyst（Sequence / Possession）、Stats Perform（Phases of play）、StatsBomb（Pressure・Counterpress、Open Data）、Premier League（PPDA） |
| 指導者資料 | Coaches' Voice（4-3-3／4-4-2／4-2-3-1／4-1-4-1／3-5-2／3バック／WB／2トップ／残り守備／ミドル・ローブロック／カウンタープレス／ハイプレス／サードマン ほか）|
| 多言語 | 独：Spielverlagerung（Halbraum, Restverteidigung）、90min.de（abkippender Sechser）／西：El Espectador（salida lavolpiana）、Coaches' Voice ES、Win Sports（superioridad）／伊：L'Ultimo Uomo（difesa a 3, 3-5-2）／葡：Lance!（linha de 5）、Revista Conexões（Vítor Frade）|

**調査の制約**：制作環境のネットワーク方針で Coaches' Voice などの個別ページは直接取得できず、Web検索結果の抜粋で内容とURLを照合した。Low et al. (2020) の DOI はリンク先に到達できず「書誌のみ」と表示している。

## テスト結果（2026-10-08、Playwright 1.56 / Chromium）

`npm test` → **45 / 45 passed**（詳細は `test-results/report.json`、`test-results/` は git 管理外）

| 項目 | 結果 |
|---|---|
| 横スクロールなし（375 / 390 / 414 / 430px、10画面＋選択シート） | PASS |
| 36方向すべてで22人（自11・相手11）、状態表示、詳細分析は3点表示 | PASS（詳細12・未整備24）|
| 詳細分析12方向×全タブ・全シーン（110シーン）で22人、SVGの title/desc | PASS |
| 2操作で任意の組み合わせ（シート→マトリクス）、片側だけ変更（シート→チップ） | PASS |
| 入れ替え：URL反転・シーン保持・自チーム表示・3点と攻撃セクションの視点 | PASS |
| 人数バッジとラベルが視点で反転 | PASS |
| ディープリンク、3点→図、因果カード→図、3点マーカー | PASS |
| レイヤー切替、5レーン、ライト表示 | PASS |
| タップ領域 44×44px 以上、全ボタンにアクセシブルな名前、SVGに role=img | PASS |
| システム6種の全局面で11人、マッチアップ一覧6件 | PASS |
| 用語集の多言語検索、用語ディープリンク | PASS |
| 初回描画（図＋3点）: CPU 4倍スロットリングで約0.6秒 / CLS 0.043 / タブ操作→描画 最大約0.1秒 | PASS |
| 単一HTML 315KB（gzip 約84KB） | PASS |
| デスクトップ 1280px で2カラム | PASS |

データ検証（`npm run validate`）：エラー0・警告0。

### 未検証の項目

- **実機**：iOS Safari / Android Chrome の実機では未確認（Chromium のモバイルエミュレーションのみ）。特に Safari のアドレスバー伸縮時の図の高さ（`svh`）
- **ネットワーク条件下の LCP / INP**：file:// とCPUスロットリングでの計測のみ。実回線・実端末での Core Web Vitals は未計測
- **スクリーンリーダー**：DOM上の名前・SVGの title/desc・図のテキスト代替は確認したが、VoiceOver / TalkBack での読み上げは未確認
- **戦術内容**：人間の戦術アナリストによるレビュー、実試合データ（イベント・トラッキング）での検証は未実施
- **Artifact 上の挙動**：公開ページでの表示は Artifact の配信環境に依存（ローカルの dist/index.html と同じコード）

## 残課題

- 未整備24方向の詳細分析（同型対決6方向を含む）
- 拡張予定3システム（3-4-2-1 / 3-4-3 / 5-4-1）の分析
- 人間の戦術レビューのワークフロー（レビュー済みステータスの追加）
- 図のラベルの自動配置（現在は座標を手で調整し、検証で重なりを検出）
- スワイプでのシーン切替、横向き表示の最適化

## 今後の拡張ロードマップ

1. **コンテンツ**：残り9組（24方向）→ 拡張3システム（49方向）→ 4-4-2ダイヤモンド・4-3-1-2 など
2. **品質**：専門家レビュー（「レビュー済み」ステータス）、StatsBomb Open Data を使った実試合での事例検証（平均ポジション、パスネットワーク、ロスト地点）
3. **観戦体験**：お気に入り、共有ボタン、PWA／オフライン、スワイプ切替、試合時間・スコア別の修正案
4. **図**：時系列アニメーション（局面の遷移）、ドラッグで配置を変えるサンドボックス
5. **データ連携**：プロバイダー別定義を持った指標（PPDA、フィールドティルト等）の表示。ライセンス条件を確認した上で導入

## GitHub Pages で公開する場合

このリポジトリの Pages は別ブランチ（`claude/create-family-muku-folders-niry6c`）の `baby-food/` を配信している。Matchup Lens を同じ方法で公開するには、そのブランチに `tactics/dist/index.html` を `tactics/index.html` としてコピーして push する（URL：`https://wakapika.github.io/personal_use/tactics/`）。または Pages の配信元をこのブランチに切り替える。いずれもリポジトリ設定の変更や公開範囲の判断が必要なため、未実施。
