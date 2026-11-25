// Usage: npm run operator — Ctrl+Shift+O menu: open → export CSV (lines = records + 1) → clear today (one confirm) → today 0, total unchanged + capture captures/M2-08-operator.png (M2-08)
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4180;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`OPERATOR failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  const errors = [];
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const mk = (i, ts) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + i), score: 9000 - i * 500, acc: 0.9, avgRt: 500 + i, streak: 5, ts });
    // 4 from yesterday (36 hours ago so it is before today's midnight) + 3 from today
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
  if (before.all !== 7 || before.today !== 3) fail(`unexpected starting records ${JSON.stringify(before)}`);
  if ((await page.locator('#operator').isVisible())) fail('menu was open from the start');
  await page.keyboard.press('Control+Shift+O');
  await page.waitForFunction(() => document.body.dataset.operator === '1');
  const items = await page.locator('#operator button').allTextContents();
  const want = ['Open leaderboard window', 'Fullscreen', 'Mute', 'Export scores (CSV)', "Clear today's scores", 'Booth health', 'Close'];
  if (JSON.stringify(items) !== JSON.stringify(want)) fail(`items ${JSON.stringify(items)}`);
  await page.getByText('Booth health').click();
  const health = await page.locator('.op-health').innerText();
  if (!/Games since start\s+0/.test(health) || !/Errors\s+0/.test(health)) fail(`health ${health}`);
  await page.screenshot({ path: resolve(dir, 'M2-08-operator.png') });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByText('Export scores (CSV)').click()]);
  const path = await dl.path();
  const lines = readFileSync(path, 'utf8').trim().split(/\r?\n/);
  if (lines.length !== before.all + 1) fail(`CSV lines ${lines.length}`);
  await page.getByText("Clear today's scores").click();
  const ask = await page.locator('.op-msg').innerText();
  if (!ask.includes('This cannot be undone')) fail(`confirm text ${ask}`);
  if ((await counts()).today !== 3) fail('cleared before confirm');
  await page.screenshot({ path: resolve(dir, 'M2-08-operator-confirm.png') });
  await page.getByText('Yes, clear').click();
  const after = await counts();
  if (after.today !== 0 || after.all !== 4) fail(`after clear ${JSON.stringify(after)}`);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.body.dataset.operator === '0');
  // After clearing, the attract screen must show no records for today (a person checks the capture)
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(dir, 'M2-08-attract-after-clear.png') });
  console.log(`OPERATOR ok: items ${items.length}, CSV lines ${lines.length} = records ${before.all} + 1, clear today ${before.today} → ${after.today} total ${before.all} → ${after.all}, console errors ${errors.length}`);
  if (errors.length) fail(errors.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
