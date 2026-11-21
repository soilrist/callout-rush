import { describe, expect, it } from 'vitest';
import { backspace, canConfirm, finalName, isBanned, typeLetter } from './initials';

describe('이니셜', () => {
  it('소문자는 대문자로, 4글자째는 무시', () => {
    let s = '';
    for (const ch of 'abcd') s = typeLetter(s, ch);
    expect(s).toBe('ABC');
  });
  it('글자가 아닌 키는 무시', () => {
    expect(typeLetter('A', '1')).toBe('A');
    expect(typeLetter('A', 'Enter')).toBe('A');
    expect(typeLetter('A', ' ')).toBe('A');
  });
  it('지우기: 빈 칸에서도 안 깨진다', () => {
    expect(backspace('AB')).toBe('A');
    expect(backspace('')).toBe('');
  });
  it('3글자 차야 OK', () => {
    expect(canConfirm('AB')).toBe(false);
    expect(canConfirm('ABC')).toBe(true);
  });
  it('금지어는 ***, 못 채우면 ---, 보통은 그대로', () => {
    expect(isBanned('ass')).toBe(true);
    expect(finalName('ASS')).toBe('***');
    expect(finalName('AB')).toBe('---');
    expect(finalName('')).toBe('---');
    expect(finalName('ZED')).toBe('ZED');
  });
});
