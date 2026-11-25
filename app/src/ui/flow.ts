/** Screen flow state machine (DESIGN §8.1): Attract → Countdown → Play → Result → Board → Attract. The clock is passed in from outside. */
import { ATTRACT_DEMO_S, PLAY_IDLE_QUIT_S, RESULT_BOARD_S, RESULT_IDLE_S } from '../core/config';
import { backspace, canConfirm, finalName, typeLetter } from '../core/initials';
import { decide, type BotProfile } from '../core/bot';
import { initGame, step, type GameEvent, type GameState } from '../core/game';
import type { Rng } from '../core/rng';

/** The countdown appears as the game status inside the play screen */
export type FlowScreen = 'attract' | 'play' | 'result' | 'board';

export interface Flow {
  screen: FlowScreen;
  /** The current round (on attract: the previous round or an empty one) */
  game: GameState;
  /** Time we entered the current screen */
  since: number;
  /** Number of rounds that passed through Result */
  results: number;
  /** Letters typed so far on the result screen (0–3) */
  initials: string;
  /** Time of the last input on the result screen (for the 20-second idle check) */
  lastInput: number;
  /** For showing a 150 ms press */
  pressed: { key: string; at: number } | null;
  /** The last round whose name to save is decided (index puts it into the score store). A new one when saves grows. */
  saved: { name: string; game: GameState } | null;
  saves: number;
  /** Whether this is a demo round with the bot playing behind the attract screen (no sound, no saving, any click starts a new round) */
  demo: boolean;
}

export function initFlow(seed: number, now = 0): Flow {
  return { screen: 'attract', game: initGame(seed), since: now, results: 0, initials: '', lastInput: now, pressed: null, saved: null, saves: 0, demo: false };
}

/** Round start: builds the state fresh (so no value from the last round stays). A new round whenever it is called. */
export function startGame(f: Flow, seed: number, now: number): Flow {
  return { ...f, screen: 'play', game: step(initGame(seed), { type: 'TICK', now }), since: now, initials: '', lastInput: now, demo: false };
}

/** Demo start: the same game rules, no result or saving, and it returns to attract when it ends */
export function startDemo(f: Flow, seed: number, now: number): Flow {
  return { ...startGame(f, seed, now), demo: true };
}

/** Shows the result screen right away (for the ?state=result check). Pass a finished round. */
export function showResult(f: Flow, game: GameState, now: number): Flow {
  return { ...f, screen: 'result', game, since: now, results: f.results + 1, initials: '', lastInput: now, pressed: null };
}

function toResultIfDone(f: Flow, now: number): Flow {
  if (f.demo && f.game.status === 'done') return { ...f, screen: 'attract', since: now, demo: false };
  return f.game.status === 'done' ? showResult(f, f.game, now) : f;
}

/** Drops the round and goes to the attract screen (no score saving, no result). For when the person left or the tab was hidden. */
export function abandonPlay(f: Flow, now: number): Flow {
  if (f.screen !== 'play') return f;
  return { ...f, screen: 'attract', game: initGame(0), since: now, initials: '', lastInput: now, pressed: null, demo: false };
}

export function flowTick(f: Flow, now: number): Flow {
  if (f.screen === 'play') {
    if (!f.demo && now - f.lastInput >= PLAY_IDLE_QUIT_S * 1000) return abandonPlay(f, now);
    return toResultIfDone({ ...f, game: step(f.game, { type: 'TICK', now }) }, now);
  }
  if (f.screen === 'attract' && now - f.since >= ATTRACT_DEMO_S * 1000) return startDemo(f, 9000 + f.results * 31 + Math.floor(now / 1000), now);
  if (f.screen === 'result' && now - f.lastInput >= RESULT_IDLE_S * 1000) return leaveResult(f, now);
  if (f.screen === 'board' && now - f.since >= RESULT_BOARD_S * 1000) return { ...f, screen: 'attract', since: now };
  return f;
}

/** Leaves the result: decides the name, leaves it in saved, and goes to the rank screen (board). `---` if not filled in. */
function leaveResult(f: Flow, now: number): Flow {
  return { ...f, screen: 'board', since: now, saved: { name: finalName(f.initials), game: f.game }, saves: f.saves + 1, pressed: null };
}

/** Letter pad and keyboard input on the result screen. key: 'A'–'Z' · 'BACK' · 'OK'. Presses within 0.6 s are ignored (to stop button-mashing from the last round). */
export function flowKey(f: Flow, key: string, now: number): Flow {
  if (f.screen !== 'result' || now - f.since < 600) return f;
  if (key === 'OK') return canConfirm(f.initials) ? leaveResult(f, now) : f;
  const initials = key === 'BACK' ? backspace(f.initials) : typeLetter(f.initials, key);
  return { ...f, initials, lastInput: now, pressed: { key, at: now } };
}

/** A screen press. attract starts a new round, play goes to the game. result comes in separately through flowKey. */
export function flowClick(f: Flow, x: number, y: number, now: number, seed: number): Flow {
  if (f.screen === 'attract') return startGame(f, seed, now);
  if (f.screen === 'play' && f.demo) return startGame(f, seed, now); // a person's click during the demo = a new round right away
  if (f.screen === 'play') return gameClick(f, x, y, now);
  if (f.screen === 'board') return now - f.since < 600 ? f : startGame(f, seed, now); // pressing anywhere on the rank screen starts a new round (0.6 s guard against a double OK press)
  return f; // result accepts only the letter pad (flowKey)
}

/** A click inside a round (person and bot alike). The bot during the demo goes through this path too. */
function gameClick(f: Flow, x: number, y: number, now: number): Flow {
  const e: GameEvent = { type: 'CLICK', x, y, now };
  return toResultIfDone({ ...f, game: step(f.game, e), lastInput: now }, now);
}

export interface BotPlan {
  key: number;
  at: number;
  x: number;
  y: number;
}

/** What the bot does in one frame: on attract it starts, on play it clicks as planned. It goes through the same path as a person (flowClick). */
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
    // The bot types 3 letters and presses OK (the same path as a person)
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
