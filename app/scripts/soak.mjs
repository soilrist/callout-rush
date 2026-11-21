// 사용: npm run soak -- --games 1000 --timescale 30 [--minutes N] [--every 50] [--out ../logs/soak.csv] (M2-11)
// 봇이 대기 화면→플레이→결과→이니셜→순위→대기를 계속 돈다. N판(기본 50)마다 강제 GC 뒤 JS 힙·DOM 노드·프레임 p95·저장 크기·콘솔 오류를 CSV 한 줄로.
// 출력: `SOAK ok: …` (끝까지 못 돌면 exit 1). 판정(합격선)은 M2-12 에서 CSV 로 한다.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const games = Number(arg('games', 50));
const minutes = Number(arg('minutes', 0)); // 0 이면 판 수로 끝낸다
const timescale = Number(arg('timescale', 30));
const every = Number(arg('every', 50));
const W = Number(arg('width', 960));
const out = arg('out', '../logs/soak.csv');
const PORT = 4181;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`SOAK 실패: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview 꺼짐')));
  });
  mkdirSync(dirname(out), { recursive: true });
  const header = 'games,elapsed_s,heap_mb,dom_nodes,listeners,timers,frame_p95_ms,storage_kb,console_errors\n';
  writeFileSync(out, header);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: Math.round(W * 9 / 16) } });
  let errors = 0;
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors++; });
  page.on('pageerror', () => { errors++; });
  // 프레임 간격(ms)을 쌓아 둔다 — 한 구간(50판)마다 읽고 비운다.
  await page.addInitScript(() => {
    const w = globalThis;
    w.__frames = [];
    let last = 0;
    const loop = (t) => { if (last) w.__frames.push(t - last); last = t; w.requestAnimationFrame(loop); };
    w.requestAnimationFrame(loop);
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=${timescale}&seed=7`);
  await page.waitForFunction(() => typeof globalThis.__health === 'function');
  const t0 = Date.now();
  const sample = async (n) => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { usedSize } = await cdp.send('Runtime.getHeapUsage');
    const m = await page.evaluate(() => {
      const f = globalThis.__frames.splice(0).sort((a, b) => a - b);
      const h = globalThis.__health();
      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); bytes += (k.length + (localStorage.getItem(k) ?? '').length) * 2; }
      return { p95: f.length ? f[Math.min(f.length - 1, Math.floor(f.length * 0.95))] : 0, h, bytes };
    });
    const row = [n, ((Date.now() - t0) / 1000).toFixed(0), (usedSize / 1048576).toFixed(2), m.h.nodes, m.h.listeners, m.h.timers, m.p95.toFixed(1), (m.bytes / 1024).toFixed(1), errors].join(',');
    appendFileSync(out, `${row}\n`);
    console.log(row);
    return row;
  };
  const done = async () => Number(await page.evaluate(() => document.body.dataset.results ?? '0'));
  let next = every;
  let n = 0;
  const endAt = minutes > 0 ? t0 + minutes * 60000 : Infinity;
  while (Date.now() < endAt && (minutes > 0 || n < games)) {
    // 순위 화면(board)에 들어선 프레임에서 잰다 — 판마다 같은 지점이라 비교가 된다.
    const target = Math.min(next, minutes > 0 ? Infinity : games);
    await page.waitForFunction((k) => Number(document.body.dataset.results) >= k && document.body.dataset.screen === 'board', target, { timeout: 600000, polling: 'raf' });
    n = await done();
    await sample(n);
    next = n + every;
  }
  if (errors) fail(`콘솔 오류 ${errors}`);
  const secs = (Date.now() - t0) / 1000;
  if (!code) console.log(`SOAK ok: ${n}판 ${secs.toFixed(0)}초 (판당 ${(secs / n).toFixed(2)}초 → 1000판 예상 ${(secs / n * 1000 / 60).toFixed(0)}분), CSV ${out}, console_errors=${errors}`);
  await browser.close();
} catch (e) { fail(String(e)); } finally { server.kill(); }
process.exit(code);
