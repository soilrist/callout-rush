import { describe, expect, it } from 'vitest';
import { BOT_PROFILES, decide, profileByName, simulate } from './bot';
import { initGame, step } from './game';
import { mulberry32 } from './rng';

describe('bot (§5.3)', () => {
  it('the 3 profiles match the design values', () => {
    expect(BOT_PROFILES.map((p) => [p.name, p.meanMs, p.sdMs, p.accuracy])).toEqual([
      ['rookie', 1500, 300, 0.8],
      ['regular', 1100, 200, 0.9],
      ['pro', 750, 120, 0.97],
    ]);
  });

  it('decide is null when there is no call', () => {
    expect(decide(profileByName('pro'), initGame(1), mulberry32(1))).toBeNull();
  });

  it('decide reaction time is at least 200ms', () => {
    let s = initGame(3);
    s = step(s, { type: 'TICK', now: 0 });
    s = step(s, { type: 'TICK', now: 3000 });
    const fast = { id: 'B3', name: 'pro', meanMs: 0, sdMs: 500, accuracy: 1 } as const;
    const rng = mulberry32(5);
    for (let i = 0; i < 200; i++) {
      expect(decide(fast, s, rng)?.delayMs).toBeGreaterThanOrEqual(200);
    }
  });

  it('same profile and seed give the same result', () => {
    const p = profileByName('regular');
    const a = simulate(p, 7);
    const b = simulate(p, 7);
    expect([a.score, a.hit, a.finished]).toEqual([b.score, b.hit, b.finished]);
  });

  for (const p of BOT_PROFILES) {
    it(`${p.name}: 1000-round average accuracy is ${p.accuracy * 100}% ±3%p, every round ends done`, () => {
      let sum = 0;
      for (let seed = 1; seed <= 1000; seed++) {
        const s = simulate(p, seed);
        expect(s.status).toBe('done');
        sum += s.hit / s.finished;
      }
      const mean = sum / 1000;
      expect(Math.abs(mean - p.accuracy)).toBeLessThanOrEqual(0.03);
    });
  }
});
