/** §5.5 The eight sound effects. All are synthesized with WebAudio (0 files). This file imports no other module (the browser render test loads it on its own). */
export type SfxId = 'radio' | 'hit' | 'miss' | 'count' | 'phase' | 'end' | 'rank' | 'ui';

export interface SfxOpts {
  /** hit: current streak of correct answers — up one semitone per step, max +12 */
  streak?: number;
  /** count: start signal (990Hz 250ms) */
  go?: boolean;
}

/** Sound lengths from the table (ms). count is one beep; the start signal is 250 */
export const SFX_MS: Record<SfxId, number> = {
  radio: 160, hit: 80, miss: 180, count: 90, phase: 200, end: 600, rank: 330, ui: 25,
};

const PEAK = 0.3;

/** One note: start t, length dur seconds, fades to 0 at the end (hold = share of the length kept flat at the start). */
function tone(ctx: BaseAudioContext, out: AudioNode, type: OscillatorType, f0: number, f1: number, t: number, dur: number, hold: number): void {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) osc.frequency.linearRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(PEAK, t + 0.002);
  g.gain.setValueAtTime(PEAK, t + Math.max(0.002, dur * hold));
  g.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(g);
  g.connect(out);
  osc.start(t);
  osc.stop(t + dur);
  osc.onended = () => { osc.disconnect(); g.disconnect(); };
}

/** Band-pass white noise */
function noise(ctx: BaseAudioContext, out: AudioNode, hz: number, t: number, dur: number): void {
  const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let s = 12345; // fixed seed — so the same sound comes out every time
  for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = (s / 0x80000000) - 1; }
  const src = ctx.createBufferSource();
  const bp = ctx.createBiquadFilter();
  const g = ctx.createGain();
  src.buffer = buf;
  bp.type = 'bandpass';
  bp.frequency.value = hz;
  bp.Q.value = 1;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(PEAK * 2, t + 0.002);
  g.gain.setValueAtTime(PEAK * 2, t + dur - 0.002);
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(out);
  src.start(t);
  src.onended = () => { src.disconnect(); bp.disconnect(); g.disconnect(); };
}

/** Schedules one sound from time t (seconds). Returns the end time (seconds). */
export function scheduleSfx(ctx: BaseAudioContext, out: AudioNode, id: SfxId, t: number, opts: SfxOpts = {}): number {
  switch (id) {
    case 'radio':
      noise(ctx, out, 1800, t, 0.12);
      tone(ctx, out, 'sine', 1200, 1200, t + 0.12, 0.04, 0.6);
      return t + 0.16;
    case 'hit': {
      const k = Math.min(12, Math.max(0, Math.floor(opts.streak ?? 1) - 1));
      const r = 2 ** (k / 12);
      tone(ctx, out, 'square', 880 * r, 1320 * r, t, 0.08, 0.6);
      return t + 0.08;
    }
    case 'miss':
      tone(ctx, out, 'sawtooth', 140, 90, t, 0.18, 0.2);
      return t + 0.18;
    case 'count': {
      const dur = opts.go ? 0.25 : 0.09;
      tone(ctx, out, 'sine', opts.go ? 990 : 660, opts.go ? 990 : 660, t, dur, 0.7);
      return t + dur;
    }
    case 'phase':
      tone(ctx, out, 'sine', 520, 520, t, 0.1, 0.7);
      tone(ctx, out, 'sine', 780, 780, t + 0.1, 0.1, 0.7);
      return t + 0.2;
    case 'end':
      tone(ctx, out, 'square', 330, 330, t, 0.6, 0.3);
      return t + 0.6;
    case 'rank':
      [523, 659, 784].forEach((f, i) => tone(ctx, out, 'sine', f, f, t + i * 0.11, 0.11, 0.7));
      return t + 0.33;
    case 'ui':
      tone(ctx, out, 'sine', 1000, 1000, t, 0.025, 0.6);
      return t + 0.025;
  }
}

export interface Sfx {
  /** Call this inside a user action such as the first click. Creates the context once, and wakes it again if it is suspended. */
  unlock(): void;
  play(id: SfxId, opts?: SfxOpts): void;
  setMuted(m: boolean): void;
  isMuted(): boolean;
}

/** Sound manager. The AudioContext is created on the first unlock() (browser rule). When muted, nothing is scheduled. */
export function createSfx(): Sfx {
  let ctx: AudioContext | null = null;
  let muted = false;
  return {
    unlock() {
      if (typeof AudioContext === 'undefined') return;
      ctx ??= new AudioContext();
      if (ctx.state === 'suspended') void ctx.resume();
    },
    play(id, opts) {
      if (muted) return;
      // Only when a recording tool has attached window.__sfxLog do we log. If not, nothing happens. We record the call time even if sound cannot really play.
      (globalThis as { __sfxLog?: { push(e: { ms: number; id: SfxId; opts?: SfxOpts }): void } }).__sfxLog?.push({ ms: Date.now(), id, opts });
      if (!ctx || ctx.state !== 'running') return;
      scheduleSfx(ctx, ctx.destination, id, ctx.currentTime + 0.005, opts);
    },
    setMuted(m) { muted = m; },
    isMuted() { return muted; },
  };
}
