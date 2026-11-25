/** Score store (DESIGN §4.8). It never dies: broken JSON, a failed save, or a blocked localStorage all keep going in memory. */
import { MAX_SCORES } from './config';

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  acc: number;
  avgRt: number;
  streak: number;
  ts: number;
}

/** Storage adapter — the smallest part shaped like localStorage */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const SCORES_KEY = 'calloutrush.v1.scores';
export const SCORES_BAD_KEY = 'calloutrush.v1.scores.bad';

export function memoryStorage(): StorageLike {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
  };
}

/** Tries the browser localStorage, and uses memory if it is blocked */
export function defaultStorage(): StorageLike {
  try {
    const ls = globalThis.localStorage;
    ls.setItem('calloutrush.v1.probe', '1');
    ls.removeItem('calloutrush.v1.probe');
    return ls;
  } catch {
    return memoryStorage();
  }
}

function isEntry(e: unknown): e is ScoreEntry {
  if (typeof e !== 'object' || e === null) return false;
  const o = e as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    Number.isFinite(o.score) &&
    Number.isFinite(o.acc) &&
    Number.isFinite(o.avgRt) &&
    Number.isFinite(o.streak) &&
    Number.isFinite(o.ts)
  );
}

/** Higher score first; on a tie the one submitted earlier (smaller ts) is higher; if still equal, by id */
function byRank(a: ScoreEntry, b: ScoreEntry): number {
  return b.score - a.score || a.ts - b.ts || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** Local midnight (ms) of the day that now falls in */
export function dayStart(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export class ScoreStore {
  private list: ScoreEntry[] = [];
  /** true if it exists only in memory because saving failed — for the operator menu warning */
  persistFailed = false;
  /** true if broken JSON was moved to .bad */
  recovered = false;
  private seq = 0;

  constructor(
    private storage: StorageLike = defaultStorage(),
    private maxEntries: number = MAX_SCORES,
  ) {
    this.load();
  }

  /** Reads again from the storage (to refresh the helper window) */
  load(): void {
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(SCORES_KEY);
    } catch {
      this.persistFailed = true;
      return; // cannot read — keep the in-memory list
    }
    if (raw === null) {
      this.list = this.persistFailed ? this.list : [];
      return;
    }
    let items: unknown[] | null = null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      items = null;
    }
    if (items !== null) {
      this.list = items.filter(isEntry);
      return;
    }
    // Broken JSON, or not an array: the same recovery path
    try {
      this.storage.setItem(SCORES_BAD_KEY, raw);
      this.storage.removeItem(SCORES_KEY);
    } catch {
      this.persistFailed = true;
    }
    this.recovered = true;
    this.list = [];
  }

  /** Adds one score. Fills in id and ts. Returns the saved entry */
  add(e: Omit<ScoreEntry, 'id'> & { id?: string }): ScoreEntry {
    const entry: ScoreEntry = { ...e, id: e.id ?? `${e.ts}-${this.seq++}-${this.list.length}` };
    this.list.push(entry);
    this.prune(entry.ts);
    this.persist();
    return entry;
  }

  /** Over 500 entries: keeps every record from today plus the overall top, and deletes the lowest old records first */
  prune(now: number): void {
    if (this.list.length <= this.maxEntries) return;
    const start = dayStart(now);
    const todays = this.list.filter((e) => e.ts >= start);
    const olds = this.list.filter((e) => e.ts < start).sort(byRank);
    const room = Math.max(0, this.maxEntries - todays.length);
    this.list = [...todays, ...olds.slice(0, room)];
  }

  private persist(): void {
    const tryWrite = (): boolean => {
      try {
        this.storage.setItem(SCORES_KEY, JSON.stringify(this.list));
        return true;
      } catch {
        return false;
      }
    };
    if (tryWrite()) {
      this.persistFailed = false;
      return;
    }
    // Space is full: shrink and try once more (keep today, halve the old ones)
    const keep = Math.max(1, Math.floor(this.list.length / 2));
    const now = this.list.reduce((m, e) => Math.max(m, e.ts), 0);
    const start = dayStart(now);
    const todays = this.list.filter((e) => e.ts >= start);
    const olds = this.list.filter((e) => e.ts < start).sort(byRank);
    this.list = [...todays, ...olds.slice(0, Math.max(0, keep - todays.length))];
    this.persistFailed = !tryWrite();
  }

  /** All records (in rank order) */
  allTime(limit = 5): ScoreEntry[] {
    return [...this.list].sort(byRank).slice(0, limit);
  }

  /** All saved records (in save order) — for CSV export */
  all(): ScoreEntry[] {
    return [...this.list];
  }

  /** Deletes only today's records (operator menu). Returns how many were deleted. Old records stay */
  clearToday(now: number): number {
    const start = dayStart(now);
    const nextStart = dayStart(start + 86_400_000 + 3_600_000);
    const before = this.list.length;
    this.list = this.list.filter((e) => !(e.ts >= start && e.ts < nextStart));
    this.persist();
    return before - this.list.length;
  }

  /** Today's list (local date of now), in rank order. Empty after midnight */
  today(now: number, limit = 10): ScoreEntry[] {
    const start = dayStart(now);
    const end = start + 86_400_000 + 3_600_000; // 25 hours of room for a daylight-saving day
    const nextStart = dayStart(end);
    return this.list
      .filter((e) => e.ts >= start && e.ts < nextStart)
      .sort(byRank)
      .slice(0, limit);
  }

  /** Today's rank (from 1). 0 if not in today's list */
  rankToday(id: string, now: number): number {
    return this.today(now, Infinity).findIndex((e) => e.id === id) + 1;
  }

  /** What today's rank an unsaved score would get (from 1). An equal score goes behind, because the one submitted first is ahead */
  previewRank(score: number, now: number): number {
    return this.today(now, Infinity).filter((e) => e.score >= score).length + 1;
  }

  get size(): number {
    return this.list.length;
  }
}
