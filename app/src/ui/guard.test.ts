import { describe, expect, it } from 'vitest';
import { createGuard, HEALTH_KEY, readErrors, RELOAD_DELAY_MS } from './guard';

function fake() {
  const m = new Map<string, string>();
  const calls: { ms: number }[] = [];
  let reloads = 0;
  const storage = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); } };
  const guard = createGuard({ storage, reload: () => { reloads += 1; }, schedule: (fn, ms) => { calls.push({ ms }); fn(); } });
  return { m, calls, guard, reloads: () => reloads };
}

describe('guard', () => {
  it('오류를 셀 때마다 저장값이 늘고 새로 고침은 한 번만 예약한다', () => {
    const f = fake();
    f.guard.report();
    f.guard.report();
    expect(f.guard.errors()).toBe(2);
    expect(f.calls).toEqual([{ ms: RELOAD_DELAY_MS }]);
    expect(f.reloads()).toBe(1);
  });
  it('망가진 저장값은 0 으로 읽는다', () => {
    expect(readErrors({ getItem: () => '{not json' })).toBe(0);
    expect(readErrors({ getItem: () => JSON.stringify({ errors: -3 }) })).toBe(0);
    expect(HEALTH_KEY).toBe('calloutrush.v1.health');
  });
});
