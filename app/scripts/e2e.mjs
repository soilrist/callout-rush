// 사용: npm run e2e   — 진짜 플레이(클릭 → 점수)를 브라우저로 확인한다. 먼저 `vite build` 가 돼 있어야 한다.
// 출력: `E2E ok: ...` (실패하면 exit 1)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4174;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let code = 0;
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(new Error('preview 서버 시간 초과')), 20000);
    server.stdout.on('data', (d) => { if (String(d).includes('localhost') || String(d).includes('127.0.0.1')) { clearTimeout(t); ok(); } });
    server.on('exit', () => fail(new Error('preview 서버가 꺼졌다')));
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://localhost:${PORT}/index.html?state=play&seed=7&timescale=5`);
  const body = page.locator('body');
  const waitTarget = () => page.waitForFunction(() => document.body.dataset.target, null, { timeout: 15000 });
  const attr = async (k) => Number(await body.getAttribute(`data-${k}`));
  // 정답 구역 가운데 (맵 단위 → 무대 px: 60 + 맵 × 0.96, 캔버스가 1920×1080 으로 꽉 참)
  const ZONES = { Z01: [500, 110], Z02: [230, 160], Z03: [780, 150], Z04: [520, 350], Z05: [780, 400], Z06: [280, 500], Z07: [75, 500], Z08: [520, 580], Z09: [925, 640], Z10: [240, 830], Z11: [750, 830], Z12: [500, 870] };
  await waitTarget();
  const z = await body.getAttribute('data-target');
  const [mx, my] = ZONES[z];
  await page.mouse.click(60 + mx * 0.96, 60 + my * 0.96);
  const score = await attr('score');
  const streak = await attr('streak');
  if (!(score > 0 && streak === 1)) throw new Error(`정답 클릭 뒤 점수 ${score} 연속 ${streak}`);
  // 빈 땅 (맵 오른쪽 위 구석, 어느 구역에도 안 든다) — 다음 콜이 뜰 때까지 기다린 뒤 누른다
  await page.waitForFunction(() => document.body.dataset.target, null, { timeout: 15000 });
  await page.mouse.click(60 + 990 * 0.96, 60 + 10 * 0.96);
  const streak2 = await attr('streak');
  const score2 = await attr('score');
  if (streak2 !== 0 || score2 !== score) throw new Error(`빈 땅 클릭 뒤 연속 ${streak2} 점수 ${score2}`);
  // 화면 흐름: 봇이 대기 화면에서 시작해 세 판 연속으로 결과를 지나 대기로 돌아온다 (콘솔 오류 0)
  const errors = [];
  const flowPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  flowPage.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  flowPage.on('pageerror', (e) => errors.push(String(e)));
  await flowPage.goto(`http://localhost:${PORT}/index.html?bot=regular&timescale=30&seed=11`);
  const body2 = flowPage.locator('body');
  await flowPage.waitForFunction(() => Number(document.body.dataset.attracts) >= 3, null, { timeout: 60000 });
  const n = Number(await body2.getAttribute('data-results'));
  const backToAttract = Number(await body2.getAttribute('data-attracts'));
  if (n < 3) throw new Error(`끝난 판 ${n}`);
  if (errors.length) throw new Error(`콘솔 오류 ${errors.length}개: ${errors[0]}`);
  await browser.close();
  console.log(`E2E ok: 정답 클릭 점수 ${score} 연속 ${streak}, 빈 땅 클릭 연속 ${streak2}, 봇 ${n}판 결과를 지나 대기로 ${backToAttract}번 돌아옴 콘솔 오류 0`);
} catch (e) {
  console.error(e);
  code = 1;
} finally {
  server.kill();
}
process.exit(code);
