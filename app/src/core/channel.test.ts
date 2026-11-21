import { describe, expect, it } from 'vitest';
import { isScoresUpdated, notifyScoresUpdated } from './channel';

describe('보조 창 알림', () => {
  it('scores-updated 만 알아본다', () => {
    expect(isScoresUpdated({ type: 'scores-updated' })).toBe(true);
    expect(isScoresUpdated({ type: 'x' })).toBe(false);
    expect(isScoresUpdated(null)).toBe(false);
  });
  it('BroadcastChannel 이 없어도 던지지 않는다', () => {
    const saved = globalThis.BroadcastChannel;
    // @ts-expect-error 없는 환경 흉내
    globalThis.BroadcastChannel = undefined;
    expect(() => notifyScoresUpdated()).not.toThrow();
    globalThis.BroadcastChannel = saved;
  });
});
