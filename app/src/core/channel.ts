/** Game window → helper window notice (DESIGN §4.6). The game runs the same without a helper window. */
export const CHANNEL_NAME = 'calloutrush';

export interface ScoresUpdated {
  type: 'scores-updated';
}

export function isScoresUpdated(m: unknown): m is ScoresUpdated {
  return typeof m === 'object' && m !== null && (m as { type?: unknown }).type === 'scores-updated';
}

/** Call right after saving. If BroadcastChannel is missing or fails, it passes quietly */
export function notifyScoresUpdated(): void {
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type: 'scores-updated' } satisfies ScoresUpdated);
    ch.close();
  } catch {
    /* if missing, the helper window catches up through the storage event and the 5-second read */
  }
}
