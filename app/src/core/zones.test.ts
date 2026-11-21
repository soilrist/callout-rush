import { describe, expect, it } from 'vitest';
import { MAP_UNITS, ZONE_MIN_GAP } from './config';
import { ZONES, zoneAt, type Zone } from './zones';

/** 두 직사각형 사이 가장 짧은 간격 (겹치면 음수) */
function gap(a: Zone, b: Zone): number {
  const dx = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w));
  const dy = Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h));
  return Math.max(dx, dy);
}

describe('구역 데이터', () => {
  it('구역이 12개이고 ID 가 서로 다르다', () => {
    expect(ZONES).toHaveLength(12);
    expect(new Set(ZONES.map((z) => z.id)).size).toBe(12);
    expect(new Set(ZONES.map((z) => z.name)).size).toBe(12);
  });
  it('서로 안 겹치고 간격이 최소 간격 이상', () => {
    for (let i = 0; i < ZONES.length; i++) {
      for (let j = i + 1; j < ZONES.length; j++) {
        const g = gap(ZONES[i]!, ZONES[j]!);
        expect(g, `${ZONES[i]!.id}-${ZONES[j]!.id}`).toBeGreaterThanOrEqual(ZONE_MIN_GAP);
      }
    }
  });
  it('전부 맵 안에 있다', () => {
    for (const z of ZONES) {
      expect(z.x).toBeGreaterThanOrEqual(0);
      expect(z.y).toBeGreaterThanOrEqual(0);
      expect(z.x + z.w).toBeLessThanOrEqual(MAP_UNITS);
      expect(z.y + z.h).toBeLessThanOrEqual(MAP_UNITS);
    }
  });
});

describe('zoneAt', () => {
  it('각 구역 가운데는 자기 ID', () => {
    for (const z of ZONES) {
      expect(zoneAt(z.x + z.w / 2, z.y + z.h / 2)?.id).toBe(z.id);
    }
  });
  it('모서리: 왼쪽·위는 안, 오른쪽·아래는 밖', () => {
    const z = ZONES[0]!;
    expect(zoneAt(z.x, z.y)?.id).toBe(z.id);
    expect(zoneAt(z.x + z.w, z.y)).toBeNull();
    expect(zoneAt(z.x, z.y + z.h)).toBeNull();
  });
  it('빈 땅 5점과 맵 밖은 null', () => {
    const empty: [number, number][] = [[10, 10], [400, 220], [640, 450], [500, 700], [800, 600]];
    for (const [x, y] of empty) expect(zoneAt(x, y), `${x},${y}`).toBeNull();
    expect(zoneAt(-5, 100)).toBeNull();
    expect(zoneAt(500, 1200)).toBeNull();
  });
});
