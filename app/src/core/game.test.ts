import { describe, expect, it } from 'vitest';
import { CALL_GAP_MS, COUNTDOWN_MS, GAME_MS, PHASES, WRONG_REVEAL_MS } from './config';
import { initGame, phaseAt, step, type GameEvent, type GameState } from './game';
import { ZONES, type ZoneId } from './zones';

const T0 = 1000; // test start clock
const PLAY = T0 + COUNTDOWN_MS; // play start time

function center(id: ZoneId): { x: number; y: number } {
  const z = ZONES.find((zone) => zone.id === id);
  if (!z) throw new Error(id);
  return { x: z.x + z.w / 2, y: z.y + z.h / 2 };
}
function tick(s: GameState, now: number): GameState {
  return step(s, { type: 'TICK', now });
}
function click(s: GameState, id: ZoneId, now: number): GameState {
  const c = center(id);
  return step(s, { type: 'CLICK', x: c.x, y: c.y, now });
}
/** State after the countdown, with the first call shown (the call appears at PLAY time) */
function started(seed = 1): GameState {
  return tick(tick(initGame(seed), T0), PLAY);
}
function other(id: ZoneId): ZoneId {
  return ZONES.find((z) => z.id !== id)?.id ?? 'Z01';
}
function activeOf(s: GameState) {
  if (!s.active) throw new Error('no call');
  return s.active;
}
/** Starts with changing seeds until a one-zone call appears */
function startedOneZone(): GameState {
  for (let seed = 1; seed < 100; seed++) {
    const s = started(seed);
    if (activeOf(s).call.zones.length === 1) return s;
  }
  throw new Error('no one-zone call seed');
}
/** State with a two-zone call in stage 3. now = the time the call appeared */
function twoZoneState(): { s: GameState; now: number } {
  const now = PLAY + 41000;
  for (let seed = 1; seed < 200; seed++) {
    // expire the first call as too slow (now), then show a stage 3 call after the gap (now + 1000)
    const s = tick(tick(tick(tick(initGame(seed), T0), PLAY), now), now + 1000);
    if (s.active && s.active.call.zones.length === 2) return { s, now: now + 1000 };
  }
  throw new Error('no two-zone call seed');
}

describe('start and countdown', () => {
  it('during the countdown there is no call and clicks are ignored', () => {
    let s = tick(initGame(1), T0);
    expect(s.status).toBe('countdown');
    s = click(s, 'Z01', T0 + 1000);
    expect(s.active).toBeNull();
    expect(s.finished).toBe(0);
    s = tick(s, PLAY - 1);
    expect(s.status).toBe('countdown');
  });

  it('on the TICK where the countdown ends it becomes play and the first call appears', () => {
    const s = started();
    expect(s.status).toBe('play');
    expect(s.active?.stepStartMs).toBe(PLAY);
    expect(s.active?.limitMs).toBe(PHASES[0]?.limitMs);
  });
});

describe('call judging (§4.2)', () => {
  it('right answer: score, streak and hit count go up and the reaction time is recorded', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    const id = a.call.zones[0] as ZoneId;
    s = click(s, id, a.stepStartMs + 300);
    expect(s.hit).toBe(1);
    expect(s.finished).toBe(1);
    expect(s.streak).toBe(1);
    expect(s.rts).toEqual([300]);
    expect(s.last?.kind).toBe('hit');
    expect(s.score).toBeGreaterThan(0);
    expect(s.score).toBe(s.last?.points);
    expect(s.active).toBeNull();
  });

  it('wrong answer (other zone): 0 points, streak 0, right zone revealed for 0.6 s', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    const id = a.call.zones[0] as ZoneId;
    s = click(s, id, a.stepStartMs + 400); // streak 1
    s = tick(s, a.stepStartMs + 400 + CALL_GAP_MS);
    const b = activeOf(s);
    const before = s.score;
    const wrongZone = other(b.call.zones[0] as ZoneId);
    const now = s.gapUntilMs + 500;
    s = click(s, wrongZone, now);
    expect(s.score).toBe(before);
    expect(s.streak).toBe(0);
    expect(s.finished).toBe(b.call.zones.length === 1 ? 2 : 3);
    expect(s.last?.kind).toBe('wrong');
    expect(s.last?.revealZones).toEqual(b.call.zones);
    expect(s.last?.revealUntil).toBe(now + WRONG_REVEAL_MS);
  });

  it('a click on empty ground is also wrong (stops random tapping)', () => {
    let s = startedOneZone();
    s = step(s, { type: 'CLICK', x: 5, y: 5, now: PLAY + 500 });
    expect(s.last?.kind).toBe('wrong');
    expect(s.finished).toBe(1);
  });

  it('timeout: past the time limit it ends as TOO SLOW and the streak becomes 0', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    s = tick(s, a.stepStartMs + a.limitMs - 1);
    expect(s.active).not.toBeNull();
    s = tick(s, a.stepStartMs + a.limitMs);
    expect(s.last?.kind).toBe('slow');
    expect(s.streak).toBe(0);
    expect(s.finished).toBe(1);
    expect(s.hit).toBe(0);
    expect(s.active).toBeNull();
  });

  it('a click after the time limit is a timeout even in the right zone', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    s = click(s, a.call.zones[0] as ZoneId, a.stepStartMs + a.limitMs + 50);
    expect(s.last?.kind).toBe('slow');
    expect(s.hit).toBe(0);
  });

  it('clicks during CALL_GAP_MS right after judging are ignored, the next call comes on the TICK after', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    const t = a.stepStartMs + 500;
    s = click(s, a.call.zones[0] as ZoneId, t);
    const snap = s.finished;
    s = click(s, 'Z01', t + CALL_GAP_MS - 1);
    expect(s.finished).toBe(snap);
    s = tick(s, t + CALL_GAP_MS - 1);
    expect(s.active).toBeNull();
    s = tick(s, t + CALL_GAP_MS);
    expect(s.active).not.toBeNull();
    expect(s.active?.stepStartMs).toBe(t + CALL_GAP_MS);
  });

  it('even after the gap ends, a click before the TICK shows the call is not a wrong answer for the new call', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    const t = a.stepStartMs + 500;
    s = click(s, a.call.zones[0] as ZoneId, t);
    const snap = s.finished;
    s = click(s, 'Z01', t + CALL_GAP_MS + 100);
    expect(s.finished).toBe(snap);
    expect(s.active).toBeNull();
  });
});

describe('two-zone call', () => {
  it('hitting the first zone then the second scores each, and the second reaction is timed from the first click', () => {
    const { s: s0, now } = twoZoneState();
    const [first, second] = activeOf(s0).call.zones as [ZoneId, ZoneId];
    let s = click(s0, first, now + 400);
    expect(s.active?.step).toBe(1);
    expect(s.hit).toBe(1);
    expect(s.finished).toBe(s0.finished + 1);
    s = click(s, second, now + 400 + 700);
    expect(s.hit).toBe(2);
    expect(s.finished).toBe(s0.finished + 2);
    expect(s.rts).toEqual([400, 700]);
    expect(s.streak).toBe(2);
    expect(s.active).toBeNull();
  });

  it('if the order is swapped (second first), both targets fail', () => {
    const { s: s0, now } = twoZoneState();
    const [first, second] = activeOf(s0).call.zones as [ZoneId, ZoneId];
    const s = click(s0, second, now + 300);
    expect(first).not.toBe(second);
    expect(s.last?.kind).toBe('wrong');
    expect(s.finished).toBe(s0.finished + 2);
    expect(s.hit).toBe(0);
    expect(s.last?.revealZones).toEqual([first, second]);
  });

  it('if the second is wrong, the first score stays and only the second fails, streak 0', () => {
    const { s: s0, now } = twoZoneState();
    const [first, second] = activeOf(s0).call.zones as [ZoneId, ZoneId];
    let s = click(s0, first, now + 300);
    const gained = s.score;
    s = click(s, other(second), now + 600);
    expect(s.score).toBe(gained);
    expect(s.hit).toBe(1);
    expect(s.finished).toBe(s0.finished + 2);
    expect(s.streak).toBe(0);
    expect(s.last?.revealZones).toEqual([second]);
  });

  it('if the second times out, only the second fails', () => {
    const { s: s0, now } = twoZoneState();
    const [first] = activeOf(s0).call.zones as [ZoneId, ZoneId];
    let s = click(s0, first, now + 300);
    const a = activeOf(s);
    s = tick(s, a.stepStartMs + a.limitMs);
    expect(s.last?.kind).toBe('slow');
    expect(s.hit).toBe(1);
    expect(s.finished).toBe(s0.finished + 2);
  });
});

describe('stages and end', () => {
  it('the stage number changes at the range edges', () => {
    expect(phaseAt(0)).toBe(1);
    expect(phaseAt(14999)).toBe(1);
    expect(phaseAt(15000)).toBe(2);
    expect(phaseAt(39999)).toBe(2);
    expect(phaseAt(40000)).toBe(3);
    expect(phaseAt(59999)).toBe(3);
  });

  it('a call already shown keeps its original time limit when the stage changes', () => {
    let s = started(3);
    const a = activeOf(s);
    // show a call just before the end of stage 1: first send the current call out as too slow, then show again just before 15 s
    s = tick(s, a.stepStartMs + a.limitMs);
    s = tick(s, PLAY + 14900);
    const b = activeOf(s);
    expect(b.limitMs).toBe(PHASES[0]?.limitMs);
    s = tick(s, PLAY + 15100);
    expect(s.active?.limitMs).toBe(PHASES[0]?.limitMs);
  });

  it('at 60 s it is done, and a call still shown is neither a score nor a failure', () => {
    let s = startedOneZone();
    // show the last call at 59.9 s
    const a = activeOf(s);
    s = tick(s, a.stepStartMs + a.limitMs);
    s = tick(s, PLAY + GAME_MS - 100);
    expect(s.active).not.toBeNull();
    const finished = s.finished;
    s = tick(s, PLAY + GAME_MS);
    expect(s.status).toBe('done');
    expect(s.active).toBeNull();
    expect(s.finished).toBe(finished);
  });

  it('clicks and TICKs after the end do not change the state', () => {
    let s = startedOneZone();
    s = tick(s, PLAY + GAME_MS);
    const score = s.score;
    const after = click(s, 'Z01', PLAY + GAME_MS + 10);
    expect(after.score).toBe(score);
    expect(after.finished).toBe(s.finished);
    expect(tick(after, PLAY + GAME_MS + 5000)).toBe(after);
  });
});

describe('determinism', () => {
  /** Replays the same event list from the start and returns the final state (without the random function) */
  function run(seed: number): Omit<GameState, 'rng'> {
    let s = initGame(seed);
    const events: GameEvent[] = [];
    for (let t = T0; t <= PLAY + GAME_MS + 100; t += 100) {
      events.push({ type: 'TICK', now: t });
      if (t % 700 === 0) events.push({ type: 'CLICK', x: 500, y: 250, now: t });
      const c = ZONES[(t / 100) % ZONES.length];
      if (c && t % 300 === 0) events.push({ type: 'CLICK', x: c.x + 5, y: c.y + 5, now: t });
    }
    for (const e of events) s = step(s, e);
    const { rng: _rng, ...rest } = s;
    void _rng;
    return rest;
  }

  it('same seed and input give the same final state, a different seed gives a different one', () => {
    const a = run(7);
    expect(a.status).toBe('done');
    expect(run(7)).toEqual(a);
    expect(run(8)).not.toEqual(a);
  });
});
