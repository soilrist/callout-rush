import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { parseParams } from './params';
import { initGame, step, type GameState } from './core/game';
import { ZONES } from './core/zones';
import { drawHud, type PastCall } from './ui/hud';
import { drawFx, labelAlphaAt, shakeOffset } from './ui/fx';
import { drawMap, stageToMap } from './ui/map';
import { profileByName, simulate } from './core/bot';
import { mulberry32 } from './core/rng';
import { botFrame, flowClick, flowKey, flowTick, initFlow, showResult, startGame, type BotPlan, type Flow } from './ui/flow';
import { RESULT_IDLE_S } from './core/config';
import { ScoreStore } from './core/scores';
import { notifyScoresUpdated } from './core/channel';
import { keyAt } from './ui/keypad';
import { accuracy, avgReaction } from './core/scoring';
import { COUNTUP_MS, countdownText, drawAttract, drawCountdown, drawResult } from './ui/screens';
import { drawBoard } from './ui/board';
import type { ScoreEntry } from './core/scores';
import { createSfx } from './audio/sfx';
import { STAGE_H, STAGE_W, fitStage, screenToStage } from './ui/stage';

const params = parseParams(window.location.search);
document.body.dataset['state'] = params.state ?? 'attract';

{
  const canvas = document.createElement('canvas');
  canvas.width = STAGE_W;
  canvas.height = STAGE_H;
  const fit = fitStage(window.innerWidth, window.innerHeight, 1);
  canvas.style.width = `${fit.width}px`;
  canvas.style.height = `${fit.height}px`;
  document.getElementById('title')?.remove();
  document.body.append(canvas);
  void document.fonts.load('700 28px "Chakra Petch"').then(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // 캡처용: 클릭 없이 `at`(ms) 까지 시계만 돌린다. 판 시작 시각 0 → 플레이는 COUNTDOWN_MS 부터.
    if (params.state === 'play' && params.at !== null) {
      drawAt(ctx, params.at, params.seed ?? 1);
      return;
    }
    startLive(canvas, ctx, params.seed ?? Date.now(), params.timescale);
  });
}

function drawAt(ctx: CanvasRenderingContext2D, at: number, seed: number): void {
  let state: GameState = initGame(seed);
  const history: PastCall[] = [];
  for (let t = 0; t <= at; t += 50) {
    const prev = state.last;
    state = step(state, { type: 'TICK', now: t });
    if (state.last !== prev && state.last) {
      const first = state.last.revealZones[0] ?? state.last.zone;
      history.push({ ok: state.last.kind === 'hit', name: ZONES.find((z) => z.id === first)?.name ?? '', rtMs: state.last.rtMs });
    }
  }
  const alpha = labelAlphaAt(state.playStartMs === null ? 0 : at - state.playStartMs);
  drawMap(ctx, { labelAlpha: alpha });
  drawFx(ctx, { last: state.last, people: 0, now: at, playStartMs: state.playStartMs });
  drawHud(ctx, { state, now: at, history });
  const cd = countdownText(at - (state.t0 ?? 0));
  if (cd && state.status === 'countdown') drawCountdown(ctx, cd);
}

/** 진짜 흐름: 대기 → 클릭 → 카운트다운 → 플레이 → 결과 → 대기. requestAnimationFrame 한 줄기가 시계를 돌린다. */
function startLive(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, seed: number, timescale: number): void {
  const clock = (): number => performance.now() * timescale;
  const t0 = clock();
  const now = (): number => clock() - t0;
  let flow: Flow = initFlow(seed, 0);
  /** 판마다 다른 시드: 시작 시드 + 지금까지 끝난 판 수 */
  const nextSeed = (): number => seed + flow.results;
  let history: PastCall[] = [];
  let people = 0;
  const bot = params.bot ? profileByName(params.bot) : null;
  const botRng = mulberry32(seed ^ 0x51ed);
  let plan: BotPlan | null = null;
  /** 결과를 지나 대기로 돌아온 횟수 (검사용) */
  let attracts = 0;
  if (params.state === 'play') flow = startGame(flow, nextSeed(), now());
  if (params.state === 'result') flow = showResult(flow, simulate(profileByName(params.bot ?? 'regular'), seed), now());

  /** 판정이 바뀌면 지난 콜 기록·인원을 갱신하고, 새 판이면 비운다 */
  const track = (prevGame: GameState, next: Flow): void => {
    if (next.game.t0 !== prevGame.t0 && next.game.score === 0 && next.game.finished === 0) history = [];
    const last = next.game.last;
    if (last !== prevGame.last && last) {
      if (last.kind === 'hit') people = prevGame.active?.call.people ?? 0;
      const first = last.revealZones[0] ?? last.zone;
      history.push({ ok: last.kind === 'hit', name: ZONES.find((z) => z.id === first)?.name ?? '', rtMs: last.rtMs });
    }
  };
  const update = (next: Flow, prev: Flow): void => {
    if (next.screen === 'play' && prev.screen !== 'play') history = [];
    else track(prev.game, next);
    flow = next;
  };

  const sfx = createSfx();
  window.addEventListener('pointerdown', () => sfx.unlock());
  /** 결과 화면 순위: 판마다 한 번 계산하고 등급이 뜰 때 소리 한 번 */
  let rankFor = -1;
  let rank = 0;
  let rankSounded = -1;
  window.addEventListener('keydown', (e) => {
    sfx.unlock();
    if (flow.screen !== 'result' || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key === 'Backspace' ? 'BACK' : e.key === 'Enter' ? 'OK' : e.key.length === 1 ? e.key : null;
    if (!k) return;
    e.preventDefault();
    update(flowKey(flow, k, now()), flow);
    saveIfNew();
    publish();
  });
  const store = new ScoreStore();
  let savedCount = 0;
  /** 방금 저장한 내 기록 (순위 화면 강조용) */
  let mine: ScoreEntry | null = null;
  /** 결과를 떠나며 정해진 이름과 판 기록을 점수 저장소에 넣는다 */
  const saveIfNew = (): void => {
    if (flow.saves === savedCount || !flow.saved) return;
    savedCount = flow.saves;
    const g = flow.saved.game;
    mine = store.add({ name: flow.saved.name, score: g.score, acc: accuracy(g.hit, g.finished), avgRt: avgReaction(g.rts) ?? 0, streak: g.bestStreak, ts: Date.now() });
    notifyScoresUpdated();
    document.body.dataset['lastName'] = flow.saved.name;
  };

  canvas.style.userSelect = 'none';
  canvas.style.touchAction = 'none';
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('dragstart', (e) => e.preventDefault());
  canvas.addEventListener('selectstart', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const fit = { scale: rect.width / STAGE_W, offsetX: rect.left, offsetY: rect.top, width: rect.width, height: rect.height, pixelWidth: STAGE_W, pixelHeight: STAGE_H };
    const p = screenToStage(fit, e.clientX, e.clientY);
    if (flow.screen === 'result') {
      const k = keyAt(p.x, p.y);
      if (k) update(flowKey(flow, k, now()), flow);
      saveIfNew();
      publish();
      return;
    }
    const m = stageToMap(p.x, p.y);
    update(flowClick(flow, m.x, m.y, now(), nextSeed()), flow);
    saveIfNew();
    publish();
  });
  // 검사용 표시: 시험이 화면·점수·연속·정답 구역·끝난 판 수를 읽는다 (화면에는 안 보임).
  const publish = (): void => {
    const d = document.body.dataset;
    const g = flow.game;
    d['screen'] = flow.screen;
    d['initials'] = flow.initials;
    d['results'] = String(flow.results);
    d['attracts'] = String(attracts);
    d['status'] = flow.screen === 'play' ? g.status : flow.screen;
    d['score'] = String(g.score);
    d['streak'] = String(g.streak);
    d['target'] = flow.screen === 'play' && g.active ? (g.active.call.zones[g.active.step] ?? '') : '';
  };
  const frame = (): void => {
    const t = now();
    const prev = flow;
    let next = flowTick(flow, t);
    if (bot) {
      const r = botFrame(bot, next, plan, botRng, t, nextSeed());
      next = r.flow;
      plan = r.plan;
    }
    if (prev.screen === 'board' && next.screen !== 'board') attracts += 1;
    update(next, prev);
    saveIfNew();
    canvas.style.cursor = flow.screen === 'play' ? 'crosshair' : 'pointer';
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    if (flow.screen === 'attract') drawAttract(ctx, t);
    else if (flow.screen === 'board') {
      const nowMs = Date.now();
      const rows = store.today(nowMs, 10);
      const myRank = mine ? store.rankToday(mine.id, nowMs) : 0;
      document.body.dataset['boardMine'] = String(myRank);
      drawBoard(ctx, { rows, myId: mine?.id ?? null, myRank, mine, now: t });
    }
    else if (flow.screen === 'result') {
      if (rankFor !== flow.results) {
        rankFor = flow.results;
        rank = store.previewRank(flow.game.score, Date.now());
        document.body.dataset['rank'] = String(rank);
      }
      if (rankSounded !== flow.results && t - flow.since >= COUNTUP_MS) {
        rankSounded = flow.results;
        sfx.play('rank');
      }
      drawResult(ctx, flow.game, t - flow.since, { rank, initials: flow.initials, pressed: flow.pressed, now: t, idleLeft: 1 - (t - flow.lastInput) / (RESULT_IDLE_S * 1000) });
    } else drawPlay(ctx, flow.game, t, history, people);
    publish();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function drawPlay(ctx: CanvasRenderingContext2D, state: GameState, t: number, history: PastCall[], people: number): void {
  const elapsed = state.playStartMs === null ? 0 : t - state.playStartMs;
  ctx.save();
  ctx.translate(shakeOffset(state.last, t), 0);
  drawMap(ctx, { labelAlpha: labelAlphaAt(elapsed) });
  drawFx(ctx, { last: state.last, people, now: t, playStartMs: state.playStartMs });
  ctx.restore();
  drawHud(ctx, { state, now: t, history });
  if (state.status === 'countdown' || elapsed < 500) {
    const cd = countdownText(t - (state.t0 ?? t));
    if (cd) drawCountdown(ctx, cd);
  }
}
