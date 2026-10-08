// データモデル定義（JSDoc）。実行時の検証は scripts/validate.mjs が行う。
//
// 座標系（全データ共通）
//   x: 0–100 = 攻撃方向に向かって左タッチライン → 右タッチライン（ピッチ幅 68m）
//   y: 0–100 = 自陣ゴールライン → 相手ゴールライン（ピッチ長 105m）
// フォーメーションの shape は「そのチームが上へ攻める」チーム座標で書く。
// マッチアップの scene は「A（matchup.teams.A）が上へ攻める」シーン座標で書く。
// B の shape は (100-x, 100-y) に変換してシーンへ置かれる。表示時、視点が B なら全体を180°回転させる。

/**
 * @typedef {'GK'|'CB'|'SB'|'WB'|'6'|'DM'|'8'|'CM'|'10'|'SH'|'WG'|'CF'} RoleLabel
 *
 * @typedef {Object} Slot             選手枠（形が変わっても同じ id を使う）
 * @property {string} id              例 'DM', 'LCM'
 * @property {RoleLabel} label        図中の表示ラベル
 * @property {string} name            日本語の役割名
 * @property {'GK'|'DF'|'MF'|'FW'} line  公称ライン（人数比較の自動算出に使う）
 * @property {'central'|'wide'} lane  公称レーン
 *
 * @typedef {Object.<string, [number, number]>} Positions   slot id → [x, y]
 *
 * @typedef {Object} Shape
 * @property {string} id              例 'base', 'ip.235', 'oop.mid'
 * @property {string} label           例 '保持 2-3-5'
 * @property {string} note            その形になる条件・意味
 * @property {Positions} pos
 *
 * @typedef {Object} Formation
 * @property {string} id              '4-3-3'
 * @property {'analysis'|'planned'} status
 * @property {string} family          'back4' | 'back3'
 * @property {string} summary         一文要約
 * @property {Slot[]} slots
 * @property {Shape[]} shapes
 * @property {Object} facts           幅・深さ・中央密度など（level 1–3 と理由）
 * @property {Object} phases          buildUp / progression / finalThird / highPress / midBlock / lowBlock / attTransition / defTransition / restDefence
 * @property {Object[]} roles
 * @property {Object[]} strengths     { title, why }
 * @property {Object[]} weaknesses    { title, why }
 * @property {Object} variations      { ip: [], oop: [] }
 * @property {string[]} sources
 *
 * @typedef {Object} Mechanism        因果の1単位。テキストは {A} {B} トークンで両視点に対応
 * @property {string} id
 * @property {'A'|'B'} attacker       この現象で「攻める（ボールを持つ／奪った）」側
 * @property {'buildup'|'progression'|'final'|'wide'|'press'|'block'|'transition'|'setpiece'} phase
 * @property {string} title
 * @property {string} premise         前提条件
 * @property {string} setup           選手配置
 * @property {string} phenomenon      戦術的な現象
 * @property {string} aim             狙い（attacker 側）
 * @property {string} counter         相手の対策（守る側）
 * @property {string} [readjust]      さらに攻める側の再調整
 * @property {string} [exception]     成立しないケース
 * @property {'F'|'P'|'I'} evidence   F=出典で確認できる事実/定義, P=一般的な戦術原則, I=条件付きの構造的推論
 * @property {string[]} sources
 * @property {string} [scene]         図のシーン id
 *
 * @typedef {Object} Overlay
 * @property {'zone'|'pass'|'run'|'press'|'shadow'|'mark'|'free'|'count'|'danger'|'note'} t
 *
 * @typedef {Object} Scene
 * @property {string} id
 * @property {'overview'|'ip'|'tr'|'adjust'} tab
 * @property {'A'|'B'|null} poss      ip: 保持側 / tr: 奪った側 / adjust: 修正する側
 * @property {string} title
 * @property {string} short           タブ内ピルの短い名前
 * @property {string} caption
 * @property {string|[number,number]} [ball]
 * @property {{A: TeamSpec, B: TeamSpec}} teams
 * @property {Overlay[]} overlays
 *
 * @typedef {Object} TeamSpec
 * @property {string} from            shape id
 * @property {[number,number]} [shift] シーン座標での平行移動
 * @property {Positions} [tweak]       シーン座標での個別位置
 */

export const PITCH = { width: 68, length: 105 };

export const EVIDENCE = {
  F: { label: '出典', long: '出典で確認できる定義・研究知見' },
  P: { label: '原則', long: '指導者資料等で広く共有される戦術原則' },
  I: { label: '推論', long: '前提条件つきの構造的推論（実試合データで未検証）' },
};

export const STATUS = {
  analysis: { label: '詳細分析 β', short: '詳細β', long: '出典に基づく構造分析。人間の戦術レビュー・実試合データでの検証は未実施。' },
  stub: { label: '未整備', short: '未整備', long: '詳細分析は未作成。公称配置の重ね合わせと人数の機械的比較のみ表示。' },
  planned: { label: '準備中', short: '準備中', long: '基本配置のみ登録。分析コンテンツは未作成。' },
};

export const PHASE_LABEL = {
  buildup: 'ビルドアップ',
  progression: '前進',
  final: 'ファイナルサード',
  wide: 'サイド',
  press: 'プレス',
  block: 'ブロック守備',
  transition: 'トランジション',
  setpiece: 'セットプレー',
};

export const TABS = [
  { id: 'overview', label: '噛み合わせ' },
  { id: 'ip-self', label: '自保持' },
  { id: 'ip-opp', label: '相手保持' },
  { id: 'tr-loss', label: '攻→守' },
  { id: 'tr-win', label: '守→攻' },
  { id: 'adjust', label: '修正' },
];
