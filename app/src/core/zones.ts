/** The 12 zones of the Freight Yard map (DESIGN §5.1). Coordinates are in map units 1000×1000, top left is 0,0. */

export type ZoneId =
  | 'Z01' | 'Z02' | 'Z03' | 'Z04' | 'Z05' | 'Z06'
  | 'Z07' | 'Z08' | 'Z09' | 'Z10' | 'Z11' | 'Z12';

export interface Zone {
  id: ZoneId;
  /** Name used in the call sentence */
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ZONES: readonly Zone[] = [
  { id: 'Z01', name: 'North Stairs', x: 420, y: 40, w: 160, h: 140 },
  { id: 'Z02', name: 'Roof', x: 120, y: 60, w: 220, h: 200 },
  { id: 'Z03', name: 'Office', x: 660, y: 60, w: 240, h: 180 },
  { id: 'Z04', name: 'Crane', x: 430, y: 260, w: 180, h: 180 },
  { id: 'Z05', name: 'Loading Dock', x: 660, y: 300, w: 240, h: 200 },
  { id: 'Z06', name: 'Container Row', x: 180, y: 330, w: 200, h: 340 },
  { id: 'Z07', name: 'West Gate', x: 20, y: 400, w: 110, h: 200 },
  { id: 'Z08', name: 'Tunnel', x: 430, y: 500, w: 180, h: 160 },
  { id: 'Z09', name: 'East Gate', x: 870, y: 540, w: 110, h: 200 },
  { id: 'Z10', name: 'Workshop', x: 120, y: 720, w: 240, h: 220 },
  { id: 'Z11', name: 'Fuel Tanks', x: 660, y: 720, w: 180, h: 220 },
  { id: 'Z12', name: 'South Stairs', x: 420, y: 800, w: 160, h: 140 },
];

/** The zone that contains map point (x, y). null for empty ground or outside the map. The left and top edges are included, the right and bottom are excluded. */
export function zoneAt(x: number, y: number): Zone | null {
  for (const z of ZONES) {
    if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) return z;
  }
  return null;
}
