# Callout Rush — guidelines for Junie

Callout Rush is a 60-second reaction game for esports booths. A team callout such as
"North Stairs, two!" appears as text and audio; the player clicks that spot on a top-down
minimap. The result is a reaction time, an accuracy figure and a leaderboard rank.
Built for the Cloud9 x JetBrains hackathon. Design source of truth: `docs/DESIGN.md`.

## Rules
1. Write all code, comments, UI text and commit messages in English.
2. Stack: TypeScript (strict), Vite, Vitest, ESLint. App lives in `app/`. No other frameworks.
3. Game rules live in pure functions under `app/src/core/` (config, zones, calls, scoring,
   game, initials, scores, bot). No DOM, no `Date.now()`, no `Math.random()` there:
   the clock and the RNG are passed in.
4. Every file in `app/src/core/` has a sibling `*.test.ts`. Tests use their own values,
   never the balance numbers from `config.ts`.
5. Balance numbers exist only in `app/src/core/config.ts`. Never hard-code them elsewhere.
6. Input is one mouse press (`pointerdown`); judge on press, not release.
7. Do not add dependencies, network calls, accounts or analytics. The game runs offline.
8. Do not copy art, sound, names or text from any existing game.
9. Do not edit `docs/`, `loop/`, `.idea/` or `tools/`. Do not use `--no-verify`.
10. Never put API keys in files or commits.

## Before you finish
- Run `cd app && npm run check` (tsc, eslint, vitest, vite build, WebStorm inspection). It must pass.
- Commit only the files you changed, by name. Add the trailer `Tool: Junie`.
- Commit message format: `type(scope): summary`, e.g. `test(core): cover scoring edge cases`.
