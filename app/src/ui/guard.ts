/** 안 죽는다 (M2-09): 처리 안 된 오류가 나면 횟수를 저장소에 올리고 잠시 뒤 새로 고침(= 대기 화면). 화면 꺼짐 방지는 되는 기기에서만. */
export const HEALTH_KEY = 'calloutrush.v1.health';
export const RELOAD_DELAY_MS = 3000;

export interface GuardDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  reload: () => void;
  schedule: (fn: () => void, ms: number) => void;
}

export interface Guard {
  errors: () => number;
  /** 오류 하나를 센다. 새로 고침 예약은 한 번만. */
  report: () => void;
}

export function readErrors(storage: Pick<Storage, 'getItem'>): number {
  try {
    const v = JSON.parse(storage.getItem(HEALTH_KEY) ?? '{}') as { errors?: unknown };
    return typeof v.errors === 'number' && Number.isFinite(v.errors) && v.errors >= 0 ? Math.floor(v.errors) : 0;
  } catch {
    return 0;
  }
}

export function createGuard(deps: GuardDeps): Guard {
  let pending = false;
  return {
    errors: () => readErrors(deps.storage),
    report: () => {
      try {
        deps.storage.setItem(HEALTH_KEY, JSON.stringify({ errors: readErrors(deps.storage) + 1 }));
      } catch {
        /* 저장이 막혀도 새로 고침은 한다 */
      }
      if (pending) return;
      pending = true;
      deps.schedule(deps.reload, RELOAD_DELAY_MS);
    },
  };
}

/** 브라우저에 연결: window 오류·약속 거부 → 횟수 +1 후 3초 뒤 새로 고침. */
export function installGuard(): Guard {
  const guard = createGuard({
    storage: window.localStorage,
    reload: () => window.location.reload(),
    schedule: (fn, ms) => { window.setTimeout(fn, ms); },
  });
  window.addEventListener('error', () => guard.report());
  window.addEventListener('unhandledrejection', () => guard.report());
  return guard;
}

/** 화면 꺼짐 방지. 지원 안 하면 조용히 넘어간다. 탭이 다시 보이면 다시 잡는다. */
export function keepAwake(): void {
  const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<unknown> } };
  if (!nav.wakeLock) return;
  const grab = (): void => { void nav.wakeLock?.request('screen').catch(() => undefined); };
  grab();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) grab(); });
}
