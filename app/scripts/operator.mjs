// 사용: npm run operator — Ctrl+Shift+O 메뉴: 열기 → CSV 내보내기(줄 수 = 기록 수 + 1) → 오늘 지우기(확인 한 번) → 오늘 0건·전체 그대로 + 캡처 captures/M2-08-operator.png (M2-08)
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4180;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`OPERATOR 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  const errors = [];
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const mk = (i, ts) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + i), score: 9000 - i * 500, acc: 0.9, avgRt: 500 + i, streak: 5, ts });
    // 어제 4건(오늘 자정 전이 되도록 36시간 전) + 오늘 3건
    const list = [0, 1, 2, 3].map((i) => mk(i, now - 36 * 3_600_000 - i * 1000)).concat([4, 5, 6].map((i) => mk(i, now - 1000 * i)));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?seed=3`);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  const counts = () => page.evaluate(() => {
    const l = JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]');
    const start = new Date().setHours(0, 0, 0, 0);
    return { all: l.length, today: l.filter((e) => e.ts >= start).length };
  });
  const before = await counts();
  if (before.all !== 7 || before.today !== 3) fail(`시작 기록 이상 ${JSON.stringify(before)}`);
  if ((await page.locator('#operator').isVisible())) fail('메뉴가 처음부터 열려 있음');
  await page.keyboard.press('Control+Shift+O');
  await page.waitForFunction(() => document.body.dataset.operator === '1');
  const items = await page.locator('#operator button').allTextContents();
  const want = ['Open leaderboard window', 'Fullscreen', 'Mute', 'Export scores (CSV)', "Clear today's scores", 'Booth health', 'Close'];
  if (JSON.stringify(items) !== JSON.stringify(want)) fail(`항목 ${JSON.stringify(items)}`);
  await page.getByText('Booth health').click();
  const health = await page.locator('.op-health').innerText();
  if (!/Games since start\s+0/.test(health) || !/Errors\s+0/.test(health)) fail(`health ${health}`);
  await page.screenshot({ path: resolve(dir, 'M2-08-operator.png') });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByText('Export scores (CSV)').click()]);
  const path = await dl.path();
  const lines = readFileSync(path, 'utf8').trim().split(/\r?\n/);
  if (lines.length !== before.all + 1) fail(`CSV 줄 ${lines.length}`);
  await page.getByText("Clear today's scores").click();
  const ask = await page.locator('.op-msg').innerText();
  if (!ask.includes('This cannot be undone')) fail(`확인 문구 ${ask}`);
  if ((await counts()).today !== 3) fail('확인 전에 지워짐');
  await page.screenshot({ path: resolve(dir, 'M2-08-operator-confirm.png') });
  await page.getByText('Yes, clear').click();
  const after = await counts();
  if (after.today !== 0 || after.all !== 4) fail(`지운 뒤 ${JSON.stringify(after)}`);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.body.dataset.operator === '0');
  // 지운 뒤 대기 화면에 오늘 기록이 없어야 한다 (캡처로 사람이 대조)
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(dir, 'M2-08-attract-after-clear.png') });
  console.log(`OPERATOR ok: 항목 ${items.length}개, CSV 줄 ${lines.length} = 기록 ${before.all} + 1, 지우기 오늘 ${before.today} → ${after.today} 전체 ${before.all} → ${after.all}, 콘솔 오류 ${errors.length}`);
  if (errors.length) fail(errors.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
