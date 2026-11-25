// Usage: npm run health — check that the three numbers from globalThis.__health() (timers, DOM nodes, listeners) are equal after 5 and 25 games, and that 12s of no input or a hidden tab abandons the game (M2-07).
// Output: `HEALTH ok: 5 games {...} = 25 games {...}, …` (exit 1 on failure)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4179;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`HEALTH failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=10&seed=11`);
  await page.waitForFunction(() => typeof globalThis.__health === 'function');
  // Measure on the first frame of the rank screen (board) so the same point is compared. The bot starts a new game 1.5s (game time) later, so check on every rAF.
  const at = async (n) => {
    const h = await page.waitForFunction((k) => (Number(document.body.dataset.results) === k && document.body.dataset.screen === 'board' ? globalThis.__health() : null), n, { timeout: 400000, polling: 'raf' });
    return h.jsonValue();
  };
  const h5 = await at(5);
  const h25 = await at(25);
  const n = 25;
  if (JSON.stringify(h5) !== JSON.stringify(h25)) fail(`5 games ${JSON.stringify(h5)} ≠ 25 games ${JSON.stringify(h25)} (finished games ${n})`);
  if (!(h5.listeners > 0 && h5.nodes > 0)) fail(`numbers are empty ${JSON.stringify(h5)}`);
  await page.close();

  // 12s no input + hidden tab (human game: no bot, 30x speed → 12s is 0.4s)
  const ctx2 = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); // a new context with empty storage
  const idle = await ctx2.newPage();
  idle.on('pageerror', (e) => errors.push(String(e)));
  await idle.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=4`);
  await idle.waitForFunction(() => document.body.dataset.screen === 'attract');
  await idle.mouse.click(900, 500);
  await idle.waitForFunction(() => document.body.dataset.screen === 'play');
  await idle.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 5000 });
  const idleRes = await idle.evaluate(() => ({ results: document.body.dataset.results, saved: JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').length }));
  if (idleRes.results !== '0' || idleRes.saved !== 0) fail(`idle abandon left a result or save ${JSON.stringify(idleRes)}`);
  await idle.close();
  const hid = await ctx2.newPage();
  await hid.goto(`http://localhost:${PORT}/index.html?timescale=1&seed=4`);
  await hid.waitForFunction(() => document.body.dataset.screen === 'attract');
  await hid.mouse.click(900, 500);
  await hid.waitForFunction(() => document.body.dataset.screen === 'play');
  await hid.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new globalThis.Event('visibilitychange'));
  });
  const scr = await hid.evaluate(() => document.body.dataset.screen);
  await hid.waitForTimeout(100);
  const scr2 = await hid.evaluate(() => document.body.dataset.screen);
  if (scr2 !== 'attract') fail(`screen after tab hidden ${scr}/${scr2}`);
  if (errors.length) fail(`console errors ${errors.length}: ${errors[0]}`);
  if (!code) console.log(`HEALTH ok: 5 games ${JSON.stringify(h5)} = 25 games ${JSON.stringify(h25)}, idle abandon results=${idleRes.results} saved=${idleRes.saved}, tab hidden → ${scr2}, console_errors=0`);
  await browser.close();
} catch (e) { fail(String(e)); } finally { server.kill(); }
process.exit(code);
