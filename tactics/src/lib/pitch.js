// 縦向きピッチのSVGレンダラー。自チームは常に下から上へ攻める向きで描く。
// 色はCSS変数（--self / --opp など）で与え、形（●/■）、線種、ラベルを併用して色だけに頼らない。
import { esc } from './text.js';

const U = 10; // 1m = 10 SVG units
const W = 68 * U;
const L = 105 * U;
const R = 26; // 選手記号の半径

// 共有 defs（マーカー・ハッチ）はページに1回だけ置く
export function sharedDefs() {
  const head = (id, cls, open = false) =>
    open
      ? `<marker id="${id}" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path class="${cls}" d="M1,1 L10,6 L1,11" fill="none" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></marker>`
      : `<marker id="${id}" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="${cls}" d="M0,0 L12,6 L0,12 z"/></marker>`;
  const hatch = (id, cls) =>
    `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="14" height="14" class="${cls}-bg"/><line x1="0" y1="0" x2="0" y2="14" class="${cls}-ln" stroke-width="4"/></pattern>`;
  return `<svg class="svg-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
${head('ah-self', 'mk-self')}${head('ah-opp', 'mk-opp')}${head('ah-n', 'mk-n')}
${head('ap-self', 'mks-self', true)}${head('ap-opp', 'mks-opp', true)}
${hatch('hz-self', 'hz-self')}${hatch('hz-opp', 'hz-opp')}${hatch('hz-n', 'hz-n')}
<clipPath id="cp-pitch" clipPathUnits="userSpaceOnUse"><rect x="-6" y="-6" width="${W + 12}" height="${L + 12}"/></clipPath>
</defs></svg>`;
}

function pitchMarkup() {
  const pa = { w: 40.32 * U, d: 16.5 * U };
  const ga = { w: 18.32 * U, d: 5.5 * U };
  const cx = W / 2;
  const stripes = Array.from({ length: 10 }, (_, i) =>
    i % 2 ? `<rect x="0" y="${(i * L) / 10}" width="${W}" height="${L / 10}" class="stripe"/>` : '',
  ).join('');
  const arcR = 9.15 * U;
  const spot = 11 * U;
  // PA の外に出る弧（ペナルティアーク）
  const dy = pa.d - spot; // 5.5m
  const dx = Math.sqrt(arcR * arcR - dy * dy);
  const box = (top) => {
    const s = top ? 1 : -1;
    const y0 = top ? 0 : L;
    return `
      <rect x="${cx - pa.w / 2}" y="${top ? 0 : L - pa.d}" width="${pa.w}" height="${pa.d}"/>
      <rect x="${cx - ga.w / 2}" y="${top ? 0 : L - ga.d}" width="${ga.w}" height="${ga.d}"/>
      <circle cx="${cx}" cy="${y0 + s * spot}" r="4" class="spot"/>
      <path d="M ${cx - dx} ${y0 + s * pa.d} A ${arcR} ${arcR} 0 0 ${top ? 0 : 1} ${cx + dx} ${y0 + s * pa.d}"/>
      <rect x="${cx - 3.66 * U}" y="${top ? -1.8 * U : L}" width="${7.32 * U}" height="${1.8 * U}" class="goal"/>`;
  };
  return `<g class="pitch">
    <rect x="0" y="0" width="${W}" height="${L}" class="turf"/>${stripes}
    <g class="lines">
      <rect x="0" y="0" width="${W}" height="${L}"/>
      <line x1="0" y1="${L / 2}" x2="${W}" y2="${L / 2}"/>
      <circle cx="${cx}" cy="${L / 2}" r="${arcR}"/>
      <circle cx="${cx}" cy="${L / 2}" r="4" class="spot"/>
      ${box(true)}${box(false)}
    </g>
  </g>`;
}

function lanesMarkup() {
  const xs = [20.35, 36.53, 63.47, 79.65].map((p) => (p / 100) * W);
  const ys = [L / 3, (2 * L) / 3];
  return `<g class="layer l-lanes">${xs
    .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${L}"/>`)
    .join('')}${ys.map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="third"/>`).join('')}</g>`;
}

/** 文字幅の概算（全角1em、半角0.58em） */
function textWidth(str, size) {
  let w = 0;
  for (const ch of String(str)) w += ch.charCodeAt(0) > 255 ? size : size * 0.58;
  return w;
}

function pillWidth(text, size) {
  return textWidth(text, size) + size * 0.9;
}

function pill(x, y, text, cls, size = 22) {
  const w = pillWidth(text, size);
  const h = size * 1.45;
  return `<g class="pill ${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><rect x="${(-w / 2).toFixed(1)}" y="${(-h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}"/><text y="${(size * 0.36).toFixed(1)}" font-size="${size}">${esc(text)}</text></g>`;
}

export function renderPitch(opts) {
  const {
    players = [],
    overlays = [],
    ball = null,
    self = 'A',
    labels = null,
    markers = [],
    title = '',
    desc = '',
    idPrefix = 'p',
    compact = false,
    lanes = false,
  } = opts;
  const flip = self === 'B';
  const side = (team) => (team === 'N' || !team ? 'n' : team === self ? 'self' : 'opp');
  const P = ([x, y]) => {
    const sx = flip ? 100 - x : x;
    const sy = flip ? y : 100 - y;
    return [(sx / 100) * W, (sy / 100) * L];
  };
  const f = (n) => n.toFixed(1);

  const g = { zone: [], shadow: [], mark: [], move: [], press: [], free: [], count: [], danger: [], note: [] };

  for (const o of overlays) {
    switch (o.t) {
      case 'zone': {
        const [cx, cy] = P(o.c);
        const w = (o.w / 100) * W;
        const h = (o.h / 100) * L;
        const s = side(o.team);
        const x0 = cx - w / 2;
        const y0 = cy - h / 2;
        g.zone.push(
          `<g class="zone z-${s}"><rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="16" fill="url(#hz-${s})"/>${
            o.label ? pill(cx, o.lpos === 'b' ? y0 + h - 4 : o.lpos === 'c' ? cy : y0 + 4, o.label, `zl-${s}`, 20) : ''
          }</g>`,
        );
        break;
      }
      case 'shadow': {
        const [ax, ay] = P(o.a);
        const [bx, by] = P(o.b);
        const len = Math.hypot(bx - ax, by - ay) + 45;
        const ang = Math.atan2(by - ay, bx - ax);
        const half = (o.spread || 13) * (Math.PI / 180);
        const p1 = [ax + Math.cos(ang - half) * len, ay + Math.sin(ang - half) * len];
        const p2 = [ax + Math.cos(ang + half) * len, ay + Math.sin(ang + half) * len];
        g.shadow.push(`<path class="shadow s-${side(o.team)}" d="M${f(ax)},${f(ay)} L${f(p1[0])},${f(p1[1])} L${f(p2[0])},${f(p2[1])} Z"/>`);
        break;
      }
      case 'mark': {
        const [ax, ay] = P(o.a);
        const [bx, by] = P(o.b);
        g.mark.push(`<line class="mark" x1="${f(ax)}" y1="${f(ay)}" x2="${f(bx)}" y2="${f(by)}"/>`);
        break;
      }
      case 'pass':
      case 'run':
      case 'press': {
        let [ax, ay] = P(o.a);
        let [bx, by] = P(o.b);
        const d = Math.hypot(bx - ax, by - ay) || 1;
        const ux = (bx - ax) / d;
        const uy = (by - ay) / d;
        if (o.aPlayer) { ax += ux * (R + 4); ay += uy * (R + 4); }
        if (o.bPlayer) { bx -= ux * (R + 9); by -= uy * (R + 9); }
        const s = side(o.team);
        const cls = `arr ${o.t} a-${s}`;
        const marker = o.t === 'press' ? `ap-${s === 'n' ? 'self' : s}` : `ah-${s}`;
        let dpath;
        let mx = (ax + bx) / 2;
        let my = (ay + by) / 2;
        if (o.curve) {
          const nx = -uy;
          const ny = ux;
          const k = o.curve * d;
          const qx = mx + nx * k;
          const qy = my + ny * k;
          dpath = `M${f(ax)},${f(ay)} Q${f(qx)},${f(qy)} ${f(bx)},${f(by)}`;
          mx = 0.25 * ax + 0.5 * qx + 0.25 * bx;
          my = 0.25 * ay + 0.5 * qy + 0.25 * by;
        } else {
          dpath = `M${f(ax)},${f(ay)} L${f(bx)},${f(by)}`;
        }
        const el = `<path class="${cls}" d="${dpath}" marker-end="url(#${marker})"/>${o.label ? pill(mx, my, o.label, `al-${s}`, 19) : ''}`;
        (o.t === 'press' ? g.press : g.move).push(el);
        break;
      }
      case 'free': {
        const [x, y] = P(o.at);
        const s = side(o.team);
        const lab = o.label || 'フリー';
        const pw = pillWidth(lab, 19);
        const pos = {
          t: [x, y - R - 30],
          b: [x, y + R + 30],
          r: [x + R + 18 + pw / 2, y],
          l: [x - R - 18 - pw / 2, y],
        }[o.lpos || 't'];
        g.free.push(
          `<g class="free f-${s}"><circle cx="${f(x)}" cy="${f(y)}" r="${R + 15}"/>${pill(pos[0], pos[1], lab, `fl-${s}`, 19)}</g>`,
        );
        break;
      }
      case 'count': {
        const [x, y] = P(o.at);
        // a = A側の人数, b = B側の人数。視点（self）側を先に表示する
        const mine = self === 'A' ? o.a : o.b;
        const theirs = self === 'A' ? o.b : o.a;
        const diff = mine - theirs;
        const sign = diff > 0 ? `+${diff}` : diff < 0 ? `−${-diff}` : '=';
        const s = diff > 0 ? 'self' : diff < 0 ? 'opp' : 'n';
        const main = `${mine}v${theirs}`;
        const rawLab = o.label && typeof o.label === 'object' ? o.label[self] : o.label;
        const lab = rawLab ? `${rawLab} ` : '';
        const text = `${lab}${main}${o.note ? ` ${o.note}` : ''}`;
        const size = 21;
        const w1 = textWidth(text, size) + 18;
        const w2 = textWidth(sign, size) + 16;
        const h = size * 1.5;
        const x0 = x - (w1 + w2) / 2;
        g.count.push(
          `<g class="count c-${s}" transform="translate(${f(x0)},${f(y - h / 2)})"><rect class="c-main" width="${f(w1)}" height="${f(h)}" rx="7"/><text x="${f(w1 / 2)}" y="${f(h / 2 + size * 0.36)}" font-size="${size}">${esc(text)}</text><rect class="c-sign" x="${f(w1)}" width="${f(w2)}" height="${f(h)}" rx="7"/><text class="c-sign-t" x="${f(w1 + w2 / 2)}" y="${f(h / 2 + size * 0.36)}" font-size="${size}">${esc(sign)}</text></g>`,
        );
        break;
      }
      case 'danger': {
        const [x, y] = P(o.at);
        g.danger.push(
          `<g class="danger" transform="translate(${f(x)},${f(y)})"><path d="M0,-27 L25,18 L-25,18 Z"/><text y="12" font-size="26">!</text>${
            o.label ? pill(0, 42, o.label, 'dl', 19) : ''
          }</g>`,
        );
        break;
      }
      case 'note': {
        const [x, y] = P(o.at);
        g.note.push(pill(x, y, o.text, 'note', 19));
        break;
      }
      default:
        break;
    }
  }

  const playerEls = players
    .map((p) => {
      const [x, y] = P([p.x, p.y]);
      const s = side(p.team);
      const label = esc(p.label);
      const fs = p.label.length >= 3 ? 18 : 22;
      const shape =
        s === 'self'
          ? `<circle r="${R}"/>`
          : `<rect x="${-R + 2}" y="${-R + 2}" width="${2 * R - 4}" height="${2 * R - 4}" rx="9"/>`;
      return `<g class="pl p-${s}" data-key="${p.key}" transform="translate(${f(x)},${f(y)})">${shape}<text y="${(fs * 0.36).toFixed(1)}" font-size="${fs}">${label}</text></g>`;
    })
    .join('');

  let ballEl = '';
  if (ball) {
    const [bx, by] = P(ball.pt);
    const off = ball.player ? [R - 2, -R + 2] : [0, 0];
    ballEl = `<g class="ball" transform="translate(${f(bx + off[0])},${f(by + off[1])})"><circle r="10"/><path d="M-6,-3 L0,-7 L6,-3 L4,4 L-4,4 Z"/></g>`;
  }

  const markerEls = markers
    .map((m) => {
      const [x, y] = P(m.at);
      return `<g class="qmark" transform="translate(${f(x)},${f(y)})"><circle r="23"/><text y="9" font-size="26">${m.n}</text></g>`;
    })
    .join('');

  let teamLabels = '';
  if (labels && !compact) {
    const bottomY = L + 46;
    const topY = -26;
    const selfMark = `<circle class="lg-self" cx="10" cy="-8" r="10"/>`;
    const oppMark = `<rect class="lg-opp" x="0" y="-18" width="20" height="20" rx="4"/>`;
    teamLabels = `<g class="teamlabels">
      <g transform="translate(0,${bottomY})">${selfMark}<text x="30" y="0" class="tl-self">${esc(labels.self)}</text><text x="${W}" y="0" text-anchor="end" class="tl-dir">▲ 攻撃方向</text></g>
      ${labels.opp ? `<g transform="translate(0,${topY})">${oppMark}<text x="30" y="0" class="tl-opp">${esc(labels.opp)}</text><text x="${W}" y="0" text-anchor="end" class="tl-dir">▼ 攻撃方向</text></g>` : ''}
    </g>`;
  }

  const pad = compact ? 14 : 30;
  const top = compact ? 14 : 62;
  const bottom = compact ? 14 : 70;
  const vb = `${-pad} ${-top} ${W + 2 * pad} ${L + top + bottom}`;
  const tId = `${idPrefix}-t`;
  const dId = `${idPrefix}-d`;
  return `<svg class="pitch-svg${compact ? ' compact' : ''}${lanes ? ' show-lanes' : ''}" viewBox="${vb}" role="img" aria-labelledby="${tId} ${dId}" preserveAspectRatio="xMidYMid meet">
<title id="${tId}">${esc(title)}</title><desc id="${dId}">${esc(desc)}</desc>
${pitchMarkup()}${lanesMarkup()}
<g class="layer l-zone">${g.zone.join('')}</g>
<g class="layer l-press" clip-path="url(#cp-pitch)">${g.shadow.join('')}</g>
<g class="layer l-mark">${g.mark.join('')}</g>
<g class="layer l-move">${g.move.join('')}</g>
<g class="layer l-press">${g.press.join('')}</g>
<g class="layer l-free">${g.free.filter(() => true).join('')}</g>
<g class="players">${playerEls}</g>${ballEl}
<g class="layer l-count">${g.count.join('')}</g>
<g class="layer l-danger">${g.danger.join('')}</g>
<g class="layer l-note">${g.note.join('')}</g>
<g class="layer l-marker">${markerEls}</g>
${teamLabels}
</svg>`;
}

export const PITCH_UNITS = { W, L, R };
