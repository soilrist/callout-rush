import { describe, expect, it } from 'vitest';
import type { ScoreEntry } from '../core/scores';
import { needsYouRow, rowY } from './board';

const e = (id: string): ScoreEntry => ({ id, name: 'AAA', score: 1, acc: 1, avgRt: 1, streak: 1, ts: 1 });

describe('rank screen', () => {
  it('row y starts at 130 in steps of 72, and the end of row 10 is above the YOU row (862)', () => {
    expect(rowY(0)).toBe(130);
    expect(rowY(9) + 72).toBeLessThanOrEqual(862);
  });
  it('outside the top 10 shows the YOU row, inside does not', () => {
    const rows = ['a', 'b', 'c'].map(e);
    expect(needsYouRow(rows, 'z', 23)).toBe(true);
    expect(needsYouRow(rows, 'b', 2)).toBe(false);
    expect(needsYouRow(rows, null, 0)).toBe(false);
  });
});
