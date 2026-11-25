import { describe, expect, it } from 'vitest';
import { COUNTUP_MS, rankLabel } from './screens';

describe('result rank text', () => {
  it('1st is NEW #1 TODAY in gold', () => {
    expect(rankLabel(1)).toEqual({ text: 'NEW #1 TODAY', gold: true });
  });
  it('gold up to 3rd, normal color from 4th', () => {
    expect(rankLabel(3)).toEqual({ text: '#3 TODAY', gold: true });
    expect(rankLabel(4)).toEqual({ text: '#4 TODAY', gold: false });
  });
  it('the count-up takes 0.8 s', () => {
    expect(COUNTUP_MS).toBe(800);
  });
});
