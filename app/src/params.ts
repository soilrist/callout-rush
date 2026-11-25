export type ScreenState = 'attract' | 'play' | 'result' | 'board';
export type BotLevel = 'rookie' | 'regular' | 'pro';

export interface UrlParams {
  seed: number | null;
  timescale: number;
  bot: BotLevel | null;
  state: ScreenState | null;
  at: number | null;
  /** If 1, the bot does not touch the result screen (initials input) — so a video recording can type it like a person */
  hold: boolean;
}

const STATES: readonly ScreenState[] = ['attract', 'play', 'result', 'board'];
const BOTS: readonly BotLevel[] = ['rookie', 'regular', 'pro'];

function num(v: string | null): number | null {
  if (v === null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Reads the URL params (?seed, timescale, bot, state, at). Missing or wrong means the default — with no params there is no effect. */
export function parseParams(search: string): UrlParams {
  const q = new URLSearchParams(search);
  const ts = num(q.get('timescale'));
  const state = q.get('state');
  const bot = q.get('bot');
  return {
    seed: num(q.get('seed')),
    timescale: ts !== null && ts > 0 ? ts : 1,
    bot: BOTS.find((b) => b === bot) ?? null,
    state: STATES.find((s) => s === state) ?? null,
    at: num(q.get('at')),
    hold: q.get('hold') === '1',
  };
}
