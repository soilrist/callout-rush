// 사용: npm run submitshots — 제출용 그림 7장(제출본/shots/): 대기·플레이 단계 1·단계 3(두 곳 콜)·결과·보조 순위표·운영자 메뉴 + 대표 그림(3:2). 시드 고정 (M3-02)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4190;
const dir = resolve(process.cwd(), '..', '제출본/shots');
mkdirSync(dir, { recursive: true });
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
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
    const names = ['KAI', 'MIA', 'REN', 'ZOE', 'LEO', 'AVA', 'NOA', 'IVY'];
    const list = names.map((name, i) => ({ id: `s${i}`, name, score: 9400 - i * 850, acc: 0.92 - i * 0.02, avgRt: 480 + i * 35, streak: 14 - i, ts: now - 60000 * (i + 1) }));
    globalThis.localStorage.setItem('calloutrush.v1.scores', JSON.stringify(list));
  });
  const shot = async (url, name, wait, after) => {
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://localhost:${PORT}/${url}`);
    await page.evaluate(() => document.fonts.ready);
    if (wait) await page.waitForFunction((w) => document.body.dataset.screen === w, wait);
    await page.waitForTimeout(900);
    if (after) await after(page);
    await page.screenshot({ path: resolve(dir, name) });
    await page.close();
  };
  await shot('index.html?state=attract&seed=5', '1-attract.png', 'attract');
  await shot('index.html?state=play&seed=5&at=9000', '2-play-stage1.png', null);
  await shot('index.html?state=play&seed=5&at=52000', '3-play-stage3.png', null);
  await shot('index.html?state=result&seed=7', '4-result.png', 'result');
  await shot('board.html', '5-board.png', 'boardwin');
  await shot('index.html?state=attract&seed=5', '6-operator.png', 'attract', async (p) => {
    await p.keyboard.press('Control+Shift+O');
    await p.waitForFunction(() => document.body.dataset.operator === '1');
  });
  // 대표 그림 3:2 (1800×1200): 제목 + 단계 3 그림
  const cover = await ctx.newPage();
  await cover.setViewportSize({ width: 1800, height: 1200 });
  const { readFileSync } = await import('node:fs');
  const b64 = readFileSync(resolve(dir, '3-play-stage3.png')).toString('base64');
  await cover.setContent(`<body style="margin:0;background:#0b0f17;color:#fff;font-family:system-ui,sans-serif;width:1800px;height:1200px;position:relative;overflow:hidden">
    <div style="position:absolute;top:70px;left:0;right:0;text-align:center"><div style="font-size:130px;font-weight:800;letter-spacing:4px">CALLOUT RUSH</div>
    <div style="font-size:46px;color:#9fb3c8;margin-top:12px">A 60-second booth game for your whole line</div></div>
    <img src="data:image/png;base64,${b64}" style="position:absolute;left:150px;top:340px;width:1500px;height:844px;border-radius:18px;box-shadow:0 20px 60px #000a;object-fit:cover"></body>`);
  await cover.screenshot({ path: resolve(dir, '0-cover.png') });
  console.log(`SUBMITSHOTS ok: 7장, 콘솔 오류 ${errors.length}`);
  if (errors.length) { console.error(errors.join(' | ')); code = 1; }
  await browser.close();
} catch (e) { console.error(e); code = 1; } finally { server.kill(); }
process.exit(code);
