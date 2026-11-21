# JetBrains tools usage log

- 2026-11-21 · M0-07 · WebStorm 2026.3 (build 263.7307.202) headless inspection `inspect.sh` ran from the command line with no license or login dialog, in about 12 seconds, and printed `INSPECT ok: 0 errors, 5 warnings` through `npm run inspect` (found: 5 unused-function warnings; none fixed yet). Caveat: unused local variables and unused imports were NOT reported in headless mode, so this gate currently catches only part of what the IDE editor shows.
