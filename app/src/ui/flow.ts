/** 화면 흐름 상태 기계 (DESIGN §8.1): Attract → Countdown → Play → Result → Attract. 시계는 밖에서 넣는다. */
import { RESULT_BOARD_S } from '../core/config';
import { decide, type BotProfile } from '../core/bot';
import { initGame, step, type GameEvent, type GameState } from '../core/game';
import type { Rng } from '../core/rng';

/** 카운트다운은 play 화면 안의 game.status 로 나타난다 */
export type FlowScreen = 'attract' | 'play' | 'result';

export interface Flow {
  screen: FlowScreen;
  /** 지금 판 (attract 에서는 이전 판 또는 빈 판) */
  game: GameState;
  /** 지금 화면에 들어온 시각 */
  since: number;
  /** Result 를 지난 판 수 */
  results: number;
}

export function initFlow(seed: number, now = 0): Flow {
  return { screen: 'attract', game: initGame(seed), since: now, results: 0 };
}

/** 판 시작: 상태를 새로 만든다 (지난 판 값이 남지 않게). 아무 때나 불러도 새 판. */
export function startGame(f: Flow, seed: number, now: number): Flow {
  return { ...f, screen: 'play', game: step(initGame(seed), { type: 'TICK', now }), since: now };
}

/** 결과 화면을 바로 보여 준다 (?state=result 검사용). 끝난 판을 넣는다. */
export function showResult(f: Flow, game: GameState, now: number): Flow {
  return { ...f, screen: 'result', game, since: now, results: f.results + 1 };
}

function toResultIfDone(f: Flow, now: number): Flow {
  return f.game.status === 'done' ? showResult(f, f.game, now) : f;
}

export function flowTick(f: Flow, now: number): Flow {
  if (f.screen === 'play') {
    return toResultIfDone({ ...f, game: step(f.game, { type: 'TICK', now }) }, now);
  }
  if (f.screen === 'result' && now - f.since >= RESULT_BOARD_S * 1000) {
    return { ...f, screen: 'attract', since: now };
  }
  return f;
}

/** 화면 누름. attract 는 새 판, play 는 게임으로, result 는 잠깐(0.6초) 지난 뒤에만 다음으로. */
export function flowClick(f: Flow, x: number, y: number, now: number, seed: number): Flow {
  if (f.screen === 'attract') return startGame(f, seed, now);
  if (f.screen === 'play') {
    const e: GameEvent = { type: 'CLICK', x, y, now };
    return toResultIfDone({ ...f, game: step(f.game, e) }, now);
  }
  if (now - f.since >= 600) return { ...f, screen: 'attract', since: now };
  return f;
}

export interface BotPlan {
  key: number;
  at: number;
  x: number;
  y: number;
}

/** 봇이 한 프레임에 하는 일: attract 면 시작, play 면 계획대로 클릭. 사람 입력과 같은 길(flowClick)로 들어간다. */
export function botFrame(
  profile: BotProfile,
  f: Flow,
  plan: BotPlan | null,
  rng: Rng,
  now: number,
  seed: number,
): { flow: Flow; plan: BotPlan | null } {
  if (f.screen === 'attract') return { flow: flowClick(f, 0, 0, now, seed), plan: null };
  if (f.screen !== 'play') return { flow: f, plan: null };
  const a = f.game.status === 'play' ? f.game.active : null;
  if (!a) return { flow: f, plan: null };
  const key = a.stepStartMs * 2 + a.step;
  let p = plan;
  if (!p || p.key !== key) {
    const d = decide(profile, f.game, rng);
    p = d ? { key, at: a.stepStartMs + d.delayMs, x: d.x, y: d.y } : null;
  }
  if (p && now >= p.at) return { flow: flowClick(f, p.x, p.y, now, seed), plan: null };
  return { flow: f, plan: p };
}
