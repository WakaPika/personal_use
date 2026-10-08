// 小さなUI部品（アイコン、チップ、出典リンク）
import { esc } from './text.js';
import { sourceById } from '../data/sources.js';
import { EVIDENCE, STATUS } from '../data/schema.js';

const path = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;

export const icon = {
  compare: path('M7 4v16M17 4v16M3 8h8M13 16h8'),
  systems: path('M4 4h16v16H4zM4 12h16M12 4v16'),
  glossary: path('M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4'),
  sources: path('M6 3h9l4 4v14H6zM9 10h7M9 14h7M9 18h5'),
  swap: path('M7 7h11l-3-3M17 17H6l3 3'),
  chevron: path('M7 10l5 5 5-5'),
  close: path('M6 6l12 12M18 6L6 18'),
  layers: path('M12 4l9 5-9 5-9-5zM3 14l9 5 9-5'),
  arrowRight: path('M5 12h14M13 6l6 6-6 6'),
  external: path('M14 4h6v6M20 4l-9 9M18 14v6H4V6h6'),
  search: path('M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l5 5'),
};

export function statusChip(status) {
  const s = STATUS[status] || STATUS.stub;
  return `<span class="chip st st-${status}" title="${esc(s.long)}"><i aria-hidden="true"></i>${esc(s.label)}</span>`;
}

export function evidenceChip(ev) {
  const e = EVIDENCE[ev] || EVIDENCE.I;
  return `<span class="chip ev ev-${ev}" title="${esc(e.long)}">${esc(e.label)}</span>`;
}

export function sourceLinks(ids = []) {
  const list = ids.map((id) => sourceById[id]).filter(Boolean);
  if (!list.length) return '';
  return `<ul class="src-inline">${list
    .map((s) => {
      const t = `${s.by}「${s.title}」`;
      return `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(t)}</a>` : esc(t)}</li>`;
    })
    .join('')}</ul>`;
}

export function countText(a, b) {
  const d = a - b;
  const sign = d > 0 ? `+${d}` : d < 0 ? `−${-d}` : '=';
  const cls = d > 0 ? 'self' : d < 0 ? 'opp' : 'n';
  return `<span class="cnt cnt-${cls}"><b>${a}v${b}</b><i>${sign}</i></span>`;
}
