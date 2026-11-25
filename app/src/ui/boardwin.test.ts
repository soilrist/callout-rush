import { describe, expect, it } from 'vitest';
import type { ScoreEntry } from '../core/scores';
import { ALL, BEAT, TODAY, allRowY, findNewId, flashAlpha, slideOffset, todayRowY } from './boardwin';

const e = (id: string): ScoreEntry => ({ id, name: 'AAA', score: 1, acc: 1, avgRt: 1, streak: 1, ts: 1 });

describe('second window rank screen', () => {
  it('row height is at least 80px and the areas do not overlap', () => {
    expect(TODAY.h).toBeGreaterThanOrEqual(80);
    expect(ALL.h).toBeGreaterThanOrEqual(80);
    expect(todayRowY(9) + TODAY.h).toBeLessThanOrEqual(1080);
    expect(allRowY(4) + ALL.h).toBeLessThanOrEqual(BEAT.y);
  });
  it('the flash is 0 after 3 s and the slide is 0 after 0.6 s', () => {
    expect(flashAlpha(0)).toBeCloseTo(0.35);
    expect(flashAlpha(3000)).toBe(0);
    expect(slideOffset(0)).toBe(160);
    expect(slideOffset(600)).toBe(0);
  });
  it('finding the new id: none on the first read, after that the first row that was not there before', () => {
    const rows = [e('a'), e('b'), e('c')];
    expect(findNewId(null, rows)).toBeNull();
    expect(findNewId(new Set(['a', 'c']), rows)).toBe('b');
    expect(findNewId(new Set(['a', 'b', 'c']), rows)).toBeNull();
  });
});
