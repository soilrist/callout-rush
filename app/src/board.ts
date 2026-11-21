import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { CHANNEL_NAME, isScoresUpdated } from './core/channel';
import { SCORES_KEY, ScoreStore } from './core/scores';
import { drawBoardWin, findNewId, FLASH_MS } from './ui/boardwin';
import { STAGE_H, STAGE_W, fitStage } from './ui/stage';
import type { ScoreEntry } from './core/scores';

const canvas = document.createElement('canvas');
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.getElementById('title')?.remove();
document.body.append(canvas);
const resize = (): void => {
  const fit = fitStage(window.innerWidth, window.innerHeight, 1);
  canvas.style.width = `${fit.width}px`;
  canvas.style.height = `${fit.height}px`;
};
resize();
window.addEventListener('resize', resize);

const store = new ScoreStore();
let today: ScoreEntry[] = [];
let all: ScoreEntry[] = [];
let known: Set<string> | null = null;
let newId: string | null = null;
let newAt = 0;
let reads = 0;

/** 저장소를 다시 읽고 새로 들어온 줄을 기억한다 */
function reload(): void {
  store.load();
  const t = Date.now();
  today = store.today(t, 10);
  all = store.allTime(5);
  const fresh = findNewId(known, today);
  if (fresh) {
    newId = fresh;
    newAt = performance.now();
    document.body.dataset['boardNewAt'] = String(Date.now());
  }
  known = new Set(store.today(t, Infinity).map((e) => e.id));
  reads += 1;
  document.body.dataset['boardRows'] = String(today.length);
  document.body.dataset['boardReads'] = String(reads);
  document.body.dataset['boardTop'] = today[0] ? String(today[0].score) : '0';
}

try {
  const ch = new BroadcastChannel(CHANNEL_NAME);
  ch.onmessage = (ev: MessageEvent<unknown>): void => {
    if (isScoresUpdated(ev.data)) reload();
  };
} catch {
  /* storage 이벤트·5초 읽기가 대신한다 */
}
window.addEventListener('storage', (ev) => {
  if (ev.key === null || ev.key === SCORES_KEY) reload();
});
window.setInterval(reload, 5000);

reload();
void document.fonts.load('700 28px "Chakra Petch"').then(() => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const frame = (): void => {
    const now = performance.now();
    if (newId !== null && now - newAt > FLASH_MS) newId = null;
    drawBoardWin(ctx, { today, all, newId, newAt, now });
    requestAnimationFrame(frame);
  };
  document.body.dataset['screen'] = 'boardwin';
  frame();
});
