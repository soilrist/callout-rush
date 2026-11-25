import { describe, expect, it } from 'vitest';
import { ScoreStore, SCORES_BAD_KEY, SCORES_KEY, memoryStorage, type StorageLike } from './scores';

const DAY = 86_400_000;
const T0 = new Date(2026, 5, 10, 12, 0, 0).getTime(); // local noon
const mk = (score: number, ts: number, name = 'AAA') => ({ name, score, acc: 1, avgRt: 500, streak: 3, ts });

describe('ScoreStore', () => {
  it('a higher score is on top, a tie puts the earlier one on top', () => {
    const s = new ScoreStore(memoryStorage(), 50);
    const late = s.add(mk(1000, T0 + 2000));
    const early = s.add(mk(1000, T0 + 1000));
    const top = s.add(mk(2000, T0 + 3000));
    expect(s.today(T0 + 5000).map((e) => e.id)).toEqual([top.id, early.id, late.id]);
    expect(s.rankToday(early.id, T0 + 5000)).toBe(2);
    expect(s.rankToday('missing-id', T0 + 5000)).toBe(0);
  });

  it('after midnight the list for today is empty and allTime keeps them', () => {
    const s = new ScoreStore(memoryStorage(), 50);
    s.add(mk(500, T0));
    expect(s.today(T0 + DAY)).toEqual([]);
    expect(s.allTime()).toHaveLength(1);
  });

  it('broken JSON is moved to .bad and it starts with an empty list', () => {
    const st = memoryStorage();
    st.setItem(SCORES_KEY, '{broken');
    const s = new ScoreStore(st, 50);
    expect(s.size).toBe(0);
    expect(st.getItem(SCORES_BAD_KEY)).toBe('{broken');
    expect(st.getItem(SCORES_KEY)).toBeNull();
    expect(s.recovered).toBe(true);
    s.add(mk(10, T0)); // it can keep being used
    expect(s.size).toBe(1);
  });

  it('JSON that is not an array takes the same recovery path as broken JSON', () => {
    const st = memoryStorage();
    st.setItem(SCORES_KEY, '{"a":1}');
    const s = new ScoreStore(st, 50);
    expect(s.size).toBe(0);
    expect(st.getItem(SCORES_BAD_KEY)).toBe('{"a":1}');
    expect(st.getItem(SCORES_KEY)).toBeNull();
    expect(s.recovered).toBe(true);
  });

  it('filters out only the badly shaped items', () => {
    const st = memoryStorage();
    st.setItem(SCORES_KEY, JSON.stringify([{ id: 'a', name: 'A', score: 1, acc: 1, avgRt: 1, streak: 1, ts: T0 }, { x: 1 }]));
    expect(new ScoreStore(st, 50).size).toBe(1);
  });

  it('keeps running in memory even if saving always fails', () => {
    const broken: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {},
    };
    const s = new ScoreStore(broken, 50);
    s.add(mk(300, T0));
    expect(s.persistFailed).toBe(true);
    expect(s.today(T0)).toHaveLength(1);
  });

  it('does not crash even if reading is blocked too', () => {
    const blocked: StorageLike = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {},
    };
    const s = new ScoreStore(blocked, 50);
    s.add(mk(300, T0));
    expect(s.size).toBe(1);
  });

  it('if storage is short it trims and retries once, entries from today stay', () => {
    const inner = memoryStorage();
    let first = true;
    const st: StorageLike = {
      ...inner,
      setItem: (k, v) => {
        if (k === SCORES_KEY && v.length > 800 && first) {
          first = false;
          throw new Error('quota');
        }
        inner.setItem(k, v);
      },
    };
    const s = new ScoreStore(st, 500);
    for (let i = 0; i < 20; i++) s.add(mk(100 + i, T0 - 3 * DAY + i)); // old ones
    const mine = s.add(mk(50, T0));
    expect(s.persistFailed).toBe(false);
    expect(s.today(T0).map((e) => e.id)).toContain(mine.id);
  });

  it('adding 600 gives 500 and all from today stay', () => {
    const s = new ScoreStore(memoryStorage(), 500);
    const todays: string[] = [];
    for (let i = 0; i < 400; i++) s.add(mk(i, T0 - 5 * DAY + i)); // old 400
    for (let i = 0; i < 200; i++) todays.push(s.add(mk(i, T0 + i)).id); // today 200
    expect(s.size).toBe(500);
    const ids = new Set(s.today(T0 + 1000, Infinity).map((e) => e.id));
    expect(todays.every((id) => ids.has(id))).toBe(true);
    // of the old ones the high scores stay
    const oldScores = s.allTime(500).filter((e) => e.ts < T0).map((e) => e.score);
    expect(Math.min(...oldScores)).toBeGreaterThanOrEqual(100);
  });

  it('a new instance reads back what was saved', () => {
    const st = memoryStorage();
    new ScoreStore(st, 50).add(mk(777, T0));
    expect(new ScoreStore(st, 50).allTime()[0].score).toBe(777);
  });
});

describe('previewRank', () => {
  it('an empty list gives 1st, a higher score pushes down, an equal score goes behind', () => {
    const s = new ScoreStore(memoryStorage());
    const now = Date.now();
    expect(s.previewRank(100, now)).toBe(1);
    s.add({ name: 'AAA', score: 500, acc: 90, avgRt: 600, streak: 5, ts: now });
    s.add({ name: 'BBB', score: 300, acc: 90, avgRt: 600, streak: 5, ts: now });
    expect(s.previewRank(400, now)).toBe(2);
    expect(s.previewRank(300, now)).toBe(3);
    expect(s.previewRank(900, now)).toBe(1);
  });
});

describe('ScoreStore operator features', () => {
  it('clearToday removes only entries from today and keeps the old records', () => {
    const s = new ScoreStore(memoryStorage(), 50);
    s.add(mk(500, T0 - DAY));
    s.add(mk(700, T0 + 1000));
    s.add(mk(800, T0 + 2000));
    expect(s.clearToday(T0 + 5000)).toBe(2);
    expect(s.today(T0 + 5000)).toHaveLength(0);
    expect(s.size).toBe(1);
    expect(s.all()).toHaveLength(1);
  });
});
