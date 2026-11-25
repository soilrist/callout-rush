import { describe, expect, it } from 'vitest';
import { MAP_UNITS, ZONE_MIN_GAP } from './config';
import { ZONES, zoneAt, type Zone } from './zones';

/** Shortest gap between two rectangles (negative if they overlap) */
function gap(a: Zone, b: Zone): number {
  const dx = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w));
  const dy = Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h));
  return Math.max(dx, dy);
}

describe('zone data', () => {
  it('there are 12 zones and the IDs differ', () => {
    expect(ZONES).toHaveLength(12);
    expect(new Set(ZONES.map((z) => z.id)).size).toBe(12);
    expect(new Set(ZONES.map((z) => z.name)).size).toBe(12);
  });
  it('they do not overlap and the gap is at least the minimum', () => {
    for (let i = 0; i < ZONES.length; i++) {
      for (let j = i + 1; j < ZONES.length; j++) {
        const g = gap(ZONES[i]!, ZONES[j]!);
        expect(g, `${ZONES[i]!.id}-${ZONES[j]!.id}`).toBeGreaterThanOrEqual(ZONE_MIN_GAP);
      }
    }
  });
  it('all are inside the map', () => {
    for (const z of ZONES) {
      expect(z.x).toBeGreaterThanOrEqual(0);
      expect(z.y).toBeGreaterThanOrEqual(0);
      expect(z.x + z.w).toBeLessThanOrEqual(MAP_UNITS);
      expect(z.y + z.h).toBeLessThanOrEqual(MAP_UNITS);
    }
  });
});

describe('zoneAt', () => {
  it('the center of each zone is its own ID', () => {
    for (const z of ZONES) {
      expect(zoneAt(z.x + z.w / 2, z.y + z.h / 2)?.id).toBe(z.id);
    }
  });
  it('edges: left and top are inside, right and bottom are outside', () => {
    const z = ZONES[0]!;
    expect(zoneAt(z.x, z.y)?.id).toBe(z.id);
    expect(zoneAt(z.x + z.w, z.y)).toBeNull();
    expect(zoneAt(z.x, z.y + z.h)).toBeNull();
  });
  it('5 empty-ground points and outside the map are null', () => {
    const empty: [number, number][] = [[10, 10], [400, 220], [640, 450], [500, 700], [800, 600]];
    for (const [x, y] of empty) expect(zoneAt(x, y), `${x},${y}`).toBeNull();
    expect(zoneAt(-5, 100)).toBeNull();
    expect(zoneAt(500, 1200)).toBeNull();
  });
});
