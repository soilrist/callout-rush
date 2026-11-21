/** 이니셜 입력 규칙 (DESIGN §4.5·§5.9). 화면 없는 순수 함수. */
export const INITIALS_LEN = 3;
export const IDLE_NAME = '---';
export const BANNED_NAME = '***';

/** 금지 3글자 (흔한 영어 욕·혐오 약어). 화면엔 알리지 않고 저장할 때 `***` 로 바꾼다. */
const BANNED: ReadonlySet<string> = new Set([
  'ASS', 'FUK', 'FUC', 'SEX', 'XXX', 'DIK', 'CUM', 'TIT', 'FAG', 'GAY',
  'KKK', 'NIG', 'WTF', 'POO', 'PIS', 'CUC', 'DAM', 'HOE', 'JIZ', 'NAZ',
]);

export function isBanned(name: string): boolean {
  return BANNED.has(name.toUpperCase());
}

/** 글자 하나를 뒤에 붙인다. A~Z(소문자는 대문자로)만 받고, 4글자째·그 밖의 글자는 무시. */
export function typeLetter(cur: string, ch: string): string {
  const c = ch.toUpperCase();
  if (cur.length >= INITIALS_LEN || !/^[A-Z]$/.test(c)) return cur;
  return cur + c;
}

export function backspace(cur: string): string {
  return cur.slice(0, -1);
}

export function canConfirm(cur: string): boolean {
  return cur.length === INITIALS_LEN;
}

/** 저장할 이름. 안 채우고 시간이 끝나면 `---`, 금지어면 `***`. */
export function finalName(cur: string): string {
  if (cur.length !== INITIALS_LEN) return IDLE_NAME;
  return isBanned(cur) ? BANNED_NAME : cur;
}
