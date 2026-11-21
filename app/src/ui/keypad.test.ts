import { describe, expect, it } from 'vitest';
import { PAD_KEYS, keyAt, padCell } from './keypad';

describe('글자판', () => {
  it('27칸(A~Z + ⌫), 칸마다 가운데를 누르면 그 칸', () => {
    expect(PAD_KEYS).toHaveLength(27);
    PAD_KEYS.forEach((k, i) => {
      const c = padCell(i);
      expect(keyAt(c.x + 42, c.y + 42)).toBe(k);
    });
  });
  it('칸 사이 틈·밖은 null, OK 단추는 OK', () => {
    expect(keyAt(984 + 90, 640 + 40)).toBeNull();
    expect(keyAt(10, 10)).toBeNull();
    expect(keyAt(300, 860)).toBe('OK');
  });
  it('칸 크기는 84', () => {
    const c = padCell(0);
    expect(keyAt(c.x + 83, c.y + 83)).toBe('A');
    expect(keyAt(c.x + 84, c.y + 83)).toBeNull();
  });
});
