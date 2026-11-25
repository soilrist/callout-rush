# JetBrains tools usage log

Honest log of what each JetBrains tool actually did in this project. Only things that really ran are listed, with numbers and commit hashes.

## Totals (recounted in M4-99, lap 83, 2026-11-25)

| Tool | Runs | Problems found | Problems fixed | Commits made by the tool |
|---|---|---|---|---|
| WebStorm headless inspection | 15 STATUS lines quote a result (upper bound, not an exact run count) | 50 warnings (2 real, 48 false positives) | 2 | n/a |
| Junie CLI | 0 | n/a | n/a | 0 |
| JetBrains Air | 0 | n/a | n/a | 0 |

How each number was counted (run from the repository root):

| Number | Command | Result |
|---|---|---|
| STATUS lines that quote an inspection result. This also counts prose lines that only mention it, so it is an upper bound for runs, not an exact count. Measured before lap 83 wrote its own entry | `git show 191932d:docs/STATUS.md \| grep -c 'INSPECT ok'` | 15 |
| Commits that name the inspection | `git log --format='%h %s' \| grep -ciE 'inspect\|webstorm'` | 3 before M4-99, 4 with the M4-99 fix commit |
| Commits made by Junie (`Tool: Junie` trailer) | `git log --format='%B' \| grep -cE '^Tool: Junie'` | 0 |
| Commits made with Air (`Tool: Air` trailer) | `git log --format='%B' \| grep -cE '^Tool: Air'` | 0 |
| Problems found / fixed | see the M2-14 and M4-99 rows in the log below (49 warnings in M2-14: 48 false positives, 1 fixed; then 1 more real warning left until lap 83, fixed in M4-99) | 50 / 2 |
| JetBrains config files tracked by git | `git ls-files .idea .junie .air \| wc -l` | 10 files (.idea 9, .junie 1), no .air folder |

Remote check: `git remote -v` prints `origin https://github.com/soilrist/callout-rush.git`; the repository is public (GitHub API `"private": false`), so `.idea` and `.junie` are public with it.

## Log

| Date | Slice | Tool | What it did | Evidence (commit / file) |
|---|---|---|---|---|
| 2026-11-21 | M0-07 | WebStorm | Headless inspection (`inspect.sh`) ran from the command line with no license or login dialog in about 12 seconds; `npm run inspect` printed `INSPECT ok: 0 errors, 5 warnings` (5 unused-function warnings found, none fixed yet). Caveat: unused local variables and unused imports were NOT reported in headless mode, so this gate catches only part of what the IDE editor shows. | `app/scripts/inspect.mjs`, commit 9ce8781 |
| 2026-11-21 | M2-14 | WebStorm | Read all 49 warnings from `npm run inspect` (49 → 0). 48 were false positives: headless mode cannot resolve imports between files, so it reported every exported constant/function (e.g. `GAME_MS`, `drawHud`) as unused although other files use them (checked with grep). Switched `JSUnusedGlobalSymbols` off in the profile, with the reason as a comment; `tsc` `noUnusedLocals` covers real unused code. The 1 real finding (`nextCall` missing the `@param rng` JSDoc line) was fixed. After: `INSPECT ok: 0 errors, 0 warnings`. | 64ed7fd |
| 2026-11-21 | M0-08 | Junie | CLI 26.11.2 (4100.11) installed with the official `install.sh` (to `~/.local/bin`); `junie --version` printed `Junie version: 26.11.2 (4100.11)`. The live task run was NOT done: `JUNIE_API_KEY` is not set (a human must create the token at junie.jetbrains.com/cli). Docs say the CLI is in Early Access; no pricing or free-quota page was found (unknown). | `.junie/AGENTS.md`, commit 029d107 |
| 2026-11-21 | M0-09 | Air | App build 262.834.70 is installed at `/Applications/Air.app`, but no command-line tool ships inside it (only the `Air` launcher in `Contents/MacOS`) and no `air` command is on PATH. Whether a `.air` folder is created is unknown (app not opened yet). Air is NOT used so far; a human run is planned at the end of M2. | `docs/DESIGN.md` section 9.1 |
| 2026-11-25 | M4-99 | WebStorm | The M2-14 "0 warnings" did not last: by lap 82 `npm run inspect` printed `INSPECT ok: 0 errors, 1 warnings` for `app/src/core/scores.ts:101` (a `throw new Error('not array')` caught by the `catch` of the same function). It stayed unnoticed until the supervisor's review of 2026-11-25 (about the 79th lap it was already there). Lap 83 restructured `load()` so a non-array value takes the same recovery path as broken JSON, with no throw, and added a unit test for it. The first rewrite still printed `1 warnings` (`parsed is possibly null`); the second rewrite (`items: unknown[] \| null`) printed `INSPECT ok: 0 errors, 0 warnings`. How the "before" record used in the video (`docs/video-evidence/inspect-before-4cae2a4.txt`) was made: only `scores.ts` was put back to its `4cae2a4` version in the main working folder and the inspection was run again. A separate clean checkout of `4cae2a4` printed 5 extra CSS warnings, so that run was not used. | `docs/video-evidence/`, commit 727b0c9 |
