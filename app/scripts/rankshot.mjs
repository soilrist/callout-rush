// Usage: npm run rankshot — 2 captures of the result-screen rank text (captures/M2-03-*.png): normal (#n TODAY) / today's #1 (NEW #1 TODAY)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4175;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`RANKSHOT failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const errors = [];
  const shoot = async (name, seeded, want) => {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    if (seeded) {
      await page.addInitScript(() => {
        const now = Date.now();
        const list = [90000, 80000, 70000, 60000, 50000].map((score, i) => ({ id: `s${i}`, name: 'AAA', score, acc: 90, avgRt: 600, streak: 5, ts: now - 1000 * (i + 1) }));
        globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
      });
    }
    await page.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.body.dataset.screen === 'result');
    await page.waitForTimeout(1300);
    const rank = await page.evaluate(() => document.body.dataset.rank);
    if (rank !== want) fail(`${name} rank=${rank} (want ${want})`);
    await page.screenshot({ path: resolve(dir, name) });
    await ctx.close();
    return rank;
  };
  const a = await shoot('M2-03-result-rank6.png', true, '6');
  const b = await shoot('M2-03-result-rank1.png', false, '1');
  console.log(`RANKSHOT rank ${a} / ${b}, console errors ${errors.length}, exit code ${code}`);
  if (errors.length) fail(errors.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
