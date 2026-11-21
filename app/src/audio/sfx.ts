/** §5.5 효과음 여덟 가지. 전부 WebAudio 합성(파일 0개). 이 파일은 다른 모듈을 가져오지 않는다(브라우저 렌더 시험이 단독으로 불러온다). */
export type SfxId = 'radio' | 'hit' | 'miss' | 'count' | 'phase' | 'end' | 'rank' | 'ui';

export interface SfxOpts {
  /** hit: 지금 연속 정답 수 — 1마다 반음 올림, 최대 +12 */
  streak?: number;
  /** count: 시작 신호(990Hz 250ms) */
  go?: boolean;
}

/** 표의 소리 길이(ms). count 는 삑 하나, 시작 신호는 250 */
export const SFX_MS: Record<SfxId, number> = {
  radio: 160, hit: 80, miss: 180, count: 90, phase: 200, end: 600, rank: 330, ui: 25,
};

const PEAK = 0.3;

/** 한 음: 시작 t, 길이 dur 초, 끝에서 0 으로 줄어든다(hold = 앞에서 그대로 두는 비율). */
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

/** 대역 통과 흰 소음 */
function noise(ctx: BaseAudioContext, out: AudioNode, hz: number, t: number, dur: number): void {
  const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let s = 12345; // 고정 씨앗 — 같은 소리가 나오게
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

/** 소리 하나를 시각 t(초)부터 예약한다. 끝나는 시각(초)을 돌려준다. */
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
  /** 첫 클릭 같은 사용자 동작 안에서 부른다. 한 번만 만들고 멈춘 상태면 다시 깨운다. */
  unlock(): void;
  play(id: SfxId, opts?: SfxOpts): void;
  setMuted(m: boolean): void;
  isMuted(): boolean;
}

/** 소리 관리자. AudioContext 는 unlock() 때 처음 만든다(브라우저 규칙). 음소거면 아무것도 예약하지 않는다. */
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
      if (muted || !ctx || ctx.state !== 'running') return;
      scheduleSfx(ctx, ctx.destination, id, ctx.currentTime + 0.005, opts);
    },
    setMuted(m) { muted = m; },
    isMuted() { return muted; },
  };
}
