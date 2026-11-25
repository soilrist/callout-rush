import { describe, expect, it } from 'vitest';
import { nextCall, type Call } from './calls';
import { mulberry32 } from './rng';
import { RECENT_EXCLUDE } from './config';
import { ZONES, type ZoneId } from './zones';

/** Draws n calls in a row (passing the recent zones along) */
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
  it('same seed gives the same order, values are in [0, 1)', () => {
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
  it('same seed gives the same call order', () => {
    expect(draw(7, 3, 50).map((d) => d.call)).toEqual(draw(7, 3, 50).map((d) => d.call));
  });

  it('10,000 draws give a crew ratio of 50/35/15 ±2pp', () => {
    const calls = draw(123, 1, 10000).map((d) => d.call);
    const share = (p: number) => (calls.filter((c) => c.people === p).length / calls.length) * 100;
    expect(Math.abs(share(1) - 50)).toBeLessThanOrEqual(2);
    expect(Math.abs(share(2) - 35)).toBeLessThanOrEqual(2);
    expect(Math.abs(share(3) - 15)).toBeLessThanOrEqual(2);
  });

  it('does not repeat a recent zone', () => {
    for (const phase of [1, 3] as const) {
      for (const { call, recent } of draw(5, phase, 2000)) {
        const banned = recent.slice(-RECENT_EXCLUDE);
        for (const z of call.zones) expect(banned).not.toContain(z);
      }
    }
  });

  it('stages 1 and 2 give one-zone calls only, stage 3 gives about half two-zone calls (±3pp)', () => {
    expect(draw(9, 2, 500).every((d) => d.call.zones.length === 1)).toBe(true);
    const calls = draw(9, 3, 10000).map((d) => d.call);
    const two = (calls.filter((c) => c.zones.length === 2).length / calls.length) * 100;
    expect(Math.abs(two - 50)).toBeLessThanOrEqual(3);
  });

  it('the two zones of a two-zone call differ', () => {
    for (const { call } of draw(11, 3, 3000)) {
      if (call.zones.length === 2) expect(call.zones[0]).not.toBe(call.zones[1]);
    }
  });

  it('the sentence matches the §5.2 template', () => {
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
