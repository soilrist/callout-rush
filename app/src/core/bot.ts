import { GAME_MS } from './config';
import { initGame, step, type GameState } from './game';
import { mulberry32, type Rng } from './rng';
import { ZONES } from './zones';

/** Bot profile (DESIGN §5.3). Reaction time is normally distributed; accuracy is the chance of a correct click. */
export interface BotProfile {
  id: 'B1' | 'B2' | 'B3';
  name: 'rookie' | 'regular' | 'pro';
  meanMs: number;
  sdMs: number;
  /** 0~1 */
  accuracy: number;
}

export const BOT_MIN_RT_MS = 200;
/** Empty ground (outside every zone) clicked on purpose when the bot misses */
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

/** One standard normal value (Box–Muller) */
function gauss(rng: Rng): number {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface BotAction {
  /** How many ms after the target appears the bot clicks */
  delayMs: number;
  x: number;
  y: number;
}

/** When and where to click for the current target. null if there is no call. Pass in the bot-only rng for randomness. */
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

/** Runs one whole round on a virtual clock with no screen. The same (profile, seed) gives the same result. */
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
