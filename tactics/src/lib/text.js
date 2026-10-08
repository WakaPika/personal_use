export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * {A} {B} トークンを視点つきのチーム表記に置き換える。
 * ctx = { A: '4-3-3', B: '4-4-2', self: 'A' }
 * 自チームは●、相手は■の記号を前に付け、色だけに依存しない。
 */
export function fmt(text, ctx) {
  const safe = esc(text);
  if (!ctx) return safe;
  return safe.replace(/\{(A|B)\}/g, (_, t) => teamTag(t, ctx));
}

export function teamTag(t, ctx) {
  const isSelf = t === ctx.self;
  const label = ctx[t];
  return `<span class="tm ${isSelf ? 'tm-self' : 'tm-opp'}"><i aria-hidden="true"></i>${esc(label)}<span class="sr">${isSelf ? '（自チーム）' : '（相手）'}</span></span>`;
}

/** プレーンテキスト化（SVGの desc や aria 用） */
export function plain(text, ctx) {
  if (!ctx) return String(text ?? '');
  return String(text ?? '').replace(/\{(A|B)\}/g, (_, t) => `${t === ctx.self ? '自' : '相手'}${ctx[t]}`);
}
