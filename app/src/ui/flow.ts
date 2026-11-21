/** 화면 흐름 상태 기계 (DESIGN §8.1): Attract → Countdown → Play → Result → Board → Attract. 시계는 밖에서 넣는다. */
import { ATTRACT_DEMO_S, RESULT_BOARD_S, RESULT_IDLE_S } from '../core/config';
import { backspace, canConfirm, finalName, typeLetter } from '../core/initials';
import { decide, type BotProfile } from '../core/bot';
import { initGame, step, type GameEvent, type GameState } from '../core/game';
import type { Rng } from '../core/rng';

/** 카운트다운은 play 화면 안의 game.status 로 나타난다 */
export type FlowScreen = 'attract' | 'play' | 'result' | 'board';

export interface Flow {
  screen: FlowScreen;
  /** 지금 판 (attract 에서는 이전 판 또는 빈 판) */
  game: GameState;
  /** 지금 화면에 들어온 시각 */
  since: number;
  /** Result 를 지난 판 수 */
  results: number;
  /** 결과 화면에서 지금까지 친 글자 (0~3) */
  initials: string;
  /** 결과 화면에서 마지막으로 입력한 시각 (20초 무입력 판정) */
  lastInput: number;
  /** 눌림 150ms 표시용 */
  pressed: { key: string; at: number } | null;
  /** 저장할 이름이 정해진 마지막 판 (index 가 점수 저장소에 넣는다). saves 가 늘면 새 것. */
  saved: { name: string; game: GameState } | null;
  saves: number;
  /** 대기 화면 뒤에서 봇이 도는 시연 판인가 (소리·저장 없음, 아무 클릭이면 새 판) */
  demo: boolean;
}

export function initFlow(seed: number, now = 0): Flow {
  return { screen: 'attract', game: initGame(seed), since: now, results: 0, initials: '', lastInput: now, pressed: null, saved: null, saves: 0, demo: false };
}

/** 판 시작: 상태를 새로 만든다 (지난 판 값이 남지 않게). 아무 때나 불러도 새 판. */
export function startGame(f: Flow, seed: number, now: number): Flow {
  return { ...f, screen: 'play', game: step(initGame(seed), { type: 'TICK', now }), since: now, initials: '', demo: false };
}

/** 시연 시작: 같은 게임 규칙, 결과·저장 없이 끝나면 대기로 돌아간다 */
export function startDemo(f: Flow, seed: number, now: number): Flow {
  return { ...startGame(f, seed, now), demo: true };
}

/** 결과 화면을 바로 보여 준다 (?state=result 검사용). 끝난 판을 넣는다. */
export function showResult(f: Flow, game: GameState, now: number): Flow {
  return { ...f, screen: 'result', game, since: now, results: f.results + 1, initials: '', lastInput: now, pressed: null };
}

function toResultIfDone(f: Flow, now: number): Flow {
  if (f.demo && f.game.status === 'done') return { ...f, screen: 'attract', since: now, demo: false };
  return f.game.status === 'done' ? showResult(f, f.game, now) : f;
}

export function flowTick(f: Flow, now: number): Flow {
  if (f.screen === 'play') {
    return toResultIfDone({ ...f, game: step(f.game, { type: 'TICK', now }) }, now);
  }
  if (f.screen === 'attract' && now - f.since >= ATTRACT_DEMO_S * 1000) return startDemo(f, 9000 + f.results * 31 + Math.floor(now / 1000), now);
  if (f.screen === 'result' && now - f.lastInput >= RESULT_IDLE_S * 1000) return leaveResult(f, now);
  if (f.screen === 'board' && now - f.since >= RESULT_BOARD_S * 1000) return { ...f, screen: 'attract', since: now };
  return f;
}

/** 결과를 떠난다: 이름을 정해 saved 에 남기고 순위 화면(board)으로. 못 채웠으면 `---`. */
function leaveResult(f: Flow, now: number): Flow {
  return { ...f, screen: 'board', since: now, saved: { name: finalName(f.initials), game: f.game }, saves: f.saves + 1, pressed: null };
}

/** 결과 화면의 글자판·키보드 입력. key: 'A'~'Z' · 'BACK' · 'OK'. 0.6초 안의 누름은 무시(앞 판 연타 방지). */
export function flowKey(f: Flow, key: string, now: number): Flow {
  if (f.screen !== 'result' || now - f.since < 600) return f;
  if (key === 'OK') return canConfirm(f.initials) ? leaveResult(f, now) : f;
  const initials = key === 'BACK' ? backspace(f.initials) : typeLetter(f.initials, key);
  return { ...f, initials, lastInput: now, pressed: { key, at: now } };
}

/** 화면 누름. attract 는 새 판, play 는 게임으로. result 는 flowKey 로 따로 들어온다. */
export function flowClick(f: Flow, x: number, y: number, now: number, seed: number): Flow {
  if (f.screen === 'attract') return startGame(f, seed, now);
  if (f.screen === 'play' && f.demo) return startGame(f, seed, now); // 시연 중 사람 클릭 = 즉시 새 판
  if (f.screen === 'play') return gameClick(f, x, y, now);
  if (f.screen === 'board') return now - f.since < 600 ? f : startGame(f, seed, now); // 순위 화면 아무 데나 누르면 새 판 (OK 두 번 눌림 방지 0.6초)
  return f; // result 는 글자판(flowKey)만 받는다
}

/** 판 안의 클릭 (사람·봇 공통). 시연 중 봇도 이 길로 들어간다. */
function gameClick(f: Flow, x: number, y: number, now: number): Flow {
  const e: GameEvent = { type: 'CLICK', x, y, now };
  return toResultIfDone({ ...f, game: step(f.game, e) }, now);
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
  if (f.screen === 'result') {
    // 봇은 이름을 3글자 치고 OK (사람 입력과 같은 길)
    const t = now - f.since;
    if (t < 700) return { flow: f, plan: null };
    return { flow: flowKey(f, f.initials.length < 3 ? 'BOT'[f.initials.length] ?? 'B' : 'OK', now), plan: null };
  }
  if (f.screen === 'board') return { flow: now - f.since < 1500 ? f : flowClick(f, 0, 0, now, seed), plan: null };
  if (f.screen !== 'play') return { flow: f, plan: null };
  const a = f.game.status === 'play' ? f.game.active : null;
  if (!a) return { flow: f, plan: null };
  const key = a.stepStartMs * 2 + a.step;
  let p = plan;
  if (!p || p.key !== key) {
    const d = decide(profile, f.game, rng);
    p = d ? { key, at: a.stepStartMs + d.delayMs, x: d.x, y: d.y } : null;
  }
  if (p && now >= p.at) return { flow: gameClick(f, p.x, p.y, now), plan: null };
  return { flow: f, plan: p };
}
