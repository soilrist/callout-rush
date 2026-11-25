import { describe, expect, it } from 'vitest';
import type { Judgement } from '../core/game';
import { judgedAt, labelAlphaAt, phaseFlash, shakeOffset } from './fx';

const wrong: Judgement = { kind: 'wrong', points: 0, rtMs: 0, revealZones: ['Z01'], revealUntil: 1600, x: 5, y: 5, zone: null };
const hit: Judgement = { kind: 'hit', points: 120, rtMs: 610, revealZones: [], revealUntil: 1000, x: 1, y: 1, zone: 'Z01' };

describe('labelAlphaAt', () => {
  it('stage 1 is 1, 1 s after stage 2 starts is 0.5, from 2 s on is 0', () => {
    expect(labelAlphaAt(14999)).toBe(1);
    expect(labelAlphaAt(16000)).toBeCloseTo(0.5);
    expect(labelAlphaAt(17000)).toBe(0);
    expect(labelAlphaAt(50000)).toBe(0);
  });
});

describe('judgedAt', () => {
  it('hit is the click time, wrong is the reveal end - 600', () => {
    expect(judgedAt(hit)).toBe(1000);
    expect(judgedAt(wrong)).toBe(1000);
  });
});

describe('shakeOffset', () => {
  it('moves only within 120ms of a wrong answer and never beyond 6px', () => {
    const vals = [0, 10, 30, 60, 90, 119].map((a) => shakeOffset(wrong, 1000 + a));
    expect(vals.some((v) => v !== 0)).toBe(true);
    expect(vals.every((v) => Math.abs(v) <= 6)).toBe(true);
    expect(shakeOffset(wrong, 1120)).toBe(0);
  });
  it('a right answer and none are 0', () => {
    expect(shakeOffset(hit, 1010)).toBe(0);
    expect(shakeOffset(null, 0)).toBe(0);
  });
});

describe('phaseFlash', () => {
  it('the text shows only for 800ms after a stage starts', () => {
    expect(phaseFlash(0)).toBeNull();
    expect(phaseFlash(15100)?.text).toBe('LIVE');
    expect(phaseFlash(40000)?.text).toBe('CLUTCH');
    expect(phaseFlash(5000)).toBeNull();
    expect(phaseFlash(15800)).toBeNull();
  });
});
