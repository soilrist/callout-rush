import { describe, expect, it } from 'vitest';
import { fitStage, insideStage, screenToStage, stageToScreen, STAGE_H, STAGE_W } from './stage';

const windows: [number, number][] = [
  [1280, 720],
  [1920, 1080],
  [2560, 1080],
];
const corners: [number, number][] = [
  [0, 0],
  [STAGE_W, 0],
  [0, STAGE_H],
  [STAGE_W, STAGE_H],
];

describe('stage', () => {
  for (const [w, h] of windows) {
    it(`${w}x${h}: corner round-trip error ≤ 1px`, () => {
      const fit = fitStage(w, h, 2);
      for (const [x, y] of corners) {
        const s = stageToScreen(fit, x, y);
        const back = screenToStage(fit, s.x, s.y);
        expect(Math.abs(back.x - x)).toBeLessThanOrEqual(1);
        expect(Math.abs(back.y - y)).toBeLessThanOrEqual(1);
      }
    });
  }

  it('keeps the ratio: 2560x1080 has side margins, the stage is centered', () => {
    const fit = fitStage(2560, 1080, 1);
    expect(fit.scale).toBe(1);
    expect(fit.offsetX).toBe(320);
    expect(fit.offsetY).toBe(0);
  });

  it('the device pixel ratio is reflected in the back buffer size', () => {
    const fit = fitStage(1280, 720, 2);
    expect(fit.pixelWidth).toBe(2560);
    expect(fit.pixelHeight).toBe(1440);
  });

  it('outside-the-stage check', () => {
    const fit = fitStage(2560, 1080, 1);
    expect(insideStage(screenToStage(fit, 10, 10))).toBe(false);
    expect(insideStage(screenToStage(fit, 1280, 540))).toBe(true);
  });
});
