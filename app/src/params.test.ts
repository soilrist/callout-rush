import { describe, expect, it } from 'vitest';
import { parseParams } from './params';

describe('parseParams', () => {
  it('인자가 없으면 기본값', () => {
    expect(parseParams('')).toEqual({ seed: null, timescale: 1, bot: null, state: null, at: null });
  });
  it('전부 읽는다', () => {
    expect(parseParams('?seed=7&timescale=30&bot=pro&state=result&at=1500')).toEqual({
      seed: 7, timescale: 30, bot: 'pro', state: 'result', at: 1500,
    });
  });
  it('틀린 값은 무시', () => {
    expect(parseParams('?seed=abc&timescale=-2&bot=god&state=x&at=')).toEqual({
      seed: null, timescale: 1, bot: null, state: null, at: null,
    });
  });
});
