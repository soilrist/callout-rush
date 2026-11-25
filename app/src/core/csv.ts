/** Score list → CSV (operator menu Export). Line count = record count + 1 (header line). */
import type { ScoreEntry } from './scores';

export const CSV_HEADER = 'name,score,accuracy_pct,avg_reaction_ms,best_streak,time';

/** Wrap commas, quotes and line breaks in quotes; put a single quote before any text a spreadsheet could read as a formula (= + @, or - followed by a digit) */
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
