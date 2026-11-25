import { CALL_GAP_MS, COUNTDOWN_MS, GAME_MS, PHASES, WRONG_REVEAL_MS } from './config';
import { nextCall, type Call } from './calls';
import { mulberry32, type Rng } from './rng';
import { baseOf, points } from './scoring';
import { zoneAt, type ZoneId } from './zones';

/** Only two events (§4.2). The clock (now, ms) is passed in from outside. */
export type GameEvent =
  | { type: 'TICK'; now: number }
  | { type: 'CLICK'; x: number; y: number; now: number };

/** The verdict that just ended (for screen effects). Replaced when the next verdict comes. */
export interface Judgement {
  kind: 'hit' | 'wrong' | 'slow';
  /** Score this click earned when hit */
  points: number;
  /** Reaction time (ms) when hit */
  rtMs: number;
  /** Correct zone (shown for 0.6 s on wrong or slow) */
  revealZones: ZoneId[];
  revealUntil: number;
  /** Map coordinate clicked when wrong (where the X is drawn) */
  x: number;
  y: number;
  /** Zone that was hit when hit */
  zone: ZoneId | null;
}

/** The call that is up now */
export interface ActiveCall {
  call: Call;
  /** Zones already hit (two-zone call: 0 or 1) */
  step: 0 | 1;
  /** Time the current target appeared on screen (or the previous target was hit) — the base of reaction time */
  stepStartMs: number;
  /** Time limit T of this one call */
  limitMs: number;
}

export interface GameState {
  status: 'countdown' | 'play' | 'done';
  /** Time of the first event (countdown start). null if none yet */
  t0: number | null;
  /** Time play started (countdown end). null if none yet */
  playStartMs: number | null;
  score: number;
  streak: number;
  bestStreak: number;
  /** Targets hit / targets finished (a two-zone call has 2 targets) */
  hit: number;
  finished: number;
  /** Reaction times of the hit clicks */
  rts: number[];
  active: ActiveCall | null;
  /** Clicks are ignored before this time; the next call comes on a later TICK */
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

/** Phase number 1–3 from ms elapsed since play started */
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

/** Ends every remaining target as a miss (streak 0, correct zone revealed) */
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
    // If the time limit has passed, it is a timeout. The gap is counted from the time that passed.
    const deadline = a.stepStartMs + a.limitMs;
    if (now >= deadline) return fail(cur, a, 'slow', deadline, 0, 0);
    return cur;
  }
  if (allowSpawn && now >= cur.gapUntilMs) return spawn(cur, now, elapsed);
  return cur;
}

function onClick(s: GameState, e: Extract<GameEvent, { type: 'CLICK' }>): GameState {
  // Set the clock first: timeout, the 60-second end and the countdown end come before the click. A new call is shown only by TICK
  // (so a click in a frame where no call was up cannot become a wrong answer for the call that just appeared).
  const cur = onTick(s, e.now, false);
  if (cur.status !== 'play') return cur;
  const a = cur.active;
  if (!a) return cur; // ignored during the gap right after a verdict (§4.2)
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

/** Reducer. The same seed and the same event order give the same result. */
export function step(state: GameState, event: GameEvent): GameState {
  return event.type === 'TICK' ? onTick(state, event.now) : onClick(state, event);
}
