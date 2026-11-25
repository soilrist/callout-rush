/** Result-screen letter pad layout and finding the pressed key (docs/reference/result.md). Stage coordinates 1920×1080. */
export type PadKey = string | 'BACK' | 'OK';

export const PAD = { x: 984, y: 640, cell: 84, pitch: 96, cols: 9 } as const;
export const OK_BOX = { x: 280, y: 840, w: 400, h: 100 } as const;
export const SLOT = { x: 280, y: 664, w: 120, h: 140, pitch: 140 } as const;

/** Row 1 A–I, row 2 J–R, row 3 S–Z + ⌫ */
export const PAD_KEYS: readonly PadKey[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'BACK'];

export function padCell(i: number): { x: number; y: number } {
  return { x: PAD.x + PAD.pitch * (i % PAD.cols), y: PAD.y + PAD.pitch * Math.floor(i / PAD.cols) };
}

export function keyAt(x: number, y: number): PadKey | null {
  if (x >= OK_BOX.x && x < OK_BOX.x + OK_BOX.w && y >= OK_BOX.y && y < OK_BOX.y + OK_BOX.h) return 'OK';
  for (let i = 0; i < PAD_KEYS.length; i++) {
    const c = padCell(i);
    if (x >= c.x && x < c.x + PAD.cell && y >= c.y && y < c.y + PAD.cell) return PAD_KEYS[i] ?? null;
  }
  return null;
}
