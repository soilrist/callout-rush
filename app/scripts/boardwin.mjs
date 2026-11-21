// 사용: npm run boardwin — 창 두 개: 게임 창에서 한 판 끝 → 보조 창(board.html)에 새 줄이 1000ms 안에 나타나는지 + 캡처 (captures/M2-05-*.png)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4177;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`BOARDWIN 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores') || globalThis.__seeded) return;
    const now = Date.now();
    const list = Array.from({ length: 6 }, (_, i) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + i), score: 9000 - i * 1000, acc: 90, avgRt: 500 + i, streak: 5, ts: now - 1000 * (i + 1) }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const board = await ctx.newPage();
  board.on('pageerror', (e) => errors.push(String(e)));
  await board.goto(`http://localhost:${PORT}/board.html`);
  await board.waitForFunction(() => document.body.dataset.screen === 'boardwin');
  await board.waitForTimeout(500);
  const before = Number(await board.evaluate(() => document.body.dataset.boardRows));
  await board.screenshot({ path: resolve(dir, 'M2-05-boardwin-before.png') });
  const game = await ctx.newPage();
  game.on('pageerror', (e) => errors.push(String(e)));
  await game.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
  await game.evaluate(() => document.fonts.ready);
  await game.waitForFunction(() => document.body.dataset.screen === 'result');
  await game.waitForTimeout(1200);
  for (const [c, r] of [[7, 2], [4, 0], [3, 0]]) await game.mouse.click(984 + 96 * c + 42, 640 + 96 * r + 42);
  const t0 = await game.evaluate(() => Date.now());
  await game.mouse.click(480, 890); // OK → 저장
  await board.waitForFunction((n) => Number(document.body.dataset.boardRows) > n, before, { timeout: 4000 });
  const t1 = Number(await board.evaluate(() => document.body.dataset.boardNewAt));
  const delay = t1 - t0;
  await board.waitForTimeout(300);
  await board.screenshot({ path: resolve(dir, 'M2-05-boardwin-flash.png') });
  await board.waitForTimeout(3500);
  await board.screenshot({ path: resolve(dir, 'M2-05-boardwin-after.png') });
  const reads = Number(await board.evaluate(() => document.body.dataset.boardReads));
  if (!(delay >= 0 && delay <= 1000)) fail(`지연 ${delay}ms`);
  console.log(`BOARDWIN 줄 ${before} → 늘어남, 지연 ${delay} ms, 읽은 횟수 ${reads}, 콘솔 오류 ${errors.length}, 종료코드 ${code}`);
  if (errors.length) fail(errors.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
