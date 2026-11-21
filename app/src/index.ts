import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { parseParams } from './params';
import { initGame, step, type GameState } from './core/game';
import { ZONES } from './core/zones';
import { drawHud, type PastCall } from './ui/hud';
import { drawFx, labelAlphaAt, shakeOffset } from './ui/fx';
import { drawMap, stageToMap } from './ui/map';
import { STAGE_H, STAGE_W, fitStage, screenToStage } from './ui/stage';

const params = parseParams(window.location.search);
document.body.dataset['state'] = params.state ?? 'attract';

if (params.state === 'play') {
  const canvas = document.createElement('canvas');
  canvas.width = STAGE_W;
  canvas.height = STAGE_H;
  const fit = fitStage(window.innerWidth, window.innerHeight, 1);
  canvas.style.width = `${fit.width}px`;
  canvas.style.height = `${fit.height}px`;
  document.getElementById('title')?.remove();
  document.body.append(canvas);
  void document.fonts.load('700 28px "Chakra Petch"').then(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // 캡처용: 클릭 없이 `at`(ms) 까지 시계만 돌린다. 판 시작 시각 0 → 플레이는 COUNTDOWN_MS 부터.
    if (params.at === null) {
      startLive(canvas, ctx, params.seed ?? Date.now(), params.timescale);
      return;
    }
    const at = params.at;
    let state: GameState = initGame(params.seed ?? 1);
    const history: PastCall[] = [];
    for (let t = 0; t <= at; t += 50) {
      const prev = state.last;
      state = step(state, { type: 'TICK', now: t });
      if (state.last !== prev && state.last) {
        const first = state.last.revealZones[0] ?? state.last.zone;
        history.push({ ok: state.last.kind === 'hit', name: ZONES.find((z) => z.id === first)?.name ?? '', rtMs: state.last.rtMs });
      }
    }
    const alpha = labelAlphaAt(state.playStartMs === null ? 0 : at - state.playStartMs);
    drawMap(ctx, { labelAlpha: alpha });
    drawFx(ctx, { last: state.last, people: 0, now: at, playStartMs: state.playStartMs });
    drawHud(ctx, { state, now: at, history });
  });
}

/** 진짜 플레이: 클릭 → 무대 → 맵 좌표 → step, requestAnimationFrame 한 줄기가 TICK 을 보낸다. */
function startLive(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number, timescale: number): void {
  let state: GameState = initGame(seed);
  const history: PastCall[] = [];
  const clock = (): number => performance.now() * timescale;
  const t0 = clock();
  const now = (): number => clock() - t0;
  let people = 0;
  const apply = (event: Parameters<typeof step>[1]): void => {
    const prev = state.last;
    const before = state.active?.call.people ?? 0;
    state = step(state, event);
    if (state.last !== prev && state.last?.kind === 'hit') people = before;
    if (state.last !== prev && state.last) {
      const first = state.last.revealZones[0] ?? state.last.zone;
      history.push({ ok: state.last.kind === 'hit', name: ZONES.find((z) => z.id === first)?.name ?? '', rtMs: state.last.rtMs });
    }
  };
  canvas.style.cursor = 'crosshair';
  canvas.style.userSelect = 'none';
  canvas.style.touchAction = 'none';
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('dragstart', (e) => e.preventDefault());
  canvas.addEventListener('selectstart', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const fit = { scale: rect.width / STAGE_W, offsetX: rect.left, offsetY: rect.top, width: rect.width, height: rect.height, pixelWidth: STAGE_W, pixelHeight: STAGE_H };
    const p = screenToStage(fit, e.clientX, e.clientY);
    const m = stageToMap(p.x, p.y);
    apply({ type: 'CLICK', x: m.x, y: m.y, now: now() });
    publish();
  });
  // 검사용 표시: 시험이 점수·연속·정답 구역을 읽는다 (화면에는 안 보임).
  const publish = (): void => {
    const d = document.body.dataset;
    d['status'] = state.status;
    d['score'] = String(state.score);
    d['streak'] = String(state.streak);
    d['target'] = state.active ? (state.active.call.zones[state.active.step] ?? '') : '';
  };
  const frame = (): void => {
    const t = now();
    apply({ type: 'TICK', now: t });
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    const elapsed = state.playStartMs === null ? 0 : t - state.playStartMs;
    ctx.save();
    ctx.translate(shakeOffset(state.last, t), 0);
    drawMap(ctx, { labelAlpha: labelAlphaAt(elapsed) });
    drawFx(ctx, { last: state.last, people, now: t, playStartMs: state.playStartMs });
    ctx.restore();
    drawHud(ctx, { state, now: t, history });
    publish();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
