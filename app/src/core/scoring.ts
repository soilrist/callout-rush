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

/** Base score of one zone. people 0 = a zone of a two-zone call (§4.4) */
export function baseOf(people: 0 | 1 | 2 | 3): number {
  if (people === 0) return BASE_TWO_ZONE;
  const base = BASE_BY_PEOPLE[people - 1];
  if (base === undefined) throw new Error(`Unknown player count: ${people}`);
  return base;
}

/** Speed 0–1. 1 if rt is at or below the floor (RT_FLOOR_MS), 0 if at or above the time limit T. */
export function speedOf(rtMs: number, limitMs: number): number {
  const v = (limitMs - rtMs) / (limitMs - RT_FLOOR_MS);
  return Math.min(1, Math.max(0, v));
}

/** Streak (before this hit) → multiplier */
export function mult(streakBefore: number): number {
  return Math.min(1 + MULT_STEP * streakBefore, MULT_CAP);
}

/** Score of one hit zone */
export function points(base: number, rtMs: number, limitMs: number, streakBefore: number): number {
  const ratio = SPEED_MIN_RATIO + (SPEED_MAX_RATIO - SPEED_MIN_RATIO) * speedOf(rtMs, limitMs);
  return Math.round(base * ratio * mult(streakBefore));
}

/** Score → grade name (at or above a boundary score gives the higher grade) */
export function grade(score: number): GradeName {
  let idx = 0;
  for (const bound of GRADE_BOUNDS) {
    if (score >= bound) idx += 1;
  }
  return GRADE_NAMES[idx] ?? 'ROOKIE';
}

/** Accuracy 0–100 (%). 0 if no targets finished. */
export function accuracy(hit: number, finished: number): number {
  return finished <= 0 ? 0 : (hit / finished) * 100;
}

/** Mean reaction (ms) of the hit clicks. null if none (the screen shows —). */
export function avgReaction(rts: readonly number[]): number | null {
  if (rts.length === 0) return null;
  return rts.reduce((a, b) => a + b, 0) / rts.length;
}
