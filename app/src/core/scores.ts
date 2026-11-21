/** 점수 저장소 (DESIGN §4.8). 절대 안 죽는다: 깨진 JSON·저장 실패·localStorage 차단 모두 메모리로 계속. */
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

/** 저장 어댑터 — localStorage 와 같은 모양의 최소 부분 */
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

/** 브라우저 localStorage 를 시도하고, 막혀 있으면 메모리 */
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

/** 높은 점수 먼저, 동점은 먼저 낸(ts 작은) 쪽이 위, 그래도 같으면 id */
function byRank(a: ScoreEntry, b: ScoreEntry): number {
  return b.score - a.score || a.ts - b.ts || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** now 가 속한 날의 로컬 자정(ms) */
export function dayStart(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export class ScoreStore {
  private list: ScoreEntry[] = [];
  /** 저장 실패로 메모리에만 있으면 true — 운영자 메뉴 경고용 */
  persistFailed = false;
  /** 깨진 JSON 을 .bad 로 옮겼으면 true */
  recovered = false;
  private seq = 0;

  constructor(
    private storage: StorageLike = defaultStorage(),
    private maxEntries: number = MAX_SCORES,
  ) {
    this.load();
  }

  /** 저장소에서 다시 읽기 (보조 창 갱신용) */
  load(): void {
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(SCORES_KEY);
    } catch {
      this.persistFailed = true;
      return; // 읽기 불가 — 메모리 목록 유지
    }
    if (raw === null) {
      this.list = this.persistFailed ? this.list : [];
      return;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('not array');
      this.list = parsed.filter(isEntry);
    } catch {
      try {
        this.storage.setItem(SCORES_BAD_KEY, raw);
        this.storage.removeItem(SCORES_KEY);
      } catch {
        this.persistFailed = true;
      }
      this.recovered = true;
      this.list = [];
    }
  }

  /** 점수 한 건 추가. id·ts 는 채워 준다. 돌려주는 값은 저장된 항목 */
  add(e: Omit<ScoreEntry, 'id'> & { id?: string }): ScoreEntry {
    const entry: ScoreEntry = { ...e, id: e.id ?? `${e.ts}-${this.seq++}-${this.list.length}` };
    this.list.push(entry);
    this.prune(entry.ts);
    this.persist();
    return entry;
  }

  /** 500건 넘으면 오늘 것 전부 + 전체 상위를 남기고 낮은 옛 기록부터 지운다 */
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
    // 공간 꽉 참: 줄이고 한 번 더 (오늘 것은 지키고 옛 것을 절반으로)
    const keep = Math.max(1, Math.floor(this.list.length / 2));
    const now = this.list.reduce((m, e) => Math.max(m, e.ts), 0);
    const start = dayStart(now);
    const todays = this.list.filter((e) => e.ts >= start);
    const olds = this.list.filter((e) => e.ts < start).sort(byRank);
    this.list = [...todays, ...olds.slice(0, Math.max(0, keep - todays.length))];
    this.persistFailed = !tryWrite();
  }

  /** 전체(순위순) */
  allTime(limit = 5): ScoreEntry[] {
    return [...this.list].sort(byRank).slice(0, limit);
  }

  /** 저장된 전체 기록(저장 순서 그대로) — CSV 내보내기용 */
  all(): ScoreEntry[] {
    return [...this.list];
  }

  /** 오늘 기록만 지운다(운영자 메뉴). 지운 건수를 돌려준다. 옛 기록은 그대로 */
  clearToday(now: number): number {
    const start = dayStart(now);
    const nextStart = dayStart(start + 86_400_000 + 3_600_000);
    const before = this.list.length;
    this.list = this.list.filter((e) => !(e.ts >= start && e.ts < nextStart));
    this.persist();
    return before - this.list.length;
  }

  /** 오늘(now 의 로컬 날짜) 목록, 순위순. 자정 넘으면 비어 있다 */
  today(now: number, limit = 10): ScoreEntry[] {
    const start = dayStart(now);
    const end = start + 86_400_000 + 3_600_000; // 서머타임 날 25시간 여유
    const nextStart = dayStart(end);
    return this.list
      .filter((e) => e.ts >= start && e.ts < nextStart)
      .sort(byRank)
      .slice(0, limit);
  }

  /** 오늘 순위(1부터). 오늘 목록에 없으면 0 */
  rankToday(id: string, now: number): number {
    return this.today(now, Infinity).findIndex((e) => e.id === id) + 1;
  }

  /** 아직 저장 안 한 점수가 오늘 몇 등이 될지(1부터). 같은 점수는 먼저 낸 쪽이 앞이라 뒤로 간다 */
  previewRank(score: number, now: number): number {
    return this.today(now, Infinity).filter((e) => e.score >= score).length + 1;
  }

  get size(): number {
    return this.list.length;
  }
}
