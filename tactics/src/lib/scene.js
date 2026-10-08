// シーン定義（shape参照＋差分）を、描画可能な選手座標とオーバーレイに解決する。
import { PITCH } from '../data/schema.js';

export const PLAYER_MIN_GAP_M = 5.4; // 図中で選手記号が重ならない中心間距離（m）

export function shapeOf(formation, shapeId) {
  const s = formation.shapes.find((sh) => sh.id === shapeId);
  if (!s) throw new Error(`shape not found: ${formation.id} ${shapeId}`);
  return s;
}

/** チーム座標 → シーン座標（A は上向き、B は 180° 回転） */
export function toScene(team, [x, y]) {
  return team === 'A' ? [x, y] : [100 - x, 100 - y];
}

export function metersBetween([x1, y1], [x2, y2]) {
  const dx = ((x2 - x1) / 100) * PITCH.width;
  const dy = ((y2 - y1) / 100) * PITCH.length;
  return Math.hypot(dx, dy);
}

function resolveTeam(team, formation, spec) {
  const shape = shapeOf(formation, spec.from || 'base');
  const [sx, sy] = spec.shift || [0, 0];
  const players = formation.slots.map((slot) => {
    const raw = shape.pos[slot.id];
    if (!raw) throw new Error(`position missing: ${formation.id} ${shape.id} ${slot.id}`);
    let [x, y] = toScene(team, raw);
    x += sx;
    y += sy;
    const pinned = !!(spec.tweak && spec.tweak[slot.id]);
    if (pinned) [x, y] = spec.tweak[slot.id];
    return { key: `${team}:${slot.id}`, team, id: slot.id, label: slot.label, name: slot.name, x, y, pinned };
  });
  return players;
}

/**
 * 点の参照を解決する。
 *   'A:DM'                → 選手位置
 *   [x, y]                → シーン座標
 *   { p: 'A:DM', d: [dx, dy] } → 選手位置からのオフセット
 */
export function resolvePoint(ref, byKey) {
  if (Array.isArray(ref)) return { pt: ref, player: null };
  if (typeof ref === 'string') {
    const pl = byKey[ref];
    if (!pl) throw new Error(`unknown player ref: ${ref}`);
    return { pt: [pl.x, pl.y], player: pl };
  }
  if (ref && typeof ref === 'object' && ref.p) {
    const pl = byKey[ref.p];
    if (!pl) throw new Error(`unknown player ref: ${ref.p}`);
    const [dx, dy] = ref.d || [0, 0];
    return { pt: [pl.x + dx, pl.y + dy], player: null };
  }
  throw new Error(`bad point ref: ${JSON.stringify(ref)}`);
}

/** オーバーレイの主体チーム（矢印の色など）を決める */
function teamOfRef(ref) {
  if (typeof ref === 'string') return ref.slice(0, 1);
  if (ref && typeof ref === 'object' && ref.p) return ref.p.slice(0, 1);
  return null;
}

export function resolveScene(formations, matchup, scene, { relax = false } = {}) {
  const fA = formations[matchup.teams.A];
  const fB = formations[matchup.teams.B];
  let players = [
    ...resolveTeam('A', fA, scene.teams?.A || { from: 'base' }),
    ...resolveTeam('B', fB, scene.teams?.B || { from: 'base' }),
  ];
  if (relax) players = relaxPositions(players);
  const byKey = Object.fromEntries(players.map((p) => [p.key, p]));

  const overlays = (scene.overlays || []).map((o) => {
    const r = { ...o };
    switch (o.t) {
      case 'pass':
      case 'run':
      case 'press':
      case 'shadow': {
        const a = resolvePoint(o.from, byKey);
        const b = resolvePoint(o.to, byKey);
        r.a = a.pt;
        r.b = b.pt;
        r.aPlayer = a.player;
        r.bPlayer = b.player;
        r.team = o.team || teamOfRef(o.from) || 'N';
        break;
      }
      case 'mark': {
        r.a = resolvePoint(o.a, byKey).pt;
        r.b = resolvePoint(o.b, byKey).pt;
        r.aKey = o.a;
        r.bKey = o.b;
        break;
      }
      case 'free': {
        const p = resolvePoint(o.who, byKey);
        r.at = p.pt;
        r.player = p.player;
        r.team = teamOfRef(o.who);
        break;
      }
      case 'count':
      case 'danger':
      case 'note': {
        r.at = resolvePoint(o.at, byKey).pt;
        break;
      }
      case 'zone':
        r.team = o.team || 'N';
        break;
      default:
        throw new Error(`unknown overlay type: ${o.t}`);
    }
    return r;
  });

  let ball = null;
  if (scene.ball) ball = resolvePoint(scene.ball, byKey);
  return { players, byKey, overlays, ball };
}

/**
 * 重なった選手を最小限だけ押し離す。
 * tweak で位置を指定した選手（pinned）は動かさず、相手側だけを動かす。
 * シーンに relax: true を付けると、形（shape）同士の機械的な重なりを自動で解消できる。
 */
export function relaxPositions(players, gap = PLAYER_MIN_GAP_M + 0.25) {
  const ps = players.map((p) => ({ ...p }));
  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i];
        const b = ps[j];
        const d = metersBetween([a.x, a.y], [b.x, b.y]);
        if (d < gap) {
          const push = (gap - d) / 2 + 0.05;
          let ux = ((b.x - a.x) / 100) * PITCH.width;
          let uy = ((b.y - a.y) / 100) * PITCH.length;
          const len = Math.hypot(ux, uy) || 1;
          if (len < 0.01) { ux = 1; uy = 0; } else { ux /= len; uy /= len; }
          // 主に横方向へ逃がす（縦の配置＝ラインの高さを保つ）
          const hx = (ux * push * 1.0 * 100) / PITCH.width;
          const hy = (uy * push * 0.6 * 100) / PITCH.length;
          // pinned 側は動かさず、もう一方を2倍動かす
          const wa = a.pinned && !b.pinned ? 0 : b.pinned && !a.pinned ? 2 : 1;
          const wb = 2 - wa;
          a.x -= hx * wa; a.y -= hy * wa; b.x += hx * wb; b.y += hy * wb;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  for (const p of ps) {
    p.x = Math.min(98, Math.max(2, p.x));
    p.y = Math.min(99, Math.max(1, p.y));
  }
  return ps;
}

export function overlappingPairs(players, gap = PLAYER_MIN_GAP_M) {
  const out = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const d = metersBetween([players[i].x, players[i].y], [players[j].x, players[j].y]);
      if (d < gap) out.push([players[i].key, players[j].key, d]);
    }
  }
  return out;
}
