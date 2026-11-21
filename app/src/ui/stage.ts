/** 1920×1080 논리 무대를 창에 비율 유지로 맞추고, 화면↔무대 좌표를 바꾸는 순수 함수. */

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export interface StageFit {
  /** 무대 1 논리 px 가 화면(CSS) 몇 px 인가 */
  scale: number;
  /** 무대 왼쪽 위 모서리의 화면(CSS) 좌표 */
  offsetX: number;
  offsetY: number;
  /** 무대가 화면에서 차지하는 CSS 크기 */
  width: number;
  height: number;
  /** 캔버스 백버퍼 픽셀 크기(기기 픽셀비 반영) */
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

/** 무대 안(경계 포함)인가 */
export function insideStage(p: Point): boolean {
  return p.x >= 0 && p.x <= STAGE_W && p.y >= 0 && p.y <= STAGE_H;
}
