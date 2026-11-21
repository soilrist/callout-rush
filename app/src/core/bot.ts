import { GAME_MS } from './config';
import { initGame, step, type GameState } from './game';
import { mulberry32, type Rng } from './rng';
import { ZONES } from './zones';

/** 봇 프로필 (DESIGN §5.3). 반응 시간은 정규분포, 정확도는 맞힐 확률. */
export interface BotProfile {
  id: 'B1' | 'B2' | 'B3';
  name: 'rookie' | 'regular' | 'pro';
  meanMs: number;
  sdMs: number;
  /** 0~1 */
  accuracy: number;
}

export const BOT_MIN_RT_MS = 200;
/** 일부러 틀릴 때 누르는 빈 땅 (구역 밖) */
const WRONG_SPOT = { x: 5, y: 5 };
const TICK_MS = 16;

export const BOT_PROFILES: readonly BotProfile[] = [
  { id: 'B1', name: 'rookie', meanMs: 1500, sdMs: 300, accuracy: 0.8 },
  { id: 'B2', name: 'regular', meanMs: 1100, sdMs: 200, accuracy: 0.9 },
  { id: 'B3', name: 'pro', meanMs: 750, sdMs: 120, accuracy: 0.97 },
];

export function profileByName(name: BotProfile['name']): BotProfile {
  const p = BOT_PROFILES.find((b) => b.name === name);
  if (!p) throw new Error(`없는 봇: ${name}`);
  return p;
}

/** 표준 정규분포 한 값 (Box–Muller) */
function gauss(rng: Rng): number {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface BotAction {
  /** 목표가 뜬 시각에서 몇 ms 뒤에 누르나 */
  delayMs: number;
  x: number;
  y: number;
}

/** 지금 목표에 대해 언제·어디를 누를지. 콜이 없으면 null. 난수는 봇 전용 rng 를 넣는다. */
export function decide(profile: BotProfile, state: GameState, rng: Rng): BotAction | null {
  const a = state.active;
  if (!a) return null;
  const target = a.call.zones[a.step];
  const zone = ZONES.find((z) => z.id === target);
  if (!zone) throw new Error(`목표 구역 없음: ${String(target)}`);
  const delayMs = Math.max(BOT_MIN_RT_MS, profile.meanMs + profile.sdMs * gauss(rng));
  if (rng() < profile.accuracy) {
    return { delayMs, x: zone.x + zone.w / 2, y: zone.y + zone.h / 2 };
  }
  return { delayMs, ...WRONG_SPOT };
}

/** 화면 없이 가상 시계로 한 판을 끝까지 돌린다. 같은 (프로필, 시드) 면 결과가 같다. */
export function simulate(profile: BotProfile, seed: number): GameState {
  const botRng = mulberry32(seed ^ 0x9e3779b9);
  let s = initGame(seed);
  let now = 0;
  let plan: { key: number; at: number; x: number; y: number } | null = null;
  const end = GAME_MS + 10000;
  while (s.status !== 'done' && now <= end) {
    s = step(s, { type: 'TICK', now });
    const a = s.active;
    if (a && s.status === 'play') {
      const key = a.stepStartMs * 2 + a.step;
      if (!plan || plan.key !== key) {
        const d = decide(profile, s, botRng);
        plan = d ? { key, at: a.stepStartMs + d.delayMs, x: d.x, y: d.y } : null;
      }
      if (plan && now >= plan.at) {
        s = step(s, { type: 'CLICK', x: plan.x, y: plan.y, now });
        plan = null;
      }
    } else {
      plan = null;
    }
    now += TICK_MS;
  }
  return s;
}
