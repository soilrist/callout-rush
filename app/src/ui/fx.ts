/** Verdict effects (DESIGN §4.2 UI, §5.5). Draws map effects in stage coordinates. The time math is pulled out as pure functions. */
import { LABEL_FADE_MS, PHASES, PHASE_FLASH_MS, WRONG_REVEAL_MS } from '../core/config';
import { ZONES, type ZoneId } from '../core/zones';
import type { Judgement } from '../core/game';
import { MAP_ORIGIN, labelLines, zoneRect } from './map';

export const HIT_FLASH_MS = 150;
export const RISE_MS = 700;
export const RISE_PX = 70;
export const SHAKE_MS = 120;
export const SHAKE_PX = 6;
const PHASE_TEXT = ['WARM-UP', 'LIVE', 'CLUTCH'] as const;
const OK = '74,222,128';
const MISS = '255,138,61';
const FONT = '"Chakra Petch", system-ui, sans-serif';

type Ctx = CanvasRenderingContext2D;

/** Label opacity: 1 in phase 1, from the start of phase 2 fades to 0 over LABEL_FADE_MS, 0 in phase 3. elapsed = ms since play started. */
export function labelAlphaAt(elapsedMs: number): number {
  const fadeFrom = PHASES[1]?.fromMs ?? 0;
  if (elapsedMs < fadeFrom) return 1;
  return Math.max(0, 1 - (elapsedMs - fadeFrom) / LABEL_FADE_MS);
}

/** Time the verdict happened. For hit, the click time; for wrong and slow, reveal end - 600 ms. */
export function judgedAt(j: Judgement): number {
  return j.kind === 'hit' ? j.revealUntil : j.revealUntil - WRONG_REVEAL_MS;
}

/** Wrong-answer shake: for 120 ms after the verdict, ±6px left and right, fading. Outside that window, 0. */
export function shakeOffset(j: Judgement | null, now: number): number {
  if (!j || j.kind !== 'wrong') return 0;
  const age = now - judgedAt(j);
  if (age < 0 || age >= SHAKE_MS) return 0;
  return Math.sin((age / SHAKE_MS) * Math.PI * 4) * SHAKE_PX * (1 - age / SHAKE_MS);
}

/** Phase-change flash (LIVE, CLUTCH): the phase text flashing now and its opacity (0–1). null if none. */
export function phaseFlash(elapsedMs: number): { text: string; alpha: number } | null {
  // The first phase (WARM-UP) is not a change — only phases 2 and 3, so the map is not covered at round start.
  for (let i = 1; i < PHASES.length; i++) {
    const age = elapsedMs - (PHASES[i]?.fromMs ?? 0);
    if (age >= 0 && age < PHASE_FLASH_MS) return { text: PHASE_TEXT[i] ?? '', alpha: 1 - age / PHASE_FLASH_MS };
  }
  return null;
}

export interface FxView {
  last: Judgement | null;
  /** People count of the call that was a hit (that many dots are drawn on a hit) */
  people: number;
  now: number;
  /** Time play started (null if none) */
  playStartMs: number | null;
}

function zoneName(id: ZoneId): string {
  return ZONES.find((z) => z.id === id)?.name ?? '';
}

function drawReveal(ctx: Ctx, id: ZoneId, alpha: number): void {
  const z = ZONES.find((q) => q.id === id);
  if (!z) return;
  const r = zoneRect(z);
  ctx.strokeStyle = `rgba(${MISS},${alpha})`;
  ctx.lineWidth = 6;
  ctx.strokeRect(r.x + 3, r.y + 3, r.w - 6, r.h - 6);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = `700 28px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lines = labelLines(zoneName(id), r.w);
  lines.forEach((t, i) => ctx.fillText(t, r.x + r.w / 2, r.y + r.h / 2 + (i - (lines.length - 1) / 2) * 32, r.w - 16));
}

/** Effects on the map: correct flash, rising text and dots, wrong X and correct-zone outline, phase text. Call after drawing the map. */
export function drawFx(ctx: Ctx, v: FxView): void {
  ctx.save();
  const j = v.last;
  if (j) {
    const age = v.now - judgedAt(j);
    if (j.kind === 'hit' && j.zone && age >= 0) {
      const z = ZONES.find((q) => q.id === j.zone);
      if (z) {
        const r = zoneRect(z);
        if (age < HIT_FLASH_MS) {
          ctx.fillStyle = `rgba(${OK},${0.55 * (1 - age / HIT_FLASH_MS)})`;
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }
        if (age < RISE_MS) {
          const k = age / RISE_MS;
          ctx.globalAlpha = 1 - k * k;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const cx = r.x + r.w / 2;
          // Starts at the top edge of the zone and floats up (so it does not cover the zone label). A dark outline keeps it readable.
          const cy = r.y - 20 - RISE_PX * k;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#0b1220';
          ctx.lineWidth = 8;
          ctx.font = `700 48px ${FONT}`;
          ctx.strokeText(`+${j.points}`, cx, cy);
          ctx.fillStyle = `rgb(${OK})`;
          ctx.fillText(`+${j.points}`, cx, cy);
          ctx.font = `500 26px ${FONT}`;
          ctx.strokeText(`${(j.rtMs / 1000).toFixed(2)}s`, cx, cy + 36);
          ctx.fillStyle = '#e8eef8';
          ctx.fillText(`${(j.rtMs / 1000).toFixed(2)}s`, cx, cy + 36);
          ctx.globalAlpha = 1;
          // People dots: as many as the people count, on the lower row of the zone
          ctx.fillStyle = `rgb(${OK})`;
          for (let i = 0; i < v.people; i++) {
            ctx.beginPath();
            ctx.arc(cx + (i - (v.people - 1) / 2) * 26, r.y + r.h - 22, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else if (j.kind !== 'hit' && age >= 0 && age < WRONG_REVEAL_MS) {
      const alpha = Math.min(1, (WRONG_REVEAL_MS - age) / 200);
      for (const id of j.revealZones) drawReveal(ctx, id, alpha);
      if (j.kind === 'wrong') {
        const x = MAP_ORIGIN + j.x * (960 / 1000);
        const y = MAP_ORIGIN + j.y * (960 / 1000);
        ctx.strokeStyle = `rgba(${MISS},${alpha})`;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.moveTo(x + 20, y - 20);
        ctx.lineTo(x - 20, y + 20);
        ctx.stroke();
      }
    }
  }
  if (v.playStartMs !== null) {
    const f = phaseFlash(v.now - v.playStartMs);
    if (f) {
      ctx.globalAlpha = f.alpha * 0.8;
      ctx.fillStyle = '#35d0ff';
      ctx.font = `700 110px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.text, MAP_ORIGIN + 480, MAP_ORIGIN + 480);
    }
  }
  ctx.restore();
}
