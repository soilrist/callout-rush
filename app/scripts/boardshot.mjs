// 사용: npm run boardshot — 순위 화면(S5): 점수 12개를 심고 한 판 → 내 줄 강조 확인 + 캡처 (captures/M2-04-*.png)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4176;
const dir = resolve(process.cwd(), '..', 'captures');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`BOARDSHOT 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  const browser = await chromium.launch();
  const errors = [];
  const run = async (name, count, want) => {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.addInitScript((n) => {
      const now = Date.now();
      const list = Array.from({ length: n }, (_, i) => ({ id: `s${i}`, name: 'AB' + String.fromCharCode(65 + (i % 26)), score: 90000 - i * 1000, acc: 90, avgRt: 500 + i, streak: 5, ts: now - 1000 * (i + 1) }));
      if (list.length) globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
    }, count);
    await page.goto(`http://localhost:${PORT}/index.html?state=result&seed=7`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.body.dataset.screen === 'result');
    await page.waitForTimeout(1200);
    for (const [c, r] of [[7, 2], [4, 0], [3, 0]]) await page.mouse.click(984 + 96 * c + 42, 640 + 96 * r + 42);
    await page.mouse.click(480, 890); // OK
    await page.waitForFunction(() => document.body.dataset.screen === 'board', null, { timeout: 3000 });
    await page.waitForTimeout(400);
    const mine = await page.evaluate(() => document.body.dataset.boardMine);
    if (!want(Number(mine))) fail(`${name} 내 순위=${mine}`);
    await page.screenshot({ path: resolve(dir, name) });
    await ctx.close();
    return mine;
  };
  const a = await run('M2-04-board-top10.png', 12, (r) => r > 10);
  const b = await run('M2-04-board-mid.png', 5, (r) => r >= 1 && r <= 6);
  const c = await run('M2-04-board-empty.png', 0, (r) => r === 1);
  console.log(`BOARDSHOT 내 순위 ${a} / ${b} / ${c}, 콘솔 오류 ${errors.length}, 종료코드 ${code}`);
  if (errors.length) fail(errors.join(' | '));
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
