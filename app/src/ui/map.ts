/** 맵 그리기 (DESIGN §5.1, docs/reference/play.md). 무대 좌표(1920×1080)에 Canvas 2D 로 그린다. */
import { MAP_PX, MAP_UNITS } from '../core/config';
import { ZONES, type Zone, type ZoneId } from '../core/zones';

export const MAP_ORIGIN = 60;
const SCALE = MAP_PX / MAP_UNITS;
const C = {
  bg: '#0b1220',
  line: '#24324d',
  zone: '#1b2a44',
  text: '#e8eef8',
} as const;
const INSET = 8;
const LABEL_PX = 28;
/** 28px 대문자 한 글자 폭 근사(시트: 약 17px, 경계 LOADING DOCK 이 두 줄이 되게 18) */
const CHAR_PX = 18;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 맵 단위 → 무대 px 사각형 */
export function zoneRect(z: Zone): Rect {
  return {
    x: MAP_ORIGIN + z.x * SCALE,
    y: MAP_ORIGIN + z.y * SCALE,
    w: z.w * SCALE,
    h: z.h * SCALE,
  };
}

/** 무대 px → 맵 단위 (클릭 판정용). 맵 밖이어도 그대로 변환한다. */
export function stageToMap(x: number, y: number): { x: number; y: number } {
  return { x: (x - MAP_ORIGIN) / SCALE, y: (y - MAP_ORIGIN) / SCALE };
}

/** 이름표 줄: 한 줄로 안 들어가면 단어 사이에서 두 줄. */
export function labelLines(name: string, widthPx: number): string[] {
  const up = name.toUpperCase();
  const words = up.split(' ');
  if (words.length < 2 || up.length * CHAR_PX <= widthPx - 2 * INSET) return [up];
  return [words[0] as string, words.slice(1).join(' ')];
}

type Ctx = CanvasRenderingContext2D;

function stroke(ctx: Ctx, pts: readonly (readonly [number, number])[], close = false): void {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  if (close) ctx.closePath();
  ctx.stroke();
}

function art(ctx: Ctx, id: ZoneId, r: Rect): void {
  const x = r.x + INSET;
  const y = r.y + INSET;
  const w = r.w - 2 * INSET;
  const h = r.h - 2 * INSET;
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (id) {
    case 'Z01':
    case 'Z12': {
      for (let i = 1; i < 7; i++) stroke(ctx, [[x, y + (h * i) / 7], [x + w, y + (h * i) / 7]]);
      const up = id === 'Z01';
      const tip = up ? y : y + h;
      const base = up ? y + 22 : y + h - 22;
      stroke(ctx, [[cx - 14, base], [cx, tip], [cx + 14, base]]);
      break;
    }
    case 'Z02':
      for (let i = -h; i < w; i += 22) {
        const x0 = Math.max(x, x + i);
        const y0 = y + Math.max(0, -i);
        const x1 = Math.min(x + w, x + i + h);
        const y1 = y + Math.min(h, w - i);
        stroke(ctx, [[x0, y0], [x1, y1]]);
      }
      ctx.strokeRect(x + 16, y + h - 46, 30, 30);
      ctx.strokeRect(x + w - 46, y + h - 46, 30, 30);
      break;
    case 'Z03':
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) ctx.strokeRect(x + 14 + i * (w / 3), y + 14 + j * (h / 2), w / 3 - 28, h / 2 - 28);
      break;
    case 'Z04':
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.stroke();
      stroke(ctx, [[cx, cy], [x + w, y + 6]]);
      break;
    case 'Z05':
      for (let i = 0; i < 5; i++) stroke(ctx, [[x + i * (w / 5), y], [x + i * (w / 5) + w / 10, y + 14], [x + (i + 1) * (w / 5), y]]);
      ctx.strokeRect(x + 10, y + h - 44, 54, 30);
      break;
    case 'Z06':
      for (let i = 0; i < 4; i++) ctx.strokeRect(x + 10, y + 10 + i * (h / 4), w - 20, h / 4 - 20);
      break;
    case 'Z07':
    case 'Z09': {
      const left = id === 'Z07';
      const hinge = left ? x : x + w;
      const dir = left ? 1 : -1;
      stroke(ctx, [[hinge, y + 14], [hinge + dir * 30, y + 40], [hinge + dir * 30, y + h / 2 - 10], [hinge, y + h / 2 - 20]], true);
      stroke(ctx, [[hinge, y + h - 14], [hinge + dir * 30, y + h - 40], [hinge + dir * 30, y + h / 2 + 10], [hinge, y + h / 2 + 20]], true);
      break;
    }
    case 'Z08':
      ctx.beginPath();
      ctx.arc(cx, y + h - 6, w / 2 - 10, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = C.bg;
      ctx.beginPath();
      ctx.arc(cx, y + h - 6, w / 2 - 30, Math.PI, 0);
      ctx.fill();
      break;
    case 'Z10':
      ctx.strokeRect(x + 10, y + h - 50, w - 20, 30);
      ctx.beginPath();
      ctx.arc(x + w - 40, y + 40, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + w - 40, y + 40, 8, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'Z11':
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, y + 30 + i * (h / 3), Math.min(w / 2 - 14, h / 6 - 4), 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
  }
}

export interface MapOptions {
  /** 이름표 투명도 0~1 */
  labelAlpha: number;
}

/** 맵 바탕·바닥 선·구역 12개(채움·테두리·그림)·이름표를 그린다. */
export function drawMap(ctx: Ctx, opts: MapOptions): void {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = C.line;
  ctx.fillStyle = C.bg;
  ctx.fillRect(MAP_ORIGIN, MAP_ORIGIN, MAP_PX, MAP_PX);
  ctx.strokeRect(MAP_ORIGIN, MAP_ORIGIN, MAP_PX, MAP_PX);

  // 빈 땅 점선 길: 구역 아래에 깔고, 구역 채움이 위를 덮는다.
  ctx.setLineDash([10, 12]);
  for (const u of [250, 500, 750]) {
    const p = MAP_ORIGIN + u * SCALE;
    stroke(ctx, [[MAP_ORIGIN, p], [MAP_ORIGIN + MAP_PX, p]]);
    stroke(ctx, [[p, MAP_ORIGIN], [p, MAP_ORIGIN + MAP_PX]]);
  }
  ctx.setLineDash([]);

  for (const z of ZONES) {
    const r = zoneRect(z);
    ctx.fillStyle = C.zone;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    art(ctx, z.id, r);
  }

  if (opts.labelAlpha > 0) {
    ctx.globalAlpha = Math.min(1, opts.labelAlpha);
    ctx.fillStyle = C.text;
    ctx.font = `700 ${LABEL_PX}px "Chakra Petch", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const z of ZONES) {
      const r = zoneRect(z);
      const lines = labelLines(z.name, r.w);
      lines.forEach((t, i) => {
        ctx.fillText(t, r.x + r.w / 2, r.y + r.h / 2 + (i - (lines.length - 1) / 2) * 32, r.w - 2 * INSET);
      });
    }
  }
  ctx.restore();
}
