import { describe, expect, it } from 'vitest';
import { CSV_HEADER, csvCell, scoresToCsv } from './csv';

const e = (name: string, score: number) => ({ id: name + score, name, score, acc: 0.756, avgRt: 512.4, streak: 4, ts: Date.UTC(2026, 0, 2, 3, 4, 5) });

describe('scoresToCsv', () => {
  it('빈 목록은 머리줄 한 줄', () => {
    expect(scoresToCsv([])).toBe(`${CSV_HEADER}\r\n`);
  });
  it('줄 수 = 기록 수 + 1, 값은 반올림', () => {
    const lines = scoresToCsv([e('ABC', 900), e('---', 100)]).trim().split('\r\n');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('ABC,900,76,512,4,2026-01-02T03:04:05.000Z');
    expect(lines[2].startsWith('---,100,')).toBe(true);
  });
  it('쉼표·따옴표·수식 글자를 막는다', () => {
    expect(csvCell('A,B')).toBe('"A,B"');
    expect(csvCell('a"b')).toBe('"a""b"');
    expect(csvCell('=1+1')).toBe("'=1+1");
    expect(csvCell('-5')).toBe("'-5");
    expect(csvCell('---')).toBe('---');
  });
});
