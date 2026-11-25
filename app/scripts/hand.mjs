// Usage: npm run hand — at real speed (timescale=1), capture the screen right after a hit and right after the call changes (captures/M2-19/). HAND_DIST=<dist> uses another build folder. Video captures/tmp/M2-19.webm. Last line `HAND ...`
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4177;
const out = resolve(process.cwd(), '..', 'captures/M2-19');
mkdirSync(out, { recursive: true });
const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', ...(process.env.HAND_DIST ? ['--outDir', process.env.HAND_DIST] : [])], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview server timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview server exited')));
  });
  const browser = await chromium.launch();
  const tmp = resolve(process.cwd(), '..', 'captures/tmp');
  mkdirSync(tmp, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: tmp, size: { width: 960, height: 540 } } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('http://localhost:' + PORT + '/index.html?state=play&seed=7&timescale=1');
  await page.waitForFunction(() => document.body.dataset.target, null, { timeout: 15000 });
  const first = await page.locator('body').getAttribute('data-target');
  await page.screenshot({ path: resolve(out, 'call-A.png') });
  const [mx, my] = ZONES[first];
  const tClick = Date.now();
  await page.mouse.click(60 + mx * 0.96, 60 + my * 0.96);
  await page.screenshot({ path: resolve(out, 'hit-0.png') });
  const dHit = Date.now() - tClick;
  await page.waitForTimeout(80);
  await page.screenshot({ path: resolve(out, 'hit-80.png') });
  const dHit2 = Date.now() - tClick;
  await page.waitForFunction((f) => document.body.dataset.target && document.body.dataset.target !== f, first, { timeout: 8000, polling: 'raf' });
  const dNext = Date.now() - tClick;
  const tShot = Date.now();
  await page.screenshot({ path: resolve(out, 'call-B.png') });
  const dShot = Date.now() - tShot;
  await ctx.close();
  const vid = readdirSync(tmp).filter((f) => f.endsWith('.webm')).map((f) => resolve(tmp, f)).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
  if (vid) renameSync(vid, resolve(tmp, 'M2-19.webm'));
  await browser.close();
  console.log('HAND hit ' + first + ', click→first frame ' + dHit + 'ms, second frame ' + dHit2 + 'ms, click→next call ' + dNext + 'ms, call change→frame ' + dShot + 'ms, errors ' + errors.length);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
