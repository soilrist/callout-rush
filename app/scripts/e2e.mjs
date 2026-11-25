// Usage: npm run e2e   — check real play (click → score) in a browser. `vite build` must be done first.
// Output: `E2E ok: ...` (exit 1 on failure)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4174;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview server timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview server exited')));
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://localhost:${PORT}/index.html?state=play&seed=7&timescale=5`);
  const body = page.locator('body');
  const waitTarget = () => page.waitForFunction(() => document.body.dataset.target, null, { timeout: 15000 });
  const attr = async (k) => Number(await body.getAttribute(`data-${k}`));
  // Center of the correct zone (map units → stage px: 60 + map × 0.96, canvas fills 1920×1080)
  const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
  await waitTarget();
  const z = await body.getAttribute('data-target');
  const [mx, my] = ZONES[z];
  await page.mouse.click(60 + mx * 0.96, 60 + my * 0.96);
  const score = await attr('score');
  const streak = await attr('streak');
  if (!(score > 0 && streak === 1)) throw new Error(`after correct click score ${score} streak ${streak}`);
  // Empty ground (top-right corner of the map, in no zone) — wait until the next call appears, then click
  await page.waitForFunction(() => document.body.dataset.target, null, { timeout: 15000 });
  await page.mouse.click(60 + 990 * 0.96, 60 + 10 * 0.96);
  const streak2 = await attr('streak');
  const score2 = await attr('score');
  if (streak2 !== 0 || score2 !== score) throw new Error(`after empty-ground click streak ${streak2} score ${score2}`);
  // Screen flow: the bot starts at attract and plays three games in a row, passing results and returning to attract (console errors 0)
  const errors = [];
  const flowPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  flowPage.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  flowPage.on('pageerror', (e) => errors.push(String(e)));
  await flowPage.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=30&seed=11`);
  const body2 = flowPage.locator('body');
  await flowPage.waitForFunction(() => Number(document.body.dataset.attracts) >= 3, null, { timeout: 60000 });
  const n = Number(await body2.getAttribute('data-results'));
  const backToAttract = Number(await body2.getAttribute('data-attracts'));
  if (n < 3) throw new Error(`finished games ${n}`);
  if (errors.length) throw new Error(`console errors ${errors.length}: ${errors[0]}`);
  await browser.close();
  console.log(`E2E ok: correct click score ${score} streak ${streak}, empty-ground click streak ${streak2}, bot ${n} games passed results and returned to attract ${backToAttract} times, console errors 0`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
