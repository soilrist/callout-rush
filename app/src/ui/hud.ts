/** HUD (DESIGN §8.2, docs/reference/play.md). 오른쪽 패널을 무대 좌표에 그린다. */
import { GAME_MS } from '../core/config';
import { mult } from '../core/scoring';
import { phaseAt, type GameState } from '../core/game';

const C = {
  bg: '#0b1220',
  panel: '#131c2e',
  line: '#24324d',
  text: '#e8eef8',
  accent: '#35d0ff',
  ok: '#4ade80',
  miss: '#ff8a3d',
  gold: '#ffc53d',
} as const;
const FONT = '"Chakra Petch", system-ui, sans-serif';
const PHASE_NAMES = ['WARM-UP', 'LIVE', 'CLUTCH'] as const;
const CARD = { x: 1080, y: 180, w: 780, h: 340 } as const;
const TEXT_X = 1104;
const TEXT_W = 732;
const BIG_PX = 96;
const MIN_PX = 60;
const LINE_GAP = 1.1;

type Ctx = CanvasRenderingContext2D;

/** 콜 문장 줄바꿈: 쉼표 뒤에서 끊는다. */
export function callLines(text: string): string[] {
  const i = text.indexOf(', ');
  if (i < 0) return [text];
  return [text.slice(0, i + 1), text.slice(i + 2)];
}

/** 가장 긴 줄이 폭 안에 들어가는 글자 크기(96 → 최소 60). measure(px, 글자) = 폭. */
export function fitPx(lines: readonly string[], measure: (px: number, s: string) => number, width = TEXT_W): number {
  for (let px = BIG_PX; px > MIN_PX; px--) {
    if (lines.every((l) => measure(px, l) <= width)) return px;
  }
  return MIN_PX;
}

/** 지난 콜 한 줄에 쓸 글 */
export interface PastCall {
  ok: boolean;
  name: string;
  rtMs: number;
}

/** 지금 상태에서 지난 콜 줄을 만든다(최신 위, 최대 3). 판정 기록이 없으면 비어 있다. */
export function pastCalls(history: readonly PastCall[]): PastCall[] {
  return history.slice(-3).reverse();
}

export interface HudView {
  state: GameState;
  /** 지금 시각(ms, state.t0 와 같은 시계) */
  now: number;
  history: readonly PastCall[];
}

function font(ctx: Ctx, weight: number, px: number): void {
  ctx.font = `${weight} ${px}px ${FONT}`;
}

function drawCheck(ctx: Ctx, x: number, y: number, ok: boolean): void {
  ctx.lineWidth = 3;
  ctx.strokeStyle = ok ? C.ok : C.miss;
  ctx.beginPath();
  if (ok) {
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 7, y + 17);
    ctx.lineTo(x + 20, y + 2);
  } else {
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + 18, y + 18);
    ctx.moveTo(x + 18, y + 2);
    ctx.lineTo(x + 2, y + 18);
  }
  ctx.stroke();
}

function drawRadio(ctx: Ctx, x: number, y: number): void {
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 8, y + 24, 28, 36);
  ctx.beginPath();
  ctx.moveTo(x + 22, y + 24);
  ctx.lineTo(x + 22, y + 6);
  ctx.stroke();
  for (const r of [14, 24]) {
    ctx.beginPath();
    ctx.arc(x + 22, y + 6, r, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
  }
}

/** 오른쪽 패널(시간·단계·콜 카드·점수·연속·지난 콜)을 그린다. */
export function drawHud(ctx: Ctx, view: HudView): void {
  const { state: s, now } = view;
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(1050, 0, 870, 1080);
  ctx.fillStyle = C.line;
  ctx.fillRect(1050, 60, 2, 960);

  const elapsed = s.playStartMs === null ? 0 : Math.max(0, Math.min(GAME_MS, now - s.playStartMs));
  const left = Math.ceil((GAME_MS - elapsed) / 1000);
  const urgent = left <= 10;
  // 시간 막대
  ctx.fillStyle = C.panel;
  ctx.fillRect(1080, 60, 780, 16);
  ctx.fillStyle = urgent ? C.miss : C.accent;
  ctx.fillRect(1080, 60, 780 * (1 - elapsed / GAME_MS), 16);
  // 남은 초·단계 이름
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = urgent ? C.miss : C.text;
  font(ctx, 700, 72);
  ctx.fillText(String(left), 1080, 84);
  ctx.textAlign = 'right';
  ctx.fillStyle = C.accent;
  font(ctx, 700, 32);
  ctx.fillText(PHASE_NAMES[phaseAt(elapsed) - 1] ?? '', 1860, 96);

  // 콜 카드
  ctx.fillStyle = C.panel;
  ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(CARD.x, CARD.y, CARD.w, CARD.h);
  drawRadio(ctx, 1104, 204);
  ctx.textAlign = 'left';
  const a = s.active;
  if (a) {
    const lines = callLines(a.call.text);
    const px = fitPx(lines, (p, t) => {
      font(ctx, 700, p);
      return ctx.measureText(t).width;
    });
    font(ctx, 700, px);
    lines.forEach((t, i) => {
      ctx.fillStyle = i === 0 && a.step === 1 ? C.ok : C.accent;
      ctx.fillText(t, TEXT_X, 284 + i * px * LINE_GAP);
    });
    const frac = Math.max(0, 1 - (now - a.stepStartMs) / a.limitMs);
    ctx.fillStyle = C.line;
    ctx.fillRect(TEXT_X, 492, TEXT_W, 12);
    ctx.fillStyle = C.accent;
    ctx.fillRect(TEXT_X, 492, TEXT_W * frac, 12);
  } else if (s.last?.kind === 'slow' && now < s.last.revealUntil) {
    ctx.fillStyle = C.miss;
    font(ctx, 700, 72);
    ctx.fillText('TIME!', TEXT_X, 284);
  }

  // 점수·연속
  ctx.fillStyle = C.text;
  ctx.globalAlpha = 0.7;
  font(ctx, 500, 28);
  ctx.fillText('SCORE', 1080, 580);
  ctx.globalAlpha = 1;
  font(ctx, 700, 120);
  ctx.fillText(String(s.score), 1080, 620);
  ctx.fillStyle = s.streak >= 3 ? C.gold : C.text;
  font(ctx, 700, 56);
  ctx.fillText(`STREAK ${s.streak} · x${mult(s.streak).toFixed(1)}`, 1080, 800);

  // 지난 콜
  font(ctx, 500, 24);
  pastCalls(view.history).forEach((p, i) => {
    const y = 920 + i * 34;
    drawCheck(ctx, 1080, y + 4, p.ok);
    ctx.fillStyle = C.text;
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${p.name}${p.ok ? `  ${(p.rtMs / 1000).toFixed(2)}s` : ''}`, 1116, y + 4);
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}
