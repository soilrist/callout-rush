import { describe, expect, it } from 'vitest';
import { accuracy, avgReaction, baseOf, grade, mult, points, speedOf } from './scoring';

// Test-only values — edges are read from config so a changed config number does not break them
import { GRADE_BOUNDS, MULT_CAP, RT_FLOOR_MS } from './config';

describe('points', () => {
  it('a rt at or below the floor gives full score (base × multiplier)', () => {
    expect(points(100, RT_FLOOR_MS, 3000, 0)).toBe(100);
    expect(points(100, 0, 3000, 0)).toBe(100);
  });
  it('rt = T gives half', () => {
    expect(points(100, 3000, 3000, 0)).toBe(50);
    expect(points(200, 5000, 3000, 0)).toBe(100);
  });
  it('a middle speed is between the two', () => {
    const p = points(100, 1650, 3000, 0);
    expect(p).toBeGreaterThan(50);
    expect(p).toBeLessThan(100);
  });
  it('the streak multiplier is applied', () => {
    expect(points(100, RT_FLOOR_MS, 3000, 5)).toBe(150);
  });
});

describe('mult', () => {
  it('streak 0 gives 1, streak 10 or more gives the cap', () => {
    expect(mult(0)).toBe(1);
    expect(mult(10)).toBe(MULT_CAP);
    expect(mult(50)).toBe(MULT_CAP);
  });
});

describe('speedOf', () => {
  it('clamps to 0–1', () => {
    expect(speedOf(0, 3000)).toBe(1);
    expect(speedOf(9999, 3000)).toBe(0);
  });
});

describe('baseOf', () => {
  it('base score per crew size and for two zones', () => {
    expect([baseOf(1), baseOf(2), baseOf(3), baseOf(0)]).toEqual([100, 150, 200, 150]);
  });
});

describe('grade', () => {
  it('just below and above the 4 edges', () => {
    const names = ['ROOKIE', 'ENTRY', 'ANCHOR', 'SHOT CALLER', 'IGL'];
    GRADE_BOUNDS.forEach((b, i) => {
      expect(grade(b - 1)).toBe(names[i]);
      expect(grade(b)).toBe(names[i + 1]);
    });
    expect(grade(0)).toBe('ROOKIE');
  });
});

describe('accuracy · avgReaction', () => {
  it('0 targets give 0% and null', () => {
    expect(accuracy(0, 0)).toBe(0);
    expect(avgReaction([])).toBeNull();
  });
  it('ratio and average', () => {
    expect(accuracy(3, 4)).toBe(75);
    expect(avgReaction([400, 600])).toBe(500);
  });
});
