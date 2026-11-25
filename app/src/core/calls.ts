import { PEOPLE_RATIO_PERCENT, RECENT_EXCLUDE, TWO_ZONE_PERCENT } from './config';
import type { Rng } from './rng';
import { ZONES, type ZoneId } from './zones';

/** One call. A one-zone call has zones length 1 + people 1–3; a two-zone call has zones length 2 (clicked in order). */
export interface Call {
  zones: ZoneId[];
  /** People count of a one-zone call (0 for a two-zone call) */
  people: 0 | 1 | 2 | 3;
  /** Sentence shown on screen (§5.2) */
  text: string;
}

function nameOf(id: ZoneId): string {
  const z = ZONES.find((zone) => zone.id === id);
  if (!z) throw new Error(`없는 구역: ${id}`);
  return z.name;
}

const PEOPLE_WORD = ['one', 'two', 'three'] as const;

/** Picks from the candidates left after removing the last RECENT_EXCLUDE zones that appeared recently (newest at the end). */
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
 * Builds the next call (§4.3).
 * @param rng function returning a random number from 0 up to but not including 1 (can be seeded)
 * @param phase phase 1–3 (two-zone calls appear only in 3)
 * @param recent zone IDs that appeared recently, oldest first. The last RECENT_EXCLUDE of them are not picked.
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
