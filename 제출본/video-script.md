# Callout Rush — demo video script (draft is 150 s, limit 170 s)

Language: English captions. Sound: game sound effects only, no music. Screen: real 1920x1080 browser captures (Playwright `recordVideo`, M3-04). The round in scene 2 runs at real speed (no cuts, no speed-up).

Every number below comes from a repo file; the source is in the last column.

| Time | Screen | Caption | Number source |
|---|---|---|---|
| 0:00-0:10 | Slow pan over the attract screen with `CLICK TO PLAY` blinking; then a title card with three lines. | At an esports booth the line is long, the Wi-Fi is bad, and the machine runs all day. | none |
| 0:10-1:13 | One full round, `?bot=pro&seed=7`: 3-2-1, then `WARM-UP` (labels on), `LIVE - LABELS OFF` (labels fade over 2 s), `CLUTCH - DOUBLE CALLS` (calls like `Tunnel, then Crane!`). Call text and the click point stay visible. | Read the call. Click the spot. 60 seconds, three stages: labels on, labels off, double calls. | `docs/DESIGN.md` 4.3 (stage table) |
| 1:13-1:35 | Split screen from one recording: left = the game window (result, `ENTER YOUR INITIALS` typed as A-C-E with real key presses, `OK` clicked), right = the second-monitor leaderboard window, which gets the `ACE` row at the same moment. Then the next round starts clean (3-2-1, score 0, streak 0). | Your score is a reaction time. Three initials, and your row appears on the second monitor. No server. (The other rows are sample scores.) | `docs/DESIGN.md` 3.4, 4.6; the 8 other rows are seeded sample scores |
| 1:35-1:50 | Terminal and `docs/soak-report.md` table: 1000 rounds in a row, heap graph (`soak-heap.svg`). | 1000 rounds in one page, no reload: heap +0.21 MB (1.93 to 2.14 MB), 16 DOM nodes every time, 0 errors, game work per frame 1.5 ms (p95). | `docs/soak-report.md` (Results table) |
| 1:50-2:20 | WebStorm with `.idea` open; `npm run inspect` printing `INSPECT ok: 0 errors, 0 warnings`; the usage table from `docs/jetbrains-usage.md`; `.junie/AGENTS.md`. | WebStorm's headless inspection is a gate in `npm run check`: 50 warnings read, 2 real fixes, 48 false positives switched off with a reason. Junie CLI is installed and configured. | `docs/jetbrains-usage.md` (Totals) |
| 2:20-2:30 | Closing card: demo address, repository address, `MIT License`, `Built for the Cloud9 x JetBrains hackathon`. | Free to play, MIT licensed. Open it once with Wi-Fi, then it works offline. | `LICENSE`, `docs/DESIGN.md` 4.7 |

## Notes for the person who records

- Scene 6: Junie has made 0 commits so far (`JUNIE_API_KEY` missing, see the usage log). The caption says only "installed and configured". If a Junie run happens before submission, update this line and the usage totals together.
- Scene 7: The end card shows the real addresses (soilrist.github.io/callout-rush, github.com/soilrist/callout-rush), filled in at M3-98.
- Scene 5: the soak ran at `timescale=10` in a headless browser. The caption is about heap, DOM and errors only; it does not claim a 60 fps measurement.
- Total of all scenes: 150 s. Sound: game sound effects from `sfx.json` rendered to `sfx.wav` for scenes 1-4; the document-card scenes (5-7) are silent.
