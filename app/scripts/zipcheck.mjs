// Usage: npm run zipcheck  — unpack the zip into a new temp folder, serve it with serve.mjs and check a game runs to the end. Run `npm run zip` first.
// Output: `ZIPCHECK ok: ...` (exit 1 on failure)
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const zip = resolve(fileURLToPath(new URL('../../제출본/callout-rush-web.zip', import.meta.url)));
const PORT = 4175;
const work = mkdtempSync(join(tmpdir(), 'callout-unzip-'));
let server;
let code = 0;
try {
  execFileSync('unzip', ['-q', zip, '-d', work]);
  const dir = join(work, 'callout-rush');
  const exec = (statSync(join(dir, 'start.command')).mode & 0o111) !== 0;
  if (!exec) throw new Error('start.command is not executable');
  server = spawn(process.execPath, ['serve.mjs'], { cwd: dir, env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('serve.mjs timed out')), 10000);
    server.stdout.on('data', (d) => { if (String(d).includes('running')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('serve.mjs exited')));
  });
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=30&seed=11`);
  await page.waitForFunction(() => Number(document.body.dataset.results) >= 1 && Number(document.body.dataset.attracts) >= 1, null, { timeout: 90000 });
  const n = Number(await page.locator('body').getAttribute('data-results'));
  const board = await page.request.get(`http://localhost:${PORT}/board.html`);
  const outside = await page.request.get(`http://localhost:${PORT}/..%2f..%2fREADME.txt`);
  if (board.status() !== 200) throw new Error(`board.html ${board.status()}`);
  if (errors.length) throw new Error(`console errors ${errors.length}: ${errors[0]}`);
  await browser.close();
  console.log(`ZIPCHECK ok: unpacked zip ${statSync(zip).size} bytes and served with serve.mjs, bot ${n} games to the end, board.html ${board.status()}, parent-path request ${outside.status()}, console errors 0`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server?.kill();
  rmSync(work, { recursive: true, force: true });
}
process.exit(code);
