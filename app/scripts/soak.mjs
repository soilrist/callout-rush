// Usage: npm run soak -- --games 1000 --timescale 30 [--minutes N] [--every 50] [--out ../logs/soak.csv] (M2-11)
// The bot keeps looping attract → play → result → initials → rank → attract. Every N games (default 50), after a forced GC, write JS heap, DOM nodes, frame p95, storage size and console errors as one CSV line.
// Output: `SOAK ok: …` (exit 1 if it cannot run to the end). The verdict (pass line) is made from the CSV in M2-12.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const games = Number(arg('games', 50));
const minutes = Number(arg('minutes', 0)); // if 0, stop by game count
const timescale = Number(arg('timescale', 30));
const every = Number(arg('every', 50));
const W = Number(arg('width', 960));
const out = arg('out', '../logs/soak.csv');
const PORT = 4181;
// Going through npx, server.kill() cannot kill the vite child and the port stays open → start vite directly with node.
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
const fail = (m) => { console.error(`SOAK failed: ${m}`); code = 1; };
try {
  await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('preview timed out')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => no(new Error('preview exited')));
  });
  mkdirSync(dirname(out), { recursive: true });
  const header = 'games,elapsed_s,heap_mb,dom_nodes,listeners,timers,frame_p95_ms,storage_kb,console_errors,work_p95_ms\n';
  writeFileSync(out, header);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: Math.round(W * 9 / 16) } });
  let errors = 0;
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors++; });
  page.on('pageerror', () => { errors++; });
  // Accumulate frame intervals (ms) — read and clear every block (50 games).
  await page.addInitScript(() => {
    const w = globalThis;
    w.__frames = [];
    // Sum the work the game does per frame (time spent inside the rAF callback) by frame time. The interval (__frames) mixes in device and headless limits; this value shows only our code's share (M2-12a).
    w.__work = [];
    const raf = w.requestAnimationFrame.bind(w);
    let curT = -1;
    w.requestAnimationFrame = (cb) => raf((t) => { const s = w.performance.now(); try { cb(t); } finally { const d = w.performance.now() - s; if (t === curT) w.__work[w.__work.length - 1] += d; else { curT = t; w.__work.push(d); } } });
    let last = 0;
    const loop = (t) => { if (last) w.__frames.push(t - last); last = t; w.requestAnimationFrame(loop); };
    w.requestAnimationFrame(loop);
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  await page.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=${timescale}&seed=7`);
  await page.waitForFunction(() => typeof globalThis.__health === 'function');
  // First measure how many frames per second headless Chrome gives on this machine. The bot moves every frame, so with low fps at --timescale 30 it cannot get past the result screen (20s ÷ speed) and the game never ends.
  const fps = await page.evaluate(() => new Promise((ok) => { const g = globalThis; let c = 0; const s = g.performance.now(); const l = () => { c++; if (g.performance.now() - s >= 2000) ok(c / 2); else g.requestAnimationFrame(l); }; g.requestAnimationFrame(l); }));
  console.log(`fps=${fps.toFixed(1)} timescale=${timescale}${fps < 30 && timescale > 15 ? ' — warning: fps is low so games may not finish at 30x (lower it to 10)' : ''}`);
  const t0 = Date.now();
  const sample = async (n) => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { usedSize } = await cdp.send('Runtime.getHeapUsage');
    const m = await page.evaluate(() => {
      const f = globalThis.__frames.splice(0).sort((a, b) => a - b);
      const w = globalThis.__work.splice(0).sort((a, b) => a - b);
      const wp95 = w.length ? w[Math.min(w.length - 1, Math.floor(w.length * 0.95))] : 0;
      const h = globalThis.__health();
      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); bytes += (k.length + (localStorage.getItem(k) ?? '').length) * 2; }
      return { wp95, p95: f.length ? f[Math.min(f.length - 1, Math.floor(f.length * 0.95))] : 0, h, bytes };
    });
    const row = [n, ((Date.now() - t0) / 1000).toFixed(0), (usedSize / 1048576).toFixed(2), m.h.nodes, m.h.listeners, m.h.timers, m.p95.toFixed(1), (m.bytes / 1024).toFixed(1), errors, m.wp95.toFixed(2)].join(',');
    appendFileSync(out, `${row}\n`);
    console.log(row);
    return row;
  };
  const done = async () => Number(await page.evaluate(() => document.body.dataset.results ?? '0'));
  let next = every;
  let n = 0;
  const endAt = minutes > 0 ? t0 + minutes * 60000 : Infinity;
  while (Date.now() < endAt && (minutes > 0 || n < games)) {
    // Measure on the frame entering the rank screen (board) — the same point every game, so it is comparable.
    const target = Math.min(next, minutes > 0 ? Infinity : games);
    await page.waitForFunction((k) => Number(document.body.dataset.results) >= k && document.body.dataset.screen === 'board', target, { timeout: 1800000, polling: 'raf' });
    n = await done();
    await sample(n);
    next = n + every;
  }
  if (errors) fail(`console errors ${errors}`);
  const secs = (Date.now() - t0) / 1000;
  if (!code) console.log(`SOAK ok: ${n} games ${secs.toFixed(0)}s (${(secs / n).toFixed(2)}s per game → 1000 games est. ${(secs / n * 1000 / 60).toFixed(0)} min), CSV ${out}, console_errors=${errors}`);
  await browser.close();
} catch (e) { fail(String(e)); } finally { server.kill(); }
process.exit(code);
