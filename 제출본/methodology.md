# Callout Rush — Methodology

## Approach

One idea carries the whole project: **the game rules are a pure function, and one bot plays it.** The reducer in `app/src/core/game.ts` takes a state and an event and returns a new state. It touches no clock, random source or page; a seed and a clock are passed in.

That makes a single bot (`app/src/core/bot.ts`, three skill levels) useful in four places:

1. **Tests.** Unit tests replay the bot against a fixed seed (`game.test.ts`, `bot.test.ts`).
2. **Tuning the numbers.** `npm run balance -- 1000` plays 1000 rounds per skill level and prints score percentiles. Grade borders come from that output.
3. **The demo.** The same bot plays on the attract screen after 20 idle seconds.
4. **Endurance.** The soak script plays the bot for 1000 rounds in one page.

Every check uses the same code path as a real player, so a passing number means something.

## What the category asks for, and where it is

| Category 3 asks for | What we built | Evidence |
|---|---|---|
| A round under 3 minutes | 60-second round; a whole player turn (3-second countdown, round, result and initials, board) is capped at 95 seconds | `GAME_MS = 60000` and `MAX_PERSON_S = 95` in `app/src/core/config.ts`; `npm run session` plays the full loop at real speed |
| Understood at once | One mouse click, no text to read: a call such as `Tunnel, then Crane!` over a map. `WARM-UP` shows zone names, `LIVE` fades them over 2 seconds | `LABEL_FADE_MS = 2000` in `config.ts`; screenshots in `제출본/shots/` |
| Clean reset between players | Abandoned round resets after 12 seconds; 20 idle seconds start the demo bot; timers, DOM nodes and listeners return to the same count | `npm run health`: same three counts after 5 and 25 rounds; `docs/soak-report.md`: 16 DOM nodes at all 20 samples, 0 pending timers |
| Responsive | A hit flashes green within the same frame as the click; our game code takes 1.5 ms per frame at the 95th percentile (budget 20 ms) | `docs/soak-report.md`, column `work_p95_ms`; `npm run hand` captures |
| Rewards real skill | Score is reaction time turned into a place, not aiming. Bot medians: rookie 3,528, regular 6,747, pro 12,446 points, so grades separate | `docs/DESIGN.md` section 6, from `npm run balance -- 1000`; `balance.test.ts` |
| Local leaderboard, no Wi-Fi | Scores saved in the browser (cap 500); `board.html` on a second monitor updates within 1000 ms; works with the network cut | `npm run boardwin` and `npm run offline`; `MAX_SCORES = 500` in `config.ts` |

## Honest limits

- **We did not measure 60 fps.** The headless browser we had draws about 12 frames per second even for an empty canvas, so the frame interval says nothing about the game. We report only the time our own frame code runs (1.5 ms), which excludes compositing and GPU. A real-speed run on a visible browser is still to do.
- **The soak ran at 10 times clock speed**, not real time, because of the same 12 fps limit. It covers 1000 rounds. The heap rose 0.21 MB (1.93 to 2.14), which passes our 5 MB rule but not the 10% rule.
- **Bot skill is not human skill.** The bot shows grades are ordered, not that people find it fun. We ran no booth test.
- **JetBrains tools were uneven.** WebStorm's headless inspection ran 13 times and found 1 real issue and 48 false positives. Junie and Air made 0 commits (`docs/jetbrains-usage.md`).
