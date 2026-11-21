// 사용: npm run videorec && npm run videobuild — 영상 초안 조립(M3-04): 녹화 webm + 그림 + 카드 + 자막(투명 PNG 겹치기, 이 ffmpeg 에는 drawtext 가 없다) → 제출본/demo-draft.mp4 + demo-draft.srt
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(process.cwd(), '..');
const tmp = resolve(root, 'captures/tmp/video');
const work = resolve(tmp, 'build');
mkdirSync(work, { recursive: true });
const meta = JSON.parse(readFileSync(resolve(tmp, 'log.json'), 'utf8'));
const resultAt = meta.log.find((l) => l.screen === 'result').t;
// 큰 쪽 webm = 메인 화면(board 보다 용량이 크다)
const vids = readdirSync(tmp).filter((f) => f.endsWith('.webm')).map((f) => resolve(tmp, f));
const main = vids.map((f) => ({ f, size: readFileSync(f).length })).sort((a, b) => b.size - a.size)[0].f;
const shots = resolve(root, '제출본/shots');
const W = 1920, H = 1080;
const T = { s1: 10, s2: resultAt }; // s2 끝 = 결과 화면 나온 시각
const dur = { s3a: 8, s3b: 12, s4: 10, s5: 15, s6: 30, s7: 10 };
const s3 = T.s2, s4 = s3 + dur.s3a + dur.s3b, s5 = s4 + dur.s4, s6 = s5 + dur.s5, s7 = s6 + dur.s6, end = s7 + dur.s7;

const caps = [
  [0.5, 9.5, 'At an esports booth the line is long, the Wi-Fi is bad, and the machine runs all day.'],
  [10.5, 14, 'Read the call. Click the spot.'],
  [15, 28, 'Stage 1, WARM-UP: the zone labels are on.'],
  [28, 50, 'Stage 2, LIVE: the labels fade away. You have to know the map.'],
  [50, T.s2 - 0.5, 'Stage 3, CLUTCH: half the calls name two spots, in order.'],
  [s3 + 0.5, s3 + 8, 'Your score is a reaction time.'],
  [s3 + 8, s4 - 0.5, 'Three initials, and your row appears on the second monitor. No server.'],
  [s4 + 0.5, s5 - 0.5, 'The next player gets a clean round, with nothing left over from the last one.'],
  [s5 + 0.5, s6 - 0.5, '1000 rounds in one page, no reload: heap +0.21 MB, 16 DOM nodes every time, 0 errors, game work per frame 1.5 ms (p95).'],
  [s6 + 0.5, s6 + 15, "WebStorm's headless inspection is a gate in npm run check: 13 runs, 49 warnings read."],
  [s6 + 15, s7 - 0.5, '1 real fix, 48 false positives switched off with a reason. Junie CLI is installed and configured.'],
  [s7 + 0.5, end - 0.5, 'Free to play, MIT licensed. Open it once with Wi-Fi, then it works offline.'],
];
const ts = (x) => { const ms = Math.round(x * 1000); const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
writeFileSync(resolve(root, '제출본/demo-draft.srt'), caps.map((c, i) => `${i + 1}\n${ts(c[0])} --> ${ts(c[1])}\n${c[2]}\n`).join('\n'));

const css = `body{margin:0;width:${W}px;height:${H}px;background:#0b0f17;color:#e8eef6;font-family:system-ui,sans-serif;overflow:hidden}
h1{font-size:76px;margin:0;letter-spacing:2px}table{border-collapse:collapse;font-size:38px}td,th{padding:14px 28px;border-bottom:1px solid #26334a;text-align:left}th{color:#7fd6ff}.c{padding:90px 120px}.big{font-size:150px;font-weight:800;color:#7fd6ff}.m{color:#9fb3c8;font-size:36px}code{background:#16202f;padding:6px 14px;border-radius:8px;font-size:34px}`;
const cards = {
  'card-title': `<div class="c" style="text-align:center;padding-top:300px"><h1 style="font-size:130px">CALLOUT RUSH</h1><p class="m" style="font-size:54px">At an esports booth: long line, bad Wi-Fi, all-day machine.</p></div>`,
  'card-soak': `<div class="c"><h1>1000 rounds in one page, no reload</h1><p class="m">docs/soak-report.md · Apple M2 Max · Playwright Chromium · timescale 10</p><table><tr><th>Check</th><th>Measured</th></tr><tr><td>JS heap, round 50 to 1000</td><td>1.93 to 2.14 MB = +0.21 MB</td></tr><tr><td>DOM nodes between rounds</td><td>16 at all 20 samples</td></tr><tr><td>Errors</td><td>0</td></tr><tr><td>Game work per frame (p95)</td><td>1.5 ms</td></tr></table></div>`,
  'card-jb': `<div class="c"><h1>JetBrains tools, honest numbers</h1><p class="m">docs/jetbrains-usage.md (Totals) · <code>.idea</code> 9 files · <code>.junie/AGENTS.md</code></p><table><tr><th>Tool</th><th>Runs</th><th>Found</th><th>Fixed</th><th>Commits</th></tr><tr><td>WebStorm headless inspection</td><td>13</td><td>49 warnings</td><td>1</td><td>n/a</td></tr><tr><td>Junie CLI</td><td>0</td><td>n/a</td><td>n/a</td><td>0</td></tr><tr><td>JetBrains Air</td><td>0</td><td>n/a</td><td>n/a</td><td>0</td></tr></table><p class="m" style="margin-top:40px"><code>npm run inspect</code> → <code>INSPECT ok: 0 errors, 0 warnings</code></p></div>`,
  'card-end': `<div class="c" style="text-align:center;padding-top:260px"><h1 style="font-size:110px">CALLOUT RUSH</h1><p class="m" style="font-size:44px">Demo: &lt;DEMO_URL&gt; · Repository: &lt;REPO_URL&gt;</p><p class="m" style="font-size:44px">MIT License · Built for the Cloud9 x JetBrains hackathon</p></div>`,
};
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H } });
for (const [n, html] of Object.entries(cards)) {
  await pg.setContent(`<style>${css}</style>${html}`);
  await pg.screenshot({ path: resolve(work, `${n}.png`) });
}
for (let i = 0; i < caps.length; i++) {
  const t = caps[i][2].replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await pg.setContent(`<body style="margin:0;background:transparent;width:${W}px;height:${H}px;position:relative"><div style="position:absolute;left:60px;right:60px;bottom:14px;background:#000;color:#fff;font:600 36px/1.25 system-ui,sans-serif;padding:12px 24px;border-radius:12px;text-align:center">${t}</div></body>`);
  await pg.screenshot({ path: resolve(work, `cap${i}.png`), omitBackground: true });
}
await browser.close();

const loopImg = (f, d) => ['-loop', '1', '-framerate', '30', '-t', String(d), '-i', f];
const inputs = [
  ['-i', main],                                   // 0
  ...loopImg(resolve(shots, '4-result.png'), dur.s3a),   // 1
  ...loopImg(resolve(shots, '5-board.png'), dur.s3b),    // 2
  ...loopImg(resolve(work, 'card-soak.png'), dur.s5),    // 3
  ...loopImg(resolve(work, 'card-jb.png'), dur.s6),      // 4
  ...loopImg(resolve(work, 'card-end.png'), dur.s7),     // 5
].flat();
const nIn = 6;
const capIn = caps.flatMap((_, i) => ['-loop', '1', '-framerate', '30', '-t', String(end), '-i', resolve(work, `cap${i}.png`)]);
// 화면은 960px 높이로 줄여 위에 두고, 아래 120px 띠에 자막을 둔다(자막이 게임 화면을 가리지 않게)
const sc = `scale=-2:960,pad=${W}:${H}:(ow-iw)/2:0,setsar=1,fps=30,format=yuv420p`;
const fc = [
  `[0:v]trim=0:${T.s2},setpts=PTS-STARTPTS,${sc}[a]`,
  `[0:v]trim=0:${dur.s4},setpts=PTS-STARTPTS,${sc}[d]`, // 장면 4: 대기 화면(앞 10초) 다시 사용
  `[1:v]${sc}[r]`, `[2:v]${sc}[b]`, `[3:v]${sc}[k]`, `[4:v]${sc}[j]`, `[5:v]${sc}[e]`,
  `[a][r][b][d][k][j][e]concat=n=7:v=1:a=0[base]`,
];
let prev = 'base';
caps.forEach((c, i) => {
  fc.push(`[${prev}][${nIn + i}:v]overlay=enable='between(t,${c[0]},${c[1]})'[o${i}]`);
  prev = `o${i}`;
});
const outFile = resolve(root, '제출본/demo-draft.mp4');
const args = ['-y', '-v', 'error', ...inputs, ...capIn, '-filter_complex', fc.join(';'), '-map', `[${prev}]`, '-c:v', 'libx264', '-crf', '26', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-an', '-t', String(end), outFile];
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
console.log(`VIDEOBUILD exit ${r.status}, 예상 길이 ${end.toFixed(1)}초`);
process.exit(r.status ?? 1);
