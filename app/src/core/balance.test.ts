import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { BOT_PROFILES, simulate } from './bot';
import { GRADE_BOUNDS } from './config';
import { grade } from './scoring';

const GAMES = 200;
function median(name: 'rookie' | 'regular' | 'pro'): number {
  const p = BOT_PROFILES.find((b) => b.name === name);
  if (!p) throw new Error(name);
  const a: number[] = [];
  for (let seed = 1; seed <= GAMES; seed++) a.push(simulate(p, seed).score);
  a.sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)] ?? 0;
}

describe('Balance targets (§6.2, M1-12)', () => {
  const m = { rookie: median('rookie'), regular: median('regular'), pro: median('pro') };
  it('rookie=ENTRY, regular=ANCHOR or SHOT CALLER, pro=IGL', () => {
    expect(grade(m.rookie)).toBe('ENTRY');
    expect(['ANCHOR', 'SHOT CALLER']).toContain(grade(m.regular));
    expect(grade(m.pro)).toBe('IGL');
  });
  it('bot set medians differ by at least 1500 points', () => {
    expect(m.regular - m.rookie).toBeGreaterThanOrEqual(1500);
    expect(m.pro - m.regular).toBeGreaterThanOrEqual(1500);
  });
  it('DESIGN §6.2 grade edge row matches config.ts', () => {
    const doc = readFileSync(new URL('../../../docs/DESIGN.md', import.meta.url), 'utf8');
    const row = doc.split('\n').find((l) => l.startsWith('| 등급 경계'));
    const nums = (row?.split('|')[2] ?? '').match(/[\d,]+/g)?.map((x) => Number(x.replace(/,/g, '')));
    expect(nums).toEqual([...GRADE_BOUNDS]);
  });
});
