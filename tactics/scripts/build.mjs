// 単一HTMLへのビルド。
//   dist/index.html     … そのままブラウザ／GitHub Pages で開ける完全なHTML
//   dist/artifact.html  … claude.ai Artifact 用（doctype/html/head/body を含まない本文のみ）
import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => path.join(root, p);

const js = await build({
  entryPoints: [r('src/main.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2019', 'safari13'],
  write: false,
  legalComments: 'none',
  charset: 'utf8',
});
const jsText = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const cssSrc = await readFile(r('src/styles.css'), 'utf8');
const css = (await transform(cssSrc, { loader: 'css', minify: true, target: ['safari13', 'chrome90'] })).code;
const tpl = await readFile(r('src/index.html'), 'utf8');
const body = tpl.replace('/*__CSS__*/', () => css).replace('/*__JS__*/', () => jsText);

const full = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${body.split('<div id="app"')[0].trim()}
</head>
<body>
<div id="app"${body.split('<div id="app"')[1]}
</body>
</html>
`;

await mkdir(r('dist'), { recursive: true });
await writeFile(r('dist/index.html'), full);
await writeFile(r('dist/artifact.html'), body);
const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`dist/index.html ${kb(full)} KB (js ${kb(jsText)} KB, css ${kb(css)} KB)`);
