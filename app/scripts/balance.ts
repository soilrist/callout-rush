/** 3 bots × N games sim → score spread, call count, accuracy (DESIGN §6.2·§6.3). Run: npm run balance [-- games] */
import { BOT_PROFILES, simulate } from '../src/core/bot';

const games = Number(process.argv[2] ?? 1000);
const pct = (a: number[], p: number): number => a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))] ?? 0;
const med = (a: number[]): number => pct(a, 50);

const medians: Record<string, number> = {};
for (const p of BOT_PROFILES) {
  const scores: number[] = [];
  const finished: number[] = [];
  const acc: number[] = [];
  for (let seed = 1; seed <= games; seed++) {
    const s = simulate(p, seed);
    scores.push(s.score);
    finished.push(s.finished);
    acc.push(s.finished ? (s.hit / s.finished) * 100 : 0);
  }
  scores.sort((a, b) => a - b);
  finished.sort((a, b) => a - b);
  acc.sort((a, b) => a - b);
  medians[p.name] = med(scores);
  console.log(
    `${p.name}: score median ${med(scores)} / 10% ${pct(scores, 10)} / 90% ${pct(scores, 90)} / calls (target) median ${med(finished)} / accuracy median ${med(acc).toFixed(1)}%`,
  );
}
console.log(`JSON ${JSON.stringify({ games, medians })}`);
