// 사용: npm run fxshot -- <hit|wrong> <출력.png>   — 진짜 플레이(느린 시계)에서 클릭 직후 화면을 찍는다. 먼저 `vite build`.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const [kind, out] = process.argv.slice(2);
if (!['hit', 'wrong'].includes(kind) || !out) {
  console.error('사용: npm run fxshot -- <hit|wrong> <파일.png>');
  process.exit(1);
}
const PORT = 4175;
const outPath = resolve(process.cwd(), '..', out);
mkdirSync(dirname(outPath), { recursive: true });
const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
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
  // 시계를 0.15배로 늦춰, 150ms 번쩍도 캡처가 잡을 수 있게 한다
  await page.goto(`http://localhost:${PORT}/index.html?state=play&seed=7&timescale=0.15`);
  await page.waitForFunction(() => document.body.dataset.target, null, { timeout: 40000 });
  if (kind === 'hit') {
    const [mx, my] = ZONES[await page.locator('body').getAttribute('data-target')];
    await page.mouse.click(60 + mx * 0.96, 60 + my * 0.96);
  } else {
    await page.mouse.click(60 + 990 * 0.96, 60 + 10 * 0.96);
  }
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
