// Usage: npm run firstrun — like a first-time visitor, mouse only: attract → one game → initials → rank at two window sizes (1366×768·1920×1080), 4 captures each (captures/M4-07/). Checks clipping (scroll, canvas outside window) by numbers. Last line `FIRSTRUN ...`
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4195;
const out = resolve(process.cwd(), '..', 'captures/M4-07');
mkdirSync(out, { recursive: true });
const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`FIRSTRUN failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const summary = [];
  for (const [w, h] of [[1366, 768], [1920, 1080]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`http://localhost:${PORT}/index.html?seed=11`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const d = (k) => page.evaluate((key) => document.body.dataset[key], k);
    const fit = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      const r = c.getBoundingClientRect();
      return { l: r.left, t: r.top, w: r.width, h: r.height, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, iw: globalThis.innerWidth, ih: globalThis.innerHeight };
    });
    const scale = fit.w / 1920;
    const sx = (x) => fit.l + x * scale;
    const sy = (y) => fit.t + y * scale;
    const inside = fit.l >= -0.5 && fit.t >= -0.5 && fit.l + fit.w <= fit.iw + 0.5 && fit.t + fit.h <= fit.ih + 0.5 && fit.sw <= fit.iw && fit.sh <= fit.ih;
    if (!inside) fail(`${w}×${h} canvas outside window or scrollbar appeared ${JSON.stringify(fit)}`);
    await page.screenshot({ path: resolve(out, `${w}-1-attract.png`) });
    if ((await d('screen')) !== 'attract') fail(`${w} first screen is not attract: ${await d('screen')}`);
    await page.mouse.click(sx(960), sy(695)); // CLICK TO PLAY
    let shotPlay = false;
    let clicks = 0;
    const t0 = Date.now();
    while ((await d('screen')) !== 'result' && Date.now() - t0 < 100000) {
      const tg = await d('target');
      if (tg && ZONES[tg]) {
        const [mx, my] = ZONES[tg];
        await page.mouse.click(sx(60 + mx * 0.96), sy(60 + my * 0.96));
        clicks++;
        if (!shotPlay && clicks === 6) { await page.screenshot({ path: resolve(out, `${w}-2-play.png`) }); shotPlay = true; }
        await page.waitForTimeout(450);
      } else await page.waitForTimeout(60);
    }
    if ((await d('screen')) !== 'result') { fail(`${w} could not reach result screen (${await d('screen')})`); await ctx.close(); continue; }
    await page.waitForTimeout(1400);
    const click = (col, row) => page.mouse.click(sx(984 + 96 * col + 42), sy(640 + 96 * row + 42));
    await click(0, 0); // A
    await click(1, 0); // B
    await click(2, 0); // C
    await page.waitForTimeout(300);
    if ((await d('initials')) !== 'ABC') fail(`${w} after click initials=${await d('initials')}`);
    await page.screenshot({ path: resolve(out, `${w}-3-result.png`) });
    await page.mouse.click(sx(480), sy(890)); // OK
    await page.waitForFunction(() => document.body.dataset.screen === 'board', null, { timeout: 3000 }).catch(() => fail(`${w} could not reach rank screen`));
    await page.waitForTimeout(700);
    await page.screenshot({ path: resolve(out, `${w}-4-board.png`) });
    const name = await d('lastName');
    if (name !== 'ABC') fail(`${w} saved name=${name}`);
    if (errors.length) fail(`${w} console errors ${errors.join(' | ')}`);
    summary.push(`${w}×${h} clicks ${clicks} score name ${name} scale ${scale.toFixed(3)} canvas ${Math.round(fit.w)}×${Math.round(fit.h)} scroll ${fit.sw}×${fit.sh}`);
    await ctx.close();
  }
  await browser.close();
  console.log(`FIRSTRUN ${summary.join(' / ')} / exit code ${code}`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
