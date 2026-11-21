import { describe, expect, it } from 'vitest';
import { CALL_GAP_MS, COUNTDOWN_MS, GAME_MS, PHASES, WRONG_REVEAL_MS } from './config';
import { initGame, phaseAt, step, type GameEvent, type GameState } from './game';
import { ZONES, type ZoneId } from './zones';

const T0 = 1000; // 테스트용 시작 시계
const PLAY = T0 + COUNTDOWN_MS; // 플레이 시작 시각

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
/** 카운트다운을 넘기고 첫 콜을 띄운 상태 (콜은 PLAY 시각에 뜬다) */
function started(seed = 1): GameState {
  return tick(tick(initGame(seed), T0), PLAY);
}
function other(id: ZoneId): ZoneId {
  return ZONES.find((z) => z.id !== id)?.id ?? 'Z01';
}
function activeOf(s: GameState) {
  if (!s.active) throw new Error('콜이 없다');
  return s.active;
}
/** 한 곳 콜이 뜰 때까지 시드를 바꿔 가며 시작한다 */
function startedOneZone(): GameState {
  for (let seed = 1; seed < 100; seed++) {
    const s = started(seed);
    if (activeOf(s).call.zones.length === 1) return s;
  }
  throw new Error('한 곳 콜 시드 없음');
}
/** 단계 3 에서 두 곳 콜이 뜬 상태. now = 콜이 뜬 시각 */
function twoZoneState(): { s: GameState; now: number } {
  const now = PLAY + 41000;
  for (let seed = 1; seed < 200; seed++) {
    // 첫 콜은 시간 초과로 보내고(now), 간격 뒤(now + 1000) 단계 3 콜을 띄운다
    const s = tick(tick(tick(tick(initGame(seed), T0), PLAY), now), now + 1000);
    if (s.active && s.active.call.zones.length === 2) return { s, now: now + 1000 };
  }
  throw new Error('두 곳 콜 시드 없음');
}

describe('시작·카운트다운', () => {
  it('카운트다운 동안은 콜이 없고 클릭은 무시된다', () => {
    let s = tick(initGame(1), T0);
    expect(s.status).toBe('countdown');
    s = click(s, 'Z01', T0 + 1000);
    expect(s.active).toBeNull();
    expect(s.finished).toBe(0);
    s = tick(s, PLAY - 1);
    expect(s.status).toBe('countdown');
  });

  it('카운트다운이 끝나는 TICK 에 play 로 바뀌고 첫 콜이 뜬다', () => {
    const s = started();
    expect(s.status).toBe('play');
    expect(s.active?.stepStartMs).toBe(PLAY);
    expect(s.active?.limitMs).toBe(PHASES[0]?.limitMs);
  });
});

describe('콜 판정 (§4.2)', () => {
  it('정답: 점수·연속·맞힌 수가 오르고 반응 시간이 기록된다', () => {
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

  it('오답(다른 구역): 0점, 연속 0, 정답 구역 0.6초 공개', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    const id = a.call.zones[0] as ZoneId;
    s = click(s, id, a.stepStartMs + 400); // 연속 1
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

  it('빈 땅 클릭도 오답 (막 찍기 방지)', () => {
    let s = startedOneZone();
    s = step(s, { type: 'CLICK', x: 5, y: 5, now: PLAY + 500 });
    expect(s.last?.kind).toBe('wrong');
    expect(s.finished).toBe(1);
  });

  it('시간 초과: 제한 시간이 지나면 TOO SLOW 로 끝나고 연속이 0 이 된다', () => {
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

  it('제한 시간 뒤에 온 클릭은 정답 구역이어도 시간 초과', () => {
    let s = startedOneZone();
    const a = activeOf(s);
    s = click(s, a.call.zones[0] as ZoneId, a.stepStartMs + a.limitMs + 50);
    expect(s.last?.kind).toBe('slow');
    expect(s.hit).toBe(0);
  });

  it('판정 직후 CALL_GAP_MS 동안의 클릭은 무시, 그 뒤 TICK 에 다음 콜', () => {
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

  it('간격이 끝났어도 TICK 이 콜을 띄우기 전의 클릭은 새 콜의 오답이 되지 않는다', () => {
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

describe('두 곳 콜', () => {
  it('첫 구역 → 둘째 구역 순서로 맞히면 각각 점수, 둘째 반응은 첫 클릭부터 잰다', () => {
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

  it('순서가 바뀌면(둘째를 먼저) 목표 2개 모두 실패', () => {
    const { s: s0, now } = twoZoneState();
    const [first, second] = activeOf(s0).call.zones as [ZoneId, ZoneId];
    const s = click(s0, second, now + 300);
    expect(first).not.toBe(second);
    expect(s.last?.kind).toBe('wrong');
    expect(s.finished).toBe(s0.finished + 2);
    expect(s.hit).toBe(0);
    expect(s.last?.revealZones).toEqual([first, second]);
  });

  it('둘째를 틀리면 첫째 점수는 남고 둘째만 실패, 연속 0', () => {
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

  it('둘째가 시간 초과면 둘째만 실패', () => {
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

describe('단계·끝', () => {
  it('단계 번호가 구간 경계에서 바뀐다', () => {
    expect(phaseAt(0)).toBe(1);
    expect(phaseAt(14999)).toBe(1);
    expect(phaseAt(15000)).toBe(2);
    expect(phaseAt(39999)).toBe(2);
    expect(phaseAt(40000)).toBe(3);
    expect(phaseAt(59999)).toBe(3);
  });

  it('단계가 바뀌어도 떠 있던 콜은 원래 제한 시간 그대로', () => {
    let s = started(3);
    const a = activeOf(s);
    // 단계 1 끝 직전에 콜을 하나 띄운다: 먼저 현재 콜을 시간 초과로 보내고 15초 직전에 다시
    s = tick(s, a.stepStartMs + a.limitMs);
    s = tick(s, PLAY + 14900);
    const b = activeOf(s);
    expect(b.limitMs).toBe(PHASES[0]?.limitMs);
    s = tick(s, PLAY + 15100);
    expect(s.active?.limitMs).toBe(PHASES[0]?.limitMs);
  });

  it('60초가 되면 done, 떠 있던 콜은 점수도 실패도 아니다', () => {
    let s = startedOneZone();
    // 마지막 콜을 59.9초에 띄운다
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

  it('끝난 뒤의 클릭·TICK 은 상태를 바꾸지 않는다', () => {
    let s = startedOneZone();
    s = tick(s, PLAY + GAME_MS);
    const score = s.score;
    const after = click(s, 'Z01', PLAY + GAME_MS + 10);
    expect(after.score).toBe(score);
    expect(after.finished).toBe(s.finished);
    expect(tick(after, PLAY + GAME_MS + 5000)).toBe(after);
  });
});

describe('결정성', () => {
  /** 같은 이벤트 줄을 처음부터 흘려 최종 상태(난수 함수 빼고)를 돌려준다 */
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

  it('같은 시드·같은 입력이면 최종 상태가 같고, 시드가 다르면 달라진다', () => {
    const a = run(7);
    expect(a.status).toBe('done');
    expect(run(7)).toEqual(a);
    expect(run(8)).not.toEqual(a);
  });
});
