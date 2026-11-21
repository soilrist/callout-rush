/** Attract · Result · 카운트다운 숫자 그림 (docs/reference/attract.md · result.md · play.md). 무대 좌표 1920×1080. */
import { COUNTDOWN_MS } from '../core/config';
import { accuracy, avgReaction, grade } from '../core/scoring';
import type { GameState } from '../core/game';

const C = { bg: '#0b1220', panel: '#131c2e', line: '#24324d', text: '#e8eef8', accent: '#35d0ff', gold: '#ffc53d' } as const;
const FONT = '"Chakra Petch", system-ui, sans-serif';
type Ctx = CanvasRenderingContext2D;

/** 카운트다운 남은 ms → 맵 가운데에 보일 글자. 끝난 뒤 0.5초는 GO. 그 밖엔 null. */
export function countdownText(msSinceT0: number): string | null {
  if (msSinceT0 < 0) return null;
  if (msSinceT0 < COUNTDOWN_MS) return String(Math.ceil((COUNTDOWN_MS - msSinceT0) / 1000));
  return msSinceT0 < COUNTDOWN_MS + 500 ? 'GO' : null;
}

function text(ctx: Ctx, s: string, x: number, y: number, px: number, color: string, align: CanvasTextAlign = 'left', alpha = 1): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `700 ${px}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
  ctx.globalAlpha = 1;
}

/** 맵 가운데 큰 숫자 (3·2·1·GO). 맵 중심 = (540, 540). */
export function drawCountdown(ctx: Ctx, s: string): void {
  ctx.save();
  text(ctx, s, 540, 540, 320, C.accent, 'center');
  ctx.restore();
}

export function drawAttract(ctx: Ctx, now: number): void {
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.font = `700 160px ${FONT}`;
  const wCallout = ctx.measureText('CALLOUT ').width;
  const wRush = ctx.measureText('RUSH').width;
  const x0 = 960 - (wCallout + wRush) / 2;
  text(ctx, 'CALLOUT ', x0, 345, 160, C.text);
  text(ctx, 'RUSH', x0 + wCallout, 345, 160, C.accent);
  text(ctx, 'Read the call. Click the spot.', 960, 492, 48, C.text, 'center', 0.8);
  ctx.fillStyle = C.panel;
  ctx.fillRect(560, 620, 800, 150);
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(560, 620, 800, 150);
  const blink = 0.625 + 0.375 * Math.cos((now / 1200) * 2 * Math.PI);
  text(ctx, 'CLICK TO PLAY', 960, 695, 96, C.accent, 'center', blink);
  ctx.restore();
}

function statRow(ctx: Ctx, label: string, value: string, y: number): void {
  text(ctx, label, 984, y + 20, 28, C.text, 'left', 0.7);
  text(ctx, value, 1836, y + 56, 72, C.text, 'right');
  ctx.fillStyle = C.line;
  ctx.fillRect(984, y + 108, 852, 2);
}

/** 결과: 왼쪽 점수·등급, 오른쪽 통계 3줄. 이니셜·순위는 M2. 점수는 0.8초 동안 올라간다. */
export function drawResult(ctx: Ctx, g: GameState, sinceMs: number): void {
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  const k = Math.min(1, Math.max(0, sinceMs / 800));
  const shown = Math.round(g.score * k);
  text(ctx, 'SCORE', 60, 78, 28, C.text, 'left', 0.7);
  text(ctx, shown.toLocaleString('en-US'), 60, 200, 200, C.text);
  if (k >= 1) {
    const name = grade(g.score);
    text(ctx, name, 60, 395, 96, name === 'IGL' ? C.gold : C.accent);
  }
  const avg = avgReaction(g.rts);
  statRow(ctx, 'AVG REACTION', avg === null ? '—' : `${Math.round(avg)} ms`, 112 - 12);
  statRow(ctx, 'ACCURACY', `${Math.round(accuracy(g.hit, g.finished))}%`, 232 - 12);
  statRow(ctx, 'BEST STREAK', String(g.bestStreak), 352 - 12);
  text(ctx, 'CLICK TO CONTINUE', 960, 900, 48, C.accent, 'center', 0.8);
  ctx.restore();
}
