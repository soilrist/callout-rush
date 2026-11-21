import { describe, expect, it } from 'vitest';
import { ZONES } from '../core/zones';
import { MAP_ORIGIN, labelLines, zoneRect } from './map';

describe('zoneRect', () => {
  it('맵 단위를 무대 px 로 바꾼다 (시트 값)', () => {
    const z01 = zoneRect(ZONES[0]!);
    expect(z01.x).toBeCloseTo(463.2);
    expect(z01.y).toBeCloseTo(98.4);
    expect(z01.w).toBeCloseTo(153.6);
    expect(z01.h).toBeCloseTo(134.4);
  });
  it('12개가 전부 맵 바탕 안에 있다', () => {
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
  it('좁은 구역의 두 단어 이름은 두 줄', () => {
    for (const id of ['Z01', 'Z12', 'Z07', 'Z09', 'Z11', 'Z06', 'Z05']) {
      const z = ZONES.find((q) => q.id === id)!;
      expect(labelLines(z.name, zoneRect(z).w)).toHaveLength(2);
    }
  });
  it('한 단어나 넓은 구역은 한 줄, 대문자', () => {
    expect(labelLines('Roof', 211)).toEqual(['ROOF']);
    expect(labelLines('Tunnel', 172)).toEqual(['TUNNEL']);
  });
  it('모든 줄이 구역 폭 안에 들어간다 (글자 폭 17px 근사)', () => {
    for (const z of ZONES) {
      const w = zoneRect(z).w;
      for (const l of labelLines(z.name, w)) expect(l.length * 17).toBeLessThanOrEqual(w);
    }
  });
});
