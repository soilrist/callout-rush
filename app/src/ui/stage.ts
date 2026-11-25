/** Fits the 1920×1080 logical stage to the window keeping the ratio, and pure functions that convert screen ↔ stage coordinates. */

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export interface StageFit {
  /** How many screen (CSS) px one logical stage px is */
  scale: number;
  /** Screen (CSS) coordinate of the stage top-left corner */
  offsetX: number;
  offsetY: number;
  /** CSS size the stage takes on screen */
  width: number;
  height: number;
  /** Canvas backbuffer pixel size (with the device pixel ratio) */
  pixelWidth: number;
  pixelHeight: number;
}

export interface Point {
  x: number;
  y: number;
}

export function fitStage(winW: number, winH: number, dpr: number): StageFit {
  const scale = Math.min(winW / STAGE_W, winH / STAGE_H);
  const width = STAGE_W * scale;
  const height = STAGE_H * scale;
  return {
    scale,
    offsetX: (winW - width) / 2,
    offsetY: (winH - height) / 2,
    width,
    height,
    pixelWidth: Math.round(width * dpr),
    pixelHeight: Math.round(height * dpr),
  };
}

export function screenToStage(fit: StageFit, sx: number, sy: number): Point {
  return { x: (sx - fit.offsetX) / fit.scale, y: (sy - fit.offsetY) / fit.scale };
}

export function stageToScreen(fit: StageFit, x: number, y: number): Point {
  return { x: x * fit.scale + fit.offsetX, y: y * fit.scale + fit.offsetY };
}

/** Inside the stage (edges included)? */
export function insideStage(p: Point): boolean {
  return p.x >= 0 && p.x <= STAGE_W && p.y >= 0 && p.y <= STAGE_H;
}
