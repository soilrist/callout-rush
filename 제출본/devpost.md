# Callout Rush

**Read the call. Click the spot. 60 seconds, built for a trade-show booth.**

Category 3 — Event Mini Game. Browser game, mouse only, no sound files, no images, no network after load. MIT licensed.

## Inspiration

We asked what an esports booth operator actually fights all day, and found three problems:

1. **The line does not move.** A game that takes five minutes to explain blocks the next fan.
2. **The Wi-Fi is bad.** A leaderboard on a server is a leaderboard that breaks.
3. **The machine runs all day.** A game that slows down after a few hours has to be restarted in front of the crowd.

Callout Rush answers each one with a number, and the rest of this page shows where the number comes from.

## What it does

A call such as `Tunnel, then Crane!` appears over a tactical map. The player clicks that spot before the time runs out. Hits build a streak, misses cost points. A round is 60 seconds in three stages: `WARM-UP` (zone names shown), `LIVE` (names fade out over 2 seconds, so you must know the map), and `CLUTCH` (double calls). Your score is a reaction time, not an aim test: the skill is turning a callout into a place.

The whole booth loop is built in. Attract screen, 3-2-1, round, result with grade, three initials, top 10, then `NEXT PLAYER`. From first click to the next person being able to start takes at most 95 seconds. A round that is abandoned resets itself after 12 seconds, and after 20 seconds with nobody there a demo bot plays so the screen is never dead.

Scores are saved in the browser (up to 500) and a second window, `board.html`, shows the leaderboard on a second monitor the moment a score is saved. No server is involved. An operator menu (`Ctrl+Shift+O`) has fullscreen, mute, CSV export and a two-step clear.

## Why it is different

Most reaction games show the target and test how fast your hand is. Callout Rush never shows the target: the call is a sentence, and you must know the map to turn it into a place. So the time we measure is understanding the call, finding the spot and clicking, not just aiming. From the middle of the round the zone names disappear, so the map has to be in your head, and in the last stage a call names two spots in order (`Tunnel, then Crane!`).

## How we built it — JetBrains tools

**WebStorm (headless inspection).** `npm run check` ends with a WebStorm inspection that runs from the command line with no window and no login, in about 12 seconds. It is the last gate after type check, lint, unit tests, build and browser tests (STATUS quotes its result on 15 lines; that is an upper bound, not an exact run count). It reported 50 warnings over the project. We read every one: 2 were real (a missing `@param` line in the doc comment of `nextCall`, and a `throw` caught by its own `catch` in `scores.ts` that came back as 1 warning after the first clean-up and stayed until lap 83; both fixed) and 48 were false positives, because headless mode cannot resolve imports between files and called every exported constant "unused". We switched that one inspection off with the reason written in the profile, and left unused-code checking to `tsc`. We also tested the gate by adding an unused variable on purpose and it did not report it, so we know it covers only part of what the editor shows. Evidence: `docs/jetbrains-usage.md`, `app/scripts/inspect.mjs`, `.idea/`.

**Junie CLI.** Installed (version 26.11.2) and given project rules in `.junie/AGENTS.md`. It has made 0 commits, because no API token was available to us. We did not fake a Junie slice. Evidence: `docs/jetbrains-usage.md`.

**JetBrains Air.** Installed, but it ships no command-line tool, so our loop could not drive it. 0 commits. The same log says so.

The rest of the project was written by an AI coding agent in a loop of small slices, with every claim backed by a quoted command output. The story is in `AI_SHOWCASE.md`.

## Challenges

- **A headless browser cannot measure 60 fps.** In our test machine it draws about 12 frames per second, even for an empty canvas. So we did not claim a frame-interval number. We measured how long the game's own frame code runs instead.
- **The inspection tool lies a little.** See the 48 false positives above. A gate is only useful if you know what it cannot see.
- **A leaked server process** made the first long soak run fail. The script now starts Vite directly so the process can be stopped.

## Accomplishments

A bot played 1000 rounds in a row in one browser page, with no reload (`docs/soak-report.md`):

- JS heap after forced garbage collection: 1.93 MB at round 50, 2.14 MB at round 1000, a rise of 0.21 MB.
- DOM nodes between rounds: 16, at all 20 samples.
- Errors: 0.
- Game work per frame: 1.5 ms at the 95th percentile (the budget is 20 ms).

Also 137 unit tests across 24 files, and a downloadable zip of 67.0 KB.

## What we learned

Keep the game rules a pure function and everything else gets cheap: the same bot that tunes the score numbers also drives the demo, the end-to-end test and the 1000-round run. And write down what a tool did not do. A short honest log beat a long impressive one.

## What's next

A 60-minute real-speed run on a visible browser to add the frame interval we could not measure, a run of Junie once a token is available, and more maps.

## Try it

- Play: `https://soilrist.github.io/callout-rush/` (leaderboard window: `https://soilrist.github.io/callout-rush/board.html`)
- Code: `https://github.com/soilrist/callout-rush`
- Offline: download `callout-rush-web.zip`, unzip, install Node.js 18 or newer, run `node serve.mjs`.

Booth setup in five steps:

1. Open the game in Chrome or Edge.
2. Press `Ctrl+Shift+O` for the operator menu.
3. Click `Open leaderboard window` and drag it to the second monitor.
4. Click `Fullscreen` in each window.
5. Leave it running. It resets itself between players.
