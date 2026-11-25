import { describe, expect, it } from 'vitest';
import { backspace, canConfirm, finalName, isBanned, typeLetter } from './initials';

describe('initials', () => {
  it('lowercase becomes uppercase, the 4th letter is ignored', () => {
    let s = '';
    for (const ch of 'abcd') s = typeLetter(s, ch);
    expect(s).toBe('ABC');
  });
  it('non-letter keys are ignored', () => {
    expect(typeLetter('A', '1')).toBe('A');
    expect(typeLetter('A', 'Enter')).toBe('A');
    expect(typeLetter('A', ' ')).toBe('A');
  });
  it('delete: does not break on an empty field', () => {
    expect(backspace('AB')).toBe('A');
    expect(backspace('')).toBe('');
  });
  it('OK needs 3 letters', () => {
    expect(canConfirm('AB')).toBe(false);
    expect(canConfirm('ABC')).toBe(true);
  });
  it('a banned word gives ***, an unfilled one gives ---, normal ones stay', () => {
    expect(isBanned('ass')).toBe(true);
    expect(finalName('ASS')).toBe('***');
    expect(finalName('AB')).toBe('---');
    expect(finalName('')).toBe('---');
    expect(finalName('ZED')).toBe('ZED');
  });
});
