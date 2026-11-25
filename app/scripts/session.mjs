// Usage: npm run session — two windows (game + side), real speed: attract → one game (bot) → initials → rank → side window refresh → attract → (human window) start then idle 12s → attract.
// Output: captures/M2-98-NN.png, last line `SESSION ...`
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4178;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`SESSION failed: ${m}`); code = 1; };
const shot = (p, n) => p.screenshot({ path: resolve(dir, `M2-98-${n}.png`) });
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  // Record the time the screen changes inside the page (no polling error)
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
  // The bot clicks the attract screen once to start. Take the attract picture before that.
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
  // The bot clicks the rank screen after 1.5s to start a new game, so the automatic return rank → attract (8s) is checked separately in the human window.
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
  // Idle test: human window with no bot — click, then do nothing
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
  // Does the next person get a clean game: on start the score is 0 and initials are empty
  await human.mouse.click(960, 540);
  await human.waitForFunction(() => document.body.dataset.screen === 'play');
  const clean = await human.evaluate(() => ({ score: document.body.dataset.score, initials: document.body.dataset.initials ?? '' }));
  if (!(delay >= -50 && delay <= 1000)) fail(`side window delay ${delay}ms`);
  if (!(rows1 > rows0)) fail('side window rows did not grow');
  if (clean.score !== '0') fail(`next game score ${clean.score}`);
  if (errors.length) fail(errors.join(' | '));
  console.log(`SESSION one person ${person.toFixed(1)}s (play→board), side window rows ${rows0}→${rows1} delay ${delay} ms, rank→attract ${boardToAttract.toFixed(1)}s, idle→attract ${idle.toFixed(1)}s, next game score ${clean.score}, console errors ${errors.length}, exit code ${code}`);
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
