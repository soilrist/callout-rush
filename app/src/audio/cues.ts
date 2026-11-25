import { COUNTDOWN_MS } from '../core/config';
import { phaseAt, type GameState } from '../core/game';
import type { SfxId, SfxOpts } from './sfx';

export interface Cue { id: SfxId; opts?: SfxOpts }

/** 카운트다운에서 남은 정수 초(3·2·1). 시작 전엔 0 */
function secLeft(g: GameState, t: number): number {
  if (g.status !== 'countdown') return 0;
  if (g.t0 === null) return 3;
  return Math.max(0, Math.ceil((g.t0 + COUNTDOWN_MS - t) / 1000));
}

/** 같은 판의 앞뒤 상태를 비교해 지금 나야 할 소리를 돌려준다(§5.5). 다른 판이면 아무것도 없다. */
export function cuesFor(prev: GameState, next: GameState, tPrev: number, t: number): Cue[] {
  if ((prev.t0 !== null && prev.t0 !== next.t0)) return [];
  const out: Cue[] = [];
  if (next.status === 'countdown') {
    const n = secLeft(next, t);
    if (n > 0 && n !== secLeft(prev, tPrev)) out.push({ id: 'count' });
    return out;
  }
  if (prev.status === 'countdown' && next.status === 'play') out.push({ id: 'count', opts: { go: true } });
  if (next.status === 'done') {
    if (prev.status !== 'done') out.push({ id: 'end' });
    return out;
  }
  if (next.hit > prev.hit) out.push({ id: 'hit', opts: { streak: next.streak } });
  if (next.last && next.last !== prev.last && next.last.kind !== 'hit') out.push({ id: 'miss' });
  if (next.active && next.active.call !== prev.active?.call) out.push({ id: 'radio' });
  if (prev.playStartMs !== null && next.playStartMs !== null && phaseAt(t - next.playStartMs) !== phaseAt(tPrev - prev.playStartMs)) out.push({ id: 'phase' });
  return out;
}
