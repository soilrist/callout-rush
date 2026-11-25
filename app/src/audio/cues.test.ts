import { describe, expect, it } from 'vitest';
import { cuesFor } from './cues';
import { initGame, type GameState } from '../core/game';
import { COUNTDOWN_MS, PHASES } from '../core/config';

const base = (o: Partial<GameState>): GameState => ({ ...initGame(1), t0: 0, ...o });
const ids = (a: GameState, b: GameState, t0: number, t1: number): string[] => cuesFor(a, b, t0, t1).map((c) => c.id);

describe('cuesFor', () => {
  it('같은 상태·같은 시각이면 소리 없음', () => {
    const g = base({});
    expect(ids(g, g, 0, 10)).toEqual([]);
  });
  it('카운트다운 초가 바뀔 때만 count', () => {
    const g = base({ status: 'countdown' });
    expect(ids(g, { ...g }, 900, 1100)).toEqual(['count']);
    expect(ids(g, { ...g }, 1100, 1200)).toEqual([]);
  });
  it('카운트다운 끝 → 시작 신호(go)', () => {
    const a = base({ status: 'countdown' });
    const c = cuesFor(a, base({ status: 'play', playStartMs: COUNTDOWN_MS }), COUNTDOWN_MS - 10, COUNTDOWN_MS);
    expect(c[0]).toEqual({ id: 'count', opts: { go: true } });
  });
  it('정답은 hit(연속 수 포함), 오답은 miss', () => {
    const a = base({ status: 'play', playStartMs: 0 });
    const hit = cuesFor(a, { ...a, hit: 1, streak: 3 }, 100, 110);
    expect(hit).toEqual([{ id: 'hit', opts: { streak: 3 } }]);
    const last = { kind: 'wrong' as const, points: 0, rtMs: 0, revealZones: [], revealUntil: 0, x: 0, y: 0, zone: null };
    expect(ids(a, { ...a, last }, 100, 110)).toEqual(['miss']);
  });
  it('판 끝은 end 한 번, 단계 경계는 phase', () => {
    const a = base({ status: 'play', playStartMs: 0 });
    expect(ids(a, { ...a, status: 'done' }, 100, 110)).toEqual(['end']);
    const edge = PHASES[1]?.fromMs ?? 0;
    expect(ids(a, { ...a }, edge - 5, edge + 5)).toEqual(['phase']);
  });
  it('콜이 바뀔 때만 radio — 두 곳 콜의 둘째 목표는 아님', () => {
    const call = { zones: ['A', 'B'], people: 1 } as never;
    const mk = (step: 0 | 1, c = call): GameState => base({ status: 'play', playStartMs: 0, active: { call: c, step, stepStartMs: 0, limitMs: 1000 } });
    expect(ids(base({ status: 'play', playStartMs: 0 }), mk(0), 100, 110)).toEqual(['radio']);
    expect(ids(mk(0), mk(1), 100, 110)).toEqual([]);
  });
  it('다른 판이면 아무것도 없음', () => {
    const a = base({ status: 'play', t0: 5 });
    expect(ids(a, base({ status: 'play', t0: 9, hit: 4 }), 0, 10)).toEqual([]);
  });
});
