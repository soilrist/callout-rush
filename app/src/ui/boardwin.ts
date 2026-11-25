/** Helper-window rank screen S6 (docs/reference/board.md). Stage coordinates 1920×1080. */
import type { ScoreEntry } from '../core/scores';

const C = { bg: '#0b1220', panel: '#131c2e', text: '#e8eef8', accent: '#35d0ff', gold: '#ffc53d' } as const;
const FONT = '"Chakra Petch", system-ui, sans-serif';
type Ctx = CanvasRenderingContext2D;

export const TODAY = { x: 60, y: 140, w: 1120, h: 84 } as const;
export const ALL = { x: 1260, y: 130, w: 600, h: 80 } as const;
export const BEAT = { x: 1260, y: 600, w: 600, h: 160 } as const;
export const FLASH_MS = 3000;
export const SLIDE_MS = 600;

export interface BoardWinView {
  today: readonly ScoreEntry[];
  all: readonly ScoreEntry[];
  /** ID of the newest record that just arrived, plus its arrival time */
  newId: string | null;
  newAt: number;
  now: number;
}

export function todayRowY(n: number): number {
  return TODAY.y + TODAY.h * n;
}
export function allRowY(n: number): number {
  return ALL.y + ALL.h * n;
}

/** Flash strength of a new record row: 0.35 at the moment it arrives → 0 after 3 s */
export function flashAlpha(elapsed: number): number {
  if (elapsed < 0 || elapsed >= FLASH_MS) return 0;
  return 0.35 * (1 - elapsed / FLASH_MS);
}

/** x offset (px) of a new row sliding into place from the side: 160 at first → 0 after 600 ms */
export function slideOffset(elapsed: number): number {
  if (elapsed < 0 || elapsed >= SLIDE_MS) return 0;
  const k = 1 - elapsed / SLIDE_MS;
  return 160 * k * k;
}

/** Among the ids not there before in a newly read list, the one with the highest rank (null on the first read) */
export function findNewId(prev: ReadonlySet<string> | null, rows: readonly ScoreEntry[]): string | null {
  if (prev === null) return null;
  return rows.find((e) => !prev.has(e.id))?.id ?? null;
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

export function drawBoardWin(ctx: Ctx, v: BoardWinView): void {
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  t(ctx, "TODAY'S TOP 10", 60, 80, 64, C.accent);
  if (v.today.length === 0) t(ctx, 'BE THE FIRST ON THE BOARD', 60 + TODAY.w / 2, 460, 64, C.text, 'center', 0.8);
  v.today.forEach((e, i) => {
    const y = todayRowY(i);
    const el = v.now - v.newAt;
    const isNew = e.id === v.newId;
    const dx = isNew ? slideOffset(el) : 0;
    ctx.save();
    ctx.translate(dx, 0);
    if (i % 2 === 1) {
      ctx.fillStyle = C.panel;
      ctx.fillRect(TODAY.x, y, TODAY.w, TODAY.h);
    }
    if (isNew) {
      ctx.globalAlpha = flashAlpha(el);
      ctx.fillStyle = C.gold;
      ctx.fillRect(TODAY.x, y, TODAY.w, TODAY.h);
      ctx.globalAlpha = 1;
    }
    const col = i === 0 ? C.gold : C.text;
    const cy = y + TODAY.h / 2 + 2;
    t(ctx, `#${i + 1}`, 80, cy, 56, col);
    t(ctx, e.name, 220, cy, 56, col);
    t(ctx, e.score.toLocaleString('en-US'), 900, cy, 56, col, 'right');
    t(ctx, `${Math.round(e.avgRt)} ms`, 1160, cy, 36, C.text, 'right', 0.7);
    ctx.restore();
  });
  t(ctx, 'ALL-TIME TOP 5', ALL.x, 80, 40, C.accent);
  v.all.forEach((e, i) => {
    const y = allRowY(i);
    const col = i === 0 ? C.gold : C.text;
    const cy = y + ALL.h / 2 + 2;
    t(ctx, `#${i + 1}`, 1280, cy, 48, col);
    t(ctx, e.name, 1380, cy, 48, col);
    t(ctx, e.score.toLocaleString('en-US'), 1840, cy, 48, col, 'right');
  });
  const top = v.all[0];
  if (top) {
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(BEAT.x, BEAT.y, BEAT.w, BEAT.h);
    t(ctx, `BEAT #1: ${top.score.toLocaleString('en-US')}`, BEAT.x + BEAT.w / 2, BEAT.y + BEAT.h / 2, 64, C.gold, 'center');
  }
  ctx.restore();
}
