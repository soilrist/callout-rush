# Judge map — where each scoring criterion is proven

Rules source: official hackathon rules section 6 (checked 2026-11-21). Stage 1 is pass/fail, stage 2 has five criteria of 20% each. Video times come from `제출본/video-script.md` (draft is 126.3 s). All paths are relative to the repository root.

| # | Criterion | Evidence (file) | Video scene | Strength |
|---|---|---|---|---|
| 0 | Stage 1: fits the topic + uses JetBrains tools reasonably | `docs/jetbrains-usage.md` (counts and commands), `.idea/`, `.junie/AGENTS.md`, `app/scripts/inspect.mjs` | 1:30-1:58 | Medium. WebStorm ran 13 times as a gate; Junie and Air made 0 commits (stated openly) |
| 1 | Technological Implementation | `app/src/core/game.ts` (pure rules) + 24 test files, `docs/soak-report.md`, `docs/soak-heap.svg`, `app/scripts/zipcheck.mjs` | 1:30-1:44 and 1:44-1:58 | Strong for working code, medium for JetBrains depth |
| 2 | Design (finished product experience) | `제출본/shots/1-attract.png`, `2-play-stage1.png`, `4-result.png`, `제출본/shots/5-board.png`, `app/scripts/firstrun.mjs` (mouse-only run at two window sizes), `docs/reference/play.md` (palette) | 0:05-1:30 | Strong: one unbroken loop from attract screen to leaderboard to next round |
| 3 | Potential Impact | `제출본/devpost.md` (Inspiration: three booth problems), `docs/soak-report.md`, `제출본/shots/6-operator.png`, `제출본/shots/5-board.png` | 0:00-0:05, 1:08-1:44 | Strong: each problem answered with a number (95 s per person, offline board, 1000 rounds) |
| 4 | Quality of the Idea | `제출본/devpost.md` (What it does, Why it is different), `docs/DESIGN.md` 4.3, `제출본/shots/3-play-stage3.png` | 0:05-1:08 | Was weakest (only implied); fixed in this slice by an explicit "Why it is different" paragraph |
| 5 | Presentation | `제출본/demo-draft.mp4`, `제출본/captions.srt`, `제출본/video-script.md`, `제출본/shots/0-cover.png` | whole video | Medium: draft has game sound but no voice; the person who records must add voice and upload |

## Known gaps (not hidden)

- Junie CLI and Air have 0 commits: no API token was available. The video caption says "installed and configured" only.
- The demo video is a draft. A human must upload it and paste the link into the Devpost form.
- The raw frame interval was not measured (headless Chromium draws about 12 fps); only game work per frame (1.5 ms p95) is claimed.
