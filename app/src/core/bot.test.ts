import { describe, expect, it } from 'vitest';
import { BOT_PROFILES, decide, profileByName, simulate } from './bot';
import { initGame, step } from './game';
import { mulberry32 } from './rng';

describe('봇 (§5.3)', () => {
  it('프로필 3개가 설계서 값과 같다', () => {
    expect(BOT_PROFILES.map((p) => [p.name, p.meanMs, p.sdMs, p.accuracy])).toEqual([
      ['rookie', 1500, 300, 0.8],
      ['regular', 1100, 200, 0.9],
      ['pro', 750, 120, 0.97],
    ]);
  });

  it('콜이 없으면 decide 는 null', () => {
    expect(decide(profileByName('pro'), initGame(1), mulberry32(1))).toBeNull();
  });

  it('decide 의 반응 시간은 최소 200ms 이상이다', () => {
    let s = initGame(3);
    s = step(s, { type: 'TICK', now: 0 });
    s = step(s, { type: 'TICK', now: 3000 });
    const fast = { id: 'B3', name: 'pro', meanMs: 0, sdMs: 500, accuracy: 1 } as const;
    const rng = mulberry32(5);
    for (let i = 0; i < 200; i++) {
      expect(decide(fast, s, rng)?.delayMs).toBeGreaterThanOrEqual(200);
    }
  });

  it('같은 프로필·시드면 같은 결과', () => {
    const p = profileByName('regular');
    const a = simulate(p, 7);
    const b = simulate(p, 7);
    expect([a.score, a.hit, a.finished]).toEqual([b.score, b.hit, b.finished]);
  });

  for (const p of BOT_PROFILES) {
    it(`${p.name}: 1000판 평균 정확도가 ${p.accuracy * 100}% ±3%p, 판마다 done`, () => {
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
