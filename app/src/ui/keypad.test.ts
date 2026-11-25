import { describe, expect, it } from 'vitest';
import { PAD_KEYS, keyAt, padCell } from './keypad';

describe('letter pad', () => {
  it('27 cells (A–Z + ⌫), pressing the center of a cell gives that cell', () => {
    expect(PAD_KEYS).toHaveLength(27);
    PAD_KEYS.forEach((k, i) => {
      const c = padCell(i);
      expect(keyAt(c.x + 42, c.y + 42)).toBe(k);
    });
  });
  it('gaps between cells and outside are null, the OK button is OK', () => {
    expect(keyAt(984 + 90, 640 + 40)).toBeNull();
    expect(keyAt(10, 10)).toBeNull();
    expect(keyAt(300, 860)).toBe('OK');
  });
  it('the cell size is 84', () => {
    const c = padCell(0);
    expect(keyAt(c.x + 83, c.y + 83)).toBe('A');
    expect(keyAt(c.x + 84, c.y + 83)).toBeNull();
  });
});
