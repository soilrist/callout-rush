import {
  BASE_BY_PEOPLE,
  BASE_TWO_ZONE,
  GRADE_BOUNDS,
  MULT_CAP,
  MULT_STEP,
  RT_FLOOR_MS,
  SPEED_MAX_RATIO,
  SPEED_MIN_RATIO,
} from './config';

export const GRADE_NAMES = ['ROOKIE', 'ENTRY', 'ANCHOR', 'SHOT CALLER', 'IGL'] as const;
export type GradeName = (typeof GRADE_NAMES)[number];

/** 구역 하나의 기본 점수. people 0 = 두 곳 콜의 구역 (§4.4) */
export function baseOf(people: 0 | 1 | 2 | 3): number {
  if (people === 0) return BASE_TWO_ZONE;
  const base = BASE_BY_PEOPLE[people - 1];
  if (base === undefined) throw new Error(`없는 인원: ${people}`);
  return base;
}

/** 속도 0~1. rt 가 바닥(RT_FLOOR_MS) 이하면 1, 제한 시간 T 이상이면 0. */
export function speedOf(rtMs: number, limitMs: number): number {
  const v = (limitMs - rtMs) / (limitMs - RT_FLOOR_MS);
  return Math.min(1, Math.max(0, v));
}

/** 연속(이번 것 맞히기 전) → 배수 */
export function mult(streakBefore: number): number {
  return Math.min(1 + MULT_STEP * streakBefore, MULT_CAP);
}

/** 맞힌 구역 하나의 점수 */
export function points(base: number, rtMs: number, limitMs: number, streakBefore: number): number {
  const ratio = SPEED_MIN_RATIO + (SPEED_MAX_RATIO - SPEED_MIN_RATIO) * speedOf(rtMs, limitMs);
  return Math.round(base * ratio * mult(streakBefore));
}

/** 점수 → 등급 이름 (경계 점수 이상이면 위 등급) */
export function grade(score: number): GradeName {
  let idx = 0;
  for (const bound of GRADE_BOUNDS) {
    if (score >= bound) idx += 1;
  }
  return GRADE_NAMES[idx] ?? 'ROOKIE';
}

/** 정확도 0~100(%). 끝난 목표가 0이면 0. */
export function accuracy(hit: number, finished: number): number {
  return finished <= 0 ? 0 : (hit / finished) * 100;
}

/** 맞힌 클릭의 평균 반응(ms). 없으면 null (화면엔 —). */
export function avgReaction(rts: readonly number[]): number | null {
  if (rts.length === 0) return null;
  return rts.reduce((a, b) => a + b, 0) / rts.length;
}
