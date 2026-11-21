// 사용: npm run session — 창 두 개(게임+보조), 실제 속도: 대기 → 한 판(봇) → 이니셜 → 순위 → 보조 창 갱신 → 대기 → (사람 창) 시작 후 12초 방치 → 대기.
// 출력: captures/M2-98-NN.png, 마지막 줄 `SESSION ...`
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4178;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`SESSION 실패: ${m}`); code = 1; };
const shot = (p, n) => p.screenshot({ path: resolve(dir, `M2-98-${n}.png`) });
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  // 화면이 바뀐 시각을 페이지 안에서 기록 (폴링 오차 없이)
  await ctx.addInitScript(() => {
    globalThis.__t = {};
    new globalThis.MutationObserver(() => { const s = document.body && document.body.dataset.screen; if (s && !(s in globalThis.__t)) globalThis.__t[s] = Date.now(); })
      .observe(document, { attributes: true, subtree: true, childList: true });
  });
  const board = await ctx.newPage();
  board.on('pageerror', (e) => errors.push(String(e)));
  await board.goto(`http://localhost:${PORT}/board.html`);
  await board.waitForFunction(() => document.body.dataset.screen === 'boardwin');
  const rows0 = Number(await board.evaluate(() => document.body.dataset.boardRows));
  const game = await ctx.newPage();
  game.on('pageerror', (e) => errors.push(String(e)));
  game.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await game.goto(`http://localhost:${PORT}/index.html?bot=rookie&timescale=1&seed=11`);
  const until = (name, ms) => game.waitForFunction((n) => document.body.dataset.screen === n, name, { timeout: ms, polling: 100 });
  // 봇은 대기 화면을 한 번 누르고 시작한다. 그 전에 대기 그림을 찍는다.
  await shot(game, '01-first');
  await until('play', 15000);
  await game.waitForTimeout(30000);
  await shot(game, '02-mid');
  await until('result', 60000);
  await game.waitForTimeout(1500);
  await shot(game, '03-result');
  await until('board', 30000);
  const tb = await game.evaluate(() => globalThis.__t);
  const person = (tb.board - tb.play) / 1000;
  await board.waitForFunction((n) => Number(document.body.dataset.boardRows) > n, rows0, { timeout: 6000 });
  const delay = Number(await board.evaluate(() => document.body.dataset.boardNewAt)) - tb.board;
  await game.waitForTimeout(400);
  await shot(game, '04-rank');
  await shot(board, '05-boardwin');
  const rows1 = Number(await board.evaluate(() => document.body.dataset.boardRows));
  // 봇은 순위 화면을 1.5초 뒤 눌러 새 판을 시작하므로, 순위 → 대기 자동 복귀(8초)는 사람 창으로 따로 본다.
  await game.close();
  const back = await ctx.newPage();
  back.on('pageerror', (e) => errors.push(String(e)));
  await back.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
  await back.waitForFunction(() => document.body.dataset.screen === 'result');
  await back.waitForTimeout(1200);
  for (const [c, r] of [[0, 0], [1, 0], [2, 0]]) await back.mouse.click(984 + 96 * c + 42, 640 + 96 * r + 42);
  await back.mouse.click(480, 890);
  await back.waitForFunction(() => document.body.dataset.screen === 'board', null, { timeout: 3000 });
  const tr = Date.now();
  await back.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 15000, polling: 100 });
  const boardToAttract = (Date.now() - tr) / 1000;
  await back.waitForTimeout(300);
  await shot(back, '06-attract-again');
  // 방치 시험: 봇 없는 사람 창 — 누르고 아무것도 안 함
  const human = await ctx.newPage();
  human.on('pageerror', (e) => errors.push(String(e)));
  await human.goto(`http://localhost:${PORT}/index.html?timescale=1&seed=21`);
  await human.waitForFunction(() => document.body.dataset.screen === 'attract');
  await human.waitForTimeout(500);
  await human.mouse.click(960, 540);
  await human.waitForFunction(() => document.body.dataset.screen === 'play', null, { timeout: 3000 });
  const tp = Date.now();
  await human.waitForTimeout(8000);
  await human.screenshot({ path: resolve(dir, 'M2-98-07-idle-8s.png') });
  await human.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 20000, polling: 100 });
  const idle = (Date.now() - tp) / 1000;
  await human.waitForTimeout(300);
  await human.screenshot({ path: resolve(dir, 'M2-98-08-idle-back.png') });
  // 다음 사람이 깨끗한 판을 받나: 시작하면 점수 0·이니셜 비어 있음
  await human.mouse.click(960, 540);
  await human.waitForFunction(() => document.body.dataset.screen === 'play');
  const clean = await human.evaluate(() => ({ score: document.body.dataset.score, initials: document.body.dataset.initials ?? '' }));
  if (!(delay >= -50 && delay <= 1000)) fail(`보조 창 지연 ${delay}ms`);
  if (!(rows1 > rows0)) fail('보조 창 줄 안 늘어남');
  if (clean.score !== '0') fail(`다음 판 점수 ${clean.score}`);
  if (errors.length) fail(errors.join(' | '));
  console.log(`SESSION 한 사람 ${person.toFixed(1)}초(play→board), 보조 창 줄 ${rows0}→${rows1} 지연 ${delay} ms, 순위→대기 ${boardToAttract.toFixed(1)}초, 방치 뒤 대기까지 ${idle.toFixed(1)}초, 다음 판 점수 ${clean.score}, 콘솔 오류 ${errors.length}, 종료코드 ${code}`);
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
