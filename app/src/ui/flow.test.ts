import { describe, expect, it } from 'vitest';
import { COUNTDOWN_MS, GAME_MS, RESULT_BOARD_S, RESULT_IDLE_S } from '../core/config';
import { profileByName } from '../core/bot';
import { mulberry32 } from '../core/rng';
import { flowKey, flowClick, flowTick, initFlow, botFrame, type BotPlan, type Flow } from './flow';

describe('화면 흐름', () => {
  it('attract 에서 누르면 카운트다운 → 플레이 → 결과 → attract', () => {
    let f = initFlow(1, 0);
    expect(f.screen).toBe('attract');
    f = flowClick(f, 0, 0, 100, 1);
    expect(f.screen).toBe('play');
    expect(f.game.status).toBe('countdown');
    f = flowTick(f, 100 + COUNTDOWN_MS + 10);
    expect(f.game.status).toBe('play');
    f = flowTick(f, 100 + COUNTDOWN_MS + GAME_MS + 10);
    expect(f.screen).toBe('result');
    expect(f.results).toBe(1);
    f = flowTick(f, f.lastInput + RESULT_IDLE_S * 1000);
    expect(f.screen).toBe('board');
    expect(f.saved?.name).toBe('---');
    f = flowTick(f, f.since + RESULT_BOARD_S * 1000 - 1);
    expect(f.screen).toBe('board');
    f = flowTick(f, f.since + RESULT_BOARD_S * 1000);
    expect(f.screen).toBe('attract');
  });
  it('새 판은 지난 판 값을 물려받지 않는다', () => {
    let f = initFlow(1, 0);
    f = { ...f, game: { ...f.game, score: 999, streak: 5 } };
    f = flowClick(f, 0, 0, 10, 2);
    expect(f.game.score).toBe(0);
    expect(f.game.streak).toBe(0);
  });
  it('결과 화면: 0.6초 안의 입력은 무시, 3글자 + OK 로 저장하고 board', () => {
    let f: Flow = { ...initFlow(1, 0), screen: 'result', since: 1000, lastInput: 1000 };
    f = flowKey(f, 'A', 1300);
    expect(f.initials).toBe('');
    for (const k of ['Z', 'E', 'D', 'X']) f = flowKey(f, k, 2000);
    expect(f.initials).toBe('ZED');
    f = flowKey(f, 'BACK', 2100);
    f = flowKey(f, 'OK', 2200);
    expect(f.screen).toBe('result'); // 2글자는 OK 가 안 눌린다
    f = flowKey(f, 'D', 2300);
    f = flowKey(f, 'OK', 2400);
    expect(f.screen).toBe('board');
    expect(f.saved?.name).toBe('ZED');
    expect(f.saves).toBe(1);
  });
  it('금지 이니셜은 ***, 결과 화면 누름(flowClick)은 아무 일도 안 한다', () => {
    let f: Flow = { ...initFlow(1, 0), screen: 'result', since: 0, lastInput: 0 };
    f = flowClick(f, 0, 0, 5000, 1);
    expect(f.screen).toBe('result');
    for (const k of ['A', 'S', 'S', 'OK']) f = flowKey(f, k, 1000);
    expect(f.saved?.name).toBe('***');
  });
  it('봇이 세 판 연속 결과를 지나 attract 로 돌아온다', () => {
    const profile = profileByName('regular');
    const rng = mulberry32(5);
    let f = initFlow(3, 0);
    let plan: BotPlan | null = null;
    for (let now = 0; now < 400000 && f.results < 3; now += 16) {
      const r = botFrame(profile, f, plan, rng, now, 3 + f.results);
      f = flowTick(r.flow, now);
      plan = r.plan;
    }
    expect(f.results).toBe(3);
    f = flowTick(f, f.lastInput + RESULT_IDLE_S * 1000);
    expect(f.screen).toBe('board');
  });
  it('순위 화면에서 누르면 바로 새 카운트다운 판', () => {
    const f: Flow = { ...initFlow(1, 0), screen: 'board', since: 100 };
    expect(flowClick(f, 0, 0, 200, 9).screen).toBe('board');
    const g = flowClick(f, 0, 0, 800, 9);
    expect(g.screen).toBe('play');
    expect(g.game.status).toBe('countdown');
  });
});
