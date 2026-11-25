/** Never dies (M2-09): on an unhandled error, adds to a count in storage and reloads shortly after (= attract screen). Keeping the screen awake works only on devices that support it. */
export const HEALTH_KEY = 'calloutrush.v1.health';
export const RELOAD_DELAY_MS = 3000;

export interface GuardDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  reload: () => void;
  schedule: (fn: () => void, ms: number) => void;
}

export interface Guard {
  errors: () => number;
  /** Counts one error. The reload is scheduled only once. */
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
        /* even if saving is blocked, reload anyway */
      }
      if (pending) return;
      pending = true;
      deps.schedule(deps.reload, RELOAD_DELAY_MS);
    },
  };
}

/** Hooks into the browser: window error or promise rejection → count +1, reload after 3 s. */
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

/** Keeps the screen awake. If unsupported, passes quietly. Takes it again when the tab is visible again. */
export function keepAwake(): void {
  const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<unknown> } };
  if (!nav.wakeLock) return;
  const grab = (): void => { void nav.wakeLock?.request('screen').catch(() => undefined); };
  grab();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) grab(); });
}
