import { describe, expect, it } from 'vitest';
import { SFX_MS, scheduleSfx, type SfxId } from './sfx';

/** 가짜 오디오 컨텍스트: 만든 노드 수와 발진기 주파수를 센다 */
function fakeCtx() {
  const oscFreq: number[] = [];
  let nodes = 0;
  const param = (init = 0) => ({ value: init, setValueAtTime: (...a: number[]): void => { void a; }, linearRampToValueAtTime: () => undefined });
  const node = () => { nodes++; return { connect: () => undefined, disconnect: () => undefined, start: () => undefined, stop: () => undefined, onended: null as null | (() => void) }; };
  const ctx = {
    sampleRate: 8000,
    createOscillator() { const n = { ...node(), type: '', frequency: param() }; const f = n.frequency; f.setValueAtTime = (...a: number[]): void => { oscFreq.push(a[0] ?? 0); }; return n; },
    createGain() { return { ...node(), gain: param() }; },
    createBiquadFilter() { return { ...node(), type: '', frequency: param(), Q: param() }; },
    createBuffer(_c: number, n: number) { return { getChannelData: () => new Float32Array(n) }; },
    createBufferSource() { return { ...node(), buffer: null }; },
  };
  return { ctx: ctx as unknown as BaseAudioContext, oscFreq, count: () => nodes };
}

const IDS = Object.keys(SFX_MS) as SfxId[];

describe('scheduleSfx', () => {
  it('여덟 소리 모두 오류 없이 예약되고 끝 시각이 표 길이와 같다', () => {
    for (const id of IDS) {
      const f = fakeCtx();
      const end = scheduleSfx(f.ctx, {} as AudioNode, id, 1);
      expect(f.count(), id).toBeGreaterThan(0);
      expect(Math.round((end - 1) * 1000), id).toBe(SFX_MS[id]);
    }
  });
  it('hit 은 연속 1마다 반음 올라가고 +12 에서 멈춘다', () => {
    const base = (s: number) => { const f = fakeCtx(); scheduleSfx(f.ctx, {} as AudioNode, 'hit', 0, { streak: s }); return f.oscFreq[0] ?? 0; };
    expect(base(1)).toBeCloseTo(880);
    expect(base(2)).toBeCloseTo(880 * 2 ** (1 / 12));
    expect(base(13)).toBeCloseTo(1760);
    expect(base(40)).toBeCloseTo(1760);
  });
  it('count 시작 신호는 990Hz 250ms', () => {
    const f = fakeCtx();
    const end = scheduleSfx(f.ctx, {} as AudioNode, 'count', 0, { go: true });
    expect(end).toBeCloseTo(0.25);
    expect(f.oscFreq[0]).toBe(990);
  });
});
