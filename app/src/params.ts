export type ScreenState = 'attract' | 'play' | 'result' | 'board';
export type BotLevel = 'rookie' | 'regular' | 'pro';

export interface UrlParams {
  seed: number | null;
  timescale: number;
  bot: BotLevel | null;
  state: ScreenState | null;
  at: number | null;
}

const STATES: readonly ScreenState[] = ['attract', 'play', 'result', 'board'];
const BOTS: readonly BotLevel[] = ['rookie', 'regular', 'pro'];

function num(v: string | null): number | null {
  if (v === null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** 주소 인자(?seed·timescale·bot·state·at)를 읽는다. 없거나 틀리면 기본값 — 인자가 없으면 아무 영향 없음. */
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
  };
}
