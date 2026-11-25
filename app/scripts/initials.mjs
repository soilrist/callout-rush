// Usage: npm run initials  — on the result screen, enter initials by clicking the letter pad and by keyboard, check they save + 2 captures (captures/M2-02-*.png)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4174;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`INITIALS failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
  await page.evaluate(() => document.fonts.ready);
  const d = (k) => page.evaluate((key) => document.body.dataset[key], k);
  await page.waitForFunction(() => document.body.dataset.screen === 'result');
  await page.waitForTimeout(1200); // count-up + 0.6s lock
  // Letter pad click: Z (row 3, col 7) E (row 1, col 5)
  const click = (col, row) => page.mouse.click(984 + 96 * col + 42, 640 + 96 * row + 42);
  await click(7, 2); // Z
  await click(4, 0); // E
  if ((await d('initials')) !== 'ZE') fail(`after click initials=${await d('initials')} (want ZE)`);
  await page.screenshot({ path: resolve(dir, 'M2-02-result-2letters.png') });
  await page.keyboard.press('d'); // lowercase keyboard
  await page.keyboard.press('x'); // 4th letter ignored
  if ((await d('initials')) !== 'ZED') fail(`after keyboard initials=${await d('initials')} (want ZED)`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: resolve(dir, 'M2-02-result-3letters.png') });
  await page.mouse.click(480, 890); // OK
  await page.waitForFunction(() => document.body.dataset.screen === 'board', null, { timeout: 3000 });
  if ((await d('lastName')) !== 'ZED') fail(`saved name=${await d('lastName')} (want ZED)`);
  if (errors.length) fail(`console errors ${errors.join(' | ')}`);
  console.log(`INITIALS saved name ${await d('lastName')}, console errors ${errors.length}, exit code ${code}`);
  await browser.close();
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
