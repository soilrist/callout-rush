/** Operator menu (DESIGN §4.7): opens with Ctrl+Shift+O, closes with Esc or Close. An HTML overlay — made once and only shown or hidden (so node and listener counts do not grow per round). */
import { scoresToCsv } from '../core/csv';
import type { ScoreStore } from '../core/scores';

export interface OperatorDeps {
  store: ScoreStore;
  /** Rounds finished since it was turned on */
  games: () => number;
  /** Error count (raised by M2-09) */
  errors: () => number;
  isMuted: () => boolean;
  setMuted: (m: boolean) => void;
  onCleared: () => void;
}

export interface Operator {
  /** Call every frame with the real clock (ms) — average frame time over the last minute */
  sampleFrame(realNowMs: number): void;
  isOpen(): boolean;
}

/** Average frame time (ms) over the last minute. 0 if there are no samples */
export function avgFrameMs(samples: readonly { at: number; dt: number }[], nowMs: number, windowMs = 60_000): number {
  const recent = samples.filter((s) => nowMs - s.at <= windowMs);
  return recent.length === 0 ? 0 : recent.reduce((a, s) => a + s.dt, 0) / recent.length;
}

const CONFIRM_TEXT = "Clear today's scores? This cannot be undone.";

export function installOperator(deps: OperatorDeps): Operator {
  const samples: { at: number; dt: number }[] = [];
  let last = -1;
  let open = false;
  let confirming = false;

  const root = document.createElement('div');
  root.id = 'operator';
  root.hidden = true;
  const panel = document.createElement('div');
  panel.className = 'op-panel';
  const title = document.createElement('h2');
  title.textContent = 'Operator menu';
  const list = document.createElement('div');
  list.className = 'op-list';
  const msg = document.createElement('p');
  msg.className = 'op-msg';
  const healthBox = document.createElement('pre');
  healthBox.className = 'op-health';
  healthBox.hidden = true;
  panel.append(title, list, msg, healthBox);
  root.append(panel);
  document.body.append(root);

  const btn = (label: string, run: () => void, kind?: 'danger' | 'close'): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    if (kind) b.className = kind;
    b.textContent = label;
    b.addEventListener('click', run);
    return b;
  };

  const download = (): void => {
    const blob = new Blob([scoresToCsv(deps.store.all())], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `callout-rush-scores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    msg.textContent = `Exported ${deps.store.size} scores.`;
  };

  const heapMb = (): string => {
    const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    return m ? (m.usedJSHeapSize / 1048576).toFixed(1) : 'n/a';
  };
  const showHealth = (): void => {
    healthBox.hidden = false;
    healthBox.textContent = [
      `Games since start   ${deps.games()}`,
      `JS heap (MB)        ${heapMb()}`,
      `Frame ms (last 1m)  ${avgFrameMs(samples, performance.now()).toFixed(1)}`,
      `Errors              ${deps.errors()}`,
    ].join('\n');
  };

  const render = (): void => {
    list.replaceChildren();
    if (confirming) {
      msg.textContent = CONFIRM_TEXT;
      list.append(
        btn('Yes, clear', () => {
          const n = deps.store.clearToday(Date.now());
          deps.onCleared();
          confirming = false;
          render();
          msg.textContent = `Cleared ${n} scores from today.`;
        }),
        btn('Cancel', () => { confirming = false; render(); }),
      );
      return;
    }
    list.append(
      btn('Open leaderboard window', () => { window.open('board.html', 'calloutrush-board', 'popup,width=1280,height=720'); }),
      btn('Fullscreen', () => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => { msg.textContent = 'Fullscreen was blocked by the browser.'; });
      }),
      btn(deps.isMuted() ? 'Unmute' : 'Mute', () => { deps.setMuted(!deps.isMuted()); render(); }),
      btn('Export scores (CSV)', download),
      btn("Clear today's scores", () => { confirming = true; render(); }, 'danger'),
      btn('Booth health', showHealth),
      btn('Close', () => setOpen(false), 'close'),
    );
    if (deps.store.persistFailed) msg.textContent = 'Storage is full — scores are kept in memory only.';
    else if (!msg.textContent) msg.textContent = '';
  };

  const setOpen = (v: boolean): void => {
    open = v;
    confirming = false;
    root.hidden = !v;
    document.body.dataset['operator'] = v ? '1' : '0';
    if (v) { msg.textContent = ''; healthBox.hidden = true; deps.store.load(); render(); }
  };

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') { e.preventDefault(); setOpen(!open); }
    else if (open && e.key === 'Escape') setOpen(false);
  });
  document.body.dataset['operator'] = '0';

  return {
    sampleFrame(realNowMs) {
      if (last >= 0) {
        samples.push({ at: realNowMs, dt: realNowMs - last });
        while (samples.length > 0 && realNowMs - (samples[0]?.at ?? realNowMs) > 60_000) samples.shift();
      }
      last = realNowMs;
    },
    isOpen: () => open,
  };
}
