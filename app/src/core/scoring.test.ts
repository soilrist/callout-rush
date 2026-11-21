import { describe, expect, it } from 'vitest';
import { accuracy, avgReaction, baseOf, grade, mult, points, speedOf } from './scoring';

// 테스트 전용 값 — config 숫자가 바뀌어도 깨지지 않게 경계는 config 에서 읽는다
import { GRADE_BOUNDS, MULT_CAP, RT_FLOOR_MS } from './config';

describe('points', () => {
  it('rt 가 바닥 이하면 만점(base × 배수)', () => {
    expect(points(100, RT_FLOOR_MS, 3000, 0)).toBe(100);
    expect(points(100, 0, 3000, 0)).toBe(100);
  });
  it('rt = T 면 절반', () => {
    expect(points(100, 3000, 3000, 0)).toBe(50);
    expect(points(200, 5000, 3000, 0)).toBe(100);
  });
  it('중간 속도는 둘 사이', () => {
    const p = points(100, 1650, 3000, 0);
    expect(p).toBeGreaterThan(50);
    expect(p).toBeLessThan(100);
  });
  it('연속 배수가 곱해진다', () => {
    expect(points(100, RT_FLOOR_MS, 3000, 5)).toBe(150);
  });
});

describe('mult', () => {
  it('연속 0 이면 1, 연속 10 이상이면 상한', () => {
    expect(mult(0)).toBe(1);
    expect(mult(10)).toBe(MULT_CAP);
    expect(mult(50)).toBe(MULT_CAP);
  });
});

describe('speedOf', () => {
  it('0~1 로 자른다', () => {
    expect(speedOf(0, 3000)).toBe(1);
    expect(speedOf(9999, 3000)).toBe(0);
  });
});

describe('baseOf', () => {
  it('인원별·두 곳 기본 점수', () => {
    expect([baseOf(1), baseOf(2), baseOf(3), baseOf(0)]).toEqual([100, 150, 200, 150]);
  });
});

describe('grade', () => {
  it('경계 4곳 바로 아래·위', () => {
    const names = ['ROOKIE', 'ENTRY', 'ANCHOR', 'SHOT CALLER', 'IGL'];
    GRADE_BOUNDS.forEach((b, i) => {
      expect(grade(b - 1)).toBe(names[i]);
      expect(grade(b)).toBe(names[i + 1]);
    });
    expect(grade(0)).toBe('ROOKIE');
  });
});

describe('accuracy · avgReaction', () => {
  it('목표 0개면 0% 와 null', () => {
    expect(accuracy(0, 0)).toBe(0);
    expect(avgReaction([])).toBeNull();
  });
  it('비율과 평균', () => {
    expect(accuracy(3, 4)).toBe(75);
    expect(avgReaction([400, 600])).toBe(500);
  });
});
