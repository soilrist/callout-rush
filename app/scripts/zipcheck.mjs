// 사용: npm run zipcheck  — zip 을 새 임시 폴더에 풀어 serve.mjs 로 띄우고 한 판이 끝까지 되는지 본다. 먼저 `npm run zip`.
// 출력: `ZIPCHECK ok: ...` (실패하면 exit 1)
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
  if (!exec) throw new Error('start.command 실행 권한 없음');
  server = spawn(process.execPath, ['serve.mjs'], { cwd: dir, env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('serve.mjs 시간 초과')), 10000);
    server.stdout.on('data', (d) => { if (String(d).includes('running')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('serve.mjs 꺼짐')));
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
  if (errors.length) throw new Error(`콘솔 오류 ${errors.length}개: ${errors[0]}`);
  await browser.close();
  console.log(`ZIPCHECK ok: zip ${statSync(zip).size}바이트를 풀어 serve.mjs 로 띄움, 봇 ${n}판 끝까지, board.html ${board.status()}, 상위 경로 요청 ${outside.status()}, 콘솔 오류 0`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server?.kill();
  rmSync(work, { recursive: true, force: true });
}
process.exit(code);
