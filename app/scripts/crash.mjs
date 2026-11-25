// Usage: npm run crash — throw an error on purpose: error count +1, page reloads within 5s back to the attract screen, score list unchanged (M2-09)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4181;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`CRASH failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const list = [0, 1, 2].map((i) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + i), score: 9000 - i * 500, acc: 0.9, avgRt: 500, streak: 5, ts: now - 1000 * i }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const page = await ctx.newPage();
  const stray = [];
  page.on('pageerror', (e) => { if (!String(e).includes('deliberate error')) stray.push(String(e)); });
  page.on('console', (m) => { if (m.type() === 'error') stray.push(m.text()); });
  await page.goto(`http://localhost:${PORT}/index.html?seed=3`);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  const scoresBefore = await page.evaluate(() => globalThis.localStorage.getItem('calloutrush.v1.scores'));
  // Start a game first (not in attract state), then throw
  await page.mouse.click(960, 540);
  await page.waitForFunction(() => document.body.dataset.screen === 'play');
  const marker = await page.evaluate(() => { globalThis.__marker = 1; setTimeout(() => { throw new Error('deliberate error'); }, 0); return 1; });
  void marker;
  const t0 = Date.now();
  await page.waitForFunction(() => globalThis.__marker === undefined, null, { timeout: 5000 });
  await page.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 5000 });
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  const after = await page.evaluate(() => ({ scores: globalThis.localStorage.getItem('calloutrush.v1.scores'), health: globalThis.localStorage.getItem('calloutrush.v1.health') }));
  if (after.scores !== scoresBefore) fail('score list changed');
  if (JSON.parse(after.health ?? '{}').errors !== 1) fail(`error count ${after.health}`);
  // It also shows in the operator menu Errors cell
  await page.keyboard.press('Control+Shift+O');
  await page.getByText('Booth health').click();
  const health = await page.locator('.op-health').innerText();
  if (!/Errors\s+1/.test(health)) fail(`health ${health}`);
  console.log(`CRASH ok: exception → reload and back to attract in ${sec}s, error count 1, score list unchanged, unexpected console errors ${stray.length}`);
  if (stray.length) fail(stray.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
