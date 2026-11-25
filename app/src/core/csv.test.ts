import { describe, expect, it } from 'vitest';
import { CSV_HEADER, csvCell, scoresToCsv } from './csv';

const e = (name: string, score: number) => ({ id: name + score, name, score, acc: 0.756, avgRt: 512.4, streak: 4, ts: Date.UTC(2026, 0, 2, 3, 4, 5) });

describe('scoresToCsv', () => {
  it('an empty list is one header line', () => {
    expect(scoresToCsv([])).toBe(`${CSV_HEADER}\r\n`);
  });
  it('line count = record count + 1, values are rounded', () => {
    const lines = scoresToCsv([e('ABC', 900), e('---', 100)]).trim().split('\r\n');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('ABC,900,76,512,4,2026-01-02T03:04:05.000Z');
    expect(lines[2].startsWith('---,100,')).toBe(true);
  });
  it('blocks commas, quotes and formula characters', () => {
    expect(csvCell('A,B')).toBe('"A,B"');
    expect(csvCell('a"b')).toBe('"a""b"');
    expect(csvCell('=1+1')).toBe("'=1+1");
    expect(csvCell('-5')).toBe("'-5");
    expect(csvCell('---')).toBe('---');
  });
});
