/** Attract · Result · countdown number drawing (docs/reference/attract.md · result.md · play.md). Stage coordinates 1920×1080. */
import { COUNTDOWN_MS } from '../core/config';
import { accuracy, avgReaction, grade } from '../core/scoring';
import type { GameState } from '../core/game';
import { INITIALS_LEN, canConfirm } from '../core/initials';
import { OK_BOX, PAD, PAD_KEYS, SLOT, padCell } from './keypad';

const C = { miss: '#ff8a3d', bg: '#0b1220', panel: '#131c2e', line: '#24324d', text: '#e8eef8', accent: '#35d0ff', gold: '#ffc53d' } as const;
const FONT = '"Chakra Petch", system-ui, sans-serif';
type Ctx = CanvasRenderingContext2D;

/** Countdown ms left → the text shown in the middle of the map. GO for 0.5 s after it ends. null otherwise. */
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

/** Big number in the middle of the map (3, 2, 1, GO). Map center = (540, 540). */
export function drawCountdown(ctx: Ctx, s: string): void {
  ctx.save();
  text(ctx, s, 540, 540, 320, C.accent, 'center');
  ctx.restore();
}

/** Today's TOP 3 at the lower right of the attract screen (docs/reference/attract.md) */
export function drawTop3(ctx: Ctx, rows: readonly { name: string; score: number }[]): void {
  ctx.fillStyle = C.panel;
  ctx.fillRect(1380, 780, 480, 240);
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(1380, 780, 480, 240);
  text(ctx, "TODAY'S TOP 3", 1410, 816, 28, C.accent);
  if (rows.length === 0) {
    text(ctx, 'BE THE FIRST ON THE BOARD', 1620, 920, 28, C.text, 'center', 0.8);
    return;
  }
  rows.slice(0, 3).forEach((e, i) => {
    const y = 876 + 56 * i;
    const color = i === 0 ? C.gold : C.text;
    text(ctx, `#${i + 1}`, 1410, y, 40, color);
    text(ctx, e.name, 1480, y, 40, color);
    text(ctx, String(e.score), 1830, y, 40, color, 'right');
  });
}

/** Demo overlay: a dark veil over the round behind, and a semi-transparent DEMO mark */
export function drawDemoOverlay(ctx: Ctx): void {
  ctx.save();
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 140, 56);
  text(ctx, 'DEMO', 130, 88, 36, C.text, 'center', 0.5);
  ctx.restore();
}

export function drawAttract(ctx: Ctx, now: number, top: readonly { name: string; score: number }[] = []): void {
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
  drawTop3(ctx, top);
  ctx.restore();
}

function statRow(ctx: Ctx, label: string, value: string, y: number): void {
  text(ctx, label, 984, y + 20, 28, C.text, 'left', 0.7);
  text(ctx, value, 1836, y + 56, 72, C.text, 'right');
  ctx.fillStyle = C.line;
  ctx.fillRect(984, y + 108, 852, 2);
}

/** Rank text on the result screen. `NEW #1 TODAY` for 1st, otherwise `#n TODAY`. Gold if in the top 3. */
export function rankLabel(rank: number): { text: string; gold: boolean } {
  return { text: rank === 1 ? 'NEW #1 TODAY' : `#${rank} TODAY`, gold: rank <= 3 };
}

/** Time (ms) when the score count-up ends and the grade and rank appear */
export const COUNTUP_MS = 800;

export interface ResultInput {
  /** Today's rank (from 1). If 0, not drawn */
  rank: number;
  initials: string;
  pressed: { key: string; at: number } | null;
  /** Current time (ms, for the 150 ms press check) */
  now: number;
  /** Share of the idle limit still left, 0–1 */
  idleLeft: number;
}

/** 3 initials cells + letter pad + OK + time-left bar */
function drawInitials(ctx: Ctx, r: ResultInput): void {
  text(ctx, 'ENTER YOUR INITIALS', 60, 622, 36, C.accent);
  const cur = Math.min(r.initials.length, INITIALS_LEN - 1);
  for (let i = 0; i < INITIALS_LEN; i++) {
    const x = SLOT.x + SLOT.pitch * i;
    const active = i === cur && r.initials.length < INITIALS_LEN;
    ctx.strokeStyle = active ? C.accent : C.line;
    ctx.lineWidth = active ? 4 : 2;
    ctx.strokeRect(x, SLOT.y, SLOT.w, SLOT.h);
    const ch = r.initials[i];
    if (ch) text(ctx, ch, x + SLOT.w / 2, SLOT.y + SLOT.h / 2 + 4, 96, C.text, 'center');
  }
  const ok = canConfirm(r.initials);
  if (ok) {
    ctx.fillStyle = C.accent;
    ctx.fillRect(OK_BOX.x, OK_BOX.y, OK_BOX.w, OK_BOX.h);
  } else {
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.strokeRect(OK_BOX.x, OK_BOX.y, OK_BOX.w, OK_BOX.h);
  }
  text(ctx, 'OK', OK_BOX.x + OK_BOX.w / 2, OK_BOX.y + OK_BOX.h / 2 + 2, 56, ok ? C.bg : C.text, 'center', ok ? 1 : 0.4);
  PAD_KEYS.forEach((k, i) => {
    const c = padCell(i);
    const down = r.pressed !== null && r.pressed.key === k && r.now - r.pressed.at < 150;
    ctx.fillStyle = down ? C.accent : C.panel;
    ctx.fillRect(c.x, c.y, PAD.cell, PAD.cell);
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x, c.y, PAD.cell, PAD.cell);
    text(ctx, k === 'BACK' ? '\u232b' : k, c.x + PAD.cell / 2, c.y + PAD.cell / 2 + 2, 48, down ? C.bg : C.text, 'center');
  });
  ctx.fillStyle = C.panel;
  ctx.fillRect(60, 990, 1800, 16);
  const left = Math.min(1, Math.max(0, r.idleLeft));
  ctx.fillStyle = left <= 0.25 ? C.miss : C.accent;
  ctx.fillRect(60, 990, 1800 * left, 16);
}

/** Result: score and grade on the left, 3 stat lines on the right, initials input below. The score counts up over 0.8 s. */
export function drawResult(ctx: Ctx, g: GameState, sinceMs: number, input: ResultInput): void {
  ctx.save();
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 1920, 1080);
  const k = Math.min(1, Math.max(0, sinceMs / COUNTUP_MS));
  const shown = Math.round(g.score * k);
  text(ctx, 'SCORE', 60, 78, 28, C.text, 'left', 0.7);
  text(ctx, shown.toLocaleString('en-US'), 60, 200, 200, C.text);
  if (k >= 1) {
    const name = grade(g.score);
    text(ctx, name, 60, 395, 96, name === 'IGL' ? C.gold : C.accent);
    if (input.rank > 0) {
      const r = rankLabel(input.rank);
      text(ctx, r.text, 984, 522, 72, r.gold ? C.gold : C.text);
    }
  }
  const avg = avgReaction(g.rts);
  statRow(ctx, 'AVG REACTION', avg === null ? '—' : `${Math.round(avg)} ms`, 112 - 12);
  statRow(ctx, 'ACCURACY', `${Math.round(accuracy(g.hit, g.finished))}%`, 232 - 12);
  statRow(ctx, 'BEST STREAK', String(g.bestStreak), 352 - 12);
  drawInitials(ctx, input);
  ctx.restore();
}
