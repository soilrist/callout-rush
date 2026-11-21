/** 게임 창 순위 화면 S5 (docs/reference/board.md). 무대 좌표 1920×1080. */
import type { ScoreEntry } from '../core/scores';

const C = { bg: '#0b1220', panel: '#131c2e', zone: '#1b2a44', text: '#e8eef8', accent: '#35d0ff', gold: '#ffc53d' } as const;
const FONT = '"Chakra Petch", system-ui, sans-serif';
type Ctx = CanvasRenderingContext2D;

export const ROW = { x: 360, y: 130, w: 1200, h: 72 } as const;
export const YOU_Y = 862;

export interface BoardInput {
  /** 오늘 TOP 10 (순위순) */
  rows: readonly ScoreEntry[];
  /** 방금 낸 내 기록 id (없으면 null) */
  myId: string | null;
  /** 내 오늘 순위(1부터, 없으면 0) */
  myRank: number;
  /** 내 기록 (10등 밖일 때 맨 아래 줄용) */
  mine: ScoreEntry | null;
  now: number;
}

/** 줄 y 좌표 (n 은 0부터) */
export function rowY(n: number): number {
  return ROW.y + ROW.h * n;
}

/** 내 줄이 10등 밖이라 맨 아래에 따로 그려야 하나 */
export function needsYouRow(rows: readonly ScoreEntry[], myId: string | null, myRank: number): boolean {
  return myId !== null && myRank > rows.length && !rows.some((e) => e.id === myId);
}

function t(ctx: Ctx, s: string, x: number, y: number, px: number, color: string, align: CanvasTextAlign = 'left', alpha = 1): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `700 ${px}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
  ctx.globalAlpha = 1;
}

function drawRow(ctx: Ctx, e: ScoreEntry, label: string, y: number, stripe: boolean, mine: boolean, gold: boolean, nameX = 500): void {
  if (mine) {
    ctx.fillStyle = C.zone;
    ctx.fillRect(ROW.x, y, ROW.w, ROW.h);
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(ROW.x, y, ROW.w, ROW.h);
  } else if (stripe) {
    ctx.fillStyle = C.panel;
    ctx.fillRect(ROW.x, y, ROW.w, ROW.h);
  }
  const col = gold ? C.gold : C.text;
  const cy = y + ROW.h / 2 + 2;
  t(ctx, label, 380, cy, 40, col);
  t(ctx, e.name, nameX, cy, 40, col);
  t(ctx, e.score.toLocaleString('en-US'), 1330, cy, 40, col, 'right');
  t(ctx, `${Math.round(e.avgRt)} ms`, 1540, cy, 28, C.text, 'right', 0.7);
}

export function drawBoard(ctx: Ctx, b: BoardInput): void {
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  t(ctx, "TODAY'S TOP 10", 960, 80, 64, C.accent, 'center');
  if (b.rows.length === 0) t(ctx, 'BE THE FIRST ON THE BOARD', 960, 460, 64, C.text, 'center', 0.8);
  b.rows.forEach((e, i) => drawRow(ctx, e, `#${i + 1}`, rowY(i), i % 2 === 1, e.id === b.myId, i === 0));
  if (b.mine && needsYouRow(b.rows, b.myId, b.myRank)) drawRow(ctx, b.mine, `#${b.myRank} YOU`, YOU_Y, false, true, false, 720);
  const blink = 0.625 + 0.375 * Math.cos((b.now / 1200) * 2 * Math.PI);
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(460, 960, 1000, 90);
  t(ctx, 'NEXT PLAYER — CLICK TO PLAY', 960, 1007, 56, C.accent, 'center', blink);
  ctx.restore();
}
