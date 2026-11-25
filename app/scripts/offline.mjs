// Usage: npm run offline (run npm run build first) — open once, cut the network, reload → the bot plays a full game and the side window (board.html) opens too, failed requests 0 (M2-10)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4182;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`OFFLINE failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const stray = [];
  const failed = [];
  page.on('pageerror', (e) => stray.push(String(e)));
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  // Until the service worker has cached all files and controls this tab
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 10000 });
  const cached = await page.evaluate(async () => (await (await caches.open((await caches.keys())[0])).keys()).length);
  // Really stop the server (no wifi) — after this no network response can come
  server.kill();
  await new Promise((r) => setTimeout(r, 1500));
  await ctx.setOffline(true);
  failed.length = 0;
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=30&seed=11`);
  await page.waitForFunction(() => Number(document.body.dataset.results) >= 1, null, { timeout: 60000 });
  const results = await page.evaluate(() => Number(document.body.dataset.results));
  const board = await ctx.newPage();
  board.on('requestfailed', (r) => failed.push(r.url()));
  board.on('pageerror', (e) => stray.push(String(e)));
  await board.goto(`http://localhost:${PORT}/board.html`);
  await board.waitForFunction(() => document.body.dataset.screen === 'boardwin', null, { timeout: 10000 });
  if (failed.length) fail(`failed requests ${failed.length}: ${failed[0]}`);
  if (stray.length) fail(stray.join(' | '));
  console.log(`OFFLINE ok: cached ${cached} files, network cut and reload → ${results} games done, side window opened, failed requests ${failed.length}, console errors ${stray.length}`);
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
