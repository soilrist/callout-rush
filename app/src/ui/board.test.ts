import { describe, expect, it } from 'vitest';
import type { ScoreEntry } from '../core/scores';
import { needsYouRow, rowY } from './board';

const e = (id: string): ScoreEntry => ({ id, name: 'AAA', score: 1, acc: 1, avgRt: 1, streak: 1, ts: 1 });

describe('순위 화면', () => {
  it('줄 y 는 130 부터 72씩, 10번째 줄 끝은 YOU 줄(862) 위', () => {
    expect(rowY(0)).toBe(130);
    expect(rowY(9) + 72).toBeLessThanOrEqual(862);
  });
  it('10등 밖이면 YOU 줄, 안이면 아니다', () => {
    const rows = ['a', 'b', 'c'].map(e);
    expect(needsYouRow(rows, 'z', 23)).toBe(true);
    expect(needsYouRow(rows, 'b', 2)).toBe(false);
    expect(needsYouRow(rows, null, 0)).toBe(false);
  });
});
