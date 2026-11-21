// 사용: npm run initials  — 결과 화면에서 글자판 클릭·키보드로 이니셜을 넣고 저장되는지 + 캡처 2장 (captures/M2-02-*.png)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4174;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`INITIALS 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
  await page.evaluate(() => document.fonts.ready);
  const d = (k) => page.evaluate((key) => document.body.dataset[key], k);
  await page.waitForFunction(() => document.body.dataset.screen === 'result');
  await page.waitForTimeout(1200); // 카운트업 + 0.6초 잠금
  // 글자판 클릭: Z(줄3·칸 7) E(줄1·칸 5)
  const click = (col, row) => page.mouse.click(984 + 96 * col + 42, 640 + 96 * row + 42);
  await click(7, 2); // Z
  await click(4, 0); // E
  if ((await d('initials')) !== 'ZE') fail(`클릭 뒤 initials=${await d('initials')} (ZE 여야)`);
  await page.screenshot({ path: resolve(dir, 'M2-02-result-2letters.png') });
  await page.keyboard.press('d'); // 소문자 키보드
  await page.keyboard.press('x'); // 4글자째 무시
  if ((await d('initials')) !== 'ZED') fail(`키보드 뒤 initials=${await d('initials')} (ZED 여야)`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: resolve(dir, 'M2-02-result-3letters.png') });
  await page.mouse.click(480, 890); // OK
  await page.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 3000 });
  if ((await d('lastName')) !== 'ZED') fail(`저장 이름=${await d('lastName')} (ZED 여야)`);
  if (errors.length) fail(`콘솔 오류 ${errors.join(' | ')}`);
  console.log(`INITIALS 저장 이름 ${await d('lastName')}, 콘솔 오류 ${errors.length}, 종료코드 ${code}`);
  await browser.close();
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
