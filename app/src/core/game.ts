import { CALL_GAP_MS, COUNTDOWN_MS, GAME_MS, PHASES, WRONG_REVEAL_MS } from './config';
import { nextCall, type Call } from './calls';
import { mulberry32, type Rng } from './rng';
import { baseOf, points } from './scoring';
import { zoneAt, type ZoneId } from './zones';

/** 이벤트는 둘뿐 (§4.2). 시계(now, ms)는 밖에서 넣는다. */
export type GameEvent =
  | { type: 'TICK'; now: number }
  | { type: 'CLICK'; x: number; y: number; now: number };

/** 방금 끝난 판정 (화면 연출용). 다음 판정이 나오면 바뀐다. */
export interface Judgement {
  kind: 'hit' | 'wrong' | 'slow';
  /** hit 일 때 이번 클릭이 얻은 점수 */
  points: number;
  /** hit 일 때 반응 시간(ms) */
  rtMs: number;
  /** 정답 구역 (wrong·slow 일 때 0.6초 보여 준다) */
  revealZones: ZoneId[];
  revealUntil: number;
  /** wrong 일 때 누른 맵 좌표 (X 표시 자리) */
  x: number;
  y: number;
  /** hit 일 때 맞힌 구역 */
  zone: ZoneId | null;
}

/** 지금 떠 있는 콜 */
export interface ActiveCall {
  call: Call;
  /** 이미 맞힌 구역 수 (두 곳 콜: 0 또는 1) */
  step: 0 | 1;
  /** 지금 목표가 화면에 뜬(또는 앞 목표를 맞힌) 시각 — 반응 시간의 기준 */
  stepStartMs: number;
  /** 이 콜 하나의 제한 시간 T */
  limitMs: number;
}

export interface GameState {
  status: 'countdown' | 'play' | 'done';
  /** 첫 이벤트 시각 (카운트다운 시작). 아직 없으면 null */
  t0: number | null;
  /** 플레이 시작 시각 (카운트다운 끝). 아직 없으면 null */
  playStartMs: number | null;
  score: number;
  streak: number;
  bestStreak: number;
  /** 맞힌 목표 수 / 끝난 목표 수 (두 곳 콜은 목표 2개) */
  hit: number;
  finished: number;
  /** 맞힌 클릭의 반응 시간들 */
  rts: number[];
  active: ActiveCall | null;
  /** 이 시각 전까지 클릭 무시, 이후 TICK 에 다음 콜 */
  gapUntilMs: number;
  recent: ZoneId[];
  last: Judgement | null;
  rng: Rng;
}

export function initGame(seed: number): GameState {
  return {
    status: 'countdown',
    t0: null,
    playStartMs: null,
    score: 0,
    streak: 0,
    bestStreak: 0,
    hit: 0,
    finished: 0,
    rts: [],
    active: null,
    gapUntilMs: 0,
    recent: [],
    last: null,
    rng: mulberry32(seed),
  };
}

/** 플레이 시작 후 경과 ms 로 단계 번호 1~3 */
export function phaseAt(elapsedMs: number): 1 | 2 | 3 {
  const idx = PHASES.findIndex((p) => elapsedMs >= p.fromMs && elapsedMs < p.toMs);
  return (idx < 0 ? PHASES.length : idx + 1) as 1 | 2 | 3;
}

function spawn(s: GameState, now: number, elapsed: number): GameState {
  const phase = phaseAt(elapsed);
  const cfg = PHASES[phase - 1];
  if (!cfg) throw new Error(`없는 단계: ${phase}`);
  const call = nextCall(s.rng, phase, s.recent);
  const limitMs = call.zones.length === 2 ? cfg.limitTwoMs : cfg.limitMs;
  return {
    ...s,
    active: { call, step: 0, stepStartMs: now, limitMs },
    recent: [...s.recent, ...call.zones],
  };
}

/** 남은 목표를 전부 실패로 끝낸다 (연속 0, 정답 구역 공개) */
function fail(
  s: GameState,
  a: ActiveCall,
  kind: 'wrong' | 'slow',
  now: number,
  x: number,
  y: number,
): GameState {
  const remaining = a.call.zones.length - a.step;
  const revealZones = a.call.zones.slice(a.step);
  return {
    ...s,
    streak: 0,
    finished: s.finished + remaining,
    active: null,
    gapUntilMs: now + CALL_GAP_MS,
    last: {
      kind,
      points: 0,
      rtMs: 0,
      revealZones,
      revealUntil: now + WRONG_REVEAL_MS,
      x,
      y,
      zone: null,
    },
  };
}

function onTick(s: GameState, now: number, allowSpawn = true): GameState {
  if (s.status === 'done') return s;
  let cur = s;
  if (cur.t0 === null) cur = { ...cur, t0: now };
  if (cur.status === 'countdown') {
    const start = (cur.t0 ?? now) + COUNTDOWN_MS;
    if (now < start) return cur;
    cur = { ...cur, status: 'play', playStartMs: start, gapUntilMs: start };
  }
  const playStart = cur.playStartMs ?? now;
  const elapsed = now - playStart;
  if (elapsed >= GAME_MS) return { ...cur, status: 'done', active: null };
  const a = cur.active;
  if (a) {
    // 제한 시간이 지났으면 시간 초과. 지난 시각 기준으로 간격을 센다.
    const deadline = a.stepStartMs + a.limitMs;
    if (now >= deadline) return fail(cur, a, 'slow', deadline, 0, 0);
    return cur;
  }
  if (allowSpawn && now >= cur.gapUntilMs) return spawn(cur, now, elapsed);
  return cur;
}

function onClick(s: GameState, e: Extract<GameEvent, { type: 'CLICK' }>): GameState {
  // 먼저 시계를 맞춘다: 시간 초과·60초 끝·카운트다운 끝이 클릭보다 앞선다. 새 콜은 TICK 만 띄운다
  // (콜이 안 뜬 프레임의 클릭이 방금 뜬 콜의 오답이 되지 않게).
  const cur = onTick(s, e.now, false);
  if (cur.status !== 'play') return cur;
  const a = cur.active;
  if (!a) return cur; // 판정 직후 간격 동안은 무시 (§4.2)
  const target = a.call.zones[a.step];
  if (target === undefined) throw new Error('목표가 없다');
  const zone = zoneAt(e.x, e.y);
  if (!zone || zone.id !== target) return fail(cur, a, 'wrong', e.now, e.x, e.y);
  const rt = e.now - a.stepStartMs;
  const gained = points(baseOf(a.call.people), rt, a.limitMs, cur.streak);
  const streak = cur.streak + 1;
  const done = a.step + 1 >= a.call.zones.length;
  const last: Judgement = {
    kind: 'hit',
    points: gained,
    rtMs: rt,
    revealZones: [],
    revealUntil: e.now,
    x: e.x,
    y: e.y,
    zone: zone.id,
  };
  const next: GameState = {
    ...cur,
    score: cur.score + gained,
    streak,
    bestStreak: Math.max(cur.bestStreak, streak),
    hit: cur.hit + 1,
    finished: cur.finished + 1,
    rts: [...cur.rts, rt],
    last,
  };
  if (done) return { ...next, active: null, gapUntilMs: e.now + CALL_GAP_MS };
  return { ...next, active: { ...a, step: 1, stepStartMs: e.now } };
}

/** 리듀서. 같은 시드·같은 이벤트 순서면 결과가 같다. */
export function step(state: GameState, event: GameEvent): GameState {
  return event.type === 'TICK' ? onTick(state, event.now) : onClick(state, event);
}
