import { describe, expect, it } from 'vitest';
import type { ScoreEntry } from '../core/scores';
import { ALL, BEAT, TODAY, allRowY, findNewId, flashAlpha, slideOffset, todayRowY } from './boardwin';

const e = (id: string): ScoreEntry => ({ id, name: 'AAA', score: 1, acc: 1, avgRt: 1, streak: 1, ts: 1 });

describe('보조 창 순위 화면', () => {
  it('줄 높이는 80px 이상, 영역이 서로 안 겹친다', () => {
    expect(TODAY.h).toBeGreaterThanOrEqual(80);
    expect(ALL.h).toBeGreaterThanOrEqual(80);
    expect(todayRowY(9) + TODAY.h).toBeLessThanOrEqual(1080);
    expect(allRowY(4) + ALL.h).toBeLessThanOrEqual(BEAT.y);
  });
  it('번쩍임은 3초 뒤 0, 미끄러짐은 0.6초 뒤 0', () => {
    expect(flashAlpha(0)).toBeCloseTo(0.35);
    expect(flashAlpha(3000)).toBe(0);
    expect(slideOffset(0)).toBe(160);
    expect(slideOffset(600)).toBe(0);
  });
  it('새 id 찾기: 처음 읽을 땐 없음, 그 뒤엔 전에 없던 첫 줄', () => {
    const rows = [e('a'), e('b'), e('c')];
    expect(findNewId(null, rows)).toBeNull();
    expect(findNewId(new Set(['a', 'c']), rows)).toBe('b');
    expect(findNewId(new Set(['a', 'b', 'c']), rows)).toBeNull();
  });
});
