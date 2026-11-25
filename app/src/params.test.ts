import { describe, expect, it } from 'vitest';
import { parseParams } from './params';

describe('parseParams', () => {
  it('defaults when there are no arguments', () => {
    expect(parseParams('')).toEqual({ seed: null, timescale: 1, bot: null, state: null, at: null, hold: false });
  });
  it('reads them all', () => {
    expect(parseParams('?seed=7&timescale=30&bot=pro&state=result&at=1500&hold=1')).toEqual({
      seed: 7, timescale: 30, bot: 'pro', state: 'result', at: 1500, hold: true,
    });
  });
  it('wrong values are ignored', () => {
    expect(parseParams('?seed=abc&timescale=-2&bot=god&state=x&at=')).toEqual({
      seed: null, timescale: 1, bot: null, state: null, at: null, hold: false,
    });
  });
});
