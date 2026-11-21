// 사용: npm run polish — 화면 7장을 1920×1080·1280×720·2560×1080 창으로 찍는다(captures/M2-18/). 마지막 줄 `POLISH ...`
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4176;
const out = resolve(process.cwd(), '..', 'captures/M2-18');
mkdirSync(out, { recursive: true });
const SIZES = [[1920, 1080], [1280, 720], [2560, 1080]];
const SCREENS = [
  ['attract', 'index.html?state=attract'],
  ['countdown', 'index.html?state=play&seed=5&at=1000'],
  ['play-warm', 'index.html?state=play&seed=5&at=9000'],
  ['play-clutch', 'index.html?state=play&seed=5&at=52000'],
  ['result', 'index.html?state=result&seed=7'],
  ['board', 'board.html'],
  ['operator', 'index.html?state=attract'],
];
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', ...(process.env.POLISH_DIST ? ['--outDir', process.env.POLISH_DIST] : [])], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview 서버 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview 서버가 꺼졌다')));
  });
  const browser = await chromium.launch();
  let n = 0;
  const errors = [];
  for (const [w, h] of SIZES) {
    for (const [name, url] of SCREENS) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(`http://localhost:${PORT}/${url}`);
      await page.evaluate(() => document.fonts.ready);
      if (name === 'operator') await page.keyboard.press('Control+Shift+O');
      await page.waitForTimeout(600);
      await page.screenshot({ path: resolve(out, `${name}-${w}x${h}.png`) });
      await page.close();
      n += 1;
    }
  }
  await browser.close();
  console.log(`POLISH 캡처 ${n}장, 페이지 오류 ${errors.length}`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
