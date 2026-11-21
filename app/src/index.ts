import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { parseParams } from './params';
import { initGame, step, type GameState } from './core/game';
import { COUNTDOWN_MS } from './core/config';
import { ZONES } from './core/zones';
import { drawHud, type PastCall } from './ui/hud';
import { drawMap } from './ui/map';
import { STAGE_H, STAGE_W, fitStage } from './ui/stage';

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
    const at = params.at ?? COUNTDOWN_MS;
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
    drawMap(ctx, { labelAlpha: 1 });
    drawHud(ctx, { state, now: at, history });
  });
}
