// 사용: npm run demo — 대기 화면 시연(M2-06): timescale=30 으로 20초 뒤 시연 시작 → 시연 중 점수 저장 0건 → 클릭하면 Countdown. 캡처 captures/M2-06-*.png
// 출력: `DEMO 줄 N → 시연 시작 …, 시연 중 저장 0, 클릭 뒤 …, 콘솔 오류 0` (실패하면 exit 1)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4178;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`DEMO 실패: ${m}`); code = 1; };
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
    if (globalThis.localStorage.getItem('calloutrush.v1.scores')) return;
    const now = Date.now();
    const list = [9100, 8200, 7300].map((score, i) => ({ id: `s${i}`, name: ['AAA', 'BOB', 'CYD'][i], score, acc: 90, avgRt: 500, streak: 5, ts: now - 1000 * (i + 1) }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const saved = (pg = page) => pg.evaluate(() => JSON.parse(globalThis.localStorage.getItem('calloutrush.v1.scores') ?? '[]').length);
  await page.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=5`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.screen === 'attract');
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(dir, 'M2-06-attract.png') });
  const before = await saved();
  await page.waitForFunction(() => document.body.dataset.demo === '1', null, { timeout: 5000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: resolve(dir, 'M2-06-demo.png') });
  const mid = await saved();
  const demoScore = await page.evaluate(() => Number(document.body.dataset.score));
  await page.mouse.click(900, 500);
  const after = await page.evaluate(() => ({ demo: document.body.dataset.demo, status: document.body.dataset.status, screen: document.body.dataset.screen }));
  // 배속 30 이라 클릭 뒤 몇 프레임 만에 카운트다운(3초)이 지날 수 있다 → 시연이 아닌 진짜 판(play 화면, demo=0)인지만 본다
  if (after.demo !== '0' || after.screen !== 'play') fail(`클릭 뒤 demo=${after.demo} screen=${after.screen}`);
  await page.close();
  if (mid !== before) fail(`시연 중 저장 ${before} → ${mid}`);
  if (errors.length) fail(`콘솔 오류 ${errors.length}: ${errors[0]}`);
  // 시연이 끝까지 가면 결과 없이 대기로: 새 페이지에서 기다린다
  const p2 = await ctx.newPage();
  p2.on('pageerror', (e) => errors.push(String(e)));
  await p2.goto(`http://localhost:${PORT}/index.html?timescale=30&seed=6`);
  const before2 = await saved(p2);
  await p2.waitForFunction(() => document.body.dataset.demo === '1', null, { timeout: 5000 });
  await p2.waitForFunction(() => document.body.dataset.demo === '0' && document.body.dataset.screen === 'attract', null, { timeout: 10000 });
  const results = await p2.evaluate(() => document.body.dataset.results);
  if (results !== '0') fail(`시연이 끝났는데 결과 ${results}`);
  if ((await saved(p2)) !== before2) fail('시연 뒤 저장이 늘었다');
  if (code === 0) console.log(`DEMO ok: demo_started=true, saved_during_demo=${mid - before}, click_during_demo_starts_new_game=true, results_after_demo=${results}, console_errors=${errors.length}`);
  await browser.close();
} catch (e) {
  fail(String(e));
} finally {
  server.kill();
}
process.exit(code);
