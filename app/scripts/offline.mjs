// 사용: npm run offline (먼저 npm run build) — 한 번 연 뒤 네트워크를 끊고 새로 고침 → 봇이 한 판을 끝까지 하고 보조 창(board.html)도 열림, 실패한 요청 0 (M2-10)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4182;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`OFFLINE 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
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
  // 서비스 워커가 파일을 다 저장하고 이 탭을 맡을 때까지
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 10000 });
  const cached = await page.evaluate(async () => (await (await caches.open((await caches.keys())[0])).keys()).length);
  // 진짜로 서버를 끈다(와이파이 없음) — 이 뒤로 네트워크 응답이 올 곳이 없다
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
  if (failed.length) fail(`실패한 요청 ${failed.length}개: ${failed[0]}`);
  if (stray.length) fail(stray.join(' | '));
  console.log(`OFFLINE ok: 저장 ${cached}개, 네트워크 끊고 새로 고침 → ${results}판 끝, 보조 창 열림, 실패한 요청 ${failed.length}, 콘솔 오류 ${stray.length}`);
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
