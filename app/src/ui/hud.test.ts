import { describe, expect, it } from 'vitest';
import { callLines, fitPx, pastCalls } from './hud';

const measure = (px: number, s: string): number => s.length * px * 0.6;

describe('callLines', () => {
  it('breaks after the comma', () => {
    expect(callLines('North Stairs, two!')).toEqual(['North Stairs,', 'two!']);
    expect(callLines('Tunnel, then Crane!')).toEqual(['Tunnel,', 'then Crane!']);
  });
  it('one line without a comma', () => {
    expect(callLines('Roof!')).toEqual(['Roof!']);
  });
});

describe('fitPx', () => {
  it('96 when short', () => {
    expect(fitPx(['Roof,', 'one!'], measure)).toBe(96);
  });
  it('even the longest sentence fits in width 732, at least 60', () => {
    const lines = callLines('Container Row, then Loading Dock!');
    const px = fitPx(lines, measure);
    expect(px).toBeGreaterThanOrEqual(60);
    expect(px).toBeLessThan(96);
    expect(Math.max(...lines.map((l) => measure(px, l)))).toBeLessThanOrEqual(732);
  });
  it('at least 60 if it does not fit all the way', () => {
    expect(fitPx(['x'.repeat(100)], measure)).toBe(60);
  });
});

describe('pastCalls', () => {
  it('newest on top, at most 3', () => {
    const h = [1, 2, 3, 4].map((n) => ({ ok: true, name: `Z${n}`, rtMs: n }));
    expect(pastCalls(h).map((p) => p.name)).toEqual(['Z4', 'Z3', 'Z2']);
    expect(pastCalls([])).toEqual([]);
  });
});
