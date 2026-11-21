import { describe, expect, it } from 'vitest';
import { nextCall, type Call } from './calls';
import { mulberry32 } from './rng';
import { RECENT_EXCLUDE } from './config';
import { ZONES, type ZoneId } from './zones';

/** n 개 콜을 이어서 뽑는다 (최근 구역을 넘겨 가며) */
function draw(seed: number, phase: 1 | 2 | 3, n: number): { call: Call; recent: ZoneId[] }[] {
  const rng = mulberry32(seed);
  const recent: ZoneId[] = [];
  const out: { call: Call; recent: ZoneId[] }[] = [];
  for (let i = 0; i < n; i++) {
    const before = [...recent];
    const call = nextCall(rng, phase, before);
    out.push({ call, recent: before });
    recent.push(...call.zones);
  }
  return out;
}

describe('mulberry32', () => {
  it('같은 시드는 같은 순서, 값은 0 이상 1 미만', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});

describe('nextCall', () => {
  it('같은 시드면 콜 순서가 같다', () => {
    expect(draw(7, 3, 50).map((d) => d.call)).toEqual(draw(7, 3, 50).map((d) => d.call));
  });

  it('1만 번 뽑으면 인원 비율이 50/35/15 ±2%p', () => {
    const calls = draw(123, 1, 10000).map((d) => d.call);
    const share = (p: number) => (calls.filter((c) => c.people === p).length / calls.length) * 100;
    expect(Math.abs(share(1) - 50)).toBeLessThanOrEqual(2);
    expect(Math.abs(share(2) - 35)).toBeLessThanOrEqual(2);
    expect(Math.abs(share(3) - 15)).toBeLessThanOrEqual(2);
  });

  it('최근 구역과 안 겹친다', () => {
    for (const phase of [1, 3] as const) {
      for (const { call, recent } of draw(5, phase, 2000)) {
        const banned = recent.slice(-RECENT_EXCLUDE);
        for (const z of call.zones) expect(banned).not.toContain(z);
      }
    }
  });

  it('단계 1·2 는 한 곳 콜만, 단계 3 은 두 곳 콜이 절반쯤 (±3%p)', () => {
    expect(draw(9, 2, 500).every((d) => d.call.zones.length === 1)).toBe(true);
    const calls = draw(9, 3, 10000).map((d) => d.call);
    const two = (calls.filter((c) => c.zones.length === 2).length / calls.length) * 100;
    expect(Math.abs(two - 50)).toBeLessThanOrEqual(3);
  });

  it('두 곳 콜의 두 구역은 다르다', () => {
    for (const { call } of draw(11, 3, 3000)) {
      if (call.zones.length === 2) expect(call.zones[0]).not.toBe(call.zones[1]);
    }
  });

  it('문장이 §5.2 틀과 일치한다', () => {
    const name = (id: ZoneId) => ZONES.find((z) => z.id === id)?.name;
    const words = ['', 'one', 'two', 'three'];
    for (const { call } of draw(13, 3, 3000)) {
      if (call.zones.length === 1) {
        const id = call.zones[0] as ZoneId;
        expect(call.text).toBe(`${name(id)}, ${words[call.people]}!`);
      } else {
        const [a, b] = call.zones as [ZoneId, ZoneId];
        expect(call.people).toBe(0);
        expect(call.text).toBe(`${name(a)}, then ${name(b)}!`);
      }
    }
  });
});
