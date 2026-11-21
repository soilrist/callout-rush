// 사용: npm run shot -- <state> <출력.png>   (예: npm run shot -- attract captures/M0-05.png)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const [state, out] = process.argv.slice(2);
if (!state || !out) {
  console.error('사용: npm run shot -- <state> <파일.png>');
  process.exit(1);
}
const PORT = 4173;
const outPath = resolve(process.cwd(), '..', out);
mkdirSync(dirname(outPath), { recursive: true });

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview 서버 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview 서버가 꺼졌다')));
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://localhost:${PORT}/index.html?state=${state.split('&').map((q, i) => (i === 0 ? encodeURIComponent(q) : q)).join('&')}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log(`저장: ${outPath}`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
