// Usage: npm run demo — attract-screen demo (M2-06): with timescale=30 the demo starts after 20s → 0 scores saved during the demo → a click goes to Countdown. Captures captures/M2-06-*.png
// Output: `DEMO rows N → demo started …, saved during demo 0, after click …, console errors 0` (exit 1 on failure)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4178;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`DEMO failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const list = [9100, 8200, 7300].map((score, i) => ({ id: `s${i}`, name: ['AAA', 'BOB', 'CYD'][i], score, acc: 90, avgRt: 500, streak: 5, ts: now - 1000 * (i + 1) }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const saved = (pg = page) => pg.evaluate(() => JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').length);
  await page.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=5`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(dir, 'M2-06-attract.png') });
  const before = await saved();
  await page.waitForFunction(() => document.body.dataset.demo === '1', null, { timeout: 5000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(dir, 'M2-06-demo.png') });
  const mid = await saved();
  await page.mouse.click(900, 500);
  const after = await page.evaluate(() => ({ demo: document.body.dataset.demo, status: document.body.dataset.status, screen: document.body.dataset.screen }));
  // At 30x speed the countdown (3s) can pass within a few frames after the click → only check that it is a real game (play screen, demo=0), not the demo
  if (after.demo !== '0' || after.screen !== 'play') fail(`after click demo=${after.demo} screen=${after.screen}`);
  await page.close();
  if (mid !== before) fail(`saved during demo ${before} → ${mid}`);
  if (errors.length) fail(`console errors ${errors.length}: ${errors[0]}`);
  // If the demo runs to the end it returns to attract with no result: wait on a new page
  const p2 = await ctx.newPage();
  p2.on('pageerror', (e) => errors.push(String(e)));
  await p2.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=6`);
  const before2 = await saved(p2);
  await p2.waitForFunction(() => document.body.dataset.demo === '1', null, { timeout: 5000 });
  await p2.waitForFunction(() => document.body.dataset.demo === '0' && document.body.dataset.screen === 'attract', null, { timeout: 10000 });
  const results = await p2.evaluate(() => document.body.dataset.results);
  if (results !== '0') fail(`demo ended but results ${results}`);
  if ((await saved(p2)) !== before2) fail('saves grew after the demo');
  if (code === 0) console.log(`DEMO ok: demo_started=true, saved_during_demo=${mid - before}, click_during_demo_starts_new_game=true, results_after_demo=${results}, console_errors=${errors.length}`);
  await browser.close();
} catch (e) {
  fail(String(e));
} finally {
  server.kill();
}
process.exit(code);
