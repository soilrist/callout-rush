// Usage: npm run playthrough  — record one ?bot=rookie game at real speed (timescale=1) and capture every 5s.
// Output: 12 files captures/M1-98-NN.png, captures/tmp/M1-98.webm, last line `PLAYTHROUGH ...`
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4175;
const root = resolve(process.cwd(), '..');
const tmp = resolve(root, 'captures/tmp');
mkdirSync(tmp, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview server timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview server exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: tmp, size: { width: 960, height: 540 } } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?bot=rookie&timescale=1&seed=5`);
  const t0 = Date.now();
  const log = [];
  let last = '';
  let playStart = 0;
  let playEnd = 0;
  let shots = 0;
  let nextShot = 0;
  while (Date.now() - t0 < 110000) {
    const s = await page.evaluate(() => ({ screen: document.body.dataset.screen, score: document.body.dataset.score, results: document.body.dataset.results }));
    const el = (Date.now() - t0) / 1000;
    if (s.screen !== last) { log.push(`${el.toFixed(1)}s ${s.screen} score ${s.score}`); last = s.screen; }
    if (s.screen === 'play' && !playStart) playStart = el;
    if (s.screen === 'result' && playStart && !playEnd) playEnd = el;
    if (el >= nextShot && shots < 12) {
      shots += 1;
      await page.screenshot({ path: resolve(root, `captures/M1-98-${String(shots).padStart(2, '0')}.png`) });
      nextShot += 5;
    }
    if (playEnd && shots >= 12) break;
    await page.waitForTimeout(250);
  }
  const finalScore = await page.evaluate(() => document.body.dataset.score);
  await ctx.close();
  await browser.close();
  const vid = readdirSync(tmp).find((f) => f.endsWith('.webm'));
  if (vid) renameSync(resolve(tmp, vid), resolve(tmp, 'M1-98.webm'));
  console.log(log.join('\n'));
  console.log(`PLAYTHROUGH captures ${shots}, one game ${(playEnd - playStart).toFixed(1)}s (play ${playStart.toFixed(1)}s→result ${playEnd.toFixed(1)}s), score ${finalScore}, console errors ${errors.length}`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
