import { describe, expect, it } from 'vitest';
import { ATTRACT_DEMO_S, COUNTDOWN_MS, GAME_MS, PLAY_IDLE_QUIT_S, RESULT_BOARD_S, RESULT_IDLE_S } from '../core/config';
import { profileByName } from '../core/bot';
import { mulberry32 } from '../core/rng';
import { abandonPlay, startGame, flowKey, flowClick, flowTick, initFlow, botFrame, type BotPlan, type Flow } from './flow';

describe('screen flow', () => {
  it('a press on attract goes countdown → play → result → attract', () => {
    let f = initFlow(1, 0);
    expect(f.screen).toBe('attract');
    f = flowClick(f, 0, 0, 100, 1);
    expect(f.screen).toBe('play');
    expect(f.game.status).toBe('countdown');
    f = flowTick(f, 100 + COUNTDOWN_MS + 10);
    expect(f.game.status).toBe('play');
    f = flowClick(f, 0, 0, 100 + COUNTDOWN_MS + GAME_MS - 1000, 1); // a person presses mid-round (stops the 12 s no-input give-up)
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
  it('a new round does not inherit values from the last round', () => {
    let f = initFlow(1, 0);
    f = { ...f, game: { ...f.game, score: 999, streak: 5 } };
    f = flowClick(f, 0, 0, 10, 2);
    expect(f.game.score).toBe(0);
    expect(f.game.streak).toBe(0);
  });
  it('result screen: input within 0.6 s is ignored, 3 letters + OK saves and goes to board', () => {
    let f: Flow = { ...initFlow(1, 0), screen: 'result', since: 1000, lastInput: 1000 };
    f = flowKey(f, 'A', 1300);
    expect(f.initials).toBe('');
    for (const k of ['Z', 'E', 'D', 'X']) f = flowKey(f, k, 2000);
    expect(f.initials).toBe('ZED');
    f = flowKey(f, 'BACK', 2100);
    f = flowKey(f, 'OK', 2200);
    expect(f.screen).toBe('result'); // with 2 letters OK cannot be pressed
    f = flowKey(f, 'D', 2300);
    f = flowKey(f, 'OK', 2400);
    expect(f.screen).toBe('board');
    expect(f.saved?.name).toBe('ZED');
    expect(f.saves).toBe(1);
  });
  it('a banned initial gives ***, and a press on the result screen (flowClick) does nothing', () => {
    let f: Flow = { ...initFlow(1, 0), screen: 'result', since: 0, lastInput: 0 };
    f = flowClick(f, 0, 0, 5000, 1);
    expect(f.screen).toBe('result');
    for (const k of ['A', 'S', 'S', 'OK']) f = flowKey(f, k, 1000);
    expect(f.saved?.name).toBe('***');
  });
  it('the bot passes three results in a row and returns to attract', () => {
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
  it('a press on the rank screen goes straight to a new countdown round', () => {
    const f: Flow = { ...initFlow(1, 0), screen: 'board', since: 100 };
    expect(flowClick(f, 0, 0, 200, 9).screen).toBe('board');
    const g = flowClick(f, 0, 0, 800, 9);
    expect(g.screen).toBe('play');
    expect(g.game.status).toBe('countdown');
  });
});

describe('attract screen demo', () => {
  it('waits at 19.9 s, the demo starts at 20 s', () => {
    const f = initFlow(1, 0);
    expect(flowTick(f, ATTRACT_DEMO_S * 1000 - 1).screen).toBe('attract');
    const d = flowTick(f, ATTRACT_DEMO_S * 1000);
    expect(d.screen).toBe('play');
    expect(d.demo).toBe(true);
  });
  it('a click during the demo starts a new real countdown round', () => {
    const d = flowTick(initFlow(1, 0), ATTRACT_DEMO_S * 1000);
    const f = flowClick(d, 10, 10, ATTRACT_DEMO_S * 1000 + 500, 5);
    expect(f.demo).toBe(false);
    expect(f.screen).toBe('play');
    expect(f.game.status).toBe('countdown');
  });
  it('when the demo ends it returns to attract with no result or save, and the timer restarts from 0', () => {
    const t0 = ATTRACT_DEMO_S * 1000;
    let f = flowTick(initFlow(1, 0), t0);
    f = flowTick(f, t0 + COUNTDOWN_MS + 10);
    f = flowTick(f, t0 + COUNTDOWN_MS + GAME_MS + 10);
    expect(f.screen).toBe('attract');
    expect(f.demo).toBe(false);
    expect(f.results).toBe(0);
    expect(f.saves).toBe(0);
    expect(f.since).toBe(t0 + COUNTDOWN_MS + GAME_MS + 10);
  });
  it('a bot click during the demo does not cut the demo', () => {
    const t0 = ATTRACT_DEMO_S * 1000;
    let f = flowTick(initFlow(1, 0), t0);
    let plan: BotPlan | null = null;
    const rng = mulberry32(3);
    for (let t = t0; t < t0 + COUNTDOWN_MS + 20000; t += 50) {
      f = flowTick(f, t);
      const r = botFrame(profileByName('regular'), f, plan, rng, t, 1);
      f = r.flow;
      plan = r.plan;
    }
    expect(f.demo).toBe(true);
    expect(f.game.finished).toBeGreaterThan(0);
  });
});

describe('no input and hidden tab', () => {
  it('with no click for 12 s during play it goes to attract without saving', () => {
    const f = startGame(initFlow(1, 0), 1, 100);
    expect(flowTick(f, 100 + PLAY_IDLE_QUIT_S * 1000 - 1).screen).toBe('play');
    const g = flowTick(f, 100 + PLAY_IDLE_QUIT_S * 1000);
    expect(g.screen).toBe('attract');
    expect(g.saves).toBe(0);
    expect(g.results).toBe(0);
  });
  it('a click restarts the 12 s', () => {
    let f = startGame(initFlow(1, 0), 1, 0);
    f = flowClick(f, 5, 5, 8000, 1);
    expect(flowTick(f, 8000 + PLAY_IDLE_QUIT_S * 1000 - 1).screen).toBe('play');
  });
  it('when the tab is hidden the round is dropped (attract and result stay)', () => {
    expect(abandonPlay(startGame(initFlow(1, 0), 1, 0), 50).screen).toBe('attract');
    const r: Flow = { ...initFlow(1, 0), screen: 'result' };
    expect(abandonPlay(r, 50)).toBe(r);
  });
});
