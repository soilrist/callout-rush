import { describe, expect, it } from 'vitest';
import { ZONES } from '../core/zones';
import { zoneAt } from '../core/zones';
import { MAP_COLORS, MAP_ORIGIN, labelLines, stageToMap, zoneRect } from './map';

describe('zoneRect', () => {
  it('converts map units to stage px (sheet values)', () => {
    const z01 = zoneRect(ZONES[0]!);
    expect(z01.x).toBeCloseTo(463.2);
    expect(z01.y).toBeCloseTo(98.4);
    expect(z01.w).toBeCloseTo(153.6);
    expect(z01.h).toBeCloseTo(134.4);
  });
  it('all 12 are inside the map base', () => {
    for (const z of ZONES) {
      const r = zoneRect(z);
      expect(r.x).toBeGreaterThanOrEqual(MAP_ORIGIN);
      expect(r.y).toBeGreaterThanOrEqual(MAP_ORIGIN);
      expect(r.x + r.w).toBeLessThanOrEqual(MAP_ORIGIN + 960);
      expect(r.y + r.h).toBeLessThanOrEqual(MAP_ORIGIN + 960);
    }
  });
});

describe('labelLines', () => {
  it('a two-word name in a narrow zone takes two lines', () => {
    for (const id of ['Z01', 'Z12', 'Z07', 'Z09', 'Z11', 'Z06', 'Z05']) {
      const z = ZONES.find((q) => q.id === id)!;
      expect(labelLines(z.name, zoneRect(z).w)).toHaveLength(2);
    }
  });
  it('a one-word name or a wide zone takes one line, uppercase', () => {
    expect(labelLines('Roof', 211)).toEqual(['ROOF']);
    expect(labelLines('Tunnel', 172)).toEqual(['TUNNEL']);
  });
  it('every line fits inside the zone width (letter width approx. 17px)', () => {
    for (const z of ZONES) {
      const w = zoneRect(z).w;
      for (const l of labelLines(z.name, w)) expect(l.length * 17).toBeLessThanOrEqual(w);
    }
  });
});

describe('stageToMap', () => {
  it('pressing the center of a zone rectangle gives that zone', () => {
    for (const z of ZONES) {
      const r = zoneRect(z);
      const m = stageToMap(r.x + r.w / 2, r.y + r.h / 2);
      expect(zoneAt(m.x, m.y)?.id).toBe(z.id);
    }
  });
  it('the top-left corner of the map is 0,0', () => {
    expect(stageToMap(MAP_ORIGIN, MAP_ORIGIN)).toEqual({ x: 0, y: 0 });
  });
});

function luminance(hex: string): number {
  const ch = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0]! + 0.7152 * ch[1]! + 0.0722 * ch[2]!;
}
function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe('zone outline contrast', () => {
  it('the border color is at least 3:1 against the map base and also against the zone fill', () => {
    expect(contrast(MAP_COLORS.zoneLine, MAP_COLORS.bg)).toBeGreaterThanOrEqual(3);
    expect(contrast(MAP_COLORS.zoneLine, MAP_COLORS.zone)).toBeGreaterThanOrEqual(3);
  });
});
