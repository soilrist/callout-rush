# JetBrains tools usage log

Honest log of what each JetBrains tool actually did in this project. Only things that really ran are listed, with numbers and commit hashes.

## Totals (updated at the end of each milestone)

| Tool | Runs | Problems found | Problems fixed | Commits made by the tool |
|---|---|---|---|---|
| WebStorm headless inspection | 4 | 49 warnings (1 real, 48 false positives) | 1 | n/a |
| Junie CLI | 0 | n/a | n/a | 0 |
| JetBrains Air | 0 | n/a | n/a | 0 |

Last updated: M2-14 (2026-11-21).

## Log

| Date | Slice | Tool | What it did | Evidence (commit / file) |
|---|---|---|---|---|
| 2026-11-21 | M0-07 | WebStorm | Headless inspection (`inspect.sh`) ran from the command line with no license or login dialog in about 12 seconds; `npm run inspect` printed `INSPECT ok: 0 errors, 5 warnings` (5 unused-function warnings found, none fixed yet). Caveat: unused local variables and unused imports were NOT reported in headless mode, so this gate catches only part of what the IDE editor shows. | `app/scripts/inspect.mjs`, commit 9ce8781 |
| 2026-11-21 | M2-14 | WebStorm | Read all 49 warnings from `npm run inspect` (49 → 0). 48 were false positives: headless mode cannot resolve imports between files, so it reported every exported constant/function (e.g. `GAME_MS`, `drawHud`) as unused although other files use them (checked with grep). Switched `JSUnusedGlobalSymbols` off in the profile, with the reason as a comment; `tsc` `noUnusedLocals` covers real unused code. The 1 real finding (`nextCall` missing the `@param rng` JSDoc line) was fixed. After: `INSPECT ok: 0 errors, 0 warnings`. | this slice's commit |
| 2026-11-21 | M0-08 | Junie | CLI 26.11.2 (4100.11) installed with the official `install.sh` (to `~/.local/bin`); `junie --version` printed `Junie version: 26.11.2 (4100.11)`. The live task run was NOT done: `JUNIE_API_KEY` is not set (a human must create the token at junie.jetbrains.com/cli). Docs say the CLI is in Early Access; no pricing or free-quota page was found (unknown). | `.junie/AGENTS.md`, commit 029d107 |
| 2026-11-21 | M0-09 | Air | App build 262.834.70 is installed at `/Applications/Air.app`, but no command-line tool ships inside it (only the `Air` launcher in `Contents/MacOS`) and no `air` command is on PATH. Whether a `.air` folder is created is unknown (app not opened yet). Air is NOT used so far; a human run is planned at the end of M2. | `docs/DESIGN.md` section 9.1 |
