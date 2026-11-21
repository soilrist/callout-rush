// 사용: npm run crash — 일부러 예외를 던지면 오류 수 +1, 5초 안에 새로 고침돼 대기 화면으로 돌아오고 점수 목록은 그대로 (M2-09)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4181;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`CRASH 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(() => {
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const list = [0, 1, 2].map((i) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + i), score: 9000 - i * 500, acc: 0.9, avgRt: 500, streak: 5, ts: now - 1000 * i }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const page = await ctx.newPage();
  const stray = [];
  page.on('pageerror', (e) => { if (!String(e).includes('일부러 낸 오류')) stray.push(String(e)); });
  page.on('console', (m) => { if (m.type() === 'error') stray.push(m.text()); });
  await page.goto(`http://localhost:${PORT}/index.html?seed=3`);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  const scoresBefore = await page.evaluate(() => globalThis.localStorage.getItem('calloutrush.v1.scores'));
  // 판을 하나 시작해 두고(대기가 아닌 상태) 예외를 던진다
  await page.mouse.click(960, 540);
  await page.waitForFunction(() => document.body.dataset.screen === 'play');
  const marker = await page.evaluate(() => { globalThis.__marker = 1; setTimeout(() => { throw new Error('일부러 낸 오류'); }, 0); return 1; });
  void marker;
  const t0 = Date.now();
  await page.waitForFunction(() => globalThis.__marker === undefined, null, { timeout: 5000 });
  await page.waitForFunction(() => document.body.dataset.screen === 'attract', null, { timeout: 5000 });
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  const after = await page.evaluate(() => ({ scores: globalThis.localStorage.getItem('calloutrush.v1.scores'), health: globalThis.localStorage.getItem('calloutrush.v1.health') }));
  if (after.scores !== scoresBefore) fail('점수 목록이 바뀜');
  if (JSON.parse(after.health ?? '{}').errors !== 1) fail(`오류 수 ${after.health}`);
  // 운영자 메뉴 Errors 칸에도 보인다
  await page.keyboard.press('Control+Shift+O');
  await page.getByText('Booth health').click();
  const health = await page.locator('.op-health').innerText();
  if (!/Errors\s+1/.test(health)) fail(`health ${health}`);
  console.log(`CRASH ok: 예외 → ${sec}초 만에 새로 고침·대기 화면 복귀, 오류 수 1, 점수 목록 그대로, 뜻밖의 콘솔 오류 ${stray.length}`);
  if (stray.length) fail(stray.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
