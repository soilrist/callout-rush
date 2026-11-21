import { describe, expect, it } from 'vitest';
import { COUNTUP_MS, rankLabel } from './screens';

describe('결과 순위 글자', () => {
  it('1등은 NEW #1 TODAY 금색', () => {
    expect(rankLabel(1)).toEqual({ text: 'NEW #1 TODAY', gold: true });
  });
  it('3등까지 금색, 4등부터 보통 색', () => {
    expect(rankLabel(3)).toEqual({ text: '#3 TODAY', gold: true });
    expect(rankLabel(4)).toEqual({ text: '#4 TODAY', gold: false });
  });
  it('카운트업은 0.8초', () => {
    expect(COUNTUP_MS).toBe(800);
  });
});
