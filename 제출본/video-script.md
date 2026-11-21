# Callout Rush — demo video script (target 160 s, limit 170 s)

Language: English captions. Sound: game sound effects only, no music. Screen: real 1920x1080 browser captures (Playwright `recordVideo`, M3-04). The round in scene 2 runs at real speed (no cuts, no speed-up).

Every number below comes from a repo file; the source is in the last column.

| Time | Screen | Caption | Number source |
|---|---|---|---|
| 0:00-0:10 | Slow pan over the attract screen with `CLICK TO PLAY` blinking; then a title card with three lines. | At an esports booth the line is long, the Wi-Fi is bad, and the machine runs all day. | none |
| 0:10-1:15 | One full round, `?bot=pro&seed=7`: 3-2-1, then `WARM-UP` (labels on), `LIVE - LABELS OFF` (labels fade over 2 s), `CLUTCH - DOUBLE CALLS` (calls like `Tunnel, then Crane!`). Call text and the click point stay visible. | Read the call. Click the spot. 60 seconds, three stages: labels on, labels off, double calls. | `docs/DESIGN.md` 4.3 (stage table) |
| 1:15-1:35 | Result screen (score, average reaction, accuracy, best streak, grade), then `ENTER YOUR INITIALS`, then the top 10 with the new row highlighted. Split screen: the second-monitor leaderboard window updates at the same moment. | Your score is a reaction time. Three initials, and your row appears on the second monitor. No server. | `docs/DESIGN.md` 3.4, 4.6 |
| 1:35-1:45 | `NEXT PLAYER - CLICK TO PLAY`, then the attract screen; after 20 s of no input the demo bot starts (`DEMO` badge). | The next player gets a clean round, with nothing left over from the last one. | `docs/DESIGN.md` 4.7 |
| 1:45-2:00 | Terminal and `docs/soak-report.md` table: 1000 rounds in a row, heap graph (`soak-heap.svg`). | 1000 rounds in one page, no reload: heap +0.21 MB (1.93 to 2.14 MB), 16 DOM nodes every time, 0 errors, game work per frame 1.5 ms (p95). | `docs/soak-report.md` (Results table) |
| 2:00-2:30 | WebStorm with `.idea` open; `npm run inspect` printing `INSPECT ok: 0 errors, 0 warnings`; the usage table from `docs/jetbrains-usage.md`; `.junie/AGENTS.md`. | WebStorm's headless inspection is a gate in `npm run check`: 13 runs, 49 warnings read, 1 real fix, 48 false positives switched off with a reason. Junie CLI is installed and configured. | `docs/jetbrains-usage.md` (Totals) |
| 2:30-2:40 | Closing card: demo address, repository address, `MIT License`, `Built for the Cloud9 x JetBrains hackathon`. | Free to play, MIT licensed. Open it once with Wi-Fi, then it works offline. | `LICENSE`, `docs/DESIGN.md` 4.7 |

## Notes for the person who records

- Scene 6: Junie has made 0 commits so far (`JUNIE_API_KEY` missing, see the usage log). The caption says only "installed and configured". If a Junie run happens before submission, update this line and the usage totals together.
- Scene 7: `<DEMO_URL>` and `<REPO_URL>` are placeholders until the repository is public (M2-16 / M3-10). Do not publish the video with the placeholders.
- Scene 5: the soak ran at `timescale=10` in a headless browser. The caption is about heap, DOM and errors only; it does not claim a 60 fps measurement.
- Total of all scenes: 160 s (check below).
