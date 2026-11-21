// 사용: npm run health — 5판 뒤와 25판 뒤 globalThis.__health() 의 세 숫자(타이머·DOM 노드·리스너)가 같은지, 12초 무입력·탭 숨김이 판을 버리는지 본다 (M2-07).
// 출력: `HEALTH ok: 5판 {...} = 25판 {...}, …` (실패하면 exit 1)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4179;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`HEALTH 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=10&seed=11`);
  await page.waitForFunction(() => typeof globalThis.__health === 'function');
  // 순위 화면(board)에 처음 들어선 프레임에서 재야 같은 지점끼리 비교된다. 봇이 1.5초(게임 시간) 뒤 바로 새 판을 시작하므로 rAF 마다 본다.
  const at = async (n) => {
    const h = await page.waitForFunction((k) => (Number(document.body.dataset.results) === k && document.body.dataset.screen === 'board' ? globalThis.__health() : null), n, { timeout: 400000, polling: 'raf' });
    return h.jsonValue();
  };
  const h5 = await at(5);
  const h25 = await at(25);
  const n = 25;
  if (JSON.stringify(h5) !== JSON.stringify(h25)) fail(`5판 ${JSON.stringify(h5)} ≠ 25판 ${JSON.stringify(h25)} (끝난 판 ${n})`);
  if (!(h5.listeners > 0 && h5.nodes > 0)) fail(`숫자가 비어 있다 ${JSON.stringify(h5)}`);
  await page.close();

  // 12초 무입력 + 탭 숨김 (사람 판: bot 없음, 배속 30 → 12초가 0.4초)
  const ctx2 = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); // 저장소가 비어 있는 새 컨텍스트
  const idle = await ctx2.newPage();
  idle.on('pageerror', (e) => errors.push(String(e)));
  await idle.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=4`);
  await idle.waitForFunction(() => document.body.dataset.screen === 'attract');
  await idle.mouse.click(900, 500);
  await idle.waitForFunction(() => document.body.dataset.screen === 'play');
  await idle.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 5000 });
  const idleRes = await idle.evaluate(() => ({ results: document.body.dataset.results, saved: JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').length }));
  if (idleRes.results !== '0' || idleRes.saved !== 0) fail(`무입력 포기가 결과·저장을 남김 ${JSON.stringify(idleRes)}`);
  await idle.close();
  const hid = await ctx2.newPage();
  await hid.goto(`http://localhost:${PORT}/index.html?timescale=1&seed=4`);
  await hid.waitForFunction(() => document.body.dataset.screen === 'attract');
  await hid.mouse.click(900, 500);
  await hid.waitForFunction(() => document.body.dataset.screen === 'play');
  await hid.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new globalThis.Event('visibilitychange'));
  });
  const scr = await hid.evaluate(() => document.body.dataset.screen);
  await hid.waitForTimeout(100);
  const scr2 = await hid.evaluate(() => document.body.dataset.screen);
  if (scr2 !== 'attract') fail(`탭 숨김 뒤 화면 ${scr}/${scr2}`);
  if (errors.length) fail(`콘솔 오류 ${errors.length}: ${errors[0]}`);
  if (!code) console.log(`HEALTH ok: 5판 ${JSON.stringify(h5)} = 25판 ${JSON.stringify(h25)}, 무입력 포기 results=${idleRes.results} saved=${idleRes.saved}, 탭 숨김 → ${scr2}, console_errors=0`);
  await browser.close();
} catch (e) { fail(String(e)); } finally { server.kill(); }
process.exit(code);
