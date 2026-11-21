import { describe, expect, it } from 'vitest';
import { callLines, fitPx, pastCalls } from './hud';

const measure = (px: number, s: string): number => s.length * px * 0.6;

describe('callLines', () => {
  it('쉼표 뒤에서 끊는다', () => {
    expect(callLines('North Stairs, two!')).toEqual(['North Stairs,', 'two!']);
    expect(callLines('Tunnel, then Crane!')).toEqual(['Tunnel,', 'then Crane!']);
  });
  it('쉼표 없으면 한 줄', () => {
    expect(callLines('Roof!')).toEqual(['Roof!']);
  });
});

describe('fitPx', () => {
  it('짧으면 96', () => {
    expect(fitPx(['Roof,', 'one!'], measure)).toBe(96);
  });
  it('가장 긴 문장도 폭 732 안, 60 이상', () => {
    const lines = callLines('Container Row, then Loading Dock!');
    const px = fitPx(lines, measure);
    expect(px).toBeGreaterThanOrEqual(60);
    expect(px).toBeLessThan(96);
    expect(Math.max(...lines.map((l) => measure(px, l)))).toBeLessThanOrEqual(732);
  });
  it('끝까지 안 들어가면 최소 60', () => {
    expect(fitPx(['x'.repeat(100)], measure)).toBe(60);
  });
});

describe('pastCalls', () => {
  it('최신 위 최대 3개', () => {
    const h = [1, 2, 3, 4].map((n) => ({ ok: true, name: `Z${n}`, rtMs: n }));
    expect(pastCalls(h).map((p) => p.name)).toEqual(['Z4', 'Z3', 'Z2']);
    expect(pastCalls([])).toEqual([]);
  });
});
