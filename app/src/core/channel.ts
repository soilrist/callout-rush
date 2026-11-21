/** 게임 창 → 보조 창 알림 (DESIGN §4.6). 보조 창이 없어도 게임은 그대로 돈다. */
export const CHANNEL_NAME = 'calloutrush';

export interface ScoresUpdated {
  type: 'scores-updated';
}

export function isScoresUpdated(m: unknown): m is ScoresUpdated {
  return typeof m === 'object' && m !== null && (m as { type?: unknown }).type === 'scores-updated';
}

/** 저장 직후 부른다. BroadcastChannel 이 없거나 실패해도 조용히 넘어간다 */
export function notifyScoresUpdated(): void {
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type: 'scores-updated' } satisfies ScoresUpdated);
    ch.close();
  } catch {
    /* 없으면 보조 창이 storage 이벤트·5초 읽기로 따라온다 */
  }
}
