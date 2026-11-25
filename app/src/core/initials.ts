/** Initials input rules (DESIGN §4.5, §5.9). Pure functions with no screen. */
export const INITIALS_LEN = 3;
export const IDLE_NAME = '---';
export const BANNED_NAME = '***';

/** Banned 3-letter words (common English slurs and hate abbreviations). Not shown on screen; replaced with `***` when saved. */
const BANNED: ReadonlySet<string> = new Set([
  'ASS', 'FUK', 'FUC', 'SEX', 'XXX', 'DIK', 'CUM', 'TIT', 'FAG', 'GAY',
  'KKK', 'NIG', 'WTF', 'POO', 'PIS', 'CUC', 'DAM', 'HOE', 'JIZ', 'NAZ',
]);

export function isBanned(name: string): boolean {
  return BANNED.has(name.toUpperCase());
}

/** Appends one letter. Accepts only A–Z (lowercase becomes uppercase); a 4th letter or any other character is ignored. */
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

/** The name to save. `---` if not filled in before time ran out, `***` if banned. */
export function finalName(cur: string): string {
  if (cur.length !== INITIALS_LEN) return IDLE_NAME;
  return isBanned(cur) ? BANNED_NAME : cur;
}
