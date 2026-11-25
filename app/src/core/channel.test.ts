import { describe, expect, it } from 'vitest';
import { isScoresUpdated, notifyScoresUpdated } from './channel';

describe('second window notice', () => {
  it('scores-updated  is the only message it recognizes', () => {
    expect(isScoresUpdated({ type: 'scores-updated' })).toBe(true);
    expect(isScoresUpdated({ type: 'x' })).toBe(false);
    expect(isScoresUpdated(null)).toBe(false);
  });
  it('BroadcastChannel  is missing, it does not throw', () => {
    const saved = globalThis.BroadcastChannel;
    // @ts-expect-error simulate an environment without it
    globalThis.BroadcastChannel = undefined;
    expect(() => notifyScoresUpdated()).not.toThrow();
    globalThis.BroadcastChannel = saved;
  });
});
