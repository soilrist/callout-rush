/** Number of live timers, listeners and DOM nodes (M2-07). The test reads it with `window.__health()` to check it does not grow over many rounds. */
export interface Health {
  timers: number;
  nodes: number;
  listeners: number;
}

const ids = new WeakMap<object, number>();
let nextId = 1;
function idOf(l: object): number {
  let id = ids.get(l);
  if (id === undefined) { id = nextId++; ids.set(l, id); }
  return id;
}
const capture = (o?: boolean | AddEventListenerOptions): boolean => (typeof o === 'object' ? o.capture === true : o === true);

/** Wraps setTimeout, setInterval and addEventListener to count what is alive. Call only once. */
export function installHealth(): () => Health {
  const live = new Set<number>();
  const st = window.setTimeout.bind(window);
  const si = window.setInterval.bind(window);
  const ct = window.clearTimeout.bind(window);
  const ci = window.clearInterval.bind(window);
  window.setTimeout = ((h: TimerHandler, ms?: number, ...a: unknown[]) => {
    const id: number = st(() => { live.delete(id); if (typeof h === 'function') h(...a); }, ms);
    live.add(id);
    return id;
  }) as typeof window.setTimeout;
  window.setInterval = ((h: TimerHandler, ms?: number, ...a: unknown[]) => {
    const id: number = si(h, ms, ...a);
    live.add(id);
    return id;
  }) as typeof window.setInterval;
  window.clearTimeout = ((id?: number) => { if (id !== undefined) live.delete(id); ct(id); }) as typeof window.clearTimeout;
  window.clearInterval = ((id?: number) => { if (id !== undefined) live.delete(id); ci(id); }) as typeof window.clearInterval;

  const reg = new Map<EventTarget, Set<string>>();
  const add = EventTarget.prototype.addEventListener;
  const rem = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (this: EventTarget, type: string, l: EventListenerOrEventListenerObject | null, o?: boolean | AddEventListenerOptions): void {
    if (l) {
      const set = reg.get(this) ?? new Set<string>();
      set.add(`${type}#${String(capture(o))}#${idOf(l)}`);
      reg.set(this, set);
    }
    add.call(this, type, l, o);
  };
  EventTarget.prototype.removeEventListener = function (this: EventTarget, type: string, l: EventListenerOrEventListenerObject | null, o?: boolean | AddEventListenerOptions): void {
    if (l) reg.get(this)?.delete(`${type}#${String(capture(o))}#${idOf(l)}`);
    rem.call(this, type, l, o);
  };
  return () => {
    let listeners = 0;
    for (const s of reg.values()) listeners += s.size;
    return { timers: live.size, nodes: document.getElementsByTagName('*').length, listeners };
  };
}
