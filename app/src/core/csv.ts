/** 점수 목록 → CSV (운영자 메뉴 Export). 줄 수 = 기록 수 + 1(머리줄). */
import type { ScoreEntry } from './scores';

export const CSV_HEADER = 'name,score,accuracy_pct,avg_reaction_ms,best_streak,time';

/** 쉼표·따옴표·줄바꿈은 따옴표로 감싸고, 표 프로그램이 수식으로 읽을 글자(= + @, 숫자 붙은 -)는 앞에 ' 를 붙인다 */
export function csvCell(v: string): string {
  const guarded = /^[=+@]/.test(v) || /^-(?!-*$)/.test(v) ? `'${v}` : v;
  return /[",\r\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export function scoresToCsv(list: readonly ScoreEntry[]): string {
  const rows = list.map((e) =>
    [csvCell(e.name), String(e.score), String(Math.round(e.acc * 100)), String(Math.round(e.avgRt)), String(e.streak), new Date(e.ts).toISOString()].join(','),
  );
  return [CSV_HEADER, ...rows].join('\r\n') + '\r\n';
}
