/** 밸런스·한계 숫자 전부. 출처와 근거는 docs/DESIGN.md §6 — 값을 바꾸면 그 표도 같이 고친다. */

// §6.1 한 판 기본값
export const GAME_MS = 60000;
export const COUNTDOWN_MS = 3000;
export const CALL_GAP_MS = 300;
/** 맵이 무대에서 차지하는 한 변(무대 px) */
export const MAP_PX = 960;
/** 맵 단위 좌표계의 한 변 (§5.1) */
export const MAP_UNITS = 1000;
export const ZONE_MIN_GAP = 20;

// §6.2 점수
/** 한 곳 콜의 인원별 기본 점수 (인덱스 0 = 1명) */
export const BASE_BY_PEOPLE = [100, 150, 200] as const;
/** 두 곳 콜의 구역당 기본 점수 */
export const BASE_TWO_ZONE = 150;
/** 인원 비율 1/2/3 (%) */
export const PEOPLE_RATIO_PERCENT = [50, 35, 15] as const;
export const RT_FLOOR_MS = 300;
/** 속도 보너스: 가장 느려도 base 의 50%, 가장 빨라야 100% */
export const SPEED_MIN_RATIO = 0.5;
export const SPEED_MAX_RATIO = 1.0;
export const MULT_STEP = 0.1;
export const MULT_CAP = 2.0;
/** 등급 경계 점수 (이상이면 위 등급) */
export const GRADE_BOUNDS = [2500, 4500, 6500, 8500] as const;

// §6.3 난이도 단계
export interface PhaseConfig {
  /** 단계 시작 시각(ms, 한 판 시작 기준, 이상) */
  fromMs: number;
  /** 단계 끝 시각(ms, 미만) */
  toMs: number;
  /** 한 곳 콜 제한 시간 T */
  limitMs: number;
  /** 두 곳 콜 제한 시간(없으면 0) */
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
/** 단계 이름·GO 글자가 맵 위에 떠 있는 시간 (M2-19: 800 → 500) */
export const PHASE_FLASH_MS = 500;

// §6.4 부스·저장·내구
export const ATTRACT_TO_DEMO_S = 20;
export const PLAY_IDLE_QUIT_S = 12;
export const RESULT_IDLE_S = 20;
export const RESULT_BOARD_S = 8;
/** 대기 화면에서 아무도 안 건드리면 봇 시연이 시작되는 초 (§6.5) */
export const ATTRACT_DEMO_S = 20;
export const MAX_PERSON_S = 95;
export const MAX_SCORES = 500;
export const BOARD_REFRESH_MS = 5000;
