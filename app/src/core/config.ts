/** All balance and limit numbers. Sources and reasons are in docs/DESIGN.md §6 — when a value changes, fix that table too. */

// §6.1 Round defaults
export const GAME_MS = 60000;
export const COUNTDOWN_MS = 3000;
export const CALL_GAP_MS = 300;
/** One side of the map on the stage (stage px) */
export const MAP_PX = 960;
/** One side of the map unit coordinate system (§5.1) */
export const MAP_UNITS = 1000;
export const ZONE_MIN_GAP = 20;

// §6.2 Score
/** Base score of a one-zone call by people count (index 0 = 1 person) */
export const BASE_BY_PEOPLE = [100, 150, 200] as const;
/** Base score per zone of a two-zone call */
export const BASE_TWO_ZONE = 150;
/** People ratio for 1/2/3 (%) */
export const PEOPLE_RATIO_PERCENT = [50, 35, 15] as const;
export const RT_FLOOR_MS = 300;
/** Speed bonus: slowest still gets 50% of base, only the fastest gets 100% */
export const SPEED_MIN_RATIO = 0.5;
export const SPEED_MAX_RATIO = 1.0;
export const MULT_STEP = 0.1;
export const MULT_CAP = 2.0;
/** Grade boundary scores (at or above gives the higher grade) */
export const GRADE_BOUNDS = [2500, 4500, 6500, 8500] as const;

// §6.3 Difficulty phases
export interface PhaseConfig {
  /** Phase start time (ms, from round start, inclusive) */
  fromMs: number;
  /** Phase end time (ms, exclusive) */
  toMs: number;
  /** Time limit T of a one-zone call */
  limitMs: number;
  /** Time limit of a two-zone call (0 if none) */
  limitTwoMs: number;
}
export const PHASES: readonly PhaseConfig[] = [
  { fromMs: 0, toMs: 15000, limitMs: 3000, limitTwoMs: 0 },
  { fromMs: 15000, toMs: 40000, limitMs: 2500, limitTwoMs: 0 },
  { fromMs: 40000, toMs: 60000, limitMs: 2200, limitTwoMs: 3600 },
];
export const LABEL_FADE_MS = 2000;
export const TWO_ZONE_PERCENT = 50;
export const RECENT_EXCLUDE = 2;
export const WRONG_REVEAL_MS = 600;
/** How long the phase name and GO text stay on the map (M2-19: 800 → 500) */
export const PHASE_FLASH_MS = 500;

// §6.4 Booth, storage, endurance
export const ATTRACT_TO_DEMO_S = 20;
export const PLAY_IDLE_QUIT_S = 12;
export const RESULT_IDLE_S = 20;
export const RESULT_BOARD_S = 8;
/** Seconds of no touch on the attract screen before the bot demo starts (§6.5) */
export const ATTRACT_DEMO_S = 20;
export const MAX_PERSON_S = 95;
export const MAX_SCORES = 500;
export const BOARD_REFRESH_MS = 5000;
