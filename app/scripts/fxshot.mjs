// Usage: npm run fxshot -- <hit|wrong> <out.png>   — in real play (slow clock), capture the screen right after a click. Run `vite build` first.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const [kind, out] = process.argv.slice(2);
if (!['hit', 'wrong'].includes(kind) || !out) {
  console.error('Usage: npm run fxshot -- <hit|wrong> <file.png>');
  process.exit(1);
}
const PORT = 4175;
const outPath = resolve(process.cwd(), '..', out);
mkdirSync(dirname(outPath), { recursive: true });
const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
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
  // Slow the clock to 0.15x so the capture can catch even the 150ms flash
  await page.goto(`http://localhost:${PORT}/index.html?state=play&seed=7&timescale=0.15`);
  await page.waitForFunction(() => document.body.dataset.target, null, { timeout: 40000 });
  if (kind === 'hit') {
    const [mx, my] = ZONES[await page.locator('body').getAttribute('data-target')];
    await page.mouse.click(60 + mx * 0.96, 60 + my * 0.96);
  } else {
    await page.mouse.click(60 + 990 * 0.96, 60 + 10 * 0.96);
  }
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log(`saved: ${outPath}`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
