// グローバルにインストール済みの Playwright を読み込む（プロジェクト依存に追加しない）
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
  try { pw = require(p); break; } catch { /* next */ }
}
if (!pw) throw new Error('playwright が見つかりません');
export const { chromium } = pw;
