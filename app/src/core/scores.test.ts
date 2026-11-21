import { describe, expect, it } from 'vitest';
import { ScoreStore, SCORES_BAD_KEY, SCORES_KEY, memoryStorage, type StorageLike } from './scores';

const DAY = 86_400_000;
const T0 = new Date(2026, 5, 10, 12, 0, 0).getTime(); // 로컬 정오
const mk = (score: number, ts: number, name = 'AAA') => ({ name, score, acc: 1, avgRt: 500, streak: 3, ts });

describe('ScoreStore', () => {
  it('높은 점수가 위, 동점은 먼저 낸 쪽이 위', () => {
    const s = new ScoreStore(memoryStorage(), 50);
    const late = s.add(mk(1000, T0 + 2000));
    const early = s.add(mk(1000, T0 + 1000));
    const top = s.add(mk(2000, T0 + 3000));
    expect(s.today(T0 + 5000).map((e) => e.id)).toEqual([top.id, early.id, late.id]);
    expect(s.rankToday(early.id, T0 + 5000)).toBe(2);
    expect(s.rankToday('없는id', T0 + 5000)).toBe(0);
  });

  it('자정을 넘기면 오늘 목록이 비고 allTime 에는 남는다', () => {
    const s = new ScoreStore(memoryStorage(), 50);
    s.add(mk(500, T0));
    expect(s.today(T0 + DAY)).toEqual([]);
    expect(s.allTime()).toHaveLength(1);
  });

  it('깨진 JSON 은 .bad 로 옮기고 빈 목록으로 시작', () => {
    const st = memoryStorage();
    st.setItem(SCORES_KEY, '{깨짐');
    const s = new ScoreStore(st, 50);
    expect(s.size).toBe(0);
    expect(st.getItem(SCORES_BAD_KEY)).toBe('{깨짐');
    expect(st.getItem(SCORES_KEY)).toBeNull();
    expect(s.recovered).toBe(true);
    s.add(mk(10, T0)); // 이어서 쓸 수 있다
    expect(s.size).toBe(1);
  });

  it('모양이 틀린 항목만 걸러낸다', () => {
    const st = memoryStorage();
    st.setItem(SCORES_KEY, JSON.stringify([{ id: 'a', name: 'A', score: 1, acc: 1, avgRt: 1, streak: 1, ts: T0 }, { x: 1 }]));
    expect(new ScoreStore(st, 50).size).toBe(1);
  });

  it('저장이 항상 실패해도 메모리로 계속 돈다', () => {
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

  it('읽기까지 막혀 있어도 안 죽는다', () => {
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

  it('저장 공간이 모자라면 줄여서 한 번 더, 오늘 것은 남는다', () => {
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
    for (let i = 0; i < 20; i++) s.add(mk(100 + i, T0 - 3 * DAY + i)); // 옛 것
    const mine = s.add(mk(50, T0));
    expect(s.persistFailed).toBe(false);
    expect(s.today(T0).map((e) => e.id)).toContain(mine.id);
  });

  it('600건을 넣으면 500건이고 오늘 것은 다 남는다', () => {
    const s = new ScoreStore(memoryStorage(), 500);
    const todays: string[] = [];
    for (let i = 0; i < 400; i++) s.add(mk(i, T0 - 5 * DAY + i)); // 옛 400
    for (let i = 0; i < 200; i++) todays.push(s.add(mk(i, T0 + i)).id); // 오늘 200
    expect(s.size).toBe(500);
    const ids = new Set(s.today(T0 + 1000, Infinity).map((e) => e.id));
    expect(todays.every((id) => ids.has(id))).toBe(true);
    // 옛 것은 높은 점수가 남는다
    const oldScores = s.allTime(500).filter((e) => e.ts < T0).map((e) => e.score);
    expect(Math.min(...oldScores)).toBeGreaterThanOrEqual(100);
  });

  it('새 인스턴스가 저장된 것을 다시 읽는다', () => {
    const st = memoryStorage();
    new ScoreStore(st, 50).add(mk(777, T0));
    expect(new ScoreStore(st, 50).allTime()[0].score).toBe(777);
  });
});

describe('previewRank', () => {
  it('빈 목록이면 1등, 높은 점수가 있으면 밀리고, 같은 점수는 뒤', () => {
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
