import { PEOPLE_RATIO_PERCENT, RECENT_EXCLUDE, TWO_ZONE_PERCENT } from './config';
import type { Rng } from './rng';
import { ZONES, type ZoneId } from './zones';

/** 콜 하나. 한 곳 콜은 zones 길이 1 + people 1~3, 두 곳 콜은 zones 길이 2 (순서대로 누른다). */
export interface Call {
  zones: ZoneId[];
  /** 한 곳 콜의 인원 (두 곳 콜은 0) */
  people: 0 | 1 | 2 | 3;
  /** 화면에 띄우는 문장 (§5.2) */
  text: string;
}

function nameOf(id: ZoneId): string {
  const z = ZONES.find((zone) => zone.id === id);
  if (!z) throw new Error(`없는 구역: ${id}`);
  return z.name;
}

const PEOPLE_WORD = ['one', 'two', 'three'] as const;

/** 최근에 나온 구역(뒤쪽이 최신)의 마지막 RECENT_EXCLUDE 개를 뺀 후보에서 고른다. */
function pickZone(rng: Rng, excluded: readonly ZoneId[]): ZoneId {
  const pool = ZONES.filter((z) => !excluded.includes(z.id));
  const picked = pool[Math.floor(rng() * pool.length)];
  if (!picked) throw new Error('고를 구역이 없다');
  return picked.id;
}

function pickPeople(rng: Rng): 1 | 2 | 3 {
  const r = rng() * 100;
  if (r < PEOPLE_RATIO_PERCENT[0]) return 1;
  if (r < PEOPLE_RATIO_PERCENT[0] + PEOPLE_RATIO_PERCENT[1]) return 2;
  return 3;
}

/**
 * 다음 콜을 만든다 (§4.3).
 * @param rng 0 이상 1 미만 난수 함수 (시드를 줄 수 있다)
 * @param phase 단계 1~3 (3 에서만 두 곳 콜이 나온다)
 * @param recent 최근에 나온 구역 ID, 오래된 것부터. 마지막 RECENT_EXCLUDE 개는 고르지 않는다.
 */
export function nextCall(rng: Rng, phase: 1 | 2 | 3, recent: readonly ZoneId[]): Call {
  const excluded = recent.slice(-RECENT_EXCLUDE);
  const two = phase === 3 && rng() * 100 < TWO_ZONE_PERCENT;
  if (two) {
    const a = pickZone(rng, excluded);
    const b = pickZone(rng, [...excluded, a]);
    return { zones: [a, b], people: 0, text: `${nameOf(a)}, then ${nameOf(b)}!` };
  }
  const zone = pickZone(rng, excluded);
  const people = pickPeople(rng);
  return { zones: [zone], people, text: `${nameOf(zone)}, ${PEOPLE_WORD[people - 1]}!` };
}
