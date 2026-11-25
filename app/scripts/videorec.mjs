// 사용: npm run videorec — 영상 초안 재료(M3-04): ?bot=pro&seed=7 실제 속도 한 판 + 결과·순위표·다음 사람·대기 화면을 1920×1080 webm 으로 녹화.
// 출력: captures/tmp/video/main.webm, board.webm, log.json (화면 바뀐 시각). git 에는 안 올린다.
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4192;
const out = resolve(process.cwd(), '..', 'captures/tmp/video');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: out, size: { width: 1920, height: 1080 } } });
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const names = ['KAI', 'MIA', 'REN', 'ZOE', 'LEO', 'AVA', 'NOA', 'IVY'];
    const list = names.map((name, i) => ({ id: `s${i}`, name, score: 9400 - i * 850, acc: 0.92 - i * 0.02, avgRt: 480 + i * 35, streak: 14 - i, ts: now - 60000 * (i + 1) }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const errors = [];
  const sfx = [];
  await ctx.exposeFunction('__sfxSink', (e) => sfx.push(e));
  await ctx.addInitScript(() => { globalThis.__sfxLog = { push: (e) => globalThis.__sfxSink(e) }; });
  const board = await ctx.newPage();
  board.on('pageerror', (e) => errors.push(String(e)));
  await board.goto(`http://localhost:${PORT}/board.html`);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const t0 = Date.now();
  const t0abs = t0;
  await page.goto(`http://localhost:${PORT}/index.html?state=attract&seed=5`);
  await page.waitForTimeout(10000); // 장면 1: 대기 화면
  const tPlayPage = (Date.now() - t0) / 1000;
  await page.goto(`http://localhost:${PORT}/index.html?bot=pro&timescale=1&seed=7&hold=1`);
  const log = [];
  let last = '';
  let resultAt = 0;
  let typed = null;
  const fail = (m) => { errors.push(`ACE: ${m}`); code = 1; };
  while ((Date.now() - t0) / 1000 < 170) {
    const s = await page.evaluate(() => document.body.dataset.screen);
    const el = (Date.now() - t0) / 1000;
    if (s !== last) { log.push({ t: +el.toFixed(1), screen: s }); last = s; }
    if (s === 'result' && !resultAt) {
      resultAt = el;
      await page.waitForTimeout(2500); // 카운트업 + 잠금, 화면 읽을 시간
      const rows0 = Number(await board.evaluate(() => document.body.dataset.boardRows));
      for (const k of ['a', 'c', 'e']) { await page.keyboard.press(k); await page.waitForTimeout(450); }
      const initials = await page.evaluate(() => document.body.dataset.initials);
      if (initials !== 'ACE') fail(`치는 중 initials=${initials}`);
      await page.waitForTimeout(900);
      const tType = (Date.now() - t0) / 1000;
      await page.mouse.click(480, 890); // OK
      const tOk = (Date.now() - t0) / 1000;
      await page.waitForFunction(() => document.body.dataset.lastName === 'ACE', null, { timeout: 3000 }).catch(() => fail('게임 창 lastName 이 ACE 아님'));
      await board.waitForFunction((n) => Number(document.body.dataset.boardRows) > n, rows0, { timeout: 4000 }).catch(() => fail('보조 창 줄이 안 늘어남'));
      const tRow = (Date.now() - t0) / 1000;
      const game = await page.evaluate(() => ({ name: document.body.dataset.lastName, scores: JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').filter((e) => e.name === 'ACE').length }));
      const side = await board.evaluate(() => ({ rows: Number(document.body.dataset.boardRows), scores: JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').filter((e) => e.name === 'ACE').length }));
      if (game.scores < 1 || side.scores < 1) fail(`저장소에 ACE 줄 없음 game=${game.scores} board=${side.scores}`);
      typed = { tType: +tType.toFixed(1), tOk: +tOk.toFixed(1), tRowShown: +tRow.toFixed(1), game, board: side };
      await page.screenshot({ path: resolve(out, 'ace-game.png') });
      await board.screenshot({ path: resolve(out, 'ace-board.png') });
      await page.waitForTimeout(7000); // 보조 창 새 줄 강조가 보이는 시간
      break;
    }
    await page.waitForTimeout(200);
  }
  if (!typed) fail('결과 화면에 못 옴');
  await ctx.close();
  await browser.close();
  const sfxOut = sfx.map((e) => ({ t: +((e.ms - t0abs) / 1000).toFixed(3), id: e.id, opts: e.opts ?? {} }));
  writeFileSync(resolve(out, 'sfx.json'), JSON.stringify(sfxOut, null, 1));
  const counts = {};
  for (const e of sfxOut) counts[e.id] = (counts[e.id] ?? 0) + 1;
  console.log('SFXLOG', JSON.stringify(counts));
  const vids = readdirSync(out).filter((f) => f.endsWith('.webm'));
  writeFileSync(resolve(out, 'log.json'), JSON.stringify({ tPlayPage, log, ace: typed, vids, errors }, null, 1));
  console.log(JSON.stringify({ tPlayPage, log, ace: typed, vids, errors: errors.length }));
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
